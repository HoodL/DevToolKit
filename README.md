# DevToolkit

开发者工具集桌面客户端 —— 把日常开发中常用的小工具整合到一个 Windows 应用中，开箱即用。

![Electron](https://img.shields.io/badge/Electron-33-47848F?style=flat-square&logo=electron)
![Vue 3](https://img.shields.io/badge/Vue-3-42b883?style=flat-square&logo=vuedotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

## 已集成的工具

| 工具 | 说明 |
|------|------|
| 图片压缩 | 批量压缩图片，自动保持原图格式，支持 JPEG/PNG/WebP |
| 二维码生成 | 支持前景/背景色、纠错等级，下载 PNG 或 SVG |
| Diff 对比 | 高亮显示两个文件之间的差异 |
| 网页收藏夹 | 分类管理公司内部链接，支持导入/导出 |
| JSON 格式化 | 一键格式化或压缩，带错误提示 |
| 编码转换 | Base64 / Unicode 与明文双向互转 |
| 世界时间 | 18 个全球主要城市实时时间，每秒刷新 |
| 时间戳转换 | 秒级/毫秒级时间戳显示与互转 |
| 日历 | 阳历+农历+二十四节气+传统节日+法定节假日（2024-2031） |
| 天气预报 | 未来 6 天天气，支持多个城市（需配置和风天气免费 Key） |

---

## 技术栈

- **Electron 33** — 桌面应用框架
- **Vue 3 + TypeScript** — 前端框架
- **Naive UI** — UI 组件库
- **electron-vite** — 极速构建工具
- **electron-builder** — Windows 安装包打包

---

## 安装与运行

### 环境要求
- Node.js >= 18
- Windows 10 及以上

### 开发模式
```bash
cd dev-toolkit
npm install
npm run dev        # F5 调试（推荐）
```

### 构建安装包
```bash
npm run dist       # 生成 Windows 安装包
```

安装包输出位置：`dev-toolkit/dist/`

---

## 项目结构

```
dev-toolkit/
├── src/
│   ├── main/              # Electron 主进程
│   │   ├── ipc/          # IPC 通信处理
│   │   └── db/           # sql.js 数据库
│   ├── preload/          # 预加载层（安全桥梁）
│   └── renderer/          # Vue 3 渲染进程
│       └── views/         # 各工具页面
├── .vscode/               # VS Code 调试配置
├── GUIDE.md               # 详细开发文档
└── electron-builder.yml   # 打包配置
```

---

## 开发调试

按 **F5** 在 VS Code 中启动调试，支持主进程断点。

---

## License

MIT
