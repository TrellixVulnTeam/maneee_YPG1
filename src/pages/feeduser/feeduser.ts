import { NgZone, Component, trigger, state, style, transition, animate, ViewChild, ElementRef, Renderer } from '@angular/core';
import { NavController, ModalController, NavParams } from 'ionic-angular';
import { LoadingController, Content } from 'ionic-angular';
import { StylistProfile } from '../stylistprofile/stylistprofile';
import { FeedStylist } from '../feedstylist/feedstylist';

import { UserBooking } from '../userbooking/userbooking';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated'; 
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database'
import { Storage } from '@ionic/storage';
import { PopUp } from '../../modals/popup/popup';
import { PopUpOther } from '../../modals/popupother/popupother';
import { OnDestroy } from "@angular/core";
import { ISubscription } from "rxjs/Subscription";
import * as firebase from 'firebase';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { Diagnostic } from '@ionic-native/diagnostic';
import { UserViewProfile } from '../userviewprofile/userviewprofile';
import { UserProfile } from '../userprofile/userprofile';
import { FullfeedPage } from '../fullfeed/fullfeed';
import { CacheService } from 'ionic-cache';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { Observable } from 'rxjs/Observable'


import { SwiperConfigInterface } from 'ngx-swiper-wrapper';


@Component({
  selector: 'page-feed-user',
  templateUrl: 'feeduser.html',
  animations: [
 
    trigger('slideDown', [
      state('down', style({
        height: '250px',
      })),
      state('notDown', style({
        height:'88px',
      })),
      transition('* => *', animate('400ms ease-in')),
    ]),
    trigger('moveList', [
      state('down', style({
        'margin-top': "270px",
      })),
      state('up', style({
        'margin-top': "112px",
      })),
      transition('* => *', animate('400ms ease-in')),
    ]),
    trigger('toolSlide', [
      state('down', style({
        top: '0px'
      })),
      state('up', style({
        top: '0px'
      })),
      transition('* => *', animate('400ms ease-in')),
    ]),
    trigger('show', [
      state('down', style({
        display: 'block',
      })),
      state('up', style({
        display: 'none',
      })),
      transition('* => *', animate('400ms ease-in')),
    ]),
    trigger('showHeight', [
      state('down', style({
        display: 'block',
      })),
      state('up', style({
        display: 'none',
      })),
      transition('* => *', animate('400ms ease-in')),
    ]),
  ]
})
export class FeedUser implements OnDestroy {
  @ViewChild('changeText') changeText: ElementRef;
  @ViewChild('availability') availability: ElementRef;
  @ViewChild('contentone') contentOne: ElementRef;
  @ViewChild('ratings') ratingbox: ElementRef;
  @ViewChild('weeklydeals') weekly: ElementRef;
  @ViewChild('promos') promos: ElementRef;
  @ViewChild('weekly') weeklyyellow: ElementRef;
  @ViewChild('price') price: ElementRef;
  @ViewChild('distance') distancey: ElementRef;
  @ViewChild('noavail') noavail;
  @ViewChild('infinitescroll') infinitescroll: ElementRef;

  @ViewChild(Content  ) content: Content;

  downState: String = 'notDown';
  moveState: String = 'up';
  toolbarState: String = 'up';
  showDropDown: String = 'up';
  showDropDownHeight: String = 'up';
  appointments: FirebaseListObservable<any>;
  appointmentsMonth: FirebaseListObservable<any>;
  appointmentsItem: FirebaseListObservable<any>;
  show = true;
  lastScrollTop: number = 0;
  direction: string = "";
  prices: FirebaseListObservable<any>;
  ratingslist:FirebaseListObservable<any>
  distancelist: FirebaseListObservable<any>;
  prom: FirebaseListObservable<any>;
  pricesArray = [];
  distances = [];
  stars;
  starsArray = [];
  rrr;
  fromprofile;
  itemsRef;


  private subscription: ISubscription;
  private subscription2: ISubscription;
  private subscription3: ISubscription;
  private subscription4: ISubscription;
  private subscription5: ISubscription;
  private subscription6: ISubscription;
  private subscription7: ISubscription;
  private subscription8: ISubscription;
  private subscription9: ISubscription;
  private subscription10: ISubscription;
  private subscription11: ISubscription;
  private subscription12: ISubscription;
  private subscription13: ISubscription;
  private subscription14: ISubscription;


  queryable: boolean = true;


  toolbarClicks = 0;

  list: FirebaseListObservable<any>;
  list2: AngularFireList<any>;
  list4: FirebaseListObservable<any>;
  list5: FirebaseListObservable<any>;
  list6: FirebaseListObservable<any>;
  objj: Observable<any>;
  availabilities = [];
  items = [];
  rating = [];
  promotions = [];
  username;

  totalCount = 0;
  lastNumRows = 0;
  el;
  startAtKey;
  startAtKeyAvail;
  lastKey;

  ads = [];
  swiperIndex;
  config: SwiperConfigInterface;
  swiperEvent;
  totalAdCount;
  swiperSize = 'begin';
  startAtKey1;
  lastKey1;
  startAtKey2;
  lastKey2;
  startAtKey3;
  lastKey3;
  startAtKey4;
  lastKey4;
  startAtKey5;
  lastKey5;

  distanceList: Observable<Array<any>>;

