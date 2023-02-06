import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { accordLikeNum, accordTime, getRetailArticle, sendFirstComment, toggleLike } from '../../api/article'
import { isAttention, toggleAttention } from '../../api/user'
import { ICommentRule, IFirstComment, IRecord } from '../../libs/model'
import eyeIcon from '../../assets/eye_gray.png'
import heartIcon from '../../assets/heart_gray.png'
import hearClick from '../../assets/heart_orange.png'
import { Image, Input, message } from 'antd'
import style from './index.module.scss'
import FirstComment from '../../components/HomeMiddle/MessageItem/FirstComment'
export default function Detail () {
  const params = useParams()
  // 储存一级评论
  const [FirstCommentLists, setFirstCommentLists] = useState<IFirstComment[]>([])
  // 保存评论展示规则
  const [commentRule, setCommentRule] = useState<ICommentRule>('LIKENUM')
  // 保存文章详细
  const [record, setRecord] = useState<IRecord>()
  // 保存是否关注
  const [isLike, setIsLike] = useState<boolean>()
  // 保存是否点赞
  const [giveLike, setGiveLike] = useState<boolean>()
  // 保存点赞数
  const [likeNum, setLikeNum] = useState<number>()
  // 保存评论
  const [sendMsg, setSendMsg] = useState<string>()
  const [current, setCurrent] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(1)
  const id = params.id
  const getDetail = async () => {
    if (id) {
      const res = await getRetailArticle(id)
      if (res?.data) {
        setRecord(res.data)
        setGiveLike(res.data.liked)
        setLikeNum(res.data.articleLikeCount)
        getFirstCommentBaseTime(res.data.articleId)
        const temp = await isAttention(res.data.articleUserId)
        if (temp?.code === 200) {
          setIsLike(temp?.data)
        }
      }
    }
  }

  // 关注/取消关注
  const toggleAttentionFunc = async () => {
    if (record?.articleUserId && (typeof (isLike) !== 'undefined')) {
      const res = await toggleAttention(record?.articleUserId, !isLike)
      if (res?.success) {
        setIsLike(!isLike)
      }
    }
  }

  // 给文章点赞
  const toggleGiveLike = async () => {
    if (record?.articleId) {
      const res = await toggleLike(record?.articleId)
      if (res?.success) {
        if (giveLike) {
          setLikeNum(likeNum! - 1)
        } else {
          setLikeNum(likeNum! + 1)
        }
        setGiveLike(!giveLike)
      }
    }
  }

  // 发送评论
  const sendCommnet = async () => {
    if (!sendMsg) {
      message.error('请输入评论')
    } else if (sendMsg.length > 255) {
      message.info('评论不超过255')
    } else {
      if (record?.articleId) {
        const res = await sendFirstComment(record?.articleId, sendMsg)
        if (res?.success) {
          if (commentRule === 'TIME') {
            getFirstCommentBaseTime(record.articleId)
          } else if (commentRule === 'LIKENUM') {
            getFirstCommentBaseLikeNum(record.articleId)
          }
          setSendMsg('')
          message.success('评论成功')
        } else {
          message.error(res?.errorMsg as string)
        }
      }
    }
  }

  // 得到一级评论(点赞数)
  const getFirstCommentBaseLikeNum = async (id: string | undefined) => {
    setCurrent(1)
    if (id) {
      const res = await accordLikeNum(id, 1)
      if (res?.success) {
        setFirstCommentLists(res?.data.records)
        setPageSize(res.data.pages)
      }
    }
  }

  // 得到一级评论(时间)
  const getFirstCommentBaseTime = async (id: string | undefined) => {
    setCurrent(1)
    if (id) {
      const res = await accordTime(id, 1)
      if (res?.success) {
        setFirstCommentLists(res?.data.records)
        setPageSize(res.data.pages)
      }
    }
  }
  useEffect(() => {
    getDetail()
  }, [])

  const addFirst = async () => {
    if (pageSize > current) {
      setCurrent(current + 1)
      if (commentRule === 'LIKENUM') {
        if (record?.articleId) {
          const res = await accordLikeNum(record?.articleId, current + 1)
          if (res?.data.records) {
            setFirstCommentLists([...FirstCommentLists, ...res?.data.records])
            setPageSize(res.data.pages)
          }
        }
      } else {
        if (record?.articleId) {
          const res = await accordTime(record?.articleId, current + 1)
          if (res?.data.records) {
            setFirstCommentLists([...FirstCommentLists, ...res?.data.records])
            setPageSize(res.data.pages)
          }
        }
      }
    }
  }
  return (
    <div className={style.back}>
      <div className={style.main}>
        <div className={style.header}>
          <div className={style.avatar_box}>
            <img src={record?.avatar} className={style.avatar}></img>
          </div>
          <div className={style.header_middle}>
            <div className={style.name}>{record?.name}</div>
            <div className={style.time}>{dayjs(record?.createdTime).format('YYYY-MM-DD')}</div>
          </div>
          <div onClick={() => toggleAttentionFunc()} className={isLike ? style.cancelLike : style.likeBtn}>
            <span>{isLike ? '取消关注' : '关注'}</span>
          </div>
        </div>
        <div className={style.middle_text}>
          <div className={style.title}>{record?.articleTitle}</div>
          <div className={style.text}>{record?.articleContent}</div>
        </div>
        <div className={style.img_box}>
          {
            record?.articleImg
              ? record?.articleImg.split(';').map((img, index) =>
                <div key={index}>
                  <Image
                    height={130}
                    src={img}
                  />
                </div>
              ) : null
          }
        </div>
        <div className={style.category}>{record?.articleCategoryName ? `#${record.articleCategoryName}` : ''}</div>
        <div className={style.func_box}>
          <div className={style.icon_box}>
            <img src={eyeIcon} className={style.icon}></img>
            <span className={style.num}>{record?.articleViewCount}</span>
          </div>
          <div className={style.icon_box} onClick={() => toggleGiveLike()}>
            {
              giveLike!
                ? <img src={hearClick} className={style.icon} style={{ cursor: 'pointer' }}></img>
                : <img src={heartIcon} className={style.icon} style={{ cursor: 'pointer' }}></img>
            }
            <span className={giveLike! ? style.num_click : style.num}>{likeNum}</span>
          </div>
        </div>
        <div className={style.commnet}>
          <Input.TextArea
            value={sendMsg}
            onChange={(e) => setSendMsg(e.target.value.trim())}
          ></Input.TextArea>
          <div className={style.sendBtn} onClick={() => sendCommnet()}>评论</div>
        </div>
        {
          FirstCommentLists.length !== 0
            ? <div className={style.rule}>
              <div
                className={commentRule === 'LIKENUM' ? style.rule_box_click : style.rule_box}
                onClick={() => { setCommentRule('LIKENUM'); getFirstCommentBaseLikeNum(record?.articleId) }}
              >最热</div>
              <div
                className={commentRule === 'TIME' ? style.rule_box_click : style.rule_box}
                onClick={() => { setCommentRule('TIME'); getFirstCommentBaseTime(record?.articleId) }}
              >最新</div>
            </div> : null
        }
        <div className={style.firstCommentBox}>
          {
            FirstCommentLists?.map((item) => <FirstComment
              key={item.firstCommentId}
              item={item}
              commentRule={commentRule}
              getFirstCommentBaseLikeNum={() => getFirstCommentBaseLikeNum(record?.articleId)}
              getFirstCommentBaseTime={() => getFirstCommentBaseTime(record?.articleId)}
            ></FirstComment>)
          }
        </div>
        {
          pageSize >= 2 && pageSize !== current ? <div className={style.dian} onClick={() => addFirst()}>
            ...
          </div> : ''
        }
      </div>
    </div>
  )
}
