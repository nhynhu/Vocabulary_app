import { Link } from 'react-router-dom';
import HeroSlider from '../components/Slider';

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen">
            <HeroSlider />

            {/* SECTION TÍNH NĂNG: Typographic Style */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="mb-20">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
                            Phương pháp học tập
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-16">
                        {/* Feature 1 */}
                        <div className="relative">
                            <span className="text-8xl font-black text-teal-50 absolute -top-10 -left-6 -z-10 select-none">01</span>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 border-l-4 border-teal-400 pl-4">
                                Spaced Repetition
                            </h3>
                            <p className="text-gray-500 leading-relaxed pl-5">
                                Hệ thống tự động tính toán thời gian lặp lại từ vựng để tối ưu hóa trí nhớ dài hạn của bạn.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="relative">
                            <span className="text-8xl font-black text-teal-50 absolute -top-10 -left-6 -z-10 select-none">02</span>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 border-l-4 border-teal-400 pl-4">
                                Focused Learning
                            </h3>
                            <p className="text-gray-500 leading-relaxed pl-5">
                                Giao diện tinh giản, loại bỏ mọi yếu tố gây nhiễu để bạn tập trung hoàn toàn vào kiến thức.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="relative">
                            <span className="text-8xl font-black text-teal-50 absolute -top-10 -left-6 -z-10 select-none">03</span>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 border-l-4 border-teal-400 pl-4">
                                Smart Tracking
                            </h3>
                            <p className="text-gray-500 leading-relaxed pl-5">
                                Theo dõi tiến độ chi tiết qua các con số thống kê thực tế, không màu mè hoa mỹ.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION THỐNG KÊ: Nền Teal tươi sáng */}
            <section className="py-20 bg-teal-500 text-white">
                <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                    <div>
                        <div className="text-5xl font-black mb-2">10K</div>
                        <div className="text-teal-100 font-medium text-sm tracking-widest uppercase">Học viên</div>
                    </div>
                    <div>
                        <div className="text-5xl font-black mb-2">50+</div>
                        <div className="text-teal-100 font-medium text-sm tracking-widest uppercase">Chủ đề</div>
                    </div>
                    <div>
                        <div className="text-5xl font-black mb-2">1M</div>
                        <div className="text-teal-100 font-medium text-sm tracking-widest uppercase">Từ vựng</div>
                    </div>
                    <div>
                        <div className="text-5xl font-black mb-2">4.9</div>
                        <div className="text-teal-100 font-medium text-sm tracking-widest uppercase">Đánh giá</div>
                    </div>
                </div>
            </section>

            {/* CALL TO ACTION */}
            <section className="py-24 bg-white text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Sẵn sàng để bắt đầu?</h2>
                <Link
                    to="/courses"
                    className="inline-block px-10 py-4 bg-teal-500 text-white font-bold tracking-wide hover:bg-teal-600 transition-colors shadow-lg shadow-teal-200"
                >
                    XEM KHÓA HỌC NGAY
                </Link>
            </section>
        </div>
    );
}