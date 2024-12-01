import { ValidatorFn } from "@angular/forms";

export function registerAsValidator(): ValidatorFn {
    return (control) => {
        const val = control?.value;
        return ['parent', 'teacher'].includes(val) ? null : { registerAsValidator : true };
    };
}