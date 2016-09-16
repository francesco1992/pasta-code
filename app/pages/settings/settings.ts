import {Component, OnInit} from '@angular/core';
import {NavController, AlertController, Events} from 'ionic-angular';
import {SettingModel} from "../../models/SettingModel";
import {SettingsService} from "../../providers/settings-service/settings-service";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LogoComponent} from '../logo/logo';

/*
  Generated class for the SettingsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/settings/settings.html',
  providers: [SettingsService],
  directives: [LogoComponent]
})
export class SettingsPage implements OnInit {
  private settings: SettingModel;
  myForm: FormGroup;

  constructor(private navCtrl: NavController, private alertCtrl: AlertController,
              private settingsService: SettingsService, private events: Events,
              private builder: FormBuilder) {
    this.myForm = builder.group({
      'name': ['', Validators.required],
      'phone': ['', Validators.compose([Validators.required,
        Validators.pattern('^[(]{0,1}[0-9]{3}[)\\.\\- ]{0,1}[0-9]{3}[\\.\\- ]{0,1}[0-9]{4}$')])]
    });

    this.events.subscribe('settings:render', (stringa) => {
      this.settings = this.settingsService.getSettings();
    });
  }

  ngOnInit() {
    this.settings = this.settingsService.getSettings();
  }

  onSubmit(formData) {
    this.settingsService.saveSettings(this.settings.name, this.settings.phone);
    let alert = this.alertCtrl.create({
      title: 'Settings',
      subTitle: 'Settings successfully saved',
      buttons: ['Let me go!']
    });
    alert.present();
  }

}
