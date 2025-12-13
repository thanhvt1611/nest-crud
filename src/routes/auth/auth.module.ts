import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HashingService } from '../../shared/services/hashing.service';
import { PrismaService } from '../../shared/services/prisma.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, HashingService, PrismaService],
})
export class AuthModule {}
