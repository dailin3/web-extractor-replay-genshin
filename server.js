const fs = require("fs");
const path = require("path");
const express = require("express");
const { spawn } = require("child_process");
const { Command } = require("commander");
const Proxy = require("http-mitm-proxy").Proxy;

const specialRules = require('./special_rules');
const { findBestMatch } = require('./utils')


// 命令行参数解析
const program = new Command();
program
    .description("Run a local proxy server with HAR resource mapping")
    .requiredOption("-d, --project-dir <path>", "项目目录")
    .option("-c, --config <path>", "配置文件路径", "config.json")
    .option("-k, --no-ignore-cert-errors", "启动浏览器时，不忽略证书错误。默认忽略。（注意!该选项可能导致浏览器无法连接代理。）")
    .option("-i, --incognito", "使用无痕模式启动浏览器")
program.parse(process.argv);
const options = program.opts();

// 读取配置文件
let config = {}
if (fs.existsSync(options.config)) {
    config = JSON.parse(fs.readFileSync(options.config, "utf-8"));
}

const PROXY_PORT = config.server.proxyPort || 3000;
const WEB_PORT = config.server.webPort || 3001;
const projectDir = options.projectDir;

const BROWSER_ORIGIN = `http://127.0.0.1:${WEB_PORT}`;

const autoLaunch = config.browser.autoLaunch;
const executablePath = config.browser.executablePath;

let shouldIgnoreCertErrors;
// 命令行优先级更高
if (options.ignoreCertErrors === false) {
    shouldIgnoreCertErrors = false;
    console.info("ℹ️ 根据命令行参数，浏览器将校验 SSL 证书。")
} else {
    // 配置文件
    shouldIgnoreCertErrors = config.browser?.ignoreCertificateErrors ?? true;
}

// 读取映射表
const mappingPath = path.join(projectDir, "url_mapping.json");
if (!fs.existsSync(mappingPath)) {
  console.error("❌ 找不到映射文件 url_mapping.json，请先运行 Python HAR 下载脚本！");
  process.exit(1);
}
const mapping_json = JSON.parse(fs.readFileSync(mappingPath, "utf-8"));
const urlMapping = mapping_json.url_mapping;
const entryPoint = mapping_json.entry_point;

// ==========================================================
// 创建并配置 MITM 代理服务器
// ==========================================================
const proxy = new Proxy();

proxy.sslCaDir = config.server.sslCaDir;
proxy.sslCaKeyFile = path.join(proxy.sslCaDir, "ca.key");
proxy.sslCaCertFile = path.join(proxy.sslCaDir, "ca.crt");

const spoofHeaders = config.proxyRules.spoofHeaders

proxy.onError((ctx, err) =>{
    console.error("⚠️ 代理出错:", err);
});

