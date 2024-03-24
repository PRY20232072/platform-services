function errorHandlerMiddleware(err, req, res, next) {
    err.status = err.status || 500;
    err.message = err.message || 'Internal Server Error';
    res.status(err.status).json({
        status: err.status,
        message: err.message,
        data: null,
    });
}

module.exports = errorHandlerMiddleware;
