<template>
	<div class="main">
		<div class="chart-list">
			<div class="row" v-for="(item,i) in chartsList">
				<div class="wrap">
					<div class="ctx">
						<p class="info">
							<span class="title">{{item.efairydevice_device_type||"--"}}</span>
						</p>
						<div>
							<v-chart :options="item.pieData" class="pie-chart" theme="westro" auto-resize v-if="item.alarm_times_info_list_t.length>0" />
							<v-chart :options="item.barData" class="bar-chart" theme="westro" auto-resize v-if="item.alarm_percent_info_list.length>0" />

							<p v-if="item.alarm_percent_info_list.length==0" class="no-chart-tips">没有图表数据</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import BScroll from "better-scroll";
import moment from "moment";
import { Dialog } from "vant";

import "echarts/lib/component/legend";
import "echarts/lib/component/title";
// import "echarts/lib/component/tooltip";
import "echarts/lib/chart/bar";
import "echarts/lib/chart/line";
import "echarts/lib/chart/pie";

export default {
    name: "reportProjectChart",
    props: ["chartsList"],
    data() {
        function randomize() {
            return [0, 0, 0].map(v => {
                return Math.round(300 + Math.random() * 700) / 10;
            });
        }
        return {
            deviceList: [],
            list: [],
            value: "",
            reportId: this.$route.params.rid,
            proejctId: this.$route.params.pid
        };
    },
    async mounted() {
        // await this.getDeviceList();
        console.log(this.chartsList);
        this.$nextTick(() => {});
    },
    watch: {
        chartsList(val) {
            this.renderChart();
        }
    },
    methods: {
        renderChart() {
            this.chartsList.forEach(row => {
                const pieDataValueList = row.alarm_percent_info_list.map(
                    item => {
                        return {
                            value: item.percent * 1000,
                            name: `${item.pt_name}${(
                                item.percent * 100
                            ).toFixed(1)}%`
                        };
                    }
                );
                const pieDataNameList = pieDataValueList.map(item => item.name);
                row.pieData = this.formatPieData(
                    pieDataNameList,
                    pieDataValueList
                );
                const barDataValueList = row.alarm_times_info_list_t.map(
                    item => item.times
                );
                const barDataNameList = row.alarm_times_info_list_t.map(
                    item => item.pt_name
                );
                row.barData = this.formatBarData(
                    barDataNameList,
                    barDataValueList
                );
            });
        },
        formatBarData(nameList, dataList) {
            return {
                title: {
                    text: "报警次数统计",
                    x: "left",
                    textStyle: {
                        fontSize: 14,
                        color: "#666"
                    }
                },
                grid: {
                    left: "3%",
                    right: "4%",
                    bottom: "3%",
                    containLabel: true
                },
                xAxis: [
                    {
                        type: "category",
                        data: nameList,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis: [
                    {
                        type: "value"
                    }
                ],
                series: [
                    {
                        name: "报警类型",
                        type: "bar",
                        barWidth: "40%",
                        data: dataList
                    }
                ]
            };
        },
        formatPieData(nameList, dataList) {
            return {
                title: {
                    text: "报警占比",
                    x: "left",
                    textStyle: {
                        fontSize: 14,
                        color: "#666"
                    }
                },
                tooltip: {
                    trigger: "item",
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: "vertical",
                    x: "right",
                    data: nameList,
                    itemWidth: 20,
                    itemHeight: 10,
                    textStyle: {
                        color: "#333",
                        fontSize: 11
                    }
                },
                series: [
                    {
                        name: "报警类型",
                        type: "pie",
                        radius: ["25%", "50%"],
                        // radius:'55%',
                        center: ["40%", "55%"],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: "rgba(0, 0, 0, 0.5)"
                            }
                        },
                        data: dataList
                    }
                ]
            };
        }
    }
};
</script>

<style lang="scss" scoped>
@import "@/assets/color.scss";

.chart-list {
    padding-bottom: 10px;
    .row {
        display: flex;
        border-bottom: 1px solid #f5f5f5;
        margin: 8px;
        .wrap {
            flex: 1;
            background: #fff;
            display: flex;
            transition: all 0.3s ease-in-out;
            border-radius: 4px;
            .ctx {
                flex: 1;
                padding-bottom: 5px;
                .info {
                    display: flex;
                    padding: 10px;
                    border-bottom: 1px solid #efefef;
                    margin: 0;
                    .title {
                        font-size: 16px;
                        color: #333;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 1;
                        -webkit-box-orient: vertical;
                        margin-right: 5px;
                        line-height: 22px;
                        flex: 1;
                    }
                }
            }
        }
        .pie-chart {
            height: 220px;
            margin: 8px 0;
            padding: 0 8px;
            width: 100%;
            box-sizing: border-box;
            border-bottom: 1px solid #eee;
        }
        .bar-chart {
            height: 220px;
            margin: 8px 0;
            padding: 0 8px;
            width: 100%;
            box-sizing: border-box;
        }
    }
}

.no-chart-tips {
    color: $dcyColor;
    text-align: center;
    font-size: 14px;
}
</style>
