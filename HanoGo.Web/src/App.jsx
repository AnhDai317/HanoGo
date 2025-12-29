import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Layout, Menu, Card, Typography, Spin, Tag, Button, Input, List, message, Avatar, Tooltip, Badge } from 'antd';
import {
  SearchOutlined, PlusOutlined, EnvironmentOutlined,
  GlobalOutlined, UnorderedListOutlined, UserOutlined,
  LogoutOutlined, AimOutlined, CarOutlined, AliwangwangOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';

import MapContent from './components/MapContent';
import LoginPage from './components/LoginPage';

const { Sider, Content } = Layout;
const { Text, Title } = Typography;

const API_BASE_URL = 'https://localhost:7236/api';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [places, setPlaces] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transportMode, setTransportMode] = useState('driving'); // 'driving' | 'walking'

  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    fetchInitialPlaces();
  }, []);

  // Khi đổi chế độ di chuyển -> Cập nhật icon của "Vị trí tôi" (Nếu đang có)
  useEffect(() => {
    setPlaces(prevPlaces => prevPlaces.map(p => {
      if (p.id === 99999) {
        return {
          ...p,
          // Đổi icon dựa trên chế độ đi
          imageUrl: transportMode === 'driving'
            ? "https://cdn-icons-png.flaticon.com/512/171/171250.png" // Icon Xe máy
            : "https://cdn-icons-png.flaticon.com/512/2642/2642279.png" // Icon Đi bộ
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

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  const performSearchAndLog = async (query) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    if (currentUser) {
      axios.post(`${API_BASE_URL}/logs`, {
        userId: currentUser.id, placeId: 1, actionType: "SEARCH_QUERY", metaData: query, timeSpentSeconds: 0
      }).catch(err => { });
    }
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5&addressdetails=1&viewbox=105.7,21.1,106.0,20.9`;
      const res = await axios.get(url);
      setSearchResults(res.data || []);
    } catch (error) { console.error("Lỗi OSM"); }
    finally { setIsSearching(false); }
  };

  const handleTyping = (e) => {
    const value = e.target.value;
    setSearchText(value);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => { performSearchAndLog(value); }, 500);
  };

  const handlePressEnter = () => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    performSearchAndLog(searchText);
  };

  const addToSchedule = async (item) => {
    const payload = {
      name: item.name || item.display_name.split(',')[0],
      address: item.display_name,
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      category: "Search"
    };
    message.loading({ content: "Đang thêm...", key: 'addPlace' });
    try {
      const apiRes = await axios.post(`${API_BASE_URL}/places/track-external`, payload);
      const newPlace = {
        id: apiRes.data.id,
        name: payload.name, category: "Custom", description: payload.address,
        latitude: payload.latitude, longitude: payload.longitude,
        imageUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png", tags: "New"
      };
      if (places.find(p => p.id === newPlace.id)) {
        message.warning({ content: "Đã có rồi!", key: 'addPlace' }); return;
      }
      setPlaces(prev => [...prev, newPlace]);
      setSearchResults([]); setSearchText("");
      message.success({ content: "Thành công!", key: 'addPlace' });
    } catch (error) { message.error({ content: "Lỗi hệ thống!", key: 'addPlace' }); }
  };

  // --- FIX LỖI AI LÀM MẤT GPS ---
  const handleOptimize = async () => {
    if (places.length < 2) return message.warning("Cần ít nhất 2 địa điểm!");

    message.loading({ content: "AI đang tính toán...", key: 'ai', duration: 0 });

    try {
      // 1. Tìm xem có địa điểm GPS (ID 99999) không?
      const startNode = places.find(p => p.id === 99999);

      // 2. Lọc danh sách chỉ chứa các điểm thật để gửi Backend
      const placesToOptimize = places.filter(p => p.id !== 99999);
      const placeIds = placesToOptimize.map(p => p.id);

      // 3. Gọi AI
      const res = await axios.post(`${API_BASE_URL}/itinerary/optimize`, placeIds);
      let sortedPlaces = res.data;

      // 4. Nếu ban đầu có GPS, gắn lại nó vào đầu danh sách
      if (startNode) {
        sortedPlaces = [startNode, ...sortedPlaces];
      }

      setPlaces(sortedPlaces);
      message.success({ content: "Đã tối ưu lộ trình!", key: 'ai' });
    } catch (e) {
      console.error(e);
      message.error({ content: "AI lỗi, thử lại sau!", key: 'ai' });
    }
  };

  const handleGetMyLocation = () => {
    if (!navigator.geolocation) return message.error("Không hỗ trợ GPS");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const me = {
          id: 99999,
          name: "Vị trí của tôi",
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          // Icon mặc định là xe máy
          imageUrl: "https://cdn-icons-png.flaticon.com/512/171/171250.png",
          category: "User",
          description: "Điểm xuất phát"
        };
        // Luôn đặt lên đầu
        setPlaces(prev => [me, ...prev.filter(p => p.id !== 99999)]);
        message.success("Đã lấy vị trí!");
      },
      () => message.error("Vui lòng bật quyền GPS!")
    );
  };

  if (!currentUser) return <LoginPage onLoginSuccess={(user) => setCurrentUser(user)} />;

  return (
    <Layout style={{ height: '100vh' }}>
      {/* Sidebar cũ giữ nguyên, chỉ paste đoạn Layout chính vào đây */}
      <Sider width={60} theme="dark" style={{ textAlign: 'center', paddingTop: 20 }}>
        <GlobalOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: 30 }} />
        <Menu theme="dark" mode="vertical" defaultSelectedKeys={['1']} items={[
          { key: '1', icon: <UnorderedListOutlined />, label: 'Plan' },
          { key: '2', icon: <EnvironmentOutlined />, label: 'Map' },
        ]} />
        <Button type="text" icon={<LogoutOutlined style={{ color: 'white' }} />} onClick={handleLogout} style={{ position: 'absolute', bottom: 20, left: 14 }} />
      </Sider>

      <Sider width={380} theme="light" style={{ borderRight: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #f0f0f0', flexShrink: 0 }}>
          <Title level={4} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AliwangwangOutlined style={{ color: '#1890ff' }} /> HanoGo Planner
          </Title>

          <div style={{ marginTop: 15 }}>
            <Input
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Tìm địa điểm..." size="large"
              value={searchText} onChange={handleTyping} onPressEnter={handlePressEnter} allowClear
              style={{ borderRadius: '8px' }}
              suffix={isSearching ? <Spin size="small" /> : null}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <Button size="small" icon={<AimOutlined />} onClick={handleGetMyLocation}>GPS</Button>
              <Button
                size="small"
                type={transportMode === 'driving' ? 'primary' : 'default'}
                icon={<CarOutlined />}
                onClick={() => setTransportMode('driving')}
              >Xe máy</Button>
              <Button
                size="small"
                type={transportMode === 'walking' ? 'primary' : 'default'}
                icon={<EnvironmentOutlined />}
                onClick={() => setTransportMode('walking')}
              >Đi bộ</Button>
            </div>
          </div>
        </div>

        {/* List kết quả tìm kiếm */}
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

        {/* List lịch trình */}
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

      <Content style={{ position: 'relative' }}>
        <MapContent places={places} transportMode={transportMode} />
      </Content>
    </Layout>
  );
}

export default App;