  constructor(public navParams: NavParams, public elRef: ElementRef, private cache: CacheService, private diagnostic: Diagnostic, private nativeGeocoder: NativeGeocoder, private geolocation: Geolocation, public zone: NgZone, public modalCtrl: ModalController, public af: AngularFireDatabase, public storage: Storage, private afAuth: AngularFireAuth, public renderer: Renderer, public loadingController: LoadingController, public navCtrl: NavController) {
     
  }

  loadModal(salon) {
    let profileModal = this.modalCtrl.create(PopUpOther, { salon: salon });
    profileModal.present();
  }

  doInfinite(infiniteScroll) {
    console.log("in doinfinite promotionsssssss");
    setTimeout(() => {
      console.log('Begin async operation');
      /*console.log(this.content.directionY + "        upupupupupupu********");
      if(this.content.directionY == 'up') {
        this.show = false
      }
      else {
        this.show = true;
      }*/

      console.log(this.startAtKey1 + "     before %%^&^&^% start at");
        this.af.list('/promotions', ref => ref.orderByKey().endAt(this.startAtKey1).limitToLast(11)).snapshotChanges().map(actions => {
          return actions.map(action => ({ key: action.key, data: action.payload.val() }));
        }).subscribe(items => {
          let x = 0;
          this.lastKey1 = this.startAtKey1;

          return items.map(item => {

            let storageRef = firebase.storage().ref().child('/settings/' + item.data.customMetadata.username + '/profilepicture.png');
                       
            storageRef.getDownloadURL().then(url => {
              console.log(url + "in download url !!!!!!!!!!!!!!!!!!!!!!!!");
              item.data.customMetadata.picURL = url;
            }).catch((e) => {
              console.log("in caught url !!!!!!!$$$$$$$!!");
              item.data.customMetadata.picURL = 'assets/blankprof.png';
            });
            
            if(this.startAtKey1 !== item.key && this.lastKey1 !== item.key) {
              console.log(this.startAtKey1 + "   :startAtKey1 before 4444444        item key:     " + item.key);
              if(item.data.customMetadata.username != null) {
                this.promotions.push(item.data.customMetadata); //unshift?**************
              }
            }

            if(x == 0) {
              this.startAtKey1 = item.key;
            }

            x++
          });
        });
      //);

      //queryObservable.subscribe(items => {
                 
      //});

      infiniteScroll.complete(); 
        
    }, 500);
  }

  doInfiniteP() {
    console.log("in doinfinite promotionsssssss");
    setTimeout(() => {
      console.log('Begin async operation');
      /*console.log(this.content.directionY + "        upupupupupupu********");
      if(this.content.directionY == 'up') {
        this.show = false
      }
      else {
        this.show = true;
      }*/

      this.af.list('/products', ref => ref.orderByKey().startAt(this.startAtKey2).limitToLast(11)).snapshotChanges().map(actions => {
          return actions.map(action => ({ key: action.key, data: action.payload.val() }));
        }).subscribe(items => {
        if(items.length > 0) {
          let x = 0;
          console.log(JSON.stringify(items[0]) + "     items 00000000000000");
          this.lastKey2 = this.startAtKey2;
          this.startAtKey2 = items[items.length - 1].key;
          return items.map(item => {

            if(x == 0) {

            }
            else {
              let storageRef = firebase.storage().ref().child('/settings/' + item.data.username + '/profilepicture.png');
                       
              storageRef.getDownloadURL().then(url => {
                console.log(url + "in download url !!!!!!!!!!!!!!!!!!!!!!!!");
                item.data.picURL = url;
              }).catch((e) => {
                console.log("in caught url !!!!!!!$$$$$$$!!");
                item.data.picURL = 'assets/blankprof.png';
              });
              

              if(this.startAtKey2 !== item.key && this.lastKey2 !== item.key) {
                console.log(this.startAtKey2 + "   :startAtKey2:");
                console.log(item.key + "   :itemkey:");
                console.log(this.lastKey2 + "   :lastkey:");
                if(item.data.price != null) {
                  this.pricesArray.push(item.data); //unshift?**************
                }
              }
            }

            

            x++;
          });          
        }  
      })

      this.pricesArray.sort(function(a,b) {
        return a.price.length - b.price.length;
      });


      //infiniteScroll.complete(); 
        
    }, 500);
  }

