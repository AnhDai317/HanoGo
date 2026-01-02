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
import HomePage from './components/HomePage'; // Import trang Home vừa tạo

const { Sider, Content } = Layout;
const { Text, Title } = Typography;

const API_BASE_URL = 'https://localhost:7236/api';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // View mode: 'home' | 'login' | 'planner'
  const [currentView, setCurrentView] = useState('home');

  const [places, setPlaces] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transportMode, setTransportMode] = useState('driving');
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    // Check user trong localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    fetchInitialPlaces();
  }, []);

  useEffect(() => {
    setPlaces(prevPlaces => prevPlaces.map(p => {
      if (p.id === 99999) {
        return {
          ...p,
          imageUrl: transportMode === 'driving'
            ? "https://cdn-icons-png.flaticon.com/512/171/171250.png"
            : "https://cdn-icons-png.flaticon.com/512/2642/2642279.png"
        };
      }
      return p;
    }));
  }, [transportMode]);

  const fetchInitialPlaces = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/places`);
      setPlaces(response.data);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  // --- LOGIC ĐIỀU HƯỚNG ---
  const handleStartPlanning = () => {
    if (currentUser) {
      setCurrentView('planner');
    } else {
      message.info("Vui lòng đăng nhập để bắt đầu!");
      setCurrentView('login');
    }
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentView('planner');
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setCurrentView('home');
    message.success("Đã đăng xuất!");
  };
  // ------------------------

  // ... (Giữ nguyên các hàm performSearchAndLog, handleTyping, handleOptimize...)
  const performSearchAndLog = async (query) => { /* ...code cũ... */ };
  const handleTyping = (e) => { /* ...code cũ... */ };
  const handlePressEnter = () => { /* ...code cũ... */ };
  const addToSchedule = async (item) => { /* ...code cũ... */ };
  const handleOptimize = async () => { /* ...code cũ... */ };
  const handleGetMyLocation = () => { /* ...code cũ... */ };


  // --- RENDER GIAO DIỆN ---

  // 1. MÀN HÌNH LOGIN
  if (currentView === 'login') {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onCancel={() => setCurrentView('home')}
      />
    );
  }

  // 2. MÀN HÌNH HOME (Fix lỗi lăn chuột bằng cách không bọc Layout)
  if (currentView === 'home') {
    return (
      <HomePage
        user={currentUser}
        onStart={handleStartPlanning}
        onLogin={() => setCurrentView('login')}
        onLogout={handleLogout}
      />
    );
  }

  // 3. MÀN HÌNH PLANNER (Ứng dụng chính)
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

      {/* Code Sidebar danh sách địa điểm */}
      <Sider width={380} theme="light" style={{ borderRight: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #f0f0f0', flexShrink: 0 }}>
          <Title level={4} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AliwangwangOutlined style={{ color: '#1890ff' }} /> HanoGo Planner
          </Title>
          {currentUser && <Text type="secondary" style={{ fontSize: 12 }}>User: {currentUser.fullName}</Text>}

          <div style={{ marginTop: 15 }}>
            <Input
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Tìm địa điểm..." size="large"
              value={searchText} onChange={handleTyping} onPressEnter={handlePressEnter} allowClear
              style={{ borderRadius: '8px' }}
              suffix={isSearching ? <Spin size="small" /> : null}
            />
            {/* Các nút bấm GPS, Xe máy, Đi bộ... */}
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <Button size="small" icon={<AimOutlined />} onClick={handleGetMyLocation}>GPS</Button>
              <Button
                size="small" type={transportMode === 'driving' ? 'primary' : 'default'} icon={<CarOutlined />}
                onClick={() => setTransportMode('driving')}
              >Xe máy</Button>
              <Button
                size="small" type={transportMode === 'walking' ? 'primary' : 'default'} icon={<EnvironmentOutlined />}
                onClick={() => setTransportMode('walking')}
              >Đi bộ</Button>
            </div>
          </div>
        </div>

        {/* Kết quả tìm kiếm */}
        {(searchResults.length > 0 || isSearching) && (
          <div style={{ padding: '0 10px', background: '#fffbe6', borderBottom: '1px solid #ffe58f', maxHeight: '300px', overflowY: 'auto', flexShrink: 0 }}>
            {!isSearching && (
              <List dataSource={searchResults} renderItem={item => (
                <List.Item
                  style={{ padding: '10px', cursor: 'pointer' }}
                  onClick={() => addToSchedule(item)}
                  actions={[<Button type="primary" size="small" shape="circle" icon={<PlusOutlined />} />]}
                >
                  <List.Item.Meta title={<span style={{ fontWeight: 600 }}>{item.name || item.display_name.split(',')[0]}</span>} description={<span style={{ fontSize: 11, color: '#888' }}>{item.display_name}</span>} />
                </List.Item>
              )} />
            )}
          </div>
        )}

        {/* Danh sách địa điểm đã chọn */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '15px', background: '#fafafa' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text strong>Lịch trình ({places.length})</Text>
            <Button type="primary" size="small" icon={<ThunderboltOutlined />} onClick={handleOptimize} disabled={places.length < 2} style={{ background: 'linear-gradient(45deg, #FF6B6B, #FFD93D)', border: 'none' }}>AI Tối ưu</Button>
          </div>
          {loading ? <div style={{ textAlign: 'center' }}><Spin /></div> : (
            places.map((place, index) => (
              <Card
                key={place.id} hoverable size="small"
                style={{ marginBottom: 12, borderLeft: place.id === 99999 ? '4px solid #ff4d4f' : '4px solid #1890ff', overflow: 'hidden' }}
                bodyStyle={{ padding: 12 }}
              >
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ width: 60, height: 60, borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
                    <img src={place.imageUrl || "https://via.placeholder.com/100"} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text strong style={{ fontSize: 13 }}>{place.id === 99999 ? '📍 ' : `#${index + 1}. `}{place.name}</Text>
                      {place.id !== 99999 && (<Button type="text" danger size="small" onClick={(e) => { e.stopPropagation(); setPlaces(places.filter(p => p.id !== place.id)); }}>X</Button>)}
                    </div>
                    <Text type="secondary" style={{ fontSize: 11 }}>{place.category}</Text>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </Sider>

      {/* Bản đồ */}
      <Content style={{ position: 'relative' }}>
        <MapContent places={places} transportMode={transportMode} />
      </Content>
    </Layout>
  );
}

export default App;