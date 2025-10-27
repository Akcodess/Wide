export enum AuthMessage {
  RegisteredSuccessfully = 'Registered successfully',
}

export enum ErrorMessage {
  NucleusValidationFailed = 'Nucleus validation failed',
  FailedToDecodeJwt = 'Failed to decode JWT token',
  RegistrationFailed = 'Registration failed',
  JwtSecretMissing = 'JWT_SECRET is not defined in environment variables',
}

export enum DefaultText {
  Success = 'Success',
  Empty = '',
}

export enum DefaultStatus {
  Ok = 200,
  BadRequest = 400
}

export enum ValidationMessage {
  TenantCodeRequired = 'Tenant code cannot be empty.',
  AuthCodeRequired = 'Auth code cannot be empty.',
  RoleRequired = 'Role cannot be empty.',
  TenantCodeMustBeString = 'Tenant code must be a string.',
  AuthCodeMustBeString = 'Auth code must be a string.',
  RoleMustBeString = 'Role must be a string.',
}

export enum LogMessage {
  RegistrationAttempt = 'Registration attempt:',
  RegistrationSuccessPrefix = 'Registration successful for userId:',
}


