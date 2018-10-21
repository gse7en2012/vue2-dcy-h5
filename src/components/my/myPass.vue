<template>
	<div class="main">
		<van-nav-bar title="修改密码" @click-left="goBack" fixed left-arrow fixed />
		<section class="page-main">
			<van-cell-group class="my-cell">
				<van-field v-model="oldPass" placeholder="请输入旧密码" type="password"  rows="1" autosize/>

				<van-field v-model="newPass" placeholder="请输入新密码" type="textarea"  rows="1" autosize/>

				<van-field v-model="newPass2" placeholder="再次输入新密码" type="textarea"  rows="1" autosize/>
			</van-cell-group>
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
			oldPass:'',
			newPass:'',
			newPass2:'',
        };
    },
    async mounted() {

    },
    methods: {
        goBack() {
            this.$router.back();
		},
		async editPassword(){
			if(!this.newPass||!this.newPass2) return this.$toast('请输入新密码');
			if(this.newPass!=this.newPass2) return this.$toast('两次输入的新密码不一致');
			const data=await this.$service.userService.editPassword({
				efairyuser_password_old:this.oldPass,
				efairyuser_password_new:this.newPass
			});
			this.$toast('修改成功！');
		}
    }
};
</script>

<style lang="scss" scoped>
$dcyColor: #282549;

.my-cell{
	margin-top: 10px;;
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
