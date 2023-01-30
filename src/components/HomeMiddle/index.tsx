import React, { useContext, useEffect, useState } from 'react'
import { context } from '../../hooks/store'
import style from './index.module.scss'
import './index.css'
import MessageItem from './MessageItem'
import SortRule from './SortRule'
import PublicArticle from './PublicArticle'
import { IRecord, rule } from '../../libs/model'
import usePostArray from '../../hooks/usePostArray'
import qqIcon from '../../assets/qq.png'
import Mask from './Mask'

export default function HomeMiddle () {
  const { categoryId, ruleType, PostList } = useContext(context)
  const { lastArticle, hotArticle } = usePostArray()
  const [post, setPost] = useState<IRecord>()

  const getArticles = async (type: rule, categoryId: number) => {
    console.log(categoryId, ruleType)
    if (type === 'lasted') {
      lastArticle()
    } else if (type === 'hottest') {
      hotArticle()
    }
  }

  const showDetailMask = (post: IRecord) => {
    setPost(post)
  }

  const closeMask = () => {
    setPost(undefined)
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
              <MessageItem post={post} showDetailMask={showDetailMask}></MessageItem>
            </div>
          )
        }
      </div>
      <img src={qqIcon} className={style.qqIcon}></img>
      {
        post ? <Mask post={post} closeMask={closeMask}></Mask> : null
      }
    </div>
  )
}
