import { ValidatorFn } from "@angular/forms";

export function houseNumberValidator(): ValidatorFn {
    const regex = new RegExp('^(?<![A-Za-z -])[0-9 -]+[A-Za-z]?$');
    return (control) => {
        const val = control?.value.trim();
        const isInvalid = regex.test(val);
        return isInvalid ? null : { houseNumberValidator : true };
    };
}