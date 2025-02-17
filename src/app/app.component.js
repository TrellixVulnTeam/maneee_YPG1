var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SignInPage } from '../pages/signin/signin';
import { CacheService } from "ionic-cache";
import { ScreenOrientation } from '@ionic-native/screen-orientation';
var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, splashScreen, cache, screenOrientation) {
        var _this = this;
        this.screenOrientation = screenOrientation;
        this.rootPage = SignInPage;
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            _this.screenOrientation.lock(_this.screenOrientation.ORIENTATIONS.PORTRAIT);
            statusBar.styleBlackOpaque();
            statusBar.backgroundColorByName('black');
            statusBar.overlaysWebView(false);
            statusBar.isVisible;
            splashScreen.hide();
            cache.setDefaultTTL(60 * 5); //set default cache TTL for 1 hour
        });
    }
    MyApp = __decorate([
        Component({
            templateUrl: 'app.html'
        }),
        __metadata("design:paramtypes", [Platform, StatusBar, SplashScreen, CacheService, ScreenOrientation])
    ], MyApp);
    return MyApp;
}());
export { MyApp };
//# sourceMappingURL=app.component.js.map