import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import {
    CreateSubscriptionConfigDto,
    UpdateSubscriptionConfigDto,
} from '../features/subscription/types/subscription.types';

@Injectable()
export class SubscriptionService {
    private readonly logger = new Logger(SubscriptionService.name);
    private readonly collectionName = 'plans';

    constructor(private readonly firebaseService: FirebaseService) { }

    async getPlans() {
        try {
            const snapshot = await this.firebaseService
                .getFirestore()
                .collection(this.collectionName)
                .orderBy('weight', 'asc')
                .get();

            if (snapshot.empty) {
                this.logger.warn('No plans found in database');
                return [];
            }

            return snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
        } catch (error) {
            this.logger.error('Error fetching plans', error);
            throw error;
        }
    }

    async createPlan(data: CreateSubscriptionConfigDto) {
        try {
            const planData = {
                ...data,
                is_active: true, // Default to active on creation
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            const docRef = await this.firebaseService
                .getFirestore()
                .collection(this.collectionName)
                .add(planData);

            return { id: docRef.id, ...planData };
        } catch (error) {
            this.logger.error('Error creating plan', error);
            throw error;
        }
    }

    async updatePlan(id: string, data: UpdateSubscriptionConfigDto) {
        try {
            const planRef = this.firebaseService
                .getFirestore()
                .collection(this.collectionName)
                .doc(id);

            const doc = await planRef.get();
            if (!doc.exists) {
                throw new Error('Plan not found');
            }

            const updateData = {
                ...data,
                updatedAt: new Date().toISOString(),
            };

            await planRef.update(updateData);

            return { id, ...doc.data(), ...updateData };
        } catch (error) {
            this.logger.error(`Error updating plan ${id}`, error);
            throw error;
        }
    }

    async deletePlan(id: string) {
        try {
            await this.firebaseService
                .getFirestore()
                .collection(this.collectionName)
                .doc(id)
                .delete();

            return { success: true, id };
        } catch (error) {
            this.logger.error(`Error deleting plan ${id}`, error);
            throw error;
        }
    }
}
