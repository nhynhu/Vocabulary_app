import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const TopicCard = ({ title, img, text, link, wordCount, topicId }) => {
  const navigate = useNavigate();

  const handleLearnClick = () => {
    // SỬA LỖI: Sử dụng topicId để navigate thay vì link
    if (topicId) {
      navigate(`/lessons?topicId=${topicId}`);
    } else if (link) {
      navigate(link);
    } else {
      console.error('No topicId or link provided');
    }
  };

  return (
    <Card className="h-100 shadow-sm topic-card">
      <Card.Img
        variant="top"
        src={img}
        alt={title}
        style={{ height: '200px', objectFit: 'cover', backgroundColor: '#f8f9fa' }}
        onLoad={() => {
          console.log(`✅ Image loaded successfully: ${img}`);
        }}
        onError={(e) => {
          console.error(`❌ Image failed to load: ${img}`);

          // SỬA LỖI: Debug chain để tìm URL đúng
          const originalSrc = e.target.getAttribute('data-original-src') || img;

          if (!e.target.src.includes('localhost:3000')) {
            // Nếu chưa có localhost:3000, thêm vào
            console.log('🔄 Trying with localhost:3000...');
            e.target.src = `http://localhost:3000${originalSrc}`;
            e.target.setAttribute('data-original-src', originalSrc);
          } else if (!e.target.src.includes('default-topic')) {
            // Nếu đã có localhost:3000 nhưng vẫn lỗi, dùng default
            console.log('🔄 Trying default image...');
            e.target.src = 'http://localhost:3000/uploads/default-topic.jpg';
          } else {
            // Nếu default cũng lỗi, tạo placeholder
            console.log('🔄 Creating fallback placeholder...');
            e.target.style.backgroundColor = '#3498db';
            e.target.style.color = 'white';
            e.target.style.display = 'flex';
            e.target.style.alignItems = 'center';
            e.target.style.justifyContent = 'center';
            e.target.alt = title;
          }
        }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="text-primary">{title}</Card.Title>
        <Card.Text className="text-muted flex-grow-1">
          {text}
          {wordCount && (
            <><br /><small className="text-info">{wordCount} từ vựng</small></>
          )}
        </Card.Text>
        <Button
          variant="primary"
          className="mt-auto"
          onClick={handleLearnClick}
        >
          Learn
        </Button>
      </Card.Body>
    </Card>
  );
};

export default TopicCard;