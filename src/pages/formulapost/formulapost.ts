import { Component, ViewChild, ElementRef, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FeedStylist } from '../feedstylist/feedstylist';
import { StylistProfile } from '../stylistprofile/stylistprofile';

import { Keyboard } from '@ionic-native/keyboard';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { OnDestroy } from "@angular/core";
import { ISubscription } from "rxjs/Subscription";




/**
 * Generated class for the PostpagePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-formulapost',
  templateUrl: 'formulapost.html'
})
export class FormulapostPage implements OnDestroy {
  @ViewChild('imagey') image:ElementRef;
  @ViewChild('sharer') share;
 	imageHolder;
  item = {'date': null, 'title':'', 'price':'', 'caption':'', 'typeofselect':'formula', 'description':''};
  selectVal;
  username;
  square;
  list: FirebaseListObservable<any>
  private subscription: ISubscription;
  private subscription2: ISubscription;
  private subscription3: ISubscription;

  constructor(public af: AngularFireDatabase, public viewCtrl: ViewController, public storage: Storage, public keyboard: Keyboard, public myrenderer: Renderer, public navCtrl: NavController, public navParams: NavParams) {

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
  }

  ionViewDidLoad() {
    this.square = this.navParams.get("square");
    
    this.imageHolder = this.navParams.get("path");
    this.myrenderer.setElementAttribute(this.image.nativeElement, 'src', this.imageHolder);
    
    this.subscription = this.keyboard.onKeyboardShow().subscribe(()=>{
      this.myrenderer.setElementStyle(this.share.getNativeElement(), 'bottom', '-150px');
    })
    this.subscription2 = this.keyboard.onKeyboardHide().subscribe(()=>{
      console.log("keyboard being hid **&^&^&^&^&^&");
      console.log(this.share.getNativeElement() + " * f8d fd8 f8df8 fd8 f8d 8f fd8 8 fd");
      this.myrenderer.setElementStyle(this.share.getNativeElement(), 'bottom', '0');
    })
    
    this.storage.get('username').then((val) => {this.username = val; console.log(val + "        getting username")});
  }

  goToProfile() {
    this.navCtrl.push(StylistProfile,{ square: this.square },{animate:true,animation:'transition',duration:100,direction:'back'});
  }


  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('-');
  }

  isFormula() {
      console.log()
       let metadata = {
        'formula': this.item.caption,
        'price': '3',
        'username': this.username,
        'url': this.imageHolder,
        'postdate': Date.now(),
        'square':this.square
       }

       let self = this;

       let database = firebase.database();
       let bool = false;
       let reff = firebase.database().ref('/formulas').orderByChild('username').equalTo(this.username).on("value", function(snapshot) {
          snapshot.forEach(snapshot => {
              // key
              var key = snapshot.key;
              console.log("key: " + key);
              // value, could be object
              var childData = snapshot.val();
              console.log("data: " + JSON.stringify(childData));
              // Do what you want with these key/values here

              if(self.square == childData.square) {
                var updates = {};
                updates['/formulas/' + key] = metadata;
                console.log("in self square childdata");
                firebase.database().ref().update(updates);
                bool = true;

                return true;
              }
              
              
          });

          if(!bool) {
             firebase.database().ref('/formulas').push(metadata);
          }
      });


     /*this.af.list('/formulas', {query:{orderByChild:'username', equalTo:this.username}}).subscribe(items => items.forEach(item => {

         console.log("in subscription nowwwwww");
        
       })).unsubscribe();*/

       //this.navCtrl.pop();

            
     

     //this.list.push(metadata); 
     

  }

  shareItem() {
    console.log(this.item.title);
    console.log(this.item.caption);
    console.log(this.imageHolder + "                    **************************** src ****************");

    if(this.item.caption == '' || this.imageHolder == null) {
      alert("You need to fill in all of the information");
    }
    else {
    	this.isFormula();
      this.navCtrl.pop();
    }

    

    /*var dataURL = data;

    let image       : string  = 'profile_' + this.username + '_' + square + '.png',
      storageRef  : any,
      parseUpload : any;

    return new Promise((resolve, reject) => {
      storageRef       = firebase.storage().ref('/profile/' + this.username + '/' + image);
      parseUpload      = storageRef.putString(dataURL, 'data_url');

      parseUpload.on('state_changed', (_snapshot) => {
          // We could log the progress here IF necessary
          console.log('snapshot progess ' + _snapshot);
        },
        (_err) => {
           reject(_err);
           console.log(_err.messsage);
        },
        (success) => {
           resolve(parseUpload.snapshot); 
        })
      }).then(value => {
        //this.af.list('/profile/' + self.username).push({ pic: image });
      }).catch(function(error) {
        console.log(error.message);
      });*/
  }

  pushPage(){
    // push another page on to the navigation stack
    // causing the nav controller to transition to the new page
    // optional data can also be passed to the pushed page.
    //this.navCtrl.push(SignUpPage);
  }

}
