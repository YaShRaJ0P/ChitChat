import express, { NextFunction, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { config, errorResponse, logger } from "./utils";
import connectDB from "./db/connection";
import { AuthRouter, AvatarRouter } from "./routes";
import { StatusCodes } from "http-status-codes";
const app = express();
import proxy from "express-http-proxy";
import { error } from "console";

// Connect to Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Request body, ${req.body}`);
  next();
});

async function startServer() {
  try {
    app.listen(config.PORT, () => {
      logger.info(`Identity service running on port ${config.PORT}`);
    });
  } catch (error) {
    logger.error("Failed to connect to server", error);
    process.exit(1);
  }
}

startServer();

// Proxy Handlers

const ProxyOptions = {
  proxyErrorHandler: (err: any, res: Response, next: NextFunction) => {
    if (!err) {
      return next();
    }

    console.error(`Proxy Error: ${err.code || "Unknown error"}`, err.message);

    switch (err.code) {
      case "ECONNRESET":
        return errorResponse(
          res,
          "The connection was reset by the upstream service.",
          StatusCodes.BAD_GATEWAY
        );

      case "ECONNREFUSED":
        return errorResponse(
          res,
          "The requested service is unavailable. Please try again later.",
          StatusCodes.BAD_GATEWAY
        );

      default:
        return errorResponse(
          res,
          "An error occurred while processing your request.",
          StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
  },
};


// Middleware to apply proxy settings
["/api/auth", "/api/avatar"].forEach((path) => {
  app.use(
    path,
    proxy(config.IDENTITY_SERVICE_URL, {
      ...ProxyOptions,

      // Modify request headers before sending to the identity service
      proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        proxyReqOpts.headers = proxyReqOpts.headers || {};
        proxyReqOpts.headers["Content-Type"] = "application/json";

        // Add Authorization header if present
        if (srcReq.headers["authorization"]) {
          proxyReqOpts.headers["Authorization"] = srcReq.headers["authorization"];
        }

        return proxyReqOpts;
      },

      // Modify response before sending to the client
      userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
        logger.info(`Proxy Response from Identity Service - ${proxyRes.statusCode}`, {
          method: userReq.method,
          url: userReq.originalUrl,
          statusCode: proxyRes.statusCode,
        });

        try {
          return JSON.parse(proxyResData.toString("utf8"));
        } catch (error) {
          return proxyResData;
        }
      },
    })
  );
});

app.use(
  "/api/search",
  proxy(config.SEARCH_SERVICE_URL, {
    ...ProxyOptions,

    // Modify request headers before sending to the identity service
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers = proxyReqOpts.headers || {};
      proxyReqOpts.headers["Content-Type"] = "application/json";

      // Add Authorization header if present
      if (srcReq.headers["authorization"]) {
        proxyReqOpts.headers["Authorization"] = srcReq.headers["authorization"];
      }

      return proxyReqOpts;
    },

    // Modify response before sending to the client
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      logger.info(`Proxy Response from Identity Service - ${proxyRes.statusCode}`, {
        method: userReq.method,
        url: userReq.originalUrl,
        statusCode: proxyRes.statusCode,
      });

      try {
        return JSON.parse(proxyResData.toString("utf8"));
      } catch (error) {
        return proxyResData;
      }
    },
  })
);


app.listen(config.PORT, () => {
  logger.info(`API Gateway running on port ${config.PORT}`);
  logger.info(`Identity service is running on port ${config.IDENTITY_SERVICE_URL}`);
  logger.info(`Search service is running on port ${config.SEARCH_SERVICE_URL}`);
});