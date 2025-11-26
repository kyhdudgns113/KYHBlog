import {useCallback, useEffect, useState} from 'react'

import {Modal} from '@component'
import {useDirectoryCallbacksContext} from '@context'
import {useBlogSelector, useDirectoryActions, useModalActions} from '@redux'

import type {KeyboardEvent, MouseEvent} from 'react'

import './ModalSetDirectory.scss'

export function ModalSetDirectory() {
  const directories = useBlogSelector(state => state.directory.directories)
  const editDirOId = useBlogSelector(state => state.directory.dirOId_editDir)

  const {initDirOId_editDir} = useDirectoryActions()
  const {closeModal} = useModalActions()

  const {changeDirName, deleteDir} = useDirectoryCallbacksContext()

  const [dirName, setDirName] = useState<string>('')

  const onClickDelete = useCallback(
    (dirOId: string) => (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      e.preventDefault()
      deleteDir(dirOId).then(success => {
        if (success) {
          initDirOId_editDir()
          closeModal()
        }
      })
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const onClickSubmit = useCallback(
    (dirOId: string, dirName: string) => (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      e.preventDefault()

      // 모달 닫기도 changeDirName 에서 실행한다.
      changeDirName(dirOId, dirName).then(success => {
        if (success) {
          initDirOId_editDir()
          closeModal()
        } // ::
        else {
          // changeDirName 에서 에러 메시지 출력
        }
      })
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const onKeyDownModal = useCallback(
    (dirOId: string, dirName: string) => (e: KeyboardEvent<HTMLDivElement>) => {
      e.stopPropagation()

      if (e.key === 'Enter') {
        e.preventDefault()
        onClickSubmit(dirOId, dirName)
      } // ::
      else if (e.key === 'Escape') {
        e.preventDefault()
        initDirOId_editDir()
      }
    },
    [initDirOId_editDir, onClickSubmit]
  )

  // 초기화: dirName
  useEffect(() => {
    if (directories[editDirOId]) {
      setDirName(directories[editDirOId].dirName)
    } // ::
    else {
      setDirName('--이름 로딩 오류--')
    }
  }, [directories, editDirOId])

  return (
    <Modal onClose={() => {}} onKeyDown={onKeyDownModal(editDirOId, dirName)}>
      <div className="ModalSetDir_Main" tabIndex={0}>
        {/* 1. Title */}
        <p className="_Title">폴더 이름 변경</p>

        {/* 2. Input: Name */}
        <div className="_InputRow">
          <p className="__Label">폴더 이름</p>
          <input
            className="__Input"
            onChange={e => setDirName(e.currentTarget.value)}
            placeholder="폴더 이름(빈칸이면 변경X)"
            value={dirName} // ::
          />
        </div>

        {/* 3. Button: Save */}
        <div className="_ButtonRow">
          <button className="AppButton_Sakura" onClick={onClickSubmit(editDirOId, dirName)}>
            저장
          </button>
          <button className="AppButton_Sakura" onClick={onClickDelete(editDirOId)}>
            삭제
          </button>
          <button className="AppButton_Sakura" onClick={closeModal}>
            취소
          </button>
        </div>
      </div>
    </Modal>
  )
}
