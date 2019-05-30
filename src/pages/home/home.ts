import { Component } from '@angular/core';
import { Contact, ContactField, ContactName, Contacts } from '@ionic-native/contacts';
import { CallNumber } from '@ionic-native/call-number';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  showContacts = false;
  exportButton = true;
  exportCompleted = false;
  constructor(private storage: Storage, private contacts: Contacts, private callNumber: CallNumber, public http: Http) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad home');
    this.storage.get('showContacts').then((val) => {
      if (val === 'No') {
        this.showContacts = true;
        this.exportButton = false;
      }
    });
  }

  onInit() {

  }

  contactList = [];
  contactFromDB = [];
  contactFromPhone = [];
  newContactList = [];
  public isToggled: boolean = false;
  public isContact: boolean = false;

  // getContacts(): void {
  //   this.contacts.find(
  //     ["displayName", "phoneNumbers", "photos"],
  //     { multiple: true, hasPhoneNumber: true }
  //   ).then((contacts) => {
  //     for (var i = 0; i < contacts.length; i++) {
  //       if (contacts[i].displayName !== null) {
  //         var contact = {};
  //         contact["name"] = contacts[i].displayName;
  //         contact["number"] = contacts[i].phoneNumbers[0].value;
  //         if (contacts[i].photos != null) {
  //           contact["image"] = this.sanitizer.bypassSecurityTrustUrl(contacts[i].photos[0].value);
  //         } else {
  //           contact["image"] = "assets/dummy-profile-pic.png";
  //         }
  //         this.contactList.push(contact);
  //         this.isContact = true;
  //         this.isToggled = true;
  //       }
  //     }
  //   });
  // }
  getContacts(): void {
    this.contactList = [];
    //   this.storage.get('name').then((email) => {
    //   this.http.get('http://34.218.212.203/getContacts.php?id='+email).subscribe( res => { 
    //     let response = res.statusText; 
    //     console.log(response) ;
    //     this.contactList.push(res.statusText);
    //   });
    // });

    this.storage.get('name').then((email) => {
      this.http.get('http://34.218.212.203/getContacts.php?id=' + email).map(res => res.json()).subscribe(data => {

        var string = JSON.stringify(data.statusText);
        var data1 = JSON.parse(string);

        data1.forEach(element => {
          let contact = {
            name: element.name,
            number: element.number
          }
          this.contactList.push(contact);
        });
      });
    });

  }

  getCont(): void {
    var contact1 = {};
    contact1["name"] = "Pabbu";
    contact1["number"] = "9994501928";
    this.contactList.push(contact1);
    var contact2 = {};
    contact2["name"] = "Pabbu1";
    contact2["number"] = "9384401928";
    this.contactList.push(contact2);
    var contact3 = {};
    contact3["name"] = "TEST";
    contact3["number"] = "5552225558";
    this.contactList.push(contact3);
  }

  addContact(num, name): void {
    if (confirm("Are you sure !! you want to save the contact " + num + " to the name " + name)) {
      let contact: Contact = this.contacts.create();
      contact.name = new ContactName(null, name, null);
      let number = new ContactField('mobile', num);
      contact.phoneNumbers = [number];
      contact.save().then(
        () => alert('Contact saved to your phone'),
        (error: any) => console.error('Error saving contact.', error)
      );
    }
  }

  export(): void {
    this.contactList = [];
    this.storage.get('name').then((email) => {

      this.contacts.find(
        ["displayName", "phoneNumbers", "photos"],
        { multiple: true, hasPhoneNumber: true }
      ).then((contacts) => {
        for (var i = 0; i < contacts.length; i++) {
          if (contacts[i].displayName !== null) {
            var contact = {};
            contact["name"] = contacts[i].displayName;
            contact["number"] = contacts[i].phoneNumbers[0].value;
            this.http.get("http://34.218.212.203/saveContacts.php?id=" + email + "&name=" + contact["name"] + "&number=" + contact["number"])
              .subscribe(res => {
                if (res.status == 200) {
                  //this.navCtrl.push(HomePage); }
                }
              });
          }
        }
      });
      this.exportCompleted = true;
      //  this.getCont();
      // this.contactList.forEach(contact => {
      //   // this.http.get("http://34.218.212.203/saveContacts.php?id=" + email + "&name=" + contact.name + "&number=" + contact.number)
      //   //   .subscribe(res => {
      //   //     if (res.status == 200) {
      //   //       //this.navCtrl.push(HomePage); }
      //   //     }
      //   //   });
      // });
    });
  }

  call(number): void {
    if (confirm("App uses your phone to make a call to " + number)) {
      this.callNumber.callNumber(number, true);
    }

  }

  copy(): void {
    this.contactFromPhone = [];
    this.storage.get('name').then((email) => {
      this.contacts.find(
        ["displayName", "phoneNumbers", "photos"],
        { multiple: true, hasPhoneNumber: true }
      ).then((contacts) => {
        for (var i = 0; i < contacts.length; i++) {
          if (contacts[i].displayName !== null) {
            let contact = {
              name: contacts[i].displayName,
              number: contacts[i].phoneNumbers[0].value
            }
            this.contactFromPhone.push(contact);
          }
        }
      });
    });


    this.contactFromDB = [];
    this.storage.get('name').then((email) => {
      this.http.get('http://34.218.212.203/getContacts.php?id=' + email).map(res => res.json()).subscribe(data => {

        var string = JSON.stringify(data.statusText);
        var data1 = JSON.parse(string);

        data1.forEach(element => {
          let contact = {
            name: element.name,
            number: element.number
          }
          this.contactFromDB.push(contact);
        });
      });
    });

    this.contactFromDB.forEach((element) => {
      this.contactFromPhone = this.contactFromPhone.filter((element1) => {
        if (element.number !== element1.number) {
          let contact: Contact = this.contacts.create();
          contact.name = new ContactName(null, element1.name, null);
          let number = new ContactField('mobile', element1.number);
          contact.phoneNumbers = [number];
          contact.save().then(
            () => console.log("contact saved to ur phone!"),
            (error: any) => console.error('Error saving contact.', error)
          );
        }
      });
    })
    
    alert("Contacts saved to your phone now");
  }

  copyRemaining(): void {
    this.contactFromPhone = [];
    this.storage.get('name').then((email) => {
      this.contacts.find(
        ["displayName", "phoneNumbers", "photos"],
        { multiple: true, hasPhoneNumber: true }
      ).then((contacts) => {
        for (var i = 0; i < contacts.length; i++) {
          if (contacts[i].displayName !== null) {
            var contact = {};
            contact["name"] = contacts[i].displayName;
            contact["number"] = contacts[i].phoneNumbers[0].value;
            this.contactFromPhone.push(contact);
          }
        }
      });
    });


    this.contactFromDB = [];
    this.storage.get('name').then((email) => {
      this.http.get('http://34.218.212.203/getContacts.php?id=' + email).map(res => res.json()).subscribe(data => {

        var string = JSON.stringify(data.statusText);
        var data1 = JSON.parse(string);

        data1.forEach(element => {
          let contact = {
            name: element.name,
            number: element.number
          }
          this.contactFromDB.push(contact);
        });
      });
    });
    this.storage.get('name').then((email) => {
      this.contactFromDB.forEach((element) => {
        this.contactFromPhone = this.contactFromPhone.filter((element1) => {

          if (element.number !== element1.number) {
            this.newContactList.push(element1);
            this.http.get("http://34.218.212.203/saveContacts.php?id=" + email + "&name=" + element1.name + "&number=" + element1.number)
              .subscribe(res => {
                if (res.status == 200) {
                  //this.navCtrl.push(HomePage); }
                }
              });
          }
        });
      });
    });

    alert("New Contacts have been exported now!! ");

  }

}
