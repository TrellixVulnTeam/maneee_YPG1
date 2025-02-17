import { Component, trigger, state, style, transition, animate, ViewChildren, ViewChild, OnDestroy, Renderer, ElementRef, QueryList } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FeedUser } from '../feeduser/feeduser';
import { BookingPage } from '../booking/booking';
import { PostpagePage } from '../postpage/postpage';
import { SettingsPage } from '../settings/settings';
import { ISubscription } from "rxjs/Subscription";



import { CameraService } from '../../services/cameraservice';
import { Camera } from '@ionic-native/camera';
import { ActionSheetController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
//\import { /*AngularFireDatabase,*/ FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import firebase from 'firebase';
import { LoadingController } from 'ionic-angular';
import { ImageViewerController } from 'ionic-img-viewer';
import { Storage } from '@ionic/storage';
import { NativeGeocoder, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';
import { Geolocation } from '@ionic-native/geolocation';
import { Http, RequestOptions, Headers } from '@angular/http';






//import { IonicApp, IonicModule } from 'ionic-angular';
//import { MyApp } from './app/app.component';

@Component({
  selector: 'user-view-profile',
  templateUrl: 'userviewprofile.html',
  animations: [
    trigger('moveCover', [
      state('down', style({
        height: '100%',
      })),
      state('up', style({
        height: '75px',
      })),
      transition('* => *', animate('400ms ease-in')),
    ]),
  ]
})
export class UserViewProfile implements OnDestroy {
  @ViewChildren('pluscontain') components:QueryList<any>;
  @ViewChildren('profsquare') profComponents:QueryList<any>;
  @ViewChildren('xclass') xclass:QueryList<any>;
  @ViewChild('locationlisted') locationListed;
  viewDate = new Date();
  events = [];
  viewTitle: string;
  calendar = {'mode': 'month', 'currentDate': this.viewDate}
  moveState: String = 'up';
  item1: AngularFireObject<any>;
  items2: AngularFireList<any>;
  subscription2: ISubscription;
  subscription3: ISubscription;
  subscription4: ISubscription;
  subscription5: ISubscription;
  subscription6: ISubscription;
  subscription9: ISubscription;
  username;
  picURLS = [];
  square = 0;
  _imageViewerCtrl: ImageViewerController;
  private swipeCoord?: [number, number];
  private swipeTime?: number;
  loadings;
  tds;
  selectedDate;
  titleYear;
  times;
  datesToSelect = [];
  followers;
  totalRatings;
  profilePic;
  stars;
  bio;
  thoroughfare;
  locality;
  bool = false;

  constructor(public http: Http, private nativeGeocoder: NativeGeocoder, private geolocation: Geolocation, public elRef: ElementRef, public storage: Storage, public imageViewerCtrl: ImageViewerController, public loadingController: LoadingController,/*public firebase: FirebaseApp, */public myrenderer: Renderer, public af: AngularFireDatabase, public actionSheetCtrl: ActionSheetController, public camera: Camera, public navCtrl: NavController, public cameraService: CameraService) {
    this.times = [{'time':'8:00 AM', 'selected': false}, {'time':'12:00 PM', 'selected': false}, {'time':'4:00 PM', 'selected': false},
                  {'time':'8:30 AM', 'selected': false}, {'time':'12:30 PM', 'selected': false}, {'time':'4:30 PM', 'selected': false},
                  {'time':'9:00 AM', 'selected': false}, {'time':'1:00 PM', 'selected': false}, {'time':'5:00 PM', 'selected': false},
                  {'time':'9:30 AM', 'selected': false}, {'time':'1:30 PM', 'selected': false}, {'time':'5:30 PM', 'selected': false},
                  {'time':'10:00 AM', 'selected': false}, {'time':'2:00 PM', 'selected': false}, {'time':'6:00 PM', 'selected': false},
                  {'time':'10:30 AM', 'selected': false}, {'time':'2:30 PM', 'selected': false}, {'time':'6:30 PM', 'selected': false},
                  {'time':'11:00 AM', 'selected': false}, {'time':'3:00 PM', 'selected': false}, {'time':'7:00 PM', 'selected': false},
                  {'time':'11:30 AM', 'selected': false}, {'time':'3:30 PM', 'selected': false}, {'time': '7:30 PM', 'selected': false}
                ];
  }

  public optionsGetMedia: any = {
        //allowEdit: false,
        quality: 10,
        targetWidth: 600,
        targetHeight: 600,
        encodingType: this.camera.EncodingType.PNG,
        sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
        mediaType: this.camera.MediaType.PICTURE,
        destinationType: this.camera.DestinationType.FILE_URI
  }

  public optionsGetCamera: any = {
        quality: 10,
        targetWidth: 600,
        targetHeight: 600,
        encodingType: this.camera.EncodingType.PNG,
        sourceType: this.camera.PictureSourceType.CAMERA,
        mediaType: this.camera.MediaType.PICTURE,
        destinationType: this.camera.DestinationType.FILE_URI,
        //saveToPhotoAlbum: true
  }

  ionViewWillUnload() {
    this.navCtrl.pop();
  }

  ionViewDidEnter() {
    //let loading = this.loadingController.create({content : "Loading..."});
    //loading.present();
  }

  getFollowers() {
    
  }

  setLocation() {
    this.bool = true;

    let loading = this.loadingController.create({content : "Loading..."});
    loading.present();

    this.geolocation.getCurrentPosition().then((resp) => {
      let location = resp;

      this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude)
        .then((result: NativeGeocoderReverseResult) => {
          console.log("I AM IN THE GEOCODING ***&&*&*&*&*");
          //console.log(JSON.stringify(address.street + "      " + address.city + "    add street city9999"));
          let newResult: NativeGeocoderResultModel = JSON.parse(JSON.stringify(result));

            this.af.object('/distances/' + this.username).remove();
          
            this.thoroughfare = newResult.thoroughfare;
            this.locality = newResult.locality;

            this.storage.set('locality', this.locality);
            this.storage.set('thoroughfare', this.thoroughfare);

            console.log(JSON.stringify(this.locationListed) + "     thisislocaitonlistedste    3223i32ip 3ij223");
            this.myrenderer.setElementStyle(this.locationListed.nativeElement, 'display', 'block');

            this.item1 = this.af.object('/profiles/users/'+this.username);

            this.item1.update({'location': {'latitude' : resp.coords.latitude, 'longitude' : resp.coords.longitude }}).then(() => {
              alert("Your location has been updated");
              this.storage.set('location', false);
            }).catch((e) => { loading.dismiss(); alert("Something went wrong with setting your location, please try again.")});



            let a = this.http.get('https://us-central1-mane-4152c.cloudfunctions.net/sortDistance?text='+resp.coords.latitude+':'+resp.coords.longitude+':'+this.username);  
            this.subscription6 = a.subscribe(res => {
               console.log(res + "response from firesbase functions");
               loading.dismiss();
             }, err => {
               console.log(JSON.stringify(err))
               loading.dismiss();
             })

          }).catch(e => {
            console.log(e.message + " caught this error");
            loading.dismiss();
          })
    }).catch(e => {
      console.log(e.message + " caught this error");
      loading.dismiss();
    })

    loading.dismiss();
  }

  ionViewDidLoad() {

    this.storage.get('bio').then((val)=> {
      this.bio = val;
    })

    this.storage.get('locality').then((val)=> {
      this.locality = val;
      this.storage.get('thoroughfare').then((val) => {
        this.thoroughfare = val;
      })
    })

    this.storage.get('location').then((val)=> {
      if(val == true) {
        this.myrenderer.setElementStyle(this.locationListed.nativeElement, 'display', 'none');
      };
    })


    
    this.storage.get('username').then((val) => {
      this.username = val;
      console.log(val);

      this.downloadImages();

      /*this.item2 = this.af.object('/profiles/stylists/' + this.username + '/followers');
      this.subscription5 = this.item2.subscribe(item => {
        console.log(JSON.stringify(item) + "      followers number 98989899889");
        if(Object.keys(item)[0] == '$value') {
          this.followers = 0;
        }
        else {
          this.followers = item.length;
        }
      });

      this.item9 = this.af.object('/profiles/stylists/' + this.username);
      this.subscription9 = this.item9.subscribe(item => {
        console.log(JSON.stringify(item) + "      rating number 989898222229889");
        let total = 0;
        for(let u in item.rating) {
          total += item.rating[u];
        }
        this.totalRatings = total;

        let totalPotential = item.rating.one * 5 + item.rating.two * 5 + item.rating.three * 5 + item.rating.four * 5 + item.rating.five * 5;
        let ratings = item.rating.one + item.rating.two * 2 + item.rating.three * 3 + item.rating.four * 4 + item.rating.five *5;
        
        console.log(ratings + "   ratings          total potential:    " + totalPotential);

        if(ratings == 0 && totalPotential == 0) {
          this.stars = '\u2606\u2606\u2606\u2606\u2606';
        }

        let i = (ratings / totalPotential) * 100;
        if(Math.round(i) <= 20) {
          this.stars = '\u2605\u2606\u2606\u2606\u2606';
        }
        if(Math.round(i) > 20 && Math.round(i) <= 40) {
          this.stars = '\u2605\u2605\u2606\u2606\u2606';
        }
        if(Math.round(i) > 40 && Math.round(i) <= 60) {
          this.stars = '\u2605\u2605\u2605\u2606\u2606';
        }
        if(Math.round(i) > 60 && Math.round(i) <= 80) {
          this.stars = '\u2605\u2605\u2605\u2605\u2606';
        }
        if(Math.round(i) > 80) {
          this.stars = '\u2605\u2605\u2605\u2605\u2605';
        }
        
      });*/

    });

    this.storage.get('picURL').then((val) => {
      this.profilePic = val;

      if(this.profilePic == null) {
        this.profilePic = 'assets/blankprof.png';
      }
    });    

    //this.isSomething = true;

    this.tds = this.elRef.nativeElement.querySelectorAll('td[tappable]');
  
    console.log(this.viewDate + " view date ");
      setTimeout(()=>{
        this.selectedDate = this.viewDate;
        console.log(this.username + "this.username");
        //this.items2 = this.af.list();
        this.af.list('appointments/' + this.username + '/' + this.selectedDate.getMonth(), ref => ref ).snapshotChanges().map(actions => {
          return actions.map(action => ({ key: action.key, data: action.payload.val() }));
        }).subscribe(items => items.forEach(item => {

          console.log(item.data);

          let da = new Date(item.data.date.day * 1000);
          this.datesToSelect.push(da.getDate());


          console.log(da + "da");
          console.log(da.getDate() + "dagetdate");
          console.log(this.selectedDate.getDate());
          if(this.selectedDate.getDate() == da.getDate() && this.selectedDate.getMonth() == da.getMonth()) {
            console.log("selected = item");
            console.log(JSON.stringify(item.data.reserved) + "         item resesrved above");

              this.times = item.data.reserved.appointment.slice(0);
              console.log('hit appointment');

          }


          for(let item of this.tds) {
            if(!item.classList.contains('text-muted')) {
              console.log(typeof item.innerText + "         innertext" + typeof this.datesToSelect[0]);
              if(this.datesToSelect.indexOf(parseInt(item.innerText)) != -1) {
                console.log("Inner text in      " + item.innerText);
                this.myrenderer.setElementClass(item,"greencircle",true);            
              }
              else {
                //this.myrenderer.setElementClass(item,"monthview-selected",false);
              }
            }
          }
          
        }));
        
        
        //loading.dismiss();
      },1500)
  }

  ngOnDestroy() {
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
    if(this.subscription9 != null) {
      this.subscription9.unsubscribe();
    }
  }

  openCamera(squarez) {
    this.presentActionSheet();
    this.square = squarez;
  }

  removePic(squarez) {
    console.log("in remove pic 333333333          " + squarez);

    let itemArray = this.components.toArray();
    let itemArrayTwo = this.profComponents.toArray();
    let itemArraythree = this.xclass.toArray();

    console.log(JSON.stringify(itemArray) + " item array");
    this.myrenderer.setElementStyle(itemArray[squarez - 1].nativeElement, 'display', 'block');
    this.myrenderer.setElementStyle(itemArrayTwo[squarez - 1].nativeElement, 'display', 'none');
    this.myrenderer.setElementStyle(itemArraythree[squarez - 1].nativeElement, 'display', 'none');

    this.storage.set("profile"+squarez, null);
  }
    



  presentImage(squarez) {
    this.square = squarez;
    let itemArrayTwo = this.profComponents.toArray();
    console.log(JSON.stringify(itemArrayTwo[this.square-1]));
    const imageViewer = this.imageViewerCtrl.create(itemArrayTwo[this.square - 1].nativeElement);
    imageViewer.present();
  }

  showSquare() {
    let itemArray = this.components.toArray();
    let itemArrayTwo = this.profComponents.toArray();
    let itemArraythree = this.xclass.toArray();
    this.myrenderer.setElementStyle(itemArray[this.square - 1].nativeElement, 'display', 'none');
    this.myrenderer.setElementStyle(itemArrayTwo[this.square - 1].nativeElement, 'display', 'block');
    this.myrenderer.setElementStyle(itemArraythree[this.square - 1].nativeElement, 'display', 'block');
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Choose source',
      buttons: [
        {
          text: 'Camera',
          handler: () => {
            let itemArrayTwo = this.profComponents.toArray();
            this.cameraService.getMedia(this.optionsGetCamera, this.square).then(() => {
              return new Promise((resolve, reject) => {
                let storageRef = firebase.storage().ref().child('/profile/' + this.username + '/profile_' + this.username + '_' + this.square + '.png');
                let loading = this.loadingController.create({content : "Loading..."});
                loading.present();
                setTimeout(() => {
                  storageRef.getDownloadURL().then(url => {
                    console.log(url);
                    this.storage.set("profile"+this.square, url);
                    this.myrenderer.setElementAttribute(itemArrayTwo[this.square - 1].nativeElement, 'src', url);
                    this.showSquare();
                    
                  });
                  loading.dismiss();
                }, 3000);
              });
            }); //pass in square choice
            //this.myrenderer.setElementAttribute(this.itemArrayTwo[this.square - 1].nativeElement, 'src', 'block');
            console.log('camera clicked');
          }
        },{
          text: 'Photo Library',
          handler: () => {
            let itemArrayTwo = this.profComponents.toArray();

            this.cameraService.getMedia(this.optionsGetMedia, this.square).then(() => {
                return new Promise((resolve, reject) => {
                  let storageRef = firebase.storage().ref().child('/profile/' + this.username + '/profile_' + this.username + '_' + this.square + '.png');
                  let loading = this.loadingController.create({content : "Loading..."});
                  loading.present();
                  setTimeout(() => {
                    storageRef.getDownloadURL().then(url => {
                      console.log(url);
                      this.storage.set("profile"+this.square, url);
                      this.myrenderer.setElementAttribute(itemArrayTwo[this.square - 1].nativeElement, 'src', url);
                      this.showSquare();
                      
                      resolve();
                    });
                    loading.dismiss();
                  }, 3500);
                });
              //
              
            }).catch(e => {
              console.log(e + "       eeeee");
            });
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  pushPage(){
    // push another page on to the navigation stack
    // causing the nav controller to transition to the new page
    // optional data can also be passed to the pushed page.
    //this.navCtrl.push(SignUpPage);
  }

  tappedPost() {
    this.navCtrl.push(PostpagePage);
  }

  tappedEmergency() {
    this.navCtrl.push(BookingPage);
  }

  goToSettings() {
    this.navCtrl.push(SettingsPage);
  }

  backToCal() {
    //if(this.navParams.get('param1') == 'user') {
      this.navCtrl.push(BookingPage,{},{animate:true,animation:'transition',duration:100,direction:'forward'})
      //this.navCtrl.push(BookingPage);
    //}
    //else {
      //this.navCtrl.push(FeedStylist);
    //}
  }

  swipe(e: TouchEvent, when: string): void {
    const coord: [number, number] = [e.changedTouches[0].pageX, e.changedTouches[0].pageY];
    const time = new Date().getTime();

    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
    }

    else if (when === 'end') {
      const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
      const duration = time - this.swipeTime;

      if (duration < 1000 //Short enough
        && Math.abs(direction[1]) < Math.abs(direction[0]) //Horizontal enough
        && Math.abs(direction[0]) > 30) {  //Long enough
          const swipe = direction[0] < 0 ? 'next' : 'previous';
          console.log(swipe);

          if(swipe == 'next') {
            this.backToCal();
          }
          else {
          }
      //Do whatever you want with swipe
      }
    }
  }

  swipeLeft() {
    this.backToCal();
  }

  swipeRight() {
    /*if(this.bool) {
      console.log("in set rooooooooooooot");
      this.navCtrl.push(FeedUser, { param: 'fromprofile' }, {animate:true,animation:'transition',duration:100,direction:'back'});
    }
    else {*/
      this.navCtrl.popToRoot({animate:true,animation:'transition',duration:100,direction:'back'});
    //}
  }

  downloadImages() {
    let self = this;
    let promises_array:Array<any> = [];
    let itemArrayTwo = this.profComponents.toArray();
    let itemArray = this.components.toArray();
    let itemArraythree = this.xclass.toArray();

    for (let z = 1; z < 10; z++) {
     
          self.storage.get("profile"+z).then((val) =>{
            if(val!=null) {
              self.myrenderer.setElementAttribute(itemArrayTwo[z - 1].nativeElement, 'src', val);
              self.myrenderer.setElementStyle(itemArrayTwo[z - 1].nativeElement, 'display', 'block');
              self.myrenderer.setElementStyle(itemArray[z - 1].nativeElement, 'display', 'none');
              self.myrenderer.setElementStyle(itemArraythree[z - 1].nativeElement, 'display', 'block');

              console.log(z);
              
            }
            //resolve();
          })         

    }

  }
}
export interface NativeGeocoderResultModel {
  subAdministrativeArea: string,
  postalCode: number,
  locality: string,
  subLocality: string,
  subThoroughfare: string,
  countryCode: string,
  countryName: string,
  administrativeArea: string,
  thoroughfare: string
}
