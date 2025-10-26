import {NestFactory} from '@nestjs/core'
import {AppModule} from './app.module'
import {CorsOptions} from '@nestjs/common/interfaces/external/cors-options.interface'
import {clientIP, clientTestIP, serverPort} from './common/secret'
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger'
import {GlobalExceptionFilter} from './common/filters/global-exception.filter'

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule)

    // 전역 예외 필터 설정 (DB 연결 풀 초과 등 에러 처리)
    app.useGlobalFilters(new GlobalExceptionFilter())

    // CORS 설정
    const corsOptions: CorsOptions = {
      origin: [clientIP, clientTestIP],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true
    }

    app.enableCors(corsOptions)

    // Swagger 설정
    const config = new DocumentBuilder()
      .setTitle('KYHBlog API')
      .setDescription('KYHBlog API Description')
      .setVersion('1.0') // ::
      .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document)

    // 서버 실행
    await app.listen(serverPort)
    // ::
  } catch (errObj) {
    throw errObj
  }
}
bootstrap()
