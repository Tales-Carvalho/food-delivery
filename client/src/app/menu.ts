import { Food } from './food';
import { Drink } from './drink';
import { Dessert } from './dessert';

export class Menu {
    constructor(
        public Menu: {FoodList: Array<Food>, Price: number},
        public DayWeek: number,
        public Drinks: Array<Drink>,
        public Desserts: Array<Dessert>
    ) { }
}
