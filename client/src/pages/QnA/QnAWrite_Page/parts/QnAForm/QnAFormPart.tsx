import {useState, useCallback} from 'react'

import type {FC, FormEvent} from 'react'
import type {DivCommonProps} from '@prop'

import './QnAFormPart.scss'

type QnAFormPartProps = DivCommonProps & {}

export const QnAFormPart: FC<QnAFormPartProps> = ({...props}) => {
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [isPrivate, setIsPrivate] = useState<boolean>(false)

  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }, [])

  return (
    <div className={`QnAForm_Part`} {...props}>
      <form className="form_part" onSubmit={handleSubmit}>
        {/* 1. 제목 입력 */}
        <div className="form_item">
          <label htmlFor="qnaTitle">제목</label>
          <input
            type="text"
            id="qnaTitle"
            name="qnaTitle"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="질문 제목을 입력해주세요"
            required
            autoFocus
          />
        </div>

        {/* 2. 내용 입력 */}
        <div className="form_item">
          <label htmlFor="qnaContent">내용</label>
          <textarea
            id="qnaContent"
            name="qnaContent"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="질문 내용을 입력해주세요"
            required
            rows={10}
          />
        </div>

        {/* 3. 비공개 체크박스 */}
        <div className="form_item">
          <div className="form_checkbox">
            <input type="checkbox" checked={isPrivate} onClick={() => setIsPrivate(prev => !prev)} id="qnaIsPrivate" name="qnaIsPrivate" />
            <label htmlFor="qnaIsPrivate">비공개 질문글로 작성하기</label>
          </div>
        </div>

        {/* 4. 버튼 행 */}
        <div className="form_button_row">
          <button type="submit">작성하기</button>
        </div>
      </form>
    </div>
  )
}
