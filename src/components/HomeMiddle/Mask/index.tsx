import { Tag } from 'antd'
import dayjs from 'dayjs'
import React from 'react'
import { IRecord } from '../../../libs/model'
import style from './index.module.scss'
import deleteIcon from '../../../assets/delete.png'
interface Prop {
  post: IRecord
  closeMask: () => void
}
export default function Mask ({ post, closeMask }: Prop) {
  const transNav = () => {
    const email = localStorage.getItem('email')
    if (post) {
      if (email !== post.articleUserId) {
        window.open(`/page/${post.articleUserId}`)
      } else {
        window.open('/homePage')
      }
    }
  }

  return (
    <div className={style.mask}>
          <div className={style.mask_main}>
            <div className={style.itemHeader}>
              <div className={style.avatarBox}>
                <img className={style.avatarImg} src={post.avatar}></img>
              </div>
              <div className={style.info}>
                <div className={style.nickName} onClick={() => transNav()}>
                  <div>{post.name}</div>
                  {post.articleCategoryName
                    ? <Tag color="#eb7340" className={style.tag}>{post.articleCategoryName}</Tag>
                    : null
                  }
                </div>
                <div className={style.time}>
                  {dayjs(post.createdTime).format('YYYY-MM-DD HH:mm:ss')}
                </div>
              </div>
            </div>
            <div className={style.detailText}>
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
          </div>
          <div className={style.deleteIcon} onClick={() => closeMask()}>
            <img src={deleteIcon} className={style.deleteIcon}></img>
          </div>
        </div>
  )
}
