var argscheck = require('cordova/argscheck'),
    utils = require('cordova/utils'),
    cordova_exec = require('cordova/exec'),
    common = require('./Common'),
    BaseClass = require('./BaseClass'),
    BaseArrayClass = require('./BaseArrayClass'),
    LatLng = require('./LatLng'),
    LatLngBounds = require('./LatLngBounds'),
    MapTypeId = require('./MapTypeId'),
    event = require('./event'),
    VisibleRegion = require('./VisibleRegion');

var Marker = require('./Marker');
var Circle = require('./Circle');
var Polyline = require('./Polyline');
var Polygon = require('./Polygon');
var TileOverlay = require('./TileOverlay');
var GroundOverlay = require('./GroundOverlay');
var KmlOverlay = require('./KmlOverlay');
var CameraPosition = require('./CameraPosition');
var MarkerCluster = require('./MarkerCluster');


/**
 * Google Maps model.
 */
var exec;
var Map = function(id, _exec) {
    exec = _exec;
    var self = this;
    BaseClass.apply(self);

    self.MARKERS = {};
    self.KML_LAYERS = {};
    self.OVERLAYS = {};

    Object.defineProperty(self, "type", {
        value: "Map",
        writable: false
    });

    Object.defineProperty(self, "id", {
        value: id,
        writable: false
    });
    this._isReady = false;

    self.on(event.MAP_CLICK, function() {
        self.set("active_marker_id", undefined);
    });

    self.on("active_marker_id_changed", function(prevId, newId) {
        if (prevId in self.MARKERS) {
            self.MARKERS[prevId].trigger.call(self.MARKERS[prevId], event.INFO_CLOSE);
        }
        exec(null, null, self.id, 'setActiveMarkerId', [newId]);
    });
};

utils.extend(Map, BaseClass);

Map.prototype.getId = function() {
    return this.id;
};

/**
 * @desc Recalculate the position of HTML elements
 */
Map.prototype.refreshLayout = function(event) {
    exec(null, null, this.id, 'resizeMap', []);
};

Map.prototype.getMap = function(mapId, div, options) {
    var self = this,
        args = [mapId];

    if (!common.isDom(div)) {
        self.set("visible", false);
        options = div;
        options = options || {};
        if (options.camera) {
          if (options.camera.latLng) {
              options.camera.target = options.camera.latLng;
              delete options.camera.latLng;
          }
          this.set('camera', options.camera);
          if (options.camera.target) {
            this.set('camera_target', options.camera.target);
          }
          if (options.camera.bearing) {
            this.set('camera_bearing', options.camera.bearing);
          }
          if (options.camera.zoom) {
            this.set('camera_zoom', options.camera.zoom);
          }
          if (options.camera.tilt) {
            this.set('camera_tilt', options.camera.tilt);
          }
        }
        args.push(options);
    } else {

        var positionCSS = common.getStyle(div, "position");
        if (!positionCSS || positionCSS === "static") {
          // important for HtmlInfoWindow
          div.style.position = "relative";
        }
        self.set("visible", true);
        options = options || {};
        if (options.camera) {
          if (options.camera.latLng) {
              options.camera.target = options.camera.latLng;
              delete options.camera.latLng;
          }
          this.set('camera', options.camera);
          if (options.camera.target) {
            this.set('camera_target', options.camera.target);
          }
          if (options.camera.bearing) {
            this.set('camera_bearing', options.camera.bearing);
          }
          if (options.camera.zoom) {
            this.set('camera_zoom', options.camera.zoom);
          }
          if (options.camera.tilt) {
            this.set('camera_tilt', options.camera.tilt);
          }
        }
        if (utils.isArray(options.styles)) {
          options.styles = JSON.stringify(options.styles);
        }
        args.push(options);

        div.style.overflow = "hidden";
        self.set("div", div);

        if (div.offsetWidth < 100 || div.offsetHeight < 100) {
          // If the map Div is too small, wait a little.
          var callee = arguments.callee;
          setTimeout(function() {
            callee.call(self, mapId, div, options);
          }, 250 + Math.random() * 100);
          return;
        }
        var elements = [];
        var elemId, clickable, size;


        // Gets the map div size.
        // The plugin needs to consider the viewport zoom ratio
        // for the case window.innerHTML > body.offsetWidth.
        elemId = div.getAttribute("__pluginDomId");
        if (!elemId) {
            elemId = "pgm" + Math.floor(Math.random() * Date.now());
            div.setAttribute("__pluginDomId", elemId);
        }
        args.push(elemId);

    }

    cordova.fireDocumentEvent('plugin_touch', {});

    exec(function() {
      cordova.fireDocumentEvent('plugin_touch', {});

      //------------------------------------------------------------------------
      // Clear background colors of map div parents after the map is created
      //------------------------------------------------------------------------
      var div = self.get("div");
      if (common.isDom(div)) {
        while (div.parentNode) {
            div.style.backgroundColor = 'rgba(0,0,0,0)';

            // prevent multiple readding the class
            if (div.classList && !div.classList.contains('_gmaps_cdv_')) {
                div.classList.add('_gmaps_cdv_');
            } else if (div.className && div.className.indexOf('_gmaps_cdv_') === -1) {
                div.className = div.className + ' _gmaps_cdv_';
            }

            div = div.parentNode;
        }
      }
      //------------------------------------------------------------------------
      // In order to work map.getVisibleRegion() correctly, wait a little.
      //------------------------------------------------------------------------
      setTimeout(function() {
        self.refreshLayout();
        self._isReady = true;
        self.trigger(event.MAP_READY, self);
      }, 250);
    }, self.errorHandler, 'CordovaGoogleMaps', 'getMap', args, {sync: true});
};

