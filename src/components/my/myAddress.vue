<template>
	<div class="main">
		<van-nav-bar title="单位地址" @click-left="goBack" fixed left-arrow fixed />
		<section class="page-main">
			<van-cell-group class="my-cell">
				<van-field v-model="address" placeholder="请输入单位地址" type="textarea" rows="2" autosize />
			</van-cell-group>
			<a class="dcy-btn" @click="editInfo()">确定</a>
		</section>
	</div>
</template>

<script>
import { Dialog } from "vant";
import BScroll from "better-scroll";

export default {
    name: "myAddress",
    data() {
        return {
            // query: this.$route.query,
            userInfo: {},
            address: ""
        };
    },
    async mounted() {
        this.userInfo = this.$store.state.userInfo;
        this.address = this.userInfo.efairyuser_company_address;
    },

    methods: {
        goBack() {
            this.$router.back();
		},
		async editInfo(){
			const data=await this.$service.userService.editUserInfo({
				efairyuser_company_address:this.address
			});
			this.$toast('修改成功！');
		}
    }
};
</script>

<style lang="scss" scoped>
$dcyColor: #282549;

.my-cell {
    margin-top: 10px;
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
