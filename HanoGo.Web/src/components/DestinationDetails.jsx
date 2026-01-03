import React from 'react';

const DestinationDetails = ({ place, allPlaces, onBack, onAddToItinerary, onPlaceClick }) => {
    if (!place) return null;

    // 1. XỬ LÝ GALLERY TỪ DB
    // Ưu tiên lấy từ bảng PlaceImages, nếu không có thì dùng ImageUrl chính
    let gallery = [];
    if (place.placeImages && place.placeImages.length > 0) {
        gallery = place.placeImages.map(img => img.imageUrl);
    } else {
        gallery = [place.imageUrl];
    }
    // Nếu vẫn ít hơn 4 ảnh, lấp đầy bằng placeholder để Grid đẹp
    while (gallery.length < 4) {
        gallery.push(place.imageUrl || "https://via.placeholder.com/800");
    }

    // 2. XỬ LÝ REVIEWS TỪ DB
    const reviews = place.reviews || [];

    // 3. XỬ LÝ RELATED PLACES
    const relatedPlaces = allPlaces
        ? allPlaces.filter(p => p.category === place.category && p.id !== place.id).slice(0, 3)
        : [];

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display antialiased selection:bg-primary selection:text-white overflow-x-hidden">

            {/* HEADER */}
            <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-[#233c48] bg-background-light/95 dark:bg-[#111c22]/95 backdrop-blur-md">
                <div className="flex items-center justify-between px-6 py-3 lg:px-10">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined">arrow_back</span>
                            <span className="font-bold text-lg">Quay lại</span>
                        </button>
                        <div className="h-6 w-px bg-slate-300 mx-2"></div>
                        <h2 className="text-xl font-bold leading-tight tracking-tight">TravelAI</h2>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

                {/* BREADCRUMB */}
                <div className="flex flex-wrap gap-2 mb-6 text-sm">
                    <span onClick={onBack} className="text-slate-500 hover:text-primary cursor-pointer">Home</span>
                    <span className="text-slate-400">/</span>
                    <span className="text-slate-500">{place.category}</span>
                    <span className="text-slate-400">/</span>
                    <span className="text-slate-900 dark:text-white font-medium">{place.name}</span>
                </div>

                {/* TITLE & ACTIONS */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">{place.name}</h1>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-[#92b7c9]">
                            <span className="material-symbols-outlined text-[20px]">location_on</span>
                            <p className="text-base">{place.address}</p>
                            <span className="mx-2">•</span>
                            <div className="flex items-center gap-1 text-amber-400">
                                <span className="material-symbols-outlined text-[18px] fill-current">star</span>
                                <span className="text-slate-900 dark:text-white font-bold">{place.averageRating || 0}</span>
                            </div>
                            <span className="text-sm">({place.totalReviews || reviews.length} đánh giá)</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => onAddToItinerary(place)} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-sky-500 text-white shadow-lg shadow-primary/25 transition-all transform active:scale-95">
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            <span className="font-medium text-sm">Thêm vào Lịch Trình</span>
                        </button>
                    </div>
                </div>

                {/* IMAGE GRID */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[400px] md:h-[500px] mb-10">
                    <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-xl">
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url("${gallery[0]}")` }}></div>
                    </div>
                    <div className="md:col-span-1 md:row-span-1 relative group overflow-hidden rounded-xl">
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${gallery[1]}")` }}></div>
                    </div>
                    <div className="md:col-span-1 md:row-span-1 relative group overflow-hidden rounded-xl">
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${gallery[2]}")` }}></div>
                    </div>
                    <div className="md:col-span-2 md:row-span-1 relative group overflow-hidden rounded-xl">
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${gallery[3]}")` }}></div>
                        <button className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                            <span className="material-symbols-outlined text-[16px]">grid_view</span>
                            Xem tất cả ảnh
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description */}
                        <div className="prose dark:prose-invert max-w-none">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Giới thiệu</h3>
                            <p className="text-slate-600 dark:text-[#92b7c9] leading-relaxed mb-4">{place.description}</p>

                            <div className="flex gap-2 mt-4">
                                {place.tags && place.tags.split(',').map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-[#233c48] rounded-full text-xs font-medium text-slate-600 dark:text-[#92b7c9]">#{tag.trim()}</span>
                                ))}
                            </div>
                        </div>

                        {/* REVIEWS FROM DB */}
                        <div className="pt-8 border-t border-gray-200 dark:border-[#233c48]">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Đánh giá ({reviews.length})</h3>

                            {reviews.length > 0 ? (
                                <div className="space-y-6">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="flex gap-4 p-4 rounded-xl bg-white dark:bg-[#182830] border border-gray-100 dark:border-[#233c48]">
                                            <div className="size-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                                                {review.user?.username?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <h5 className="text-slate-900 dark:text-white font-bold text-sm">{review.user?.username || 'Người dùng ẩn danh'}</h5>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="flex text-amber-400 text-[12px]">
                                                        {[...Array(review.rating)].map((_, i) => <span key={i} className="material-symbols-outlined fill-current">star</span>)}
                                                    </div>
                                                    <span className="text-xs text-slate-500 dark:text-[#587383]">{new Date(review.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-slate-600 dark:text-[#92b7c9] text-sm">{review.comment}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-500 italic">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
                            )}
                        </div>

                        {/* RELATED PLACES */}
                        {relatedPlaces.length > 0 && (
                            <div className="pt-8 border-t border-gray-200 dark:border-[#233c48]">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Có thể bạn cũng thích</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {relatedPlaces.map(relPlace => (
                                        <div key={relPlace.id} onClick={() => onPlaceClick(relPlace)} className="cursor-pointer group">
                                            <div className="rounded-xl overflow-hidden h-32 mb-2">
                                                <img src={relPlace.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                            </div>
                                            <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{relPlace.name}</h4>
                                            <p className="text-xs text-slate-500">{relPlace.category}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT SIDEBAR - THÔNG TIN CHI TIẾT TỪ DB */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="rounded-xl p-5 bg-white dark:bg-[#182830] border border-gray-200 dark:border-[#233c48] shadow-sm">
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Thông tin hữu ích</h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-dashed border-gray-200 dark:border-gray-700 pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center"><span className="material-symbols-outlined">schedule</span></div>
                                        <div>
                                            <p className="text-xs text-slate-500">Giờ mở cửa</p>
                                            <p className="text-sm font-medium dark:text-white">{place.openingHours || "Cả ngày"}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between border-b border-dashed border-gray-200 dark:border-gray-700 pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-full bg-green-100 text-green-500 flex items-center justify-center"><span className="material-symbols-outlined">payments</span></div>
                                        <div>
                                            <p className="text-xs text-slate-500">Chi phí</p>
                                            <p className="text-sm font-medium dark:text-white">{place.priceRange || "Miễn phí"}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center"><span className="material-symbols-outlined">calendar_month</span></div>
                                        <div>
                                            <p className="text-xs text-slate-500">Thời điểm tốt nhất</p>
                                            <p className="text-sm font-medium dark:text-white">{place.bestTimeVisit || "Quanh năm"}</p>
                                        </div>
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

export default DestinationDetails;