import {prop, getModelForClass, pre} from '@typegoose/typegoose';
import {ModelType} from "@typegoose/typegoose/lib/types";
import {UserModel} from "./User";

export enum TaskType {
    CURRENT = 'CURRENT',
    COMPLETED = 'COMPLETED',
    STOPPED = 'STOPPED',
    DISCARDED = 'DISCARDED'
}

@pre<Task>('remove', async function() {
    await UserModel.findOneAndUpdate({'tasks': this._id}, {$pull: {'tasks': this._id}}).exec()
})

export class Task {

    @prop({required: true})
    taskText: string = "no text"

    @prop({required: true})
    readonly dateTime: Date

    @prop({required: true})
    taskType: TaskType = TaskType.CURRENT

    constructor(started: Date, taskText: string, taskType: TaskType) {
        this.dateTime = started;
        this.taskText = taskText;
        this.taskType = taskType;
    }

    static findByType(this: ModelType<Task>, taskType: TaskType) {
        return this.find({taskType: taskType})
    }
}

export const TaskModel = getModelForClass(Task)

