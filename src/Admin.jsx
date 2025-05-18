import React, { useState } from 'react';
import {
  TeamOutlined,
  CheckSquareOutlined,
  BarsOutlined
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Button, message } from 'antd';
import PartnerList from './Partner/PartnerList.jsx';
import PartnerEmployee from './Partner/PartnerEmployee.jsx';

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem('Đối tác', 'sub1', <TeamOutlined />, [
    getItem('Danh sách', '3'),
    getItem('Nhân sự', '4')
  ]),
  getItem('Tiêu chuẩn', 'sub2', <CheckSquareOutlined />, [
    getItem('Bộ tiêu chuẩn', '5'),
    getItem('Bộ chỉ số', '6')
  ]),
  getItem('Vận hành', 'sub3', <BarsOutlined />, [
    getItem('Hoạt động vật chất', '7'),
    getItem('Sự kiện', '8'),
    getItem('Báo cáo', '9')
  ]),
];

const Admin = ({ username, onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('3'); // Giá trị mặc định

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogoutClick = () => {
    onLogout();
    message.success('Logged out successfully');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        breakpoint="lg"
      >
        <div
          style={{
            height: '32px',
            margin: '16px',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          Ant Design 
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={['3']}
          mode="inline"
          items={items}
          onClick={(e) => setSelectedKey(e.key)}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 16px',
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '16px' }}>
              Welcome, {username}
            </span>
            <Button type="primary" onClick={handleLogoutClick}>
              Đăng xuất
            </Button>
          </div>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {selectedKey === '3' && <PartnerList />} 
            {selectedKey === '4' && <PartnerEmployee />} 
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Admin;
