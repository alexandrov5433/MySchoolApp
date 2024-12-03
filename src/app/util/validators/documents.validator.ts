import { ValidatorFn } from "@angular/forms";

export function documentsValidator(): ValidatorFn {
    return (control) => {
        const val: string = control?.value || '';
        return val.endsWith('.pdf') ? null : { documentsValidator: true };
    };
}