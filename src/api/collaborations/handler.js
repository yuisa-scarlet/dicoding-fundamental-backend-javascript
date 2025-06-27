const ResponseFormatter = require("../../utils/ResponseFormatter");
const { SUCCESS_MESSAGES } = require("../../utils/constants");

class CollaborationHandler {
  constructor(collaborationService, playlistService, validator) {
    this._collaborationService = collaborationService;
    this._playlistService = playlistService;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler =
      this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);

    const { playlistId, userId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);

    const collaborationId = await this._collaborationService.addCollaboration(
      playlistId,
      userId
    );

    return h
      .response(
        ResponseFormatter.created(
          { collaborationId },
          SUCCESS_MESSAGES.COLLABORATION.CREATED
        )
      )
      .code(201);
  }

  async deleteCollaborationHandler(request) {
    this._validator.validateCollaborationPayload(request.payload);

    const { playlistId, userId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);

    await this._collaborationService.deleteCollaboration(playlistId, userId);

    return ResponseFormatter.success(
      null,
      SUCCESS_MESSAGES.COLLABORATION.DELETED
    );
  }
}

module.exports = CollaborationHandler;
