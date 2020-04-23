import express, {Application, Request, Response} from 'express'
import path from "path"
import {taskActionValidate, taskAddValidate, taskFetchValidate, validateRequest} from './TaskValidator'
import {Task} from "./data/Task";
import {TaskType} from "./data/TaskType";

const app = express()

app.use(express.static(path.resolve("dist/")))

app.use(express.json());

let data: Array<Task> = [
    new Task(1, "lul", TaskType.CURRENT),
    new Task(2, "zulul", TaskType.CURRENT),
    new Task(3, "megalul", TaskType.CURRENT)
]

app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.resolve("dist/", "index.html"))
})

app.get("/api/get", taskFetchValidate(), validateRequest, (req: Request, res: Response) => {
    let taskListType: TaskType = TaskType[req.query.taskType as keyof typeof TaskType]
    let resultData: Array<Task> = []
    resultData = data.filter(t => t.taskType == taskListType)
    res.json(resultData)
})

app.post("/api/add", taskAddValidate(), validateRequest, (req: Request, res: Response) => {
    let taskType: TaskType = TaskType[req.body.taskType as keyof typeof TaskType]
    let taskText: string = req.body.taskText
    let newTask = new Task(0, taskText, taskType)
    data.push(newTask)
    res.status(201)
})

app.patch("/api/stop", taskActionValidate(), validateRequest, (req: Request, res: Response) => {
    let index: number = data.findIndex(t => t.id == req.query.id)
    data[index].taskType = TaskType.STOPED
    res.json(data[index])
})

app.patch("/api/continue", taskActionValidate(), validateRequest, (req: Request, res: Response) => {
    let index: number = data.findIndex(t => t.id == req.query.id)
    data[index].taskType = TaskType.CURRENT
    res.json(data[index])
})

app.patch("/api/complete", taskActionValidate(), validateRequest, (req: Request, res: Response) => {
    let index: number = data.findIndex(t => t.id == req.query.id)
    data[index].taskType = TaskType.COMPLETED
    res.json(data[index])
})

app.patch("/api/discard", taskActionValidate(), validateRequest, (req: Request, res: Response) => {
    let index: number = data.findIndex(t => t.id == req.query.id)
    data[index].taskType = TaskType.DISCARDED
    res.json(data[index])
})

app.patch("/api/delete", taskActionValidate(), validateRequest, (req: Request, res: Response) => {
    let index: number = data.findIndex(t => t.id == req.query.id)
    data.slice(index, 1)
})

app.listen(process.env.PORT || 3000, () => console.log('running...'))
