import {PassportStrategy} from '@nestjs/passport'
import {Strategy} from 'passport-google-oauth20'
import {Injectable} from '@nestjs/common'
import {serverIP, serverPort} from '../secret/urlInfo'
import {GoogleUserType} from '../types/types'
import {googleClientId, googleClientSecret} from '../secret/googles'

console.log(`    YOU NEED TO ACTIVATE GOOGLE AUTHENTICATION IN GOOGLE CONSOLE`)
console.log(`    YOU NEED TO ACTIVATE GOOGLE AUTHENTICATION IN GOOGLE CONSOLE`)
console.log(`    YOU NEED TO ACTIVATE GOOGLE AUTHENTICATION IN GOOGLE CONSOLE`)

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: `http://127.0.0.1:${serverPort}/client/auth/signUpGoogleCallback`,
      scope: ['email', 'profile']
    })
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
    const {name, emails, photos} = profile
    const user: GoogleUserType = {
      userId: emails[0].value,
      userName: name.givenName,
      picture: photos[0].value
    }

    console.log({user})

    return user
  }
}
