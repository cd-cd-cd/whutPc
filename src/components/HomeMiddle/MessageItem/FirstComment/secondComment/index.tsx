import React, { useState } from 'react'
import style from './index.module.scss'
import commentIcon from '../../../../../assets/comment_gray.png'
import commentHover from '../../../../../assets/comment_orange.png'
import likeIcon from '../../../../../assets/heart_gray.png'
import likeHover from '../../../../../assets/heart_orange.png'
import { ISecondComment } from '../../../../../libs/model'
import { Input, message, Modal } from 'antd'
import dayjs from 'dayjs'
import { sendSecond } from '../../../../../api/article'
interface Props {
  post: ISecondComment
  getSon: () => {}
}
export default function SecondComment ({ post, getSon }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [comment, setComment] = useState(false)
  const [like, setLike] = useState(false)
  // 保存发布的评论
  const [sendMsg, setSendMsg] = useState('')

  const handleOk = async () => {
    if (sendMsg.length > 0 && sendMsg.length <= 255) {
      let res
      if (post.commentUserName) {
        res = await sendSecond(sendMsg, post.sonCommentParentId, post.sonCommentUserId.toString())
      } else {
        res = await sendSecond(sendMsg, post.sonCommentParentId)
      }
      if (res?.code === 200) {
        setIsModalOpen(false)
        setSendMsg('')
        message.success('评论成功')
        getSon()
      }
    } else {
      message.info('评论字数在255之内')
    }
  }

  const handleCancel = () => {
    setSendMsg('')
    setIsModalOpen(false)
  }

  const email = localStorage.getItem('email')!

  const transNav = (id: string, toId?: string) => {
    if (id !== toId) {
      window.open(`/page/${toId}`)
    } else {
      window.open('/homePage')
    }
  }
  return (
    <div>
      <div>
        <span className={style.secondName}>
        <span className={style.name} onClick={() => transNav(email, post.sonCommentUserId)}>{post.commentUserName}</span>
        {
          post.commentReplyName ? <span><span>回复</span><span className={style.name} onClick={() => transNav(email, post.sonCommentReplyUserId?.toString())}>@{post.commentReplyName}</span></span> : null
        }
        :</span>
        <span>{post.sonCommentContent}</span>
      </div>
      <div className={style.funcSecond}>
        <div className={style.secondTime}>{dayjs(post.sonCommentCreatedTime).format('YYYY-MM-DD HH:mm:ss')}</div>
        <div className={style.func_box}>
          <img
            onClick={() => setIsModalOpen(true)}
            src={comment ? commentHover : commentIcon}
            className={style.icon}
            onMouseOver={() => { setComment(true) }}
            onMouseOut={() => { setComment(false) }}
          ></img>
          {
              post.liked ? <div className={style.likeIcon}>
              <img
                src={likeHover}
                className={style.icon}
              ></img>
              <span className={style.num_click}>{post.sonCommentLikeCount}</span>
            </div>
                : <div className={style.likeIcon}
                onMouseOver={() => { setLike(true) }}
                onMouseOut={() => { setLike(false) }}
              >
                <img
                  src={like ? likeHover : likeIcon}
                  className={style.icon}
                ></img>
                <span className={style.num}>{post.sonCommentLikeCount}</span>
              </div>
          }
        </div>
        <Modal
          title={`回复@${post.commentUserName}`}
          okText='发布'
          cancelText='取消'
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}>
          <Input placeholder='发布你的评论' value={sendMsg} onChange={(e) => setSendMsg(e.target.value)}></Input>
        </Modal>
      </div>
    </div>
  )
}
