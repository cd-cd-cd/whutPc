export interface IRecord {
  articleCategoryId: number
  articleCategoryName: string
  articleCommentCount: number
  articleContent: string
  articleId: string
  articleImg: string
  articleLikeCount: number
  articleTitle: string
  articleUserId: string
  articleViewCount: number
  avatar: string
  createdTime: string
  isDeleted: number
  liked: boolean
  name: string
  updateTime: string
}

export interface INewRes {
  countId: number
  current: number
  maxLimit: number
  optimizeCountSql: boolean
  orders: []
  pages: number
  records: IRecord[]
  searchCount: boolean
  size: number
  total: number
}


export interface ICategory {
  categoryId: number
  categoryName: string
}

export interface IArticle {
  articleCategoryId: number
  articleContent: String
  articleTitle: String
}

export type rule = 'lasted' | 'hottest'

export interface IResUserInfo {
  avatar: string
  email: string
  nickName: string,
  sex: 0 | 1
}

export interface resSelfPosts {
  countId: string
  pages: number
  records: IRecord[]
  searchCount: boolean
  size: number
  total: number
}