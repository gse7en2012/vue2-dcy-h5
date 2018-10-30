<template>
	<div class="main">
		<van-nav-bar title="个人信息" @click-left="goBack" fixed left-arrow fixed />
		<!-- <section class="page-main" ref="wrapper"> -->
		<div class="box">

			<van-cell-group class="my-list">
				<van-cell title="头像" is-link class="avatar-cell" id="my-cell">
					<van-uploader :after-read="onReadUploadImg" class="item add" />
					<img src="@/assets/icons/avatar.png" :src="userInfo.efairyuser_headimg_url" class="avatar">
				</van-cell>
				<van-cell title="昵称" is-link :value="userInfo.efairyuser_nickname" :to="{path:'/my/info/name'}" />
			</van-cell-group>

			<van-cell-group class="my-list">
				<van-cell title="手机" :value="userInfo.efairyuser_phonenumber" />
			</van-cell-group>

			<van-cell-group class="my-list">
				<van-cell title="修改密码" is-link :to="{path:'/my/info/pass'}" />
			</van-cell-group>

			<!-- <van-cell-group class="my-list">
				<van-cell title="退出登录"  @click="logout()" style="text-align:center;color:#ff0000"/>
			</van-cell-group> -->

			<a class="dcy-btn"  @click="logout()">退出登录</a>

		</div>
		<!-- </section> -->
	</div>
</template>

<script>
import { Dialog } from "vant";
import BScroll from "better-scroll";
import axios from "axios";

const axiosInstance = axios.create({});
const QINIUDOMAIN = "https://efairyqiniu.tokabu.com";
export default {
    name: "myInfo",
    data() {
        return {
            // query: this.$route.query,
            userInfo: {},
            qiniuToken: null
        };
    },
    async mounted() {
        this.getUserInfo();
        this.getQiniuToken();
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
        },
        async editInfo() {
            const data = await this.$service.userService.editUserInfo({
                efairyuser_headimg_url: this.userInfo.efairyuser_headimg_url
            });
            this.$toast("修改成功！");
        },
        async getQiniuToken() {
            const token = await this.$service.userService.getQiniuToken();
            this.qiniuToken = token.result.upload_token;
        },
        async onReadUploadImg(file) {
            await this.uploadToQiniu(file);
            this.editInfo();
        },
        async uploadToQiniu(file) {
			const data = new FormData();
			const params='?imageView2/1/w/100/h/100';
            data.append("token", this.qiniuToken);
            data.append("file", file.file);
            const response = await axiosInstance({
                method: "POST",
                url: "http://up-z2.qiniup.com",
                data: data
            });
            const img = QINIUDOMAIN + "/" + response.data.key+params;
            // this.uploadImgList.push(img);
            this.userInfo.efairyuser_headimg_url = img;
            return img;
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
