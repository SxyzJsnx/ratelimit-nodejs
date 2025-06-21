import { createExpressLimiter as expressRateLimit } from "./rateLimiter/express/index.js";

function rateLimit(obj) {
  if (obj.framework === "express") {
     return expressRateLimit(obj)
  }
}

export default rateLimit;