import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Layout, Menu, Card, Typography, Spin, Button, Input, List, message } from 'antd';
import {
  SearchOutlined, PlusOutlined, EnvironmentOutlined,
  GlobalOutlined, UnorderedListOutlined, LogoutOutlined,
  AimOutlined, CarOutlined, AliwangwangOutlined,
  ThunderboltOutlined, HomeOutlined
} from '@ant-design/icons';

import MapContent from './components/MapContent';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import DestinationDetails from './components/DestinationDetails'; // Component mới tạo

const { Sider, Content } = Layout;
const { Text, Title } = Typography;

const API_BASE_URL = 'http://localhost:5163/api';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // Quản lý View: 'home' | 'details' | 'planner' | 'login'
  const [currentView, setCurrentView] = useState('home');
  const [selectedPlace, setSelectedPlace] = useState(null); // Lưu địa điểm được chọn để xem chi tiết

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transportMode, setTransportMode] = useState('driving');
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    fetchInitialPlaces();
  }, []);

  const fetchInitialPlaces = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/places`);
      setPlaces(response.data);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  // --- LOGIC CHUYỂN TRANG ---
  const handleStartPlanning = () => {
    // Vào thẳng Planner để xem danh sách dọc và map
    setCurrentView('planner');
  };

  const handlePlaceClick = (place) => {
    // Click vào ảnh ở trang Home -> Mở trang chi tiết
    setSelectedPlace(place);
    setCurrentView('details');
    window.scrollTo(0, 0); // Cuộn lên đầu trang
  };

  const handleAddToItineraryFromDetails = (place) => {
    if (!currentUser) {
      message.warning("Vui lòng đăng nhập để thêm vào lịch trình!");
      setCurrentView('login');
      return;
    }
    message.success(`Đã thêm ${place.name} vào kế hoạch!`);
    setCurrentView('planner'); // Thêm xong chuyển sang planner để xem
  };

  const handleBackToHome = () => {
    setSelectedPlace(null);
    setCurrentView('home');
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentView('planner');
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setCurrentView('home');
  };

  // --- LOGIC MAP & SEARCH (Giữ nguyên) ---
  const handleGetMyLocation = () => { message.info("Đang lấy vị trí..."); };
  const handleTyping = (e) => { setSearchText(e.target.value); };
  const handleOptimize = () => { message.success("Đang tối ưu lịch trình..."); };

  // ================= RENDER GIAO DIỆN =================

  // 1. LOGIN
  if (currentView === 'login') {
    return <LoginPage onLoginSuccess={handleLoginSuccess} onCancel={() => setCurrentView('home')} />;
  }

  // 2. CHI TIẾT ĐỊA ĐIỂM (Giao diện mới bạn yêu cầu)
  if (currentView === 'details') {
    return (
      <DestinationDetails
        place={selectedPlace}
        onBack={handleBackToHome}
        onAddToItinerary={handleAddToItineraryFromDetails}
      />
    );
  }

  // 3. HOME (Landing Page Grid 4 ô)
  if (currentView === 'home') {
    return (
      <HomePage
        user={currentUser}
        places={places}
        onStart={handleStartPlanning}
        onLogin={() => setCurrentView('login')}
        onLogout={handleLogout}
        onPlaceClick={handlePlaceClick} // Truyền hàm mở chi tiết
        onViewAll={handleStartPlanning} // "Xem tất cả" -> Sang Planner
      />
    );
  }

  // 4. PLANNER (Giao diện cũ: List dọc + Map)
  return (
    <Layout style={{ height: '100vh' }}>
      <Sider width={60} theme="dark" style={{ textAlign: 'center', paddingTop: 20 }}>
        <GlobalOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: 30 }} />
        <Menu theme="dark" mode="vertical" defaultSelectedKeys={['2']} items={[
          { key: '1', icon: <HomeOutlined />, label: 'Home', onClick: () => setCurrentView('home') },
          { key: '2', icon: <UnorderedListOutlined />, label: 'Plan' },
        ]} />
        <Button type="text" icon={<LogoutOutlined style={{ color: 'white' }} />} onClick={handleLogout} style={{ position: 'absolute', bottom: 20, left: 14 }} />
      </Sider>

      <Sider width={380} theme="light" style={{ borderRight: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #f0f0f0', flexShrink: 0 }}>
          <Title level={4} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AliwangwangOutlined style={{ color: '#1890ff' }} /> HanoGo Planner
          </Title>
          <div style={{ marginTop: 15 }}>
            <Input prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />} placeholder="Tìm địa điểm..." size="large" onChange={handleTyping} />
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <Button size="small" icon={<AimOutlined />} onClick={handleGetMyLocation}>GPS</Button>
              <Button size="small" icon={<CarOutlined />}>Xe máy</Button>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '15px', background: '#fafafa' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text strong>Tất cả địa điểm ({places.length})</Text>
          </div>
          {places.map((place) => (
            <Card key={place.id} hoverable size="small" style={{ marginBottom: 10 }} onClick={() => { setSelectedPlace(place); setCurrentView('details'); }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ width: 60, height: 60, borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
                  <img src={place.imageUrl || "https://via.placeholder.com/100"} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{place.name}</div>
                  <small style={{ color: '#888' }}>{place.category}</small>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Sider>

      <Content style={{ position: 'relative' }}>
        <MapContent places={places} transportMode={transportMode} />
      </Content>
    </Layout>
  );
}

export default App;