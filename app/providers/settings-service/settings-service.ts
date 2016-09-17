import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {SqlStorage, Storage} from "ionic-angular";
import {SettingModel} from "../../models/SettingModel";

/*
  Generated class for the SettingsService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class SettingsService {
  private storage: Storage;

  constructor(private http: Http) {
    this.storage = new Storage(SqlStorage, {name: 'settings-storage'});
  }

  saveSettings(name, phone) {
    this.storage.set('name', name);
    this.storage.set('phone', phone);
  }

  getSettings(): SettingModel {
    let res = new SettingModel("", "");
    this.storage.get('name').then((name) => {
      if(name) {
        res.name = name;
      }
    });
    this.storage.get('phone').then((phone) => {
      if(phone) {
        res.phone = phone;
      }
    });
    return res;
  }

  getName() {
    return this.storage.get('name');
  }

  getPhone() {
    return this.storage.get('phone');
  }

}

