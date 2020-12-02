import { Col, Descriptions, PageHeader, Row, Typography } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import History from '../../common/components/History';
import FetchLabel from '../components/FetchLabel';
import { actions } from '../state';
import useFetchInfo from './../../common/hooks/useFetchInfo';
import { Types } from './../state/index';
import Department from './Department';
import TagList from './TagList';

/**
 * 유저 정보 페이지
 * @param {object} param
 * @param {import('react-router-dom').match} param.match match
 */ import useNeedLogin from './../../common/hooks/useNeedLogin';
import { AuthStatus } from './../../common/constant';

export default function User({ match }) {
  useNeedLogin();

  const history = useHistory();
  const dispatch = useDispatch();

  const user = useSelector(state => state.user.user);
  const name = match.params.name; // 검색할 유저 이름

  // 로그인 유저일 경우 수정 내역을 불러온다.
  const authStatus = useSelector(state => state.auth.status);
  const userHistory = useSelector(state => state.user.userHistory);

  useEffect(() => {
    if (authStatus === AuthStatus.Login) {
      dispatch(actions.fetchUserHistory(name));
      dispatch(actions.fetchUser(name));
    }
  }, [dispatch, name, authStatus]);

  useEffect(() => {
    return () => dispatch(actions.initilize());
  }, [dispatch]);

  // 데이터가 패치되었는지 유무
  const { isFetched } = useFetchInfo(Types.FetchUser);

  return (
    <Row justify='center'>
      <Col xs={24} md={20} lg={14}>
        <PageHeader
          // ? history.goBack을 써도 되지만 이전 주소가 아닌 메인으로 라우팅하는 것을 의도함
          onBack={() => history.push('/')}
          title={<FetchLabel label='사용자 정보' actionType={Types.FetchUser} />}
        >
          {user && (
            <Descriptions layout='vertical' column={1} bordered>
              <Descriptions.Item label='이름'>
                <Typography.Text>{user.name}</Typography.Text>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <FetchLabel
                    label='부서'
                    actionType={Types.FetchUpdateUser}
                    fetchKey='department'
                  />
                }
              >
                <Department />
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <FetchLabel label='태그' actionType={Types.FetchUpdateUser} fetchKey='tag' />
                }
              >
                <TagList />
              </Descriptions.Item>

              <Descriptions.Item label='수정내역'>
                <History items={userHistory} />
              </Descriptions.Item>
            </Descriptions>
          )}

          {!user && isFetched && <Typography.Text>존재하지 않는 사용자 입니다.</Typography.Text>}
        </PageHeader>
      </Col>
    </Row>
  );
}
