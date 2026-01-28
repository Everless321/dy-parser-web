# 抖音视频解析 Web 应用

一个简洁高效的抖音视频/图集解析工具，支持在线预览和下载。

## ✨ 功能特性

- **链接解析** - 支持 v.douyin.com、www.douyin.com 分享链接
- **智能提取** - 自动从分享文本中提取链接，直接粘贴即可
- **视频下载** - 支持视频在线预览和下载
- **图集下载** - 支持图集浏览和批量下载
- **无需登录** - 无需 Cookie，开箱即用
- **响应式设计** - 暗色主题，移动端适配

## 🛠 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **解析库**: [dy-downloader](https://www.npmjs.com/package/dy-downloader)

## 🚀 快速开始

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/Everless321/dy-parser-web.git
cd dy-parser-web

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

访问 http://localhost:3000

## 📦 部署

### Vercel (推荐)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Everless321/dy-parser-web)

或手动部署：
1. Fork 本仓库
2. 在 [Vercel](https://vercel.com/new) 导入项目
3. 点击 Deploy

### Cloudflare Pages

```bash
# 构建
pnpm build:cf

# 部署
pnpm deploy:cf
```

或通过 Cloudflare Dashboard：
1. 访问 [Cloudflare Pages](https://dash.cloudflare.com/?to=/:account/pages)
2. 连接 GitHub 仓库
3. 构建设置：
   - Build command: `pnpm build:cf`
   - Build output: `.open-next/cloudflare`

### Docker

```bash
# 使用 Docker Compose
docker compose up -d

# 或手动构建
docker build -t dy-parser-web .
docker run -p 3000:3000 dy-parser-web
```

## 📖 API 文档

### POST /api/parse

解析抖音分享链接

**请求：**
```json
{
  "url": "https://v.douyin.com/xxxxx/"
}
```

或直接传入分享文本：
```json
{
  "url": "7.10 复制此链接 https://v.douyin.com/xxxxx/ 打开抖音"
}
```

**响应：**
```json
{
  "ok": true,
  "data": {
    "awemeId": "7597000314998344994",
    "desc": "视频描述",
    "author": {
      "nickname": "作者昵称",
      "avatarThumb": "头像URL"
    },
    "statistics": {
      "diggCount": 1000,
      "commentCount": 100,
      "shareCount": 50,
      "collectCount": 200
    },
    "video": {
      "duration": 60000,
      "playAddr": ["视频URL"],
      "cover": ["封面URL"]
    },
    "downloads": [
      {
        "type": "video",
        "url": "下载链接"
      }
    ]
  }
}
```

### GET /api/download

代理下载资源（解决跨域和 Referer 限制）

**参数：**
| 参数 | 说明 | 可选值 |
|------|------|--------|
| url | 资源 URL | - |
| type | 资源类型 | video / image |
| mode | 模式 | download / preview |

**示例：**
```
/api/download?type=video&url=https://...
/api/download?mode=preview&type=image&url=https://...
```

## 📁 项目结构

```
dy-parser-web/
├── src/
│   ├── app/
│   │   ├── page.tsx              # 主页面
│   │   ├── layout.tsx            # 布局
│   │   ├── globals.css           # 全局样式
│   │   └── api/
│   │       ├── parse/route.ts    # 解析 API
│   │       └── download/route.ts # 下载代理 API
│   ├── components/
│   │   ├── LinkInputForm.tsx     # 输入表单
│   │   ├── ResultDisplay.tsx     # 结果展示
│   │   ├── MediaPreview.tsx      # 媒体预览
│   │   ├── AuthorInfo.tsx        # 作者信息
│   │   ├── PostDetails.tsx       # 帖子详情
│   │   ├── DownloadActions.tsx   # 下载按钮
│   │   └── ErrorAlert.tsx        # 错误提示
│   └── lib/
│       ├── parser.ts             # 解析逻辑
│       └── types.ts              # 类型定义
├── Dockerfile                    # Docker 构建
├── docker-compose.yml            # Docker Compose
├── open-next.config.ts           # Cloudflare 配置
├── wrangler.jsonc                # Wrangler 配置
└── package.json
```

## 📝 使用说明

1. **粘贴链接** - 直接粘贴抖音分享链接或完整分享文本
2. **点击解析** - 等待解析完成
3. **预览内容** - 查看视频/图集预览
4. **下载资源** - 点击下载按钮保存到本地

支持的链接格式：
- `https://v.douyin.com/xxxxx/`
- `https://www.douyin.com/video/xxxxx`
- 包含上述链接的分享文本

## ⚠️ 免责声明

本项目仅供学习交流使用，请勿用于商业用途。下载的内容版权归原作者所有，请尊重创作者权益。

## 📄 License

MIT
