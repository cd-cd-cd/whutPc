import { Button, Image, Input, message, Select } from 'antd'
import React, { useContext, useState } from 'react'
import style from './index.module.scss'
import fileIcon from '../../../assets/file.png'
import trashIcon from '../../../assets/trash.png'
import { context } from '../../../hooks/store'
import { postArticle } from '../../../api/article'
import { IArticle } from '../../../libs/model'

interface Props {
  refresh: () => void
}
export default function PublicArticle ({ refresh }: Props) {
  const { categoryArrays } = useContext(context)
  const [imgUrls, setImageUrls] = useState<string[]>([])
  const [list, setList] = useState<File[]>([])
  const [article, setArticle] = useState<IArticle>({ articleCategoryId: -1, articleContent: '', articleTitle: '' })
  const [putVisible, setPutVisible] = useState(false)
  const onChange = (value: string) => {
    setArticle({ ...article, articleCategoryId: Number(value) })
  }

  const createPost = async () => {
    // 假设没有照片
    const { articleCategoryId, articleContent, articleTitle } = article
    if (articleCategoryId < 0) {
      message.info('请选择发布类别')
    } else if (articleContent.length === 0) {
      message.info('请填写发布内容')
    } else if (articleTitle.length === 0) {
      message.info('请填写发布标题')
    } else if (articleTitle.length > 20 || articleTitle.length < 4) {
      message.info('发布标题字数在4-20之间')
    } else {
      let res
      if (list.length) {
        console.log(list)
        res = await postArticle(articleCategoryId, articleContent, articleTitle, list)
      } else {
        res = await postArticle(articleCategoryId, articleContent, articleTitle)
      }
      if (res?.code === 200) {
        message.success('发布成功')
        closePost()
      } else {
        message.error(res?.errorMsg as string)
      }
    }
  }

  const beforeUpload = (type: string, size: number) => {
    const isPNG = type === 'image/png' || type === 'image/jpeg' || type === 'image/jpg' || type === 'image/webp'
    if (!isPNG) {
      message.error('请上传图片格式')
    }
    const isLt1M = size / 1024 / 1024 < 1
    if (!isLt1M) {
      message.error('图片要小于1MB!')
    }
    return isPNG && isLt1M
  }

  const uploadFiles = (e: any) => {
    const file = e.target.files[0]
    const size = file.size
    const type = file.type
    if (beforeUpload(type, size)) {
      setList([file, ...list])
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = function (e) {
        setImageUrls([e.target!.result as string, ...imgUrls])
      }
    }
  }

  const deleteImg = (deleteIndex: number) => {
    setImageUrls(imgUrls.filter((_, index) => index !== deleteIndex))
    setList(list.filter((_, index) => index !== deleteIndex))
  }

  const closePost = () => {
    setPutVisible(false)
    setImageUrls([])
    setList([])
  }

  return (
    <div className={style.back}>
      {
        !putVisible ? <div className={style.infoInit} onClick={() => { setPutVisible(true) }}>发布一条信息吧</div>
          : <div>
            <div className={style.info}>信息发布</div>
            <div className={style.select}>
              <div className={style.catagoryTtitle}>类别</div>
              <Select
                placeholder="选择发布类别"
                onChange={onChange}
                options={categoryArrays.map((item) => ({ value: item.categoryId, label: item.categoryName }))}
              />
            </div>
            <div className={style.title}>
              <div className={style.need}>*</div>
              <div className={style.titleText}>标题</div>
              <Input className={style.titleInput} placeholder='4-20个汉字' onChange={(e) => setArticle({ ...article, articleTitle: e.target.value })}></Input>
            </div>
            <div className={style.content}>
              <Input.TextArea placeholder='详细描述你想发布的内容' onChange={(e) => setArticle({ ...article, articleContent: e.target.value })}></Input.TextArea>
            </div>
            <div className={style.img_box}>
              {
                imgUrls.length
                  ? imgUrls.map((item, index) =>
                    <div key={index} className={style.pic_box}>
                        <Image className={style.pic} src={item}></Image>
                      <div className={style.mask}>
                        <img src={trashIcon} className={style.trashIcon} onClick={() => deleteImg(index)}></img>
                      </div>
                    </div>
                  )
                  : ''
              }
              {
                imgUrls.length !== 9 ? <div className={style.input_box_file}>
                  <div className={style.file_box}>
                    <img src={fileIcon} className={style.fileIcon}></img>
                  </div>
                  <input type="file" name="" onChange={(e) => uploadFiles(e)} className={style.fileBtn} id="input" accept="image/*"></input>
                </div> : ''
              }
            </div>
            <div className={style.buttoms}>
              <Button onClick={() => closePost()} className={style.btn}>返回</Button>
              <Button className={style.btn} onClick={() => createPost()}>确认发布</Button>
            </div>
          </div>
      }
    </div>
  )
}
