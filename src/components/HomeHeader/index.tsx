import { message } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { exitUser, getUser, isLogin } from '../../api/user'
import { IResUserInfo } from '../../libs/model'
import Icon from '../../assets/icon.jpg'
import style from './index.module.scss'
import Search from 'antd/lib/input/Search'
import { searchArticle } from '../../api/article'
import { context } from '../../hooks/store'

export default function HomeHeader () {
  const navigator = useNavigate()
  const [user, setUser] = useState<IResUserInfo>()
  const [login, setLogin] = useState<boolean>()
  const { setCategoryId } = useContext(context)

  const getInfo = async (email: string) => {
    const res = await getUser(email)
    if (res?.success) {
      setUser(res.data)
    } else {
      setLogin(false)
    }
  }

  const exit = async () => {
    const res = await exitUser()
    if (res?.code === 200) {
      message.success('退出成功')
      localStorage.clear()
      navigator('/login')
    }
  }

  // 查看是否登录
  const getIsLogin = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      const res = await isLogin(token)
      if (res?.success) {
        setLogin(res.data)
        if (res.data) {
          const email = localStorage.getItem("email")
          if (email) {
            getInfo(email)
          }
        }
      }
    } else {
      setLogin(false)
    }
  }

  const onSearch = async (value: string) => {
    const res = await searchArticle(value)
    if (res?.success) {
      console.log(res)
    }
  }

  useEffect(() => {
    getIsLogin()
  }, [])

  return (
    <div className={style.header}>
      <div className={style.leftBox}>
        <img onClick={() => { setCategoryId(-1) }} src={Icon} className={style.iconPic}></img>
        <Search placeholder="搜索想要的内容" allowClear onSearch={onSearch} style={{ width: 200 }} />
      </div>
      {
        login
          ? <div className={style.header_box}>
            <div className={style.person}>
              <div className={style.avatarBox}>
                <img src={user?.avatar} className={style.img}></img>
              </div>
              <div>{user?.nickName}</div>
            </div>
            <div className={style.block} onClick={() => window.open('/homePage')}>个人中心</div>
            <div className={style.block} onClick={() => exit()}>退出</div>
          </div>
          : <div className={style.imLogin}>
            <div className={style.block} onClick={() => navigator('/register')}>注册</div>
            <div className={style.verticalLine}></div>
            <div className={style.block} onClick={() => navigator('/login')}>登录</div>
          </div>
      }
    </div>
  )
}
