import { ValidatorFn } from "@angular/forms";

export function emailValidator(): ValidatorFn {
    const regex = new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$');
    return (control) => {
        const val = control?.value;
        const isInvalid = regex.test(val);
        return isInvalid ? null : { emailValidator : true };
    };
}