  doInfiniteR() {
    console.log("in doinfinite promotionsssssss");
    setTimeout(() => {
      console.log('Begin async operation');
      /*console.log(this.content.directionY + "        upupupupupupu********");
      if(this.content.directionY == 'up') {
        this.show = false
      }
      else {
        this.show = true;

      }*/

      this.af.list('/ratings', ref => ref.orderByKey().endAt(this.startAtKey3).limitToLast(11)).snapshotChanges().map(actions => {
          return actions.map(action => ({ key: action.key, data: action.payload.val() }));
        }).subscribe(items => {

          let x = 0;
          console.log(JSON.stringify(items[0]) + "     items 00000000000000");
          this.lastKey3 = this.startAtKey3;
          console.log(this.lastKey3 + " lastkey3333333333333asdfasdasdfasdfweew32323223fasdfasdf beginning");
          items.forEach(item => {


            let storageRef = firebase.storage().ref().child('/settings/' + item.data.username + '/profilepicture.png');
                       
            storageRef.getDownloadURL().then(url => {
              console.log(url + "in download url !!!!!!!!!!!!!!!!!!!!!!!!");
              item.data.picURL = url;
            }).catch((e) => {
              console.log("in caught url !!!!!!!$$$$$$$!!");
              item.data.picURL = 'assets/blankprof.png';
            });

            if(item.data.rating.one == 0 && item.data.rating.two == 0 && item.data.rating.three == 0 && item.data.rating.four == 0 && item.data.rating.five == 0) {
              this.stars = "No ratings";
            }
            else {

              console.log("making the stars");
              let totalPotential;
              let ratings;
              totalPotential = item.data.rating.one * 5 + item.data.rating.two * 5 + item.data.rating.three * 5 + item.data.rating.four * 5 + item.data.rating.five * 5;
              ratings = item.data.rating.one + item.data.rating.two * 2 + item.data.rating.three * 3 + item.data.rating.four * 4 + item.data.rating.five *5;
              

              let i = (ratings / totalPotential) * 100;
              if(Math.round(i) <= 20) {
                this.stars = '\u2605';
              }
              if(Math.round(i) > 20 && Math.round(i) <= 40) {
                this.stars = '\u2605\u2605';
              }
              if(Math.round(i) > 40 && Math.round(i) <= 60) {
                this.stars = '\u2605\u2605\u2605';
              }
              if(Math.round(i) > 60 && Math.round(i) <= 80) {
                this.stars = '\u2605\u2605\u2605\u2605';
              }
              if(Math.round(i) > 80) {
                this.stars = '\u2605\u2605\u2605\u2605\u2605';
              }
            }

            item.data.stars = this.stars;
            
            //this.renderer.setElementStyle(this.noavail.nativeElement, 'display', 'none');
            
            if(this.startAtKey3 !== item.key && this.lastKey3 !== item.key) {
              console.log(this.startAtKey3 + "   :startAtKey3 being pushed       item key:     " + item.key);
              if(item.data.username != null && (item.data.rating.five + item.data.rating.four + item.data.rating.three + item.data.rating.two + item.data.rating.one) > 0) {
                this.rating.push(item.data); //unshift?**************
              }
            }

            if(x == 0) {
              this.startAtKey3 = item.key;
            }

            console.log(this.startAtKey3 + " startatkeyyyyyyyy33333dddddddd33333333asdfasdfasdfasdf end");
            console.log(item.key + " item.$key       33dddddddd33333333asdfasdfasdfasdf end");

            x++;
          });          
          
      })

      this.rating.sort(function(a,b){ 
        if(a.stars !== "No ratings" && b.stars !== "No ratings") {
          if(a.stars === b.stars){
            return 0;
          }
          else {
            return a.stars.length < b.stars.length ? 1 : -1;
          }
        }
        else {
          if(a.stars === "No ratings"){
            return 1;
          }
          else if(b.stars === "No ratings"){
            return -1;
          }
        }

      });

      //infiniteScroll.complete(); 
        
    }, 500);
  }

  doInfiniteD() {
    console.log("in doinfinite distance");
    setTimeout(() => {
      console.log('Begin async operation');
      /*console.log(this.content.directionY + "        upupupupupupu********");
      if(this.content.directionY == 'up') {
        this.show = false
      }
      else {
        this.show = true;

      }*/
      this.af.list('/distances/' + this.username, ref => ref.orderByChild('distance').startAt(this.startAtKey4).limitToLast(11)).snapshotChanges().map(actions => {
          return actions.map(action => ({ key: action.key, data: action.payload.val() }));
        }).subscribe(items => {

          let x = 0;
          console.log(JSON.stringify(items[0]) + "     items 00000000000000");
          this.lastKey4 = this.startAtKey4;
          console.log(this.lastKey4 + " lastkey3333333333333asdfasdasdfasdfweew32323223fasdfasdf beginning");
          items.forEach(item => {
            let arr;
            if(x == 0) {
              //
            }
            else {

              let storageRef = firebase.storage().ref().child('/settings/' + item.data.username + '/profilepicture.png');
                             
              storageRef.getDownloadURL().then(url => {
                console.log(url + "in download url !!!!!!!!!!!!!!!!!!!!!!!!");
                item.data.picURL = url;
                this.distances.push(item);
              }).catch((e) => {
                console.log("in caught url !!!!!!!$$$$$$$!!");
                item.data.picURL = 'assets/blankprof.png';
                this.distances.push(item.data);
              });

              

              console.log(this.startAtKey4 + " startatkeyyyyyyyy33333dddddddd33333333asdfasdfasdfasdf end");
              //console.log(item.$key + " item.$key       33dddddddd33333333asdfasdfasdfasdf end");
            }

            if(x == items.length - 1) {
               this.startAtKey4 = item.data.distance;
            }

            x++;

          })

       })         
          
        //})      
    }, 500);
  }

