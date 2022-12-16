import { Controller, Get, Headers, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Post('/login')
  userLogin() {
    return {
      data: {
        token: 'token-admin',
      },
      code: 0,
      message: '登录成功',
    };
  }

  @Get('/info')
  userInfo(@Headers() header: any) {
    console.log(header);
    return {
      code: 0,
      data: {
        username: 'admin',
        roles: ['admin'],
      },
      message: '获取用户详情成功',
    };
  }
}
