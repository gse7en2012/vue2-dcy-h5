<template>
	<div class="main">
		<van-nav-bar title="设备报警列表" @click-left="goBack" left-arrow />
		<div class="top-box">
			<div class="tab" @click="show=true">{{current.name}}</div>
			<div class="tab" @click="showStatus=true">{{currentStatus.name}}</div>
		</div>

		<div class="wrapper" ref="wrapper">
			<div>
				<div class="no-result" v-if="!showLoading&&alarmList.length==0">
					暂无数据
				</div>
				<div class="device-list" v-if="currentStatus.status==0">
					<div class="row" v-for="(item,i) in alarmList" @click="chooseMsg(item,i)">
						<div class="ctrl" :class="{show:edit}">
							<div class="radio" :class="{chose:item.choose}"></div>
						</div>
						<div class="wrap">
							<div class="ctx">
								<p class="title">
									<span class="left">{{item.efairydevicealarmstatistics_c_name}}</span>
									<span class="right red">{{item.efairydevicealarmstatistics_c_alarm}}</span>
								</p>
								<p class="info">
									<span class="left">报警值/阈值</span>
									<span class="right">{{item.efairydevicealarmstatistics_highest_value}}</span>
								</p>
								<p class="info">
									<span class="left">报警时间</span>
									<span class="right">{{item.efairydevicealarmstatistics_start_time}}</span>
								</p>
							</div>
						</div>
					</div>
				</div>

				<div class="device-handled-list" v-if="currentStatus.status==1">
					<div class="row" v-for="(item,i) in alarmList" @click="gotoFixedDetail(item)">
						<div class="wrap">
							<div class="ctx">
								<p class="title">
									<span class="left">{{item.efairydevicealarmstatistics_c_name}}</span>
									<span class="right red">{{item.efairydevicealarmstatistics_c_alarm}}</span>
								</p>
								<p class="info">
									<span class="left">报警值/阈值</span>
									<span class="right">{{item.efairydevicealarmstatistics_highest_value}}</span>
								</p>
								<p class="info">
									<span class="left">报警时间</span>
									<span class="right">{{item.efairydevicealarmstatistics_start_time}}</span>
								</p>
								<p class="info">
									<span class="left">处理时间</span>
									<span class="right">{{item.efairyalarmrecord_add_time}}</span>
								</p>
								<p class="info">
									<span class="left">处理人名称</span>
									<span class="right">{{item.efairyuser_nickname}}</span>
								</p>
								<div class="desc">{{item.efairyalarmrecord_content}}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="edit-button-box" :class="{show:edit}">
				<div class="dcy-radio" @click="chooseAll()">
					<div class="radio" :class="{chose:chooseAllFlag}"></div>全选 （选中{{choseCount}}条）
				</div>
				<a class="dcy-btn" @click="commitDeviceAlarmList()">提交</a>
			</div>

		</div>

		<van-actionsheet v-model="show" :actions="actions" @select="onSelect" />
		<van-actionsheet v-model="showStatus" :actions="statusActions" @select="onSelectStatusAction" />
	</div>

</template>

<script>
import BScroll from "better-scroll";
import { Toast } from "vant";
import { mapState } from "vuex";

