
export type ValidationLib = {
    registerAs: {
      validationClass: string,
      showErrMsg: boolean
    },
    firstName: {
      validationClass: string,
      showErrMsg: boolean
    },
    lastName: {
      validationClass: string,
      showErrMsg: boolean
    },
    dateOfBirth: {
      validationClass: string,
      showErrMsg: boolean
    },
    email: {
      validationClass: string,
      showErrMsg: boolean
    },
    mobileNumber: {
      validationClass: string,
      showErrMsg: boolean
    },
    homeNumber: {
      validationClass: string,
      showErrMsg: boolean
    },
    street: {
      validationClass: string,
      showErrMsg: boolean
    },
    houseNumber: {
      validationClass: string,
      showErrMsg: boolean
    },
    city: {
      validationClass: string,
      showErrMsg: boolean
    },
    authenticationCode:{
      validationClass: string,
      showErrMsg: boolean
    },
    password: {
      validationClass: string,
      showErrMsg: boolean
    },
    rePassword: {
      validationClass: string,
      showErrMsg: boolean
    },
    applyNowRePassword?: {
      validationClass: string,
      showErrMsg: boolean
    },
    profilePicture: {
      showErrMsg: boolean
    }
    documents?: {
      showErrMsg: boolean
    }
  };