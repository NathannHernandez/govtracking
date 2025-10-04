import { IsString, IsDateString, isString, IsEnum, isEnum } from 'class-validator'
enum Encoded {
  YES = 'YES',
  NO = 'NO',
  UPDATED = 'UPDATED',
  PENDING = 'PENDING'
}



export class CreateSwdiDto {
    @IsString()
    username : string

    userId : number

    @IsString()
    hhId : string

    @IsString()
    grantee: string

    @IsString()
    swdiScore : string

    @IsEnum(Encoded)
    encoded : Encoded

    @IsString()
    issue : string
    
    @IsDateString()
    date: Date

    


}

    // id: number;
    //userId
    // username: string;
    // hhId: string;
    // grantee: string;
    // swdiScore: string;
    // encoded: string;
    // issue: string;
    // date: string;