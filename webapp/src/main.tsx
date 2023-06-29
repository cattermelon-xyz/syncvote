import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/css/index.css';
import { Provider } from 'react-redux';
import { store } from '@redux/store';
import AppRoutes from '@routing/AppRoutes';
import { ConfigProvider } from 'antd';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    {/* <React.StrictMode> */}
    <ConfigProvider
     theme={{
        token: {
          colorPrimary: '#5D23BB',
          colorLink: '#5D23BB',
          colorSuccessBg: '#EAF6EE',
          colorSuccessText: '#29A259',
        },
      }}
    >
      <AppRoutes />  
    </ConfigProvider>
    {/* </React.StrictMode> */}
  </Provider>,
);
