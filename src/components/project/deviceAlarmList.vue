<template>
	<div class="main">
		<van-nav-bar title="设备报警列表" @click-left="goBack" left-arrow />
		<div class="top-box">
			<div class="tab" @click="show=true">{{current.name}}</div>
			<div class="tab" @click="show=true">{{current.name}}</div>
		</div>

		<div class="wrapper" ref="wrapper">
			<div class="device-list">
				<div class="row" v-for="(item,i) in deviceList" @click="chooseMsg(item,i)">

					<div class="ctrl" :class="{show:edit}">
						<div class="radio" :class="{chose:item.choose}"></div>
					</div>
					<div class="wrap">
						<div class="ctx">
							<p class="title">
								<span class="left">通道类型+通道号</span>
								<span class="right red">火警</span>
							</p>
							<p class="info">
								<span class="left">报警值/阈值</span>
								<span class="right">90/120</span>
							</p>
							<p class="info">
								<span class="left">报警时间</span>
								<span class="right">{{item.time}}</span>
							</p>
						</div>
					</div>

				</div>
			</div>
			<div class="edit-button-box" :class="{show:edit}">
				<div class="dcy-radio" @click="chooseAll()">
					<div class="radio" :class="{chose:chooseAllFlag}"></div>全选
				</div>
				<a class="dcy-btn" @click="commitDeviceAlarmList()">提交</a>
			</div>
		</div>

		<van-actionsheet v-model="show" :actions="actions" @select="onSelect" />

	</div>

</template>

<script>
import BScroll from "better-scroll";
import { Toast } from "vant";

export default {
    name: "deviceAlarmList",

    data() {
        return {
            // query: this.$route.query,
            active: 0,
            edit: true,
            chooseAllFlag: false,
            value: "",
            tmp: [],
            deviceList: [],
            show: false,
            current: { name: "火警" },
            actions: [
                { name: "火警" },
                {
                    name: "正常"
                    // subname: "描述信息"
                },
                { name: "故障" },
                {
                    name: "报警"
                    // disabled: true
                }
            ],
            vuegConfig: {
                backAnim: "touchPoint",
                forwardAnim: "touchPoint", //options所有配置可以写在这个对象里，会覆盖全局的配置
                disable: false //对于嵌套路由，默认为关闭动画，需要在组件的data.vuegConfig中配置disable为false启用
            }
        };
    },
    async mounted() {
        console.log("this count", this.$store.state.count);
        this.$nextTick(() => {
            this.setupBetterScroll();
        });
        this.deviceList = Array.from({ length: 20 }).map((_, i) => {
            return {
                title: `${i}.这是标题紫薯很长很长很长很长很长很长很长`,
                time: "2018-09-11 11:22:33",
                msg: `${i}.这是消息主题内容啊啊啊啊啊${i}条哟哦哟33333333333`,
                choose: false,
                unread: true,
                id: i
            };
        });
    },
    methods: {
        goBack() {
            this.$router.back();
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
        editMessage() {
            this.edit = !this.edit;
        },
        onSelect(item) {
            // 点击选项时默认不会关闭菜单，可以手动关闭
            this.show = false;
            this.current = item;
            Toast(item.name);
        },
        chooseMsg(item, indexOfItem) {
            if (!this.edit) return;
            this.$set(item, "choose", !item.choose);
        },
        commitDeviceAlarmList() {
            this.$store.dispatch(
                "changeDeviclAlarmListChooseList",
                this.deviceList.filter(item => item.choose)
            );
            this.$router.push({ name: "deviceAlarmHandle" });
        },

        chooseAll() {
            this.chooseAllFlag = !this.chooseAllFlag;
            this.deviceList.forEach(msg => {
                msg.choose = this.chooseAllFlag;
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
                        // color: #999;
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
                        color: #999;
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
