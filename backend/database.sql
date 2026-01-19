-- Tạo database
CREATE DATABASE IF NOT EXISTS english_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE english_app;

-- ==================== AUTH ====================
CREATE TABLE IF NOT EXISTS `User` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'USER',
    PRIMARY KEY (`id`),
    UNIQUE INDEX `User_email_key` (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ==================== CONTENT ====================
CREATE TABLE IF NOT EXISTS `Topic` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Vocabulary` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `word` VARCHAR(191) NOT NULL,
    `ipa` VARCHAR(191) NULL,
    `audioUrl` VARCHAR(191) NULL,
    `imageUrl` VARCHAR(191) NULL,
    `meaning` VARCHAR(191) NOT NULL,
    `exampleSentence` TEXT NULL,
    `exampleMeaning` TEXT NULL,
    `topicId` INT NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `Vocabulary_topicId_idx` (`topicId`),
    CONSTRAINT `Vocabulary_topicId_fkey` FOREIGN KEY (`topicId`) REFERENCES `Topic`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Test` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `topicId` INT NOT NULL,
    `maxScore` INT NOT NULL DEFAULT 100,
    PRIMARY KEY (`id`),
    INDEX `Test_topicId_idx` (`topicId`),
    CONSTRAINT `Test_topicId_fkey` FOREIGN KEY (`topicId`) REFERENCES `Topic`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Question` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(500) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `answers` JSON NOT NULL,
    `correctAnswer` VARCHAR(191) NOT NULL,
    `difficulty` INT NOT NULL DEFAULT 1,
    `relatedVocabId` INT NULL,
    `testId` INT NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `Question_testId_idx` (`testId`),
    CONSTRAINT `Question_testId_fkey` FOREIGN KEY (`testId`) REFERENCES `Test`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ==================== LEARNING ====================
CREATE TABLE IF NOT EXISTS `UserVocabulary` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `userId` INT NOT NULL,
    `vocabId` INT NOT NULL,
    `errorCount` INT NOT NULL DEFAULT 0,
    `isMarked` BOOLEAN NOT NULL DEFAULT false,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `UserVocabulary_userId_vocabId_key` (`userId`, `vocabId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `UserTopicProgress` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `userId` INT NOT NULL,
    `topicId` INT NOT NULL,
    `isCompleted` BOOLEAN NOT NULL DEFAULT false,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `UserTopicProgress_userId_topicId_key` (`userId`, `topicId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `TestAttempt` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `userId` INT NOT NULL,
    `testId` INT NOT NULL,
    `score` INT NOT NULL,
    `flaggedQuestions` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ==================== SAMPLE DATA (Optional) ====================
-- Tạo user admin mẫu (password: admin123)
-- INSERT INTO `User` (`email`, `password`, `fullName`, `role`) 
-- VALUES ('admin@example.com', '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'Admin', 'ADMIN');
