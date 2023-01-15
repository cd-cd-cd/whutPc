import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getUser } from '../../api/user'
import { IResUserInfo } from '../../libs/model'
import style from './index.module.scss'
interface IEmail {
  email: string
}
export default function HomeHeader () {
  const navigator = useNavigate()
  const [user, setUser] = useState<IResUserInfo>()

  const email = (useLocation().state as IEmail).email

  const getInfo = async () => {
    const res = await getUser(email)
    if (res) {
      setUser(res.data)
    }
  }

  useEffect(() => {
    getInfo()
  }, [])

  return (
    <div className={style.header}>
      <div className={style.header_box}>
        <div className={style.person}>
          <div className={style.avatarBox}>
            <img src={user?.avatar} className={style.img}></img>
          </div>
          <div>{user?.nickName}</div>
        </div>
        <div className={style.block} onClick={() => navigator('/init', {
          replace: false,
          state: {
            email
          }
        })}>个人中心</div>
        <div className={style.block}>退出</div>
      </div>
    </div>
  )
}
