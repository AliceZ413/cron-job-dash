import { Controller, Get } from '@nestjs/common';

@Controller('login')
export class LoginController {
  @Get('/code')
  getCode() {
    return {
      code: 0,
      data: 'http://dummyimage.com/100x40/dcdfe6/000000.png&text=V3Admin',
      message: '获取验证码成功',
    };
  }
}
