<template>
	<div class="login-bg">
		<van-loading v-if="loading" />
		<van-tabs v-model="active">
			<van-tab title="密码登录">
				<div class="ctx password">
					<div class="row">
						<input type="tel" placeholder="手机号" v-model="phone" maxlength="11">
						<span class="icon"><img src="@/assets/icons/account.png" class="account"></span>
					</div>
					<div class="row">
						<input :type="!viewPassword?'password':'text'" placeholder="密码" v-model="password">
						<span class="icon"><img src="@/assets/icons/password.png" class="pass"></span>
						<span class="icon right" @click="toggleViewPassword()">
							<img src="@/assets/icons/view_show.png" class="view" v-if="viewPassword">
							<img src="@/assets/icons/view_hide.png" class="view" v-if="!viewPassword">
						</span>
						<span class="icon right close" @click="password=''">
							&times;
						</span>
					</div>
					<div class="row">
						<van-checkbox v-model="savePass" >记住密码</van-checkbox>
					</div>
					<div class="row">
						<a class="btn" @click="loginViaPass()">立即登录</a>
					</div>
					<div class="row">
						<p class="tips">点击登录，即表示已阅读并同意
							<a @click="gotoRule()">《中城物联服务条款》</a>
						</p>
					</div>
				</div>
			</van-tab>
			<van-tab title="验证码登录">
				<div class="ctx password">
					<div class="row">
						<input type="tel" placeholder="手机号" v-model="phone" maxlength="11">
						<span class="icon"><img src="@/assets/icons/account.png" class="account"></span>
					</div>
					<div class="row">
						<input type="tel" v-model="code" placeholder="验证码" class="code">
						<span class="icon"><img src="@/assets/icons/password.png" class="pass"></span>
						<a class="d-btn" @click="sendCode()" :class="{disabled:isSendCode}">{{codeText}}</a>
					</div>
					<div class="row">
						<a class="btn" @click="loginViaCode()">立即登录</a>
					</div>
					<div class="row">
						<p class="tips">点击登录，即表示已阅读并同意
							<a @click="gotoRule()">《中城物联服务条款》</a>
						</p>
					</div>
				</div>
			</van-tab>
		</van-tabs>

	</div>
</template>

<script>
import Bus from "@/service/bus";
import { Dialog } from "vant";
import BScroll from "better-scroll";

const isProdEnv = process.env.NODE_ENV == "production";

const tmpPhone = localStorage.getItem("dcy_phone");
const tmpPass = localStorage.getItem("dcy_password");
const tmpSavePass = localStorage.getItem("dcy_savepss") == "1";
export default {
    name: "landPage",

    data() {
        return {
            // query: this.$route.query,
            loading: false,
            active: 0,
            savePass: tmpSavePass,
            codeText: "发送验证码",
            code: "",
            isSendCode: false,
            phone: isProdEnv ? tmpPhone || "" : tmpPhone || "13751066522",
            password: isProdEnv ? tmpPass || "" : "66666",
            // phone: "13751066522",
            // password: "66666",
            count: 60,
            sendCodeTimer: null,
            viewPassword: false
        };
    },
    watch: {
        savePass(newV, oldV) {
            console.log(newV, oldV);
            if (newV) {
                localStorage.setItem("dcy_savepss", 1);
                localStorage.setItem("dcy_password", this.password);
            } else {
                localStorage.removeItem("dcy_savepss");
                localStorage.removeItem("dcy_password");
            }
        }
    },
    async mounted() {
        // alert(localStorage);
        // alert(localStorage.getItem('dcyAccessToken'));
    },

    methods: {
        onClickLeft() {},
        toggleViewPassword() {
            this.viewPassword = !this.viewPassword;
		},
		changeSavePass(){},
        change() {
            console.log("c");
            let tmp = this.phone;
            tmp = tmp
                .split("")
                .map((item, index) => {
                    if (index == 2) return item + "-";
                    if (index == 6) return item + "-";
                    return item;
                })
                .join("");
            console.log(tmp);
            this.phone = tmp;
        },
        async sendCode() {
            if (this.isSendCode) return;
            if (!this.phone) return this.$toast("请输入手机号码");
            this.isSendCode = true;
            try {
                const data = await this.$service.userService.getLoginCheckCode(
                    this.phone.replace(/-/g, "")
                );
                const remainTime = data.result.remaining_times;
                console.log(remainTime);
                this.$toast("验证码发送成功");
                this.setUpTimer();
            } catch (e) {
                this.$toast("操作失败，请重试！");
            }
        },
        setUpTimer() {
            if (this.sendCodeTimer) clearInterval(this.sendCodeTimer);
            this.sendCodeTimer = setInterval(() => {
                if (this.count == 0) {
                    this.isSendCode = false;
                    this.codeText = "发送验证码";
                    clearInterval(this.sendCodeTimer);
                    return;
                }
                this.count--;
                this.codeText = `${this.count}s后重发`;
            }, 1000);
        },
        gotoRule() {
            this.$router.push({ name: "myBook" });
        },

        async loginViaCode() {
            if (!this.code) return this.$toast("请输入验证码");
            if (!this.phone) return this.$toast("请输入手机号码");
            this.loading = true;
            try {
                const data = await this.$service.userService.loginViaCheckCode(
                    this.phone.replace(/-/g, ""),
                    this.code
                );
                this.loading = false;
                Bus.$emit("loginSuccess", "login via code");
                this.$store.commit("accountLogin", data.result);
                this.$router.push({ name: "projectIndex" });
            } catch (e) {
                this.loading = false;
                this.$toast(e.msg);
            }
            localStorage.setItem("dcy_phone", this.phone);
        },
        async loginViaPass() {
            if (!this.password) return this.$toast("请输入密码");
            if (!this.phone) return this.$toast("请输入手机号码");
            this.loading = true;
            try {
                const data = await this.$service.userService.loginViaPassword(
                    this.phone.replace(/-/g, ""),
                    this.password
                );
                this.loading = false;
                Bus.$emit("loginSuccess", "login via pass");
                this.$store.commit("accountLogin", data.result);
                this.$router.push({ name: "projectIndex" });
            } catch (e) {
                this.loading = false;
                this.$toast(e.msg);
            }
            localStorage.setItem("dcy_phone", this.phone);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "@/assets/color.scss";

.van-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.5);
    padding: 10px;
    border-radius: 8px;
}

.ctx {
    padding: 40px 15px;
    background: #fff;
    .row {
        position: relative;
        margin-bottom: 20px;
        ::-webkit-input-placeholder {
            color: $dcyColor;
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
            border-radius: 30px;
            width: 100%;
            border: 0;
            background: #f6f6f6;
            height: 44px;
            padding: 10px 0;
            line-height: 24px;
            text-indent: 40px;
            color: $dcyColor;
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
                font-size: 16px;
                color: $dcyColor;
                line-height: 44px;
                font-size: 24px;
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
}

.btn {
    display: block;
    border-radius: 30px;
    background: $dcyColor;
    text-align: center;
    line-height: 44px;
    height: 44px;
    font-size: 14px;
    color: #fff;
    margin: 30px auto 0;
}

.login-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    overflow-y: auto;
}
</style>
