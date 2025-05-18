import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Drawer, Form, Input as AntInput, Select, message } from 'antd';
import { FaSearch } from 'react-icons/fa';
import '@fortawesome/fontawesome-free/css/all.min.css';

const { Option } = Select;

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [openEditDrawer, setOpenEditDrawer] = useState(false);
  const [openDeleteDrawer, setOpenDeleteDrawer] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const partnersResponse = await fetch('http://localhost:3000/partners');
        const employeesResponse = await fetch('http://localhost:3000/employees');
        
        if (!partnersResponse.ok || !employeesResponse.ok) {
          throw new Error('Không thể lấy dữ liệu');
        }

        const partnersData = await partnersResponse.json();
        const employeesData = await employeesResponse.json();
        
        setPartners(partnersData);
        setEmployees(employeesData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const showDrawer = () => setOpen(true);
  const onClose = () => {
    setOpen(false);
    form.resetFields();
  };

  const showEditDrawer = (employee) => {
    setSelectedEmployee(employee);
    editForm.setFieldsValue({
      ten: employee.ten,
      diachi: employee.diachi,
      sodienthoai: employee.sodienthoai,
      partnerId: employee.partnerId,
    });
    setOpenEditDrawer(true);
  };

  const onCloseEdit = () => {
    setOpenEditDrawer(false);
    setSelectedEmployee(null);
    editForm.resetFields();
  };

  const showDeleteDrawer = (employee) => {
    setEmployeeToDelete(employee);
    setOpenDeleteDrawer(true);
  };

  const onCloseDelete = () => {
    setOpenDeleteDrawer(false);
    setEmployeeToDelete(null);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/employees/${employeeToDelete.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Không thể xóa nhân sự');

      setEmployees(employees.filter(e => e.id !== employeeToDelete.id));
      message.success('Xóa nhân sự thành công');
      onCloseDelete();
    } catch (err) {
      message.error(`Lỗi: ${err.message}`);
    }
  };

  const handleEditSubmit = async (values) => {
    try {
      const response = await fetch(`http://localhost:3000/employees/${selectedEmployee.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Không thể cập nhật nhân sự');

      const updatedEmployee = await response.json();
      setEmployees(employees.map(e => (e.id === updatedEmployee.id ? updatedEmployee : e)));
      message.success('Cập nhật nhân sự thành công');
      onCloseEdit();
    } catch (err) {
      message.error(`Lỗi: ${err.message}`);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const response = await fetch('http://localhost:3000/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Không thể tạo nhân sự');

      const newEmployee = await response.json();
      setEmployees([...employees, newEmployee]);
      message.success('Thêm nhân sự thành công');
      onClose();
    } catch (err) {
      message.error(`Lỗi: ${err.message}`);
    }
  };

  const columns = [
    {
      title: 'Nhân sự',
      dataIndex: 'ten',
      key: 'ten',
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
        title: 'Đối tác',
        dataIndex: 'tendoitac',
        key: 'tendoitac',
        render: (tendoitac) => tendoitac || 'Không xác định',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <span style={{ display: 'flex', gap: '10px' }}>
          <Button type="primary" danger icon={<i className="fas fa-trash"></i>} onClick={() => showDeleteDrawer(record)} />
          <Button type="default" icon={<i className="fas fa-pen"></i>} onClick={() => showEditDrawer(record)} />
        </span>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Danh sách nhân sự</h1>
      <Table dataSource={employees} columns={columns} rowKey="id" bordered />
      {/* Drawer forms for add/edit/delete go here */}
    </div>
  );
};

export default EmployeeManagement;
