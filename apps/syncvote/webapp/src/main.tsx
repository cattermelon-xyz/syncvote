import '@/style/index.scss';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from '@redux/store';
import AppRoutes from '@routing';
import { ConfigProvider } from 'antd';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#5D23BB',
          colorLink: '#5D23BB',
          colorSuccessBg: '#EAF6EE',
          colorSuccessText: '#29A259',
          colorTextDisabled: '#BDA5E3',
          colorBgContainerDisabled: '#F4F0FA',
        },
      }}
    >
      <AppRoutes />
    </ConfigProvider>
  </Provider>
);
