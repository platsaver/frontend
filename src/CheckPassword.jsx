import React, { useState, useEffect } from 'react';
import { Button, Form, Input, message, Spin } from 'antd';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import ReCAPTCHA from 'react-google-recaptcha';
import Admin from './Admin';
import '@ant-design/v5-patch-for-react-19';

const CheckPassword = ({ username }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [deviceId, setDeviceId] = useState('Loading...');
  const [accessCode, setAccessCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [captchaLoading, setCaptchaLoading] = useState(true);

  useEffect(() => {
    const newAccessCode = uuidv4();
    setAccessCode(newAccessCode);

    const storedDeviceId = Cookies.get('deviceID');
    const deviceIdToUse = storedDeviceId || 'Generating...';

    setDeviceId(deviceIdToUse);

    form.setFieldsValue({
      username,
      accessCode: newAccessCode,
      deviceId: deviceIdToUse,
    });

    if (!storedDeviceId) {
      FingerprintJS.load()
        .then((fp) => fp.get())
        .then((result) => {
          const newDeviceId = result.visitorId;
          setDeviceId(newDeviceId);
          Cookies.set('deviceID', newDeviceId);
          form.setFieldsValue({ deviceId: newDeviceId });
        })
        .catch(console.error);
    }

    // Store access code with username
    fetch('http://localhost:3000/store-access-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessCode: newAccessCode, username }), // Add username
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.success) {
          message.error('Failed to store access code');
        }
      })
      .catch((error) => {
        console.error('Error storing access code:', error);
        message.error('Error storing access code');
      });

    setTimeout(() => {
      setCaptchaLoading(false);
    }, 1000);
  }, [form, username]);

  const onFinish = async (values) => {
    if (!captchaValue) {
      message.error('Please complete the CAPTCHA verification!');
      return;
    }

    setLoading(true);
    try {
      // Verify access code with username
      const accessCodeResponse = await fetch('http://localhost:3000/verify-access-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessCode: values.accessCode, username: values.username }), // Add username
      });

      const accessCodeData = await accessCodeResponse.json();

      if (!accessCodeResponse.ok || !accessCodeData.success) {
        message.error('Invalid or expired access code');
        if (window.grecaptcha) {
          window.grecaptcha.reset();
        }
        setCaptchaValue(null);
        setLoading(false);
        return;
      }

      // Proceed with password verification
      const encodedPassword = btoa(unescape(encodeURIComponent(values.password)));

      const response = await fetch('http://localhost:3000/api/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username,
          password: encodedPassword,
          deviceId: values.deviceId,
          captchaToken: captchaValue,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        message.success('Password verified successfully!');
        setIsVerified(true);
      } else {
        message.error(data.error || 'Password verification failed!');
        if (window.grecaptcha) {
          window.grecaptcha.reset();
        }
        setCaptchaValue(null);
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('An error occurred during verification!');
      if (window.grecaptcha) {
        window.grecaptcha.reset();
      }
      setCaptchaValue(null);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    message.error('Please fill in all required fields correctly!');
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
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

        <Form.Item
          label="CAPTCHA Verification"
          name="captcha"
        >
          {captchaLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Spin tip="Loading CAPTCHA..." />
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ReCAPTCHA
                sitekey="6LefviArAAAAANU6bdGzJNy-SjJZ-zPTFuna2uOa"
                onChange={handleCaptchaChange}
                onExpired={() => setCaptchaValue(null)}
              />
            </div>
          )}
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            disabled={!captchaValue}
          >
            Verify Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CheckPassword;