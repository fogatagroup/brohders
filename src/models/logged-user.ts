import { User } from "./user";
import { Guid } from "guid-typescript";

export class LoggedUser {
    user: User;
    token: Guid;
    expires: number;
}