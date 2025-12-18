import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade'; // Hiệu ứng mờ dần sang trọng hơn trượt

const slides = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=1920&auto=format&fit=crop",
        title: "MASTER ENGLISH",
        subtitle: "Phương pháp học Spaced Repetition.",
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1920&auto=format&fit=crop",
        title: "STAY FOCUSED",
        subtitle: "Giao diện tối giản, hiệu quả tối đa.",
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1920&auto=format&fit=crop",
        title: "TRACK PROGRESS",
        subtitle: "Thống kê chi tiết từng ngày.",
    }
];

export default function HeroSlider() {
    return (
        <div className="w-full h-[600px]">
            <Swiper
                effect={'fade'}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{
                    clickable: true,
                    renderBullet: function (index, className) {
                        return '<span class="' + className + ' bg-white opacity-100"></span>';
                    },
                }}
                modules={[Autoplay, Pagination, EffectFade]}
                className="w-full h-full"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="relative w-full h-full">
                            {/* Ảnh nền */}
                            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />

                            {/* Lớp phủ đen để nổi chữ */}
                            <div className="absolute inset-0 bg-black/40"></div>

                            {/* Nội dung Typography */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                                <p className="text-teal-400 font-bold tracking-[0.5em] uppercase text-sm mb-4 animate-fade-in-up">
                                    Welcome to EnglishApp
                                </p>
                                <h2 className="text-7xl md:text-9xl font-black text-white tracking-tighter mb-6 leading-none">
                                    {slide.title}
                                </h2>
                                <div className="w-24 h-2 bg-teal-500 mb-8"></div>
                                <p className="text-gray-200 text-xl font-light tracking-wide max-w-2xl">
                                    {slide.subtitle}
                                </p>
                                <button className="mt-10 px-10 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-teal-500 hover:text-white transition-colors duration-300">
                                    Bắt đầu ngay
                                </button>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}