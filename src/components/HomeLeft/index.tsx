import React, { useContext, useEffect } from 'react'
import { category } from '../../api/article'
import { context } from '../../hooks/store'
import style from './index.module.scss'

export default function HomeLeft () {
  const { categoryId, setCategoryId, setCategoryArrays, categoryArrays } = useContext(context)

  const getCategoryArray = async () => {
    const res = await category()
    if (res?.data) {
      setCategoryArrays(res?.data)
    }
  }

  useEffect(() => {
    getCategoryArray()
  }, [])

  return (
    <div className={style.left}>
      {
        categoryArrays?.map((item) =>
          <div key={item.categoryId}
          className={item.categoryId === categoryId ? style.item_click : style.item}
          onClick={() => { setCategoryId(item.categoryId) }}
          >{item.categoryName}</div>
        )
      }
    </div>
  )
}
