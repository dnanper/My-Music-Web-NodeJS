# Music Project

A full-stack music management and streaming application. Users can upload, browse, and manage songs, create playlists, and mark favorites. Built with React, Node.js/Express, and MySQL, and fully containerized with Docker.

## Features

- User authentication
- Upload and stream music files
- Browse and search songs
- Create and manage playlists
- Mark songs as favorites
- Responsive web interface

## Tech Stack

- **Frontend:** React (Create React App)
- **Backend:** Node.js, Express
- **Database:** MySQL
- **Containerization:** Docker, Docker Compose

## Project Structure

- `client/` – React frontend
- `server/` – Express backend API
- `database/` – SQL schema and migrations
- `uploads/` – Uploaded music and images

## Database Schema

- **users**: User accounts (id, username, email, password_hash, created_at)
- **songs**: Song metadata and file paths (id, title, artist, file_path, genre, uploaded_by, uploaded_at)
- **favorites**: User-song favorites (id, user_id, song_id, added_at)
- **playlists**: User playlists (id, user_id, name, created_at)
- **playlist_songs**: Songs in playlists (id, playlist_id, song_id, user_id, added_at)

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

### Quick Start (Docker Compose)

1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd musicproject
   ```
2. Start all services:
   ```sh
   docker-compose up --build
   ```
3. Access the app:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000/api](http://localhost:5000/api)
   - MySQL: localhost:3307 (user: `user`, password: `userpassword`)

### Manual Setup

#### Backend

```sh
cd server
npm install
npm start
```

#### Frontend

```sh
cd client
npm install
npm start
```

#### Database

- Import `database/init.sql` into your MySQL instance.

## Environment Variables

- See `docker-compose.yml` for all environment variables and default credentials.

## Sample Files

- Place music files in `server/uploads/songs/`.
- Default images in `uploads/images/`.

## License

This project is licensed under the ISC License (see `server/package.json`).
