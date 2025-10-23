export enum WidgetPositioningMessage {
    WidgetPositionCreated = "Widget position created-updated successfully",
    ErrorCreatingUpdatingWidgetPositions = "Error creating-updating widget positions"
}

export enum WidgetPositioningEvCode {
    CreateWidgetPosition = "CreateWidgetPosition"
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