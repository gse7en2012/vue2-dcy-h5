<template>
	<div class="main">
		<van-nav-bar title="设置" @click-left="goBack" fixed left-arrow fixed />
		<!-- <section class="page-main" ref="wrapper"> -->
		<div class="box">

			<van-cell-group class="my-list">
				<van-switch-cell v-model="checked1" title="短信通知" />
			</van-cell-group>
			<van-cell-group class="my-list">
				<van-switch-cell v-model="checked2" title="电话语音通知" />
			</van-cell-group>
			<van-cell-group class="my-list">
				<van-switch-cell v-model="checked3" title="微信推送通知" />
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
    data() {
        return {
            // query: this.$route.query,
            userInfo: {},
            qiniuToken: null,
            checked1: false,
            checked2: false,
            checked3: false
        };
    },
    async mounted() {
        this.getUserInfo();
    },

    methods: {
        goBack() {
            this.$router.back();
        },
        async getUserInfo() {
            const data = await this.$service.userService.getUserInfo();
            this.userInfo = data.result;
            this.userInfo.showPhone =
                this.userInfo.efairyuser_phonenumber.slice(0, 3) +
                "****" +
                this.userInfo.efairyuser_phonenumber.slice(7, 11);

            this.$store.commit("saveUserInfo", this.userInfo);
        },
        logout() {
            this.$store.commit("accountLogout");
            this.$router.push({ name: "loginPage" });
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
