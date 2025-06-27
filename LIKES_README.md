# Album Likes API

## Overview

API untuk menyukai atau membatalkan menyukai album, serta melihat jumlah yang menyukai album.

## API Endpoints

### 1. Like Album

- **Method**: POST
- **URL**: `/albums/{id}/likes`
- **Headers**:
  - `Authorization: Bearer <access_token>`
- **Body**: (empty)

**Response**:

- **Status Code**: 201
- **Body**:
  ```json
  {
    "status": "success",
    "message": "Album berhasil disukai"
  }
  ```

### 2. Unlike Album

- **Method**: DELETE
- **URL**: `/albums/{id}/likes`
- **Headers**:
  - `Authorization: Bearer <access_token>`

**Response**:

- **Status Code**: 200
- **Body**:
  ```json
  {
    "status": "success",
    "message": "Album batal disukai"
  }
  ```

### 3. Get Album Likes Count

- **Method**: GET
- **URL**: `/albums/{id}/likes`

**Response**:

- **Status Code**: 200
- **Body**:
  ```json
  {
    "status": "success",
    "data": {
      "likes": 5
    }
  }
  ```

## Requirements

- **Authentication**: Required untuk POST dan DELETE endpoint
- **Resource Strict**: User hanya bisa menyukai album yang sama sebanyak 1 kali
- **Error Handling**: Return 400 jika user mencoba menyukai album yang sama

## Database Schema

Tabel `user_album_likes`:

```sql
CREATE TABLE user_album_likes (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  album_id VARCHAR(50) NOT NULL,
  UNIQUE(user_id, album_id),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE
);
```

## Features

- ✅ Menyukai album (authenticated)
- ✅ Membatalkan menyukai album (authenticated)
- ✅ Melihat jumlah likes (public)
- ✅ Validasi resource strict (1 user = 1 like per album)
- ✅ Foreign key constraints untuk data integrity
- ✅ Unique constraint untuk mencegah duplicate likes

## Error Responses

- **Album not found**: 404 Not Found
- **Already liked**: 400 Bad Request ("Album sudah disukai sebelumnya")
- **Unlike failed**: 400 Bad Request ("Gagal batal menyukai album")
- **Unauthorized**: 401 Unauthorized