  doInfiniteA() {
    console.log("in doinfinite promotionsssssss");
    setTimeout(() => {
      console.log('Begin async operation');
      
      this.af.list('/availabilities', ref => ref.orderByKey().startAt(this.startAtKey5).limitToLast(11)).snapshotChanges().map(actions => {
          return actions.map(action => ({ key: action.key, data: action.payload.val() }));
        }).subscribe(items => {
        var x = 0; 
        this.startAtKey5 = items[items.length - 1].key; 
        new Promise((resolve, reject) => {
          items.forEach(item => {
        
        
            if(x == 0) {
              //
            }
            else {

              var storageRef = firebase.storage().ref().child('/settings/' + item.data.salon + '/profilepicture.png');
                                       
              storageRef.getDownloadURL().then(url => {
                console.log(url + "in download url !!!!!!!!!!!!!!!!!!!!!!!!");
                item.data.pic = url;
                this.availabilities.push(item);
              }).catch((e) => {
                console.log("in caught url !!!!!!!$$$$$$$!!");
                item.data.pic = 'assets/blankprof.png';
                this.availabilities.push(item.data);
              });
            }

            if(x == items.length - 1) {
              resolve();
            }

            x++;

          })
        }).then(() => {
          setTimeout(() => {
            console.log("in load availabilities ......... ")
            console.log(JSON.stringify(this.availabilities));

            this.availabilities.sort(function(a,b) {
              return Date.parse('01/01/2013 '+a.time) - Date.parse('01/01/2013 '+b.time);
            });

            console.log('*****previous******');
            console.log(JSON.stringify(this.availabilities));
            console.log('*****sorted********');
            
            for(let i of this.availabilities) {
              console.log(i.time + "          this is itime");
              let date = new Date('01/01/2013 ' + i.time);
              console.log(date + "          this is date in idate");
              let str = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' });
              console.log(str);
              i.time = str;
            }
          }, 500)
        }); 
      });

      
    }, 500);
  }

  getAds() {
    let promises_array:Array<any> = [];
    let cacheKey = 'ads';

    
      this.cache.getItem(cacheKey).catch(() => {
        let store = [];
        console.log("in get addddssss ******");
        this.objj = this.af.object('/adcounter/count').valueChanges()

        this.subscription8 = this.objj.subscribe(item => { 
          console.log(JSON.stringify(item) + "in adddd subscribe()()()()()()");
          console.log(typeof item);
          this.totalAdCount = item.$value;
          
            for(let x = 1; x < item.$value + 1; x++) {
              console.log("in promise gafdfsfads")
              promises_array.push(new Promise((resolve,reject) => {

                let storageRef = firebase.storage().ref().child('/ads/ad' + x + '.png');
                storageRef.getDownloadURL().then(url => {
                  console.log(url);
                  store.push(url);
                  console.log("reigh before resolve");
                  resolve()
                  
                }).catch(e => {
                  resolve();
                });

              }));
            }

          let results = Promise.all(promises_array);
          results.then((value) => {
            this.ads = store;

            console.log(JSON.stringify(this.ads) + " value value vlaue");

            console.log("in list all");
            
            return this.cache.saveItem(cacheKey, this.ads);
          })
      })

        
    }).then((data) => {
        console.log("Saved data: ", data);
        this.ads = data;
    });

  }



  indexChange() {
    console.log(this.swiperIndex);
    if(this.swiperSize == 'small' || 'begin') {
      if(this.totalAdCount - 4 == this.swiperIndex) {
        this.navCtrl.push(UserProfile,{},{animate:true,animation:'transition',duration:100,direction:'forward'});
      }
      else if(this.swiperIndex == 0) {
        //this.navCtrl.push(FollowersPage,{},{animate:true,animation:'transition',duration:100,direction:'back'});
      }
    }
    else {
      if(this.totalAdCount - 1 == this.swiperIndex) {
        this.navCtrl.push(UserProfile,{},{animate:true,animation:'transition',duration:100,direction:'forward'});
      }
      else if(this.swiperIndex == 0) {
        //this.navCtrl.push(FollowersPage,{},{animate:true,animation:'transition',duration:100,direction:'back'});
      }
    }
  }

  swipeLeft() {
    this.navCtrl.push(UserViewProfile, {
      param1: 'user'
    },{animate:true,animation:'transition',duration:100,direction:'forward'});
  }

  toUserBooking() {
    
  }

  toProfile() {
    this.navCtrl.push(StylistProfile,{},{animate:true,animation:'transition',duration:100,direction:'forward'});
  }

  toFull() {
    this.navCtrl.push(FullfeedPage,{},{animate:true,animation:'transition',duration:100,direction:'back'});
  }

  toBooking() {
    this.navCtrl.push(UserBooking, {
      param1: 'user'
    },{animate:true,animation:'transition',duration:100,direction:'back'});
  }

  ngOnDestroy() {
    if(this.subscription != null) {
      this.subscription.unsubscribe();
    }
    if(this.subscription2 != null) {
      this.subscription2.unsubscribe();
    }
    if(this.subscription3 != null) {
      this.subscription3.unsubscribe();
    }
    if(this.subscription4 != null) {
      this.subscription4.unsubscribe();
    }
    if(this.subscription5 != null) {
      this.subscription5.unsubscribe();
    }
    if(this.subscription6 != null) {
      this.subscription6.unsubscribe();
    }
    if(this.subscription7 != null) {
      this.subscription7.unsubscribe();
    }
    if(this.subscription8 != null) {
      this.subscription8.unsubscribe();
    }
    if(this.subscription9 != null) {
      this.subscription9.unsubscribe();
    }
    if(this.subscription10 != null) {
      this.subscription10.unsubscribe();
    }
    if(this.subscription11 != null) {
      this.subscription11.unsubscribe();
    }
    if(this.subscription12 != null) {
      this.subscription12.unsubscribe();
    }
    if(this.subscription13 != null) {
      this.subscription13.unsubscribe();
    }
    if(this.subscription14 != null) {
      this.subscription14.unsubscribe();
    }
  } 

  pushPage(){
    // push another page on to the navigation stack
    // causing the nav controller to transition to the new page
    // optional data can also be passed to the pushed page.
    //this.navCtrl.push(SignUpPage);
  }

