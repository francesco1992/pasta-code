import {Component} from '@angular/core';
import {NavController, AlertController, ModalController} from 'ionic-angular';
import {MealModel} from "../../models/MealModel";
import {AddMealPage} from "../add-meal/add-meal";

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  private meals: MealModel[] = [];
  private currentDate: string;

  constructor(private navCtrl: NavController, private alertCtrl: AlertController,
              private modalCtrl: ModalController) {
    this.currentDate = new Date().toLocaleDateString();
  }

  // Add new meal to meals array and "eventually" store it
  addMeal() {
    let addModal = this.modalCtrl.create(AddMealPage);
    addModal.onDidDismiss((meal, checked) => {
      if(meal && !checked){
        //if not checked it needs to be stored..
        this.meals.push(meal);
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
    console.log("show order confirmation");
  }
}
