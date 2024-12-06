import { File } from "./file";
import { User } from "./user";

export type AssignmentSubmition = {
    _id: string,
    student: User | string,
    document: File | string
};