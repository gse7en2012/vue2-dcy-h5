<template>
	<div class="main">
		<van-nav-bar :title="reportProjectTitle" @click-left="goBack" left-arrow />
		<div class="wrapper" ref="wrapper">
			<div style="padding-top:10px;">
				<div class="box">
					<div class="title">
						{{deviceInfo.efairydevice_name}}
					</div>
					<div class="ctx">
						<div class="intro">
							<span class="left">设备类型</span>
							<span class="right">{{deviceInfo.efairydevice_device_type}}</span>
						</div>
						<div class="intro">
							<span class="left">报警次数</span>
							<span class="right red">{{deviceInfo.efairydevice_alarm_times}}</span>
						</div>
						<div class="intro">
							<span class="left">预警次数</span>
							<span class="right orange">{{deviceInfo.efairydevice_early_warning_times}}</span>

						</div>
						<div class="intro">
							<span class="left">故障次数</span>
							<span class="right yellow">{{deviceInfo.efairydevice_trouble_times||0}}</span>
						</div>
						<div class="intro">
							<span class="left">设备地址</span>
							<span class="right">{{deviceInfo.efairydevice_address}}</span>
						</div>
						<table>
							<tr>
								<th>设备拥有者</th>
								<th>拥有人电话</th>
							</tr>
							<tr v-for="(item,i) in deviceInfo.efairydevice_user_info_list">
								<td>{{item.efairyuser_nickname}}</td>
								<td>{{item.efairyuser_phonenumber}}</td>
							</tr>
						</table>
					</div>
				</div>

				<div class="bottom-box">
					<table>
						<tr>
							<th width="22%" @click="show1=true">{{current1.name}}<span class="arrow"></span></th>
							<th width="34%">报警时间段</th>
							<th width="22%">峰值分数</th>
							<th width="22%" @click="show2=true">{{current2.name}}<span class="arrow"></span></th>
						</tr>
						<tr v-if="alarmList.length==0">
							<td colspan="4">没有数据</td>
						</tr>
						<tr v-for="(item,i) in alarmList">
							<td>{{item.efairydevicealarmstatistics_pt_name}}</td>
							<td>{{item.efairydevicealarmstatistics_start_time}} 至 {{item.efairydevicealarmstatistics_end_time}}</td>
							<td>{{item.efairydevicealarmstatistics_highest_score}}</td>
							<td :class="{red:item.risk_evaluation==1,orange:item.risk_evaluation==2}">{{riskHash[item.risk_evaluation]}}</td>
						</tr>
					</table>
				</div>
			</div>
		</div>

		<van-actionsheet v-model="show1" :actions="actions1" @select="onSelect1" />
		<van-actionsheet v-model="show2" :actions="actions2" @select="onSelect2" />

	</div>

</template>

<script>
import reportProjectDeviceList from "./reportProjectDeviceList";
import reportProjectChart from "./reportProjectChart";
import BScroll from "better-scroll";
import moment from "moment";

