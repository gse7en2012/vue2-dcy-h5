<template>
	<div class="main">
		<form action="/" class="search-box">
			<van-search v-model="keyword" placeholder="请输入项目名称" @search="getProjectList" background="#fff" />
		</form>
		<div class="edit-bar">
			<!-- <div class="edit-bar-span" @click="editMessage()">
				<img src="@/assets/icons/edit.png">{{edit?'取消':'选择'}}
			</div> -->
			<van-cell-group>
				<van-cell :value='"选择地区："+areaQueryText' is-link @click="popupAddress()" />
			</van-cell-group>
		</div>
		<div class="wrapper" ref="wrapper">
			<div class="project-list">
				<div class="row" v-for="(item,i) in projectList" @click="chooseMsg(item,i)">
					<div class="ctrl" :class="{show:edit}">
						<div class="radio" :class="{chose:item.choose}"></div>
					</div>
					<div class="wrap">
						<!-- <div class="icon" :class="{unread:item.unread}">
							<img src='@/assets/icons/device_msg.png'>
						</div> -->
						<div class="ctx">
							<p class="info">
								<span class="title">{{item.efairyproject_name}}</span>
								<span class="nums">{{item.efairyproject_total_users}}<img src="@/assets/icons/nums.png" class="nums-p"></span>
							</p>
							<p class="msg">设备数 {{item.efairyproject_total_devices}}</p>
						</div>
					</div>
				</div>
			</div>
			<div class="edit-button-box" :class="{show:edit}">
				<div class="dcy-radio" @click="chooseAll()">
					<div class="radio" :class="{chose:chooseAllFlag}"></div>全选 （选中{{choseCount}}条）
				</div>
				<a class="dcy-btn" @click="showPop()">下一步</a>
			</div>
		</div>
		<van-popup v-model="popShow" position="right" :overlay="false" class="report-popup">
			<report-popup v-on:close-popup="closePop" v-bind:project-list="tmp" />
		</van-popup>

		<van-popup v-model="showAddressPicker" @click-overlay="popupAddress()" position="bottom">
			<van-picker :columns="columns" @change="onChange" :loading="addressLoading" :item-height="40" show-toolbar title="选择地区" @cancel="onCancel" @confirm="onConfirm" />
		</van-popup>
	</div>
</template>

<script>
import { Dialog } from "vant";
import BScroll from "better-scroll";
import reportPopup from "./reportPopup";

