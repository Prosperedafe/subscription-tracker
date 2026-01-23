import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req);
        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({
                    error: 'Rate limit exceeded',
                    message: "Rate limit exceeded",
                });
            }
            if (decision.reason.isBot()) {
                return res.status(403).json({
                    error: 'Bot detected',
                    message: "Bot detected",
                });
            }
            if (decision.reason.isShield()) {
                return res.status(403).json({
                    error: 'Request blocked',
                    message: "Request blocked by security rules",
                });
            }
            return res.status(403).json({
                error: 'Request denied',
                message: "Request denied",
            });
        }
        next();
    } catch (error) {
        console.log(`Arcjet middleware error: ${error}`);
        next(error);
    }
}

export default arcjetMiddleware;
