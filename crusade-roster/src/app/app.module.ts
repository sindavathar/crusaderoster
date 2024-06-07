import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminComponent } from './pages/admin/admin.component';
import { MatchedListComponent } from './pages/matched-list/matched-list.component';
import { MatchedListAddUnitComponent } from './pages/matched-list-add-unit/matched-list-add-unit.component';
import { TitlecasePipe } from './pipes/titlecase.pipe'; // Import the custom pipe

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LayoutComponent,
    DashboardComponent,
    AdminComponent,
    MatchedListComponent,
    MatchedListAddUnitComponent,
    TitlecasePipe // Declare the custom pipe
  ],
  imports: [
    BrowserModule,
    MatSlideToggleModule,
    CommonModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
