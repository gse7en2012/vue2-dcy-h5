<template>
	<div>
		<van-nav-bar title="生成报告" @click-left="goBack()" fixed left-arrow class="pop-nav-bar" />
		<div class="my-box" ref="wrapper">
			<van-cell-group class="my-list">
				<van-cell :title="p.efairyproject_name" v-for="(p,index) in projectList" :key="index">
				</van-cell>

			</van-cell-group>
		</div>
		<div class="op-box">
			<van-cell-group class="op-list">
				<van-cell>
					<span class="van-cell-text">报告标题</span>
					<div class="van-cell-box">
						<!-- <van-field v-model="title" placeholder="请在这里输入报告标题" /> -->
						<input  v-model="title" placeholder="请在这里输入" class="title-input">
					</div>
				</van-cell>
				<van-cell>
					<!-- <template slot="title"> -->
					<span class="van-cell-text">快捷选择</span>
					<!-- </template> -->

					<div class="van-cell-box">
						<a class="dcy-btn" :class="{cur:dateRangeType==1}" @click="chooseDateRange(1)">本日</a>
						<a class="dcy-btn" :class="{cur:dateRangeType==2}" @click="chooseDateRange(2)">近7天</a>
						<a class="dcy-btn" :class="{cur:dateRangeType==3}" @click="chooseDateRange(3)">近30天</a>
					</div>

				</van-cell>

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

				<!-- <van-field label="开始日期" @click="showDatePopup('start')" v-model="startDate" /> -->
				<!-- <van-field label="结束日期" @click="showDatePopup('end')" v-model="endDate" /> -->
			</van-cell-group>

			<a class="dcy-btn large" @click="buildReport()">生成报告</a>
		</div>

		<van-popup v-model="showDatePicker" @click-overlay="closeDatePopup()" position="bottom" lazy-render>
			<van-datetime-picker v-model="currentDate" type="date" @confirm="setTime" @cancel="closeDatePopup" :title="datePickerTitle" />
		</van-popup>

	</div>
</template>

<script>
import { Dialog } from "vant";
import BScroll from "better-scroll";
import moment from "moment";

export default {
    name: "reportPopup",
    props: ["projectList"],
    data() {
        return {
            // query: this.$route.query,
            // scroll: null,
            dateRangeType: 0,
            currentDatePickerType: "start",
            currentDate: new Date(),
            showDatePicker: false,
            startDate: "",
            endDate: "",
            title: "",
            datePickerTitle: "开始日期"
        };
    },
    async mounted() {
		this.chooseDateRange(2);
        this.$nextTick(() => {
            // this.setupBetterScroll();
        });
    },
    watch: {
        projectList(val) {}
    },
    methods: {
        goBack() {
			this.startDate='';
			this.endDate='';
			this.title='';
			this.$emit("close-popup");

        },
        chooseDateRange(type) {
            this.dateRangeType = type;
            switch (type) {
                case 1:
                    this.startDate = moment()
                        .add(-1, "days")
                        .format("YYYY-MM-DD");
                    this.endDate = moment().format("YYYY-MM-DD");
                    break;
                case 2:
                    this.startDate = moment()
                        .add(-7, "days")
                        .format("YYYY-MM-DD");
                    this.endDate = moment().format("YYYY-MM-DD");
                    break;
                case 3:
                    this.startDate = moment()
                        .add(-1, "months")
                        .format("YYYY-MM-DD");
                    this.endDate = moment().format("YYYY-MM-DD");
                    break;
            }
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
        formatter(type, value) {
            const hash = {
                year: `${value}年`,
                month: `${value}月`,
                day: `${value}日`
            };
            return hash[type];
        },
        alertMsg(data) {
            alert(data);
		},
		async buildReport(){
			const data=await this.$service.reportService.buildReport({
				efairyreport_title:this.title,
				efairyproject_id_list:this.projectList.map((item)=>item.efairyproject_id),
				start_time:this.startDate,
				end_time:this.endDate
			});
			this.$toast('生成报告成功！');
			this.$router.push({
				name:'reportDetail',
				params:{rid:data.result.efairyreport_id}
			})
			// console.log(data);
		},
        showDatePopup(type) {
			this.dateRangeType=0;
            this.showDatePicker = true;
            this.currentDatePickerType = type;
            this.datePickerTitle = type == "start" ? "开始日期" : "结束日期";
        },
        closeDatePopup() {
            this.showDatePicker = false;
            this.$emit("showBar");
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
$dcyColor: #282549;

.dcy-btn {
    line-height: 24px;
    font-size: 12px;
    border: 1px solid #cfcfcf;
    color: #333;
    &.cur {
        color: #fff;
        background: #282549;
        border: 1px solid $dcyColor;
    }
    text-align: center;
    min-width: 54px;
    margin: 0;
    margin-left: 15px;
    border-radius: 32px;
    &.large {
        display: block;
        color: #fff;
        background: #282549;
        border: 0;
        margin: 20px auto;
        width: 90%;
        font-size: 16px;
        line-height: 42px;
    }
}

.pop-nav-bar {
    display: block !important;
}
.my-box {
    position: absolute;
    top: 46px;
    bottom: 260px;
    width: 100%;
    overflow: auto;
    // z-index: 9999;
}
.my-list {
    // margin-top: 10px;

    .icon-wrapper {
        width: 20px;
        margin-right: 15px;
        position: relative;
    }
    .icon {
        width: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .van-cell {
        font-size: 15px;
        height: 45px;
        line-height: 30px;
    }
}

.op-box {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 260px;
    background: #eef0f3;
    z-index: 10;
}

.op-list {
    margin-top: 15px;
    .van-cell {
        color: #666;
        .title-input {
            width: 100%;
            text-align: right;
            height: 26px;
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            line-height: 26px;
			border:0;
			background:transparent;
        }
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

.popup-scroll {
    position: absolute;
    top: 46px;
    bottom: 0;
    width: 100%;
    overflow-y: auto;
}
</style>
