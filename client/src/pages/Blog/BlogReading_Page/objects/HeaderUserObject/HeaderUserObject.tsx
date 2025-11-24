import {useCallback} from 'react'

import {Icon} from '@component'
import {useBlogSelector, useFileActions} from '@redux'

import {HeaderUserModalGroup} from '../../groups'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import './HeaderUserObject.scss'

type HeaderUserObjectProps = DivCommonProps

export const HeaderUserObject: FC<HeaderUserObjectProps> = ({className, style, ...props}) => {
  const file = useBlogSelector(state => state.file.file)
  const isFileUserSelected = useBlogSelector(state => state.file.isFileUserSelected)
  const {selectFileUser} = useFileActions()

  const onClickUserName = useCallback((e: MouseEvent<HTMLParagraphElement>) => {
    e.preventDefault()
    e.stopPropagation()

    selectFileUser()

    window.getSelection()?.removeAllRanges()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onMouseDownUserName = useCallback((e: MouseEvent<HTMLParagraphElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  return (
    <div className={`HeaderUser_Object ${className || ''}`} style={style} {...props}>
      <Icon className={`_icon`} iconName="account_circle" />

      <div className={`_fileWrapper`}>
        <p className={`_userName`} onClick={onClickUserName} onMouseDown={onMouseDownUserName}>
          {file.userName}
        </p>
        <p className={`_createdAt`}>{new Date(file.createdAtValue).toLocaleDateString('ko-KR')}</p>

        {isFileUserSelected && <HeaderUserModalGroup />}
      </div>
    </div>
  )
}

