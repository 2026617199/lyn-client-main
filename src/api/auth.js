import request from './request'

/**
 * 认证相关API
 */
export const authApi = {
  // 用户注册
  register(username, password) {
    return request.post('/auth/register', {
      username,
      password
    })
  },

  // 用户登录
  login(username, password) {
    return request.post('/auth/login', {
      username,
      password
    })
  },

  // 用户登出
  logout() {
    return request.post('/auth/logout')
  },

  // 获取当前用户信息
  getCurrentUser() {
    return request.get('/auth/me')
  },

  // 修改密码
  changePassword(currentPassword, newPassword) {
    return request.put('/auth/password', {
      currentPassword,
      newPassword
    })
  },

  // 刷新会话
  refreshSession() {
    return request.post('/auth/refresh')
  },

  // 检查登录状态
  checkAuthStatus() {
    return request.get('/auth/status')
  }
}

export default authApi
