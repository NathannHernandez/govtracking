import { IsString, IsInt, IsOptional, IsEnum, IsDateString } from 'class-validator'
enum Encoded {
  YES = 'YES',
  NO = 'NO',
  UPDATED = 'UPDATED',
  PENDING = 'PENDING'
}

export class CreatePcnDto {
  @IsString()
  hhId: string

  @IsString()
  grantee: string

  @IsString()
  pcn: string

  @IsString()
  tr: string

  @IsEnum(Encoded)
  encoded: Encoded

  @IsOptional()
  @IsString()
  issue?: string

  @IsDateString()
  date: string

  @IsInt()
  userId: number

  @IsString()
  username: string
}
