import React from 'react'
import { useSearchParams } from 'react-router-dom'
import HomeHeader from '../../components/HomeHeader'
import style from './index.module.scss'
export default function RetailArticle () {
  const [searchParams] = useSearchParams()
  console.log(searchParams.get("id"))
  return (
    <div className={style.back}>
      <HomeHeader></HomeHeader>
    </div>
  )
}
