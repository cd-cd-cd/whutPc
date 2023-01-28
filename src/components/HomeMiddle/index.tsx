import React, { useContext, useEffect } from 'react'
import { context } from '../../hooks/store'
import style from './index.module.scss'
import './index.css'
import MessageItem from './MessageItem'
import SortRule from './SortRule'
import PublicArticle from './PublicArticle'
import { rule } from '../../libs/model'
import usePostArray from '../../hooks/usePostArray'
import qqIcon from '../../assets/qq.png'

export default function HomeMiddle () {
  const { categoryId, ruleType, PostList } = useContext(context)
  const { lastArticle, hotArticle } = usePostArray()

  const getArticles = async (type: rule, categoryId: number) => {
    console.log(categoryId, ruleType)
    if (type === 'lasted') {
      lastArticle()
    } else if (type === 'hottest') {
      hotArticle()
    }
  }

  useEffect(() => {
    getArticles(ruleType, categoryId)
  }, [ruleType, categoryId])

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
      <img src={qqIcon} className={style.qqIcon}></img>
    </div>
  )
}
