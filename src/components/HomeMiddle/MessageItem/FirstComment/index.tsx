import React, { useState } from 'react'
import style from './index.module.scss'
import dayjs from 'dayjs'
import { ICommentRule, IFirstComment, ISecondComment } from '../../../../libs/model'
import commentIcon from '../../../../assets/comment_gray.png'
import commentHover from '../../../../assets/comment_orange.png'
import likeIcon from '../../../../assets/heart_gray.png'
import likeHover from '../../../../assets/heart_orange.png'
import downIcon from '../../../../assets/down.png'
import { FirstCommentLike, getSonMsg, sendSecond } from '../../../../api/article'
import { Input, message, Modal } from 'antd'
import SecondComment from './secondComment'
interface Props {
  item: IFirstComment,
  commentRule: ICommentRule,
  getFirstCommentBaseLikeNum: () => {}
  getFirstCommentBaseTime: () => {}
}
export default function FirstComment ({ item, commentRule, getFirstCommentBaseLikeNum, getFirstCommentBaseTime }: Props) {
  const [like, setLike] = useState(false)
  const [comment, setComment] = useState(false)
  // 记录点赞
  const [isLike, setIsLike] = useState<boolean>(item.liked)
  // 记录点赞数
  const [likeNum, setLikeNum] = useState<number>(item.firstCommentLikeCount)
  const [fold, setFold] = useState<boolean>(true)
  // 保存发布的评论
  const [sendMsg, setSendMsg] = useState('')
  // 保存二级评论
  const [msg2, setMsg2] = useState<ISecondComment[]>([])
  // 更新父级
  const refresh = () => {
    if (commentRule === 'TIME') {
      getFirstCommentBaseTime()
    } else if (commentRule === 'LIKENUM') {
      getFirstCommentBaseLikeNum()
    }
  }
  const pushLike = async () => {
    const res = await FirstCommentLike(item.firstCommentId.toString())
    if (res?.code === 200) {
      if (!isLike) {
        setLikeNum(likeNum + 1)
      } else {
        setLikeNum(likeNum - 1)
      }
      setIsLike(!isLike)
    }
  }
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOk = async () => {
    if (sendMsg.length > 0 && sendMsg.length <= 255) {
      if (item.firstCommentId) {
        const res = await sendSecond(sendMsg, item.firstCommentId)
        if (res?.code === 200) {
          setIsModalOpen(false)
          setSendMsg('')
          message.success('评论成功')
          refresh()
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

  const unfoldMsg = () => {
    if (fold) {
      getSon()
    }
    setFold(!fold)
  }

  const getSon = async () => {
    if (item.firstCommentId) {
      const res = await getSonMsg(item.firstCommentId, 1)
      if (res?.data) {
        console.log(res.data.records)
        setMsg2(res.data.records)
      }
    }
  }

  const transNav = () => {
    const email = localStorage.getItem('email')
    if (email !== item.firstCommentUserId) {
      window.open(`/page/${item.firstCommentUserId}`)
    } else {
      window.open('/homePage')
    }
  }
  return (
    <div className={style.FirstCommentBack}>
      <div className={style.avatar_box}>
        <img src={item.avatar} className={style.avatar_img}></img>
      </div>
      <div className={style.main_box}>
        <div className={style.main}>
          <span className={style.name} onClick={() => transNav()}>{item.name}</span>
          <div>
            : {item.firstCommentContent}
          </div>
        </div>
        <div className={style.func}>
          <div className={style.time}>{dayjs(item.firstCommentCreatedTime).format('YYYY-MM-DD HH:mm:ss')}</div>
          <div className={style.func_box}>
            <img
              onClick={() => setIsModalOpen(true)}
              src={comment ? commentHover : commentIcon}
              className={style.icon}
              onMouseOver={() => { setComment(true) }}
              onMouseOut={() => { setComment(false) }}
            ></img>
            {
              isLike ? <div className={style.likeIcon}>
                <img
                  src={likeHover}
                  className={style.icon}
                  onClick={() => pushLike()}
                ></img>
                <span className={style.num_click}>{likeNum}</span>
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
                  <span className={style.num}>{likeNum}</span>
                </div>
            }
          </div>
        </div>
        {
          item.firstCommentCount !== 0
            ? <div className={style.downBox}><div>共{item.firstCommentCount}条回复 </div>
              <img src={downIcon} className={style.downIcon} onClick={() => { unfoldMsg() }}></img></div>
            : null
        }
        {fold ? null
          : msg2.map(item => <div key={item.sonCommentId}>
            <SecondComment post={item} getSon={getSon}></SecondComment>
          </div>)
        }
        <Modal
          title={`回复@${item.name}`}
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
