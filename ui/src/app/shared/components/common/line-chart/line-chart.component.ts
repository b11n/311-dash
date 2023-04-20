import {Input, Component ,ViewChild} from '@angular/core';
import { Chart, ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';


interface ChartRow {
  date: string;
  count: number;
}

interface ChartData {
  rows: ChartRow[]
}

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent {


  @Input()
  public set data(data: ChartData) {
    this.lineChartData.datasets[0].data = data.rows.map(row=>row.count);
    this.lineChartData.labels = data.rows.map(row=>row.date);
    if(this.chart && this.chart.chart){
      this.chart.chart.update();
    }
    
  }


  lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [ 65, 59, 80, 81, 56, 55, 40 ],
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
        
      },
    ],
    labels: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July' ]
  };

  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: {
        tension: 0.5
      }
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      y:
        {
          position: 'left',
        },
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;


  
}
