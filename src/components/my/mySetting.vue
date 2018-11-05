<template>
	<div class="main">
		<van-nav-bar title="设置" @click-left="goBack" fixed left-arrow fixed />
		<!-- <section class="page-main" ref="wrapper"> -->
		<div class="box">

			<van-cell-group class="my-list">
				<van-switch-cell v-model="setting.efairyuserconfig_is_sms" title="短信通知" @input="saveUserSetting"/>
			</van-cell-group>
			<van-cell-group class="my-list">
				<van-switch-cell v-model="setting.efairyuserconfig_is_voice" title="电话语音通知" @input="saveUserSetting"/>
			</van-cell-group>
			<van-cell-group class="my-list">
				<van-switch-cell v-model="setting.efairyuserconfig_is_wx_notify" title="微信推送通知" @input="saveUserSetting"/>
			</van-cell-group>

		</div>
		<!-- </section> -->
	</div>
</template>

<script>
import { Dialog } from "vant";
import BScroll from "better-scroll";
import axios from "axios";

export default {
    name: "mySetting",
    watch: {
        // setting: {
        //     handler(newValue, oldValue) {
        //         this.saveUserSetting();
        //     },
        //     deep: true
        // }
    },
    data() {
        return {
            setting: {
                efairyuserconfig_is_sms: false,
                efairyuserconfig_is_voice: false,
                efairyuserconfig_is_wx_notify: false
            }
        };
    },
    async mounted() {
        this.getUserSetting();
    },

    methods: {
        goBack() {
            this.$router.back();
        },
        async saveUserSetting() {
            const config = {
                efairyuserconfig_is_sms: Number(
                    this.setting.efairyuserconfig_is_sms
                ),
                efairyuserconfig_is_voice: Number(
                    this.setting.efairyuserconfig_is_voice
                ),
                efairyuserconfig_is_wx_notify: Number(
                    this.setting.efairyuserconfig_is_wx_notify
                )
            };
            await this.$service.userService.editUserSetting({
                efairyuser_config_info: config
            });
            this.$toast("修改成功！");
        },
        async getUserSetting() {
            const data = await this.$service.userService.getUserSetting();
            this.setting = {
                efairyuserconfig_is_sms:
                    data.result.efairyuserconfig_is_sms == 1,
                efairyuserconfig_is_voice:
                    data.result.efairyuserconfig_is_voice == 1,
                efairyuserconfig_is_wx_notify:
                    data.result.efairyuserconfig_is_wx_notify == 1
            };
        }
    }
};
</script>

<style lang="scss" scoped>
$dcyColor: #282549;
.box {
    padding-top: 56px;
}
.van-uploader {
    width: 100%;
    height: 50px;
    position: absolute;
    left: 0;
}

.my-list {
    margin-top: 10px;
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
    .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        float: right;
        &-cell {
            height: auto;
            line-height: 50px;
        }
    }
}

.dcy-btn {
    display: block;
    line-height: 44px;
    line-height: 44px;
    font-size: 16px;
    color: #fff;
    background: $dcyColor;
    text-align: center;
    width: 95%;
    margin: 15px auto;
    border-radius: 32px;
    font-weight: 300;
}
</style>
