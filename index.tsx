import React from 'react';
import ReactDOM from 'react-dom/client';

// i18n 설정 파일을 불러와 앱 전체에 적용합니다.
import './i18n.config';

import App from './App';
import { LanguageProvider } from './contexts/LanguageContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);