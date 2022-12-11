import { Controller, Get, Post, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('/schedule/list')
  async getScheduleList(
    @Query('page') page: number,
    @Query('size') size: number,
  ) {
    console.log(page, size);

    const result = await this.tasksService.scheduleList({ page, size });
    return {
      data: result,
    };
  }

  @Post('/schedule/createOrEdit')
  async createOrEditSchedule() {
    await this.tasksService.createOrEditSchedule({
      cron: '*/5 * * * * *',
      jobName: 'testHandler',
      jobHandler: 'jobHandler',
      params: '',
      desciption: '',
    });
    return {
      message: 'success',
    };
  }
}
