import {Request, Response} from "express";
import {Task, TaskModel, TaskType} from "../data/Task";
import {taskActionValidate, taskAddValidate, taskDeleteValidate, validateRequest} from "../validation/TaskValidator"
import {AbstractController} from "./AbstractController";
import {User, UserModel} from "../data/User";

export class TaskController extends AbstractController {

    constructor() {
        super();
    }

    protected initMethods() {
        this.router.get('/', this.getTasks)
        this.router.post('/', taskAddValidate(), validateRequest, this.addTask)
        this.router.delete('/', taskDeleteValidate(), validateRequest, this.deleteTask)
        this.router.patch('/', taskActionValidate(), validateRequest, this.patchTask)
    }

    private async getTasks(req: Request, res: Response) {
        if (req.user != null) {
            let sessionUser = await req.user as User
            res.json(sessionUser.tasks)
        } else {
            res.json({})
        }
    }

    private async addTask(req: Request, res: Response) {
        let taskType: TaskType = TaskType[req.body.taskType as keyof typeof TaskType]
        let taskText: string = req.body.taskText
        let taskCreationDate: Date = req.body.creationDate
        let newTask = new Task(taskCreationDate, taskText, taskType)
        let createdTask = await TaskModel.create(newTask)
        if (req.user != null) {
            let sessionUser = req.user as User
            await UserModel.updateOne({id: sessionUser.id}, {$push: {tasks: createdTask._id}})
        }
        createdTask = createdTask.toObject()
        delete createdTask.__v
        res.status(201)
        res.json(createdTask)
    }

    private async deleteTask(req: Request, res: Response) {
        const task = await TaskModel.findById(req.query.id)
        if(task != null) {
            await task.remove()
        }
        res.end()
    }

    private async patchTask(req: Request, res: Response) {
        let dateFieldToUpdate = 'continuedDate'
        let date = new Date()
        if (req.body.newTaskType == TaskType.CURRENT) {
            dateFieldToUpdate = 'continuedDate'
        } else if (req.body.newTaskType == TaskType.STOPPED) {
            dateFieldToUpdate = 'stoppedDate'
        } else if (req.body.newTaskType == TaskType.DISCARDED) {
            dateFieldToUpdate = 'discardedDate'
        } else if (req.body.newTaskType == TaskType.COMPLETED) {
            dateFieldToUpdate = 'completedDate'
        }
        let task = await TaskModel.findByIdAndUpdate({_id: req.body.id}, {taskType: req.body.newTaskType as TaskType, [dateFieldToUpdate]: date}, {new: true}).catch(() => {
            res.json({errors: [{msg: "data base error!"}]})
        })
        res.json(task)
    }
}