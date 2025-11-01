import {useCallback, useEffect, useRef, useState} from 'react'
import {useCommentStates} from '@redux'
import {SubmitEditReplyButton} from '../buttons'
import {COMMENT_MAX_LENGTH} from '@shareValue'

import type {ChangeEvent, CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'
import * as LT from '@localizeType'

import './_styles/ReplyContentF.scss'

type ReplyContentFProps = DivCommonProps & {reply: LT.ReplyTypeLocal}

/**
 * 댓글의 내용과 수정중이면 제출버튼을 표시하는 컴포넌트이다.
 *
 *   - 수정중이 아니면 댓글의 내용만 표시한다
 *   - 수정중이면 수정중인 내용, 댓글 길이, 제출버튼이 표시된다
 */
export const ReplyContentF: FC<ReplyContentFProps> = ({reply, className, style, ...props}) => {
  const {replyOId_edit} = useCommentStates()

  const [content, setContent] = useState<string>('')

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const isEditing = replyOId_edit === reply.replyOId
  const minHeight = '100px'

  const styleContentHeight: CSSProperties = {
    // minHeight 만 여기서 관리한다.
    minHeight
  }

  const _resizeTextarea = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = minHeight
      textareaRef.current.style.height = `${Math.max(100, textareaRef.current.scrollHeight)}px`
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onChangeContent = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    _resizeTextarea()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // 초기화: content (replyOId_edit 가 변경되면 content 를 초기화한다.)
  useEffect(() => {
    setContent(reply.content)
  }, [replyOId_edit]) // eslint-disable-line react-hooks/exhaustive-deps

  // 자동 초기화: textarea 높이
  useEffect(() => {
    _resizeTextarea()
  }, [content]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`ReplyContent_F ${className || ''}`} style={style} {...props}>
      {/* 1. 댓글 내용(수정중이지 않은 경우) */}
      {!isEditing && (
        <div className="_replyContent" style={styleContentHeight}>
          <b>{reply.targetUserName}</b>
          {reply.content}
        </div>
      )}

      {/* 2. 수정중인 댓글 내용(수정중인 경우) */}
      {isEditing && <textarea className="_replyContent" onChange={onChangeContent} ref={textareaRef} style={styleContentHeight} value={content} />}

      {/* 3. 댓글 길이 표시, 제출 버튼(수정중인 경우) */}
      {isEditing && (
        <div className="_editing_extra_row">
          <div className="__editing_reply_length">
            {content.length} / {COMMENT_MAX_LENGTH}
          </div>
          <SubmitEditReplyButton reply={reply} content={content} />
        </div>
      )}
    </div>
  )
}
