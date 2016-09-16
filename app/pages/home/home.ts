import {Component, OnInit} from '@angular/core';
import {NavController, AlertController, ModalController, LocalStorage, Storage, Events} from 'ionic-angular';
import {MealModel} from "../../models/MealModel";
import {AddMealPage} from "../add-meal/add-meal";
import {MealsService} from "../../providers/meals-service/meals-service";
import {StatsService} from "../../providers/stats-service/stats-service";
import {LogoComponent} from '../logo/logo';

@Component({
  templateUrl: 'build/pages/home/home.html',
  providers: [MealsService],
  directives: [LogoComponent]
})
export class HomePage implements OnInit {
  private meals: MealModel[] = [];
  private currentDate: string;
  private orderTime: string;
  private localStorage: LocalStorage;

  constructor(private navCtrl: NavController, private alertCtrl: AlertController,
              private modalCtrl: ModalController, private mealsService: MealsService,
              private statsService: StatsService, private events: Events) {
    this.currentDate = new Date().toLocaleDateString();
    this.localStorage = new Storage(LocalStorage);
  }

  ngOnInit() {
    this.loadMeals();
    let today = new Date().toLocaleDateString().toString();
    this.localStorage.get(this.currentDate).then((check) => {
      if(check) {
        this.orderTime = check;
      }
    });
  }

  loadMeals() {
    this.mealsService.getMeals().then((resp) => {
      if (resp.res.rows.length > 0) {
        let result: MealModel[] = [];
        for (var i = 0; i < resp.res.rows.length; i++) {
          let meal = resp.res.rows.item(i);
          result.push({name: meal.name, count: meal.count});
        }
        this.meals = result;
      }
    });
  }

  // Add new meal to meals array and "eventually" store it
  addMeal() {
    let addModal = this.modalCtrl.create(AddMealPage);
    addModal.onDidDismiss((meal, checked) => {
      if(meal && !checked){
        //if not checked it needs to be stored..
        this.meals.push(meal);
        this.mealsService.saveMeal(meal.name);
      } else if(meal) {
        this.meals.push(meal);
      }
    });
    addModal.present();
  }

  // Delete a meal from meals array
  deleteMeal(event, meal) {
    let alert = this.alertCtrl.create({
      title: 'Delete Meal',
      message: 'Do you want to delete <i>'+meal.name+"</i>?",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        },
        {
          text: 'Go!',
          handler: () => {
            var index = this.meals.indexOf(meal, 0);
            if (index > -1) {
              this.mealsService.deleteMeal(meal.name);
              this.meals.splice(index, 1);
            }
          }
        }
      ]
    });
    alert.present();
  }

  // Increase meal amount
  increaseCount(meal) {
    meal.count++;
  }

  // Decrease meal amount
  decreaseCount(meal) {
    if(meal.count > 0) {
      meal.count--;
    }
  }

  // Show alert for order confirmation
  showOrderConfirmation() {
    let alert = this.alertCtrl.create({
      title: 'Order Confirmation',
      message: 'Do you want to send this order?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        },
        {
          text: 'Go!',
          handler: () => {
            let now = new Date();
            this.orderTime = now.toLocaleTimeString();
            this.localStorage.set(now.toLocaleDateString(), now.toLocaleTimeString());
            this.updateStats();
            for(let meal of this.meals) {
              this.mealsService.updateMeal(meal);
            }
          }
        }
      ]
    });
    alert.present();
  }

  updateStats() {
    let numOfMeals = 0;
    for (let meal of this.meals) {
      numOfMeals += meal.count;
    }
    this.statsService.saveMealStats(numOfMeals).then(res => {

    });
    this.events.publish('statistics:updated', numOfMeals);
  }

}
