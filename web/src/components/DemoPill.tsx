import './demo-pill.css'

/** Marks a screenshot taken with sample data, not a client's real records. */
export function DemoPill({ label }: { label: string }) {
  return <em className="demo-pill">{label}</em>
}
