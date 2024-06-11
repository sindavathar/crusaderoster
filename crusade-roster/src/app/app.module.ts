import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminComponent } from './pages/admin/admin.component';
import { UnitDetailComponent } from './pages/admin/unit/unit-detail.component';
import { MatchedListComponent } from './pages/matched-list/matched-list.component';
import { MatchedListAddUnitComponent } from './pages/matched-list-add-unit/matched-list-add-unit.component';
import { TitlecasePipe } from './pipes/titlecase.pipe';

import { FactionService } from './services/faction.service';
import { UnitService } from './services/unit.service';
import { ListService } from './services/list.service';
import { UnitDetailsService } from './services/unit-details.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LayoutComponent,
    DashboardComponent,
    AdminComponent,
    UnitDetailComponent,
    MatchedListComponent,
    MatchedListAddUnitComponent,
    TitlecasePipe
  ],
  imports: [
    BrowserModule,
    MatSlideToggleModule,
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    FactionService,
    UnitService,
    ListService,
    UnitDetailsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
