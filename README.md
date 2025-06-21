# @SXYZJSNX/RATELIMITER.JS

A flexible and lightweight rate limiting middleware for Node.js frameworks.

## Features

- 🚀 Framework agnostic design
- ⚡ High performance with minimal overhead
- 🛡️ Customizable rate limiting strategies
- 📊 Built-in request tracking
- 🔧 Easy configuration and setup

## Supported Frameworks

| Framework  | Status | Version |
|------------|--------|---------|
| Express.js | ✅     | 4.x+    |
| Fastify    | 🔄     | Coming soon |
| Koa        | 🔄     | Coming soon |

## Installation

```bash
npm install @sxyzjsnx/ratelimit.js
```

## Quick Start

```javascript
import express from "express";
import rateLimit from "@sxyzjsnx/ratelimit.js";

const app = express();

// Configure rate limiter
const limiter = rateLimit({
   framework: "express",
   max: 100,                    // Maximum requests per window
   windowMs: 15 * 60 * 1000,   // 15 minutes
   cooldownMs: 5 * 60 * 1000,  // 5 minutes cooldown after limit exceeded
   message: "Too many requests, please try again later."
});

// Apply rate limiting middleware
app.use(limiter);

app.get("/", (req, res) => {
   res.status(200).json({
      message: "Hello World!"
   });
});

app.listen(3000, () => {
   console.log("Server running on port 3000");
});
```

## Configuration Options

| Option       | Type     | Default | Description |
|--------------|----------|---------|-------------|
| `framework`  | string   | -       | Target framework ("express") |
| `max`        | number   | 100     | Maximum number of requests per window |
| `windowMs`   | number   | 900000  | Time window in milliseconds (15 min) |
| `cooldownMs` | number   | 300000  | Cooldown period after limit exceeded (5 min) |
| `message`    | string   | "Too many requests" | Response message when limit is exceeded |
| `statusCode` | number   | 429     | HTTP status code for rate limited requests |

## Advanced Usage

### Route-Specific Limits

```javascript
// Strict limit for authentication endpoints
const authLimiter = rateLimit({
   framework: "express",
   max: 5,
   windowMs: 15 * 60 * 1000,
   message: "Too many authentication attempts"
});

// General API limit
const apiLimiter = rateLimit({
   framework: "express",
   max: 100,
   windowMs: 15 * 60 * 1000
});

app.use("/auth", authLimiter);
app.use("/api", apiLimiter);
```

## Error Handling

The middleware handles various scenarios:

- **Rate limit exceeded**: Returns configured status code and message
- **Invalid configuration**: Throws configuration error
- **Framework compatibility**: Validates framework support

## License

MIT © SxyzJsnx.

## Support

- 📚 [Documentation](https://github.com/SxyzJsnx/ratelimit-nodejs)
- 🐛 [Issue Tracker](https://github.com/SxyzJsnx/ratelimit-nodejs/issues)

---

**Note**: This middleware stores rate limit data in memory by default. For production use with multiple server instances, consider implementing a shared storage solution (Redis, database, etc.).