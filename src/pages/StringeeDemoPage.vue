<template>
    <div class="background">
        <LayoutComponent>
            <div class="videocall-area row-area">
                <div class="method-area column-area">
                    <p :class="isConnectedStringee ? 'connect-client' : 'not-connect-client'">{{ connectedUserId }}</p>
                    <input class="callee-input" v-model="calleeUserId" type="text" placeholder="Enter callee's userId"
                        v-if="isConnectedStringee">
                    <div class="row-area" v-if="!popupIncomingCall">
                        <button class="row-area btn" :class="inCall ? 'hangup-btn' : 'makecall-btn'"
                            @click="makeCallOrHangup" v-if="isConnectedStringee">
                            <i :class="inCall ? 'bx bxs-video-off' : 'bx bxs-video'"></i>
                        </button>
                        <button class="row-area btn" :class="StringeeCall2?.muted ? 'mute-btn' : 'unmute-btn'"
                            @click="mute" v-if="isConnectedStringee" :disabled="!inCall">
                            <i :class="StringeeCall2?.muted ? 'bx bxs-microphone-off' : 'bx bxs-microphone'"></i>
                        </button>
                        <button class="row-area btn"
                            :class="StringeeCall2?.localVideoEnabled ? 'enable-camera-btn' : 'disable-camera-btn'"
                            @click="toggleCamera" v-if="isConnectedStringee" :disabled="!inCall">
                            <i :class="StringeeCall2?.localVideoEnabled ? 'bx bxs-camera' : 'bx bxs-camera-off'"></i>
                        </button>
                    </div>
                    <div class="row-area" v-if="popupIncomingCall">
                        <button class="row-area btn makecall-btn" @click="answerCall">
                            <i class="bx bxs-video"></i>
                        </button>
                        <button class="row-area btn hangup-btn" @click="rejectCall">
                            <i class="bx bxs-video-off"></i>
                        </button>
                    </div>
                    <div class="column-area call-info" v-if="isConnectedStringee">
                        <p>Call ID: {{ callId }}</p>
                        <p>Call status: {{ callStatus }}</p>
                        <p>Call type: {{ callType }}</p>
                    </div>
                </div>
                <div class="remote-video" id="remoteVideo">
                    <div class="local-video" v-if="inCall" id="localVideo"></div>
                </div>
            </div>
        </LayoutComponent>
    </div>
</template>

