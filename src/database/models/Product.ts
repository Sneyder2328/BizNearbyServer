import { Model, ModelObject } from 'objection';

export class Product extends Model {
    categoryCode!: number;
    name!: string;

    static tableName = "Product";
    static idColumn = ["categoryCode", "name"];
}

export type ProductObject = ModelObject<Product>