<template>
	<div class="main">
		<van-nav-bar title="设备详情" @click-left="goBack" left-arrow />
		<div class="wrapper" ref="wrapper">
			<div>
				<div class="main-box">
					<div class="title row">
						<span class="l">{{basicInfo.efairydevice_name}}</span>
						<span class="r">版本{{basicInfo.efairydevice_version}}</span>
					</div>
					<div class="row">
						<span class="l">所属项目名称</span>
						<span class="r">{{basicInfo.efairyproject_name}}</span>
					</div>
					<div class="row">
						<span class="l">设备ID</span>
						<span class="r">{{basicInfo.efairydevice_uuid}}</span>
					</div>
					<div class="row">
						<span class="l">设备安装时间</span>
						<span class="r">{{basicInfo.efairydevice_install_time}}</span>
					</div>
					<div class="row">
						<span class="l">设备地址</span>
						<span class="r">{{basicInfo.efairydevice_address}}</span>
					</div>

				</div>

				<van-cell-group class="my-list">
					<van-cell title="设备图表" is-link :to="{name:'deviceCharts'}" />
				</van-cell-group>

				<van-cell-group class="my-list">
					<van-cell title="设备消息" is-link :to="{name:'deviceChat',query:{'msgobj_id':basicInfo.efairydevice_msgobj_id}}" />
				</van-cell-group>

				<div class="block-title">
					实时状态
				</div>
				<van-cell-group class="detail-list">
					<van-cell title="无线通信状态">
						<span class="online-dot" :class="{green:rtInfo.efairydevice_is_online}">{{rtInfo.efairydevice_is_online?'在线':'离线'}}</span>
						<span>
							<img src='@/assets/icons/device_status4.png' v-if="rtInfo.efairydevice_alarm_id==0">
							<img src='@/assets/icons/device_status1.png' v-if="rtInfo.efairydevice_alarm_id!=0&&rtInfo.efairydevice_csq_level==2">
							<img src='@/assets/icons/device_status2.png' v-if="rtInfo.efairydevice_alarm_id!=0&&rtInfo.efairydevice_csq_level==1">
							<img src='@/assets/icons/device_status3.png' v-if="rtInfo.efairydevice_alarm_id!=0&&rtInfo.efairydevice_csq_level==0"> 信号
						</span>
					</van-cell>
					<van-cell title="报警状态"><span :class="{red:rtInfo.efairydevice_alarm_id==1,yellow:rtInfo.efairydevice_alarm_id==3,orange:rtInfo.efairydevice_alarm_id==2,green:rtInfo.efairydevice_alarm_id==6}">{{statusHash[rtInfo.efairydevice_alarm_id]}}</span>
					</van-cell>
					<van-cell title="数据更新时间" :value="rtInfo.rt_data_time||'--'" />
					<van-cell title="心跳间隔" :value="rtInfo.heartbeat_interval+'s'||'--'" />
					<van-cell title="音响模式" :value="rtInfo.audio_on?'静音':'音响'" />

					<!-- <van-cell title="设备状态">{{statusHash[rtInfo.efairydevice_alarm_id]}}</van-cell>
					<van-cell title="是否在线" :value="rtInfo.efairydevice_is_online?'是':'否'" />
					<van-cell title="信号强度" :value="rtInfo.efairydevice_csq" />
					<van-cell title="信号等级" :value="levelHash[rtInfo.efairydevice_csq_level]" /> -->

				</van-cell-group>

				<div class="block-title">
					通道数据
				</div>
				<van-cell-group class="detail-list">
					<van-cell title="暂无数据" v-if="cdataList.length==0" />
					<van-cell :title="c.c_name" v-for="(c,i) in cdataList" :key="c.cid" @click="showEditAlert(c)">
						<span :class="{red:c.c_alarm_id==1,yellow:c.c_alarm_id==3,orange:c.c_alarm_id==2}">{{c.c_value}}</span>
					</van-cell>
				</van-cell-group>

				<div class="block-title">
					用户列表
				</div>
				<van-cell-group class="detail-list">
					<van-cell :title="user.efairyuser_nickname" v-for="(user,i) in userList" :key="user.efairyuser_id" :value="user.efairyuser_phonenumber" />
				</van-cell-group>
			</div>
		</div>
		<van-actionsheet v-model="show" :actions="phoneList" @select="onSelect" />
		<van-dialog v-model="dShow" show-cancel-button :before-close="beforeClose">
			<h5 class="dialog-title">输入通道名称</h5>
			<!-- <van-cell-group class="dialog-van-cell-group"> -->
			<van-field v-model="dialogModel.c_name" ref="dInput" />
			<!-- </van-cell-group> -->
		</van-dialog>
		<a class="phone" @click="showPhoneList()"><img src="@/assets/icons/phone_big.png"></a>

	</div>

