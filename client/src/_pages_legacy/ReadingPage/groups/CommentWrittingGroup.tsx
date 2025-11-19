import {useCallback, useEffect, useMemo, useRef} from 'react'

import {useAuthStatesContext} from '@context'
import {useBlogSelector, useCommentActions} from '@redux'

import * as SV from '@shareValue'

import type {ChangeEvent, CSSProperties, FC, FocusEvent, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import './_styles/CommentWrittingGroup.scss'

type CommentWrittingGroupProps = DivCommonProps

export const CommentWrittingGroup: FC<CommentWrittingGroupProps> = ({className, style, ...props}) => {
  const {userAuth} = useAuthStatesContext()
  const commentContent = useBlogSelector(state => state.comment.commentContent)
  const {setCommentContent} = useCommentActions()

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const styleDiv: CSSProperties = useMemo(() => {
    return {
      ...style,
      cursor: userAuth === SV.AUTH_GUEST ? 'default' : 'text'
    }
  }, [userAuth, style])

  const _resizeTextarea = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '100px'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onChangeComment = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setCommentContent(e.target.value)
    _resizeTextarea()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onClickContainer = useCallback(
    (userAuth: number) => (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault()

      if (userAuth === SV.AUTH_GUEST) {
        alert(`로그인 이후 이용할 수 있어요`)
        setCommentContent('')
        textareaRef.current?.blur()
        return
      }

      textareaRef.current?.focus()
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const onFocusComment = useCallback(
    (userAuth: number) => (e: FocusEvent<HTMLTextAreaElement>) => {
      e.preventDefault()
      e.stopPropagation()

      if (userAuth === SV.AUTH_GUEST) {
        alert(`로그인 이후 이용할 수 있어요`)
        setCommentContent('')
        textareaRef.current?.blur()
        return
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  // 자동 초기화: textarea 높이
  useEffect(() => {
    _resizeTextarea()
  }, [commentContent]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className={`CommentWritting_Group  ${className || ''}`}
      onClick={onClickContainer(userAuth)}
      style={styleDiv}
      {...props} // ::
    >
      <textarea
        className="_writtingComment"
        disabled={userAuth === SV.AUTH_GUEST}
        onChange={onChangeComment}
        onClick={e => e.stopPropagation()}
        onFocus={onFocusComment(userAuth)}
        ref={textareaRef}
        value={commentContent} // ::
      />
    </div>
  )
}
