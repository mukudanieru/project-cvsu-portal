import { Link } from '@tanstack/react-router'

const EncodeTermSubmitted = () => {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
      <span>Grades already submitted for this term.</span>
      <Link to="/grades" className="text-primary underline underline-offset-2">
        View in grades
      </Link>
    </div>
  )
}

export default EncodeTermSubmitted
