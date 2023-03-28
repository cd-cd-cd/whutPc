import request from "../utils/request";
import { INewRes, ICategory, IRecord, resSelfPosts, IResFirstCommentList, IFirstComment, ISonRes, ISecondComment } from '../libs/model'
// 首页最新文章
export const LatestArticles = async (current: number, category?: number) => {
  return await request<INewRes>({
    url: '/article/new',
    method: 'GET',
    params: {
      category,
      current
    }
  })
}

// 得到点赞最多十条
export const HottestArticles = async (current: number, category?: number) => {
  return await request<INewRes>({
    url: '/article/hot',
    method: 'GET',
    params: {
      category,
      current
    }
  })
}

// 查询分类列表
export const category = async () => {
  return await request<ICategory[]>({
    url: '/category',
    method: 'GET'
  })
}

// 通过id查询分类
export const getCategoryArray = async (id: number) => {
  return await request({
    url: `/category/${id}`,
    method: 'GET'
  })
}

// 给文章点赞或取消
export const toggleLike = async (id: string) => {
  return await request({
    url: `/article/like/${id}`,
    method: 'PUT'
  })
}

// 发布文章
export const postArticle = async (FormData: FormData) => {
  return await request<string>({
    url: '/article/create',
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: FormData
  })
}

// 查询文章详细内容
export const getRetailArticle = async (id: string) => {
  return await request<IRecord>({
    url: `/article/detail/${id}`,
    method: 'GET'
  })
}

// 查询某用户的所有文章
export const getSelfPosts = async (useId: string, current: number) => {
  return await request<resSelfPosts>({
    url: '/article/all',
    method: 'GET',
    params: {
      useId,
      current
    }
  })
}

// 新增评论
export const sendFirstComment = async (firstCommentArticleId: string | number, firstCommentContent: string) => {
  return await request({
    url: '/firstComment/create',
    method: 'POST',
    data: {
      firstCommentArticleId,
      firstCommentContent
    }
  })
}

// 根据点赞数查询文章评论 (暂时未设置页数)
export const accordLikeNum = async (articleId: string, current: number) => {
  return await request<IResFirstCommentList>({
    url: '/firstComment/getHotList',
    method: 'GET',
    params: {
      articleId,
      current
    }
  })
}

// 根据发布时间查询文章评论(暂时未设置页数)
export const accordTime = async (articleId: string, current: number) => {
  return await request<IResFirstCommentList>({
    url: '/firstComment/getNewList',
    method: 'GET',
    params: {
      articleId,
      current
    }
  })
}

// 一级评论点赞
export const FirstCommentLike = async (id: string) => {
  return await request({
    url: `/firstComment/like/${id}`,
    method: 'PUT'
  })
}

// 查询一级评论详细信息
export const FirstCommentDetail = async (id: number) => {
  return await request<IFirstComment>({
    url: `/firstComment/detail/${id}`,
    method: 'GET'
  })
}

// 发送二级评论
export const sendSecond = async (sonCommentContent: string, sonCommentParentId: number, sonCommentReplyId?: string) => {
  return await request({
    url: '/sonComment/create',
    method: 'POST',
    data: {
      sonCommentContent,
      sonCommentParentId,
      sonCommentReplyId
    }
  })
}

// 查询父级评论对应的子级评论
export const getSonMsg = async (firstCommentId: number, current: number) => {
  return await request<ISonRes>({
    url: '/sonComment/getList',
    method: 'GET',
    params: {
      firstCommentId,
      current
    }
  })
}

// 查询二级评论详细信息
export const getDetailSonMsg = async (id: number) => {
  return await request<ISecondComment>({
    url: `/sonComment/detail/${id}`,
    method: 'GET'
  })
}

// 给二级评论点赞或取消
export const toggleSecondLike = async (id: number) => {
  return await request({
    url: `/sonComment/like/${id}`,
    method: 'PUT'
  })
}
