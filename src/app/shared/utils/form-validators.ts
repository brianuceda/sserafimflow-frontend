import { FormGroup } from '@angular/forms';

export const isRequired = (input: any, form: FormGroup) => {
  const control = form.get(input.field);
  return control && control.touched && control.hasError('required');
};

export const hasEmailError = (form: FormGroup) => {
  const control = form.get('email');
  return control && control?.touched && control.hasError('email');
};
