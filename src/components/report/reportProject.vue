<template>
	<div class="main">
		<van-nav-bar :title="reportProjectTitle" @click-left="goBack" left-arrow />
		<div class="wrapper" ref="wrapper">
			<div style="padding-top:10px;">
				<div class="box">
					<div class="title">
						{{projectInfo.efairyproject_name}}
						<span class="score " :class="{green:projectInfo.efairyproject_security_score>80,orange:projectInfo.efairyproject_security_score<=80&&projectInfo.efairyproject_security_score>60,red:projectInfo.efairyproject_security_score<=60}">评分{{projectInfo.efairyproject_security_score}}</span>
					</div>
					<div class="ctx">
						<div class="intro">
							项目负责人：
							<span>{{projectInfo.efairyproject_user_name}}</span>
							<a class="icon" :href="'tel:'+projectInfo.efairyproject_user_phonenumber"><img src="@/assets/icons/phone_big.png" /></a>
						</div>

						<div class="intro flex">
							<label>报告总结：</label>
							<div class="right">
								<p v-for="(t,i) in projectInfo.efairyproject_report_summary.report_summary_list" :key="i">{{i+1}}.{{t}}</p>
							</div>
						</div>

						<div class="table" v-if="projectInfo.efairyproject_device_statistics.device_statistics_list.length!=0">
							<table>
								<tr>
									<th>设备类型</th>
									<th>点位总数</th>
									<th>报警点位数</th>
									<th>预警点位数</th>
									<th>故障点位数</th>
								</tr>
								<tr v-for="(d,i) in projectInfo.efairyproject_device_statistics.device_statistics_list">
									<td>{{d.efairydevice_device_type}}</td>
									<td>{{d.total_devices}}</td>
									<td class="red">{{d.total_alarm_devices}}</td>
									<td class="orange">{{d.total_early_warning_devices}}</td>
									<td class="yellow">{{d.total_trouble_devices||0}}</td>
								</tr>
							</table>
						</div>

					</div>
				</div>

				<van-tabs v-model="active">
					<van-tab title="报警统计表">
						<report-project-chart :charts-list="deviceChartList" />
					</van-tab>
					<van-tab title="报警点位">
						<report-project-device-list />
					</van-tab>
				</van-tabs>

			</div>
		</div>

	</div>

</template>

<script>
import reportProjectDeviceList from "./reportProjectDeviceList";
import reportProjectChart from "./reportProjectChart";
import BScroll from "better-scroll";
import moment from "moment";

export default {
    name: "reportProject",
    components: {
        reportProjectDeviceList,
        reportProjectChart
    },
    data() {
        return {
            // query: this.$route.query,
            deviceChartList: [],
            reportProjectTitle: "项目报告详情",
            active: 0,
            projectInfo: {
                efairyproject_report_summary: {},
                efairyproject_device_alarm_statistics: {
                    device_alarm_statistics_list: []
                },
                efairyproject_device_statistics: {
                    device_statistics_list: []
                }
            },
            order: 0,
            page: 1,
            size: 200,
            reportId: this.$route.params.rid
        };
    },
    async mounted() {
        await this.getProjectInfo();
        this.deviceChartList = this.projectInfo.efairyproject_device_alarm_statistics.device_alarm_statistics_list;
        // console.log(this.$store.getters.deviclAlarmListChooseList);
        this.$nextTick(() => {
            this.setupBetterScroll();
        });
    },
    methods: {
        goBack() {
            this.$router.back();
        },
        async getProjectInfo() {
            const data = await this.$service.reportService.getReportProjectDetail(
                {
                    efairyreport_id: this.$route.params.rid,
                    efairyproject_id: this.$route.params.pid
                }
            );
            this.projectInfo = data.result;
            console.log(data);
        },

        changeOrder() {
            this.order = 1 - this.order;
            this.getReportIndexProjectList();
        },
        setupBetterScroll() {
            this.scroll = new BScroll(this.$refs.wrapper, {
                tap: true,
                click: true
            });
            setTimeout(() => {
                this.scroll.refresh();
            }, 1000);
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
        margin: 10px 0;
        span {
            color: #666;
        }
        .icon {
            width: 24px;
            height: 24px;
            float: right;
            margin-top: -2px;
            img {
                width: 100%;
            }
        }
        p {
            color: #666;
            margin: 0;
        }
        &.flex {
            display: flex;
            label {
                flex: 1;
            }
            .right {
                flex: 3;
            }
        }
    }
    table {
        margin: 15px 0;
        font-size: 12px;
        border-collapse: collapse;
        border-radius: 4px;
        width: 100%;
        overflow: hidden;
        th {
            font-weight: normal;
            background: #f9f9fa;
            padding: 6px 4px;
        }
        td {
            text-align: center;
            background: #f2f2f4;
            padding: 6px 4px;
        }
    }
}

.van-tabs {
    margin-top: -8px;
}
</style>
