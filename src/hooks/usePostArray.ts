import { useContext } from "react"
import { HottestArticles, LatestArticles } from "../api/article"
import { context } from "./store"

export default function usePostArray () {
  const { setPostList } = useContext(context)
  // 展示最新文章
  const lastArticle = async () => {
    const res = await LatestArticles()
    if (res) {
      setPostList(res.data.records)
    }
  }

  // 展示最热文章
  const hotArticle = async () => {
    const res = await HottestArticles()
    if (res) {
      setPostList(res.data.records)
    }
  }

  return {
    lastArticle,
    hotArticle
  }
}
