<template>
    <div>
        <div v-if="listLoading" align="center">
            <v-progress-circular
                    class="my-3"
                    :size="70"
                    :width="7"
                    color="warning"
                    indeterminate
            />
        </div>
        <div v-else-if="getTasks(listType).length > 0">
            <v-card v-for="(task, index) in getTasks(listType)" :key="index" class="indigo accent-1 mt-2" hover>
                <v-card-text>
                    <div class="title white--text">
                        {{task.taskText}}
                        <v-divider class="my-2"></v-divider>
                        Created: {{getTime(task.dateTime)}}
                    </div>
                    <v-divider class="ma-2"></v-divider>
                    <v-card-actions>
                        <div v-if="listType == 'CURRENT'">
                            <v-btn color="success" class="mr-2" @click="completeTask(task.dateTime)">Complete</v-btn>
                            <v-btn color="warning" class="mr-2" @click="stopTask(task.dateTime)">Stop</v-btn>
                            <v-btn color="error" class="mr-2" @click="discardTask(task.dateTime)">Discard</v-btn>
                        </div>
                        <div v-else-if="listType == 'COMPLETED'">
                            <v-btn color="error" class="mr-2" @click="deleteTask(task.dateTime)">Delete</v-btn>
                        </div>
                        <div v-else-if="listType == 'STOPPED'">
                            <v-btn color="success" class="mr-2" @click="continueTask(task.dateTime)">Continue</v-btn>
                            <v-btn color="error" class="mr-2" @click="discardTask(task.dateTime)">Discard</v-btn>
                        </div>
                        <div v-else-if="listType == 'DISCARDED'">
                            <v-btn color="error" class="mr-2" @click="deleteTask(task.dateTime)">Delete</v-btn>
                        </div>
                    </v-card-actions>
                </v-card-text>
            </v-card>
        </div>
        <div v-else class="white--text display-2 font-italic font-weight-light indigo accent-2 mt-4 ">
            <v-layout align-center justify-center>
                No tasks
            </v-layout>
        </div>
        <v-snackbar v-model="snackbar" :timeout="timeout" color="success">
            {{ snackbarText }}
        </v-snackbar>
    </div>
</template>

<script>
    import {mapActions, mapGetters, mapState} from "vuex"

    export default {
        name: "TaskList",
        props: {
            listType: {
                type: String,
                required: false,
                default: "CURRENT"
            }
        },
        data() {
            return {
                listLoading: true,
                snackbar: false,
                timeout: 2000,
                snackbarText: 'no message'
            }
        },
        async mounted() {
            if(this.user == null) {
                this.listLoading = false
            } else {
                await this.pullAllTasksAction()
                this.listLoading = false
            }
        },
        watch: {
            async user(newVal) {
                if(newVal != null) {
                    this.listLoading = true
                    await this.pullAllTasksAction()
                    this.listLoading = false
                }
            }
        },
        computed: {
            ...mapGetters(['getTasks']),
            ...mapState(['user']),
        },
        methods: {
            ...mapActions(['changeTaskTypeAction', 'deleteTaskAction', 'pullAllTasksAction']),
            async completeTask(dateTime) {
                await this.changeTaskTypeAction({dateTime, newType: 'COMPLETED'})
                this.snackbarText = 'Moved to "completed" successfuly!'
                this.snackbar = true
            },
            async stopTask(dateTime) {
                await this.changeTaskTypeAction({dateTime, newType: 'STOPPED'})
                this.snackbarText = 'Moved to "stoped" successfuly!'
                this.snackbar = true
            },
            async continueTask(dateTime) {
                await this.changeTaskTypeAction({dateTime, newType: 'CURRENT'})
                this.snackbarText = 'Moved to "current" successfuly!'
                this.snackbar = true
            },
            async discardTask(dateTime) {
                await this.changeTaskTypeAction({dateTime, newType: 'DISCARDED'})
                this.snackbarText = 'Moved to "discarded" successfuly!'
                this.snackbar = true
            },
            async deleteTask(dateTime) {
                await this.deleteTaskAction(dateTime)
                this.snackbarText = 'Deleted successfuly!'
                this.snackbar = true
            },
            getTime(dateTime) {
                dateTime = this.$moment(dateTime)
                return dateTime.fromNow()
            },
        }
    }
</script>

<style scoped>

</style>