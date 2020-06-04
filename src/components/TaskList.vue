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
                        <div v-show="task.taskType == 'CURRENT'">
                            Created: {{getTimeForNow(task.creationDate)}}
                        </div>
                        {{getTimeLabel(task.taskType)}} {{getTime(task)}}
                    </div>
                    <v-divider class="ma-2"></v-divider>
                    <v-card-actions>
                        <div v-show="listType == 'CURRENT'">
                            <v-btn color="success" class="mr-2" @click="changeTaskStatus(task.creationDate, 'COMPLETED')">
                                Complete
                            </v-btn>
                            <v-btn color="warning" class="mr-2" @click="changeTaskStatus(task.creationDate, 'STOPPED')">
                                Stop
                            </v-btn>
                            <v-btn color="error" class="mr-2" @click="changeTaskStatus(task.creationDate, 'DISCARDED')">
                                Discard
                            </v-btn>
                        </div>
                        <div v-show="listType == 'COMPLETED'">
                            <v-btn color="error" class="mr-2" @click="deleteTask(task.creationDate)">Delete</v-btn>
                        </div>
                        <div v-show="listType == 'STOPPED'">
                            <v-btn color="success" class="mr-2" @click="changeTaskStatus(task.creationDate, 'CURRENT')">
                                Continue
                            </v-btn>
                            <v-btn color="error" class="mr-2" @click="changeTaskStatus(task.creationDate, 'DISCARDED')">
                                Discard
                            </v-btn>
                        </div>
                        <div v-show="listType == 'DISCARDED'">
                            <v-btn color="error" class="mr-2" @click="deleteTask(task.creationDate)">Delete</v-btn>
                        </div>
                        <v-progress-circular
                                v-show="taskProcessLoading"
                                class="my-3"
                                :size="35"
                                :width="7"
                                color="white"
                                indeterminate
                        />
                    </v-card-actions>
                </v-card-text>
            </v-card>
        </div>
        <div v-else class="white--text display-2 font-italic font-weight-light indigo accent-2 mt-4 ">
            <v-layout align-center justify-center>
                No tasks
            </v-layout>
        </div>
        <v-snackbar v-model="snackbar" :timeout="timeout" :color="snackbarColor">
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
                taskProcessLoading: false,
                snackbar: false,
                timeout: 2000,
                snackbarText: 'no message',
                snackbarColor: 'success'
            }
        },
        async mounted() {
            if (this.user == null) {
                this.listLoading = false
            } else {
                await this.pullAllTasksAction()
                this.listLoading = false
            }
        },
        watch: {
            async user(newVal) {
                if (newVal != null) {
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
            async changeTaskStatus(creationDate, newType) {
                this.taskProcessLoading = true
                try {
                    await this.changeTaskTypeAction({creationDate, newType})
                    this.snackbarColor = 'success'
                    this.snackbarText = `Moved to ${newType} successfuly!`
                } catch (e) {
                    this.snackbarColor = 'error'
                    this.snackbarText = `Moving to ${newType} error!`
                }
                this.snackbar = true
                this.taskProcessLoading = false
            },
            async deleteTask(dateTime) {
                this.taskProcessLoading = true
                try {
                    await this.deleteTaskAction(dateTime)
                    this.snackbarColor = 'success'
                    this.snackbarText = 'Deleted successfuly!'
                } catch (e) {
                    this.snackbarColor = 'error'
                    this.snackbarText = `Delete error!`
                }
                this.snackbar = true
                this.taskProcessLoading = false
            },
            getTimeLabel(type) {
                let label
                if(type == "CURRENT") {
                    label = "Continued:"
                } else if(type == "STOPPED") {
                    label = "Stopped:"
                } else if(type == "DISCARDED") {
                    label = "Discarded:"
                } else if(type == "COMPLETED") {
                    label = "Completed:"
                }
                return label
            },
            getTimeForNow(time) {
                let dateTime = this.$moment(time)
                return dateTime.fromNow()
            },
            getTime(task) {
                let time
                if(task.taskType == "CURRENT") {
                    time = task.continuedDate
                } else if(task.taskType == "STOPPED") {
                    time = task.stoppedDate
                } else if(task.taskType == "DISCARDED") {
                    time = task.discardedDate
                } else if(task.taskType == "COMPLETED") {
                    time = task.completedDate
                }
                return this.getTimeForNow(time)
            },
        }
    }
</script>

<style scoped>

</style>