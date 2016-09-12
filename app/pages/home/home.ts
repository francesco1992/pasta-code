import {Component} from '@angular/core';
import {NavController, AlertController} from 'ionic-angular';
import {MealModel} from "../../models/MealModel";

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  private meals: MealModel[] = [];
  private currentDate: string;

  constructor(private navCtrl: NavController, private alertCtrl: AlertController) {
    this.currentDate = new Date().toLocaleDateString();
    this.meals.push({name: "test", count: 0});
  }

  addMeal() {

  }

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
              this.meals.splice(index, 1);
            }
          }
        }
      ]
    });
    alert.present();
  }

  increaseCount(meal) {
    meal.count++;
  }

  decreaseCount(meal) {
    if(meal.count > 0) {
      meal.count--;
    }
  }
}
