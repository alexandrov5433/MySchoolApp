import { AssignmentSubmition } from "./assignment-submition";
import { File } from "./file";
import { User } from "./user";

export type Assignment = {
    _id: string,
    teacher: User,
    title: string,
    description: string,
    deadline: string,
    resource?: File,
    assignmentSubmitions?: Array<AssignmentSubmition>
};