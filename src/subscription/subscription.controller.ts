import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';

import { SubscriptionService } from './subscription.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth/admin-auth.guard';
import type {
    CreateSubscriptionConfigDto,
    UpdateSubscriptionConfigDto,
} from '../features/subscription/types/subscription.types';

@Controller('subscription')
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) { }

    @Get('plans')
    getPlans() {
        return this.subscriptionService.getPlans();
    }

    @UseGuards(AdminAuthGuard)
    @Post('plans')
    createPlan(@Body() data: CreateSubscriptionConfigDto) {
        return this.subscriptionService.createPlan(data);
    }

    @UseGuards(AdminAuthGuard)
    @Put('plans/:id')
    updatePlan(@Param('id') id: string, @Body() data: UpdateSubscriptionConfigDto) {
        return this.subscriptionService.updatePlan(id, data);
    }

    @UseGuards(AdminAuthGuard)
    @Delete('plans/:id')
    deletePlan(@Param('id') id: string) {
        return this.subscriptionService.deletePlan(id);
    }
}
