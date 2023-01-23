import React, { useEffect, useState } from 'react'
import style from './index.module.scss'
import dayjs from 'dayjs'
import { Input, message, Tag } from 'antd'
import eyeIcon from '../../../assets/eye_gray.png'
import eyeHover from '../../../assets/eye_orange.png'
import heartIcon from '../../../assets/heart_gray.png'
import heartHover from '../../../assets/heart_orange.png'
import commentIcon from '../../../assets/comment_gray.png'
import commentHover from '../../../assets/comment_orange.png'
import { IFirstComment, IRecord } from '../../../libs/model'
import { accordLikeNum, accordTime, getRetailArticle, sendFirstComment, toggleLike } from '../../../api/article'
import { useNavigate } from 'react-router-dom'
import useItems from '../../../hooks/useItems'
import { getUser } from '../../../api/user'
import FirstComment from './FirstComment'
// import defaultImg  from '../.././../assets/'

interface Props {
  post: IRecord
}

type ICommentRule = 'TIME' | 'LIKENUM'

export default function MessageItem ({ post }: Props) {
  // 设置悬浮
  const [eye, setEye] = useState(false)
  const [heart, setHeart] = useState(false)
  const [comment, setComment] = useState(false)
  // 当前文章
  const [messageItem, setMessageItem] = useState<IRecord>(post)
  const navigator = useNavigate()
  const { queryAttention, toggleConcerned } = useItems()
  const [attention, setAttention] = useState<boolean>()
  // 记录是否点击评论
  const [isComment, setIsComment] = useState<boolean>(false)
  // 记录本人头像
  const [selfAvatar, setSelfAvatar] = useState<string>()
  // 保存评论
  const [firstComment, setFirstComment] = useState<string>()
  // 保存评论展示规则
  const [commentRule, setCommentRule] = useState<ICommentRule>('LIKENUM')
  // 储存一级评论
  const [FirstCommentLists, setFirstCommentLists] = useState<IFirstComment[]>()
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
      toggleConcerned(messageItem.articleUserId, !attention)
      getArticle()
    }
  }

  const email = localStorage.getItem("email")

  // 得到个人头像
  const getAvatar = async () => {
    if (email) {
      const res = await getUser(email)
      setSelfAvatar(res?.data.avatar)
    }
  }

  // 新增1级评论
  const sendCommentone = async () => {
    if (firstComment && firstComment?.length > 0 && firstComment?.length <= 255) {
      const res = await sendFirstComment(Number(messageItem.articleId), firstComment)
      if (res?.code === 200) {
        if (commentRule === 'TIME') {
          getFirstCommentBaseTime()
        } else if (commentRule === 'LIKENUM') {
          getFirstCommentBaseLikeNum()
        }
        message.success('评论成功')
        setFirstComment('')
      }
    }
  }

  // 得到一级评论(点赞数)
  const getFirstCommentBaseLikeNum = async () => {
    const res = await accordLikeNum(messageItem.articleId)
    setFirstCommentLists(res?.data.records)
  }

  // 得到一级评论(时间)
  const getFirstCommentBaseTime = async () => {
    const res = await accordTime(messageItem.articleId)
    setFirstCommentLists(res?.data.records)
  }

  const viewComment = () => {
    setIsComment(!isComment)
    getFirstCommentBaseLikeNum()
  }

  useEffect(() => {
    if (commentRule === 'LIKENUM') {
      getFirstCommentBaseLikeNum()
    } else if (commentRule === 'TIME') {
      getFirstCommentBaseTime()
    }
  }, [commentRule])

  useEffect(() => {
    getArticle()
    getAvatar()
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
            {
              messageItem.articleUserId !== email ? <div
                onClick={() => toggleFollow()}
                className={attention ? style.concerned : style.unconcerned}
              >{attention ? '已关注' : '关注'}</div> : null
            }
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
          {
            isComment ? <><img
              onClick={() => setIsComment(!isComment)}
              src={commentHover}
              className={style.icon}></img>
              <p className={style.hover}>{messageItem.articleCommentCount}</p></>
              : <><img
                onClick={() => viewComment()}
                onMouseOver={() => { setComment(true) }}
                onMouseOut={() => { setComment(false) }}
                src={comment ? commentHover : commentIcon}
                className={style.icon}></img>
                <p className={comment ? style.hover : style.normal}>{messageItem.articleCommentCount}</p>
              </>
          }
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
      {
        isComment
          ? <div>
            <div className={style.review_box}>
              <div className={style.avatar2_box}>
                <img className={style.avatar2} src={selfAvatar}></img>
              </div>
              <Input.TextArea placeholder='发布你的评论' className={style.send_input} value={firstComment} onChange={(e) => setFirstComment(e.target.value)} />
              <div className={firstComment ? style.send_btn : style.send_btn_dis} onClick={() => sendCommentone()}>评论</div>
            </div>
            <div className={style.rule}>
              <div
              className={commentRule === 'LIKENUM' ? style.rule_box_click : style.rule_box}
              onClick={() => setCommentRule('LIKENUM')}
              >最热</div>
              <div
              className={commentRule === 'TIME' ? style.rule_box_click : style.rule_box}
              onClick={() => setCommentRule('TIME')}
              >最新</div>
            </div>
            <div className={style.firstCommentBox}>
              {
                FirstCommentLists?.map((item) => <FirstComment
                key={item.firstCommentId}
                FirstCommentMsg={item}
                ></FirstComment>)
              }
            </div>
          </div> : null
      }
    </div>
  )
}
