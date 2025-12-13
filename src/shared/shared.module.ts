import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from './services/prisma.service';
import { HashingService } from './services/hashing.service';
import { TokenService } from './services/token.service';

const services = [PrismaService, HashingService, TokenService];

@Global()
@Module({
  providers: services,
  exports: services,
  imports: [JwtModule],
})
export class SharedModule {}
