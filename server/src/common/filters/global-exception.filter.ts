import {ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Injectable} from '@nestjs/common'
import {Request, Response} from 'express'

@Injectable()
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = '서버 내부 오류가 발생했습니다.'
    let error = 'Internal Server Error'

    // HTTP 예외 처리
    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const exceptionResponse = exception.getResponse()

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message = (exceptionResponse as any).message || message
      }
    }
    // DB 연결 관련 에러 처리
    else if (exception instanceof Error) {
      const errorMessage = exception.message.toLowerCase()

      if (
        errorMessage.includes('too many connections') ||
        errorMessage.includes('er_con_count_error') ||
        errorMessage.includes('db 연결 획득 타임아웃') ||
        errorMessage.includes('connection pool is closed') ||
        errorMessage.includes('connection lost')
      ) {
        status = HttpStatus.SERVICE_UNAVAILABLE
        message = '서비스 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.'
        error = 'Service Temporarily Unavailable'

        console.error(`[DB 연결 풀 초과] ${request.method} ${request.url}: ${exception.message}`)
      } else {
        console.error(`[Unhandled Exception] ${request.method} ${request.url}: ${exception.message}`)
      }
    }

    // 에러 응답 전송
    response.status(status).json({
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method
    })
  }
}
