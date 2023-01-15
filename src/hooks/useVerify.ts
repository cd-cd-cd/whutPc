export default function useVerify () {
  // 验证昵称 昵称2-16位，只能为数字，字母, 汉字，下划线
  const testName = (name: string) => {
    const reg = /^[\u4E00-\u9FA5a-zA-Z0-9_]{2,16}$/
    if (!reg.test(name)) {
      return false
    }
    return true
  }
  return {
    testName
  }
}
