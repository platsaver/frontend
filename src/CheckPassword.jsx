import React, { useState, useEffect } from 'react';
import { Button, Form, Input, message } from 'antd';
import Admin from './Admin';
import '@ant-design/v5-patch-for-react-19';

const CheckPassword = ({ username, device_id, access_code }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Đặt giá trị mặc định cho form từ props
  useEffect(() => {
    form.setFieldsValue({
      username,
      deviceId: device_id,
      accessCode: access_code,
    });
  }, [form, username, device_id, access_code]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Mã hóa mật khẩu bằng Base64
      const encodedPassword = btoa(unescape(encodeURIComponent(values.password)));

      const response = await fetch('http://localhost:3000/check-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_code: access_code,
          password: encodedPassword,
          device_id: device_id,
        }),
      });

      const data = await response.json();

      if (response.ok && !data.error) {
        message.success('Password verified successfully!');
        setIsVerified(true);
      } else {
        message.error(data.error || 'Password verification failed!');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('An error occurred during verification!');
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    message.error('Please fill in all required fields correctly!');
  };

  if (isVerified) {
    return <Admin username={username} />;
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Form
        form={form}
        name="checkPassword"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item label="Username" name="username">
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password disabled={loading} />
        </Form.Item>

        <Form.Item label="Access Code" name="accessCode">
          <Input disabled />
        </Form.Item>

        <Form.Item label="Device ID" name="deviceId">
          <Input disabled />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Verify Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CheckPassword;