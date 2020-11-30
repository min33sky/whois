import { Row, Col, Typography } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import History from '../../common/components/History';
import Setting from '../components/Setting';
import { actions } from '../state';
import SearchInput from './SearchInput';

export default function Search() {
  const userHistory = useSelector(state => state.search.userHistory);
  const dispatch = useDispatch();

  // 히스토리 api 호출

  useEffect(() => {
    dispatch(actions.fetchAllHistory());
  }, [dispatch]);

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
      <Row justify='center' style={{ marginBottom: 50 }}>
        <Col xs={20} md={16} lg={12}>
          <SearchInput />
        </Col>
      </Row>
      <Row justify='center'>
        <Col xs={20} md={16} lg={12}>
          <History items={userHistory} />
        </Col>
      </Row>
    </>
  );
}
