import React from 'react'
import HomeHeader from '../../components/HomeHeader'
import HomeLeft from '../../components/HomeLeft'
import HomeMiddle from '../../components/HomeMiddle'
import HomeRight from '../../components/HomeRight'
import style from './index.module.scss'

export default function Home () {
  return (
    <div className={style.back}>
      <HomeHeader></HomeHeader>
      <div className={style.main}>
        <HomeLeft></HomeLeft>
        <HomeMiddle></HomeMiddle>
        <HomeRight></HomeRight>
      </div>
    </div>
  )
}
