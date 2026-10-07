@echo off
setlocal

:: 检查是否提供了 HAR 文件参数
if [%1]==[] (
    echo.
    echo  错误: 请提供 HAR 文件的路径作为参数。
    echo.
    echo  用法: run.bat "C:\path\to\your\file.har"
    echo.
    exit /b 1
)

:: 从 HAR 文件完整路径中提取文件名 (不含扩展名)
for %%F in ("%1") do set HAR_FILENAME=%%~nF

:: 定义项目目录 (例如：projects\your_file)
set PROJECT_DIR=projects\%HAR_FILENAME%

echo.
echo ==========================================================
echo  步骤 1: 使用 har_extractor.py 处理 HAR 文件
echo ==========================================================
echo  HAR 文件: %1
echo  输出目录: %PROJECT_DIR%
echo.

:: 调用 Python 脚本
:: --out 参数指定了输出目录
python har_extractor.py "%1" --out "%PROJECT_DIR%"

:: 检查 Python 脚本的执行结果
if %errorlevel% neq 0 (
    echo.
    echo  ❌ 错误: har_extractor.py 执行失败。请检查错误信息。
    echo.
    exit /b %errorlevel%
)

echo.
echo ✅ HAR 文件处理完成，项目已创建在 "%PROJECT_DIR%"
echo.
echo ==========================================================
echo  步骤 2: 启动本地代理和 Web 服务器
echo ==========================================================
echo.

:: 调用 Node.js 脚本
:: -d 参数指定了项目目录
call node server.js -d "%PROJECT_DIR%"

endlocal