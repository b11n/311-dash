import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { CommonComponentsModule } from 'src/app/shared/components/common/common.module';
import { FilterModule } from 'src/app/shared/components/widgets/filter/filter.module';
import { TableModule } from 'src/app/shared/components/widgets/table/table.module';


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    CommonComponentsModule,
    FilterModule,
    TableModule,
  ],
  exports: [DashboardComponent]
})
export class DashboardModule { }
