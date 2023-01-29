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

export interface IFirstComment {
  avatar: string
  firstCommentArticleId: number
  firstCommentContent: string
  firstCommentCount: number
  firstCommentCreatedTime: Date
  firstCommentId: number
  firstCommentLikeCount: number
  firstCommentUserId: string
  liked: boolean
  name: string
}

export interface IResFirstCommentList {
  countId: string
  current: number
  maxLimit: string
  pages: number
  records: IFirstComment[]
  searchCount: boolean
  size: number
  total: number
}

export interface ISecondComment {
  commentReplyAvatar: string | null
  commentReplyName: string | null
  commentUserAvatar: string
  commentUserName: string
  liked: boolean
  sonCommentContent: string
  sonCommentCreatedTime: string
  sonCommentId: number
  sonCommentLikeCount: number
  sonCommentParentId: number
  sonCommentReplyUserId: number | null
  sonCommentUserId: string
}

export interface ISonRes {
  countId: string
  current: number
  maxLimit: string
  pages: number
  records: ISecondComment[]
  searchCount: boolean
  size: number
  total: number
}

export type ICommentRule = 'TIME' | 'LIKENUM'