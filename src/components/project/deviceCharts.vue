<template>
	<div class="main">
		<van-nav-bar title="设备图表" @click-left="goBack" left-arrow />
		<div class="wrapper" ref="wrapper">
			<div>
				<!-- <div class="block-title" style="margin-top:0;">
					时间选择
				</div> -->
				<van-cell-group class="op-list">
					<van-cell @click="showDatePopup('start')" is-link>
						<span class="van-cell-text">开始日期</span>
						<div class="van-cell-box">
							<span>{{startDate}}</span>
						</div>
					</van-cell>

					<van-cell @click="showDatePopup('end')" is-link>
						<span class="van-cell-text">结束日期</span>
						<div class="van-cell-box">
							<span>{{endDate}}</span>
						</div>
					</van-cell>
				</van-cell-group>
				<div class="chart-box" v-if="optionList.length==0&&!showLoading">
					<p style="text-align:center;padding: 30px;color: #333;">没有数据</p>
				</div>
				<div class="chart-box" v-for="(op,i) in optionList">
					<!-- <div echarts [options]="option" theme="macarons" class="chart chart-row" style="height:300px;" *ngFor="let option of optionList" (chartInit)="onChartInit($event)"></div> -->
					<div class="block-title">
						{{op.outsideTitle}}
					</div>
					<v-chart :options="op" class="my-chart" theme="ovilia-green" />
				</div>

				<!-- <div class="block-title">
					实时数据
					<span class="sub">数据发送频率1分钟/次</span>
				</div>
				<div class="chart-box">
					<v-chart :options="bar" class="my-chart" theme="ovilia-green" />
				</div>

				<div class="block-title">
					实时数据
					<span class="sub">数据发送频率1分钟/次</span>
				</div>
				<div class="chart-box">
					<v-chart :options="line" class="my-chart" theme="ovilia-green" />
				</div> -->
			</div>
		</div>
		<!-- <a href="tel:400-0000-688" class="phone">
			<img src="@/assets/icons/phone_big.png">
		</a> -->

		<van-popup v-model="showDatePicker" @click-overlay="closeDatePopup()" position="bottom" lazy-render>
			<van-datetime-picker v-model="currentDate" type="date" @confirm="setTime" :title="datePickerTitle" />
		</van-popup>

	</div>

</template>

<script>
import BScroll from "better-scroll";
// import ECharts from "vue-echarts/components/ECharts.vue";

import "echarts/lib/component/legend";
import "echarts/lib/component/title";
// import "echarts/lib/component/tooltip";
import "echarts/lib/chart/bar";
import "echarts/lib/chart/line";
import "echarts/lib/chart/pie";

import { mapState } from "vuex";

import moment from "moment";
import pako from "pako";
// import 'zrender/lib/svg/svg'

