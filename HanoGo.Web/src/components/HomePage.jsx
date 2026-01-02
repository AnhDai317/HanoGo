import React from 'react';
import './HomePage.css';
import { GlobalOutlined, StarFilled, CheckCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Menu } from 'antd';

const HomePage = ({ user, onStart, onLogin, onLogout }) => {

    const userMenu = (
        <Menu items={[
            { key: '1', label: 'Hồ sơ của tôi' },
            { key: '3', label: 'Đăng xuất', danger: true, onClick: onLogout },
        ]} />
    );

    // Xử lý nút chính: Nếu có user -> Vào App, Nếu không -> Đăng ký
    const handleMainAction = () => {
        if (user) {
            onStart();
        } else {
            onLogin(); // Ở đây ta tái sử dụng hàm Login, thực tế có thể mở tab Đăng ký riêng
        }
    };

    return (
        <div className="homepage-wrapper">
            {/* 1. NAVBAR PRO */}
            <nav className="navbar">
                <div className="logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <GlobalOutlined style={{ fontSize: '30px' }} />
                    <span>HanoGo</span>
                </div>

                {/* Menu giữa */}
                <ul className="nav-links">
                    <li>Trang chủ</li>
                    <li>Điểm đến</li>
                    <li>Blog</li>
                    <li>Liên hệ</li>
                </ul>

                <div className="nav-auth-buttons">
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span style={{ fontWeight: 600 }}>{user.fullName || "User"}</span>
                            <Dropdown overlay={userMenu} placement="bottomRight">
                                <Avatar style={{ backgroundColor: '#1890ff', cursor: 'pointer' }} icon={<UserOutlined />} size="large" />
                            </Dropdown>
                            <button className="btn-register-nav" onClick={onStart}>
                                Vào ứng dụng
                            </button>
                        </div>
                    ) : (
                        <>
                            <button className="btn-login-nav" onClick={onLogin}>Đăng nhập</button>
                            <button className="btn-register-nav" onClick={onLogin}>Đăng ký ngay</button>
                        </>
                    )}
                </div>
            </nav>

            {/* 2. HERO SECTION WITH SEARCH MOCKUP */}
            <section className="hero-section">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1 className="hero-title">Du Lịch Hà Nội <br /> Dễ Dàng Hơn Với AI</h1>
                    <p className="hero-subtitle">
                        Lên lịch trình tự động chỉ trong 30 giây. Tối ưu chi phí và thời gian di chuyển.
                    </p>

                    {/* Fake Search Bar cho giống web du lịch xịn */}
                    <div className="hero-search-mockup">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Bạn muốn đi đâu ở Hà Nội? (VD: Hồ Gươm, Lăng Bác...)"
                        />
                        <button className="btn-search-hero" onClick={handleMainAction}>
                            {user ? "Lập kế hoạch" : "Đăng ký trải nghiệm"}
                        </button>
                    </div>
                </div>
            </section>

            {/* 3. STATS SECTION (Số liệu uy tín) */}
            <section className="stats-section">
                <div className="stat-item">
                    <span className="stat-number">15,000+</span>
                    <span className="stat-label">Người dùng</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">500+</span>
                    <span className="stat-label">Địa điểm</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">100%</span>
                    <span className="stat-label">Miễn phí</span>
                </div>
            </section>

            {/* 4. HOW IT WORKS */}
            <section className="section bg-light">
                <div className="section-header">
                    <h2 className="section-title">Hoạt Động Như Thế Nào?</h2>
                    <p className="section-desc">Chỉ 3 bước đơn giản để có một chuyến đi hoàn hảo mà không cần đau đầu suy nghĩ.</p>
                </div>
                <div className="steps-grid">
                    <div className="step-card">
                        <div className="step-icon"><CheckCircleOutlined /></div>
                        <h3 className="step-title">1. Chọn điểm đến</h3>
                        <p>Nhập các địa điểm bạn muốn đi hoặc để chúng tôi gợi ý các điểm Hot nhất.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-icon"><GlobalOutlined /></div>
                        <h3 className="step-title">2. AI Tối ưu hóa</h3>
                        <p>Thuật toán Gemini AI sẽ sắp xếp lộ trình ngắn nhất, tránh đường vòng.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-icon"><StarFilled /></div>
                        <h3 className="step-title">3. Tận hưởng</h3>
                        <p>Lưu lịch trình vào điện thoại, bật Google Maps và bắt đầu khám phá.</p>
                    </div>
                </div>
            </section>

            {/* 5. TESTIMONIALS (Giả lập đánh giá) */}
            <section className="section">
                <div className="section-header">
                    <h2 className="section-title">Khách Hàng Nói Gì?</h2>
                </div>
                <div className="testimonials-grid">
                    <div className="testimonial-card">
                        <div className="stars">★★★★★</div>
                        <p className="review-text">"Tuyệt vời! Tôi không cần mất cả buổi tối để tra Google Maps xem đi đường nào tiện nữa. HanoGo làm hết rồi."</p>
                        <div className="user-info">
                            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="user-avatar" />
                            <span className="user-name">Minh Hoàng</span>
                        </div>
                    </div>
                    <div className="testimonial-card">
                        <div className="stars">★★★★★</div>
                        <p className="review-text">"Giao diện đẹp, dễ dùng. Tính năng gợi ý lịch trình rất thông minh, tôi đã khám phá được nhiều quán ăn ngon."</p>
                        <div className="user-info">
                            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="user-avatar" />
                            <span className="user-name">Thu Hà</span>
                        </div>
                    </div>
                    <div className="testimonial-card">
                        <div className="stars">★★★★☆</div>
                        <p className="review-text">"Rất hữu ích cho khách du lịch lần đầu đến Hà Nội. Hy vọng sẽ sớm có thêm tính năng đặt vé."</p>
                        <div className="user-info">
                            <img src="https://randomuser.me/api/portraits/men/85.jpg" alt="User" className="user-avatar" />
                            <span className="user-name">John Smith</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. CTA BANNER (Kêu gọi cuối) */}
            <section className="cta-section">
                <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Sẵn Sàng Cho Chuyến Đi?</h2>
                <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>Tham gia cùng cộng đồng du lịch thông minh ngay hôm nay.</p>
                <button className="btn-cta-big" onClick={handleMainAction}>
                    {user ? "Lập Kế Hoạch Ngay" : "Đăng Ký Tài Khoản Mới"}
                </button>
            </section>

            {/* 7. FOOTER CHUYÊN NGHIỆP */}
            <footer className="footer">
                <div className="footer-col">
                    <div className="logo" style={{ marginBottom: '20px' }}>
                        <GlobalOutlined style={{ color: '#1890ff' }} />
                        <span style={{ color: 'white' }}>HanoGo</span>
                    </div>
                    <p>Hệ thống hỗ trợ lập kế hoạch du lịch thông minh hàng đầu tại Hà Nội, ứng dụng công nghệ AI tiên tiến.</p>
                </div>
                <div className="footer-col">
                    <h4>Về chúng tôi</h4>
                    <ul>
                        <li>Câu chuyện thương hiệu</li>
                        <li>Tuyển dụng</li>
                        <li>Tin tức</li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>Hỗ trợ</h4>
                    <ul>
                        <li>Trung tâm trợ giúp</li>
                        <li>Chính sách bảo mật</li>
                        <li>Điều khoản sử dụng</li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>Liên hệ</h4>
                    <ul>
                        <li>Email: support@hanogo.com</li>
                        <li>Hotline: 1900 1000</li>
                        <li>Hà Nội, Việt Nam</li>
                    </ul>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;