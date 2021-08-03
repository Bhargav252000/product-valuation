import {
  Body,
  Controller,
  Get,
  Patch,
  Param,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';
// All dto's
import { CreateReportDto } from './dto/create-report.dto';
import { ApproveReportDto } from './dto/approve-report.sto';
import { ReportDto } from './dto/report.dto';
import { GetEstimateDto } from './dto/get-estimate.dto';

import { ReportsService } from './reports.service';
import { CurrentUser } from '../users/decorators/current-user.decorator';
// interceptor
import { Serialize } from '../interceptors/serialize.interceptor';
// Entity
import { User } from '../users/users.entity';
//Guards
import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto) // this custom decorator will restrict on what information must be passed forward...
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return this.reportsService.changeApproval(id, body.approved);
  }

  @Get()
  // @UseGuards(AuthGuard)
  getEstimate(@Query() query: GetEstimateDto) {
    return this.reportsService.createEstimate(query);
  }
}