export default {
    name: "reportDeviceDetail",
    components: {
        reportProjectDeviceList,
        reportProjectChart
    },
    data() {
        return {
            // query: this.$route.query,
            deviceChartList: [],
            riskHash: ["风险评估", "高度危险", "中度危险", "危险"],
            reportProjectTitle: "设备报告详情",
            active: 0,
            deviceInfo: {
                efairydevice_user_info_list: [
                    {
                        efairyuser_nickname: "--",
                        efairyuser_phonenumber: "--"
                    }
                ]
            },
            alarmList: [],
            order: 0,
            page: 1,
            size: 20,
            risk: null,
            alarmId: null,
            reportId: this.$route.params.rid,
            show1: false,
            finishedLoadMore: false,
            current1: { name: "报警类型" },
            actions1: [
                //不传则返回所有状态，0-离线 1-火警 2-预警 3-故障 4-启动 5-屏蔽 6-正常
                { name: "报警类型", id: null },
                // { name: "正常", id: 6 },
                { name: "故障", id: 3 },
                // { name: "屏蔽", id: 5 },
                { name: "火警", id: 1 },
                { name: "预警", id: 2 }
                // { name: "离线", id: 0 },
                // { name: "启动", id: 4 }
            ],
            show2: false,
            current2: { name: "风险评估" },
            actions2: [
                { name: "风险评估", id: null },
                { name: "高度危险", id: 1 },
                { name: "中度危险", id: 2 },
                { name: "危险", id: 3 }
            ]
        };
    },
    async mounted() {
        await this.getDeviceInfo();
        this.getDeviceAlarmlist();
        // console.log(this.$store.getters.deviclAlarmListChooseList);
        this.$nextTick(() => {
            this.setupBetterScroll();
        });
    },
    methods: {
        goBack() {
            this.$router.back();
        },
        async getDeviceAlarmlist() {
            this.page = 1;
            this.finishedLoadMore = false;
            if (this.scroll) this.scroll.finishPullUp();
            const data = await this.$service.reportService.getReportDeviceAlarmList(
                {
                    efairyreport_id: this.$route.params.rid,
                    efairyproject_id: this.$route.params.pid,
                    efairydevice_id: this.$route.params.did,
                    page: this.page,
                    size: this.size,
                    risk_evaluation: this.risk,
                    alarm_id: this.alarmId
                }
            );
            this.alarmList = [];
            this.alarmList = data.result.efairydevice_alarm_info_list;
        },
        async loadMoreAlarmList() {
            if (this.finishedLoadMore) return false;
            this.page++;
            const data = await this.$service.reportService.getReportDeviceAlarmList(
                {
                    efairyreport_id: this.$route.params.rid,
                    efairyproject_id: this.$route.params.pid,
                    efairydevice_id: this.$route.params.did,
                    page: this.page,
                    size: this.size,
                    risk_evaluation: this.risk,
                    alarm_id: this.alarmId
                }
            );
            this.scroll.finishPullUp();
            if (data.result.efairydevice_alarm_info_list.length == 0) {
                this.finishedLoadMore = true;
                this.$toast("没有更多了");
            }
            this.alarmList = this.alarmList.concat(
                data.result.efairydevice_alarm_info_list
            );
        },
        async getDeviceInfo() {
            const data = await this.$service.reportService.getReportDeviceDetail(
                {
                    efairyreport_id: this.$route.params.rid,
                    efairyproject_id: this.$route.params.pid,
                    efairydevice_id: this.$route.params.did
                }
            );
            this.deviceInfo = data.result;
            // this.deviceInfo.efairydevice_user_info_list = JSON.parse(
            //     this.deviceInfo.efairydevice_user_info_list
            // );
        },
        onSelect1(item) {
            // 点击选项时默认不会关闭菜单，可以手动关闭
            this.show1 = false;
            this.current1 = item;
            this.alarmId = item.id;
            this.getDeviceAlarmlist();
            // if (item.id == -1) this.alarmId = null;
            // this.getDeviceList();
        },
        onSelect2(item) {
            // 点击选项时默认不会关闭菜单，可以手动关闭
            this.show2 = false;
            this.current2 = item;
            this.risk = item.id;
            this.getDeviceAlarmlist();
            // if (item.id == -1) this.alarmId = null;
            // this.getDeviceList();
        },

        setupBetterScroll() {
            this.scroll = new BScroll(this.$refs.wrapper, {
                tap: true,
                click: true,
                pullUpLoad: {
                    threshold: 0,
                    stop: 0
                }
            });
            this.scroll.on("pullingUp", () => {
                this.loadMoreAlarmList();
                setTimeout(() => {
                    this.scroll.refresh();
                }, 0);
            });
            // setTimeout(() => {
            //     this.scroll.refresh();
            // }, 1000);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "@/assets/color.scss";

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

.box {
    margin: 0 0 8px 0;
    overflow: hidden;
    background: #fff;
    .van-cell {
        padding: 8px 15px;
        color: #666;
    }
    .van-cell:not(:last-child)::after {
        left: 0;
    }
    .van-cell-text {
        max-width: 90px;
        flex: 1;
        color: #666;
    }
    .van-cell-box {
        flex: 1;
        display: flex;
        flex-flow: row-reverse;
    }

    .ctx {
        padding: 8px 15px;
        font-size: 14px;
        color: #333;
        letter-spacing: 0;
        line-height: 1.5;
    }
    .title {
        padding: 10px 15px;
        border-bottom: 1px solid #eee;
        font-size: 15px;
        color: #333;
        .score {
            float: right;
        }
    }
    .intro {
        margin: 8px 0;
        display: flex;
        span {
            color: #666;
        }
        .left {
            width: 80px;
            color: #333;
        }
        .right {
            flex: 3;
            text-align: right;
        }
    }
    table {
        margin: 15px 0 10px;
        border-collapse: collapse;
        width: 100%;
        overflow: hidden;
        th {
            font-weight: normal;
            padding: 6px 4px;
            font-size: 14px;
            border: 1px solid #ddd;
        }
        td {
            text-align: center;
            padding: 6px 4px;
            font-size: 13px;
            border: 1px solid #ddd;
            color: #666;
        }
    }
}
.bottom-box {
    margin: 10px 0;
    background: #fff;
    table {
        margin: 0 -1px;
        border-collapse: collapse;
        overflow: hidden;
        min-width: 100%;
        min-width: calc(100% + 2px);
        th {
            font-weight: normal;
            padding: 16px 4px;
            font-size: 13px;
            border: 1px solid #ddd;
            border-top: 0;
            border-bottom: 0;
            word-break: keep-all;
            position: relative;
            .arrow {
                width: 6px;
                height: 6px;
                display: inline-block;
                border-left: 1px solid #999;
                border-bottom: 1px solid #999;
                position: relative;
                transform: rotate(-45deg);
                margin-left: 4px;
                top: -2px;
            }
        }
        td {
            text-align: center;
            padding: 6px 4px;
            font-size: 13px;
            border: 1px solid #ddd;
            color: #666;
        }
    }
}
</style>
