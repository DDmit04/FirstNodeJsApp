<template>
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
                    <v-badge color="green" :content="currentTasksLength + ''">
                        Current tasks
                    </v-badge>
                </v-tab>
                <v-tab class="white--text">
                    <v-badge color="green" :content="completedTasksLength + ''">
                        Completed tasks
                    </v-badge>
                </v-tab>
                <v-tab class="white--text">
                    <v-badge color="green" :content="stoppedTasksLength + ''">
                        Stoped tasks
                    </v-badge>
                </v-tab>
                <v-tab class="white--text">
                    <v-badge color="green" :content="discardedTasksLength + ''">
                        Discarded tasks
                    </v-badge>
                </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab" class="indigo accent-2">
                <v-tab-item class="indigo accent-2">
                    <task-list :list-type="'CURRENT'"/>
                </v-tab-item>
                <v-tab-item class="indigo accent-2">
                    <task-list :list-type="'COMPLETED'"/>
                </v-tab-item>
                <v-tab-item class="indigo accent-2">
                    <task-list :list-type="'STOPPED'"/>
                </v-tab-item>
                <v-tab-item class="indigo accent-2">
                    <task-list :list-type="'DISCARDED'"/>
                </v-tab-item>
            </v-tabs-items>
        </v-card-text>
    </v-card>
</template>

<script>
    import TaskList from "./TaskList";
    import NewTask from "./NewTask";
    import {mapGetters, mapMutations, mapState} from "vuex";

    export default {
        name: "ToDoCard",
        components: {
            TaskList,
            NewTask
        },
        computed: {
            ...mapState(['chosenTab']),
            ...mapGetters(['getTasks']),
            currentTasksLength() {
                return this.getTasks('CURRENT').length
            },
            stoppedTasksLength() {
                return this.getTasks('STOPPED').length
            },
            completedTasksLength() {
                return this.getTasks('COMPLETED').length
            },
            discardedTasksLength() {
                return this.getTasks('DISCARDED').length
            },
            tab: {
                get() {
                    return this.chosenTab
                },
                set(newVal) {
                    this.changeChosenTabMutation(newVal)
                }
            }
        },
        methods: {
            ...mapMutations(['changeChosenTabMutation']),
        }
    }
</script>

<style scoped>

</style>