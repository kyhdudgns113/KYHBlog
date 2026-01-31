import {useCallback} from 'react'

import {Icon} from '@component'
import {NewFile} from '../../components'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'
import type {Setter} from '@type'

import './DirInfoGroup.scss'

type DirInfoGroupProps = DivCommonProps & {dirName: string; dirOId: string; isOpen: boolean; setIsOpen: Setter<boolean>}

export const DirInfoGroup: FC<DirInfoGroupProps> = ({dirName, dirOId, isOpen, setIsOpen, ...props}) => {
  const onClickRow = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setIsOpen(prev => !prev)
  }, []) // eslint-disable-line

  return (
    <div className={`DirInfo_Group`} onClick={onClickRow} {...props}>
      {/* 1. 오픈 여부 아이콘 */}
      <Icon className={`_icon_group`} iconName={`${isOpen ? 'arrow_drop_down' : 'arrow_right'}`} />

      {/* 2. 디렉토리 이름 */}
      <p className={`_name_group`}>{dirName}</p>

      {/* 3. 새 파일 있는지 표시할 아이콘 */}
      <NewFile dirOId={dirOId} />
    </div>
  )
}