  ionViewWillLoad() {
    this.subscription = this.afAuth.authState.subscribe(data => {
      /*if(data.email && data.uid) {
        console.log("logged in");
      }*/
    })
  }



  scrollHandler(event) {
   //console.log(JSON.stringify(event));
   this.zone.run(()=>{
     if(event.directionY == 'up') {
       this.show = false;
     }
     else {
       this.show = true;
     }
     // since scrollAmount is data-binded,
     // the update needs to happen in zone
     //this.scrollAmount++
   })
  }

  distance(lat1, lon1, lat2, lon2, unit) {
    let radlat1 = Math.PI * lat1/180
    let radlat2 = Math.PI * lat2/180
    let theta = lon1-lon2
    let radtheta = Math.PI * theta/180
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist
  }

  round(number, precision) {
    let factor = Math.pow(10, precision);
    let tempNumber = number * factor;
    let roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  };

  loadDistances() {
    //return new Promise((resolve, reject) => {
      let cacheKey = "distances"
      let arr = [];
      let mapped;
      console.log("IN LOADDISTANCES #$$$$$$$$$$$$$$$$$$$$$");
      let x = 0;

      this.distanceList = this.af.list('/distances/' + this.username, ref => ref.orderByChild("distance").limitToFirst(50)).valueChanges();//.map(e => { console.log(e+"eeeeeeeeeeee")});

      /*this.distanceList = this.distanceList.map(items => (item => {
        console.log(JSON.stringify(item) + "      length - 1 load");
           
           
           //items.forEach(item => {
             let storageRef = firebase.storage().ref().child('/settings/' + item.username + '/profilepicture.png');
                         
              storageRef.getDownloadURL().then(url => {
                console.log(url + "in download url !!!!!!!!!!!!!!!!!!!!!!!!");
                item.picURL = url;
              }).catch((e) => {
                console.log("in caught url !!!!!!!$$$$$$$!!");
                item.picURL = 'assets/blankprof.png';
              });
             //this.distances.push(item);
             if(x == items.length - 1) {
               this.startAtKey4 = item.distance;
             }
             x++;
           //})
      }))*/
      /*.map(actions => {
          return actions.map(action => ({ key: action.key, data: action.payload.val() }));
        }).subscribe(items => { */
           
           
           
           //this.subscription6.unsubscribe();
      //})

      //this.items = this.af.list('distances/' + this.username).valueChanges();
     

  }

  loadPromotions() {
    console.log("In loadPromotions fdskkfdskldfkfdslkfds");
    
    this.af.list('/promotions', ref => ref.limitToLast(14)).snapshotChanges().map(actions => {
          return actions.map(action => ({ key: action.key, data: action.payload.val() }));
        }).subscribe(items => { 

      this.startAtKey1 = items[0].key;
      this.lastKey1 = this.startAtKey1;

      items.forEach(item => {
      //mapped = items.map((item) => {
        //return new Promise(resolve => {

            this.promotions.push(item.data.customMetadata);
            console.log("pushing ITEM (((((()()()()()() promotions" + JSON.stringify(item.data.customMetadata));
            //this.renderer.setElementStyle(this.noavail.nativeElement, 'display', 'none');

            
          
        //})  
      //})
      
      });

      
    });

    if(this.promotions != []) {
      //this.renderer.setElementStyle(this.noavail._elementRef.nativeElement, 'display', 'none');
    }
  }

  loadPrices() {
    //let mapped;
    //let cacheKey = "prices";
    //let results2;
    
    //this.cache.removeItem(cacheKey);

    //this.cache.getItem(cacheKey).catch(() => {

      //let array = [];

      this.af.list('/profiles/stylists', ref => ref.orderByChild('price').limitToFirst(50)).snapshotChanges().map(actions => {
          return actions.map(action => ({ key: action.key, data: action.payload.val() }));
        }).subscribe(items => {
        
        this.startAtKey2 = items[items.length - 1].key;
        this.lastKey2 = this.startAtKey2;

        let x = 0;
        items.forEach(item => {
        //mapped = items.map((item) => {
          //return new Promise(resolve => {

            if(x == 0) { 
              //
            }
            else {
              if(item.data.price == null) {
                //
              }
              else {
                console.log(JSON.stringify(item));
                if(!item.data.picURL) {
                  item.data.picURL = 'assets/blankprof.png';
                }
                if(item.data.price !== undefined) {
                  this.pricesArray.push(item.data); //unshift?**************
                }
                //this.renderer.setElementStyle(this.noavail.nativeElement, 'display', 'none');

              }
            }

            x++;
          //})  
        //})
        
        })
      });

        //results2 = Promise.all(mapped);
        //results2.then(() => {  
        //this.pricesArray = array;
        //console.log(this.pricesArray + "     pricesathis.rrrraaayyy ITEM (((((()()()()()() loadprices")   
        //return this.cache.saveItem(cacheKey, this.pricesArray);
      //})    
    /*}).then(data => {
      this.pricesArray = data;
    })*/
  }

