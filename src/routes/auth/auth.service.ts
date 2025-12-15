import { ConflictException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { HashingService } from '../../shared/services/hashing.service';
import { PrismaService } from '../../shared/services/prisma.service';
import { TokenService } from '../../shared/services/token.service';
import { LoginBodyDTO, RegisterBodyDTO } from './auth.dto';
import { isNotFoundError, isUniqueConstraintError } from '../../shared/helpers';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async register(body: RegisterBodyDTO) {
    try {
      const hashedPassword = await this.hashingService.hashPassword(body.password);
      return await this.prisma.user.create({
        data: {
          email: body.email,
          name: body.name,
          password: hashedPassword,
        },
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async login(body: LoginBodyDTO) {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          email: body.email,
        },
      });

      const isMatch = await this.hashingService.comparePassword(body.password, user.password);
      if (!isMatch) {
        throw new UnprocessableEntityException({
          field: 'password',
          error: 'Password is incorrect',
        });
      }

      const tokens = await this.generateTokens(user.id);

      return {
        ...user,
        ...tokens,
      };
    } catch (error) {
      if (isNotFoundError(error)) {
        throw new UnauthorizedException('User not found');
      }
      throw error;
    }
  }

  async generateTokens(userId: number) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken({ userId }),
      this.tokenService.signRefreshToken({ userId }),
    ]);

    const refreshTokenDecode = await this.tokenService.verifyRefreshToken(refreshToken);
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt: new Date(refreshTokenDecode.exp * 1000),
      },
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    try {
      const refreshTokenRecord = await this.prisma.refreshToken.findFirstOrThrow({
        where: {
          token: refreshToken,
        },
      });

      await this.prisma.refreshToken.delete({
        where: {
          id: refreshTokenRecord.id,
        },
      });

      const refreshTokenDecode = await this.tokenService.verifyRefreshToken(refreshToken);
      const userId = refreshTokenDecode.userId;
      const tokens = await this.generateTokens(userId);
      return tokens;
    } catch (error) {
      if (isNotFoundError(error)) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      throw error;
    }
  }

  async logout(refreshToken: string) {
    try {
      const refreshTokenRecord = await this.prisma.refreshToken.findFirstOrThrow({
        where: {
          token: refreshToken,
        },
      });

      await this.prisma.refreshToken.delete({
        where: {
          id: refreshTokenRecord.id,
        },
      });

      return { message: 'Logout successfully' };
    } catch (error) {
      if (isNotFoundError(error)) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      throw error;
    }
  }
}
