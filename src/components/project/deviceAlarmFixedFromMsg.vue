<template>
	<div class="main">
		<van-nav-bar title="已处理详情" @click-left="goBack" left-arrow />
		<section class="page-main" ref="wrapper">
			<div>
				<div class="section" v-for="(details,i) in list">
					<div class="box">
						<div class="title">
							<div class="avatar-box">
								<img :src="details.efairyuser_headimg_url" class="avatar">
							</div>
							<div class="info">
								<p class="l1">{{details.efairydevicealarmstatistics_c_name}}</p>
								<p class="l2">处理人员：{{details.efairyuser_nickname}}</p>
							</div>
						</div>

					</div>

					<div class="box">
						<!-- <van-cell-group class="op-list"> -->
						<van-cell>
							<span class="van-cell-text">报警类型</span>
							<div class="van-cell-box">
								<span>{{details.efairydevicealarmstatistics_c_alarm}}</span>
							</div>
						</van-cell>

						<van-cell>
							<span class="van-cell-text">报警值/阈值</span>
							<div class="van-cell-box">
								<span>{{details.efairydevicealarmstatistics_highest_value}}</span>
							</div>
						</van-cell>

						<van-cell>
							<span class="van-cell-text">报警时间</span>
							<div class="van-cell-box">
								<span>{{details.efairydevicealarmstatistics_start_time}}</span>
							</div>
						</van-cell>

						<van-cell>
							<span class="van-cell-text">处理时间</span>
							<div class="van-cell-box">
								<span>{{details.efairyalarmrecord_add_time}}</span>
							</div>
						</van-cell>

						<van-cell>
							<span class="van-cell-text">排查现场</span>
							<div class="van-cell-box">
								<span>{{details.efairyalarmrecord_is_insite_handle==1?'是':'否'}}</span>
							</div>
						</van-cell>
						<van-cell>
							<span class="van-cell-text">排查隐患</span>
							<div class="van-cell-box">
								<span>{{details.efairyalarmrecord_is_handle==1?'是':'否'}}</span>
							</div>
						</van-cell>
					</div>

					<div class="box">
						<div class="ctx">
							<p class="desc-txt">处理描述：{{details.efairyalarmrecord_content}}</p>
						</div>
					</div>

					<div class="box">
						<div class="title">处理图片</div>
						<div class="ctx">
							<p v-if="!details.efairyalarmrecordimage_list||details.efairyalarmrecordimage_list.length==0">没有图片</p>
							<div class="img-uploader">
								<div class="item" v-for="(img,i) in details.efairyalarmrecordimage_list" :key="i">
									<img :src="img" @click="previewUploadImg(i)">
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

	</div>
</template>

<script>
import { Dialog, ImagePreview } from "vant";
import BScroll from "better-scroll";

export default {
    name: "deviceAlarmFixedFromMsg",
    data() {
        return {
            msgId: this.$route.query.msgId,
			list:[]
        };
    },
    async mounted() {
        this.getDeviceAlarmFixedDetail();
        this.$nextTick(() => {
            this.setupBetterScroll();
        });
    },

    methods: {
        goBack() {
            this.$router.back();
        },
        async getDeviceAlarmFixedDetail() {
            const data = await this.$service.projectService.getAlarmRecord({
                efairymsg_id: this.msgId
            });
            this.list = data.result.alarmrecord_list;
        },
        previewUploadImg(i) {
            this.imgPrevie = ImagePreview({
                images: this.details.efairyalarmrecordimage_list,
                startPosition: i
            });
        },
        getImgWidthAndHeight(file) {
            const tmp = new Image();
            tmp.src = file.content;
            tmp.onload = () => {
                file.width = tmp.width;
                file.height = tmp.height;
                if (tmp.width > tmp.height) file.isWide = true;
            };
        },
        setupBetterScroll() {
            this.scroll = new BScroll(this.$refs.wrapper, {
                tap: true,
                click: true
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "@/assets/color.scss";


.section{
	margin-bottom: 30px;
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
        padding: 12px 15px;
        border-bottom: 1px solid #eee;
        font-size: 14px;
        color: #333;
        display: flex;
        .avatar-box {
            display: flex;
            width: 40px;
            align-items: center;
            text-align: center;
            .avatar {
                width: 40px;
                background: #fff;
                border-radius: 20px;
                margin: 0 auto;
            }
        }
        .info {
            flex: 1;
            display: flex;
            flex-direction: column;
            p {
                margin: 2px 15px;
            }
            .l1 {
                font-size: 16px;
                color: #333;
            }
            .l2 {
                font-size: 14px;
                color: #999;
            }
        }
    }
    .desc-txt {
        width: 100%;
        background: #fff;
        border: 0;
        margin: 0;
        min-height: 80px;
        word-break: break-all;
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
    }
}
</style>
