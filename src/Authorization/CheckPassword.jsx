import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, Input, message } from 'antd';
import Admin from '../Admin';
import ReCAPTCHA from 'react-google-recaptcha';
import { Row, Col } from 'react-bootstrap';
import '@ant-design/v5-patch-for-react-19';

const CheckPassword = ({ username, device_id, access_code, onLoginSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const captchaRef = useRef(null);

  useEffect(() => {
    form.setFieldsValue({
      username,
      deviceId: device_id,
      accessCode: access_code,
    });
  }, [form, username, device_id, access_code]);

  const handleCaptchaVerify = (token) => {
    setCaptchaToken(token);
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const encodedPassword = btoa(unescape(encodeURIComponent(values.password)));

      const response = await fetch('http://localhost:3000/check-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_code: access_code,
          password: encodedPassword,
          device_id: device_id,
          captchaToken: captchaToken
        }),
      });

      const data = await response.json();

      if (response.ok && !data.error) {
        message.success('Password verified successfully!');
        // Lưu token vào localStorage
        localStorage.setItem('token', data.token);
        // Gọi onLoginSuccess để cập nhật trạng thái đăng nhập
        onLoginSuccess({ user_id: data.user_id, username });
        setIsVerified(true);
      } else {
        message.error(data.error || 'Password verification failed!');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('An error occurred during verification!');
    } finally {
      setLoading(false);
      setCaptchaToken(null);
      if (captchaRef.current) captchaRef.current.reset();
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

        <Form.Item label="CAPTCHA">
          <Row className="align-items-center">
            <Col xs={12} sm={16} className="d-flex justify-content-start">
              <ReCAPTCHA
                ref={captchaRef}
                sitekey="6LfRUTkrAAAAAFgrIFEm78EfmKAOdqg46IVZoB0x"
                onChange={handleCaptchaVerify}
              />
            </Col>
          </Row>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" loading={loading} disabled={!captchaToken}>
            Verify Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CheckPassword;