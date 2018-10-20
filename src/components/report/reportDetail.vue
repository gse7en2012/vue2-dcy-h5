<template>
	<div class="main">
		<van-nav-bar title="报告详情" @click-left="goToReportIndex" left-arrow />
		<div class="wrapper" ref="wrapper">
			<div>
				<div class="title-box">
					<div class="title-editable" v-if="!editTitle">
						<span contenteditable="true">{{basicInfo.efairyreport_title||'待编辑'}}</span>
						<span class="right" @click="editTitleFn()">编辑</span>
					</div>
					<div class="title-editable" v-show="editTitle">
						<input type="text" v-model="basicInfo.efairyreport_title" ref="tinput" placeholder="输入新标题">
						<span class="right" @click="saveTitle()">保存</span>
					</div>
				</div>
				<div class="main-box">

					<div class="row">
						<span class="l">报告时间</span>
						<span class="r">{{basicInfo.efairyreport_starttime}} - {{basicInfo.efairyreport_endtime}}</span>
					</div>
					<div class="row">
						<span class="l">报警点位</span>
						<span class="r"><i class="red">{{basicInfo.efairyreport_project_statistics.total_alarm_device_rows}}</i>/{{basicInfo.efairyreport_project_statistics.total_device_rows}}</span>
					</div>
					<div class="row">
						<span class="l">预警点位</span>
						<span class="r"><i class="orange">{{basicInfo.efairyreport_project_statistics.total_early_warning_device_rows}}</i>/{{basicInfo.efairyreport_project_statistics.total_device_rows}}</span>
					</div>
					<div class="row">
						<span class="l">故障点位</span>
						<span class="r"><i class="yellow">{{basicInfo.efairyreport_project_statistics.total_trouble_device_rows||0}}</i>/{{basicInfo.efairyreport_project_statistics.total_device_rows}}</span>
					</div>
					<div class="row">
						<span class="l">项目总数</span>
						<span class="r">{{basicInfo.efairyreport_project_statistics.total_device_rows}}</span>
					</div>

					<div class="row">
						<span class="l">项目评分</span>
						<span class="r">
							<label>最高分{{basicInfo.efairyreport_score_statistics.highest_score}}</label>
							<label>最低分{{basicInfo.efairyreport_score_statistics.lowest_score}}</label>
							<label>平均分{{basicInfo.efairyreport_score_statistics.average_score}}</label>
						</span>
					</div>
				</div>
				<form action="/" class="search-box">
					<van-search v-model="keyword" placeholder="请输入项目名称" show-action @search="getReportIndexProjectList" background="#fff">
						<div slot="action" @click="changeOrder()">
							<span :class="{point:true,asc:order==0,desc:order!=0}">评分</span>
						</div>
					</van-search>
				</form>
				<div class="box" v-if="projectList.length==0">
					<div class="ctx">没有项目数据</div>
				</div>
				<div class="box" v-for="(p,i) in projectList" :key="i">
					<div class="title"  @click="gotoProjectDetails(p)">
						{{p.efairyproject_name}}
						<span class="score orange">评分{{p.efairyproject_security_score}}</span>
					</div>
					<div class="ctx">
						<div class="intro">
							<i  @click="gotoProjectDetails(p)">项目负责人：</i>
							<span  @click="gotoProjectDetails(p)">{{p.efairyproject_user_name}}</span>
							<a class="icon" :href="'tel:'+p.efairyproject_user_phonenumber"><img src="@/assets/icons/phone_big.png" /></a>
						</div>

						<div class="table" v-if="p.efairyproject_device_statistics.device_statistics_list.length!=0"  @click="gotoProjectDetails(p)">
							<table>
								<tr>
									<th>设备类型</th>
									<th>点位总数</th>
									<th>报警点位数</th>
									<th>预警点位数</th>
									<th>故障点位数</th>
								</tr>
								<tr v-for="(d,i) in p.efairyproject_device_statistics.device_statistics_list">
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

			</div>
		</div>

	</div>

</template>

<script>
import BScroll from "better-scroll";
import moment from "moment";

