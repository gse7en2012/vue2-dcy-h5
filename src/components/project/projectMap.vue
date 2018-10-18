<template>
	<div class="main">
		<!-- <van-nav-bar title="项目列表" left-arrow @click-left="onClickLeft" fixed /> -->
		<van-nav-bar title="项目地图" @click-left="goBack()" fixed left-arrow class="pop-nav-bar" />
		<section class="page-main page-main-full">

			<div id="amap"></div>
			<div class="project-list-box" ref="wrapper">
				<div>
					<!-- <div class="row" v-for="(item,i) in projectList" @click="moveMapCenter(item.efairyproject_location_lng,item.efairyproject_location_lat)"> -->
					<div class="row" v-for="(item,i) in projectList" @click="drawDrivingLine(item)">
						<div class="wrap">
							<div class="icon">
								<img src='@/assets/icons/green.png'>
								<span class="index">{{i+1}}</span>
							</div>
							<div class="ctx">
								<p class="info">
									<span class="title">{{item.efairyproject_name}}</span>
								</p>
								<p class="address">{{item.efairyproject_address}}</p>
							</div>
							<div class="local">
								<img src='@/assets/icons/local.png'>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>

</template>

<script>
import BScroll from "better-scroll";
import bottomTab from "@/components/bottomTab";

import AMap from "AMap";
import AMapUI from "AMapUI";
import marker from "@/assets/icons/marker.png";

import wx from "weixin-js-sdk";

export default {
    name: "projectMap",
    components: {
        bottomTab
    },
    data() {
        return {
            // query: this.$route.query,
            active: 0,
            addressLoading: true,
            showAddressPicker: false,
            value: "",
            projectList: [],
            areaQuery: null,
            mapObj: null,
            mapDriving: null,
            listLoading: false,
            listPage: 1,
            listPagesize: 10,
            listFinished: false
        };
    },
    async mounted() {
        this.areaQuery = this.$store.state.projectAreaSelectedQuery;
        this.getProjectList();
    },
    methods: {
        goBack() {
            this.$router.back();
        },
        setupBetterScroll() {
            if (!this.scroll) {
                this.scroll = new BScroll(this.$refs.wrapper, {
                    tap: true,
                    click: true
                });
                this.scroll.on("scrollEnd", pos => {
                    if (pos.y < this.scroll.maxScrollY + 100) {
                        this.loadMoreProjectList();
                    }
                });
            } else {
                this.scroll.refresh();
            }
        },
        async getProjectList() {
            this.projectList = [];
            const data = await this.$service.projectService.getProjectList({
                regeo_info: this.areaQuery,
                keyword: this.keyword,
                page: this.listPage,
                size: this.listPagesize
            });
            this.projectList = data.result.project_list;
            this.initMap();
            this.drawMapMarker();
            this.initMapLocation();

            this.projectList = data.result.project_list;
            if (data.result.project_list.length < this.listPagesize)
                this.listFinished = true;
            this.$nextTick(() => {
                this.calcHeight =
                    document.querySelector(".main").offsetHeight - 197;
                this.setupBetterScroll();
            });
        },
        async loadMoreProjectList() {
            if (this.listFinished) return;
            this.listLoading = true;
            this.listPage++;
            const data = await this.$service.projectService.getProjectList({
                regeo_info: this.areaQuery,
                keyword: this.keyword,
                page: this.listPage,
                size: this.listPagesize
            });
            this.listLoading = false;
            this.projectList = this.projectList.concat(
                data.result.project_list
            );
            if (data.result.project_list.length < this.listPagesize)
                this.listFinished = true;
            this.$nextTick(() => {
                this.scroll.refresh();
            });
            this.drawMapMarker();
        },

        initMapLocation() {
            this.mapObj.plugin("AMap.Geolocation", () => {
                const geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true, //是否使用高精度定位，默认:true
                    timeout: 10000, //超过10秒后停止定位，默认：无穷大
                    maximumAge: 0, //定位结果缓存0毫秒，默认：0
                    convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                    showButton: true, //显示定位按钮，默认：true
                    buttonPosition: "LB", //定位按钮停靠位置，默认：'LB'，左下角
                    buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                    showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
                    showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
                    panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
                    zoomToAccuracy: false //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                });
                this.mapObj.addControl(geolocation);
                geolocation.getCurrentPosition();
                // AMap.event.addListener(geolocation, "complete", onComplete); //返回定位信息
                // AMap.event.addListener(geolocation, "error", onError); //返回定位出错信息
            });
        },
        initMap() {
            this.mapObj = new AMap.Map("amap", {
                center: [113.000923, 23.575807],
                zoom: 10,
                mapStyle: "amap://styles/fresh"
            });
        },
        drawDrivingLine(item) {
            wx.openLocation({
                latitude: item.efairyproject_location_lat, // 纬度，浮点数，范围为90 ~ -90
                longitude: item.efairyproject_location_lng, // 经度，浮点数，范围为180 ~ -180。
                name: item.efairyproject_name, // 位置名
                address: item.efairyproject_address, // 地址详情说明
                scale: 12, // 地图缩放级别,整形值,范围从1~28。默认为最大
                infoUrl: "" // 在查看位置界面底部显示的超链接,可点击跳转
			});
			return;

        },
        drawMapMarker() {
            this.mapObj.clearMap();
            this.projectList.forEach((item, i) => {
                const mapIcon = new AMap.Icon({
                    size: new AMap.Size(30, 38),
                    imageSize: new AMap.Size(30, 38),
                    imageOffset: new AMap.Pixel(0, 0),
                    image:
                        "https://efairyqiniu.tokabu.com/743864906145567952.png" // 添加 Icon 图标 URL
                });

                const marker = new AMap.Marker({
                    position: new AMap.LngLat(
                        item.efairyproject_location_lng,
                        item.efairyproject_location_lat
                    ),
                    offset: new AMap.Pixel(-30, -38),
                    icon: mapIcon
                });
                const text = new AMap.Text({
                    text: i + 1,
                    textAlign: "center",
                    verticalAlign: "middle",
                    offset: new AMap.Pixel(-15, -24),
                    position: new AMap.LngLat(
                        item.efairyproject_location_lng,
                        item.efairyproject_location_lat
                    ),
                    style: {
                        background: "transparent",
                        border: "0",
                        color: "#fff",
                        padding: "0",
                        "font-size": "12px"
                    }
                    // offset: new AMap.Pixel(-10, -10)
                });
                this.mapObj.add(marker);
                this.mapObj.add(text);
                if (i == 0) {
                    this.mapObj.setCenter(
                        new AMap.LngLat(
                            item.efairyproject_location_lng,
                            item.efairyproject_location_lat
                        )
                    );
                }
            });
        },
        moveMapCenter(lng, lat) {
            this.mapObj.panTo(new AMap.LngLat(lng, lat));
        }
    }
};
</script>

