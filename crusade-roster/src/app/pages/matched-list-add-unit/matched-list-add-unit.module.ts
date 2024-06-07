import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatchedListAddUnitComponent } from './matched-list-add-unit.component';

@NgModule({
  declarations: [
    MatchedListAddUnitComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: MatchedListAddUnitComponent }
    ])
  ]
})
export class MatchedListAddUnitModule { }
