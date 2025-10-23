import { SuccessResponse } from '../interfaces/widget.interface';

export function handleRxSuccess<T>(data: T, evCode: string, message = 'Operation successful'): SuccessResponse<T> {
    const response: SuccessResponse<T> = {
        Status: 200,
        Message: message,
        EvCode: evCode,
        EvType: 'Success',
        Data: data,
    };
    return response;
}