export default {
    name: "deviceCharts",
    // components: {
    //     chart: ECharts
    // },
    computed: {
        ...mapState({
            showLoading: state => state.isAjaxLoading
        })
    },
    data() {
        const dataHash = {
            1: ["高度", 0.01, "m"],
            2: ["温度", 0.1, "℃"],
            3: ["压力", 0.1, "MPa"],
            4: ["压力", 0.1, "kPa"],
            5: ["气体浓度", 0.1, "%LEL"],
            6: ["气体浓度", 0.1, "%VOL"],
            7: ["气体浓度", 1, "10^-6体积分数"],
            8: ["气体浓度", 1, "mg/m3"],
            9: ["时间", 1, "s"],
            10: ["电压", 0.1, "V"],
            11: ["过流", 0.1, "A"],
            12: ["流量", 0.1, "L/s"],
            13: ["风量", 0.1, "m3/min"],
            14: ["风速", 0.1, "m/s"],
            15: ["漏电", 1, "mA"],
            16: ["烟参量", 0.1, ""],
            128: ["输入检测", 1, ""],
            129: ["输出控制", 1, ""]
        };
        return {
            // query: this.$route.query,
            optionList: [],
            dataHash: dataHash,
            defaultPointTotal: 200,
            unhandleMsgCount: 0,
            currentDatePickerType: "start",
            currentDate: new Date(),
            showDatePicker: false,
            startDate: moment()
                .add(-3, "d")
                .format("YYYY-MM-DD"),
            endDate: moment().format("YYYY-MM-DD"),
            datePickerTitle: "开始日期"
        };
    },
    async mounted() {
        this.getDeviceCharts();
        this.$nextTick(() => {
            // document.title = "项目列表";
            // this.calcHeight =
            //     document.querySelector(".main").offsetHeight -
            //     this.$refs.wrapper.offsetTop;
            this.setupBetterScroll();
        });
    },
    methods: {
        goBack() {
            this.$router.back();
        },
        async getDeviceCharts() {
            this.optionList = [];
            const res = await this.$service.projectService.getDeviceChart({
                efairydevice_id: this.$route.params.did,
                start_time: this.startDate,
                end_time: this.endDate
            });
            const data = res.result;
            if (data.data_stream_list && data.data_stream_list.length > 0) {
                let historyData = [];
                let tsList = [];
                const tmpStore = {};

                //临时hack

                // data.data_stream_list = [data.data_stream_list[data.data_stream_list.length - 1]]

                data.data_stream_list.forEach(ele => {
                    let eleData = pako.inflate(window.atob(ele), {
                        to: "string"
                    });
                    let eleDataJSON = JSON.parse(eleData);
                    // console.log(eleDataJSON);
                    // if (typeof eleDataJSON[0] != 'object') {
                    //   console.log('eleDataJSON[0] not object');
                    //   eleDataJSON = JSON.parse(eleDataJSON[0]);
                    // }
                    // console.log(eleDataJSON);

                    historyData = historyData.concat(eleDataJSON);
                });
                console.log(historyData.length, "before");
                const splitPoint = Math.floor(
                    historyData.length / this.defaultPointTotal
                );
                if (splitPoint > 0) {
                    historyData = historyData.filter((item, index) => {
                        return index % splitPoint == 0;
                    });
                }
                console.log(historyData.length, "after");
                historyData.forEach(item => {
                    item = JSON.parse(item);
                    tsList.push(
                        moment(item["ts"] * 1000).format("MM/DD HH:mm")
                    );
                    try {
                        item.data.forEach(row => {
                            if (row["cid"] == 0) return;
                            if (!tmpStore[row["pt"]]) {
                                tmpStore[row["pt"]] = {
                                    series: {}
                                };
                            }
                            if (!tmpStore[row.pt].series[row["cid"]]) {
                                tmpStore[row.pt].series[row["cid"]] = [];
                            }
                            tmpStore[row.pt].series[row["cid"]].push(
                                (row.rtv * this.dataHash[row["pt"]][1]).toFixed(
                                    2
                                )
                            );
                        });
                    } catch (e) {}
                });
                //  console.log(tsList);
                //  console.log(tmpStore);

                this.clearResponseToChartList(tmpStore, tsList);
                // this.loading=false;
            }
        },
        clearResponseToChartList(data, tsList) {
            console.log(data);
            Object.keys(data).forEach(item => {
                const row = data[item];
                const series = [];
                Object.keys(row["series"]).forEach(k => {
                    series.push({
                        data: row["series"][k].reverse(),
                        type: "line",
                        name: "通道" + k
                        // stack: '总量',
                    });
                });

                this.optionList.push(
                    this.formatChartData(
                        this.dataHash[item][0],
                        this.dataHash[item][2],
                        tsList.reverse(),
                        series
                    )
                );
            });
            // console.log(this.optionList)
        },
        formatChartData(title, unit, xData, series) {
            const option = {
                // title: {
                //     text: title,
                //     left: "center"
                // },
                outsideTitle: title,
                tooltip: {
                    right: "10",
                    trigger: "axis",
                    axisPointer: {
                        type: "cross",
                        label: {
                            backgroundColor: "#6a7985"
                        }
                    }
                },
                legend: {
                    data: series.map(item => item.name),
                    x: "left"
                },
                grid: {
                    top: "15%",
                    left: "3%",
                    right: "3%",
                    bottom: "15%",
                    containLabel: true
                },
                dataZoom: [
                    {
                        // 这个dataZoom组件，默认控制x轴。
                        type: "slider", // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                        start: 0, // 左边在 10% 的位置。
                        end: 100, // 右边在 60% 的位置。
                        bottom: 0,
                        handleSize: "200%"
                    }
                ],
                toolbox: {
                    orient: "vertical",
                    feature: {
                        magicType: {
                            type: ["line", "bar"]
                        }
                    }
                },
                xAxis: [
                    {
                        type: "category",
                        boundaryGap: false,
                        data: xData
                    }
                ],
                yAxis: [
                    {
                        type: "value",
                        name: unit,
                        min: "dataMin"
                    }
                ],
                series: series || [
                    {
                        name: "报警次数",
                        type: "line",
                        // stack: '总量',
                        // areaStyle: { normal: {} },
                        data: []
                    }
                ]
            };
            console.log(JSON.stringify(option));
            return option;
        },

        setupBetterScroll() {
            this.scroll = new BScroll(this.$refs.wrapper, {
                tap: true,
                click: true
            });
            setTimeout(() => {
                this.scroll.refresh();
            }, 1000);
        },
        showDatePopup(type) {
            this.showDatePicker = true;
            this.currentDatePickerType = type;
            this.datePickerTitle = type == "start" ? "开始日期" : "结束日期";
        },
        closeDatePopup() {
            this.showDatePicker = false;
        },
        setTime(date) {
            const formatDate = moment(date).format("YYYY-MM-DD");
            if (this.currentDatePickerType == "start") {
                this.startDate = formatDate;
                if (this.endDate) {
                    if (moment(date).isAfter(moment(this.endDate))) {
                        this.endDate = moment(date).format("YYYY-MM-DD");
                    }
                    if (moment(date).diff(moment(this.endDate), "days") < -7) {
                        this.endDate = moment(date)
                            .add(7, "days")
                            .format("YYYY-MM-DD");
                        this.$toast("最多支持查询7天跨度");
                    }
                }
            }
            if (this.currentDatePickerType == "end") {
                this.endDate = formatDate;
                if (this.startDate) {
                    if (moment(date).isBefore(moment(this.startDate))) {
                        this.startDate = moment(date).format("YYYY-MM-DD");
                    }
                    if (moment(date).diff(moment(this.startDate), "days") > 7) {
                        this.startDate = moment(date)
                            .add(-7, "days")
                            .format("YYYY-MM-DD");
                        this.$toast("最多支持查询7天跨度");
                    }
                }
            }
            this.showDatePicker = false;
            this.getDeviceCharts();
        }
    }
};
</script>

