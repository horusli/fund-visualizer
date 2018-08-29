import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GithubService } from '../../github.service';


@Component({
    selector: 'ngx-fund-detail',
    templateUrl: 'detail.component.html',
})
export class DetailComponent implements AfterViewInit {

    options: any = {};
    selectedFund;

    constructor(private route: ActivatedRoute, private github: GithubService) {
        this.route.queryParams.subscribe(data => {
            if (data && data['code']) {
                this.selectedFund = data['code'];
                this.loadFund(data['code']);
            }
        });
    }

    ngAfterViewInit(): void {

    }

    onFundChanged(code) {
        this.loadFund(code);
    }

    loadFund(code) {
        const filepath = code + '.json';
        this.github.readFile(filepath).then(data => {
            const netvalues = data[0]['netvalues'];
            if (netvalues) {
                this.setOptions(netvalues);
            }
        });
    }

    setOptions(data) {
        const xAxisData = [];
        const yAxisData = [];

        for (let i = data.length - 1; i >= 0; i--) {
            xAxisData.push(data[i][0]);
            yAxisData.push(data[i][1]);
        }

        this.options = {
            legend: { data: ['bar'], align: 'left' },
            tooltip: {},
            xAxis: { data: xAxisData, silent: false, splitLine: { show: false } },
            yAxis: { },
            series: [{
                name: '单位净值',
                type: 'bar',
                data: yAxisData,
                animationDelay: function (idx) {
                    return idx >> 2;
                },
            }],
            animationEasing: 'elasticOut',
            animationDelayUpdate: function (idx) {
                return idx >> 2;
            },
        };
    }
}