Map.prototype.setOptions = function(options) {
    options = options || {};

    if (options.camera) {
      if (options.camera.latLng) {
          options.camera.target = options.camera.latLng;
          delete options.camera.latLng;
      }
      this.set('camera', options.camera);
      if (options.camera.target) {
        this.set('camera_target', options.camera.target);
      }
      if (options.camera.bearing) {
        this.set('camera_bearing', options.camera.bearing);
      }
      if (options.camera.zoom) {
        this.set('camera_zoom', options.camera.zoom);
      }
      if (options.camera.tilt) {
        this.set('camera_tilt', options.camera.tilt);
      }
    }
    if (utils.isArray(options.styles)) {
      options.styles = JSON.stringify(options.styles);
    }
    exec(null, this.errorHandler, this.id, 'setOptions', [options]);
    return this;
};

Map.prototype.setCameraTarget = function(latLng) {
    this.set('camera_target', latLng);
    exec(null, this.errorHandler, this.id, 'setCameraTarget', [latLng.lat, latLng.lng]);
    return this;
};

Map.prototype.setCameraZoom = function(zoom) {
    this.set('camera_zoom', zoom);
    exec(null, this.errorHandler, this.id, 'setCameraZoom', [zoom], {sync: true});
    return this;
};
Map.prototype.panBy = function(x, y) {
    x = parseInt(x, 10);
    y = parseInt(y, 10);
    exec(null, this.errorHandler, this.id, 'panBy', [x, y], {sync: true});
    return this;
};

/**
 * Clears all markup that has been added to the map,
 * including markers, polylines and ground overlays.
 */
Map.prototype.clear = function(callback) {
    var self = this;

    // Close the active infoWindow
    var active_marker_id = self.get("active_marker_id");
    if (active_marker_id && active_marker_id in self.MARKERS) {
      self.MARKERS[active_marker_id].trigger(event.INFO_CLOSE);
    }

    var clearObj = function(obj) {
        var ids = Object.keys(obj);
        var id, instance;
        for (var i = 0; i < ids.length; i++) {
            id = ids[i];
            instance = obj[id];
            if (instance) {
              if (typeof instance.remove === "function") {
                instance.remove();
              }
              instance.off();
              delete obj[id];
            }
        }
        obj = {};
    };

    clearObj(self.OVERLAYS);
    clearObj(self.MARKERS);
    clearObj(self.KML_LAYERS);

    exec(function() {
        if (typeof callback === "function") {
            callback.call(self);
        }
    }, self.errorHandler, this.id, 'clear', [], {sync: true});
};

/**
 * @desc Change the map type
 * @param {String} mapTypeId   Specifies the one of the follow strings:
 *                               MAP_TYPE_HYBRID
 *                               MAP_TYPE_SATELLITE
 *                               MAP_TYPE_TERRAIN
 *                               MAP_TYPE_NORMAL
 *                               MAP_TYPE_NONE
 */
Map.prototype.setMapTypeId = function(mapTypeId) {
    if (mapTypeId !== MapTypeId[mapTypeId.replace("MAP_TYPE_", '')]) {
        return this.errorHandler("Invalid MapTypeId was specified.");
    }
    this.set('mapTypeId', mapTypeId);
    exec(null, this.errorHandler, this.id, 'setMapTypeId', [mapTypeId]);
    return this;
};

/**
 * @desc Change the map view angle
 * @param {Number} tilt  The angle
 */
Map.prototype.setCameraTilt = function(tilt) {
    this.set('camera_tilt', tilt);
    exec(null, this.errorHandler, this.id, 'setCameraTilt', [tilt], {sync: true});
    return this;
};

/**
 * @desc Change the map view bearing
 * @param {Number} bearing  The bearing
 */
Map.prototype.setCameraBearing = function(bearing) {
    this.set('camera_bearing', bearing);
    exec(null, this.errorHandler, this.id, 'setCameraBearing', [bearing], {sync: true});
    return this;
};

