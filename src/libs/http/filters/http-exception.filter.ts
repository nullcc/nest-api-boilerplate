import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

const DEFAULT_ERROR_CODE = 'INTERNAL_SERVER_ERROR';

type ExceptionResponse =
  | string
  | {
      error?: string;
      message?: string | string[];
      statusCode?: number;
      code?: string;
    };

const normalizeMessage = (
  status: number,
  response: ExceptionResponse | undefined,
): string | string[] => {
  if (typeof response === 'string') {
    return response;
  }
  if (response?.message) {
    return response.message;
  }
  if (response?.error) {
    return response.error;
  }
  return status === HttpStatus.INTERNAL_SERVER_ERROR
    ? 'Internal server error'
    : 'Request failed';
};

const normalizeCode = (
  status: number,
  response: ExceptionResponse | undefined,
): string => {
  if (typeof response === 'object' && response?.code) {
    return response.code;
  }
  if (typeof response === 'object' && response?.error) {
    return response.error.toUpperCase().replace(/\s+/g, '_');
  }
  return status === HttpStatus.INTERNAL_SERVER_ERROR
    ? DEFAULT_ERROR_CODE
    : `HTTP_${status}`;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = isHttpException
      ? (exception.getResponse() as ExceptionResponse)
      : undefined;
    const requestId =
      request.header('X-Request-Id') ??
      (request as Request & { id?: string }).id;

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(exception);
    }

    response.status(status).json({
      statusCode: status,
      code: normalizeCode(status, exceptionResponse),
      message: normalizeMessage(status, exceptionResponse),
      path: request.originalUrl,
      requestId,
      timestamp: new Date().toISOString(),
    });
  }
}
