import { FormGroup } from '@angular/forms';

export function resetValidators(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
        const control = formGroup.controls[key];
        control.markAsPristine();
        control.markAsUntouched();
    });
}