import { Row, Col, Typography } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import History from '../../common/components/History';
import Setting from '../components/Setting';
import { actions } from '../state';
import { actions as authActions } from '../../auth/state';
import SearchInput from './SearchInput';
import useNeedLogin from './../../common/hooks/useNeedLogin';
import { AuthStatus } from './../../common/constant';

export default function Search() {
  useNeedLogin();

  const userHistory = useSelector(state => state.search.userHistory);
  const authStatus = useSelector(state => state.auth.status);
  const dispatch = useDispatch();

  // 히스토리 api 호출
  useEffect(() => {
    if (authStatus === AuthStatus.Login) {
      dispatch(actions.fetchAllHistory());
    }
  }, [dispatch, authStatus]);

  function onLogout() {
    dispatch(authActions.fetchLogout());
  }

  return (
    <>
      <Row justify='end' style={{ padding: 20, marginBottom: 100 }}>
        <Col>
          <Setting logout={onLogout} />
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
