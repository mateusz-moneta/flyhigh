import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface AddCompanyForm {
  name: FormControl<string>;
  shares: FormControl<number | null>;
}

export class AddCompanyBuilder {
  public static build(): FormGroup<AddCompanyForm> {
    return new FormGroup({
      name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
      shares: new FormControl<number | null>(null, [Validators.min(1), Validators.required]),
    });
  }
}
