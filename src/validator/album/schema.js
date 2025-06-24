const joi = require("joi");

const AlbumPayloadSchema = joi.object({
  name: joi.string().required(),
  year: joi.number().required(),
});

module.exports = {
  AlbumPayloadSchema,
};