Map.prototype.moveCameraZoomIn = function(callback) {
    var self = this;
    var cameraPosition = self.get("camera");
    cameraPosition.zoom++;
    cameraPosition.zoom = cameraPosition.zoom < 0 ? 0 : cameraPosition.zoom;

    exec(function() {
        if (typeof callback === "function") {
            callback.call(self);
        }
    }, self.errorHandler, self.id, 'moveCamera', [cameraPosition], {sync: true});

};
Map.prototype.moveCameraZoomOut = function(callback) {
    var self = this;
    var cameraPosition = self.get("camera");
    cameraPosition.zoom--;
    cameraPosition.zoom = cameraPosition.zoom < 0 ? 0 : cameraPosition.zoom;

    exec(function() {
        if (typeof callback === "function") {
            callback.call(self);
        }
    }, self.errorHandler, self.id, 'moveCamera', [cameraPosition], {sync: true});

};
Map.prototype.animateCameraZoomIn = function(callback) {
    var self = this;
    var cameraPosition = self.get("camera");
    cameraPosition.zoom++;
    cameraPosition.zoom = cameraPosition.zoom < 0 ? 0 : cameraPosition.zoom;
    cameraPosition.duration = 500;

    exec(function() {
        if (typeof callback === "function") {
            callback.call(self);
        }
    }, self.errorHandler, self.id, 'animateCamera', [cameraPosition], {sync: true});

};
Map.prototype.animateCameraZoomOut = function(callback) {
    var self = this;
    var cameraPosition = self.get("camera");
    cameraPosition.zoom--;
    cameraPosition.zoom = cameraPosition.zoom < 0 ? 0 : cameraPosition.zoom;
    cameraPosition.duration = 500;

    exec(function() {
        if (typeof callback === "function") {
            callback.call(self);
        }
    }, self.errorHandler, self.id, 'animateCamera', [cameraPosition], {sync: true});

};
/**
 * @desc   Move the map camera with animation
 * @params {CameraPosition} cameraPosition New camera position
 * @params {Function} [callback] This callback is involved when the animation is completed.
 */
Map.prototype.animateCamera = function(cameraPosition, callback) {
    var self = this;
    var target = cameraPosition.target;
    if (!target && "position" in cameraPosition) {
      target = cameraPosition.position;
    }
    if (!target) {
      return;
    }

    if (utils.isArray(target) || target.type === "LatLngBounds") {
      target = common.convertToPositionArray(target);
    }
    cameraPosition.target = target;

    exec(function() {
        if (typeof callback === "function") {
            callback.call(self);
        }
    }, self.errorHandler, self.id, 'animateCamera', [cameraPosition], {sync: true});

};
/**
 * @desc   Move the map camera without animation
 * @params {CameraPosition} cameraPosition New camera position
 * @params {Function} [callback] This callback is involved when the animation is completed.
 */
Map.prototype.moveCamera = function(cameraPosition, callback) {
    var self = this;
    var target = cameraPosition.target;
    if (!target && "position" in cameraPosition) {
      target = cameraPosition.position;
    }
    if (!target) {
      return;
    }

    if (utils.isArray(target) || target.type === "LatLngBounds") {
      target = common.convertToPositionArray(target);
    }
    cameraPosition.target = target;
    exec(function() {
        if (typeof callback === "function") {
            callback.call(self);
        }
    }, self.errorHandler, self.id, 'moveCamera', [cameraPosition], {sync: true});

};

Map.prototype.setMyLocationEnabled = function(enabled) {
    enabled = common.parseBoolean(enabled);
    exec(null, this.errorHandler, this.id, 'setMyLocationEnabled', [enabled], {sync: true});
    return this;
};
Map.prototype.setIndoorEnabled = function(enabled) {
    enabled = common.parseBoolean(enabled);
    exec(null, this.errorHandler, this.id, 'setIndoorEnabled', [enabled]);
    return this;
};
Map.prototype.setTrafficEnabled = function(enabled) {
    enabled = common.parseBoolean(enabled);
    exec(null, this.errorHandler, this.id, 'setTrafficEnabled', [enabled]);
    return this;
};
Map.prototype.setCompassEnabled = function(enabled) {
    var self = this;
    enabled = common.parseBoolean(enabled);
    exec(null, self.errorHandler, this.id, 'setCompassEnabled', [enabled]);
    return this;
};
Map.prototype.getMyLocation = function(params, success_callback, error_callback) {
    var args = [params || {}, success_callback || null, error_callback];
    if (typeof args[0] === "function") {
        args.unshift({});
    }
    params = args[0];
    success_callback = args[1];
    error_callback = args[2];

    params.enableHighAccuracy = params.enableHighAccuracy === true;
    var self = this;
    var successHandler = function(location) {
        if (typeof success_callback === "function") {
            location.latLng = new LatLng(location.latLng.lat, location.latLng.lng);
            success_callback.call(self, location);
        }
    };
    var errorHandler = function(result) {
        if (typeof error_callback === "function") {
            error_callback.call(self, result);
        }
    };
    exec(successHandler, errorHandler, 'CordovaGoogleMaps', 'getMyLocation', [params], {sync: true});
};
Map.prototype.getFocusedBuilding = function(callback) {
    exec(callback, this.errorHandler, this.id, 'getFocusedBuilding', []);
};
Map.prototype.getVisible = function() {
    return this.get("visible");
};
Map.prototype.setVisible = function(isVisible) {
    var self = this;
    isVisible = common.parseBoolean(isVisible);
    self.set("visible", isVisible);
    exec(null, self.errorHandler, this.id, 'setVisible', [isVisible]);
    return this;
};
Map.prototype.setClickable = function(isClickable) {
    isClickable = common.parseBoolean(isClickable);
    exec(null, self.errorHandler, this.id, 'setClickable', [isClickable]);
    return this;
};


