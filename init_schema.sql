
-- Manual Migration Script
-- Simple News Feed System
-- Database: simple_news_feed_system

-- 1Create Database
DROP DATABASE IF EXISTS simple_news_feed_system;
CREATE DATABASE simple_news_feed_system;

-- Switch to the new database
\c simple_news_feed_system;

-- Table: users
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Table: posts
CREATE TABLE posts (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) <= 200),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  CONSTRAINT fk_posts_user FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- Table: follows
CREATE TABLE follows (
  follower_id BIGINT NOT NULL,
  followee_id BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  CONSTRAINT fk_follower FOREIGN KEY (follower_id)
    REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_followee FOREIGN KEY (followee_id)
    REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  PRIMARY KEY (follower_id, followee_id)
);

-- Optional Indexes for Performance
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_followee_id ON follows(followee_id);
