import { createContext } from "react"
import { ICategory, IRecord, rule } from '../libs/model'

interface StoreContext {
  // 保存帖子
  PostList: IRecord[],
  setPostList: (Record: IRecord[]) => void

  // 保存类别id
  categoryId: number,
  setCategoryId: (id: number) => void

  // 保存type
  ruleType: rule,
  setRuleType: (type: rule) => void

  // 保存类别
  categoryArrays: ICategory[],
  setCategoryArrays: (array: ICategory[]) => void
}

const context = createContext<StoreContext>({
  PostList: [],
  setPostList: () => {},
  categoryId: -1,
  setCategoryId: () => {},
  categoryArrays: [],
  setCategoryArrays: () => {},
  ruleType: 'lasted',
  setRuleType: () => {}
})

const StoreProvider = context.Provider
export { context, StoreProvider }
