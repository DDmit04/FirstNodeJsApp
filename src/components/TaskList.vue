<template>
    <div>
        <div v-if="taskList.length > 0">
            <v-card v-for="task in taskList" :key="task.id" class="indigo accent-1 mt-2">
                <v-card-text>
                    <div class="title white--text">
                        {{task.taskText}}
                    </div>
                    <v-divider class="ma-2"></v-divider>
                    <v-card-actions>
                        <div v-if="listType == 'CURRENT'">
                            <v-btn color="success" class="mr-2" @click="completeTask(task.id)">Complete</v-btn>
                            <v-btn color="warning" class="mr-2" @click="stopTask(task.id)">Stop</v-btn>
                            <v-btn color="error" class="mr-2" @click="deleteTask(task.id)">Delete</v-btn>
                        </div>
                        <div v-else-if="listType == 'COMPLETED'">
                        </div>
                        <div v-else-if="listType == 'STOPED'">
                            <v-btn color="success" class="mr-2" @click="continueTask(task.id)">Continue</v-btn>
                            <v-btn color="error" class="mr-2" @click="deleteTask(task.id)">Delete</v-btn>
                        </div>
                        <div v-else-if="listType == 'DELETED'">
                        </div>
                    </v-card-actions>
                </v-card-text>
            </v-card>
        </div>
        <div v-else class="white--text display-2 font-italic font-weight-light mt-4 ">
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
    import {mapActions} from "vuex";

    export default {
        name: "TaskList",
        props: {
            taskList: {
                type: Array,
                required: true,
                default: () => []
            },
            listType: {
                type: String,
                required: false,
                default: "CURRENT"
            }
        },
        data() {
            return {
                snackbar: false,
                timeout: 2000,
                snackbarText: 'no message'
            }
        },
        methods: {
            ...mapActions(['continueTaskAction', 'stopTaskAction', 'completeTaskAction', 'deleteTaskAction']),
            async completeTask(id) {
                await this.completeTaskAction(id)
                this.snackbarText = 'Moved to "completed" successfuly!'
                this.snackbar = true
            },
            async stopTask(id) {
                await this.stopTaskAction(id)
                this.snackbarText = 'Moved to "stoped" successfuly!'
                this.snackbar = true
            },
            async continueTask(id) {
                await this.continueTaskAction(id)
                this.snackbarText = 'Moved to "current" successfuly!'
                this.snackbar = true
            },
            async deleteTask(id) {
                await this.deleteTaskAction(id)
                this.snackbarText = 'Moved to "deleted" successfuly!'
                this.snackbar = true
            }
        }
    }
</script>

<style scoped>

</style>