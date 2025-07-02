// /* eslint-disable no-undef */
const AlbumHandler = require('../../api/albums/handler');
const ResponseFormatter = require('../../utils/ResponseFormatter');
const { SUCCESS_MESSAGES } = require('../../utils/constants');
const { describe, beforeEach, it, expect } = require('@jest/globals');

process.env.HOST = 'localhost';
process.env.PORT = '5000';

jest.setTimeout(10000);

jest.mock('../../utils/ResponseFormatter');
jest.mock('../../utils/constants', () => ({
  SUCCESS_MESSAGES: {
    ALBUM: {
      CREATED: 'Album berhasil ditambahkan',
      UPDATED: 'Album berhasil diperbarui',
      DELETED: 'Album berhasil dihapus',
      LIKED: 'Album berhasil disukai',
      UNLIKED: 'Album batal disukai'
    }
  }
}));

describe('AlbumHandler', () => {
  let albumHandler;
  let mockService;
  let mockValidator;
  let mockStorageService;
  let mockCacheService;
  let mockRequest;
  let mockH;

  beforeEach(() => {
    mockService = {
      addAlbum: jest.fn(),
      getDetailAlbum: jest.fn(),
      editAlbum: jest.fn(),
      deleteAlbum: jest.fn(),
      likeAlbum: jest.fn(),
      unlikeAlbum: jest.fn(),
      getAlbumLikes: jest.fn()
    };

    mockValidator = {
      validateAlbumPayload: jest.fn(),
      validateImageHeaders: jest.fn()
    };

    mockStorageService = {
      writeFile: jest.fn()
    };

    mockCacheService = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn()
    };

    mockH = {
      response: jest.fn().mockReturnValue({
        code: jest.fn().mockReturnThis(),
        header: jest.fn().mockReturnThis()
      })
    };

    mockRequest = {
      payload: {},
      params: {},
      auth: {
        credentials: { id: 'user-123' }
      }
    };

    albumHandler = new AlbumHandler(
      mockService,
      mockValidator,
      mockStorageService,
      mockCacheService
    );

    // Clear mocks
    jest.clearAllMocks();
  });

  describe('postAlbumHandler', () => {
    it('should create album successfully', async () => {
      const albumData = { name: 'Test Album', year: 2023 };
      const albumId = 'album-123';
      
      mockRequest.payload = albumData;
      mockService.addAlbum.mockResolvedValue(albumId);
      ResponseFormatter.created.mockReturnValue({
        status: 'success',
        message: SUCCESS_MESSAGES.ALBUM.CREATED,
        data: { albumId }
      });

      const result = await albumHandler.postAlbumHandler(mockRequest, mockH);

      expect(mockValidator.validateAlbumPayload).toHaveBeenCalledWith(albumData);
      expect(mockService.addAlbum).toHaveBeenCalledWith(albumData);
      expect(ResponseFormatter.created).toHaveBeenCalledWith(
        { albumId },
        SUCCESS_MESSAGES.ALBUM.CREATED
      );
      expect(mockH.response).toHaveBeenCalled();
      expect(result.code).toHaveBeenCalledWith(201);
    });

    it('should throw error when validation fails', async () => {
      const error = new Error('Validation failed');
      mockValidator.validateAlbumPayload.mockImplementation(() => {
        throw error;
      });

      await expect(
        albumHandler.postAlbumHandler(mockRequest, mockH)
      ).rejects.toThrow('Validation failed');
    });
  });

  describe('getDetailAlbumHandler', () => {
    it('should get album details successfully', async () => {
      const albumId = 'album-123';
      const albumData = {
        id: albumId,
        name: 'Test Album',
        year: 2023,
        songs: []
      };
      
      mockRequest.params = { id: albumId };
      mockService.getDetailAlbum.mockResolvedValue(albumData);
      ResponseFormatter.success.mockReturnValue({
        status: 'success',
        data: { album: albumData }
      });

      await albumHandler.getDetailAlbumHandler(mockRequest);

      expect(mockService.getDetailAlbum).toHaveBeenCalledWith(albumId);
      expect(ResponseFormatter.success).toHaveBeenCalledWith({ album: albumData });
    });
  });

  describe('putAlbumHandler', () => {
    it('should update album successfully', async () => {
      const albumId = 'album-123';
      const updateData = { name: 'Updated Album', year: 2024 };
      
      mockRequest.params = { id: albumId };
      mockRequest.payload = updateData;
      ResponseFormatter.success.mockReturnValue({
        status: 'success',
        message: SUCCESS_MESSAGES.ALBUM.UPDATED
      });

      await albumHandler.putAlbumHandler(mockRequest);

      expect(mockValidator.validateAlbumPayload).toHaveBeenCalledWith(updateData);
      expect(mockService.editAlbum).toHaveBeenCalledWith(albumId, updateData);
      expect(ResponseFormatter.success).toHaveBeenCalledWith(
        null,
        SUCCESS_MESSAGES.ALBUM.UPDATED
      );
    });
  });

  describe('deleteAlbumHandler', () => {
    it('should delete album successfully', async () => {
      const albumId = 'album-123';
      mockRequest.params = { id: albumId };
      ResponseFormatter.success.mockReturnValue({
        status: 'success',
        message: SUCCESS_MESSAGES.ALBUM.DELETED
      });

      await albumHandler.deleteAlbumHandler(mockRequest);

      expect(mockService.deleteAlbum).toHaveBeenCalledWith(albumId);
      expect(ResponseFormatter.success).toHaveBeenCalledWith(
        null,
        SUCCESS_MESSAGES.ALBUM.DELETED
      );
    });
  });

  describe('postUploadImageHandler', () => {
    it('should upload image successfully', async () => {
      const albumId = 'album-123';
      const filename = 'image-123.jpg';
      const coverFile = {
        hapi: {
          headers: { 'content-type': 'image/jpeg' }
        }
      };
      
      mockRequest.params = { id: albumId };
      mockRequest.payload = { cover: coverFile };
      mockStorageService.writeFile.mockResolvedValue(filename);
      ResponseFormatter.success.mockReturnValue({
        status: 'success',
        message: 'Sampul berhasil diunggah'
      });

      const result = await albumHandler.postUploadImageHandler(mockRequest, mockH);

      expect(mockValidator.validateImageHeaders).toHaveBeenCalledWith(coverFile.hapi.headers);
      expect(mockStorageService.writeFile).toHaveBeenCalledWith(coverFile, coverFile.hapi);
      expect(mockService.editAlbum).toHaveBeenCalledWith(albumId, {
        coverUrl: `http://localhost:5000/upload/${filename}`
      });
      expect(result.code).toHaveBeenCalledWith(201);
    });
  });

  describe('postAlbumLikeHandler', () => {
    it('should like album successfully', async () => {
      const albumId = 'album-123';
      const userId = 'user-123';
      
      mockRequest.params = { id: albumId };
      ResponseFormatter.success.mockReturnValue({
        status: 'success',
        message: SUCCESS_MESSAGES.ALBUM.LIKED
      });

      const result = await albumHandler.postAlbumLikeHandler(mockRequest, mockH);

      expect(mockService.likeAlbum).toHaveBeenCalledWith(albumId, userId);
      expect(mockCacheService.delete).toHaveBeenCalledWith(`album:likes:${albumId}`);
      expect(result.code).toHaveBeenCalledWith(201);
    });
  });

  describe('deleteAlbumLikeHandler', () => {
    it('should unlike album successfully', async () => {
      const albumId = 'album-123';
      const userId = 'user-123';
      
      mockRequest.params = { id: albumId };
      ResponseFormatter.success.mockReturnValue({
        status: 'success',
        message: SUCCESS_MESSAGES.ALBUM.UNLIKED
      });

      await albumHandler.deleteAlbumLikeHandler(mockRequest);

      expect(mockService.unlikeAlbum).toHaveBeenCalledWith(albumId, userId);
      expect(mockCacheService.delete).toHaveBeenCalledWith(`album:likes:${albumId}`);
    });
  });

  describe('getAlbumLikesHandler', () => {
    it('should get likes from cache successfully', async () => {
      const albumId = 'album-123';
      const likes = 5;
      
      mockRequest.params = { id: albumId };
      mockCacheService.get.mockResolvedValue(JSON.stringify(likes));
      ResponseFormatter.success.mockReturnValue({
        status: 'success',
        data: { likes }
      });

      const result = await albumHandler.getAlbumLikesHandler(mockRequest, mockH);

      expect(mockCacheService.get).toHaveBeenCalledWith(`album:likes:${albumId}`);
      expect(ResponseFormatter.success).toHaveBeenCalledWith({ likes });
      expect(result.header).toHaveBeenCalledWith('X-Data-Source', 'cache');
    });

    it('should get likes from database when cache fails', async () => {
      const albumId = 'album-123';
      const likes = 3;
      
      mockRequest.params = { id: albumId };
      mockCacheService.get.mockRejectedValue(new Error('Cache miss'));
      mockService.getAlbumLikes.mockResolvedValue(likes);
      ResponseFormatter.success.mockReturnValue({
        status: 'success',
        data: { likes }
      });

      const result = await albumHandler.getAlbumLikesHandler(mockRequest, mockH);

      expect(mockService.getAlbumLikes).toHaveBeenCalledWith(albumId);
      expect(mockCacheService.set).toHaveBeenCalledWith(
        `album:likes:${albumId}`,
        JSON.stringify(likes),
        1800
      );
      expect(result.header).toHaveBeenCalledWith('X-Data-Source', 'database');
    });
  });
});