import React, { useContext } from 'react'
import style from './index.module.scss'
import { context } from '../../../hooks/store'

export default function SortRule () {
  const { ruleType, setRuleType } = useContext(context)
  return (
    <div className={style.back}>
      <div
        onClick={() => { setRuleType('lasted') }}
        className={ruleType === 'lasted' ? style.click : style.normal}
      >最新</div>
      <div
        onClick={() => { setRuleType('hottest') }}
        className={ruleType === 'hottest' ? style.click : style.normal}
      >最热</div>
    </div>
  )
}
