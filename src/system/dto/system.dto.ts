import { IsOptional, IsString } from "class-validator";

export class VersionRequestDto {
    @IsOptional()
    @IsString()
    reqId?: string;
}

export class VersionInfoDto {
    ReleaseVersion: string;

    ReleaseDate: string;

    Name: string;
}

export class VersionResponseDto {
    ReqId?: string;

    EvType: string;

    Version: VersionInfoDto;

    EvCode: string;

    TimeStamp: string;
}

export class HealthResponseDto {
    Text: string;

    Status: number;
}
