import { ValidatorFn } from "@angular/forms";
import { RegisterComponent } from "../../account/register/register.component";

export function rePasswordValidator(registerComponent: RegisterComponent): ValidatorFn {
    return (control) => {
        const password = registerComponent.registerForm?.get('password')?.value;
        const rePassword = control?.value;
        const isInvalid = rePassword === password;
        return isInvalid ? null : { rePasswordValidator : true };
    };
}