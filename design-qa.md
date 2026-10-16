# 友链页面设计与功能复核

当前分支：`main`；本地预览：http://127.0.0.1:5173/zh/links/

日期：2026-10-16。设计依据：用户选择的第 1 张双列卡片方案。

## 对照证据

- Source visual truth：`/home/fengying/.codex/generated_images/01a143da-bb6d-70e2-8392-693b5070ac94/exec-b25cf244-3d84-4726-a8c7-071f2bc35446.png`（1487 × 1058 px）。
- 主站实现截图：`/home/fengying/.codex/visualizations/2026/10/16/01a143da-bb6d-70e2-8392-693b5070ac94/friends-qa/main-dark-desktop.jpg`（1477 × 1051 px）。
- 个人站实现截图：`/home/fengying/.codex/visualizations/2026/10/16/01a143da-bb6d-70e2-8392-693b5070ac94/friends-qa/personal-dark-desktop.jpg`（1476 × 1058 px）。
- 浏览器 CSS viewport：1487 × 1058，devicePixelRatio 约 1。
- 状态：`/zh/links/`、暗色、未点击复制。主站为六张示例卡片；个人站按用户要求为空。
- 最终完整并排对照：`/home/fengying/.codex/visualizations/2026/10/16/01a143da-bb6d-70e2-8392-693b5070ac94/friends-qa/comparison-final.png`，左为设计、右为主站。截图序列化有轻微缩放，主站截图等比例近似恢复至 1487 × 1058（比例约 1.0067）。
- 个人站并排对照：`/home/fengying/.codex/visualizations/2026/10/16/01a143da-bb6d-70e2-8392-693b5070ac94/friends-qa/comparison-personal.png`。设计仅裁去右侧 11px 空白以匹配截图，未缩放；空状态与设计卡片状态不同，只比较共用标题、主题及交换信息区域，不作逐像素匹配结论。
- 标题、卡片字体与图像细节对照：`/home/fengying/.codex/visualizations/2026/10/16/01a143da-bb6d-70e2-8392-693b5070ac94/friends-qa/comparison-detail.png`，左右为各自内容区域原尺寸裁切，已查看。
- 手机截图：`/home/fengying/.codex/visualizations/2026/10/16/01a143da-bb6d-70e2-8392-693b5070ac94/friends-qa/personal-dark-mobile.jpg`、`/home/fengying/.codex/visualizations/2026/10/16/01a143da-bb6d-70e2-8392-693b5070ac94/friends-qa/personal-light-en-mobile.jpg`、`/home/fengying/.codex/visualizations/2026/10/16/01a143da-bb6d-70e2-8392-693b5070ac94/friends-qa/main-light-en-mobile.jpg`、`/home/fengying/.codex/visualizations/2026/10/16/01a143da-bb6d-70e2-8392-693b5070ac94/friends-qa/main-light-en-320.jpg`。

## Findings 与修复历史

1. 首轮 [P2]：FRIENDS 眉题沿用了灰色，而设计为青绿色。证据：`/home/fengying/.codex/visualizations/2026/10/16/01a143da-bb6d-70e2-8392-693b5070ac94/friends-qa/comparison-before.png`。修复：`.links-page .eyebrow` 使用现有 `--accent`。
2. 重新构建后于同一桌面视口、路由、暗色状态截图，最终并排对照确认眉题颜色已修正（计算值 rgb(94, 234, 212)）；无待处理 P0/P1/P2 视觉问题。
3. 代码审查 [P2]：主站配置中的 icon 已带部署基路径，再次添加基路径会使复制的头像 URL 重复。改用 URL 解析已配置的 icon；`BASE_PATH=/blog/` 的真实配置验证通过。
4. 首次个人站构建触发初始 JS 预算。仅将新友链页改为路由级动态加载，个人站初始 JS 降至约 194.6 KiB，原 200 KiB 预算未改，两版重建通过。

## 五项保真检查

- 字体与排版：沿用原站系统字体及中文回退；设计图没有可提取字体文件，不声称精确字体匹配。桌面标题约 49.6px、卡片标题约 18px，层级、字重和行高清晰；英文长简介自然换行，未截断。手机标题约 32.8px。
- 间距与布局：保留现有 1224px 内容宽度以对齐全站，较设计图边距略宽，属于既有站点约束。双列卡片、16px 卡片间距、20px 内边距、8px 圆角及双栏交换区域符合方案；小于等于 960px 改单列，小于等于 640px 头像 64px。375px 与 320px 窄屏无横向溢出。
- 颜色与 tokens：复用原站暗色背景、surface、边框、青绿色 accent；浅色采用现有主题映射。复制按钮及邮件入口有明确强调。未用额外渐变替代头像。
- 图片与图标：主站六张生成头像覆盖山、猫、星空、森林、手账、海面六个主题，浏览器全部加载成功；192px WebP 在 88px/64px 显示下清晰，总计约 64KB。构图延续参考方向，不宣称与图中画作完全相同。界面图标延用 Lucide；缺失或失败头像有 Globe 回退。个人站无示例头像。
- 文案与内容：标题、引言、交换说明、本站信息与设计一致；主站加强示例提示以避免误认真实友链。站名、域名、简介从各分支既有配置读取；个人站使用用户确认的中英文空状态。页脚保留现有站点样式和内容，因此高度与设计图不同。

## 交互、语义与验证

- 两版中英文切换均落在对应友链路由；标题、导航、空状态及信息文案切换正确。
- 已验证桌面明暗主题、手机菜单中的友链入口、点击后菜单关闭。
- 两版点击复制后出现“已复制”按钮及 aria-live 成功提示。系统剪贴板回读接口返回空，因此未以该接口证明实际剪贴板文本；文本构造和 URL 来源已审查。权限拒绝时的手动复制回退仅源码检查，未强制触发。
- 邮件链接与外链 href/target/rel 已检查；没有发送邮件，也没有访问虚构 `.example` 站点。
- 页面采用 h1/h2、region、原生按钮与链接；头像为装饰图且 alt 为空，外链有新窗口提示；沿用全站 focus 样式。未进行完整辅助技术或缩放审计。
- 主站及个人站浏览器控制台均无 warn/error。
- 两版各 26/26 测试通过；最终格式、lint、Vue/Node 类型检查及构建通过。主站输出 40 页，个人站输出 70 页；静态 metadata、导航、语言互链、sitemap/LLM 索引、RSS 排除及资产预算检查通过。

## Open Questions

无阻塞问题。个人站真实友链名单待以后通过 `src/config/friends.ts` 补充。

## Implementation Checklist

- [x] 双语友链页、导航与静态元数据。
- [x] 主站明确示例；个人站保留空状态。
- [x] 交换说明、邮件入口、复制与手动复制回退。
- [x] 配置字段与地址校验、聚焦测试、构建及浏览器验证。
- [x] 修复后重新截图并完成完整和局部对照。

final result: passed
