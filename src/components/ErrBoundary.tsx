import { Component, type ReactNode } from 'react'

// Minimal error boundary that surfaces the error message (for diagnostics and
// graceful fallback around heavy 3D components).
export default class ErrBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { msg: string | null }
> {
  state = { msg: null as string | null }
  static getDerivedStateFromError(err: any) {
    return { msg: String(err?.message ?? err) }
  }
  render() {
    if (this.state.msg) {
      return (
        this.props.fallback ?? (
          <div className="flex h-full items-center justify-center p-4 text-center">
            <span className="font-display text-xs font-bold uppercase tracking-wide text-red-400">
              3D: {this.state.msg}
            </span>
          </div>
        )
      )
    }
    return this.props.children
  }
}
