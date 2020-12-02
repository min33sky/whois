import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { AuthStatus } from './../constant';

/**
 * 로그인이 필요한 컴포넌트 체크 Hook
 */
export default function useNeedLogin() {
  const history = useHistory();
  const status = useSelector(state => state.auth.status);

  useEffect(() => {
    if (status === AuthStatus.NotLogin) {
      history.replace('/login');
    }
  }, [history, status]);
}