/**
 * Sets the preference for whether all gestures should be enabled or disabled.
 */
Map.prototype.setAllGesturesEnabled = function(enabled) {
    enabled = common.parseBoolean(enabled);
    exec(null, self.errorHandler, this.id, 'setAllGesturesEnabled', [enabled]);
    return this;
};

/**
 * Return the current position of the camera
 * @return {CameraPosition}
 */
Map.prototype.getCameraPosition = function() {
    return this.get("camera");
};

/**
 * Remove the map completely.
 */
Map.prototype.remove = function(callback) {
    var self = this;
    self._isReady = false;
    var div = this.get('div');
    if (div) {
        while (div) {
            if (div.style) {
                div.style.backgroundColor = '';
            }
            if (div.classList) {
                div.classList.remove('_gmaps_cdv_');
            } else if (div.className) {
                div.className = div.className.replace(/_gmaps_cdv_/g, "");
                div.className = div.className.replace(/\s+/g, " ");
            }
            div = div.parentNode;
        }
    }
    self.set('div', undefined);
    self.trigger("remove");
    exec(function() {
        if (typeof callback === "function") {
            callback.call(self);
        }
    }, self.errorHandler, 'CordovaGoogleMaps', 'removeMap', [self.id], {sync: true});
};


Map.prototype.toDataURL = function(params, callback) {
    var args = [params || {}, callback];
    if (typeof args[0] === "function") {
        args.unshift({});
    }

    params = args[0];
    callback = args[1];

    params.uncompress = params.uncompress === true;
    var self = this;
    exec(function(image) {
        if (typeof callback === "function") {
            callback.call(self, image);
        }
    }, self.errorHandler, self.id, 'toDataURL', [params]);
};

/**
 * Show the map into the specified div.
 */
Map.prototype.getDiv = function() {
    return this.get("div");
};

/**
 * Show the map into the specified div.
 */
Map.prototype.setDiv = function(div) {
    var self = this,
        args = [];

    if (!common.isDom(div)) {
        div = self.get("div");
        if (common.isDom(div)) {
          div.removeAttribute("__pluginMapId");
        }
        self.set("div", null);
    } else {
        div.setAttribute("__pluginMapId", self.id);

        // Webkit redraw mandatory
        // http://stackoverflow.com/a/3485654/697856
        div.style.display='none';
        div.offsetHeight;
        div.style.display='';

        self.set("div", div);

        var positionCSS = common.getStyle(div, "position");
        if (!positionCSS || positionCSS === "static") {
          div.style.position = "relative";
        }
        elemId = div.getAttribute("__pluginDomId");
        if (!elemId) {
            elemId = "pgm" + Math.floor(Math.random() * Date.now());
            div.setAttribute("__pluginDomId", elemId);
        }
        args.push(elemId);
        while (div.parentNode) {
            div.style.backgroundColor = 'rgba(0,0,0,0)';

            // prevent multiple readding the class
            if (div.classList && !div.classList.contains('_gmaps_cdv_')) {
                div.classList.add('_gmaps_cdv_');
            } else if (div.className && div.className.indexOf('_gmaps_cdv_') === -1) {
                div.className = div.className + ' _gmaps_cdv_';
            }

            div = div.parentNode;
        }
    }
    exec(function() {
      cordova.fireDocumentEvent('plugin_touch', {});
      self.refreshLayout();
    }, self.errorHandler, self.id, 'setDiv', args, {sync: true});
    return self;
};

/**
* Return the visible region of the map.
*/
Map.prototype.getVisibleRegion = function(callback) {
  var self = this;
  var cameraPosition = self.get("camera");
  if (!cameraPosition) {
    return null;
  }

  var latLngBounds = new VisibleRegion(
    cameraPosition.southwest,
    cameraPosition.northeast,
    cameraPosition.farLeft,
    cameraPosition.farRight,
    cameraPosition.nearLeft,
    cameraPosition.nearRight
  );

  if (typeof callback === "function") {
     console.log("[deprecated] getVisibleRegion() is changed. Please check out the https://goo.gl/yHstHQ");
     callback.call(self, latLngBounds);
  }
  return latLngBounds;
};

/**
 * Maps an Earth coordinate to a point coordinate in the map's view.
 */
Map.prototype.fromLatLngToPoint = function(latLng, callback) {
    var self = this;
    if ("lat" in latLng && "lng" in latLng) {
        exec(function(result) {
            if (typeof callback === "function") {
                callback.call(self, result);
            }
        }, self.errorHandler, self.id, 'fromLatLngToPoint', [latLng.lat, latLng.lng]);
    } else {
        if (typeof callback === "function") {
            callback.call(self, [undefined, undefined]);
        }
    }

};
/**
 * Maps a point coordinate in the map's view to an Earth coordinate.
 */
