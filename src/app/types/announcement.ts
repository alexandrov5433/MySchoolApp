import { User } from "./user";

export type Announcement = {
    _id: string,
    teacher: User | string,
    title: string,
    description: string,
};