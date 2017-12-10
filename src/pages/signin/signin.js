var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { SignUpPage } from '../signup/signup';
import { FeedUser } from '../feeduser/feeduser';
import { FeedStylist } from '../feedstylist/feedstylist';
import { Keyboard } from '@ionic-native/keyboard';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';
var SignInPage = /** @class */ (function () {
    //subscription: ISubscription
    function SignInPage(af, loadingCtrl, storage, afAuth, keyboard, navCtrl) {
        this.af = af;
        this.storage = storage;
        this.afAuth = afAuth;
        this.keyboard = keyboard;
        this.navCtrl = navCtrl;
        this.user = {};
    }
    SignInPage.prototype.ionViewWillUnload = function () {
        //this.navCtrl.pop();
    };
    SignInPage.prototype.ngOnDestroy = function () {
        //if(this.subscription != null) {
        //this.subscription.unsubscribe();
        //}
    };
    SignInPage.prototype.ionViewDidLoad = function () {
        //let loading = this.loadingCtrl.create({content : "Loading..."});
        //loading.present();
        var _this = this;
        this.storage.get('email').then(function (val) {
            _this.email = val;
        });
        this.storage.get('password').then(function (val) {
            _this.password = val;
        });
        this.storage.get('type').then(function (val) {
            _this.type = val;
        });
        this.storage.get('loggedin').then(function (val) {
            console.log(val + " logged innnnnnnn");
            if (val == true) {
                console.log(_this.type + " logged typeeeeee");
                if (_this.type == 'user/stylist/user' || _this.type == 'user') {
                    //loading.dismiss();
                    _this.navCtrl.setRoot(FeedUser);
                }
                else if (_this.type == 'user/stylist/stylist' || _this.type == 'stylist') {
                    //loading.dismiss();
                    _this.navCtrl.setRoot(FeedStylist);
                }
            }
            else {
                console.log("Val == false......");
            }
        });
    };
    SignInPage.prototype.selectOneStylist = function () {
        console.log("in select one stylist");
        if (this.users) {
            this.users = false;
        }
    };
    SignInPage.prototype.selectOneUser = function () {
        if (this.stylist) {
            this.stylist = false;
        }
    };
    SignInPage.prototype.goButton = function (code) {
        console.log(code);
        if (code == 13) {
            this.keyboard.close();
        }
    };
    SignInPage.prototype.login = function (userx) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                // push another page on to the navigation stack
                // causing the nav controller to transition to the new page
                // optional data can also be passed to the pushed page.
                /**/
                if (!userx.email || !userx.password) {
                    alert("You need to enter an email and password");
                }
                else if (this.stylist && this.type == 'user') {
                    alert("You do not have a stylist account, you can add one using the signup page");
                }
                else if (this.users && this.type == 'stylist') {
                    alert("You do not have a user account, you can add one using the signup page");
                }
                else if (!this.users && !this.stylist) {
                    alert('You need to select "Hair Stylist" or "User"');
                }
                else {
                    this.afAuth.auth.signInWithEmailAndPassword(userx.email, userx.password).then(function (data) {
                        console.log(data);
                        if (data.email && data.uid) {
                            if (_this.stylist) {
                                console.log("chose stylist");
                                _this.storage.set('type', 'user/stylist/stylist');
                                _this.storage.set('loggedin', true);
                                var database = firebase.database();
                                var reff = firebase.database().ref('/profiles/stylists').orderByChild('email').equalTo(userx.email).on("value", function (snapshot) {
                                    snapshot.forEach(function (snapshot) {
                                        // key
                                        var key = snapshot.key;
                                        console.log("key: " + key);
                                        // value, could be object
                                        var childData = snapshot.val();
                                        console.log("data: " + JSON.stringify(childData));
                                        // Do what you want with these key/values here
                                        console.log(childData.address + "    childdata address");
                                        _this.storage.set('address', childData.address);
                                        _this.storage.set('bio', childData.bio);
                                        _this.storage.set('email', userx.email);
                                        _this.storage.set('picURL', childData.picURL);
                                        _this.storage.set('price', childData.price);
                                        _this.storage.set('phone', childData.phone);
                                        _this.storage.set('instausername', childData.instagramURL);
                                        _this.storage.set('username', childData.username);
                                        return true;
                                    });
                                });
                                _this.navCtrl.setRoot(FeedStylist);
                            }
                            else {
                                _this.storage.set('type', 'user/stylist/user');
                                _this.storage.set('loggedin', true);
                                var database = firebase.database();
                                var reff = firebase.database().ref('/profiles/users').orderByChild('email').equalTo(userx.email).on("value", function (snapshot) {
                                    snapshot.forEach(function (snapshot) {
                                        // key
                                        var key = snapshot.key;
                                        console.log("key: " + key);
                                        // value, could be object
                                        var childData = snapshot.val();
                                        console.log("data: " + JSON.stringify(childData));
                                        // Do what you want with these key/values here
                                        //this.storage.set('address', childData.address);
                                        _this.storage.set('bio', childData.bio);
                                        _this.storage.set('email', userx.email);
                                        _this.storage.set('picURL', childData.picURL);
                                        _this.storage.set('phone', childData.phone);
                                        _this.storage.set('instausername', childData.instagramURL);
                                        _this.storage.set('username', childData.username);
                                        return true;
                                    });
                                });
                                _this.navCtrl.setRoot(FeedUser);
                            }
                        }
                    }).catch(function (e) { alert("The username or password is incorrect"); });
                }
                return [2 /*return*/];
            });
        });
    };
    SignInPage.prototype.pushPage = function () {
        // push another page on to the navigation stack
        // causing the nav controller to transition to the new page
        // optional data can also be passed to the pushed page.
        this.navCtrl.push(SignUpPage);
    };
    SignInPage.prototype.logForm = function () {
        // push another page on to the navigation stack
        // causing the nav controller to transition to the new page
        // optional data can also be passed to the pushed page.
    };
    SignInPage = __decorate([
        Component({
            selector: 'page-sign-in',
            templateUrl: 'signin.html'
        }),
        __metadata("design:paramtypes", [AngularFireDatabase, LoadingController, Storage, AngularFireAuth, Keyboard, NavController])
    ], SignInPage);
    return SignInPage;
}());
export { SignInPage };
//# sourceMappingURL=signin.js.map