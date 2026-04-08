# DevToolkit 项目介绍文档

> 开发者工具集桌面客户端 —— 把日常开发中常用的工具整合到一个桌面应用中

---

## 一、这个项目是什么？

DevToolkit 是一个 **Windows 桌面应用**，像一个"工具箱"，把开发工作中常用的小工具集中在一起，不用再到处找在线工具网站。

**目前已实现的工具：**

| 工具 | 说明 |
|------|------|
| 图片压缩 | 选择图片文件，压缩到指定大小（如 5MB → 1MB），支持批量处理，自动保持原图格式 |
| 二维码生成 | 输入文本或链接，生成二维码图片并保存，支持前景/背景色、纠错等级、下载 PNG/SVG |
| Diff 对比 | 对比两个文件的差异，高亮显示不同之处 |
| 网页收藏夹 | 收藏常用网站（如公司内部系统），分类管理，随时查阅 |
| JSON 格式化 | 粘贴 JSON 字符串，一键格式化（美化）或压缩（去空白），支持错误提示 |
| 编码转换 | Base64 与明文双向互转，Unicode 与明文双向互转，无法转换时红色报错 |
| 世界时间 | 查看全球 18 个主要城市当前时间，每秒自动刷新 |
| 时间戳转换 | 显示当前秒级/毫秒级时间戳，支持将时间戳转为可读日期，也支持反向转换 |
| 日历 | 查看阳历日期，支持显示农历、二十四节气、传统节日、中国法定节假日，右上角红字标注 |
| 天气预报 | 查看今天及未来 6 天天气预报，支持多个城市切换，首次使用需配置和风天气免费 API Key |
| 二维码生成 | 输入文本或链接，生成二维码图片并保存，支持前景/背景色、纠错等级、下载 PNG/SVG |
| Diff 对比 | 对比两个文件的差异，高亮显示不同之处 |
| 网页收藏夹 | 收藏常用网站（如公司内部系统），分类管理，随时查阅 |

---

## 二、技术栈总览

```
┌─────────────────────────────────────────────┐
│              DevToolkit 桌面应用              │
├──────────┬──────────┬───────────────────────┤
│  主进程   │  预加载   │       渲染进程         │
│ (Main)   │(Preload) │     (Renderer)        │
│          │          │                       │
│ Electron │ 桥接层    │  Vue 3 + Naive UI     │
│ Node.js  │ IPC 通信  │  Vue Router           │
│ sql.js   │          │  Monaco Editor        │
└──────────┴──────────┴───────────────────────┘
```

### 核心技术

| 技术 | 版本 | 用途 |
|------|------|------|
| **Electron** | v33 | 桌面应用框架，让网页变成桌面软件 |
| **Vue 3** | v3.5 | 渲染进程的前端框架（组合式 API） |
| **TypeScript** | v5.6 | 全项目使用，提供类型安全 |
| **Naive UI** | v2.40 | Vue 3 组件库，提供按钮、表格、对话框等 UI 组件 |
| **electron-vite** | v2.3 | Electron 专属构建工具，基于 Vite，编译快 |
| **electron-builder** | v25 | 打包工具，生成 Windows 安装包（.exe） |
| **browser-image-compression** | latest | 浏览器端图片压缩库，支持各格式有损/无损压缩 |
| **qrcode** | v1.5 | 二维码生成库 |
| **sql.js** | v1.11 | SQLite 的纯 JS 实现，用于本地数据库存储 |

### 各技术是干什么的？（新手科普）

- **Electron**：把 Chrome 浏览器内核 + Node.js 打包成桌面应用。你可以理解为"一个能调用系统 API 的浏览器"。VS Code、Discord 等都是用 Electron 开发的。
- **Vue 3**：前端框架，用来写页面界面。用 `.vue` 文件组织 HTML + JS + CSS。
- **TypeScript**：JavaScript 的增强版，加了类型系统，能在写代码时就发现错误。
- **Naive UI**：提供现成的 UI 组件（按钮、输入框、表格等），不用从零写样式。
- **electron-vite**：把 TypeScript/Vue 代码编译成浏览器和 Node.js 能运行的 JS。
- **electron-builder**：把编译后的代码打包成用户可以安装的 .exe 程序。

