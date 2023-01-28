import React, { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import InitInfo from './pages/InitInfo'
import Home from './pages/Home'
import { IRecord, ICategory, rule } from './libs/model'
import { StoreProvider } from './hooks/store'
import RetailArticle from './pages/RetailArticle'
import PerHome from './pages/Perhome'

function App () {
  const [PostList, setPostList] = useState<IRecord[]>([])
  const [categoryId, setCategoryId] = useState<number>(-1)
  const [categoryArrays, setCategoryArrays] = useState<ICategory[]>([])
  const [ruleType, setRuleType] = useState<rule>('lasted')
  return (
    <StoreProvider value={{
      PostList,
      setPostList,
      categoryId,
      setCategoryId,
      categoryArrays,
      setCategoryArrays,
      ruleType,
      setRuleType
    }}>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/register' element={<Register />}></Route>
          <Route path='/homePage' element={<InitInfo />}></Route>
          <Route path='/home' element={<Home />}></Route>
          <Route path='/Retail' element={<RetailArticle/>}></Route>
          <Route path='/page/:id' element={<PerHome/>}></Route>
          {/* <Route path='*' element={<Navigate to='/register'/>}></Route> */}
          <Route path='*' element={<Navigate to='/home' />}></Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}

export default App
