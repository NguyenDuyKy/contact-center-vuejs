<template>
    <div class="background">
        <LayoutComponent>
            <div class="filter-search-contact-area">
                <div class="search-contact-area">
                    <button @click="addContact">
                        <i class="bx bx-plus-medical"></i>
                        <p>Add contact</p>
                    </button>
                    <p>Search by</p>
                    <select v-model="searchBy" class="search-option" @change="showSearchInput">
                        <option value="phone">Phone</option>
                        <option value="email">Email</option>
                        <option value="gender">Gender</option>
                        <option value="vip">VIP</option>
                    </select>
                    <input type="text" class="search-input" v-model="searchInputValue" v-if="showSearchInputField">
                    <select v-model="searchGenderValue" class="search-option" v-if="showSearchGenderField">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    <select v-model="searchVipValue" class="search-option" v-if="showSearchVipField">
                        <option value="true">True</option>
                        <option value="false">False</option>
                    </select>
                    <button @click="searchContact" class="search-btn">
                        <i class="bx bx-search"></i>
                        <p>Search</p>
                    </button>
                </div>
                <div class="filter-contact-area"></div>
            </div>
            <ContactDataTable :titles="dataTableTitles" :data="dataTableContact" class="contact-page">
            </ContactDataTable>
        </LayoutComponent>
    </div>
</template>

<script>
import LayoutComponent from "../components/layout/LayoutComponent.vue";
import ContactDataTable from "../components/data-table/ContactDataTable.vue";
import { contactApi } from "../api/api.js";
export default {
    name: "ContactPage",
    components: {
        LayoutComponent,
        ContactDataTable
    },
    data() {
        return {
            isAuthenticated: false,
            dataTableTitles: ["Name", "Email", "Phone", "Gender", "VIP", "Action"],
            dataTableContact: [],
            searchBy: "phone",
            searchInputValue: "",
            searchGenderValue: "male",
            searchVipValue: "true",
            showSearchInputField: true,
            showSearchGenderField: false,
            showSearchVipField: false
        }
    },
    created() {
        this.isAuthenticated = localStorage.getItem("isAuthenticated");
        if (!this.isAuthenticated) {
            this.$router.push({ name: "LoginPage" });
        }
    },
    mounted() {
        this.searchContactResult();
    },
    methods: {
        addContact() {
            this.$router.push({ name: "ContactDetailPage", params: { contactId: "add-contact" } });
        },
        showSearchInput() {
            this.showSearchInputField = this.searchBy === "phone" || this.searchBy === "email";
            this.showSearchGenderField = this.searchBy === "gender";
            this.showSearchVipField = this.searchBy === "vip";
        },
        searchContact() {
            switch (this.searchBy) {
                case "phone":
                    this.searchByPhone();
                    break;
                case "email":
                    this.searchByEmail();
                    break;
                case "gender":
                    this.searchByGender();
                    break;
                case "vip":
                    this.searchByVip();
                    break;
                default:
                    break;
            }
        },
        searchByPhone() {
            if (this.searchInputValue) {
                const phoneNumber = this.searchInputValue.replace(/^0/, "84");
                this.searchContactResult("?phone_number=" + phoneNumber);
            } else {
                this.searchContactResult();
            }
        },
        searchByEmail() {
            if (this.searchInputValue) {
                this.searchContactResult("?email=" + this.searchInputValue);
            } else {
                this.searchContactResult();
            }
        },
        searchByGender() {
            this.searchContactResult("?gender=" + this.searchGenderValue);
        },
        searchByVip() {
            const isVip = this.searchVipValue === "true" ? true : false;
            this.searchContactResult("?vip=" + isVip);
        },
        async searchContactResult(query) {
            try {
                const contactResponse = await contactApi.getList(query);
                this.dataTableContact = [...contactResponse.contactList];
            } catch (err) {
                if (err.status === 401 && err.message === "Unauthorized") {
                    this.$router.push({ name: "LoginPage" });
                    localStorage.clear();
                } else return console.log(err);
            }
        }
    }
};
</script>

<style>
.contact-page {
    width: 100%;
    max-height: 500px;
    overflow: auto;
    border: 2px solid rgba(255, 255, 255, .1);
    backdrop-filter: blur(30px);
    box-shadow: 0 0 10px rgba(0, 0, 0, .2);
}

.filter-search-contact-area {
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    color: white;
}

.search-contact-area {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
}

.search-contact-area button {
    width: 120px;
    height: 35px;
    padding: 5px;
    background-color: yellowgreen;
    border-radius: 10px;
    font-size: 15px;
    color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    margin-right: 40px;
}

.search-contact-area button:hover {
    background-color: rgb(94, 216, 38);
}

.search-contact-area button p {
    font-size: 15px;
}

.search-contact-area .search-btn {
    background-color: rgba(0, 255, 255, 0.842);
    width: 90px;
    color: black;
}

.search-contact-area .search-btn:hover {
    background-color: rgb(0, 255, 255);
}

.search-contact-area label {
    margin-right: 10px;
}

.search-contact-area .search-option {
    font-size: 15px;
    color: black;
    margin-left: 10px;
    margin-right: 10px;
    height: 30px;
    background: rgb(0, 208, 255);
    border-radius: 5px;
}

.search-contact-area .search-input {
    height: 25px;
    width: 200px;
    font-size: 15px;
    padding: 5px;
    border-radius: 10px;
    border: 2px solid rgba(255, 255, 255, .1);
    margin-right: 10px;
}
</style>