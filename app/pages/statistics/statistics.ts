import {Component, OnInit} from '@angular/core';
import { NavController } from 'ionic-angular';
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

  constructor(private navCtrl: NavController, private statsService: StatsService) {
    this.stats = [];
  }

  ngOnInit(): void {
    //this.stats = this.statsService.getMealsStats();
    this.statsService.getMealsStats().then((resp)=>{
      this.loadStats(resp);
    });
  }

  loadStats(resp) {
    let tmp = [];
    if (resp.res.rows.length > 0) {
      for (var i = 0; i < resp.res.rows.length; i++) {
        let mealStats = resp.res.rows.item(i);
        let date = new Date(mealStats.date);
        tmp.push({date: date.toLocaleDateString(), time: date.toLocaleTimeString(), count: mealStats.num_meals});
      }
      this.stats = tmp;
    }
  }

}
