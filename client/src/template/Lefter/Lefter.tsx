import {useTemplateStates} from '@redux'

import {ToggleButton} from './buttons'
import {ButtonRowPart, DirectoryListPart} from './parts'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './_styles/_Lefter.scss'

type LefterProps = DivCommonProps & {}

export const Lefter: FC<LefterProps> = ({className, ...props}) => {
  const {isLefterOpen} = useTemplateStates()

  return (
    <div className={`Lefter ${className || ''}`} {...props}>
      <div className={`_body_lefter ${isLefterOpen ? '_open' : '_close'}`}>
        <ButtonRowPart />
        <DirectoryListPart />
      </div>
      <ToggleButton />
    </div>
  )
}
