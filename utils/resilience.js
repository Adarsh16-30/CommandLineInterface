
export async function executeWithRetry(asynchronousFunction, maximumRetries = 3, initialDelayMs = 500) {
    for (let currentAttempt = 0; currentAttempt < maximumRetries; currentAttempt++) {
        try {
            return await asynchronousFunction();
        } catch (caughtError) {
            if (currentAttempt === maximumRetries - 1) throw caughtError;
            await new Promise(resolveTimer => setTimeout(resolveTimer, initialDelayMs * Math.pow(2, currentAttempt)));
        }
    }
}

export const createTimeoutGuard = (timeoutMilliseconds) => new Promise((_, rejectPromise) =>
    setTimeout(() => rejectPromise(new Error(`Operation timed out after ${timeoutMilliseconds}ms`)), timeoutMilliseconds)
);

export async function executeWithTimeout(asynchronousPromise, timeoutMilliseconds = 10000) {
    return Promise.race([asynchronousPromise, createTimeoutGuard(timeoutMilliseconds)]);
}
