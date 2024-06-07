import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatchedListComponent } from './matched-list.component';

@NgModule({
  declarations: [
    MatchedListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: MatchedListComponent }
    ])
  ]
})
export class MatchedListModule { }
