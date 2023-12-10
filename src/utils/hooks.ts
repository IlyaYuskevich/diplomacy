import * as hooks from "preact/hooks";

export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? hooks.useLayoutEffect : hooks.useEffect

export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = hooks.useRef(callback)

  // Remember the latest callback if it changes.
  useIsomorphicLayoutEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  hooks.useEffect(() => {
    // Don't schedule if no delay is specified.
    // Note: 0 is a valid value for delay.
    if (!delay && delay !== 0) {
      return
    }

    const id = setInterval(() => savedCallback.current(), delay)

    return () => clearInterval(id)
  }, [delay])
}