import json
import os
import requests
import hashlib
from urllib.parse import urlparse
import argparse


def safe_filename(url, mime_type=""):
    """
    将 URL 转换成安全的本地文件名（避免冲突和非法字符）
    """
    parsed = urlparse(url)
    # 取 URL 路径的最后一段作为文件名（没有就用 index）
    filename = os.path.basename(parsed.path) or "index"

    # 如果内容类型是 HTML 且原始扩展名不是 .html 或 .htm，则强制使用 .html
    base, ext = os.path.splitext(filename)
    if 'text/html' in mime_type.lower() and ext.lower() not in ['.html', '.htm']:
        ext = '.html'

    # # 加 hash 避免重名冲突
    # hash_suffix = hashlib.md5(url.encode()).hexdigest()[:8]
    # return f"{base}_{hash_suffix}{ext}" if ext else f"{base}_{hash_suffix}"
    return f"{base}{ext}" if ext else base

def download_file(url, filepath, timeout=10):
    """
    下载单个文件到本地
    """
    try:
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        resp = requests.get(url, timeout=timeout, stream=True)
        resp.raise_for_status()
        with open(filepath, "wb") as f:
            for chunk in resp.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"✅ {url} -> {filepath}")
        return filepath
    except Exception as e:
        print(f"❌ 下载失败: {url} ({e})")
        return None

def extract_from_har(har_file, project_dir, mapping_file, timeout=10):
    """从 HAR 文件提取入口 URL 和所有请求 URL。通常，第一个请求是页面的主入口。"""
    with open(har_file, "r", encoding="utf-8") as f:
        har_data = json.load(f)

    entries = har_data.get("log", {}).get("entries", [])

    # 没有通过 --out 指定目录
    if project_dir is None:
        # 使用har文件名作为项目名
        base_name = os.path.splitext(os.path.basename(har_file))[0]
        project_dir = os.path.join("projects", base_name)
        print(f"输出目录未指定，将使用默认目录名: {project_dir}")
    else:
        print(f"将使用指定输出目录: {project_dir}")

    # 创建资源目录
    os.makedirs(project_dir, exist_ok=True)
    assets_dir = os.path.join(project_dir, "assets")
    os.makedirs(assets_dir, exist_ok=True)

    api_mocks_dir = os.path.join(project_dir, "api_mocks")
    os.makedirs(api_mocks_dir, exist_ok=True)

    output_data = {
        "entry_point":{
            "origin": None,
            "local_file": None
        },
        "url_mapping": {}
    }

    entry_point_url = entries[0]["request"]["url"]

    method_priority = {
        'GET': 1,
        'POST': 2,
        'PUT': 3,
        'PATCH': 3,
        'DELETE': 3,
        'HEAD': 4,
        'OPTIONS': 5,
    }
    unique_entries_map = {}

    # 去重
    for entry in entries:
        url = entry["request"]["url"]
        method = entry.get("request", {}).get("method", "GET").upper()
        current_priority = method_priority.get(method, 99)  # 获取当前方法的优先级，未知方法优先级最低
        if url not in unique_entries_map:
            # 如果是第一次遇到这个URL，直接添加
            unique_entries_map[url] = entry
        else:
            # 如果已经存在，比较优先级
            existing_entry = unique_entries_map[url]
            existing_method = existing_entry.get("request", {}).get("method", "GET").upper()
            existing_priority = method_priority.get(existing_method, 99)

            # 如果当前条目的优先级更高（数值更小），就替换掉旧的
            if current_priority < existing_priority:
                unique_entries_map[url] = entry

    used_filenames = set()

    for url, entry in unique_entries_map.items():
        request = entry.get("request", {})
        method = request.get("method", "GET").upper()
        response_content_info = entry.get("response", {}).get("content", {})
        mime_type = response_content_info.get("mimeType", "")

        is_json_api = 'application/json' in mime_type.lower()

        if method == "GET" and not is_json_api:
            mime_type = entry.get("response", {}).get("content", {}).get("mimeType", "")

            filename = safe_filename(url, mime_type)
            filepath = os.path.join(assets_dir, filename)

            # 如果冲突，则为当前文件添加哈希
            if filepath in used_filenames:
                base, ext = os.path.splitext(filename)
                hash_suffix = hashlib.md5(url.encode()).hexdigest()[:8]
                filename = f"{base}_{hash_suffix}{ext}"
                filepath = os.path.join(assets_dir, filename)
            used_filenames.add(filepath)

            if download_file(url, filepath, timeout):
                relative_path = os.path.relpath(filepath, project_dir)
                output_data["url_mapping"][url] = {
                    "method": "GET",
                    "local_file": relative_path
                }

                if url == entry_point_url:
                    output_data["entry_point"]["origin"] = url
                    output_data["entry_point"]["local_file"] = relative_path
        elif method == 'POST' or (is_json_api and method == 'GET'):
            response_content = entry.get("response", {}).get("content", {}).get("text", "")
            mime_info = "[POST]" if method == 'POST' else "[GET API]"
            # 如果响应内容为空，则跳过
            if not response_content:
                print(f"⏩ {mime_info} 跳过空响应请求: {url}")
                continue

            # 为POST响应创建一个安全的文件名
            parsed_path = urlparse(url).path.strip('/')
            mock_filename = f"{parsed_path.replace('/', '_')}_{hashlib.md5(url.encode()).hexdigest()[:8]}.json"
            mock_filepath = os.path.join(api_mocks_dir, mock_filename)
            try:
                # 检查响应是否为有效的JSON
                json.loads(response_content)
                with open(mock_filepath, "w", encoding="utf-8") as f:
                    f.write(response_content)

                relative_path = os.path.relpath(mock_filepath, project_dir)
                output_data["url_mapping"][url] = {
                    "method": method,
                    "local_file": relative_path
                }
                print(f"✅ {mime_info} 响应已保存: {url} -> {mock_filepath}")
            except (json.JSONDecodeError, TypeError):
                print(f"❌ {mime_info} 响应不是有效的JSON，已跳过: {url}")

    # 保存映射表
    mapping_path = os.path.join(project_dir, mapping_file)
    with open(mapping_path, "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print(f"\n映射表已保存到 {mapping_path}")
    if output_data["entry_point"]["origin"]:
        print(f"网页入口 URL: {output_data['entry_point']['origin']}")
        print(f"对应本地文件: {output_data['entry_point']['local_file']}")
    else:
        print("⚠️ 未能成功下载并标识网页入口文件。")

def main():
    parser = argparse.ArgumentParser(
        description="从 HAR 文件提取资源并生成本地映射")
    parser.add_argument("har_file", help="HAR 文件路径")
    parser.add_argument("--out", help="指定输出的项目目录。如果未提供，将根据har文件名在 'projects/' 目录下自动创建。")
    # parser.add_argument("--map", default="url_mapping.json", help="映射文件名 (默认: url_mapping.json)")
    parser.add_argument("--timeout", type=int, default=10, help="请求超时时间 (秒)")
    args = parser.parse_args()

    # extract_from_har(har_file=args.har_file, project_dir=args.out, mapping_file=args.map, timeout=args.timeout)
    extract_from_har(har_file=args.har_file, project_dir=args.out, mapping_file="url_mapping.json", timeout=args.timeout)

if __name__ == "__main__":
    main()
