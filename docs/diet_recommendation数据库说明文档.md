# diet_recommendation 数据库说明文档

## 概述

`diet_recommendation` 是一个MongoDB数据库，用于支持中医体质膳食推荐系统。该数据库包含4个主要集合，分别管理用户信息、用户偏好、菜谱库和体质信息。

**数据库大小**: 741,376 字节（约0.7MB）

---

## 集合列表

| 集合名称 | 中文名称 | 字段数 | 用途 |
|---------|--------|-------|------|
| `constitutions` | 体质信息 | 15 | 存储各种中医体质类型的定义、特征和饮食建议 |
| `recipes` | 菜谱库 | 23 | 存储菜谱的详细信息，包括食材、步骤、营养分析等 |
| `user_preferences` | 用户偏好 | 13 | 存储用户的饮食偏好、过敏信息、口味倾向等 |
| `users` | 用户会话 | 7 | 存储用户会话信息和体质诊断结果 |

---

## 详细集合结构

### 1. constitutions 集合（体质信息）

**用途**: 存储中医体质类型的详细定义和特征

**字段数**: 15个字段

#### 字段说明

| 字段名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `_id` | ObjectId | MongoDB文档ID | `ObjectId(...)` |
| `type` | String | 体质类型（唯一标识） | `balanced`, `qi_deficiency`, `yang_deficiency` 等 |
| `name` | String | 体质中文名称 | `平和质`, `气虚质` |
| `description` | String | 体质描述 | `阴阳气血调和，体态适中...` |
| `characteristics` | Array[String] | 体质特征列表 | `["体形匀称健壮", "面色润泽", "精力充沛"]` |
| `dietaryGuidelines` | Document | 饮食指南 | 见下表 |
| `dietaryGuidelines.recommended` | Array[String] | 推荐食物 | `["五谷杂粮", "新鲜蔬果", "适量肉类"]` |
| `dietaryGuidelines.avoided` | Array[String] | 需避免食物 | `["过度辛辣", "过于油腻", "生冷过度"]` |
| `recommendedIngredients` | Array[String] | 推荐食材列表 | `["大米", "小麦", "苹果", "鸡肉"]` |
| `flavorPreference` | Document | 五味偏好 | 见下表 |
| `flavorPreference.sour` | Number | 酸味偏好评分（0-100） | `50` |
| `flavorPreference.sweet` | Number | 甜味偏好评分（0-100） | `50` |
| `flavorPreference.bitter` | Number | 苦味偏好评分（0-100） | `50` |
| `flavorPreference.spicy` | Number | 辛味偏好评分（0-100） | `50` |
| `flavorPreference.salty` | Number | 咸味偏好评分（0-100） | `50` |
| `icon` | String | 体质图标/emoji | `☯️`, `🌬️` |
| `color` | String | 体质对应颜色（十六进制） | `#4CAF50`, `#FFC107` |
| `sortOrder` | Number | 排序顺序 | `1`, `2` |
| `isActive` | Boolean | 是否启用 | `true`, `false` |
| `createdAt` | Date | 创建时间 | `2025-12-03T03:01:13.924Z` |
| `updatedAt` | Date | 更新时间 | `2025-12-03T03:01:13.924Z` |
| `__v` | Number | MongoDB版本控制字段 | `0` |

#### 示例文档

