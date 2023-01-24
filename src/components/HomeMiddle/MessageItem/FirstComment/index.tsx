import React, { useState } from 'react'
import style from './index.module.scss'
import dayjs from 'dayjs'
import { IFirstComment } from '../../../../libs/model'
import commentIcon from '../../../../assets/comment_gray.png'
import commentHover from '../../../../assets/comment_orange.png'
import likeIcon from '../../../../assets/heart_gray.png'
import likeHover from '../../../../assets/heart_orange.png'
import { FirstCommentLike } from '../../../../api/article'
interface Props {
  FirstCommentMsg: IFirstComment
}
export default function FirstComment ({ FirstCommentMsg }: Props) {
  const [like, setLike] = useState(false)
  const [comment, setComment] = useState(false)

  const pushLike = async () => {
    const res = await FirstCommentLike(FirstCommentMsg.firstCommentId.toString())
    if (res?.code === 200) {
      console.log('点赞成功')
      // 更新点赞 其实这里最好提供每个一级评论的信息接口 在更新的时候减少消耗
    }
  }
  return (
    <div className={style.FirstCommentBack}>
      <div className={style.avatar_box}>
        <img src={FirstCommentMsg.avatar} className={style.avatar_img}></img>
      </div>
      <div className={style.main_box}>
        <div className={style.main}>
          <span className={style.name}>{FirstCommentMsg.name}</span>
          <div>
            : {FirstCommentMsg.firstCommentContent}
          </div>
        </div>
        <div className={style.func}>
          <div className={style.time}>{dayjs(FirstCommentMsg.firstCommentCreatedTime).format('YYYY-MM-DD HH:mm:ss')}</div>
          <div className={style.func_box}>
            <img
              src={comment ? commentHover : commentIcon}
              className={style.icon}
              onMouseOver={() => { setComment(true) }}
              onMouseOut={() => { setComment(false) }}
            ></img>
            {
              FirstCommentMsg.liked ? <div className={style.likeIcon}>
                <img
                  src={likeHover}
                  className={style.icon}
                  onClick={() => pushLike()}
                ></img>
                <span className={style.num_click}>{FirstCommentMsg.firstCommentCount}</span>
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
                  <span className={style.num}>{FirstCommentMsg.firstCommentCount}</span>
                </div>
            }
          </div>
        </div>
        <div>共xx条回复 </div>
      </div>
    </div>
  )
}
