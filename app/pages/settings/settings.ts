import {Component, OnInit} from '@angular/core';
import {NavController, AlertController} from 'ionic-angular';
import {SettingModel} from "../../models/SettingModel";
import {SettingsService} from "../../providers/settings-service/settings-service";

/*
  Generated class for the SettingsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/settings/settings.html',
  providers: [SettingsService]
})
export class SettingsPage implements OnInit {
  private requiredNameFieldMsg = "";
  private requiredPhoneFieldMsg = "";
  private settings: SettingModel;

  constructor(private navCtrl: NavController, private alertCtrl: AlertController,
              private settingsService: SettingsService) {

  }

  ngOnInit() {
    //load settings using settings-service
    this.settings = this.settingsService.getSettings();
  }

  saveSettings() {
    if (this.settings.phone.trim() === '') {
      this.requiredPhoneFieldMsg = "This field is required";
    }
    if (this.settings.name.trim() === '') {
      this.requiredNameFieldMsg = "This field is required";
    }

    if (this.settings.name.trim() !== '' && this.settings.phone.trim() !== '') {
      if(!this.validatePhoneNumber(this.settings.phone)){
        this.requiredPhoneFieldMsg = "Insert a valide phone number";
        return;
      } else {
        this.settingsService.saveSettings(this.settings.name, this.settings.phone);
        this.requiredPhoneFieldMsg = "";
        this.requiredNameFieldMsg = "";
        let alert = this.alertCtrl.create({
          title: 'Settings',
          subTitle: 'Settings successfully saved',
          buttons: ['Let me go!']
        });
        alert.present();
      }
    }
  }

  validatePhoneNumber(phone): boolean {
    var phone_regexp = new RegExp('^[(]{0,1}[0-9]{3}[)\\.\\- ]{0,1}[0-9]{3}[\\.\\- ]{0,1}[0-9]{4}$');
    return phone_regexp.test(phone);
  }

}
