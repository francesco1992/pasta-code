import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {SqlStorage, Storage} from "ionic-angular";

/*
  Generated class for the DeliveryTimesService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DeliveryTimesService {
  private storage;

  constructor() {
    this.storage = new Storage(SqlStorage, {name: 'time-storage'});
    this.storage.query('CREATE TABLE IF NOT EXISTS delivery_times (date TEXT PRIMARY KEY, time INTEGER)');
  }

  saveDeliveryTime(date, time) {
    let sql = 'INSERT INTO delivery_times (date, time) VALUES (?,?)';
    return this.storage.query(sql, [date, time]);
  }

  getDeliveryTimes() {
    return this.storage.query('select * from delivery_times');
  }

  getDeliveryTime(date) {
    let sql = 'select * from delivery_times where date=?';
    return this.storage.query(sql, [date]);
  }

}

