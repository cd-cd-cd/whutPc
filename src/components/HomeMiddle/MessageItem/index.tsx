import React, { useState } from 'react'
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
import { accordLikeNum, accordTime, sendFirstComment, toggleLike } from '../../../api/article'
import { useNavigate } from 'react-router-dom'
// import { getUser } from '../../../api/user'
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

  // 记录点赞
  const [isLike, setIsLike] = useState<boolean>(post.liked)
  // 记录点赞数
  const [likeNum, setLikeNum] = useState<number>(post.articleLikeCount)
  // const { ruleType, categoryId } = useContext(context)
  const navigator = useNavigate()
  // const { queryAttention, toggleConcerned } = useItems()
  // const [attention, setAttention] = useState<boolean>()
  // 记录是否点击评论
  const [isComment, setIsComment] = useState<boolean>(false)
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
      if (!isLike) {
        setLikeNum(likeNum + 1)
      } else {
        setLikeNum(likeNum - 1)
      }
      setIsLike(!isLike)
    }
  }

  // // 存储关注
  // const setAttentionFunc = async () => {
  //   const temp = await queryAttention(post.articleUserId)
  //   setAttention(temp)
  // }

  // // 关注&取消关注
  // const toggleFollow = async () => {
  //   if (typeof attention !== 'undefined') {
  //     toggleConcerned(post.articleUserId, !attention)
  //     if (getArticles) {
  //       getArticles(ruleType, categoryId)
  //     }
  //   }
  // }

  // 新增1级评论
  const sendCommentone = async () => {
    if (firstComment && firstComment?.length > 0 && firstComment?.length <= 255) {
      const res = await sendFirstComment(Number(post.articleId), firstComment)
      if (res?.code === 200) {
        if (commentRule === 'TIME') {
          getFirstCommentBaseTime()
        } else if (commentRule === 'LIKENUM') {
          getFirstCommentBaseLikeNum()
        }
        message.success('评论成功')
        setFirstComment('')
      } else {
        message.error(res?.errorMsg as string)
      }
    }
  }

  // 得到一级评论(点赞数)
  const getFirstCommentBaseLikeNum = async () => {
    const res = await accordLikeNum(post.articleId)
    setFirstCommentLists(res?.data.records)
  }

  // 得到一级评论(时间)
  const getFirstCommentBaseTime = async () => {
    const res = await accordTime(post.articleId)
    setFirstCommentLists(res?.data.records)
  }

  const viewComment = () => {
    setIsComment(!isComment)
    getFirstCommentBaseLikeNum()
  }

  return (
    <div className={style.itemBox}>
      <div className={style.itemHeader}>
        <div className={style.avatarBox}>
          <img className={style.avatarImg} src={post.avatar}></img>
        </div>
        <div className={style.info}>
          <div className={style.nickName}>
            <div>{post.name}</div>
            {post.articleCategoryName
              ? <Tag color="#eb7340" className={style.tag}>{post.articleCategoryName}</Tag>
              : null
            }
            {/* {
              post.articleUserId !== email ? <div
                onClick={() => { toggleFollow(); getArticles ? getArticles(ruleType, categoryId) : null }}
                className={attention ? style.concerned : style.unconcerned}
              >{attention ? '已关注' : '关注'}</div> : null
            }
            {post.articleCategoryName
              ? <Tag color="#eb7340" className={style.tag}>{post.articleCategoryName}</Tag>
              : null
            } */}
          </div>
          <div className={style.time}>
            {dayjs(post.createdTime).format('YYYY-MM-DD HH:mm:ss')}
          </div>
        </div>
      </div>
      <div className={style.detailText} onClick={() => navigator(`/retail?id=${post.articleId}`)}>
        <div className={style.title}>{post.articleTitle}</div>
        <div className={style.content}>{post.articleContent}</div>
      </div>
      <div className={style.imgBox}>
        <div className={style.imgs}>
          {
            post.articleImg
              ? post.articleImg.split(';')
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
          <p className={eye ? style.hover : style.normal}>{post.articleViewCount}</p>
        </div>
        <div className={style.iconBox}>
          {
            isComment ? <><img
              onClick={() => { setIsComment(!isComment) }}
              src={commentHover}
              className={style.icon}></img>
              <p className={style.hover}>{post.articleCommentCount}</p></>
              : <><img
                onClick={() => viewComment()}
                onMouseOver={() => { setComment(true) }}
                onMouseOut={() => { setComment(false) }}
                src={comment ? commentHover : commentIcon}
                className={style.icon}></img>
                <p className={comment ? style.hover : style.normal}>{post.articleCommentCount}</p>
              </>
          }
        </div>
        <div className={style.iconBox}>
          {isLike
            ? <><img
              onClick={() => toggleHeart(post.articleId)}
              src={heartHover}
              className={style.icon}></img>
              <p className={style.hover}>{likeNum}</p></>
            : <><img
              onMouseOver={() => { setHeart(true) }}
              onMouseOut={() => { setHeart(false) }}
              onClick={() => toggleHeart(post.articleId)}
              src={heart ? heartHover : heartIcon}
              className={style.icon}></img>
              <p className={heart ? style.hover : style.normal}>{likeNum}</p>
            </>
          }
        </div>
      </div>
      {
        isComment
          ? <div>
            <div className={style.review_box}>
              <div className={style.avatar2_box}>
                <img className={style.avatar2} src={post.avatar}></img>
              </div>
              <Input.TextArea placeholder='发布你的评论' className={style.send_input} value={firstComment} onChange={(e) => setFirstComment(e.target.value)} />
              <div className={firstComment ? style.send_btn : style.send_btn_dis} onClick={() => sendCommentone()}>评论</div>
            </div>
            {
              FirstCommentLists?.length !== 0
                ? <div className={style.rule}>
                  <div
                    className={commentRule === 'LIKENUM' ? style.rule_box_click : style.rule_box}
                    onClick={() => { setCommentRule('LIKENUM'); getFirstCommentBaseLikeNum() }}
                  >最热</div>
                  <div
                    className={commentRule === 'TIME' ? style.rule_box_click : style.rule_box}
                    onClick={() => { setCommentRule('TIME'); getFirstCommentBaseTime() }}
                  >最新</div>
                </div> : null
            }
            <div className={style.firstCommentBox}>
              {
                FirstCommentLists?.map((item) => <FirstComment
                  key={item.firstCommentId}
                  firstCommentId={item.firstCommentId}
                ></FirstComment>)
              }
            </div>
          </div> : null
      }
    </div>
  )
}
