import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import { Response } from 'express';
import { STATUS_CODES } from 'http';
import * as _ from 'lodash';

@Catch(BadRequestException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(public reflector: Reflector) {}

  catch(exception: BadRequestException, host: ArgumentsHost) {
    console.log(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let statusCode = exception.getStatus();
    const r = <any>exception.getResponse();

    if (_.isArray(r.message) && r.message[0] instanceof ValidationError) {
      statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
      const validationErrors = <ValidationError[]>r.message;
      r.message = this.transformErrorMessage(validationErrors);
    }

    r.statusCode = statusCode;
    r.error = STATUS_CODES[statusCode];

    response.status(statusCode).json(r);
  }

  transformErrorMessage(message: ValidationError[]) {
    const result = {};
    message.forEach((error) => {
      Object.entries(error.constraints).forEach((constraint) => {
        const snakeError = _.snakeCase(constraint[0]);
        result[snakeError] = error.property;
      });
    });
    return result;
  }
}
