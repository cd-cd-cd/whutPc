import React, { useEffect, useState } from 'react'
import style from './index.module.scss'
import dayjs from 'dayjs'
import { Tag } from 'antd'
import eyeIcon from '../../../assets/eye_gray.png'
import eyeHover from '../../../assets/eye_orange.png'
import heartIcon from '../../../assets/heart_gray.png'
import heartHover from '../../../assets/heart_orange.png'
import commentIcon from '../../../assets/comment_gray.png'
import commentHover from '../../../assets/comment_orange.png'
import { IRecord } from '../../../libs/model'
import { getRetailArticle, toggleLike } from '../../../api/article'
import { useNavigate } from 'react-router-dom'
import useItems from '../../../hooks/useItems'
// import defaultImg  from '../.././../assets/'

interface Props {
  post: IRecord
}

export default function MessageItem ({ post }: Props) {
  const [eye, setEye] = useState(false)
  const [heart, setHeart] = useState(false)
  const [comment, setComment] = useState(false)
  const [messageItem, setMessageItem] = useState<IRecord>(post)
  const navigator = useNavigate()
  const { queryAttention, toggleConcerned } = useItems()
  const [attention, setAttention] = useState<boolean>()
  // 点赞或取消
  const toggleHeart = async (id: string) => {
    const res = await toggleLike(id)
    if (res?.code === 200) {
      getArticle()
    }
  }

  // 获得当前文章
  const getArticle = async () => {
    const res = await getRetailArticle(post.articleId)
    if (res?.code === 200) {
      setMessageItem(res.data)
      const temp = await queryAttention(res.data.articleUserId)
      setAttention(temp)
    } else {
      console.log('error')
    }
  }

  // 关注&取消关注
  const toggleFollow = async () => {
    if (typeof attention !== 'undefined') {
      toggleConcerned(messageItem.articleUserId, attention)
    }
  }

  useEffect(() => {
    getArticle()
  }, [])

  return (
    <div className={style.itemBox}>
      <div className={style.itemHeader}>
        <div className={style.avatarBox}>
          <img className={style.avatarImg} src={messageItem.avatar}></img>
        </div>
        <div className={style.info}>
          <div className={style.nickName}>
            <div>{messageItem.name}</div>
            <div
              onClick={() => toggleFollow()}
              className={attention ? style.concerned : style.unconcerned}
            >{attention ? '已关注' : '关注'}</div>
            {messageItem.articleCategoryName
              ? <Tag color="#eb7340" className={style.tag}>{messageItem.articleCategoryName}</Tag>
              : null
            }
          </div>
          <div className={style.time}>
            {dayjs(messageItem.createdTime).format('YYYY-MM-DD HH:mm:ss')}
          </div>
        </div>
      </div>
      <div className={style.detailText} onClick={() => navigator(`/retail?id=${post.articleId}`)}>
        <div className={style.title}>{messageItem.articleTitle}</div>
        <div className={style.content}>{messageItem.articleContent}</div>
      </div>
      <div className={style.imgBox}>
        <div className={style.imgs}>
          {
            messageItem.articleImg
              ? messageItem.articleImg.split(';')
                .map((img, index) =>
                  <img key={index} className={style.img} src={img}></img>
                ) : null
          }
        </div>
      </div>
      <div className={style.bottom}>
        <div className={style.iconBox}>
          <img
            onMouseOver={() => { setEye(true) }}
            onMouseOut={() => { setEye(false) }}
            src={eye ? eyeHover : eyeIcon}
            className={style.icon}></img>
          <p className={eye ? style.hover : style.normal}>{messageItem.articleViewCount}</p>
        </div>
        <div className={style.iconBox}>
          <img
            onMouseOver={() => { setComment(true) }}
            onMouseOut={() => { setComment(false) }}
            src={comment ? commentHover : commentIcon}
            className={style.icon}></img>
          <p className={comment ? style.hover : style.normal}>{messageItem.articleCommentCount}</p>
        </div>
        <div className={style.iconBox}>
          {messageItem.liked
            ? <><img
              onClick={() => toggleHeart(messageItem.articleId)}
              src={heartHover}
              className={style.icon}></img>
              <p className={style.hover}>{messageItem.articleLikeCount}</p></>
            : <><img
              onMouseOver={() => { setHeart(true) }}
              onMouseOut={() => { setHeart(false) }}
              onClick={() => toggleHeart(messageItem.articleId)}
              src={heart ? heartHover : heartIcon}
              className={style.icon}></img>
              <p className={heart ? style.hover : style.normal}>{messageItem.articleLikeCount}</p>
            </>
          }
        </div>
      </div>
    </div>
  )
}