  loadRatings(): Promise<any> {
    return new Promise((resolve, reject) => {
      let mapped;
      let cacheKey = "ratings";
      let results;
      let array = [];

      //this.cache.getItem(cacheKey).catch(() => {

        this.af.list('/profiles/stylists', ref => ref.orderByKey().limitToLast(50)).snapshotChanges().map(actions => {
          return actions.map(action => ({ key: action.key, data: action.payload.val() }));
        }).subscribe(items => {

            this.startAtKey3 = items[0].key;
            this.lastKey3 = this.startAtKey3;

            console.log(this.startAtKey3 + " startatkey3333333333333 beginning");
            console.log(this.lastKey3 + " lastkey3333333333333asdfasdfasdfasdf beginning");


            mapped = items.map((item) => {
              return new Promise(resolve => {
                if(!item.data.picURL) {
                  item.data.picURL = 'assets/blankprof.png';
                }

                for(let z in item.data.rating) {
                  console.log(z + "this is the rating string");
                }


                console.log(JSON.stringify(item) + "stringifyied item &&^^&%^%^%^$$%%$");
                if((item.data.rating.five + item.data.rating.four + item.data.rating.three + item.data.rating.two + item.data.rating.one) > 0) {
                  console.log("getting pushed &&%$$##@#@#@#@#@#");
                  array.push(item.data);
                }

                resolve();
                
              })

            })

            Promise.all(mapped).then(() => {
          //return this.cache.saveItem(cacheKey, array);
              console.log("resolved ***&&&^^^%%%$$$$$$$");
              resolve(array);
            })
         
        }) 
        

        
        

    });
  }

  ionViewDidEnter() {
    this.startAtKey4 = null;
    this.distances = [];
    this.loadDistances();
  }

  ionViewDidLeave() {
    
  }
     

  ionViewDidLoad() {
    this.storage.get('username').then((val) => {
      this.username = val;
    })

    this.fromprofile = this.navParams.get('param');

    this.loadAvailabilities();

    setTimeout(() => {
      this.renderer.setElementStyle(this.elRef.nativeElement.querySelector('.scroll-content'), 'margin-top', '6%');
    }, 750)
    
    let element = this.elRef.nativeElement.querySelector('.scroll-content');
    element.addEventListener('scroll', (event) =>
    {
        var element = event.target;
        if (element.scrollHeight - element.scrollTop === element.clientHeight)
        {
          setTimeout(() => {
            console.log('scrolled');
            if(this.weekly.nativeElement.style.display != 'none') {
              console.log("in doinfinite promotionsssssss");
              

                console.log(this.startAtKey1 + "     before %%^&^&^% start at");
                this.af.list('/promotions', ref => ref.orderByKey().endAt(this.startAtKey1).limitToLast(11)).snapshotChanges().map(actions => {
                  return actions.map(action => ({ key: action.key, data: action.payload.val() }));
                }).subscribe(items => {
                    let x = 0;
                    this.lastKey1 = this.startAtKey1;
                    items.forEach(item => {


                      let storageRef = firebase.storage().ref().child('/settings/' + item.data.customMetadata.username + '/profilepicture.png');
                                 
                      storageRef.getDownloadURL().then(url => {
                        console.log(url + "in download url !!!!!!!!!!!!!!!!!!!!!!!!");
                        item.data.customMetadata.picURL = url;
                      }).catch((e) => {
                        console.log("in caught url !!!!!!!$$$$$$$!!");
                        item.data.customMetadata.picURL = 'assets/blankprof.png';
                      });
                      
                      if(this.startAtKey1 !== item.key && this.lastKey1 !== item.key) {
                        console.log(this.startAtKey1 + "   :startAtKey1 before 4444444        item key:     " + item.key);
                        if(item.data.customMetadata.username != null) {
                          this.promotions.push(item.data.customMetadata); //unshift?**************
                        }
                      }

                      if(x == 0) {
                        this.startAtKey1 = item.key;
                      }

                      x++;
                    });          
                    
                })

                //infiniteScroll.complete(); 
                  
              
            }
            else if(this.price.nativeElement.style.display != 'none') {
              this.doInfiniteP();
            }
            else if(this.ratingbox.nativeElement.style.display != 'none') {
              this.doInfiniteR();
            }
            else if(this.distancey.nativeElement.style.display != 'none') {
              this.doInfiniteD();
              //element.removeEventListener('scroll', '.scroll-content');
            }
            else if(this.availability.nativeElement.style.display != 'none') {
              this.doInfiniteA();
            }

          }, 500);
        }
    });

    this.loadPromotions();
    this.getAds();
    //setTimeout(() => {


      //div.style.marginTop = "-47%";
      
    //}, 1000);
    
    

    
    let ratings;
    let totalPotential;

    this.loadRatings().then(array =>{

          console.log(array + '    ararrya &&*&&*&^^&%^%^');

          let r = 0;
          for(let item of array) {

            if(item.rating.one == 0 && item.rating.two == 0 && item.rating.three == 0 && item.rating.four == 0 && item.rating.five == 0) {
              this.stars = "No ratings";
            }
            else {

              console.log("making the stars");

              totalPotential = item.rating.one * 5 + item.rating.two * 5 + item.rating.three * 5 + item.rating.four * 5 + item.rating.five * 5;
              ratings = item.rating.one + item.rating.two * 2 + item.rating.three * 3 + item.rating.four * 4 + item.rating.five *5;
              

              let i = (ratings / totalPotential) * 100;
              if(Math.round(i) <= 20) {
                this.stars = '\u2605';
              }
              if(Math.round(i) > 20 && Math.round(i) <= 40) {
                this.stars = '\u2605\u2605';
              }
              if(Math.round(i) > 40 && Math.round(i) <= 60) {
                this.stars = '\u2605\u2605\u2605';
              }
              if(Math.round(i) > 60 && Math.round(i) <= 80) {
                this.stars = '\u2605\u2605\u2605\u2605';
              }
              if(Math.round(i) > 80) {
                this.stars = '\u2605\u2605\u2605\u2605\u2605';
              }
            }

            item.stars = this.stars;
            this.rating.push(item);
            //this.renderer.setElementStyle(this.noavail.nativeElement, 'display', 'none');
            r++;
          }

          console.log("THIS IS THE SORTED ARRAY TO BE SOthis.rrrED        " + JSON.stringify(this.rating));

          this.rating.sort(function(a,b){ 
            if(a.stars !== "No ratings" && b.stars !== "No ratings") {
              if(a.stars === b.stars){
                return 0;
              }
              else {
                return a.stars.length < b.stars.length ? 1 : -1;
              }
            }
            else {
              if(a.stars === "No ratings"){
                return 1;
              }
              else if(b.stars === "No ratings"){
                return -1;
              }
            }

          });

          //this.loadDistances().then(() => {
           

          
          this.loadPrices();
       //});

          setTimeout(() => {
            console.log("in load availabilities ......... ")
            console.log(JSON.stringify(this.availabilities));

            this.availabilities.sort(function(a,b) {
              return Date.parse('01/01/2013 '+a.time) - Date.parse('01/01/2013 '+b.time);
            });

            console.log('*****previous******');
            console.log(JSON.stringify(this.availabilities));
            console.log('*****sorted********');
            
            for(let i of this.availabilities) {
              console.log(i.time + "          this is itime");
              let date = new Date('01/01/2013 ' + i.time);
              console.log(date + "          this is date in idate");
              let str = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' });
              console.log(str);
              i.time = str;
            }

            /*console.log("UNSUBSCRIBED");
            if(this.subscription6 != null) {
              this.subscription6.unsubscribe();
            }*/
          }, 1500);
          
          this.loadDistances(); 
       });   

      
             



    
    ////this.renderer.setElementStyle(this.promos.nativeElement, 'color', '#e6c926');
    this.renderer.setElementStyle(this.weekly.nativeElement, 'display', 'block');
    this.renderer.setElementStyle(this.price.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.distancey.nativeElement, 'display', 'none');

    /*setTimeout(() => {
      this.loadDistances();
    },1000)*/
    
  }

