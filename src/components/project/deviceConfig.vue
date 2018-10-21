<template>
	<div class="main">
		<van-nav-bar title="设备配置" @click-left="goBack" left-arrow />
		<div class="wrapper" ref="wrapper">

			<van-cell-group class="op-list">
				<van-cell @click="showHeartBeatDialog()" is-link>
					<span class="van-cell-text">心跳间隔</span>
					<div class="van-cell-box">

						<span>s</span>
						<span>{{heartModel}}</span>
					</div>
				</van-cell>
				<van-cell @click="showA=true" is-link>
					<span class="van-cell-text">音响模式</span>
					<div class="van-cell-box">
						<span>{{audioModel?'音响':'静音'}}</span>
					</div>
				</van-cell>
			</van-cell-group>
			<van-cell-group class="op-list">
				<van-cell @click="showDialog(item)" is-link v-for="(item,i) in configList" :ref="item.cid" :key="item.cid">
					<span class="van-cell-text">{{item.c_name}}</span>
					<div class="van-cell-box">

						<span>{{item.unit}}</span>
						<span>{{item.thv}}</span>
					</div>
				</van-cell>
			</van-cell-group>
		</div>
		<a class="dcy-btn" @click="postDeviceMsg()">保存配置</a>
		<van-dialog v-model="show" show-cancel-button :before-close="beforeClose">
			<h5 class="dialog-title">修改配置</h5>
			<van-cell-group class="dialog-van-cell-group">
				<van-field v-model="dialogModel.thv" :label="dialogModel.c_name" />
				<van-cell>可修改范围：({{dialogModel.minRange}}-{{dialogModel.maxRange}})</van-cell>
			</van-cell-group>
		</van-dialog>
		<van-dialog v-model="showB" show-cancel-button>
			<h5 class="dialog-title">修改配置</h5>
			<van-cell-group class="dialog-van-cell-group">
				<van-field v-model="heartModel" label="心跳间隔" />
			</van-cell-group>
		</van-dialog>

		<van-actionsheet v-model="showA" :actions="actions" @select="onSelect" />

	</div>

</template>

<script>
import BScroll from "better-scroll";

export default {
    name: "deviceConfig",

    data() {
        return {
            // query: this.$route.query,
            show: false,
            showA: false,
            showB: false,
            dialogModel: {},
            deviceId: this.$route.params.did,
            configList: [],
            audioModel: null,
            heartModel: null,
            actions: [
                //不传则返回所有状态，0-离线 1-火警 2-预警 3-故障 4-启动 5-屏蔽 6-正常
                { name: "静音", id: 0 },
                { name: "音响", id: 1 }
            ]
        };
    },
    async mounted() {
        this.getDeviceConfigList();
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
        beforeClose(action, done) {
            if (action === "confirm") {
                // setTimeout(done, 1000);

                if (
                    this.dialogModel.maxRange &&
                    this.dialogModel.thv > this.dialogModel.maxRange
                ) {
                    this.$toast("超出范围");
                    this.dialogModel.thv = this.dialogModel.maxRange;
                }
                if (
                    this.dialogModel.minRange &&
                    this.dialogModel.thv < this.dialogModel.minRange
                ) {
                    this.$toast("超出范围");
                    this.dialogModel.thv = this.dialogModel.minRange;
                }
                done();
            } else {
                done();
            }
        },
        onSelect(item) {
            // 点击选项时默认不会关闭菜单，可以手动关闭
            this.showA = false;
            this.audioModel = item.id;
        },
        async getDeviceConfigList() {
            const data = await this.$service.projectService.getDeviceSetting({
                efairydevice_id: this.deviceId
            });
            this.configList = data.result.efairydevicesetting_thv_list;
            this.audioModel = data.result.efairydevicesetting_audio_on;
            this.heartModel =
                data.result.efairydevicesetting_heartbeat_interval;
            this.configList.forEach(item => {
                if (item.value_range) {
                    try {
                        item.maxRange = item.value_range.find(
                            item => item.name == "max"
                        ).value;
                        item.minRange = item.value_range.find(
                            item => item.name == "min"
                        ).value;
                    } catch (e) {}
                }
            });
        },
        showDialog(item) {
            this.show = true;
            this.dialogModel = item;
            // this.$refs[item.id].focus();
        },
        showHeartBeatDialog() {
            this.showB = true;
        },
        async postDeviceMsg() {
            const data = await this.$service.projectService.postDeviceMsg({
                efairydevice_id: this.deviceId,
                control_order: 67, //67peizhi 128fuwei 129xiaoyin
                extra_info: {
					efairydevicesetting_heartbeat_interval: this.heartModel,
					efairydevicesetting_audio_on:this.audioModel,
					efairydevicesetting_thv_list:this.configList
                }
            });
            this.$toast("操作成功");
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

.op-list {
    margin-top: 15px;
    .van-cell {
        color: #666;
    }
    .van-cell-text {
        // max-width: 90px;
        flex: 1;
    }
    .van-cell-box {
        flex: 1;
        display: flex;
        flex-flow: row-reverse;
    }
}
.dialog-van-cell-group {
    margin: 15px 5px;
    .van-field .van-cell__title {
        max-width: auto;
    }
}
.dialog-title {
    text-align: center;
    margin: 10px auto 5px;
    font-size: 16px;
    color: $dcyColor;
}

.dcy-btn {
    display: block;
    color: #fff;
    background: #282549;
    border: 0;
    width: 90%;
    font-size: 16px;
    line-height: 42px;
    position: fixed;
    left: 5%;
    bottom: 10px;
    text-align: center;
    border-radius: 10vw;
}
</style>
