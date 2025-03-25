CREATE DATABASE IF NOT EXISTS music_db;
USE music_db;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `songs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` longtext,
  `artist` longtext,
  `file_path` longtext,
  `genre` longtext,
  `uploaded_by` int DEFAULT NULL,
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `uploaded_by` (`uploaded_by`),
  CONSTRAINT `songs_ibfk_1` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `favorites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `song_id` int NOT NULL,
  `added_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_favorite` (`user_id`, `song_id`),
  KEY `song_id` (`song_id`),
  CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`song_id`) REFERENCES `songs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `playlists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_playlist_per_user` (`user_id`, `name`),
  CONSTRAINT `playlists_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `playlist_songs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `playlist_id` int NOT NULL,
  `song_id` int NOT NULL,
  `added_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_playlist_song` (`playlist_id`, `song_id`),
  KEY `song_id` (`song_id`),
  KEY `fk_playlist_user` (`user_id`),
  CONSTRAINT `fk_playlist_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `playlist_songs_ibfk_1` FOREIGN KEY (`playlist_id`) REFERENCES `playlists` (`id`) ON DELETE CASCADE,
  CONSTRAINT `playlist_songs_ibfk_2` FOREIGN KEY (`song_id`) REFERENCES `songs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
