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
  private static storage = null;

  constructor() {
    SettingsService.getInstance();
  }

  static getInstance() {
    if(SettingsService.storage === null) {
      SettingsService.storage = new Storage(SqlStorage);
    }
    return SettingsService.storage;
  }

  getName() {
    return SettingsService.storage.get('name');
  }

  getPhone() {
    return SettingsService.storage.get('phone');
  }

  setName(name) {
    return SettingsService.storage.set('name', name);
  }

  setPhone(phone) {
    return SettingsService.storage.set('phone', phone);
  }

}