//拦截HTTP/HTTPS请求
proxy.onRequest((ctx, callback)=> {
    console.log('------------------------------------------------');
    const fullUrl = ctx.isSSL
        ? `https://${ctx.clientToProxyRequest.headers.host}${ctx.clientToProxyRequest.url}`
        : `http://${ctx.clientToProxyRequest.headers.host}${ctx.clientToProxyRequest.url}`;

    console.log(`📡 请求: ${fullUrl}`);

    // 处理CORS预检
    if (ctx.clientToProxyRequest.method.toUpperCase() === 'OPTIONS') {
        // if (urlMapping[fullUrl]) {
        if (1) {
            console.log(`✅ 命中CORS预检(OPTIONS)，直接响应`);

            // 直接返回成功的响应和CORS头
            ctx.proxyToClientResponse.writeHead(204, { // 204 No Content 是处理OPTIONS的常用状态码
                'Access-Control-Allow-Origin': ctx.clientToProxyRequest.headers["origin"] || "*",
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', // 允许所有常用方法
                'Access-Control-Allow-Headers': ctx.clientToProxyRequest.headers['access-control-request-headers'] || '*', // 允许浏览器请求的所有头
                'Access-Control-Max-Age': 86400, // 预检请求的缓存时间（秒）
                'Content-Length': '0'
            });
            ctx.proxyToClientResponse.end();
            return; // 必须 return，中断后续处理
        }
    }

    // 特殊规则
    for (const rule of specialRules) {
        if (rule.test(fullUrl)) {
            console.log(`✅ [规则命中] 触发特殊规则: "${rule.name}"`);
            rule.handler(ctx);
            return;
        }
    }

    // 通用映射规则
    if (fullUrl.startsWith('https://act-hk4e-api.mihoyo.com/event/e20250829return/index')) {
        console.log('DEBUG')
    }
    const mappingInfo = findBestMatch(fullUrl, urlMapping);
    if (mappingInfo) {
        console.log(`✅ 本地命中 (通过灵活匹配): ${fullUrl}`);
        console.log(`   -> 匹配规则: ${mappingInfo.originalUrl}`);
        // 命中本地资源
        const requestMethod = ctx.clientToProxyRequest.method.toUpperCase();
        const mappingMethod = mappingInfo.method.toUpperCase();

        if (requestMethod === mappingMethod) {
            const localFilePath = path.join(projectDir, mappingInfo.local_file);
            if (fs.existsSync(localFilePath)) {
                console.log(`✅ 本地命中: ${fullUrl}`);
                const fileStream = fs.createReadStream(localFilePath);

                const headers = {
                    "Access-Control-Allow-Credentials": "true",
                    'Access-Control-Allow-Origin': ctx.clientToProxyRequest.headers["origin"] || "*",
                    // 'Access-Control-Allow-Methods': 'GET, OPTIONS',
                    'Access-Control-Allow-Headers': '*',
                };

                if (requestMethod === 'POST' && path.extname(localFilePath).toLowerCase() === '.json') {
                    headers['Content-Type'] = 'application/json; charset=utf-8';
                }

                ctx.proxyToClientResponse.writeHead(200, headers);
                fileStream.pipe(ctx.proxyToClientResponse);
                return;
            }
            else {
                console.warn(`⚠️  映射命中但本地文件不存在: ${localFilePath}`);
            }
        }
        else {
            console.log(`ℹ️  URL命中但方法不匹配: 请求为 ${requestMethod}, 映射要求为 ${mappingMethod}。将回源。`);
        }
    }

    // 未命中，如果是需要回源到指定域名下的请求，就伪装它的 Origin 和 Referer
    if (!mappingInfo && spoofHeaders.enabled){
        const shouldSpoof = spoofHeaders.targetDomains.some(domain => fullUrl.includes(domain));
        if (shouldSpoof){
            // 修改 Origin 和 Referer 头，让服务器以为是合法来源
            let fakeOrigin;
            if (spoofHeaders.fakeOrigin === "auto"){
                fakeOrigin = entryPoint.origin;
            }
            else{
                fakeOrigin = spoofHeaders.fakeOrigin;
            }
            ctx.clientToProxyRequest.headers['origin'] = fakeOrigin;
            ctx.clientToProxyRequest.headers['referer'] = `${fakeOrigin}/`;
        }
    }

    // 未命中 → 回源
    console.log(`🌐 回源: ${fullUrl}`);
    return callback();
});

// 拦截服务器响应，并添加 CORS 头
proxy.onResponse((ctx, callback) => {

    if (ctx.serverToProxyResponse) {
        const headers = ctx.serverToProxyResponse.headers;

        // 以不区分大小写的方式，寻找并删除任何形式的 'Access-Control-Allow-Origin'以及其他字段
        const corsHeadersToOverwrite = [
            'access-control-allow-origin',
            'access-control-allow-credentials'
        ];

        for (const headerToOverwrite of corsHeadersToOverwrite){
            const headerKeyToDelete = Object.keys(headers).find(
                key => key.toLowerCase() === headerToOverwrite
            )
            if (headerKeyToDelete) {
                delete headers[headerKeyToDelete]
            }
        }

        // 设置 CORS 相关的头部
        headers['Access-Control-Allow-Origin'] = BROWSER_ORIGIN;
        headers['Access-Control-Allow-Credentials'] = 'true';
        // headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        headers['Access-Control-Allow-Headers'] = '*';
    }

    return callback();
});

