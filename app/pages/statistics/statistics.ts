import {Component, OnInit} from '@angular/core';
import {NavController, Events} from 'ionic-angular';
import {StatsService} from "../../providers/stats-service/stats-service";

/*
  Generated class for the StatisticsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/statistics/statistics.html',
})
export class StatisticsPage implements OnInit {
  private stats;
  private currentMonth;
  private currentDate;
  private totalMeals: number = 0;

  constructor(private navCtrl: NavController, private statsService: StatsService,
              private events: Events) {
    this.stats = [];
    this.currentDate = new Date();
    this.currentMonth = this.getCurrentMonth(this.currentDate);

    this.events.subscribe('statistics:updated', (userEventData) => {
      this.statsService.getMealsStats().then((resp)=>{
        this.loadStats(resp);
      });
    });
  }

  ngOnInit(): void {
    this.statsService.getMealsStats().then((resp)=>{
      this.loadStats(resp);
    });
  }

  loadStats(resp) {
    let tmp = [];
    this.totalMeals = 0;
    if (resp.res.rows.length > 0) {
      for (var i = 0; i < resp.res.rows.length; i++) {
        let mealStats = resp.res.rows.item(i);
        let date = new Date(mealStats.date);
        if(date.getMonth() === this.currentDate.getMonth()) {
          tmp.push({date: date.toLocaleDateString(), time: date.toLocaleTimeString(), count: mealStats.num_meals});
          this.totalMeals += mealStats.num_meals;
        }
      }
      this.stats = tmp;
    }
  }

  getCurrentMonth(date) {
    var months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ];
    var currMonth = months[date.getMonth()];
    return currMonth;
  }

}
