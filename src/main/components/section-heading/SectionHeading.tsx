import { ReactNode } from 'react'
import '../../css/shared/separator-hr.css'

interface SectionHeadingProps {
  className?: string
  children: ReactNode
}

export function SectionHeading({ className, children }: SectionHeadingProps) {
  return (
    <div className='section-heading'>
      <h3 className={className}>{children}</h3>
      <hr className='section-divider' />
    </div>
  )
}
