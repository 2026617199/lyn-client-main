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
    },
    "sessionId": "550e8400-e29b-41d4-a716-446655440000"
  }
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
    },
    "sessionId": "550e8400-e29b-41d4-a716-446655440000"
  }
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
  "message": "success",
  "data": {}
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

