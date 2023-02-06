import { useContext, useState } from "react"
import { HottestArticles, LatestArticles } from "../api/article"
import { rule } from "../libs/model"
import { context } from "./store"

export default function usePostArray () {
  const { setPostList, categoryId } = useContext(context)
  const [total, setTotal] = useState<number>()

  // 展示最新文章
  const lastArticle = async (current: number) => {
    let res
    if (categoryId < 0) {
      res = await LatestArticles(current)
    } else {
      res = await LatestArticles(current, categoryId)
    }
    if (res) {
      setPostList(res.data.records)
      setTotal(res?.data.total)
    }
  }
  // 展示最热文章
  const hotArticle = async (current: number) => {
    let res
    if (categoryId < 0) {
      res = await HottestArticles(current)
    } else {
      res = await HottestArticles(current, categoryId)
    }
    if (res) {
      setPostList(res.data.records)
      setTotal(res?.data.total)
    }
  }

  // 得到文章
  const getArticles = async (type: rule, current: number) => {
    if (type === 'lasted') {
      lastArticle(current)
    } else if (type === 'hottest') {
      hotArticle(current)
    }
  }

  return {
    lastArticle,
    hotArticle,
    getArticles,
    total
  }
}
