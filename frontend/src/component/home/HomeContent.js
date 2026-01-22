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
    { title: 'Ghi nhớ lâu hơn', desc: 'Sử dụng nhiều phương pháp học tập khác nhau để tăng hiệu quả ghi nhớ.' },
    { title: 'Vừa học vừa chơi', desc: 'Hệ thống học tập dạng game giúp việc học không nhàm chán.' },
    { title: 'Miễn phí hoàn toàn', desc: 'Sử dụng tất cả các tính năng mà không mất phí.' },
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
            Đừng học vẹt<br />
            <br />
            Hãy làm trùm tiếng Anh
          </h1>
          <p className="hero-subtitle">
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

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#123C69', color: 'white', padding: '50px 0 30px' }}>
        <Container>
          <Row>
            {/* Logo & Giới thiệu */}
            <Col lg={4} md={6} className="mb-4">
              <h4 style={{ fontWeight: '800', marginBottom: '20px' }}>
                <span style={{ color: '#AC3B61' }}>VOCAB</span>MAFIA
              </h4>
              <p style={{ opacity: 0.8, lineHeight: 1.8 }}>
                Nền tảng học tiếng Anh trực tuyến hàng đầu với phương pháp học hiện đại và hiệu quả.
              </p>
            </Col>

            {/* Liên kết */}
            <Col lg={2} md={6} className="mb-4">
              <h5 style={{ fontWeight: '700', marginBottom: '20px' }}>Liên kết</h5>
              <ul style={{ listStyle: 'none', padding: 0, opacity: 0.8 }}>
                <li style={{ marginBottom: '10px', cursor: 'pointer' }} onClick={() => navigate('/')}>Trang chủ</li>
                <li style={{ marginBottom: '10px', cursor: 'pointer' }} onClick={() => navigate('/topics')}>Học tập</li>
                <li style={{ marginBottom: '10px', cursor: 'pointer' }} onClick={() => navigate('/test')}>Kiểm tra</li>
              </ul>
            </Col>

            {/* Liên hệ */}
            <Col lg={3} md={6} className="mb-4">
              <h5 style={{ fontWeight: '700', marginBottom: '20px' }}>Liên hệ</h5>
              <ul style={{ listStyle: 'none', padding: 0, opacity: 0.8 }}>
                <li style={{ marginBottom: '10px' }}>📍 123 Đường ABC, Trà Vinh</li>
                <li style={{ marginBottom: '10px' }}>📞 0123 456 789</li>
                <li style={{ marginBottom: '10px' }}>✉️ contact@vocabmafia.com</li>
              </ul>
            </Col>

            {/* Mạng xã hội */}
            <Col lg={3} md={6} className="mb-4">
              <h5 style={{ fontWeight: '700', marginBottom: '20px' }}>Theo dõi chúng tôi</h5>
              <div style={{ display: 'flex', gap: '15px' }}>
                <a href="/" target="_blank" rel="noopener noreferrer" 
                   style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', textDecoration: 'none' }}>

                </a>
                <a href="/" target="_blank" rel="noopener noreferrer"
                   style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', textDecoration: 'none' }}>
                  
                </a>
                <a href="/" target="_blank" rel="noopener noreferrer"
                   style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', textDecoration: 'none' }}>
                  
                </a>
              </div>
            </Col>
          </Row>

          {/* Copyright */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '30px', paddingTop: '20px', textAlign: 'center', opacity: 0.7 }}>
            <p style={{ margin: 0 }}>© 2026 VocabMafia. All rights reserved.</p>
          </div>
        </Container>
      </footer>
    </>
  );
};

export default HomeContent;