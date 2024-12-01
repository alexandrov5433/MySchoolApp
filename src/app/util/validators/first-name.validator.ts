import { ValidatorFn } from "@angular/forms";
// validator for first and last name
export function firstNameValidator(): ValidatorFn {
    const regex = new RegExp('^[A-Za-z ]+$');
    return (control) => {
        const val = control?.value.trim();
        const isInvalid = regex.test(val);
        return isInvalid ? null : { firstNameValidator : true };
    };
}