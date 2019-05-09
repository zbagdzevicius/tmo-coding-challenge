import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Observable } from 'rxjs';
import {Chart} from './chart.model'

@Component({
  selector: 'coding-challenge-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  @Input() data$: Observable<any>;
  chartData: any;

  chart: Chart;
  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.chart = {
      title: '',
      type: 'LineChart',
      data: [],
      columnNames: ['period', 'close'],
      options: { title: `Stock price`, width: '600', height: '400' }
    };

    this.data$.subscribe(newData => (this.chartData = newData));
  }

}
