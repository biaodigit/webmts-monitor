import { requestIdleCb, cancelIdleCb } from './helpers/idle-callback'
import { now } from './helpers/now'

const DEFAULT_MIN_TASK_TIME = 0;

class IdleQueue {
    private taskQueue: any[] = []
    private defaultMinTaskTime: number
    private ensureTaskRun: boolean
    private idleCallbackHandle: any = null
    private processing: boolean = false

    constructor({
        ensureTaskRun = false,
        defaultTaskTime = DEFAULT_MIN_TASK_TIME
    } = {}) {
        this.defaultMinTaskTime = defaultTaskTime
        this.ensureTaskRun = ensureTaskRun

        this.runTask = this.runTask.bind(this)
    }

    public pushTask(cb: any) {
        this.addTask(Array.prototype.push, cb)
    }

    private addTask(arrayMethod: any, task: any, minTaskTime = this.defaultMinTaskTime) {
        const state = {
            time: now(),
            visibilityState: document.visibilityState
        }

        arrayMethod.call(this.taskQueue, { task, state, minTaskTime })

        this.scheduleTasksToRun()
    }

    private scheduleTasksToRun() {
        if (!this.idleCallbackHandle) {
            this.idleCallbackHandle = requestIdleCb(this.runTask)
        }
    }

    private cancelScheduleRun() {
        cancelIdleCb(this.idleCallbackHandle)
        this.idleCallbackHandle = null
    }

    private runTask(deadline = undefined) {
        this.cancelScheduleRun()

        if (!this.processing) {
            this.processing = true
            while (this.hasPendingTasks() && !this.shouldYield(deadline, this.defaultMinTaskTime)) {
                const {task} = this.taskQueue.shift()
                task()
            }
            this.processing = false

            if(this.hasPendingTasks()){
                this.scheduleTasksToRun()
            }
        }
    }

    private hasPendingTasks(): boolean {
        return this.taskQueue.length > 0
    }

    private shouldYield(deadline: any, minTaskTime: number): boolean {
        return deadline && deadline.timeRemaining() <= minTaskTime
    }
}

export default IdleQueue