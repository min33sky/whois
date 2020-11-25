import React, { useEffect } from 'react';
import Search from './search/container/Search';

import 'antd/dist/antd.css'; // antd css
import { BrowserRouter, Route } from 'react-router-dom';
import User from './user/container/User';

function App() {
  // 메인화면 로딩바 제거
  useEffect(() => {
    const bodyEl = document.querySelector('body');
    const lodingEl = document.querySelector('#init-loading');
    bodyEl.removeChild(lodingEl);
  }, []);

  return (
    <BrowserRouter>
      <Route exact path='/' component={Search} />
      <Route path='/user/:name' component={User} />
    </BrowserRouter>
  );
}

export default App;
