import React, { useEffect, useContext, useCallback } from 'react'
import style from './index.module.scss'
import { getCategoryArray } from '../../../api/article'
import { context } from '../../../hooks/store'
import usePostArray from '../../../hooks/usePostArray'
import { rule } from '../../../libs/model'

export default function SortRule () {
  const { PostList, setPostList, categoryId, setCategoryId, ruleType, setRuleType } = useContext(context)
  const { lastArticle, hotArticle } = usePostArray()

  const getArticles = useCallback(async (type: rule) => {
    console.log(categoryId)
    if (categoryId >= 0) {
      const res = await getCategoryArray(categoryId)
      if (res) {
        console.log(res.data)
      }
    } else {
      if (type === 'lasted') {
        lastArticle()
      } else if (type === 'hottest') {
        hotArticle()
      }
    }
  }, [PostList, setPostList, categoryId]
  )

  useEffect(() => {
    getArticles(ruleType)
  }, [ruleType, categoryId])

  useEffect(() => {
    getArticles(ruleType)
  }, [])
  return (
    <div className={style.back}>
      <div
        onClick={() => { setCategoryId(-1); setRuleType('lasted') }}
        className={ruleType === 'lasted' ? style.click : style.normal}
      >最新</div>
      <div
        onClick={() => { setCategoryId(-1); setRuleType('hottest') }}
        className={ruleType === 'hottest' ? style.click : style.normal}
      >最热</div>
    </div>
  )
}
