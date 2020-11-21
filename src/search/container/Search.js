import { Row, Col, Typography } from 'antd';
import React from 'react';
import Setting from '../components/Setting';
import SearchInput from './SearchInput';

export default function Search() {
  return (
    <>
      <Row justify='end' style={{ padding: 20, marginBottom: 100 }}>
        <Col>
          <Setting logout={() => {}} />
        </Col>
      </Row>
      <Row justify='center' style={{ marginBottom: 50 }}>
        <Col>
          <Typography.Title style={{ fontFamily: 'cursive' }}>찾 아 야 한 다</Typography.Title>
        </Col>
      </Row>
      <Row justify='center'>
        <Col span={12}>
          <SearchInput />
        </Col>
      </Row>
    </>
  );
}
