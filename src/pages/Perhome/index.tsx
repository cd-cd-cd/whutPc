import { Input } from 'antd';
import React, { useEffect, useState } from 'react'
import MessageItem from '../../components/HomeMiddle/MessageItem'
import style from './index.module.scss'
import topIcon from '../../assets/top.png'
import bottomIcon from '../../assets/bottom.png'
import { useParams } from 'react-router-dom'
import { getUser } from '../../api/user'
import { IResUserInfo, resSelfPosts } from '../../libs/model'
import { getSelfPosts } from '../../api/article'
import useItems from '../../hooks/useItems'
export default function PerHome () {
  const [current, setCurrent] = useState(1)
  const [allArticle, setAllArticel] = useState<resSelfPosts>()
  const { queryAttention, toggleConcerned } = useItems()
  const [attention, setAttention] = useState<boolean>()
  const [user, setUser] = useState<IResUserInfo>()
  const params = useParams()
  const id = params.id
  const dePage = () => {
    if (current > 1) {
      const val = current - 1
      setCurrent(val)
    }
  }

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

  const changeCurrent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const pages = allArticle?.pages
    if (!isNaN(Number(value))) {
      const newVal = Number(value)
      if (pages) {
        if (newVal <= pages && newVal >= 1) {
          setCurrent(newVal)
        } else if (newVal <= 0) {
          setCurrent(1)
        } else if (newVal > pages) {
          setCurrent(pages)
        }
      }
    }
  }

  const addPage = () => {
    const pages = allArticle?.pages
    if (pages) {
      if (current < pages) {
        const val = current + 1
        setCurrent(val)
      }
    }
  }

  const getPosts = async () => {
    if (id) {
      const res = await getSelfPosts(id, current)
      if (res?.data.records) {
        setAllArticel(res.data)
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
          <div className={style.navPage}>
            <div className={style.changeBox} onClick={() => dePage()}>
              <img className={style.changeIcon} src={topIcon}></img>
            </div>
            <Input className={style.input} value={current} onChange={(e) => changeCurrent(e)}></Input>
            <div className={style.changeBox} onClick={() => addPage()}>
              <img className={style.changeIcon} src={bottomIcon}></img>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
