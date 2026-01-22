
-- 1. TẠO DATABASE (Thiết lập chuẩn UTF8MB4 ngay từ đầu để hỗ trợ Emoji/Tiếng Việt)
CREATE DATABASE IF NOT EXISTS english_app 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE english_app;

-- =======================================================
-- GROUP 1: AUTHENTICATION (Người dùng)
-- =======================================================
CREATE TABLE User (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fullName VARCHAR(255),
    avt TEXT,
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',-- Dùng ENUM rõ ràng hơn VARCHAR
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =======================================================
-- GROUP 2: CORE CONTENT (Nội dung học)
-- =======================================================
CREATE TABLE Topic (
    topicId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    imgURL TEXT -- Thêm ảnh cho topic cho đẹp app
);

CREATE TABLE Vocabulary (
    vocabId INT AUTO_INCREMENT PRIMARY KEY,
    topicId INT NOT NULL,
    word VARCHAR(255) NOT NULL,
    meaning VARCHAR(255) NOT NULL,
    ipa VARCHAR(100),
    audioURL TEXT,
    imgURL TEXT,
    exampleSentence TEXT,
    exampleMeaning TEXT,
    
    -- Khóa ngoại: Xóa Topic thì xóa luôn từ vựng thuộc về nó
    FOREIGN KEY (topicId) REFERENCES Topic(topicId) ON DELETE CASCADE
);

-- =======================================================
-- GROUP 3: TESTING SYSTEM (Bài kiểm tra)
-- =======================================================
CREATE TABLE Test (
    testId INT AUTO_INCREMENT PRIMARY KEY,
    topicId INT NOT NULL,
     imgURL TEXT,
    title VARCHAR(255),      -- Tên bài test (VD: "Ôn tập Topic 1")
    maxScore INT DEFAULT 100,
    timeLimit INT DEFAULT 0, -- Thời gian làm bài (phút), 0 là không giới hạn
    
    FOREIGN KEY (topicId) REFERENCES Topic(topicId) ON DELETE CASCADE
);

CREATE TABLE Question (
    questionId INT AUTO_INCREMENT PRIMARY KEY,
    testId INT NOT NULL,
    relatedVocabId INT,      -- Câu hỏi này liên quan đến từ vựng nào (optional)
    content TEXT NOT NULL,
    type ENUM('CHOICE', 'FILL', 'MATCH') DEFAULT 'CHOICE',
    answers JSON NOT NULL,   -- Lưu mảng đáp án: ["A", "B", "C", "D"]
    correctAnswer VARCHAR(255) NOT NULL,

    FOREIGN KEY (testId) REFERENCES Test(testId) ON DELETE CASCADE,
    FOREIGN KEY (relatedVocabId) REFERENCES Vocabulary(vocabId) ON DELETE SET NULL
);

-- =======================================================
-- GROUP 4: USER PROGRESS (Tiến độ học tập)
-- =======================================================
-- Lưu trạng thái từng từ vựng của user (Đã thuộc chưa, sai bao nhiêu lần)
CREATE TABLE UserVocabulary (
    userVocabId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    vocabId INT NOT NULL,
    isMarked BOOLEAN DEFAULT FALSE,-- Đánh dấu từ này để ôn tập sau
    errorCount INT DEFAULT 0,         -- Số lần trả lời sai từ này
    lastReviewedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Một user chỉ có 1 dòng dữ liệu cho 1 từ vựng
    UNIQUE(userId, vocabId),
    FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE,
    FOREIGN KEY (vocabId) REFERENCES Vocabulary(vocabId) ON DELETE CASCADE
);

-- Lưu tiến độ Topic (User đã học xong Topic nào)
CREATE TABLE UserTopicProgress (
    userId INT NOT NULL,
    topicId INT NOT NULL,
    completionPercentage INT DEFAULT 0, -- Phần trăm hoàn thành Topic
    isCompleted BOOLEAN DEFAULT FALSE,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (userId, topicId), -- Khóa chính phức hợp
    FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE,
    FOREIGN KEY (topicId) REFERENCES Topic(topicId) ON DELETE CASCADE
);

-- Lịch sử làm bài kiểm tra
CREATE TABLE TestAttempt (
    testAttemptId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    testId INT NOT NULL,
    score INT NOT NULL,
    details JSON, -- Lưu chi tiết (câu nào đúng/sai) để hiện lại review
    
    FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE,
    FOREIGN KEY (testId) REFERENCES Test(testId) ON DELETE CASCADE
);