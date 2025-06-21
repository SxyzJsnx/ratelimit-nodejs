/**
 * Create a native Express rate limiter middleware.
 *
 * @param {Object} options - Configuration options for the rate limiter.
 * @param {number} [options.max=100] - Maximum number of allowed requests per window.
 * @param {number} [options.windowMs=60000] - Time window for rate limit in milliseconds.
 * @param {number} [options.cooldownMs=60000] - Cooldown period after max is reached (block duration).
 * @param {string|Object} [options.message="Rate limit exceeded. Please try again later."] - Message returned on limit hit.
 * @param {number} [options.statusCode=429] - HTTP status code when limit is hit.
 * @param {(req: import('express').Request) => string} [options.keyGen=(req) => req.ip] - Function to generate a unique key per user/IP.
 * @param {(req: import('express').Request, res: import('express').Response) => boolean} [options.skip=() => false] - Function to skip rate limit (e.g. for admin).
 * @returns {import('express').RequestHandler} Express middleware function.
 */
function createExpressLimiter(options = {}) {
  const {
    max = 100,
    windowMs = 60_000,
    cooldownMs = 60_000,
    message = "Rate limit exceeded. Please try again later.",
    statusCode = 429,
    keyGen = (req) => req.ip,
    skip = () => false
  } = options;

  // Store request timestamps: Map<key, number[]>
  const requestStore = new Map();

  // Store cooldowns: Map<key, number>
  const cooldownStore = new Map();

  return function rateLimiter(req, res, next) {
    if (skip(req, res)) return next();

    const key = keyGen(req);
    const now = Date.now();

    // Check cooldown
    if (cooldownStore.has(key)) {
      const blockedUntil = cooldownStore.get(key);
      const remainingMs = blockedUntil - now;

      if (remainingMs > 0) {
        return res.status(statusCode).json({
          status: statusCode,
          message,
          remainingTime: Math.ceil(remainingMs / 1000) // seconds
        });
      } else {
        cooldownStore.delete(key);
        requestStore.delete(key);
      }
    }

    if (!requestStore.has(key)) requestStore.set(key, []);

    const timestamps = requestStore.get(key).filter(ts => now - ts < windowMs);

    if (timestamps.length >= max) {
      if (!cooldownStore.has(key)) {
        cooldownStore.set(key, now + cooldownMs);
      }

      const remaining = cooldownStore.get(key) - now;

      return res.status(statusCode).json({
        status: statusCode,
        message,
        remainingTime: Math.ceil(remaining / 1000) // seconds
      });
    }

    timestamps.push(now);
    requestStore.set(key, timestamps);

    next();
  };
}

export { createExpressLimiter };