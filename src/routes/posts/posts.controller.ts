import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Auth } from '../../shared/decorators/auth.decorator';
import { AuthKey, ConditionKey } from '../../shared/constants/auth';
import { ActiveUser } from '../../shared/decorators/active-user.decorator';
import { PostItemDto } from './dto/post-item.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @Auth([AuthKey.Bearer])
  async create(@Body() body: CreatePostDto, @ActiveUser('userId') userId: number) {
    return new PostItemDto(await this.postsService.create(body, userId));
  }

  @Get()
  @Auth([AuthKey.Bearer, AuthKey.APIKey], { condition: ConditionKey.Or })
  findAll(@ActiveUser('userId') userId: number) {
    return this.postsService.findAll(userId).then((post) => post.map((post) => new PostItemDto(post)));
  }

  @Get(':id')
  @Auth([AuthKey.Bearer])
  async findOne(@Param('id') id: string) {
    return new PostItemDto(await this.postsService.findOne(+id));
  }

  @Put(':id')
  @Auth([AuthKey.Bearer])
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @ActiveUser('userId') userId: number) {
    return new PostItemDto(await this.postsService.update({ id: +id, updatePostDto, userId }));
  }

  @Delete(':id')
  @Auth([AuthKey.Bearer])
  remove(@Param('id') id: string, @ActiveUser('userId') userId: number) {
    return this.postsService.remove(+id, userId);
  }
}
