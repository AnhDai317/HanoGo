import { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title } = Typography;

function LoginPage({ onLoginSuccess }) {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            // Gọi API Login
            const res = await axios.post('https://localhost:7236/api/auth/login', values);

            // Lưu thông tin User vào LocalStorage (Bộ nhớ trình duyệt)
            const userInfo = res.data;
            localStorage.setItem('currentUser', JSON.stringify(userInfo));

            message.success(`Xin chào, ${userInfo.username}!`);
            onLoginSuccess(userInfo); // Báo cho App biết là đã login xong
        } catch (error) {
            message.error('Đăng nhập thất bại! Kiểm tra lại user/pass.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
            <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <Title level={3}>HanoGo Login</Title>
                    <p>Đăng nhập để AI hiểu bạn hơn</p>
                </div>
                <Form onFinish={onFinish} layout="vertical">
                    <Form.Item name="username" rules={[{ required: true, message: 'Nhập username!' }]}>
                        <Input prefix={<UserOutlined />} placeholder="Username (user1)" size="large" />
                    </Form.Item>
                    <Form.Item name="password" rules={[{ required: true, message: 'Nhập password!' }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="Password (123456)" size="large" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}

export default LoginPage;