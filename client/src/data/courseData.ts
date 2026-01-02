
import { Chapter, LessonContent } from '@/types';

const IMAGES = {
  OPENER: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2000&auto=format&fit=crop',
  PARADIGM: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop',
  PROACTIVE: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop',
  BEGIN: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?q=80&w=2000&auto=format&fit=crop',
  FIRST: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=2000&auto=format&fit=crop',
  WIN: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2000&auto=format&fit=crop',
  LISTEN: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=2000&auto=format&fit=crop',
  SYNERGY: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2000&auto=format&fit=crop',
  RENEWAL: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=2000&auto=format&fit=crop',
};

export const courseData: Chapter[] = [
  {
    id: 'c0',
    title: '启航：开营仪式',
    desc: '相识、启程、明确方向与约定',
    isLocked: false,
    lessons: [
      {
        id: 'l0',
        day: 1,
        title: '开营仪式',
        duration: '20 min',
        totalSeconds: 1200,
        image: IMAGES.OPENER,
        points: [
          { icon: 'celebration', title: '欢迎启程', desc: '21天晨读之旅正式开始' },
          { icon: 'handshake', title: '相识约定', desc: '明确方向，建立连接' }
        ],
        quote: { text: "如果你想改变现状，首先要改变你看待现状的方式。", author: "史蒂芬·柯维" },
        content: `### 欢迎来到凡人晨读\n\n**21天约定：**\n1. 每日早起，给自己15分钟的晨读时光\n2. 用觉察日记记录内心的发现\n3. 与书友互相看见，彼此支持\n\n**愿这21天成为你生命中的一座灯塔。**`
      }
    ]
  },
  {
    id: 'c1',
    title: '第一周：看见内在的基础',
    desc: '范式转换：由内而外',
    isLocked: false,
    lessons: [
      {
        id: 'l1',
        day: 2,
        title: '品德成功论',
        duration: '15 min',
        totalSeconds: 900,
        image: IMAGES.PARADIGM,
        points: [
          { icon: 'visibility', title: '看见焦点', desc: '我们人生的根基是什么？' },
          { icon: 'change_circle', title: '品德塑造命运', desc: '只有遵循原则才能享受真正的成功' }
        ],
        quote: { text: "没有正确的生活，就没有真正卓越的人生。", author: "戴维·斯塔·乔丹" },
        content: `### 静一静\n开始学习之前，给自己1分钟的时间，深呼吸，静静心，然后开始学习。\n\n### 问一问\n**带着问题学习**\n什么是品德成功论？\n\n### 学一学\n阅读《高效能人士的七个习惯》原本\n第一章 由内而外全面造就自己\n《品德与个人魅力孰重》\n《光有技巧还不够》\n\n### 读一读\n**品德成功论 由内而外全面造就自己**\n1. 品德成功论提醒人们，高效能的生活是有基本原则的。只有当人们学会并遵循这些原则，把它们融入到自己的品格中去，才能享受真正的成功与恒久的幸福。\n2. 没有正确的生活，就没有真正卓越的人生。\n——戴维·斯塔·乔丹(David Starr Jordan)｜美国生物学家及教育家\n3. 在25年的工作经历中，我与商界、大学和婚姻家庭各个领域的人共事。和其中一些外表看来很成功的人深入接触后，我却发现他们常在与内心的渴望斗争，他们确实需要协调和高效，以及健康向上的人际关系。\n4. 我想从下面他们和我分享的这些例子中，你应该能找到共鸣：\n5. 我的事业十分成功，但却牺牲了个人生活和家庭生活。不但与妻儿形同陌路，甚至无法肯定自己是否真正了解自己，是否了解什么才是生命中最重要的。\n6. 我很忙，确实很忙，但有时候我自己也不清楚是否有价值。我希望生活得有意义，能对世界有所贡献。\n7. 我上过无数关于有效管理的课程，我对员工的期望值很高，也想尽办法善待他们，但就是感觉不到他们的忠心。我想如果我有一天生病在家，他们一定会无所事事，闲聊度日。为什么我无法把他们训练得独立而负责呢？为什么我总是找不到这样的员工呢？\n8. 要做的事太多了，我总是感到时间不够用，觉得压力沉重，终日忙忙碌碌，一周7天，天天如此。我参加过时间管理研讨班，也尝试过各种安排进度计划的工具。虽然也有点帮助，但我仍然觉得无法像我希望的那样，过上快乐、高效而平和的生活。\n9. 看到别人有所成就，或获得某种认可，表面上我会挤出微笑，热切地表示祝贺，可是，内心却难受得不得了。为什么我会有这种感觉？\n10. 我个性很强。几乎在任何交往中，我都能控制结果。多数情况下，我甚至可以设法影响他人通过我想要的决议。我仔细考虑了每种情况，并且坚信我的建议通常都是对大家最好的。但是我仍感到不安，我很想知道，他人对我的为人和建议到底是何态度。\n11. 我的婚姻已变得平淡无趣。我们并没有恶言相向，更没有大打出手，只是不再有爱的感觉。我们请教过婚姻顾问，也试过许多办法，但看来就是无法重新燃起往日的爱情火花。\n12. 我那十来岁的儿子不听话，还打架。不管我怎么努力，他就是不听我的话，我该怎么办呢？\n13. 我想教育孩子懂得工作的价值。但每次要他们做点什么，都要时时刻刻在旁监督，还得忍受他们不时地抱怨，结果还不如自己动手来得简单。为什么孩子们就不能不要我提醒，快快乐乐地料理自己的事呢？\n14. 我又开始节食了——今年的第五次。我知道自己体重超标，也确实想有所改变。我阅读所有最新的资料，确定目标，并采取积极的态度激励自己，但我就是做不到，几周后就溃败了。看来我就是无法信守诺言。\n15. 这些都是我在任职咨询顾问和大学教师期间遇到的一些普遍而又深层次的问题，不是一两天就能解决的。\n16. 几年前，我和妻子桑德拉就为类似的问题大伤脑筋。我们的一个儿子学习成绩很差，甚至看不懂试卷上的问题。他与同学交往时也很不成熟，经常弄得周围的人很尴尬。他又瘦又小，动作也不协调。打棒球时，他往往在投手投球之前就挥动了球棒，招来他人的嘲笑。\n17. 我和桑德拉觉得，若要十全十美，首先要做完美的父母。于是我们尝试用积极的态度来激发他的自信心：“加油，孩子，你能办得到！我们知道你行！手握高一点，看着球，等球快到面前再挥棒。”只要他稍有进步，我们就大为夸奖一番以增强他的信心：“干得好，孩子，继续。”\n18. 尽管如此，还是引来了嘲笑，我们对此大加斥责：“别笑，他还在学习呢。”而这时我们的儿子却总是哭着说：“我永远也学不好，我根本就不喜欢棒球！”\n19. 所有的努力似乎都徒劳无功，那时我们真是心急如焚，看得出来这一切反而伤害了他的自尊心。开始我们总能对他加以肯定、鼓励和帮助，可是一再失败后，还是放弃了，只能试着从另一个角度来看待。\n20. 后来，在讲授有关沟通与认知的课程中，我对思维方式的形成、思维方式如何影响观点、观点又如何左右行为等问题深感兴趣，并进一步研究了期望理论(Expectancy Theory)、自我实现预言(Self-fulfilling Prophecy)和皮格马利翁效应(Pygmalion Effect)。从中我意识到，每个人的思维方式都是那么根深蒂固，仅仅研究世界是不够的，还要研究我们看世界时所戴的“透镜”，因为这透镜（即思维方式）往往左右着我们对世界的看法。\n21. 我跟桑德拉谈到这些想法，并借此分析我们的困境，终于认识到我们对儿子往往言不由衷。自省后我们承认，内心深处的确觉得儿子在某些方面“不如常人”。所以不论我们多么注意自己的态度与行为，其效果都是有限的，因为表面的言行终究掩饰不住其背后的信息，那就是：“你不行，你需要父母的保护。”\n22. 此时我们才开始觉悟：要改变现状，首先要改变自己；要改变自己，先要改变我们对问题的看法。\n\n### 想一想\n上文中，哪一句话特别触动我？引起了我哪些感触？\n\n### 记一记\n把自己的感触记录在下面的打卡日记上（觉察日记），在早上的晨读营里分享。\n\n### 摘一摘\n从上文中，摘抄出一句金句，分享到晨读营的微信群中。\n\n### 说一说\n把今天的心得收获和书友、亲友说一说。你会惊讶地发现，人们以往对你的消极看法和贴在你身上的标签会慢慢消失不见。`
      },
      {
        id: 'l2',
        day: 3,
        title: '思维方式的力量',
        duration: '18 min',
        totalSeconds: 1080,
        image: IMAGES.PARADIGM,
        points: [
          { icon: 'visibility', title: '看见焦点', desc: '是什么塑造了我们看待世界的"眼镜"？' },
          { icon: 'psychology', title: '条件作用', desc: '经历塑造我们看世界的方式' }
        ],
        quote: { text: "立场决定观点。", author: "史蒂芬·柯维" },
        content: `### 思维方式的力量\n\n1. 思维方式(Paradigm)是我们"看"世界的方法，由每个人的成长背景、经验及选择打造而成。\n\n2. 我们可以把思维方式比作地图。**根本问题不在于你的行为和态度，而在于那张错误的"地图"。**`
      },
      {
        id: 'l3',
        day: 4,
        title: '以原则为中心的思维方式',
        duration: '15 min',
        totalSeconds: 900,
        image: IMAGES.PARADIGM,
        points: [
          { icon: 'visibility', title: '看见焦点', desc: '除了个人立场，还有哪些更可靠的"灯塔"？' },
          { icon: 'lightbulb', title: '原则如灯塔', desc: '不容动摇的自然法则' }
        ],
        quote: { text: "我们不可能打破法则，只能在违背法则的时候让自己头破血流。", author: "塞西尔·B. 德米尔" },
        content: `### 以原则为中心的思维方式\n\n1. **原则如灯塔，是不容动摇的自然法则。**\n\n2. 只有"灯塔"式指引人类成长和幸福的原则才是"客观的事实"。一个人的思维方式越符合这些原则，就越能正确而高效地生活。`
      },
      {
        id: 'l4',
        day: 5,
        title: '成长和改变的原则',
        duration: '18 min',
        totalSeconds: 1080,
        image: IMAGES.PARADIGM,
        points: [
          { icon: 'visibility', title: '看见焦点', desc: '成长像爬楼梯还是像种树？' },
          { icon: 'trending_up', title: '循序渐进', desc: '成长不能跳过关键步骤' }
        ],
        quote: { text: "千里之行，始于足下。", author: "老子" },
        content: `### 成长和改变的原则\n\n1. **人的一生包含了许多成长和进步阶段，必须循序渐进。** 每一步都十分重要，不能跳过。\n\n2. **承认自己的无知往往是求知的第一步。**`
      },
      {
        id: 'l5',
        day: 6,
        title: '品德是习惯的合成',
        duration: '15 min',
        totalSeconds: 900,
        image: IMAGES.PROACTIVE,
        points: [
          { icon: 'visibility', title: '看见焦点', desc: '"性格决定命运"是真的吗？' },
          { icon: 'loop', title: '习惯的力量', desc: '知识+技巧+意愿' }
        ],
        quote: { text: "人的行为总是一再重复。因此卓越不是一时的行为，而是习惯。", author: "亚里士多德" },
        content: `### 品德是习惯的合成\n\n1. **思想决定行动，行动决定习惯，习惯决定品德，品德决定命运。**\n\n2. 本书将习惯定义为"知识"、"技巧"与"意愿"相互交织的结果。三者缺一不可。`
      },
      {
        id: 'l6',
        day: 7,
        title: '成熟模式图',
        duration: '20 min',
        totalSeconds: 1200,
        image: IMAGES.PROACTIVE,
        points: [
          { icon: 'visibility', title: '看见焦点', desc: '我们在生命成长的哪个阶段？' },
          { icon: 'groups', title: '互赖期', desc: '以"我们"为核心' }
        ],
        quote: { text: "人生本来就是高度互赖的。", author: "史蒂芬·柯维" },
        content: `### 成熟模式图\n\n1. 成熟的三个阶段：\n   - **依赖期**：以"你"为核心——你照顾我\n   - **独立期**：以"我"为核心——我可以做到\n   - **互赖期**：以"我们"为核心——群策群力\n\n2. **只有独立的人才能选择互赖。**`
      },
      {
        id: 'l7',
        day: 8,
        title: '积极主动的定义',
        duration: '20 min',
        totalSeconds: 1200,
        image: IMAGES.PROACTIVE,
        points: [
          { icon: 'visibility', title: '看见焦点', desc: '那份宝贵的"选择自由"我们看见并运用了吗？' },
          { icon: 'touch_app', title: '习惯一', desc: '积极主动' }
        ],
        quote: { text: "除非你愿意，否则没人能伤害你。", author: "埃莉诺·罗斯福" },
        content: `### 习惯一：积极主动\n\n1. 积极主动意味着人一定要对自己的人生负责。个人行为取决于自身的抉择，而不是外在的环境。\n\n2. **伤害我们的并非悲惨遭遇本身，而是我们对于悲惨遭遇的回应。**`
      }
    ]
  },
  {
    id: 'c2',
    title: '第二周：掌握选择与方向',
    desc: '从依赖到独立：个人领域的成功',
    isLocked: false,
    lessons: [
      {
        id: 'l8',
        day: 9,
        title: '爱是动词',
        duration: '15 min',
        totalSeconds: 900,
        image: IMAGES.PROACTIVE,
        points: [
          { icon: 'visibility', title: '看见焦点', desc: '如何主动去"爱"？' },
          { icon: 'favorite', title: '积极主动深化', desc: '爱是行动，而非感觉' }
        ],
        quote: { text: "爱是动词。", author: "史蒂芬·柯维" },
        content: `### 爱是动词\n\n1. 爱不仅仅是一种感觉，更是一种**行动**。\n\n2. 积极主动的人选择去爱，而不是等待爱的感觉来临。**爱是服务、牺牲和奉献的行为。**`
      },
      {
        id: 'l9',
        day: 10,
        title: '关注圈与影响圈',
        duration: '15 min',
        totalSeconds: 900,
        image: IMAGES.PROACTIVE,
        points: [
          { icon: 'visibility', title: '看见焦点', desc: '我们的时间和精力，聚焦在哪？' },
          { icon: 'center_focus_strong', title: '影响圈', desc: '专注于你可以改变的事情' }
        ],
        quote: { text: "上帝赐予我平静，去接受我无法改变的；赐予我勇气，去改变我能改变的。", author: "莱因霍尔德·尼布尔" },
        content: `### 关注圈与影响圈\n\n1. **关注圈**：我们关心但无法控制的事物。\n2. **影响圈**：我们可以影响和改变的事物。\n\n**只要我们专注于影响圈，我们的影响力就会扩大。**`
      },
      {
        id: 'l10',
        day: 11,
        title: '以终为始',
        duration: '18 min',
        totalSeconds: 1080,
        image: IMAGES.BEGIN,
        points: [
          { icon: 'visibility', title: '看见焦点', desc: '如何从终点回看，设计我的人生？' },
          { icon: 'explore', title: '习惯二', desc: '以终为始' }
        ],
        quote: { text: "管理是把事情做对，领导是做对的事情。", author: "彼得·德鲁克" },
        content: `### 习惯二：以终为始\n\n1. **所有事物都经过两次创造**——先是在脑海里酝酿，其次才是实际的创造。\n\n2. 想象自己的葬礼，你希望人们怎样评价你？这可以帮助你找到人生最终的价值。`
      },
      {
        id: 'l11',
        day: 12,
        title: '领导与管理',
        duration: '18 min',
        totalSeconds: 1080,
        image: IMAGES.BEGIN,
        points: [
          { icon: 'visibility', title: '看见焦点', desc: '我们是自己人生的"领导者"吗？' },
          { icon: 'flag', title: '二次创造', desc: '领导是第一创造' }
        ],
        quote: { text: "领导力是将愿景传达给他人的艺术。", author: "史蒂芬·柯维" },
        content: `### 领导与管理\n\n1. **领导是第一创造**（做正确的事），**管理是第二创造**（正确地做事）。\n\n2. 很多人忙于攀登成功的阶梯，却在到达顶端时发现梯子搭错了墙。`
      },
      {
        id: 'l12',
        day: 13,
        title: '改写人生剧本',
        duration: '15 min',
        totalSeconds: 900,
        image: IMAGES.BEGIN,
        points: [
          { icon: 'visibility', title: '看见焦点', desc: '如何成为自己人生的编剧？' },
          { icon: 'edit', title: '个人使命宣言', desc: '改写你的剧本' }
        ],
        quote: { text: "原则是由于我们内心的指南针指引的方向。", author: "史蒂芬·柯维" },
        content: `### 改写人生剧本\n\n1. 我们可以重新审视那些童年时期形成的剧本，并**选择改写它们**。\n\n2. 撰写个人使命宣言是改写剧本的有力工具。`
      },
      {
        id: 'l13',
        day: 14,
        title: '各种生活中心',
        duration: '15 min',
        totalSeconds: 900,
        image: IMAGES.BEGIN,
        points: [
          { icon: 'visibility', title: '看见焦点', desc: '我的生活是以什么为中心运转的？' },
          { icon: 'anchor', title: '以原则为中心', desc: '获得真正的安全感' }
        ],
        quote: { text: "只有以原则为中心的生活，才能带来真正的安全感。", author: "史蒂芬·柯维" },
        content: `### 各种生活中心\n\n可能的生活中心：配偶、家庭、金钱、工作、名利、享乐、朋友、敌人、教会、自我...\n\n**只有以原则为中心，才能获得持久的安全感、智慧、力量和指引。**`
      },
      {
        id: 'l14',
        day: 15,
        title: '别让琐事牵着鼻子走',
        duration: '20 min',
        totalSeconds: 1200,
        image: IMAGES.FIRST,
        points: [
          { icon: 'visibility', title: '看见焦点', desc: '如何区分重要和紧急的事？' },
          { icon: 'grid_view', title: '习惯三', desc: '要事第一' }
        ],
        quote: { text: "要事第一，意即把最重要的事情放在第一位。", author: "史蒂芬·柯维" },
        content: `### 习惯三：要事第一\n\n**时间管理矩阵：**\n- 第一象限：紧急且重要\n- 第二象限：重要不紧急 ← **高效能人士专注这里**\n- 第三象限：紧急不重要\n- 第四象限：不紧急不重要`
      }
    ]
  },
  {
    id: 'c3',
    title: '第三周：深化关系与持续更新',
    desc: '从独立到互赖：公众领域的成功',
    isLocked: false,
    lessons: [
      {
        id: 'l15',
        day: 16,
        title: '一对一的人际关系',
        duration: '15 min',
        totalSeconds: 900,
        image: IMAGES.WIN,
        points: [
          { icon: 'visibility', title: '看见焦点', desc: '人际关系的"银行账户"是什么？' },
          { icon: 'savings', title: '情感账户', desc: '存入信任' }
        ],
        quote: { text: "信任是人际关系的基石。", author: "史蒂芬·柯维" },
        content: `### 情感账户\n\n**六种主要的存款：**\n1. 理解他人\n2. 注意小节\n3. 信守承诺\n4. 明确期望\n5. 正直诚信\n6. 勇于道歉`
      },
      {
        id: 'l16',
        day: 17,
        title: '哪一种最好？',
        duration: '20 min',
        totalSeconds: 1200,
        image: IMAGES.WIN,
        points: [
          { icon: 'visibility', title: '看见焦点', desc: '除了"你输我赢"，还有哪些选择？' },
          { icon: 'balance', title: '习惯四', desc: '双赢思维' }
        ],
        quote: { text: "双赢不是技巧，而是人际交往的哲学。", author: "史蒂芬·柯维" },
        content: `### 习惯四：双赢思维\n\n人际交往的六种模式：\n1. 我赢你输\n2. 我输你赢\n3. 双输\n4. **双赢** ← 最佳选择\n5. 独善其身\n6. 双赢或不合作`
      },
      {
        id: 'l17',
        day: 18,
        title: '双赢品德',
        duration: '18 min',
        totalSeconds: 1080,
        image: IMAGES.WIN,
        points: [
          { icon: 'visibility', title: '看见焦点', desc: '实现双赢需要哪些内在品德？' },
          { icon: 'trending_up', title: '富足心态', desc: '相信世界有足够的资源' }
        ],
        quote: { text: "生活不是网球赛，只能有一方赢。", author: "史蒂芬·柯维" },
        content: `### 双赢品德\n\n实现双赢需要三种品德：\n1. **正直**——信守承诺\n2. **成熟**——勇气与体谅的平衡\n3. **富足心态**——相信有足够的资源`
      },
      {
        id: 'l18',
        day: 19,
        title: '移情聆听',
        duration: '22 min',
        totalSeconds: 1320,
        image: IMAGES.LISTEN,
        points: [
          { icon: 'visibility', title: '看见焦点', desc: '我们是真的在"听"吗？' },
          { icon: 'hearing', title: '习惯五', desc: '知彼解己' }
        ],
        quote: { text: "先去理解别人，再寻求被别人理解。", author: "史蒂芬·柯维" },
        content: `### 习惯五：知彼解己\n\n聆听的层次：\n1. 忽略\n2. 假装在听\n3. 选择性聆听\n4. 专注聆听\n5. **移情聆听** ← 设身处地理解对方`
      },
      {
        id: 'l19',
        day: 20,
        title: '和而不同',
        duration: '25 min',
        totalSeconds: 1500,
        image: IMAGES.SYNERGY,
        points: [
          { icon: 'visibility', title: '看见焦点', desc: '如何创造出1+1>2的第三选择？' },
          { icon: 'hub', title: '习惯六', desc: '统合综效' }
        ],
        quote: { text: "统合综效是自然界最了不起的活动。", author: "史蒂芬·柯维" },
        content: `### 习惯六：统合综效\n\n**统合综效(Synergy)是 1+1=3，甚至更多。**\n\n珍视差异：如果两个人意见永远一致，其中一个人就是多余的。`
      },
      {
        id: 'l20',
        day: 21,
        title: '转型者',
        duration: '18 min',
        totalSeconds: 1080,
        image: IMAGES.SYNERGY,
        points: [
          { icon: 'visibility', title: '看见焦点', desc: '如何将经验转化为智慧？' },
          { icon: 'auto_awesome', title: '螺旋上升', desc: '持续成长的循环' }
        ],
        quote: { text: "经历本身不是老师，反思经历才是。", author: "史蒂芬·柯维" },
        content: `### 转型者\n\n1. 我们可以选择成为**转型者**——打破消极循环，传递积极的能量。\n\n2. **经历 → 反思 → 智慧** 这是成长的螺旋。`
      },
      {
        id: 'l21',
        day: 22,
        title: '日日新生',
        duration: '20 min',
        totalSeconds: 1200,
        image: IMAGES.RENEWAL,
        points: [
          { icon: 'visibility', title: '看见焦点', desc: '如何持续为自己充电？' },
          { icon: 'self_improvement', title: '习惯七', desc: '不断更新' }
        ],
        quote: { text: "不断更新是保持和提高其他六个习惯的基础。", author: "史蒂芬·柯维" },
        content: `### 习惯七：不断更新\n\n**四个层面的更新：**\n1. **身体**：运动、营养、休息\n2. **精神**：价值观、冥想、自然\n3. **智力**：阅读、写作、规划\n4. **社会/情感**：服务、同理心、统合综效\n\n**磨刀不误砍柴工。**`
      }
    ]
  },
  {
    id: 'c4',
    title: '终点亦是起点：结营仪式',
    desc: '回顾、感恩、新的开始',
    isLocked: false,
    lessons: [
      {
        id: 'l22',
        day: 23,
        title: '结营仪式',
        duration: '25 min',
        totalSeconds: 1500,
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop',
        points: [
          { icon: 'celebration', title: '恭喜结营', desc: '完成21天晨读之旅' },
          { icon: 'auto_awesome', title: '新的起点', desc: '终点亦是起点' }
        ],
        quote: { text: "再次播种，再次收获。这不仅是成长的过程，更是通往伟大的必经之路。", author: "史蒂芬·柯维" },
        content: `### 结营仪式：终点亦是起点\n\n**恭喜你，完成了21天的晨读之旅！**\n\n**回顾七个习惯：**\n1. 积极主动\n2. 以终为始\n3. 要事第一\n4. 双赢思维\n5. 知彼解己\n6. 统合综效\n7. 不断更新\n\n原则就像灯塔，它是不会移动的。只有我们调整航向，对准灯塔，才能避开触礁的危险。\n\n**愿这套课程成为你心中的灯塔。再见，亦是开始。**`
      }
    ]
  }
];

export const getLessonById = (dayId: string | undefined): LessonContent | null => {
  if (!dayId) return null;

  for (const chapter of courseData) {
    const lesson = chapter.lessons.find(l => l.id === dayId);
    if (lesson) return lesson;
  }

  // Fallback: try finding by day number
  const dayNum = parseInt(dayId.replace(/\D/g, ''));
  if (!isNaN(dayNum)) {
    for (const chapter of courseData) {
      const lesson = chapter.lessons.find(l => l.day === dayNum);
      if (lesson) return lesson;
    }
  }

  return null;
};
