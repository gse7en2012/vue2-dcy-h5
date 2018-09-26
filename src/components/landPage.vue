<template>
	<div class="login-bg">
		<van-loading v-if="loading" />
		<van-tabs v-model="active">
			<van-tab title="密码登录">
				<div class="ctx password">
					<div class="row">
						<input type="tel" placeholder="用户名" v-model="phone">
						<span class="icon"><img src="@/assets/icons/account.png" class="account"></span>
					</div>
					<div class="row">
						<input type="password" placeholder="密码" v-model="password">
						<span class="icon"><img src="@/assets/icons/password.png" class="pass"></span>
					</div>
					<div class="row">
						<a class="btn" @click="loginViaPass()">立即登录</a>
					</div>
					<div class="row">
						<p class="tips">点击登录，即表示已阅读并同意
							<a @click="gotoRule()">《电次元服务条款》</a>
						</p>
					</div>
				</div>
			</van-tab>
			<van-tab title="验证码登录">
				<div class="ctx password">
					<div class="row">
						<input type="tel" placeholder="用户名">
						<span class="icon"><img src="@/assets/icons/account.png" class="account"></span>
					</div>
					<div class="row">
						<input type="tel" placeholder="验证码" class="code">
						<span class="icon"><img src="@/assets/icons/password.png" class="pass"></span>
						<a class="d-btn" @click="sendCode()" :class="{disabled:isSendCode}">{{codeText}}</a>
					</div>
					<div class="row">
						<a class="btn">立即登录</a>
					</div>
					<div class="row">
						<p class="tips">点击登录，即表示已阅读并同意
							<a @click="gotoRule()">《电次元服务条款》</a>
						</p>
					</div>
				</div>
			</van-tab>
		</van-tabs>

	</div>
</template>

<script>
import { Dialog } from "vant";
import BScroll from "better-scroll";
export default {
    name: "landPage",
    data() {
        return {
            // query: this.$route.query,
            loading: false,
            active: 0,
            codeText: "发送验证码",
            isSendCode: false,
            phone: "13751066522",
            password: "66666"
        };
    },
    async mounted() {

    },

    methods: {
        onClickLeft() {},
        sendCode() {
            this.isSendCode = true;
        },
        gotoRule() {
            this.$router.push({ name: "rulePage" });
        },
        async loginViaPass() {
            this.loading = true;
            try {
                const data = await this.$service.userService.loginViaPassword(
                    this.phone,
                    this.password
                );
                this.loading = false;
                this.$store.commit("accountLogin", data.result);
                this.$router.push({ name: "projectIndex" });
            } catch (e) {
                this.loading = false;
                this.$toast(e.msg);
            }
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
