import React, { useEffect, useState } from 'react'
import style from './index.module.scss'
import dayjs from 'dayjs'
import { IFirstComment, ISecondComment } from '../../../../libs/model'
import commentIcon from '../../../../assets/comment_gray.png'
import commentHover from '../../../../assets/comment_orange.png'
import likeIcon from '../../../../assets/heart_gray.png'
import likeHover from '../../../../assets/heart_orange.png'
import downIcon from '../../../../assets/down.png'
import { FirstCommentDetail, FirstCommentLike, getSonMsg, sendSecond } from '../../../../api/article'
import { Input, message, Modal } from 'antd'
import SecondComment from './secondComment'
interface Props {
  firstCommentId: number
}
export default function FirstComment ({ firstCommentId }: Props) {
  const [like, setLike] = useState(false)
  const [comment, setComment] = useState(false)
  const [msg, setMsg] = useState<IFirstComment>()
  const [fold, setFold] = useState<boolean>(true)
  // 保存发布的评论
  const [sendMsg, setSendMsg] = useState('')
  // 保存二级评论
  const [msg2, setMsg2] = useState<ISecondComment[]>([])
  // 得到当前一级评论
  const getFirstComment = async () => {
    const res = await FirstCommentDetail(firstCommentId)
    console.log(res?.data)
    setMsg(res?.data)
  }

  const pushLike = async () => {
    const res = await FirstCommentLike(firstCommentId.toString())
    if (res?.code === 200) {
      getFirstComment()
    }
  }
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOk = async () => {
    console.log(sendMsg)
    if (sendMsg.length > 0 && sendMsg.length <= 255) {
      if (msg?.firstCommentId) {
        const res = await sendSecond(sendMsg, msg?.firstCommentId)
        if (res?.code === 200) {
          setIsModalOpen(false)
          setSendMsg('')
          message.success('评论成功')
        } else {
          message.info('评论失败，请稍后再试')
        }
      }
    } else {
      message.info('评论字数在255之内')
    }
  }

  const handleCancel = () => {
    setSendMsg('')
    setIsModalOpen(false)
  }

  const unfoldMsg = async () => {
    console.log(fold)
    if (fold) {
      if (msg?.firstCommentId) {
        const res = await getSonMsg(msg?.firstCommentId, 1)
        console.log(res?.data.records)
        if (res?.data) {
          setMsg2(res.data.records)
        }
      }
    }
    setFold(!fold)
  }

  useEffect(() => {
    getFirstComment()
  }, [])
  return (
    <div className={style.FirstCommentBack}>
      <div className={style.avatar_box}>
        <img src={msg ? msg.avatar : ''} className={style.avatar_img}></img>
      </div>
      <div className={style.main_box}>
        <div className={style.main}>
          <span className={style.name}>{msg ? msg.name : null}</span>
          <div>
            : {msg ? msg.firstCommentContent : null}
          </div>
        </div>
        <div className={style.func}>
          <div className={style.time}>{dayjs(msg ? msg.firstCommentCreatedTime : null).format('YYYY-MM-DD HH:mm:ss')}</div>
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
                  onClick={() => pushLike()}
                ></img>
                <span className={style.num_click}>{msg?.firstCommentLikeCount}</span>
              </div>
                : <div className={style.likeIcon}
                  onMouseOver={() => { setLike(true) }}
                  onMouseOut={() => { setLike(false) }}
                >
                  <img
                    src={like ? likeHover : likeIcon}
                    className={style.icon}
                    onClick={() => pushLike()}
                  ></img>
                  <span className={style.num}>{msg?.firstCommentLikeCount}</span>
                </div>
            }
          </div>
        </div>
        {
          msg?.firstCommentCount !== 0
            ? <div className={style.downBox}><div>共{msg?.firstCommentCount}条回复 </div>
              <img src={downIcon} className={style.downIcon} onClick={() => { unfoldMsg() }}></img></div>
            : null
        }
        {fold ? null
          : msg2.map(item => <div key={item.sonCommentId}>
            <SecondComment id={item.sonCommentId}></SecondComment>
          </div>)
        }
        <Modal
          title={`回复@${msg?.name}`}
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
