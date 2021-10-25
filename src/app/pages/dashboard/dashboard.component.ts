import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TradingComponent } from '../../modals/trading/trading.component'
import { StorageService } from '../../services/storage.service';
import { isEmpty } from 'lodash';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import { ChartDataSets, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public trade: any;
  public profit: number = 0;
  public history: any;
  public hasTrade: boolean = false;

  public historyChartData: ChartDataSets[] = [
    { data: [] },
  ];
  public historyChartLabels: Label[] = [];
  public historyChartOpts: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      xAxes: [{}],
      yAxes: []
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          borderWidth: 1,
          label: {
            enabled: false,
            fontColor: 'orange',
            content: 'LineAnno'
          }

        },
      ],
    },
  };
  public historyChartColors: Color[] = [
    {
      backgroundColor: 'rgba(63,81,181,0.2)',
      borderColor: 'rgba(63,81,181,1)',
      pointBackgroundColor: 'rgba(63,81,181,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(63,81,181,1)'
    },
  ]

  constructor(
    private _dialog: MatDialog,
    private _storageService: StorageService,
  ) { }

  ngOnInit(): void {
    this._storageService.trade.subscribe(res => {
      this.trade = res;
      this.hasTrade = !isEmpty(this.trade);
    });
    this._storageService.history.subscribe(res => {
      this.history = res;
      this.historyChartData[0].data = this.history;
      let labels: Label[] = [];
      let profit = 0;
      for (const index in this.history) {
        profit += parseFloat(this.history[index]);
        labels.push(index);
      }
      this.historyChartLabels = labels;
      this.profit = parseFloat(profit.toFixed(2));
    });
  }

  openModalTrading() {
    const ref = this._dialog.open(TradingComponent, {
      data: {
        trade: this.trade || {},
      }
    });
  }

}
