import React from 'react';
import Search from './search/container/Search';

import 'antd/dist/antd.css'; // antd css
import { BrowserRouter, Route } from 'react-router-dom';
import User from './user/container/User';

function App() {
  return (
    <BrowserRouter>
      <Route exact path='/' component={Search} />
      <Route path='/user/:name' component={User} />
    </BrowserRouter>
  );
}

export default App;
