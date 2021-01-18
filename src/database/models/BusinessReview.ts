import { Model, ModelObject } from 'objection';

export class BusinessReview extends Model {
    userId!: string;
    businessId!: string;
    rating!: string;
    description!: string;

    static tableName = 'BusinessReview';
    static idColumn = ["userId","businessId","rating","description"];
}

export type BusinessReviewObject =  ModelObject<BusinessReview>