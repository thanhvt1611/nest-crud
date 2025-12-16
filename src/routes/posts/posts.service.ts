import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../../shared/services/prisma.service';
import { isNotFoundError } from '../../shared/helpers';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  create(body: CreatePostDto, userId: number) {
    return this.prisma.post.create({
      data: { ...body, authorId: userId },
      include: { author: { omit: { password: true } } },
    });
  }

  findAll(userId: number) {
    return this.prisma.post.findMany({
      where: {
        authorId: userId,
      },
      include: {
        author: {
          omit: {
            password: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    try {
      return await this.prisma.post.findUniqueOrThrow({
        where: { id },
        include: { author: { omit: { password: true } } },
      });
    } catch (error) {
      if (isNotFoundError(error)) {
        throw new UnauthorizedException('Post not found');
      }
      throw error;
    }
  }

  async update(body: { id: number; updatePostDto: UpdatePostDto; userId: number }) {
    try {
      const { id, updatePostDto, userId } = body;
      return await this.prisma.post.update({
        data: updatePostDto,
        where: { id, authorId: userId },
        include: { author: { omit: { password: true } } },
      });
    } catch (error) {
      if (isNotFoundError(error)) {
        throw new UnauthorizedException('Post not found');
      }
      throw error;
    }
  }

  async remove(id: number, userId: number) {
    try {
      return await this.prisma.post.delete({ where: { id, authorId: userId } });
    } catch (error) {
      if (isNotFoundError(error)) {
        throw new UnauthorizedException('Post not found');
      }
      throw error;
    }
  }
}
