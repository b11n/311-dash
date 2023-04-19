import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminComponent } from './pages/admin/admin.component';
import { LayoutModule } from './shared/components/layout/layout.module';
import { DashboardModule } from './pages/dashboard/dashboard.module';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    ],
  imports: [
    LayoutModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DashboardModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
