import React, { useContext } from 'react'
import { context } from '../../hooks/store'
import style from './index.module.scss'
import './index.css'
import MessageItem from './MessageItem'
import SortRule from './SortRule'
import PublicArticle from './PublicArticle'

export default function HomeMiddle () {
  const { PostList } = useContext(context)

  return (
    <div className={style.mid}>
      <div className={style.box}>
        <PublicArticle></PublicArticle>
        <SortRule></SortRule>
        {
          PostList.map((post, index) =>
            <div key={index}>
              <MessageItem post={post}></MessageItem>
            </div>
          )
        }
      </div>
    </div>
  )
}
