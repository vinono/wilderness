# 🌲 DeepFocus Space (瑞士荒野 · 沉浸式专注空间)

`DeepFocus Space` 是一款基于 React 19 + TypeScript + Vite + TailwindCSS 打造的**高端纯前端沉浸式专注力工具**。它将清新的自然场景视频、多轨可调节环境白噪音、科学的盒式呼吸法（Box Breathing）以及极简的待办事项结合在一起，旨在为开发者、创作者及需要高度专注的人群提供一个优雅、无干扰的数字净土。

---

## ✨ 核心特性

1. **🎬 沉浸式动态场景**
   - 精选 4 套高画质自然背景视频（*瑞士荒野、荒林别墅、神秘溶洞、东方禅意*）。
   - 运用 CSS 变量在场景切换时动态改变应用的 **HSL 主题色**，实现呼吸灯、按钮与焦点圆环的色彩自适应联动。
   - 支持**双击屏幕空白处**或一键切换“全屏沉浸模式”，隐藏所有次要面板，仅保留时间与呼吸环，提供极致的无干扰体验。

2. **🎛️ 多轨环境混音器 (Mixer)**
   - 包含 6 个独立音轨：*轻音乐 (BGM)、细雨、林风、营火、溪流、鸟鸣*。
   - 支持对单个音轨进行**独立音量微调 (0~100%)** 与**静音开关**控制，随心调配专属的白噪音氛围。

3. **🧘 盒式呼吸引导 (Box Breathing)**
   - 内置科学的 **4-4-4-4 盒式呼吸法** 引导机制（4s 吸气 $\rightarrow$ 4s 憋气 $\rightarrow$ 4s 呼气 $\rightarrow$ 4s 静息循环）。
   - 外圈圆环配合呼吸节奏进行平滑缩放与光晕强弱渐变，帮助快速平复心率与焦虑。

4. **⏱️ 双模式专注计时器**
   - **番茄钟模式**：预设 25 MIN / 50 MIN 倒计时，专注结束后通过 Web Audio API 合成清脆悦耳的 “DING” 提示音，避免繁重的第三方音频加载。
   - **正向秒表模式**：用于累计记录工作时间，方便心流状态下的无感计时。

5. **📋 专注待办便签 (TodoList)**
   - 随手记录当前阶段需要攻克的任务，勾选即时完成，支持任务删除。
   - 状态数据完全持久化至本地 `localStorage`，刷新不丢失。

---

## 🛠️ 技术栈与架构

- **核心框架**：React 19 (Hooks / Refs / Context)
- **开发语言**：TypeScript (TSConfig 严格类型约束)
- **构建工具**：Vite 8.x (极致的 HMR 热更新与打包速度)
- **样式方案**：TailwindCSS v3 + CSS 变量动态主题
- **UI 组件库**：Radix UI + shadcn/ui (Button, Card, Dialog, Slider, Switch)
- **代码规范**：Oxlint (超快速的 Rust 编写的前端代码检查器)
- **音效合成**：Web Audio API (动态合成正弦波提示音)

---

## 🚀 快速开始

### 1. 克隆并安装依赖
确保本地已安装 [Node.js](https://nodejs.org/) 以及包管理器 `pnpm`。

```bash
# 安装依赖
pnpm install
```

### 2. 启动开发服务器
```bash
pnpm dev
```
启动后访问控制台输出的地址（通常是 `http://localhost:5173`）即可体验。

### 3. 生产环境构建
```bash
pnpm build
```
打包产物将输出在 `dist/` 目录，可直接部署在 Netlify、Vercel 或 GitHub Pages 等静态托管平台。

---

## 📂 项目目录结构说明

```text
├── src/
│   ├── assets/          # 静态资源
│   ├── components/      # UI 组件
│   │   └── ui/          # 基于 Radix / shadcn 的基础原子组件
│   ├── lib/
│   │   └── utils.ts     # 类名合并工具函数 (clsx + tailwind-merge)
│   ├── App.tsx          # 页面核心控制器 (整合了状态管理、音频管理与主要 UI)
│   ├── App.css          # 自定义动画与微调样式
│   ├── index.css        # 全局样式与 Glassmorphic、呼吸特效样式配置
│   ├── types.ts         # 数据结构类型定义 (Track, Scenario, TodoItem, etc.)
│   └── main.tsx         # 应用入口点
├── package.json         # 项目依赖与运行脚本
└── vite.config.ts       # Vite 构建配置文件
```
