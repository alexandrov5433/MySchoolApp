import { ValidatorFn } from "@angular/forms";
import { ApplyNowComponent } from "../../account/apply-now/apply-now.component";


export function applyNowRePasswordValidator(component: ApplyNowComponent): ValidatorFn {
    return (control) => {
        const password = component.form?.get('password')?.value;
        const rePassword = control?.value;
        const isInvalid = rePassword === password;
        return isInvalid ? null : { applyNowRePasswordValidator : true };
    };
}