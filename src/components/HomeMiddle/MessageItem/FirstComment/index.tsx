import React from 'react'
import style from './index.module.scss'
import dayjs from 'dayjs'
import { IFirstComment } from '../../../../libs/model'
interface Props {
  FirstCommentMsg: IFirstComment
}
export default function FirstComment ({ FirstCommentMsg }: Props) {
  return (
    <div className={style.FirstCommentBack}>
      <div className={style.avatar_box}>
        <img src={FirstCommentMsg.avatar} className={style.avatar_img}></img>
      </div>
      <div>
        <div className={style.main}>
          <span className={style.name}>{FirstCommentMsg.name}</span>
          <div>
            : {FirstCommentMsg.firstCommentContent}
          </div>
        </div>
        <div className={style.time}>{dayjs(FirstCommentMsg.firstCommentCreatedTime).format('YYYY-MM-DD HH:mm:ss')}</div>
        <div>共xx条回复 </div>
      </div>
    </div>
  )
}
