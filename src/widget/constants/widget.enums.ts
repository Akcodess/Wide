export enum WidgetMessage {
  RetrievedSuccessfully = 'Widgets retrieved successfully',
  GetWidgetsCalled = "GetWidgets called",
  NoWidgetsFound = 'No widgets found for the given user and page.',
  AddedSuccessfully = 'Widget added successfully.',
  WidgetUpdated = 'Widget updated successfully.',
  WidgetDeleted = 'Widget deleted successfully.',
  UdpadteInvalidUserId = "UpdateWidget invalid Id received:",
  UpdateWidgetNotFound = "UpdateWidget widget not found. Id:",
  ErrorCreating = 'Error creating widget.',
  ErrorUpdating = 'Error updating widget.',
  ErrorDeleting = 'Some error occurred while deleting widget.',
  InvalidWidgetConfig = 'Invalid widget configuration.',
  ApplicationCodeRequired = 'applicationCode is required',
  PageCodeRequired = 'pageCode is required',
  InvalidUserId = 'Invalid user id',
  WidgetNotFound = 'Widget not found',
  InvalidPayload = "Invalid payload: must be a non-empty array.",
  WidgetLayoutUpdated = "Widget layout updated successfully",
  DeleteNotAllowed = "Widget cannot be deleted",
  WidgetCodeRequired = 'widgetCode is required',
  WidgetFoundByCode = 'Widget found by WidgetCode!',
  WidgetCodeNotFound = 'WidgetCode not found!',
  WidgetFoundWithCode = "Widget found with code:",
  WidgetCodeMustBeString = "WidgetCode must be a string",
  ErrorFetchingWidgets = "Error fetching widgets for user",
  WidgetMappingCreated ="Widget mapping created successfully",
  ErrorUpdatingMapping = "Error updating widget mapping",
  WidgetMappingDeleted = "UserId(s) removed from widget mapping successfully!",
  UserIdNotFound = "UserId(s) not found in widget mapping!",
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
  DeleteWidget = 'DeleteWidget',
  GetWidgetByCode = 'GetWidgetByCode',
  CreateWidgetMapping = "CreateWidgetMapping",
  UpdateWidgetMapping = "UpdateWidgetMapping",
  DeleteWidgetUserMapping = "DeleteWidgetUserMapping",
}

export enum WidgetStatus {
  Ok = 200,
  NotFound = 404,
  BadRequest = 400
}
