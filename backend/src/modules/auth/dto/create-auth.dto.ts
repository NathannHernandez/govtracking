export class CreateAuthDto {
    email: string;
    password: string;
    username: string;
    role?: 'USER' | 'ADMIN';
    

}
