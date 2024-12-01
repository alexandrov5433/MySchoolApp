import { ValidatorFn } from "@angular/forms";

export function dateOfBirthValidator(): ValidatorFn {
    const regex = new RegExp('^[0-9]{4}-[0-9]{2}-[0-9]{2}$');
    return (control) => {
        const val = control?.value;
        const isInvalid = regex.test(val);
        return isInvalid ? null : { dateOfBirthValidator : true };
    };
}