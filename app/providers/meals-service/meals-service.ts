import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {SqlStorage, Storage} from "ionic-angular";
import {MealModel} from "../../models/MealModel";

/*
  Generated class for the MealsService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class MealsService {
  private storage: Storage;

  constructor() {
    this.storage = new Storage(SqlStorage, {name: 'meals-storage'});
    this.storage.query('CREATE TABLE IF NOT EXISTS meals (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)');
  }

  getMeals() {
    return this.storage.query('select * from meals');
    /*var result: MealModel[] = [];
    this.storage.query('select * from meals').then((resp) => {
      if (resp.res.rows.length > 0) {
        for (var i = 0; i < resp.res.rows.length; i++) {
          let meal = resp.res.rows.item(i);
          result.push({name: meal.name, count: 0});
        }
      }
    });
    return result;*/
  }

  saveMeal(name) {
    let sql = 'INSERT INTO meals (name) VALUES (?)';
    return this.storage.query(sql, [name]);
  }

  deleteMeal(name) {
    let sql = 'DELETE FROM meals WHERE name=?';
    return this.storage.query(sql, [name]);
  }

}