// ==========================================================
// 创建并配置 Express Web 服务器
// ==========================================================
// const app = express();
// // 中间件，处理相对路径
// app.use((req, res, next) => {
//     const requestedPath = decodeURIComponent(req.url);
//     const requester = req.headers.referer || 'Unknown (Direct Request)';
//     console.log(`[Web Server] Request for: ${requestedPath} | From: ${requester}`);
//     const matches = [];
//
//     // 遍历映射表中的所有原始 URL
//     for (const originalUrl in urlMapping) {
//         try {
//             const parsedUrl = new URL(originalUrl);
//             // 比较路径部分是否与当前请求的路径匹配
//             let parts = requestedPath.split('/')
//             let filtered_parts = parts.filter(part => part !== 'assets');
//             if (originalUrl === requestedPath || (requestedPath.startsWith("/assets") && originalUrl.endsWith(filtered_parts.join('/')))) {
//                 if (urlMapping[originalUrl].method.toUpperCase() === 'GET'){
//                     matches.push(urlMapping[originalUrl].local_file);
//                 }
//             }
//         } catch (e) {
//             // 忽略无法解析的 URL
//         }
//     }
//
//     // 如果且仅如果找到一个唯一的匹配项
//     if (matches.length === 1) {
//         const localFile = matches[0];
//         const fullPath = path.resolve(projectDir, localFile);
//
//         if (fs.existsSync(fullPath)) {
//             console.log(`✅ [Web Server] 动态命中: ${req.url} -> ${localFile}`);
//             // 直接发送文件，Express 会自动设置正确的 Content-Type
//             return res.sendFile(fullPath);
//         }
//     }
//
//     // 如果没有找到或找到多个匹配项，则交给下一个中间件处理
//     if (matches.length > 1) {
//         console.warn(`⚠️ [Web Server] 发现模糊匹配: ${req.path} 有 ${matches.length} 个可能的本地文件。`);
//     }
//
//     next();
// });
// app.use(express.static(projectDir));

// ==========================================================
// 启动所有服务和浏览器
// ==========================================================
function launchBrowser(){
    if (!autoLaunch){
        console.info("ℹ️ 自动启动浏览器已禁用。请手动配置代理并打开网页。");
        return;
    }

    if (!executablePath || !fs.existsSync(executablePath)){
        console.warn(`⚠️ 浏览器路径未配置或无效: "${executablePath}"`);
        console.warn("   请在 config.json 中设置正确的 browser.executablePath，或禁用 autoLaunch。");
        return;
    }

    console.log("📂 即将启动独立 Edge 浏览器...");

    const tempProfileDir = path.join(__dirname, "edge-temp-profile");

    // 创建临时配置目录（如果不存在）
    if (!fs.existsSync(tempProfileDir)) {
        fs.mkdirSync(tempProfileDir);
    }

    // const entryPointFile = entryPoint.local_file;
    // const startUrl = `${BROWSER_ORIGIN}/${entryPointFile}`;

    const startUrl = entryPoint.origin;

    const browserArgs = [
        `--user-data-dir=${tempProfileDir}`,
        `--proxy-server=127.0.0.1:${PROXY_PORT}`,
        // "--ignore-certificate-errors",
        "--no-first-run",
        "--no-default-browser-check",
    ];
    if (shouldIgnoreCertErrors) {
        browserArgs.push("--ignore-certificate-errors");
        console.info("ℹ️ 浏览器将忽略 SSL 证书错误。");
    }
    if (options.incognito) {
        browserArgs.push("--inprivate");
        console.info("ℹ️ 浏览器将以无痕模式启动。");
    }

    browserArgs.push(startUrl);

    spawn(executablePath, browserArgs, { detached: true, stdio: "ignore" });
}

// proxy.listen({port: PROXY_PORT, host: '127.0.0.1'}, () => {
//     console.log(`🚀 MITM 代理启动中: http://127.0.0.1:${PROXY_PORT}`);
//
//     app.listen(WEB_PORT, () => {
//         console.log(`🚀 本地 Web 服务器启动于: ${BROWSER_ORIGIN}`);
//         console.log(`📂 项目 "${projectDir}" 的内容已托管。`);
//
//         launchBrowser();
//     });
// });
proxy.listen({port: PROXY_PORT,host: '127.0.0.1'},() => {
    console.log(`🚀 MITM 代理启动中: http://127.0.0.1:${PROXY_PORT}`);
    console.log(`📂 本地资源目录: "${projectDir}"`);

    launchBrowser();
});
