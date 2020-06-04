<template>
    <v-dialog v-model="active"
              max-width="500"
              min-width="200">
        <v-card>
            <v-card-title class="headline">
                Authorization
            </v-card-title>
            <v-divider></v-divider>
            <v-tabs v-model="tab" background-color="red lighten-1" grow>
                <v-tab class="white--text">
                    Login
                </v-tab>
                <v-tab class="white--text">
                    Register
                </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
                <v-tab-item align="center">
                    <keep-alive>
                        <login-modal @logined="active = false"/>
                        <a @click="tab=1">no account?</a>
                    </keep-alive>
                </v-tab-item>
                <v-tab-item align="center">
                    <keep-alive>
                        <register-modal @registred="tab = 0"/>
                        <a @click="tab=0">already have account?</a>
                    </keep-alive>
                </v-tab-item>
            </v-tabs-items>
        </v-card>
    </v-dialog>
</template>

<script>
    import loginModal from "./loginModal"
    import registerModal from "./registerModal";

    export default {
        name: "abstractModal",
        props: {
            /** Is dialog shown */
            modalIsActive: {
                required: true,
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                tab: 0
            }
        },
        components: {
            loginModal,
            registerModal
        },
        computed: {
            active: {
                get() {
                    return this.modalIsActive
                },
                set(value) {
                    if (!value) {
                        /** Close dialog event */
                        this.$emit('close')
                    }
                }
            }
        },
    }
</script>

<style scoped>

</style>