---

## 三、项目目录结构

```
dev-toolkit/
├── src/
│   ├── main/                  # 主进程（运行在 Node.js 环境）
│   │   ├── index.ts           # 应用入口，创建窗口、注册 IPC
│   │   ├── db/
│   │   │   └── database.ts    # SQLite 数据库管理（sql.js）
│   │   └── ipc/               # IPC 通信处理
│   │       ├── index.ts       # 注册所有 IPC 处理器
│   │       ├── image.ts       # 图片压缩相关 IPC
│   │       └── bookmark.ts    # 书签管理相关 IPC
│   │
│   ├── preload/               # 预加载脚本（安全桥梁）
│   │   └── index.ts           # 暴露安全的 API 给渲染进程
│   │
│   └── renderer/              # 渲染进程（运行在浏览器环境）
│       ├── index.html         # HTML 入口
│       └── src/
│           ├── main.ts        # Vue 应用入口
│           ├── App.vue        # 根组件（侧边栏 + 路由视图）
│           ├── router/
│           │   └── index.ts   # 路由配置（4 个工具页面）
│           ├── views/         # 页面组件
│           │   ├── ImageCompress.vue  # 图片压缩页
│           │   ├── QrCode.vue         # 二维码生成页
│           │   ├── DiffTool.vue       # Diff 对比页
│           │   ├── Bookmarks.vue      # 收藏夹页
│           │   ├── JsonFormat.vue     # JSON 格式化页
│           │   ├── EncodeConvert.vue  # Base64/Unicode 编码转换页
│           │   ├── WorldTime.vue      # 世界时间页
│           │   ├── Timestamp.vue      # 时间戳转换页
│           │   ├── Calendar.vue       # 日历页（阳历/农历/节气/节日）
│           │   └── Weather.vue        # 天气预报页
│           └── components/    # 可复用子组件
│
├── electron.vite.config.ts    # 构建配置（定义三个进程的编译选项）
├── electron-builder.yml       # 打包配置（安装包设置）
├── tsconfig.json              # TypeScript 配置
└── package.json               # 项目依赖和脚本命令
```

---

## 四、Electron 三进程架构详解

这是理解本项目的**最核心概念**。Electron 应用由三个部分组成，各有分工：

```
                    ┌──────────────┐
                    │    主进程      │  ← Node.js 环境
                    │   (Main)     │     可以调用系统 API
                    │              │     读写文件、操作数据库
                    └──────┬───────┘
                           │ IPC 通信
                    ┌──────┴───────┐
                    │   预加载层    │  ← 安全桥梁
                    │  (Preload)   │     白名单式暴露 API
                    └──────┬───────┘
                           │ window.api
                    ┌──────┴───────┐
                    │   渲染进程    │  ← 浏览器环境
                    │  (Renderer)  │     Vue 3 页面
                    │              │     只能调用预加载层暴露的 API
                    └──────────────┘
```

### 为什么分成三层？

**安全原因。** 渲染进程本质上是网页，如果网页能直接调用 Node.js 的文件读写、系统命令等能力，就会像普通网页一样存在被攻击的风险。所以 Electron 的安全模型要求：

1. **主进程 (Main)**：拥有全部 Node.js 能力（读写文件、数据库、调用系统 API），但不能直接操作界面。
2. **渲染进程 (Renderer)**：负责显示界面（Vue 页面），但不能直接访问 Node.js 或系统 API。
3. **预加载层 (Preload)**：作为中间桥梁，在安全的上下文中把特定的 API 有选择地暴露给渲染进程。

### 数据流向举例：图片压缩

```
用户点击"选择图片"按钮
    ↓
渲染进程调用 window.api.selectImages()
    ↓
预加载层转发：ipcRenderer.invoke('select-images')
    ↓
主进程收到 IPC 消息，打开系统文件选择对话框
    ↓
主进程读取图片文件，执行压缩
    ↓
主进程将结果通过 IPC 返回
    ↓
预加载层将结果返回给渲染进程
    ↓
页面显示压缩后的图片预览
```

