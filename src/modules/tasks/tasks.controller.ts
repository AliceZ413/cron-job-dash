import { Body, Controller, Get, Post, Query } from '@nestjs/common';
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
      message: 'success',
    };
  }

  @Post('/schedule/createOrEdit')
  async createOrEditSchedule(
    @Body('job_id') job_id: number,
    @Body('cron') cron: string,
    @Body('jobName') jobName: string,
    @Body('jobHandler') jobHandler: string,
    @Body('params') params: string,
    @Body('desciption') desciption: string,
  ) {
    await this.tasksService.createOrEditSchedule({
      job_id,
      cron,
      jobName,
      jobHandler,
      params,
      desciption,
    });
    return {
      message: 'success',
    };
  }

  @Post('/schedule/delete')
  async deleteSchedule(@Body('job_id') job_id: number) {
    await this.tasksService.deleteSchedule({ job_id });
    return {
      message: 'success',
    };
  }

  @Post('/schedule/updateStatus')
  async updateScheduleStatus(
    @Body('job_id') job_id: number,
    @Body('status') status: number,
  ) {
    await this.tasksService.updateScheduleStatus({ job_id, status });
    return {
      message: 'success',
    };
  }
}
