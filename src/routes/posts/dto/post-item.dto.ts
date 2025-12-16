import { Type } from 'class-transformer';
import { PostModel } from '../../../shared/models/post.model';
import { UserModel } from '../../../shared/models/user.model';

export class PostItemDto extends PostModel {
  @Type(() => UserModel)
  author: Omit<UserModel, 'password'>;

  constructor(partial: Partial<PostItemDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