### IPC 通信一览

目前项目中预加载层暴露的所有 API（定义在 `src/preload/index.ts`）：

| API | 功能 | 对应主进程处理 |
|-----|------|---------------|
| `selectImages()` | 打开文件对话框选择图片 | `image.ts` |
| `saveCompressedImage(data, name)` | 保存压缩后的图片 | `image.ts` |
| `getBookmarks(search, category)` | 获取书签列表 | `bookmark.ts` |
| `addBookmark(bookmark)` | 添加书签 | `bookmark.ts` |
| `updateBookmark(bookmark)` | 更新书签 | `bookmark.ts` |
| `deleteBookmark(id)` | 删除书签 | `bookmark.ts` |
| `getCategories()` | 获取分类列表 | `bookmark.ts` |
| `addCategory(name)` | 添加分类 | `bookmark.ts` |
| `deleteCategory(id)` | 删除分类 | `bookmark.ts` |
| `exportBookmarks()` | 导出书签 | `bookmark.ts` |
| `importBookmarks()` | 导入书签 | `bookmark.ts` |
| `openExternal(url)` | 用系统浏览器打开链接 | `index.ts` |

---

## 五、数据库

收藏夹功能使用 **sql.js**（SQLite 的 JavaScript 实现）存储数据。

- 数据库文件位置：`%AppData%/dev-toolkit/dev-toolkit.db`
- 不需要安装额外的数据库软件，sql.js 是纯 JS 实现，数据存在单个文件中
- 应用启动时自动加载，修改时自动保存

**数据库表结构：**

```sql
-- 书签表
CREATE TABLE bookmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT DEFAULT '',
    category TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 分类表
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 六、开发环境搭建

### 前置要求

- **Node.js** >= 18（推荐 LTS 版本）
- **npm**（随 Node.js 一起安装）
- **VS Code**（推荐，已有调试配置）

### 安装步骤

```bash
# 1. 进入项目目录
cd dev-toolkit

# 2. 安装依赖（只需要执行一次）
npm install
```

> 首次安装会下载 Electron 二进制文件，可能需要几分钟，取决于网络速度。

---

## 七、开发调试

### 方法一：VS Code 调试（推荐）

项目已配置好 `.vscode/launch.json`，支持一键调试：

1. 在 VS Code 中打开 `d:\Tools` 目录
2. 按 **F5** 键（或点击左侧"Run and Debug"面板中的绿色三角）
3. 有两个调试配置可选：
   - **DevToolkit Debug**（推荐）：直接启动开发服务器，带热更新，改代码即时生效，**日常开发使用此配置**
   - **DevToolkit Debug (Build First)**：先编译再启动，先执行 `npm run build` 再启动 Electron，加载的是编译后的产物，**仅用于排查打包后与开发环境行为不一致的问题**
4. 应用会自动启动，主进程代码可以打断点调试

### 方法二：终端命令

```bash
cd dev-toolkit