```json
{
  "_id": ObjectId("692fa7f99f1efafa42ed6f5d"),
  "type": "balanced",
  "name": "平和质",
  "description": "阴阳气血调和，体态适中，面色红润，精力充沛",
  "characteristics": [
    "体形匀称健壮",
    "面色润泽",
    "精力充沛",
    "睡眠良好",
    "二便正常"
  ],
  "dietaryGuidelines": {
    "recommended": [
      "五谷杂粮",
      "新鲜蔬果",
      "适量肉类",
      "豆制品"
    ],
    "avoided": [
      "过度辛辣",
      "过于油腻",
      "生冷过度"
    ]
  },
  "recommendedIngredients": [
    "大米",
    "小麦",
    "玉米",
    "苹果",
    "胡萝卜",
    "鸡肉",
    "鱼肉"
  ],
  "flavorPreference": {
    "sour": 50,
    "sweet": 50,
    "bitter": 50,
    "spicy": 50,
    "salty": 50
  },
  "icon": "☯️",
  "color": "#4CAF50",
  "sortOrder": 1,
  "isActive": true,
  "createdAt": ISODate("2025-12-03T03:01:13.924Z"),
  "updatedAt": ISODate("2025-12-03T03:01:13.924Z"),
  "__v": 0
}
```

#### 关键业务信息

- **当前体质类型**: `balanced`（平和质）、`qi_deficiency`（气虚质）、`yang_deficiency`（阳虚质）、`yin_deficiency`（阴虚质）、`phlegm_dampness`（痰湿质）、`damp_heat`（湿热质）、`blood_stasis`（血瘀质）、`qi_stagnation`（气郁质）、`special`（特禀质）

---

### 2. recipes 集合（菜谱库）

**用途**: 存储菜谱的所有信息，包括食材、烹饪步骤、营养分析等

**字段数**: 23个字段

#### 字段说明

| 字段名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `_id` | ObjectId | MongoDB文档ID | `ObjectId(...)` |
| `name` | String | 菜品名称 | `红枣桂圆粥` |
| `description` | String | 菜品描述 | `补血养心，健脾益气，安神定志` |
| `image` | String | 菜品图片URL | `https://...` |
| `emoji` | String | 菜品emoji表情 | `🥘` |
| `nature` | String | 食物性质（中医分类） | `温`, `凉`, `平`, `热`, `冷` |
| `flavors` | Array[String] | 五味分类 | `["甘"]`, `["酸", "甘"]` |
| `meridians` | Array[String] | 归经（中医术语） | `["心", "脾"]`, `["肺", "肾"]` |
| `suitableConstitutions` | Array[String] | 适合的体质类型 | `["qi_deficiency", "blood_stasis", "balanced"]` |
| `avoidConstitutions` | Array[String] | 需避免的体质类型 | `["damp_heat", "phlegm_dampness"]` |
| `category` | String | 菜品分类 | `warming`（温阳）、`cooling`（清热）、`quick`（快手）、`recommended`（推荐） |
| `tags` | Array[String] | 菜品标签 | `["早餐", "补血", "安神"]` |
| `ingredients` | Array[Document] | 食材列表 | 见下表 |
| `ingredients[].name` | String | 食材名称 | `大米` |
| `ingredients[].amount` | String | 食材分量 | `100g` |
| `ingredients[].icon` | String | 食材emoji | `🍚` |
| `steps` | Array[Document] | 烹饪步骤 | 见下表 |
| `steps[].order` | Number | 步骤顺序 | `1`, `2`, `3` |
| `steps[].content` | String | 步骤描述 | `大米淘洗干净，浸泡30分钟` |
| `cookingTime` | Number | 烹饪时间（分钟） | `40` |
| `difficulty` | String | 烹饪难度 | `简单`, `中等`, `困难` |
| `analysis` | String | 营养或中医分析 | `红枣补中益气、养血安神...` |
| `baseScore` | Number | 菜品评分 | `85` |
| `isActive` | Boolean | 是否启用 | `true`, `false` |
| `sortOrder` | Number | 排序顺序 | `0`, `1` |
| `createdAt` | Date | 创建时间 | `2025-12-03T03:01:14.014Z` |
| `updatedAt` | Date | 更新时间 | `2025-12-07T06:34:49.170Z` |
| `__v` | Number | MongoDB版本控制字段 | `0` |

#### 示例文档

