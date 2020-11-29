import { Space, Spin } from 'antd';
import React from 'react';
import useFetchInfo from './../../common/hooks/useFetchInfo';

/**
 * 로딩 컴포넌트
 * @param {object} param
 * @param {string} param.label 라벨
 * @param {string} param.actionType 액션 타입
 * @param {string=} param.fetchKey 패치 요청을 위한 키
 */
export default function FetchLabel({ label, actionType, fetchKey }) {
  const { isSlow } = useFetchInfo(actionType, fetchKey);

  return (
    <Space>
      {label}
      {isSlow && <Spin size='small' />}
    </Space>
  );
}
