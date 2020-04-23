<template>
    <div @keyup.enter="tryAddTask()">
        <v-col>
            <v-text-field
                    dark
                    background-color="indigo accent-1"
                    v-model="newTaskText"
                    outlined
                    label="I need to do... (press enter to add)"
            ></v-text-field>
        </v-col>
        <v-snackbar v-model="snackbar" :timeout="timeout" color="success">
            added to 'current' successfuly!
        </v-snackbar>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'

    export default {
        name: "NewTask",
        data() {
            return {
                snackbar: false,
                timeout: 2000,
                newTaskText: ""
            }
        },
        methods: {
            ...mapActions(['addTaskAction']),
            tryAddTask() {
                console.log("lul")
                if(this.newTaskText != null && this.newTaskText != '') {
                    this.addTaskAction({
                        id: null,
                        taskText: this.newTaskText,
                        taskType: 'CURRENT'
                    })
                    this.snackbar = true
                    this.newTaskText = ''
                }
            }
        }
    }
</script>

<style scoped>

</style>