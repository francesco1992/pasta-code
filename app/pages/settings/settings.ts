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
    this.settings = new SettingModel("", "");

    this.myForm = builder.group({
      'name': ['', Validators.required],
      'phone': ['', Validators.compose([Validators.required,
        Validators.pattern('^\\+(?:[0-9] ?){6,14}[0-9]$')])]
    });

    this.events.subscribe('settings:render', (stringa) => {
      Promise.all([this.settingsService.getName(),
        this.settingsService.getPhone()]).then(results => {
          this.settings.name = results[0];
          this.settings.phone = results[1];
      });
    });
  }

  ngOnInit() {
    Promise.all([this.settingsService.getName(), this.settingsService.getPhone()]).then(result => {
      this.settings.name = result[0];
      this.settings.phone = result[1];
    });
  }

  onSubmit(formData) {
    Promise.all([this.settingsService.setName(this.settings.name),
      this.settingsService.setPhone(this.settings.phone)]).then(result => {
        let alert = this.alertCtrl.create({
          title: 'Settings',
          subTitle: 'Settings successfully saved',
          buttons: ['Let me go!']
        });
        alert.present();
    });
  }

}
