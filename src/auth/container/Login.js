import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Input, Button, Form } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { actions } from '../state';
import useBlockLoginUser from './../hooks/useBlockLoginUser';

export default function Login() {
  useBlockLoginUser();

  const dispatch = useDispatch();

  function onFinish({ username, password }) {
    dispatch(actions.fetchLogin(username, password));
  }

  return (
    <>
      <AuthLayout onFinish={onFinish}>
        <Form.Item
          name='username'
          rules={[{ required: true, message: 'Please input your Username!' }]}
        >
          <Input
            autoFocus
            prefix={<UserOutlined className='site-form-item-icon' />}
            placeholder='Username'
          />
        </Form.Item>

        <Form.Item
          name='password'
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input prefix={<LockOutlined />} type='password' placeholder='Password' />
        </Form.Item>

        <Form.Item>
          <Button type='primary' htmlType='submit' style={{ width: '100%' }}>
            Log in
          </Button>
          Or <Link to='/signup'>register now!</Link>
        </Form.Item>
      </AuthLayout>
    </>
  );
}
