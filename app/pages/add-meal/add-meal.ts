import { Component } from '@angular/core';
import {NavController, ViewController} from 'ionic-angular';

/*
  Generated class for the AddMealPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/add-meal/add-meal.html',
})
export class AddMealPage {
  private name: string = "";
  private count: number = 0;
  private requiredFieldMsg = "";
  private checked = true;

  constructor(private navCtrl: NavController, private view: ViewController) { }

  saveMeal() {
    if(this.name.trim() !== '') {
      let newmeal = {
        name: this.name,
        count: this.count
      };
      this.view.dismiss(newmeal, this.checked);
    }
    this.requiredFieldMsg = "This field is required";
  }

  close() {
    this.view.dismiss();
  }

}
