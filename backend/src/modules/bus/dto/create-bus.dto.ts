import { IsString, IsDateString, IsEnum, IsInt, IsOptional } from 'class-validator'


enum Encoded {
  YES = 'YES',
  NO = 'NO',
  UPDATED = 'UPDATED',
  PENDING = 'PENDING'
}

export class CreateBusDto {
  @IsString()
  lgu: string

  @IsString()
  barangay: string

  @IsString()
  hhId: string

  @IsString()
  granteeName: string

  @IsString()
  typeOfUpdate: string

  @IsEnum(Encoded)
  encoded: Encoded

  @IsOptional()
  @IsString()
  issue: string

  @IsString()
  subjectOfChange: string

  @IsDateString()
  date: string

}
