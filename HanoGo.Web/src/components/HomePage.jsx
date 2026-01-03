import React from 'react';
import { Avatar, Dropdown, Menu } from 'antd';

const HomePage = ({ user, places, onStart, onLogin, onLogout, onPlaceClick, onViewAll }) => {

    // Đảm bảo places luôn là mảng để tránh lỗi crash
    const safePlaces = places || [];

    // Lấy đúng 4 địa điểm đầu tiên để hiển thị vào Grid đặc biệt
    // Nếu dữ liệu chưa tải xong, dùng placeholder để giữ khung hình đẹp
    const featuredPlaces = [0, 1, 2, 3].map(idx => safePlaces[idx] || {
        id: `placeholder-${idx}`,
        name: 'Đang cập nhật...',
        address: 'Hanoi, Vietnam',
        imageUrl: 'https://via.placeholder.com/600x400?text=HanoGo',
        rating: 0
    });

    const userMenu = (
        <Menu items={[
            { key: '1', label: 'Hồ sơ của tôi' },
            { key: '3', label: 'Đăng xuất', danger: true, onClick: onLogout },
        ]} />
    );

    const handleMainAction = () => {
        if (user) onStart();
        else onLogin();
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-body">

            {/* HEADER */}
            <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-border-dark bg-white/90 dark:bg-[#111c22]/90 backdrop-blur-md px-4 md:px-10 py-3">
                <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <div className="size-8 text-primary">
                        <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" fill="currentColor"></path>
                        </svg>
                    </div>
                    <h2 className="text-lg font-bold leading-tight font-display tracking-tight">HanoiTravelAI</h2>
                </div>

                <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
                    <div className="flex items-center gap-9">
                        <span className="text-sm font-medium hover:text-primary cursor-pointer" onClick={onViewAll}>Địa điểm</span>
                        <span className="text-sm font-medium hover:text-primary cursor-pointer" onClick={onStart}>Lịch trình</span>
                        <span className="text-sm font-medium hover:text-primary cursor-pointer">Blog</span>
                    </div>
                    <div className="flex gap-2 items-center">
                        {user ? (
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-sm">{user.fullName || user.username}</span>
                                <Dropdown overlay={userMenu} placement="bottomRight" arrow>
                                    <Avatar className="cursor-pointer bg-primary" size="large">{user.username?.[0]?.toUpperCase()}</Avatar>
                                </Dropdown>
                                <button onClick={onStart} className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-bold">Vào ứng dụng</button>
                            </div>
                        ) : (
                            <>
                                <button onClick={onLogin} className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-200 dark:bg-border-dark hover:bg-slate-300 dark:hover:bg-[#325567] transition-colors text-slate-900 dark:text-white text-sm font-bold">Đăng nhập</button>
                                <button onClick={onLogin} className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-bold">Đăng ký</button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center w-full">
                <div className="w-full max-w-[1200px] flex flex-col gap-8 pb-10">

                    {/* HERO SECTION */}
                    <div className="px-4 md:px-10 pt-6">
                        <div className="relative overflow-hidden rounded-2xl min-h-[520px] flex flex-col items-center justify-center text-center p-6 md:p-12 gap-8 bg-cover bg-center group shadow-2xl transition-all duration-500"
                            style={{ backgroundImage: 'linear-gradient(rgba(17, 28, 34, 0.4) 0%, rgba(17, 28, 34, 0.7) 100%), url("https://images.unsplash.com/photo-1555921015-5532091f6026?q=80&w=2070&auto=format&fit=crop")' }}>
                            <div className="relative z-10 flex flex-col gap-4 max-w-3xl">
                                <span className="text-primary font-bold tracking-widest uppercase text-sm bg-black/40 backdrop-blur-sm py-1 px-3 rounded-full mx-auto border border-white/10">Du lịch thông minh</span>
                                <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight font-display drop-shadow-xl">Hà Nội - Ngàn năm văn hiến</h1>
                                <h2 className="text-white/90 text-base md:text-xl font-medium leading-relaxed max-w-2xl mx-auto drop-shadow-md">Khám phá thủ đô qua lăng kính mới với AI.</h2>
                            </div>

                            <div className="relative z-10 mt-4">
                                <button onClick={handleMainAction} className="h-14 px-8 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 min-w-[200px]">
                                    <span className="material-symbols-outlined text-xl">explore</span>
                                    <span>Lập kế hoạch ngay</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* FEATURED CARDS (Chức năng) */}
                    <div className="px-4 md:px-10 -mt-6 relative z-20">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { icon: 'auto_awesome', color: 'text-primary', bg: 'bg-blue-100 dark:bg-blue-900/30', title: 'Tạo lịch trình AI', desc: 'AI gợi ý lộ trình khám phá Hà Nội tối ưu theo sở thích của bạn.' },
                                { icon: 'map', color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30', title: 'Bản đồ Du lịch', desc: 'Tìm kiếm ATM, nhà vệ sinh, trạm xe buýt và điểm tham quan gần bạn.' },
                                { icon: 'favorite', color: 'text-pink-500', bg: 'bg-pink-100 dark:bg-pink-900/30', title: 'Hà Nội của tôi', desc: 'Xem lại các địa điểm yêu thích và lịch trình cá nhân đã lưu.' }
                            ].map((item, idx) => (
                                <div key={idx} onClick={user ? onStart : onLogin} className="group cursor-pointer relative overflow-hidden rounded-xl border border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark p-6 hover:border-primary/50 transition-all shadow-lg hover:shadow-primary/10 flex flex-col justify-between h-full">
                                    <div>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`p-3 rounded-lg ${item.bg} ${item.color}`}>
                                                <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                                            </div>
                                            <span className={`material-symbols-outlined text-gray-400 group-hover:${item.color.replace('text-', 'text-')} transition-colors`}>arrow_forward</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                                        <p className="text-sm text-slate-500 dark:text-text-secondary">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- BỐ CỤC GRID ĐẶC BIỆT MÀ BẠN MUỐN --- */}
                    <div className="px-4 md:px-10 py-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Điểm đến nổi bật</h2>
                                <p className="text-slate-500 dark:text-text-secondary text-sm mt-1">Các địa điểm hot nhất hiện nay</p>
                            </div>
                            {/* Nút Xem tất cả: Đã xóa số lượng ({safePlaces.length}) như yêu cầu */}
                            <span onClick={onViewAll} className="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-1 cursor-pointer">
                                Xem tất cả <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </span>
                        </div>

                        {/* GRID 1 Ô LỚN, 2 Ô NHỎ, 1 Ô DÀI */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[400px] md:h-[500px] mb-10">

                            {/* ITEM 1: Ô LỚN BÊN TRÁI (Chiếm 2 cột, 2 hàng) */}
                            <div
                                className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-xl cursor-pointer shadow-md hover:shadow-xl transition-all"
                                onClick={() => onPlaceClick(featuredPlaces[0])}
                            >
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                    style={{ backgroundImage: `url("${featuredPlaces[0].imageUrl || 'https://via.placeholder.com/500'}")` }}></div>
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg text-white">
                                    <div className="font-bold text-lg">{featuredPlaces[0].name}</div>
                                    <div className="text-xs opacity-80">{featuredPlaces[0].address}</div>
                                </div>
                            </div>

                            {/* ITEM 2: Ô NHỎ TRÊN PHẢI */}
                            <div
                                className="md:col-span-1 md:row-span-1 relative group overflow-hidden rounded-xl cursor-pointer shadow-md hover:shadow-xl transition-all"
                                onClick={() => onPlaceClick(featuredPlaces[1])}
                            >
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                    style={{ backgroundImage: `url("${featuredPlaces[1].imageUrl || 'https://via.placeholder.com/300'}")` }}></div>
                                <div className="absolute inset-0 flex items-end p-3 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90">
                                    <span className="text-white text-sm font-bold truncate">{featuredPlaces[1].name}</span>
                                </div>
                            </div>

                            {/* ITEM 3: Ô NHỎ TRÊN CÙNG PHẢI */}
                            <div
                                className="md:col-span-1 md:row-span-1 relative group overflow-hidden rounded-xl cursor-pointer shadow-md hover:shadow-xl transition-all"
                                onClick={() => onPlaceClick(featuredPlaces[2])}
                            >
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                    style={{ backgroundImage: `url("${featuredPlaces[2].imageUrl || 'https://via.placeholder.com/300'}")` }}></div>
                                <div className="absolute inset-0 flex items-end p-3 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90">
                                    <span className="text-white text-sm font-bold truncate">{featuredPlaces[2].name}</span>
                                </div>
                            </div>

                            {/* ITEM 4: Ô DÀI DƯỚI PHẢI (Chiếm 2 cột, 1 hàng) */}
                            <div
                                className="md:col-span-2 md:row-span-1 relative group overflow-hidden rounded-xl cursor-pointer shadow-md hover:shadow-xl transition-all"
                                onClick={() => onPlaceClick(featuredPlaces[3])}
                            >
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                    style={{ backgroundImage: `url("${featuredPlaces[3].imageUrl || 'https://via.placeholder.com/500'}")` }}></div>
                                <div className="absolute inset-0 bg-black/20"></div>
                                <button className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                                    <span className="material-symbols-outlined text-[16px]">grid_view</span>
                                    {featuredPlaces[3].name}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* AI SUGGESTION SECTION */}
                    <div className="px-4 md:px-10 pb-10">
                        <div className="bg-primary/5 dark:bg-surface-dark rounded-2xl p-6 border border-primary/10 dark:border-border-dark">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/20 rounded-full text-primary">
                                        <span className="material-symbols-outlined">psychology</span>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Gợi ý dành riêng cho bạn</h2>
                                        <p className="text-sm text-slate-500 dark:text-text-secondary">Dựa trên sở thích "Văn hóa" & "Ẩm thực"</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div onClick={onViewAll} className="flex gap-4 p-4 rounded-xl bg-white dark:bg-[#111c22] border border-gray-100 dark:border-border-dark hover:border-primary/30 transition-colors cursor-pointer shadow-sm hover:shadow-md">
                                    <img alt="Hiking" className="w-24 h-24 rounded-lg object-cover flex-shrink-0" src="https://dulichkhampha24.com/wp-content/uploads/2020/09/nui-tram-chuong-my-1.jpg" />
                                    <div className="flex flex-col justify-center">
                                        <div className="flex gap-2 mb-1">
                                            <span className="text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">Dã ngoại</span>
                                            <span className="text-[10px] uppercase font-bold tracking-wider text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">Cuối tuần</span>
                                        </div>
                                        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">Trekking Núi Trầm</h3>
                                        <p className="text-sm text-slate-500 dark:text-text-secondary line-clamp-2">"Cao nguyên đá" thu nhỏ ngay Chương Mỹ.</p>
                                    </div>
                                </div>

                                <div onClick={onViewAll} className="flex gap-4 p-4 rounded-xl bg-white dark:bg-[#111c22] border border-gray-100 dark:border-border-dark hover:border-primary/30 transition-colors cursor-pointer shadow-sm hover:shadow-md">
                                    <img alt="Food" className="w-24 h-24 rounded-lg object-cover flex-shrink-0" src="https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/07/pho-ta-hien-ha-noi-vntrip-2.jpg" />
                                    <div className="flex flex-col justify-center">
                                        <div className="flex gap-2 mb-1">
                                            <span className="text-[10px] uppercase font-bold tracking-wider text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded">Ẩm thực</span>
                                            <span className="text-[10px] uppercase font-bold tracking-wider text-pink-500 bg-pink-500/10 px-2 py-0.5 rounded">Phố cổ</span>
                                        </div>
                                        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">Foodtour Tạ Hiện</h3>
                                        <p className="text-sm text-slate-500 dark:text-text-secondary line-clamp-2">Khám phá bia hơi vỉa hè và ẩm thực đường phố.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default HomePage;