import React from 'react'
import HomeHeader from '../../components/HomeHeader'
import HomeLeft from '../../components/HomeLeft'
import HomeMiddle from '../../components/HomeMiddle'
import style from './index.module.scss'

export default function Home () {
  return (
    <div className={style.back}>
      <HomeHeader></HomeHeader>
      <HomeLeft></HomeLeft>
      <div className={style.main}>
        <HomeMiddle></HomeMiddle>
      </div>
    </div>
  )
}
