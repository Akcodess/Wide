import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import * as qs from 'qs';
import moment from 'moment';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { plainToInstance, classToPlain } from 'class-transformer';
import https from 'https';

import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthMessage, ErrorMessage, LogMessage } from './constants/auth.enums';
import { TenantConnectionService } from '../tenant/tenant-connection.service';
import { NucleusApiResponse } from './interface/nucleus-api-response.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private dbConnections: Record<string, any> = {};
  private nucleusTokens: Record<string, string> = {};

  constructor(private configService: ConfigService,
    private jwtService: JwtService,
    private tenantConn: TenantConnectionService) { }

  private async callNucleusApi(tenantCode: string, authCode: string, role: string): Promise<NucleusApiResponse> {
    try {
      const url = `${this.configService.get('NUCLEUS_SERVER_URL')}/tenants/${tenantCode}/users/auth/token`;
      const basicAuthToken = Buffer.from(`${this.configService.get('NUCLEUS_API_USER')}:${this.configService.get('NUCLEUS_API_PASS')}`).toString('base64');

      const postData = qs.stringify({ grant_type: 'authorization_code', auth_code: authCode, role });

      this.logger.log(`Calling Nucleus API: ${url}`);
      const response = await axios.post(url, postData, {
        headers: {
          Authorization: `Basic ${basicAuthToken}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: this.configService.get('CHECKSSL_FOR_CCLOGIN') === 'true'
        })
      });

      return response.data;
    } catch (error) {
      this.logger.error('Nucleus API call failed', error.response?.data || error.message);
      throw error;
    }
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    this.logger.log(`${LogMessage.RegistrationAttempt} ${JSON.stringify(registerDto)}`);

    try {
      const { tenantCode, authCode, role } = registerDto;
      const validateResponse = await this.callNucleusApi(tenantCode, authCode, role);

      if (!validateResponse || validateResponse.EvType === 'Failed') {
        throw new InternalServerErrorException(ErrorMessage.NucleusValidationFailed);
      }

      this.nucleusTokens[`nucleusToken_${tenantCode}`] = validateResponse?.AccessToken || '';

      const jwtPayloadData = {
        userId: validateResponse?.UserId || '',
        roles: [role],
        userName: validateResponse?.FullName || this.configService.get('NUCLEUS_API_PASS'),
        tenantCode,
      };

      const jwtPayload = plainToInstance(JwtPayloadDto, jwtPayloadData);
      const plainJwtPayload = classToPlain(jwtPayload);
      const token = this.jwtService.sign(plainJwtPayload);

      const decoded = this.jwtService.decode(token);

      if (!decoded || !decoded.exp) {
        throw new InternalServerErrorException(ErrorMessage.FailedToDecodeJwt);
      }

      const expTime = moment.unix(decoded.exp).format('YYYY-MM-DD HH:mm:ss');

      const responseData = {
        Status: 200,
        Message: AuthMessage.RegisteredSuccessfully,
        UserId: plainJwtPayload.userId,
        Roles: plainJwtPayload.roles,
        UserName: plainJwtPayload.userName,
        TenantCode: plainJwtPayload.tenantCode,
        AccessToken: token,
        ExpiresIn: expTime,
        TimeStamp: moment().format('YYYY-MM-DD HH:mm:ss'),
        EvType: validateResponse?.EvType ?? '',
        EvCode: validateResponse?.EvCode ?? '',
      };

      // Ensure tenant database exists and is initialized after successful register
      await this.tenantConn.ensureTenant(tenantCode);

      this.logger.log(`${LogMessage.RegistrationSuccessPrefix} ${plainJwtPayload.userId}`);

      return plainToInstance(AuthResponseDto, responseData);
    } catch (error) {
      this.logger.error(ErrorMessage.RegistrationFailed, error.response?.data || error.message);
      throw new InternalServerErrorException(error.response?.data?.Message || error.message);
    }
  }
}
