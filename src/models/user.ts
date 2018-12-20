import { Role } from "./roles";

export class User {
    userid: number;
    name: string;
    username: string;
    lastname?: string;
    password_hash?: string;
    roleid: number;
    role?: Role;
}