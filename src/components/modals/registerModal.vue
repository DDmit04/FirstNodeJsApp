<template>
    <v-card outlined>
        <v-card-text>
            <v-row align="center">
                <v-col class="text-center">
                    <v-text-field
                            v-model="username"
                            @focus="errorMessage = ''"
                            :rules="usernameRules"
                            :error-messages="usernameErrorMessage"
                            :loading="usernameLoading"
                            label="Username"
                    ></v-text-field>
                    <v-text-field
                            v-model="email"
                            @focus="errorMessage = ''"
                            :error-messages="emailErrorMessage"
                            :loading="emailLoading"
                            :rules="emailRules"
                            label="Email">
                    </v-text-field>
                    <v-text-field
                            v-model="password"
                            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="show1 ? 'text' : 'password'"
                            @focus="errorMessage = ''"
                            @click:append="show1 = !show1"
                            :rules="passwordRules"
                            :error="this.password != this.passwordConf"
                            label="Password"
                    />
                    <v-text-field
                            v-model="passwordConf"
                            :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="show2 ? 'text' : 'password'"
                            @focus="errorMessage = ''"
                            @click:append="show2 = !show2"
                            :rules="passwordRules"
                            :error-messages="this.password === this.passwordConf ? '' : 'Password not confirmed!'"
                            label="Password conf"
                    />
                    <strong v-show="errorMessage != ''" style="color: red">
                        {{errorMessage}}
                    </strong>
                    <v-btn class="my-2"
                           color="primary white--text"
                           @click="register()"
                           :disabled="!userIsValid"
                           :loading="btnIsLoading"
                           block>
                        Register
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
    import userRequests from "../../axios/userRequests"
    import validationRules from "../../utils/validationRules";

    export default {
        name: "registerModal",
        data() {
            return {
                emailRules: [...validationRules.emailRules],
                usernameRules: [...validationRules.usernameRules],
                passwordRules: [...validationRules.passwordRules],

                btnIsLoading: false,
                usernameLoading: false,
                emailLoading: false,

                show1: false,
                show2: false,

                errorMessage: '',
                usernameErrorMessage: '',
                emailErrorMessage: '',

                password: '',
                username: '',
                passwordConf: '',
                email: '',

                usernameCheckRequest: setInterval(() => {
                }, 1000),
                emailCheckRequest: setInterval(() => {
                }, 1000)
            }
        },
        destroyed() {
            clearTimeout(this.usernameCheckRequest)
            clearTimeout(this.emailCheckRequest)
        },
        watch: {
            async username(newVal) {
                if(this.username != '') {
                    clearTimeout(this.usernameCheckRequest)
                    this.usernameCheckRequest = setTimeout(async () => {
                        this.usernameLoading = true
                        let usernameExists = await userRequests.checkUsername(newVal)
                        if (usernameExists) {
                            this.usernameErrorMessage = 'User with this username already exists!'
                        } else {
                            this.usernameErrorMessage = ''
                        }
                        this.usernameLoading = false
                    }, 1000)
                }
            },
            async email(newVal) {
                if (validationRules.validEmail(this.email) && this.email != '') {
                    clearTimeout(this.emailCheckRequest)
                    this.emailCheckRequest = setTimeout(async () => {
                        this.emailLoading = true
                        let emailExists = await userRequests.checkEmail(newVal)
                        if (emailExists) {
                            this.emailErrorMessage = 'User with this email already exists!'
                        } else {
                            this.emailErrorMessage = ''
                        }
                        this.emailLoading = false
                    }, 1000)
                }
            }
        },
        computed: {
            userIsValid() {
                const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                let passwordIsValid = (this.password != '' && this.passwordConf != '')
                let passwordConfirmed = (this.password === this.passwordConf)
                let emailIsValid = (emailRegex.test(this.email) && this.emailErrorMessage == '' && this.email != '')
                let usernameIsValid = (this.username != '' && this.usernameErrorMessage == '')
                return usernameIsValid && emailIsValid && passwordIsValid && passwordConfirmed && this.errorMessage == ''
            }
        },
        methods: {
            async register() {
                this.btnIsLoading = true
                const response = await userRequests.regUser({
                    username: this.username,
                    email: this.email,
                    password: this.password,
                    passwordConf: this.passwordConf
                })
                if (response.ok()) {
                    this.username = ''
                    this.email = ''
                    this.password = ''
                    this.passwordConf = ''
                    await this.$emit('registred')
                } else {
                    this.errorMessage = response.errors
                }
                this.btnIsLoading = false
            }
        }
    }
</script>

<style scoped>

</style>