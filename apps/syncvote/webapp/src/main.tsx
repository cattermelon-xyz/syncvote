import '@/style/index.scss';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from '@redux/store';
import AppRoutes from '@routing';
import { ConfigProvider } from 'antd';
import { MetaMaskProvider } from '@metamask/sdk-react';

console.log(window.location.host);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    {/* <React.StrictMode> */}
    <MetaMaskProvider
      debug={false}
      sdkOptions={{
        checkInstallationImmediately: false,
        dappMetadata: {
          name: 'Syncvote',
          url: 'https://' + window.location.host,
        },
      }}
    >
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
    </MetaMaskProvider>
    {/* </React.StrictMode> */}
  </Provider>
);
