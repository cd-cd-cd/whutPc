import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Form, Input, message } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import style from './index.module.scss'
import LoginPic from '../../assets/loginPic.webp'
import { login } from '../../api/user'
import useVerify from '../../hooks/useVerify'

export default function LoginMain () {
  const [email, setEmail] = useState('')
  const navigator = useNavigate()
  const { checkEmail } = useVerify()

  const onFinish = async (values: any) => {
    const { email, password } = values
    if (checkEmail(email)) {
      const res = await login(email, password)
      if (res?.code === 500) {
        message.info({ content: res.errorMsg })
      } else if (res?.code === 200) {
        localStorage.setItem('token', res.data)
        localStorage.setItem('email', email)
        message.success('登录成功')
        navigator('/home')
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
                { pattern: /^([a-zA-Z\d][\w-]{2,})@(\w{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/, message: '邮箱格式不正确' },
                { required: true, message: '请输入邮箱' }]}
            >
              <Input placeholder='邮箱' className={style.input} value={email} onChange={(e) => setEmail(e.target.value)} />
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
            <Form.Item className={style.btn_box}>
              <div className={style.span} onClick={() => toRegister()}>还没有账号，点击创建账号</div>
              <Button htmlType="submit" type='primary' className={style.button}>登录</Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}
