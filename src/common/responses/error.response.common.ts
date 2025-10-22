import { BadRequestException, InternalServerErrorException, NotFoundException, UnauthorizedException, ForbiddenException, HttpException } from '@nestjs/common';
import moment from 'moment';
import { throwError } from 'rxjs';

export function handleRxError(err: any, evCode: string, defaultMessage = 'An unexpected error occurred') {
    const errorResponse = {
        Status: err?.response?.Status || getStatusCode(err),
        Message: err?.response?.Message || err?.message || defaultMessage,
        TimeStamp: moment().format('YYYY-MM-DD HH:mm:ss'),
        EvCode: evCode,
        EvType: err?.response?.EvType || 'Failed',
    };

    if (err instanceof HttpException && typeof err.getResponse === 'function' && (typeof err.getResponse() === 'object' && (err.getResponse() as any)?.EvCode)) {
        return throwError(() => err);
    }

    if (err instanceof NotFoundException) {
        throw new NotFoundException(errorResponse);
    }

    if (err instanceof BadRequestException) {
        throw new BadRequestException(errorResponse);
    }

    if (err instanceof UnauthorizedException) {
        throw new UnauthorizedException(errorResponse);
    }

    if (err instanceof ForbiddenException) {
        throw new ForbiddenException(errorResponse);
    }

    if (err instanceof HttpException) {
        throw new HttpException(errorResponse, err.getStatus());
    }

    return throwError(() => new InternalServerErrorException(errorResponse));
}

function getStatusCode(err: any): number {
    if (err instanceof NotFoundException) return 404;
    if (err instanceof BadRequestException) return 400;
    if (err instanceof UnauthorizedException) return 401;
    if (err instanceof ForbiddenException) return 403;
    return 500;
}
