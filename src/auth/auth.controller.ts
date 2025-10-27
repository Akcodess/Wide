import { Controller, Post, Body } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthMessage, DefaultStatus, ErrorMessage } from './constants/auth.enums';

@Controller(process.env.WIDE_PRIFIX!)
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ApiResponse({ status: DefaultStatus?.Ok, description: AuthMessage?.RegisteredSuccessfully, type: AuthResponseDto })
  @ApiResponse({ status: DefaultStatus?.BadRequest, description: ErrorMessage?.RegistrationFailed })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }
}
