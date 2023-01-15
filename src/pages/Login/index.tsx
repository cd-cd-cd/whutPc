import React from 'react'
import style from './index.module.scss'
import LoginBottom from '../../components/LoginBottom'
import LoginHeader from '../../components/LoginHeader'
import LoginMain from '../../components/LoginMain'

export default function Login () {
  return (
    <div className={style.body}>
      <LoginHeader></LoginHeader>
      <LoginMain></LoginMain>
      <LoginBottom></LoginBottom>
    </div>
  )
}