Map.prototype.fromPointToLatLng = function(pixel, callback) {
    var self = this;
    if (pixel.length == 2 && utils.isArray(pixel)) {
        exec(function(result) {
            if (typeof callback === "function") {
                var latLng = new LatLng(result[0] || 0, result[1] || 0);
                callback.call(self, latLng);
            }
        }, self.errorHandler, self.id, 'fromPointToLatLng', [pixel[0], pixel[1]]);
    } else {
        if (typeof callback === "function") {
            callback.call(self, undefined);
        }
    }

};

Map.prototype.setPadding = function(p1, p2, p3, p4) {
    if (arguments.length === 0 || arguments.length > 4) {
        return this;
    }
    var padding = {};
    padding.top = parseInt(p1, 10);
    switch (arguments.length) {
        case 4:
            // top right bottom left
            padding.right = parseInt(p2, 10);
            padding.bottom = parseInt(p3, 10);
            padding.left = parseInt(p4, 10);
            break;

        case 3:
            // top right&left bottom
            padding.right = parseInt(p2, 10);
            padding.left = padding.right;
            padding.bottom = parseInt(p3, 10);
            break;

        case 2:
            // top & bottom right&left
            padding.bottom = parseInt(p1, 10);
            padding.right = parseInt(p2, 10);
            padding.left = padding.right;
            break;

        case 1:
            // top & bottom right & left
            padding.bottom = padding.top;
            padding.right = padding.top;
            padding.left = padding.top;
            break;
    }
    exec(function(result) {
        if (typeof callback === "function") {
            var latLng = new LatLng(result[0] || 0, result[1] || 0);
            callback.call(self, result);
        }
    }, self.errorHandler, this.id, 'setPadding', [padding]);
    return this;
};


//-------------
// KML Layer
//-------------
Map.prototype.addKmlOverlay = function(kmlOverlayOptions, callback) {
    var self = this;
    kmlOverlayOptions = kmlOverlayOptions || {};
    kmlOverlayOptions.url = kmlOverlayOptions.url || null;

    var kmlId = "kml" + (Math.random() * 9999999).toFixed(0);
    kmlOverlayOptions.kmlId = kmlId;

    var kmlOverlay = new KmlOverlay(self, kmlId, kmlOverlayOptions, exec);
    self.OVERLAYS[kmlId] = kmlOverlay;
    self.KML_LAYERS[kmlId] = kmlOverlay;

    exec(function() {
        kmlOverlay.one(kmlId + "_remove", function() {
            kmlOverlay.off();
            delete self.KML_LAYERS[kmlId];
            delete self.OVERLAYS[kmlId];
            kmlOverlay = undefined;
        });
        if (typeof callback === "function") {
            callback.call(self, kmlOverlay);
        }
    }, self.errorHandler, self.id, 'loadPlugin', ['KmlOverlay', kmlOverlayOptions]);

};

//-------------
// Ground overlay
//-------------
Map.prototype.addGroundOverlay = function(groundOverlayOptions, callback) {
    var self = this;
    groundOverlayOptions = groundOverlayOptions || {};
    groundOverlayOptions.url = groundOverlayOptions.url || null;
    groundOverlayOptions.clickable = groundOverlayOptions.clickable === true;
    groundOverlayOptions.visible = common.defaultTrueOption(groundOverlayOptions.visible);
    groundOverlayOptions.zIndex = groundOverlayOptions.zIndex || 0;
    groundOverlayOptions.bounds = common.convertToPositionArray(groundOverlayOptions.bounds);

    exec(function(result) {
        var groundOverlay = new GroundOverlay(self, result.id, groundOverlayOptions, exec);
        self.OVERLAYS[result.id] = groundOverlay;
        groundOverlay.one(result.id + "_remove", function() {
            groundOverlay.off();
            delete self.OVERLAYS[result.id];
            groundOverlay = undefined;
        });
        if (typeof callback === "function") {
            callback.call(self, groundOverlay);
        }
    }, self.errorHandler, self.id, 'loadPlugin', ['GroundOverlay', groundOverlayOptions]);

};

