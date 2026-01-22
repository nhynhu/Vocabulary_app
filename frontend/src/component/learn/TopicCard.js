import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const TopicCard = ({ title, img, text, topicId }) => {
  const navigate = useNavigate();

  const handleLearnClick = () => {
    if (topicId) {
      // Luôn chuyển về flashcard để component đó xử lý redirect
      navigate(`/flashcard?topicId=${topicId}`);
    }
  };

  return (
    <Card className="h-100 shadow-sm topic-card">
      <Card.Img
        variant="top"
        src={img}
        alt={title}
        style={{ height: '200px', objectFit: 'cover', backgroundColor: '#f8f9fa' }}
        onError={(e) => {
          e.target.src = '/image/topic-default.jpg';
        }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="text-primary">{title}</Card.Title>
        <Card.Text className="text-muted flex-grow-1">
          {text}
        </Card.Text>
        <Button
          variant="primary"
          className="mt-auto"
          onClick={handleLearnClick}
        >
          Học ngay
        </Button>
      </Card.Body>
    </Card>
  );
};

export default TopicCard;