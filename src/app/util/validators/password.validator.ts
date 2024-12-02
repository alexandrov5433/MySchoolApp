import { ValidatorFn } from "@angular/forms";

export function passwordValidator(): ValidatorFn {
    const regex = new RegExp('^[0-9A-Za-z$%_!+@?=&,;.:-]{8,}$');
    return (control) => {
        const val = control?.value;
        const isInvalid = regex.test(val);
        return isInvalid ? null : { passwordValidator : true };
    };
}