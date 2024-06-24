<template>
    <div class="layout" :style="{ marginLeft: sidebarWidth, width: 100 % -  sidebarWidth }">
        <div class="header">
            <!-- <div class="manual-status">
                <button @click="toggleDropdown" class="manual-status-button"><i
                        :class="getStatusIcon(currentManualStatus)"></i>{{
                            currentManualStatus }}</button>
                <ul v-if="isDropdownOpen" class="manual-status-menu">
                    <li v-for="status in manualStatuses" :key="status.value" class="manual-status-item"
                        @click="changeStatus(status)">
                        <i :class="status.icon"></i>
                        {{ status.label }}
                    </li>
                </ul>
            </div> -->
            <div class="softphone-btn" @click="showOrHideSoftPhone" id="softPhoneBtn">
                <i class="bx bx-phone"></i>
            </div>
            <div class="stringee-iframe-btn" @click="showStringeeIframe">
                <i class="bx bxs-window-alt"></i>
            </div>
        </div>
        <div class="body">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import { sidebarWidth } from "../sidebar/state.js";
import { stringeeApi } from "../../api/api.js";

export default {
    name: "LayoutComponent",
    data() {
        return {
            StringeeSoftPhone: window.StringeeSoftPhone,
            SoftphoneConfig: {
                appendToElement: "softPhoneBtn",
                showMode: "none",
                top: 53,
                arrowLeft: 136,
                arrowDisplay: "top",
                makeAndReceiveCallInNewPopupWindow: false,
                lang: "en",
                fromNumbers: [],
                enableVideoCall: true,
                iframeVideoCallSize: {
                    width: 550,
                    height: 600
                }
            },
            numberList: [],
            userData: JSON.parse(localStorage.getItem("userData")),
            sidebarWidth,
            title: "[Softphone SDK] ",
            isVideoCall: false
            // currentManualStatus: "",
            // isDropdownOpen: false,
            // manualStatuses: [
            //     { value: "AVAILABLE", label: "AVAILABLE", icon: "bx bxs-sun" },
            //     { value: "LUNCH BREAK", label: "LUNCH BREAK", icon: "bx bxs-bowl-hot" },
            //     { value: "SHORT BREAK", label: "SHORT BREAK", icon: "bx bxs-coffee" },
            //     { value: "NOT AVAILABLE", label: "NOT AVAILABLE", icon: "bx bxs-moon" }
            // ]
        }
    },
    methods: {
        showStringeeIframe() {
            this.$router.push({ name: "StringeeIframe" });
        },
        settingClientEvents() {
            this.StringeeSoftPhone.on("authen", async res => {
                try {
                    console.log(this.title + "Authen: ", res);
                    const getNumberListResponse = await stringeeApi.getNumberList();
                    if (getNumberListResponse.data.numbers.length > 0) {
                        this.numberList = [];
                        getNumberListResponse.data.numbers.forEach(number => {
                            let numberObj = {
                                number: number.number,
                                alias: number.nickname
                            };
                            this.numberList.push(numberObj);
                        });
                    } else throw console.error("Please setup a number in https://pcc.stringee.com/setting/number");
                    const getAgentDataResponse = await stringeeApi.getAgent(this.userData.stringee_userid);
                    await this.StringeeSoftPhone.config({ fromNumbers: this.numberList, routingType: getAgentDataResponse.data.routing_type });
                    // this.currentManualStatus = await getAgentDataResponse.data.manual_status;
                } catch (err) {
                    return console.error(err);
                }
            });

            this.StringeeSoftPhone.on("disconnect", () => {
                console.log("Disconnected");
            });

            this.StringeeSoftPhone.on("requestNewToken", async () => {
                console.log(this.title + "Token expire, re-connect...");
                await this.StringeeSoftPhone.disconnect();
                const stringeeToken = await stringeeApi.getPccClientOken(this.userData.stringee_userid);
                await this.StringeeSoftPhone.connect(stringeeToken);
            });

            this.StringeeSoftPhone.on("beforeMakeCall", (call, callType) => {
                console.log(this.title + "Before make call: ", call, callType);
                return true;
            });

            this.StringeeSoftPhone.on("makeOutgoingCallResult", call => {
                console.log(this.title + "Make outgoing call result:", call);
            });

            this.StringeeSoftPhone.on("signalingstate", state => {
                if (state.code === 6 || state.code === 5) {
                    this.StringeeSoftPhone.config({ arrowLeft: 136 });
                }
            });

            this.StringeeSoftPhone.on("incomingCall", incomingCall => {
                console.log(this.title + "Incoming call: ", incomingCall);
            });

            this.StringeeSoftPhone.on("incomingCall2", incomingCall2 => {
                console.log(this.title + "Incoming call 2: ", incomingCall2);
                this.isVideoCall = incomingCall2.isVideoCall;
            });

            this.StringeeSoftPhone.on("mediastate", state => {
                console.log(this.title + "Media state:", state);
            });

            this.StringeeSoftPhone.on("addlocalstream", stream => {
                console.log(this.title + "Add local stream:", stream);
            });

            this.StringeeSoftPhone.on("addlocaltrack", track => {
                console.log(this.title + "Add local track:", track);
            });

            this.StringeeSoftPhone.on("addremotetrack", track => {
                console.log(this.title + "Add remote track:", track);
            });

            this.StringeeSoftPhone.on("displayModeChange", mode => {
                console.log(this.title + "Display mode change:", mode);
                switch (mode) {
                    case "full":
                        this.StringeeSoftPhone.config({ arrowLeft: 136 });
                        break;
                    case "min":
                        this.StringeeSoftPhone.config({ arrowLeft: 95 });
                        break;
                    default:
                        break;
                }
            });

            this.StringeeSoftPhone.on("setRoutingType", async type => {
                try {
                    const response = await stringeeApi.updateAgent(this.userData.stringee_userid, { routing_type: type });
                    console.log(this.title + "Update routing type:", response);
                } catch (err) {
                    console.error(err);
                }
            });

            this.StringeeSoftPhone.on("setAutoPickCall false", () => {
                console.log(this.title + "Auto pick call: false");
            });

            this.StringeeSoftPhone.on("setAutoPickCall true", () => {
                console.log(this.title + "Auto pick call: true");
            });

            this.StringeeSoftPhone.on("activityBtnClicked", () => {
                console.log(this.title + "Activity button clicked");
            });

            this.StringeeSoftPhone.on("messageFromTopic", message => {
                console.log(message);
            });

            this.StringeeSoftPhone.on("messagefromtopic", () => { });

            this.StringeeSoftPhone.on("makeOutgoingCallBtnClick", (fromNumber, toNumber, callType) => {
                console.log(this.title + "Make outgoing call button click: fromNumber=" + fromNumber + "| toNumber=" + toNumber + "| callType=" + callType);
            });

            this.StringeeSoftPhone.on("answerIncomingCallBtnClick", () => {
                console.log(this.title + "Answer incoming call button click");
                if (this.isVideoCall) this.StringeeSoftPhone.config({ arrowLeft: 267 });
                else this.StringeeSoftPhone.config({ arrowLeft: 136 });
            });

            this.StringeeSoftPhone.on("declineIncomingCallBtnClick", () => {
                console.log(this.title + "Deline incoming call button click");
            });

            this.StringeeSoftPhone.on("endCallBtnClick", () => {
                console.log(this.title + "End call button click");
                this.StringeeSoftPhone.config({ arrowLeft: 136 });
            });

            this.StringeeSoftPhone.on("incomingScreenHide", () => {
                console.log(this.title + "Incoming screen hide");
            });
        },
        showOrHideSoftPhone() {
            if (this.StringeeSoftPhone.showMode === "full") this.StringeeSoftPhone.config({ showMode: "none" });
            else this.StringeeSoftPhone.config({ showMode: "full" });
        },
        // getStatusIcon(status) {
        //     switch (status) {
        //         case "AVAILABLE":
        //             return "bx bxs-sun";
        //         case "LUNCH BREAK":
        //             return "bx bxs-bowl-hot";
        //         case "SHORT BREAK":
        //             return "bx bxs-coffee";
        //         case "NOT AVAILABLE":
        //             return "bx bxs-moon";
        //     }
        // },
        // toggleDropdown() {
        //     this.isDropdownOpen = !this.isDropdownOpen.value;
        // },
        // async changeStatus(status) {
        //     try {
        //         this.isDropdownOpen = false;
        //         const updateManualStatusResponse = await stringeeApi.updateAgent(this.userData.stringee_userid, { manual_status: status.value });
        //         console.log("Update manual status: ", updateManualStatusResponse);
        //         this.currentManualStatus = status.label;
        //     } catch (err) {
        //         console.error(err);
        //     }
        // }
    },
    async mounted() {
        try {
            if (this.StringeeSoftPhone) {
                this.StringeeSoftPhone.init(this.SoftphoneConfig);
                this.settingClientEvents();
            } else {
                throw "StringeeSoftPhone is not loaded";
            }
            if (!this.userData.stringee_userid) {
                throw "Stringee userId is not configured for " + this.userData.email;
            }
            if (!this.StringeeSoftPhone.connected) {
                const stringeeToken = await stringeeApi.getPccClientOken(this.userData.stringee_userid);
                await this.StringeeSoftPhone.connect(stringeeToken);
            }
        } catch (err) {
            console.error(err);
        }
    }
};
</script>

