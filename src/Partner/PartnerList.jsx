import React, { useState, useEffect } from 'react';
import { Divider, Table, Input, Button, Drawer, Form, Input as AntInput, message } from 'antd';
import { FaSearch } from 'react-icons/fa';
import '@fortawesome/fontawesome-free/css/all.min.css';

const App = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false); // State for drawer visibility
  const [form] = Form.useForm(); // Form instance for managing form state

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch('http://localhost:3000/partners');
        if (!response.ok) {
          throw new Error('Không thể lấy danh sách đối tác');
        }
        const data = await response.json();
        setPartners(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  // Open drawer
  const showDrawer = () => {
    setOpen(true);
  };

  // Close drawer
  const onClose = () => {
    setOpen(false);
    form.resetFields(); // Reset form fields when closing
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      const response = await fetch('http://localhost:3000/partners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Không thể tạo đối tác');
      }

      const newPartner = await response.json();
      setPartners([...partners, newPartner]); // Add new partner to state
      message.success('Thêm đối tác thành công');
      onClose(); // Close drawer after success
    } catch (err) {
      message.error(`Lỗi: ${err.message}`);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '20px' }}>Đang tải...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', marginTop: '20px', color: 'red' }}>Lỗi: {error}</div>;
  }

  const columns = [
    {
      title: 'Đối tác',
      dataIndex: 'id',
      key: 'id',
      render: (text, record) => <span>{record.ten}</span>,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'diachi',
      key: 'diachi',
    },
    {
      title: 'SĐT',
      dataIndex: 'sodienthoai',
      key: 'sodienthoai',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (text, record) => (
        <span style={{ display: 'flex', gap: '10px' }}>
          <Button type="primary" danger icon={<i className="fas fa-trash"></i>} />
          <Button type="default" icon={<i className="fas fa-pen"></i>} />
        </span>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Danh sách đối tác</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Input placeholder="Tìm kiếm" />
        <Button type="primary" icon={<FaSearch />} />
        <Button type="primary" icon={<i className="fas fa-plus"></i>} onClick={showDrawer} />
      </div>
      <Table
        style={{ paddingTop: 20 }}
        dataSource={partners}
        columns={columns}
        rowKey="id"
        bordered
      />
      <Drawer
        title="Thêm đối tác mới"
        placement="right"
        width={400}
        onClose={onClose}
        open={open}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ ten: '', diachi: '', sodienthoai: '' }}
        >
          <Form.Item
            name="ten"
            label="Tên đối tác"
            rules={[{ required: true, message: 'Vui lòng nhập tên đối tác' }]}
          >
            <AntInput placeholder="Nhập tên đối tác" />
          </Form.Item>
          <Form.Item
            name="diachi"
            label="Địa chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
          >
            <AntInput placeholder="Nhập địa chỉ" />
          </Form.Item>
          <Form.Item
            name="sodienthoai"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' },
            ]}
          >
            <AntInput placeholder="Nhập số điện thoại" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              Thêm
            </Button>
            <Button onClick={onClose}>Hủy</Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default App;