import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt.guard';
import { UsersService } from './users.service';
import { UploadController } from './upload.controller';
import { MinioService } from './minio.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev_secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AppController, AuthController, UploadController],
  providers: [AppService, PrismaService, AuthService, JwtStrategy, JwtAuthGuard, UsersService, MinioService],
})
export class AppModule {}
