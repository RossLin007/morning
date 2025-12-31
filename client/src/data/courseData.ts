
import { Chapter, LessonContent } from '@/types';

const IMAGES = {
  START: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop', // Mountains/Sunrise
  PRIVATE: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop', // Sea/Calm
  PUBLIC: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2000&auto=format&fit=crop', // Handshake/Team
  RENEWAL: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=2000&auto=format&fit=crop', // Forest/Tree
};

export const courseData: Chapter[] = [
  {
    id: 'phase1',
    title: '第一阶段：启程',
    desc: '范式转换：由内而外',
    isLocked: false,
    lessons: [
      {
        id: 'p1-d1',
        day: 1,
        title: '开营：推倒那堵墙',
        duration: '15 min',
        totalSeconds: 900,
        image: IMAGES.START,
        points: [
          { icon: 'visibility', title: '看见差异', desc: '销售看的是地图，产品走的是疆域。' },
          { icon: 'change_circle', title: '由内而外', desc: '不要指望对方先改变，改变始于自己。' }
        ],
        quote: {
          text: "如果你想改变现状，首先要改变你看待现状的方式。",
          author: "Stephen R. Covey"
        },
        content: `
### 欢迎来到“从互斥到共生”之旅

你好，产品经理与销售总监。你们是企业的左脑与右脑，是引擎与方向盘。但在现实中，你们往往处于一种“冷战”甚至“热战”状态。

**销售说**：“客户要这个功能才能签单，产品为什么这么死板？”
**产品说**：“销售总是乱承诺，不仅打乱排期，还破坏产品架构。”

所有的摩擦，本质上是**思维范式（Paradigm）**的冲突。

### 范式转换：由内而外

如果你想让工作变得顺畅，你必须通过**范式转换**来改变你看待问题的方式。

我们习惯于“由外而内”：如果那个销售不乱承诺就好了；如果那个产品经理能做得更快就好了。这是一种受害者心态。

高效能人士遵循**“由内而外”**的原则。如果我想建立信任，我必须先值得信任；如果我想获得理解，我必须先理解他人。

### 今日修行

1.  **识别刻板印象**：拿出纸笔，诚实地写下你对搭档最大的一个“刻板印象”。
2.  **换位思考**：看着那行字，问自己：“如果我是他/她，背负着他/她的KPI和压力，我会怎么看这个问题？”
3.  **承诺**：在心中默默承诺，接下来的21天，暂停指责，开启倾听。
        `
      }
    ]
  },
  {
    id: 'phase2',
    title: '第二阶段：个人领域的成功',
    desc: '从依赖到独立：掌握核心力量',
    isLocked: false,
    lessons: [
      {
        id: 'p2-d2',
        day: 2,
        title: '习惯一：积极主动',
        duration: '20 min',
        totalSeconds: 1200,
        image: IMAGES.PRIVATE,
        points: [
          { icon: 'touch_app', title: '夺回选择权', desc: '刺激与回应之间，你有选择的自由。' },
          { icon: 'psychology', title: '拒绝情绪化', desc: '基于价值观回应，而非基于情绪。' }
        ],
        quote: {
          text: "除非你拱手相让，否则没人能剥夺你的自尊。",
          author: "Eleanor Roosevelt"
        },
        content: `
### 夺回情绪的遥控器

在工作中，我们经常面临突如其来的“刺激”：
*   **刺激**：客户突然变更需求，或者开发延期上线。
*   **消极回应**：愤怒、抱怨、推卸责任（“这没法干了！”）。

积极主动的人明白，在刺激与回应之间，有一段**距离**。在这段距离里，你可以选择你的回应。

### PM/销售 实战应用

面对客户的刁难或需求的变更，是与其对抗（反应型），还是寻找替代方案（主动型）？

*   **反应型语言**：“我不得不做”、“由于市场环境不好”、“他把我气疯了”。
*   **主动型语言**：“我可以选择”、“让我们看看有什么替代方案”、“我控制自己的情绪”。

今天，试着做情绪的主人。
        `
      },
      {
        id: 'p2-d3',
        day: 3,
        title: '关注圈与影响圈',
        duration: '15 min',
        totalSeconds: 900,
        image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80',
        points: [
          { icon: 'circle', title: '画出界限', desc: '区分什么是你无法控制的，什么是你可以改变的。' },
          { icon: 'center_focus_strong', title: '聚焦可控', desc: '在影响圈内深耕，你的能量会越来越大。' }
        ],
        quote: {
          text: "上帝赐予我平静，去接受我无法改变的；赐予我勇气，去改变我能改变的。",
          author: "Reinhold Niebuhr"
        },
        content: `
### 把精力花在刀刃上

积极的人专注**“影响圈”**，消极的人聚焦**“关注圈”**。

*   **关注圈（不可控）**：宏观经济下行、客户的坏脾气、竞争对手的动作、搭档的性格。
*   **影响圈（可控）**：你的产品方案、你的沟通话术、你的情绪状态、你的专业度。

如果你一直盯着关注圈，你会感到无力、焦虑，觉得自己是受害者。
如果你专注于影响圈，你会变得积极、自信，并通过自身的改变去逐渐影响周围的环境。

### 今日任务

列出当前最让你焦虑的 3 个工作问题。划掉那些你无法控制的，圈出你能影响的，并为后者制定一个微小的行动计划。
        `
      },
      {
        id: 'p2-d4',
        day: 4,
        title: '习惯二：以终为始',
        duration: '18 min',
        totalSeconds: 1080,
        image: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?q=80',
        points: [
          { icon: 'edit', title: '二次创造', desc: '所有事物都经过两次创造：头脑中与现实中。' },
          { icon: 'movie', title: '改写剧本', desc: '不要按照惯性或别人的剧本生活。' }
        ],
        quote: {
          text: "管理是把事情做对，领导是做对的事情。",
          author: "Peter Drucker / Stephen Covey"
        },
        content: `
### 你的梯子搭对墙了吗？

我们在忙碌中很容易陷入“活动陷阱”，忙于攀登成功的阶梯，却在到达顶端时发现梯子搭错了墙。

对于 PM 来说，不要为了开发功能而开发。你的“终”是用户价值的实现。
对于 Sales 来说，不要为了签单而签单。你的“终”是客户的长期成功。

### 撰写悼词

这是一个有些沉重但极具力量的练习。想象三年后，你负责的这个产品或项目结束了，或者你离开了这家公司。你希望同事、客户如何评价这段经历？

以此为愿景，来指导你今天的决策。这叫**以终为始**。
        `
      },
      {
        id: 'p2-d5',
        day: 5,
        title: '个人使命宣言',
        duration: '15 min',
        totalSeconds: 900,
        image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80',
        points: [
          { icon: 'explore', title: '心中罗盘', desc: '确立核心价值观，作为决策的锚点。' },
          { icon: 'stars', title: '宪法', desc: '建立个人的宪法，无论外界如何变化，原则不变。' }
        ],
        quote: {
          text: "原则是由于我们内心的指南针指引的方向。",
          author: "Stephen R. Covey"
        },
        content: `
### 确立你的宪法

一个国家有宪法，企业有愿景，个人也需要**使命宣言**。

在产品与销售的博弈中，如果你没有坚定的原则，你很容易变成“墙头草”——要么屈服于销售的压力做定制化，要么屈服于开发的压力砍需求。

### 寻找你的中心

你是以什么为生活中心的？
*   以金钱为中心？你会为了提成牺牲产品底线。
*   以名利为中心？你会抢功劳。
*   **以原则为中心**？你会基于公平、双赢、诚信来做决策。这会给你带来真正的安全感和力量。

**今日修行**：起草一句简短的职业宣言。例如：“我是一名致力于用技术解决真实痛点的产品人”或“我是一名帮助客户实现商业价值的顾问”。
        `
      },
      {
        id: 'p2-d6',
        day: 6,
        title: '习惯三：要事第一',
        duration: '20 min',
        totalSeconds: 1200,
        image: 'https://images.unsplash.com/photo-1506377295352-e3154d43ea9e?q=80',
        points: [
          { icon: 'grid_view', title: '时间矩阵', desc: '区分紧急与重要，拒绝第三象限的诱惑。' },
          { icon: 'event_available', title: '第二象限', desc: '把精力投资在重要但不紧急的事情上。' }
        ],
        quote: {
          text: "要事第一，意即把最重要的事情放在第一位。",
          author: "Stephen R. Covey"
        },
        content: `
### 别被“紧急”绑架

我们每天都在处理四类事情：
1.  **紧急且重要**：线上Bug、客户投诉。（必须做，但也令人精疲力竭）
2.  **重要不紧急**：建立信任关系、制定长远规划、锻炼身体、学习。（高效能的源泉）
3.  **紧急不重要**：不必要的会议、突如其来的电话。（我们常误以为这很重要）
4.  **不紧急不重要**：刷剧、闲聊。（浪费生命）

PM 常被琐事缠身（第三象限），忽略了长远规划；销售常被无效会议占据，忽略了深度客情维护。

**高效能人士专注第二象限**。通过未雨绸缪，减少第一象限的危机。

### 今日挑战

找出本周你一直在拖延的一件“第二象限”的事（比如和搭档深谈一次，或者写一份PRD），并为它预约明天上午的2小时**专注时间**。
        `
      },
      {
        id: 'p2-d7',
        day: 7,
        title: '勇敢说“不”',
        duration: '12 min',
        totalSeconds: 720,
        image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80',
        points: [
          { icon: 'block', title: '捍卫重点', desc: '对次要事务说不，是为了对重要事务说是。' },
          { icon: 'security', title: '诚实', desc: '温和而坚定地拒绝，好过虚假的承诺。' }
        ],
        quote: {
          text: "你必须有勇气对那些‘好’的，或者是‘还不错’的事情说不。",
          author: "Stephen R. Covey"
        },
        content: `
### 拒绝的艺术

如果要做到“要事第一”，你就必须对那些不重要的事情说“不”。这需要极大的勇气。

*   PM 要学会对不符合产品愿景的加塞需求说不。
*   销售要学会对非目标客户的无理要求说不。

这种拒绝不是傲慢，而是基于原则的**专注**。当你心中有一个燃烧的“Yes”（你的核心目标）时，你才能微笑着说“No”。

**今日修行**：礼貌地拒绝一个不在你核心目标内的请求，并真诚地解释原因。你会发现，对方反而会因此尊重你的专业性。
        `
      },
      {
        id: 'p2-d8',
        day: 8,
        title: '情感账户：信任的储蓄',
        duration: '15 min',
        totalSeconds: 900,
        image: 'https://images.unsplash.com/photo-1616075149638-7f43db4570b6?q=80',
        points: [
          { icon: 'savings', title: '存入信任', desc: '礼貌、诚实、守信是存款；傲慢、失信是取款。' },
          { icon: 'handshake', title: '修复关系', desc: '真诚的道歉是最这一笔大额存款。' }
        ],
        quote: {
          text: "信任是人际关系的基石。",
          author: "Stephen R. Covey"
        },
        content: `
### 你的账户余额多少？

人际关系就像银行账户。每次你兑现承诺、表达关心、展示诚意，你就在**存钱**。每次你迟到、失信、发脾气，你就在**取钱**。

当 PM 和 Sales 发生冲突时，如果你之前的存款丰厚，对方会包容你的失误（“他平时很靠谱，这次肯定有原因”）。
如果你的账户赤字，哪怕你的一句话被误解，也会引发战争。

**六种主要的存款**：
1.  理解他人
2.  注意小节
3.  信守承诺
4.  明确期望
5.  正直诚信
6.  勇于道歉

**今日修行**：为你最重要的工作伙伴（或许是那个总和你吵架的开发或销售）做一件不求回报的小事（比如帮他买杯咖啡，或者真诚地夸奖他的一次工作），存入一笔“信任款”。
        `
      }
    ]
  },
  {
    id: 'phase3',
    title: '第三阶段：公众领域的成功',
    desc: '从独立到互赖：合作的艺术',
    isLocked: false,
    lessons: [
      {
        id: 'p3-d9',
        day: 9,
        title: '习惯四：双赢思维',
        duration: '20 min',
        totalSeconds: 1200,
        image: IMAGES.PUBLIC,
        points: [
          { icon: 'balance', title: '非零和博弈', desc: '不是你输我赢，而是我们要一起赢。' },
          { icon: 'trending_up', title: '富足心态', desc: '世界有足够的资源，不必恐惧分享。' }
        ],
        quote: {
          text: "双赢不是技巧，而是人际交往的哲学。",
          author: "Stephen R. Covey"
        },
        content: `
### 寻找第三条路

在商业合作中，我们常陷入思维定势：
*   **我赢你输**：我利用职权压制你。
*   **我输你赢**：我委曲求全，这时候我是“滥好人”。
*   **两败俱伤**：既然我不爽，我也让你做不成。

**双赢（Win-Win）** 是相信有“第三条路”。
销售为了签单过度承诺（产品输），或者产品为了排期拒绝合理需求（销售输），最终都是公司输。

双赢思维基于**富足心态**（Abundance Mentality）：相信这世上有足够的蛋糕分给大家。

**今日修行**：回顾一个正在僵持的谈判或需求，问对方：“什么样的结果能让你觉得是赢了？” 然后也告诉对方你的底线。尝试寻找一个双方都能接受的方案。
        `
      },
      {
        id: 'p3-d10',
        day: 10,
        title: '破除匮乏心态',
        duration: '15 min',
        totalSeconds: 900,
        image: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?q=80',
        points: [
          { icon: 'diamond', title: '分享荣耀', desc: '也是一种能力。' },
          { icon: 'diversity_3', title: '庆祝他人', desc: '同事的成功并不意味着你的失败。' }
        ],
        quote: {
          text: "生活不是网球赛，只能有一方赢。",
          author: "Stephen R. Covey"
        },
        content: `
### 你的内心富足吗？

拥有**匮乏心态**的人，看什么都觉得少。
*   很难与人分享名声、权力和利益。
*   看到别人成功，内心会隐隐作痛。

这种心态会让你在团队合作中变得防备、吝啬。而PM与销售的配合，最需要的就是互相补位。

**今日修行**：真诚地赞美你的搭档（PM赞美销售的市场敏锐度，销售赞美产品的逻辑严密性），并在公开场合（比如周会或群里）表达出来。
        `
      },
      {
        id: 'p3-d11',
        day: 11,
        title: '习惯五：知彼解己',
        duration: '22 min',
        totalSeconds: 1320,
        image: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80',
        points: [
          { icon: 'hearing', title: '移情聆听', desc: '不仅听内容，更听懂情绪和意图。' },
          { icon: 'medical_services', title: '先诊断', desc: '在开处方之前，先做彻底的诊断。' }
        ],
        quote: {
          text: "先去理解别人，再寻求被别人理解。",
          author: "Stephen R. Covey"
        },
        content: `
### 心理空气

每个人都需要被理解，就像需要呼吸空气一样。如果你不给对方“心理空气”，他就会为了生存而反抗，根本听不进你说的话。

大部分人聆听，不是为了**理解**，而是为了**回应**。
你在听销售抱怨时，是不是已经在脑子里组织反驳的语言了？“那是伪需求！”“你不懂技术！”

**移情聆听（Empathic Listening）** 要求你哪怕不同意对方的观点，也要深入理解对方的参照系。

**今日修行**：在今天的会议中，使用“复述练习”——在表达自己观点前，先复述对方的观点，直到对方确认“没错，我就是这个意思”。
        `
      },
      {
        id: 'p3-d12',
        day: 12,
        title: '也是聆听：听懂情绪',
        duration: '15 min',
        totalSeconds: 900,
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80',
        points: [
          { icon: 'favorite', title: '情感共鸣', desc: '回应情绪，而非逻辑。' },
          { icon: 'mic_off', title: '暂缓建议', desc: '不要急着给建议，先让对方宣泄。' }
        ],
        quote: {
          text: "推己及人。",
          author: "Stephen R. Covey"
        },
        content: `
### 不要急着“好为人师”

当同事向你抱怨：“这个客户太难搞了，气死我了！”
如果你马上说：“你应该这样这样……” 或者 “别生气，为了工作嘛。”
你其实是在**否定**他的情绪，或者**自传式**地回应。

尝试回应情绪：“这让你感到很挫败，是吗？”、“你觉得付出的努力被无视了，很难过。”

这叫**反映情感**。当情绪被接纳后，理智才会回归。

**今日修行**：在沟通中，不要打断，不要急于给建议。尝试只用反映情感的话语来回应。
        `
      },
      {
        id: 'p3-d13',
        day: 13,
        title: '表达的艺术：清晰解己',
        duration: '18 min',
        totalSeconds: 1080,
        image: 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?q=80',
        points: [
          { icon: 'campaign', title: '真诚表达', desc: '在理解对方后，清晰地表达自己。' },
          { icon: 'record_voice_over', title: '我字句', desc: '用“我感到...”代替“你怎么...”。' }
        ],
        quote: {
          text: "成熟是在表达勇气与体谅他人之间取得平衡。",
          author: "Stephen R. Covey"
        },
        content: `
### 勇气与体谅的平衡

习惯五不仅包含“知彼”（理解别人），也包含“解己”（让别人理解自己）。

这需要勇气。许多好人为了体谅别人，不敢表达自己的需求，最后积累成怨气。
高效能的沟通是：**“我理解你的难处（体谅），同时，我的需求是这样的（勇气）。”**

使用**“我”字句**来降低攻击性：
*   ❌ “你怎么总是提这种不靠谱的需求！”（指责）
*   ✅ “我担心如果加上这个功能，会影响系统的稳定性，风险很大。”（表达担忧）

**今日修行**：用“我”字句代替“你”字句表达一次异议。
        `
      },
      {
        id: 'p3-d14',
        day: 14,
        title: '习惯六：统合综效',
        duration: '25 min',
        totalSeconds: 1500,
        image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80',
        points: [
          { icon: 'hub', title: '1+1>3', desc: '创造出双方都没想到的更好方案。' },
          { icon: 'construction', title: '拥抱差异', desc: '差异不是障碍，而是创新的资源。' }
        ],
        quote: {
          text: "统合综效是自然界最了不起的活动。",
          author: "Stephen R. Covey"
        },
        content: `
### 并非妥协，而是创新

妥协是 1+1=1.5，双方都让步，都不满意。
**统合综效（Synergy）** 是 1+1=3，甚至更多。它是创造性的合作。

当销售懂市场，产品懂逻辑，这两种看似矛盾的视角碰撞在一起时，如果不防御、不攻击，而是开放地探索，就能诞生出**既满足市场需求，又符合产品架构**的绝妙方案。

这需要极高的信任度（情感账户）和极强的双赢思维。

**今日修行**：找一个你们意见分歧最大的问题，坐下来。不要寻找折中方案，而是说：“我想知道有没有第三种可能性，比我们各自提出的都要好？” 开始一场头脑风暴。
        `
      },
      {
        id: 'p3-d15',
        day: 15,
        title: '尊重差异',
        duration: '15 min',
        totalSeconds: 900,
        image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80',
        points: [
          { icon: 'palette', title: '珍视不同', desc: '如果两个人意见永远一致，其中一个人就是多余的。' },
          { icon: 'remove_red_eye', title: '看见盲区', desc: '借助别人的眼睛看世界。' }
        ],
        quote: {
          text: "力量在于差异，而非相似。",
          author: "Stephen R. Covey"
        },
        content: `
### 谁是多余的？

如果你希望搭档和你想法完全一样，那你们只要一个人就够了。
正是因为 PM 关注长期价值，Sales 关注短期业绩，企业才能平衡发展。

不要把差异视为对你的攻击，而应视为弥补你盲区的机会。
“虽然我不同意你的观点，但我肯定你的视角有价值。”

**今日修行**：对那个总是提出反对意见的人真诚地说一声：“谢谢你让我看到了我没看到的盲区。”
        `
      },
      {
        id: 'p3-d16',
        day: 16,
        title: '关系的层级',
        duration: '18 min',
        totalSeconds: 1080,
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80',
        points: [
          { icon: 'stairs', title: '信任层级', desc: '从防御到尊重的升级之路。' },
          { icon: 'shield', title: '卸下防御', desc: '低信任导致防御性沟通，高信任带来统合综效。' }
        ],
        content: '内容待解锁...'
      },
      { id: 'p3-d17', day: 17, title: '跨越部门墙', duration: '20 min', totalSeconds: 1200, image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80', points: [], content: 'Lock' },
      { id: 'p3-d18', day: 18, title: '谈判中的第三选择', duration: '20 min', totalSeconds: 1200, image: 'https://images.unsplash.com/photo-1577415124269-6914fa5123d8?q=80', points: [], content: 'Lock' },
      { id: 'p3-d19', day: 19, title: '螺旋上升', duration: '15 min', totalSeconds: 900, image: 'https://images.unsplash.com/photo-1505330622279-bf7d7fc91cb5?q=80', points: [], content: 'Lock' },
    ]
  },
  {
    id: 'phase4',
    title: '第四阶段：更新与圆满',
    desc: '自我更新：磨刀不误砍柴工',
    isLocked: false,
    lessons: [
      {
        id: 'p4-d20',
        day: 20,
        title: '习惯七：不断更新',
        duration: '15 min',
        totalSeconds: 900,
        image: IMAGES.RENEWAL,
        points: [
          { icon: 'self_improvement', title: '四个层面', desc: '身体、精神、智力、社会/情感。' },
          { icon: 'battery_charging_full', title: '投资产能', desc: '维护你最宝贵的资产——你自己。' }
        ],
        quote: {
          text: "不断更新是保持和提高其他六个习惯的基础。",
          author: "Stephen R. Covey"
        },
        content: `
### 磨刀不误砍柴工

如果你一直在锯木头，却不肯停下来磨锯子，效率只会越来越低。
对于 PM 和 Sales，长时间的加班、应酬不是高效，是透支。

**四个层面的更新**：
1.  **身体**：健康饮食、充足睡眠、定期运动。（没有好身体，一切归零）
2.  **精神**：欣赏大自然、冥想、明确价值观。（寻找内心的宁静）
3.  **智力**：阅读、写作、学习新技能。（保持好奇心）
4.  **社会/情感**：与他人建立有意义的连接。（我们在关系中成长）

**今日修行**：
*   **身体**：做15分钟运动或冥想。
*   **社会**：与家人或朋友共进晚餐，不看手机。
        `
      },
      {
        id: 'p4-d21',
        day: 21,
        title: '结营：从效能到伟大',
        duration: '25 min',
        totalSeconds: 1500,
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop', // Open road / Journey
        points: [
          { icon: 'flag', title: '新的起点', desc: '这21天不是结束，而是开始。' },
          { icon: 'auto_awesome', title: '寻找声音', desc: '找到你的心声，并激励他人寻找他们的心声。' }
        ],
        quote: {
          text: "再次播种，再次收获。这不仅是成长的过程，更是通往伟大的必经之路。",
          author: "Stephen R. Covey"
        },
        content: `
### 伟大的旅程

祝贺你，完成了这21天的思维重塑之旅。

回顾第一天，你写下的那个“刻板印象”，现在还在吗？
你和你的搭档，是否建立了一点点默契？

你们是企业的增长引擎。当产品与销售真正实现**“统合综效”**，没有什么市场是拿不下的。

原则就像灯塔，它是不会移动的。只有我们调整航向，对准灯塔，才能避开触礁的危险。

**最后的仪式**：
1.  给你的搭档写一段话（或使用App内的明信片功能），感谢这21天的共同成长。
2.  **承诺**：我承诺在未来的工作中，坚持原则，积极主动，追求双赢。

愿这套课程成为你心中的灯塔。再见，亦是开始。
        `
      }
    ]
  }
];

export const getLessonById = (dayId: string | undefined): LessonContent | null => {
  if (!dayId) return null;
  // Handle both old ID format (c1-d1) and new format (p1-d1) just in case
  // But strictly look for day number matching
  const dayNum = parseInt(dayId.replace(/\D/g, '')); // Extract number
  
  for (const chapter of courseData) {
    const lesson = chapter.lessons.find(l => l.day === dayNum);
    if (lesson) return lesson;
  }
  return null;
};
