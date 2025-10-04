import { PartialType } from '@nestjs/mapped-types';
import { CreatePcnDto } from './create-pcn.dto';

export class UpdatePcnDto extends PartialType(CreatePcnDto) {}
