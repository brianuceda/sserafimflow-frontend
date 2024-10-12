import { Component } from '@angular/core';
import { EChartsOption } from 'echarts/types/dist/echarts';
import {
  NgxEchartsDirective,
  NgxEchartsModule,
  provideEcharts,
  ThemeOption,
} from 'ngx-echarts';
import { DarkMode } from '../../../../shared/data-access/data/darkmode-echarts.data';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-echarts',
  standalone: true,
  imports: [NgxEchartsModule, NgxEchartsDirective, CommonModule],
  templateUrl: './echarts.component.html',
  styleUrl: './echarts.component.scss',
  providers: [provideEcharts()],
})
export default class EchartsComponent {
  public theme: string | ThemeOption = DarkMode;

  public chartOption1!: EChartsOption;
  public chartOption2!: EChartsOption;
  public chartOption3!: EChartsOption;
  public chartOption4!: EChartsOption;

  ngOnInit() {
    this.loadChart1();
    this.loadChart2();
    this.loadChart3();
    this.loadChart4();
  }

  loadChart1() {
    this.chartOption1 = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999',
          },
        },
      },
      // toolbox: {
      //   feature: {
      //     dataView: { show: true, readOnly: false },
      //     magicType: { show: true, type: ['line', 'bar'] },
      //     restore: { show: true },
      //     saveAsImage: { show: true },
      //   },
      // },
      legend: {
        data: ['Evaporation', 'Precipitation', 'Temperature'],
      },
      xAxis: [
        {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisPointer: {
            type: 'shadow',
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: 'Precipitation',
          min: 0,
          max: 250,
          interval: 50,
          axisLabel: {
            formatter: '{value} ml',
          },
        },
        {
          type: 'value',
          name: 'Temperature',
          min: 0,
          max: 25,
          interval: 5,
          axisLabel: {
            formatter: '{value} °C',
          },
        },
      ],
      series: [
        {
          name: 'Evaporation',
          type: 'bar',
          tooltip: {
            valueFormatter: function (value) {
              return (value as number) + ' ml';
            },
          },
          data: [
            2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3,
          ],
        },
        {
          name: 'Precipitation',
          type: 'bar',
          tooltip: {
            valueFormatter: function (value) {
              return (value as number) + ' ml';
            },
          },
          data: [
            2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3,
          ],
        },
        {
          name: 'Temperature',
          type: 'line',
          yAxisIndex: 1,
          tooltip: {
            valueFormatter: function (value) {
              return (value as number) + ' °C';
            },
          },
          data: [
            2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2,
          ],
        },
      ],
    };
  }

  loadChart2() {
    const ROOT_PATH = 'http://localhost:4200';

    const weatherIcons = {
      Sunny: ROOT_PATH + '/images/sunny_128.png',
      Cloudy: ROOT_PATH + '/images/cloudy_128.png',
      Showers: ROOT_PATH + '/images/showers_128.png',
    };

    this.chartOption2 = {
      title: {
        text: 'Weather Statistics',
        subtext: 'Fake Data',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        bottom: 10,
        left: 'center',
        data: ['CityA', 'CityB', 'CityD', 'CityC', 'CityE'],
      },
      series: [
        {
          type: 'pie',
          radius: '65%',
          center: ['50%', '50%'],
          selectedMode: 'single',
          data: [
            {
              value: 1548,
              name: 'CityE',
              label: {
                formatter: [
                  '{title|{b}}{abg|}',
                  '  {weatherHead|Weather}{valueHead|Days}{rateHead|Percent}',
                  '{hr|}',
                  '  {Sunny|}{value|202}{rate|55.3%}',
                  '  {Cloudy|}{value|142}{rate|38.9%}',
                  '  {Showers|}{value|21}{rate|5.8%}',
                ].join('\n'),
                backgroundColor: '#eee',
                borderColor: '#777',
                borderWidth: 1,
                borderRadius: 4,
                rich: {
                  title: {
                    color: '#eee',
                    align: 'center',
                  },
                  abg: {
                    backgroundColor: '#333',
                    width: '100%',
                    align: 'right',
                    height: 25,
                    borderRadius: [4, 4, 0, 0],
                  },
                  Sunny: {
                    height: 30,
                    align: 'left',
                    backgroundColor: {
                      image: weatherIcons.Sunny,
                    },
                  },
                  Cloudy: {
                    height: 30,
                    align: 'left',
                    backgroundColor: {
                      image: weatherIcons.Cloudy,
                    },
                  },
                  Showers: {
                    height: 30,
                    align: 'left',
                    backgroundColor: {
                      image: weatherIcons.Showers,
                    },
                  },
                  weatherHead: {
                    color: '#333',
                    height: 24,
                    align: 'left',
                  },
                  hr: {
                    borderColor: '#777',
                    width: '100%',
                    borderWidth: 0.5,
                    height: 0,
                  },
                  value: {
                    width: 20,
                    padding: [0, 20, 0, 30],
                    align: 'left',
                  },
                  valueHead: {
                    color: '#333',
                    width: 20,
                    padding: [0, 20, 0, 30],
                    align: 'center',
                  },
                  rate: {
                    width: 40,
                    align: 'right',
                    padding: [0, 10, 0, 0],
                  },
                  rateHead: {
                    color: '#333',
                    width: 40,
                    align: 'center',
                    padding: [0, 10, 0, 0],
                  },
                },
              },
            },
            { value: 735, name: 'CityC' },
            { value: 510, name: 'CityD' },
            { value: 434, name: 'CityB' },
            { value: 335, name: 'CityA' },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
  }

  loadChart3() {
    const xAxisData = [];
    const data1 = [];
    const data2 = [];

    for (let i = 0; i < 100; i++) {
      xAxisData.push('category' + i);
      data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
      data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
    }

    this.chartOption3 = {
      legend: {
        data: ['bar', 'bar2'],
        align: 'left',
      },
      tooltip: {},
      xAxis: {
        data: xAxisData,
        silent: false,
        splitLine: {
          show: false,
        },
      },
      yAxis: {},
      series: [
        {
          name: 'bar',
          type: 'bar',
          data: data1,
          animationDelay: (idx) => idx * 10,
        },
        {
          name: 'bar2',
          type: 'bar',
          data: data2,
          animationDelay: (idx) => idx * 10 + 100,
        },
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx) => idx * 5,
    };
  }

  loadChart4() {
    this.chartOption4 = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
          },
        },
      },
      legend: {
        data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine'],
      },
      // toolbox: {
      //   feature: {
      //     saveAsImage: {},
      //   },
      // },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: [
        {
          name: 'Email',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series',
          },
          data: [120, 132, 101, 134, 90, 230, 210],
        },
        {
          name: 'Union Ads',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series',
          },
          data: [220, 182, 191, 234, 290, 330, 310],
        },
        {
          name: 'Video Ads',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series',
          },
          data: [150, 232, 201, 154, 190, 330, 410],
        },
        {
          name: 'Direct',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series',
          },
          data: [320, 332, 301, 334, 390, 330, 320],
        },
        {
          name: 'Search Engine',
          type: 'line',
          stack: 'Total',
          label: {
            show: true,
            position: 'top',
          },
          areaStyle: {},
          emphasis: {
            focus: 'series',
          },
          data: [820, 932, 901, 934, 1290, 1330, 1320],
        },
      ],
    };
  }
}
