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

				<div class="block-title">
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
				</div>
			</div>
		</div>
		<a href="tel:400-0000-688" class="phone">
			<img src="@/assets/icons/phone_big.png">
		</a>

		<van-popup v-model="showDatePicker" @click-overlay="closeDatePopup()" position="bottom" lazy-render>
			<van-datetime-picker v-model="currentDate" type="date" @confirm="setTime" :title="datePickerTitle" />
		</van-popup>

	</div>

</template>

<script>
import BScroll from "better-scroll";
// import ECharts from "vue-echarts/components/ECharts.vue";
import "echarts/lib/chart/bar";
import "echarts/lib/chart/line";
import "echarts/lib/chart/pie";
import moment from "moment";
// import 'zrender/lib/svg/svg'

export default {
    name: "deviceCharts",
    // components: {
    //     chart: ECharts
    // },
    data() {
        function randomize() {
            return [0, 0, 0].map(v => {
                return Math.round(300 + Math.random() * 700) / 10;
            });
        }
        return {
            // query: this.$route.query,
            active: 0,
            addressLoading: true,
            showAddressPicker: false,
            showprojectMap: false,
            value: "",
            tmp: [],
            currentDatePickerType: "start",
            deviceList: [],
            currentDate: new Date(),
            showDatePicker: false,
            startDate: "",
            endDate: "",
            datePickerTitle: "开始日期",
            line: {
                xAxis: {
                    type: "category",
                    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                },
                yAxis: {
                    type: "value"
                },
                series: [
                    {
                        data: [820, 932, 901, 934, 1290, 1330, 1320],
                        type: "line",
                        smooth: true
                    }
                ]
            },
            bar: {
                legend: {},
                tooltip: {},
                dataset: {
                    source: [
                        ["Product", "2015", "2016", "2017"],
                        ["Matcha Latte", ...randomize()],
                        ["Milk Tea", ...randomize()],
                        ["Cheese Cocoa", ...randomize()],
                        ["Walnut Brownie", ...randomize()]
                    ]
                },
                xAxis: { type: "category" },
                yAxis: {},
                series: [{ type: "bar" }, { type: "bar" }, { type: "bar" }]
            }
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
            const data = await this.$service.projectService.getDeviceChart({
                efairydevice_id: this.$route.params.did,
                start_time: "2018-10-01",
                end_time: "2018-10-07"
            });
            console.log(data);
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
            const formatDate = [
                date.getFullYear(),
                date.getMonth() + 1 < 10
                    ? "0" + (date.getMonth() + 1)
                    : date.getMonth() + 1,
                date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
            ].join("-");
            if (this.currentDatePickerType == "start")
                this.startDate = formatDate;
            if (this.currentDatePickerType == "end") this.endDate = formatDate;
            this.showDatePicker = false;
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
    padding: 5px 10px;
    box-sizing: border-box;
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
