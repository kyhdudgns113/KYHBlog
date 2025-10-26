import type {FC, PropsWithChildren} from 'react'
import type {DivCommonProps} from '@prop'

import './_style.scss'

export type ModalProps = DivCommonProps & {
  onClose: () => void
}

export const Modal: FC<PropsWithChildren<ModalProps>> = ({
  children,
  onClose,
  // ::
  className,
  ...props
}) => {
  return (
    <div
      className="MODAL_Container"
      onClick={e => {
        e.stopPropagation()
        onClose()
      }}
    >
      <div
        autoFocus
        className={`MODAL_Contents ${className || ''}`}
        onClick={e => e.stopPropagation()}
        tabIndex={0}
        {...props} // ::
      >
        {children}
      </div>
    </div>
  )
}
