var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { NgZone, Component, trigger, state, style, transition, animate, ViewChild, ElementRef, Renderer } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { LoadingController, Content } from 'ionic-angular';
import { StylistProfile } from '../stylistprofile/stylistprofile';
import { FeedStylist } from '../feedstylist/feedstylist';
import { UserBooking } from '../userbooking/userbooking';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Storage } from '@ionic/storage';
import { PopUp } from '../../modals/popup/popup';
import { PopUpOther } from '../../modals/popupother/popupother';
import * as firebase from 'firebase';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { Diagnostic } from '@ionic-native/diagnostic';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { UserViewProfile } from '../userviewprofile/userviewprofile';
import { UserProfile } from '../userprofile/userprofile';
import { FullfeedPage } from '../fullfeed/fullfeed';
import { CacheService } from 'ionic-cache';
var limit = new BehaviorSubject(2); // import 'rxjs/BehaviorSubject';
var FeedUser = /** @class */ (function () {
    function FeedUser(elRef, cache, diagnostic, nativeGeocoder, geolocation, zone, modalCtrl, af, storage, afAuth, renderer, loadingController, navCtrl) {
        this.elRef = elRef;
        this.cache = cache;
        this.diagnostic = diagnostic;
        this.nativeGeocoder = nativeGeocoder;
        this.geolocation = geolocation;
        this.zone = zone;
        this.modalCtrl = modalCtrl;
        this.af = af;
        this.storage = storage;
        this.afAuth = afAuth;
        this.renderer = renderer;
        this.loadingController = loadingController;
        this.navCtrl = navCtrl;
        this.downState = 'notDown';
        this.moveState = 'up';
        this.toolbarState = 'up';
        this.showDropDown = 'up';
        this.showDropDownHeight = 'up';
        this.show = true;
        this.lastScrollTop = 0;
        this.direction = "";
        this.pricesArray = [];
        this.distances = [];
        this.starsArray = [];
        this.queryable = true;
        this.toolbarClicks = 0;
        this.availabilities = [];
        this.items = [];
        this.rating = [];
        this.promotions = [];
        this.totalCount = 0;
        this.lastNumRows = 0;
        this.ads = [];
        this.swiperSize = 'begin';
    }
    FeedUser.prototype.loadModal = function (salon) {
        var profileModal = this.modalCtrl.create(PopUpOther, { salon: salon });
        profileModal.present();
    };
    FeedUser.prototype.doInfinite = function (infiniteScroll) {
        var _this = this;
        console.log("in doinfinite promotionsssssss");
        setTimeout(function () {
            console.log('Begin async operation');
            /*console.log(this.content.directionY + "        upupupupupupu********");
            if(this.content.directionY == 'up') {
              this.show = false
            }
            else {
              this.show = true;
            }*/
            console.log(_this.startAtKey1 + "     before %%^&^&^% start at");
            _this.list2 = _this.af.list('/promotions', {
                query: {
                    orderByKey: true,
                    endAt: _this.startAtKey1,
                    limitToLast: 11
                }
            });
            _this.subscription11 = _this.list2.subscribe(function (items) {
                var x = 0;
                _this.lastKey1 = _this.startAtKey1;
                items.forEach(function (item) {
                    var storageRef = firebase.storage().ref().child('/settings/' + item.customMetadata.username + '/profilepicture.png');
                    storageRef.getDownloadURL().then(function (url) {
                        console.log(url + "in download url !!!!!!!!!!!!!!!!!!!!!!!!");
                        item.customMetadata.picURL = url;
                    }).catch(function (e) {
                        console.log("in caught url !!!!!!!$$$$$$$!!");
                        item.customMetadata.picURL = 'assets/blankprof.png';
                    });
                    if (_this.startAtKey1 !== item.$key && _this.lastKey1 !== item.$key) {
                        console.log(_this.startAtKey1 + "   :startAtKey1 before 4444444        item key:     " + item.$key);
                        if (item.customMetadata.username != null) {
                            _this.promotions.push(item.customMetadata); //unshift?**************
                        }
                    }
                    if (x == 0) {
                        _this.startAtKey1 = item.$key;
                    }
                    x++;
                });
            });
            infiniteScroll.complete();
        }, 500);
    };
    FeedUser.prototype.doInfiniteP = function () {
        var _this = this;
        console.log("in doinfinite promotionsssssss");
        setTimeout(function () {
            console.log('Begin async operation');
            /*console.log(this.content.directionY + "        upupupupupupu********");
            if(this.content.directionY == 'up') {
              this.show = false
            }
            else {
              this.show = true;
            }*/
            console.log(_this.startAtKey2 + "     before %%^&^&^% start at");
            _this.list4 = _this.af.list('/profiles/stylists', {
                query: {
                    orderByKey: true,
                    endAt: _this.startAtKey2,
                    limitToLast: 11
                }
            });
            _this.subscription12 = _this.list4.subscribe(function (items) {
                var x = 0;
                console.log(JSON.stringify(items[0]) + "     items 00000000000000");
                _this.lastKey2 = _this.startAtKey2;
                items.forEach(function (item) {
                    var storageRef = firebase.storage().ref().child('/settings/' + item.username + '/profilepicture.png');
                    storageRef.getDownloadURL().then(function (url) {
                        console.log(url + "in download url !!!!!!!!!!!!!!!!!!!!!!!!");
                        item.picURL = url;
                    }).catch(function (e) {
                        console.log("in caught url !!!!!!!$$$$$$$!!");
                        item.picURL = 'assets/blankprof.png';
                    });
                    if (_this.startAtKey2 !== item.$key && _this.lastKey2 !== item.$key) {
                        console.log(_this.startAtKey2 + "   :startAtKey2:");
                        console.log(item.$key + "   :itemkey:");
                        console.log(_this.lastKey2 + "   :lastkey:");
                        if (item.price != null) {
                            _this.pricesArray.push(item); //unshift?**************
                        }
                    }
                    if (x == 0) {
                        _this.startAtKey2 = item.$key;
                    }
                    x++;
                });
            });
            _this.pricesArray.sort(function (a, b) {
                return b.price.length - a.price.length;
            });
            //infiniteScroll.complete(); 
        }, 500);
    };
    FeedUser.prototype.doInfiniteR = function () {
        var _this = this;
        console.log("in doinfinite promotionsssssss");
        setTimeout(function () {
            console.log('Begin async operation');
            /*console.log(this.content.directionY + "        upupupupupupu********");
            if(this.content.directionY == 'up') {
              this.show = false
            }
            else {
              this.show = true;
      
            }*/
            console.log(_this.startAtKey3 + "     before startatkey3 start at 67767676765676765757");
            _this.list5 = _this.af.list('/profiles/stylists', {
                query: {
                    orderByKey: true,
                    endAt: _this.startAtKey3,
                    limitToLast: 11
                }
            });
            _this.subscription13 = _this.list5.subscribe(function (items) {
                var x = 0;
                console.log(JSON.stringify(items[0]) + "     items 00000000000000");
                _this.lastKey3 = _this.startAtKey3;
                console.log(_this.lastKey3 + " lastkey3333333333333asdfasdasdfasdfweew32323223fasdfasdf beginning");
                items.forEach(function (item) {
                    var storageRef = firebase.storage().ref().child('/settings/' + item.username + '/profilepicture.png');
                    storageRef.getDownloadURL().then(function (url) {
                        console.log(url + "in download url !!!!!!!!!!!!!!!!!!!!!!!!");
                        item.picURL = url;
                    }).catch(function (e) {
                        console.log("in caught url !!!!!!!$$$$$$$!!");
                        item.picURL = 'assets/blankprof.png';
                    });
                    if (item.rating.one == 0 && item.rating.two == 0 && item.rating.three == 0 && item.rating.four == 0 && item.rating.five == 0) {
                        _this.stars = "No ratings";
                    }
                    else {
                        console.log("making the stars");
                        var totalPotential = void 0;
                        var ratings = void 0;
                        totalPotential = item.rating.one * 5 + item.rating.two * 5 + item.rating.three * 5 + item.rating.four * 5 + item.rating.five * 5;
                        ratings = item.rating.one + item.rating.two * 2 + item.rating.three * 3 + item.rating.four * 4 + item.rating.five * 5;
                        var i = (ratings / totalPotential) * 100;
                        if (Math.round(i) <= 20) {
                            _this.stars = '\u2605';
                        }
                        if (Math.round(i) > 20 && Math.round(i) <= 40) {
                            _this.stars = '\u2605\u2605';
                        }
                        if (Math.round(i) > 40 && Math.round(i) <= 60) {
                            _this.stars = '\u2605\u2605\u2605';
                        }
                        if (Math.round(i) > 60 && Math.round(i) <= 80) {
                            _this.stars = '\u2605\u2605\u2605\u2605';
                        }
                        if (Math.round(i) > 80) {
                            _this.stars = '\u2605\u2605\u2605\u2605\u2605';
                        }
                    }
                    item.stars = _this.stars;
                    //this.renderer.setElementStyle(this.noavail.nativeElement, 'display', 'none');
                    if (_this.startAtKey3 !== item.$key && _this.lastKey3 !== item.$key) {
                        console.log(_this.startAtKey3 + "   :startAtKey3 being pushed       item key:     " + item.$key);
                        if (item.username != null) {
                            _this.rating.push(item); //unshift?**************
                        }
                    }
                    if (x == 0) {
                        _this.startAtKey3 = item.$key;
                    }
                    console.log(_this.startAtKey3 + " startatkeyyyyyyyy33333dddddddd33333333asdfasdfasdfasdf end");
                    console.log(item.$key + " item.$key       33dddddddd33333333asdfasdfasdfasdf end");
                    x++;
                });
            });
            _this.rating.sort(function (a, b) {
                if (a.stars !== "No ratings" && b.stars !== "No ratings") {
                    if (a.stars === b.stars) {
                        return 0;
                    }
                    else {
                        return a.stars.length < b.stars.length ? 1 : -1;
                    }
                }
                else {
                    if (a.stars === "No ratings") {
                        return 1;
                    }
                    else if (b.stars === "No ratings") {
                        return -1;
                    }
                }
            });
            //infiniteScroll.complete(); 
        }, 500);
    };
    FeedUser.prototype.getAds = function () {
        var _this = this;
        var promises_array = [];
        var cacheKey = 'ads';
        this.cache.getItem(cacheKey).catch(function () {
            var store = [];
            console.log("in get addddssss ******");
            _this.objj = _this.af.object('/adcounter/count');
            _this.subscription6 = _this.objj.subscribe(function (item) {
                console.log(JSON.stringify(item) + "in adddd subscribe()()()()()()");
                console.log(typeof item);
                _this.totalAdCount = item.$value;
                var _loop_1 = function (x) {
                    console.log("in promise gafdfsfads");
                    promises_array.push(new Promise(function (resolve, reject) {
                        var storageRef = firebase.storage().ref().child('/ads/ad' + x + '.png');
                        storageRef.getDownloadURL().then(function (url) {
                            console.log(url);
                            store.push(url);
                            console.log("reigh before resolve");
                            resolve();
                        }).catch(function (e) {
                            resolve();
                        });
                    }));
                };
                for (var x = 1; x < item.$value + 1; x++) {
                    _loop_1(x);
                }
                var results = Promise.all(promises_array);
                results.then(function (value) {
                    _this.ads = store;
                    console.log(JSON.stringify(_this.ads) + " value value vlaue");
                    console.log("in list all");
                    return _this.cache.saveItem(cacheKey, _this.ads);
                });
            });
        }).then(function (data) {
            console.log("Saved data: ", data);
            _this.ads = data;
        });
    };
    FeedUser.prototype.indexChange = function () {
        console.log(this.swiperIndex);
        if (this.swiperSize == 'small' || 'begin') {
            if (this.totalAdCount - 4 == this.swiperIndex) {
                this.navCtrl.push(UserProfile, {}, { animate: true, animation: 'transition', duration: 100, direction: 'forward' });
            }
            else if (this.swiperIndex == 0) {
                //this.navCtrl.push(FollowersPage,{},{animate:true,animation:'transition',duration:100,direction:'back'});
            }
        }
        else {
            if (this.totalAdCount - 1 == this.swiperIndex) {
                this.navCtrl.push(UserProfile, {}, { animate: true, animation: 'transition', duration: 100, direction: 'forward' });
            }
            else if (this.swiperIndex == 0) {
                //this.navCtrl.push(FollowersPage,{},{animate:true,animation:'transition',duration:100,direction:'back'});
            }
        }
    };
    FeedUser.prototype.swipeLeft = function () {
        this.navCtrl.push(UserViewProfile, {
            param1: 'user'
        }, { animate: true, animation: 'transition', duration: 100, direction: 'forward' });
    };
    FeedUser.prototype.toUserBooking = function () {
    };
    FeedUser.prototype.toProfile = function () {
        this.navCtrl.push(StylistProfile, {}, { animate: true, animation: 'transition', duration: 100, direction: 'forward' });
    };
    FeedUser.prototype.toFull = function () {
        this.navCtrl.push(FullfeedPage, {}, { animate: true, animation: 'transition', duration: 100, direction: 'back' });
    };
    FeedUser.prototype.toBooking = function () {
        this.navCtrl.push(UserBooking, {
            param1: 'user'
        }, { animate: true, animation: 'transition', duration: 100, direction: 'back' });
    };
    FeedUser.prototype.ngOnDestroy = function () {
        if (this.subscription != null) {
            this.subscription.unsubscribe();
        }
        if (this.subscription2 != null) {
            this.subscription2.unsubscribe();
        }
        if (this.subscription3 != null) {
            this.subscription3.unsubscribe();
        }
        if (this.subscription4 != null) {
            this.subscription4.unsubscribe();
        }
        if (this.subscription5 != null) {
            this.subscription5.unsubscribe();
        }
        if (this.subscription6 != null) {
            this.subscription6.unsubscribe();
        }
        if (this.subscription7 != null) {
            this.subscription7.unsubscribe();
        }
        if (this.subscription8 != null) {
            this.subscription8.unsubscribe();
        }
        if (this.subscription9 != null) {
            this.subscription9.unsubscribe();
        }
        if (this.subscription10 != null) {
            this.subscription10.unsubscribe();
        }
        if (this.subscription11 != null) {
            this.subscription11.unsubscribe();
        }
        if (this.subscription12 != null) {
            this.subscription12.unsubscribe();
        }
    };
    FeedUser.prototype.pushPage = function () {
        // push another page on to the navigation stack
        // causing the nav controller to transition to the new page
        // optional data can also be passed to the pushed page.
        //this.navCtrl.push(SignUpPage);
    };
    FeedUser.prototype.ionViewWillLoad = function () {
        this.subscription = this.afAuth.authState.subscribe(function (data) {
            /*if(data.email && data.uid) {
              console.log("logged in");
            }*/
        });
    };
    FeedUser.prototype.scrollHandler = function (event) {
        var _this = this;
        //console.log(JSON.stringify(event));
        this.zone.run(function () {
            if (event.directionY == 'up') {
                _this.show = false;
            }
            else {
                _this.show = true;
            }
            // since scrollAmount is data-binded,
            // the update needs to happen in zone
            //this.scrollAmount++
        });
    };
    FeedUser.prototype.distance = function (lat1, lon1, lat2, lon2, unit) {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") {
            dist = dist * 1.609344;
        }
        if (unit == "N") {
            dist = dist * 0.8684;
        }
        return dist;
    };
    FeedUser.prototype.round = function (number, precision) {
        var factor = Math.pow(10, precision);
        var tempNumber = number * factor;
        var roundedTempNumber = Math.round(tempNumber);
        return roundedTempNumber / factor;
    };
    ;
    FeedUser.prototype.loadDistances = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var cacheKey = "distances";
            var rrr;
            var arr = [];
            var mapped;
            //this.cache.removeItem(cacheKey);
            console.log("IN LOADDISTANCES #$$$$$$$$$$$$$$$$$$$$$");
            _this.geolocation.getCurrentPosition().then(function (resp) {
                // resp.coords.latitude
                console.log("IN geo get position #$$$$$$$5354554354$$$$$$$");
                rrr = resp;
                console.log(rrr + "              rrrrrrrrrrrrrrrrrrrrrrrrrr");
                //this.cache.getItem(cacheKey).catch(() => {
                //setTimeout(() => {
                _this.distancelist = _this.af.list('/profiles/stylists');
                var x = 0;
                _this.subscription6 = _this.distancelist.subscribe(function (items) {
                    mapped = items.map(function (item) {
                        return new Promise(function (resolve) {
                            var rr;
                            //console.log(JSON.stringify(item) + "               *((*&*&*&*&^&*&*&*(&*(&*&*(&(&(&*(              :::" + x);
                            if (item.address == "") {
                                resolve();
                            }
                            else {
                                console.log(item.address + " is the address empty??????");
                                _this.nativeGeocoder.forwardGeocode(item.address)
                                    .then(function (coordinates) {
                                    console.log("I AM IN THE GEOCODING ***&&*&*&*&*");
                                    rr = _this.round(_this.distance(coordinates.latitude, coordinates.longitude, rrr.coords.latitude, rrr.coords.longitude, "M"), 1);
                                    if (!item.picURL) {
                                        item.picURL = 'assets/blankprof.png';
                                    }
                                    arr.push({ 'pic': item.picURL, 'salon': item.username, 'distance': rr });
                                    console.log("push to the array of results");
                                    //x++;
                                    /*console.log(items.length + "         length   /    x:        " + x);
                                    if(items.length - x == 1) {
                                      console.log("getting resolved in geocoder ^&^&^&&^^&^&^&");
                                      resolve(arr);
                                    }*/
                                    //this.renderer.setElementStyle(this.noavail.nativeElement, 'display', 'none');
                                    resolve();
                                }).catch(function (e) {
                                    console.log(e.message + " caught this error");
                                    /*x++;
                                    if(items.length - x == 1) {
                                      resolve(arr);
                                    }*/
                                    resolve();
                                });
                                //this.renderer.setElementStyle(this.noavail.nativeElement, 'display', 'none');
                            }
                        });
                    });
                    var results = Promise.all(mapped);
                    results.then(function () {
                        console.log(JSON.stringify(arr) + " :FOSIEJO:SFJ::EFIJSEFIJS:EFJS:IO THIS IODIOSJ:FDSIJ :DIS");
                        arr.sort(function (a, b) {
                            return a.distance - b.distance;
                        });
                        _this.distances = arr.slice();
                        console.log(JSON.stringify(_this.distances) + " ^^^^&&&&&&&********88889999000000000");
                        resolve();
                        //return this.cache.saveItem(cacheKey, this.distances);
                    });
                });
            });
            /*}).then(data => {
              this.distances = data
            })*/
            //}, 1500)
            /*}).catch((error) => {
              this.diagnostic.switchToLocationSettings();
              console.log('Error getting location', error.message);
              resolve();
            });*/
        }).catch(function (error) {
            console.log('Error getting location', error);
        });
    };
    FeedUser.prototype.loadPromotions = function () {
        var _this = this;
        console.log("In loadPromotions fdskkfdskldfkfdslkfds");
        this.prom = this.af.list('/promotions', { query: {
                limitToLast: 14
            } });
        this.promotions = [];
        this.subscription10 = this.prom.subscribe(function (items) {
            _this.startAtKey1 = items[0].$key;
            _this.lastKey1 = _this.startAtKey1;
            items.forEach(function (item) {
                //mapped = items.map((item) => {
                //return new Promise(resolve => {
                _this.promotions.push(item.customMetadata);
                console.log("pushing ITEM (((((()()()()()() promotions" + JSON.stringify(item.customMetadata));
                //this.renderer.setElementStyle(this.noavail.nativeElement, 'display', 'none');
                //})  
                //})
            });
        });
        if (this.promotions != []) {
            //this.renderer.setElementStyle(this.noavail._elementRef.nativeElement, 'display', 'none');
        }
    };
    FeedUser.prototype.loadPrices = function () {
        //let mapped;
        //let cacheKey = "prices";
        //let results2;
        var _this = this;
        //this.cache.removeItem(cacheKey);
        //this.cache.getItem(cacheKey).catch(() => {
        //let array = [];
        this.prices = this.af.list('/profiles/stylists', {
            query: {
                orderByChild: 'price',
                limitToLast: 10
            }
        });
        this.subscription5 = this.prices.subscribe(function (items) {
            _this.startAtKey2 = items[0].$key;
            _this.lastKey2 = _this.startAtKey2;
            items.forEach(function (item) {
                //mapped = items.map((item) => {
                //return new Promise(resolve => {
                if (item.price == null) {
                    //
                }
                else {
                    console.log(JSON.stringify(item));
                    if (!item.picURL) {
                        item.picURL = 'assets/blankprof.png';
                    }
                    if (item.price !== undefined) {
                        _this.pricesArray.push(item); //unshift?**************
                    }
                    //this.renderer.setElementStyle(this.noavail.nativeElement, 'display', 'none');
                }
                //})  
                //})
            });
        });
        //results2 = Promise.all(mapped);
        //results2.then(() => {  
        //this.pricesArray = array;
        //console.log(this.pricesArray + "     pricesarrrraaayyy ITEM (((((()()()()()() loadprices")   
        //return this.cache.saveItem(cacheKey, this.pricesArray);
        //})    
        /*}).then(data => {
          this.pricesArray = data;
        })*/
    };
    FeedUser.prototype.loadRatings = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var mapped;
            var cacheKey = "ratings";
            var results;
            var array = [];
            //this.cache.getItem(cacheKey).catch(() => {
            _this.ratingslist = _this.af.list('/profiles/stylists', { query: {
                    orderByKey: true,
                    limitToLast: 10
                } });
            _this.subscription7 = _this.ratingslist.subscribe(function (items) {
                _this.startAtKey3 = items[0].$key;
                _this.lastKey3 = _this.startAtKey3;
                console.log(_this.startAtKey3 + " startatkey3333333333333 beginning");
                console.log(_this.lastKey3 + " lastkey3333333333333asdfasdfasdfasdf beginning");
                mapped = items.map(function (item) {
                    return new Promise(function (resolve) {
                        if (!item.picURL) {
                            item.picURL = 'assets/blankprof.png';
                        }
                        for (var z in item.rating) {
                            console.log(z + "this is the rating string");
                        }
                        console.log(JSON.stringify(item) + "stringifyied item &&^^&%^%^%^$$%%$");
                        if (item.type == "stylist") {
                            console.log("getting pushed &&%$$##@#@#@#@#@#");
                            array.push(item);
                        }
                        resolve();
                    });
                });
                Promise.all(mapped).then(function () {
                    //return this.cache.saveItem(cacheKey, array);
                    console.log("resolved ***&&&^^^%%%$$$$$$$");
                    resolve(array);
                });
            });
        });
    };
    FeedUser.prototype.ionViewDidLoad = function () {
        var _this = this;
        setTimeout(function () {
            _this.renderer.setElementStyle(_this.elRef.nativeElement.querySelector('.scroll-content'), 'margin-top', '43%');
        }, 500);
        var element = this.elRef.nativeElement.querySelector('.scroll-content');
        element.addEventListener('scroll', function (event) {
            var element = event.target;
            if (element.scrollHeight - element.scrollTop === element.clientHeight) {
                console.log('scrolled');
                if (_this.weekly.nativeElement.style.display != 'none') {
                    console.log("in doinfinite promotionsssssss");
                    setTimeout(function () {
                        /*console.log('Begin async operation');
                        console.log(this.content.directionY + "        upupupupupupu********");
                        if(this.content.directionY == 'up') {
                          this.show = false
                        }
                        else {
                          this.show = true;
                        }*/
                        console.log(_this.startAtKey1 + "     before %%^&^&^% start at");
                        _this.list2 = _this.af.list('/promotions', {
                            query: {
                                orderByKey: true,
                                endAt: _this.startAtKey1,
                                limitToLast: 11
                            }
                        });
                        _this.subscription11 = _this.list2.subscribe(function (items) {
                            var x = 0;
                            _this.lastKey1 = _this.startAtKey1;
                            items.forEach(function (item) {
                                var storageRef = firebase.storage().ref().child('/settings/' + item.customMetadata.username + '/profilepicture.png');
                                storageRef.getDownloadURL().then(function (url) {
                                    console.log(url + "in download url !!!!!!!!!!!!!!!!!!!!!!!!");
                                    item.customMetadata.picURL = url;
                                }).catch(function (e) {
                                    console.log("in caught url !!!!!!!$$$$$$$!!");
                                    item.customMetadata.picURL = 'assets/blankprof.png';
                                });
                                if (_this.startAtKey1 !== item.$key && _this.lastKey1 !== item.$key) {
                                    console.log(_this.startAtKey1 + "   :startAtKey1 before 4444444        item key:     " + item.$key);
                                    if (item.customMetadata.username != null) {
                                        _this.promotions.push(item.customMetadata); //unshift?**************
                                    }
                                }
                                if (x == 0) {
                                    _this.startAtKey1 = item.$key;
                                }
                                x++;
                            });
                        });
                        //infiniteScroll.complete(); 
                    }, 500);
                }
                else if (_this.price.nativeElement.style.display != 'none') {
                    _this.doInfiniteP();
                }
                else if (_this.ratingbox.nativeElement.style.display != 'none') {
                    _this.doInfiniteR();
                }
            }
        });
        //setTimeout(() => {
        //div.style.marginTop = "-47%";
        //}, 1000);
        this.loadAvailabilities().then(function () {
        });
        var ratings;
        var totalPotential;
        this.loadRatings().then(function (array) {
            console.log(array + '    ararrya &&*&&*&^^&%^%^');
            var r = 0;
            for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
                var item = array_1[_i];
                if (item.rating.one == 0 && item.rating.two == 0 && item.rating.three == 0 && item.rating.four == 0 && item.rating.five == 0) {
                    _this.stars = "No ratings";
                }
                else {
                    console.log("making the stars");
                    totalPotential = item.rating.one * 5 + item.rating.two * 5 + item.rating.three * 5 + item.rating.four * 5 + item.rating.five * 5;
                    ratings = item.rating.one + item.rating.two * 2 + item.rating.three * 3 + item.rating.four * 4 + item.rating.five * 5;
                    var i = (ratings / totalPotential) * 100;
                    if (Math.round(i) <= 20) {
                        _this.stars = '\u2605';
                    }
                    if (Math.round(i) > 20 && Math.round(i) <= 40) {
                        _this.stars = '\u2605\u2605';
                    }
                    if (Math.round(i) > 40 && Math.round(i) <= 60) {
                        _this.stars = '\u2605\u2605\u2605';
                    }
                    if (Math.round(i) > 60 && Math.round(i) <= 80) {
                        _this.stars = '\u2605\u2605\u2605\u2605';
                    }
                    if (Math.round(i) > 80) {
                        _this.stars = '\u2605\u2605\u2605\u2605\u2605';
                    }
                }
                item.stars = _this.stars;
                _this.rating.push(item);
                //this.renderer.setElementStyle(this.noavail.nativeElement, 'display', 'none');
                r++;
            }
            console.log("THIS IS THE SORTED ARRAY TO BE SORRRED        " + JSON.stringify(_this.rating));
            _this.rating.sort(function (a, b) {
                if (a.stars !== "No ratings" && b.stars !== "No ratings") {
                    if (a.stars === b.stars) {
                        return 0;
                    }
                    else {
                        return a.stars.length < b.stars.length ? 1 : -1;
                    }
                }
                else {
                    if (a.stars === "No ratings") {
                        return 1;
                    }
                    else if (b.stars === "No ratings") {
                        return -1;
                    }
                }
            });
            _this.loadDistances().then(function () {
                console.log("in load availabilities ......... ");
                console.log(JSON.stringify(_this.availabilities));
                _this.availabilities.sort(function (a, b) {
                    return Date.parse('01/01/2013 ' + a.time) - Date.parse('01/01/2013 ' + b.time);
                });
                console.log('*****previous******');
                console.log(JSON.stringify(_this.availabilities));
                console.log('*****sorted********');
                for (var _i = 0, _a = _this.availabilities; _i < _a.length; _i++) {
                    var i = _a[_i];
                    console.log(i.time + "          this is itime");
                    var date = new Date('01/01/2013 ' + i.time);
                    console.log(date + "          this is date in idate");
                    var str = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' });
                    console.log(str);
                    i.time = str;
                }
                _this.loadPromotions(); /////////// START NEW GIT ////45//54/54555555''''''''''''''''''''
                _this.getAds();
                _this.loadPrices();
            });
        });
        ////this.renderer.setElementStyle(this.promos.nativeElement, 'color', '#e6c926');
        this.renderer.setElementStyle(this.weekly.nativeElement, 'display', 'block');
        this.renderer.setElementStyle(this.price.nativeElement, 'display', 'none');
        this.renderer.setElementStyle(this.distancey.nativeElement, 'display', 'none');
        /*setTimeout(() => {
          this.loadDistances();
        },1000)*/
    };
    FeedUser.prototype.presentProfileModal = function (salon, time) {
        var profileModal = this.modalCtrl.create(PopUp, { salon: salon, time: time });
        profileModal.present();
    };
    FeedUser.prototype.presentProfileModalDistance = function (salon) {
        var profileModal = this.modalCtrl.create(PopUpOther, { salon: salon });
        profileModal.present();
    };
    FeedUser.prototype.presentProfileModalRatings = function (salon) {
        var profileModal = this.modalCtrl.create(PopUpOther, { salon: salon });
        profileModal.present();
    };
    FeedUser.prototype.presentProfileModalPrice = function (salon) {
        var profileModal = this.modalCtrl.create(PopUpOther, { salon: salon });
        profileModal.present();
    };
    FeedUser.prototype.toolClicked = function (event) {
        var _this = this;
        this.toolbarClicks++;
        console.log('tapped');
        if (this.toolbarClicks == 1) {
            setTimeout(function () {
                if (_this.toolbarClicks == 2) {
                    console.log('running application');
                    _this.downState = (_this.downState == 'notDown') ? 'down' : 'notDown';
                    _this.moveState = (_this.moveState == 'up') ? 'down' : 'up';
                    _this.toolbarState = (_this.toolbarState == 'up') ? 'down' : 'up';
                    if (_this.toolbarState == 'up') {
                        _this.config = {
                            direction: 'horizontal',
                            slidesPerView: '4',
                            keyboardControl: false
                        };
                        _this.swiperSize = 'small';
                    }
                    else {
                        _this.config = {
                            direction: 'horizontal',
                            slidesPerView: '1',
                            keyboardControl: false
                        };
                        _this.swiperSize = 'big';
                    }
                    _this.toolbarClicks = 0;
                }
                else {
                    _this.toolbarClicks = 0;
                }
            }, 300);
        }
    };
    FeedUser.prototype.switchView = function () {
        this.navCtrl.push(FeedStylist);
    };
    FeedUser.prototype.closeMenu = function () {
        if (this.showDropDown == 'down' || this.showDropDownHeight == 'down') {
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
    };
    FeedUser.prototype.closeMenuP = function () {
        if (this.showDropDown == 'down' || this.showDropDownHeight == 'down') {
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
    };
    FeedUser.prototype.dropDown = function () {
        //this.renderer.setElementStyle(this.promos.nativeElement, 'color', 'gray');
        this.renderer.setElementStyle(this.weeklyyellow.nativeElement, 'color', 'gray');
        if (this.downState == 'down') {
            this.showDropDownHeight = (this.showDropDownHeight == 'up') ? 'down' : 'up';
        }
        else {
            this.showDropDown = (this.showDropDown == 'up') ? 'down' : 'up';
        }
    };
    FeedUser.prototype.dropDownD = function () {
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
    };
    FeedUser.prototype.dropDownA = function () {
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
    };
    FeedUser.prototype.dropDownP = function () {
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
    };
    FeedUser.prototype.dropDownR = function () {
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
    };
    FeedUser.prototype.gotoProfile = function () {
        this.navCtrl.push(StylistProfile);
    };
    FeedUser.prototype.onScroll = function (event) {
        console.log(event);
    };
    FeedUser.prototype.loadAvailabilities = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.appointments = _this.af.list('/appointments');
            _this.subscription2 = _this.appointments.subscribe(function (items) { return items.forEach(function (item) {
                console.log(item);
                var userName = item.$key;
                _this.availabilities = [];
                for (var x in item) {
                    var month = x;
                    console.log(x + "      month");
                    _this.appointmentsMonth = _this.af.list('/appointments/' + userName + '/' + month);
                    _this.subscription3 = _this.appointmentsMonth.subscribe(function (items) { return items.forEach(function (item) {
                        _this.startAtKeyAvail = item.$key;
                        //console.log(JSON.stringify(item) + "           item");
                        var date = new Date(item.date.day * 1000);
                        var today = new Date();
                        console.log(date.getMonth() + "==" + today.getMonth() + "&&" + date.getDate() + "==" + today.getDate());
                        console.log("IN LOAD AVAILABILITIES *(*((**(*(*(*(*(*(*&^^^^%^%556565656565");
                        if (date.getMonth() == today.getMonth() && date.getDate() == today.getDate()) {
                            console.log("            inside the if that checks if its today");
                            console.log(item.reserved.appointment + "                *************appointment");
                            //let counter = 0;
                            item.reserved.appointment.forEach(function (r, index) {
                                if (r.selected == true) {
                                    //this.renderer.setElementStyle(this.noavail.nativeElement, 'display', 'none');
                                    var storageRef = firebase.storage().ref().child('/settings/' + userName + '/profilepicture.png');
                                    var obj_1 = { 'pic': "", 'salon': userName, 'time': r.time };
                                    storageRef.getDownloadURL().then(function (url) {
                                        console.log(url + "in download url !!!!!!!!!!!!!!!!!!!!!!!!");
                                        obj_1.pic = url;
                                        _this.availabilities.push(obj_1);
                                    }).catch(function (e) {
                                        console.log("in caught url !!!!!!!$$$$$$$!!");
                                        obj_1.pic = 'assets/blankprof.png';
                                        _this.availabilities.push(obj_1);
                                    });
                                    console.log(index + "         this is index !@@@@@!!");
                                    console.log(JSON.stringify(_this.availabilities));
                                }
                                if (index == 23) {
                                    console.log("IN RESOLVE *(**(*(#*(*(#*(#*(#*(#))))))))");
                                    console.log(JSON.stringify(_this.availabilities));
                                    resolve();
                                }
                            });
                        }
                    }); });
                }
            }); });
        });
    };
    FeedUser.prototype.setDateTime = function (time) {
        var date = new Date();
        var index = time.indexOf(":"); // replace with ":" for differently displayed time.
        var index2 = time.indexOf(" ");
        var hours = time.substring(0, index);
        var minutes = time.substring(index + 1, index2);
        var mer = time.substring(index2 + 1, time.length);
        console.log(mer + "        *******AMPM");
        if (mer == "PM") {
            console.log(hours + "        ())()()(()hours before(()()(");
            var number = parseInt(hours) + 12;
            hours = number.toString();
            console.log(hours + "      **********hours after*******");
        }
        date.setHours(hours);
        date.setMinutes(minutes);
        return date;
    };
    FeedUser.prototype.getInitialImages = function () {
        /*.then(array => {
        setTimeout(() => {
          console.log(JSON.stringify(array) + " :FOSIEJO:SFJ::EFIJSEFIJS:EFJS:IO THIS IODIOSJ:FDSIJ :DIS");
          //
            
          //}, 1000)
          
        }, 2000);*/
        //})
    };
    __decorate([
        ViewChild('changeText'),
        __metadata("design:type", ElementRef)
    ], FeedUser.prototype, "changeText", void 0);
    __decorate([
        ViewChild('availability'),
        __metadata("design:type", ElementRef)
    ], FeedUser.prototype, "availability", void 0);
    __decorate([
        ViewChild('contentone'),
        __metadata("design:type", ElementRef)
    ], FeedUser.prototype, "contentOne", void 0);
    __decorate([
        ViewChild('ratings'),
        __metadata("design:type", ElementRef)
    ], FeedUser.prototype, "ratingbox", void 0);
    __decorate([
        ViewChild('weeklydeals'),
        __metadata("design:type", ElementRef)
    ], FeedUser.prototype, "weekly", void 0);
    __decorate([
        ViewChild('promos'),
        __metadata("design:type", ElementRef)
    ], FeedUser.prototype, "promos", void 0);
    __decorate([
        ViewChild('weekly'),
        __metadata("design:type", ElementRef)
    ], FeedUser.prototype, "weeklyyellow", void 0);
    __decorate([
        ViewChild('price'),
        __metadata("design:type", ElementRef)
    ], FeedUser.prototype, "price", void 0);
    __decorate([
        ViewChild('distance'),
        __metadata("design:type", ElementRef)
    ], FeedUser.prototype, "distancey", void 0);
    __decorate([
        ViewChild('noavail'),
        __metadata("design:type", Object)
    ], FeedUser.prototype, "noavail", void 0);
    __decorate([
        ViewChild('infinitescroll'),
        __metadata("design:type", ElementRef)
    ], FeedUser.prototype, "infinitescroll", void 0);
    __decorate([
        ViewChild(Content),
        __metadata("design:type", Content)
    ], FeedUser.prototype, "content", void 0);
    FeedUser = __decorate([
        Component({
            selector: 'page-feed-user',
            templateUrl: 'feeduser.html',
            animations: [
                trigger('slideDown', [
                    state('down', style({
                        height: '250px',
                    })),
                    state('notDown', style({
                        height: '88px',
                    })),
                    transition('* => *', animate('400ms ease-in')),
                ]),
                trigger('moveList', [
                    state('down', style({
                        top: 200 + "px",
                    })),
                    state('up', style({
                        top: 0 + "px",
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
        }),
        __metadata("design:paramtypes", [ElementRef, CacheService, Diagnostic, NativeGeocoder, Geolocation, NgZone, ModalController, AngularFireDatabase, Storage, AngularFireAuth, Renderer, LoadingController, NavController])
    ], FeedUser);
    return FeedUser;
}());
export { FeedUser };
//# sourceMappingURL=feeduser.js.map