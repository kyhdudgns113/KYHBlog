import type {DetailedHTMLProps, HTMLAttributes} from 'react'

export type CommonProps<T> = DetailedHTMLProps<HTMLAttributes<T>, T>

export type ButtonCommonProps = CommonProps<HTMLButtonElement>
export type DivCommonProps = CommonProps<HTMLDivElement>
export type ImageCommonProps = CommonProps<HTMLImageElement>
export type InputCommonProps = CommonProps<HTMLInputElement>
export type OptionCommonProps = CommonProps<HTMLOptionElement>
export type ParagraphCommonProps = CommonProps<HTMLParagraphElement>
export type SelectCommonProps = CommonProps<HTMLSelectElement>
export type SpanCommonProps = CommonProps<HTMLSpanElement>
export type TableBodyCommonProps = CommonProps<HTMLTableSectionElement>
export type TableCellCommonProps = CommonProps<HTMLTableCellElement>
export type TableCommonProps = CommonProps<HTMLTableElement>
export type TableHeadCommonProps = CommonProps<HTMLTableSectionElement>
export type TableRowCommonProps = CommonProps<HTMLTableRowElement>
export type TableSectionCommonProps = CommonProps<HTMLTableSectionElement>
export type TextareaCommonProps = CommonProps<HTMLTextAreaElement>
export type TextCommonProps = ParagraphCommonProps
