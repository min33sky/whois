import { Row, Col, Typography } from 'antd';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import History from '../../common/components/History';
import Setting from '../components/Setting';
import { actions } from '../state';
import { actions as authActions } from '../../auth/state';
import SearchInput from './SearchInput';
import useNeedLogin from './../../common/hooks/useNeedLogin';
import { AuthStatus } from './../../common/constant';
import { Types } from './../state/index';
import { useInfinityScroll } from '../../common/hooks/useInfinityScroll';
import Loader from '../../common/components/Loader';

export default function Search() {
  useNeedLogin();

  const userHistory = useSelector(state => state.search.userHistory);
  const authStatus = useSelector(state => state.auth.status);
  const dispatch = useDispatch();

  const page = useSelector(
    state => state.common.fetchInfo.nextPageMap[Types.FetchAllHistory]?.[Types.FetchAllHistory],
  );

  const totalCount = useSelector(
    state => state.common.fetchInfo.totalCountMap[Types.FetchAllHistory]?.[Types.FetchAllHistory],
  );

  let isMoreData = userHistory.length < totalCount;

  // 히스토리 api 호출
  useEffect(() => {
    if (authStatus === AuthStatus.Login) {
      dispatch(actions.fetchAllHistory(0));
    }
  }, [dispatch, authStatus]);

  // 무한 스크롤링 api 호출

  const target = useRef(null);

  useInfinityScroll({
    target,
    onInterSect: ([{ isIntersecting }]) => {
      if (isIntersecting && isMoreData) {
        dispatch(actions.fetchAllHistory(page));
      }
    },
  });

  // 로그아웃
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
          {isMoreData && (
            <div style={{ width: '100%', height: 100 }} ref={target}>
              <Loader size='s' />
            </div>
          )}
        </Col>
      </Row>
    </>
  );
}
