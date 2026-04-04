import { createRoot } from 'react-dom/client';
import './index.scss';
import App from './App.tsx';
import "./mock";
import { Provider } from 'react-redux';
import { store } from './store';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <ConfigProvider locale={zhCN}>
            <App />
        </ConfigProvider>
    </Provider>

)
