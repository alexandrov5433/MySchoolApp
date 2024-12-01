import { ValidatorFn } from "@angular/forms";

export function homeNumberValidator(): ValidatorFn {
    const regex = new RegExp('^[+]?[0-9 ]+$');
    return (control) => {
        const val = control?.value.trim();
        if (val === '') {
            return null;
            // null because home phone number is optional; validate only if entered
        }
        const isInvalid = regex.test(val);
        return isInvalid ? null : { homeNumberValidator: true };
    };
}
