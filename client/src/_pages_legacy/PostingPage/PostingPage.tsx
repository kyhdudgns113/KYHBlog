import {CheckAuth} from '@guard'

import {ManageStructurePart, EditingFilePart} from './parts'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './PostingPage.scss'

type PostingPageProps = DivCommonProps & {reqAuth: number}

export const PostingPage: FC<PostingPageProps> = ({reqAuth, className, ...props}) => {
  return (
    <CheckAuth reqAuth={reqAuth}>
      <div className={`PostingPage ${className || ''}`} {...props}>
        <ManageStructurePart />
        <EditingFilePart />
      </div>
    </CheckAuth>
  )
}
