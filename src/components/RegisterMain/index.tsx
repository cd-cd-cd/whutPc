import React, { useState } from 'react'
import { Button, Form, Input, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { getCode, register } from '../../api/user'
import style from './index.module.scss'
import { useNavigate } from 'react-router-dom'
import useVerify from '../../hooks/useVerify';

export default function RegisterMain () {
  const [email, setEmail] = useState('')
  const navigator = useNavigate()
  const { checkEmail } = useVerify()

  // 发送验证码
  const getCodeClick = async () => {
    if (checkEmail(email)) {
      message.loading({ content: '正在发送...', key: 'sendCode' })
      const res = await getCode(email)
      if (res?.code === 200) {
        message.success({ content: '验证码发送成功，请前往邮箱查看', key: 'sendCode' })
      } else if (res?.code === 500) {
        message.open({
          type: 'info',
          content: res.errorMsg,
          key: 'sendCode'
        })
      } else {
        message.error({ content: '验证码发送失败，请稍后重试', key: 'sendCode' })
      }
    }
  }

  // 注册按钮
  const onFinish = async (values: any) => {
    const { email, code, password, rePassword } = values
    if (checkEmail(email)) {
      if (code.length === 0) {
        message.info("验证码不为空")
      } else if (password !== rePassword) {
        message.info("密码不一致，请重新输入!")
      } else {
        message.loading({ content: '正在注册', key: 'registerCode' })
        const res = await register(code, email, password)
        if (res?.code === 500) {
          message.open({
            type: 'info',
            content: res.errorMsg,
            key: 'registerCode'
          })
        } else if (res?.code === 200) {
          message.open({
            type: 'success',
            content: '注册成功!',
            key: 'registerCode'
          })
          navigator('/login')
        } else {
          message.error({ content: '系统繁忙，请稍后再试', key: 'registerCode' })
        }
      }
    }
  }

  const toLogin = () => {
    navigator('/login')
  }

  return (
    <div className={style.main}>
      <div className={style.left}>
        <div className={style.title}>武理论坛</div>
        <div className={style.intro}>武理人用的pc版表白墙，欢迎大家发表话题。后续会上架家教模块，二手市场模块，相亲模块等......敬请期待</div>
      </div>
      <div className={style.right}>
        <div className={style.login_box}>
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
            >
              <Form.Item
                name='code'
                noStyle
                rules={[
                  { required: true, message: '请输入验证码' }
                ]}
              >
                <Input placeholder='验证码' className={style.input_code} />
              </Form.Item>
              <Form.Item
                noStyle
              >
                <Button type='primary' className={style.getCode} onClick={() => getCodeClick()}>点击获取验证码</Button>
              </Form.Item>
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
            <Form.Item
              name='rePassword'
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, max: 16, message: '密码长度为6-16位' },
                { pattern: /^[A-Za-z0-9]+$/, message: '密码只能包含字母，数字' }
              ]}>
              <Input.Password
                placeholder='确认密码'
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                className={style.input}
              ></Input.Password>
            </Form.Item>
            <Form.Item>
              <div className={style.span} onClick={() => toLogin()}>已经注册，账号登录</div>
              <Button htmlType="submit" type='primary' className={style.button}>注册</Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}
