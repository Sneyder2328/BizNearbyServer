import { Model, ModelObject} from 'objection';

export class Category extends Model {
    code!: number;
    category!: string;

    static tableName = 'Category';
    static idColumn = 'code';
}

export type CategoryObject = ModelObject<Category>