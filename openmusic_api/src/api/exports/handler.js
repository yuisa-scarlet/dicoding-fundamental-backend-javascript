const ResponseFormatter = require("../../utils/ResponseFormatter");
const { SUCCESS_MESSAGES } = require("../../utils/constants");

class ExportHandler {
  constructor(producerService, playlistService, validator) {
    this._producerService = producerService;
    this._playlistService = playlistService;
    this._validator = validator;

    this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this);
  }

  async postExportPlaylistHandler(request, h) {
    this._validator.validateExportPlaylistPayload(request.payload);

    const { playlistId } = request.params;
    const { targetEmail } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);

    const message = {
      playlistId,
      targetEmail,
    };

    await this._producerService.sendMessage(
      "export:playlist",
      JSON.stringify(message)
    );

    const response = h.response(
      ResponseFormatter.success(
        null,
        SUCCESS_MESSAGES.EXPORT.PLAYLIST_REQUESTED
      )
    );
    response.code(201);
    return response;
  }
}

module.exports = ExportHandler;
