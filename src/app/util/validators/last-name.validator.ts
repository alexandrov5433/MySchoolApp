import { ValidatorFn } from "@angular/forms";

export function lastNameValidator(): ValidatorFn {
    const regex = new RegExp('^[A-Za-z ]+$');
    return (control) => {
        const val = control?.value.trim();
        const isInvalid = regex.test(val);
        return isInvalid ? null : { lastNameValidator : true };
    };
}