import { Col, Descriptions, PageHeader, Row, Space, Spin, Typography } from 'antd';
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
 */
export default function User({ match }) {
  const history = useHistory();
  const dispatch = useDispatch();

  const user = useSelector(state => state.user.user);
  const name = match.params.name;

  useEffect(() => {
    dispatch(actions.fetchUser(name));
  }, [dispatch, name]);

  // const { isFetched, isSlow } = useFetchInfo(Types.FetchUser, name);
  const { isFetched } = useFetchInfo(Types.FetchUser);

  return (
    <Row justify='center'>
      <Col xs={24} md={20} lg={14}>
        <PageHeader
          onBack={history.goBack}
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
              <Descriptions.Item label='수정내역이 들어갈 곳'>
                <History />
              </Descriptions.Item>
            </Descriptions>
          )}

          {!user && isFetched && <Typography.Text>존재하지 않는 사용자 입니다.</Typography.Text>}
        </PageHeader>
      </Col>
    </Row>
  );
}