</template>

<script>
import { Dialog } from "vant";
import BScroll from "better-scroll";
// 设备状态，0-离线 1-火警 2-预警 3-故障 4-启动 5-屏蔽 6-正常，优先级:离线 报警  预警  故障 启动 屏蔽 正常

export default {
    name: "deviceDetail",

    data() {
        return {
            dialogModel: {},
            statusHash: [
                "离线",
                "火警",
                "预警",
                "故障",
                "启动",
                "屏蔽",
                "正常"
            ],
            levelHash: ["弱", "中", "强"],
            deviceId: this.$route.params.did,
            value: "",
            show: false,
            dShow: false,
            phoneList: [],
            basicInfo: {},
            rtInfo: {},
            userList: [],
            cdataList: []
        };
    },
    async mounted() {
        // console.log(this.$store.getters.deviclAlarmListChooseList);
        this.getDeviceDetail();
        this.$nextTick(() => {
            this.setupBetterScroll();
        });
        Dialog.alert({
            title: "提示",
            message: "通道数据中的通道名称可以点击进行修改哦"
        });

        // document.location.href = "tel:xxx";
    },
    methods: {
        showEditAlert(item) {
            this.dShow = true;
            this.dialogModel = item;
            console.log(this.$refs["dInput"]);
        },
        async editDeviceChannelName(item) {
            const data = await this.$service.projectService.editDeviceChannelName(
                {
                    efairydevice_id: this.deviceId,
                    efairydevicechannelsetting_cid: item.cid,
                    efairydevicechannelsetting_setting: {
                        c_name: item.c_name
                    }
                }
            );
        },
        beforeClose(action, done) {
            if (action === "confirm") {
                // setTimeout(done, 1000);
                // console.log(this.configList);
                this.editDeviceChannelName(this.dialogModel);
                done();
            } else {
                done();
            }
        },
        goBack() {
            this.$router.back();
        },
        showPhoneList() {
            this.show = true;
        },
        async getDeviceDetail() {
            const data = await this.$service.projectService.getDeviceDetail({
                efairydevice_id: this.deviceId
            });
            this.$store.dispatch(
                "saveCurrentDeviceName",
                data.result.basic_info.efairydevice_name
            );
            this.basicInfo = data.result.basic_info;
            this.rtInfo = data.result.rt_info;
            this.userList = data.result.user_list;
            this.phoneList = this.userList.map(item => {
                return {
                    name: `${item.efairyuser_nickname} - ${
                        item.efairyuser_phonenumber
                    }`,
                    phone: item.efairyuser_phonenumber
                };
            });
            if (data.result.rt_info)
                this.cdataList = data.result.rt_info.c_data_list || [];
        },
        onSelect(item) {
            this.show = false;
            document.location.href = "tel:" + item.phone;
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

.dialog-title {
    text-align: center;
    margin: 10px auto 5px;
    font-size: 16px;
    color: $dcyColor;
}

.main-box {
    background: #fff;
    padding-bottom: 5px;
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

.my-list {
    margin-top: 10px;
    .van-cell {
        font-size: 15px;
        height: 45px;
        line-height: 30px;
    }
}
.online-dot {
    position: relative;
    &.green {
        &::after {
            background: $green;
        }
    }
    &::after {
        position: absolute;
        width: 8px;
        height: 8px;
        border-radius: 8px;
        left: -12px;
        top: 5px;
        content: "";
        background: #666;
    }
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
}

.detail-list {
    .van-cell {
        font-size: 14px;
        line-height: 20px;
    }
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
