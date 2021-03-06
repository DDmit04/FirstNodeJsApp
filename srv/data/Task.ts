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
    readonly creationDate: Date

    @prop({required: true})
    localStored: boolean

    @prop({required: false})
    continuedDate: Date

    @prop({required: false})
    completedDate: Date

    @prop({required: false})
    stoppedDate: Date

    @prop({required: false})
    discardedDate: Date

    @prop({required: true})
    taskType: TaskType = TaskType.CURRENT

    constructor(creationDate: Date, taskText: string, taskType: TaskType) {
        this.creationDate = creationDate
        this.continuedDate = creationDate
        this.stoppedDate = creationDate
        this.completedDate = creationDate
        this.discardedDate = creationDate
        this.taskText = taskText
        this.taskType = taskType
        this.localStored = false
    }

    static findByType(this: ModelType<Task>, taskType: TaskType) {
        return this.find({taskType: taskType})
    }
}

export const TaskModel = getModelForClass(Task)

