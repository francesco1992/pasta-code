import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {SqlStorage, Storage} from "ionic-angular";

/*
  Generated class for the StatsService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class StatsService {
  private storage;

  constructor() {
    this.storage = new Storage(SqlStorage, {name: 'items-storage'});
    this.storage.query('CREATE TABLE IF NOT EXISTS meals_stats (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, num_meals INTEGER)');
  }

  getMealsStats() {
    return this.storage.query('select * from meals_stats');
  }

  saveMealStats(count) {
    let date = new Date();
    let sql = 'INSERT INTO meals_stats (date, num_meals) VALUES (?,?)';
    return this.storage.query(sql, [date, count]);
  }

}

