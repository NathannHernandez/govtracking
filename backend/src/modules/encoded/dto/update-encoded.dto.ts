import { PartialType } from '@nestjs/mapped-types';
import { CreateEncodedDto } from './create-encoded.dto';

export class UpdateEncodedDto extends PartialType(CreateEncodedDto) {}