  presentProfileModal(salon, time) {
    let profileModal = this.modalCtrl.create(PopUp, { salon: salon, time: time});
    profileModal.present();
  }

  presentProfileModalDistance(salon) {
    let profileModal = this.modalCtrl.create(PopUpOther, { salon: salon });
    profileModal.present();
  }

  presentProfileModalRatings(salon) {
    let profileModal = this.modalCtrl.create(PopUpOther, { salon: salon });
    profileModal.present();
  }

  presentProfileModalPrice(salon) {
    let profileModal = this.modalCtrl.create(PopUpOther, { salon: salon });
    profileModal.present();
  }

  toolClicked(event) {
    this.toolbarClicks++;
    console.log('tapped');

    
    if(this.toolbarClicks == 1) {
      setTimeout(() => {
        if(this.toolbarClicks == 2) {
          console.log('running application');
          this.downState = (this.downState == 'notDown') ? 'down' : 'notDown';
          this.moveState = (this.moveState == 'up') ? 'down' : 'up';
          this.toolbarState = (this.toolbarState == 'up') ? 'down' : 'up';
          if(this.toolbarState == 'up') {
            this.config = {
              direction: 'horizontal',
              slidesPerView: '4',
              keyboardControl: false
            };

            this.swiperSize = 'small';

          }
          else {
            this.config = {
              direction: 'horizontal',
              slidesPerView: '1',
              keyboardControl: false
            };

            this.swiperSize = 'big';

            
          }
          this.toolbarClicks = 0;
        }
        else {
          this.toolbarClicks = 0;
        }
      }, 300)
    }
  }

  switchView() {
    this.navCtrl.push(FeedStylist);
  }

  closeMenu() {
    if(this.showDropDown == 'down' || this.showDropDownHeight == 'down') {
      this.showDropDown = 'up';
      this.showDropDownHeight = 'up';
    }
    else {
      //
    }
    this.renderer.setElementStyle(this.changeText.nativeElement, 'color', 'gray');
    this.renderer.setElementStyle(this.weeklyyellow.nativeElement, 'color', '#e6c926');
    //this.renderer.setElementStyle(this.promos.nativeElement, 'color', 'gray');

    //this.renderer.setElementStyle(this.contentOne.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.availability.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.ratingbox.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.weekly.nativeElement, 'display', 'block');
    this.renderer.setElementStyle(this.price.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.distancey.nativeElement, 'display', 'none');


  }

  closeMenuP() {
    if(this.showDropDown == 'down' || this.showDropDownHeight == 'down') {
      this.showDropDown = 'up';
      this.showDropDownHeight = 'up';
    }
    else {
      //
    }
    this.renderer.setElementStyle(this.changeText.nativeElement, 'color', 'gray');
    //this.renderer.setElementStyle(this.contentOne.nativeElement, 'display', 'block');
    this.renderer.setElementStyle(this.availability.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.ratingbox.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.weekly.nativeElement, 'display', 'none');
    //this.renderer.setElementStyle(this.promos.nativeElement, 'color', '#e6c926');
    this.renderer.setElementStyle(this.weeklyyellow.nativeElement, 'color', 'gray');

    this.renderer.setElementStyle(this.price.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.distancey.nativeElement, 'display', 'none');


  }

