const TOAST_CONFIG = {
    position: "top-center",
    timeout: 1500,
    closeOnClick: true,
    pauseOnFocusLoss: false,
    pauseOnHover: false,
    draggable: true,
    draggablePercent: 1,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: false,
    icon: true,
    rtl: false
};

const ERROR_DESC = {
    MISS_MATCH_PASSWORD: "Password and confirm password are not match",
    NOT_FOUND_STRINGEE_SOFTPHONE: "Stringee softphone is not found",
    SELECT_NUMBER: "Please select number from softphone first",
    MISSING_EMAIL: "Please enter your email",
    MISSING_NEW_PASSWORD: "Please enter your new password"
};

const SUCCESS_DESC = {
    SIGN_UP: "Sign up successfully",
    CREATE_CONTACT: "Create contact successfully",
    UPDATE_CONTACT: "Update contact successfully",
    DELETE_CONTACT: "Delete contact successfully",
    SEND_OTP: "Send OTP successfully, please check your phone",
    RECOVER_PASSWORD: "Recover password successfully"
}

export { TOAST_CONFIG, ERROR_DESC, SUCCESS_DESC };