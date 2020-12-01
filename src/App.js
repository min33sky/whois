import React, { useEffect } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Search from './search/container/Search';
import User from './user/container/User';

import 'antd/dist/antd.css'; // antd css
import Login from './auth/container/Login';
import Signup from './auth/container/Signup';
import { useDispatch } from 'react-redux';
import { actions as authActions } from './auth/state';

function App() {
  const dispatch = useDispatch();

  // 메인화면 로딩바 제거
  useEffect(() => {
    const bodyEl = document.querySelector('body');
    const lodingEl = document.querySelector('#init-loading');
    bodyEl.removeChild(lodingEl);
  }, []);

  useEffect(() => {
    dispatch(authActions.fetchUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Route exact path='/' component={Search} />
      <Route path='/user/:name' component={User} />
      <Route path='/login' component={Login} />
      <Route path='/signup' component={Signup} />
    </BrowserRouter>
  );
}

export default App;
