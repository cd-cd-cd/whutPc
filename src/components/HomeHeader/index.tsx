import { message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { exitUser, getUser } from '../../api/user'
import { IResUserInfo } from '../../libs/model'
import style from './index.module.scss'

export default function HomeHeader () {
  const navigator = useNavigate()
  const [user, setUser] = useState<IResUserInfo>()
  const [email, setEmail] = useState('')

  const getInfo = async (email: string) => {
    const res = await getUser(email)
    if (res?.success) {
      setUser(res.data)
    } else {
      setEmail('')
    }
  }

  const exit = async () => {
    const res = await exitUser()
    if (res?.code === 200) {
      message.success('退出成功')
      navigator('/login')
    }
  }

  useEffect(() => {
    const email = localStorage.getItem("email")
    if (email) {
      setEmail(email)
      getInfo(email)
    }
  }, [])

  return (
    <div className={style.header}>
      {
        email
          ? <div className={style.header_box}>
            <div className={style.person}>
              <div className={style.avatarBox}>
                <img src={user?.avatar} className={style.img}></img>
              </div>
              <div>{user?.nickName}</div>
            </div>
            <div className={style.block} onClick={() => navigator('/homePage')}>个人中心</div>
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
