const { describe, it, expect, beforeEach } = require('@jest/globals');
const routes = require('../../api/albums/routes');

describe('Albums Routes', () => {
  let mockHandler;
  let albumRoutes;

  beforeEach(() => {
    // Mock handler with all required methods
    mockHandler = {
      postAlbumHandler: jest.fn(),
      getDetailAlbumHandler: jest.fn(),
      putAlbumHandler: jest.fn(),
      deleteAlbumHandler: jest.fn(),
      postUploadImageHandler: jest.fn(),
      postAlbumLikeHandler: jest.fn(),
      deleteAlbumLikeHandler: jest.fn(),
      getAlbumLikesHandler: jest.fn()
    };

    // Get routes array
    albumRoutes = routes(mockHandler);

    // Clear mocks
    jest.clearAllMocks();
  });

  describe('Routes Function', () => {
    it('should be a function', () => {
      expect(typeof routes).toBe('function');
    });

    it('should return an array of routes', () => {
      expect(Array.isArray(albumRoutes)).toBe(true);
      expect(albumRoutes).toHaveLength(8);
    });

    it('should return routes when called with handler', () => {
      const result = routes(mockHandler);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('POST /albums Route', () => {
    let postAlbumRoute;

    beforeEach(() => {
      postAlbumRoute = albumRoutes.find(route => 
        route.method === 'POST' && route.path === '/albums'
      );
    });

    it('should have correct method and path', () => {
      expect(postAlbumRoute).toBeDefined();
      expect(postAlbumRoute.method).toBe('POST');
      expect(postAlbumRoute.path).toBe('/albums');
    });

    it('should have correct handler', () => {
      expect(postAlbumRoute.handler).toBe(mockHandler.postAlbumHandler);
    });

    it('should not have options', () => {
      expect(postAlbumRoute.options).toBeUndefined();
    });
  });

  describe('GET /albums/{id} Route', () => {
    let getAlbumRoute;

    beforeEach(() => {
      getAlbumRoute = albumRoutes.find(route => 
        route.method === 'GET' && route.path === '/albums/{id}'
      );
    });

    it('should have correct method and path', () => {
      expect(getAlbumRoute).toBeDefined();
      expect(getAlbumRoute.method).toBe('GET');
      expect(getAlbumRoute.path).toBe('/albums/{id}');
    });

    it('should have correct handler', () => {
      expect(getAlbumRoute.handler).toBe(mockHandler.getDetailAlbumHandler);
    });

    it('should not have options', () => {
      expect(getAlbumRoute.options).toBeUndefined();
    });
  });

  describe('PUT /albums/{id} Route', () => {
    let putAlbumRoute;

    beforeEach(() => {
      putAlbumRoute = albumRoutes.find(route => 
        route.method === 'PUT' && route.path === '/albums/{id}'
      );
    });

    it('should have correct method and path', () => {
      expect(putAlbumRoute).toBeDefined();
      expect(putAlbumRoute.method).toBe('PUT');
      expect(putAlbumRoute.path).toBe('/albums/{id}');
    });

    it('should have correct handler', () => {
      expect(putAlbumRoute.handler).toBe(mockHandler.putAlbumHandler);
    });

    it('should not have options', () => {
      expect(putAlbumRoute.options).toBeUndefined();
    });
  });

  describe('DELETE /albums/{id} Route', () => {
    let deleteAlbumRoute;

    beforeEach(() => {
      deleteAlbumRoute = albumRoutes.find(route => 
        route.method === 'DELETE' && route.path === '/albums/{id}'
      );
    });

    it('should have correct method and path', () => {
      expect(deleteAlbumRoute).toBeDefined();
      expect(deleteAlbumRoute.method).toBe('DELETE');
      expect(deleteAlbumRoute.path).toBe('/albums/{id}');
    });

    it('should have correct handler', () => {
      expect(deleteAlbumRoute.handler).toBe(mockHandler.deleteAlbumHandler);
    });

    it('should not have options', () => {
      expect(deleteAlbumRoute.options).toBeUndefined();
    });
  });

  describe('POST /albums/{id}/covers Route', () => {
    let uploadCoverRoute;

    beforeEach(() => {
      uploadCoverRoute = albumRoutes.find(route => 
        route.method === 'POST' && route.path === '/albums/{id}/covers'
      );
    });

    it('should have correct method and path', () => {
      expect(uploadCoverRoute).toBeDefined();
      expect(uploadCoverRoute.method).toBe('POST');
      expect(uploadCoverRoute.path).toBe('/albums/{id}/covers');
    });

    it('should have correct handler', () => {
      expect(uploadCoverRoute.handler).toBe(mockHandler.postUploadImageHandler);
    });

    it('should have correct payload options', () => {
      expect(uploadCoverRoute.options).toBeDefined();
      expect(uploadCoverRoute.options.payload).toBeDefined();
      expect(uploadCoverRoute.options.payload.allow).toBe('multipart/form-data');
      expect(uploadCoverRoute.options.payload.multipart).toBe(true);
      expect(uploadCoverRoute.options.payload.output).toBe('stream');
      expect(uploadCoverRoute.options.payload.maxBytes).toBe(512000);
    });

    it('should not have auth options', () => {
      expect(uploadCoverRoute.options.auth).toBeUndefined();
    });
  });

  describe('POST /albums/{id}/likes Route', () => {
    let likeAlbumRoute;

    beforeEach(() => {
      likeAlbumRoute = albumRoutes.find(route => 
        route.method === 'POST' && route.path === '/albums/{id}/likes'
      );
    });

    it('should have correct method and path', () => {
      expect(likeAlbumRoute).toBeDefined();
      expect(likeAlbumRoute.method).toBe('POST');
      expect(likeAlbumRoute.path).toBe('/albums/{id}/likes');
    });

    it('should have correct handler', () => {
      expect(likeAlbumRoute.handler).toBe(mockHandler.postAlbumLikeHandler);
    });

    it('should have correct auth options', () => {
      expect(likeAlbumRoute.options).toBeDefined();
      expect(likeAlbumRoute.options.auth).toBe('openmusic_jwt');
    });

    it('should not have payload options', () => {
      expect(likeAlbumRoute.options.payload).toBeUndefined();
    });
  });

  describe('DELETE /albums/{id}/likes Route', () => {
    let unlikeAlbumRoute;

    beforeEach(() => {
      unlikeAlbumRoute = albumRoutes.find(route => 
        route.method === 'DELETE' && route.path === '/albums/{id}/likes'
      );
    });

    it('should have correct method and path', () => {
      expect(unlikeAlbumRoute).toBeDefined();
      expect(unlikeAlbumRoute.method).toBe('DELETE');
      expect(unlikeAlbumRoute.path).toBe('/albums/{id}/likes');
    });

    it('should have correct handler', () => {
      expect(unlikeAlbumRoute.handler).toBe(mockHandler.deleteAlbumLikeHandler);
    });

    it('should have correct auth options', () => {
      expect(unlikeAlbumRoute.options).toBeDefined();
      expect(unlikeAlbumRoute.options.auth).toBe('openmusic_jwt');
    });

    it('should not have payload options', () => {
      expect(unlikeAlbumRoute.options.payload).toBeUndefined();
    });
  });

  describe('GET /albums/{id}/likes Route', () => {
    let getAlbumLikesRoute;

    beforeEach(() => {
      getAlbumLikesRoute = albumRoutes.find(route => 
        route.method === 'GET' && route.path === '/albums/{id}/likes'
      );
    });

    it('should have correct method and path', () => {
      expect(getAlbumLikesRoute).toBeDefined();
      expect(getAlbumLikesRoute.method).toBe('GET');
      expect(getAlbumLikesRoute.path).toBe('/albums/{id}/likes');
    });

    it('should have correct handler', () => {
      expect(getAlbumLikesRoute.handler).toBe(mockHandler.getAlbumLikesHandler);
    });

    it('should not have options', () => {
      expect(getAlbumLikesRoute.options).toBeUndefined();
    });
  });

  describe('Routes Structure Validation', () => {
    it('should have all required route properties', () => {
      albumRoutes.forEach(route => {
        expect(route).toHaveProperty('method');
        expect(route).toHaveProperty('path');
        expect(route).toHaveProperty('handler');
        expect(typeof route.method).toBe('string');
        expect(typeof route.path).toBe('string');
        expect(typeof route.handler).toBe('function');
      });
    });

    it('should have unique combinations of method and path', () => {
      const combinations = albumRoutes.map(route => `${route.method} ${route.path}`);
      const uniqueCombinations = [...new Set(combinations)];
      
      expect(combinations).toHaveLength(uniqueCombinations.length);
    });

    it('should have correct HTTP methods', () => {
      const methods = albumRoutes.map(route => route.method);
      const expectedMethods = ['POST', 'GET', 'PUT', 'DELETE', 'POST', 'POST', 'DELETE', 'GET'];
      
      expect(methods).toEqual(expectedMethods);
    });

    it('should have paths with correct parameter format', () => {
      const pathsWithParams = albumRoutes
        .filter(route => route.path.includes('{id}'))
        .map(route => route.path);
      
      pathsWithParams.forEach(path => {
        expect(path).toMatch(/\{id\}/);
      });
    });
  });

  describe('Handler Function References', () => {
    it('should reference correct handler functions', () => {
      const handlerMappings = [
        { route: albumRoutes[0], expectedHandler: 'postAlbumHandler' },
        { route: albumRoutes[1], expectedHandler: 'getDetailAlbumHandler' },
        { route: albumRoutes[2], expectedHandler: 'putAlbumHandler' },
        { route: albumRoutes[3], expectedHandler: 'deleteAlbumHandler' },
        { route: albumRoutes[4], expectedHandler: 'postUploadImageHandler' },
        { route: albumRoutes[5], expectedHandler: 'postAlbumLikeHandler' },
        { route: albumRoutes[6], expectedHandler: 'deleteAlbumLikeHandler' },
        { route: albumRoutes[7], expectedHandler: 'getAlbumLikesHandler' }
      ];

      handlerMappings.forEach(({ route, expectedHandler }) => {
        expect(route.handler).toBe(mockHandler[expectedHandler]);
      });
    });
  });

  describe('Route Options Validation', () => {
    it('should have correct options structure for upload route', () => {
      const uploadRoute = albumRoutes[4]; // POST /albums/{id}/covers
      
      expect(uploadRoute.options).toEqual({
        payload: {
          allow: 'multipart/form-data',
          multipart: true,
          output: 'stream',
          maxBytes: 512000
        }
      });
    });

    it('should have correct options structure for authenticated routes', () => {
      const likeRoute = albumRoutes[5]; // POST /albums/{id}/likes
      const unlikeRoute = albumRoutes[6]; // DELETE /albums/{id}/likes
      
      expect(likeRoute.options).toEqual({ auth: 'openmusic_jwt' });
      expect(unlikeRoute.options).toEqual({ auth: 'openmusic_jwt' });
    });
  });

  describe('Error Handling', () => {
    it('should handle missing handler gracefully', () => {
      const incompleteHandler = {
        postAlbumHandler: jest.fn()
        // Missing other handlers
      };

      const routesWithIncompleteHandler = routes(incompleteHandler);
      
      expect(routesWithIncompleteHandler).toHaveLength(8);
      expect(routesWithIncompleteHandler[0].handler).toBe(incompleteHandler.postAlbumHandler);
      expect(routesWithIncompleteHandler[1].handler).toBeUndefined();
    });
  });
});