import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  AreaChartOutlined,
} from '@ant-design/icons';
import ListPost from './ListPost.jsx'; 
import Button1 from './Button1.jsx';
import Button2 from './Button2.jsx';
import Button3 from './Button3.jsx';
import Statistic from './statistic.jsx';
import User from './User.jsx';
import SearchForm from './SearchForm.jsx';
import { Button, Layout, Menu, theme, Row, Col } from 'antd';
import '@ant-design/v5-patch-for-react-19';
const { Header, Sider, Content } = Layout;

const App = ({ onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedTab, setSelectedTab] = useState('1'); // State để theo dõi tab được chọn
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Xử lý khi breakpoint được kích hoạt
  const handleBreakpoint = (broken) => {
    setCollapsed(broken); // Tự động collapse khi màn hình nhỏ hơn breakpoint
  };

  // Hàm xử lý khi click vào menu item
  const handleMenuClick = (e) => {
    setSelectedTab(e.key);
  };

  // Render nội dung tương ứng với tab được chọn
  const renderContent = () => {
    switch (selectedTab) {
      case '1': // Quản lý bài viết
        return (
          <>
            <Row justify="space-between" style={{ marginBottom: 16 }}>
              <Col>
                <Button1 />
                <Button2 />
                <Button3 />
              </Col>
              <Col>
                <SearchForm />
              </Col>
            </Row>
            <ListPost />
          </>
        );
      case '2': // Thống kê
        return <Statistic />;
      case '3': // Quản lý người dùng
        return <User />;
      default:
        return <div>Content</div>;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg" // Collapse khi màn hình < 992px
        collapsedWidth="0" // Ẩn hoàn toàn khi collapsed
        onBreakpoint={handleBreakpoint} // Gọi hàm khi breakpoint thay đổi
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ height: '150vh' }} // Loại bỏ position: sticky nếu không cần
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          selectedKeys={[selectedTab]}
          onClick={handleMenuClick}
          items={[
            { key: '1', icon: <UserOutlined />, label: 'Quản lý bài viết' },
            { key: '2', icon: <AreaChartOutlined />, label: 'Thống kê' },
            { key: '3', icon: <UserOutlined />, label: 'Quản lý người dùng' },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;