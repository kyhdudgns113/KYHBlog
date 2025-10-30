import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import {Icon} from '@component'
import {useDirectoryCallbacksContext} from '@context'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type RefreshButtonProps = DivCommonProps & {}

export const RefreshButton: FC<RefreshButtonProps> = ({className, style, ...props}) => {
  const {loadRootDirectory} = useDirectoryCallbacksContext()

  const navigate = useNavigate()
  const onClickIcon = useCallback(() => {
    loadRootDirectory() // ::
      .then(res => {
        if (res) {
          navigate('/main/posting')
        }
      })
  }, [loadRootDirectory, navigate])

  return (
    <Icon
      className={`RefreshButton _icon ${className || ''}`}
      iconName="refresh"
      onClick={onClickIcon}
      style={style}
      {...props} // ::
    />
  )
}
