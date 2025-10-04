export type SWDIFormFields = {
    hhId: string;
    grantee: string;
    swdiScore: string;
    encoded: string;
    issue?: string;
    date: string;
};

export type SwdiData = { 
    id : number;
    hhId : string;
    grantee : string;
    swdiScore : string;
    encoded: string;
    issue? : string;
    date: string;
    userId: number;
    username: string
    createdAt?: string
    updatedAt?: string
}
