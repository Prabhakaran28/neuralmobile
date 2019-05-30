import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Login } from '../login/login';
import { AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ForgotPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgot',
  templateUrl: 'forgot.html',
})
export class ForgotPage {
  forgotpassform: FormGroup;
  email = "";
  email2 = "";
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private alrt: AlertController, public http: Http) {
    this.forgotpassform = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern("[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})")]),
      email2: new FormControl('',[Validators.required]),
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPage');
    this.forgotpassform = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern("[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})")]),
      email2: new FormControl('',[Validators.required]),
    });
  }

  sendPassword():void {

    this.http.get("http://34.218.212.203/sendEmail.php?id=" + this.email)
    .subscribe(res => {
      if (res.status == 200) {
        this.navCtrl.push(Login);
      }
    }, (err) => {
      this.navCtrl.push(Login);
    });
  }

  signin(): void{
    this.navCtrl.push(Login);
  }

}
