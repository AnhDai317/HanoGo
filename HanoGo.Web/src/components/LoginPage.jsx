import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Card, Typography, message, Alert } from 'antd';
import { UserOutlined, LockOutlined, HomeOutlined, IdcardOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const LoginPage = ({ onLoginSuccess, onCancel }) => {
    // State để kiểm soát đang ở chế độ Đăng nhập hay Đăng ký
    const [isRegisterMode, setIsRegisterMode] = useState(false);

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [form] = Form.useForm(); // Hook để reset form

    const onFinish = async (values) => {
        setLoading(true);
        setErrorMsg('');

        try {
            if (isRegisterMode) {
                // --- LOGIC ĐĂNG KÝ ---
                // Kiểm tra password confirm (nếu muốn kỹ hơn thì validate ở rule)
                if (values.password !== values.confirmPassword) {
                    setErrorMsg("Mật khẩu xác nhận không khớp!");
                    setLoading(false);
                    return;
                }

                // Gọi API Register
                const registerPayload = {
                    username: values.username,
                    password: values.password,
                    fullName: values.fullName
                };

                await axios.post('https://localhost:7236/api/auth/register', registerPayload);

                message.success("Đăng ký thành công! Hãy đăng nhập.");
                setIsRegisterMode(false); // Chuyển về form đăng nhập
                form.resetFields();
            } else {
                // --- LOGIC ĐĂNG NHẬP ---
                const response = await axios.post('https://localhost:7236/api/auth/login', values);
                const userData = response.data;

                localStorage.setItem('currentUser', JSON.stringify(userData));
                message.success("Đăng nhập thành công!");
                onLoginSuccess(userData);
            }
        } catch (error) {
            console.error(error);
            if (isRegisterMode) {
                setErrorMsg(error.response?.data || "Đăng ký thất bại. Có thể Username đã tồn tại.");
            } else {
                setErrorMsg("Sai tài khoản hoặc mật khẩu!");
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
                    {/* TRƯỜNG HỌ TÊN (CHỈ HIỆN KHI ĐĂNG KÝ) */}
                    {isRegisterMode && (
                        <Form.Item
                            name="fullName"
                            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                        >
                            <Input prefix={<IdcardOutlined />} placeholder="Họ và tên hiển thị" />
                        </Form.Item>
                    )}

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

                {/* NÚT CHUYỂN ĐỔI CHẾ ĐỘ */}
                <div style={{ textAlign: 'center', marginBottom: 15 }}>
                    <Text>
                        {isRegisterMode ? "Đã có tài khoản? " : "Chưa có tài khoản? "}
                    </Text>
                    <a
                        style={{ fontWeight: 'bold', color: '#1890ff' }}
                        onClick={() => {
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