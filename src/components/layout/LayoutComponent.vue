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
        </div>
        <div class="body">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
import { sidebarWidth } from "../sidebar/state.js";
import { stringeeApi } from "../../api/api.js";
import { onMounted } from "vue";

// const isDropdownOpen = ref(false);
// const currentManualStatus = ref();
// const manualStatuses = ref([
//     { value: "AVAILABLE", label: "AVAILABLE", icon: "bx bxs-sun" },
//     { value: "LUNCH BREAK", label: "LUNCH BREAK", icon: "bx bxs-bowl-hot" },
//     { value: "SHORT BREAK", label: "SHORT BREAK", icon: "bx bxs-coffee" },
//     { value: "NOT AVAILABLE", label: "NOT AVAILABLE", icon: "bx bxs-moon" }
// ]);

let StringeeSoftPhone;
let numberList;
let stringeeUserId;
const userData = JSON.parse(localStorage.getItem("userData"));
const config = {
    appendToElement: "softPhoneBtn",
    showMode: "none",
    top: 53,
    arrowLeft: 137,
    arrowDisplay: "top",
    makeAndReceiveCallInNewPopupWindow: false,
    lang: "en",
    fromNumbers: []
};

const showOrHideSoftPhone = () => {
    if (StringeeSoftPhone.showMode === "full") StringeeSoftPhone.config({ showMode: "none" });
    else StringeeSoftPhone.config({ showMode: "full" });
}
onMounted(async () => {
    try {
        if (window.StringeeSoftPhone) {
            StringeeSoftPhone = window.StringeeSoftPhone;
            StringeeSoftPhone.init(config);
            settingClientEvents();
        } else {
            throw "StringeeSoftPhone is not loaded";
        }
        if (!userData.stringee_userid) {
            throw "Stringee userId is not configured for " + userData.email;
        } else {
            stringeeUserId = userData.stringee_userid;
        }
        if (!StringeeSoftPhone.connected) {
            const stringeeToken = await stringeeApi.getPccClientOken(userData.stringee_userid);
            await StringeeSoftPhone.connect(stringeeToken);
        }
    } catch (err) {
        console.error(err);
    }
});

function settingClientEvents() {
    StringeeSoftPhone.on("authen", async (res) => {
        try {
            console.log("Authen: ", res);
            const getNumberListResponse = await stringeeApi.getNumberList();
            if (getNumberListResponse.data.numbers.length > 0) {
                numberList = [];
                getNumberListResponse.data.numbers.forEach(number => {
                    let numberObj = {
                        number: number.number,
                        alias: number.nickname
                    };
                    numberList.push(numberObj);
                });
            } else throw console.error("Please setup a number in https://pcc.stringee.com/setting/number");
            const getAgentDataResponse = await stringeeApi.getAgent(stringeeUserId);
            await StringeeSoftPhone.config({ fromNumbers: numberList, routingType: getAgentDataResponse.data.routing_type });
        } catch (err) {
            return console.error(err);
        }
    });

    StringeeSoftPhone.on("requestNewToken", async () => {
        await StringeeSoftPhone.disconnect();
        const stringeeToken = await stringeeApi.getPccClientOken(userData.stringee_userid);
        await StringeeSoftPhone.connect(stringeeToken);
    });

    StringeeSoftPhone.on("addlocalstream", function (stream) { console.log("Add local stream:", stream) });

    StringeeSoftPhone.on("mediastate", function (state) { console.log("Media state:", state) });

    StringeeSoftPhone.on("displayModeChange", mode => {
        switch (mode) {
            case "full":
                StringeeSoftPhone.config({ arrowLeft: 136 });
                break;
            case "min":
                StringeeSoftPhone.config({ arrowLeft: 95 });
                break;
            default:
                break;
        }
    });

    StringeeSoftPhone.on("setRoutingType", async type => {
        try {
            const response = await stringeeApi.updateAgent(stringeeUserId, { routing_type: type });
            console.log("Update routing type:", response);
        } catch (err) {
            console.error(err);
        }
    });

    StringeeSoftPhone.on("setAutoPickCall false", () => {
        console.log("Auto pick call: false");
    });

    StringeeSoftPhone.on("setAutoPickCall true", () => {
        console.log("Auto pick call: true");
    });

    StringeeSoftPhone.on("activityBtnClicked", () => {
        console.log("Activity button clicked");
    });

    StringeeSoftPhone.on("messageFromTopic", (message) => {
        console.log(message);
    });

    StringeeSoftPhone.on("messagefromtopic", () => { });

    StringeeSoftPhone.on("disconnect", () => {
        console.log("Disconnected");
    });
}

// const getStatusIcon = (status) => {
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
// };

// const toggleDropdown = () => {
//     isDropdownOpen.value = !isDropdownOpen.value;
// };

// const changeStatus = async status => {
//     try {
//         isDropdownOpen.value = false;
//         const updateManualStatusResponse = await stringeeApi.updateAgent(stringeeUserId, { manual_status: status.value });
//         console.log("Update manual status: ", updateManualStatusResponse);
//         currentManualStatus.value = status.label;
//         localStorage.setItem("manual_status", status.label);
//     } catch (err) {
//         console.error(err);
//     }
// };

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
