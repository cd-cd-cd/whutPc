import { IResUserInfo } from "../libs/model";
import request from "../utils/request";

interface ReGetCode {
  code: number
  data: string
  errorMsg: string
  success: boolean
}

interface ReLogin {
  code: number
  data: any
  errorMsg: string
  success: boolean
}

// 教育邮箱发送验证码
export const getCode = async (email: string) => {
  return await request<ReGetCode>({
    url: '/user/sentCode',
    method: 'POST',
    params: {
      email
    }
  })
}

export const testButton = async () => {
  return await request({
    url: '/article/new',
    method: 'GET'
  })
}

// 注册用户
export const register = async (code: string, email: string, password: string) => {
  return await request<ReLogin>({
    url: '/user/create',
    method: 'POST',
    data: {
      code,
      email,
      password
    }
  })
}

// 登录
export const login = async (email: string, password: string, code?: string) => {
  return await request<string>({
    url: '/user/login',
    method: 'POST',
    data: {
      email,
      password,
      code
    }
  })
}

// 获取用户信息
export const getUser = async (userId: string) => {
  return await request<IResUserInfo>({
    url: `/user/quary/${userId}`,
    method: 'GET',
    data: {
      userId
    }
  })
}

// 修改用户信息
export const editInfo = async (
  nickname: string | undefined,
  sex: number | undefined) => {
  return await request<IResUserInfo>({
    url: '/user/edit',
    method: 'POST',
    data: {
      nickname,
      sex
    }
  })
}

// 修改用户密码
export const changePassword = async (newPassword: string, oldPassword: string) => {
  return await request({
    url: '/user/editPassword',
    method: 'POST',
    data: {
      newPassword,
      oldPassword
    }
  })
}

// 上传头像
export const postAvatar = async (file: FormData) => {
  return await request({
    url: '/user/uploadAvatar',
    method: 'POST',
    data: file
  })
}

// 退出
export const exitUser = async () => {
  return await request({
    url: '/user/logout',
    method: 'PUT'
  })
}
