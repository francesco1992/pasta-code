import {Component} from '@angular/core';
import {HomePage} from '../home/home';
import {StatisticsPage} from "../statistics/statistics";
import {SettingsPage} from "../settings/settings";
import {Events} from "ionic-angular";

@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {

  private tab1Root: any;
  private tab2Root: any;
  private tab3Root: any;

  constructor(private events: Events) {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.tab1Root = HomePage;
    this.tab2Root = StatisticsPage;
    this.tab3Root = SettingsPage;
  }

  renderSettings() {
    //console.log("render settings tab");
    this.events.publish('settings:render', 'none');
  }
}
