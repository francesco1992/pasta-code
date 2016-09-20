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
    this.storage.query('CREATE TABLE IF NOT EXISTS meals (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, count INTEGER)');
  }

  getMeals() {
    return this.storage.query('select * from meals');
  }

  saveMeal(name) {
    let sql = 'INSERT INTO meals (name, count) VALUES (?,?)';
    return this.storage.query(sql, [name, 0]);
  }

  updateMeal(meal) {
    let sql = 'UPDATE meals SET count=? WHERE name=?';
    return this.storage.query(sql, [meal.count, meal.name]);
  }

  deleteMeal(name) {
    let sql = 'DELETE FROM meals WHERE name=?';
    return this.storage.query(sql, [name]);
  }

}

