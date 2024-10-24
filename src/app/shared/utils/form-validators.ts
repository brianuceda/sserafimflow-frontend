import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const hasAnyError = (input: any, form: FormGroup, validationName: 'required' | 'minlength' | 'maxlength' | 'min' | 'max' | 'email' = 'email') => {
  const control = form.get(input.field);
  return control && control?.touched && control.hasError(validationName);
};

export const isValidPassword = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.value;

    // Reglas para la contraseña:
    // - Mínimo 6 caracteres
    // - Al menos 1 letra minúscula
    // - Al menos 1 letra mayúscula
    // - Al menos 1 número
    // - Debe contener al menos un carácter especial: !@#$%^&*()-+_=
    // - No permitir comillas simples o dobles
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-+_=])[A-Za-z\d!@#$%^&*()\-+_=]{6,}$/;

    // No permitir comillas simples o dobles
    if (password.includes("'") || password.includes('"')) {
      return { invalidPassword: 'Las comillas no están permitidas' };
    }

    // Validar si la contraseña cumple con el patrón
    if (!passwordPattern.test(password)) {
      return { invalidPassword: 'Contraseña poco segura' };
    }

    return null; // Devuelve null si no hay errores
  };
};
