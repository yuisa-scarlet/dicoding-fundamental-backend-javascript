const Joi = require("joi");

const ExportPlaylistPayloadSchema = Joi.object({
  targetEmail: Joi.string().email().required(),
});

module.exports = { ExportPlaylistPayloadSchema };
