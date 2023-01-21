import React, { useContext, useEffect } from 'react'
import { context } from '../../hooks/store'
import style from './index.module.scss'
import './index.css'
import MessageItem from './MessageItem'
import SortRule from './SortRule'
import PublicArticle from './PublicArticle'
import { rule } from '../../libs/model'
import { getCategoryArray } from '../../api/article'
import usePostArray from '../../hooks/usePostArray'

export default function HomeMiddle () {
  const { categoryId, ruleType, PostList } = useContext(context)
  const { lastArticle, hotArticle } = usePostArray()

  const getArticles = async (type: rule) => {
    if (categoryId >= 0) {
      const res = await getCategoryArray(categoryId)
      if (res) {
        console.log(res.data)
      }
    } else {
      if (type === 'lasted') {
        lastArticle()
      } else if (type === 'hottest') {
        hotArticle()
      }
    }
  }
  useEffect(() => {
    getArticles(ruleType)
  }, [ruleType, categoryId])

  useEffect(() => {
    getArticles(ruleType)
  }, [])

  return (
    <div className={style.mid}>
      <div className={style.box}>
        <PublicArticle></PublicArticle>
        <SortRule></SortRule>
        {
          PostList.map((post) =>
            <div key={post.articleId}>
              <MessageItem post={post}></MessageItem>
            </div>
          )
        }
      </div>
    </div>
  )
}
