import { Component, input, output } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { AddCompanyBuilder } from '../../builders';
import { ReactiveFormsModule } from '@angular/forms';
import { NewCompany } from '../../models';

@Component({
  selector: 'app-add-dialog',
  imports: [Button, Dialog, ReactiveFormsModule],
  templateUrl: './add-dialog.component.html',
})
export class AddDialogComponent {
  public readonly visible = input<boolean>(false);

  public readonly hide = output<void>();
  public readonly save = output<NewCompany>();

  protected readonly form = AddCompanyBuilder.build();

  protected onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.save.emit(this.form.value as NewCompany);
    this.form.reset();
  }
}
