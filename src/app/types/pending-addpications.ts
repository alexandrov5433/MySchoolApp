type PendingApplication = {
    _id: string, //_id of the pending application
    applicantName: string,
    displayId: string, //displayId of the student (User)
    profilePictureId: string
}

export type PendingApplications = {
    results: Array<PendingApplication>
};