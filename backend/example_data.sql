USE english_app;

-- Tắt kiểm tra khóa ngoại để reset dữ liệu dễ dàng
SET FOREIGN_KEY_CHECKS = 0;

-- =======================================================
-- 1. INSERT USERS
-- =======================================================
INSERT INTO User (email, password, fullName, role, avt) VALUES 
('admin@englishapp.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPG3qlatC', 'System Admin', 'ADMIN', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop'),
('student@gmail.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPG3qlatC', 'Nguyễn Yến Như', 'USER', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop');

-- =======================================================
-- 2. INSERT TOPICS (4 Chủ đề: Animals, Travel, Food, Technology)
-- =======================================================
INSERT INTO Topic (topicId, name, imgURL) VALUES 
(1, 'Animals (Động vật)', 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=500'),
(2, 'Travel (Du lịch)', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500'),
(3, 'Food & Drinks (Ẩm thực)', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500'),
(4, 'Technology (Công nghệ)', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500');

-- =======================================================
-- 3. INSERT VOCABULARY (Ảnh thật, IPA chuẩn)
-- =======================================================

-- >> TOPIC 1: ANIMALS
INSERT INTO Vocabulary (topicId, word, meaning, ipa, audioURL, imgURL, exampleSentence, exampleMeaning) VALUES 
(1, 'Elephant', 'Con voi', '/ˈel.ɪ.fənt/', 'audio/elephant.mp3', 'https://images.unsplash.com/photo-1557050543-4d5f4e64185f?w=500', 'The elephant has a very long trunk.', 'Con voi có cái vòi rất dài.'),
(1, 'Tiger', 'Con hổ', '/ˈtaɪ.ɡər/', 'audio/tiger.mp3', 'https://images.unsplash.com/photo-1505521377774-103a8cc49715?w=500', 'The tiger is hunting in the jungle.', 'Con hổ đang săn mồi trong rừng.'),
(1, 'Eagle', 'Đại bàng', '/ˈiː.ɡəl/', 'audio/eagle.mp3', 'https://images.unsplash.com/photo-1611000378036-70e176b502c1?w=500', 'Eagles have incredibly sharp eyesight.', 'Đại bàng có thị lực cực kỳ sắc bén.'),
(1, 'Panda', 'Gấu trúc', '/ˈpæn.də/', 'audio/panda.mp3', 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=500', 'Pandas love eating bamboo.', 'Gấu trúc rất thích ăn tre.'),
(1, 'Dolphin', 'Cá heo', '/ˈdɒl.fɪn/', 'audio/dolphin.mp3', 'https://images.unsplash.com/photo-1607153333879-c174d265f1d2?w=500', 'Dolphins are known for their intelligence.', 'Cá heo nổi tiếng vì sự thông minh của chúng.');

-- >> TOPIC 2: TRAVEL
INSERT INTO Vocabulary (topicId, word, meaning, ipa, audioURL, imgURL, exampleSentence, exampleMeaning) VALUES 
(2, 'Passport', 'Hộ chiếu', '/ˈpɑːs.pɔːt/', 'audio/passport.mp3', 'https://images.unsplash.com/photo-1544296877-695d85203303?w=500', 'Do not forget to bring your passport.', 'Đừng quên mang theo hộ chiếu của bạn.'),
(2, 'Luggage', 'Hành lý', '/ˈlʌɡ.ɪdʒ/', 'audio/luggage.mp3', 'https://images.unsplash.com/photo-1565514020176-88899805cb36?w=500', 'My luggage is too heavy to carry.', 'Hành lý của tôi quá nặng để mang theo.'),
(2, 'Airport', 'Sân bay', '/ˈeə.pɔːt/', 'audio/airport.mp3', 'https://images.unsplash.com/photo-1436491865332-7a615109cc05?w=500', 'We arrived at the airport two hours early.', 'Chúng tôi đến sân bay sớm hai tiếng.'),
(2, 'Destination', 'Điểm đến', '/ˌdes.tɪˈneɪ.ʃən/', 'audio/destination.mp3', 'https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=500', 'Paris is a popular tourist destination.', 'Paris là một điểm đến du lịch phổ biến.'),
(2, 'Souvenir', 'Quà lưu niệm', '/ˌsuː.vənˈɪər/', 'audio/souvenir.mp3', 'https://images.unsplash.com/photo-1555433246-444e73117565?w=500', 'I bought a small statue as a souvenir.', 'Tôi đã mua một bức tượng nhỏ làm quà lưu niệm.');

-- >> TOPIC 3: FOOD & DRINKS
INSERT INTO Vocabulary (topicId, word, meaning, ipa, audioURL, imgURL, exampleSentence, exampleMeaning) VALUES 
(3, 'Delicious', 'Ngon miệng', '/dɪˈlɪʃ.əs/', 'audio/delicious.mp3', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500', 'This pizza looks absolutely delicious.', 'Cái bánh pizza này trông cực kỳ ngon.'),
(3, 'Coffee', 'Cà phê', '/ˈkɒf.i/', 'audio/coffee.mp3', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500', 'I need a cup of coffee to wake up.', 'Tôi cần một tách cà phê để tỉnh táo.'),
(3, 'Vegetable', 'Rau củ', '/ˈvedʒ.tə.bəl/', 'audio/vegetable.mp3', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500', 'You should eat more fresh vegetables.', 'Bạn nên ăn nhiều rau củ tươi hơn.'),
(3, 'Recipe', 'Công thức nấu ăn', '/ˈres.ɪ.pi/', 'audio/recipe.mp3', 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=500', 'Can you share your cake recipe with me?', 'Bạn có thể chia sẻ công thức làm bánh với tôi không?'),
(3, 'Spicy', 'Cay', '/ˈspaɪ.si/', 'audio/spicy.mp3', 'https://images.unsplash.com/photo-1568288523368-80e227a92c01?w=500', 'I love spicy food like Kimchi.', 'Tôi thích đồ ăn cay như Kimchi.');

-- >> TOPIC 4: TECHNOLOGY (Liên quan đến ngành học của user)
INSERT INTO Vocabulary (topicId, word, meaning, ipa, audioURL, imgURL, exampleSentence, exampleMeaning) VALUES 
(4, 'Computer', 'Máy tính', '/kəmˈpjuː.tər/', 'audio/computer.mp3', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500', 'She spends all day working on her computer.', 'Cô ấy dành cả ngày làm việc trên máy tính.'),
(4, 'Software', 'Phần mềm', '/ˈsɒft.weər/', 'audio/software.mp3', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500', 'This software helps manage projects efficiently.', 'Phần mềm này giúp quản lý dự án hiệu quả.'),
(4, 'Database', 'Cơ sở dữ liệu', '/ˈdeɪ.tə.beɪs/', 'audio/database.mp3', 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=500', 'We need to update the customer database.', 'Chúng ta cần cập nhật cơ sở dữ liệu khách hàng.'),
(4, 'Keyboard', 'Bàn phím', '/ˈkiː.bɔːd/', 'audio/keyboard.mp3', 'https://images.unsplash.com/photo-1587829741301-dc798b91a45e?w=500', 'Mechanical keyboards are very popular now.', 'Bàn phím cơ hiện nay rất phổ biến.'),
(4, 'Internet', 'Mạng Internet', '/ˈɪn.tə.net/', 'audio/internet.mp3', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500', 'The internet has changed how we communicate.', 'Internet đã thay đổi cách chúng ta giao tiếp.');

-- =======================================================
-- 4. INSERT TESTS
-- =======================================================
INSERT INTO Test (testId, topicId, title, maxScore, timeLimit, imgURL) VALUES 
(1, 1, 'Quiz: Thế giới động vật', 100, 15, 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=500'),
(2, 2, 'Quiz: Từ vựng sân bay', 50, 10, 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=500'),
(3, 4, 'Quiz: Công nghệ thông tin', 100, 20, 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500');

-- =======================================================
-- 5. INSERT QUESTIONS (Thêm nhiều câu hỏi đa dạng)
-- =======================================================
INSERT INTO Question (testId, relatedVocabId, content, type, answers, correctAnswer) VALUES 
-- Bài Test 1 (Animals)
(1, 1, 'Which animal has a trunk?', 'CHOICE', '["Tiger", "Elephant", "Eagle", "Cat"]', 'Elephant'),
(1, 2, 'Tigers have _______ on their fur.', 'CHOICE', '["Spots", "Stripes", "Squares", "None"]', 'Stripes'),
(1, 3, 'An eagle is a type of _______.', 'CHOICE', '["Fish", "Bird", "Mammal", "Insect"]', 'Bird'),
(1, 4, 'Pandas mostly eat _______.', 'FILL', '[]', 'Bamboo'),

-- Bài Test 3 (Technology)
(3, 16, 'What do you use to type on a computer?', 'CHOICE', '["Mouse", "Screen", "Keyboard", "Speaker"]', 'Keyboard'),
(3, 17, 'What does a programmer write?', 'CHOICE', '["Novels", "Code", "Paintings", "Music"]', 'Code'),
(3, 18, 'SQL is used for querying a _______.', 'FILL', '[]', 'Database');

-- =======================================================
-- 6. INSERT PROGRESS (Dữ liệu học tập mẫu)
-- =======================================================
-- User 2 đã học một số từ vựng
INSERT INTO UserVocabulary (userId, vocabId, isMarked, errorCount) VALUES 
(2, 1, TRUE, 5),  -- Elephant: Rất hay quên
(2, 2, FALSE, 0), -- Tiger: Đã thuộc
(2, 16, TRUE, 2), -- Computer: Hay nhầm
(2, 18, FALSE, 1); -- Database: Tạm ổn

-- User 2 tiến độ các Topic
INSERT INTO UserTopicProgress (userId, topicId, completionPercentage, isCompleted) VALUES 
(2, 1, 80, FALSE), -- Animals: Gần xong
(2, 2, 0, FALSE),  -- Travel: Chưa học
(2, 4, 30, FALSE); -- Tech: Mới bắt đầu

-- Lịch sử làm bài
INSERT INTO TestAttempt (userId, testId, score, details) VALUES 
(2, 1, 75, '[{"q":1,"correct":true}, {"q":2,"correct":false}, {"q":3,"correct":true}, {"q":4,"correct":true}]'),
(2, 3, 100, '[{"q":1,"correct":true}, {"q":2,"correct":true}, {"q":3,"correct":true}]');

-- Bật lại kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 1;

SELECT 'DATA IMPORTED WITH REAL IMAGES & EXTENDED VOCABULARY' AS Status;