//-------------
// Tile overlay
//-------------
Map.prototype.addTileOverlay = function(tilelayerOptions, callback) {
    var self = this;
    tilelayerOptions = tilelayerOptions || {};
    tilelayerOptions.tileUrlFormat = tilelayerOptions.tileUrlFormat || null;
    if (typeof tilelayerOptions.tileUrlFormat === "string") {
        console.log("[deprecated] the tileUrlFormat property is now deprecated. Use the getTile property.");
        tilelayerOptions.getTile = function(x, y, zoom) {
          return tilelayerOptions.tileUrlFormat.replace(/<x>/gi, x)
                    .replace(/<y>/gi, y)
                    .replace(/<zoom>/gi, zoom);
        };
    }
    if (typeof tilelayerOptions.getTile !== "function") {
      throw new Error("[error] the getTile property is required.");
    }
    tilelayerOptions.visible = common.defaultTrueOption(tilelayerOptions.visible);
    tilelayerOptions.zIndex = tilelayerOptions.zIndex || 0;
    tilelayerOptions.tileSize = tilelayerOptions.tileSize || 512;
    tilelayerOptions.opacity = (tilelayerOptions.opacity === null || tilelayerOptions.opacity === undefined) ? 1 : tilelayerOptions.opacity;
    tilelayerOptions.debug = tilelayerOptions.debug === true;
    tilelayerOptions.userAgent = tilelayerOptions.userAgent || navigator.userAgent;

    var options = {
        visible: tilelayerOptions.visible,
        zIndex: tilelayerOptions.zIndex,
        tileSize: tilelayerOptions.tileSize,
        opacity: tilelayerOptions.opacity,
        userAgent: tilelayerOptions.userAgent,
        debug: tilelayerOptions.debug,
        _id : Math.floor(Math.random() * Date.now())
    };

    document.addEventListener(self.id + "-" + options._id + "-tileoverlay", function(params) {
        var url = tilelayerOptions.getTile(params.x, params.y, params.zoom);
        if (!url || url === "(null)" || url === "undefined" || url === "null") {
          url = "(null)";
        }
        exec(null, self.errorHandler, self.id + "-tileoverlay", 'onGetTileUrlFromJS', [options._id, params.key, url]);
    });

    exec(function(result) {
        var tileOverlay = new TileOverlay(self, result.id, tilelayerOptions, exec);
        self.OVERLAYS[result.id] = tileOverlay;
        tileOverlay.one(result.id + "_remove", function() {
            tileOverlay.off();
            delete self.OVERLAYS[result.id];
            tileOverlay = undefined;
        });
        if (typeof callback === "function") {
            callback.call(self, tileOverlay);
        }
    }, self.errorHandler, self.id, 'loadPlugin', ['TileOverlay', options]);
};

//-------------
// Polygon
//-------------
Map.prototype.addPolygon = function(polygonOptions, callback) {
    var self = this;
    polygonOptions.points = polygonOptions.points || [];
    var _orgs = polygonOptions.points;
    polygonOptions.points = common.convertToPositionArray(polygonOptions.points);
    polygonOptions.holes = polygonOptions.holes || [];
    if (polygonOptions.holes.length > 0 && !Array.isArray(polygonOptions.holes[0])) {
        polygonOptions.holes = [polygonOptions.holes];
    }
    polygonOptions.holes = polygonOptions.holes.map(function(hole) {
        if (!utils.isArray(hole)) {
            return [];
        }
        return hole.map(function(position) {
          return {"lat": position.lat, "lng": position.lng};
        });
    });
    polygonOptions.strokeColor = common.HTMLColor2RGBA(polygonOptions.strokeColor || "#FF000080", 0.75);
    if (polygonOptions.fillColor) {
        polygonOptions.fillColor = common.HTMLColor2RGBA(polygonOptions.fillColor || "#FF000080", 0.75);
    } else {
        polygonOptions.fillColor = common.HTMLColor2RGBA("#FF000080", 0.75);
    }
    polygonOptions.strokeWidth = polygonOptions.strokeWidth || 10;
    polygonOptions.visible = common.defaultTrueOption(polygonOptions.visible);
    polygonOptions.clickable = polygonOptions.clickable === true;
    polygonOptions.zIndex = polygonOptions.zIndex || 0;
    polygonOptions.geodesic = polygonOptions.geodesic === true;

    exec(function(result) {
        polygonOptions.points = _orgs;
        var polygon = new Polygon(self, result.id, polygonOptions, exec);
        self.OVERLAYS[result.id] = polygon;
        polygon.one(result.id + "_remove", function() {
            polygon.off();
            delete self.OVERLAYS[result.id];
            polygon = undefined;
        });
        if (typeof callback === "function") {
            callback.call(self, polygon);
        }
    }, self.errorHandler, self.id, 'loadPlugin', ["Polygon", polygonOptions]);
};

//-------------
// Polyline
//-------------
Map.prototype.addPolyline = function(polylineOptions, callback) {
    var self = this;
    polylineOptions.points = polylineOptions.points || [];
    var _orgs = polylineOptions.points;
    polylineOptions.points = common.convertToPositionArray(polylineOptions.points);
    polylineOptions.color = common.HTMLColor2RGBA(polylineOptions.color || "#FF000080", 0.75);
    polylineOptions.width = polylineOptions.width || 10;
    polylineOptions.visible = common.defaultTrueOption(polylineOptions.visible);
    polylineOptions.clickable = polylineOptions.clickable === true;
    polylineOptions.zIndex = polylineOptions.zIndex || 0;
    polylineOptions.geodesic = polylineOptions.geodesic === true;
    exec(function(result) {
        polylineOptions.points = _orgs;
        var polyline = new Polyline(self, result.id, polylineOptions, exec);
        self.OVERLAYS[result.id] = polyline;
        polyline.one(result.id + "_remove", function() {
            polyline.off();
            delete self.OVERLAYS[result.id];
            polyline = undefined;
        });
        if (typeof callback === "function") {
            callback.call(self, polyline);
        }
    }, self.errorHandler, self.id, 'loadPlugin', ['Polyline', polylineOptions], {sync: true});
};

