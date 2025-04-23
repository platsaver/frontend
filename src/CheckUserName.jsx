import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import Cookies from 'js-cookie';
import '@ant-design/v5-patch-for-react-19';

const CheckUsername = ({ onNext }) => {
  const [generatedCode, setGeneratedCode] = useState('Loading...');
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedDeviceID = Cookies.get('deviceID');

    if (storedDeviceID) {
      setGeneratedCode(storedDeviceID);
      form.setFieldsValue({ code: storedDeviceID });
    } else {
      FingerprintJS.load()
        .then((fp) => fp.get())
        .then((result) => {
          const deviceID = result.visitorId;
          setGeneratedCode(deviceID);
          Cookies.set('deviceID', deviceID);
          form.setFieldsValue({ code: deviceID });
        })
        .catch((error) => {
          console.error('Error generating fingerprint:', error);
          setGeneratedCode('Error generating code');
        });
    }
  }, [form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/check-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: values.username }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.exists) {
        message.success('Username exists! Proceeding...');
        onNext(values.username); // Call onNext with username
      } else {
        message.error('Username not found!');
      }
    } catch (error) {
      console.error('API call failed:', error);
      message.error(error.message || 'Failed to check username!');
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    message.error('Please fill in all required fields correctly!');
  };

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
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input disabled={loading} />
        </Form.Item>

        <Form.Item label="Your Device ID" name="code">
          <pre
            style={{
              background: '#f5f5f5',
              padding: '8px',
              borderRadius: '4px',
              margin: 0,
            }}
          >
            {generatedCode}
          </pre>
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CheckUsername;