  dropDown() {
 
    //this.renderer.setElementStyle(this.promos.nativeElement, 'color', 'gray');
    this.renderer.setElementStyle(this.weeklyyellow.nativeElement, 'color', 'gray');
    
    if(this.downState == 'down') {
      this.showDropDownHeight = (this.showDropDownHeight == 'up') ? 'down' : 'up';
    }
    else {
      this.showDropDown = (this.showDropDown == 'up') ? 'down' : 'up';
    }
  }

  dropDownD() {
    this.renderer.setElementStyle(this.elRef.nativeElement.querySelector('.scroll-content'), 'margin-top', '8%');
    this.renderer.setElementStyle(this.changeText.nativeElement, 'color', '#e6c926');
    this.renderer.setElementStyle(this.weeklyyellow.nativeElement, 'color', 'gray');
    //this.renderer.setElementStyle(this.promos.nativeElement, 'color', 'gray');
    //this.renderer.setElementStyle(this.contentOne.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.availability.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.ratingbox.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.weekly.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.price.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.distancey.nativeElement, 'display', 'block');


    this.changeText.nativeElement.innerHTML = "Distance";
    this.dropDown();
  }

  dropDownA() {
    

    this.changeText.nativeElement.innerHTML = "Availability";
    this.renderer.setElementStyle(this.changeText.nativeElement, 'color', '#e6c926');
    //this.renderer.setElementStyle(this.contentOne.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.availability.nativeElement, 'display', 'block');
    this.renderer.setElementStyle(this.ratingbox.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.price.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.distancey.nativeElement, 'display', 'none');


    this.renderer.setElementStyle(this.weekly.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.weeklyyellow.nativeElement, 'color', 'gray');
    //this.renderer.setElementStyle(this.promos.nativeElement, 'color', 'gray');


    this.dropDown();
  }

  dropDownP() {

    this.changeText.nativeElement.innerHTML = "Price";
    this.renderer.setElementStyle(this.changeText.nativeElement, 'color', '#e6c926');
    this.renderer.setElementStyle(this.weeklyyellow.nativeElement, 'color', 'gray');
    //this.renderer.setElementStyle(this.promos.nativeElement, 'color', 'gray');
    this.renderer.setElementStyle(this.elRef.nativeElement.querySelector('.scroll-content'), 'margin-top', '6%');
    this.renderer.setElementStyle(this.price.nativeElement, 'display', 'block');
    //this.renderer.setElementStyle(this.contentOne.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.availability.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.ratingbox.nativeElement, 'display', 'none');

    this.renderer.setElementStyle(this.weekly.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.distancey.nativeElement, 'display', 'none');

    //setTimeout(() => {
      //this.renderer.setElementStyle(this.elRef.nativeElement.querySelector('.scroll-content'), 'margin-top', '-47%');
    //}, 1000);

    this.dropDown();
  }

  dropDownR() {
    this.changeText.nativeElement.innerHTML = "Rating";
    this.renderer.setElementStyle(this.elRef.nativeElement.querySelector('.scroll-content'), 'margin-top', '6%');
    this.renderer.setElementStyle(this.changeText.nativeElement, 'color', '#e6c926');
    this.renderer.setElementStyle(this.weeklyyellow.nativeElement, 'color', 'gray');
    //this.renderer.setElementStyle(this.promos.nativeElement, 'color', 'gray');
    
    //this.renderer.setElementStyle(this.contentOne.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.availability.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.ratingbox.nativeElement, 'display', 'block');
    this.renderer.setElementStyle(this.weekly.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.price.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.distancey.nativeElement, 'display', 'none');


    this.dropDown();
  }

  gotoProfile() {
    this.navCtrl.push(StylistProfile);
  }

  onScroll(event) {
    console.log(event);
  }

  loadAvailabilities() {

    //return new Promise((resolve, reject) => {
      this.af.list('/today', ref => ref.orderByKey().limitToFirst(48)).snapshotChanges().map(actions => {
          return actions.map(action => ({ key: action.key, data: action.payload.val() }));
        }).subscribe(items => {

           this.startAtKey5 = items[items.length - 1].key; items.forEach(item => {
        
        console.log(item + "    item item item");
        let storageRef = firebase.storage().ref().child('/settings/' + item.data.salon + '/profilepicture.png');
                                 
        storageRef.getDownloadURL().then(url => {
          console.log(url + "in download url !!!!!!!!!!!!!!!!!!!!!!!!");
          item.data.pic = url;
          this.availabilities.push(item.data);
        }).catch((e) => {
          console.log("in caught url !!!!!!!$$$$$$$!!");
          item.data.pic = 'assets/blankprof.png';
          this.availabilities.push(item.data);
        });


      })});
    
  }

  

  setDateTime(time) {
    let date = new Date();
    let index = time.indexOf(":"); // replace with ":" for differently displayed time.
    let index2 = time.indexOf(" ");

    let hours = time.substring(0, index);
    let minutes = time.substring(index + 1, index2);

    var mer = time.substring(index2 + 1, time.length);

    console.log(mer + "        *******AMPM");

    if (mer == "PM") {
        console.log(hours + "        ())()()(()hours before(()()(");
        let number = parseInt(hours) + 12;
        hours = number.toString();
        console.log(hours + "      **********hours after*******");
    }


    date.setHours(hours);
    date.setMinutes(minutes);

    return date;
  }




}