<script>
import LayoutComponent from "../components/layout/LayoutComponent.vue";
import { TOAST_CONFIG, ERROR_DESC } from "../utils/constant.js";
import { useToast } from "vue-toastification";
import { stringeeApi } from "../api/api.js";
export default {
    name: "StringeeDemoPage",
    components: {
        LayoutComponent
    },
    setup() {
        const toast = useToast();
        return { toast };
    },
    data() {
        return {
            title: "[Stringee SDK] ",
            isAuthenticated: false,
            isConnectedStringee: false,
            connectedUserId: "Not connected",
            StringeeClient: new window.StringeeClient(),
            userData: JSON.parse(localStorage.getItem("userData")),
            inCall: false,
            StringeeCall2: null,
            stringeeUserId: "",
            calleeUserId: "",
            callId: "",
            callStatus: "",
            popupIncomingCall: false,
            callType: ""
        }
    },
    created() {
        this.isAuthenticated = localStorage.getItem("isAuthenticated");
        if (!this.isAuthenticated) {
            this.$router.push({ name: "LoginPage" });
        }
    },
    methods: {
        settingClientEvents(client) {
            client.on("authen", res => {
                console.log(this.title + "Authen: ", res);
                if (res.r === 0) {
                    this.connectedUserId = res.userId + " is connecting...";
                    this.isConnectedStringee = true;
                } else {
                    this.toast.error(res.message, TOAST_CONFIG);
                }
            });
            client.on("connect", () => {
                console.log(this.title + "Connected to Stringee server");
            });
            client.on("disconnect", () => {
                console.log(this.title + "Disconnected to Stringee server");
            });
            client.on("requestnewtoken", async () => {
                console.log(this.title + "Token expire, re-connect...");
                await client.disconnect();
                const stringeeToken = await stringeeApi.getPccClientOken(this.userData.stringee_userid);
                await client.connect(stringeeToken);
            });
            client.on("otherdeviceauthen", res => {
                console.log(this.title + "Another device is connected by same userId: ", res);
            });
            client.on("incomingcall2", incomingcall2 => {
                console.log("Incoming call 2: ", incomingcall2);
                console.log("Custom data from your server: ", JSON.parse(incomingcall2.customDataFromYourServer));
                this.StringeeCall2 = incomingcall2;
                this.callId = incomingcall2.callId;
                this.callType = "Inbound";
                this.callStatus = "Ringing";
                this.settingCallEvents(this.StringeeCall2);
                this.popupIncomingCall = true;
            });
            client.on("custommessage", res => {
                console.log(this.title + "Custom message: ", res);
            });
            client.on("messagefromtopic", res => {
                console.log(this.title, res);
            });
        },
        settingCallEvents(call) {
            call.on("error", info => {
                console.log(this.title + "Error: " + JSON.stringify(info));
            });
            call.on("addlocaltrack", localtrack => {
                console.log(this.title + "Add local track: ", localtrack);
                const localVideo = this.$el.querySelector("#localVideo");
                const element = localtrack.attach();
                element.style.height = "100%";
                element.style.width = "100%";
                localVideo.appendChild(element);
            });
            call.on("addremotetrack", remotetrack => {
                console.log(this.title + "Add remote track: ", remotetrack);
                const remoteVideo = this.$el.querySelector("#remoteVideo");
                const element = remotetrack.attach();
                element.style.height = "100%";
                element.style.width = "100%";
                remoteVideo.appendChild(element);
            });
            call.on("removeremotetrack", track => {
                track.detachAndRemove();
            });
            call.on("removelocaltrack", track => {
                track.detachAndRemove();
            });
            call.on("signalingstate", (state) => {
                console.log(this.title + "Signalingstate: ", state);
                this.callStatus = state.reason;
                if (state.code === 6 || state.code === 5) {
                    this.inCall = false;
                    this.popupIncomingCall = false;
                }
            });
            call.on("mediastate", state => {
                console.log(this.title + "Mediastate: ", state);
            });
            call.on("info", info => {
                console.log(this.title + "Info: ", info);
            });
            call.on("otherdevice", data => {
                console.log(this.title + "Otherdevice: " + JSON.stringify(data));
                if (data.type === "CALL_END" || (data.type === "CALL2_STATE" && data.code >= 200)) {
                    this.inCall = false;
                    this.callStatus = "Answered on another device";
                }
            });
        },
        makeCallOrHangup() {
            if (this.inCall) {
                this.StringeeCall2.hangup(res => {
                    console.log(this.title + "Hangup: ", res);
                    this.callStatus = "Ended";
                    this.inCall = false;
                });
            } else {
                if (!this.calleeUserId) return this.toast.error(ERROR_DESC.MISSING_CALLEE_ID, TOAST_CONFIG);
                this.StringeeCall2 = new window.StringeeCall2(this.StringeeClient, this.userData.stringee_userid, this.calleeUserId, true);
                this.settingCallEvents(this.StringeeCall2);
                this.StringeeCall2.makeCall(res => {
                    console.log(this.title + "Make video call: " + res);
                    if (res.r !== 0) {
                        this.callStatus = res.message;
                    } else {
                        this.callId = res.callId;
                        this.callType = "Outbound";
                    }
                    this.inCall = true;
                });
            }
        },
        answerCall() {
            this.StringeeCall2.answer(res => {
                console.log("Answer call: ", res);
                this.popupIncomingCall = false;
                this.inCall = true;
                this.callStatus = "Answered";
            });
        },
        rejectCall() {
            this.StringeeCall2.reject(res => {
                console.log("Reject call: ", res);
                this.popupIncomingCall = false;
                this.inCall = false;
                this.callStatus = "Ended";
            });
        },
        mute() {
            const muted = !this.StringeeCall2.muted;
            this.StringeeCall2.mute(muted);
            console.log(this.title + "Muted result: " + muted);
        },
        toggleCamera() {
            const localVideoEnabled = !this.StringeeCall2.localVideoEnabled;
            this.StringeeCall2.enableLocalVideo(localVideoEnabled);
            console.log(this.title + "Enable video result: " + localVideoEnabled);
        }
    },
    async mounted() {
        try {
            this.settingClientEvents(this.StringeeClient);
            if (!this.StringeeClient.connected) {
                const stringeeToken = await stringeeApi.getPccClientOken(this.userData.stringee_userid);
                await this.StringeeClient.connect(stringeeToken);
            }
        } catch (err) {
            this.toast.error(err.message, TOAST_CONFIG);
        }
    }
};
</script>

<style scoped>
.row-area {
    display: flex;
    flex-direction: row;
}

.column-area {
    display: flex;
    flex-direction: column;
}

.videocall-area {
    width: 100%;
    height: 100%;
    color: white;
}

.method-area {
    width: 20%;
}

.method-area p {
    font-size: 20px;
    font-weight: bold;
}

.connect-client {
    color: greenyellow;
}

.not-connect-client {
    color: red;
}

.callee-input {
    color: white;
    margin-top: 10px;
    margin-bottom: 10px;
    height: 30px;
    padding: 5px;
    font-size: 20px;
    background: transparent;
    backdrop-filter: blur(30px);
    border-radius: 10px;
}

.callee-input::placeholder {
    color: white;
}

.btn {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    margin-right: 10px;
}

.unmute-btn,
.enable-camera-btn,
.makecall-btn {
    background: green;
}

.mute-btn,
.disable-camera-btn,
.hangup-btn {
    background: red;
}



.remote-video {
    width: 80%;
    margin-left: 10px;
    height: 85vh;
    backdrop-filter: blur(30px);
    border: 2px solid rgba(255, 255, 255, .1);
    border-radius: 10px;
}

.local-video {
    position: fixed;
    border: 2px solid rgba(255, 255, 255, .1);
    width: 20%;
    height: 20%;
    border-radius: 10px;
    right: 10px;
    bottom: 10px;
    z-index: 1000;
    display: inline-block;
}

.call-info {
    margin-top: 10px;
    padding: 5px;
    border: 2px solid rgba(255, 255, 255, .1);
    backdrop-filter: blur(30px);
    border-radius: 10px;
}

.call-info p {
    font-size: 15px;
    font-weight: 400;
}
</style>