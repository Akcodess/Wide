export enum WidgetMessage {
  RetrievedSuccessfully = 'Widgets retrieved successfully',
  GetWidgetsCalled = "GetWidgets called",
  NoWidgetsFound = 'No widgets found for the given user and page.',
  AddedSuccessfully = 'Widget added successfully.',
  WidgetUpdated = 'Widget updated successfully.',
  UdpadteInvalidUserId = "UpdateWidget invalid Id received:",
  UpdateWidgetNotFound = "UpdateWidget widget not found. Id:",
  ErrorCreating = 'Error creating widget.',
  ErrorUpdating = 'Error updating widget.',
  InvalidWidgetConfig = 'Invalid widget configuration.',
  ApplicationCodeRequired = 'applicationCode is required',
  PageCodeRequired = 'pageCode is required',
  InvalidUserId = 'Invalid user id',
  WidgetNotFound = 'Widget not found',
  InvalidPayload = "Invalid payload: must be a non-empty array.",
  WidgetLayoutUpdated = "Widget layout updated successfully",
}

export enum WidgetEvType {
  Success = 'Success',
  Failed = 'Failed',
}

export enum WidgetEvCode {
  GetWidget = 'GetWidget',
  AddWidget = 'AddWidget',
  UpdateWidget = 'UpdateWidget',
  UpdateWidgetLayout = 'UpdateWidgetLayout',
}

export enum WidgetStatus {
  Ok = 200,
  NotFound = 404,
  BadRequest = 400
}
