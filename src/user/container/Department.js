import { Button, Input } from 'antd';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../state';

/**
 * 소속 컴포넌트
 */
export default function Department() {
  const [isEditDepartment, setIsEditDepartment] = useState(false);
  const [tempDepartment, setTempDepartment] = useState('');

  const user = useSelector(state => state.user.user);

  const dispatch = useDispatch();

  function onSaveDepartment() {
    dispatch(
      actions.fetchUpdateUser({
        user,
        key: 'department',
        value: tempDepartment,
        fetchKey: 'department',
      }),
    );
    setIsEditDepartment(false);
  }

  function onEditDepartment() {
    setIsEditDepartment(true);
    setTempDepartment(user.department);
  }

  return (
    <>
      {isEditDepartment && (
        <Input
          value={tempDepartment}
          onChange={e => setTempDepartment(e.target.value)}
          onPressEnter={onSaveDepartment}
          onBlur={() => setIsEditDepartment(false)}
          style={{ width: '100%' }}
          autoFocus
          // ref={(ref) => ref && ref.focus()}를 antd에서 autoFocus로 지원
        />
      )}

      {!isEditDepartment && (
        <Button
          type='text'
          block
          onClick={onEditDepartment}
          style={{ textAlign: 'left', padding: 0 }}
        >
          {user.department}
        </Button>
      )}
    </>
  );
}
