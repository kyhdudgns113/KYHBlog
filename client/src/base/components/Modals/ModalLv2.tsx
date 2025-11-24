import type {FC, PropsWithChildren} from 'react'
import type {DivCommonProps} from '@prop'

import './_style.scss'

export type ModalLv2Props = DivCommonProps & {
  onClose: () => void
}

/**
 * Modal 에서 z-index 만 50 -> 51 로 바꿨다.
 */
export const ModalLv2: FC<PropsWithChildren<ModalLv2Props>> = ({
  children,
  onClose,
  // ::
  className,
  ...props
}) => {
  // style 에 스타일 직접 넣지 않는다.
  // 외부에서 style 조절하고 싶을때 마음껏 바꿀 수 있도록 한다.
  return (
    <div
      className={`MODAL_LV2`}
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
