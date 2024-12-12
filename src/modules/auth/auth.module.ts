import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user';
import { JwtStrategy } from './strategies';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AuthService, JwtStrategy, JwtService, MailService],
  controllers: [AuthController],
})
export class AuthModule {}
