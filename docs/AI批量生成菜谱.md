---
title: 中医体质膳食推荐系统 API
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.30"

---

# 中医体质膳食推荐系统 API

基于中医体质理论的智能膳食推荐系统API文档

Base URLs:

# Authentication

# Recipe

## POST AI生成菜谱

POST /api/recipes/generate

根据菜品描述、目标体质和特殊要求使用AI生成个性化菜谱数据

> Body 请求参数

```json
{
  "dishDescription": "string",
  "targetConstitution": "string",
  "specialRequirements": "string",
  "count": 0
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|X-Session-Id|header|string| 否 |none|
|body|body|object| 是 |none|
|» dishDescription|body|string| 是 |菜品描述，详细说明想要制作的菜品特点、功效等|
|» targetConstitution|body|string| 是 |目标体质类型，用于个性化调理|
|» specialRequirements|body|string| 是 |特殊要求，如过敏原、饮食禁忌、口味偏好等|
|» count|body|integer| 是 |生成菜谱的数量|

> 返回示例

> 生成成功

```json
{
  "code": 0,
  "message": "菜谱生成成功",
  "data": {
    "name": "益气养胃甜汤",
    "description": "这是一道专为气虚质人群设计的清淡养胃汤品，特别适合晚餐食用。汤品以山药、红枣、莲子等益气健脾的食材为主，搭配少量冰糖调味，口感清甜温和。通过温和的烹饪方式，有效补益脾胃之气，改善气虚引起的疲劳、食欲不振等症状，同时避免对胃部造成负担。汤品不含葱，盐分极低，符合清淡养胃的要求，烹饪时间控制在30分钟内，方便快捷。",
    "emoji": "🥣",
    "nature": "平",
    "flavors": [
      "甘"
    ],
    "meridians": [
      "脾",
      "胃",
      "肺"
    ],
    "suitableConstitutions": [
      "qi_deficiency",
      "balanced"
    ],
    "avoidConstitutions": [
      "damp_heat",
      "phlegm_dampness"
    ],
    "category": "neutral",
    "tags": [
      "养胃",
      "清淡",
      "甜味",
      "晚餐",
      "快速"
    ],
    "ingredients": [
      {
        "name": "山药",
        "amount": "100克",
        "icon": "🍠"
      },
      {
        "name": "红枣",
        "amount": "5颗",
        "icon": "🌰"
      },
      {
        "name": "莲子",
        "amount": "20克",
        "icon": "🌰"
      },
      {
        "name": "冰糖",
        "amount": "10克",
        "icon": "🍬"
      },
      {
        "name": "水",
        "amount": "800毫升",
        "icon": "💧"
      },
      {
        "name": "盐",
        "amount": "微量（约0.5克，可选）",
        "icon": "🧂"
      }
    ],
    "steps": [
      {
        "order": 1,
        "content": "准备食材：山药去皮切小块（约2厘米见方），红枣洗净去核，莲子提前用温水浸泡10分钟（如使用干莲子）。"
      },
      {
        "order": 2,
        "content": "煮汤：锅中加入800毫升水，放入山药块、红枣和浸泡好的莲子，大火煮沸后转中小火，炖煮20分钟，直至山药和莲子变软。"
      },
      {
        "order": 3,
        "content": "调味：加入冰糖，搅拌至完全溶解。根据特殊要求“少吃盐”，可省略盐或仅加微量盐（约0.5克）提味，保持口感偏甜。"
      },
      {
        "order": 4,
        "content": "完成：关火，将汤盛入碗中，温热食用。确保全程未添加葱，符合特殊要求。"
      }
    ],
    "cookingTime": 30,
    "difficulty": "简单",
    "analysis": "食养分析：本菜谱基于中医理论，针对气虚质（元气不足）设计，重点补益脾胃之气。山药性平、味甘，归脾、肺、肾经，能益气养阴、补脾肺肾，是气虚质的理想食材；红枣性温、味甘，归脾、胃经，补中益气、养血安神；莲子性平、味甘涩，归脾、肾、心经，健脾止泻、养心安神。三者搭配，以甘味为主，甘能补虚，平和养胃，符合“清淡养胃”的菜品描述。烹饪方法采用炖煮，温和易消化，适合晚餐食用，避免加重胃肠负担。特殊要求处理：未使用葱，以山药和红枣的自然甜味为主，加少量冰糖满足“口感偏甜”；盐分极低（仅微量可选），实现“少吃盐”；烹饪时间控制在30分钟内，步骤简单快捷。汤品性质平和，也适合平和质日常养生，但湿热质和痰湿质应避免，因甘味食材可能助湿。",
    "baseScore": 80,
    "isActive": true,
    "sortOrder": 0,
    "generatedBy": "AI",
    "generatedAt": "2025-12-18T06:44:47.097Z",
    "inputParams": {
      "dishDescription": "我想做一道清淡的汤，希望有养胃的功效，适合晚餐食用",
      "targetConstitution": "qi_deficiency",
      "specialRequirements": "不要放葱，少吃盐，希望口感偏甜，烹饪时间控制在30分钟内"
    }
  }
}
```

```json
{
  "code": 0,
  "message": "成功生成 5 个菜谱",
  "data": [
    {
      "name": "清炒苦瓜百合",
      "description": "这是一道适合夏季的清爽开胃菜，采用炒菜做法，口感清淡鲜美。苦瓜清热利湿，百合滋阴润肺，搭配山药健脾祛湿，共同调理湿热体质。本菜谱不使用辣椒，符合特殊要求，通过苦味和甘味食材平衡，帮助清除体内湿热，改善食欲不振、口干口苦等症状。",
      "emoji": "🥒",
      "nature": "凉",
      "flavors": [
        "苦",
        "甘"
      ],
      "meridians": [
        "心",
        "脾",
        "肺"
      ],
      "suitableConstitutions": [
        "damp_heat",
        "balanced",
        "yin_deficiency"
      ],
      "avoidConstitutions": [
        "yang_deficiency",
        "qi_deficiency"
      ],
      "category": "cooling",
      "tags": [
        "夏季",
        "开胃",
        "清热利湿",
        "炒菜",
        "清淡"
      ],
      "ingredients": [
        {
          "name": "苦瓜",
          "amount": "200克",
          "icon": "🥒"
        },
        {
          "name": "鲜百合",
          "amount": "100克",
          "icon": "🌷"
        },
        {
          "name": "山药",
          "amount": "100克",
          "icon": "🍠"
        },
        {
          "name": "生姜",
          "amount": "10克",
          "icon": "🧄"
        },
        {
          "name": "盐",
          "amount": "3克",
          "icon": "🧂"
        },
        {
          "name": "植物油",
          "amount": "15毫升",
          "icon": "🫒"
        }
      ],
      "steps": [
        {
          "order": 1,
          "content": "苦瓜洗净，去籽切片，用盐水浸泡10分钟去除部分苦味，捞出沥干。"
        },
        {
          "order": 2,
          "content": "鲜百合掰成瓣，洗净；山药去皮切片，浸泡在清水中防止氧化。"
        },
        {
          "order": 3,
          "content": "生姜切丝备用。"
        },
        {
          "order": 4,
          "content": "热锅加入植物油，放入姜丝爆香。"
        },
        {
          "order": 5,
          "content": "加入苦瓜片和山药片，中火翻炒3-5分钟至断生。"
        },
        {
          "order": 6,
          "content": "加入鲜百合，快速翻炒1-2分钟至百合变透明。"
        },
        {
          "order": 7,
          "content": "加入盐调味，翻炒均匀后即可出锅。"
        }
      ],
      "cookingTime": 20,
      "difficulty": "简单",
      "analysis": "中医理论解释：湿热质（damp_heat）表现为体内湿热内蕴，常见症状如口干口苦、食欲不振、大便黏腻等。本菜谱选用苦瓜（性凉，味苦，归心、脾经）清热利湿，百合（性微寒，味甘，归心、肺经）滋阴润肺，山药（性平，味甘，归脾、肺、肾经）健脾祛湿，生姜（性温，味辛，归肺、脾、胃经）温中散寒以平衡凉性。整体菜谱性凉，以苦味和甘味为主，苦能燥湿，甘能健脾，符合清热利湿的调理原则。针对目标体质的调理机理：通过苦瓜和百合的清热作用清除体内热邪，山药健脾以助运化水湿，生姜防止寒凉伤胃，共同改善湿热症状。特殊要求满足说明：严格遵守'不要辣椒'的要求，未使用任何辣椒或辛辣调料，仅用生姜提味，确保口感清淡鲜美。",
      "baseScore": 80,
      "isActive": true,
      "sortOrder": 0,
      "generatedBy": "AI",
      "generatedAt": "2025-12-18T07:06:51.261Z",
      "inputParams": {
        "dishDescription": "适合夏天的清爽开胃菜",
        "targetConstitution": "damp_heat",
        "specialRequirements": "不要辣椒",
        "requestedCount": 5,
        "generatedIndex": 1
      }
    },
    {
      "name": "冬瓜薏米炖鸭汤",
      "description": "这是一道适合夏季的清爽开胃炖汤，采用冬瓜、薏米和鸭肉为主要食材，通过炖煮的方式使汤品浓郁香醇。冬瓜清热利水，薏米健脾渗湿，鸭肉滋阴养胃，三者结合能有效清热利湿，适合湿热质人群在夏季调理，帮助祛除体内湿热，改善食欲不振、口苦黏腻等症状。汤品不添加辣椒，符合特殊要求，味道醇厚而不刺激。",
      "emoji": "🍲",
      "nature": "凉",
      "flavors": [
        "甘",
        "淡"
      ],
      "meridians": [
        "脾",
        "胃",
        "肺"
      ],
      "suitableConstitutions": [
        "damp_heat",
        "phlegm_dampness",
        "yin_deficiency"
      ],
      "avoidConstitutions": [
        "yang_deficiency",
        "qi_deficiency"
      ],
      "category": "cooling",
      "tags": [
        "夏季",
        "炖汤",
        "清热利湿",
        "开胃",
        "无辣"
      ],
      "ingredients": [
        {
          "name": "冬瓜",
          "amount": "500克",
          "icon": "🍈"
        },
        {
          "name": "薏米",
          "amount": "50克",
          "icon": "🌾"
        },
        {
          "name": "鸭肉",
          "amount": "300克",
          "icon": "🦆"
        },
        {
          "name": "生姜",
          "amount": "3片",
          "icon": "🧄"
        },
        {
          "name": "葱段",
          "amount": "2根",
          "icon": "🌱"
        },
        {
          "name": "盐",
          "amount": "适量",
          "icon": "🧂"
        }
      ],
      "steps": [
        {
          "order": 1,
          "content": "准备食材：冬瓜去皮去籽，切成大块；薏米提前浸泡2小时；鸭肉洗净切块，焯水去除血沫；生姜切片，葱切段。"
        },
        {
          "order": 2,
          "content": "炖煮：将鸭肉、薏米、生姜片和葱段放入炖锅中，加入足量清水，大火煮沸后转小火炖煮1小时。"
        },
        {
          "order": 3,
          "content": "加入冬瓜：将冬瓜块加入炖锅中，继续小火炖煮30分钟，直至冬瓜软烂。"
        },
        {
          "order": 4,
          "content": "调味：加入适量盐调味，搅拌均匀后即可关火。"
        },
        {
          "order": 5,
          "content": "出锅：盛出汤品，去除葱段和姜片，趁热食用。"
        }
      ],
      "cookingTime": 120,
      "difficulty": "中等",
      "analysis": "中医理论解释：湿热质人群体内湿热内蕴，易出现口苦、黏腻、食欲不振等症状。冬瓜性凉、味甘淡，归肺、胃经，能清热利水、生津止渴；薏米性凉、味甘淡，归脾、胃、肺经，能健脾渗湿、清热排脓；鸭肉性凉、味甘，归脾、胃、肺、肾经，能滋阴养胃、利水消肿。三者结合，以凉性为主，甘淡渗湿，共同发挥清热利湿、健脾开胃的功效。针对湿热质的调理机理：通过清热利湿的食材，帮助祛除体内多余湿热，改善消化功能，增强食欲，同时避免温燥食物加重湿热。特殊要求说明：菜谱中未使用辣椒，符合用户'不要辣椒'的要求，确保汤品温和不刺激，适合湿热质调理。",
      "baseScore": 80,
      "isActive": true,
      "sortOrder": 0,
      "generatedBy": "AI",
      "generatedAt": "2025-12-18T07:06:51.261Z",
      "inputParams": {
        "dishDescription": "适合夏天的清爽开胃菜",
        "targetConstitution": "damp_heat",
        "specialRequirements": "不要辣椒",
        "requestedCount": 5,
        "generatedIndex": 2
      }
    },
    {
      "name": "清蒸冬瓜薏米酿豆腐",
      "description": "这是一道清爽开胃的夏季蒸菜，采用冬瓜、薏米和豆腐为主要食材，通过清蒸方式保留食材原味。冬瓜清热利水，薏米健脾祛湿，豆腐益气和中，共同发挥清热利湿的功效，特别适合湿热质人群在夏季食用，能帮助清除体内湿热，改善食欲不振、口干口苦等症状。菜谱避免使用辣椒，符合特殊要求，口感清淡爽口。",
      "emoji": "🥒🍚",
      "nature": "凉",
      "flavors": [
        "甘",
        "淡"
      ],
      "meridians": [
        "脾",
        "胃",
        "肺"
      ],
      "suitableConstitutions": [
        "damp_heat",
        "phlegm_dampness"
      ],
      "avoidConstitutions": [
        "yang_deficiency",
        "qi_deficiency"
      ],
      "category": "cooling",
      "tags": [
        "夏季",
        "蒸菜",
        "清爽",
        "开胃",
        "清热利湿"
      ],
      "ingredients": [
        {
          "name": "冬瓜",
          "amount": "300克",
          "icon": "🥒"
        },
        {
          "name": "薏米",
          "amount": "50克",
          "icon": "🍚"
        },
        {
          "name": "豆腐",
          "amount": "200克",
          "icon": "🧈"
        },
        {
          "name": "香菇",
          "amount": "3朵",
          "icon": "🍄"
        },
        {
          "name": "生姜",
          "amount": "10克",
          "icon": "🧄"
        },
        {
          "name": "葱",
          "amount": "1根",
          "icon": "🌿"
        },
        {
          "name": "盐",
          "amount": "3克",
          "icon": "🧂"
        },
        {
          "name": "香油",
          "amount": "5毫升",
          "icon": "🫒"
        }
      ],
      "steps": [
        {
          "order": 1,
          "content": "薏米提前浸泡2小时，然后蒸熟备用；冬瓜去皮去瓤，切成厚片；香菇泡发后切丁；豆腐压碎成泥；生姜切末，葱切葱花。"
        },
        {
          "order": 2,
          "content": "将豆腐泥、蒸熟的薏米、香菇丁、姜末混合，加入盐调味，搅拌均匀制成馅料。"
        },
        {
          "order": 3,
          "content": "取冬瓜片，每片放上适量馅料，轻轻卷起或用另一片冬瓜覆盖，形成酿冬瓜卷。"
        },
        {
          "order": 4,
          "content": "将酿好的冬瓜卷摆放在蒸盘中，放入蒸锅，大火蒸15-20分钟，至冬瓜变软透明。"
        },
        {
          "order": 5,
          "content": "蒸好后取出，淋上香油，撒上葱花即可食用。"
        }
      ],
      "cookingTime": 40,
      "difficulty": "中等",
      "analysis": "本菜谱基于中医理论设计，针对湿热质（damp_heat）的调理需求。湿热质以湿热内蕴为特征，常见症状如口干口苦、食欲不振、大便黏滞等，夏季易加重。菜谱选用性凉味甘淡的食材：冬瓜清热利水、生津止渴，归肺、胃经；薏米健脾祛湿、清热排脓，归脾、胃、肺经；豆腐益气和中、生津润燥，归脾、胃、大肠经。这些食材协同作用，能有效清除湿热，健脾开胃。烹饪采用清蒸法，避免油炸或辛辣，以保持食材的清凉属性，符合夏季清爽开胃的特点。特殊要求中明确不要辣椒，本菜谱完全避免使用辣椒或任何辛辣调料，改用生姜（性温，但用量少以去腥增香而不增热）和清淡调味，确保不刺激湿热。菜谱名称和主要食材（冬瓜、薏米、豆腐）与其他菜谱（如可能重复的苦瓜、黄瓜等）有明显差异，符合用户要求。整体上，菜谱通过清热利湿、健脾和中的食养原则，帮助湿热质人群改善体质，同时满足清爽开胃的夏季需求。",
      "baseScore": 80,
      "isActive": true,
      "sortOrder": 0,
      "generatedBy": "AI",
      "generatedAt": "2025-12-18T07:06:51.261Z",
      "inputParams": {
        "dishDescription": "适合夏天的清爽开胃菜",
        "targetConstitution": "damp_heat",
        "specialRequirements": "不要辣椒",
        "requestedCount": 5,
        "generatedIndex": 3
      }
    },
    {
      "name": "薏米绿豆荷叶粥",
      "description": "这是一款适合夏季的清爽开胃粥品，采用煮粥做法，口感香醇，回味悠长。薏米和绿豆清热利湿，荷叶芳香化湿，共同针对湿热体质进行调理，能有效清除体内湿热，健脾开胃。粥品温和易消化，适合夏季食用，避免辣椒，符合特殊要求。",
      "emoji": "🍲",
      "nature": "凉",
      "flavors": [
        "甘",
        "淡"
      ],
      "meridians": [
        "脾",
        "胃",
        "肺"
      ],
      "suitableConstitutions": [
        "damp_heat",
        "phlegm_dampness",
        "balanced"
      ],
      "avoidConstitutions": [
        "yang_deficiency",
        "qi_deficiency"
      ],
      "category": "cooling",
      "tags": [
        "夏季",
        "粥品",
        "清热利湿",
        "开胃",
        "无辣"
      ],
      "ingredients": [
        {
          "name": "薏米",
          "amount": "50克",
          "icon": "🌾"
        },
        {
          "name": "绿豆",
          "amount": "50克",
          "icon": "🫘"
        },
        {
          "name": "干荷叶",
          "amount": "10克",
          "icon": "🍃"
        },
        {
          "name": "大米",
          "amount": "100克",
          "icon": "🍚"
        },
        {
          "name": "冰糖",
          "amount": "20克",
          "icon": "🍬"
        },
        {
          "name": "清水",
          "amount": "1500毫升",
          "icon": "💧"
        }
      ],
      "steps": [
        {
          "order": 1,
          "content": "将薏米、绿豆和大米分别洗净，用清水浸泡30分钟，以缩短煮粥时间。"
        },
        {
          "order": 2,
          "content": "干荷叶用温水浸泡10分钟，洗净后剪成小块备用。"
        },
        {
          "order": 3,
          "content": "锅中加入清水，放入浸泡好的薏米、绿豆和大米，大火煮沸后转小火慢煮40分钟。"
        },
        {
          "order": 4,
          "content": "加入荷叶块，继续煮20分钟，直至粥品变得粘稠，食材熟透。"
        },
        {
          "order": 5,
          "content": "加入冰糖，搅拌至完全融化，关火，捞出荷叶块丢弃。"
        },
        {
          "order": 6,
          "content": "将粥盛入碗中，稍凉后即可食用，口感清爽香醇。"
        }
      ],
      "cookingTime": 70,
      "difficulty": "简单",
      "analysis": "中医理论解释：湿热体质（damp_heat）表现为体内湿热内蕴，常见症状如口苦、苔黄腻、小便黄等。薏米性凉、味甘淡，归脾、胃、肺经，能健脾渗湿、清热排脓；绿豆性凉、味甘，归心、胃经，清热解毒、利水消肿；荷叶性平、味苦，归肝、脾、胃经，清热解暑、升发清阳、凉血止血。三者结合，以凉性为主，甘淡渗湿，共同清热利湿，针对湿热体质进行调理。针对目标体质的调理机理：粥品通过薏米和绿豆的清热利湿作用，帮助清除体内湿热，荷叶芳香化湿，增强开胃效果，同时大米健脾养胃，避免损伤脾胃。满足特殊要求的说明：菜谱严格避免辣椒，使用冰糖调味，确保口感清爽无辣，符合用户要求；食材如薏米、绿豆、荷叶等与其他菜谱（如可能涉及肉类或辛辣食材）有明显差异，确保独特性；煮粥做法香醇回味，适合夏季食用。",
      "baseScore": 80,
      "isActive": true,
      "sortOrder": 0,
      "generatedBy": "AI",
      "generatedAt": "2025-12-18T07:06:51.261Z",
      "inputParams": {
        "dishDescription": "适合夏天的清爽开胃菜",
        "targetConstitution": "damp_heat",
        "specialRequirements": "不要辣椒",
        "requestedCount": 5,
        "generatedIndex": 4
      }
    },
    {
      "name": "薏米黄瓜拌海蜇",
      "description": "这是一道适合夏季食用的清爽开胃凉拌菜，采用薏米、黄瓜和海蜇为主要食材，鲜美爽口，营养均衡。薏米健脾利湿，黄瓜清热利水，海蜇化痰软坚，三者搭配能有效清热利湿，适合湿热体质人群在夏季调理，帮助改善口干口苦、身重困倦等症状。菜谱采用凉拌做法，避免辣椒，符合特殊要求，且与其他菜谱有明显差异，确保独特性和鲜美风格。",
      "emoji": "🥒",
      "nature": "凉",
      "flavors": [
        "甘",
        "咸"
      ],
      "meridians": [
        "脾",
        "胃",
        "肺"
      ],
      "suitableConstitutions": [
        "damp_heat",
        "phlegm_dampness"
      ],
      "avoidConstitutions": [
        "yang_deficiency",
        "qi_deficiency"
      ],
      "category": "cooling",
      "tags": [
        "夏季",
        "凉拌",
        "开胃",
        "清热利湿",
        "无辣"
      ],
      "ingredients": [
        {
          "name": "薏米",
          "amount": "50克",
          "icon": "🌾"
        },
        {
          "name": "黄瓜",
          "amount": "1根（约200克）",
          "icon": "🥒"
        },
        {
          "name": "海蜇皮",
          "amount": "100克",
          "icon": "🐙"
        },
        {
          "name": "蒜末",
          "amount": "10克",
          "icon": "🧄"
        },
        {
          "name": "香菜",
          "amount": "20克",
          "icon": "🌿"
        },
        {
          "name": "米醋",
          "amount": "15毫升",
          "icon": "🍶"
        },
        {
          "name": "生抽",
          "amount": "10毫升",
          "icon": "🥡"
        },
        {
          "name": "芝麻油",
          "amount": "5毫升",
          "icon": "🫒"
        },
        {
          "name": "白糖",
          "amount": "5克",
          "icon": "🍬"
        },
        {
          "name": "盐",
          "amount": "适量",
          "icon": "🧂"
        }
      ],
      "steps": [
        {
          "order": 1,
          "content": "薏米提前用清水浸泡4小时，然后放入锅中，加入适量水，大火煮沸后转小火煮30分钟至软熟，捞出沥干水分，放凉备用。"
        },
        {
          "order": 2,
          "content": "黄瓜洗净，切成细丝，用少许盐腌制10分钟，挤出多余水分，以保持爽脆口感。"
        },
        {
          "order": 3,
          "content": "海蜇皮用清水反复冲洗，去除盐分和杂质，切成细丝，放入沸水中焯烫30秒，迅速捞出过冷水，沥干备用。"
        },
        {
          "order": 4,
          "content": "香菜洗净切段，蒜末准备好。"
        },
        {
          "order": 5,
          "content": "在一个大碗中，将煮好的薏米、黄瓜丝、海蜇丝、香菜段和蒜末混合均匀。"
        },
        {
          "order": 6,
          "content": "另取一个小碗，调制酱汁：加入米醋、生抽、芝麻油、白糖和少许盐，搅拌均匀至糖盐溶解。"
        },
        {
          "order": 7,
          "content": "将酱汁倒入食材碗中，轻轻拌匀，确保所有食材均匀裹上酱汁。"
        },
        {
          "order": 8,
          "content": "将拌好的菜装盘，可冷藏10分钟后再食用，口感更佳清爽。"
        }
      ],
      "cookingTime": 50,
      "difficulty": "简单",
      "analysis": "本菜谱基于中医理论设计，针对湿热质（damp_heat）的调理需求。湿热质表现为湿热内蕴，常伴有口干口苦、身重困倦、舌苔黄腻等症状，夏季易加重。食材选择上：薏米性凉、味甘淡，归脾、胃、肺经，能健脾利湿、清热排脓，是祛湿佳品；黄瓜性凉、味甘，归脾、胃、大肠经，能清热利水、生津止渴；海蜇性平、味咸，归肝、肾经，能化痰软坚、清热润肠。三者搭配，以凉性为主，整体菜谱性质为凉，能清热利湿，符合夏季清爽开胃的特点。烹饪方法采用凉拌，避免热性烹饪如煎炸，以保持食材的清热特性，且不使用辣椒（特殊要求），避免助热生湿。酱汁中米醋和蒜末有辛散作用，可辅助理气开胃，但用量适中，不违背无辣要求。菜谱适合湿热质和痰湿质，但阳虚质和气虚质应避免，因凉性食材可能损伤阳气。此菜谱作为第5/5个，以薏米、黄瓜和海蜇为主要食材，与其他菜谱（如可能含肉类或热性食材）有明显差异，确保独特性和鲜美风格。",
      "baseScore": 80,
      "isActive": true,
      "sortOrder": 0,
      "generatedBy": "AI",
      "generatedAt": "2025-12-18T07:06:51.261Z",
      "inputParams": {
        "dishDescription": "适合夏天的清爽开胃菜",
        "targetConstitution": "damp_heat",
        "specialRequirements": "不要辣椒",
        "requestedCount": 5,
        "generatedIndex": 5
      }
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|生成成功|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|参数错误或生成失败|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|服务器错误|None|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none|状态码|接口响应状态码，0表示成功|
|» message|string|true|none|消息|接口响应消息，通常用于描述错误信息|
|» data|[object]|true|none||none|
|»» name|string|true|none|菜谱名称|菜谱的名称|
|»» description|string|true|none|菜谱描述|菜谱的详细描述|
|»» emoji|string|true|none|表情符号|代表菜谱的表情符号|
|»» nature|string|true|none|食性|食物的性质，如寒、热、温、凉、平等|
|»» flavors|[string]|true|none|五味|食物的味道，如酸、苦、甘、辛、咸|
|»» meridians|[string]|true|none|归经|食物主要作用的经络|
|»» suitableConstitutions|[string]|true|none|适宜体质|适合食用该菜谱的体质类型|
|»» avoidConstitutions|[string]|true|none|禁忌体质|不适宜食用该菜谱的体质类型|
|»» category|string|true|none|菜谱分类|菜谱所属的类别|
|»» tags|[string]|true|none|标签|菜谱的标签|
|»» ingredients|[object]|true|none|食材列表|制作菜谱所需的食材|
|»»» name|string|true|none|食材名称|食材的名称|
|»»» amount|string|true|none|用量|食材的用量|
|»»» icon|string|true|none|图标|食材的图标标识|
|»» steps|[object]|true|none|制作步骤|菜谱的制作步骤|
|»»» order|integer|true|none|步骤序号|步骤的顺序|
|»»» content|string|true|none|步骤内容|步骤的详细说明|
|»» cookingTime|integer|true|none|烹饪时间|烹饪所需的时间，单位为分钟|
|»» difficulty|string|true|none|难度等级|菜谱的制作难度等级|
|»» analysis|string|true|none|分析说明|对菜谱的分析和说明|
|»» baseScore|integer|true|none|基础评分|菜谱的基础评分|
|»» isActive|boolean|true|none|是否激活|菜谱是否处于激活状态|
|»» sortOrder|integer|true|none|排序顺序|菜谱的显示排序顺序|
|»» generatedBy|string|true|none|生成者|菜谱的生成者|
|»» generatedAt|string|true|none|生成时间|菜谱的生成时间|
|»» inputParams|object|true|none|输入参数|生成菜谱时使用的输入参数|
|»»» dishDescription|string|true|none|菜品描述|对菜品的描述|
|»»» targetConstitution|string|true|none|目标体质|目标体质类型|
|»»» specialRequirements|string|true|none|特殊要求|特殊要求或限制|
|»»» requestedCount|integer|true|none|请求数量|请求生成的菜谱数量|
|»»» generatedIndex|integer|true|none|生成索引|生成菜谱的索引|

# 数据模型

