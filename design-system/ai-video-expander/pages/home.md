# Home

先看懂扩画与续写的区别，随后直接从 Hero 上传和设置，观察画幅案例，再按需阅读控制、操作、用途、套餐与 FAQ。1440 桌面工作区以 41/59 邻接表单和媒体。1280×720 至少能看到表单开端与主媒体；390 手机允许表单完整占高再呈现同序媒体。文案与媒体不挤入悬停层。样片图形动作保留缩略图提示和键盘等效。

采用 `editorial interactive product demo media` landing #1 的说明型媒体与反馈，以及 `file upload preview drag drop focus` ux #1/#3 的传统上传替代和可见焦点。Hero 严格对照冻结草图。正文各媒体槽登记在 docs/media/ai-video-expander-media-plan.md。

## 模块设计规格

### what-is
- decidedBy: agent
- decisionSource: recommended-default
- form: 紧凑两列图文，左为定义，右为一条独立影片。
- why: 首屏偏操作，这里把“生成范围”解释为画布可增加的区域，文字先定义，媒体以场景变化明确概念。
- items: What Is 唯一标题、简短定义和独立正文组成左列。
- media: 16:9 一条，托举一道亮红框边的编辑台上出现关键词，随场景切到停车场和小舞台的扩幅构图。封面选读得清锁定关键词的帧，主体在中间，画面不裁。
- interaction: 可见的主播放控件，播放后由原生 controls 接管。
- motion: 正文进入时短淡入，点击后视频播放，无自动轮播。
- mobile: 左文右图重排成先标题正文后视频，画幅完整。
- alternatives:
  - 对照播放器上置式，影片优先。定义会被推到预览下，作为接续章节时选择边读边看。

### key-features
- decidedBy: agent
- decisionSource: recommended-default
- form: 编辑式逐行图文对照，四项同一阅读轴，主能力两行用更宽媒体。
- why: 比例与原片位置相互关联，先读它们；提示词、分辨率是后续控制。逐行可以直看片段与详细解释，不用切页签发现文字。
- items: Choose the Shape of Your Video；Keep the Whole Source Frame；Describe What Belongs at the Edges；Set the Output Resolution。保持锁定顺序和任务动作。
- media: feature-ratio 16:9 一侧小窗对照宽素材和竖输出，滑雪者居中；feature-frame 16:9 房间画面中央含双人镜头，单小窗置空侧；feature-prompt 16:9 修理台实景保留灯与工具，新增区留出干净墙面，侧边单小窗；feature-quality 16:9 一条包含清晰纹理的成品构图，仅解释交付场景，不伪造清晰度实测。所有媒体全帧 contain。
- interaction: 视频控制和每项至 #tool 的独立跳转。
- motion: 分段轻位移＋淡入，悬停改变控件边界，触摸端得到即时按下反馈。
- mobile: 每项先文后视频和动作，保持 H3-正文-按钮的锁定关系与整条播放画面。
- alternatives:
  - 一个共用播放器逐项切换。页面高度短，但四项能力和对应变化较难一扫读完。

### how-to-use
- decidedBy: agent
- decisionSource: recommended-default
- form: 连续三步条，三个同尺度插图和共享阅读路径。
- why: 选择素材、设定并扩框、预览并保存是连续动作，需要看见同一素材在三个状态的衔接。
- items: Step 1: Upload a Source Video；Step 2: Set the Frame and Expand；Step 3: Download and Save the Video。
- media: 三张连续 4:3 独立生成图。用白色滑板与陶红坡道保持连续。Step 1 支持选取视频；Step 2 看到目标比例框和生成动作；Step 3 同时出现视频预览、下载动作和保存后的 MP4。
- interaction: 节说明内保留 Guide 真实链接，插图保持静态。
- motion: 顺序入场不改变 DOM 阅读顺序。
- mobile: 自上而下，每张图原比例紧随对应步骤。
- alternatives:
  - 竖向时间轴加一侧三图。桌面识别清晰但步骤跨左右往返，三列更便于整体扫读。

### use-cases
- decidedBy: agent
- decisionSource: recommended-default
- form: 原生比例的不等高作品陈列，桌面三列，用不同大小表达发布用途。
- why: 竖屏社媒、多空白商品广告与横向剪辑是并列用途，成品原生构图直接表达差异。
- items: Turn a Wide Shot into a Vertical Post；Make Room for a Product Headline；Give Portrait Footage a Landscape Frame。
- media: case-post 9:16 两位室内访谈人物和干净字幕区；case-ad 16:9 红色便携唱盘与一侧空白墙；case-landscape 21:9 海堤中央行人及左右可见海岸，三条独立仅成品，不裁切。
- interaction: 同时可看各自海报，按需独立播放。
- motion: 各成片只在用户操作时播放，轻入场与边框反馈。
- mobile: 一列，保持文案顺序，9:16 限制预览高度并保留比例，16:9 与 21:9 随容器。
- alternatives:
  - 案例轮播配等比舞台。适合窄屏快速跳跃，但桌面无法一眼对比三种用途。