export default {
    name: "messageIndex",
    components: {
        reportPopup
    },
    data() {
        return {
            // query: this.$route.query,
            active: 0,
            projectList: [],
            edit: true,
            chooseAllFlag: false,
            popShow: false,
            tmp: [],
            choseCount: 0,

            addressLoading: false,
            areaList: [],
            areaQuery: {},
            areaQueryText: "正在读取...",
            columns: [],
            showAddressPicker: false,

            listLoading: false,
            listPage: 1,
            listPagesize: 10,
            listFinished: false,
            keyword: "",
            areaPlaceholder: "请选择",
            lastId: 0
        };
    },
    async mounted() {
        await this.getAreaList();
        await this.getProjectList();

        this.$nextTick(() => {
            this.setupBetterScroll();
        });
    },

    methods: {
        async getAreaList() {
            const data = await this.$service.reportService.getAreaList();
            const provinceList = data.result.province_list;
            this.areaList = provinceList;
            this.initAreaList(provinceList);
        },
        async loadMoreProjectList() {
            if (this.listFinished) return this.$toast("没有更多了");
            this.listPage++;
            const data = await this.$service.reportService.getProjectList({
                regeo_info: this.areaQuery,
                keyword: this.keyword,
                page: this.listPage,
                size: this.listPagesize,
                page: this.listPage
            });
            const list = data.result.project_list;

            if (list.length < this.listPagesize) {
                this.listFinished = true;
            }
            if (list.length == 0) return;
            this.projectList = this.projectList.concat(list);
            this.listPage++;
            if (this.chooseAllFlag) {
                this.projectList.forEach(item => {
                    item.choose = true;
                });
                this.choseCount = this.projectList.filter(
                    msg => msg.choose
                ).length;
            }

            if (this.scroll) {
                this.scroll.finishPullUp();
                setTimeout(() => {
                    this.scroll.refresh();
                }, 0);
            }
        },
        async getProjectList() {
            this.projectList = [];
            this.listPage = 1;
            this.listFinished = false;
            if (this.scroll) this.scroll.finishPullUp();
            const data = await this.$service.reportService.getProjectList({
                regeo_info: this.areaQuery,
                keyword: this.keyword,
                page: this.listPage,
                size: this.listPagesize,
                page: this.listPage
            });
            const list = data.result.project_list;

            if (list.length < this.listPagesize) {
                this.listFinished = true;
            }
            if (list.length == 0) return;
            this.projectList = this.projectList.concat(list);
        },
        initAreaList(data) {
            this.columns = [];
            this.columns[0] = {
                values: data.map(province => province.efairyprovince_name),
                className: "province"
            };
            this.columns[1] = {
                values: [this.areaPlaceholder].concat(
                    data[0]["city_list"].map(city => city.efairycity_name)
                ),
                className: "city"
            };
            this.columns[2] = {
                vaules: ["--"],
                className: "district"
            };
            this.columns[3] = {
                vaules: ["--"],
                className: "town"
            };

            this.areaQuery = {
                efairyprovince_id: data[0].efairyprovince_id
            };
            this.areaQueryText = [data[0].efairyprovince_name].join("");

            this.$store.dispatch("setProjectAreaSelectedQuery", this.areaQuery);
        },
        onCancel() {
            this.showAddressPicker = false;
        },
        onConfirm(values, indexs) {
            const provinceId = this.areaList[indexs[0]].efairyprovince_id;
            let cityId, districtId, townId;
            if (values[1] != this.areaPlaceholder) {
                cityId = this.areaList[indexs[0]]["city_list"][indexs[1] - 1]
                    .efairycity_id;
                if (values[2] != this.areaPlaceholder) {
                    districtId = this.areaList[indexs[0]]["city_list"][
                        indexs[1] - 1
                    ]["district_list"][indexs[2] - 1].efairydistrict_id;
                    if (values[3] != this.areaPlaceholder) {
                        townId = this.areaList[indexs[0]]["city_list"][
                            indexs[1] - 1
                        ]["district_list"][indexs[2] - 1]["township_list"][
                            indexs[3] - 1
                        ].efairytownship_id;
                    }
                }
            }

            this.areaQueryText = values
                .map(item => {
                    if (item != this.areaPlaceholder) return item;
                })
                .join("");
            this.areaQuery = {
                efairyprovince_id: provinceId,
                efairycity_id: cityId,
                efairydistrict_id: districtId,
                efairytownship_id: townId
            };
            this.getProjectList();
            this.$store.dispatch("setProjectAreaSelectedQuery", this.areaQuery);
            this.showAddressPicker = false;
        },
        onChange(picker, values, index) {
			this.chooseAllFlag = false;
			this.choseCount=0;
            let currentProvinceIndex, currentCityIndex, currentDistrictIndex;
            if (index == 0) {
                currentProvinceIndex = this.areaList.findIndex(
                    item => item.efairyprovince_name == values[0]
                );
                const cityList = [this.areaPlaceholder].concat(
                    this.areaList[currentProvinceIndex]["city_list"].map(
                        city => city.efairycity_name
                    )
                );
                picker.setColumnValues(1, cityList);
                picker.setColumnValues(2, [this.areaPlaceholder]);
                picker.setColumnValues(3, [this.areaPlaceholder]);
            }
            if (index == 1) {
                if (values[1] == this.areaPlaceholder) {
                    picker.setColumnValues(2, [this.areaPlaceholder]);
                    picker.setColumnValues(3, [this.areaPlaceholder]);
                } else {
                    currentProvinceIndex = this.areaList.findIndex(
                        item => item.efairyprovince_name == values[0]
                    );
                    currentCityIndex = this.areaList[currentProvinceIndex][
                        "city_list"
                    ].findIndex(item => item.efairycity_name == values[1]);
                    const districtList = [this.areaPlaceholder].concat(
                        this.areaList[currentProvinceIndex]["city_list"][
                            currentCityIndex
                        ]["district_list"].map(
                            district => district.efairydistrict_name
                        )
                    );
                    picker.setColumnValues(2, districtList);
                    picker.setColumnValues(3, [this.areaPlaceholder]);
                }
            }
            if (index == 2) {
                if (values[2] == this.areaPlaceholder) {
                    picker.setColumnValues(3, [this.areaPlaceholder]);
                } else {
                    currentProvinceIndex = this.areaList.findIndex(
                        item => item.efairyprovince_name == values[0]
                    );
                    currentCityIndex = this.areaList[currentProvinceIndex][
                        "city_list"
                    ].findIndex(item => item.efairycity_name == values[1]);
                    currentDistrictIndex = this.areaList[currentProvinceIndex][
                        "city_list"
                    ][currentCityIndex]["district_list"].findIndex(
                        item => item.efairydistrict_name == values[2]
                    );
                    const townList = [this.areaPlaceholder].concat(
                        this.areaList[currentProvinceIndex]["city_list"][
                            currentCityIndex
                        ]["district_list"][currentDistrictIndex][
                            "township_list"
                        ].map(town => town.efairytownship_name)
                    );
                    picker.setColumnValues(3, townList);
                }
            }
        },
        setupBetterScroll() {
            if (!this.scroll) {
                this.scroll = new BScroll(this.$refs.wrapper, {
                    tap: true,
                    click: true,
                    pullUpLoad: {
                        threshold: 0,
                        stop: 0
                    }
                });
                this.scroll.on("pullingUp", pos => {
                    this.loadMoreProjectList();
                });
            } else {
                this.scroll.refresh();
            }
        },
        popupAddress() {
            this.showAddressPicker = !this.showAddressPicker;
            setTimeout(() => {
                this.addressLoading = false;
            }, 1000);
        },
        showPop() {
            this.popShow = true;
            this.$emit("hideBotBar");
            this.tmp = this.projectList.filter(item => item.choose);
        },
        closePop() {
            this.popShow = false;
            this.$emit("showBotBar");
        },
        editMessage() {
            this.edit = !this.edit;
        },
        chooseMsg(item, indexOfItem) {
            if (!this.edit) return;
            this.$set(item, "choose", !item.choose);
            this.choseCount = this.projectList.filter(msg => msg.choose).length;
        },
        alertMsg(title, msg, type) {
            Dialog.confirm({
                title: title,
                message: msg
            })
                .then(() => {
                    // on confirm
                    console.log(this.projectList.filter(item => item.choose));
                    if (type == 1) {
                    }
                })
                .catch(() => {
                    // on cancel
                });
        },
        chooseAll() {
            this.chooseAllFlag = !this.chooseAllFlag;
            this.projectList.forEach(msg => {
                msg.choose = this.chooseAllFlag;
            });
            this.choseCount = this.projectList.filter(msg => msg.choose).length;
        }
    }
};
</script>

