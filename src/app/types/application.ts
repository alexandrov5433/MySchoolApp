import { User } from "./user";

export type Application = {
    _id: string,
    status: string,
    applicationDocuments: Array<string>,
    applicant: User
};