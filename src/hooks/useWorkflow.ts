import { useState, useCallback } from 'react'

interface WorkflowState<T> {
  result: T | null
  error: string | null
  isRunning: boolean
}

export function useWorkflow<TInput, TOutput>(
  workflowFn: (input: TInput) => TOutput,
) {
  const [state, setState] = useState<WorkflowState<TOutput>>({
    result: null,
    error: null,
    isRunning: false,
  })

  const run = useCallback(
    (input: TInput) => {
      setState({ result: null, error: null, isRunning: true })
      try {
        const result = workflowFn(input)
        setState({ result, error: null, isRunning: false })
      } catch (err) {
        setState({
          result: null,
          error: err instanceof Error ? err.message : 'An error occurred',
          isRunning: false,
        })
      }
    },
    [workflowFn],
  )

  const reset = useCallback(() => {
    setState({ result: null, error: null, isRunning: false })
  }, [])

  return { ...state, run, reset }
}
