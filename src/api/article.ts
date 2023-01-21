import request from "../utils/request";
import { INewRes, ICategory, IRecord } from '../libs/model'
// 首页最新文章
export const LatestArticles = async () => {
  return await request<INewRes>({
    url: '/article/new',
    method: 'GET'
  })
}

// 得到点赞最多十条
export const HottestArticles = async () => {
  return await request<INewRes>({
    url: '/article/hot',
    method: 'GET'
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

interface resSelfPosts {
  countId: string
  pages: number
  records: IRecord[]
  searchCount: boolean
  size: number
  total: number
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
