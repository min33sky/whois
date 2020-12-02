import { Row, Col, Typography, Form } from 'antd';
import React from 'react';

/**
 * 폼 레이아웃
 * @param {object} param
 * @param {() => void} param.onFinish Form Submit Handler
 * @param {import('react').ReactNode} param.children Form Component
 */
export default function AuthLayout({ onFinish, children }) {
  return (
    <>
      <Row justify='center' style={{ marginTop: 100 }}>
        <Col>
          <Typography.Title style={{ fontFamily: 'cursive' }}>찾 아 야 한 다</Typography.Title>
        </Col>
      </Row>
      <Row justify='center'>
        <Col>
          <Form
            initialValues={{ remember: true }}
            style={{ width: 300, marginTop: 50 }}
            onFinish={onFinish}
          >
            {children}
          </Form>
        </Col>
      </Row>
    </>
  );
}
