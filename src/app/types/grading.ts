import { Grade } from "./grade";
import { Subject } from "./subject";
import { User } from "./user";

export type Grading = {
    _id: string,
    grades: Array<Grade>,
    student: User | string,
    subject: Subject
};