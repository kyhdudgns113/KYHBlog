import {useCallback} from 'react'
import {Icon} from '@component'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'
import type {Setter} from '@type'

import '../_styles/Grp_DirInfo.scss'

type DirInfoGroupProps = DivCommonProps & {dirName: string; isOpen: boolean; setIsOpen: Setter<boolean>}

export const DirInfoGroup: FC<DirInfoGroupProps> = ({dirName, isOpen, setIsOpen, className, ...props}) => {
  const onClickRow = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setIsOpen(prev => !prev)
  }, []) // eslint-disable-line

  return (
    <div className={`DirInfo_Group ${className || ''}`} onClick={onClickRow} {...props}>
      {/* 1. 오픈 여부 아이콘 */}
      <Icon className={`_icon_group`} iconName={`${isOpen ? 'arrow_drop_down' : 'arrow_right'}`} />

      {/* 2. 디렉토리 이름 */}
      <p className={`_name_group`}>{dirName}</p>
    </div>
  )
}
