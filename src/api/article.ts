import request from "../utils/request";
import { INewRes, ICategory, IRecord, resSelfPosts, IResFirstCommentList, IFirstComment } from '../libs/model'
// 首页最新文章
export const LatestArticles = async (category?: number) => {
  return await request<INewRes>({
    url: '/article/new',
    method: 'GET',
    params: {
      category
    }
  })
}

// 得到点赞最多十条
export const HottestArticles = async (category?: number) => {
  return await request<INewRes>({
    url: '/article/hot',
    method: 'GET',
    params: {
      category
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
export const postArticle = async (articleCategoryId: number, articleContent: String, articleTitle: String) => {
  return await request({
    url: '/article/create',
    method: 'POST',
    data: {
      articleCategoryId,
      articleContent,
      articleTitle
    }
  })
}

// 查询文章详细内容
export const getRetailArticle = async (id: string) => {
  return await request<IRecord>({
    url: `/article/detail/${id}`,
    method: 'GET',
    data: {
      id
    }
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
export const sendFirstComment = async (firstCommentArticleId: number, firstCommentContent: string) => {
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
export const accordLikeNum = async (articleId: string) => {
  return await request<IResFirstCommentList>({
    url: '/firstComment/getHotList',
    method: 'GET',
    params: {
      articleId
    }
  })
}

// 根据发布时间查询文章评论(暂时未设置页数)
export const accordTime = async (articleId: string) => {
  return await request<IResFirstCommentList>({
    url: '/firstComment/getNewList',
    method: 'GET',
    params: {
      articleId
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
export const sendSecond = async (firstCommentArticleId: number, firstCommentContent: string) => {
  return await request({
    url: '/sonComment/create',
    method: 'POST',
    data: {
      firstCommentArticleId,
      firstCommentContent
    }
  })
}
