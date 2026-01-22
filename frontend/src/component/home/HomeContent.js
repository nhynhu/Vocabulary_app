import React from 'react';
import { Carousel, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const HomeContent = () => {
  const navigate = useNavigate();

  const slides = [
    "/image/slide1.jpg",
    "/image/slide3.jpg",
    "/image/slide4.jpg"
  ];

  const features = [
    { title: 'Ghi nhớ lâu hơn', desc: 'Phương pháp lặp lại ngắt quãng giúp não bộ khắc sâu từ vựng.' },
    { title: 'Vừa học vừa chơi', desc: 'Hệ thống bài tập dạng game giúp việc học không nhàm chán.' },
    { title: 'Mọi lúc mọi nơi', desc: 'Học trên điện thoại, máy tính bảng hay laptop bất cứ khi nào bạn rảnh.' },
  ];

  return (
    <>
      {/* HERO SECTION */}
      <div className="hero-wrapper">
        <div className="bg-carousel">
          <Carousel controls={false} indicators={false} interval={4000} fade pause={false}>
            {slides.map((img, idx) => (
              <Carousel.Item key={idx}>
                <img src={img} alt="bg" className="bg-img" />
              </Carousel.Item>
            ))}
          </Carousel>
        </div>

        <div className="overlay"></div>

        <div className="hero-content">
          <h1 className="hero-title">
            Chinh Phục <span className="text-[#AC3B61]">Tiếng Anh</span> <br />
            Trong Tầm Tay
          </h1>
          <p className="hero-subtitle">
            Hơn 1000+ từ vựng, lộ trình học thông minh và hệ thống bài kiểm tra đa dạng. <br />
            Bắt đầu hành trình của bạn ngay hôm nay.
          </p>
          <div className="flex justify-center gap-4">
            <button className="btn-glow" onClick={() => navigate('/topics')}>
              Học Ngay
            </button>
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <section className="py-20 px-5 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-[#123C69] mb-4">Tại sao chọn chúng tôi?</h2>
          <div className="w-12 h-1 bg-[#AC3B61] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="text-center p-6 rounded-lg bg-gray-50">
              <h4 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h4>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default HomeContent;