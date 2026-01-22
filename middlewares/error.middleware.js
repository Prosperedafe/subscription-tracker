const errorMiddleware = (err, req, res, next) => {
    try {
        let error = { ...err };
        error.message = err.message;
        if (error.stack) {
            console.log(error.stack);
        }

        if (error.name === 'CastError') {
            error.message = `Resource not found. Invalid: ${error.path}: ${error.value}`;
            error.statusCode = 404;
        }
        if (error.code === 11000) {
            error.message = `Duplicate field value entered`;
            error.statusCode = 400;
        }
        if (error.name === 'ValidationError') {
            const message = Object.values(error.errors).map((val) => val.message);
            error = new Error(message.join(', '));
            error.statusCode = 400;
        }

        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Internal Server Error',
        });
    } catch (error) {
        next(error);
    }

};

export default errorMiddleware;