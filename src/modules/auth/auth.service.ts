import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { TokenDto } from './dtos';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from '../user/dtos/login-user.dto';
import { UserDto } from '../user/dtos/user.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async signin(createUserDto: CreateUserDto): Promise<TokenDto> {
    try {
      const { firstName, lastName, email, password } = createUserDto;

      const existedUser = await this.userRepository.findOne({
        where: { email },
      });
      if (!existedUser) {
        throw new ConflictException('User with this email already exists!');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.userRepository.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      const payload = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      const accessToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRES,
      });

      const refreshToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRES,
      });

      return { accessToken, refreshToken };
    } catch (e) {
      throw new BadRequestException('Iternal error', e);
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<TokenDto> {
    try {
      const { email, password } = loginUserDto;

      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new UnauthorizedException('Invalid email!');
      }

      const isPasswordMatched = await bcrypt.compare(password, user.password);
      if (!isPasswordMatched) {
        throw new UnauthorizedException('Invalid password!');
      }

      const payload = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      const accessToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRES,
      });

      const refreshToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRES,
      });

      return { accessToken, refreshToken };
    } catch (e) {
      throw new BadRequestException('Iternal error', e);
    }
  }

  async refresh(refreshToken: string): Promise<TokenDto> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      const newAccessToken = this.jwtService.sign(
        {
          id: payload.id,
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: process.env.JWT_EXPIRES,
        },
      );
      const newRefreshToken = this.jwtService.sign(
        {
          id: payload.id,
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: process.env.JWT_EXPIRES_REFRESH,
        },
      );

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (e) {
      throw new BadRequestException('Iternal error', e);
    }
  }

  async getMe(user: UserDto): Promise<User> {
    try {
      const foundUser = await this.userRepository.findOne({
        where: { id: user.id },
      });

      if (!foundUser) {
        throw new NotFoundException('User not found');
      }

      return foundUser;
    } catch (e) {
      throw new BadRequestException('Iternal error', e);
    }
  }

  async requestResetPassword(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException('Wrong email');
      }

      const resetPasswordToken = this.jwtService.sign(
        { email: user.email, id: user.id },
        {
          expiresIn: process.env.JWT_EXPIRES_RESET,
          secret: process.env.JWT_RESET_SECRET,
        },
      );

      await this.mailService.sendResetPasswordEmail(
        email,
        `${process.env.API_URL}/auth/reset-password/${resetPasswordToken}`,
      );

      return user;
    } catch (e) {
      throw new BadRequestException('Iternal error', e);
    }
  }

  async getUserFromPayload(resetPasswordToken: string): Promise<User> {
    try {
      const payload = this.jwtService.verify(resetPasswordToken, {
        secret: process.env.JWT_RESET_SECRET,
      });

      const user = await this.userRepository.findOne({
        where: { email: payload.email, id: payload.id },
      });

      if (!user) {
        throw new NotFoundException('Reset token not found');
      }
      return user;
    } catch (e) {
      throw new BadRequestException('Iternal error', e);
    }
  }

  async resetPassword(
    newPassword: string,
    resetPasswordToken: string,
  ): Promise<User> {
    try {
      const user = await this.getUserFromPayload(resetPasswordToken);
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      return await this.userRepository.save(user);
    } catch (e) {
      throw new BadRequestException('Iternal error', e);
    }
  }
}
