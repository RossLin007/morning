# Soul OS Design System

## 1. Core Philosophy (核心理念)

**"Simplicity is Power" (简洁即力量)**
Simplicity is not just a visual style, but a core philosophy. By removing the unnecessary, we allow the essential to shine. 
*   **Less is More**: Every element must have a clear purpose. If in doubt, remove it.
*   **Focus**: Reduce cognitive load to help users focus on their inner self and growth.

**"Warm & Powerful" (温暖且有力量)**
The interface should feel "Quiet" (Zen/Clean) but "Deep" (Rich in meaning). It moves away from traditional "Admin Dashboard" vibes towards a "Personal Sanctuary" or "Digital Temple" feel.

*   **Subjectivity**: The user is the protagonist ("Hero's Journey").
*   **Clarity**: Remove noise, focus on essence (e.g., removing redundant explanations).
*   **Connection**: Visuals should evoke feelings (emojis, specific colors), not just function.

## 2. Visual Language (视觉语言)

### Color Coding (Meaning & Dimensions)
We use a specific semantic color system to represent different dimensions of the "Soul":

*   **🟢 Growth (生命/成长)**: `Emerald-500` - Used for *My Morning Reading*. Represents steady growth, nature, vitality.
*   **🩷 Love (连接/情感)**: `Pink-500` - Used for *Relationships*. Represents warmth, care, heart connection.
*   **🔵 Wisdom (智识/回顾)**: `Blue-500` - Used for *Growth Report*. Represents clarity, data, calmness, depth.
*   **🟣 Spirit (灵性/传播)**: `Purple-500` - Used for *Morning Share*. Represents higher purpose, mystery, inspiration.
*   **🛁 Introspection (内省/书写)**: `Indigo-500` - Used for *Awareness Diary*. Represents deep thought, subconscious, night sky.
*   **🔴 Importance (收藏/价值)**: `Red-500` - Used for *Favorites*. Represents marked items, urgency, passion.
*   **🟠 Insight (洞见/看见)**: `Orange-500` - Used for *My Seeing*. Represents light, dawn, energy, distinctiveness.
*   **⚫ Utility (系统/基础)**: `Gray-500` - Used for *Settings*. Represents structure, neutrality.

### Layout & Spacing (布局与空间)
*   **App Background**: `bg-[#F0F2F5]` (Light) / `dark:bg-[#111]` (Dark). slightly off-white, not stark white.
*   **Card/Cell Background**: `bg-white` / `dark:bg-[#191919]`.
*   **Grouping**: Use ample vertical space (`mb-2`, `mb-8`) to separate semantic groups.
*   **Cell Height**: Comfortable touch targets (`py-4` ~60px height).
*   **Corners**: `rounded-[24px]` for Cards, `rounded-lg` for inner elements. Consistent "Soft Round" feel.

### Typography (排版)
*   **Headings**: Serif fonts for "Soul" elements (Identity, Quotes, Soul Card).
    *   *Usage*: User Name, Soul Card Title.
*   **UI Text**: Sans-serif (System default).
    *   *Usage*: Menu labels, buttons, settings.
*   **Emphasis**: Use color and weight, rather than size.

## 3. Key Components (核心组件)

### MenuCell (Standard List Item)
Standardized row for navigation.
*   **Left**: Icon (24px, Colored) + Label (Medium weight).
*   **Right**: Chevron (Gray-300). (Clean look, no extra text unless data is critical).
*   **Interaction**: `active:bg-gray-50` for tactile feedback.

### Soul Card (Digital Asset)
The visual representation of the user's "Passport".
*   **Ratio**: `3:5` (Classic card proportion).
*   **Visuals**: Glassmorphism (`backdrop-blur`), soft gradients (`from-[#E0EAFC] to-[#CFDEF3]`), glow effects.
*   **Elements**: Avatar (Circular + Ring), Badge (Identity), Bio (Italic, centered), QR Code, UID.

## 4. Interaction Patterns (交互模式)

*   **Modals**: Use full-screen or centered modals with backdrop blur (`bg-black/60 backdrop-blur-sm`) for focus moments (e.g., viewing Soul Card).
*   **Optimistic UI**: Pages should load instantly (using cached data) while fetching updates.
*   **Feedback**: Haptics (implied) and Toast messages for successful actions.
*   **Transitions**: Smooth `animate-fade-in` for modal appearances.

---
*Reference this guide when building new pages to create a consistent "Soul OS" experience.*
