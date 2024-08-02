export interface User {
    phone: string;
    name: string;
    password: string;
    id?: string;
    gender?: string;
    birthday?: string;
    avatar?: string;
    push_token?: string;
    deleted_at?: Date;
    updated_at?: Date;
    created_at?: Date;
    storeProcedure?: string;
}