<style lang="scss" scoped>
@import "@/assets/color.scss";

.op-list {
    // margin-top: 15px;
    .van-cell {
        color: #666;
    }
    .van-cell-text {
        max-width: 90px;
        flex: 1;
    }
    .van-cell-box {
        flex: 1;
        display: flex;
        flex-flow: row-reverse;
    }
}

.wrapper {
    position: absolute;
    // margin-top: 10px;
    top: 46px;
    overflow: hidden;
    width: 100%;
    bottom: 0;
    // height: calc(100% - 102px);
    overflow: hidden;
}

.block-title {
    background: #fff;
    margin-top: 10px;
    line-height: 26px;
    position: relative;
    color: $dcyColor;
    font-size: 15px;
    padding: 10px 15px;
    &:after {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        height: 16px;
        margin-top: -8px;
        width: 6px;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        background: $dcyColor;
    }
    .sub {
        font-size: 12px;
        color: #999;
    }
}
.chart-box {
    background: #fff;
    padding: 0;
    box-sizing: border-box;
    margin: 10px 0;
}

.my-chart {
    height: 300px;
    width: 100%;
}

.phone {
    position: fixed;
    width: 60px;
    right: 20px;
    bottom: 100px;
    z-index: 111;
    img {
        width: 100%;
        border-radius: 50%;
        box-shadow: 1p6x 1px 5px #bbb;
    }
}
</style>
