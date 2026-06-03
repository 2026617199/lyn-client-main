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

# Auth

## POST 用户注册

POST /api/auth/register

创建新的用户账号

> Body 请求参数

```json
{
  "username": "testuser123",
  "password": "password123"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 是 |none|
|» username|body|string| 是 |用户名，3-20位字母数字下划线|
|» password|body|string| 是 |密码，至少6位字符|

> 返回示例

> 201 Response

```json
{
  "code": 0,
  "message": "注册成功",
  "data": {
    "user": {
      "username": "test",
      "userType": "registered",
      "role": "user",
      "sessionId": "03bcaf73-897d-4016-bd10-6336fabf8b3d",
      "constitution": {
        "type": null,
        "diagnosisMethod": null,
        "diagnosedAt": null
      },
      "lastLoginAt": null,
      "loginCount": 0,
      "_id": "693b8cd4a6a0606d0b695a76",
      "createdAt": "2025-12-12T03:32:36.430Z",
      "lastActiveAt": "2025-12-12T03:32:36.430Z",
      "updatedAt": "2025-12-12T03:32:36.430Z",
      "__v": 0
    },
    "sessionId": "03bcaf73-897d-4016-bd10-6336fabf8b3d"
  }
}
```

> 400 Response

```json
{
  "code": 0,
  "message": "string"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|注册成功|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|注册失败|[Error](#schemaerror)|

### 返回数据结构

#### 枚举值

|属性|值|
|---|---|
|userType|anonymous|
|userType|registered|
|userType|admin|
|role|user|
|role|admin|
|type|balanced|
|type|qi_deficiency|
|type|yang_deficiency|
|type|yin_deficiency|
|type|phlegm_dampness|
|type|damp_heat|
|type|blood_stasis|
|type|qi_stagnation|
|type|special|
|diagnosisMethod|manual|
|diagnosisMethod|ai|

状态码 **400**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|false|none||错误码|
|» message|string|false|none||错误信息|

## POST 用户登录

POST /api/auth/login

使用用户名密码登录系统

> Body 请求参数

```json
{
  "username": "testuser123",
  "password": "password123"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 是 |none|
|» username|body|string| 是 |用户名|
|» password|body|string| 是 |密码|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "登录成功",
  "data": {
    "user": {
      "constitution": {
        "type": null,
        "diagnosisMethod": null,
        "diagnosedAt": null
      },
      "_id": "693b8cd4a6a0606d0b695a76",
      "username": "test",
      "userType": "registered",
      "role": "user",
      "sessionId": "2aaf880d-2809-4df8-86c2-58a99a5e0a47",
      "lastLoginAt": "2025-12-12T03:36:56.089Z",
      "loginCount": 1,
      "createdAt": "2025-12-12T03:32:36.430Z",
      "lastActiveAt": "2025-12-12T03:32:36.430Z",
      "updatedAt": "2025-12-12T03:36:56.089Z",
      "__v": 0
    },
    "sessionId": "2aaf880d-2809-4df8-86c2-58a99a5e0a47"
  }
}
```

> 401 Response

```json
{
  "code": 0,
  "message": "string"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|登录成功|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|登录失败|[Error](#schemaerror)|

### 返回数据结构

#### 枚举值

|属性|值|
|---|---|
|userType|anonymous|
|userType|registered|
|userType|admin|
|role|user|
|role|admin|
|type|balanced|
|type|qi_deficiency|
|type|yang_deficiency|
|type|yin_deficiency|
|type|phlegm_dampness|
|type|damp_heat|
|type|blood_stasis|
|type|qi_stagnation|
|type|special|
|diagnosisMethod|manual|
|diagnosisMethod|ai|

状态码 **401**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|false|none||错误码|
|» message|string|false|none||错误信息|

## POST 用户登出

POST /api/auth/logout

用户退出登录，清除会话

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|X-Session-Id|header|string| 是 |会话ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "登出成功",
  "data": null
}
```

> 401 Response

```json
{
  "code": 0,
  "message": "string"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|登出成功|[Success](#schemasuccess)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未登录或会话过期|[Error](#schemaerror)|

## GET 获取当前用户信息

GET /api/auth/me

获取当前登录用户的详细信息

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|X-Session-Id|header|string| 否 |会话ID（可选）|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "userType": "anonymous",
      "role": "user",
      "sessionId": "string",
      "constitution": {
        "type": null,
        "diagnosisMethod": null,
        "diagnosedAt": null
      },
      "lastLoginAt": "2019-08-24T14:15:22Z",
      "loginCount": 0,
      "createdAt": "2019-08-24T14:15:22Z",
      "lastActiveAt": "2019-08-24T14:15:22Z"
    }
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|获取成功|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未登录或会话过期|[Error](#schemaerror)|

### 返回数据结构

#### 枚举值

|属性|值|
|---|---|
|userType|anonymous|
|userType|registered|
|userType|admin|
|role|user|
|role|admin|
|type|balanced|
|type|qi_deficiency|
|type|yang_deficiency|
|type|yin_deficiency|
|type|phlegm_dampness|
|type|damp_heat|
|type|blood_stasis|
|type|qi_stagnation|
|type|special|
|diagnosisMethod|manual|
|diagnosisMethod|ai|

状态码 **401**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|false|none||错误码|
|» message|string|false|none||错误信息|

## PUT 修改密码

PUT /api/auth/password

修改当前用户的密码

> Body 请求参数

```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|X-Session-Id|header|string| 是 |会话ID|
|body|body|object| 是 |none|
|» currentPassword|body|string| 是 |当前密码|
|» newPassword|body|string| 是 |新密码，至少6位字符|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|修改成功|[Success](#schemasuccess)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|修改失败|[Error](#schemaerror)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未登录或会话过期|[Error](#schemaerror)|

## POST 刷新会话

POST /api/auth/refresh

延长会话过期时间

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|X-Session-Id|header|string| 否 |会话ID（可选）|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "expiresAt": "2019-08-24T14:15:22Z"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|刷新成功|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|刷新失败|[Error](#schemaerror)|

### 返回数据结构

状态码 **400**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|false|none||错误码|
|» message|string|false|none||错误信息|

## GET 检查登录状态

GET /api/auth/status

检查当前会话的登录状态

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|X-Session-Id|header|string| 否 |会话ID（可选）|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "authenticated": true,
    "user": {
      "id": "string",
      "username": "string",
      "userType": "anonymous",
      "role": "user",
      "sessionId": "string",
      "constitution": {
        "type": null,
        "diagnosisMethod": null,
        "diagnosedAt": null
      },
      "lastLoginAt": "2019-08-24T14:15:22Z",
      "loginCount": 0,
      "createdAt": "2019-08-24T14:15:22Z",
      "lastActiveAt": "2019-08-24T14:15:22Z"
    }
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|检查成功|Inline|

### 返回数据结构

#### 枚举值

|属性|值|
|---|---|
|userType|anonymous|
|userType|registered|
|userType|admin|
|role|user|
|role|admin|
|type|balanced|
|type|qi_deficiency|
|type|yang_deficiency|
|type|yin_deficiency|
|type|phlegm_dampness|
|type|damp_heat|
|type|blood_stasis|
|type|qi_stagnation|
|type|special|
|diagnosisMethod|manual|
|diagnosisMethod|ai|

# User

## GET 获取用户列表

GET /api/user

获取系统中所有用户的列表（仅管理员）

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|page|query|integer| 否 |页码|
|pageSize|query|integer| 否 |每页数量|
|userType|query|string| 否 |按用户类型筛选|
|keyword|query|string| 否 |关键词搜索（用户名）|
|X-Session-Id|header|string| 是 |管理员会话ID|

#### 枚举值

|属性|值|
|---|---|
|userType|anonymous|
|userType|registered|
|userType|admin|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "string",
        "username": "string",
        "userType": "[",
        "role": "[",
        "sessionId": "string",
        "constitution": {},
        "lastLoginAt": "2019-08-24T14:15:22Z",
        "loginCount": 0,
        "createdAt": "2019-08-24T14:15:22Z",
        "lastActiveAt": "2019-08-24T14:15:22Z"
      }
    ],
    "pagination": {
      "total": 0,
      "page": 0,
      "pageSize": 0,
      "totalPages": 0
    }
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|获取成功|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未登录或权限不足|[Error](#schemaerror)|

### 返回数据结构

#### 枚举值

|属性|值|
|---|---|
|userType|anonymous|
|userType|registered|
|userType|admin|
|role|user|
|role|admin|
|type|balanced|
|type|qi_deficiency|
|type|yang_deficiency|
|type|yin_deficiency|
|type|phlegm_dampness|
|type|damp_heat|
|type|blood_stasis|
|type|qi_stagnation|
|type|special|
|diagnosisMethod|manual|
|diagnosisMethod|ai|

状态码 **401**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|false|none||错误码|
|» message|string|false|none||错误信息|

## PUT 更新用户信息

PUT /api/user

更新当前用户的基本信息

> Body 请求参数

```json
{
  "username": "newusername123"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|X-Session-Id|header|string| 是 |会话ID|
|body|body|object| 是 |none|
|» username|body|string| 否 |新用户名|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "userType": "anonymous",
      "role": "user",
      "sessionId": "string",
      "constitution": {
        "type": null,
        "diagnosisMethod": null,
        "diagnosedAt": null
      },
      "lastLoginAt": "2019-08-24T14:15:22Z",
      "loginCount": 0,
      "createdAt": "2019-08-24T14:15:22Z",
      "lastActiveAt": "2019-08-24T14:15:22Z"
    }
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|更新成功|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|更新失败|[Error](#schemaerror)|

### 返回数据结构

#### 枚举值

|属性|值|
|---|---|
|userType|anonymous|
|userType|registered|
|userType|admin|
|role|user|
|role|admin|
|type|balanced|
|type|qi_deficiency|
|type|yang_deficiency|
|type|yin_deficiency|
|type|phlegm_dampness|
|type|damp_heat|
|type|blood_stasis|
|type|qi_stagnation|
|type|special|
|diagnosisMethod|manual|
|diagnosisMethod|ai|

状态码 **400**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|false|none||错误码|
|» message|string|false|none||错误信息|

## GET 获取用户详情

GET /api/user/{id}

根据用户ID获取用户详细信息

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|string| 是 |用户ID|
|X-Session-Id|header|string| 是 |会话ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "userType": "anonymous",
      "role": "user",
      "sessionId": "string",
      "constitution": {
        "type": null,
        "diagnosisMethod": null,
        "diagnosedAt": null
      },
      "lastLoginAt": "2019-08-24T14:15:22Z",
      "loginCount": 0,
      "createdAt": "2019-08-24T14:15:22Z",
      "lastActiveAt": "2019-08-24T14:15:22Z"
    }
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|获取成功|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|用户不存在|[Error](#schemaerror)|

### 返回数据结构

#### 枚举值

|属性|值|
|---|---|
|userType|anonymous|
|userType|registered|
|userType|admin|
|role|user|
|role|admin|
|type|balanced|
|type|qi_deficiency|
|type|yang_deficiency|
|type|yin_deficiency|
|type|phlegm_dampness|
|type|damp_heat|
|type|blood_stasis|
|type|qi_stagnation|
|type|special|
|diagnosisMethod|manual|
|diagnosisMethod|ai|

状态码 **404**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|false|none||错误码|
|» message|string|false|none||错误信息|

## DELETE 删除用户

DELETE /api/user/{id}

删除指定用户（仅管理员）

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|string| 是 |要删除的用户ID|
|X-Session-Id|header|string| 是 |管理员会话ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|删除成功|[Success](#schemasuccess)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|权限不足|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|用户不存在|[Error](#schemaerror)|

## POST 设置用户体质

POST /api/user/constitution

为当前用户设置体质类型

> Body 请求参数

```json
{
  "type": "balanced",
  "diagnosisMethod": "manual"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|X-Session-Id|header|string| 是 |会话ID|
|body|body|object| 是 |none|
|» type|body|string| 是 |体质类型|
|» diagnosisMethod|body|string| 否 |诊断方式|

#### 枚举值

|属性|值|
|---|---|
|» type|balanced|
|» type|qi_deficiency|
|» type|yang_deficiency|
|» type|yin_deficiency|
|» type|phlegm_dampness|
|» type|damp_heat|
|» type|blood_stasis|
|» type|qi_stagnation|
|» type|special|
|» diagnosisMethod|manual|
|» diagnosisMethod|ai|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|设置成功|[Success](#schemasuccess)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|设置失败|[Error](#schemaerror)|

## GET 获取用户体质信息

GET /api/user/constitution

获取当前用户的体质信息

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|X-Session-Id|header|string| 是 |会话ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "constitution": {
      "type": "balanced",
      "diagnosisMethod": "manual",
      "diagnosedAt": "2019-08-24T14:15:22Z"
    }
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|获取成功|Inline|

### 返回数据结构

#### 枚举值

|属性|值|
|---|---|
|type|balanced|
|type|qi_deficiency|
|type|yang_deficiency|
|type|yin_deficiency|
|type|phlegm_dampness|
|type|damp_heat|
|type|blood_stasis|
|type|qi_stagnation|
|type|special|
|diagnosisMethod|manual|
|diagnosisMethod|ai|

## POST 升级匿名用户为注册用户

POST /api/user/upgrade

将当前匿名用户升级为注册用户

> Body 请求参数

```json
{
  "username": "newregistereduser",
  "password": "password123"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|X-Session-Id|header|string| 是 |匿名用户的会话ID|
|body|body|object| 是 |none|
|» username|body|string| 是 |用户名|
|» password|body|string| 是 |密码|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "userType": "anonymous",
      "role": "user",
      "sessionId": "string",
      "constitution": {
        "type": null,
        "diagnosisMethod": null,
        "diagnosedAt": null
      },
      "lastLoginAt": "2019-08-24T14:15:22Z",
      "loginCount": 0,
      "createdAt": "2019-08-24T14:15:22Z",
      "lastActiveAt": "2019-08-24T14:15:22Z"
    }
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|升级成功|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|升级失败|[Error](#schemaerror)|

### 返回数据结构

#### 枚举值

|属性|值|
|---|---|
|userType|anonymous|
|userType|registered|
|userType|admin|
|role|user|
|role|admin|
|type|balanced|
|type|qi_deficiency|
|type|yang_deficiency|
|type|yin_deficiency|
|type|phlegm_dampness|
|type|damp_heat|
|type|blood_stasis|
|type|qi_stagnation|
|type|special|
|diagnosisMethod|manual|
|diagnosisMethod|ai|

状态码 **400**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|false|none||错误码|
|» message|string|false|none||错误信息|

## GET 获取用户统计信息

GET /api/user/stats

获取系统用户统计信息（仅管理员）

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|X-Session-Id|header|string| 是 |管理员会话ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "totalUsers": 100,
    "anonymousUsers": 30,
    "registeredUsers": 65,
    "adminUsers": 5,
    "usersWithConstitution": 80,
    "activeSessions": 25
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|获取成功|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|权限不足|[Error](#schemaerror)|

### 返回数据结构

状态码 **403**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|false|none||错误码|
|» message|string|false|none||错误信息|

# Chat

## POST AI 问诊对话

POST /api/chat

发送消息与 AI 进行对话

> Body 请求参数

```json
{
  "message": "我最近总是感觉疲劳，手脚冰凉，是什么原因？",
  "history": [
    {
      "role": "user",
      "content": "string"
    }
  ]
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|X-Session-Id|header|string| 是 |会话ID|
|body|body|object| 是 |none|
|» message|body|string| 是 |用户消息|
|» history|body|[object]| 否 |历史对话记录|
|»» role|body|string| 否 |none|
|»» content|body|string| 否 |none|

#### 枚举值

|属性|值|
|---|---|
|»» role|user|
|»» role|assistant|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "reply": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|回复成功|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|false|none||none|
|» message|string|false|none||none|
|» data|object|false|none||none|
|»» reply|string|false|none||AI 回复内容|

## POST AI 问诊流式对话

POST /api/chat/stream

发送消息与 AI 进行流式对话（SSE）

> Body 请求参数

```json
{
  "message": "string",
  "history": [
    "string"
  ]
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|X-Session-Id|header|string| 是 |会话ID|
|body|body|object| 是 |none|
|» message|body|string| 是 |用户消息|
|» history|body|[string]| 否 |历史对话记录|

> 返回示例

> 200 Response

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|流式响应|string|

# Constitution

## GET 获取所有体质类型

GET /api/constitutions

获取系统中所有可用的体质类型列表

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "type": "string",
      "name": "string",
      "description": "string",
      "characteristics": [
        "string"
      ]
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|获取成功|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|false|none||none|
|» message|string|false|none||none|
|» data|[object]|false|none||none|
|»» type|string|false|none||none|
|»» name|string|false|none||none|
|»» description|string|false|none||none|
|»» characteristics|[string]|false|none||none|

## GET 获取指定体质详情

GET /api/constitutions/{type}

根据体质类型获取详细信息

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|type|path|string| 是 |体质类型标识|

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|获取成功|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|体质类型不存在|None|

## PUT 设置用户体质

PUT /api/session/{sessionId}/constitution

为用户设置体质类型

> Body 请求参数

```json
{
  "constitutionType": "qi_deficiency",
  "diagnosisMethod": "manual"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|sessionId|path|string| 是 |会话ID|
|body|body|object| 是 |none|
|» constitutionType|body|string| 是 |体质类型标识|
|» diagnosisMethod|body|string| 否 |诊断方式|

#### 枚举值

|属性|值|
|---|---|
|» diagnosisMethod|manual|
|» diagnosisMethod|ai|

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|设置成功|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|参数错误|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|会话或体质类型不存在|None|

## GET 获取用户体质信息

GET /api/session/{sessionId}/constitution

获取用户当前的体质类型及详细信息

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|sessionId|path|string| 是 |会话ID|

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|获取成功|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|会话不存在|None|

# Preference

## GET 获取用户偏好

GET /api/preferences

根据sessionId获取用户的口味偏好设置

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|x-session-id|header|string| 是 |用户会话ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "data": {
    "flavorPreference": {
      "sour": 100,
      "sweet": 100,
      "bitter": 100,
      "spicy": 100,
      "salty": 100
    },
    "dietaryRestrictions": [
      "string"
    ],
    "allergies": [
      "string"
    ],
    "dislikedIngredients": [
      "string"
    ],
    "currentConditions": [
      "string"
    ],
    "mealScenarios": [
      "string"
    ],
    "cookingDifficulty": 1,
    "maxCookingTime": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|获取成功|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|用户或偏好不存在|None|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|false|none||none|
|» data|[UserPreference](#schemauserpreference)|false|none||none|
|»» flavorPreference|[FlavorPreference](#schemaflavorpreference)|false|none||none|
|»»» sour|number|false|none||酸味偏好程度|
|»»» sweet|number|false|none||甜味偏好程度|
|»»» bitter|number|false|none||苦味偏好程度|
|»»» spicy|number|false|none||辣味偏好程度|
|»»» salty|number|false|none||咸味偏好程度|
|»» dietaryRestrictions|[string]|false|none||饮食禁忌列表|
|»» allergies|[string]|false|none||过敏原列表|
|»» dislikedIngredients|[string]|false|none||不喜欢的食材|
|»» currentConditions|[string]|false|none||当前身体状态|
|»» mealScenarios|[string]|false|none||用餐场景偏好|
|»» cookingDifficulty|number|false|none||烹饪难度偏好|
|»» maxCookingTime|number|false|none||最大烹饪时间（分钟）|

## PUT 更新用户偏好

PUT /api/preferences

更新用户的口味偏好设置，支持部分更新

> Body 请求参数

```json
{
  "flavorPreference": {
    "sour": 100,
    "sweet": 100,
    "bitter": 100,
    "spicy": 100,
    "salty": 100
  },
  "dietaryRestrictions": [
    "string"
  ],
  "allergies": [
    "string"
  ],
  "dislikedIngredients": [
    "string"
  ],
  "currentConditions": [
    "string"
  ],
  "mealScenarios": [
    "string"
  ],
  "cookingDifficulty": 1,
  "maxCookingTime": 0
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|x-session-id|header|string| 是 |用户会话ID|
|body|body|[UserPreference](#schemauserpreference)| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "偏好更新成功",
  "data": {
    "flavorPreference": {
      "sour": 100,
      "sweet": 100,
      "bitter": 100,
      "spicy": 100,
      "salty": 100
    },
    "dietaryRestrictions": [
      "string"
    ],
    "allergies": [
      "string"
    ],
    "dislikedIngredients": [
      "string"
    ],
    "currentConditions": [
      "string"
    ],
    "mealScenarios": [
      "string"
    ],
    "cookingDifficulty": 1,
    "maxCookingTime": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|更新成功|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|请求参数错误|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|用户不存在|None|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|false|none||none|
|» message|string|false|none||none|
|» data|[UserPreference](#schemauserpreference)|false|none||none|
|»» flavorPreference|[FlavorPreference](#schemaflavorpreference)|false|none||none|
|»»» sour|number|false|none||酸味偏好程度|
|»»» sweet|number|false|none||甜味偏好程度|
|»»» bitter|number|false|none||苦味偏好程度|
|»»» spicy|number|false|none||辣味偏好程度|
|»»» salty|number|false|none||咸味偏好程度|
|»» dietaryRestrictions|[string]|false|none||饮食禁忌列表|
|»» allergies|[string]|false|none||过敏原列表|
|»» dislikedIngredients|[string]|false|none||不喜欢的食材|
|»» currentConditions|[string]|false|none||当前身体状态|
|»» mealScenarios|[string]|false|none||用餐场景偏好|
|»» cookingDifficulty|number|false|none||烹饪难度偏好|
|»» maxCookingTime|number|false|none||最大烹饪时间（分钟）|

## DELETE 重置用户偏好

DELETE /api/preferences

重置用户的口味偏好为默认值

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|x-session-id|header|string| 是 |用户会话ID|

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|重置成功|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|用户不存在|None|

# Recipe

## GET 获取菜谱列表

GET /api/recipes

获取菜谱列表，支持分页、筛选、搜索，可根据用户体质和偏好计算匹配度

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|category|query|string| 否 |菜谱分类筛选|
|keyword|query|string| 否 |搜索关键词（菜名、描述、食材）|
|isActive|query|string| 否 |启用状态筛选（true-已启用，false-已禁用，不传则查询所有）|
|page|query|integer| 否 |页码|
|pageSize|query|integer| 否 |每页数量|
|X-Session-Id|header|string| 否 |会话ID（用于个性化推荐）|

#### 枚举值

|属性|值|
|---|---|
|category|recommended|
|category|warming|
|category|cooling|
|category|quick|
|isActive|true|
|isActive|false|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "data": {
    "list": [
      {}
    ],
    "pagination": {
      "page": 0,
      "pageSize": 0,
      "total": 0
    }
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|获取成功|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|false|none||none|
|» data|object|false|none||none|
|»» list|[object]|false|none||none|
|»» pagination|object|false|none||none|
|»»» page|integer|false|none||none|
|»»» pageSize|integer|false|none||none|
|»»» total|integer|false|none||none|

## POST 创建新菜谱

POST /api/recipes

创建一个新的菜谱

> Body 请求参数

```json
{}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 是 |none|

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|创建成功|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|参数错误|None|

## GET 获取菜谱详情

GET /api/recipes/{id}

根据ID获取菜谱详细信息

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|string| 是 |菜谱ID|
|X-Session-Id|header|string| 否 |会话ID（用于计算个性化匹配度）|

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|获取成功|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|菜谱不存在|None|

## PUT 更新菜谱

PUT /api/recipes/{id}

更新指定ID的菜谱信息

> Body 请求参数

```json
{}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|string| 是 |菜谱ID|
|body|body|object| 是 |none|

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|更新成功|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|参数错误|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|菜谱不存在|None|

## DELETE 删除菜谱

DELETE /api/recipes/{id}

硬删除指定ID的菜谱

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|string| 是 |菜谱ID|

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|删除成功|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|菜谱不存在|None|

## GET 获取推荐菜谱

GET /api/recipes/recommend

根据用户体质和偏好获取个性化推荐菜谱

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|limit|query|integer| 否 |返回数量|
|X-Session-Id|header|string| 是 |会话ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "data": {
    "list": [
      "string"
    ],
    "reason": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|获取成功|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|false|none||none|
|» data|object|false|none||none|
|»» list|[string]|false|none||none|
|»» reason|string|false|none||none|

## GET 获取菜谱分类统计

GET /api/recipes/categories

获取各分类的菜谱数量

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|获取成功|None|

## POST AI生成菜谱

POST /api/recipes/generate

根据菜品描述、目标体质和特殊要求使用AI生成个性化菜谱数据

> Body 请求参数

```json
{
  "dishDescription": "我想做一道清淡的汤，希望有养胃的功效，适合晚餐食用",
  "targetConstitution": "qi_deficiency",
  "specialRequirements": "不要放葱，少吃盐，希望口感偏甜，烹饪时间控制在30分钟内"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 是 |none|
|» dishDescription|body|string| 是 |菜品描述，详细说明想要制作的菜品特点、功效等|
|» targetConstitution|body|string| 否 |目标体质类型，用于个性化调理|
|» specialRequirements|body|string| 否 |特殊要求，如过敏原、饮食禁忌、口味偏好等|

#### 枚举值

|属性|值|
|---|---|
|» targetConstitution|balanced|
|» targetConstitution|qi_deficiency|
|» targetConstitution|yang_deficiency|
|» targetConstitution|yin_deficiency|
|» targetConstitution|phlegm_dampness|
|» targetConstitution|damp_heat|
|» targetConstitution|blood_stasis|
|» targetConstitution|qi_stagnation|
|» targetConstitution|special|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "data": {}
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
|» code|integer|false|none||none|
|» data|object|false|none||生成的菜谱数据|

## POST 保存AI生成的菜谱

POST /api/recipes/save-generated

保存经过人工编辑的AI生成菜谱到数据库

> Body 请求参数

```json
{
  "name": "string",
  "description": "string",
  "nature": "寒",
  "ingredients": [
    "string"
  ],
  "steps": [
    "string"
  ]
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 是 |none|
|» name|body|string| 否 |菜谱名称|
|» description|body|string| 否 |菜谱描述|
|» nature|body|string| 否 |性味|
|» ingredients|body|[string]| 否 |食材列表|
|» steps|body|[string]| 否 |烹饪步骤|

#### 枚举值

|属性|值|
|---|---|
|» nature|寒|
|» nature|凉|
|» nature|平|
|» nature|温|
|» nature|热|

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|保存成功|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|参数错误或验证失败|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|服务器错误|None|

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
  "data": {
    "list": [
      {
        "_id": "string",
        "name": "string",
        "description": "string",
        "matchScore": 0,
        "matchReason": "string",
        "aiRecommendation": {
          "reason": "string",
          "nutritionTags": [
            null
          ],
          "bestMealTime": "string",
          "seasonalAdvice": "string"
        }
      }
    ],
    "pagination": {
      "page": 0,
      "pageSize": 0,
      "total": 0
    },
    "aiAnalysis": {
      "userProfile": "string",
      "recommendStrategy": "string",
      "nutritionBalance": "string"
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

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|false|none||none|
|» data|object|false|none||none|
|»» list|[object]|false|none||none|
|»»» _id|string|false|none||none|
|»»» name|string|false|none||none|
|»»» description|string|false|none||none|
|»»» matchScore|integer|false|none||none|
|»»» matchReason|string|false|none||none|
|»»» aiRecommendation|object|false|none||none|
|»»»» reason|string|false|none||none|
|»»»» nutritionTags|[string]|false|none||none|
|»»»» bestMealTime|string|false|none||none|
|»»»» seasonalAdvice|string|false|none||none|
|»» pagination|object|false|none||none|
|»»» page|integer|false|none||none|
|»»» pageSize|integer|false|none||none|
|»»» total|integer|false|none||none|
|»» aiAnalysis|object|false|none||none|
|»»» userProfile|string|false|none||none|
|»»» recommendStrategy|string|false|none||none|
|»»» nutritionBalance|string|false|none||none|

# Session

## POST 创建新会话

POST /api/session

创建匿名用户会话，返回sessionId

> 返回示例

> 201 Response

```json
{
  "code": 0,
  "message": "会话创建成功",
  "data": {
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "user": {}
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|会话创建成功|Inline|

### 返回数据结构

状态码 **201**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|false|none||none|
|» message|string|false|none||none|
|» data|object|false|none||none|
|»» sessionId|string|false|none||none|
|»» user|object|false|none||none|

## GET 获取会话信息

GET /api/session/{sessionId}

根据sessionId获取用户会话信息

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|sessionId|path|string| 是 |会话ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|获取成功|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|会话不存在|None|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|false|none||none|
|» message|string|false|none||none|
|» data|object|false|none||none|

## DELETE 删除会话

DELETE /api/session/{sessionId}

删除用户会话及相关数据

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|sessionId|path|string| 是 |会话ID|

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|删除成功|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|会话不存在|None|

# 数据模型

<h2 id="tocS_Error">Error</h2>

<a id="schemaerror"></a>
<a id="schema_Error"></a>
<a id="tocSerror"></a>
<a id="tocserror"></a>

```json
{
  "code": 0,
  "message": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||错误码|
|message|string|false|none||错误信息|

<h2 id="tocS_Success">Success</h2>

<a id="schemasuccess"></a>
<a id="schema_Success"></a>
<a id="tocSsuccess"></a>
<a id="tocssuccess"></a>

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|false|none||none|
|message|string|false|none||none|
|data|object|false|none||none|

<h2 id="tocS_User">User</h2>

<a id="schemauser"></a>
<a id="schema_User"></a>
<a id="tocSuser"></a>
<a id="tocsuser"></a>

```json
{
  "id": "string",
  "username": "string",
  "userType": "anonymous",
  "role": "user",
  "sessionId": "string",
  "constitution": {
    "type": "balanced",
    "diagnosisMethod": "manual",
    "diagnosedAt": "2019-08-24T14:15:22Z"
  },
  "lastLoginAt": "2019-08-24T14:15:22Z",
  "loginCount": 0,
  "createdAt": "2019-08-24T14:15:22Z",
  "lastActiveAt": "2019-08-24T14:15:22Z"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|string|false|none||用户ID|
|username|string|false|none||用户名|
|userType|string|false|none||用户类型|
|role|string|false|none||用户角色|
|sessionId|string|false|none||会话ID|
|constitution|[Constitution](#schemaconstitution)|false|none||none|
|lastLoginAt|string(date-time)|false|none||最后登录时间|
|loginCount|integer|false|none||登录次数|
|createdAt|string(date-time)|false|none||创建时间|
|lastActiveAt|string(date-time)|false|none||最后活跃时间|

#### 枚举值

|属性|值|
|---|---|
|userType|anonymous|
|userType|registered|
|userType|admin|
|role|user|
|role|admin|

<h2 id="tocS_Constitution">Constitution</h2>

<a id="schemaconstitution"></a>
<a id="schema_Constitution"></a>
<a id="tocSconstitution"></a>
<a id="tocsconstitution"></a>

```json
{
  "type": "balanced",
  "diagnosisMethod": "manual",
  "diagnosedAt": "2019-08-24T14:15:22Z"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|type|string|false|none||体质类型|
|diagnosisMethod|string|false|none||诊断方式|
|diagnosedAt|string(date-time)|false|none||诊断时间|

#### 枚举值

|属性|值|
|---|---|
|type|balanced|
|type|qi_deficiency|
|type|yang_deficiency|
|type|yin_deficiency|
|type|phlegm_dampness|
|type|damp_heat|
|type|blood_stasis|
|type|qi_stagnation|
|type|special|
|diagnosisMethod|manual|
|diagnosisMethod|ai|

<h2 id="tocS_Pagination">Pagination</h2>

<a id="schemapagination"></a>
<a id="schema_Pagination"></a>
<a id="tocSpagination"></a>
<a id="tocspagination"></a>

```json
{
  "total": 0,
  "page": 0,
  "pageSize": 0,
  "totalPages": 0
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|total|integer|false|none||总记录数|
|page|integer|false|none||当前页码|
|pageSize|integer|false|none||每页数量|
|totalPages|integer|false|none||总页数|

<h2 id="tocS_FlavorPreference">FlavorPreference</h2>

<a id="schemaflavorpreference"></a>
<a id="schema_FlavorPreference"></a>
<a id="tocSflavorpreference"></a>
<a id="tocsflavorpreference"></a>

```json
{
  "sour": 100,
  "sweet": 100,
  "bitter": 100,
  "spicy": 100,
  "salty": 100
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|sour|number|false|none||酸味偏好程度|
|sweet|number|false|none||甜味偏好程度|
|bitter|number|false|none||苦味偏好程度|
|spicy|number|false|none||辣味偏好程度|
|salty|number|false|none||咸味偏好程度|

<h2 id="tocS_UserPreference">UserPreference</h2>

<a id="schemauserpreference"></a>
<a id="schema_UserPreference"></a>
<a id="tocSuserpreference"></a>
<a id="tocsuserpreference"></a>

```json
{
  "flavorPreference": {
    "sour": 100,
    "sweet": 100,
    "bitter": 100,
    "spicy": 100,
    "salty": 100
  },
  "dietaryRestrictions": [
    "string"
  ],
  "allergies": [
    "string"
  ],
  "dislikedIngredients": [
    "string"
  ],
  "currentConditions": [
    "string"
  ],
  "mealScenarios": [
    "string"
  ],
  "cookingDifficulty": 1,
  "maxCookingTime": 0
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|flavorPreference|[FlavorPreference](#schemaflavorpreference)|false|none||none|
|dietaryRestrictions|[string]|false|none||饮食禁忌列表|
|allergies|[string]|false|none||过敏原列表|
|dislikedIngredients|[string]|false|none||不喜欢的食材|
|currentConditions|[string]|false|none||当前身体状态|
|mealScenarios|[string]|false|none||用餐场景偏好|
|cookingDifficulty|number|false|none||烹饪难度偏好|
|maxCookingTime|number|false|none||最大烹饪时间（分钟）|

