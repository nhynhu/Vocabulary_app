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

  return (
    <>
      {/* WRAPPER BAO QUANH TOÀN MÀN HÌNH */}
      <div className="hero-wrapper">

        {/* 1. CAROUSEL NỀN */}
        <div className="bg-carousel">
          <Carousel controls={false} indicators={false} interval={4000} fade pause={false}>
            {slides.map((img, idx) => (
              <Carousel.Item key={idx}>
                <img src={img} alt="bg" className="bg-img" />
              </Carousel.Item>
            ))}
          </Carousel>
        </div>

        {/* 2. LỚP PHỦ MÀU TỐI (Để chữ trắng nổi lên) */}
        <div className="overlay"></div>

        {/* 3. NỘI DUNG CHÍNH (Chữ & Nút) */}
        <div className="hero-content">
          <h1 className="hero-title">
            Chinh Phục <span style={{ color: '#AC3B61' }}>Tiếng Anh</span> <br />
            Trong Tầm Tay
          </h1>
          <p className="hero-subtitle">
            Hơn 1000+ từ vựng, lộ trình học thông minh và hệ thống bài kiểm tra đa dạng. <br />
            Bắt đầu hành trình của bạn ngay hôm nay.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <button className="btn-glow" onClick={() => navigate('/topics')}>
              Học Ngay 🚀
            </button>
            <button className="btn-glow" style={{ background: 'transparent', border: '2px solid white', boxShadow: 'none' }} onClick={() => navigate('/test')}>
              Làm Bài Test
            </button>
          </div>
        </div>
      </div>

      {/* CÁC PHẦN DƯỚI (Features) - Nền trắng sạch sẽ */}
      <Container className="py-5">
        <div className="text-center mb-5 mt-4">
          <h2 style={{ color: '#123C69', fontWeight: '800' }}>Tại sao chọn chúng tôi?</h2>
          <div style={{ width: '50px', height: '4px', background: '#AC3B61', margin: '10px auto' }}></div>
        </div>

        <Row>
          <Col md={4} className="text-center mb-4">
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🧠</div>
            <h4 style={{ fontWeight: 'bold', color: '#333' }}>Ghi nhớ lâu hơn</h4>
            <p className="text-muted">Phương pháp lặp lại ngắt quãng giúp não bộ khắc sâu từ vựng.</p>
          </Col>
          <Col md={4} className="text-center mb-4">
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🎮</div>
            <h4 style={{ fontWeight: 'bold', color: '#333' }}>Vừa học vừa chơi</h4>
            <p className="text-muted">Hệ thống bài tập dạng game giúp việc học không nhàm chán.</p>
          </Col>
          <Col md={4} className="text-center mb-4">
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📱</div>
            <h4 style={{ fontWeight: 'bold', color: '#333' }}>Mọi lúc mọi nơi</h4>
            <p className="text-muted">Học trên điện thoại, máy tính bảng hay laptop bất cứ khi nào bạn rảnh.</p>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default HomeContent;