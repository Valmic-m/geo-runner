export interface ParseResult<T> {
  success: boolean
  data?: T
  errors: string[]
}

export interface WorkflowResult<T> {
  success: boolean
  output?: T
  errors: string[]
}
