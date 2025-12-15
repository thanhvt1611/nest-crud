import { SetMetadata } from '@nestjs/common';
import { AUTH_KEY, AuthKeyType, ConditionKeyType } from '../constants/auth';

export const Auth = (authKey: AuthKeyType[], option: { condition: ConditionKeyType }) =>
  SetMetadata(AUTH_KEY, { authKey, option });
