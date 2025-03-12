import logger from "./logger";

export const successResponse = (res: any, data: any, message: string = 'Success', statusCode: number = 200) => {
    logger.info(`Response: ${statusCode} - ${message}`);
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  };
  
  export const errorResponse = (res: any, message: string = 'Error', statusCode: number = 500) => {
    logger.error(`Response: ${statusCode} - ${message}`);
    return res.status(statusCode).json({
      success: false,
      message,
      data: {},
    });
  };