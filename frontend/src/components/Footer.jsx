export default function Footer() {
    return (
        // Dùng nền bg-teal-50 (Màu Mint cực nhạt) -> Khác biệt với nền trắng nhưng rất sáng
        <footer className="bg-teal-50 border-t border-teal-100 py-16 mt-auto">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">

                {/* BRAND: Logo vẫn dùng màu Teal đậm để nổi trên nền nhạt */}
                <div className="col-span-1 md:col-span-2 pr-10">
                    <h2 className="text-3xl font-black tracking-tighter text-teal-600 mb-4">
                        ENGLISH.APP
                    </h2>
                    <p className="text-slate-600 font-medium leading-relaxed text-sm max-w-sm">
                        Hệ thống học từ vựng thông minh với giao diện Typography tối giản. Giúp bạn tập trung tuyệt đối vào kiến thức.
                    </p>
                </div>

                {/* COLUMN 1 */}
                <div>
                    <h4 className="text-xs font-black text-teal-800 uppercase tracking-widest mb-6">Sản phẩm</h4>
                    <ul className="space-y-4 text-sm font-bold text-slate-500 tracking-wide">
                        {/* Hover vào sẽ đổi sang màu Teal đậm */}
                        <li><a href="#" className="hover:text-teal-600 transition-colors">KHÓA HỌC</a></li>
                        <li><a href="#" className="hover:text-teal-600 transition-colors">TÍNH NĂNG</a></li>
                        <li><a href="#" className="hover:text-teal-600 transition-colors">BẢNG GIÁ</a></li>
                    </ul>
                </div>

                {/* COLUMN 2 */}
                <div>
                    <h4 className="text-xs font-black text-teal-800 uppercase tracking-widest mb-6">Công ty</h4>
                    <ul className="space-y-4 text-sm font-bold text-slate-500 tracking-wide">
                        <li><a href="#" className="hover:text-teal-600 transition-colors">VỀ CHÚNG TÔI</a></li>
                        <li><a href="#" className="hover:text-teal-600 transition-colors">LIÊN HỆ</a></li>
                        <li><a href="#" className="hover:text-teal-600 transition-colors">BẢO MẬT</a></li>
                    </ul>
                </div>
            </div>

            {/* COPYRIGHT: Đường kẻ phân cách đậm hơn nền một chút */}
            <div className="container mx-auto px-6 mt-16 pt-8 border-t border-teal-200 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 font-bold uppercase tracking-widest">
                <p>© 2025 ENGLISH APP INC.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <a href="#" className="hover:text-teal-600 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-teal-600 transition-colors">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
}   