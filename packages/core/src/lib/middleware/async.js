const logger = require("../log/logger");

module.exports = exports = {};

exports.asyncMiddlewareWrapper = async function asyncMiddlewareWrapper(id, middlewareFunc, request, response, delegates, next) {
  logger.log('info', `Executing middleware ${id}`);
  try {
    // If the middleware function has the next function as a parameter
    let delegate = undefined;
    if (middlewareFunc.length === 4) {
      delegate = middlewareFunc(request, response, delegates, next);
    } else {
      delegate = middlewareFunc(request, response, delegates);
    }
    delegates[id] = delegate;
    await delegate;
  } catch (e) {
    // Log the error
    logger.log('error', `Exception in middleware ${id}`, { message: e.message, stack: e.stack });
    // Call error handler middleware if it is not called yet
    if (response.locals.errorHandlerTriggered !== true) {
      console.log('calling error handler');
      next(e);
    }
  }
}