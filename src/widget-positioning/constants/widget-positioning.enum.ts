export enum WidgetPositioningMessage {
    WidgetPositionCreated = "Widget position created-updated successfully",
    ErrorCreatingUpdatingWidgetPositions = "Error creating-updating widget positions",
    NoMatchingWidgetPositionFound = "No matching widget position found",
    ErrorDeletingWidgetPosition = "Error deleting widget position",
    WidgetPositionDeletedSuccessfully = "Widget position deleted successfully",
    UserWidgetPositionsCreatedUpdatedSuccessfully = "User widget positions created-updated successfully",
    ErrorCreatingUpdatingUserWidgetPositions = "Error creating-updating user widget positions"
}

export enum WidgetPositioningEvCode {
    CreateWidgetPosition = "CreateWidgetPosition",
    DeletePageWidgetPosition = "DeletePageWidgetPosition",
    CreateUserWidgetPosition = "CreateUserWidgetPosition"
}

export enum WidgetPositioningEvType {
    Success = 'Success',
    Failed = 'Failed',
}

export enum WidgetPositioningStatus {
    Ok = 200,
    NotFound = 404,
    BadRequest = 400,
    InternalServerError = 500
}