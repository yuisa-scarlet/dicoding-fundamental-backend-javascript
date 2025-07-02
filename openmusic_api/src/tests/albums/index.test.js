const albumsPlugin = require('../../api/albums/index');
const AlbumHandler = require('../../api/albums/handler');
const routes = require('../../api/albums/routes');
const { describe, beforeEach, it, expect } = require('@jest/globals');

jest.mock('../../api/albums/handler');
jest.mock('../../api/albums/routes');

describe('Albums Plugin', () => {
  let mockServer;
  let mockService;
  let mockValidator;
  let mockStorageService;
  let mockCacheService;
  let mockRoutes;

  beforeEach(() => {
    mockServer = {
      route: jest.fn()
    };

    mockService = {
      addAlbum: jest.fn(),
      getDetailAlbum: jest.fn(),
      editAlbum: jest.fn(),
      deleteAlbum: jest.fn()
    };

    mockValidator = {
      validateAlbumPayload: jest.fn()
    };

    mockStorageService = {
      writeFile: jest.fn()
    };

    mockCacheService = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn()
    };

    mockRoutes = [
      {
        method: 'POST',
        path: '/albums',
        handler: jest.fn()
      },
      {
        method: 'GET',
        path: '/albums/{id}',
        handler: jest.fn()
      }
    ];

    AlbumHandler.mockImplementation(() => ({
      postAlbumHandler: jest.fn(),
      getDetailAlbumHandler: jest.fn(),
      putAlbumHandler: jest.fn(),
      deleteAlbumHandler: jest.fn(),
      postUploadImageHandler: jest.fn(),
      postAlbumLikeHandler: jest.fn(),
      deleteAlbumLikeHandler: jest.fn(),
      getAlbumLikesHandler: jest.fn()
    }));

    routes.mockReturnValue(mockRoutes);

    jest.clearAllMocks();
  });

  describe('Plugin Properties', () => {
    it('should have correct plugin name', () => {
      expect(albumsPlugin.name).toBe('albums');
    });

    it('should have correct plugin version', () => {
      expect(albumsPlugin.version).toBe('1.0.0');
    });

    it('should have register function', () => {
      expect(typeof albumsPlugin.register).toBe('function');
    });
  });

  describe('Plugin Registration', () => {
    it('should register plugin successfully with all dependencies', async () => {
      
      const options = {
        service: mockService,
        validator: mockValidator,
        storageService: mockStorageService,
        cacheService: mockCacheService
      };

      
      await albumsPlugin.register(mockServer, options);

      
      expect(AlbumHandler).toHaveBeenCalledWith(
        mockService,
        mockValidator,
        mockStorageService,
        mockCacheService
      );
      expect(AlbumHandler).toHaveBeenCalledTimes(1);
      expect(routes).toHaveBeenCalledTimes(1);
      expect(mockServer.route).toHaveBeenCalledWith(mockRoutes);
      expect(mockServer.route).toHaveBeenCalledTimes(1);
    });

    it('should create AlbumHandler instance with correct parameters', async () => {
      
      const options = {
        service: mockService,
        validator: mockValidator,
        storageService: mockStorageService,
        cacheService: mockCacheService
      };

      
      await albumsPlugin.register(mockServer, options);

      
      expect(AlbumHandler).toHaveBeenCalledWith(
        options.service,
        options.validator,
        options.storageService,
        options.cacheService
      );
    });

    it('should call routes function with handler instance', async () => {
      
      const options = {
        service: mockService,
        validator: mockValidator,
        storageService: mockStorageService,
        cacheService: mockCacheService
      };

      
      await albumsPlugin.register(mockServer, options);

      
      expect(routes).toHaveBeenCalledWith(expect.any(Object));
      
      const handlerInstance = routes.mock.calls[0][0];
      expect(handlerInstance).toBeDefined();
    });

    it('should register routes on server', async () => {
      
      const options = {
        service: mockService,
        validator: mockValidator,
        storageService: mockStorageService,
        cacheService: mockCacheService
      };

      
      await albumsPlugin.register(mockServer, options);

      
      expect(mockServer.route).toHaveBeenCalledWith(mockRoutes);
    });
  });

  describe('Plugin Registration Error Handling', () => {
    it('should handle AlbumHandler constructor error', async () => {
      
      const error = new Error('Handler construction failed');
      AlbumHandler.mockImplementation(() => {
        throw error;
      });

      const options = {
        service: mockService,
        validator: mockValidator,
        storageService: mockStorageService,
        cacheService: mockCacheService
      };

      await expect(albumsPlugin.register(mockServer, options))
        .rejects.toThrow('Handler construction failed');
    });

    it('should handle routes function error', async () => {
      
      const error = new Error('Routes creation failed');
      routes.mockImplementation(() => {
        throw error;
      });

      const options = {
        service: mockService,
        validator: mockValidator,
        storageService: mockStorageService,
        cacheService: mockCacheService
      };

      await expect(albumsPlugin.register(mockServer, options))
        .rejects.toThrow('Routes creation failed');
    });

    it('should handle server.route error', async () => {
      
      const error = new Error('Route registration failed');
      mockServer.route.mockImplementation(() => {
        throw error;
      });

      const options = {
        service: mockService,
        validator: mockValidator,
        storageService: mockStorageService,
        cacheService: mockCacheService
      };

      await expect(albumsPlugin.register(mockServer, options))
        .rejects.toThrow('Route registration failed');
    });
  });

  describe('Plugin Registration with Missing Dependencies', () => {
    it('should handle missing service dependency', async () => {
      
      const options = {
        validator: mockValidator,
        storageService: mockStorageService,
        cacheService: mockCacheService
      };

      
      await albumsPlugin.register(mockServer, options);

      
      expect(AlbumHandler).toHaveBeenCalledWith(
        undefined,
        mockValidator,
        mockStorageService,
        mockCacheService
      );
    });

    it('should handle missing validator dependency', async () => {
      
      const options = {
        service: mockService,
        storageService: mockStorageService,
        cacheService: mockCacheService
      };

      
      await albumsPlugin.register(mockServer, options);

      
      expect(AlbumHandler).toHaveBeenCalledWith(
        mockService,
        undefined,
        mockStorageService,
        mockCacheService
      );
    });

    it('should handle missing storageService dependency', async () => {
      
      const options = {
        service: mockService,
        validator: mockValidator,
        cacheService: mockCacheService
      };

      
      await albumsPlugin.register(mockServer, options);

      
      expect(AlbumHandler).toHaveBeenCalledWith(
        mockService,
        mockValidator,
        undefined,
        mockCacheService
      );
    });

    it('should handle missing cacheService dependency', async () => {
      
      const options = {
        service: mockService,
        validator: mockValidator,
        storageService: mockStorageService        
      };

      
      await albumsPlugin.register(mockServer, options);

      
      expect(AlbumHandler).toHaveBeenCalledWith(
        mockService,
        mockValidator,
        mockStorageService,
        undefined
      );
    });
  });

  describe('Integration Test', () => {
    it('should register plugin as complete flow', async () => {
      
      const options = {
        service: mockService,
        validator: mockValidator,
        storageService: mockStorageService,
        cacheService: mockCacheService
      };

      
      await albumsPlugin.register(mockServer, options);

      expect(AlbumHandler).toHaveBeenCalledTimes(1);
      expect(routes).toHaveBeenCalledTimes(1);
      expect(mockServer.route).toHaveBeenCalledTimes(1);
      
      const handlerCallOrder = AlbumHandler.mock.invocationCallOrder[0];
      const routesCallOrder = routes.mock.invocationCallOrder[0];
      const serverRouteCallOrder = mockServer.route.mock.invocationCallOrder[0];
      
      expect(handlerCallOrder).toBeLessThan(routesCallOrder);
      expect(routesCallOrder).toBeLessThan(serverRouteCallOrder);
    });
  });
});