//-------------
// Circle
//-------------
Map.prototype.addCircle = function(circleOptions, callback) {
    var self = this;
    circleOptions.center = circleOptions.center || {};
    circleOptions.center.lat = circleOptions.center.lat || 0.0;
    circleOptions.center.lng = circleOptions.center.lng || 0.0;
    circleOptions.strokeColor = common.HTMLColor2RGBA(circleOptions.strokeColor || "#FF0000", 0.75);
    circleOptions.fillColor = common.HTMLColor2RGBA(circleOptions.fillColor || "#000000", 0.75);
    circleOptions.strokeWidth = circleOptions.strokeWidth || 10;
    circleOptions.visible = common.defaultTrueOption(circleOptions.visible);
    circleOptions.zIndex = circleOptions.zIndex || 0;
    circleOptions.radius = circleOptions.radius || 1;

    exec(function(result) {
        var circle = new Circle(self, result.id, circleOptions, exec);
        self.OVERLAYS[result.id] = circle;

        circle.one(result.id + "_remove", function() {
            circle.off();
            delete self.OVERLAYS[result.id];
            circle = undefined;
        });
        if (typeof callback === "function") {
            callback.call(self, circle);
        }
    }, self.errorHandler, self.id, 'loadPlugin', ['Circle', circleOptions]);
};

//-------------
// Marker
//-------------

Map.prototype.addMarker = function(markerOptions, callback) {
    var self = this;
    markerOptions = common.markerOptionsFilter(markerOptions);
    exec(function(result) {
        var marker = new Marker(self, result.id, markerOptions, "Marker", exec);

        self.MARKERS[result.id] = marker;
        self.OVERLAYS[result.id] = marker;

        marker.one(result.id + "_remove", function() {
            marker.off();
            delete self.MARKERS[result.id];
            delete self.OVERLAYS[result.id];
            marker = undefined;
        });
        if (typeof callback === "function") {
            callback.call(self, marker);
        }
    }, self.errorHandler, self.id, 'loadPlugin', ['Marker', markerOptions]);
};


//------------------
// Marker cluster
//------------------
Map.prototype.addMarkerCluster = function(markerClusterOptions, callback) {
  var self = this;
  if (typeof markerClusterOptions === "function") {
    callback = markerClusterOptions;
    markerClusterOptions = null;
  }
  markerClusterOptions = markerClusterOptions || {};
  var positionList = markerClusterOptions.markers.map(function(marker) {
    return marker.position;
  });

  exec(function(result) {

    var markerMap = {};
    result.geocellList.forEach(function(geocell, idx) {
      var markerOptions = markerClusterOptions.markers[idx];
      markerOptions = common.markerOptionsFilter(markerOptions);

      var markerId = markerOptions.id || "marker_" + idx;
      //markerId = result.id + "-" + markerId;
      markerOptions.id = markerId;
      markerOptions._cluster = {
        isRemoved: false,
        isAdded: false,
        geocell: geocell,
        _marker: null
      };
/*
      var marker = new Marker(self, markerId, markerOptions, "MarkerCluster", exec);
      marker.set("isAdded", false, true);
      marker.set("geocell", geocell, true);
      marker.set("position", markerOptions.position, true);
      marker.getId = function() {
        return result.id + "-" + markerId;
      };
*/
      markerMap[markerId] = markerOptions;

      //self.MARKERS[marker.getId()] = marker;
      //self.OVERLAYS[marker.getId()] = marker;
    });

    var markerCluster = new MarkerCluster(self, result.id, {
      "icons": markerClusterOptions.icons,
      "markerMap": markerMap,
      "maxZoomLevel": Math.min(markerClusterOptions.maxZoomLevel || 15, 18),
      "debug": markerClusterOptions.debug === true,
      "boundsDraw": common.defaultTrueOption(markerClusterOptions.boundsDraw)
    }, exec);
    markerCluster.one("remove", function() {
      delete self.OVERLAYS[result.id];
/*
      result.geocellList.forEach(function(geocell, idx) {
        var markerOptions = markerClusterOptions.markers[idx];
        var markerId = result.id + "-" + (markerOptions.id || "marker_" + idx);
        var marker = self.MARKERS[markerId];
        if (marker) {
          marker.off();
        }
        //delete self.MARKERS[markerId];
        delete self.OVERLAYS[markerId];
      });
*/
      markerCluster.destroy();
    });

    self.OVERLAYS[result.id] = markerCluster;

    if (typeof callback === "function") {
        callback.call(self, markerCluster);
    }
  }, self.errorHandler, self.id, 'loadPlugin', ['MarkerCluster', {
    "positionList": positionList,
    "debug": markerClusterOptions.debug === true
  }]);

};

/*****************************************************************************
 * Callbacks from the native side
 *****************************************************************************/

Map.prototype._onSyncInfoWndPosition = function(eventName, points) {
  this.set("infoPosition", points);
};

Map.prototype._onMapEvent = function(eventName) {
    if (!this._isReady) {
      return;
    }
    var args = [eventName];
    for (var i = 1; i < arguments.length; i++) {
        args.push(arguments[i]);
    }
    this.trigger.apply(this, args);
};

