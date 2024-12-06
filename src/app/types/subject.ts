import { Announcement } from "./announcement";
import { Assignment } from "./assignment";
import { File } from "./file";
import { User } from "./user";

export type Subject = {
    _id: string,
    teacher: User,
    title: string,
    materials: Array<File>,
    displayId: string,
    participants: Array<User>,
    assignments: Array<Assignment>,
    announcements: Array<Announcement>,
    backgroundImageNumber: string
};