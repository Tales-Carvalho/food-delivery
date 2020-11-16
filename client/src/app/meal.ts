import { Food } from './food';

export class Meal {
    constructor(
        public FoodList: Array<Food>,
        public Price: number,
        public Quantity: number = 1
    ) { }
}
