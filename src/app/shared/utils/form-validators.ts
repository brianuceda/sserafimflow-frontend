import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const hasAnyError = (input: any, form: FormGroup, validationName: 'required' | 'minlength' | 'maxlength' | 'min' | 'max' | 'email' = 'email') => {
  const control = form.get(input.field);
  return control && control?.touched && control.hasError(validationName);
};

export const isValidPassword = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.value;
    
    // No validar si no hay valor
    if (!password) {
      return null;
    }

    // Reglas para la contraseña:
    // - Mínimo 6 caracteres
    // - Al menos 1 letra minúscula
    // - Al menos 1 letra mayúscula
    // - Al menos 1 número
    // - Debe contener al menos un carácter especial
    // - No permitir comillas simples o dobles
    
    const hasMinLength = password.length >= 6;
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()\-+_=.;:,<>?/\\|{}[\]]/.test(password);
    const hasNoQuotes = !password.includes("'") && !password.includes('"');
    
    if (!hasMinLength || !hasLowerCase || !hasUpperCase || !hasNumber || !hasSpecialChar || !hasNoQuotes) {
      return { invalidPassword: 'Contraseña poco segura' };
    }
    
    return null; // Devuelve null si no hay errores
  };
};
