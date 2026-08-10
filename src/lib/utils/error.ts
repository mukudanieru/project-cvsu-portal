export interface ErrorInterface {
  error: {
    type: 'general' | 'field'
    title: string
    description: string
    field?: string
  }
}
