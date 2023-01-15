import React from 'react'
import style from './index.module.scss'
import LoginBottom from '../../components/LoginBottom'
import RegisterMain from '../../components/RegisterMain'
import LoginHeader from '../../components/LoginHeader'

export default function Register () {
  return (
    <div className={style.body}>
      <LoginHeader></LoginHeader>
      <RegisterMain></RegisterMain>
      <LoginBottom></LoginBottom>
    </div>
  )
}
