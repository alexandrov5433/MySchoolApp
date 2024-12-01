import { ValidatorFn } from "@angular/forms";

export function authenticationCodeValidator(): ValidatorFn {
    const regex = new RegExp('^[0-9]+$');
    return (control) => {
        const val = control?.value;
        const isInvalid = regex.test(val);
        return isInvalid ? null : { authenticationCodeValidator : true };
    };
}