const fs = require('fs');
const path = require('path');

// 所有特殊处理规则都定义在这里
const rules = [
    {
        name: "Mihoyo Badge Login API",
        // test 函数接收完整的请求 URL，如果匹配成功则返回 true
        test: (fullUrl) => {
            // const specialApiUrlBase = 'https://api-takumi.mihoyo.com/common/badge/v1/login/info';
            const specialApiUrlBase = 'https://api-takumi.mihoyo.com/common/badge/v1/login/';
            return fullUrl.startsWith(specialApiUrlBase);
        },
        // handler 函数负责处理匹配成功后的请求
        // 它接收 http-mitm-proxy 的 context 对象 (ctx)
        handler: (ctx) => {
            console.log(`ℹ️  检测到特殊API请求，将忽略参数进行匹配: ${ctx.clientToProxyRequest.url}`);
            const localFilePath = path.join(__dirname, "account.json"); // 假设 account.json 在根目录

            if (fs.existsSync(localFilePath)) {
                const fileStream = fs.createReadStream(localFilePath);
                const headers = {
                    "Access-Control-Allow-Credentials": "true",
                    'Access-Control-Allow-Origin': ctx.clientToProxyRequest.headers["origin"] || "*",
                    'Access-Control-Allow-Headers': '*',
                    'Content-Type': 'application/json; charset=utf-8'
                };
                ctx.proxyToClientResponse.writeHead(200, headers);
                fileStream.pipe(ctx.proxyToClientResponse);
            } else {
                 console.warn(`⚠️  特殊API映射命中但本地文件不存在: ${localFilePath}`);
            }
        }
    },
    {
        name: "Mihoyo NodKrai Site",
        test: (fullUrl) => {
            const special2Pattern = new RegExp('^https://hk4e-api\\.mihoyo\\.com/event/merlin_v2/v3/flow/run/hk4e_cn/e20250723nodkrai/\\d+\\?.*');
            return special2Pattern.test(fullUrl);
        },
        handler: (ctx) => {
            const localFilePath = path.join(__dirname, "login-response.json");
            if (fs.existsSync(localFilePath)) {
                const fileStream = fs.createReadStream(localFilePath);
                 const headers = {
                    "Access-Control-Allow-Credentials": "true",
                    'Access-Control-Allow-Origin': ctx.clientToProxyRequest.headers["origin"] || "*",
                    'Access-Control-Allow-Headers': '*',
                    'Content-Type': 'application/json; charset=utf-8'
                };
                ctx.proxyToClientResponse.writeHead(200, headers);
                fileStream.pipe(ctx.proxyToClientResponse);
            }
        }
    },
    {
        name: "Mihoyo Phone Event",
        test: (fullUrl) => {
            const special3Pattern = new RegExp('^https://act-hk4e-api\\.mihoyo\\.com/event/e20250818phone/index\\?.*$');
            return special3Pattern.test(fullUrl);
        },
        handler: (ctx) => {
            const localFilePath = path.join(__dirname, "login2.json");
            if (fs.existsSync(localFilePath)) {
                const fileStream = fs.createReadStream(localFilePath);
                const headers = {
                    "Access-Control-Allow-Credentials": "true",
                    'Access-Control-Allow-Origin': ctx.clientToProxyRequest.headers["origin"] || "*",
                    'Access-Control-Allow-Headers': '*',
                    'Content-Type': 'application/json; charset=utf-8'
                };
                ctx.proxyToClientResponse.writeHead(200, headers);
                fileStream.pipe(ctx.proxyToClientResponse);
            }
        }
    }
    // ... 如果有更多规则，继续在这里添加 ...
];

// 导出规则数组
module.exports = rules;