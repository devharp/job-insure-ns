import {
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRegistrationService } from '../user-registration/user-registration.service';
import { PaginateResult } from 'mongoose';
import { User } from 'src/schema/users/user.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@Roles('admin')
@Controller('admin/manage-users')
export class AdminController {
  constructor(
    private readonly userRegistrationService: UserRegistrationService,
  ) {}
  @Get()
  async fetchUsers(
    @Query('to') to?: string,
    @Query('page') page?: number,
    @Query('perPage') perPage?: number,
    @Query('active') active?: Boolean,
  ): Promise<PaginateResult<User>> {
    return this.userRegistrationService.findAll(to, page, perPage, active);
  }

  @Put('approval/:id')
  async updateApproval(
    @Param('id') requestId: string,
    @Query('approval') approval: Boolean,
  ) {
    return this.userRegistrationService.updateApproval(requestId, approval);
  }

  @Delete('/remove/:id')
  async removeUser(@Param('id') deleteId: string) {
    return this.userRegistrationService.delete(deleteId);
  }
}
