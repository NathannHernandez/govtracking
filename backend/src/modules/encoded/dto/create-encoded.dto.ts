import { IsString, IsEnum, IsInt, IsDateString, MinLength } from "class-validator"
enum Encoded {
  YES = 'YES',
  NO = 'NO',
  UPDATED = 'UPDATED',
  PENDING = 'PENDING'
}
enum Files {
  BUS = 'BUS',
  SWDI = 'SWDI',
  PCN = 'PCN'
}


export class CreateEncodedDto {
  @IsString()
  @MinLength(1)
  hhId: string

  @IsString()
  @MinLength(1)
  name: string

  @IsEnum(Files)
  documentType: Files

  @IsInt()
  documentId: number

  @IsEnum(Encoded)
  encoded: Encoded

  @IsInt()
  userId: number

  @IsString()
  @MinLength(1)
  username: string

  @IsDateString()
  date: Date
}
