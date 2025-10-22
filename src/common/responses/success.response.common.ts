export function handleRxSuccess<T>(data: T, evCode: string, message = 'Operation successful') {
    return {
        Status: 200,
        Message: message,
        EvCode: evCode,
        EvType: 'Success',
        Data: data
    };
}
