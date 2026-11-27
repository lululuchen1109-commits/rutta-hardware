/* Rutta R1 · lightweight EN / 中文 switcher
   - English lives in the HTML (and in EN below for text set by scripts).
   - Chinese lives in ZH below. Elements opt in with data-i18n / data-i18n-ph / data-i18n-dph. */
(() => {
  const EN = {
    'hero.h1.a': `What your team says becomes what your team knows.`,
    'hero.h1.b': `Never lose a spoken decision again.`,
    'hero.h1.c': `The team mic that never needs a record button.`,
    'detail.always.body': `No start button, no battery. Plugged into your Mac, R1 is on whenever your Mac is — so the small conversations that move work forward finally get captured.`,
    'detail.voice.body': `Each teammate enrolls their voice once. R1 knows who said what — that’s how every task gets an owner — and is designed to discard voices it doesn’t recognize.`,
    'detail.flow.body': `Confirmed notes land in your Rutta team knowledge base, then flow to the docs, task tools, chat apps and AI Agents you already use via MCP, API and CLI.`,
    'pv.cap.ready': `Green breathing light · R1 is ready.`,
    'pv.cap.input': `Solid amber light · R1 is capturing enrolled teammates.`,
    'pv.cap.mute': `Light off · an orange marker shows it’s physically muted.`,
    'finish.silver': `R1 · Silver`, 'finish.sky': `R1 · Sky Blue`, 'finish.starlight': `R1 · Starlight`, 'finish.midnight': `R1 · Midnight`,
    'fit.unplugged': `Unplugged`, 'fit.aligning': `Aligning`, 'fit.connected': `Connected`, 'fit.retry': `Try again`,
    'sw.mute': `Slide to mute`, 'sw.unmute': `Slide to unmute`,
    'sw.read.ready': `The light on top breathes green while R1 is ready.`,
    'sw.read.input': `The light stays amber while R1 is capturing enrolled teammates.`,
    'sw.read.mute': `The light goes out, and an orange marker appears in the switch track.`,
    'ex.intro': `Drag to rotate, or choose a detail.`,
    'ex.introStill': `Choose a detail to see how R1 fits together.`,
    'ex.home': `R1 in silver`,
    'ex.ports': `One pinhole faces the palm rest; a second sits mid-side 15.5 mm away — a 15.7 mm dual-mic baseline.`,
    'ex.plug': `The USB-C plug draws power from your Mac and carries audio back through the same connection.`,
    'ex.mute': `Slide the switch to mute. An orange mark appears in the track so you can see its position.`,
    'note.default': `Concept stage · free, no payment or pre-order.`,
    'err.email': `Please enter a valid work email.`,
    'err.usecase': `Please choose where R1 would help most.`,
    'err.other': `Please describe your scenario briefly.`,
    'err.consent': `Please tick the box so we can email you.`,
    'err.generic': `Something went wrong. Please try again.`,
    'th.remote': `We’ll keep you posted, and may invite you to a 15-minute chat.`,
    'th.local': `Preview mode: saved in this browser until the live backend is connected.`,
    'sv.done': `Thank you — this really helps.`,
    'sh.copied': `Link copied ✓`
  };

  const ZH = {
    'meta.title': `Rutta R1 | 让团队说过的话，变成团队的知识`,
    'ct.title': `联系我们与候补名单 | Rutta R1`,
    'ann.text': `R1 处于概念阶段，暂无样机，想听听你的意见。<span>加入候补名单 →</span>`,
    'nav.value': `为什么是 R1`, 'nav.scenarios': `使用场景`, 'nav.how': `怎么用`, 'nav.privacy': `隐私`,
    'nav.gallery': `产品图集 ↗`, 'nav.contact': `联系我们 ↗`, 'nav.cta': `加入候补`,

    'hero.eyebrow': `Rutta R1 · 插在 Mac 上的团队记忆`,
    'hero.h1.a': `团队说过的话，变成团队的知识。`,
    'hero.h1.b': `说过的决定，不再丢。`,
    'hero.h1.c': `不用按开始的团队麦克风。`,
    'hero.sub': `R1 插在 Mac 上，工作时一直在线。它用声纹认出已加入的团队成员，把大家说出口的决定、待办和关键信息自动沉淀下来，再分发到团队已经在用的工具和 Agent 里——不需要任何人按下开始。`,
    'hero.cta': `加入候补名单`, 'hero.link': `看看团队怎么用`,
    'hero2.h2': `不用任何人按开始，说过的事不再漏掉。`,
    'hero2.sub': `工位旁两分钟的讨论、会议前后的几句话、站会上一句“这个我来”——R1 跟着 Mac 从工位到会议室，推动工作的那些对话都会被记下来。`,

    'detail.always': `一直在线`, 'detail.voice': `知道是谁说的`, 'detail.flow': `流向你的工具`,
    'detail.always.body': `没有开始按钮，不用充电。插在 Mac 上，Mac 开着它就在线，推动工作的那些零碎对话终于能被记下来。`,
    'detail.voice.body': `每位成员只需录一次声纹。R1 知道每句话是谁说的，待办的负责人就是这么来的；对不上的声音，设计上直接丢弃。`,
    'detail.flow.body': `确认后的内容先进入 Rutta 团队知识库，再通过 MCP、API 和命令行流向团队已在用的文档、任务工具、聊天工具和 Agent。`,

    'value.kicker': `R1 带来什么`,
    'value.h2': `团队最有用的信息，大多是说出来的。`,
    'value.lead': `决定在随口讨论里定下，任务在一句话里认领，背景在工位旁传递。R1 不需要任何人按开始，就能把这些记下来，变成团队用得上的东西。`,
    'value.1.h': `说过的决定不再丢`, 'value.1.p': `口头定下的事自动有文字记录，有出处：谁说的、什么时候说的。`,
    'value.2.h': `承诺有人认领，有人跟进`, 'value.2.p': `说出口的承诺变成带负责人和日期的待办，不会说完就忘。`,
    'value.3.h': `不用任何人多做一步`, 'value.3.p': `不用打开会议纪要工具，不用事后补记，也不用再向 Agent 交代背景。`,
    'value.4.h': `知识流向团队自己的工具`, 'value.4.p': `沉淀下来的内容先进入 Rutta 团队知识库，再流向团队已有的文档、任务工具和 Agent，始终属于团队。`,
    'value.5.h': `只记录同意加入的人`, 'value.5.p': `R1 只处理已加入成员的声音，只在工作场景里；午饭、走廊和私人时间不在范围内。`,

    'sc.kicker': `使用场景 · 面向 3–15 人团队`,
    'sc.h2': `为那些没人会去录的对话而做。`,
    'sc.lead': `没人会为两分钟的讨论打开录音——可上线日期、任务认领和背景信息，恰恰就是在这些时候定下来的。R1 就在这里派上用场。`,
    'sc.1.tag': `工位旁`, 'sc.1.quote': `“上线从 12 月 3 日推到 10 日吧。”`, 'sc.1.h': `两分钟的决定也有记录`,
    'sc.1.p': `几分钟后，两个人各收到一条待确认的记录。一人点确认，项目计划、受影响的任务和相关同事都会同步更新，没有人需要写一个字。`,
    'sc.2.tag': `站会上`, 'sc.2.quote': `“报价我周一发。”`, 'sc.2.h': `每一句“这个我来”都有人认领`,
    'sc.2.p': `R1 知道这句话是谁说的，任务工具里就多了一条带负责人和日期的待办；周一会提醒，有人说“发了”，它就自动完成。`,
    'sc.3.tag': `会前和散会后`, 'sc.3.quote': `“选方案 B 吧，客户要先上 SSO。”`, 'sc.3.h': `决定连同原因一起留下`,
    'sc.3.p': `真正的推导往往发生在散会前后那几句话里。R1 把原因和决定放在一起，之后有人问起，随时查得到。`,
    'sc.4.tag': `交接与新同事`, 'sc.4.quote': `“等等，这事什么时候定的？”`, 'sc.4.h': `不用再从头解释一遍`,
    'sc.4.p': `没在场的同事和刚加入的新人，都能查到一件事当时是怎么定的、谁定的、为什么这么定。`,
    'sc.5.tag': `习惯口头布置的负责人`, 'sc.5.quote': `“这周新手引导你来跟一下？”`, 'sc.5.h': `不用再去群里重复一遍`,
    'sc.5.p': `当面交代的事会自动记录和跟进，不用当面说一遍、再到群里重复一遍并 @ 对方。`,
    'sc.6.tag': `和 Agent 一起工作`, 'sc.6.quote': `“我们现在定的是哪天上线？”`, 'sc.6.h': `Agent 已经知道最新进展`,
    'sc.6.p': `确认后的决定直接进入团队的 Agent，它可以接着起草文档、建任务、更新计划，不用再有人向它交代背景。`,

    'wf.kicker': `怎么用`, 'wf.h2': `插上一次，团队照常工作。`,
    'wf.1.t': `插上`, 'wf.1.p': `插到 Mac 上就开始工作，Mac 开着它就在线。`,
    'wf.2.t': `加入`, 'wf.2.p': `每位成员录一段话，绑定声纹。只做一次，随时可以退出。`,
    'wf.3.t': `照常工作`, 'wf.3.p': `在工位讨论，在会议室开会，不用开始，也不用结束。`,
    'wf.4.t': `确认`, 'wf.4.p': `整理出的记录先只给这段对话里的人看，有人确认后才进入团队。`,
    'wf.5.t': `流转`, 'wf.5.p': `决定进知识库，待办带着负责人进任务工具，Agent 随时查得到。`,
    'wf.ex.label': `示例 · 周二下午，工位旁`, 'wf.ex.badge': `示意场景 · 概念阶段`,
    'wf.ex.1.s': `口头说定`, 'wf.ex.1.p': `两位同事说好把上线日期从 <strong>12 月 3 日</strong>推到 <strong>12 月 10 日</strong>。`,
    'wf.ex.2.s': `一键确认`, 'wf.ex.2.p': `几分钟后，两人各收到一条待确认的记录：新日期、谁负责、谁确认的。其中一人点了确认。`,
    'wf.ex.3.s': `自动同步`, 'wf.ex.3.p': `项目计划随即更新，相关的三条任务顺延，团队的 Agent 再被问到时答的是 <strong>12 月 10 日</strong>。没有人为这件事写过一个字。`,
    'wf.apps': `通过 MCP、API 和命令行，接入团队已经在用的工具和 Agent`,
    'wf.apps.agents': `Claude 与自建 Agent`,

    'vis.kicker': `R1 最终想做到`, 'vis.h2': `让团队的信息自己保持最新。`, 'vis.note': `长期设想，第一版不会全部做到。`,
    'vis.1.h': `知识自己长出来`, 'vis.1.p': `没有人专门写文档，团队知识库却每天都在更新。`,
    'vis.2.h': `任务自己有人跟`, 'vis.2.p': `到期会提醒，有人说“做完了”，任务自动完成。`,
    'vis.3.h': `口头变更自动传到位`, 'vis.3.p': `口头改了日期，项目计划、相关任务和同事都会跟着更新。`,
    'vis.4.h': `Agent 接着往下做`, 'vis.4.p': `Agent 读得到刚定下的事，直接接着推进。`,
    'vis.5.h': `每周一份待跟进清单`, 'vis.5.p': `这周口头定了什么、哪些事还没人跟，一目了然。`,

    'pv.kicker': `隐私设计 · 概念阶段`, 'pv.h2': `一直在线，但只为同意加入的人。`,
    'pv.lead': `R1 只用于工作场景：工位和会议室。下面是我们设计时遵循的隐私原则，目前都还没有做出来。`,
    'state.ready': `就绪`, 'state.input': `工作中`, 'state.mute': `已静音`,
    'pv.cap.ready': `绿灯呼吸 · R1 已就绪。`, 'pv.cap.input': `黄灯常亮 · 正在为已加入成员工作。`, 'pv.cap.mute': `灯灭 · 拨槽露出橙色标记，已物理静音。`,
    'pv.1.h': `先给对话里的人看`, 'pv.1.p': `记录默认只有对话里的人能看到，其中一人分享后才进入团队。`,
    'pv.2.h': `只认已加入的声音`, 'pv.2.p': `设计目标是只保留已加入成员说的话；访客和未加入的同事直接丢弃，不转写，不保存。`,
    'pv.3.h': `管理者拿不到原始音频`, 'pv.3.p': `管理者可以管理成员和设置，但看不到原始录音。`,
    'pv.4.h': `物理静音开关和指示灯`, 'pv.4.p': `侧面有实体静音开关，顶部有一盏在场每个人都看得见的灯。`,
    'pv.5.h': `录音留在你的 Mac 上`, 'pv.5.p': `录音在自己的 Mac 上处理，不上传；上传的只有已加入成员的话转成的文字。任何人都可以删除自己参与的记录。`,
    'pv.6.h': `不用于训练模型`, 'pv.6.p': `团队的内容不会用来训练 AI 模型。`,

    'hw.kicker': `硬件`, 'hw.h2': `R1：插上就好，不打扰你。`,
    'hw.lead': `一根薄长条铝制麦克风，贴着 Mac 侧边插在 USB-C 口上，由 Mac 供电：没有电池，不用充电，也没有“开始录音”按钮。`,
    'hw.tab.finish': `配色`, 'hw.tab.fit': `侧面贴合`, 'hw.tab.switch': `静音`, 'hw.tab.explore': `3D 视图`,
    'finish.silver': `R1 · 银色`, 'finish.sky': `R1 · 天蓝色`, 'finish.starlight': `R1 · 星光色`, 'finish.midnight': `R1 · 午夜色`,
    'hw.fit.title': `滑动装上`,
    'fit.unplugged': `未插入`, 'fit.aligning': `对准中`, 'fit.connected': `已插入`, 'fit.retry': `请重试`,
    'hw.sw.title': `一个实体开关`,
    'sw.mute': `滑动静音`, 'sw.unmute': `滑动取消静音`,
    'sw.read.ready': `R1 就绪时，顶部的灯缓慢呼吸绿光。`,
    'sw.read.input': `为已加入成员工作时，灯保持黄色常亮。`,
    'sw.read.mute': `灯熄灭，拨槽内露出橙色标记。`,
    'hw.ex.title': `转一转`, 'hw.ex.ports': `收音孔`, 'hw.ex.switch': `开关`, 'hw.ex.reset': `复位`,
    'ex.intro': `拖动旋转，或选择一个细节。`, 'ex.introStill': `选择一个细节，看看 R1 的结构。`,
    'ex.home': `R1 · 银色`,
    'ex.ports': `一枚收音孔朝向掌托，另一枚在长侧面中段，相距 15.5 mm，构成约 15.7 mm 的双麦基线。`,
    'ex.plug': `USB-C 插头从 Mac 取电，并通过同一接口传回音频。`,
    'ex.mute': `拨动开关即可静音，拨槽里会露出橙色标记，一眼看得出状态。`,
    'spec.summary': `技术参数（概念目标）`,
    'spec.model': `型号`, 'spec.host': `参考机型`, 'spec.host.v': `13 英寸 MacBook Air（M4）`,
    'spec.body': `机身`, 'spec.body.v': `32.0 × 5.4 × 5.5 mm 铝合金`,
    'spec.mic': `收音孔`, 'spec.mic.v': `两枚 Ø 0.40 mm 微孔，相距 15.7 mm`,
    'spec.ctrl': `控制`, 'spec.ctrl.v': `实体静音开关 + 状态灯`,
    'spec.power': `供电`, 'spec.power.v': `由 Mac 的 USB-C 供电 · 无电池`,
    'spec.finish': `配色`, 'spec.finish.v': `银色、天蓝色、星光色、午夜色`,
    'spec.where': `使用场景`, 'spec.where.v': `工位和会议室`,
    'spec.note': `以上为工业设计渲染图，目前还没有实物样机。`,
    'hw.gallery': `查看完整产品图集 ↗`,

    'price.kicker': `测试价格 · 概念验证`, 'price.h2': `我们目前设想的价格`,
    'price.p': `我们现在不卖任何东西，不收钱，也不做预订。先公开测试价格，是想听你真实判断：R1 对你的团队值不值。`,
    'price.1': `R1 设备`, 'price.1.u': `/ 台`, 'price.2': `Rutta 团队空间`, 'price.2.u': `/ 人 / 月`,
    'price.3': `示例：5 人团队`, 'price.3.u': `第一年合计`,

    'faq.h2': `常见问题`,
    'faq.1.q': `现在能买到 R1 吗？`, 'faq.1.a': `还不能。R1 目前是概念阶段，页面上是渲染图和示意场景，还没有样机。我们想先和团队聊一聊，再决定要不要做。`,
    'faq.2.q': `会有 App 和管理后台吗？`, 'faq.2.a': `会有。R1 会配合 Rutta App 和团队空间使用：成员在这里绑定声纹、查看和确认记录、浏览团队知识；管理员在这里管理成员、权限和集成。和 R1 一样，目前也处于概念阶段。`,
    'faq.3.q': `访客或没有加入的同事怎么办？`, 'faq.3.a': `R1 会把听到的声音和已加入成员的声纹比对。设计目标是：对不上的声音直接丢弃，不转写、不保存。很短的句子和人数较多的团队，还是我们正在解决的问题。`,
    'faq.4.q': `为什么要做硬件，而不是只做 Mac 软件？`, 'faq.4.a': `纯软件在锁屏或合盖后可能无法运行，系统的录音提示会一直亮着，还可能和其他应用抢麦克风。R1 插在 USB-C 上由 Mac 供电，只在你用 Mac 工作时在线。`,
    'faq.5.q': `沉淀下来的内容会去哪里？`, 'faq.5.a': `先进入 Rutta 团队知识库，再通过 MCP、API 和命令行分发到团队已经在用的文档、任务工具、聊天工具和 Agent。内容始终属于团队。`,
    'faq.6.q': `留下邮箱之后会怎样？`, 'faq.6.a': `我们偶尔会用邮件同步进展。如果你的团队是 3–15 人、在一起办公，我们可能会邀请你做一次 15 分钟的交流（视频、电话或邮件），聊聊团队最近一次漏掉决定的经历。`,

    'wl.kicker': `抢先体验`, 'wl.h2': `R1 适合你的团队吗？`,
    'wl.p': `我们正在和 3–15 人、在一起办公的创业团队交流。留下邮箱，也可以和我们说说团队最近一次漏掉决定的经历。`,
    'wl.pt1': `免费 · 不收钱`, 'wl.pt2': `可选 15 分钟交流`, 'wl.pt3': `随时退订`,
    'wl.contact': `想单独发给同事？<a href="contact.html" target="_blank" rel="noopener" data-track="waitlist_contact">打开独立留资页 ↗</a>`,
    'f.email': `工作邮箱`, 'f.scenario': `R1 最能在哪个场景帮到你的团队？`,
    'f.sc1': `工位旁的讨论与决定`, 'f.sc2': `站会与任务跟进`, 'f.sc3': `团队知识与交接`, 'f.sc4': `让 Agent 接上团队工作`, 'f.sc5': `其他`,
    'f.other': `描述你的场景`, 'f.other.ph': `例如：客户沟通、设计评审、创始人同步`,
    'f.name': `称呼`, 'f.opt': `（选填）`, 'f.name.ph': `怎么称呼你`,
    'f.team': `团队规模`, 'f.team.0': `选择团队规模`, 'f.team.1': `1–2 人`, 'f.team.2': `3–15 人`, 'f.team.3': `16–50 人`, 'f.team.4': `50 人以上`,
    'f.notes': `你的建议，或团队最近一次漏掉的决定`,
    'f.notes.ph': `例如：“在工位上说好推迟上线，结果一半同事都不知道。”`,
    'f.consent': `用邮件告诉我 R1 的进展，并邀请我参加可选的 15 分钟交流。`,
    'f.privacy': `隐私说明`, 'f.submit': `加入候补名单`,
    'note.default': `概念阶段 · 免费，不收钱也不预订。`,
    'err.email': `请输入有效的工作邮箱。`, 'err.usecase': `请选择 R1 最能帮到你的场景。`, 'err.other': `请简单描述一下你的场景。`,
    'err.consent': `请勾选同意，方便我们给你发邮件。`, 'err.generic': `出了点问题，请稍后再试。`,
    'th.badge': `已加入候补名单。`, 'th.remote': `我们会同步进展，也可能邀请你做一次 15 分钟的交流。`,
    'th.local': `预览模式：数据暂存在本浏览器，正式后端接入后才会提交。`,
    'th.h3': `再问一个小问题`, 'th.sub': `选填，但会直接影响我们是否做 R1。`,
    'sv.legend': `按每台 79 美元 + 每人每月 12 美元（5 人团队第一年约 1,115 美元），你觉得 R1：`,
    'sv.o1': `值得评估`, 'sv.o2': `太贵了`, 'sv.o3': `更想要纯软件`, 'sv.o4': `更想手动开启`,
    'sv.chat': `愿意聊 15 分钟吗？`, 'sv.c0': `请选择`, 'sv.c1': `愿意，视频或电话`, 'sv.c2': `愿意，邮件交流`, 'sv.c3': `只想收到进展`,
    'sv.send': `提交`, 'sv.done': `谢谢，这对我们很有帮助。`,
    'sh.text': `身边有需要的团队？`, 'sh.btn': `复制邀请链接`, 'sh.copied': `已复制 ✓`,

    'foot.tag': `插在 Mac 上的团队记忆：团队说过的话，变成团队的知识。`,
    'foot.c1': `产品`, 'foot.c2': `了解更多`, 'foot.c3': `参与`, 'foot.faq': `价格与常见问题`,
    'foot.legal': `Rutta R1 · 概念阶段 · 渲染图与示意场景`, 'foot.top': `回到顶部 ↑`,

    'dlg.1': `<strong>我们收集什么：</strong>只收集你主动提交的内容——邮箱、使用场景、选填的称呼、团队规模和备注，以及选填的问卷回答；如果链接带有渠道参数（UTM/ref），也会一并记录。`,
    'dlg.2': `<strong>我们怎么用：</strong>只用于同步 R1 的进展，以及在你同意时邀请你做一次简短的交流。我们不会出售或出租你的信息。`,
    'dlg.3': `<strong>R1 的隐私原则（概念阶段）：</strong>记录先由参与者确认再分享；只保留已加入成员的声音；管理者拿不到原始音频；实体静音开关和状态灯；录音在你的 Mac 上处理；团队内容不用于训练模型。`,
    'dlg.4': `<strong>退订与删除：</strong>每封邮件都有一键退订链接，你也可以随时要求我们删除你的记录。`,

    'ct.back': `← 返回首页`, 'ct.kicker': `R1 · 联系我们与抢先体验`,
    'ct.lead': `R1 把团队在工作中说过的话，变成团队的知识和有人跟进的任务：自动记录，由说话的人确认，再送到你们已经在用的工具和 Agent 里。`,
    'ct.cap': `R1 概念渲染图 · 暂无样机`,
    'ct.f1.t': `我们想聊的团队`, 'ct.f1.d': `3–15 人、在一起办公，靠工位讨论、站会和随时沟通推进工作的创业团队。`,
    'ct.f2.t': `测试价格`, 'ct.f2.d': `约 <strong>每台 79 美元</strong> + <strong>每人每月 12 美元</strong>（5 人团队第一年约 1,115 美元）。现在不收任何费用。`,
    'ct.f3.t': `媒体、合作与其他问题`, 'ct.f3.d': `在表单里选择<strong>其他</strong>，并在备注里写下你的问题，我们会认真看每一条。`,
    'ct.f4.t': `硬件细节`, 'ct.f4.d': `在<a href="https://lululuchen1109-commits.github.io/rutta-bar-studio/product.html?v=040" target="_blank" rel="noopener">产品图集 ↗</a>里查看每一个角度。`
  };

  const captured = {};
  let lang = 'en';
  try {
    const q = new URLSearchParams(location.search).get('lang');
    lang = (q === 'zh' || q === 'en') ? q : (localStorage.getItem('rutta-lang') || 'en');
  } catch {}
  if (lang !== 'zh') lang = 'en';

  function t(key, fallback) {
    if (lang === 'zh' && ZH[key] != null) return ZH[key];
    if (EN[key] != null) return EN[key];
    if (captured[key] != null) return captured[key];
    return fallback != null ? fallback : key;
  }

  function capture() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.dataset.i18n;
      if (captured[k] == null) captured[k] = el.innerHTML;
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const k = el.dataset.i18nPh;
      if (captured[k] == null) captured[k] = el.getAttribute('placeholder') || '';
    });
    document.querySelectorAll('[data-i18n-dph]').forEach(el => {
      const k = el.dataset.i18nDph;
      if (captured[k] == null) captured[k] = el.dataset.placeholder || '';
    });
    const titleEl = document.querySelector('title[data-i18n-title]');
    if (titleEl && captured[titleEl.dataset.i18nTitle] == null) captured[titleEl.dataset.i18nTitle] = titleEl.textContent;
  }

  function apply() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.querySelectorAll('[data-i18n]').forEach(el => { el.innerHTML = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.setAttribute('placeholder', t(el.dataset.i18nPh)); });
    document.querySelectorAll('[data-i18n-dph]').forEach(el => { el.dataset.placeholder = t(el.dataset.i18nDph); });
    const titleEl = document.querySelector('title[data-i18n-title]');
    if (titleEl) document.title = t(titleEl.dataset.i18nTitle);
    document.querySelectorAll('[data-lang]').forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang)));
    document.dispatchEvent(new CustomEvent('ruttalang', { detail: { lang } }));
  }

  window.ruttaT = t;
  window.ruttaLang = () => lang;
  window.ruttaSet = (el, key) => {
    if (!el) return;
    el.dataset.i18n = key;
    el.innerHTML = t(key);
  };

  capture();
  apply();

  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.lang === lang) return;
      lang = btn.dataset.lang;
      try { localStorage.setItem('rutta-lang', lang); } catch {}
      apply();
      window.ruttaTrack?.('language_switch', { lang });
    });
  });
})();