export default {
    name: "deviceAlarmList",
    computed: {
        ...mapState({
            showLoading: state => state.isAjaxLoading
        })
    },
    data() {
        return {
            edit: true,
            deviceId: this.$route.params.did,
            chooseAllFlag: false,
            choseCount: 0,
            alarmList: [],
            listFinished: false,
            show: false,
            showStatus: false,
            current: { name: "全部", id: -1 },
            currentStatus: { name: "未处理", status: 0 },
            pageSize: 10,
            lastId: 0,
            actions: [
                //不传则返回所有状态，0-离线 1-火警 2-预警 3-故障 4-启动 5-屏蔽 6-正常
                { name: "全部", id: -1 },
                { name: "正常", id: 6 },
                { name: "故障", id: 3 },
                { name: "火警", id: 1 },
                { name: "预警", id: 2 }
            ],
            statusActions: [
                { name: "未处理", status: 0 },
                { name: "已处理", status: 1 }
            ],
            vuegConfig: {
                backAnim: "touchPoint",
                forwardAnim: "touchPoint", //options所有配置可以写在这个对象里，会覆盖全局的配置
                disable: false //对于嵌套路由，默认为关闭动画，需要在组件的data.vuegConfig中配置disable为false启用
            }
        };
    },
    watch: {
        alarmList(newVal, oldVal) {
            // this.choseCount = this.alarmList.filter(msg => msg.choose).length;
        }
    },
    async mounted() {
        await this.getDeviceAlarmList();
        if (this.$route.query.status == 1) {
            this.currentStatus = { name: "已处理", status: 1 };
            this.onSelectStatusAction(this.currentStatus);
        }

        this.$nextTick(() => {
            this.setupBetterScroll();
        });
    },
    methods: {
        goBack() {
            this.$router.back();
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
                this.getDeviceAlarmList();
                this.scroll.finishPullUp();
                setTimeout(() => {
                    this.scroll.refresh();
                }, 0);
            });
        },
        async getDeviceAlarmList() {
            if (this.showLoading) return;
            if (this.listFinished) return this.$toast("没有更多了");
            const query = {
                alarm_id: this.current.id == -1 ? null : this.current.id,
                efairydevice_id: this.deviceId,
                size: this.pageSize,
                last_id: this.lastId
            };
            const data = await this.$service.projectService.getDeviceAlarmUnhandleList(
                query
            );
            const list = data.result.alarm_msg_list;
            if (list.length < this.pageSize) this.listFinished = true;
            if (list.length == 0) return;
            this.alarmList = this.alarmList.concat(list);
            this.lastId =
                list[list.length - 1]["efairydevicealarmstatistics_id"];
            if (this.chooseAllFlag) {
                this.alarmList.forEach(item => {
                    item.choose = true;
                });
                this.choseCount = this.alarmList.filter(
                    msg => msg.choose
                ).length;
            }
        },
        async getDeviceAlarmHandledList() {
            if (this.showLoading) return;
            if (this.listFinished) return this.$toast("没有更多了");
            const query = {
                alarm_id: this.current.id == -1 ? null : this.current.id,
                efairydevice_id: this.deviceId,
                size: this.pageSize,
                last_id: this.lastId
            };
            const data = await this.$service.projectService.getDeviceAlarmHandledList(
                query
            );
            const list = data.result.alarmrecord_list;
            if (list.length < this.pageSize) this.listFinished = true;
            if (list.length == 0) return;
            this.alarmList = this.alarmList.concat(list);
            this.lastId =
                list[list.length - 1]["efairydevicealarmstatistics_id"];
        },

        editMessage() {
            this.edit = !this.edit;
        },
        onSelect(item) {
            // 点击选项时默认不会关闭菜单，可以手动关闭
            this.show = false;
            this.current = item;
            this.alarmList = [];
            this.listFinished = false;
            this.lastId = 0;
            this.currentStatus.status == 1
                ? this.getDeviceAlarmHandledList()
                : this.getDeviceAlarmList();
        },
        onSelectStatusAction(item) {
            this.showStatus = false;
            this.currentStatus = item;
            this.alarmList = [];
            this.listFinished = false;
            this.lastId = 0;
            item.status == 1
                ? this.getDeviceAlarmHandledList()
                : this.getDeviceAlarmList();
            const newQuery = JSON.parse(JSON.stringify(this.$route.query)); //读取query参数
            newQuery.status = item.status;
            this.$router.push({
                query: newQuery
            });
            this.scroll && this.scroll.refresh();
        },
        chooseMsg(item, indexOfItem) {
            if (!this.edit) return;
            this.$set(item, "choose", !item.choose);
            this.choseCount = this.alarmList.filter(msg => msg.choose).length;
        },
        commitDeviceAlarmList() {
            this.$store.dispatch(
                "changeDeviclAlarmListChooseList",
                this.alarmList.filter(item => item.choose)
            );
            this.$router.push({ name: "deviceAlarmHandle" });
        },

        chooseAll() {
            this.chooseAllFlag = !this.chooseAllFlag;
            this.alarmList.forEach(msg => {
                msg.choose = this.chooseAllFlag;
            });
            this.choseCount = this.alarmList.filter(msg => msg.choose).length;
        },
        gotoFixedDetail(item) {
            this.$router.push({
                name: "deviceAlarmFixed",
                query: {
                    fixedId: item.efairydevicealarmstatistics_id,
                    deviceName: item.efairydevicealarmstatistics_c_name
                }
            });
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

.top-box {
    background: #fff;
    display: flex;
    .tab {
        flex: 1;
        text-align: center;
        font-size: 15px;
        line-height: 40px;
        height: 40px;
        position: relative;
        overflow: hidden;
        color: $dcyColor;
        &:nth-of-type(1) {
            &::before {
                content: "";
                background: #eee;
                width: 1px;
                height: 70%;
                position: absolute;
                right: 0;
                top: 15%;
            }
        }
        &::after {
            content: "";
            width: 8px;
            height: 8px;
            border: 2px solid $dcyColor;
            border-top: 0;
            border-right: 0;
            transform: rotate(-45deg);
            top: 0;
            right: 0;
            top: 13px;
            right: 30px;
            position: absolute;
        }
    }
}

.edit-button-box {
    position: absolute;
    z-index: 99;
    bottom: 0;
    background: #fff;
    width: 100%;
    box-shadow: 0px -1px 1px #efefef;
    height: 0;
    opacity: 0;
    transition: all 0.15s ease-in-out;
    overflow: hidden;
    &.show {
        height: 50px;
        opacity: 1;
    }
}

.wrapper {
    position: absolute;
    top: 86px;
    width: 100%;
    bottom: 0;
}

.no-result {
    text-align: center;
    margin: 20px;
    color: #999;
    font-size: 14px;
}

.device-handled-list {
    padding-bottom: 55px;
    overflow: hidden;
    .wrap {
        flex: 1;
        background: #fff;
        border-radius: 4px;
        display: flex;
        transition: all 0.3s ease-in-out;
        margin: 8px;
        .ctx {
            flex: 2;
            .info {
                font-weight: normal;
                display: flex;
                // margin: 10px 0 5px;
                margin: 5px 0;
                padding: 0 10px;
                .left {
                    font-size: 14px;
                    color: #333;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;

                    line-height: 22px;
                    flex: 1;
                }
                .right {
                    font-size: 14px;
                    color: #999;
                    text-align: right;
                    line-height: 22px;
                }
            }
            .desc {
                padding: 5px 10px;
                font-size: 13px;
                color: #999;
                border-top: 1px dashed #eee;
                margin: 10px 0 5px;
                word-break: break-all;
            }
            .title {
                font-weight: normal;
                display: flex;
                padding: 8px 10px;
                margin: 0;
                border-bottom: 1px solid #eee;
                .left {
                    font-size: 16px;
                    color: #333;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    line-height: 22px;
                    flex: 1;
                }
                .right {
                    font-size: 12px;
                    // color: #999;
                    text-align: right;
                    line-height: 22px;
                }
            }
        }
    }
}

.device-list {
    // margin-top: 88px;
    padding-bottom: 55px;
    overflow: hidden;
    .row {
        display: flex;
        margin: 8px;
        .ctrl {
            align-items: center;
            display: flex;
            overflow: hidden;
            width: 0;
            opacity: 0;
            transition: width 0.15s ease-in-out;
            &.show {
                width: 30px;
                margin-right: 8px;
                opacity: 1;
            }
            .radio {
                margin: auto;
                width: 20px;
                height: 20px;
                border-radius: 20px;
                border: 1px solid #364760;
                position: relative;
                display: inline-block;

                &.chose {
                    &:before {
                        content: "";
                        position: absolute;
                        width: 80%;
                        height: 80%;
                        top: 10%;
                        left: 10%;
                        background: $dcyColor;
                        border-radius: 50%;
                        z-index: 2;
                    }
                }
            }
        }
        .wrap {
            flex: 1;
            background: #fff;
            border-radius: 4px;
            display: flex;
            transition: all 0.3s ease-in-out;
            .ctx {
                flex: 2;
                margin: 5px 10px;
                .info {
                    font-weight: normal;
                    display: flex;
                    // margin: 10px 0 5px;
                    margin: 5px 0;
                    .left {
                        font-size: 14px;
                        color: #333;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 1;
                        -webkit-box-orient: vertical;

                        line-height: 22px;
                        flex: 1;
                    }
                    .right {
                        font-size: 14px;
                        color: #999;
                        text-align: right;
                        line-height: 22px;
                    }
                }
                .title {
                    font-weight: normal;
                    display: flex;
                    margin: 5px 0;
                    .left {
                        font-size: 16px;
                        color: #333;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 1;
                        -webkit-box-orient: vertical;
                        line-height: 22px;
                        flex: 1;
                    }
                    .right {
                        font-size: 12px;
                        // color: #999;
                        text-align: right;
                        line-height: 22px;
                    }
                }
            }
        }
    }
}

.edit-bar {
    height: 35px;
    background: #fff;
    position: absolute;
    width: 100%;
    top: 46px;
    z-index: 99;
    &-span {
        font-size: 12px;
        color: $dcyColor;
        float: right;
        line-height: 35px;
        margin-right: 8px;
        img {
            height: 12px;
            margin-right: 4px;
        }
    }
}

.dcy-btn {
    float: right;
    line-height: 32px;
    font-size: 15px;
    color: #fff;
    background: $dcyColor;
    text-align: center;
    min-width: 74px;
    margin: 9px;
    border-radius: 32px;
    font-weight: 300;
}

.dcy-radio {
    float: left;
    color: #3a3a3a;
    font-size: 12px;
    margin: 8px 12px;
    .radio {
        margin: auto;
        width: 20px;
        height: 20px;
        border-radius: 20px;
        border: 1px solid #364760;
        opacity: 0.2;
        position: relative;
        top: 7px;
        margin-right: 10px;
        display: inline-block;
        &.chose {
            opacity: 1;
            border-color: $dcyColor;
            &:before {
                content: "";
                position: absolute;
                width: 80%;
                height: 80%;
                top: 10%;
                left: 10%;
                background: $dcyColor;
                border-radius: 50%;
                z-index: 2;
            }
        }
    }
}
</style>
