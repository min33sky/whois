import { Button, Dropdown, Menu } from 'antd';
import React from 'react';
import { SettingFilled } from '@ant-design/icons';

/**
 * @param {object} param
 * @param {() => void} param.logout 로그아웃 함수
 */
export default function Setting({ logout }) {
  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item onClick={logout}>로그아웃</Menu.Item>
        </Menu>
      }
      trigger={['click']}
      placement='bottomRight'
    >
      <Button shape='circle' icon={<SettingFilled />} />
    </Dropdown>
  );
}
