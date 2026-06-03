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

## POST AI智能推荐菜品

POST /api/recipes/ai-recommend

基于用户偏好进行AI深度分析，生成个性化菜品推荐

> Body 请求参数

```json
{
  "mealType": "dinner",
  "count": 6,
  "excludeIngredients": [
    "香菜",
    "胡萝卜"
  ],
  "specialRequirements": "希望菜品清淡易消化，适合晚餐食用"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|X-Session-Id|header|string| 是 |会话ID|
|body|body|object| 是 |none|
|» mealType|body|string| 否 |用餐类型（可选）|
|» count|body|integer| 否 |推荐数量|
|» excludeIngredients|body|[string]| 否 |额外排除的食材（可选）|
|» specialRequirements|body|string| 否 |特殊要求（可选）|

#### 枚举值

|属性|值|
|---|---|
|» mealType|breakfast|
|» mealType|lunch|
|» mealType|dinner|
|» mealType|snack|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "AI智能推荐成功",
  "data": {
    "list": [
      {
        "name": "山药红枣小米粥",
        "description": "温和补气健脾粥品，适合气虚质和产后恢复，小米易消化，山药健脾益肺，红枣补血安神，整体清淡营养。",
        "emoji": "🍚",
        "nature": "平",
        "flavors": [
          "甘"
        ],
        "meridians": [
          "脾",
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
        "tags": [
          "清淡",
          "易消化",
          "补气",
          "安神"
        ],
        "ingredients": [
          {
            "name": "小米",
            "amount": "100克",
            "icon": "🌾"
          },
          {
            "name": "山药",
            "amount": "50克",
            "icon": "🍠"
          },
          {
            "name": "红枣",
            "amount": "5颗",
            "icon": "🍒"
          },
          {
            "name": "水",
            "amount": "800毫升",
            "icon": "💧"
          }
        ],
        "steps": [
          {
            "order": 1,
            "content": "小米洗净，浸泡30分钟；山药去皮切小块；红枣去核。"
          },
          {
            "order": 2,
            "content": "锅中加水，放入小米、山药和红枣，大火煮沸。"
          },
          {
            "order": 3,
            "content": "转小火慢煮40分钟，直至粥稠软，偶尔搅拌防止粘锅。"
          },
          {
            "order": 4,
            "content": "根据口味可少量加盐（低盐），搅拌均匀后即可食用。"
          }
        ],
        "cookingTime": 50,
        "difficulty": "中等",
        "nutritionTags": [
          "高纤维",
          "低脂",
          "无麸质",
          "补铁"
        ],
        "bestMealTime": "午餐或晚餐",
        "seasonalAdvice": "四季皆宜，秋冬更佳以温补。",
        "recommendReason": "针对用户气虚质和产后状态，此粥品温和补气，小米和山药易消化，符合低脂、低盐、无麸质要求，排除辣椒和鸡丁，清淡适合晚餐，烹饪时间50分钟在用户限制内，中等难度适合偏好。",
        "healthBenefits": "补气健脾，增强元气，缓解疲劳；红枣安神，帮助缓解压力；易消化吸收，促进产后恢复，支持整体健康。",
        "matchScore": 90,
        "matchReason": "针对用户气虚质和产后状态，此粥品温和补气，小米和山药易消化，符合低脂、低盐、无麸质要求，排除辣椒和鸡丁，清淡适合晚餐，烹饪时间50分钟在用户限制内，中等难度适合偏好。"
      },
      {
        "name": "清蒸鲈鱼配胡萝卜菠菜",
        "description": "清淡蒸鱼菜品，鲈鱼补气健脾胃，胡萝卜和菠菜提供维生素，低脂低盐烹饪，适合气虚质和营养需求。",
        "emoji": "🐟",
        "nature": "平",
        "flavors": [
          "甘",
          "咸"
        ],
        "meridians": [
          "脾",
          "胃"
        ],
        "suitableConstitutions": [
          "qi_deficiency",
          "balanced"
        ],
        "avoidConstitutions": [
          "damp_heat",
          "phlegm_dampness"
        ],
        "tags": [
          "清淡",
          "高蛋白",
          "低脂",
          "易消化"
        ],
        "ingredients": [
          {
            "name": "鲈鱼",
            "amount": "1条（约300克）",
            "icon": "🐟"
          },
          {
            "name": "胡萝卜",
            "amount": "1根",
            "icon": "🥕"
          },
          {
            "name": "菠菜",
            "amount": "100克",
            "icon": "🥬"
          },
          {
            "name": "姜片",
            "amount": "3片",
            "icon": "🫚"
          },
          {
            "name": "葱段",
            "amount": "适量",
            "icon": "🌱"
          },
          {
            "name": "低盐酱油",
            "amount": "1汤匙",
            "icon": "🍶"
          }
        ],
        "steps": [
          {
            "order": 1,
            "content": "鲈鱼清洗干净，表面划几刀；胡萝卜切片；菠菜洗净。"
          },
          {
            "order": 2,
            "content": "蒸盘上放姜片和葱段，铺上鲈鱼，周围放胡萝卜片。"
          },
          {
            "order": 3,
            "content": "蒸锅水沸后，放入蒸盘，大火蒸15-20分钟，直至鱼熟透。"
          },
          {
            "order": 4,
            "content": "同时，另锅焯水菠菜1分钟，捞出沥干。"
          },
          {
            "order": 5,
            "content": "蒸好后，淋上低盐酱油，搭配菠菜即可食用。"
          }
        ],
        "cookingTime": 30,
        "difficulty": "中等",
        "nutritionTags": [
          "高蛋白",
          "低脂",
          "无麸质",
          "富含维生素"
        ],
        "bestMealTime": "午餐或晚餐",
        "seasonalAdvice": "全年适用，春季更佳以清淡调理。",
        "recommendReason": "此菜品清淡易消化，鲈鱼补气健脾胃，符合用户低脂、低盐、无麸质禁忌，排除辣椒和鸡丁，适合晚餐场景，烹饪时间30分钟短于最大限制，中等难度匹配偏好，胡萝卜和菠菜增加营养均衡。",
        "healthBenefits": "补气健脾，增强体力；优质蛋白质支持产后恢复；胡萝卜和菠菜提供抗氧化剂和纤维，帮助缓解压力，促进消化健康。",
        "matchScore": 93,
        "matchReason": "此菜品清淡易消化，鲈鱼补气健脾胃，符合用户低脂、低盐、无麸质禁忌，排除辣椒和鸡丁，适合晚餐场景，烹饪时间30分钟短于最大限制，中等难度匹配偏好，胡萝卜和菠菜增加营养均衡。"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 2,
      "total": 2
    },
    "aiAnalysis": {
      "userProfile": "用户为气虚质（qi_deficiency），元气不足，易感疲乏，需补气健脾。五味偏好均衡，无明显倾向，适合温和调理。饮食禁忌包括低脂、低盐、无麸质，需避免高脂肪、高盐分和含麸质食材。当前身体状态为产后（postpartum）和压力（stress），需注重营养补充和舒缓压力，促进恢复。用餐场景偏好晚餐、饮食控制和营养均衡，烹饪难度偏好中等（3级），最大烹饪时间60分钟，适合制作中等复杂度菜品。目标用餐场景为午餐，要求菜品清淡易消化，适合晚餐食用，避免油腻，并排除辣椒和鸡丁。综合来看，用户需要温和、易消化、营养丰富的菜品，以补气健脾、缓解压力为主。",
      "recommendStrategy": "基于用户气虚质和产后、压力状态，推荐补气健脾、安神舒缓的菜品。选择温和性味（平、温）食材，避免寒凉或过热，以符合气虚质调理需求。严格遵循低脂、低盐、无麸质饮食禁忌，排除辣椒和鸡丁，确保清淡易消化。菜品设计以中等烹饪难度和60分钟内完成为准，适合午餐或晚餐场景，注重营养均衡和易吸收。推荐理由将结合用户具体偏好和体质特点，提供个性化健康益处。",
      "nutritionBalance": "建议饮食以补气为主，多摄入健脾食材如山药、红枣、小米等，搭配优质蛋白质如鱼肉、豆腐，以低脂方式烹饪。增加富含维生素和矿物质的蔬菜，如胡萝卜、菠菜，促进产后恢复和缓解压力。避免油腻、辛辣和生冷食物，确保盐分控制，支持低盐饮食。整体搭配应温和易消化，分餐食用，避免过饱，以维持能量稳定和消化健康。"
    }
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|推荐成功|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|参数错误|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|用户不存在或偏好数据不存在|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|服务器错误|None|

### 返回数据结构

状态码 **200**

*食谱推荐响应*

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none|状态码|接口返回的状态码，0表示成功|
|» message|string|true|none|消息|接口返回的提示信息|
|» data|object|true|none|数据|接口返回的主要数据|
|»» list|[object]|true|none|食谱列表|推荐的食谱列表|
|»»» name|string|true|none|食谱名称|食谱的名称|
|»»» description|string|true|none|食谱描述|食谱的简要描述|
|»»» emoji|string|true|none|表情符号|代表食谱的表情符号|
|»»» nature|string|true|none|食性|食谱的食性（如：温、热、寒、凉、平）|
|»»» flavors|[string]|true|none|五味|食谱的五味（如：酸、苦、甘、辛、咸）|
|»»» meridians|[string]|true|none|归经|食谱归经（如：肝、心、脾、肺、肾）|
|»»» suitableConstitutions|[string]|true|none|适宜体质|适合食用的体质类型|
|»»» avoidConstitutions|[string]|true|none|禁忌体质|不适合食用的体质类型|
|»»» tags|[string]|true|none|标签|食谱的标签（如：家常菜、快手菜、养生）|
|»»» ingredients|[object]|true|none|食材列表|食谱所需的食材清单|
|»»»» name|string|true|none|食材名称|食材的名称|
|»»»» amount|string|true|none|用量|食材的用量|
|»»»» icon|string|true|none|图标|食材的图标URL|
|»»» steps|[object]|true|none|烹饪步骤|食谱的烹饪步骤|
|»»»» order|integer|true|none|步骤序号|烹饪步骤的顺序|
|»»»» content|string|true|none|步骤内容|烹饪步骤的详细说明|
|»»» cookingTime|integer|true|none|烹饪时间|烹饪所需的时间（分钟）|
|»»» difficulty|string|true|none|难度|食谱的烹饪难度（如：简单、中等、困难）|
|»»» nutritionTags|[string]|true|none|营养标签|食谱的营养标签（如：高蛋白、低脂肪、高纤维）|
|»»» bestMealTime|string|true|none|最佳用餐时间|建议的最佳用餐时间（如：早餐、午餐、晚餐）|
|»»» seasonalAdvice|string|true|none|季节建议|根据季节给出的食用建议|
|»»» recommendReason|string|true|none|推荐理由|推荐该食谱的理由|
|»»» healthBenefits|string|true|none|健康益处|食谱对健康的益处|
|»»» matchScore|integer|true|none|匹配分数|食谱与用户需求的匹配分数|
|»»» matchReason|string|true|none|匹配理由|食谱匹配用户需求的具体理由|
|»» pagination|object|true|none|分页信息|分页信息|
|»»» page|integer|true|none|当前页码|当前页码|
|»»» pageSize|integer|true|none|每页数量|每页显示的食谱数量|
|»»» total|integer|true|none|总数|食谱总数量|
|»» aiAnalysis|object|true|none|AI分析|AI对推荐结果的分析|
|»»» userProfile|string|true|none|用户画像|AI分析的用户画像摘要|
|»»» recommendStrategy|string|true|none|推荐策略|AI采用的推荐策略说明|
|»»» nutritionBalance|string|true|none|营养均衡分析|AI对营养均衡的分析|

# 数据模型

