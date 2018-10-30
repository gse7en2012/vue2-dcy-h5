<template>
	<div class="main">
		<van-nav-bar title="修改密码" @click-left="goBack" fixed left-arrow fixed />
		<section class="page-main">
			<div class="mar"></div>

			<div class="row">
				<input :type="!viewPassword1?'password':'text'" placeholder="请输入旧密码" v-model="oldPass">
				<span class="icon right" @click="toggleViewPassword(1)">
					<img src="@/assets/icons/view_show.png" class="view" v-if="viewPassword1">
					<img src="@/assets/icons/view_hide.png" class="view" v-if="!viewPassword1">
				</span>
				<span class="icon right close" @click="oldPass=''">
					&times;
				</span>
			</div>

			<div class="row">
				<input :type="!viewPassword2?'password':'text'" placeholder="请输入新密码" v-model="newPass">
				<span class="icon right" @click="toggleViewPassword(2)">
					<img src="@/assets/icons/view_show.png" class="view" v-if="viewPassword2">
					<img src="@/assets/icons/view_hide.png" class="view" v-if="!viewPassword2">
				</span>
				<span class="icon right close" @click="newPass=''">
					&times;
				</span>
			</div>

			<div class="row">
				<input :type="!viewPassword3?'password':'text'" placeholder="再次输入新密码" v-model="newPass2">
				<span class="icon right" @click="toggleViewPassword(3)">
					<img src="@/assets/icons/view_show.png" class="view" v-if="viewPassword3">
					<img src="@/assets/icons/view_hide.png" class="view" v-if="!viewPassword3">
				</span>
				<span class="icon right close" @click="newPass2=''">
					&times;
				</span>
			</div>

			<a class="dcy-btn" @click="editPassword()">确定</a>
		</section>
	</div>
</template>

<script>
import { Dialog } from "vant";
import BScroll from "better-scroll";

export default {
    name: "myPass",
    data() {
        return {
            // query: this.$route.query,
            oldPass: "",
            newPass: "",
			newPass2: "",
			viewPassword1:false,
			viewPassword2:false,
			viewPassword3:false,
        };
    },
    async mounted() {},
    methods: {
        toggleViewPassword(type) {
            this[`viewPassword${type}`] = !this[`viewPassword${type}`];
        },
        goBack() {
            this.$router.back();
        },
        async editPassword() {
            if (!this.newPass || !this.newPass2)
                return this.$toast("请输入新密码");
            if (this.newPass != this.newPass2)
                return this.$toast("两次输入的新密码不一致");
            const data = await this.$service.userService.editPassword({
                efairyuser_password_old: this.oldPass,
                efairyuser_password_new: this.newPass
            });
            this.$toast("修改成功！");
        }
    }
};
</script>

<style lang="scss" scoped>
$dcyColor: #282549;

.my-cell {
    margin-top: 10px;
}
.mar{
	height: 20px;
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

.row {
    position: relative;
    border-top: 1px solid #eee;
    ::-webkit-input-placeholder {
        color: #666;
    }
    .tips {
        color: #999;
        font-size: 12px;
        text-align: center;
        a {
            color: $dcyColor;
        }
    }
    input {
        width: 100%;
        border: 0;
        font-size: 14px;
        height: 40px;
        padding: 10px 0;
        line-height: 24px;
        text-indent: 15px;
        color: #666;
        box-sizing: border-box;
        &.code {
            width: 62%;
        }
    }
    .d-btn {
        float: right;
        width: 34%;
        height: 44px;
        line-height: 44px;
        border: 1px solid $dcyColor;
        color: $dcyColor;
        border-radius: 22px;
        text-align: center;
        box-sizing: border-box;
        &.disabled {
            color: #bbb;
            border-color: #bbb;
        }
    }
    .icon {
        position: absolute;
        width: 20px;
        height: 100%;
        left: 15px;
        top: 0;
        &.right {
            left: auto;
            right: 15px;
        }
        &.close {
            right: 34px;
            color: $dcyColor;
            line-height: 40px;
            font-size: 22px;
        }
        img {
            display: block;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
        .account {
            height: 18px;
        }
        .pass {
            width: 18px;
        }
        .view {
            width: 18px;
        }
    }
}
</style>
