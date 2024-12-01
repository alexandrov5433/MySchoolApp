import { ValidatorFn } from "@angular/forms";

export function mobileNumberValidator(): ValidatorFn {
    const regex = new RegExp('^[+]?[0-9 ]+$');
    return (control) => {
        const val = control?.value.trim();
        return regex.test(val) ? null : { mobileNumberValidator: true };
    };
}