<style lang="scss" scoped>
#amap {
    position: absolute;
    width: 100%;
    // height:100%;
    left: 0;
    top: 0;
    bottom: 49%;
}
.project-list-box {
    // overflow-y: auto;
    overflow: hidden;
    position: absolute;
    bottom: 0;
    top: 50%;
    width: 100%;
    z-index: 10;
    background: #fff;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    box-shadow: 0px -1px 12px #eaeaea;
    .row {
        display: flex;
        border-bottom: 1px solid #f5f5f5;
        .wrap {
            flex: 1;
            background: #fff;
            display: flex;
            transition: all 0.3s ease-in-out;
            padding: 4px 8px;
            .icon {
                width: 44px;
                position: relative;
                text-align: center;
                img {
                    width: 20px;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
                span {
                    position: absolute;
                    color: #fff;
                    font-size: 12px;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    width: 20px;
                    height: 25px;
                    line-height: 20px;
                }
            }
            .local {
                width: 44px;
                position: relative;
                text-align: center;
                img {
                    width: 30px;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
            }
            .ctx {
                flex: 2;
                // margin-right: 10px;
                .nums {
                    line-height: 22px;
                    &-p {
                        width: 12px;
                        margin-left: 3px;
                        position: relative;
                        top: 1px;
                    }
                }
                .map-s {
                    width: 12px;
                    opacity: 0.5;
                    position: relative;
                    top: 3px;
                    margin-right: 6px;
                }
                p {
                    margin: 6px auto;
                    font-size: 13px;
                    color: #666;
                    overflow: hidden;
                    display: flex;
                    label {
                        flex: 1;
                        span {
                            font-weight: 300;
                        }
                    }
                }
                .info {
                    font-weight: normal;
                    display: flex;
                    margin: 10px 0 5px;
                    .title {
                        font-size: 15px;
                        color: #333;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 1;
                        -webkit-box-orient: vertical;
                        margin-right: 5px;
                        line-height: 22px;
                        flex: 1;
                    }
                    .date {
                        font-size: 12px;
                        color: #666;
                        word-break: keep-all;
                        white-space: nowrap;
                        line-height: 22px;
                    }
                }
                .address {
                    margin: 0 0 10px;
                    font-size: 12px;
                    color: #666;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                }
            }
        }
    }
}
</style>