<style>
.layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    transition: .3s ease;
}

.header {
    color: white;
    height: 50px;
    backdrop-filter: blur(30px);
    border-bottom: 2px solid rgba(255, 255, 255, .1);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    transition: .3s ease;
    z-index: 10;
}

.body {
    max-height: 85vh;
    padding: 20px;
}

.softphone-btn {
    width: 40px;
    height: 40px;
    background: #008a00;
    display: flex;
    justify-content: center;
    align-items: center;
    color: aliceblue;
    font-size: 30px;
    border-radius: 5px;
    cursor: pointer;
}

.stringee-iframe-btn {
    margin-left: 10px;
    width: 40px;
    height: 40px;
    background: #0b62da;
    display: flex;
    justify-content: center;
    align-items: center;
    color: aliceblue;
    font-size: 30px;
    border-radius: 5px;
    cursor: pointer;
}

/* .manual-status {
    position: relative;
    display: inline-block;
    margin-right: 10px;
    color: black;
}

.manual-status-button {
    cursor: pointer;
    font-size: 20px;
    width: 200px;
    height: 35px;
    border-radius: 10px;
    background: white;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
}

.manual-status-button i {
    margin-right: 10px;
}

.manual-status-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background-color: wheat;
    border: 1px solid #ccc;
    width: 100%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
}

.manual-status-item {
    display: flex;
    align-items: center;
    padding: 10px;
    cursor: pointer;
    font-size: 20px;
}

.manual-status-item i {
    margin-right: 10px;
}

.manual-status-item:hover {
    background-color: #f0f0f0;
} */
</style>
