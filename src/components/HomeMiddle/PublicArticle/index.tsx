import { Button, Input, message, Modal, Select, Upload, UploadFile } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { RcFile, UploadProps } from 'antd/es/upload'
import React, { useContext, useState } from 'react'
import style from './index.module.scss'
import { context } from '../../../hooks/store'
import { postArticle } from '../../../api/article'
import { IArticle } from '../../../libs/model'
import usePostArray from '../../../hooks/usePostArray'
// import { category } from '../../../api/article'

export default function PublicArticle () {
  const { categoryArrays, categoryId, ruleType } = useContext(context)
  const { lastArticle } = usePostArray()
  const [article, setArticle] = useState<IArticle>({ articleCategoryId: -1, articleContent: '', articleTitle: '' })
  const [putVisible, setPutVisible] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([
  ])
  // const [blobAvatar, setBlobAvatar] = useState<Blob>()

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })

  const handleCancel = () => setPreviewOpen(false)

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile)
    }
    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1))
  }

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList)
    console.log(newFileList)
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  const onChange = (value: string) => {
    setArticle({ ...article, articleCategoryId: Number(value) })
  }

  // 检查图片格式和大小
  // const beforeUpload = (file: RcFile) => {
  //   const isPNG = file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/webp' || file.type === 'image/jpg'
  //   if (!isPNG) {
  //     message.error(`${file.name} 不是一个png、jpeg、jpg或jpeg格式的文件`)
  //   }
  //   const isLt10M = file.size / 1024 / 1024 < 10
  //   if (!isLt10M) {
  //     message.error('图片要小于10MB!')
  //   }
  //   return isPNG && isLt10M
  // }

  const createPost = async () => {
    // 假设没有照片
    const { articleCategoryId, articleContent, articleTitle } = article
    console.log(article)
    if (articleCategoryId < 0) {
      message.info('请选择发布类别')
    } else if (articleContent.length === 0) {
      message.info('请填写发布内容')
    } else if (articleTitle.length === 0) {
      message.info('请填写发布标题')
    } else if (articleTitle.length > 20 || articleTitle.length < 4) {
      message.info('发布标题字数在4-20之间')
    } else {
      const res = await postArticle(articleCategoryId, articleContent, articleTitle)
      if (res?.code === 200) {
        if (categoryId < 0 && ruleType === 'lasted') {
          lastArticle()
        }
        message.success('发布成功')
      }
    }
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
            <div className={style.putImgs}>
              <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                action='/article/uploadImg'
              >
                {fileList.length >= 9 ? null : uploadButton}
              </Upload>
              <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
              </Modal>
            </div>
            <div className={style.buttoms}>
              <Button onClick={() => { setPutVisible(false) }} className={style.btn}>返回</Button>
              <Button className={style.btn} onClick={() => createPost()}>确认发布</Button>
            </div>
          </div>
      }
    </div>
  )
}
