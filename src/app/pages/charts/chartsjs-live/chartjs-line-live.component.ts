import { Component, OnDestroy } from '@angular/core';
import { NbThemeService, NbColorHelper } from '@nebular/theme';
import {InfluxQueryService} from '../../../services/influx.service';

@Component({
  selector: 'ngx-chartjs-line-live',
  styleUrls: ['./chartjs-live.component.scss'],
  templateUrl: './chartjs-live.component.html',
})
export class ChartjsLineLiveComponent implements OnDestroy {
  dataFC: any;
  dataFR: any;
  dataPA: any;
  colors: any;
  options: any;
  themeSubscription: any;
  selectedMeasure: any = 'adrenaline';
  selectedField: any = 'FrequenceCardiaque';
  selectedGroup: any = 1;
  selectedLimit: any = '100';
  labelsFrom: any;
  dataPointsFrom: any;
  labelsTo: any;
  dataPointsTo: any;
  timeLeft: number = 60;
  interval;
  statusButton: any = 'primary';
  textButton: string = 'Démarrer';
  statusPause: any = 'warning';
  textPause: string = 'Pause';
  paused: boolean = false;

  constructor(private theme: NbThemeService, private service: InfluxQueryService) {
    // this.updateData();

    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      this.colors = config.variables;
      const chartjs: any = config.variables.chartjs;

      // this.data = {
      //   labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      //   datasets: [{
      //     data: [65, 59, 80, 81, 56, 55, 40],
      //     label: 'Lapin 1',
      //     backgroundColor: NbColorHelper.hexToRgbA(this.colors.primary, 0.3),
      //     borderColor: this.colors.primary,
      //   }, {
      //     data: [28, 48, 40, 19, 86, 27, 90],
      //     label: 'Lapin 2',
      //     backgroundColor: NbColorHelper.hexToRgbA(this.colors.danger, 0.3),
      //     borderColor: this.colors.danger,
      //   }, {
      //     data: [18, 48, 77, 9, 100, 27, 40],
      //     label: 'Lapin 3',
      //     backgroundColor: NbColorHelper.hexToRgbA(this.colors.info, 0.3),
      //     borderColor: this.colors.info,
      //   },
      //   ],
      // };

      this.options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1,
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: true,
                color: chartjs.axisLineColor,
              },
              ticks: {
                fontColor: chartjs.textColor,
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                display: true,
                color: chartjs.axisLineColor,
              },
              ticks: {
                fontColor: chartjs.textColor,
              },
            },
          ],
        },
        legend: {
          labels: {
            fontColor: chartjs.textColor,
          },
        },
      };
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

  changeMeasure(newValue): void {
    this.selectedMeasure = newValue;
  }
  changeField(newValue): void {
    this.selectedField = newValue;
  }
  changeGroup(newValue): void {
    this.selectedGroup = newValue;
  }
  changeLimit(newValue): void {
    this.selectedLimit = newValue;
  }

  applySelection() {
    if (this.statusButton === 'primary') {
      this.updateData();
      this.statusButton = 'danger';
      this.textButton = 'Redémarrer';
      this.paused = false;
    } else {
      clearInterval(this.interval);
      this.updateData();
      // this.statusButton = 'primary';
      // this.textButton = 'Démarrer';
    }
    this.paused = false;
    this.textPause = 'Pause';
    this.statusPause = 'warning';
  }

  updateData() {
    this.service.getData(this.selectedMeasure, this.selectedGroup, this.selectedField, this.selectedLimit)
      .subscribe((data) => {
        console.log(data);

        const labels = [];
        const dataPoints = [];
        // @ts-ignore
        data.forEach((point) => {
          labels.push(point['time'].substring(14, 23));
          dataPoints.push(point[this.selectedField]);
        });

        this.labelsFrom = labels.reverse();
        this.dataPointsFrom = dataPoints.reverse();
        console.log(labels);
        console.log(dataPoints);

        this.labelsTo = [this.labelsFrom.pop()];
        this.dataPointsTo = [this.dataPointsFrom.pop()];

        this.dataFC = {
          labels: this.labelsTo,
          datasets: [{
            data: this.dataPointsTo,
            label: 'Lapin ' + this.selectedGroup + ' ' + this.selectedMeasure + ' ' + this.selectedField ,
            backgroundColor: NbColorHelper.hexToRgbA(this.colors.primary, 0.3),
            borderColor: this.colors.primary,
          },
          ],
        };
        console.log(this.dataFC.datasets[0].data);
        this.startTimer();
      });
  }

  startTimer() {
    console.log('startTimer!');
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        console.log('update');
        this.timeLeft--;
        // this.data.datasets[0].data.push(this.dataPoints.pop());
        this.labelsTo.push(this.labelsFrom.pop());
        this.dataPointsTo.push(this.dataPointsFrom.pop());
        this.dataFC = {
          labels: this.labelsTo,
          datasets: [{
            data: this.dataPointsTo,
            label: 'Lapin ' + this.selectedGroup + ' ' + this.selectedMeasure + ' ' + this.selectedField ,
            backgroundColor: NbColorHelper.hexToRgbA(this.colors.primary, 0.3),
            borderColor: this.colors.primary,
          },
          ],
        };
      } else {
        this.timeLeft = 60;
      }
    }, 1500);
  }

  pauseTimer() {
    if (!this.paused) {
      console.log('Pause');
      clearInterval(this.interval);
      this.textPause = 'Continuer';
      this.statusPause = 'primary';
      this.paused = true;
    } else {
      this.startTimer();
      this.textPause = 'Pause';
      this.statusPause = 'warning';
      this.paused = false;
    }
  }

}
