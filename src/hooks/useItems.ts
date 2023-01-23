import { message } from "antd"
import { isAttention, toggleAttention } from "../api/user"

export default function useItems () {
  // 查询关注
  const queryAttention = async (userId: string) => {
    const res = await isAttention(userId)
    if (res) {
      return res?.data
    }
  }

  // 关注&取消关注
  const toggleConcerned = async (userId: string, isFollow: boolean) => {
    const res = await toggleAttention(userId, isFollow)
    if (res) {
      message.success(res.data)
    }
  }
  return {
    queryAttention,
    toggleConcerned
  }
}
