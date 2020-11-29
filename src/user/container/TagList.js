import { PlusOutlined } from '@ant-design/icons';
import { Input, Tag, message } from 'antd';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../state';

/**
 * 태그 리스트 컴포넌트
 */
export default function TagList() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);
  const tags = user?.tag ? user.tag.split(',').map(item => item.trim()) : [];
  const [isAdd, setIsAdd] = useState(false);
  const [tempTag, setTempTag] = useState('');

  function onDelete(tag) {
    const newTag = tags.filter(item => item !== tag).join(', ');

    dispatch(
      actions.fetchUpdateUser({
        user,
        key: 'tag',
        value: newTag,
        fetchKey: 'tag',
      }),
    );
  }

  function onAdd() {
    setIsAdd(true);
    setTempTag('');
  }

  function onSave() {
    if (!tempTag) {
      setIsAdd(false);
    } else if (tags.includes(tempTag)) {
      message.error('이미 같은 태그가 있습니다.');
    } else {
      const newTag = user?.tag ? `${user.tag}, ${tempTag}` : tempTag;

      dispatch(
        actions.fetchUpdateUser({
          user,
          key: 'tag',
          value: newTag,
          fetchKey: 'tag',
        }),
      );

      setIsAdd(false);
    }
  }

  return (
    <>
      {tags.map(item => (
        <Tag key={item} closable onClose={() => onDelete(item)}>
          {item}
        </Tag>
      ))}

      {!isAdd && (
        <Tag onClick={onAdd}>
          <PlusOutlined /> New Tag
        </Tag>
      )}

      {isAdd && (
        <Input
          type='text'
          size='small'
          value={tempTag}
          style={{ width: 100 }}
          onChange={e => setTempTag(e.target.value)}
          onBlur={() => setIsAdd(false)}
          onPressEnter={onSave}
          autoFocus
        />
      )}
    </>
  );
}
