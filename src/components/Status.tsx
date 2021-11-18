import './status.css'

export default function Status({ status, theme, className }: { status: string, theme: string, className?: string }) {
    return (
        <div className={`${status === 'Paid' ? "paid" : "pending"} ${theme === 'night' ? 'night-status' : ''} status d-flex align-items-center fw-bold ${className}`}>
            <div className="bullet rounded-circle"></div>
            <div>{status}</div>
        </div>
    )
}