import React from 'react'
import logo from '../../assets/icon.jpg'
import style from './index.module.scss'

export default function LoginHeader () {
  return (
    <div className={style.header}>
      <img src={logo} className={style.logo}></img>
    </div>
  )
}
