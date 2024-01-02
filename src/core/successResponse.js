"use strict";

const {
  StatusCodes,
  ReasonPhrases,
} = require("../httpStatusCode/httpStatusCode");

class SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.OK,
    reasonPhrases = ReasonPhrases.OK,
    metadata = {},
  }) {
    this.message = !message ? reasonPhrases : message;
    this.status = statusCode;
    this.metadata = metadata;
  }
  send(res, headers = {}) {
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata });
  }
}

class CREATED extends SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.CREATED,
    reasonPhrases = ReasonPhrases.CREATED,
    metadata,
    options = {},
  }) {
    super({message, statusCode, reasonPhrases, metadata});
    this.options = options;
  }
}
 
module.exports = {
    OK, CREATED
}