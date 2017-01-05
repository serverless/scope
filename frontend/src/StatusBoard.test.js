import React from 'react';
import ReactDOM from 'react-dom';
import StatusBoard from './StatusBoard';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<StatusBoard />, div);
});
