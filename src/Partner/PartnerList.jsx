import React, { useState, useEffect } from 'react';
import { Divider, Table, Input, Button } from 'antd';
import { FaSearch } from 'react-icons/fa';
import '@fortawesome/fontawesome-free/css/all.min.css';

const App = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        <Input placeholder="Basic usage" />
        <Button type="primary" icon={<FaSearch />} />
        <Button type="primary" icon={<i className="fas fa-plus"></i>} />
      </div>
      <Table style={{paddingTop: 20}}
        dataSource={partners}
        columns={columns}
        rowKey="id"
        bordered
      />
    </div>
  );
};

export default App;