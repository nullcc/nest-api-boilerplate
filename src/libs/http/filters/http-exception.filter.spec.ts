import {
  ArgumentsHost,
  BadRequestException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { HttpExceptionFilter } from './http-exception.filter';

const createHost = () => {
  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const request = {
    originalUrl: '/users/1',
    header: jest.fn().mockReturnValue('request-id'),
  };

  return {
    host: {
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response,
      }),
    } as unknown as ArgumentsHost,
    response,
  };
};

describe('HttpExceptionFilter', () => {
  it('should normalize http exceptions', () => {
    const { host, response } = createHost();
    const filter = new HttpExceptionFilter(new Logger());

    filter.catch(new NotFoundException('User not found'), host);

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
        code: 'NOT_FOUND',
        message: 'User not found',
        path: '/users/1',
        requestId: 'request-id',
      }),
    );
  });

  it('should preserve validation message arrays', () => {
    const { host, response } = createHost();
    const filter = new HttpExceptionFilter(new Logger());

    filter.catch(
      new BadRequestException({
        message: ['name should not be empty'],
        error: 'Bad Request',
      }),
      host,
    );

    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 'BAD_REQUEST',
        message: ['name should not be empty'],
      }),
    );
  });
});
