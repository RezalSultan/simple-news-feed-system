import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ZodError } from 'zod';

@Catch(ZodError, HttpException, Error)
export class ErrorFilter implements ExceptionFilter {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private logger: Logger) {}

  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    this.logger.error({
      message: exception.message,
      stack: exception.stack,
      context: 'ErrorFilter',
    });

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      let message: string;

      switch (statusCode) {
        case 400:
          message = 'Bad Request';
          break;
        case 401:
          message = 'Unauthorized';
          break;
        case 404:
          message = 'Not Found';
          break;
        case 422:
          message = 'Unprocessable Entity';
          break;
        case 409:
          message = 'Conflict';
          break;
        case 500:
          message = 'Internal Server Error';
          break;
        default:
          message = 'An error occurred, please try again later.';
          break;
      }
      response.status(statusCode).json({
        statusCode,
        status: message,
        errors: {
          message: exception.message,
        },
      });
    } else if (exception instanceof ZodError) {
      const formattedErrors = exception.issues.map((e) => ({
        message: e.message,
        path: e.path.join('.'),
      }));
      response.status(400).json({
        statusCode: 400,
        status: 'Bad Request',
        errors: {
          message: 'Validation Error',
          details: formattedErrors,
        },
      });
    } else {
      response.status(500).json({
        statusCode: 500,
        status: 'Internal Server Error',
        errors: {
          message: exception.message || 'Something went wrong',
        },
      });
    }
  }
}