```json
{
  "_id": ObjectId("692fa7f99f1efafa42ed6f6f"),
  "name": "红枣桂圆粥",
  "description": "补血养心，健脾益气，安神定志",
  "image": "",
  "emoji": "🥘",
  "nature": "温",
  "flavors": ["甘"],
  "meridians": ["心", "脾"],
  "suitableConstitutions": [
    "qi_deficiency",
    "blood_stasis",
    "balanced"
  ],
  "avoidConstitutions": [
    "damp_heat",
    "phlegm_dampness"
  ],
  "category": "warming",
  "tags": ["早餐", "补血", "安神"],
  "ingredients": [
    {
      "name": "大米",
      "amount": "100g",
      "icon": "🍚"
    },
    {
      "name": "红枣",
      "amount": "8颗",
      "icon": "🔴"
    },
    {
      "name": "桂圆肉",
      "amount": "20g",
      "icon": "🟤"
    },
    {
      "name": "红糖",
      "amount": "适量",
      "icon": "🟫"
    }
  ],
  "steps": [
    {
      "order": 1,
      "content": "大米淘洗干净，浸泡30分钟"
    },
    {
      "order": 2,
      "content": "红枣去核，桂圆肉洗净"
    },
    {
      "order": 3,
      "content": "锅中加水，放入大米"
    },
    {
      "order": 4,
      "content": "大火煮沸后转小火"
    },
    {
      "order": 5,
      "content": "加入红枣和桂圆"
    },
    {
      "order": 6,
      "content": "熬至粥稠，加红糖调味"
    }
  ],
  "cookingTime": 40,
  "difficulty": "简单",
  "analysis": "红枣补中益气、养血安神；桂圆肉补心脾、益气血。此粥特别适合气血不足、心脾两虚者，可改善面色萎黄、心悸失眠等症状。",
  "baseScore": 85,
  "isActive": true,
  "sortOrder": 0,
  "createdAt": ISODate("2025-12-03T03:01:14.014Z"),
  "updatedAt": ISODate("2025-12-07T06:34:49.170Z"),
  "__v": 0
}
```

#### 关键业务信息

- **菜品分类**: `warming`（温阳菜）、`cooling`（清热菜）、`quick`（快手菜）、`recommended`（推荐菜）
- **食物性质**: 温、凉、平、热、冷（根据中医理论分类）
- **归经**: 心、脾、肺、肾、肝、胃等（中医穴位经络对应）
- **五味**: 酸、甘、苦、辛、咸（中医食疗五味）

---

### 3. user_preferences 集合（用户偏好）

**用途**: 存储用户的饮食偏好、过敏信息、口味倾向和烹饪限制

**字段数**: 13个字段

#### 字段说明

| 字段名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `_id` | ObjectId | MongoDB文档ID | `ObjectId(...)` |
| `userId` | ObjectId | 关联的用户ID | `ObjectId(...)` |
| `flavorPreference` | Document | 五味偏好评分 | 见下表 |
| `flavorPreference.sour` | Number | 酸味偏好（0-100） | `54` |
| `flavorPreference.sweet` | Number | 甜味偏好（0-100） | `50` |
| `flavorPreference.bitter` | Number | 苦味偏好（0-100） | `50` |
| `flavorPreference.spicy` | Number | 辛味偏好（0-100） | `50` |
| `flavorPreference.salty` | Number | 咸味偏好（0-100） | `45` |
| `dietaryRestrictions` | Array[String] | 饮食禁忌 | `["素食", "清真"]` |
| `allergies` | Array[String] | 过敏信息 | `["花生", "海鲜", "鸡蛋"]` |
| `dislikedIngredients` | Array[String] | 不喜欢的食材 | `["葱", "蒜", "香菜"]` |
| `currentConditions` | Array[String] | 当前身体状况 | `["感冒", "腹泻", "失眠"]` |
| `mealScenarios` | Array[String] | 就餐场景 | `["上班", "约会", "家庭"]` |
| `cookingDifficulty` | Number | 可接受的烹饪难度（1-5） | `3` |
| `maxCookingTime` | Number | 最长烹饪时间（分钟） | `30` |
| `createdAt` | Date | 创建时间 | `2025-12-03T02:13:01.733Z` |
| `updatedAt` | Date | 更新时间 | `2025-12-03T02:28:40.453Z` |
| `__v` | Number | MongoDB版本控制字段 | `0` |

