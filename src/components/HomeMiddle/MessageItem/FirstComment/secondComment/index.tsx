import React, { useEffect, useState } from 'react'
import style from './index.module.scss'
import commentIcon from '../../../../../assets/comment_gray.png'
import commentHover from '../../../../../assets/comment_orange.png'
import likeIcon from '../../../../../assets/heart_gray.png'
import likeHover from '../../../../../assets/heart_orange.png'
import { ISecondComment } from '../../../../../libs/model'
import { getDetailSonMsg } from '../../../../../api/article'
import { Input, message, Modal } from 'antd'
import dayjs from 'dayjs'
interface Props {
  id: number
}
export default function SecondComment ({ id }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [comment, setComment] = useState(false)
  const [like, setLike] = useState(false)
  const [msg, setMsg] = useState<ISecondComment>()
  // 保存发布的评论
  const [sendMsg, setSendMsg] = useState('')

  const getMsg = async () => {
    const res = await getDetailSonMsg(id)
    setMsg(res?.data)
    console.log(res?.data)
  }

  const handleOk = async () => {
    console.log(sendMsg)
    if (sendMsg.length > 0 && sendMsg.length <= 255) {
      // if (msg?.firstCommentId) {
      //   const res = await sendSecond(sendMsg, msg?.firstCommentId)
      //   if (res?.code === 200) {
      //     setIsModalOpen(false)
      //     setSendMsg('')
      //     message.success('评论成功')
      //   } else {
      //     message.info('评论失败，请稍后再试')
      //   }
      // }
    } else {
      message.info('评论字数在255之内')
    }
  }

  const handleCancel = () => {
    setSendMsg('')
    setIsModalOpen(false)
  }

  useEffect(() => {
    getMsg()
  }, [])
  return (
    <div>
      <div>
        <span className={style.secondName}>{msg?.commentUserName}:</span>
        <span>{msg?.sonCommentContent}</span>
      </div>
      <div className={style.funcSecond}>
        <div className={style.secondTime}>{dayjs(msg?.sonCommentCreatedTime).format('YYYY-MM-DD HH:mm:ss')}</div>
        <div className={style.func_box}>
          <img
            onClick={() => setIsModalOpen(true)}
            src={comment ? commentHover : commentIcon}
            className={style.icon}
            onMouseOver={() => { setComment(true) }}
            onMouseOut={() => { setComment(false) }}
          ></img>
          {
            (msg ? msg.liked : null) ? <div className={style.likeIcon}>
              <img
                src={likeHover}
                className={style.icon}
              ></img>
              <span className={style.num_click}>{msg?.sonCommentLikeCount}</span>
            </div>
              : <div className={style.likeIcon}
                onMouseOver={() => { setLike(true) }}
                onMouseOut={() => { setLike(false) }}
              >
                <img
                  src={like ? likeHover : likeIcon}
                  className={style.icon}
                ></img>
                <span className={style.num}>{msg?.sonCommentLikeCount}</span>
              </div>
          }
        </div>
        <Modal
          title={`回复@${msg?.commentReplyName}`}
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
