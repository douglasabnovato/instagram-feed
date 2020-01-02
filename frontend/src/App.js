import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './global.css';

import Routes from './routes';
import { Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>    
  );
}

export default App;