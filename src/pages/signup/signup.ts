import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { Login } from '../login/login';
import { AlertController } from 'ionic-angular';
// import { Http, Headers, RequestOptions } from '@angular/http';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';



@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class Signup {

  user_name = "";
  user_surname = "";
  user_email = "";
  user_phone = "";
  password1 = "";
  password2 = "";
  showError = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, private alrt: AlertController, public http: Http) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Signup');
  }

  signup() {
    if (this.user_name == "" || this.user_surname == "" || this.user_email == "" || this.user_phone == "" || this.password1 == ""
      || this.password2 == "") {
      const alert = this.alrt.create({
        title: "Warning",
        message: "please fill in all fields",
        buttons: ["OK"]
      });
      alert.present();
    }
    else if (this.password1 != this.password2) {
      const alert = this.alrt.create({
        title: "Warning",
        message: "Passwords does not match",
        buttons: ["OK"]
      });
      alert.present();
      this.password1 = "";
      this.password2 = "";
    }
    else {
      // const dtls = {
      //   fname: this.user_name,
      //   lname: this.user_surname,
      //   email: this.user_email,
      //   password: this.password1,
      //   phone: this.user_phone
      // };
      // let headers = new Headers({ 'Content-Type': 'application/json' });
      // let options = new RequestOptions({ headers: headers });
      this.http.get("http://34.218.212.203/saveauth.php?fname=" + this.user_name + "&lname=" + this.user_surname + "&phone=" + this.user_phone
        + "&password=" + this.password1 + "&email=" + this.user_email)
        .subscribe(res => {
          if (res.status == 200) { 
            this.navCtrl.push(HomePage); 
          }
        }, (err) => {
          this.showError = true;
        });

      // this.http.post("http://34.218.212.203/saveauth.php", dtls,  options)      
      // .subscribe(res => {
      //   if (res.status == 200) { this.navCtrl.push(HomePage); }
      // }, (err) => {
      //   this.showError = true;
      // });
      //this.navCtrl.push(HomePage);
    }
  }

  // goHome():void{
  //   this.navCtrl.push(HomePage);
  // }

  goLogin(): void{
    this.navCtrl.push(Login);
  }

}
