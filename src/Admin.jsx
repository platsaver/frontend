import React, { useState } from 'react';
import {
  TeamOutlined,
  CheckSquareOutlined,
  BarsOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, Button, message, Card, ConfigProvider, Input } from 'antd';
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
    getItem('Nhân sự', '4'),
  ]),
  getItem('Tiêu chuẩn', 'sub2', <CheckSquareOutlined />, [
    getItem('Bộ tiêu chuẩn', '5'),
    getItem('Bộ chỉ số', '6'),
  ]),
  getItem('Vận hành', 'sub3', <BarsOutlined />, [
    getItem('Hoạt động vật chất', '7'),
    getItem('Sự kiện', '8'),
    getItem('Báo cáo', '9'),
  ]),
];

const Admin = ({ username, onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('3');

  const handleLogoutClick = () => {
    onLogout();
    message.success('Đã đăng xuất thành công');
  };

  const breadcrumbItems = [
    { title: 'Home' },
    { title: selectedKey === '3' ? 'Danh sách đối tác' : 'Nhân sự' },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0000FF',
          colorBgContainer: '#ffffff',
          colorText: '#1f1f1f',
          borderRadius: 12,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontSize: 16,
          colorBgLayout: '#f8f9fa',
        },
        components: {
          Layout: {
            siderBg: '#ffffff', // White sidebar
            headerBg: 'rgba(255, 255, 255, 0.1)',
          },
          Menu: {
            itemHoverBg: '#40a9ff', // Lighter blue for hover
            itemSelectedBg: '#0000FF',
            itemSelectedColor: '#ffffff',
            itemColor: '#595959', // Darker gray for unselected items
            itemMargin: '0 12px',
            fontSize: 16,
            iconSize: 20,
          },
          Card: {
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1), 0 2px 6px rgba(0, 0, 0, 0.05)',
          },
          Input: {
            borderRadius: 20,
          },
          Button: {
            borderRadius: 8,
          },
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          breakpoint="lg"
          collapsedWidth={80}
          width={240}
          style={{
            background: '#ffffff',
            boxShadow: '2px 0 10px rgba(0, 0, 0, 0.05)', // Softer shadow
            transition: 'all 0.3s ease',
            borderRight: '1px solid #e8e8e8', // Subtle border
          }}
        >
          <div
            style={{
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              padding: '0 16px',
              background: '#ffffff',
              color: '#1f1f1f',
              fontSize: collapsed ? 0 : 20,
              fontWeight: 600,
              transition: 'all 0.3s ease',
              borderBottom: '1px solid #e8e8e8',
            }}
          >
            {collapsed ? <TeamOutlined style={{ fontSize: 28, color: '#0000FF' }} /> : 'Soft UI Dashboard'}
          </div>
          <Menu
            theme="light" // Changed to light theme
            mode="inline"
            defaultSelectedKeys={['3']}
            items={items}
            onClick={(e) => setSelectedKey(e.key)}
            style={{
              borderRight: 'none',
              padding: '12px 0',
              transition: 'all 0.3s ease',
            }}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: '0 24px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: 64,
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Breadcrumb
              style={{ margin: '16px 0', color: '#d1d4dc' }}
              items={breadcrumbItems}
            />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Input
                placeholder="Tìm kiếm..."
                prefix={<SearchOutlined style={{ color: '#d1d4dc' }} />}
                style={{
                  width: 200,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: '#1f1f1f',
                  marginRight: 16,
                }}
              />
              <span style={{ marginRight: 16, color: '#d1d4dc', fontSize: 16 }}>
                Xin chào, {username}
              </span>
              <Button
                type="primary"
                onClick={handleLogoutClick}
                style={{ backgroundColor: '#4caf50', borderColor: '#4caf50' }}
              >
                Đăng xuất
              </Button>
            </div>
          </Header>
          <Content style={{ margin: '24px 16px 0' }}>
            <Card
              style={{
                minHeight: 360,
                borderRadius: 12,
                transition: 'all 0.3s ease',
                overflow: 'hidden',
                padding: 24,
              }}
              hoverable
            >
              {selectedKey === '3' && <PartnerList />}
              {selectedKey === '4' && <PartnerEmployee />}
            </Card>
          </Content>
          <Footer style={{ textAlign: 'center', color: '#adb5bd', padding: '16px 0' }}>
            Soft UI Dashboard ©{new Date().getFullYear()} Created by Creative Tim
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default Admin;