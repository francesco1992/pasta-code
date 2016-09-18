import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/map';

export class Message {
  private text: string;
  private username: string;
  private icon_emoji: string;

  constructor(text: string) {
    this.username = "Pasta Code";
    this.icon_emoji = ":spaghetti:";
    this.text = text;
  }
}

/*
  Generated class for the SlackService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class SlackService {
  private msg: Message;
  private webhook: string;

  constructor(private http: Http) {}

  private setWebhookUrl(url) {
    this.webhook = url;
  }

  private setText(text) {
    this.msg = new Message(text);
  }

  sendMessage(webhookUrl, textMsg) {
    let headers = new Headers();
    headers.set('Content-type', 'application/json');
    this.setWebhookUrl(webhookUrl);
    this.setText(textMsg);

    return this.http.post(this.webhook, JSON.stringify(this.msg), {headers: headers});
  }

}

