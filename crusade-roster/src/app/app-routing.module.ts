import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CrusadeListComponent } from './pages/crusade-list/crusade-list.component';
import { MatchedListComponent } from './pages/matched-list/matched-list.component';
import { MatchedListAddUnitComponent } from './pages/matched-list/matched-list-add-unit/matched-list-add-unit.component';
import { AdminComponent } from './pages/admin/admin.component';
import { UnitDetailComponent } from './pages/admin/unit/unit-detail.component';


const routes: Routes = [
  {
    path:'',
    redirectTo : 'login',
    pathMatch:'full'
  },
  {
    path:'login',
    component: LoginComponent
  },
  {
    path:'',
    component: LayoutComponent,
    children: [
      {
        path:'dashboard',
        component:DashboardComponent
      },
      {
        path: 'crusade-list/:id',
        component: CrusadeListComponent
      },
      {
        path: 'matched-list/:id',
        component: MatchedListComponent
      },
      {
        path: 'matched-list-add-unit/:faction/:category/:listId',
        component: MatchedListAddUnitComponent
      },
      {
        path: 'admin',
        component: AdminComponent
      },
      {
        path: 'admin/unit/:unitName',
        component: UnitDetailComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
