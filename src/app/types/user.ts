export type User = {
    _id: string,
    status: string, //'parent', 'teacher', 'student'
    firstName: string,
    lastName: string,
    dateOfBirth: string,
    email: string,
    mobileNumber: string,
    homeNumber?: string,
    street: string,
    houseNumber: string,
    city: string,
    profilePicture: string,
    //student
    parentalAuthenticationCode?: string,
    //student
    uploadedDocuments?: Array<string>,
    displayId: string,
    //student
    parents?: Array<string>,
    //student
    activeStudent?: boolean,
    backgroundImageNumber?: string,
    password?: string
}