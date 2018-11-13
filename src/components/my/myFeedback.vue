<template>
	<div class="main">
		<van-nav-bar title="意见反馈" @click-left="goBack" fixed left-arrow fixed />
		<section class="page-main">
			<van-cell-group class="my-cell">
				<van-field v-model="ctx" placeholder="请输入意见" type="textarea" rows="8" autosize />
			</van-cell-group>

			<div class="box">
				<div class="title">上传图片</div>
				<div class="ctx">
					<div class="img-uploader">
						<div class="item" v-for="(img,i) in uploadList" :key="i">
							<van-icon name="close" @click="deleteUploadImg(i)" />
							<img :src="img.content" :class="{'ver':img.isWide}" @click="previewUploadImg(i)">
						</div>

						<van-uploader :after-read="onReadUploadImg" class="item add" v-if="uploadList.length<=8" />
					</div>
				</div>
			</div>

			<a class="dcy-btn" @click="postFeedback()">提交</a>
		</section>
	</div>
</template>

<script>
import { Dialog } from "vant";
import BScroll from "better-scroll";
import axios from "axios";

const axiosInstance = axios.create({});
const QINIUDOMAIN = "https://efairyqiniu.tokabu.com";
export default {
    name: "myFeedback",
    data() {
        return {
            // query: this.$route.query,
            ctx: "",
            uploadList: [],
            uploadImgList: [],
            uploadImgFlag: false
        };
    },
    async mounted() {
        this.userInfo = this.$store.state.userInfo;

        this.getQiniuToken();
    },
    methods: {
        goBack() {
            this.$router.back();
        },
        async postFeedback() {
			await this.$service.userService.postFeedback({
				efairyfeedback_info:{
					efairyfeedback_content:this.ctx,
					efairyfeedback_imgurl_list:this.uploadImgList
				}
			})
			 this.$toast("反馈成功");
			 this.goBack();
		},
        async editInfo() {
            const data = await this.$service.userService.editUserInfo({
                efairyuser_email: this.email
            });
            this.$toast("修改成功！");
        },
        async onReadUploadImg(file) {
            file.id = this.idSeed++;
            this.getImgWidthAndHeight(file);
            this.uploadToQiniu(file);

            setTimeout(() => {
                this.uploadList.push(file);
            }, 0);
        },
        async getQiniuToken() {
            const token = await this.$service.userService.getQiniuToken();
            this.qiniuToken = token.result.upload_token;
        },
        async uploadToQiniu(file) {
            const data = new FormData();
            data.append("token", this.qiniuToken);
            data.append("file", file.file);
            const response = await axiosInstance({
                method: "POST",
                url: "http://up-z2.qiniup.com",
                data: data
            });
            const img = QINIUDOMAIN + "/" + response.data.key;
            this.uploadImgList.push(img);
            return img;
        },
        previewUploadImg(i) {
            this.imgPrevie = ImagePreview({
                images: this.uploadList.map(item => item.content),
                startPosition: i
            });
        },
        deleteUploadImg(i) {
            this.$dialog
                .confirm({
                    message: "是否删除该照片"
                })
                .then(() => {
                    this.uploadList.splice(i, 1);
                    this.uploadImgList.splice(i, 1);
                });
        },
        getImgWidthAndHeight(file) {
            const tmp = new Image();
            tmp.src = file.content;
            tmp.onload = () => {
                console.log(tmp.width, tmp.height);
                file.width = tmp.width;
                file.height = tmp.height;
                if (tmp.width > tmp.height) file.isWide = true;
            };
        }
    }
};
</script>

<style lang="scss" scoped>
$dcyColor: #282549;

.my-cell {
    margin-top: 10px;
}

.box {
    margin: 8px;
    overflow: hidden;
    border-radius: 5px;
    background: #fff;
    .van-cell {
        padding: 8px 15px;
        color: #666;
    }
    .van-cell:not(:last-child)::after {
        left: 0;
    }
    .van-cell-text {
        max-width: 90px;
        flex: 1;
        color: #666;
    }
    .van-cell-box {
        flex: 1;
        display: flex;
        flex-flow: row-reverse;
    }

    .ctx {
        padding: 8px 15px;
        font-size: 14px;
        color: #666666;
        letter-spacing: 0;
        line-height: 1.5;
    }
    .title {
        padding: 8px 15px;
        border-bottom: 1px solid #eee;
        font-size: 14px;
        color: #333;
    }
    .desc-txt {
        width: 100%;
        background: #fff;
        border: 0;
        resize: none;
    }
}

.img-uploader {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -4px;
    .item {
        flex: 0 0 33.333%;
        padding-top: calc(33.333% - 8px);
        box-sizing: border-box;
        border: 4px solid #fff;
        background: #ddd;
        position: relative;
        overflow: hidden;
        .van-icon {
            font-size: 16px;
            position: absolute;
            width: 20px;
            right: 0;
            top: 0;
            z-index: 10;
            background: $dcyColor;
            text-align: center;
            height: 20px;
            line-height: 20px;
            color: #fff;
            opacity: 0.8;
        }
        img {
            width: 100%;
            position: absolute;
            transform: translate(-50%, -50%);
            left: 50%;
            top: 50%;
            &.ver {
                width: auto;
                height: 100%;
            }
        }
        &.add {
            &:after {
                content: "";
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                border-bottom: 3px solid #9a9a9a;
                width: 40%;
                height: 0;
            }
            &:before {
                content: "";
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                border-left: 3px solid #9a9a9a;
                width: 0;
                height: 40%;
            }
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
