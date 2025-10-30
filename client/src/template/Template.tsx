import {useCallback} from 'react'
import {Outlet} from 'react-router-dom'

import {useCommentActions, useDirectoryActions, useFileActions, useModalStates} from '@redux'

import {Header} from './Header'
import {Lefter} from './Lefter'
import {Righter} from './Righter'
import {Footer} from './Footer'
import {LogInModal, SignUpModal} from './Modals'

import type {DragEvent, FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import * as V from '@value'

import './_styles/Template.scss'

type TemplateProps = DivCommonProps & {}

export const Template: FC<TemplateProps> = ({className, ...props}) => {
  const {modalName} = useModalStates()
  const {resetCommentOId_user, resetReplyOId_user, resetReplyOId_delete, resetReplyOId_edit} = useCommentActions()
  const {resetFileUser} = useFileActions()
  const {resetMoveDirOId, resetMoveFileOId} = useDirectoryActions()

  const onClickTemplate = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()

    // closeAlarm()

    resetCommentOId_user()
    resetReplyOId_delete()
    resetReplyOId_edit()
    // unselectEditComment() // 댓글 수정중일때 다른곳 클릭해도 유지한다.
    // unselectEditReply() // 댓글 수정중일때 다른곳 클릭해도 유지한다.
    resetFileUser()
    resetMoveDirOId()
    resetMoveFileOId()
    // unselectReplyComment() // 대댓글 작성중일때 다른곳 클릭해도 유지한다.
    // unselectReplyReply() // 대댓글 수정중일때 다른곳 클릭해도 유지한다.
    resetReplyOId_user()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onDragStartTemplate = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation()

    // closeAlarm()

    resetCommentOId_user()
    resetReplyOId_delete()
    resetReplyOId_edit()
    // unselectEditComment() // 댓글 수정중일때 다른곳 클릭해도 유지한다.
    // unselectEditReply() // 댓글 수정중일때 다른곳 클릭해도 유지한다.
    resetFileUser()
    resetMoveDirOId()
    resetMoveFileOId()
    // unselectReplyComment() // 대댓글 작성중일때 다른곳 클릭해도 유지한다.
    // unselectReplyReply() // 대댓글 수정중일때 다른곳 클릭해도 유지한다.
    resetReplyOId_user()
  }, [])

  return (
    <div className={`Template ${className || ''}`} onClick={onClickTemplate} onDragStart={onDragStartTemplate} {...props}>
      {/* 1. 템플릿 레이아웃 영역 */}
      <Header />
      <div className="Body">
        <Lefter />
        <div className="PageArea">
          <Outlet />
        </div>
        <Righter />
      </div>
      <Footer />

      {/* 2. 모달 영역 */}
      {modalName === V.MODAL_LOG_IN && <LogInModal />}
      {modalName === V.MODAL_SIGN_UP && <SignUpModal />}
    </div>
  )
}
