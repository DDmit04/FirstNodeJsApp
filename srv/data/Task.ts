import {TaskType} from "./TaskType";

export class Task {
    private readonly _id: number | string
    private _taskText: string = "no text"
    private _taskType: TaskType = TaskType.CURRENT

    constructor(id: number | string, taskText: string, taskType: TaskType) {
        this._id = id;
        this._taskText = taskText;
        this._taskType = taskType;
    }

    get id(): number | string {
        return this._id;
    }

    set taskText(value: string) {
        this._taskText = value;
    }

    set taskType(value: TaskType) {
        this._taskType = value;
    }

    get taskText(): string {
        return this._taskText;
    }

    get taskType(): TaskType {
        return this._taskType;
    }
}