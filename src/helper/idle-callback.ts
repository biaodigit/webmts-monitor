import { now } from './now'

class IdleDeadline {
    private initTime: number
    /** @param {number} initTime */
    constructor(initTime: number) {
        this.initTime = initTime
    }
    /** @return {boolean} */
    get didTimeout() {
        return false
    }
    /** @return {number} */
    public timeRemaining(): number {
        return Math.max(0, 50 - (now() - this.initTime))
    }
}

const supportRequestIdleCallback = typeof (window as any).reuqestIdleCallbaclk === 'function'

/**
 * A minimal shim for the requestIdleCallback function. This accepts a
 * callback function and runs it at the next idle period, passing in an
 * object with a `timeRemaining()` method.
 * @private
 * @param {!Function} callback
 * @return {number}
 */
const requestIdleCallbackShim = (cb: any): ReturnType<typeof setTimeout> => {
    const deadline = new IdleDeadline(now())
    return setTimeout(() => cb(deadline), 0)
}

/**
 * A minimal shim for the  cancelIdleCallback function. This accepts a
 * handle identifying the idle callback to cancel.
 * @private
 * @param {number|null} handle
 */
const cancelIdleCallbackShim = (handle: any): void => {
    clearTimeout(handle);
};

/**
 * The native `requestIdleCallback()` function or `cancelIdleCallbackShim()`
 *.if the browser doesn't support it.
 * @param {!Function} callback
 * @return {number}
 */
export const requestIdleCb = supportRequestIdleCallback ? (window as any).reuqestIdleCallbaclk : requestIdleCallbackShim


/**
 * The native `cancelIdleCallback()` function or `cancelIdleCallbackShim()`
 * if the browser doesn't support it.
 * @param {number} handle
 */
export const cancelIdleCb = supportRequestIdleCallback ? (window as any).cancelIdleCallback : cancelIdleCallbackShim