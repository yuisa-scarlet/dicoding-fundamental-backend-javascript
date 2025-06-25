const joi = require('joi');

const SongPayloadSchema = joi.object({
  title: joi.string().required(),
  year: joi.number().required(),
  genre: joi.string().required(),
  performer: joi.string().required(),
  duration: joi.number().optional(),
  albumId: joi.string().optional(),
});

module.exports = {
  SongPayloadSchema,
};