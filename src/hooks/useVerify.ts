import { message } from "antd"

export default function useVerify () {
  // 验证昵称 昵称2-16位，只能为数字，字母, 汉字，下划线
  const testName = (name: string) => {
    const reg = /^[\u4E00-\u9FA5a-zA-Z0-9_]{2,16}$/
    if (!reg.test(name)) {
      return false
    }
    return true
  }

  // 检查邮箱
  const checkEmail = (email: string) => {
    const emailRegex = /^([a-zA-Z\d][\w-]{2,})@(\w{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/
    if (emailRegex.test(email.trim())) {
      return true
    } else {
      message.info('邮箱格式不正确')
      return false
    }
  }
  return {
    testName,
    checkEmail
  }
}
