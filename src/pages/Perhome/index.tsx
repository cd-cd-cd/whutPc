import { Pagination } from 'antd';
import React, { useEffect, useState } from 'react'
import MessageItem from '../../components/HomeMiddle/MessageItem'
import style from './index.module.scss'
import { useParams } from 'react-router-dom'
import { getUser } from '../../api/user'
import { IResUserInfo, resSelfPosts } from '../../libs/model'
import { getSelfPosts } from '../../api/article'
import useItems from '../../hooks/useItems'
export default function PerHome () {
  const [current, setCurrent] = useState(1)
  const [total, setTotal] = useState<number>()
  const [allArticle, setAllArticel] = useState<resSelfPosts>()
  const { queryAttention, toggleConcerned } = useItems()
  const [attention, setAttention] = useState<boolean>()
  const [user, setUser] = useState<IResUserInfo>()
  const params = useParams()
  const id = params.id

  // 获取个人信息 同时刷新
  const getInfo = async () => {
    if (id) {
      const res = await getUser(id)
      if (res) {
        console.log(res.data)
        setUser(res.data)
      }
    }
  }

  const getPosts = async () => {
    if (id) {
      const res = await getSelfPosts(id, current)
      if (res?.data.records) {
        setAllArticel(res.data)
        setTotal(res.data.total)
      }
    }
  }

  // 存储关注
  const setAttentionFunc = async () => {
    if (user?.email) {
      const temp = await queryAttention(user?.email)
      setAttention(temp)
    }
  }

  // 关注&取消关注
  const toggleFollow = async () => {
    if (typeof attention !== 'undefined') {
      if (user?.email) {
        toggleConcerned(user?.email, !attention)
      }
    }
  }

  useEffect(() => {
    getPosts()
  }, [current])

  useEffect(() => {
    getInfo()
    setAttentionFunc()
  }, [])
  return (
    <div className={style.init}>
      <div className={style.main}>
        <div className={style.info}>
          <div className={style.left_box}>
            <div className={style.top_box}>
              <div className={style.avatar_box}>
                <img src={user?.avatar} className={style.avatarIcon}></img>
              </div>
              <div
                onClick={() => { toggleFollow(); setAttention(!attention) }}
                className={attention ? style.concerned : style.unconcerned}
              >{attention ? '已关注' : '关注'}
              </div>
            </div>
            <div className={style.nick}>
              <span className={style.nickName}>{user?.nickName}</span>
              <span className={style.vertical}> | </span>
              <span className={style.sex}>{user?.sex === 0 ? '男' : '女'}</span>
            </div>
            <span className={style.user_id}>ID{user?.email}</span>
          </div>
        </div>
        <div className={style.foot}>
          <div className={style.article_box}>
            {
              allArticle?.records.map((post) =>
                <div key={post.articleId}>
                  <MessageItem post={post}></MessageItem>
                </div>
              )
            }
          </div>
          <div className={style.pag}>
            <Pagination showSizeChanger={false} current={current} onChange={(page) => setCurrent(page)} total={total}></Pagination>
          </div>
        </div>
      </div>
    </div>
  )
}
