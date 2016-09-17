import {Component, OnInit} from '@angular/core';
import {NavController, AlertController, ModalController, LocalStorage, Storage, Events} from 'ionic-angular';
import {MealModel} from "../../models/MealModel";
import {AddMealPage} from "../add-meal/add-meal";
import {MealsService} from "../../providers/meals-service/meals-service";
import {StatsService} from "../../providers/stats-service/stats-service";
import {LogoComponent} from '../logo/logo';
import {SettingsService} from "../../providers/settings-service/settings-service";
import {SmsService} from "../../providers/sms-service/sms-service";

@Component({
  templateUrl: 'build/pages/home/home.html',
  providers: [MealsService, SmsService],
  directives: [LogoComponent]
})
export class HomePage implements OnInit {
  private meals: MealModel[] = [];
  private currentDate: string;
  private orderTime: string;
  private localStorage: LocalStorage;

  constructor(private navCtrl: NavController, private alertCtrl: AlertController,
              private modalCtrl: ModalController, private mealsService: MealsService,
              private statsService: StatsService, private events: Events,
              private settingsService: SettingsService, private smsService: SmsService) {
    this.currentDate = new Date().toLocaleDateString();
    this.localStorage = new Storage(LocalStorage);
  }

  ngOnInit() {
    this.loadMeals();
    this.localStorage.get(this.currentDate).then((check) => {
      if(check) {
        this.orderTime = check;
      }
    });
  }

  // load all saved meals
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
    if(this.orderEmpty()) {
      let alert = this.alertCtrl.create({
        title: 'Order empty',
        subTitle: 'Your order has no meals yet',
        buttons: ['OK']
      });
      alert.present();
    } else {
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
              Promise.all([this.settingsService.getName(),
                this.settingsService.getPhone()]).then(results => {
                this.sendMessage(results[0], results[1]);
              });
            }
          }
        ]
      });
      alert.present();
    }
  }

  // check if current order is empty
  orderEmpty() {
    let numMeals = 0;
    for(let meal of this.meals) {
      numMeals += meal.count;
    }
    return numMeals === 0;
  }

  // send message using sms-provider
  sendMessage(name, phone) {
    let credentials = {
      accountSid: 'AC08b0ff94809c3876fb9ef494f7cdb127',
      authToken: '5e83ab2d9f2bfad89d90fa2956b59b23'
    };
    this.smsService.setCredentials(credentials);

    let msgData = {
      From: '+12143909560',
      To: '',
      Body: ''
    };

    msgData.Body = this.arrangeMessage(name);
    msgData.To = phone;
    this.smsService.sendMessage(msgData).map(res => res.json())
      .subscribe(
        res => this.onOrderSent(res),
        err => this.showOrderError(err)
      );
  }

  // arrange sms body
  arrangeMessage(name) {
    let str = "Ciao " + name +
      "! Per il pranzo di oggi a Vendini avremmo bisogno di: ";
    for(let meal of this.meals) {
      if(meal.count !== 0) {
        str += meal.count + " " + meal.name + ", ";
      }
      this.mealsService.updateMeal(meal);
    }
    str = str.slice(0, -2);
    str += ". Grazie mille.";
    return str;
  }

  // show successfully sent order message, update stats and last order time
  onOrderSent(data) {
    let now = new Date();
    this.localStorage.set(now.toLocaleDateString(), now.toLocaleTimeString());
    this.orderTime = now.toLocaleTimeString();
    this.updateStats();
    let alert = this.alertCtrl.create({
      title: 'Order sent!',
      subTitle: 'Your order has been successfully sent.\nSee you tomorrow!',
      buttons: ['OK']
    });
    alert.present();
  }

  showOrderError(err) {
    let alert = this.alertCtrl.create({
      title: 'Error!',
      subTitle: 'There was an error sending your order. Try to check your settings: '+err,
      buttons: ['OK']
    });
    alert.present();
  }

  updateStats() {
    let numOfMeals = 0;
    for (let meal of this.meals) {
      numOfMeals += meal.count;
    }
    this.statsService.saveMealStats(numOfMeals).then(res => {
      this.events.publish('statistics:updated', numOfMeals);
    });
  }

}