#### 示例文档

```json
{
  "_id": ObjectId("692f9caec3e0739f8cd61fa5"),
  "userId": ObjectId("692f9c875f3321bed12d4a73"),
  "flavorPreference": {
    "sour": 54,
    "sweet": 50,
    "bitter": 50,
    "spicy": 50,
    "salty": 45
  },
  "dietaryRestrictions": [],
  "allergies": [],
  "dislikedIngredients": [],
  "currentConditions": [],
  "mealScenarios": [],
  "cookingDifficulty": 3,
  "maxCookingTime": 30,
  "createdAt": ISODate("2025-12-03T02:13:01.733Z"),
  "updatedAt": ISODate("2025-12-03T02:28:40.453Z"),
  "__v": 0
}
```

#### 关键业务信息

- **五味偏好**: 0-100分制，50为中等偏好，分数越高表示偏好程度越高
- **烹饪难度**: 1=非常简单，2=简单，3=中等，4=困难，5=非常困难
- **饮食禁忌**: 常见值如 `素食`、`清真`、`低盐`、`低糖` 等

---

### 4. users 集合（用户会话）

**用途**: 存储用户会话信息和体质诊断结果

**字段数**: 7个字段

#### 字段说明

| 字段名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `_id` | ObjectId | MongoDB文档ID | `ObjectId(...)` |
| `sessionId` | String | 会话ID（UUID） | `0bc09841-608b-494e-8809-58ab98083b92` |
| `constitution` | Document | 体质信息 | 见下表 |
| `constitution.type` | String/Null | 体质类型 | `special`, `balanced`, `qi_deficiency` |
| `constitution.diagnosisMethod` | String/Null | 诊断方法 | `manual`（手动）、`ai`（AI诊断） |
| `constitution.diagnosedAt` | Date/Null | 诊断时间 | `2025-12-06T13:59:57.890Z` |
| `createdAt` | Date | 会话创建时间 | `2025-12-06T13:58:16.801Z` |
| `lastActiveAt` | Date | 最后活跃时间 | `2025-12-06T14:25:52.401Z` |
| `updatedAt` | Date | 更新时间 | `2025-12-06T14:25:52.402Z` |
| `__v` | Number | MongoDB版本控制字段 | `0` |

#### 示例文档

```json
{
  "_id": ObjectId("69343678ac10bc2bb2b363bf"),
  "sessionId": "0bc09841-608b-494e-8809-58ab98083b92",
  "constitution": {
    "type": "special",
    "diagnosisMethod": "manual",
    "diagnosedAt": ISODate("2025-12-06T13:59:57.890Z")
  },
  "createdAt": ISODate("2025-12-06T13:58:16.801Z"),
  "lastActiveAt": ISODate("2025-12-06T14:25:52.401Z"),
  "updatedAt": ISODate("2025-12-06T14:25:52.402Z"),
  "__v": 0
}
```

#### 关键业务信息

- **sessionId**: 用于跟踪用户会话，无需登录即可识别用户
- **诊断方法**: `manual`表示用户手动选择，`ai`表示通过AI问诊得出
- **constitution字段可为null**: 表示用户还未进行体质诊断

---

## 集合之间的关系

```
users (用户会话)
├── sessionId → 关联前端用户
└── constitution.type → 引用 constitutions.type

user_preferences (用户偏好)
├── userId → 关联 users._id
└── flavorPreference → 用于推荐菜谱

recipes (菜谱)
├── suitableConstitutions → 数组，值来自 constitutions.type
├── avoidConstitutions → 数组，值来自 constitutions.type
└── category → 菜谱分类
```

