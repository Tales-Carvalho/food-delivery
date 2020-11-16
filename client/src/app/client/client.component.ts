import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Meal } from '../meal';
import { Drink } from '../drink';
import { Dessert } from '../dessert';
import { Order } from '../order';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})

export class ClientComponent implements OnInit {

  meal: Meal = new Meal([], 0);
  drinks: Array<Drink> = [];
  desserts: Array<Dessert> = [];

  order = new Order("", "", [], [], [], false, new Date());

  total: number = 0;

  closed: boolean = false;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getMenu().subscribe((data: any) => {
      console.log(data);
      if (!data.Menu[0]) {
        this.closed = true;
        return;
      }
      this.meal.FoodList = data.Menu[0].FoodList;
      this.meal.Price = data.Menu[0].Price;
      this.drinks = data.Drinks;
      this.desserts = data.Desserts;
      this.drinks.forEach(i => i.Quantity = 1);
      this.desserts.forEach(i => i.Quantity = 1);
    })
  }

  public addMeal(meal: Meal = null): void {
    if (!meal) {
      meal = new Meal(this.meal.FoodList.filter(i => i.Selected), this.meal.Price);
      this.meal.FoodList.forEach(i => i.Selected = false);
    }
    const meal_order = this.order.Meals.find(i => i.FoodList.toString() == meal.FoodList.toString());
    if (this.order.Meals.indexOf(meal_order) == -1) {
      this.order.Meals.push(meal);
    }
    else {
      meal_order.Quantity += 1;
    }
    this.calculateTotal();
  }

  public addDessert(dessert: Dessert): void {
    const dess_order = this.order.Desserts.find(i => i._id == dessert._id);
    if (this.order.Desserts.indexOf(dess_order) == -1) {
      this.order.Desserts.push(new Dessert(dessert._id, dessert.Name, dessert.Price));
    }
    else {
      dess_order.Quantity += 1;
    }
    this.calculateTotal();
  }

  public addDrink(drink: Drink): void {
    const drink_order = this.order.Drinks.find(i => i._id == drink._id);
    if (this.order.Drinks.indexOf(drink_order) == -1) {
      this.order.Drinks.push(new Drink(drink._id, drink.Name, drink.Price));
    }
    else {
      drink_order.Quantity += 1;
    }
    this.calculateTotal();
  }

  public removeMeal(meal: Meal): void {
    if (meal.Quantity == 1) {
      const index = this.order.Meals.indexOf(meal, 0);
      this.order.Meals.splice(index, 1);
    }
    else {
      meal.Quantity -= 1;
    }
    this.calculateTotal();
  }

  public removeDrink(drink: Drink): void {
    if (drink.Quantity == 1) {
      const index = this.order.Drinks.indexOf(drink, 0);
      this.order.Drinks.splice(index, 1);
    }
    else {
      drink.Quantity -= 1;
    }
    this.calculateTotal();
  }

  public removeDessert(dessert: Dessert): void {
    if (dessert.Quantity == 1) {
      const index = this.order.Desserts.indexOf(dessert, 0);
      this.order.Desserts.splice(index, 1);
    }
    else {
      dessert.Quantity -= 1;
    }
    this.calculateTotal();
  }

  public sendOrder(): void {
    if (this.order.Meals.length == 0 && this.order.Drinks.length == 0 && this.order.Desserts.length == 0) {
      window.alert("Your order is empty. Please include products.");
      return;
    }
    if (this.order.Client.length == 0) {
      window.alert("Please fill in your name.");
      return;
    }
    this.order.Date = new Date();
    console.log(this.order);
    this.dataService.postOrder(this.order).subscribe((data: any) => {
      window.alert("Your order was sent! Delivery time estimation: 1 second to 100 years. Thank you for your preference.");
      this.order = new Order("", "", [], [], [], false, new Date());
      this.total = 0;
    });
  }

  private calculateTotal(): void {
    this.total = 0;
    this.order.Meals.forEach(i => this.total += i.Quantity * i.Price);
    this.order.Drinks.forEach(i => this.total += i.Quantity * i.Price);
    this.order.Desserts.forEach(i => this.total += i.Quantity * i.Price);
  }

}
