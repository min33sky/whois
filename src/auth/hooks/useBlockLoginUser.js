import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { AuthStatus } from './../../common/constant';

/**
 * 로그인 유저 접근 금지 Hook
 */
export default function useBlockLoginUser() {
  const history = useHistory();
  const status = useSelector(state => state.auth.status);

  useEffect(() => {
    if (status === AuthStatus.Login) {
      history.replace('/');
    }
  }, [history, status]);
}
