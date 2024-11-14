import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators';
import { CreateUserDto } from '../user/dtos/createUser.dto';
import { RefreshTokenDto, TokenDto } from './dtos';
import { LoginUserDto } from '../user/dtos/loginUser.dto';
import { User } from '../user';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @Public()
  async signUp(@Body() createUserDto: CreateUserDto): Promise<TokenDto> {
    return await this.authService.signin(createUserDto);
  }

  @Post('/login')
  @Public()
  async login(@Body() loginUserDto: LoginUserDto): Promise<TokenDto> {
    return await this.authService.login(loginUserDto);
  }

  //   @Get('/activate/:link')
  //   @Public()
  //   async activate(
  //     @Param('link') activationLink: string,
  //     @Res() res: Response,
  //   ): Promise<void> {
  //     await this.authService.activate(activationLink);
  //     return res.redirect(process.env.CLIENT_URL);
  //   }

  @Post('/refresh')
  @Public()
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string }> {
    return await this.authService.refresh(refreshTokenDto.refreshToken);
  }

  @Get('/me')
  @Public()
  async getMe(@Req() req): Promise<User> {
    return await this.authService.getMe(req.user);
  }

  @Post('/reset-password')
  @Public()
  async requestResetPassword(@Body('email') email: string): Promise<User> {
    return await this.authService.requestResetPassword(email);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/change-password')
  async requestChangePassword(@Body('email') email: string): Promise<User> {
    return await this.authService.requestResetPassword(email);
  }

  @Post('/reset-password-accept/:token')
  async resetPasswordAccept(
    @Param('token') resetPasswordToken: string,
    @Res() res: Response,
  ): Promise<void> {
    await this.authService.getUserFromPayload(resetPasswordToken);
    return res.redirect(
      `${process.env.CLIENT_URL}/reset-pass/${resetPasswordToken}`,
    );
  }

  @Post('/reset-password/:token')
  @Public()
  async resetPassword(
    @Param('token') resetPasswordToken: string,
    @Body('newPassword') newPassword: string,
  ): Promise<User> {
    return await this.authService.resetPassword(
      newPassword,
      resetPasswordToken,
    );
  }
}
