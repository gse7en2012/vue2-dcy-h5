<template>
	<div class="main">
		<van-nav-bar title="设备配置" @click-left="goBack" left-arrow />
		<div class="wrapper" ref="wrapper">
			<van-cell-group class="op-list">
				<van-cell @click="showDialog(item)" is-link v-for="(item,i) in configList" :ref="item.id" :key="item.id">
					<span class="van-cell-text">{{item.name}}</span>
					<div class="van-cell-box">
						<span>{{item.value}}</span>
					</div>
				</van-cell>
			</van-cell-group>
		</div>
		<a class="dcy-btn">保存配置</a>
		<van-dialog v-model="show" show-cancel-button :before-close="beforeClose">
			<h5 class="dialog-title">修改配置</h5>
			<van-cell-group class="dialog-van-cell-group">
				<van-field v-model="dialogModel.value" :label="dialogModel.name" />
			</van-cell-group>
		</van-dialog>
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
            dialogModel: {},
            configList: [
                {
                    name: "心跳间隔",
                    value: "75s",
                    id: 1
                },
                {
                    name: "音响模式",
                    value: "65s",
                    id: 2
                },
                {
                    name: "漏电通道12报警阈值",
                    value: "751s",
                    id: 3
                },
                {
                    name: "漏电通道1报警阈值",
                    value: "199mA",
                    id: 4
                },
                {
                    name: "心跳间隔2",
                    value: "75s",
                    id: 5
                }
            ]
        };
    },
    async mounted() {
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
                console.log(this.configList);
                done();
            } else {
                done();
            }
        },
        showDialog(item) {
            this.show = true;
            this.dialogModel = item;
            // this.$refs[item.id].focus();
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
    font-size: 14px;
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
