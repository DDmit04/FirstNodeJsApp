<template>
    <v-card outlined>
        <v-card-text>
            <v-row align="center">
                <v-col class="text-center">
                    <v-text-field v-model="username" @focus="errorMessage = ''" :error="errorMessage != ''" label="Username or email"/>
                    <v-text-field v-model="password" @focus="errorMessage = ''" :error="errorMessage != ''" type="password" label="Password"/>
                    <strong v-show="errorMessage != ''" style="color: red">
                        {{errorMessage}}
                    </strong>
                    <v-btn class="my-2"
                           color="primary white--text"
                           @click="loginCommonUser()"
                           :disabled="!userIsValid"
                           :loading="commonLoginBtnLoading"
                           block>
                        Login
                    </v-btn>
                    <v-divider class='my-2'/>
                    <div>
                        Login with OAuth
                    </div>
                    <v-btn href='auth/login/google'
                           class="my-2"
                           color="red white--text"
                           :loading="googleLoginBtnLoading"
                           @click="googleLoginBtnLoading = true"
                           block>
                        <v-icon class="mr-2">{{googleIcon}}</v-icon>
                        Google
                    </v-btn>
                    <v-btn href='auth/login/github'
                           class="my-2"
                           color="black white--text"
                           :loading="githubLoginBtnLoading"
                           @click="githubLoginBtnLoading = true"
                           block>
                        <v-icon class="mr-2">{{githubIcon}}</v-icon>
                        Github
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
    import {mapActions} from 'vuex'
    import {mdiGithub, mdiGoogle} from '@mdi/js'

    export default {
        name: "abstractModal",
        data() {
            return {
                commonLoginBtnLoading: false,
                googleLoginBtnLoading: false,
                githubLoginBtnLoading: false,
                errorMessage: '',
                username: '',
                password: '',
                googleIcon: mdiGoogle,
                githubIcon: mdiGithub,
            }
        },
        computed: {
            userIsValid() {
                return this.username != '' && this.password != ''
            }
        },
        methods: {
            ...mapActions(['loginUserWithCommonAction', 'getUserAction']),
            async loginCommonUser() {
                this.commonLoginBtnLoading = true
                try {
                    await this.loginUserWithCommonAction({username: this.username, password: this.password})
                } catch(e)  {
                    this.commonLoginBtnLoading = false
                    this.errorMessage = e
                    return
                }
                await this.getUserAction()
                this.commonLoginBtnLoading = false
                this.$emit('logined')
            },
        }
    }
</script>

<style scoped>

</style>