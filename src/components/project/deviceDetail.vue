<template>
	<div class="main">
		<van-nav-bar title="设备详情" @click-left="goBack" left-arrow />
		<div class="wrapper" ref="wrapper">
			<div>
				<div class="main-box">
					<div class="title row">
						<span class="l">{{basicInfo.efairydevice_name}}</span>
						<span class="r">{{'版本:'+basicInfo.efairydevice_version}}</span>
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
					<van-cell title="设备状态">{{statusHash[rtInfo.efairydevice_alarm_id]}}</van-cell>
					<van-cell title="是否在线" :value="rtInfo.efairydevice_is_online?'是':'否'" />
					<van-cell title="信号强度" :value="rtInfo.efairydevice_csq" />
					<van-cell title="信号等级" :value="levelHash[rtInfo.efairydevice_csq_level]" />
					<van-cell title="心跳间隔" :value="rtInfo.heartbeat_interval||'--'" />
					<van-cell title="音响模式" :value="rtInfo.audio_on?'静音':'音响'" />
					<van-cell title="更新时间" :value="rtInfo.rt_data_time||'--'" />
				</van-cell-group>

				<div class="block-title">
					通道数据
				</div>
				<van-cell-group class="detail-list">
					<van-cell title="暂无数据" v-if="cdataList.length==0" />
					<van-cell :title="c.c_name" v-for="(c,i) in cdataList" :key="c.cid" :value="c.c_value" />
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

		<a class="phone" @click="showPhoneList()"><img src="@/assets/icons/phone_big.png"></a>

	</div>

</template>

<script>
import BScroll from "better-scroll";
// 设备状态，0-离线 1-火警 2-预警 3-故障 4-启动 5-屏蔽 6-正常，优先级:离线 报警  预警  故障 启动 屏蔽 正常

export default {
    name: "deviceDetail",

    data() {
        return {
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
        // document.location.href = "tel:xxx";
    },
    methods: {
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
