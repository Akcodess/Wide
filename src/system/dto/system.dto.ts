import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class VersionRequestDto {
    @ApiProperty()
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
    @ApiProperty()
    ReqId?: string;

    @ApiProperty()
    EvType: string;

    @ApiProperty()
    Version: VersionInfoDto;

    @ApiProperty()
    EvCode: string;

    @ApiProperty()
    TimeStamp: string;
}

export class HealthResponseDto {
    @ApiProperty()
    Text: string;

    @ApiProperty()
    Status: number;
}
