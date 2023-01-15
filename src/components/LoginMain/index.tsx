import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Form, Input, message } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import style from './index.module.scss'
import LoginPic from '../../assets/loginPic.webp'
import { login } from '../../api/user'

export default function LoginMain () {
  const [email, setEmail] = useState('')
  const navigator = useNavigate()

  // 检查邮箱
  const checkEmail = (email: string) => {
    if (email.length === 0) {
      message.info('邮箱不为空')
      return false
    } else if (email.length !== 18 || email.slice(6) !== '@whut.edu.cn') {
      message.info('邮箱格式不正确')
      return false
    } else {
      return true
    }
  }

  const onFinish = async (values: any) => {
    const { email, password } = values
    if (checkEmail(email)) {
      const res = await login(email, password)
      if (res?.code === 500) {
        message.info({ content: res.errorMsg })
      } else if (res?.code === 200) {
        localStorage.setItem('token', res.data)
        console.log(res)
        message.success('登录成功')
        navigator('/home', {
          replace: false,
          state: {
            email
          }
        })
      }
    }
  }

  const toRegister = () => {
    navigator('/register')
  }

  return (
    <div className={style.main}>
      <div className={style.left}>
        <div className={style.title}>武理论坛</div>
        <div className={style.intro}>武理人用的pc版表白墙，欢迎大家发表话题。后续会上架家教模块，二手市场模块，相亲模块等......敬请期待</div>
      </div>
      <div className={style.right}>
        <div className={style.login_box}>
          <img src={LoginPic} className={style.loginPic}></img>
        <Form
            onFinish={onFinish}
            autoComplete="off"
            className={style.form}
          >
            <Form.Item
              name='email'
              rules={[
                { required: true, message: '请输入教育邮箱' }]}
            >
              <Input placeholder='教育邮箱' className={style.input} value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Item>
            <Form.Item
              name='password'
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, max: 16, message: '密码长度为6-16位' },
                { pattern: /^[A-Za-z0-9]+$/, message: '密码只能包含字母，数字' }
              ]}>
              <Input.Password
                placeholder='密码'
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                className={style.input}
              ></Input.Password>
            </Form.Item>
            <Form.Item>
              <div className={style.span} onClick={() => toRegister()}>还没有账号，点击创建账号</div>
              <Button htmlType="submit" type='primary' className={style.button}>登录</Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}
