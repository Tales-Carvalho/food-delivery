import { Meal } from './meal';
import { Drink } from './drink';
import { Dessert } from './dessert';

export class Order {
    constructor(
        public _id: string,
        public Client: string,
        public Meals: Array<Meal>,
        public Drinks: Array<Drink>,
        public Desserts: Array<Dessert>,
        public Delivered: boolean,
        public Date: Date
    ) { }
}
