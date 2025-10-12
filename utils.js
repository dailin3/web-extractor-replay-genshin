const IGNORE_MISMATCH_PARAMS = [
    "timestamp",
    "authkey",
    "auth_appid",
    "sign_type",
    "authkey_ver",
    "game_version",
    "device_type",
    "_v", // 常见的版本或缓存参数
    "t"   // 常见的时间戳参数
];

/**
 * 匹配逻辑：
 * 1. 基础路径 (pathname) 必须完全相同。
 * 2. 忽略 IGNORE_MISMATCH_PARAMS 列表中的参数。
 * 3. 检查 HAR 规则中的每一个“关键参数”是否都在浏览器请求中存在，且值完全相等。
 * 4. 只有当所有关键参数都完美匹配时，才返回该规则。
 *
 * @param {string} requestUrl - 浏览器发出的完整请求URL。
 * @param {object} mapping - 从 url_mapping.json 读取的映射对象。
 * @returns {object|null} - 返回唯一匹配的映射信息对象，或者 null。
 */
function findBestMatch(requestUrl, mapping) {
    try {
        const requestUrlObj = new URL(requestUrl);
        const requestBasePath = requestUrlObj.pathname;
        const requestParams = requestUrlObj.searchParams;

        // 遍历所有映射规则，寻找第一个完全匹配的规则
        for (const mappedUrl in mapping) {
            try {
                const mappedUrlObj = new URL(mappedUrl);

                // 1. 基础路径必须匹配
                if (requestBasePath !== mappedUrlObj.pathname) {
                    continue;
                }

                const mappedParams = mappedUrlObj.searchParams;

                // 2. 提取出 HAR 规则中的“关键参数”
                const criticalMappedParams = [];
                for (const [key, value] of mappedParams.entries()) {
                    if (!IGNORE_MISMATCH_PARAMS.includes(key)) {
                        criticalMappedParams.push({ key, value });
                    }
                }

                // 3. 检查每一个“关键参数”是否都在请求中完美匹配
                const isPerfectMatch = criticalMappedParams.every(param =>
                    requestParams.has(param.key) && requestParams.get(param.key) === param.value
                );

                // 4. 如果所有关键参数都匹配，我们找到了！
                if (isPerfectMatch) {
                    // 为了处理一种特殊情况：如果请求有额外的关键参数，怎么办？
                    // 我们可以增加一个反向检查，但这通常会让系统过于严格。
                    // 目前的逻辑更灵活，它允许请求中有多余的、未知的参数。
                    return { ...mapping[mappedUrl], originalUrl: mappedUrl };
                }

            } catch (e) { /* 忽略无法解析的URL */ }
        }

    } catch (e) {
        console.error(`[findBestMatch] 无法解析请求的URL: ${requestUrl}`, e);
    }

    // 如果循环结束都没有找到完美匹配，则返回 null
    return null;
}

module.exports = {
    findBestMatch
};