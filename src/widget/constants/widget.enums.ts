export enum WidgetMessage {
  RetrievedSuccessfully = 'Widgets retrieved successfully',
  NoWidgetsFound = 'No widgets found for the given user and page.',
  AddedSuccessfully = 'Widget added successfully.',
  ErrorCreating = 'Error creating widget.',
  InvalidWidgetConfig = 'Invalid widget configuration.',
}

export enum WidgetEvType {
  Success = 'Success',
  Failed = 'Failed',
}

export enum WidgetEvCode {
  GetWidget = 'GetWidget',
  AddWidget = 'AddWidget',
}

export enum WidgetStatus {
  Ok = 200,
  NotFound = 404,
}
