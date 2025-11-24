import {useState} from 'react'
import {ChatInputGroup, ChatSubmitGroup} from '../../groups'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './ChatSubmitObject.scss'

type ChatSubmitObjectProps = DivCommonProps & {}

export const ChatSubmitObject: FC<ChatSubmitObjectProps> = ({className, style, ...props}) => {
  const [content, setContent] = useState<string>('')

  return (
    <div className={`ChatSubmit_Object ${className || ''}`} style={style} {...props}>
      <ChatInputGroup value={content} setter={setContent} />
      <ChatSubmitGroup value={content} setter={setContent} />
    </div>
  )
}

