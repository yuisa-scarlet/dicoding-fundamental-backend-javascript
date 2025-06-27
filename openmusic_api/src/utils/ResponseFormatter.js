const ResponseFormatter = {
  success(data, message = null) {
    return {
      status: "success",
      ...(message && { message }),
      ...(data && { data }),
    };
  },

  created(data, message = null) {
    return {
      status: "success",
      message: message || "Data berhasil ditambahkan",
      data,
    };
  },

  fail(message) {
    return {
      status: "fail",
      message,
    };
  },

  error(message = "Internal Server Error") {
    return {
      status: "error",
      message,
    };
  },
};

module.exports = ResponseFormatter;
