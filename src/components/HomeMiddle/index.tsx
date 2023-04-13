import React, { useContext, useEffect, useState } from 'react'
import { context } from '../../hooks/store'
import style from './index.module.scss'
import './index.css'
import MessageItem from './MessageItem'
import SortRule from './SortRule'
import PublicArticle from './PublicArticle'
import usePostArray from '../../hooks/usePostArray'
import qqIcon from '../../assets/qq.png'
import { Pagination } from 'antd'
import { getUser } from '../../api/user'

export default function HomeMiddle () {
  const { categoryId, ruleType, PostList } = useContext(context)
  const { getArticles, total, lastArticle } = usePostArray()
  const [current, setCurrent] = useState<number>(1)
  const [avatar, setAvatar] = useState<string>()
  // 得到个人信息
  const getPerAVatar = async () => {
    const email = localStorage.getItem('email')
    if (email) {
      const res = await getUser(email)
      setAvatar(res?.data.avatar)
    }
  }

  useEffect(() => {
    getPerAVatar()
  }, [])

  useEffect(() => {
    getArticles(ruleType, 1)
    setCurrent(1)
  }, [ruleType, categoryId])

  useEffect(() => {
    getArticles(ruleType, current)
  }, [current])

  const refresh = () => {
    if (current === 1 && ruleType === 'lasted') {
      lastArticle(current)
    }
  }
  return (
    <>
      <div className={style.mid}>
        <div className={style.box}>
          <PublicArticle refresh={refresh}></PublicArticle>
          <SortRule></SortRule>
          {
            PostList.map((post) =>
              <div key={post.articleId}>
                <MessageItem avatar={avatar} post={post}></MessageItem>
              </div>
            )
          }
        </div>
        <img src={qqIcon} className={style.qqIcon}></img>
      </div>
      <Pagination onChange={(page) => setCurrent(page)} showSizeChanger={false} showQuickJumper className={style.pagination} current={current} total={total} />
    </>
  )
}