## 使用场景

### 1. 用户体质诊断流程
```
1. 创建新用户会话 → 在 users 集合中创建新文档
2. 用户回答诊断问题 → 调用AI诊断或手动选择
3. 保存诊断结果 → 更新 users.constitution 字段
4. 基于体质推荐菜谱 → 查询 recipes 中 suitableConstitutions 匹配的菜谱
```

### 2. 用户偏好更新流程
```
1. 获取或创建用户偏好记录 → 在 user_preferences 集合中查找或创建
2. 更新五味偏好、过敏信息等 → 修改相应字段
3. 基于偏好推荐菜谱 → 结合 constitution 和 preference 筛选菜谱
```

### 3. 菜谱推荐逻辑
```
条件：
- recipes.suitableConstitutions 包含用户的 constitution.type
- recipes.avoidConstitutions 不包含用户的 constitution.type
- recipes.difficulty <= user_preferences.cookingDifficulty
- recipes.cookingTime <= user_preferences.maxCookingTime
- recipes 的食材不在 user_preferences.allergies 和 dislikedIngredients 中

返回：
- 按 baseScore 和 sortOrder 排序的菜谱列表
```

## 常用查询示例

### 查询所有启用的体质
```javascript
db.constitutions.find({ isActive: true })
```

### 查询特定体质的推荐菜谱
```javascript
db.recipes.find({
  suitableConstitutions: "qi_deficiency",
  avoidConstitutions: { $ne: "qi_deficiency" },
  isActive: true
})
```

### 查询用户的偏好信息
```javascript
db.user_preferences.findOne({ userId: ObjectId("...") })
```

### 查询用户的会话和体质
```javascript
db.users.findOne({ sessionId: "..." })
```

### 根据烹饪时间和难度推荐菜谱
```javascript
db.recipes.find({
  cookingTime: { $lte: 30 },
  difficulty: { $in: ["简单", "中等"] },
  isActive: true
})
```

---

## 索引建议

为了提高查询性能，建议创建以下索引：

| 集合 | 索引字段 | 索引类型 | 说明 |
|------|---------|---------|------|
| `users` | `sessionId` | 唯一索引 | 快速查找用户会话 |
| `users` | `createdAt` | 升序索引 | 按创建时间排序 |
| `user_preferences` | `userId` | 唯一索引 | 关联用户和偏好 |
| `recipes` | `suitableConstitutions` | 数组索引 | 快速查询适合的菜谱 |
| `recipes` | `category` | 升序索引 | 按分类筛选菜谱 |
| `recipes` | `isActive` | 升序索引 | 快速过滤启用的菜谱 |
| `constitutions` | `type` | 唯一索引 | 快速查找体质信息 |
| `constitutions` | `isActive` | 升序索引 | 快速过滤启用的体质 |

---

## 数据统计

### 当前数据量估计

| 集合 | 大概文档数 | 备注 |
|------|----------|------|
| `constitutions` | 9 | 9种体质类型（平和质、气虚质、阳虚质、阴虚质、痰湿质、湿热质、血瘀质、气郁质、特禀质） |
| `recipes` | 20-50 | 菜谱库中的菜谱数量 |
| `user_preferences` | 10-100 | 根据注册用户数量而定 |
| `users` | 10-100 | 根据会话数量而定 |

---

## 备注

1. **时间字段**: 所有日期字段使用ISO 8601格式存储
2. **数据有效性**: 通过 `isActive` 字段进行逻辑删除，而不是物理删除
3. **版本控制**: `__v` 字段由MongoDB ODM自动管理，不建议手动修改
4. **五味偏好**: 可以作为菜谱推荐的权重因素，数值越高优先级越高
5. **体质诊断**: 支持两种方式，`manual`表示用户直接选择，`ai`表示由AI诊断系统推荐

---

**文档生成时间**: 2025-12-08  
**数据库版本**: MongoDB 4.0+  
**更新者**: 系统自动生成
