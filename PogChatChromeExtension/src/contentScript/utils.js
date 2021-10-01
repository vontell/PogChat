import { useEffect, useRef } from 'react'

export function useInterval(callback, delay) {
    const savedCallback = useRef(callback)

    // Remember the latest callback if it changes.
    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    // Set up the interval.
    useEffect(() => {
        // Don't schedule if no delay is specified.
        if (delay === null) {
            return
        }

        const id = setInterval(() => savedCallback.current(), delay)

        return () => clearInterval(id)
    }, [delay])
}

export async function getStreamInfo() {

    while (true) {
        let streamNameElement = document.querySelector('.channel-info-content h1');
        let categoryElement = document.querySelector('[data-a-target=stream-game-link]');
        if (!streamNameElement || !categoryElement) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
        }
        let path = window.location.pathname;
        let parts = path.split('/');
        let streamId = parts.pop() || parts.pop();  // handle potential trailing slash

        let streamName = streamNameElement.innerText;
        let category = categoryElement.innerText;
        return {
            streamName,
            streamId,
            category
        }
    }

}