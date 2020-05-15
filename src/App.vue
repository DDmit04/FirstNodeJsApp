<template>
    <v-app>
        <abstract-modal :modalIsActive="dialog" @close="dialog = false"/>
        <v-app-bar class="teal accent-1" app>
            <v-toolbar-items>
                <v-btn text class="teal accent-1">
                    My App
                </v-btn>
            </v-toolbar-items>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn v-if="user != null && user != ''" text class="teal accent-1">
                    {{user.username}}
                </v-btn>
                <v-btn v-if="user != null && user != ''"
                       href="auth/logout"
                       @click="logout()"
                       text
                       class="teal accent-1">
                    logout
                </v-btn>
                <v-btn v-else text @click="dialog = true" class="teal accent-1">
                    login
                </v-btn>
            </v-toolbar-items>
        </v-app-bar>
        <v-content>
            <v-container>
                <to-do-card/>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
    import ToDoCard from "./components/ToDoCard"
    import abstractModal from "./components/modals/abstractModal";
    import {mapActions, mapMutations, mapState} from 'vuex'

    export default {
        name: 'App',
        data() {
            return {
                dialog: false
            }
        },
        components: {
            ToDoCard,
            abstractModal
        },
        computed: {
            ...mapState(['user'])
        },
        created() {
            this.do()
        },
        methods: {
            ...mapMutations(['logoutMutation']),
            ...mapActions(['getUserAction']),
            async do() {
                await this.getUserAction()
            },
            logout() {
                this.logoutMutation()
            },
        }
    }
</script>
