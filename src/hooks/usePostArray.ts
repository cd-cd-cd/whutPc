import { useContext } from "react"
import { HottestArticles, LatestArticles } from "../api/article"
import { context } from "./store"

export default function usePostArray () {
  const { setPostList, categoryId } = useContext(context)
  // 展示最新文章
  const lastArticle = async () => {
    let res
    if (categoryId < 0) {
      res = await LatestArticles()
    } else {
      res = await LatestArticles(categoryId)
    }
    if (res) {
      setPostList(res.data.records)
    }
  }
  // 展示最热文章
  const hotArticle = async () => {
    let res
    if (categoryId < 0) {
      res = await HottestArticles()
    } else {
      res = await HottestArticles(categoryId)
    }
    if (res) {
      setPostList(res.data.records)
    }
  }

  return {
    lastArticle,
    hotArticle
  }
}
