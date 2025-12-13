import { Exclude } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import { ConfirmPassWord } from '../../shared/decorators/confirm-password.decorator';

export class LoginBodyDTO {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class RegisterBodyDTO extends LoginBodyDTO {
  @IsString()
  name: string;

  @IsString()
  @ConfirmPassWord('password', { message: 'Mật khẩu không khớp' })
  confirmPassword: string;
}

export class RegisterResDTO {
  id: number;
  email: string;
  name: string;
  @Exclude() password: string;
  // @Expose()
  // get emailName() {
  //   return this.email + ' - ' + this.name;
  // }
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<RegisterResDTO>) {
    Object.assign(this, partial);
  }
}

export class LoginResDTO extends RegisterResDTO {
  accessToken: string;
  refreshToken: string;

  constructor(partial: Partial<LoginResDTO>) {
    super(partial);
    Object.assign(this, partial);
  }
}

export class RefreshTokenResDTO {
  accessToken: string;
  refreshToken: string;

  constructor(partial: Partial<RefreshTokenResDTO>) {
    Object.assign(this, partial);
  }
}

export class RefreshTokenBodyDTO {
  @IsString()
  refreshToken: string;
}
