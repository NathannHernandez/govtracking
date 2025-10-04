import { PartialType, IntersectionType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';
import { LoginAuthDto } from './login-auth.dto';

export class UpdateAuthDto extends PartialType(
  IntersectionType(CreateAuthDto, LoginAuthDto),
) {}
