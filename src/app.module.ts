import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AuthModule,
  GroupModule,
  MailModule,
  StudentModule,
  UserModule,
} from './modules';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // type: 'postgres',
      // host: process.env.DB_HOST,
      // port: +process.env.DB_PORT,
      // username: process.env.DB_USERNAME,
      // password: process.env.DB_PASSWORD,
      // database: process.env.DB_DATABASE,
      // entities: ['dist/**/*.entity.js'],
      // synchronize: true,
      // autoLoadEntities: true,
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: ['dist/**/*.entity.js'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    StudentModule,
    GroupModule,
    AuthModule,
    UserModule,
    MailModule,
  ],
})
export class AppModule {}
