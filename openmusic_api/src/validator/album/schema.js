const joi = require("joi");

const AlbumPayloadSchema = joi.object({
  name: joi.string().required(),
  year: joi.number().required(),
});

const ImageHeadersSchema = joi
  .object({
    "content-type": joi
      .string()
      .valid("image/jpeg", "image/png", "image/jpg")
      .required(),
  })
  .unknown();

module.exports = {
  AlbumPayloadSchema,
  ImageHeadersSchema,
};
