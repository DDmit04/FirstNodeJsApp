<template>
    <v-app>
        <v-container>
            <v-card class="indigo accent-2">
                <v-card-title class="white--text font-italic font-weight-light display-3 justify-center">
                    TO DO
                </v-card-title>
                <v-divider></v-divider>
                <new-task class="mt-2"/>
                <v-divider></v-divider>
                <v-card-text>
                    <v-tabs v-model="tab" background-color="red lighten-1" grow>
                        <v-tab class="white--text">
                            Current tasks
                        </v-tab>
                        <v-tab class="white--text">
                            Completed tasks
                        </v-tab>
                        <v-tab class="white--text">
                            Stoped tasks
                        </v-tab>
                        <v-tab class="white--text">
                            Deleted tasks
                        </v-tab>
                    </v-tabs>
                    <v-tabs-items v-model="tab" class="indigo accent-1">
                        <v-tab-item class="indigo accent-4">
                            <task-list :task-list="currentTasks" :list-type="'CURRENT'"/>
                        </v-tab-item>
                        <v-tab-item class="indigo accent-4">
                            <task-list :task-list="completedTasks" :list-type="'COMPLETED'"/>
                        </v-tab-item>
                        <v-tab-item class="indigo accent-4">
                            <task-list :task-list="stopedTasks" :list-type="'STOPED'"/>
                        </v-tab-item>
                        <v-tab-item class="indigo accent-4">
                            <task-list :task-list="deletedTasks" :list-type="'DELETED'"/>
                        </v-tab-item>
                    </v-tabs-items>
                </v-card-text>
            </v-card>
        </v-container>
    </v-app>
</template>

<script>
    import TaskList from "./components/TaskList"
    import NewTask from "./components/NewTask";
    import {mapState} from 'vuex'

    export default {
        name: 'App',
        data() {
            return {
                tab: null,
            }
        },
        components: {
            TaskList,
            NewTask
        },
        computed: {
            ...mapState(['currentTasks', 'completedTasks', 'stopedTasks', 'deletedTasks'])
        }
    }
</script>
