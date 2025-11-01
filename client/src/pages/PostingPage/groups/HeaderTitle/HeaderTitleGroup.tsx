import {useCallback} from 'react'

import {useFileActions, useFileStates} from '@redux'

import type {ChangeEvent, FC} from 'react'
import type {DivCommonProps} from '@prop'

import './HeaderTitleGroup.scss'

type HeaderTitleGroupProps = DivCommonProps & {}

export const HeaderTitleGroup: FC<HeaderTitleGroupProps> = ({className, ...props}) => {
  const {fileName} = useFileStates()
  const {setFileName} = useFileActions()

  const onChangeName = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setFileName(e.currentTarget.value)
    },
    [setFileName]
  )

  return (
    <div className={`HeaderTitle_Group ${className || ''}`} {...props}>
      <input value={fileName} onChange={onChangeName} />
    </div>
  )
}
