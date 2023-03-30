import { message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { exitUser, getUser, isLogin } from '../../api/user'
import { IResUserInfo } from '../../libs/model'
import Icon from '../../assets/icon.jpg'
import style from './index.module.scss'

export default function HomeHeader () {
  const navigator = useNavigate()
  const [user, setUser] = useState<IResUserInfo>()
  const [login, setLogin] = useState<boolean>()

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

  useEffect(() => {
    getIsLogin()
  }, [])

  return (
    <div className={style.header}>
      <img src={Icon} className={style.iconPic}></img>
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
