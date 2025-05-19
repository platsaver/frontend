import React, { useState, useEffect } from 'react';
import { Divider, Table, Input, Button, Drawer, Form, Input as AntInput, message } from 'antd';
import { FaSearch } from 'react-icons/fa';
import '@fortawesome/fontawesome-free/css/all.min.css';

const App = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false); // State for add drawer visibility
  const [openEditDrawer, setOpenEditDrawer] = useState(false); // State for edit drawer visibility
  const [openDeleteDrawer, setOpenDeleteDrawer] = useState(false); // State for delete drawer visibility
  const [form] = Form.useForm(); // Form instance for adding
  const [editForm] = Form.useForm(); // Form instance for editing
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [partnerToDelete, setPartnerToDelete] = useState(null); // State for partner to delete

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

  // Open add drawer
  const showDrawer = () => {
    setOpen(true);
  };

  // Close add drawer
  const onClose = () => {
    setOpen(false);
    form.resetFields();
  };

  // Open edit drawer
  const showEditDrawer = (partner) => {
    setSelectedPartner(partner);
    editForm.setFieldsValue({
      ten: partner.ten,
      diachi: partner.diachi,
      sodienthoai: partner.sodienthoai,
    });
    setOpenEditDrawer(true);
  };

  // Close edit drawer
  const onCloseEdit = () => {
    setOpenEditDrawer(false);
    setSelectedPartner(null);
    editForm.resetFields();
  };

  // Open delete confirmation drawer
  const showDeleteDrawer = (partner) => {
    setPartnerToDelete(partner);
    setOpenDeleteDrawer(true);
  };

  // Close delete confirmation drawer
  const onCloseDelete = () => {
    setOpenDeleteDrawer(false);
    setPartnerToDelete(null);
  };

  // Handle delete action
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/partners/${partnerToDelete.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Không thể xóa đối tác');
      }

      setPartners(partners.filter(p => p.id !== partnerToDelete.id));
      message.success('Xóa đối tác thành công');
      onCloseDelete();
    } catch (err) {
      message.error(`Lỗi: ${err.message}`);
    }
  };

  // Handle edit form submission
  const handleEditSubmit = async (values) => {
    try {
      const response = await fetch(`http://localhost:3000/partners/${selectedPartner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(response.status === 404 ? 'Đối tác không tồn tại' : 'Không thể cập nhật đối tác');
      }

      const updatedPartner = await response.json();
      setPartners(partners.map(p => (p.id === updatedPartner.id ? updatedPartner : p)));
      message.success('Cập nhật đối tác thành công');
      onCloseEdit();
    } catch (err) {
      message.error(`Lỗi: ${err.message}`);
    }
  };

  // Handle add form submission
  const handleSubmit = async (values) => {
    try {
      const response = await fetch('http://localhost:3000/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Không thể tạo đối tác');
      }

      const newPartner = await response.json();
      setPartners([...partners, newPartner]);
      message.success('Thêm đối tác thành công');
      onClose();
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
          <Button
            type="primary"
            danger
            icon={<i className="fas fa-trash"></i>}
            onClick={() => showDeleteDrawer(record)}
          />
          <Button
            type="default"
            icon={<i className="fas fa-pen"></i>}
            onClick={() => showEditDrawer(record)}
          />
        </span>
      ),
    },
  ];

  return (
    <div >
      <h1 style={{fontSize: '40px'}}>Danh sách đối tác</h1>
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
      {/* Add Partner Drawer */}
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
      {/* Edit Partner Drawer */}
      <Drawer
        title="Chỉnh sửa đối tác"
        placement="right"
        width={400}
        onClose={onCloseEdit}
        open={openEditDrawer}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditSubmit}
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
              Cập nhật
            </Button>
            <Button onClick={onCloseEdit}>Hủy</Button>
          </Form.Item>
        </Form>
      </Drawer>
      {/* Delete Confirmation Drawer */}
      <Drawer
        title="Xác nhận xóa đối tác"
        placement="right"
        width={400}
        onClose={onCloseDelete}
        open={openDeleteDrawer}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <p>Bạn có chắc chắn muốn xóa đối tác <strong>{partnerToDelete?.ten}</strong> không?</p>
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <Button
            type="primary"
            danger
            onClick={handleDelete}
            style={{ marginRight: 8 }}
          >
            Xóa
          </Button>
          <Button onClick={onCloseDelete}>Hủy</Button>
        </div>
      </Drawer>
    </div>
  );
};

export default App;