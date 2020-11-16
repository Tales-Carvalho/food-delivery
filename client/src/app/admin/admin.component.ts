import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Order } from '../order';
import { Meal } from '../meal';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  orders: Array<Order>;

  cashier = {
    Calculated: false,
    Total: 0,
    TotalDelivered: 0,
    Orders: 0,
    OrdersDelivered: 0,
    Meals: 0,
    Drinks: [],
    Desserts: [],
    Date: new Date()
  };

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.updateOrders();
  }

  public confirmOrder(order: Order): void {
    this.dataService.patchOrder({ id: order._id, Delivered: true }).subscribe((data: any) => {
      this.updateOrders();
    });
  }

  private updateOrders(): void {
    this.dataService.getOrders().subscribe((data: any) => {
      this.orders = data;
      console.log(this.orders);
    })
  }

  public closeBills(): void {
    this.cashier = {
      Calculated: true,
      Total: 0,
      TotalDelivered: 0,
      Orders: 0,
      OrdersDelivered: 0,
      Meals: 0,
      Drinks: [],
      Desserts: [],
      Date: new Date()
    };
    for (let i = 0; i < this.orders.length; i++) {
      const order = this.orders[i];
      this.cashier.Orders += 1;
      if (order.Delivered) {
        this.cashier.OrdersDelivered += 1;
      }
      for (let j = 0; j < order.Meals.length; j++) {
        const meal = order.Meals[j];
        this.cashier.Total += meal.Price;
        this.cashier.Meals += 1;
        if (order.Delivered) {
          this.cashier.TotalDelivered += meal.Price;
        }
      }
      for (let j = 0; j < order.Drinks.length; j++) {
        const drink = order.Drinks[j];
        this.cashier.Total += drink.Price;
        if (order.Delivered) {
          this.cashier.TotalDelivered += drink.Price;
        }
        let cashier_drink = this.cashier.Drinks.find(i => i.Name == drink.Name);
        if (this.cashier.Drinks.indexOf(cashier_drink) == -1) {
          this.cashier.Drinks.push({ Name: drink.Name, Quantity: drink.Quantity });
        }
        else {
          cashier_drink.Quantity += drink.Quantity;
        }
      }
      for (let j = 0; j < order.Desserts.length; j++) {
        const dessert = order.Desserts[j];
        this.cashier.Total += dessert.Price;
        if (order.Delivered) {
          this.cashier.TotalDelivered += dessert.Price;
        }
        let cashier_dessert = this.cashier.Desserts.find(i => i.Name == dessert.Name);
        if (this.cashier.Desserts.indexOf(cashier_dessert) == -1) {
          this.cashier.Desserts.push({ Name: dessert.Name, Quantity: dessert.Quantity });
        }
        else {
          cashier_dessert.Quantity += dessert.Quantity;
        }
      }
    }
    console.log(this.orders);
    console.log(this.cashier);
  }

}
