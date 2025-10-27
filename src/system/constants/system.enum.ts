export enum SystemEvMessage {
    VersionInfoFetched = "Version information fetched successfully",
    ErrorFetchingVersion = "Error fetching version information"
}

export enum SystemEvCode {
    VersionInfoFetch = "VersionInfoFetch"
}

export enum SystemEvType {
  Success = 'Success',
  Failed = 'Failed',
}

export enum SystemStatus {
  Ok = 200,
  NotFound = 404,
  BadRequest = 400,
  InternalServerError = 500
}