export default {
    name: "reportDetail",

    data() {
        return {
            // query: this.$route.query,
            value: "",
            tmp: [],
            editTitle: false,
            projectList: [],
            basicInfo: {
                efairyreport_project_statistics: {},
                efairyreport_score_statistics: {}
            },
            keyword: "",
            order: 0,
            page: 1,
            size: 200,
            reportId: this.$route.params.rid
        };
    },
    async mounted() {
        this.getReportBasicInfo();
        this.getReportIndexProjectList();
        // console.log(this.$store.getters.deviclAlarmListChooseList);
        this.$nextTick(() => {
            // document.title = "项目列表";
            // this.calcHeight =
            //     document.querySelector(".main").offsetHeight -
            //     this.$refs.wrapper.offsetTop;
            this.setupBetterScroll();
        });
    },
    methods: {
        goToReportIndex() {
            this.$router.push({
                name: "reportIndex",
                query: { type: 0, refresh: 1 }
            });
        },
        gotoProjectDetails(project) {
            this.$router.push({
                name: "reportProject",
                params: { pid: project.efairyproject_id }
            });
        },
        goBack() {
            this.$router.back();
        },
        async getReportBasicInfo() {
            const basicInfo = await this.$service.reportService.getReportBasicInfo(
                {
                    efairyreport_id: this.reportId
                }
            );
            this.basicInfo = basicInfo.result;
            this.basicInfo.efairyreport_endtime = moment(
                this.basicInfo.efairyreport_endtime
            ).format("YYYY/MM/DD");
            this.basicInfo.efairyreport_starttime = moment(
                this.basicInfo.efairyreport_starttime
            ).format("YYYY/MM/DD");
            console.log(basicInfo);
        },
        async getReportIndexProjectList() {
            const projectList = await this.$service.reportService.getReportIndexProjectList(
                {
                    efairyreport_id: this.reportId,
                    keyword: this.keyword,
                    page: this.page,
                    size: this.size,
                    order: this.order
                }
            );
            this.projectList = projectList.result.efairyreport_project_list;
        },
        changeOrder() {
            this.order = 1 - this.order;
            this.getReportIndexProjectList();
		},
		editTitleFn(){
			this.editTitle=true;
			this.$refs.tinput.focus();
		},
        saveTitle() {
            this.editTitle = false;
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

i{
	font-style:normal;
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

.title-box {
    padding-top: 10px;
    .title-editable {
        background: #28a8ff;
        box-shadow: 0 4px 12px 0 rgba(101, 183, 239, 0.4);
        border-radius: 4px;
        width: 94%;
        margin: 0 auto;
        color: #fff;
        font-size: 16px;
        line-height: 50px;
        padding: 0 15px;
        box-sizing: border-box;
        position: relative;
        .right {
            float: right;
            font-size: 14px;
        }
        input {
            height: 26px;
            color: #333;
        }
    }
}
.main-box {
    background: #fff;
    padding-bottom: 5px;
    margin-top: -30px;
    padding-top: 40px;
    border-bottom: 1px solid #eee;
    .row {
        display: flex;
        padding: 6px 15px;
        color: #333;
        span {
            flex: 1;
            font-size: 14px;
            &.r {
                text-align: right;
                color: #666;
                flex: 2;
            }
            label {
                margin-left: 5px;
            }
        }
        &.title {
            font-size: 16px;
            line-height: 28px;
            border-bottom: 1px solid #eee;
            margin-bottom: 5px;
            .l {
                // font-weight: bold;
                font-size: 16px;
                flex: 2;
                color: #000;
            }
        }
    }
}

.search-box {
    // margin-top: 46px;
    .map {
        width: 16px;
        position: relative;
        top: 4px;
    }
    .point {
        position: relative;
        right: 5px;
        &::after {
            content: "";
            position: absolute;
            width: 0;
            height: 0;
            border: 4px solid transparent;
            border-bottom: 5px solid $dcyColor;
            right: -12px;
            top: -2px;
        }
        &::before {
            content: "";
            position: absolute;
            width: 0;
            height: 0;
            border: 4px solid transparent;
            border-top: 5px solid #ccc;
            right: -12px;
            bottom: -3px;
        }
    }
    .desc {
        &::after {
            border-bottom: 5px solid #ccc;
        }
        &::before {
            border-top: 5px solid $dcyColor;
        }
    }
}

.box {
    margin: 8px;
    overflow: hidden;
    border-radius: 5px;
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
    }
    table {
        margin: 15px 0 10px;
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
</style>
