export type RegisterFormData = {
    registerAs: string | null;
    firstName: string | null;
    lastName: string | null;
    dateOfBirth: string | null;
    email: string | null;
    mobileNumber: string | null;
    homeNumber: string | null;
    street: string | null;
    houseNumber: string | null;
    city: string | null;
    authenticationCode: string | null;
    password: string | null;
    rePassword: string | null;
    profilePicture: string | File | null;
};