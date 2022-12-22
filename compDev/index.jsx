import React from 'react';
import ReactDom from 'react-dom/client';
import VirtualList from '../virtualList';

document.addEventListener('DOMContentLoaded', function () {
  if (!window.helper.root) {
    window.helper.root = ReactDom.createRoot(document.getElementById('root'));
    window.helper.root.render(<VirtualList />);
  }
});