# 启动开发模式（带热更新，修改代码后自动刷新）
npm run dev
```

> 在某些终端环境中 `ELECTRON_RUN_AS_NODE` 环境变量会导致启动失败，可用 `npm run dev:bash` 替代。

---

## 八、构建与打包

### 构建命令一览

| 命令 | 作用 | 输出 |
|------|------|------|
| `npm run build` | 编译源代码 | `out/` 目录（主进程 + 预加载 + 渲染进程） |
| `npm run preview` | 编译 + 本地预览 | 不会生成安装包 |
| `npm run pack` | 编译 + 打包为目录 | `dist/` 目录（未压缩，用于测试打包结果） |
| `npm run dist` | 编译 + 打包安装包 | `dist/` 目录下的 `.exe` 安装文件 |

### 生成 Windows 安装包

```bash
cd dev-toolkit
npm run dist
```

执行后会生成类似 `DevToolkit-1.0.0-setup.exe` 的安装包，双击即可安装。

### 打包配置说明

打包行为由 `electron-builder.yml` 控制：

| 配置项 | 当前值 | 说明 |
|--------|--------|------|
| `appId` | `com.dev-toolkit` | 应用唯一标识 |
| `productName` | `DevToolkit` | 安装包显示名称 |
| `win.target` | `nsis` | Windows 安装包格式 |
| `nsis.oneClick` | `false` | 非一键安装，有安装向导 |
| `nsis.allowToChangeInstallationDirectory` | `true` | 允许用户选择安装路径 |

如需修改安装包名称、图标等，编辑 `electron-builder.yml` 即可。

---

## 九、如何添加新工具

以添加一个"JSON 格式化"工具为例：

### 1. 创建页面组件

创建 `src/renderer/src/views/JsonFormat.vue`：

```vue
<script setup lang="ts">
// 页面逻辑
</script>

<template>
  <div>
    <h2>JSON 格式化</h2>
    <!-- 页面内容 -->
  </div>
</template>
```

### 2. 注册路由

在 `src/renderer/src/router/index.ts` 中添加路由：

```typescript
{
  path: '/json-format',
  name: 'JsonFormat',
  component: () => import('../views/JsonFormat.vue'),
  meta: { title: 'JSON 格式化', icon: 'CodeSlashOutline' }  // icon 名对应 ionicons5
}
```

> 侧边栏图标是**自动**根据路由的 `meta.icon` 渲染的，只需在路由中指定 `icon` 值即可，无需修改 App.vue。

### 3.（可选）添加 IPC 通信

如果新工具需要调用系统能力（文件读写等），需要：
1. 在 `src/main/ipc/` 下新建处理模块
2. 在 `src/preload/index.ts` 中暴露 API
3. 在渲染进程中通过 `window.api.xxx()` 调用
   - **注意**：Vue 3 的响应式对象（ref/reactive）需要用 `toRaw()` 转成普通对象后再传给 IPC，例如：`window.api.addBookmark({ ...toRaw(form.value) })`

如果只是纯前端逻辑（如 JSON 格式化），不需要 IPC，在渲染进程里直接处理即可。

---

## 十、常见问题

### Q: 保存书签时提示"An object could not be cloned"

这是 Electron IPC 的序列化问题。Vue 3 的响应式数据是 Proxy 对象，IPC 无法直接克隆。解决方案：在调用 `window.api` 之前，用 `toRaw()` 将响应式对象转成普通对象。例如：

```typescript
import { toRaw } from 'vue'
await window.api.addBookmark({ ...toRaw(form.value) })
```

### Q: 启动时报错 `ELECTRON_RUN_AS_NODE is set`

某些终端环境（如 Git Bash 的父进程）会设置这个环境变量，导致 Electron 以 Node 模式启动而非 GUI 模式。解决方式：

- **VS Code 调试**：launch.json 中已配置自动清除
- **终端命令**：使用 `npm run dev` 或 `npm run dev:bash`

### Q: npm install 很慢

Electron 需要下载约 80MB 的二进制文件。可以配置国内镜像：

```bash
npm config set electron_mirror https://npmmirror.com/mirrors/electron/
```

### Q: 打包后数据库文件在哪？

`%AppData%/DevToolkit/dev-toolkit.db`。卸载应用不会删除此文件，重装后数据仍在。

### Q: 如何修改应用窗口默认大小？

编辑 `src/main/index.ts` 中 `createWindow` 函数的 `width` 和 `height` 参数。

### Q: 图片压缩支持哪些格式？

支持 JPEG、PNG、WebP 等常见格式。压缩时会**自动保持原图格式**，不需要手动选择格式，通过质量滑块控制压缩程度。

### Q: 天气数据来源是什么？需要 API Key 吗？

天气使用 **和风天气**（https://dev.qweather.com/）的免费 API，**需要免费注册获取 Key**（每天 1000 次调用，支持所有中国城市）。首次使用会引导配置 Key，之后保存在本地。
