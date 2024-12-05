import { File } from "./file";
import { User } from "./user";

export type Application = {
    _id: string,
    status: string,
    applicationDocuments: Array<string> | Array<File>,
    applicant: User
};