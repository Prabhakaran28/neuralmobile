import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ForgotPage } from '../forgot/forgot';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AlertController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-login', 
  templateUrl: 'login.html',
})
export class Login {
  username = "";
  password = "";
  showError = false;
  opt: any;
  signupform: FormGroup;
  firstname = "";
  lastname = "";
  email = "";
  phone = "";
  password1 = "";
  password2 = "";
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private alrt: AlertController, public http: Http
    ) {
    this.opt='signin';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');
    this.signupform = new FormGroup({
      firstname: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(2), Validators.maxLength(20)]),
      lastname: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(2), Validators.maxLength(20)]),
      phone: new FormControl('', [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$'), Validators.minLength(10)]),
      password1: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{6,}')]),
      email: new FormControl('', [Validators.required, Validators.pattern("[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})")]),
      password2: new FormControl('',[Validators.required]),
    });
  }

  login() {

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    //Api connections
    if (this.username == "" || this.password == "") {
      const alert = this.alrt.create({
        title: "Warning",
        subTitle: "Please enter username and password",
        buttons: ["OK"]
      });
      alert.present();
    } else {
      this.http.get("http://34.218.212.203/getAuth.php?id=" + this.username + "&pass=" + this.password)
        .subscribe(res => {
          if (res.status == 200) {
            this.storage.set('showContacts', 'No');
            this.http.get("http://34.218.212.203/getContacts.php?id=" + this.username)
              .subscribe(res => {
                if (res.status == 200) {
                  this.storage.set('showContacts', 'Yes');
                  this.storage.set('name', this.username);
                  this.navCtrl.push(HomePage);
                } 
              }, 
              error => {
                this.storage.set('name', this.username);
                this.navCtrl.push(HomePage);
              });
          }
        }, (err) => {
          this.showError = true;
        });
    }

  }



  signup() {
    if (this.firstname == "" || this.lastname == "" || this.email == "" || this.phone == "" || this.password1 == ""
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
      this.http.get("http://34.218.212.203/saveauth.php?fname=" + this.firstname + "&lname=" + this.lastname + "&phone=" + this.phone
        + "&password=" + this.password1 + "&email=" + this.email)
        .subscribe(res => {
          if (res.status == 200) { 
            const alert = this.alrt.create({
              title: "Success",
              message: "Account has been created. Please signin now with your Email and Password",
              buttons: ["OK"]
            });
            alert.present();
            this.opt='signin';
          } 
        }, (err) => {
          this.showError = true;
          this.opt='signin';
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

  forgotPassword():void {

    // const alert = this.alrt.create({
    //   title: "Alert",
    //   message: "TO BE DEVELOPED",
    //   buttons: ["OK"]
    // });
    // alert.present();
    // this.opt='signin';

    this.navCtrl.push(ForgotPage);

  }

}
