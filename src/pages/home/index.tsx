import { useState } from 'react';
import { Layout, theme } from 'antd';
import NaviLeft from '../../components/naviLeft';
import MyBreadCrumb from '../../components/breadCrumb';
import MyHeader from '../../components/header';
import { Outlet } from 'react-router-dom';
const { Header, Content, Footer, Sider } = Layout;
function Home() {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return <>
        <div>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                    <NaviLeft />
                </Sider>
                <Layout>
                    <Header style={{ paddingRight: '20px', background: colorBgContainer, textAlign: 'right' }} >
                        <MyHeader />
                    </Header>
                    <Content style={{ margin: '0 16px', height: "90vh", overflowY: "auto", overflowX: "hidden" }}>
                        <MyBreadCrumb />
                        <Outlet />
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        Ant Design ©{new Date().getFullYear()} Created by Ant UED
                    </Footer>
                </Layout>
            </Layout></div>
    </>
}

export default Home