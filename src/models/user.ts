import { Role } from "./roles";
import { Device } from "./device";

export class User {
    userid: number;
    name: string;
    username: string;
    lastname?: string;
    password_hash?: string;
    roleid: number;
    deviceid?: number;
    role?: Role;
    device?: Device;
}