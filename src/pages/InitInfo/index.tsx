import React, { useEffect, useState } from 'react'
import style from './index.module.scss'
import './index.css'
import { Button, Input, Upload, message, Modal, Radio, RadioChangeEvent, Form } from 'antd'
import { RcFile, UploadChangeParam, UploadFile, UploadProps } from 'antd/lib/upload'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { changePassword, editInfo, getUser, postAvatar } from '../../api/user'
import { IResUserInfo, resSelfPosts } from '../../libs/model'
import { useNavigate } from 'react-router-dom'
import useVerify from '../../hooks/useVerify'
import { useForm } from 'antd/lib/form/Form'
import returnIcon from '../../assets/return.svg'
import topIcon from '../../assets/top.png'
import bottomIcon from '../../assets/bottom.png'
import { getSelfPosts } from '../../api/article'
import MessageItem from '../../components/HomeMiddle/MessageItem'
// import MessageItem from '../../components/HomeMiddle/MessageItem'

export default function InitInfo () {
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>()
  const [initAvatar, setInitAvatar] = useState('')
  const { testName } = useVerify()
  const navigator = useNavigate()
  // 控制修改头像
  const [avatarVisible, setAvatarVisible] = useState(false)
  const [blobAvatar, setBlobAvatar] = useState<Blob>()
  const [name, setName] = useState<string>()
  const [nick, setNick] = useState(false)
  const [gender, setGender] = useState<0 | 1>()
  const [user, setUser] = useState<IResUserInfo>()
  const [allArticle, setAllArticel] = useState<resSelfPosts>()
  const [current, setCurrent] = useState(1)

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
    </div>
  )

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 }
  }

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = useForm()

  const showModal = () => {
    setIsModalOpen(true)
  }

  // 检查密码
  const checkPassword = (password: string) => {
    const reg = /^[A-Za-z0-9]+$/
    if (password.length >= 6 && password.length <= 16 && reg.test(password)) {
      return true
    }
    return false
  }

  const handleOk = async () => {
    // 检查密码以及修改密码
    const oldPassword = form.getFieldValue('oldPassword')
    const confirmPassword = form.getFieldValue('confirmPassword')
    const password = form.getFieldValue('password')
    console.log(oldPassword, confirmPassword, password)
    if (checkPassword(oldPassword) && checkPassword(confirmPassword) && checkPassword(password)) {
      if (confirmPassword === password) {
        const res = await changePassword(password, oldPassword)
        if (res?.code === 200) {
          message.success('密码修改成功, 正跳转至首页重新登录')
          navigator('/login')
        } else {
          message.error('密码修改失败请重试')
        }
      } else {
        message.info('两次密码不一致，请检查')
      }
    }
  }

  const handleCancel = () => {
    form.resetFields()
    setIsModalOpen(false)
  }

  // 检查图片格式和大小
  const beforeUpload = (file: RcFile) => {
    const isPNG = file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/webp'
    if (!isPNG) {
      message.error(`${file.name} 不是一个图片格式`)
    }
    console.log(file.size / 1024 / 1024)
    const isLt1M = file.size / 1024 / 1024 < 1
    if (!isLt1M) {
      message.error('图片要小于1MB!')
    }
    return isPNG
  }

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
    }
  }

  // 检验名字 返回信息
  const returnNameInfo = () => {
    if (!name) {
      return '名字不能为空'
    }
    const reg = /^[\u4E00-\u9FA5a-zA-Z0-9_]{2,16}$/
    if (!reg.test(name)) {
      return '昵称只能为数字、字母、汉字及下划线组成，且为2-16位'
    }
    return ''
  }

  // 修改头像
  const clickChangeAvatar = async () => {
    if (!imageUrl) {
      message.info('请上传图片')
    } else {
      const formData = new FormData()
      formData.append('file', blobAvatar as Blob)
      const res = await postAvatar(formData)
      if (res?.code === 200) {
        getInfo()
        setAvatarVisible(false)
        message.success('更新成功')
      } else {
        message.error('修改失败，请稍后再试')
      }
    }
  }

  // 修改名字
  const changeName = async () => {
    if (!testName(name!)) {
      message.info('昵称只能为数字、字母、汉字及下划线组成，且为2-16位')
    } else {
      const res = await editInfo(name, gender)
      if (res?.code === 200) {
        message.success('修改成功！')
        getInfo()
        setNick(false)
      } else {
        message.info('修改失败，请稍后再试')
      }
    }
    setInitAvatar('')
  }

  // 修改性别
  const onChange = async (e: RadioChangeEvent) => {
    const res = await editInfo(name, e.target.value)
    if (res?.code === 200) {
      getInfo()
      message.success('修改成功！')
    } else {
      message.info('修改失败，请稍后再试')
    }
  }

  const email = localStorage.get("email")

  // 获取个人信息 同时刷新
  const getInfo = async () => {
    const res = await getUser(email)
    if (res) {
      setUser(res.data)
      setGender(res.data.sex)
      setName(res.data.nickName)
    }
  }

  const getPosts = async () => {
    if (email) {
      const res = await getSelfPosts(email, 1)
      if (res?.data.records) {
        setAllArticel(res.data)
        console.log(res.data)
      }
    }
  }

  const changeCurrent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const pages = allArticle?.pages
    if (!isNaN(Number(value))) {
      const newVal = Number(value)
      if (pages) {
        if (newVal <= pages && newVal >= 1) {
          setCurrent(newVal)
        } else if (newVal <= 0) {
          setCurrent(1)
        } else if (newVal > pages) {
          setCurrent(pages)
        }
      }
    }
  }

  const dePage = () => {
    if (current > 1) {
      const val = current - 1
      setCurrent(val)
    }
  }

  const addPage = () => {
    const pages = allArticle?.pages
    if (pages) {
      if (current < pages) {
        const val = current + 1
        setCurrent(val)
      }
    }
  }

  useEffect(() => {
    getPosts()
  }, [current])

  useEffect(() => {
    getInfo()
    getPosts()
  }, [])
  return (
    <div className={style.init}>
      <div className={style.nav}>
        <img src={returnIcon} className={style.returnIcon} onClick={() => navigator(-1)}></img>
      </div>
      <div className={style.main}>
        <div className={style.info}>
          <div className={style.left_box}>
            <div className={style.avatar_box} onClick={() => setAvatarVisible(true)}>
              <img src={user?.avatar} className={style.avatarIcon}></img>
              <div className={style.mask}>
                <span className={style.change_text}>修改头像</span>
              </div>
            </div>
            <span className={style.nickName}>{user?.nickName}</span>
            <span className={style.user_id}>ID {user?.email}</span>
          </div>
          <div className={style.right_box}>
            <div className={style.container}>
              <div className={style.title}>
                个人信息
              </div>
              {nick
                ? <div className={style.box}>
                  <div className={style.change_nickName}>
                    <Input className={style.input}
                      style={{ height: '30px' }}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    ></Input>
                    <Button className={style.btn} onClick={() => { setNick(false); setName(user?.nickName) }}>取消</Button>
                    <Button type='primary' className={style.btn} onClick={() => changeName()}>确认</Button>
                  </div>
                  <div className={style.span}>{returnNameInfo()}</div>
                </div>
                : <div className={style.static}>
                  <span className={style.name}>{user?.nickName}</span>
                  <a className={style.change} onClick={() => setNick(true)}>修改</a>
                </div>
              }
              <div className={style.gender_box}>
                <span className={style.sex_label}>性别:</span>
                <Radio.Group onChange={onChange} value={gender}>
                  <Radio value={0} className={style.radio}>男</Radio>
                  <Radio value={1} className={style.radio}>女</Radio>
                </Radio.Group>
              </div>
            </div>
            <div className={style.container2}>
              <div className={style.title}>安全设置</div>
              <div className={style.secure_box}>
                <span>修改密码</span>
                <a className={style.modify} onClick={showModal}>修改</a>
              </div>
            </div>
          </div>
        </div>
        <div className={style.foot}>
          <div className={style.navPage}>
            <div className={style.changeBox} onClick={() => dePage()}>
              <img className={style.changeIcon} src={topIcon}></img>
            </div>
            <Input className={style.input} value={current} onChange={(e) => changeCurrent(e) }></Input>
            <div className={style.changeBox} onClick={() => addPage()}>
              <img className={style.changeIcon} src={bottomIcon}></img>
            </div>
          </div>
          <div className={style.article_box}>
            {
              allArticle?.records.map((post) =>
                <div key={post.articleId}>
                  <MessageItem post={post}></MessageItem>
                </div>
              )
            }
          </div>
        </div>
      </div>
      <Modal title="修改密码"
        okText='确定'
        cancelText='取消'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}>
        <Form
          {...layout}
          form={form}
          name='passwordChange'
        >
          <Form.Item
            label="原密码"
            name="oldPassword"
            rules={[
              { required: true, message: '请输入原密码' },
              { min: 6, max: 16, message: '密码长度为6-16位' },
              { pattern: /^[A-Za-z0-9]+$/, message: '密码只能包含字母，数字' }
            ]}
          >
            <Input type='password' />
          </Form.Item>
          <Form.Item
            label="新密码"
            name="password"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, max: 16, message: '密码长度为6-16位' },
              { pattern: /^[A-Za-z0-9]+$/, message: '密码只能包含字母，数字' }
            ]}
          >
            <Input type="password" placeholder='6-16位，字母、数字组合' />
          </Form.Item>
          <Form.Item
            label="确认密码"
            name="confirmPassword"
            rules={[
              { required: true, message: '请再次输入密码' },
              { min: 6, max: 16, message: '密码长度为6-16位' },
              { pattern: /^[A-Za-z0-9]+$/, message: '密码只能包含字母，数字' }
            ]}
          >
            <Input type='password' />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="上传新头像"
        open={avatarVisible}
        onOk={clickChangeAvatar}
        cancelText='取消'
        okText='确定'
        onCancel={() => { setAvatarVisible(false); setImageUrl('') }}
        destroyOnClose
      ><div className={style.bigBox}>
          <div className={style.upload_box}>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              onChange={handleChange}
              customRequest={(option) => {
                setBlobAvatar(option.file as Blob)
                const before = beforeUpload(option.file as RcFile)
                if (before) {
                  const reader = new FileReader()
                  reader.readAsDataURL(option.file as RcFile)
                  reader.onloadend = function (e) {
                    setImageUrl(e.target!.result as string)
                    setLoading(false)
                  }
                } else {
                  setLoading(false)
                }
              }}
            >
              <div>{imageUrl ? <img src={imageUrl} style={{ width: '100%' }} /> : uploadButton}</div>
            </Upload>
          </div>
          <div className={style.init_box}>
            <img src={initAvatar} className={style.init_img}></img>
          </div>
        </div>
      </Modal>
    </div>
  )
}