Map.prototype._onMarkerEvent = function(eventName, markerId, position) {
    var self = this;
    var marker = self.MARKERS[markerId] || null;
    if (marker) {
        marker.set('position', position);
        if (eventName === event.INFO_OPEN) {
          marker.set("isInfoWindowShown", true);
        }
        if (eventName === event.INFO_CLOS) {
          marker.set("isInfoWindowShown", false);
        }
        marker.trigger(eventName, position, marker);
    }
};

Map.prototype._onClusterEvent = function(eventName, markerClusterId, clusterId, position) {
    var self = this;
    var markerCluster = self.OVERLAYS[markerClusterId] || null;
    if (markerCluster) {
      if (/^marker_/i.test(clusterId)) {
        // regular marker
        var marker = markerCluster.getMarkerById(clusterId);
        if (eventName === event.MARKER_CLICK) {
          markerCluster.trigger(eventName, position, marker);
        } else {
          if (eventName === event.INFO_OPEN) {
            marker.set("isInfoWindowShown", true);
          }
          if (eventName === event.INFO_CLOS) {
            marker.set("isInfoWindowShown", false);
          }
        }
        marker.trigger(eventName, position, marker);
      } else {
        // cluster marker
        var cluster = markerCluster.getClusterByClusterId(clusterId);
        if (cluster) {
          markerCluster.trigger(eventName, cluster);
        } else {
          console.log("-----> This is remained cluster icon : " + clusterId);
        }
      }
    }
};

Map.prototype._onOverlayEvent = function(eventName, overlayId) {
    var self = this;
    var overlay = self.OVERLAYS[overlayId] || null;
    if (overlay) {
        var args = [eventName];
        for (var i = 2; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        args.push(overlay); // for ionic
        overlay.trigger.apply(overlay, args);
    }
};

/*
Map.prototype._onKmlEvent = function(eventName, objectType, kmlLayerId, result, options) {
    var self = this;
    var kmlLayer = self.KML_LAYERS[kmlLayerId] || null;
    if (!kmlLayer) {
        return;
    }
    var args = [eventName];
    if (eventName === "add") {
        var overlay = null;

        switch ((objectType + "").toLowerCase()) {
            case "marker":
                overlay = new Marker(self, result.id, options);
                self.MARKERS[result.id] = overlay;
                args.push({
                    "type": "Marker",
                    "object": overlay
                });
                overlay.on(event.MARKER_CLICK, function() {
                    kmlLayer.trigger(event.OVERLAY_CLICK, overlay, overlay.getPosition());
                });
                break;

            case "polygon":
                overlay = new Polygon(self, result.id, options);
                args.push({
                    "type": "Polygon",
                    "object": overlay
                });

                overlay.on(event.OVERLAY_CLICK, function(latLng) {
                    kmlLayer.trigger(event.OVERLAY_CLICK, overlay, latLng);
                });
                break;

            case "polyline":
                overlay = new Polyline(self, result.id, options);
                args.push({
                    "type": "Polyline",
                    "object": overlay
                });
                overlay.on(event.OVERLAY_CLICK, function(latLng) {
                    kmlLayer.trigger(event.OVERLAY_CLICK, overlay, latLng);
                });
                break;
        }
        if (overlay) {
            self.OVERLAYS[result.id] = overlay;
            overlay.hashCode = result.hashCode;
            kmlLayer._overlays.push(overlay);
            kmlLayer.on("_REMOVE", function() {
                var idx = kmlLayer._overlays.indexOf(overlay);
                if (idx > -1) {
                    kmlLayer._overlays.splice(idx, 1);
                }
                overlay.remove();
                overlay.off();
            });
        }
    } else {
        for (var i = 2; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
    }
    //kmlLayer.trigger.apply(kmlLayer, args);
};
*/


Map.prototype.getCameraTarget = function() {
    return this.get("camera_target");
};

Map.prototype.getCameraZoom = function() {
    return this.get("camera_zoom");
};
Map.prototype.getCameraTilt = function() {
    return this.get("camera_tilt");
};
Map.prototype.getCameraBearing = function() {
    return this.get("camera_bearing");
};

Map.prototype._onCameraEvent = function(eventName, cameraPosition) {
    this.set('camera', cameraPosition);
    this.set('camera_target', cameraPosition.target);
    this.set('camera_zoom', cameraPosition.zoom);
    this.set('camera_bearing', cameraPosition.bearing);
    this.set('camera_tilt', cameraPosition.viewAngle || cameraPosition.tilt);
    this.set('camera_northeast', cameraPosition.northeast);
    this.set('camera_southwest', cameraPosition.southwest);
    this.set('camera_nearLeft', cameraPosition.nearLeft);
    this.set('camera_nearRight', cameraPosition.nearRight);
    this.set('camera_farLeft', cameraPosition.farLeft);
    this.set('camera_farRight', cameraPosition.farRight);
    if (this._isReady) {
      this.trigger(eventName, cameraPosition, this);
    }
};
module.exports = Map;
