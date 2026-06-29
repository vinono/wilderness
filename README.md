# DeepFocus Space (沉浸专注空间)

这是一个高端的沉浸式专注与盒式呼吸训练空间，支持两端独立演进：

## 项目结构说明

* **`/web`**：[Web 前端沉浸式专注应用](./web)。基于 Vite + React + TailwindCSS 开发，支持一键部署到 GitHub Pages。
* **`/macos`**：[macOS SwiftUI 原生专注应用](./macos)。基于 Swift + SwiftUI 原生开发，集成 AVAudioEngine 与 SpriteKit 天气粒子引擎。

## 开发与运行指南

### Web 网页版
1. 进入 `web` 目录。
2. 运行 `pnpm install` 安装依赖。
3. 运行 `pnpm run dev` 启动本地开发服务，或运行 `pnpm run deploy` 编译并一键上线到 GitHub Pages。

### macOS 原生 App 版
1. 进入 `macos` 目录。
2. 使用 Xcode 打开项目或双击运行 `macos` 目录下的 Swift 命令行工程进行单元测试。
