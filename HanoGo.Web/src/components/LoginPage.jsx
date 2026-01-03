import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Card, Typography, message, Alert } from 'antd';
import { UserOutlined, LockOutlined, HomeOutlined } from '@ant-design/icons'; // Đã xóa IdcardOutlined

const { Title, Text } = Typography;

const LoginPage = ({ onLoginSuccess, onCancel }) => {
    // State để kiểm soát đang ở chế độ Đăng nhập hay Đăng ký
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [form] = Form.useForm();

    // SỬA 1: Dùng Port 5163 (HTTP) để tránh lỗi SSL/Connection Refused
    // Đây là port có trong launchSettings.json profile "http"
    const API_URL = 'http://localhost:5163/api/auth';

    const onFinish = async (values) => {
        setLoading(true);
        setErrorMsg('');

        try {
            if (isRegisterMode) {
                // --- LOGIC ĐĂNG KÝ ---
                if (values.password !== values.confirmPassword) {
                    setErrorMsg("Mật khẩu xác nhận không khớp!");
                    setLoading(false);
                    return;
                }

                // SỬA 2: Xóa fullName và tự sinh email
                const registerPayload = {
                    username: values.username,
                    password: values.password,
                    // Database bắt buộc có Email, tự sinh nếu form không nhập
                    email: `${values.username}@gmail.com`
                };

                // Gọi API Register
                await axios.post(`${API_URL}/register`, registerPayload);

                message.success("Đăng ký thành công! Hãy đăng nhập.");
                setIsRegisterMode(false);
                form.resetFields();
            } else {
                // --- LOGIC ĐĂNG NHẬP ---
                // Gọi API Login
                const response = await axios.post(`${API_URL}/login`, values);
                const userData = response.data;

                localStorage.setItem('currentUser', JSON.stringify(userData));
                message.success("Đăng nhập thành công!");
                onLoginSuccess(userData);
            }
        } catch (error) {
            console.error(error);
            // Xử lý thông báo lỗi chi tiết từ Backend gửi về
            if (isRegisterMode) {
                const serverMsg = error.response?.data || "Đăng ký thất bại.";
                // Nếu server trả về object lỗi (ít gặp với string return), convert sang string
                setErrorMsg(typeof serverMsg === 'string' ? serverMsg : JSON.stringify(serverMsg));
            } else {
                setErrorMsg("Sai tài khoản hoặc mật khẩu, hoặc server chưa chạy!");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            height: '100vh', background: '#f0f2f5',
            backgroundImage: 'url("https://wallpaperaccess.com/full/1397732.jpg")',
            backgroundSize: 'cover'
        }}>
            <Card style={{ width: 420, borderRadius: 15, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', padding: '20px' }}>
                <div style={{ textAlign: 'center', marginBottom: 25 }}>
                    <Title level={2} style={{ color: '#1890ff', margin: 0 }}>HanoGo</Title>
                    <Text type="secondary">
                        {isRegisterMode ? "Tạo tài khoản mới miễn phí" : "Đăng nhập để tiếp tục hành trình"}
                    </Text>
                </div>

                {errorMsg && <Alert message={errorMsg} type="error" showIcon style={{ marginBottom: 20 }} />}

                <Form
                    form={form}
                    name="auth_form"
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                >
                    {/* SỬA 3: Đã xóa Form.Item fullName tại đây */}

                    <Form.Item name="username" rules={[{ required: true, message: 'Vui lòng nhập Username!' }]}>
                        <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" />
                    </Form.Item>

                    <Form.Item name="password" rules={[{ required: true, message: 'Vui lòng nhập Password!' }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
                    </Form.Item>

                    {/* TRƯỜNG XÁC NHẬN PASS (CHỈ HIỆN KHI ĐĂNG KÝ) */}
                    {isRegisterMode && (
                        <Form.Item
                            name="confirmPassword"
                            dependencies={['password']}
                            rules={[
                                { required: true, message: 'Vui lòng nhập lại mật khẩu!' },
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu" />
                        </Form.Item>
                    )}

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block style={{ borderRadius: 20, height: 45, fontWeight: 'bold' }}>
                            {isRegisterMode ? "ĐĂNG KÝ NGAY" : "ĐĂNG NHẬP"}
                        </Button>
                    </Form.Item>
                </Form>

                <div style={{ textAlign: 'center', marginBottom: 15 }}>
                    <Text>
                        {isRegisterMode ? "Đã có tài khoản? " : "Chưa có tài khoản? "}
                    </Text>
                    <a
                        href="#"
                        style={{ fontWeight: 'bold', color: '#1890ff' }}
                        onClick={(e) => {
                            e.preventDefault();
                            setIsRegisterMode(!isRegisterMode);
                            setErrorMsg('');
                            form.resetFields();
                        }}
                    >
                        {isRegisterMode ? "Đăng nhập ngay" : "Đăng ký ngay"}
                    </a>
                </div>

                <div style={{ borderTop: '1px solid #eee', paddingTop: 10, textAlign: 'center' }}>
                    <Button type="link" icon={<HomeOutlined />} onClick={onCancel}>
                        Về trang chủ
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default LoginPage;