<style lang="scss" scoped>
$dcyColor: #282549;

.report-popup {
    width: 100%;
    height: 100%;
    background: #eef0f3;
}

.dcy-btn {
    float: right;
    line-height: 32px;
    font-size: 15px;
    color: #fff;
    background: $dcyColor;
    text-align: center;
    min-width: 74px;
    margin: 9px;
    border-radius: 32px;
    font-weight: 300;
}

.dcy-radio {
    float: left;
    color: #3a3a3a;
    font-size: 12px;
    padding: 8px 12px;
    .radio {
        margin: auto;
        width: 20px;
        height: 20px;
        border-radius: 20px;
        border: 1px solid #364760;
        opacity: 0.2;
        position: relative;
        top: 7px;
        margin-right: 10px;
        display: inline-block;
        &.chose {
            opacity: 1;
            border-color: $dcyColor;
            &:before {
                content: "";
                position: absolute;
                width: 80%;
                height: 80%;
                top: 10%;
                left: 10%;
                background: $dcyColor;
                border-radius: 50%;
                z-index: 2;
            }
        }
    }
}

.edit-button-box {
    position: absolute;
    z-index: 99;
    bottom: 0;
    background: #fff;
    width: 100%;
    box-shadow: 0px -1px 1px #efefef;
    height: 0;
    opacity: 0;
    transition: all 0.15s ease-in-out;
    overflow: hidden;
    &.show {
        height: 50px;
        opacity: 1;
    }
}

.wrapper {
    position: fixed;
    top: 170px;
    width: 100%;
    bottom: 55px;
    overflow: hidden;
}

.nobar {
    .wrapper {
        top: 88px;
    }
}

.project-list {
    // margin-top: 88px;
    padding-bottom: 55px;
    overflow: hidden;
    .row {
        display: flex;
        margin: 8px;
        .ctrl {
            align-items: center;
            display: flex;
            overflow: hidden;
            width: 0;
            opacity: 0;
            transition: width 0.15s ease-in-out;
            &.show {
                width: 30px;
                margin-right: 8px;
                opacity: 1;
            }
            .radio {
                margin: auto;
                width: 20px;
                height: 20px;
                border-radius: 20px;
                border: 1px solid #364760;
                position: relative;
                display: inline-block;

                &.chose {
                    &:before {
                        content: "";
                        position: absolute;
                        width: 80%;
                        height: 80%;
                        top: 10%;
                        left: 10%;
                        background: $dcyColor;
                        border-radius: 50%;
                        z-index: 2;
                    }
                }
            }
        }
        .wrap {
            flex: 1;
            background: #fff;
            border-radius: 4px;
            display: flex;
            transition: all 0.3s ease-in-out;
            .icon {
                width: 60px;
                align-items: center;
                display: flex;
                text-align: center;
                position: relative;
                &.unread {
                    &::before {
                        position: absolute;
                        width: 8px;
                        height: 8px;
                        background: #ff2c2c;
                        border-radius: 8px;
                        right: 15px;
                        top: 15px;
                        content: "";
                    }
                }
                img {
                    margin: auto;
                    width: 36px;
                }
            }
            .ctx {
                flex: 2;
                margin: 0 12px;
                .nums {
                    line-height: 22px;
                    &-p {
                        width: 12px;
                        margin-left: 3px;
                        position: relative;
                        top: 1px;
                    }
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
                        font-size: 16px;
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
                .msg {
                    margin: 0 0 10px;
                    font-size: 13px;
                    color: #666;
                    overflow: hidden;
                }
            }
        }
    }
}

.edit-bar {
    height: 35px;
    background: #fff;
    position: absolute;
    width: 100%;
    top: 88px;
    z-index: 99;
    &-span {
        font-size: 12px;
        color: $dcyColor;
        float: right;
        line-height: 35px;
        margin-right: 8px;
        img {
            height: 12px;
            margin-right: 4px;
        }
    }
}
</style>
