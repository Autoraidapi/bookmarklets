(function () {
/**
 * almond 0.0.3 Copyright (c) 2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
/*jslint strict: false, plusplus: false */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {

    var defined = {},
        waiting = {},
        aps = [].slice,
        main, req;

    if (typeof define === "function") {
        //If a define is already in play via another AMD loader,
        //do not overwrite.
        return;
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseName = baseName.split("/");
                baseName = baseName.slice(0, baseName.length - 1);

                name = baseName.concat(name.split("/"));

                //start trimDots
                var i, part;
                for (i = 0; (part = name[i]); i++) {
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            }
        }
        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (waiting.hasOwnProperty(name)) {
            var args = waiting[name];
            delete waiting[name];
            main.apply(undef, args);
        }
        return defined[name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    function makeMap(name, relName) {
        var prefix, plugin,
            index = name.indexOf('!');

        if (index !== -1) {
            prefix = normalize(name.slice(0, index), relName);
            name = name.slice(index + 1);
            plugin = callDep(prefix);

            //Normalize according
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            p: plugin
        };
    }

    main = function (name, deps, callback, relName) {
        var args = [],
            usingExports,
            cjsModule, depName, i, ret, map;

        //Use name if no relName
        if (!relName) {
            relName = name;
        }

        //Call the callback to define the module, if necessary.
        if (typeof callback === 'function') {

            //Default to require, exports, module if no deps if
            //the factory arg has any arguments specified.
            if (!deps.length && callback.length) {
                deps = ['require', 'exports', 'module'];
            }

            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            for (i = 0; i < deps.length; i++) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = makeRequire(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = defined[name] = {};
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = {
                        id: name,
                        uri: '',
                        exports: defined[name]
                    };
                } else if (defined.hasOwnProperty(depName) || waiting.hasOwnProperty(depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw name + ' missing ' + depName;
                }
            }

            ret = callback.apply(defined[name], args);

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef) {
                    defined[name] = cjsModule.exports;
                } else if (!usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = req = function (deps, callback, relName, forceSync) {
        if (typeof deps === "string") {

            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            //Drop the config stuff on the ground.
            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = arguments[2];
            } else {
                deps = [];
            }
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 15);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function () {
        return req;
    };

    /**
     * Export require as a global, but only if it does not already exist.
     */
    if (!require) {
        require = req;
    }

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (define.unordered) {
            waiting[name] = [name, deps, callback];
        } else {
            main(name, deps, callback);
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("dependencies/almond/almond", function(){});

define('core/lib/error',['require','exports','module'],function (require, exports, module) {
module.exports = {
    /** Wraps a function in a try/catch.
      * On catch of an error it prints it out using `during` to provide context.
      * `during` may be a string or an index into the arguments array of the wrapped function.
      */
    wrap: function (f, during) {
        return function () {
            try {
                return f.apply(null, arguments);
            } catch (e) {
                var duringStr = '';
                if (during !== undefined) {
                    duringStr = ' (during "' + (during >= 0 ? arguments[during] : during) + '")';
                }
                console.error(e.name + ': ' + e.message + duringStr);
                console.log(e && e.stack || e);
            }
        };
    },

    wrapAll: function (lib, prefix) {
        for (var f in lib) {
            if (typeof lib[f] === 'function') {
                lib[f] = module.exports.wrap(lib[f], prefix ? prefix + f : f);
            }
        }
    },
};
});

define('core/lib/events',['require','exports','module','./error'],function (require, exports, module) {
/*
 *  Copyright (C) 2011, 2012 Research In Motion Limited. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *  NOTE: Taken from the Ripple-UI project
 *        https://github.com/blackberry/Ripple-UI/
 *
 *  MODIFICATIONS
 *      - renamed 'on' apis/methods to 'emit'
 *      - removed getEventSubscribers/eventHasSubscriber methods
 *      - remove usage of ripple's exception/utils modules
 */
var error = require('./error'),
    _listeners = {};

function on(type, listener, once, paramMatch) {
    paramMatch = paramMatch || [];
    if (!type) {
        throw "type must be truthy";
    }
    if (!listener || listener === null || typeof listener !== 'function') {
        throw "Could not add listener for event '" + type + "' " + (listener ? "this listener isn't a function" : "this listener is undefined");
    }
    _listeners[type] = _listeners[type] || [];
    for (var i = 0; i < _listeners[type].length; i++) {
        if (_listeners[type][i] && _listeners[type][i].origFunc === listener) {
            console.warn("Could not add listener for event '" + type + "' this listener is already registered on this event");
            return;
        }
    }
    if (_listeners[type].length === 0) {
        module.exports.emit('event.type.added', [type], true);
    }
    _listeners[type].push({
        origFunc: listener,
        func: error.wrap(listener, type),
        once: !!once,
        paramMatch: paramMatch,
    });
}

function emit(listener, args, sync) {
    if (sync) {
        listener.func.apply(undefined, args);
    } else {
        setTimeout(function () {
            listener.func.apply(undefined, args);
        }, 1);
    }
}

module.exports = {
    on: function (type, listener, paramMatch) {
        on(type, listener, false, paramMatch);
    },

    once: function (type, listener, paramMatch) {
        on(type, listener, true, paramMatch);
    },

    emit: function (type, args, sync) {
        args = args || [];
        // Default value for sync is true.
        sync = sync || sync === undefined;

        if (_listeners[type]) {
            _listeners[type].forEach(function (listener, indexOfArray, array) {
                var paramMatches = listener.paramMatch.every(function (param, index) {
                    if (args[index] && args[index].webviewId && param) {
                        return param.webviewId === args[index].webviewId;
                    }
                    return param === args[index] || param === module.exports.FILTER_ANY;
                });
                if (!paramMatches) {
                    return;
                }
                emit(listener, args, sync);
                if (listener.once) {
                    delete array[indexOfArray];
                }
            });
        }
    },

    clear: function (type) {
        if (type) {
            delete _listeners[type];
        }
    },

    un: function (type, callback) {
        if (type && callback && _listeners[type]) {
            _listeners[type] = _listeners[type].filter(function (listener) {
                return !((listener.func === callback || listener.origFunc === callback) && _listeners[type].indexOf(listener) !== -1);
            });
            if (_listeners[type].length === 0) {
                module.exports.emit('event.type.removed', [type], true);
            }
        }
    },

    isOn: function (type) {
        if (!_listeners[type]) {
            return false;
        }
        return typeof _listeners[type] !== "undefined" && _listeners[type].length !== 0;
    },

    FILTER_ANY: {} // This is a sentinel value that allows wildcard matching in pre-filerted events.
};
});

define('core/lib/rpc/rpc.view',['require','exports','module','../events'],function (require, exports, module) {
/**
 * @namespace rpc
 * @name wp.view.rpc
 * @description RPC module for communicating with the controller WebView
*/
var rpc,
    events = require("../events");

/**
 * @name postMessage
 * @memberOf wp.view.rpc
 * @function
 * @description Sends a message to the JavaScript context of the controller WebView
 * @param {String} messageType Type of message to send.
 * @param {Object} message Message to send. Accepts string or JSON object
 * @param {Object} [options] RPC options
 * @param {String} [options.type="message"] Message type
 * @returns {Object} Error object if an error occurred
 * @example
 * wp.view.rpc.postMessage("message", "Hello");
 * wp.view.rpc.postMessage("error", "Error message", {type:"error"});
*/
function postMessage(messageType, message, options) {
    options = options || {};
    var info = {
            "messageType": messageType
        };

    if (!info.messageType || typeof(info.messageType) !== "string") {
        return new Error("Message type is required");
    }
    info.message = message;
    qnx.callExtensionMethod("webplatform.rpc", JSON.stringify(info));
}

/**
 * @name on
 * @memberOf wp.view.rpc
 * @function
 * @description Listen for a certain rpc event from the controller WebView
 * @param {String} eventName Event name
 * @param {Function} callback Callback function
 * @example
 * wp.view.rpc.on("message", function (message) {
 *     console.log(message);
 * });
*/
function on(eventType, callback) {
    events.on("rpc." + eventType, callback);
}

/**
 * @name once
 * @memberOf wp.view.rpc
 * @function
 * @description Listens for a certain rpc event from the controller WebView only once
 * @param {String} eventName Event name
 * @param {Function} callback Callback function
 * @example
 * wp.view.rpc.once("message", function (message) {
 *     console.log(message);
 * });
*/
function once(eventType, callback) {
    events.once("rpc." + eventType, callback);
}

/**
 * @name un
 * @memberOf wp.view.rpc
 * @function
 * @description Stop listening for a certain rpc event from the controller WebView
 * @param {String} eventName Event name
 * @param {Function} callback Callback function
 * @example
 * wp.view.rpc.on("message", myCallbackFunction);
 * wp.view.rpc.un("message", myCallbackFunction);
*/
function un(eventType, callback) {
    events.un("rpc." + eventType, callback);
}

/**
 * @name emit
 * @memberOf wp.view.rpc
 * @function
 * @description Emits an rpc event
 * @param {String} eventName Event name
 * @param {[Object]} args Arguments to pass to the event listeners
 * @param {Object} options Event options
 * @example
 * wp.view.rpc.emit("message", ["Hello", "World"], {sync:true});
*/
function emit(eventType, args, options) {
    events.emit("rpc." + eventType, args, options);
}

rpc = {
    "postMessage": postMessage,
    "on": on,
    "un": un,
    "once": once,
    "emit": emit
};

module.exports = rpc;
});

define('core/lib/pps/pps',['require','exports','module','../error'],function (require, exports, module) {
/*
* Copyright 2012 Research In Motion Limited.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/*jshint es5:true */

var pps,
    globalId = 0,
    ppsConnections = {};

function generateId() {
    var id = globalId++;
    if (!window.isFinite(id)) {
        globalId = 0;
        id = 0;
    }
    return id;
}

pps = {
    // PPS Modes
    PPSMode: { FULL: 0, DELTA: 1, SERVER: 2, RAW: 3 },
    // File mode constants for use with the open() function
    // WRONLY is fastest
    // CREATE can be or-ed with RDONLY, WRONLY, or RDWR (e.g. open("/pps/someppsobject", FileMode.CREATE|FileMode.WRONLY))
    FileMode: { RDONLY: 0, WRONLY: 1, RDWR: 2, CREATE: 256 },

    create: function (ppsPath, ppsMode) {
        var _id = generateId(),
            _path = ppsPath,
            _mode = ppsMode,
            _data,
            _returnObj;

        function isActive() {
            return ppsConnections.hasOwnProperty(_id);
        }

        function deactivate() {
            delete ppsConnections[_id];
        }

        function open(fileMode, options) {
            var obj = JSON.parse(qnx.callExtensionMethod('pps.open', _id, _path, _mode, fileMode, options));
            if (obj.result) {
                ppsConnections[_id] = this;
                _data = obj.data;
                return true;
            }
            return false;
        }

        function write(data) {
            if (isActive()) {
                return qnx.callExtensionMethod('pps.write', _id, JSON.stringify(data)) === 'true';
            }
            return false;
        }

        function close() {
            if (isActive()) {
                qnx.callExtensionMethod('pps.close', _id);
            }
        }

        _returnObj = {
            open : open,
            write : write,
            close : close,

            /**
             * @description Callback to be fired when the PPS object is first read after open() is called.
             * @type {function}
             */
            onFirstReadComplete: undefined,

            /**
             * @desription Callback fired when new data has changed in the PPS that you have open()
             * @type {function}
             */
            onNewData: undefined,

            onOpenFailed: function (message) {
                console.log('PPS Connection - open failed: ' + message);
            },
            onWriteFailed: function (message) {
                console.log('PPS Connection - write failed: ' + message);
            },
            onClosed : deactivate
        };

        _returnObj.__defineGetter__('mode', function () {
            return ppsMode;
        });

        _returnObj.__defineGetter__('data', function () {
            return _data;
        });

        _returnObj.__defineGetter__('path', function () {
            return _path;
        });

        return _returnObj;
    },

    onEvent: function (id, type, data) {
        if (!type || !ppsConnections.hasOwnProperty(id)) {
            return;
        }

        var ppsConnection = ppsConnections[id],
            eventHandlerName = 'on' + type;
        if (ppsConnection.hasOwnProperty(eventHandlerName) && ppsConnection[eventHandlerName]) {
            if (type === 'FirstReadComplete' || type === 'NewData') {
                data = JSON.parse(data);
                ppsConnection._data = data;
            }
            ppsConnection[eventHandlerName](data);
        }
    }
};

require('../error').wrapAll(pps, 'pps.');
module.exports = pps;
});

define('core/lib/pps/jpps',['require','exports','module'],function (require, exports, module) {
// Constants for use with the open() function

/** Used with the open() function as a mode parameter. This opens the file in
 * read-only mode.
    PPS_RDONLY = "0" */
/** Used with the open() function as a mode parameter. This opens the file in
 * write-only mode. Opening in write-only has less overhead than any other mode
 * and should be used whenever possible.
    JPPS_WRONLY = "1" */
/** Used with the open() function as a mode parameter. This opens the file in
 * read-write mode.
    JPPS_RDWR = "2" */
/** Used with the open() function as a mode parameter. This flag specifies that
 * the PPS object should be created if it does not exist. This flag can be or-ed
 * with the PPS_RDONLY, PPS_WRONLY or PPS_RDWR constants in the following manner:
 *
 * open("/pps/someppsobject",  PPS_CREATE|PPS_WRONLY);
 *
 * NOTE: O_CREAT flag is actually 0x100 (256 decimal), not '400' as is implied
 * by trunk/lib/c/public/fcntl.h.

    JPPS_CREATE = "256" */
/** Used with the open() function as a mode parameter. This flag specifies that
 * the PPS object should be created and opened in read-write mode. It is a
 * convenience constant equivalent to:
 *
 * open("/pps/someppsobject",  PPS_CREATE|PPS_RDWR);

    JPPS_RDWR_CREATE = "258" */

// Constants used in the init() function
/** The name of the native plugin library (*.so). */
var JPPS_LIB_NAME = "libjpps",
/** Name of the JPPS object, which is a concatenation of the library name and the
 * native class name. */
    JPPS_OBJ_NAME = JPPS_LIB_NAME + ".PPS",
    JPPS;

/* global JNEXT */
JPPS = {
    create: function () {
        var self = {
            m_strObjId: null,
            ppsObj: {}
        };

        // Initialize
        if (!JNEXT.require(JPPS_LIB_NAME)) {
            console.error("Unable to load \"" + JPPS_LIB_NAME + "\". PPS is unavailable.");
            return false;
        }

        self.m_strObjId = JNEXT.createObject(JPPS_OBJ_NAME);
        if (self.m_strObjId === "")  {
            console.error("JNext could not create the native PPS object \"" + JPPS_OBJ_NAME + "\". PPS is unavailable.");
            return false;
        }

        // JPPS Method declarations
        self.open = function (strPPSPath, mode, opts) {
            var parameters = strPPSPath + " " + mode + (opts ? " " + opts : ""),
                strVal = JNEXT.invoke(self.m_strObjId, "Open", parameters),
                arParams = strVal.split(" ");

            // If there's an error, output to the console
            if (arParams[0] !== "Ok") {
                console.error(strVal);
                return false;
            }

            return true;
        };

        self.read = function () {
            // Read a line from the file that was previously opened
            var strVal = JNEXT.invoke(self.m_strObjId, "Read"),
                arParams = strVal.split(" "),
                json;

            if (arParams[0] !== "Ok") {
                console.error(strVal);
                return false;
            }

            json = strVal.substr(arParams[0].length + 1);
            self.ppsObj = JSON.parse(json);
            return true;
        };

        self.write = function (obj) {
            var jstr = JSON.stringify(obj),
                strVal = JNEXT.invoke(self.m_strObjId, "Write", jstr),
                arParams = strVal.split(" ");

            if (arParams[0] !== "Ok") {
                console.error(strVal);
                return false;
            }

            return true;
        };

        self.close = function () {
            var strRes = JNEXT.invoke(self.m_strObjId, "Close");

            strRes = JNEXT.invoke(self.m_strObjId, "Dispose");
            JNEXT.unregisterEvents(self);
        };

        self.getId = function () {
            return self.m_strObjId;
        };

        self.onEvent = function (strData) {
            var arData = strData.split(" "),
                strEventDesc = arData[0],
                jsonData,
                data;

            switch (strEventDesc) {
            case "Error":
                self.onError();
                break;

            case "OnChange":
                jsonData = strData.substr(strEventDesc.length + 1);

                // data contains both the change data and the "full" data, in order
                // to avoid making a call to read() during the onChange
                data = JSON.parse(jsonData);

                // Update the local cache with a copy of the entire PPS object as it currently stands
                self.ppsObj = data["allData"];
                self.ppsData = {};
                self.ppsData[data["changeData"].objName] = data["allData"];

                // Send a change event with only the data that changed
                if (self.onChange !== null) {
                    self.onChange(data["changeData"]);
                }
                break;
            }
        };

        self.onError = function () {
            console.error("PPS onError() handler.");
        };

        JNEXT.registerEvents(self);

        return self;
    }
};

module.exports = JPPS;
});

define('core/lib/pps/ppsUtils',['require','exports','module','./pps','./jpps'],function (require, exports, module) {
/**
 * Copyright 2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

var pps = require("./pps"),
    JPPS = require("./jpps"),
    ppsUtils;

/**
 * @namespace
 * @name wp.pps
 * @description Module used to interact with pps
 * @property {Object} PPSMode Refer to {@link qnx.webplaform.pps.PPSMode}
 * @property {Object} FileMode  Refer to {@link qnx.webplaform.pps.FileMode}
 */
ppsUtils = {
    /**
     * @namespace Currently only FULL and DELTA are supported. Can be used with bitwise OR.
     * @name PPSMode
     * @memberOf wp.pps
     * @property {Number} FULL
     * @property {Number} DELTA
    */
    PPSMode: {
        FULL: 0,
        DELTA: 1,
        SERVER: 2,
        RAW: 4,
        WAIT: 8
    },

    /**
     * @name FileMode
     * @memberOf wp.pps
     * @namespace
     * @property {Number} RDONLY
     * @property {Number} WRONLY
     * @property {Number} RDWR
     * @property {Number} CREATE
    */
    FileMode: {
        RDONLY: 0,
        WRONLY: 1,
        RDWR: 2,
        CREATE: 256
    },

    /**
     * @function
     * @name create
     * @memberOf wp.pps
     * @description Creates a PPS Object
     * @param {String} path The path to the PPS object to be read
     * @param {wp.pps.PPSMode} [options.ppsMode=PPSMode.FULL] The mode to create the pps object
     * @returns {Object} An instance of a PPS object to run actions on
     */
    create: function (ppsPath, ppsMode) {
        var ppsObj,
            makeShim;

        if (ppsMode === pps.PPSMode.FULL) {
            ppsObj = pps.create(ppsPath, ppsMode);

            ppsObj.onOpenFailed = function (message) {
                ppsObj.onError(message);
            };

            ppsObj.onWriteFailed = function (message) {
                ppsObj.onError(message);
            };
        } else {

            /**
             * Since we are currently missing DELTA support through the pps / qnx
             * callExtensionMethod calls, this create method wraps a fork in
             * implementation between pps and the JPPS library which does support DELTA.
             * This shim exposes the same, expected interface for the JPPS implementation.
             */
            makeShim = function () {

                function buildPath(path, mode) {
                    var returnPath = path,
                        modes = [];

                    if (mode !== ppsUtils.PPSMode.FULL) {

                        if ((mode | ppsUtils.PPSMode.DELTA) === mode) {
                            modes.push("delta");
                        }

                        if (modes.length >= 1) {
                            returnPath += "?" + modes.join(",");
                        }
                    }

                    return returnPath;
                }

                var jppsObj,
                    _ppsObjName = ppsPath.split("/").pop().split("?").shift(), //Grab the final ppsObject name to append it to the returnObj
                    _path = buildPath(ppsPath, ppsMode),
                    _data,
                    _returnObj;

                jppsObj = JPPS.create();

                _returnObj = {
                    open: function (fileMode, options) {
                        var returnVal = jppsObj.open(_path, fileMode, options);
                        if (returnVal && jppsObj.read()) {
                            _data = {};
                            _data[_ppsObjName] = jppsObj.ppsObj;
                            if (this.onFirstReadComplete && typeof this.onFirstReadComplete === "function") {
                                this.onFirstReadComplete(_data);
                            }
                        }
                        return returnVal;
                    },

                    write: function (data) {
                        return jppsObj.write(data);
                    },

                    close: function () {
                        jppsObj.close();
                    },

                    onFirstReadComplete: undefined,

                    onNewData: undefined,

                    onClosed: undefined
                };

                _returnObj.__defineGetter__('mode', function () {
                    return ppsMode;
                });

                _returnObj.__defineGetter__('data', function () {
                    return jppsObj.ppsData || _data;
                });

                _returnObj.__defineGetter__('path', function () {
                    return _path;
                });

                jppsObj.onChange = function (data) {
                    if (_returnObj.onNewData && typeof _returnObj.onNewData === "function") {
                        _returnObj.onNewData(data);
                    }
                };

                return _returnObj;
            };

            ppsObj = makeShim();
        }

        return ppsObj;
    },

    /**
     * @function
     * @name read
     * @memberOf wp.pps
     * @description Reads from a PPS Object
     * @param {String} path The path to the PPS object to be read
     * @param {Object} [options] The options object
     * @param {wp.pps.PPSMode} [options.ppsMode=PPSMode.FULL] The mode to create the pps object
     * @param {wp.pps.FileMode} [options.fileMode=FileMode.RDONLY] The mode to open the file in
     * @param {Boolean} [options.sync=true] The option to read PPS object sync or async
     * @returns {Object} The data read from the PPS Object or undefined in an error
     * @throws {String} If an error occurs
     * @example
     * var NETWORK_STATUS_PATH = "/pps/services/networking/status_public"
     * ppsUtils.read(NETWORK_STATUS_PATH);
     * console.log(networkStatus['status_public']);
     */
    read: function (path, options) {

        options = options || {};

        var ppsMode = options.ppsMode || pps.PPSMode.FULL,
            fileMode = options.fileMode || pps.FileMode.RDONLY,
            //sync = options.sync || true, // need onSuccess and onError once we have async
            ppsObj = this.create(path, ppsMode),
            errorMsg,
            returnValue;

        if (ppsObj) {
            if (ppsObj.open(fileMode)) {
                ppsObj.close();
                returnValue = ppsObj.data;
            } else {
                errorMsg = "Failed to open PPS object with path " + path + " and with mode " + fileMode;
            }

        } else {
            errorMsg = "Failed to create a PPS object with path " + path + " and with mode " + ppsMode;
        }

        if (errorMsg) {
            throw errorMsg;
        } else {
            return returnValue;
        }
    },

    /**
     * @function
     * @name write
     * @memberOf wp.pps
     * @description Writes to a PPS Object
     * @param {Object} data The data object you want to write
     * @param {String} [data.value=''] The value of the data object
     * @param {String} path The path to the PPS object to be read
     * @param {Object} [options] The options object
     * @param {wp.pps.PPSMode} [options.ppsMode=PPSMode.FULL] The mode to create the pps object
     * @param {wp.pps.FileMode} [options.fileMode=FileMode.RDONLY] The mode to open the file in
     * @param {Boolean} [options.sync=true] The option to write PPS object sync or async
     * @param {Boolean} [options.encode=false] The option to encode the data
     * @returns {Boolean} True if write was successful or False otherwise
     * @throws {String} If an error occurs
     * @example
     * var NOTIFY_PATH = "/pps/services/notify/control";
     * wp.pps.write({"msg": "notify", "dat": {itemId: "uniqueID42", "title":"hello"}}, NOTIFY_PATH);
     */
    write: function (data, path, options) {
        options = options || {};

        var ppsMode = options.ppsMode || pps.PPSMode.FULL,
            fileMode = options.fileMode || pps.FileMode.RDWR,
            //sync = options.sync || true, // need onSuccess and onError once we have async
            encode = options.encode ? options.encode : false,
            ppsObj = this.create(path, ppsMode),
            errorMsg;

        if (ppsObj) {
            if (ppsObj.open(fileMode)) {
                data = encode ? ppsUtils.encode(data) : data;
                if (!ppsObj.write(data)) {
                    errorMsg = "Failed to write data to PPS object with path " + path;
                }
                ppsObj.close();
            } else {
                errorMsg = "Failed to open PPS object with path " + path + " and with mode " + fileMode;
            }

        } else {
            errorMsg = "Failed to create a PPS object with path " + path + " and with mode " + ppsMode;
        }

        if (errorMsg) {
            throw errorMsg;
        }
    },

    /**
     * @function
     * @name encode
     * @memberOf wp.pps
     * @description Encode an Object in PPS format
     * @param {Object} obj The object to encode
     * @returns {String} Object in PPS format
     */
    encode: function (obj) {
        var data = '',
            name,
            value;
        for (name in obj) {
            data += name + ':';
            value = obj[name];
            if (typeof value === 'string') {
                data += ':' + value;
            } else if (typeof value === 'number') {
                data += 'n:' + value;
            } else if (typeof value === 'boolean') {
                data += 'b:' + value;
            } else if (typeof value === 'object') {
                data += 'json:' + JSON.stringify(value);
            }
            data += '\n';
        }
        return data;
    },

    onEvent: pps.onEvent
};

module.exports = ppsUtils;
});

define('wp2/lib/mimeTypes',['require','exports','module'],function (require, exports, module) {
/*
 * Copyright 2012 Research In Motion Limited.
 *
 * Licensed under the Apache License,Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * This has been placed in the public domain as per Apache the original can be seen here:
 * http://svn.apache.org/repos/asf/httpd/httpd/branches/1.3.x/conf/mime.types
 *
 * We have made this into a Javascript module by simply stripping the un-used mimtypes
 * and keying off the spaces to push them into an array we can use for lookup
 */

var mimeTypes = {},
    mimeToFileEnding = {},
    _self,
    STATE = {
        NONE : 0,
        INITIAL_LOAD : 1,
        FULLY_LOADED : 2
    },
    loadState = STATE.NONE;

/*
 * File listing scooped from the invocation framework
 * manually added open office types
 */

function loadMimes() {
    _self.addMimeTypes("3g2", "video/3gpp2");
    _self.addMimeTypes("3gp", "video/3gpp");
    _self.addMimeTypes("aac", "audio/aac");
    _self.addMimeTypes("abs", "audio/x-mpeg");
    _self.addMimeTypes("ai", "application/postscript");
    _self.addMimeTypes("aif", "audio/x-aiff");
    _self.addMimeTypes("aifc", "audio/x-aiff");
    _self.addMimeTypes("aiff", "audio/x-aiff");
    _self.addMimeTypes("aim", "application/x-aim");
    _self.addMimeTypes("amr", "audio/amr");
    _self.addMimeTypes("art", "image/x-jg");
    _self.addMimeTypes("asc", "text/plain");
    _self.addMimeTypes("asf", "video/x-ms-asf");
    _self.addMimeTypes("asx", "video/x-ms-asf");
    _self.addMimeTypes("atom", "application/atom+xml");
    _self.addMimeTypes("au", "audio/basic");
    _self.addMimeTypes("avi", "video/x-msvideo");
    _self.addMimeTypes("avx", "video/x-rad-screenplay");
    _self.addMimeTypes("bcpio", "application/x-bcpio");
    _self.addMimeTypes("bin", "application/octet-stream");
    _self.addMimeTypes("bmp", "image/bmp");
    _self.addMimeTypes("body", "text/html");
    _self.addMimeTypes("cdf", "application/x-cdf");
    _self.addMimeTypes("cer", "application/x-x509-ca-cert");
    _self.addMimeTypes("cgm", "image/cgm");
    _self.addMimeTypes("class", "application/java");
    _self.addMimeTypes("cpio", "application/x-cpio");
    _self.addMimeTypes("csh", "application/x-csh");
    _self.addMimeTypes("css", "text/css");
    _self.addMimeTypes("dib", "image/bmp");
    _self.addMimeTypes("djv", "image/vnd.djvu");
    _self.addMimeTypes("djvu", "image/vnd.djvu");
    _self.addMimeTypes("dll", "application/octet-stream");
    _self.addMimeTypes("doc", "application/msword");
    _self.addMimeTypes("odt", "application/vnd.oasis.opendocument.text");
    _self.addMimeTypes("ods", "application/vnd.oasis.opendocument.spreadsheet");
    _self.addMimeTypes("docm", "application/vnd.ms-word.document.macroEnabled.12");
    _self.addMimeTypes("docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    _self.addMimeTypes("dot", "application/msword");
    _self.addMimeTypes("dotm", "application/vnd.ms-word.template.macroEnabled.12");
    _self.addMimeTypes("dotx", "application/vnd.openxmlformats-officedocument.wordprocessingml.template");
    _self.addMimeTypes("dtd", "application/xml-dtd");
    _self.addMimeTypes("dv", "video/x-dv");
    _self.addMimeTypes("dvi", "application/x-dvi");
    _self.addMimeTypes("eps", "application/postscript");
    _self.addMimeTypes("etx", "text/x-setext");
    _self.addMimeTypes("exe", "application/octet-stream");
    _self.addMimeTypes("flac", "audio/flac");
    _self.addMimeTypes("gif", "image/gif");
    _self.addMimeTypes("gtar", "application/x-gtar");
    _self.addMimeTypes("gz", "application/x-gzip");
    _self.addMimeTypes("h264", "video/h264");
    _self.addMimeTypes("hdf", "application/x-hdf");
    _self.addMimeTypes("hqx", "application/mac-binhex40");
    _self.addMimeTypes("htc", "text/x-component");
    _self.addMimeTypes("htm", "text/html");
    _self.addMimeTypes("html", "text/html");
    _self.addMimeTypes("hqx", "application/mac-binhex40");
    _self.addMimeTypes("ico", "image/x-icon");
    _self.addMimeTypes("ics", "text/calendar");
    _self.addMimeTypes("ief", "image/ief");
    _self.addMimeTypes("ifb", "text/calendar");
    _self.addMimeTypes("jad", "text/vnd.sun.j2me.app-descriptor");
    _self.addMimeTypes("jar", "application/java-archive");
    _self.addMimeTypes("java", "text/plain");
    _self.addMimeTypes("jnlp", "application/x-java-jnlp-file");
    _self.addMimeTypes("jpe", "image/jpeg");
    _self.addMimeTypes("jpeg", "image/jpeg");
    _self.addMimeTypes("jpg", "image/jpeg");
    _self.addMimeTypes("js", "text/javascript");
    _self.addMimeTypes("jsf", "text/plain");
    _self.addMimeTypes("jspf", "text/plain");
    _self.addMimeTypes("kar", "audio/x-midi");
    _self.addMimeTypes("latex", "application/x-latex");
    _self.addMimeTypes("m2ts", "video/MP2T");
    _self.addMimeTypes("m3u", "audio/x-mpegurl");
    _self.addMimeTypes("m4a", "audio/mp4a-latm");
    _self.addMimeTypes("m4b", "audio/mp4a-latm");
    _self.addMimeTypes("m4p", "audio/mp4a-latm");
    _self.addMimeTypes("m4u", "video/vnd.mpegurl");
    _self.addMimeTypes("m4v", "video/x-m4v");
    _self.addMimeTypes("mac", "image/x-macpaint");
    _self.addMimeTypes("man", "application/x-troff-man");
    _self.addMimeTypes("mathml", "application/mathml+xml");
    _self.addMimeTypes("me", "application/x-troff-me");
    _self.addMimeTypes("mid", "audio/x-midi");
    _self.addMimeTypes("midi", "audio/x-midi");
    _self.addMimeTypes("mif", "application/x-mif");
    _self.addMimeTypes("mka", "audio/x-matroska");
    _self.addMimeTypes("mkv", "video/x-matroska");
    _self.addMimeTypes("mk3d", "video/x-matroska-3d");
    _self.addMimeTypes("mov", "video/quicktime");
    _self.addMimeTypes("movie", "video/x-sgi-movie");
    _self.addMimeTypes("mp1", "audio/x-mpeg");
    _self.addMimeTypes("mp2", "audio/x-mpeg");
    _self.addMimeTypes("mp3", "audio/x-mpeg");
    _self.addMimeTypes("mp4", "video/mp4");
    _self.addMimeTypes("mpa", "audio/x-mpeg");
    _self.addMimeTypes("mpe", "video/mpeg");
    _self.addMimeTypes("mpeg", "video/mpeg");
    _self.addMimeTypes("mpega", "audio/x-mpeg");
    _self.addMimeTypes("mpg", "video/mpeg");
    _self.addMimeTypes("mpv2", "video/mpeg2");
    _self.addMimeTypes("ms", "application/x-wais-source");
    _self.addMimeTypes("nc", "application/x-netcdf");
    _self.addMimeTypes("oda", "application/oda");
    _self.addMimeTypes("ogg", "audio/ogg");
    _self.addMimeTypes("pbm", "image/x-portable-bitmap");
    _self.addMimeTypes("pct", "image/pict");
    _self.addMimeTypes("pdf", "application/pdf");
    _self.addMimeTypes("pgm", "image/x-portable-graymap");
    _self.addMimeTypes("pic", "image/pict");
    _self.addMimeTypes("pict", "image/pict");
    _self.addMimeTypes("pls", "audio/x-scpls");
    _self.addMimeTypes("png", "image/png");
    _self.addMimeTypes("pnm", "image/x-portable-anymap");
    _self.addMimeTypes("pnt", "image/x-macpaint");
    _self.addMimeTypes("pot", "application/vnd.ms-powerpoint");
    _self.addMimeTypes("potm", "application/vnd.ms-powerpoint.template.macroEnabled.12");
    _self.addMimeTypes("potx", "application/vnd.openxmlformats-officedocument.presentationml.template");
    _self.addMimeTypes("ppm", "image/x-portable-pixmap");
    _self.addMimeTypes("ppt", "application/vnd.ms-powerpoint");
    _self.addMimeTypes("pps", "application/vnd.ms-powerpoint");
    _self.addMimeTypes("ppsm", "application/vnd.ms-powerpoint.slideshow.macroEnabled.12");
    _self.addMimeTypes("ppsx", "application/vnd.openxmlformats-officedocument.presentationml.slideshow");
    _self.addMimeTypes("pptm", "application/vnd.ms-powerpoint.presentation.macroEnabled.12");
    _self.addMimeTypes("pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation");
    _self.addMimeTypes("ps", "application/postscript");
    _self.addMimeTypes("psd", "image/x-photoshop");
    _self.addMimeTypes("qcp", "audio/qcelp");
    _self.addMimeTypes("qt", "video/quicktime");
    _self.addMimeTypes("qti", "image/x-quicktime");
    _self.addMimeTypes("qtif", "image/x-quicktime");
    _self.addMimeTypes("ras", "image/x-cmu-raster");
    _self.addMimeTypes("rdf", "application/rdf+xml");
    _self.addMimeTypes("rgb", "image/x-rgb");
    _self.addMimeTypes("rm", "application/vnd.rn-realmedia");
    _self.addMimeTypes("roff", "application/x-troff");
    _self.addMimeTypes("rtf", "application/rtf");
    _self.addMimeTypes("rtx", "text/richtext");
    _self.addMimeTypes("sh", "application/x-sh");
    _self.addMimeTypes("shar", "application/x-shar");
    _self.addMimeTypes("smf", "audio/x-midi");
    _self.addMimeTypes("sit", "application/x-stuffit");
    _self.addMimeTypes("snd", "audio/basic");
    _self.addMimeTypes("src", "application/x-wais-source");
    _self.addMimeTypes("sv4cpio", "application/x-sv4cpio");
    _self.addMimeTypes("sv4crc", "application/x-sv4crc");
    _self.addMimeTypes("svg", "image/svg+xml");
    _self.addMimeTypes("svgz", "image/svg+xml");
    _self.addMimeTypes("swf", "application/x-shockwave-flash");
    _self.addMimeTypes("t", "application/x-troff");
    _self.addMimeTypes("tar", "application/x-tar");
    _self.addMimeTypes("tcl", "application/x-tcl");
    _self.addMimeTypes("tex", "application/x-tex");
    _self.addMimeTypes("texi", "application/x-texinfo");
    _self.addMimeTypes("texinfo", "application/x-texinfo");
    _self.addMimeTypes("tif", "image/tiff");
    _self.addMimeTypes("tiff", "image/tiff");
    _self.addMimeTypes("tr", "application/x-troff");
    _self.addMimeTypes("tsv", "text/tab-separated-values");
    _self.addMimeTypes("txt", "text/plain");
    _self.addMimeTypes("ulw", "audio/basic");
    _self.addMimeTypes("ustar", "application/x-ustar");
    _self.addMimeTypes("vsd", "application/x-visio");
    _self.addMimeTypes("vxml", "application/voicexml+xml");
    _self.addMimeTypes("wav", "audio/x-wav");
    _self.addMimeTypes("wma", "audio/x-ms-wma");
    _self.addMimeTypes("wml", "text/vnd.wap.wml");
    _self.addMimeTypes("wmlc", "application/vnd.wap.wmlc");
    _self.addMimeTypes("wmls", "text/vnd.wap.wmlscript");
    _self.addMimeTypes("wmlscriptc", "application/vnd.wap.wmlscriptc");
    _self.addMimeTypes("wmv", "video/x-ms-wmv");
    _self.addMimeTypes("wrl", "x-world/x-vrml");
    _self.addMimeTypes("wspolicy", "application/wspolicy+xml");
    _self.addMimeTypes("xbm", "image/x-xbitmap");
    _self.addMimeTypes("xht", "application/xhtml+xml");
    _self.addMimeTypes("xhtml", "application/xhtml+xml");
    _self.addMimeTypes("xls", "application/vnd.ms-excel");
    _self.addMimeTypes("xlsm", "application/vnd.ms-excel.sheet.macroEnabled.12");
    _self.addMimeTypes("xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    _self.addMimeTypes("xlt", "application/vnd.ms-excel");
    _self.addMimeTypes("xltm", "application/vnd.ms-excel.template.macroEnabled.12");
    _self.addMimeTypes("xltx", "application/vnd.openxmlformats-officedocument.spreadsheetml.template");
    _self.addMimeTypes("xml", "application/xml");
    _self.addMimeTypes("xpm", "image/x-xpixmap");
    _self.addMimeTypes("xsl", "application/xml");
    _self.addMimeTypes("xslt", "application/xslt+xml");
    _self.addMimeTypes("xul", "application/vnd.mozilla.xul+xml");
    _self.addMimeTypes("xwd", "image/x-xwindowdump");
    _self.addMimeTypes("Z", "application/x-compress");
    _self.addMimeTypes("z", "application/x-compress");
    _self.addMimeTypes("zip", "application/zip");
}

function loadMoreMimes() {
    _self.addMimeTypes("atomcat", "application/atomcat+xml");
    _self.addMimeTypes("atomsvc", "application/atomsvc+xml");
    _self.addMimeTypes("ccxml", "application/ccxml+xml");
    _self.addMimeTypes("cu", "application/cu-seeme");
    _self.addMimeTypes("davmount", "application/davmount+xml");
    _self.addMimeTypes("ecma", "application/ecmascript");
    _self.addMimeTypes("emma", "application/emma+xml");
    _self.addMimeTypes("epub", "application/epub+zip");
    _self.addMimeTypes("pfr", "application/font-tdpfr");
    _self.addMimeTypes("stk", "application/hyperstudio");
    _self.addMimeTypes("jar", "application/java-archive");
    _self.addMimeTypes("ser", "application/java-serialized-object");
    _self.addMimeTypes("class", "application/java-vm");
    _self.addMimeTypes("json", "application/json");
    _self.addMimeTypes("lostxml", "application/lost+xml");
    _self.addMimeTypes("hqx", "application/mac-binhex40");
    _self.addMimeTypes("cpt", "application/mac-compactpro");
    _self.addMimeTypes("mrc", "application/marc");
    _self.addMimeTypes("ma,nb,mb", "application/mathematica");
    _self.addMimeTypes("mathml", "application/mathml+xml");
    _self.addMimeTypes("mbox", "application/mbox");
    _self.addMimeTypes("mscml", "application/mediaservercontrol+xml");
    _self.addMimeTypes("mp4s", "application/mp4");
    _self.addMimeTypes("doc,dot", "application/msword");
    _self.addMimeTypes("mxf", "application/mxf");
    _self.addMimeTypes("oda", "application/oda");
    _self.addMimeTypes("opf", "application/oebps-package+xml");
    _self.addMimeTypes("ogx", "application/ogg");
    _self.addMimeTypes("onetoc,onetoc2,onetmp,onepkg", "application/onenote");
    _self.addMimeTypes("xer", "application/patch-ops-error+xml");
    _self.addMimeTypes("pgp", "application/pgp-encrypted");
    _self.addMimeTypes("asc,sig", "application/pgp-signature");
    _self.addMimeTypes("prf", "application/pics-rules");
    _self.addMimeTypes("p10", "application/pkcs10");
    _self.addMimeTypes("p7m,p7c", "application/pkcs7-mime");
    _self.addMimeTypes("p7s", "application/pkcs7-signature");
    _self.addMimeTypes("cer", "application/pkix-cert");
    _self.addMimeTypes("crl", "application/pkix-crl");
    _self.addMimeTypes("pkipath", "application/pkix-pkipath");
    _self.addMimeTypes("pki", "application/pkixcmp");
    _self.addMimeTypes("pls", "application/pls+xml");
    _self.addMimeTypes("ai,eps,ps", "application/postscript");
    _self.addMimeTypes("cww", "application/prs.cww");
    _self.addMimeTypes("rdf", "application/rdf+xml");
    _self.addMimeTypes("rif", "application/reginfo+xml");
    _self.addMimeTypes("rnc", "application/relax-ng-compact-syntax");
    _self.addMimeTypes("rl", "application/resource-lists+xml");
    _self.addMimeTypes("rld", "application/resource-lists-diff+xml");
    _self.addMimeTypes("rs", "application/rls-services+xml");
    _self.addMimeTypes("rsd", "application/rsd+xml");
    _self.addMimeTypes("rss", "application/rss+xml");
    _self.addMimeTypes("rtf", "application/rtf");
    _self.addMimeTypes("sbml", "application/sbml+xml");
    _self.addMimeTypes("scq", "application/scvp-cv-request");
    _self.addMimeTypes("scs", "application/scvp-cv-response");
    _self.addMimeTypes("spq", "application/scvp-vp-request");
    _self.addMimeTypes("spp", "application/scvp-vp-response");
    _self.addMimeTypes("sdp", "application/sdp");
    _self.addMimeTypes("setpay", "application/set-payment-initiation");
    _self.addMimeTypes("setreg", "application/set-registration-initiation");
    _self.addMimeTypes("shf", "application/shf+xml");
    _self.addMimeTypes("smi,smil", "application/smil+xml");
    _self.addMimeTypes("rq", "application/sparql-query");
    _self.addMimeTypes("srx", "application/sparql-results+xml");
    _self.addMimeTypes("gram", "application/srgs");
    _self.addMimeTypes("grxml", "application/srgs+xml");
    _self.addMimeTypes("ssml", "application/ssml+xml");
    _self.addMimeTypes("plb", "application/vnd.3gpp.pic-bw-large");
    _self.addMimeTypes("psb", "application/vnd.3gpp.pic-bw-small");
    _self.addMimeTypes("pvb", "application/vnd.3gpp.pic-bw-var");
    _self.addMimeTypes("tcap", "application/vnd.3gpp2.tcap");
    _self.addMimeTypes("pwn", "application/vnd.3m.post-it-notes");
    _self.addMimeTypes("aso", "application/vnd.accpac.simply.aso");
    _self.addMimeTypes("imp", "application/vnd.accpac.simply.imp");
    _self.addMimeTypes("acu", "application/vnd.acucobol");
    _self.addMimeTypes("atc,acutc", "application/vnd.acucorp");
    _self.addMimeTypes("air", "application/vnd.adobe.air-application-installer-package+zip");
    _self.addMimeTypes("xdp", "application/vnd.adobe.xdp+xml");
    _self.addMimeTypes("xfdf", "application/vnd.adobe.xfdf");
    _self.addMimeTypes("azf", "application/vnd.airzip.filesecure.azf");
    _self.addMimeTypes("azs", "application/vnd.airzip.filesecure.azs");
    _self.addMimeTypes("azw", "application/vnd.amazon.ebook");
    _self.addMimeTypes("acc", "application/vnd.americandynamics.acc");
    _self.addMimeTypes("ami", "application/vnd.amiga.ami");
    _self.addMimeTypes("apk", "application/vnd.android.package-archive");
    _self.addMimeTypes("cii", "application/vnd.anser-web-certificate-issue-initiation");
    _self.addMimeTypes("fti", "application/vnd.anser-web-funds-transfer-initiation");
    _self.addMimeTypes("atx", "application/vnd.antix.game-component");
    _self.addMimeTypes("mpkg", "application/vnd.apple.installer+xml");
    _self.addMimeTypes("swi", "application/vnd.arastra.swi");
    _self.addMimeTypes("aep", "application/vnd.audiograph");
    _self.addMimeTypes("mpm", "application/vnd.blueice.multipass");
    _self.addMimeTypes("bmi", "application/vnd.bmi");
    _self.addMimeTypes("rep", "application/vnd.businessobjects");
    _self.addMimeTypes("cdxml", "application/vnd.chemdraw+xml");
    _self.addMimeTypes("mmd", "application/vnd.chipnuts.karaoke-mmd");
    _self.addMimeTypes("cdy", "application/vnd.cinderella");
    _self.addMimeTypes("cla", "application/vnd.claymore");
    _self.addMimeTypes("c4g,c4d,c4f,c4p,c4u", "application/vnd.clonk.c4group");
    _self.addMimeTypes("csp", "application/vnd.commonspace");
    _self.addMimeTypes("cdbcmsg", "application/vnd.contact.cmsg");
    _self.addMimeTypes("cmc", "application/vnd.cosmocaller");
    _self.addMimeTypes("clkx", "application/vnd.crick.clicker");
    _self.addMimeTypes("clkk", "application/vnd.crick.clicker.keyboard");
    _self.addMimeTypes("clkp", "application/vnd.crick.clicker.palette");
    _self.addMimeTypes("clkt", "application/vnd.crick.clicker.template");
    _self.addMimeTypes("clkw", "application/vnd.crick.clicker.wordbank");
    _self.addMimeTypes("wbs", "application/vnd.criticaltools.wbs+xml");
    _self.addMimeTypes("pml", "application/vnd.ctc-posml");
    _self.addMimeTypes("ppd", "application/vnd.cups-ppd");
    _self.addMimeTypes("car", "application/vnd.curl.car");
    _self.addMimeTypes("pcurl", "application/vnd.curl.pcurl");
    _self.addMimeTypes("rdz", "application/vnd.data-vision.rdz");
    _self.addMimeTypes("fe_launch", "application/vnd.denovo.fcselayout-link");
    _self.addMimeTypes("dna", "application/vnd.dna");
    _self.addMimeTypes("mlp", "application/vnd.dolby.mlp");
    _self.addMimeTypes("dpg", "application/vnd.dpgraph");
    _self.addMimeTypes("dfac", "application/vnd.dreamfactory");
    _self.addMimeTypes("geo", "application/vnd.dynageo");
    _self.addMimeTypes("mag", "application/vnd.ecowin.chart");
    _self.addMimeTypes("nml", "application/vnd.enliven");
    _self.addMimeTypes("esf", "application/vnd.epson.esf");
    _self.addMimeTypes("msf", "application/vnd.epson.msf");
    _self.addMimeTypes("qam", "application/vnd.epson.quickanime");
    _self.addMimeTypes("slt", "application/vnd.epson.salt");
    _self.addMimeTypes("ssf", "application/vnd.epson.ssf");
    _self.addMimeTypes("es3,et3", "application/vnd.eszigno3+xml");
    _self.addMimeTypes("ez2", "application/vnd.ezpix-album");
    _self.addMimeTypes("ez3", "application/vnd.ezpix-package");
    _self.addMimeTypes("fdf", "application/vnd.fdf");
    _self.addMimeTypes("mseed", "application/vnd.fdsn.mseed");
    _self.addMimeTypes("seed,dataless", "application/vnd.fdsn.seed");
    _self.addMimeTypes("gph", "application/vnd.flographit");
    _self.addMimeTypes("ftc", "application/vnd.fluxtime.clip");
    _self.addMimeTypes("fm,frame,maker,book", "application/vnd.framemaker");
    _self.addMimeTypes("fnc", "application/vnd.frogans.fnc");
    _self.addMimeTypes("ltf", "application/vnd.frogans.ltf");
    _self.addMimeTypes("fsc", "application/vnd.fsc.weblaunch");
    _self.addMimeTypes("oas", "application/vnd.fujitsu.oasys");
    _self.addMimeTypes("oa2", "application/vnd.fujitsu.oasys2");
    _self.addMimeTypes("oa3", "application/vnd.fujitsu.oasys3");
    _self.addMimeTypes("fg5", "application/vnd.fujitsu.oasysgp");
    _self.addMimeTypes("bh2", "application/vnd.fujitsu.oasysprs");
    _self.addMimeTypes("ddd", "application/vnd.fujixerox.ddd");
    _self.addMimeTypes("xdw", "application/vnd.fujixerox.docuworks");
    _self.addMimeTypes("xbd", "application/vnd.fujixerox.docuworks.binder");
    _self.addMimeTypes("fzs", "application/vnd.fuzzysheet");
    _self.addMimeTypes("txd", "application/vnd.genomatix.tuxedo");
    _self.addMimeTypes("ggb", "application/vnd.geogebra.file");
    _self.addMimeTypes("ggt", "application/vnd.geogebra.tool");
    _self.addMimeTypes("gex,gre", "application/vnd.geometry-explorer");
    _self.addMimeTypes("gmx", "application/vnd.gmx");
    _self.addMimeTypes("kml", "application/vnd.google-earth.kml+xml");
    _self.addMimeTypes("kmz", "application/vnd.google-earth.kmz");
    _self.addMimeTypes("gqf,gqs", "application/vnd.grafeq");
    _self.addMimeTypes("gac", "application/vnd.groove-account");
    _self.addMimeTypes("ghf", "application/vnd.groove-help");
    _self.addMimeTypes("gim", "application/vnd.groove-identity-message");
    _self.addMimeTypes("grv", "application/vnd.groove-injector");
    _self.addMimeTypes("gtm", "application/vnd.groove-tool-message");
    _self.addMimeTypes("tpl", "application/vnd.groove-tool-template");
    _self.addMimeTypes("vcg", "application/vnd.groove-vcard");
    _self.addMimeTypes("zmm", "application/vnd.handheld-entertainment+xml");
    _self.addMimeTypes("hbci", "application/vnd.hbci");
    _self.addMimeTypes("les", "application/vnd.hhe.lesson-player");
    _self.addMimeTypes("hpgl", "application/vnd.hp-hpgl");
    _self.addMimeTypes("hpid", "application/vnd.hp-hpid");
    _self.addMimeTypes("hps", "application/vnd.hp-hps");
    _self.addMimeTypes("jlt", "application/vnd.hp-jlyt");
    _self.addMimeTypes("pcl", "application/vnd.hp-pcl");
    _self.addMimeTypes("pclxl", "application/vnd.hp-pclxl");
    _self.addMimeTypes("sfd-hdstx", "application/vnd.hydrostatix.sof-data");
    _self.addMimeTypes("x3d", "application/vnd.hzn-3d-crossword");
    _self.addMimeTypes("mpy", "application/vnd.ibm.minipay");
    _self.addMimeTypes("afp,listafp,list3820", "application/vnd.ibm.modcap");
    _self.addMimeTypes("irm", "application/vnd.ibm.rights-management");
    _self.addMimeTypes("sc", "application/vnd.ibm.secure-container");
    _self.addMimeTypes("icc,icm", "application/vnd.iccprofile");
    _self.addMimeTypes("igl", "application/vnd.igloader");
    _self.addMimeTypes("ivp", "application/vnd.immervision-ivp");
    _self.addMimeTypes("ivu", "application/vnd.immervision-ivu");
    _self.addMimeTypes("xpw,xpx", "application/vnd.intercon.formnet");
    _self.addMimeTypes("qbo", "application/vnd.intu.qbo");
    _self.addMimeTypes("qfx", "application/vnd.intu.qfx");
    _self.addMimeTypes("rcprofile", "application/vnd.ipunplugged.rcprofile");
    _self.addMimeTypes("irp", "application/vnd.irepository.package+xml");
    _self.addMimeTypes("xpr", "application/vnd.is-xpr");
    _self.addMimeTypes("jam", "application/vnd.jam");
    _self.addMimeTypes("rms", "application/vnd.jcp.javame.midlet-rms");
    _self.addMimeTypes("jisp", "application/vnd.jisp");
    _self.addMimeTypes("joda", "application/vnd.joost.joda-archive");
    _self.addMimeTypes("ktz,ktr", "application/vnd.kahootz");
    _self.addMimeTypes("karbon", "application/vnd.kde.karbon");
    _self.addMimeTypes("chrt", "application/vnd.kde.kchart");
    _self.addMimeTypes("kfo", "application/vnd.kde.kformula");
    _self.addMimeTypes("flw", "application/vnd.kde.kivio");
    _self.addMimeTypes("kon", "application/vnd.kde.kontour");
    _self.addMimeTypes("kpr,kpt", "application/vnd.kde.kpresenter");
    _self.addMimeTypes("ksp", "application/vnd.kde.kspread");
    _self.addMimeTypes("kwd,kwt", "application/vnd.kde.kword");
    _self.addMimeTypes("htke", "application/vnd.kenameaapp");
    _self.addMimeTypes("kia", "application/vnd.kidspiration");
    _self.addMimeTypes("kne,knp", "application/vnd.kinar");
    _self.addMimeTypes("skp,skd,skt,skm", "application/vnd.koan");
    _self.addMimeTypes("sse", "application/vnd.kodak-descriptor");
    _self.addMimeTypes("lbd", "application/vnd.llamagraphics.life-balance.desktop");
    _self.addMimeTypes("lbe", "application/vnd.llamagraphics.life-balance.exchange+xml");
    _self.addMimeTypes("123", "application/vnd.lotus-1-2-3");
    _self.addMimeTypes("apr", "application/vnd.lotus-approach");
    _self.addMimeTypes("pre", "application/vnd.lotus-freelance");
    _self.addMimeTypes("nsf", "application/vnd.lotus-notes");
    _self.addMimeTypes("org", "application/vnd.lotus-organizer");
    _self.addMimeTypes("scm", "application/vnd.lotus-screencam");
    _self.addMimeTypes("lwp", "application/vnd.lotus-wordpro");
    _self.addMimeTypes("portpkg", "application/vnd.macports.portpkg");
    _self.addMimeTypes("mcd", "application/vnd.mcd");
    _self.addMimeTypes("mc1", "application/vnd.medcalcdata");
    _self.addMimeTypes("cdkey", "application/vnd.mediastation.cdkey");
    _self.addMimeTypes("mwf", "application/vnd.mfer");
    _self.addMimeTypes("mfm", "application/vnd.mfmp");
    _self.addMimeTypes("flo", "application/vnd.micrografx.flo");
    _self.addMimeTypes("igx", "application/vnd.micrografx.igx");
    _self.addMimeTypes("mif", "application/vnd.mif");
    _self.addMimeTypes("daf", "application/vnd.mobius.daf");
    _self.addMimeTypes("dis", "application/vnd.mobius.dis");
    _self.addMimeTypes("mbk", "application/vnd.mobius.mbk");
    _self.addMimeTypes("mqy", "application/vnd.mobius.mqy");
    _self.addMimeTypes("msl", "application/vnd.mobius.msl");
    _self.addMimeTypes("plc", "application/vnd.mobius.plc");
    _self.addMimeTypes("txf", "application/vnd.mobius.txf");
    _self.addMimeTypes("mpn", "application/vnd.mophun.application");
    _self.addMimeTypes("mpc", "application/vnd.mophun.certificate");
    _self.addMimeTypes("xul", "application/vnd.mozilla.xul+xml");
    _self.addMimeTypes("cil", "application/vnd.ms-artgalry");
    _self.addMimeTypes("cab", "application/vnd.ms-cab-compressed");
    _self.addMimeTypes("xls,xlm,xla,xlc,xlt,xlw", "application/vnd.ms-excel");
    _self.addMimeTypes("xlam", "application/vnd.ms-excel.addin.macroenabled.12");
    _self.addMimeTypes("xlsb", "application/vnd.ms-excel.sheet.binary.macroenabled.12");
    _self.addMimeTypes("xlsm", "application/vnd.ms-excel.sheet.macroenabled.12");
    _self.addMimeTypes("xltm", "application/vnd.ms-excel.template.macroenabled.12");
    _self.addMimeTypes("eot", "application/vnd.ms-fontobject");
    _self.addMimeTypes("chm", "application/vnd.ms-htmlhelp");
    _self.addMimeTypes("ims", "application/vnd.ms-ims");
    _self.addMimeTypes("lrm", "application/vnd.ms-lrm");
    _self.addMimeTypes("cat", "application/vnd.ms-pki.seccat");
    _self.addMimeTypes("stl", "application/vnd.ms-pki.stl");
    _self.addMimeTypes("ppt,pps,pot", "application/vnd.ms-powerpoint");
    _self.addMimeTypes("ppam", "application/vnd.ms-powerpoint.addin.macroenabled.12");
    _self.addMimeTypes("pptm", "application/vnd.ms-powerpoint.presentation.macroenabled.12");
    _self.addMimeTypes("sldm", "application/vnd.ms-powerpoint.slide.macroenabled.12");
    _self.addMimeTypes("ppsm", "application/vnd.ms-powerpoint.slideshow.macroenabled.12");
    _self.addMimeTypes("potm", "application/vnd.ms-powerpoint.template.macroenabled.12");
    _self.addMimeTypes("mpp,mpt", "application/vnd.ms-project");
    _self.addMimeTypes("docm", "application/vnd.ms-word.document.macroenabled.12");
    _self.addMimeTypes("dotm", "application/vnd.ms-word.template.macroenabled.12");
    _self.addMimeTypes("wps,wks,wcm,wdb", "application/vnd.ms-works");
    _self.addMimeTypes("wpl", "application/vnd.ms-wpl");
    _self.addMimeTypes("xps", "application/vnd.ms-xpsdocument");
    _self.addMimeTypes("mseq", "application/vnd.mseq");
    _self.addMimeTypes("mus", "application/vnd.musician");
    _self.addMimeTypes("msty", "application/vnd.muvee.style");
    _self.addMimeTypes("nlu", "application/vnd.neurolanguage.nlu");
    _self.addMimeTypes("nnd", "application/vnd.noblenet-directory");
    _self.addMimeTypes("nns", "application/vnd.noblenet-sealer");
    _self.addMimeTypes("nnw", "application/vnd.noblenet-web");
    _self.addMimeTypes("ngdat", "application/vnd.nokia.n-gage.data");
    _self.addMimeTypes("n-gage", "application/vnd.nokia.n-gage.symbian.install");
    _self.addMimeTypes("rpst", "application/vnd.nokia.radio-preset");
    _self.addMimeTypes("rpss", "application/vnd.nokia.radio-presets");
    _self.addMimeTypes("edm", "application/vnd.novadigm.edm");
    _self.addMimeTypes("edx", "application/vnd.novadigm.edx");
    _self.addMimeTypes("ext", "application/vnd.novadigm.ext");
    _self.addMimeTypes("odc", "application/vnd.oasis.opendocument.chart");
    _self.addMimeTypes("otc", "application/vnd.oasis.opendocument.chart-template");
    _self.addMimeTypes("odb", "application/vnd.oasis.opendocument.database");
    _self.addMimeTypes("odf", "application/vnd.oasis.opendocument.formula");
    _self.addMimeTypes("odft", "application/vnd.oasis.opendocument.formula-template");
    _self.addMimeTypes("odg", "application/vnd.oasis.opendocument.graphics");
    _self.addMimeTypes("otg", "application/vnd.oasis.opendocument.graphics-template");
    _self.addMimeTypes("odi", "application/vnd.oasis.opendocument.image");
    _self.addMimeTypes("oti", "application/vnd.oasis.opendocument.image-template");
    _self.addMimeTypes("odp", "application/vnd.oasis.opendocument.presentation");
    _self.addMimeTypes("ots", "application/vnd.oasis.opendocument.spreadsheet-template");
    _self.addMimeTypes("otm", "application/vnd.oasis.opendocument.text-master");
    _self.addMimeTypes("ott", "application/vnd.oasis.opendocument.text-template");
    _self.addMimeTypes("oth", "application/vnd.oasis.opendocument.text-web");
    _self.addMimeTypes("xo", "application/vnd.olpc-sugar");
    _self.addMimeTypes("dd2", "application/vnd.oma.dd2+xml");
    _self.addMimeTypes("oxt", "application/vnd.openofficeorg.extension");
    _self.addMimeTypes("pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation");
    _self.addMimeTypes("sldx", "application/vnd.openxmlformats-officedocument.presentationml.slide");
    _self.addMimeTypes("ppsx", "application/vnd.openxmlformats-officedocument.presentationml.slideshow");
    _self.addMimeTypes("potx", "application/vnd.openxmlformats-officedocument.presentationml.template");
    _self.addMimeTypes("dp", "application/vnd.osgi.dp");
    _self.addMimeTypes("pdb,pqa,oprc", "application/vnd.palm");
    _self.addMimeTypes("str", "application/vnd.pg.format");
    _self.addMimeTypes("ei6", "application/vnd.pg.osasli");
    _self.addMimeTypes("efif", "application/vnd.picsel");
    _self.addMimeTypes("plf", "application/vnd.pocketlearn");
    _self.addMimeTypes("pbd", "application/vnd.powerbuilder6");
    _self.addMimeTypes("box", "application/vnd.previewsystems.box");
    _self.addMimeTypes("mgz", "application/vnd.proteus.magazine");
    _self.addMimeTypes("qps", "application/vnd.publishare-delta-tree");
    _self.addMimeTypes("ptid", "application/vnd.pvi.ptid1");
    _self.addMimeTypes("qxd,qxt,qwd,qwt,qxl,qxb", "application/vnd.quark.quarkxpress");
    _self.addMimeTypes("mxl", "application/vnd.recordare.musicxml");
    _self.addMimeTypes("musicxml", "application/vnd.recordare.musicxml+xml");
    _self.addMimeTypes("cod", "application/vnd.rim.cod");
    _self.addMimeTypes("rm", "application/vnd.rn-realmedia");
    _self.addMimeTypes("link66", "application/vnd.route66.link66+xml");
    _self.addMimeTypes("see", "application/vnd.seemail");
    _self.addMimeTypes("sema", "application/vnd.sema");
    _self.addMimeTypes("semd", "application/vnd.semd");
    _self.addMimeTypes("semf", "application/vnd.semf");
    _self.addMimeTypes("ifm", "application/vnd.shana.informed.formdata");
    _self.addMimeTypes("itp", "application/vnd.shana.informed.formtemplate");
    _self.addMimeTypes("iif", "application/vnd.shana.informed.interchange");
    _self.addMimeTypes("ipk", "application/vnd.shana.informed.package");
    _self.addMimeTypes("twd,twds", "application/vnd.simtech-mindmapper");
    _self.addMimeTypes("mmf", "application/vnd.smaf");
    _self.addMimeTypes("teacher", "application/vnd.smart.teacher");
    _self.addMimeTypes("sdkm,sdkd", "application/vnd.solent.sdkm+xml");
    _self.addMimeTypes("dxp", "application/vnd.spotfire.dxp");
    _self.addMimeTypes("sfs", "application/vnd.spotfire.sfs");
    _self.addMimeTypes("sdc", "application/vnd.stardivision.calc");
    _self.addMimeTypes("sda", "application/vnd.stardivision.draw");
    _self.addMimeTypes("sdd", "application/vnd.stardivision.impress");
    _self.addMimeTypes("smf", "application/vnd.stardivision.math");
    _self.addMimeTypes("sdw", "application/vnd.stardivision.writer");
    _self.addMimeTypes("vor", "application/vnd.stardivision.writer");
    _self.addMimeTypes("sgl", "application/vnd.stardivision.writer-global");
    _self.addMimeTypes("sxc", "application/vnd.sun.xml.calc");
    _self.addMimeTypes("stc", "application/vnd.sun.xml.calc.template");
    _self.addMimeTypes("sxd", "application/vnd.sun.xml.draw");
    _self.addMimeTypes("std", "application/vnd.sun.xml.draw.template");
    _self.addMimeTypes("sxi", "application/vnd.sun.xml.impress");
    _self.addMimeTypes("sti", "application/vnd.sun.xml.impress.template");
    _self.addMimeTypes("sxm", "application/vnd.sun.xml.math");
    _self.addMimeTypes("sxw", "application/vnd.sun.xml.writer");
    _self.addMimeTypes("sxg", "application/vnd.sun.xml.writer.global");
    _self.addMimeTypes("stw", "application/vnd.sun.xml.writer.template");
    _self.addMimeTypes("sus,susp", "application/vnd.sus-calendar");
    _self.addMimeTypes("svd", "application/vnd.svd");
    _self.addMimeTypes("sis,sisx", "application/vnd.symbian.install");
    _self.addMimeTypes("xsm", "application/vnd.syncml+xml");
    _self.addMimeTypes("bdm", "application/vnd.syncml.dm+wbxml");
    _self.addMimeTypes("xdm", "application/vnd.syncml.dm+xml");
    _self.addMimeTypes("tao", "application/vnd.tao.intent-module-archive");
    _self.addMimeTypes("tmo", "application/vnd.tmobile-livetv");
    _self.addMimeTypes("tpt", "application/vnd.trid.tpt");
    _self.addMimeTypes("mxs", "application/vnd.triscape.mxs");
    _self.addMimeTypes("tra", "application/vnd.trueapp");
    _self.addMimeTypes("ufd,ufdl", "application/vnd.ufdl");
    _self.addMimeTypes("utz", "application/vnd.uiq.theme");
    _self.addMimeTypes("umj", "application/vnd.umajin");
    _self.addMimeTypes("unityweb", "application/vnd.unity");
    _self.addMimeTypes("uoml", "application/vnd.uoml+xml");
    _self.addMimeTypes("vcx", "application/vnd.vcx");
    _self.addMimeTypes("vsd,vst,vss,vsw", "application/vnd.visio");
    _self.addMimeTypes("vis", "application/vnd.visionary");
    _self.addMimeTypes("vsf", "application/vnd.vsf");
    _self.addMimeTypes("wbxml", "application/vnd.wap.wbxml");
    _self.addMimeTypes("wmlc", "application/vnd.wap.wmlc");
    _self.addMimeTypes("wmlsc", "application/vnd.wap.wmlscriptc");
    _self.addMimeTypes("wtb", "application/vnd.webturbo");
    _self.addMimeTypes("wpd", "application/vnd.wordperfect");
    _self.addMimeTypes("wqd", "application/vnd.wqd");
    _self.addMimeTypes("stf", "application/vnd.wt.stf");
    _self.addMimeTypes("xar", "application/vnd.xara");
    _self.addMimeTypes("xfdl", "application/vnd.xfdl");
    _self.addMimeTypes("hvd", "application/vnd.yamaha.hv-dic");
    _self.addMimeTypes("hvs", "application/vnd.yamaha.hv-script");
    _self.addMimeTypes("hvp", "application/vnd.yamaha.hv-voice");
    _self.addMimeTypes("osf", "application/vnd.yamaha.openscoreformat");
    _self.addMimeTypes("osfpvg", "application/vnd.yamaha.openscoreformat.osfpvg+xml");
    _self.addMimeTypes("saf", "application/vnd.yamaha.smaf-audio");
    _self.addMimeTypes("spf", "application/vnd.yamaha.smaf-phrase");
    _self.addMimeTypes("cmp", "application/vnd.yellowriver-custom-menu");
    _self.addMimeTypes("zir,zirz", "application/vnd.zul");
    _self.addMimeTypes("zaz", "application/vnd.zzazz.deck+xml");
    _self.addMimeTypes("vxml", "application/voicexml+xml");
    _self.addMimeTypes("hlp", "application/winhlp");
    _self.addMimeTypes("wsdl", "application/wsdl+xml");
    _self.addMimeTypes("wspolicy", "application/wspolicy+xml");
    _self.addMimeTypes("abw", "application/x-abiword");
    _self.addMimeTypes("ace", "application/x-ace-compressed");
    _self.addMimeTypes("aab,x32,u32,vox", "application/x-authorware-bin");
    _self.addMimeTypes("aam", "application/x-authorware-map");
    _self.addMimeTypes("aas", "application/x-authorware-seg");
    _self.addMimeTypes("torrent", "application/x-bittorrent");
    _self.addMimeTypes("bz", "application/x-bzip");
    _self.addMimeTypes("bz2,boz", "application/x-bzip2");
    _self.addMimeTypes("vcd", "application/x-cdlink");
    _self.addMimeTypes("chat", "application/x-chat");
    _self.addMimeTypes("pgn", "application/x-chess-pgn");
    _self.addMimeTypes("bdf", "application/x-font-bdf");
    _self.addMimeTypes("gsf", "application/x-font-ghostscript");
    _self.addMimeTypes("psf", "application/x-font-linux-psf");
    _self.addMimeTypes("otf", "application/x-font-otf");
    _self.addMimeTypes("pcf", "application/x-font-pcf");
    _self.addMimeTypes("snf", "application/x-font-snf");
    _self.addMimeTypes("ttf,ttc", "application/x-font-ttf");
    _self.addMimeTypes("pfa,pfb,pfm,afm", "application/x-font-type1");
    _self.addMimeTypes("spl", "application/x-futuresplash");
    _self.addMimeTypes("gnumeric", "application/x-gnumeric");
    _self.addMimeTypes("deb,udeb", "application/x-debian-package");
    _self.addMimeTypes("dir,dcr,dxr,cst,cct,cxt,w3d,fgd,swa", "application/x-director");
    _self.addMimeTypes("wad", "application/x-doom");
    _self.addMimeTypes("ncx", "application/x-dtbncx+xml");
    _self.addMimeTypes("dtb", "application/x-dtbook+xml");
    _self.addMimeTypes("res", "application/x-dtbresource+xml");
    _self.addMimeTypes("prc,mobi", "application/x-mobipocket-ebook");
    _self.addMimeTypes("application", "application/x-ms-application");
    _self.addMimeTypes("wmd", "application/x-ms-wmd");
    _self.addMimeTypes("wmz", "application/x-ms-wmz");
    _self.addMimeTypes("xbap", "application/x-ms-xbap");
    _self.addMimeTypes("mdb", "application/x-msaccess");
    _self.addMimeTypes("obd", "application/x-msbinder");
    _self.addMimeTypes("crd", "application/x-mscardfile");
    _self.addMimeTypes("clp", "application/x-msclip");
    _self.addMimeTypes("exe,dll,com,bat,msi", "application/x-msdownload");
    _self.addMimeTypes("mvb,m13,m14", "application/x-msmediaview");
    _self.addMimeTypes("wmf", "application/x-msmetafile");
    _self.addMimeTypes("mny", "application/x-msmoney");
    _self.addMimeTypes("pub", "application/x-mspublisher");
    _self.addMimeTypes("scd", "application/x-msschedule");
    _self.addMimeTypes("trm", "application/x-msterminal");
    _self.addMimeTypes("wri", "application/x-mswrite");
    _self.addMimeTypes("nc,cdf", "application/x-netcdf");
    _self.addMimeTypes("p12,pfx", "application/x-pkcs12");
    _self.addMimeTypes("p7b,spc", "application/x-pkcs7-certificates");
    _self.addMimeTypes("p7r", "application/x-pkcs7-certreqresp");
    _self.addMimeTypes("rar", "application/x-rar-compressed");
    _self.addMimeTypes("src", "application/x-wais-source");
    _self.addMimeTypes("der,crt", "application/x-x509-ca-cert");
    _self.addMimeTypes("fig", "application/x-xfig");
    _self.addMimeTypes("xpi", "application/x-xpinstall");
    _self.addMimeTypes("xenc", "application/xenc+xml");
    _self.addMimeTypes("xhtml,xht", "application/xhtml+xml");
    _self.addMimeTypes("xml,xsl", "application/xml");
    _self.addMimeTypes("dtd", "application/xml-dtd");
    _self.addMimeTypes("xop", "application/xop+xml");
    _self.addMimeTypes("xslt", "application/xslt+xml");
    _self.addMimeTypes("xspf", "application/xspf+xml");
    _self.addMimeTypes("mxml,xhvml,xvml,xvm", "application/xv+xml");
    _self.addMimeTypes("zip", "application/zip");
    _self.addMimeTypes("adp", "audio/adpcm");
    _self.addMimeTypes("au,snd", "audio/basic");
    _self.addMimeTypes("mid,midi,kar,rmi", "audio/midi");
    _self.addMimeTypes("mp4a", "audio/mp4");
    _self.addMimeTypes("m4a,m4p", "audio/mp4a-latm");
    _self.addMimeTypes("mpga,mp2,mp2a,mp3,m2a,m3a", "audio/mpeg");
    _self.addMimeTypes("oga,ogg,spx", "audio/ogg");
    _self.addMimeTypes("eol", "audio/vnd.digital-winds");
    _self.addMimeTypes("dts", "audio/vnd.dts");
    _self.addMimeTypes("dtshd", "audio/vnd.dts.hd");
    _self.addMimeTypes("lvp", "audio/vnd.lucent.voice");
    _self.addMimeTypes("pya", "audio/vnd.ms-playready.media.pya");
    _self.addMimeTypes("ecelp4800", "audio/vnd.nuera.ecelp4800");
    _self.addMimeTypes("ecelp7470", "audio/vnd.nuera.ecelp7470");
    _self.addMimeTypes("ecelp9600", "audio/vnd.nuera.ecelp9600");
    _self.addMimeTypes("aac", "audio/x-aac");
    _self.addMimeTypes("aif,aiff,aifc", "audio/x-aiff");
    _self.addMimeTypes("m3u", "audio/x-mpegurl");
    _self.addMimeTypes("wax", "audio/x-ms-wax");
    _self.addMimeTypes("wma", "audio/x-ms-wma");
    _self.addMimeTypes("ram,ra", "audio/x-pn-realaudio");
    _self.addMimeTypes("rmp", "audio/x-pn-realaudio-plugin");
    _self.addMimeTypes("vsd", "application/x-visio");
    _self.addMimeTypes("vxml", "application/voicexml+xml");
    _self.addMimeTypes("wav", "audio/x-wav");
    _self.addMimeTypes("cdx", "chemical/x-cdx");
    _self.addMimeTypes("cif", "chemical/x-cif");
    _self.addMimeTypes("cmdf", "chemical/x-cmdf");
    _self.addMimeTypes("cml", "chemical/x-cml");
    _self.addMimeTypes("csml", "chemical/x-csml");
    _self.addMimeTypes("xyz", "chemical/x-xyz");
    _self.addMimeTypes("bmp", "image/bmp");
    _self.addMimeTypes("cgm", "image/cgm");
    _self.addMimeTypes("g3", "image/g3fax");
    _self.addMimeTypes("gif", "image/gif");
    _self.addMimeTypes("ief", "image/ief");
    _self.addMimeTypes("jp2", "image/jp2");
    _self.addMimeTypes("pict,pic,pct", "image/pict");
    _self.addMimeTypes("png", "image/png");
    _self.addMimeTypes("btif", "image/prs.btif");
    _self.addMimeTypes("svg,svgz", "image/svg+xml");
    _self.addMimeTypes("tiff,tif", "image/tiff");
    _self.addMimeTypes("psd", "image/vnd.adobe.photoshop");
    _self.addMimeTypes("djvu,djv", "image/vnd.djvu");
    _self.addMimeTypes("dwg", "image/vnd.dwg");
    _self.addMimeTypes("dxf", "image/vnd.dxf");
    _self.addMimeTypes("fbs", "image/vnd.fastbidsheet");
    _self.addMimeTypes("fpx", "image/vnd.fpx");
    _self.addMimeTypes("fst", "image/vnd.fst");
    _self.addMimeTypes("mmr", "image/vnd.fujixerox.edmics-mmr");
    _self.addMimeTypes("rlc", "image/vnd.fujixerox.edmics-rlc");
    _self.addMimeTypes("mdi", "image/vnd.ms-modi");
    _self.addMimeTypes("npx", "image/vnd.net-fpx");
    _self.addMimeTypes("wbmp", "image/vnd.wap.wbmp");
    _self.addMimeTypes("xif", "image/vnd.xiff");
    _self.addMimeTypes("ras", "image/x-cmu-raster");
    _self.addMimeTypes("cmx", "image/x-cmx");
    _self.addMimeTypes("fh,fhc,fh4,fh5,fh7", "image/x-freehand");
    _self.addMimeTypes("ico", "image/x-icon");
    _self.addMimeTypes("pntg,pnt,mac", "image/x-macpaint");
    _self.addMimeTypes("pcx", "image/x-pcx");
    _self.addMimeTypes("pnm", "image/x-portable-anymap");
    _self.addMimeTypes("pbm", "image/x-portable-bitmap");
    _self.addMimeTypes("pgm", "image/x-portable-graymap");
    _self.addMimeTypes("ppm", "image/x-portable-pixmap");
    _self.addMimeTypes("qtif,qti", "image/x-quicktime");
    _self.addMimeTypes("rgb", "image/x-rgb");
    _self.addMimeTypes("xbm", "image/x-xbitmap");
    _self.addMimeTypes("xpm", "image/x-xpixmap");
    _self.addMimeTypes("xwd", "image/x-xwindowdump");
    _self.addMimeTypes("eml,mime", "message/rfc822");
    _self.addMimeTypes("igs,iges", "model/iges");
    _self.addMimeTypes("msh,mesh,silo", "model/mesh");
    _self.addMimeTypes("dwf", "model/vnd.dwf");
    _self.addMimeTypes("gdl", "model/vnd.gdl");
    _self.addMimeTypes("gtw", "model/vnd.gtw");
    _self.addMimeTypes("mts", "model/vnd.mts");
    _self.addMimeTypes("vtu", "model/vnd.vtu");
    _self.addMimeTypes("wrl,vrml", "model/vrml");
    _self.addMimeTypes("ics,ifb", "text/calendar");
    _self.addMimeTypes("css", "text/css");
    _self.addMimeTypes("csv", "text/csv");
    _self.addMimeTypes("html,htm", "text/html");
    _self.addMimeTypes("txt,text,conf,def,list,log,in", "text/plain");
    _self.addMimeTypes("dsc", "text/prs.lines.tag");
    _self.addMimeTypes("rtx", "text/richtext");
    _self.addMimeTypes("sgml,sgm", "text/sgml");
    _self.addMimeTypes("tsv", "text/tab-separated-values");
    _self.addMimeTypes("t,tr,roff,man,me,ms", "text/troff");
    _self.addMimeTypes("uri,uris,urls", "text/uri-list");
    _self.addMimeTypes("curl", "text/vnd.curl");
    _self.addMimeTypes("dcurl", "text/vnd.curl.dcurl");
    _self.addMimeTypes("scurl", "text/vnd.curl.scurl");
    _self.addMimeTypes("mcurl", "text/vnd.curl.mcurl");
    _self.addMimeTypes("fly", "text/vnd.fly");
    _self.addMimeTypes("flx", "text/vnd.fmi.flexstor");
    _self.addMimeTypes("gv", "text/vnd.graphviz");
    _self.addMimeTypes("3dml", "text/vnd.in3d.3dml");
    _self.addMimeTypes("spot", "text/vnd.in3d.spot");
    _self.addMimeTypes("jad", "text/vnd.sun.j2me.app-descriptor");
    _self.addMimeTypes("s,asm", "text/x-asm");
    _self.addMimeTypes("c,cc,cxx,cpp,h,hh,dic", "text/x-c");
    _self.addMimeTypes("f,for,f77,f90", "text/x-fortran");
    _self.addMimeTypes("p,pas", "text/x-pascal");
    _self.addMimeTypes("java", "text/x-java-source");
    _self.addMimeTypes("etx", "text/x-setext");
    _self.addMimeTypes("uu", "text/x-uuencode");
    _self.addMimeTypes("vcs", "text/x-vcalendar");
    _self.addMimeTypes("vcf", "text/x-vcard");
    _self.addMimeTypes("3gp", "video/3gpp");
    _self.addMimeTypes("3g2", "video/3gpp2");
    _self.addMimeTypes("h261", "video/h261");
    _self.addMimeTypes("h263", "video/h263");
    _self.addMimeTypes("h264", "video/h264");
    _self.addMimeTypes("jpgv", "video/jpeg");
    _self.addMimeTypes("jpm,jpgm", "video/jpm");
    _self.addMimeTypes("mj2,mjp2", "video/mj2");
    _self.addMimeTypes("mp4,mp4v,mpg4,m4v", "video/mp4");
    _self.addMimeTypes("mpeg,mpg,mpe,m1v,m2v", "video/mpeg");
    _self.addMimeTypes("ogv", "video/ogg");
    _self.addMimeTypes("qt,mov", "video/quicktime");
    _self.addMimeTypes("fvt", "video/vnd.fvt");
    _self.addMimeTypes("mxu,m4u", "video/vnd.mpegurl");
    _self.addMimeTypes("pyv", "video/vnd.ms-playready.media.pyv");
    _self.addMimeTypes("viv", "video/vnd.vivo");
    _self.addMimeTypes("dv,dif", "video/x-dv");
    _self.addMimeTypes("f4v", "video/x-f4v");
    _self.addMimeTypes("fli", "video/x-fli");
    _self.addMimeTypes("flv", "video/x-flv");
    _self.addMimeTypes("asf,asx", "video/x-ms-asf");
    _self.addMimeTypes("wm", "video/x-ms-wm");
    _self.addMimeTypes("wmx", "video/x-ms-wmx");
    _self.addMimeTypes("wvx", "video/x-ms-wvx");
    _self.addMimeTypes("avi", "video/x-msvideo");
    _self.addMimeTypes("movie", "video/x-sgi-movie");
    _self.addMimeTypes("ice", "x-conference/x-cooltalk");
}

function loadIfNeeded(mimeType, fileEnding) {
    if (loadState === STATE.NONE) {
        loadMimes();
        loadState = STATE.INITIAL_LOAD;
    } else if (loadState === STATE.INITIAL_LOAD) {
        if (!mimeTypes[fileEnding] && !mimeToFileEnding[mimeType]) {
            loadMoreMimes();
            loadState = STATE.FULLY_LOADED;
        }
    }
}

_self = {
    lookupByFileEnding : function (fileEnding) {
        loadIfNeeded(null, fileEnding);
        return mimeTypes[fileEnding];
    },

    fileEndingbyMIME : function (mimeType) {
        loadIfNeeded(mimeType, null);
        return mimeToFileEnding[mimeType];
    },

    addMimeTypes : function (endings, mimeType) {
        var fileEndings = endings.split(',');
        fileEndings.forEach(function (ending) {
            mimeTypes[ending] = mimeType;

            if (!mimeToFileEnding[mimeType]) {
                mimeToFileEnding[mimeType] = [];
            }
            mimeToFileEnding[mimeType].push(ending);
        });
    }
};

module.exports = _self;
});

define('wp2/lib/utils',['require','exports','module','./mimeTypes','./mimeTypes'],function (require, exports, module) {
/*
 * Copyright 2010-2011 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**#nocode+*/

var _self,
    _mimeTypes;

_self = {
    inNode: function () {
        return !!require.resolve;
    },

    getQnxNamespace: function () {
        return _self.inNode() ? null : qnx;
    },

    base64Encode: function (text) {
        return window.btoa(window.unescape(window.encodeURIComponent(text)));
    },

    base64Decode: function (text) {
        return window.decodeURIComponent(window.escape(window.atob(text)));
    },

    copy: function (obj) {
        var i,
            newObj = !obj ? false : (obj.isArray ? [] : {});

        if (typeof obj === 'number' ||
            typeof obj === 'string' ||
            typeof obj === 'boolean' ||
            obj === null ||
            obj === undefined) {
            return obj;
        }

        if (obj instanceof Date) {
            return new Date(obj);
        }

        if (obj instanceof RegExp) {
            return new RegExp(obj);
        }

        for (i in obj) {
            if (obj.hasOwnProperty(i)) {
                if (obj[i] && typeof obj[i] === "object") {
                    if (obj[i] instanceof Date) {
                        newObj[i] = obj[i];
                    }
                    else {
                        newObj[i] = _self.copy(obj[i]);
                    }
                }
                else {
                    newObj[i] = obj[i];
                }
            }
        }

        return newObj;
    },

    parseURI : function (str) {
        var i, uri = {},
            key = [ "source", "scheme", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor" ],
            matcher = /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/.exec(str);

        for (i = key.length - 1; i >= 0; i--) {
            uri[key[i]] = matcher[i] || "";
        }

        return uri;
    },

    isLocalURI : function (uri) {
        return uri && uri.scheme && "local:///".indexOf(uri.scheme.toLowerCase()) !== -1;
    },

    isFileURI : function (uri) {
        return uri && uri.scheme && "file://".indexOf(uri.scheme.toLowerCase()) !== -1;
    },

    isHttpURI : function (uri) {
        return uri && uri.scheme && "http://".indexOf(uri.scheme.toLowerCase()) !== -1;
    },

    isHttpsURI : function (uri) {
        return uri && uri.scheme && "https://".indexOf(uri.scheme.toLowerCase()) !== -1;
    },

    // Checks if the specified uri starts with 'data:'
    isDataURI : function (uri) {
        return uri && uri.scheme && "data:".indexOf(uri.scheme.toLowerCase()) !== -1;
    },

    // Check if a url has a tel scheme
    isTelURI: function (uri) {
        return uri && uri.scheme && "tel:".indexOf(uri.scheme.toLowerCase()) !== -1;
    },

    // Check if a url is from a local protocal
    isLocalUrl: function (url) {
        if (url && url.indexOf('local:///') !== -1) {
            return true;
        }
        return false;
    },

    isDataUrl: function (url) {
        if (url && url.substring(0, 5) === 'data:') {
            return true;
        }
    },

    startsWith : function (str, substr) {
        return str.indexOf(substr) === 0;
    },

    fileNameToMIME : function (fileName) {
        var ext = fileName.split('.').pop();

        if (!_mimeTypes) {
            _mimeTypes = require('./mimeTypes');
        }

        return _mimeTypes.lookupByFileEnding(ext);
    },

    /*
     * Warning this function is greedy and will only return the first
     * file type based on the provided MIME type
     */
    fileEndingByMIME : function (mimeType) {

        if (!_mimeTypes) {
            _mimeTypes = require('./mimeTypes');
        }

        return _mimeTypes.fileEndingbyMIME(mimeType);
    },

    series: function (tasks, callback) {

        var execute = function () {
            var args = [],
                task;

            if (tasks.length) {
                task = tasks.shift();
                args = args.concat(task.args).concat(execute);
                task.func.apply(this, args);
            }
            else {
                callback.func.apply(this, callback.args);
            }
        };

        execute();
    },

    // navigator.language may be immutable
    // this allows for proper mocking of the property during testing
    language: function () {
        return navigator.language;
    },

    i18n: function () {
        var i18n = {
            translate: function (key) {
                return {
                    fetch: function () {
                        return key;
                    }
                };
            },
            format: function (dateOrNumber, formatCode) {
                return {
                    fetch: function () {
                        return dateOrNumber;
                    }
                };
            },
            reset: function () {
                return;
            }
        };
        return wp.i18n ? wp.i18n : i18n;
    },

    mixin: function (mixin, to) {
        Object.getOwnPropertyNames(mixin).forEach(function (prop) {
            if (Object.hasOwnProperty.call(mixin, prop)) {
                Object.defineProperty(to, prop, Object.getOwnPropertyDescriptor(mixin, prop));
            }
        });
        return to;
    },

    /**
     * Returns a local path translated into an actual path on the file system, this method should be updated
     * if the structure of the OS file system ever changes
     */
    translatePath : function (path) {
        var sourceDir = wp.getApplication().getEnv("HOME");

        if (_self.isLocalUrl(path)) {
            path = "file:///" + sourceDir.replace(/^\/*/, '') + "/../app/native/" + path.replace(/local:\/\/\//, '');
        }
        return path;
    },

    downloadFile : function (source, target, onSuccess, onError, options) {

        var fileName  = source.replace(/^.*[\\\/]/, ''),
            mimeType = _self.fileNameToMIME(fileName),
            xhr;

        if (mimeType) {
            if (mimeType.length > 1 && mimeType.isArray) {
                mimeType = mimeType[0];
            }
        } else {
            mimeType = 'text/plain';
        }

        if (typeof target === 'object') {
            target = target[0];
        }

        if (typeof options !== 'undefined') {
            mimeType = options.mimeType ? options.mimeType : mimeType;
            fileName = options.fileName ? options.fileName : fileName;
        }

        window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
        source = _self.translatePath(source);

        xhr = new XMLHttpRequest();
        xhr.open('GET', source, true);
        xhr.responseType = 'blob';
        xhr.onload = function (e) {
            window.requestFileSystem(window.TEMPORARY, 1024 * 1024, function (fileSystem) {
                fileSystem.root.getFile(target, {create: true}, function (fileEntry) {
                    fileEntry.createWriter(function (writer) {
                        writer.onerror = function (e) {
                            console.log("Could not properly write " + fileName);
                            //pass
                        };

                        var blob = new Blob([xhr.response], {type: mimeType});
                        writer.write(blob);

                        // Call the callback sending back the invokable file path file:///
                        if (onSuccess) {
                            onSuccess("file:///" + target.replace(/^\/*/, ''));
                        }
                    }, onError);
                }, onError);
            }, onError);
        };

        xhr.send();
    }
};

module.exports = _self;

/**#nocode-*/
});

define('core/lib/pps/ppsNetwork',['require','exports','module','./ppsUtils'],function (require, exports, module) {
/*
 *  Copyright 2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var self,
    ppsUtils = require('./ppsUtils'),
    // TODO: For enterprise perimeter apps, this needs to be looking into the enterprise folder
    NETWORK_INTERFACE_ROOT = '/pps/services/networking/interfaces/',
    NETWORK_STATUS_PATH = '/pps/services/networking/status_public',
    CELL_STATUS_PATH = '/pps/services/cellular/radioctrl/status_cell_public',
    NETWORK_INTERFACES,
    NETWORK_INFO_STATUS;

function getInterfaces(callback) {
    var ppsObj = ppsUtils.create(NETWORK_INTERFACE_ROOT + ".all", ppsUtils.PPSMode.FULL);
    NETWORK_INTERFACES = [];

    function onNewData(data) {
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                NETWORK_INTERFACES.push(key);
            }
        }
    }

    function onFirstReadComplete(data) {
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                NETWORK_INTERFACES.push(key);
            }
        }
    }

    function onClosed() {
        //Sort the interfaces In order of precedence
        NETWORK_INTERFACES = NETWORK_INTERFACES.sort(function (a, b) {
            var precedence = {
                'rndis0': 1,//USB
                'ecm0': 2,//USB
                'tiw_sta0': 3,
                'ppp0': 4//Bluetooth
            };

            //if not in pecedence list, place after usb but before ppp0
            return (precedence[a] ? precedence[a] : 3) - (precedence[b] ? precedence[b] : 3);
        });

        callback();
    }

    ppsObj.onNewData = onNewData;
    ppsObj.onFirstReadComplete = onFirstReadComplete;
    ppsObj.onClosed = onClosed;

    ppsObj.open(ppsUtils.FileMode.RDONLY);
    ppsObj.close();
}

function handleNetworkStatusForInterface(networkInterface) {
    var ipAddresses = networkInterface.ip_addresses,
        type = networkInterface.type,
        ip4,
        ip6;

    if ((type === "wifi" || type === "usb") && ipAddresses && ipAddresses.length === 2) {
        // The ip addresses are returned in an array of the format:
        // [ 'ipv4Address/subnet', 'ipv6Address%interface/subnet' ]
        // so we trim them down here for the convenience of the caller.
        // In the case of wifi, ip6 comes first then ip4
        if (ipAddresses[0].match("^([0-9]{1,3}([.][0-9]{1,3}){3}).*")) {
            //first address is IP4 [USB IP]
            ip4 = ipAddresses[0];
            ip6 = ipAddresses[1];
        } else {
            //first address is IP6 [WIFI IP]
            ip6 = ipAddresses[0];
            ip4 = ipAddresses[1];
        }
        return {
            ipv4Address: ip4.substr(0, ip4.indexOf('/')),
            ipv6Address: ip6.substr(0, ip6.indexOf('%')),
            type: type,
            connected: networkInterface.connected
        };
    }
}

function getNetworkStatusForInterface(i, callback) {
    if (i < NETWORK_INTERFACES.length) {
        var networkInterface = ppsUtils.read(NETWORK_INTERFACE_ROOT + NETWORK_INTERFACES[i]),
            networkStatus = handleNetworkStatusForInterface(networkInterface[NETWORK_INTERFACES[i]]);

        if (networkStatus) {
            NETWORK_INFO_STATUS[NETWORK_INTERFACES[i]] = networkStatus;
        } else {
            NETWORK_INFO_STATUS[NETWORK_INTERFACES[i]] = null;
        }

        getNetworkStatusForInterface(++i, callback);
    } else {
        callback(NETWORK_INFO_STATUS);
    }
}

self = {
    getNetworkInfo : function (callback) {
        if (callback) {
            getInterfaces(function () {
                NETWORK_INFO_STATUS = {};

                //Will recursively get the network status for each interface
                getNetworkStatusForInterface(0, callback);
            });
        }
    },

    getActiveConnectionInfo : function () {
        var activeConnectionInfo = null,
            defaultInterface,
            interfaceInfo,
            publicStatus,
            cellPublicStatus,
            cellInfo,
            networkStatus = ppsUtils.read(NETWORK_STATUS_PATH);

        publicStatus = networkStatus['status_public'];

        if (publicStatus['default_interface'] === "") {
            return null;
        } else {
            activeConnectionInfo = {};
        }

        defaultInterface = publicStatus['default_interface'];
        activeConnectionInfo.defaultInterface = defaultInterface;
        activeConnectionInfo.ipv4 = publicStatus['ip4_ok'] === "yes" ? true : false;
        activeConnectionInfo.ipv6 = publicStatus['ip6_ok'] === "yes" ? true : false;
        activeConnectionInfo.defaultGateways = publicStatus['default_gateway'];

        interfaceInfo = ppsUtils.read(NETWORK_INTERFACE_ROOT + defaultInterface);

        if (interfaceInfo) {
            activeConnectionInfo.type = interfaceInfo[defaultInterface].type;
            activeConnectionInfo.up = interfaceInfo[defaultInterface].up;

            if (interfaceInfo[defaultInterface].type === 'cellular') {
                cellInfo = ppsUtils.read(CELL_STATUS_PATH);
                cellPublicStatus = cellInfo['status_cell_public'];
                activeConnectionInfo.technology = cellPublicStatus['network_technology'];
            }
        }

        return activeConnectionInfo;
    },
};

module.exports = self;
});

define('core/lib/chrome',['require','exports','module'],function (require, exports, module) {
/*
 * Copyright (C) Research In Motion Limited 2011-2012. All rights reserved.
 */
var self;

self = {
    id: 1,
};

module.exports = self;
});

define('wp2/lib/device',['require','exports','module','../../core/lib/pps/ppsUtils','./utils','../../core/lib/pps/ppsNetwork','../../core/lib/events','../../core/lib/chrome'],function (require, exports, module) {
/**
 * Copyright 2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

var ppsUtils = require('../../core/lib/pps/ppsUtils'),
    utils = require('./utils'),
    ppsNetwork = require('../../core/lib/pps/ppsNetwork'),
    events = require("../../core/lib/events"),
    chromeId = require("../../core/lib/chrome").id,
    CONNECTION_EVENT_NAME = "device.connectionChange",
    BATTERY_EVENT_PREFIX = "device.battery.",
    BATTERY_EVENTS = {
        chargeLow: "chargeLow",
        chargeCritical: "chargeCritical",
        statusChange: "statusChange"
    },
    BATTERY_PPS_PATH = "/pps/services/BattMgr/status",
    CONNECTION_PPS_PATH = "/pps/services/networking/status_public",
    ppsObjects = {},
    /**
     * @namespace This class has several device properties that are populated through pps
     * @name wp.device
     * @property {String} devicePin The PIN of the device
     * @property {String} IMEI The IMEI of the device
     * @property {String} defaultTheme The default theme of the device
     * @property {String} deviceOS The operating system of the device
     * @property {String} deviceName The name of the device
     * @property {String} hardwareId The hardware Id of the device
     * @property {String} iconRes The resolution of the icons on the device.
     * @property {String} modelFullName The full name of the model eg BlackBerry Z10
     * @property {String} modelName The full name of the model eg Z10
     * @property {String} scmBundle The scm bundle of the OS build
     * @property {String} screenDPI The DPI value of the screen
     * @property {String} screenRes The resolution of the screen
     * @property {String} keyboardOffset The distance in pixels from the bottom of the screen to the keyboard
     * @property {String} keyboardHeight The height of the keyboard in pixels
     * @property {String} IMSI The IMSI is a restricted property of the device. It requires special auth permissions and more.
     * @property {String} timezone The current timezone of the device
     */
    device = {},
    timezones = null,
    batteryInfo = {},
    _batteryState = {CRITICAL: 0, LOW: 1, NORMAL: 2},
    DEVICE_TYPE = {
        L_SERIES : 0,
        N_SERIES : 1,
        R_SERIES : 2,
        A_SERIES : 3,
        W_SERIES : 4

    };

function defineProperty(ppsPath, propertyName, accessorArray) {
    Object.defineProperty(device, propertyName, {
        get: function () {
            try {
                var ppsData = ppsUtils.read(ppsPath);
                return accessorArray.reduce(function (previous, current) {
                    return previous[current];
                }, ppsData);
            } catch (ex) {
                //For consistency, always catch and log exceptions for all device properties
                console.error(ex);
            }
        },
        enumerable: true
    });
}

defineProperty("/pps/services/private/deviceproperties", "devicePin", ["deviceproperties", "devicepin"]);
defineProperty("/pps/services/private/deviceproperties", "IMEI", ["deviceproperties", "IMEI"]);
defineProperty("/pps/services/deviceproperties", "defaultTheme", ["deviceproperties", "defaultTheme"]);
defineProperty("/pps/services/deviceproperties", "deviceOS", ["deviceproperties", "device_os"]);
defineProperty("/pps/services/deviceproperties", "deviceName", ["deviceproperties", "devicename"]);
defineProperty("/pps/services/deviceproperties", "hardwareId", ["deviceproperties", "hardwareid"]);
defineProperty("/pps/services/deviceproperties", "iconRes", ["deviceproperties", "icon_res"]);
defineProperty("/pps/services/deviceproperties", "modelFullName", ["deviceproperties", "modelfullname"]);
defineProperty("/pps/services/deviceproperties", "modelName", ["deviceproperties", "modelname"]);
defineProperty("/pps/services/deviceproperties", "scmBundle", ["deviceproperties", "scmbundle"]);
defineProperty("/pps/services/deviceproperties", "screenDPI", ["deviceproperties", "screen_dpi"]);
defineProperty("/pps/services/deviceproperties", "screenRes", ["deviceproperties", "screen_res"]);
defineProperty("/pps/services/cellular/uicc/card0/status_private", "mcc", ["status_private", "hplmn", "mcc"]);
defineProperty("/pps/services/cellular/uicc/card0/status_private", "mnc", ["status_private", "hplmn", "mnc"]);
defineProperty("/pps/services/cellular/uicc/card0/status_restricted", "IMSI", ["status_restricted", "imsi"]);
defineProperty("/pps/services/confstr/_CS_TIMEZONE", "timezone", ["_CS_TIMEZONE", "_CS_TIMEZONE"]);

function batteryLevelToState(level) {
    if (level < 5) {
        return _batteryState.CRITICAL;
    } else if (level >= 5 && level < 15) {
        return _batteryState.LOW;
    } else {
        return _batteryState.NORMAL;
    }
}

function batteryOnNewData(changedData) {
    var newBatteryState,
        eventsToTrigger = {
            statusChange: false,
            chargeLow: false,
            chargeCritical: false
        },
        eventKey;

    // Determine imporant changes and trigger associated events
    if (changedData.changed) {
        if (changedData.changed.BatteryInfo && changedData.data && changedData.data.BatteryInfo && changedData.data.BatteryInfo.BatteryStatus) {
            batteryInfo.level = changedData.data.BatteryInfo.BatteryStatus.StateOfCharge;
            eventsToTrigger.statusChange = true;
        }

        if (changedData.changed.ChargerInfo && changedData.data) {
            batteryInfo.isPlugged = changedData.data.ChargerInfo !== "NONE";
            eventsToTrigger.statusChange = true;
        }

        newBatteryState = batteryLevelToState(batteryInfo.level);

        if (newBatteryState !== batteryInfo.state) {
            if (newBatteryState === _batteryState.LOW) {
                eventsToTrigger.chargeLow = true;
            } else if (newBatteryState === _batteryState.CRITICAL) {
                eventsToTrigger.chargeCritical = true;
            }

            batteryInfo.state = newBatteryState;
        }

        // Dispatch relevant events
        for (eventKey in eventsToTrigger) {
            if (eventsToTrigger.hasOwnProperty(eventKey) && eventsToTrigger[eventKey]) {
                wp.core.events.emit(BATTERY_EVENT_PREFIX + eventKey, [batteryInfo]);
            }
        }
    }
}

function batteryOnFirstRead(data) {
    // Store initial battery info data for delta comparisions
    batteryInfo.level = data.status.BatteryInfo.BatteryStatus.StateOfCharge;
    batteryInfo.isPlugged = data.status.ChargerInfo !== "NONE";
    batteryInfo.state = batteryLevelToState(batteryInfo.level);
}

function _setupPPS(eventName, path) {
    var ppsObj = ppsUtils.create(path, ppsUtils.PPSMode.DELTA);

    ppsObj.onFirstReadComplete = function (data) {
        wp.core.events.emit(eventName, [data]);
    };

    ppsObj.onNewData = function (data) {
        wp.core.events.emit(eventName, [data]);
    };

    ppsObj.open(ppsUtils.FileMode.RDONLY);

    ppsObjects[path] = ppsObj;
}

/**
 * @description Adds an event listener for device events
 * @param {String} eventName Device event name. Can be one of:
 *                  "device.connectionChange",
 *                  "device.battery.statusChange",
 *                  "device.battery.chargeLow", (Battery level under 15%)
 *                  "device.battery.chargeCritical" (Battery level under 5%)
 * @param {Function} handler Callback handler for when event gets fired
 * @example
 * wp.device.on("device.connectionChange", function (data) {
 *     console.log("Connection Changed!")
 * })
 */
device.on = function (eventName, handler) {
    if (utils.startsWith(eventName, BATTERY_EVENT_PREFIX)) {
        wp.core.events.on(eventName, handler);

        if (ppsObjects[BATTERY_PPS_PATH] === undefined) {
            var ppsObj = ppsUtils.create(BATTERY_PPS_PATH, ppsUtils.PPSMode.DELTA);

            ppsObj.onFirstReadComplete = batteryOnFirstRead;
            ppsObj.onNewData = batteryOnNewData;
            ppsObj.open(ppsUtils.FileMode.RDONLY);

            ppsObjects[BATTERY_PPS_PATH] = ppsObj;
        }
    } else if (eventName === CONNECTION_EVENT_NAME) {
        wp.core.events.on(eventName, handler);

        if (ppsObjects[CONNECTION_PPS_PATH] === undefined) {
            _setupPPS(eventName, CONNECTION_PPS_PATH);
        }
    }
};

/**
 * @description Removes an existing event handler for a device event
 * @param {String} Device event name
 * @param {Function} Event handler to unbind
 * @example
 * wp.device.un("device.connectionChange");
 */
device.un = function (eventName, handler) {
    var ppsObj,
        batteryEvent;

    if (utils.startsWith(eventName, BATTERY_EVENT_PREFIX)) {
        // Only close the PPS object if we have no battery listeners which need it
        wp.core.events.un(eventName, handler);

        // Since we have n types of listeners on this single PPS, make sure all
        // of them are unbound before closing the PPS
        for (batteryEvent in BATTERY_EVENTS) {
            if (BATTERY_EVENTS.hasOwnProperty(batteryEvent)) {
                if (events.isOn(BATTERY_EVENT_PREFIX + batteryEvent)) {
                    return;
                }
            }
        }

        ppsObj = ppsObjects[BATTERY_PPS_PATH];
        ppsObj.close();

        delete ppsObjects[BATTERY_PPS_PATH];

    } else if (eventName === CONNECTION_EVENT_NAME) {
        wp.getController().removeEventListener(eventName, handler);

        if (!events.isOn(chromeId, eventName)) {
            ppsObj = ppsObjects[CONNECTION_PPS_PATH];
            ppsObj.close();

            delete ppsObjects[CONNECTION_PPS_PATH];
        }
    }
};

/**
 * @description Returns all connected and not connected network interfaces for the device
 * @param {Function} Callback which contains a a list of interfaces as a parameter
 * @example
 * wp.device.getNetworkInterfaces(function (interfaces) {
 *     console.log(interfaces[0]) // Prints the first interface, such as "tiw_st0" (wifi)
 *     console.log(interfaces[1])
 * });
 */
device.getNetworkInterfaces = function (callback) {
    ppsNetwork.getNetworkInfo(callback);
};

/**
 * @name device#activeConnection
 * @description Returns the current connected connection
 * @returns {Object} Active connection information such as type, gateways, status
 * @example
 * var actionConnection = wp.device.activeConnection;
 * console.log(actionConnection.type); // One of ["wifi", "wired", "bluetooth_dun", "usb", "vpn", "bb", "cellular", "unknown", "none"]
 * console.log(actionConnection.defaultInterface); // Prints 'tiw_st0'
 * console.log(actionConnection.technology); //undefined except for cellular when its one of ["edge", "evdo", "umts", "lte", "unknown"]
 */
Object.defineProperty(device, 'activeConnection', {
    get: function () {
        return ppsNetwork.getActiveConnectionInfo();
    },
    enumerable: true
});

/**
 * @description Returns the list of all timezones
 * @param {Function} Callback which contains a list of timezone ids as parameter, if
 * there is a problem reading the timezone file, null will be returned
 * @example
 * wp.device.getTimezones(function (timezones) {
 *     if (timezones) {
 *         console.log(timezones[0]);
 *     }
 * })
 */
device.getTimezones = function (callback) {
    if (!callback || typeof callback !== "function") {
        return;
    }

    if (!timezones) {
        var sandbox = wp.getController().setFileSystemSandbox, // save original sandbox value
            errorHandler = function (e) {
                callback(null);
                // set it back to original value
                wp.getController().setFileSystemSandbox = sandbox;
            },
            gotFile = function (fileEntry) {
                fileEntry.file(function (file) {
                    var reader = new FileReader();

                    reader.onloadend = function (e) {
                        var fileContent = this.result,
                            lines = fileContent.split("\n"),
                            tz = [];

                        lines.forEach(function (line) {
                            if (/^"/.test(line)) {
                                tz.push(line.replace(/"/g, ""));
                            }
                        });
                        callback(tz);
                        // cache read timezones list for subsequent calls
                        timezones = tz;
                        // set it back to original value
                        wp.getController().setFileSystemSandbox = sandbox;
                    };

                    reader.readAsText(file);
                }, errorHandler);
            },
            onInitFs = function (fs) {
                wp.getController().setFileSystemSandbox = false;
                fs.root.getFile("/usr/share/zoneinfo/tzvalid", {create: false}, gotFile, errorHandler);
            };

        window.webkitRequestFileSystem(window.PERSISTENT, 1024 * 1024, onInitFs, errorHandler);
    } else {
        callback(timezones);
    }
};

/**
 * @name device#hasPhysicalKeyboard
 * @description Returns from a media query whether this device has a physical keyboard or not
 */
device.__defineGetter__("hasPhysicalKeyboard", function () {
    return window.matchMedia("(-blackberry-physical-keyboard)").matches;
});

/**
 * @name device#hasOledScreen
 * @description Returns true if this device has a oled screen
 */
device.__defineGetter__("hasOledScreen", function () {
    return window.matchMedia("(-blackberry-display-technology: -blackberry-display-oled)").matches;
});

/**
 * @name device#type
 * @description Returns the current type of device based on the screen height and width
 *              0 = L Series Device
 *              1 = N Series Device
 *              2 = R Series Device
 *              3 = A Series Device
 *              4 = W Series Device
 */
device.__defineGetter__("type", function () {
    // 0
    if (window.screen.height === 720 && window.screen.width === 720) {
        if (this.hasOledScreen) {
            return DEVICE_TYPE.N_SERIES;
        } else {
            return DEVICE_TYPE.R_SERIES;
        }
    } else if ((window.screen.height === 1280 && window.screen.width === 768) || (window.screen.height === 768 && window.screen.width === 1280)) {
        return DEVICE_TYPE.L_SERIES;
    } else if ((window.screen.height === 1280 && window.screen.width === 720) || (window.screen.height === 720 && window.screen.width === 1280)) {
        return DEVICE_TYPE.A_SERIES;
    } else if (window.screen.height === 1440 && window.screen.width === 1440) {
        return DEVICE_TYPE.W_SERIES;
    }
});

/**
 * @name device#keyboardOffset
 * @description Returns the distance in pixels from the bottom of the screen to the keyboard
 *              W Series Device = 72
 *              otherwise       = undefined
 */
device.__defineGetter__("keyboardOffset", function () {
    if (device.type === DEVICE_TYPE.W_SERIES) {
        return "72";
    }
    return undefined;
});

/**
 * @name device#keyboardHeight
 * @description Returns height of the keyboard in pixels
 *              W Series Device = 480
 *              otherwise       = undefined
 */
device.__defineGetter__("keyboardHeight", function () {
    if (device.type === DEVICE_TYPE.W_SERIES) {
        return "480";
    }
    return undefined;
});

/**
 * @name device#TYPE
 * @description Returns the DEVICE_TYPE object with a constant assigned for each type
 *              DEVICE_TYPE.L_SERIES = 0, DEVICE_TYPE.N_SERIES = 1,
 *              DEVICE_TYPE.R_SERIES = 2, DEVICE_TYPE.A_SERIES = 3,
 *              DEVICE_TYPE.W_SERIES = 4
 */
device.DEVICE_TYPE = DEVICE_TYPE;

module.exports = device;

});

define('core/plugins/toast/view',['require','exports','module'],function (require, exports, module) {
/*
 * Copyright 2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var FRENCH_TOAST_TIMEOUT = 2500,
    NORMAL_TOAST_TIMEOUT = 1500,
    self,
    _isController = qnx.callExtensionMethod("webview.isVisible", 1) === undefined ? false : true,
    _guid = 10000;

function showToast(toast) {
    toast.setAttribute('class', 'toast_base');
    if (_isController) {
        wp.core.events.emit('toast.show');
    }
}

function destroyToast(toast) {
    toast.removeEventListener('webkitTransitionEnd', function () {
        destroyToast(toast);
    }, false);

    if (toast.parentNode !== null) {
        toast.parentNode.removeChild(toast);
    }

    if (_isController) {
        wp.core.events.emit('toast.destroyed');
    } else {
        wp.view.rpc.postMessage('toast.destroyed');
    }
}

function dismissToast(toast, options) {
    var data = {
        toastId: parseInt(toast.id, 10)
    };

    if (options && typeof options.dismissCallback === 'function') {
        options.dismissCallback();
    }

    wp.view.rpc.postMessage('toast.dismissed', data);
    toast.addEventListener('webkitTransitionEnd', function () {
        destroyToast(toast);
    }, false);

    toast.setAttribute('class', 'toast_base toast_dismiss');

    if (_isController) {
        wp.core.events.emit('toast.dismissed');
    }
}

function createBasicToast(toastId, msg, options) {
    var toast = document.createElement('div'),
        message,
        messageContainer,
        timeoutVal,
        data = {
            toastId: toastId
        };

    // Set a new default if we got one passed in
    timeoutVal = options.timeout ? options.timeout : NORMAL_TOAST_TIMEOUT;

    toast.id = toastId;
    toast.setAttribute('class', 'dark toast_base toast_hidden');
    messageContainer = document.createElement('div');
    messageContainer.setAttribute('class', 'toast_message');
    message = document.createElement('p');
    message.innerText = options.translate ? wp.i18n.translate(msg).fetch() : msg;
    messageContainer.appendChild(message);
    toast.appendChild(messageContainer);
    toast.addEventListener('click', function (e) {
        e.stopPropagation();
        // We got clicked, so lets trigger our callback
        wp.view.rpc.postMessage('toast.callback', data);

        dismissToast(toast, options);
    });

    document.getElementsByClassName(self.location[options.location] ? self.location[options.location] : 'toast-middle')[0].appendChild(toast);

    // Show the toast
    setTimeout(function () {
        showToast(toast);
    }, 0);

    // Dismiss the toast after timeout
    setTimeout(function () {
        dismissToast(toast, options);
    }, timeoutVal);

    return toast;
}

function createFrenchToast(toastId, msg, options) {
    var toast = document.createElement('div'),
        button = document.createElement('p'),
        buttonContainer = document.createElement('div'),
        pipe = document.createElement('div'),
        pipeContainer = document.createElement('div'),
        buttonText = options.buttonText,
        buttonClickListener,
        toastClickListener,
        toastTimerId = 0,
        message,
        messageContainer,
        timeoutVal,
        data = {
            toastId: toastId
        };

    timeoutVal = options.timeout ? options.timeout : FRENCH_TOAST_TIMEOUT;

    toast.id = toastId;
    toast.setAttribute('class', 'toast_base toast_hidden');

    buttonContainer.setAttribute('class', 'toast_button');
    button.innerText = options.translate ? wp.i18n.translate(buttonText).fetch() : buttonText;
    buttonClickListener = function (e) {
        clearTimeout(toastTimerId);

        if (options && typeof options.buttonCallback === 'function') {
            options.buttonCallback();
        }

        // We got clicked, so lets trigger our callback
        wp.view.rpc.postMessage('toast.callback', data);

        // Stop event propogation so we don't cause a focus loss
        // on the current element. Call dismissToast manually.
        e.stopPropagation();
        dismissToast(toast);
    };

    button.addEventListener('click', buttonClickListener, false);

    messageContainer = document.createElement('div');
    messageContainer.setAttribute('class', 'toast_message border_end');
    message = document.createElement('p');
    message.innerText = options.translate ? wp.i18n.translate(msg).fetch() : msg;
    messageContainer.appendChild(message);
    toast.appendChild(messageContainer);

    pipeContainer.setAttribute('class', 'toast_pipe_container');
    pipe.setAttribute('class', 'toast_pipe');
    pipeContainer.appendChild(pipe);
    toast.appendChild(pipeContainer);

    toastClickListener = function (e) {
        e.stopPropagation();
        dismissToast(toast);
    };

    toast.addEventListener('click', toastClickListener, false);
    buttonContainer.appendChild(button);
    toast.appendChild(buttonContainer);

    // Dismiss the toast after timeout
    toastTimerId = setTimeout(dismissToast.bind(this, toast, options), timeoutVal);

    if (_isController) {
        wp.core.events.on("toast.cancelTimeout." + toast.id, function () {
            clearTimeout(toastTimerId);
        });
        wp.core.events.on("toast.resetTimeout." + toast.id, function () {
            clearTimeout(toastTimerId);
            toastTimerId = setTimeout(dismissToast.bind(this, toast, options), timeoutVal);
        });
    }

    document.getElementsByClassName(self.location[options.location] ? self.location[options.location] : 'toast-middle')[0].appendChild(toast);

    // Show the toast
    setTimeout(function () {
        showToast(toast);
    }, 0);
    return toast;
}

self = {
    location: {
        TOP : 'toast-top',
        MIDDLE : 'toast-middle',
        BOTTOM : 'toast-bottom'
    },

    show: function (message, options) {
        options = options || {};
        var toastId = options.toastId || _guid++,
            toast;

        if (!message) {
            return;
        }
        if (!options.buttonText) {
            toast = createBasicToast(toastId, message, options);
        } else {
            toast = createFrenchToast(toastId, message, options);
        }
        return toast;
    },

    hide: function (toastId) {
        var toastParent = document.getElementById('toast'),
            children,
            i;

        if (!toastId) {
            return;
        }

        toastId = toastId.toString();
        if (!toastParent.hasChildNodes()) {
            return;
        } else {
            children = toastParent.childNodes;
            for (i = 0; i < children.length; i++) {
                if (children[i].id === toastId) {
                    dismissToast(children[i]);
                    break;
                }
            }
        }
    },

    cancelToastTimeout: function (toast) {
        if (!toast) {
            return;
        }

        if (_isController) {
            wp.core.events.emit("toast.cancelTimeout." + toast.toastId, [], true);
        }
    },

    resetToastTimeout: function (toast) {
        if (!toast) {
            return;
        }

        if (_isController) {
            event.emit("toast.resetTimeout." + toast.toastId, [], true);
        }
    }
};

document.addEventListener('DOMContentLoaded', function () {
    wp.view.rpc.on('toast.show', function (args) {
        var message = args.message,
            options = args.options;
        options.toastId = args.toastId;
        self.show(message, options);
    });
    wp.view.rpc.on('toast.hide', self.hide);
});

module.exports = self;
});

define('core/plugins/titlebarwithactions/view',['require','exports','module'],function (require, exports, module) {
/*
 *  Copyright 2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var _titleBarHeight = {
        lSeries : {
            portrait: '111',
            landscape: '101'
        },
        nSeries : '93'
    },
    titleBar;

titleBar = {
    create: function (title, leftButtonSpec, rightButtonSpec) {
        var titlebarDiv = document.createElement('div'),
            barDiv = document.createElement('div'),
            leftButtonContainer = document.createElement('div'),
            titleContainer = document.createElement('div'),
            rightButtonContainer = document.createElement('div'),
            titlespan = document.createElement('span'),
            leftButton,
            rightButton;

        // Construct DOM objects for title bar
        titlebarDiv.id = 'titlebarwithactions';
        barDiv.id = 'titlebarbuttons';
        barDiv.className = 'bar';
        leftButtonContainer.className = 'buttonContainer left';
        titleContainer.className = 'textContainer';
        rightButtonContainer.className = 'buttonContainer right';

        barDiv.appendChild(leftButtonContainer);
        barDiv.appendChild(titleContainer);
        barDiv.appendChild(rightButtonContainer);
        titlebarDiv.appendChild(barDiv);

        // Left action button
        if (leftButtonSpec) {
            leftButton = document.createElement('button');
            leftButton.textContent = leftButtonSpec.label || '';
            leftButton.className = leftButtonSpec.className || '';
            leftButton.removeEventListener('click', leftButtonSpec.callback, false);
            leftButton.addEventListener('click', leftButtonSpec.callback, false);
            leftButtonContainer.appendChild(leftButton);
        } else {
            leftButtonContainer.style.visibility = 'hidden';
        }

        // Title area
        if (title) {
            titlespan.textContent = title;

            // If we don't have a right button, allow the text to overlow to the right
            if (!rightButtonSpec) {
                titleContainer.style.overflow = 'visible';
            }
        }
        titleContainer.appendChild(titlespan);

        // Right action button
        if (rightButtonSpec) {
            rightButton = document.createElement('button');
            rightButton.textContent =  rightButtonSpec.label || '';
            rightButton.className = rightButtonSpec.className || '';
            rightButton.removeEventListener('click', rightButtonSpec.callback, false);
            rightButton.addEventListener('click', rightButtonSpec.callback, false);
            rightButtonContainer.appendChild(rightButton);
        } else {
            rightButtonContainer.style.visibility = 'hidden';
        }

        if (leftButtonSpec && !rightButtonSpec) {
            titleContainer.className = titleContainer.className + ' left';
        }

        return titlebarDiv;
    }
};

titleBar.__defineGetter__("height", function () {
    var device = window.wp.device;
    if (device.type === device.DEVICE_TYPE.L_SERIES) {
        if (window.orientation === 90 || window.orientation === -90) {
            return _titleBarHeight.lSeries.landscape;
        } else if (window.orientation === 0 || window.orientation === 180) {
            return _titleBarHeight.lSeries.portrait;
        }
    } else if (device.type === device.DEVICE_TYPE.N_SERIES) {
        return _titleBarHeight.nSeries;
    }
});

module.exports = titleBar;
});

define('core/plugins/childwebviewcontrols/view',['require','exports','module','../titlebarwithactions/view'],function (require, exports, module) {
/*
 *  Copyright 2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var container,
    self;

function onClose(e) {
    e.preventDefault();
    self.hide(); // call through self for testability
    window.wp.view.rpc.postMessage('childwebviewcontrols.destroy');
}

function hide() {
    if (container) {
        container.innerHTML = '';
        container.style.left = '';
    }
}

function show() {
    container = document.getElementById('childwebviewcontrols');
    hide();
    container.appendChild(require('../titlebarwithactions/view').create(
        '',
        {
            label: wp.i18n.translate('Close').fetch(),
            className: 'close',
            callback: onClose
        }
    ));
    container.style.left = '0px';
}

function setTitle(title) {
    if (!container) {
        return;
    }
    var titleElement = container.querySelector('.textContainer span');
    if (titleElement) {
        titleElement.textContent = title;
    }
}

self = {
    show: show,
    hide: hide,
    setTitle: setTitle
};

document.addEventListener('DOMContentLoaded', function () {
    wp.view.rpc.on('childwebviewcontrols.show', self.show);
    wp.view.rpc.on('childwebviewcontrols.hide', self.hide);
    wp.view.rpc.on('childwebviewcontrols.setTitle', self.setTitle);
});

module.exports = self;
});

define('core/plugins/dialog/dialogBuilder',['require','exports','module'],function (require, exports, module) {
var dialogBuilder,
    i18n,
    JS_ALERT = 'JavaScriptAlert',
    JS_CONFIRM = 'JavaScriptConfirm',
    JS_PROMPT = 'JavaScriptPrompt',
    INSECURE_LOAD = 'InsecureSubresourceLoadPolicyConfirm',
    MEDIA_ERROR = 'MediaError',
    BEFORE_UNLOAD = 'BeforeUnloadConfirm',
    DATABASE_QUOTA = 'DatabaseQuotaExceeded',
    WEBFILESYSTEM_QUOTA = 'WebFileSystemQuotaExceeded',
    CUSTOM_ASK = 'CustomAsk',
    GEOLOCATION_PERMISSION = 'GeolocationPermission',
    SSL_CERTIFICATE_EXCEPTION = 'SSLCertificateException',
    CAMERA_SELECTION = 'CameraSelection',
    /* common translations */
    JS_ALERT_TITLE_FUNC = function () {
        return i18n.translate('JavaScript Alert');
    },
    JS_CONFIRM_TITLE_FUNC = function () {
        return i18n.translate('JavaScript Confirm');
    },
    JS_PROMPT_TITLE_FUNC = function () {
        return i18n.translate('JavaScript Prompt');
    },
    MEDIA_ERROR_TITLE_FUNC = function () {
        return i18n.translate('Media Error');
    },
    MEDIA_ERROR_UNKNOWN_MESSAGE_FUNC = function () {
        return i18n.translate('Unhandled Alert');
    },
    DATABASE_QUOTA_TITLE_FUNC = function () {
        return i18n.translate('Database Quota Exceeded');
    },
    WEBFILESYSTEM_QUOTA_TITLE_FUNC = function () {
        return i18n.translate('File Space Requested');
    },
    CUSTOM_ASK_TITLE_FUNC = function () {
        return i18n.translate('Custom Dialog');
    },
    CAMERA_SELECTION_TITLE_FUNC = function () {
        return i18n.translate('Camera Selection');
    },
    SSL_CERTIFICATE_EXCEPTION_TITLE_FUNC = function () {
        return i18n.translate('SSL Certificate Exception');
    },
    SSL_CERTIFICATE_EXCEPTION_MESSAGE_FUNC = function (url) {
        return i18n.translate(
        "The certificate for this site can't be trusted. " +
        "Another site may be impersonating the site you are trying to visit. " +
        "If you add an exception, you will continue to the site and not be " +
        "warned next time you view %1$s.", url);
    },
    GEOLOCATION_PERMISSION_TITLE_FUNC = function () {
        return i18n.translate('Location Services Off');
    },
    GEOLOCATION_PERMISSION_MESSAGE_FUNC = function () {
        return i18n.translate("Turn on Location Services in Settings to take advantage of all the features in this app.");
    },
    /* media error messages */
    MEDIA_ERROR_MESSAGE_FUNCS = {
        1: function () {
            return i18n.translate('There was an error decoding this media. The media format may not be supported.');
        },
        2: function () {
            return i18n.translate('There was an error retrieving media metadata information. This media cannot be played.');
        },
        3: function () {
            return i18n.translate('This media is loading very slowly. It may not be possible to play it with the current network connection.');
        },
        4: function () {
            return i18n.translate('This media contains no usable metadata information. It cannot be played.');
        },
        5: function () {
            return i18n.translate('There was an error receiving video data. The server may have stopped sending. Please try to restart the video or check your network connection.');
        },
        6: function () {
            return i18n.translate('There was an error receiving audio data. The server may have stopped sending. Please try to restart the audio track or check your network connection.');
        },
        7: function () {
            return i18n.translate('This media file is of an unsupported type or could not be loaded. It cannot be played.');
        }
    };

function getDatabaseQuotaFunc(evt) {
    return function () {
        if (evt.databaseName !== "") {
            return i18n.translate('Do you want to allow the database “%1$s” in %2$s to use up to %3$s MB of storage space on your device?', evt.databaseName, URI(evt.url).domain(), evt.requestedSize);
        } else {
            return i18n.translate('Do you want to allow the database in %1$s to use up to %2$s MB of storage space on your device?', URI(evt.url).domain(), evt.requestedSize);
        }
    };
}

function getWebFileSystemQuotaFunc(evt) {
    return function () {
        return i18n.translate('Do you want to allow "%1$s" to use %2$s MB of storage space on your device for its file operations?', evt.systemId, evt.requestedSize);
    };
}

function stringFunc(str) {
    return function () {
        return str;
    };
}

function buildAlert(titleFunc, messageFunc, okCallback, options) {
    options = options || {};
    var desc = {
        title: document.createElement('div'),
        message: document.createElement('div'),
        buttons: [],
    },
    titleText = document.createElement('bdi'),
    ok;

    desc.title.appendChild(titleText);
    desc.message.dir = 'auto'; // isolate directionality of message from rest of chrome
    ok = document.createElement('button');
    ok.addEventListener('click', okCallback);
    ok.innerText = i18n.translate('OK');
    desc.buttons.unshift(ok);
    desc.translate = function () {
        titleText.innerText = titleFunc();
        desc.message.innerHTML = messageFunc();
        ok.innerText = options.oklabel ? options.oklabel : i18n.translate(ok.innerText);
    };
    return desc;
}

function buildConfirm(titleFunc, messageFunc, okCallback, cancelCallback, options) {
    options = options || {};
    var desc = buildAlert(titleFunc, messageFunc, okCallback, options),
    prevTranslate = desc.translate,
    cancel = document.createElement('button');
    cancel.addEventListener('click', cancelCallback);
    cancel.innerText = i18n.translate('Cancel');
    desc.buttons.unshift(cancel);
    desc.translate = function () {
        prevTranslate();
        cancel.innerText = options.cancellabel ? options.cancellabel : i18n.translate(cancel.innerText);
    };
    return desc;
}

function buildPrompt(titleFunc, messageFunc, okCallback, cancelCallback, initialValue) {
    var desc = buildConfirm(titleFunc, messageFunc, okCallback, cancelCallback),
    input = document.createElement('input');
    input.setAttribute('type', 'search'); // to get the clear 'x'
    input.addEventListener('keyup', function (evt) {
        if (parseInt(evt.keyCode, 10) === 13) {
            okCallback(evt);
        }
    });
    if (initialValue) {
        input.value = initialValue;
    }
    desc.inputs = [input];
    return desc;
}


function buildDialog(desc, response) {
    var dialog,
        oldTranslate,
        username,
        password,
        eyeball,
        clearInputsOfAutofill,
        updateEyeball,
        form,
        i,
        input,
        descAttr,
        respAttr,
        button,
        radio,
        cameraForm,
        id,
        label,
        container;

    if (!i18n) {
        i18n = {
            translate: function (message, args) {
                return wp.i18n.translate(message).fetch(args);
            }
        };
    }

    switch (desc.dialogType) {
    case JS_ALERT:
        dialog = buildAlert(
            desc.title ? stringFunc(desc.title) : JS_ALERT_TITLE_FUNC,
            desc.htmlmessage ? stringFunc(desc.htmlmessage) : stringFunc(desc.message),
            response({
                waitHandle: desc.waitHandle,
                webviewId : desc.webviewId
            }),
            {
                oklabel: desc.oklabel
            });
        break;
    case JS_CONFIRM:
        dialog = buildConfirm(
            desc.title ? stringFunc(desc.title) : JS_CONFIRM_TITLE_FUNC,
            desc.htmlmessage ? stringFunc(desc.htmlmessage) : stringFunc(desc.message),
            response({
                waitHandle: desc.waitHandle,
                webviewId : desc.webviewId,
                ok: "true",
                oktext: "true"
            }),
            response({
                waitHandle: desc.waitHandle,
                webviewId : desc.webviewId,
                cancel: "true"
            }),
            {
                oklabel: desc.oklabel,
                cancellabel: desc.cancellabel
            });
        break;
    case JS_PROMPT:
        dialog = buildPrompt(
            desc.title ? stringFunc(desc.title) : JS_PROMPT_TITLE_FUNC,
            desc.htmlmessage ? stringFunc(desc.htmlmessage) : stringFunc(desc.message),
            undefined, // Handle the OK button below
            response({
                waitHandle: desc.waitHandle,
                webviewId : desc.webviewId
            }));
        dialog.buttons[1].addEventListener("click", function () {
            response({
                waitHandle: desc.waitHandle,
                webviewId : desc.webviewId,
                oktext: dialog.inputs[0].value,
                username: "okay",
                ok: true
            })();
        });
        break;
    case INSECURE_LOAD:
        dialog = buildConfirm(
            undefined,
            undefined,
            response({
                waitHandle: desc.waitHandle,
                webviewId : desc.webviewId,
                oktext: "true"
            }),
            response({
                waitHandle: desc.waitHandle,
                webviewId : desc.webviewId
            }));
        dialog.translate = function () {
            dialog.title.innerText = i18n.translate('Warning: Insecure Content');
            dialog.message.innerText = i18n.translate('This page contains insecure contents, do you want to load all the insecure contents or not?');
            dialog.buttons[1].innerText = i18n.translate('Yes');
            dialog.buttons[0].innerText = i18n.translate('No');
        };
        break;
    case MEDIA_ERROR:
        dialog = buildAlert(
            MEDIA_ERROR_TITLE_FUNC,
            MEDIA_ERROR_MESSAGE_FUNCS[desc.alertType] || MEDIA_ERROR_UNKNOWN_MESSAGE_FUNC,
            response({
                waitHandle: desc.waitHandle,
                webviewId : desc.webviewId,
                oktext: "true"
            }));
        if (desc.alertType === 3) {
            // slow-loading media gets a cancel button and special OK label
            dialog.buttons.unshift(document.createElement('button'));
            dialog.buttons[0].addEventListener('click', response({waitHandle: desc.waitHandle}));
            oldTranslate = dialog.translate;
            dialog.translate = function () {
                oldTranslate();
                dialog.buttons[0].innerText = i18n.translate('Cancel');
                dialog.buttons[1].innerText = i18n.translate('Wait');
            };
        }
        break;
    case BEFORE_UNLOAD:
        dialog = buildConfirm(
            undefined,
            undefined,
            response({
                waitHandle: desc.waitHandle,
                webviewId : desc.webviewId,
                oktext: "true"
            }),
            response({
                waitHandle: desc.waitHandle
            }));
        dialog.translate = function () {
            dialog.title.innerText = i18n.translate('Confirm Navigation');
            dialog.message.innerText = desc.message + '\n\n' + i18n.translate('Are you sure you want to leave this page?');
            dialog.buttons[1].innerText = i18n.translate('Leave Page');
            dialog.buttons[0].innerText = i18n.translate('Stay on Page');
        };
        break;
    case DATABASE_QUOTA:
        dialog = buildConfirm(
            DATABASE_QUOTA_TITLE_FUNC,
            getDatabaseQuotaFunc(desc),
            response({
                waitHandle: desc.waitHandle,
                webviewId : desc.webviewId,
                oktext: 'true'
            }),
            response({
                waitHandle: desc.waitHandle
            }));
        oldTranslate = dialog.translate;
        dialog.translate = function () {
            oldTranslate();
            dialog.buttons[0].innerText = i18n.translate('Do Not Allow');
            dialog.buttons[1].innerText = i18n.translate('Allow');
        };
        break;
    case WEBFILESYSTEM_QUOTA:
        dialog = buildConfirm(
            WEBFILESYSTEM_QUOTA_TITLE_FUNC,
            getWebFileSystemQuotaFunc(desc),
            response({
                waitHandle: desc.waitHandle,
                webviewId : desc.webviewId,
                oktext: 'true'
            }),
            response({
                waitHandle: desc.waitHandle,
                webviewId : desc.webviewId
            }));
        oldTranslate = dialog.translate;
        dialog.translate = function () {
            oldTranslate();
            dialog.buttons[0].innerText = i18n.translate('Do Not Allow');
            dialog.buttons[1].innerText = i18n.translate('Allow');
        };
        break;
    case CUSTOM_ASK:
        respAttr = [
            "type",
            "id",
            "value",
            "checked",
            "name"
        ],
        descAttr = [
            "type",
            "id",
            "value",
            "checked",
            "name",
            "autocomplete",
            "placeholder",
            "data-blackberry-virtual-keyboard-enter-key"
        ];

        function buildInput(from, to, attr) {
            if (from instanceof HTMLElement) {
                if (from[attr]) {
                    to[attr] = from[attr];
                }
            } else {
                if (from[attr]) {
                    to.setAttribute(attr, from[attr]);
                }
            }
        }
        function getInputResponse() {
            var inputs = [];
            if (dialog.inputs) {
                for (i = 0; i < dialog.inputs.length; i++) {
                    inputs[i] = {};
                    respAttr.forEach(buildInput.bind(this, dialog.inputs[i], inputs[i]));
                }
            }
            return inputs;
        }
        function clickHandler(i) {
            var res = getInputResponse();
            response({
                'buttonIndex': i,
                'dialogType': "CustomAsk",
                'inputs': res
            })();
        }
        dialog = buildAlert(
            desc.title ? stringFunc(desc.title) : CUSTOM_ASK_TITLE_FUNC,
            function () {
                return desc.htmlmessage || desc.message || "";
            });
        // Create input element
        if (desc.inputs) {
            dialog.inputs = [];
            for (i = 0; i < desc.inputs.length; i++) {
                input = document.createElement("input");
                descAttr.forEach(buildInput.bind(this, desc.inputs[i], input));
                dialog.inputs.push(input);
            }
        }
        // Create our own buttons with handlers
        dialog.buttons = [];

        for (i = 0; i < desc.optionalButtons.length; i++) {
            button = document.createElement("button");
            button.innerText = desc.optionalButtons[i];
            button.addEventListener("click", clickHandler.bind(this, i));
            dialog.buttons.push(button);
        }
        // Button labels
        oldTranslate = dialog.translate;
        dialog.translate = function () {
            oldTranslate();
            for (i = 0; i < dialog.buttons.length; i++) {
                dialog.buttons[i].innerText = i18n.translate(dialog.buttons[i].innerText);
            }
        };
        break;
    case GEOLOCATION_PERMISSION:
        dialog = buildConfirm(
            GEOLOCATION_PERMISSION_TITLE_FUNC,
            GEOLOCATION_PERMISSION_MESSAGE_FUNC,
            response({
                waitHandle: desc.waitHandle,
                webviewId : desc.webviewId,
                ok: true
            }),
            response({
                waitHandle: desc.waitHandle
            })
        );
        oldTranslate = dialog.translate;
        dialog.translate = function () {
            oldTranslate();
            dialog.buttons[0].innerText = i18n.translate('Cancel');
            dialog.buttons[1].innerText = i18n.translate('Settings');
        };
        break;
    case SSL_CERTIFICATE_EXCEPTION:
        dialog = buildConfirm(
            SSL_CERTIFICATE_EXCEPTION_TITLE_FUNC,
            SSL_CERTIFICATE_EXCEPTION_MESSAGE_FUNC.bind(this, desc.url),
            response({
                waitHandle: desc.waitHandle,
                webviewId : desc.webviewId,
                ok: true
            }),
            response({
                waitHandle: desc.waitHandle
            })
        );
        oldTranslate = dialog.translate;
        dialog.translate = function () {
            oldTranslate();
            dialog.buttons[0].innerText = i18n.translate('Cancel');
            dialog.buttons[1].innerText = i18n.translate('Add Exception');
        };
        break;
    case CAMERA_SELECTION:
        dialog = buildConfirm(
            CAMERA_SELECTION_TITLE_FUNC,
            stringFunc(''),
            undefined, // Handle the OK button below
            response({
                waitHandle: desc.waitHandle,
                webviewId : desc.webviewId
            })
        );
        dialog.inputs = [];
        // Create radio buttons
        form = document.createElement('form');
        form.id = "CameraSelection";
        for (i = 0; i < desc.cameras.length; i++) {
            id = 'camera_selection_dialog_c' + i;
            radio = document.createElement('input');
            radio.setAttribute('type', 'radio');
            radio.setAttribute('name', 'cameras');
            radio.setAttribute('id', id);
            radio.classList.add("dialog-camera-radio-button");
            radio.value = i;
            if (!i) {
                radio.checked = true;
            }
            label = document.createElement('label');
            label.setAttribute('for', id);
            label.innerText = i18n.translate(desc.cameras[i]);

            container = document.createElement('div');
            container.appendChild(radio);
            container.appendChild(label);
            form.appendChild(container);
        }
        dialog.inputs.push(form);
        dialog.buttons[1].addEventListener("click", function () {
            // Determine active radio button
            cameraForm = document.forms["CameraSelection"];
            for (i = 0; i < cameraForm.length; i++) {
                if (cameraForm[i].checked) {
                    response({
                        waitHandle: desc.waitHandle,
                        webviewId : desc.webviewId,
                        cameraSelectedIndex: cameraForm[i].value,
                        ok: true
                    })();
                }
            }
        });
        break;
    default:
        // Assume all others are handled elsewhere
        break;
    }

    return dialog;
}

dialogBuilder = {
    buildDialog: buildDialog
};

module.exports = dialogBuilder;
});

define('core/plugins/dialog/utils',['require','exports','module'],function (require, exports, module) {
/*
 * Copyright (C) Research In Motion Limited 2012-2013. All rights reserved.
 */

var userEvents = ['mousedown', 'mouseup', 'click', 'touchstart', 'touchmove', 'touchend'],
    startInteractionPreventionEvents = ['mousedown', 'touchstart'],
    PREVENT_INTERACTION_TIMEOUT = 2000, // 2 seconds
    interactionTimeoutId = 0,
    //event = require('../../lib/events'),
    self,
    SCROLL_INTO_VIEW_MARGIN = 50;

function clamp(min, max, value) {
    return Math.max(min, Math.min(max, value));
}

function clampToScreenHeight(value) {
    return clamp(0, screen.height - 1, value);
}

function clampToScreenWidth(value) {
    return clamp(0, screen.width - 1, value);
}

function startPrevention(evt) {
    if (evt.type !== 'mousedown' && !self.getFirstTouchPoint(evt.changedTouches)) {
        return;
    }
    self.stopEvent(evt);
    // First remove the listeners for the events that start preventing user interaction
    startInteractionPreventionEvents.forEach(function (eventType) {
        document.removeEventListener(eventType, startPrevention, true);
    });
    // Block all further events
    userEvents.forEach(function (eventType) {
        document.addEventListener(eventType, self.stopEvent, true);
    });
}

self = {
    stopEvent: function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
    },

    preventUserInteraction: function () {
        if (interactionTimeoutId !== 0) {
            console.log('user interaction is already disabled');
            return;
        }
        console.log("preventing user interaction");
        startInteractionPreventionEvents.forEach(function (eventType) {
            document.addEventListener(eventType, startPrevention, true);
        });
        interactionTimeoutId = setTimeout(function () {
            console.error('prevent user interaction timeout occured');
            self.allowUserInteraction();
        }, PREVENT_INTERACTION_TIMEOUT);
        //event.emit('prevent.userInteraction', [], true);
    },

    allowUserInteraction: function () {
        if (interactionTimeoutId === 0) {
            console.log("user interaction not currently disabled");
            return;
        }
        clearTimeout(interactionTimeoutId);
        interactionTimeoutId = 0;
        console.log("allowing user interaction");

        // It is safe to unregister events that aren't even registered, yay!
        // Unregister any events that may have been registered.
        startInteractionPreventionEvents.forEach(function (eventType) {
            document.removeEventListener(eventType, startPrevention, true);
        });
        userEvents.forEach(function (eventType) {
            document.removeEventListener(eventType, self.stopEvent, true);
        });
    },

    userInteractionPrevented: function () {
        return interactionTimeoutId !== 0;
    },

    transitionWithTimeout: function (element, transition, transitionTimeout, callback) {
        var boundEvent,
            start = (window.performance.webkitNow ? window.performance.webkitNow() : window.performance.now()),
            onEvent = function (timeoutId, evt) {
                if (evt.target === element) {
                    clearTimeout(timeoutId);
                    element.removeEventListener("webkitTransitionEnd", boundEvent, false);
                    if (callback) {
                        callback();
                    }
                }
            },
            timeoutId,
            cancelTransition;
        transition();
        if (callback) {
            // Last resort timer in case all frames of transition are dropped and webKitTransitionEnd event never fires
            timeoutId = setTimeout(function () {
                console.log("transition timed out for <" + element.tagName + " id=\"" + element.id + "\" class=\"" + element.className + "\"/> after " + Math.floor((window.performance.webkitNow ? window.performance.webkitNow() : window.performance.now()) - start) + "ms (original timeout of " + transitionTimeout + "ms)");
                element.removeEventListener("webkitTransitionEnd", boundEvent, false);
                element.addEventListener("webkitTransitionEnd", function complain(evt) {
                    if (evt.target === element) {
                        console.log("webkitTransitionEnd finally came in for <" + element.tagName + " id=\"" + element.id + "\" class=\"" + element.className + "\"/> after " + Math.floor((window.performance.webkitNow ? window.performance.webkitNow() : window.performance.now()) - start) + "ms");
                        element.removeEventListener("webkitTransitionEnd", complain);
                    }
                });
                callback();
            }, transitionTimeout);
            boundEvent = onEvent.bind(this, timeoutId);
            element.addEventListener("webkitTransitionEnd", boundEvent, false);
        }
        cancelTransition = function () {
            clearTimeout(timeoutId);
            element.removeEventListener("webkitTransitionEnd", boundEvent, false);
        };
        return {cancel: cancelTransition};
    },

    redirect: function (elt, evts, callback) {
        // Redirects will not work if the element doesn't get the events
        elt.style.pointerEvents = 'all';
        evts.forEach(function (evt) {
            elt.addEventListener(evt, callback, true);
        });
    },

    clearRedirect: function (elt, evts, callback) {
        elt.style.pointerEvents = '';
        evts.forEach(function (evt) {
            elt.removeEventListener(evt, callback, true);
        });
    },

    scrollIntoViewIfNecessary: function (elt, scroller) {
        var cur = scroller || elt,
            eltRect,
            curRect,
            oldCurScroll;
        cur = cur.parentElement;
        while (cur && cur.scrollHeight <= cur.clientHeight) {
            // according to MDN, scrollHeight === clientHeight except for elements that would scroll
            cur = cur.parentElement;
        }
        if (cur) {
            // cur can* scroll. Is elt scrolled out of view wrt cur?
            eltRect = elt.getBoundingClientRect();
            curRect = cur.getBoundingClientRect();
            oldCurScroll = cur.scrollTop;
            if (eltRect.top < curRect.top) {
                cur.scrollTop += eltRect.top - curRect.top - SCROLL_INTO_VIEW_MARGIN;
            } else if (eltRect.bottom > curRect.bottom) {
                cur.scrollTop += eltRect.bottom - curRect.bottom + SCROLL_INTO_VIEW_MARGIN;
            } else {
                oldCurScroll = undefined;
            }

            // *WebKit will tell us an element's scrollHeight > clientHeight for more than just scrolling elements
            // so ensure that the scroll 'took' (ie, that cur really can scroll), or skip over it
            if (cur.scrollTop === oldCurScroll) {
                self.scrollIntoViewIfNecessary(elt, cur);
            } else {
                self.scrollIntoViewIfNecessary(cur);
            }
        }
    },

    getElementFromTouchPoint: function (touchPoint) {
        if (!touchPoint || touchPoint.clientX === undefined || touchPoint.clientY === undefined) {
            return undefined;
        }
        return document.elementFromPoint(clampToScreenWidth(touchPoint.clientX), clampToScreenHeight(touchPoint.clientY));
    },

    getFirstTouchPoint: function (touchList) {
        if (touchList && touchList.length) {
            for (var i = 0; i < touchList.length; i++) {
                if (touchList[i].identifier === 0) {
                    return touchList[i];
                }
            }
        }
        return undefined;
    },

    screenPointFromEvent: function (evt) {
        var property = evt.hasOwnProperty('changedTouches') ? self.getFirstTouchPoint(evt.changedTouches) : evt;
        if (property && property.hasOwnProperty('screenX') && property.hasOwnProperty('screenY')) {
            return {x: clampToScreenWidth(property.screenX), y: clampToScreenHeight(property.screenY)};
        }
        return undefined;
    },
};

module.exports = self;
});

define('core/plugins/dialog/view',['require','exports','module','./dialogBuilder','./utils'],function (require, exports, module) {
var dialog,
    dialogBuilder = require("./dialogBuilder"),
    uiUtils = require("./utils"),
    DIALOG_HIDE_DURATION = 100,
    showInternal; // forward declaration

function response(resp) {
    return function () {
        wp.view.rpc.postMessage("dialog.response", resp);
    };
}

function hideDialog(desc) {
    var dialoguer = document.getElementById('dialog'),
        panel = document.getElementById('dialog-panel');
    uiUtils.transitionWithTimeout(dialoguer, function () {
        dialoguer.classList.add('dialog-hidden');
        panel.classList.add('dialog-hidden');
    }, DIALOG_HIDE_DURATION + 100, function () {
    });
}

function showInternal(desc) {
    var container = document.createElement('div'),
        content = document.createElement('div'),
        buttons = document.createElement('div'),
        dialoguer,
        panel,
        inputContainer;

    container.classList.add('dialog-content-container');
    content.classList.add('dialog-content');

    desc.title.classList.add('dialog-titlebar');
    desc.title.classList.add('font-size-xl');

    container.appendChild(desc.title);
    container.appendChild(content);

    buttons.classList.add('dialog-buttons');
    if (desc.buttons && desc.buttons.length > 2) {
        buttons.classList.add('wide-buttons');
    }


    content.appendChild(desc.message);

    if (desc.inputs && desc.inputs.length) {
        inputContainer = document.createElement('div');
        inputContainer.classList.add('dialog-input-container');
        desc.inputs.forEach(function (input) {
            input.addEventListener('focus', function () {
                uiUtils.scrollIntoViewIfNecessary(input);
            });
            input.classList.add('dialog-input');
            inputContainer.appendChild(input);
        });
        content.appendChild(inputContainer);
    }

    desc.buttons.forEach(function (button) {
        button.addEventListener('click', function () {
            hideDialog(desc);
        });
        button.classList.add('dialog-button');
        buttons.appendChild(button);
    });

    dialoguer = document.getElementById('dialog');
    panel = document.getElementById('dialog-panel');

    panel.innerHTML = '';
    panel.appendChild(container);
    panel.appendChild(buttons);

    desc.translate();

    uiUtils.transitionWithTimeout(panel, function () {
        dialoguer.classList.remove('dialog-hidden');
        panel.classList.remove('dialog-hidden');
    }, DIALOG_HIDE_DURATION + 100, function () {
        if (desc.inputs) {
            desc.inputs[0].focus();
        }
    });
}

function show(desc) {
    var dialog = dialogBuilder.buildDialog(desc, response);
    if (dialog) {
        showInternal(dialog);
    }
}

dialog = {
    show: show
};

document.addEventListener('DOMContentLoaded', function () {
    wp.view.rpc.on('dialog.show', show);
});

module.exports = dialog;
});

define('core/plugins/default/view',['require','exports','module'],function (require, exports, module) {
/*
 * Copyright 2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var _default = {
    setBodyFont: function (font) {
        if (window.document.body) {
            window.document.body.style.fontSize = font.fontSize + 'px';
            window.document.body.style.fontStyle = font.fontStyle + 'px';
        }
    },
    updateBaseDirection: function () {
        var lang = navigator.language,
            lang_trim = lang.replace(/-.*$/, ''),
            dir = (lang_trim === 'he' || lang_trim === 'ar') ? 'rtl' : 'ltr',
            systemLanguageChangeEvent = new window.CustomEvent("systemLanguageChange");

        if (document.documentElement) {
            document.documentElement.lang = lang;
            document.documentElement.dir = dir;
        }

        window.dispatchEvent(systemLanguageChangeEvent);
    },
};

// Initialize the base direction when the document is loaded
_default.updateBaseDirection();

document.addEventListener('DOMContentLoaded', function () {
    wp.view.rpc.on('default.setBodyFont', _default.setBodyFont);
    wp.view.rpc.on('default.updateBaseDirection', _default.updateBaseDirection);
});

module.exports = _default;
});

define('core/plugins/formcontrol/view',['require','exports','module'],function (require, exports, module) {
/*
 * Copyright (C) Research In Motion Limited 2012. All Rights Reserved.
 */

var _previousButton,
    _nextButton,
    _submitButton,
    _formControlPanel,
    _enabled = false,
    _created = false,
    formcontrol,
    _keyboardPosition,
    _isPortrait;

function applyTranslations() {
    var i18n = wp.i18n;
    _previousButton.innerText = i18n.translate('Previous').fetch();
    _nextButton.innerText = i18n.translate('Next').fetch();
    _submitButton.innerText = i18n.translate('Submit').fetch();
}

function updateVerticalPosition(y) {
    _formControlPanel.style.top = y + 'px';
}

function clearVerticalPosition() {
    if (_created) {
        _formControlPanel.style.top = '';
    }
}

formcontrol = {

    init: function () {
        if (!_created) {
            _created = true;
            _previousButton = document.getElementById('formcontrol_previous');
            _nextButton = document.getElementById('formcontrol_next');
            _submitButton = document.getElementById('formcontrol_submit');
            _formControlPanel = document.getElementById('formcontrolPanel');

            applyTranslations();

            _previousButton.addEventListener('click', function () {
                wp.view.rpc.postMessage('formcontrol.action', 'focusPreviousField');
            });
            _nextButton.addEventListener('click', function () {
                wp.view.rpc.postMessage('formcontrol.action', 'focusNextField');
            });
            _submitButton.addEventListener('click', function () {
                wp.view.rpc.postMessage('formcontrol.action', 'submitForm');
            });
            window.addEventListener('systemLanguageChange', function () {
                applyTranslations();
            });
            window.onorientationchange = function () {
                var options = {};
                options.enable = _enabled;
                options.previousEnabled = !_previousButton.disabled;
                options.nextEnabled = !_nextButton.disabled;
                options.keyboardPosition = _keyboardPosition;
                formcontrol.update(options);
            };
        }
    },

    hide: function () {
        if (_created) {
            if (window.screen.height === 720 && window.screen.width === 720) {
                clearVerticalPosition();
            } else {
                updateVerticalPosition(-100);
            }
            wp.view.rpc.postMessage("formcontrol.hidden");
        }
    },

    enabled : function () {
        return _enabled;
    },

    update : function (options) {
        if (_created) {
            // only enable in portrait mode
            _isPortrait = (window.orientation === 0 || window.orientation === 180);
            _enabled = options.enable;
            if (_enabled && _isPortrait) {
                _previousButton.disabled = !options.previousEnabled;
                _nextButton.disabled = !options.nextEnabled;
                _keyboardPosition = options.keyboardPosition;
                updateVerticalPosition(options.keyboardPosition);
                applyTranslations();
                _formControlPanel.classList.add('show');
                wp.view.rpc.postMessage("formcontrol.sensitivity", 'SensitivityNoFocus');
            } else {
                _formControlPanel.classList.remove('show');
                wp.view.rpc.postMessage("formcontrol.sensitivity", 'SensitivityTest');
            }
        }
    },

    updateVerticalPosition: updateVerticalPosition
};

document.addEventListener('DOMContentLoaded', function () {
    formcontrol.init();
    wp.view.rpc.on('formcontrol.init', formcontrol.init);
    wp.view.rpc.on('formcontrol.hide', formcontrol.hide);
    wp.view.rpc.on('formcontrol.enabled', formcontrol.enabled);
    wp.view.rpc.on('formcontrol.update', formcontrol.update);
    wp.view.rpc.on('formcontrol.updateVerticalPosition', formcontrol.updateVerticalPosition);
});

module.exports = formcontrol;
});

define('core/plugins/contextmenu/view',['require','exports','module','./../../../wp2/lib/utils','../formcontrol/view'],function (require, exports, module) {
/*
 *  Copyright 2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var MAX_NUM_ITEMS_IN_PORTRAIT_PEEK_MODE = 7,
    MAX_NUM_ITEMS_IN_LANDSCAPE_PEEK_MODE = 4,
    MAX_NUM_ITEMS_IN_NSERIES_PEEK_MODE = 5,
    PEEK_MODE_TRANSLATE_X = -121,
    FULL_MENU_TRANSLATE_X = -569,
    MENU_ITEM_HEIGHT = 110,
    TITLE_HEIGHT = (MENU_ITEM_HEIGHT - 1),
    MENU_ITEM_BORDER_OFFSET = 2,
    state = {
        HIDE: 0,
        PEEK: 1,
        VISIBLE: 2,
        DRAGEND: 3
    },
    maxNumItemsInPeekMode = MAX_NUM_ITEMS_IN_PORTRAIT_PEEK_MODE,
    menuCurrentState = state.HIDE,
    touchMoved = false,
    numItems = 0,
    peekModeNumItems = 0,
    dragStartPoint,
    menu,
    menuItemTouchScrolled = false,
    menuItemTouchEndCancelled = false,
    contextMenuContent,
    contextMenuHandle,
    contextMenuPinned,
    contextMenuModal,
    contextMenuHeader,
    pinnedItem,
    headText,
    subheadText,
    currentPeekIndex,
    previousPeekIndex,
    _pinnedItemId,
    elements,
    startX,
    startY,
    utils,
    self,
    dragDelta = 0,
    i18n,
    formcontrol,
    device;

function isMenuScrollable() {
    if (menuCurrentState !== state.VISIBLE) {
        return false;
    }
    return numItems > maxNumItemsInPeekMode;
}

function positionHandle() {
    var moreIcon = document.getElementById('moreHandleIcon'),
        dragBar = document.getElementById('contextMenuDragBar'),
        top,
        bottom;

    if (dragBar === null) {
        dragBar = document.createElement('div');
        dragBar.id = "contextMenuDragBar";
        dragBar.className = "contextMenuDragBar";
    }
    if (window.screen.height === 720) {
        contextMenuHeader.insertBefore(dragBar, contextMenuHeader.firstChild);
    } else {
        contextMenuHandle.appendChild(dragBar);
    }
    contextMenuHandle.classList.add('showContextMenuHandle');

    if (menuCurrentState === state.PEEK) {
        if (window.screen.height === 720) {
            bottom = MENU_ITEM_HEIGHT;
            contextMenuHandle.style.top = '';
            contextMenuHandle.style.bottom = bottom + 'px';
            contextMenuHeader.style.webkitTransform = 'translate3d(0px, 0px, 0px)';
        } else {
            top = (1.5 * window.screen.availHeight + MENU_ITEM_HEIGHT * (peekModeNumItems - 5) / 2) / 2;
            contextMenuHandle.style.bottom = '';
            contextMenuHandle.style.top = top + 'px';
        }

        if (numItems > maxNumItemsInPeekMode) {
            if (window.screen.height === 720) {
                contextMenuContent.style.top = '0px';
                contextMenuContent.style.paddingTop = TITLE_HEIGHT + 'px';
            } else {
                // adding 3 to numItems for header, pinned, and handle
                if (window.screen.availHeight > (numItems + 3) * MENU_ITEM_HEIGHT) {
                    top = (window.screen.availHeight - (numItems) * MENU_ITEM_HEIGHT) / 2;
                    contextMenuContent.style.top = top + 'px';
                } else {
                    contextMenuContent.style.top = TITLE_HEIGHT + 'px';
                }
            }
            contextMenuContent.style.position = 'absolute';
            // If have more options than the limit, show the more dots on the contextMenuHandle
            if (moreIcon === null) {
                moreIcon = document.createElement('div');
                moreIcon.id = "moreHandleIcon";
                moreIcon.style = 'showMoreHandleIcon';
                moreIcon.className = 'showMoreHandleIcon';
                contextMenuHandle.appendChild(moreIcon);
            } else {
                moreIcon.classList.add('showMoreHandleIcon');
            }
        } else {
            top = (window.screen.availHeight - (numItems - 1) * MENU_ITEM_HEIGHT) / 2;
            contextMenuContent.style.top = top + 'px';
            contextMenuContent.style.paddingTop = '';
            if (moreIcon !== null) {
                contextMenuHandle.removeChild(moreIcon);
            }
        }
    } else if (menuCurrentState === state.VISIBLE) {
        if (moreIcon !== null) {
            contextMenuHandle.removeChild(moreIcon);
        }
        // Calculate the top / bottom value when the device screen can show all menu items
        // Adding 3 to numItems for header, pinned, and handle
        if (numItems <= maxNumItemsInPeekMode || window.screen.availHeight > (numItems + 3) * MENU_ITEM_HEIGHT) {
            top = (window.screen.availHeight - (numItems - 1) * MENU_ITEM_HEIGHT) / 2;
            contextMenuContent.style.top = top + 'px';
            if (numItems > maxNumItemsInPeekMode) {
                contextMenuContent.style.top = TITLE_HEIGHT + 'px';
                contextMenuContent.style.paddingTop = top - TITLE_HEIGHT + "px";
            }
            if (window.screen.height === 720) {
                bottom = MENU_ITEM_HEIGHT;
                contextMenuHandle.style.bottom = bottom + 'px';
            } else {
                top = (1.5 * window.screen.availHeight + MENU_ITEM_HEIGHT * (numItems - 5) / 2) / 2;
                contextMenuHandle.style.top = top + 'px';
                contextMenuContent.style.paddingTop = '';
            }
        }
        if (numItems <= maxNumItemsInPeekMode) {
            contextMenuHandle.classList.add('showContextMenuHandle');
            contextMenuHandle.classList.remove('hideContextMenuHandle');
        } else {
            dragBar.parentNode.removeChild(dragBar);
            contextMenuHandle.classList.remove('showContextMenuHandle');
            contextMenuHandle.classList.add('hideContextMenuHandle');
        }
    }
}

function menuDragStart() {
    menu.style.webkitTransitionDuration = '0s';
}

function menuTouchStartHandler(evt) {
    evt.stopPropagation();
    menuDragStart();
    dragStartPoint = evt.touches[0].pageX;
    dragDelta = 0;
}

function bodyTouchStartHandler(evt) {
    dragStartPoint = evt.touches[0].pageX;
    menuDragStart();
}

function menuTouchMoveHandler(evt) {
    var touch = evt.touches[0];
    evt.stopPropagation();
    touchMoved = true;
    dragDelta = touch.pageX - dragStartPoint;
}

function bodyTouchMoveHandler(evt) {
    touchMoved = true;
}

function menuTouchEndHandler(evt) {
    if (menuCurrentState === state.HIDE) {
        return;
    }
    evt.stopPropagation();
    // It is not a valid touch move if dragDelta <= 8
    touchMoved = touchMoved && Math.abs(dragDelta) > 8;
    menu.style.webkitTransform = '';
    if (touchMoved) {
        touchMoved = false;
        menuCurrentState = state.DRAGEND;
        self.show();
    } else {
        if (menuCurrentState === state.PEEK) {
            self.show();
        }
    }
}

function bodyTouchEndHandler(evt) {
    if (touchMoved) {
        touchMoved = false;
        self.hide();
    }
    else {
        self.hide();
    }
}

function getMenuItemAtPosition(x, y, elementHeight) {
    var menuWidth = -FULL_MENU_TRANSLATE_X,
        peekMenuWidth = -PEEK_MODE_TRANSLATE_X,
        index,
        deleteIndex,
        contentPaddingTop = contextMenuContent.style.paddingTop.replace('px', ''),
        placeHolder = document.getElementById('contextMenuPlaceHolder');

    // The 1st item has a 2px border on the top
    // subtract 4px border from the height (2px each on the top and the bottom)

    if (y >= contextMenuContent.offsetTop + contentPaddingTop - contextMenuContent.scrollTop && y < contextMenuContent.offsetTop + contextMenuContent.clientHeight - (MENU_ITEM_BORDER_OFFSET * 2) + contextMenuContent.scrollTop) {
        // y is inside the center group of items, let's check x
        if (window.screen.height === 720) {
            index = (y - contentPaddingTop - contextMenuContent.offsetTop - 2) / elementHeight | 0;
        } else {
            index = (y - contextMenuContent.offsetTop - 2) / elementHeight | 0;
        }
        if (placeHolder !== null && index >= numItems) {
            // If index is out of bound due to placeholder which has the same height as each element
            index--;
        }
        if (menuCurrentState === state.VISIBLE || index === currentPeekIndex) {
            return x < window.screen.width - menuWidth ? -1 : index;
        }
        return x < window.screen.width - peekMenuWidth ? -1: index;
    }

    if (contextMenuPinned.hasChildNodes() && y > contextMenuPinned.offsetTop) {
        // y is inside of the delete icon, check x
        deleteIndex = elements.length - 1;
        if (menuCurrentState === state.VISIBLE || deleteIndex === currentPeekIndex) {
            return x < window.screen.width - menuWidth ? -1 : deleteIndex;
        }
        return x < window.screen.width - peekMenuWidth ? -1 : deleteIndex;
    }
    return -1;
}

function resetContextMenuHighlights() {
    Array.prototype.forEach.call(
        document.getElementsByClassName('fullContextmenuItem'),
        function (node) {
            node.classList.remove('fullContextmenuItem');
            node.classList.remove('showContextmenuItem');
            node.classList.add('contextmenuItem');
        }
    );
}

function highlightMenuItem(item) {
    var previousHighlightedItems,
        i;

    if (!item) {
        return;
    }

    if (menuCurrentState === state.PEEK) {
        item.classList.add('contextmenuItem');
        item.classList.add('showContextmenuItem');
        item.active = true;
    } else if (menuCurrentState === state.VISIBLE) {
        // If we have any other item's that are highlighted, force remove it since we can only have one
        resetContextMenuHighlights();
        item.classList.add('contextmenuItem');
        item.classList.add('fullContextmenuItem');
        item.active = true;
    }
}

function contextMenuContentScroll(evt) {
    resetContextMenuHighlights();
    menuItemTouchScrolled = true;
}

function menuItemFocusHandler(evt) {
    previousPeekIndex = currentPeekIndex = evt.currentTarget.index;
}

function menuItemTouchStartHandler(evt) {
    var x = evt.touches[0].clientX,
        y = evt.touches[0].clientY,
        elementHeight = evt.currentTarget.clientHeight + MENU_ITEM_BORDER_OFFSET;

    evt.stopPropagation();
    startX = evt.touches[0].pageX;
    startY = evt.touches[0].pageY;
    menuItemTouchEndCancelled = false;
    menuItemTouchScrolled = false;
    highlightMenuItem(evt.currentTarget);

    if (menuCurrentState === state.PEEK) {
        previousPeekIndex = currentPeekIndex = getMenuItemAtPosition(x, y, elementHeight);
    } else {
        previousPeekIndex = currentPeekIndex = evt.currentTarget.index;
    }
}

function deactivateMenuitem(item) {
    if (item && item.active) {
        item.classList.remove('fullContextmenuItem');
        item.classList.remove('showContextmenuItem');
        item.classList.add('contextmenuItem');
        item.active = false;
    }
}
function menuItemTouchMoveHandler(evt) {
    var x = evt.touches[0].clientX,
        y = evt.touches[0].clientY,
        elementHeight = evt.currentTarget.clientHeight + 2; // border = 2

    evt.stopPropagation();

    // when touch actually moves and items overflow
    if (menuCurrentState === state.VISIBLE && isMenuScrollable() && (x !== startX || y !== startY)) {
        menuItemTouchEndCancelled = true;
    }

    y = isMenuScrollable() ? y + contextMenuContent.scrollTop : y; // update y if the menu is scrollable
    currentPeekIndex = getMenuItemAtPosition(x, y, elementHeight);
    if (currentPeekIndex === previousPeekIndex) {
        return;
    }
    if (currentPeekIndex === -1) {
        deactivateMenuitem(elements[previousPeekIndex]);
    } else if (previousPeekIndex === -1) {
        highlightMenuItem(elements[currentPeekIndex]);
    } else {
        deactivateMenuitem(elements[previousPeekIndex]);
        highlightMenuItem(elements[currentPeekIndex]);
    }
    previousPeekIndex = currentPeekIndex;
}

function menuItemKeyPressHandler(evt) {
    if (evt.charCode !== 13) {
        return;
    }
    menuItemTouchEndHandler(evt);
}

function menuItemTouchEndHandler(evt) {
    var elements,
        i;

    evt.stopPropagation();
    if (currentPeekIndex !== -1 && currentPeekIndex !== undefined) {
        // Clear all the highlighted elements since the highlight can get stuck when scrolling a list when we
        // are using overflow-y scroll
        elements = document.getElementsByClassName('contextmenuItem');

        for (i = 0; i < elements.length; i += 1) {
            elements[i].classList.add('contextmenuItem');
            elements[i].active = false;
        }
        if (!menuItemTouchEndCancelled && !menuItemTouchScrolled) {
            if (elements[currentPeekIndex]) {
                window.wp.view.rpc.postMessage('contextmenu.executeMenuAction', elements[currentPeekIndex].attributes.actionId.value);
            }
            self.hide();
        }
    }
}

function rotationHandler() {
    if (window.orientation === 0 || window.orientation === 180) {
        maxNumItemsInPeekMode = MAX_NUM_ITEMS_IN_PORTRAIT_PEEK_MODE;
    } else {
        maxNumItemsInPeekMode = MAX_NUM_ITEMS_IN_LANDSCAPE_PEEK_MODE;
    }

    if (menuCurrentState === state.PEEK) {
        // Force re-draw
        self.peek(true);
    } else if (menuCurrentState === state.VISIBLE) {
        self.show(true);
    }
}

function mouseDownHandler(evt) {
    evt.preventDefault();
    evt.stopPropagation();
}

function contextMenuHandler(evt) {
    evt.preventDefault();
    evt.stopPropagation();
}

function clearHeadClasses(item) {
    item.classList.remove('singleHeadText');
    item.classList.remove('headText');
    item.classList.remove('noHeadText');
}

function setHeadText(text) {
    var headTextElement = document.getElementById('contextMenuHeadText');

    clearHeadClasses(headTextElement);
    if (text) {
        // 'Selection' needs to be inside the translate function
        headTextElement.textContent = (text === 'Selection') ? i18n.translate('Selection').fetch() : i18n.translate(text).fetch();
        if (!subheadText || subheadText === '') {
            headTextElement.classList.add('singleHeadText');
        } else {
            headTextElement.classList.add('headText');
        }
    } else {
        headTextElement.classList.add('noHeadText');
    }
}

function setSubheadText(text) {
    var subheadTextElement = document.getElementById('contextMenuSubheadText');

    subheadTextElement.textContent = text;

    clearHeadClasses(subheadTextElement);
    if (text) {
        if (document.documentElement.dir !== null && document.documentElement.dir === 'rtl') {
            if (utils.parseURI(text)["host"] !== "") {
                // apply the textAlign instead or right to left direction if it's url
                subheadTextElement.style.direction = 'ltr';
                subheadTextElement.style.textAlign = 'right';
            }
        } else {
            // reset the style when system language is changed from 'rtl' to 'ltr' while app is on
            // or head tag has the attribute dir set to 'ltr' or doesn't have the attribute
            subheadTextElement.style.direction = '';
            subheadTextElement.style.textAlign = '';
        }
        if (!headText || headText === '') {
            subheadTextElement.classList.add('singleHeadText');
        } else {
            subheadTextElement.classList.add('subheadText');
        }
    } else {
        subheadTextElement.classList.add('noHeadText');
    }
}

function resetHeader() {
    // Always hide the header div whenever we are peeking
    if (headText || subheadText) {
        contextMenuHeader.className = '';
        if (headText) {
            setHeadText('');
        }
        if (subheadText) {
            setSubheadText('');
        }
    }
}

function hideWebView() {
    if (menu.classList.contains('hideMenu')) {
        window.wp.view.rpc.postMessage('webview.notifyContextMenuCancelled');
        menu.removeEventListener('webkitTransitionEnd', hideWebView);
    }
}

function resetMenuContent() {
    var contextMenuPlaceHolder = document.getElementById('contextMenuPlaceHolder');
    if (window.screen.height === 720 && window.screen.height === 720 && contextMenuPlaceHolder !== null) {
        contextMenuContent.removeChild(contextMenuPlaceHolder);
        contextMenuContent.lastChild.style.borderTop = '';
    }
    contextMenuContent.style.position = '';
    contextMenuContent.style.top = '';
    contextMenuContent.style.height = '';
    contextMenuContent.style.overflowY = '';
    contextMenuContent.className = '';
    contextMenuContent.style.bottom = '';
    contextMenuContent.style.paddingTop = '';
}

function init() {
    // detect the device
    if (wp.device) {
        device = wp.device;
    }
    if (device.type === device.DEVICE_TYPE.N_SERIES || device.type === device.DEVICE_TYPE.R_SERIES) {
        maxNumItemsInPeekMode = MAX_NUM_ITEMS_IN_NSERIES_PEEK_MODE;
        MENU_ITEM_HEIGHT = 93;
        FULL_MENU_TRANSLATE_X = -540;
        TITLE_HEIGHT = MENU_ITEM_HEIGHT - 2; // -2 for the border
    } else if (device.type === device.DEVICE_TYPE.A_SERIES) {
        MENU_ITEM_HEIGHT = 93;
        FULL_MENU_TRANSLATE_X = -528;
        MAX_NUM_ITEMS_IN_LANDSCAPE_PEEK_MODE = MAX_NUM_ITEMS_IN_NSERIES_PEEK_MODE;
        TITLE_HEIGHT = MENU_ITEM_HEIGHT - 2; // -2 for the border
        rotationHandler();
        window.addEventListener('orientationchange', rotationHandler, false);
    } else if (device.type === device.DEVICE_TYPE.W_SERIES) {
        MAX_NUM_ITEMS_IN_LANDSCAPE_PEEK_MODE = MAX_NUM_ITEMS_IN_PORTRAIT_PEEK_MODE;
        rotationHandler();
        window.addEventListener('orientationchange', rotationHandler, false);
    } else {
        // L series
        rotationHandler();
        window.addEventListener('orientationchange', rotationHandler, false);
    }
    menu = document.getElementById('contextMenu');
    menu.addEventListener('webkitTransitionEnd', self.transitionEnd.bind(self));
    menu.addEventListener('touchstart', menuTouchStartHandler);
    menu.addEventListener('touchmove', menuTouchMoveHandler);
    menu.addEventListener('touchend', menuTouchEndHandler);
    menu.addEventListener('contextmenu', contextMenuHandler);
    contextMenuContent = document.getElementById('contextMenuContent');
    contextMenuPinned = document.getElementById('contextMenuDelete');
    contextMenuHandle = document.getElementById('contextMenuHandle');
    contextMenuModal = document.getElementById('contextMenuModal');
    contextMenuHeader = document.getElementById('contextMenuHeader');
    setHeadText('');
    setSubheadText('');
    i18n = wp.i18n;
    utils = require('./../../../wp2/lib/utils');
    formcontrol = require('../formcontrol/view');
}

function buildMenuItem(options, index) {
    var menuItem,
        textItem,
        iconItem,
        imageUrl = options.icon,
        spriteImageUrl = 'platform:///ui/assets/contextmenu.png',
        label = options.label ? i18n.translate(options.label).fetch() : '';

    menuItem = document.createElement('div');
    textItem = document.createElement('div');
    iconItem = document.createElement('div');

    if (device.type === device.DEVICE_TYPE.L_SERIES) {
        textItem.style.paddingLeft = "120px";
        iconItem.classList.add("icon-lseries");
    } else if (device.type === device.DEVICE_TYPE.A_SERIES) {
        textItem.style.paddingLeft = "101px";
        iconItem.classList.add("icon-aseries");
    } else if (device.type === device.DEVICE_TYPE.W_SERIES) {
        textItem.style.paddingLeft = "101px";
        iconItem.classList.add("icon-wseries");
    } else {
        // n, r
        textItem.style.paddingLeft = "101px";
        iconItem.classList.add("icon-nseries");
    }

    menuItem.setAttribute("class", "contextmenuItem");
    textItem.appendChild(document.createTextNode(label));

    if (options.actionId === 'menuService') {
        menuItem.style.backgroundImage = "url(" + imageUrl + ")";
    } else if (imageUrl && imageUrl !== spriteImageUrl) {
        iconItem.style.backgroundImage = "url(" + imageUrl + ")";
        iconItem.classList.add("icon-UserDefined");
    } else {
        iconItem.style.backgroundImage = "url(" + spriteImageUrl + ")";
        iconItem.classList.add("icon-" + (imageUrl ? options.actionId : "Generic"));
    }

    menuItem.appendChild(iconItem);
    menuItem.appendChild(textItem);

    menuItem.setAttribute("actionId", options.actionId);
    menuItem.classList.add("menuitem-" + index);
    menuItem.setAttribute("tabindex", index);
    menuItem.index = index;
    menuItem.active = false;
    menuItem.addEventListener('mousedown', self.mouseDownHandler);
    menuItem.addEventListener('keypress', menuItemKeyPressHandler);
    menuItem.addEventListener('focus', menuItemFocusHandler);
    menuItem.addEventListener('touchstart', menuItemTouchStartHandler);
    menuItem.addEventListener('touchmove', menuItemTouchMoveHandler);
    menuItem.addEventListener('touchend', menuItemTouchEndHandler);

    return menuItem;
}

self = {
    init: init,
    mouseDownHandler: mouseDownHandler,
    build: function (menuItems, header, pinnedId) {
        var menuItem,
            pinnedMenuItem,
            alreadyPinned = false,
            i,
            index;

        if (header) {
            if (header.headText) {
                headText = header.headText;
            }
            if (header.subheadText) {
                subheadText = header.subheadText;
            }
        }

        for (i = 0; i < menuItems.length; i++) {
            if ((pinnedId && pinnedId === menuItems[i].actionId) || (!alreadyPinned && menuItems[i].isPinned)) {

                alreadyPinned = true;
                if (pinnedId) {
                    index = menuItems.length - 2; //Include cancel
                } else {
                    index = menuItems.length - 1;
                }

                _pinnedItemId = pinnedId || menuItems[i].actionId;

                if (contextMenuPinned.firstChild) {
                    contextMenuPinned.removeChild(contextMenuPinned.firstChild);
                }

                menuItem = buildMenuItem(menuItems[i], index);
                pinnedMenuItem = buildMenuItem(menuItems[i], index);
                pinnedMenuItem.classList.add('hideContextMenuItem');
                contextMenuPinned.appendChild(menuItem);
            } else {
                if (alreadyPinned) {
                    //Since we have already pinned let's update the index since it goes at the bottom
                    index = i - 1;
                } else {
                    index = i;
                }

                if (alreadyPinned && menuItems[i].isPinned) {
                    continue;
                }

                menuItem = buildMenuItem(menuItems[i], index);
                if (numItems >= maxNumItemsInPeekMode) {
                    menuItem.setAttribute('class', 'hideContextMenuItem');
                }
                contextMenuContent.appendChild(menuItem);
                numItems++;
            }

        }

        if (pinnedMenuItem) {
            contextMenuContent.appendChild(pinnedMenuItem);
            menuItem.classList.add('lastMenuitem');
            pinnedMenuItem.focus();
            numItems++;
        } else if (menuItem) {
            menuItem.classList.add('lastMenuitem');
            menuItem.focus();
        }

    },

    show: function (forceRedraw) {
        var i,
            items,
            contextMenuPlaceHolder,
            moreIcon,
            lastItem;

        pinnedItem = contextMenuPinned.firstChild.firstChild;

        if (menuCurrentState === state.VISIBLE && !forceRedraw) {
            return;
        }

        moreIcon = document.getElementById('moreHandleIcon');
        if (moreIcon !== null) {
            moreIcon.className = '';
        }

        menu.style.webkitTransitionDuration = '0.3s';
        menu.classList.add('showContextMenu');
        contextMenuContent.classList.add('contentShown');
        contextMenuHandle.classList.add('showContextMenuHandle');

        if (headText || subheadText) {
            contextMenuHeader.classList.add('showMenuHeader');

            if (headText) {
                setHeadText(headText);
            }
            if (subheadText) {
                setSubheadText(subheadText);
            }
        }

        items = contextMenuContent.childNodes;

        // Move content so that menu items won't be covered by header
        if (numItems > maxNumItemsInPeekMode) {
            if (screen.height === 720) {
                contextMenuContent.style.top = '0px';
                contextMenuContent.style.paddingTop = TITLE_HEIGHT + 'px';
            } else {
                contextMenuContent.style.paddingTop = '';
                contextMenuContent.style.top = TITLE_HEIGHT + 'px';
            }
            contextMenuContent.style.bottom = 0 + 'px';
            contextMenuContent.style.overflowY = 'scroll';
        } else {
            if (forceRedraw) {
                for (i = 0; i < items.length; i++) {
                    if (items[i] && items[i].firstChild.classList.contains(pinnedItem.className)) {
                        items[i].classList.add('hideContextMenuItem');
                    }
                }
                contextMenuContent.style.bottom = '';/*added*/
                contextMenuContent.style.overflowY = '';
                contextMenuPinned.classList.remove('hideContextMenuItem');
            }
        }

        if (items.length > maxNumItemsInPeekMode) {
            for (i = maxNumItemsInPeekMode; i < items.length; i += 1) {
                if (items[i].id !== 'contextMenuPlaceHolder') {
                    items[i].classList.add('contextmenuItem');
                }
            }
            contextMenuPinned.style.webkitTransitionDuration = '0.25s';
            lastItem = contextMenuContent.lastElementChild;
            if (screen.height === 720 && screen.width === 720) {
                if (numItems > maxNumItemsInPeekMode) {
                    lastItem.style.visibility = "hidden";
                    contextMenuContent.style.webkitOverflowScrolling = '-blackberry-touch';
                } else {
                    contextMenuPinned.classList.add('hideContextMenuPinned');
                }
            } else {
                lastItem.style.visibility = "hidden";
                contextMenuContent.style.webkitOverflowScrolling = '-blackberry-touch';
            }
        }

        contextMenuContent.addEventListener('scroll', contextMenuContentScroll);
        menuCurrentState = state.VISIBLE;
        positionHandle();
    },

    visible: function () {
        return menuCurrentState === state.PEEK || menuCurrentState === state.VISIBLE;
    },

    hide: function (evt) {
        if (menuCurrentState === state.HIDE) {
            return;
        }

        contextMenuContent.scrollTop = 0;

        numItems = 0;
        menu.style.webkitTransitionDuration = '0.3s';
        menu.addEventListener('webkitTransitionEnd', hideWebView);
        menu.classList.add('hideMenu');
        menu.classList.remove('showContextMenu');
        menu.classList.remove('peekContextMenu');
        menu.removeEventListener('touchstart', menuTouchStartHandler, false);
        menu.removeEventListener('touchmove', menuTouchMoveHandler, false);
        menu.removeEventListener('touchend', menuTouchEndHandler, false);

        window.document.body.removeEventListener('touchstart', bodyTouchStartHandler, false);
        window.document.body.removeEventListener('touchmove', bodyTouchMoveHandler, false);
        window.document.body.removeEventListener('touchend', bodyTouchEndHandler, false);

        contextMenuContent.removeEventListener('scroll', contextMenuContentScroll);

        while (contextMenuContent.firstChild) {
            contextMenuContent.removeChild(contextMenuContent.firstChild);
        }

        resetHeader();
        headText = '';
        subheadText = '';
        resetMenuContent();

        if (evt) {
            evt.preventDefault();
            evt.stopPropagation();
        }
        menuCurrentState = state.HIDE;
        contextMenuContent.style.paddingTop = '0px';

        while (contextMenuHandle.firstChild) {
            contextMenuHandle.removeChild(contextMenuHandle.firstChild);
        }
        // Reset sensitivity
        window.wp.view.rpc.postMessage('contextmenu.sensitivity', 'SensitivityTest');
        contextMenuModal.style.display = 'none';
    },

    setHeadText: setHeadText,

    setSubheadText: setSubheadText,

    peek: function (forceRedraw) {
        var i,
            items;

        pinnedItem = contextMenuPinned.firstChild.firstChild;

        if (menuCurrentState === state.PEEK && !forceRedraw) {
            return;
        }

        // Resolves the unexpected rendering delay caused by webkitOverflowScrolling property
        contextMenuContent.style.webkitOverflowScrolling = '';
        menu.style.webkitOverflowScrolling = '';

        peekModeNumItems = numItems > maxNumItemsInPeekMode ? maxNumItemsInPeekMode : numItems;
        elements = document.getElementsByClassName("contextmenuItem");

        // Cache items for single item peek mode.
        window.wp.view.rpc.postMessage("contextmenu.sensitivity", "SensitivityNoFocus");
        contextMenuModal.style.display = '';

        menu.style.webkitTransitionDuration = '0.3s';
        menu.classList.add('peekContextMenu');
        contextMenuHandle.classList.add('showContextMenuHandle');

        if ((menuCurrentState === state.DRAGEND || menuCurrentState === state.VISIBLE || forceRedraw)) {
            items = contextMenuContent.childNodes;

            for (i = 0; i < items.length; i++) {
                if (items[i]) {
                    items[i].classList.add('contextmenuItem');
                }
                if (items[i].getAttribute('actionId') === _pinnedItemId) {
                    items[i].classList.add('hideContextMenuItem');
                }
                if (i >= peekModeNumItems) {
                    items[i].classList.add('hideContextMenuItem');
                }
            }
        }

        contextMenuPinned.style.webkitTransitionDuration = '0s';
        contextMenuPinned.classList.remove('hideContextMenuItem');

        // Reset the scroll height no matter what when going into peek mode
        contextMenuContent.style.paddingTop = '0px';
        menu.scrollTop = 0;

        resetHeader();
        resetMenuContent();

        // This is for single item peek mode
        menu.style.overflowX = 'visible';
        menu.style.overflowY = 'visible';

        window.document.body.addEventListener('touchstart', bodyTouchStartHandler);
        window.document.body.addEventListener('touchmove', bodyTouchMoveHandler);
        window.document.body.addEventListener('touchend', bodyTouchEndHandler);

        menuCurrentState = state.PEEK;
        positionHandle();

        // hide the formcontrol when the contextmenu is active
        formcontrol.hide();
    },

    transitionEnd: function () {
        if (menuCurrentState === state.HIDE) {
            self.setHeadText('');
            self.setSubheadText('');
            headText = '';
            subheadText = '';
        }
    },

    activate: function (args) {
        self.init();
        self.build(args.menuItems, args.header, args.pinnedItemId);
        self.peek(true);
    }
};

document.addEventListener('DOMContentLoaded', function () {
    wp.view.rpc.on('contextmenu.show', self.show);
    wp.view.rpc.on('contextmenu.hide', self.hide);
    wp.view.rpc.on('contextmenu.peek', self.peek);
    wp.view.rpc.on('contextmenu.build', self.build);
    wp.view.rpc.on('contextmenu.visible', self.visible);
    wp.view.rpc.on('contextmenu.activate', self.activate);
    wp.view.rpc.on('contextmenu.transitionEnd', self.transitionEnd);
    wp.view.rpc.on('contextmenu.setHeadText', self.setHeadText);
    wp.view.rpc.on('contextmenu.setSubheadText', self.setSubheadText);
});

module.exports = self;
});

define('dependencies/URI.js/src/URI',['require','exports','module'],function (require, exports, module) {
/*!
 * URI.js - Mutating URLs
 *
 * Version: 1.6.1
 *
 * Author: Rodney Rehm
 * Web: http://medialize.github.com/URI.js/
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *   GPL v3 http://opensource.org/licenses/GPL-3.0
 *
 */

(function(undefined) {

var _use_module = typeof module !== "undefined" && module.exports,
    _load_module = function(module) {
        return _use_module ? require('./' + module) : window[module];
    },
    punycode = _load_module('punycode'),
    IPv6 = _load_module('IPv6'),
    SLD = _load_module('SecondLevelDomains'),
    URI = function(url, base) {
        // Allow instantiation without the 'new' keyword
        if (!(this instanceof URI)) {
            return new URI(url);
        }

        if (url === undefined) {
            url = location.href + "";
        }

        this.href(url);

        // resolve to base according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#constructor
        if (base !== undefined) {
            return this.absoluteTo(base);
        }

        return this;
    },
    p = URI.prototype;

function escapeRegEx(string) {
    // https://github.com/medialize/URI.js/commit/85ac21783c11f8ccab06106dba9735a31a86924d#commitcomment-821963
    return string.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}

function isArray(obj) {
    return String(Object.prototype.toString.call(obj)) === "[object Array]";
}

function filterArrayValues(data, value) {
    var lookup = {},
        i, length;

    if (isArray(value)) {
        for (i = 0, length = value.length; i < length; i++) {
            lookup[value[i]] = true;
        }
    } else {
        lookup[value] = true;
    }

    for (i = 0, length = data.length; i < length; i++) {
        if (lookup[data[i]] !== undefined) {
            data.splice(i, 1);
            length--;
            i--;
        }
    }

    return data;
}

// static properties
URI.idn_expression = /[^a-z0-9\.-]/i;
URI.punycode_expression = /(xn--)/i;
// well, 333.444.555.666 matches, but it sure ain't no IPv4 - do we care?
URI.ip4_expression = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
// credits to Rich Brown
// source: http://forums.intermapper.com/viewtopic.php?p=1096#1096
// specification: http://www.ietf.org/rfc/rfc4291.txt
URI.ip6_expression = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/ ;
// gruber revised expression - http://rodneyrehm.de/t/url-regex.html
URI.find_uri_expression = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/ig;
// http://www.iana.org/assignments/uri-schemes.html
// http://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers#Well-known_ports
URI.defaultPorts = {
    http: "80",
    https: "443",
    ftp: "21"
};
// allowed hostname characters according to RFC 3986
// ALPHA DIGIT "-" "." "_" "~" "!" "$" "&" "'" "(" ")" "*" "+" "," ";" "=" %encoded
// I've never seen a (non-IDN) hostname other than: ALPHA DIGIT . -
URI.invalid_hostname_characters = /[^a-zA-Z0-9\.-]/;
// encoding / decoding according to RFC3986
URI.encode = encodeURIComponent;
URI.decode = decodeURIComponent;
URI.iso8859 = function() {
    URI.encode = escape;
    URI.decode = unescape;
};
URI.unicode = function() {
    URI.encode = encodeURIComponent;
    URI.decode = decodeURIComponent;
};
URI.characters = {
    pathname: {
        encode: {
            // RFC3986 2.1: For consistency, URI producers and normalizers should
            // use uppercase hexadecimal digits for all percent-encodings.
            expression: /%(24|26|2B|2C|3B|3D|3A|40)/ig,
            map: {
                // -._~!'()*
                "%24": "$",
                "%26": "&",
                "%2B": "+",
                "%2C": ",",
                "%3B": ";",
                "%3D": "=",
                "%3A": ":",
                "%40": "@"
            }
        },
        decode: {
            expression: /[\/\?#]/g,
            map: {
                "/": "%2F",
                "?": "%3F",
                "#": "%23"
            }
        }
    }
};
URI.encodeQuery = function(string) {
    return URI.encode(string + "").replace(/%20/g, '+');
};
URI.decodeQuery = function(string) {
    return URI.decode((string + "").replace(/\+/g, '%20'));
};
URI.recodePath = function(string) {
    var segments = (string + "").split('/');
    for (var i = 0, length = segments.length; i < length; i++) {
        segments[i] = URI.encodePathSegment(URI.decode(segments[i]));
    }

    return segments.join('/');
};
URI.decodePath = function(string) {
    var segments = (string + "").split('/');
    for (var i = 0, length = segments.length; i < length; i++) {
        segments[i] = URI.decodePathSegment(segments[i]);
    }

    return segments.join('/');
};
// generate encode/decode path functions
var _parts = {'encode':'encode', 'decode':'decode'},
    _part,
    generateAccessor = function(_part){
        return function(string) {
            return URI[_part](string + "").replace(URI.characters.pathname[_part].expression, function(c) {
                return URI.characters.pathname[_part].map[c];
            });
        };
    };

for (_part in _parts) {
    URI[_part + "PathSegment"] = generateAccessor(_parts[_part]);
}

URI.parse = function(string) {
    var pos, t, parts = {};
    // [protocol"://"[username[":"password]"@"]hostname[":"port]"/"?][path]["?"querystring]["#"fragment]

    // extract fragment
    pos = string.indexOf('#');
    if (pos > -1) {
        // escaping?
        parts.fragment = string.substring(pos + 1) || null;
        string = string.substring(0, pos);
    }

    // extract query
    pos = string.indexOf('?');
    if (pos > -1) {
        // escaping?
        parts.query = string.substring(pos + 1) || null;
        string = string.substring(0, pos);
    }

    // extract protocol
    if (string.substring(0, 2) === '//') {
        // relative-scheme
        parts.protocol = '';
        string = string.substring(2);
        // extract "user:pass@host:port"
        string = URI.parseAuthority(string, parts);
    } else {
        pos = string.indexOf(':');
        if (pos > -1) {
            parts.protocol = string.substring(0, pos);
            if (string.substring(pos + 1, pos + 3) === '//') {
                string = string.substring(pos + 3);

                // extract "user:pass@host:port"
                string = URI.parseAuthority(string, parts);
            } else {
                string = string.substring(pos + 1);
                parts.urn = true;
            }
        }
    }

    // what's left must be the path
    parts.path = string;

    // and we're done
    return parts;
};
URI.parseHost = function(string, parts) {
    // extract host:port
    var pos = string.indexOf('/'),
        t;

    if (pos === -1) {
        pos = string.length;
    }

    if (string[0] === "[") {
        // IPv6 host - http://tools.ietf.org/html/draft-ietf-6man-text-addr-representation-04#section-6
        // I claim most client software breaks on IPv6 anyways. To simplify things, URI only accepts
        // IPv6+port in the format [2001:db8::1]:80 (for the time being)
        var bracketPos = string.indexOf(']');
        parts.hostname = string.substring(1, bracketPos) || null;
        parts.port = string.substring(bracketPos+2, pos) || null;
    } else if (string.indexOf(':') !== string.lastIndexOf(':')) {
        // IPv6 host contains multiple colons - but no port
        // this notation is actually not allowed by RFC 3986, but we're a liberal parser
        parts.hostname = string.substring(0, pos) || null;
        parts.port = null;
    } else {
        t = string.substring(0, pos).split(':');
        parts.hostname = t[0] || null;
        parts.port = t[1] || null;
    }

    if (parts.hostname && string.substring(pos)[0] !== '/') {
        pos++;
        string = "/" + string;
    }

    return string.substring(pos) || '/';
};
URI.parseAuthority = function(string, parts) {
    string = URI.parseUserinfo(string, parts);
    return URI.parseHost(string, parts);
};
URI.parseUserinfo = function(string, parts) {
    // extract username:password
    var pos = string.indexOf('@'),
        firstSlash = string.indexOf('/'),
        t;

    // authority@ must come before /path
    if (pos > -1 && (firstSlash === -1 || pos < firstSlash)) {
        t = string.substring(0, pos).split(':');
        parts.username = t[0] ? URI.decode(t[0]) : null;
        parts.password = t[1] ? URI.decode(t[1]) : null;
        string = string.substring(pos + 1);
    } else {
        parts.username = null;
        parts.password = null;
    }

    return string;
};
URI.parseQuery = function(string) {
    if (!string) {
        return {};
    }

    // throw out the funky business - "?"[name"="value"&"]+
    string = string.replace(/&+/g, '&').replace(/^\?*&*|&+$/g, '');

    if (!string) {
        return {};
    }

    var items = {},
        splits = string.split('&'),
        length = splits.length;

    for (var i = 0; i < length; i++) {
        var v = splits[i].split('='),
            name = URI.decodeQuery(v.shift()),
            // no "=" is null according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#collect-url-parameters
            value = v.length ? URI.decodeQuery(v.join('=')) : null;

        if (items[name]) {
            if (typeof items[name] === "string") {
                items[name] = [items[name]];
            }

            items[name].push(value);
        } else {
            items[name] = value;
        }
    }

    return items;
};

URI.build = function(parts) {
    var t = '';

    if (parts.protocol) {
        t += parts.protocol + ":";
    }

    if (!parts.urn && (t || parts.hostname)) {
        t += '//';
    }

    t += (URI.buildAuthority(parts) || '');

    if (typeof parts.path === "string") {
        if (parts.path[0] !== '/' && typeof parts.hostname === "string") {
            t += '/';
        }

        t += parts.path;
    }

    if (typeof parts.query == "string") {
        t += '?' + parts.query;
    }

    if (typeof parts.fragment === "string") {
        t += '#' + parts.fragment;
    }
    return t;
};
URI.buildHost = function(parts) {
    var t = '';

    if (!parts.hostname) {
        return '';
    } else if (URI.ip6_expression.test(parts.hostname)) {
        if (parts.port) {
            t += "[" + parts.hostname + "]:" + parts.port;
        } else {
            // don't know if we should always wrap IPv6 in []
            // the RFC explicitly says SHOULD, not MUST.
            t += parts.hostname;
        }
    } else {
        t += parts.hostname;
        if (parts.port) {
            t += ':' + parts.port;
        }
    }

    return t;
};
URI.buildAuthority = function(parts) {
    return URI.buildUserinfo(parts) + URI.buildHost(parts);
};
URI.buildUserinfo = function(parts) {
    var t = '';

    if (parts.username) {
        t += URI.encode(parts.username);

        if (parts.password) {
            t += ':' + URI.encode(parts.password);
        }

        t += "@";
    }

    return t;
};
URI.buildQuery = function(data, duplicates) {
    // according to http://tools.ietf.org/html/rfc3986 or http://labs.apache.org/webarch/uri/rfc/rfc3986.html
    // being »-._~!$&'()*+,;=:@/?« %HEX and alnum are allowed
    // the RFC explicitly states ?/foo being a valid use case, no mention of parameter syntax!
    // URI.js treats the query string as being application/x-www-form-urlencoded
    // see http://www.w3.org/TR/REC-html40/interact/forms.html#form-content-type

    var t = "";
    for (var key in data) {
        if (Object.hasOwnProperty.call(data, key) && key) {
            if (isArray(data[key])) {
                var unique = {};
                for (var i = 0, length = data[key].length; i < length; i++) {
                    if (data[key][i] !== undefined && unique[data[key][i] + ""] === undefined) {
                        t += "&" + URI.buildQueryParameter(key, data[key][i]);
                        if (duplicates !== true) {
                            unique[data[key][i] + ""] = true;
                        }
                    }
                }
            } else if (data[key] !== undefined) {
                t += '&' + URI.buildQueryParameter(key, data[key]);
            }
        }
    }

    return t.substring(1);
};
URI.buildQueryParameter = function(name, value) {
    // http://www.w3.org/TR/REC-html40/interact/forms.html#form-content-type -- application/x-www-form-urlencoded
    // don't append "=" for null values, according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#url-parameter-serialization
    return URI.encodeQuery(name) + (value !== null ? "=" + URI.encodeQuery(value) : "");
};

URI.addQuery = function(data, name, value) {
    if (typeof name === "object") {
        for (var key in name) {
            if (Object.prototype.hasOwnProperty.call(name, key)) {
                URI.addQuery(data, key, name[key]);
            }
        }
    } else if (typeof name === "string") {
        if (data[name] === undefined) {
            data[name] = value;
            return;
        } else if (typeof data[name] === "string") {
            data[name] = [data[name]];
        }

        if (!isArray(value)) {
            value = [value];
        }

        data[name] = data[name].concat(value);
    } else {
        throw new TypeError("URI.addQuery() accepts an object, string as the name parameter");
    }
};
URI.removeQuery = function(data, name, value) {
    if (isArray(name)) {
        for (var i = 0, length = name.length; i < length; i++) {
            data[name[i]] = undefined;
        }
    } else if (typeof name === "object") {
        for (var key in name) {
            if (Object.prototype.hasOwnProperty.call(name, key)) {
                URI.removeQuery(data, key, name[key]);
            }
        }
    } else if (typeof name === "string") {
        if (value !== undefined) {
            if (data[name] === value) {
                data[name] = undefined;
            } else if (isArray(data[name])) {
                data[name] = filterArrayValues(data[name], value);
            }
        } else {
            data[name] = undefined;
        }
    } else {
        throw new TypeError("URI.addQuery() accepts an object, string as the first parameter");
    }
};

URI.commonPath = function(one, two) {
    var length = Math.min(one.length, two.length),
        pos;

    // find first non-matching character
    for (pos = 0; pos < length; pos++) {
        if (one[pos] !== two[pos]) {
            pos--;
            break;
        }
    }

    if (pos < 1) {
        return one[0] === two[0] && one[0] === '/' ? '/' : '';
    }

    // revert to last /
    if (one[pos] !== '/') {
        pos = one.substring(0, pos).lastIndexOf('/');
    }

    return one.substring(0, pos + 1);
};

URI.withinString = function(string, callback) {
    // expression used is "gruber revised" (@gruber v2) determined to be the best solution in
    // a regex sprint we did a couple of ages ago at
    // * http://mathiasbynens.be/demo/url-regex
    // * http://rodneyrehm.de/t/url-regex.html

    return string.replace(URI.find_uri_expression, callback);
};

URI.ensureValidHostname = function(v) {
    // Theoretically URIs allow percent-encoding in Hostnames (according to RFC 3986)
    // they are not part of DNS and therefore ignored by URI.js

    if (v.match(URI.invalid_hostname_characters)) {
        // test punycode
        if (!punycode) {
            throw new TypeError("Hostname '" + v + "' contains characters other than [A-Z0-9.-] and Punycode.js is not available");
        }

        if (punycode.toASCII(v).match(URI.invalid_hostname_characters)) {
            throw new TypeError("Hostname '" + v + "' contains characters other than [A-Z0-9.-]");
        }
    }
};

p.build = function(deferBuild) {
    if (deferBuild === true) {
        this._deferred_build = true;
    } else if (deferBuild === undefined || this._deferred_build) {
        this._string = URI.build(this._parts);
        this._deferred_build = false;
    }

    return this;
};

p.valueOf = p.toString = function() {
    return this.build(false)._string;
};

// generate simple accessors
_parts = {protocol: 'protocol', username: 'username', password: 'password', hostname: 'hostname',  port: 'port'};
generateAccessor = function(_part){
    return function(v, build) {
        if (v === undefined) {
            return this._parts[_part] || "";
        } else {
            this._parts[_part] = v;
            this.build(!build);
            return this;
        }
    };
};

for (_part in _parts) {
    p[_part] = generateAccessor(_parts[_part]);
}

// generate accessors with optionally prefixed input
_parts = {query: '?', fragment: '#'};
generateAccessor = function(_part, _key){
    return function(v, build) {
        if (v === undefined) {
            return this._parts[_part] || "";
        } else {
            if (v !== null) {
                v = v + "";
                if (v[0] === _key) {
                    v = v.substring(1);
                }
            }

            this._parts[_part] = v;
            this.build(!build);
            return this;
        }
    };
};

for (_part in _parts) {
    p[_part] = generateAccessor(_part, _parts[_part]);
}

// generate accessors with prefixed output
_parts = {search: ['?', 'query'], hash: ['#', 'fragment']};
generateAccessor = function(_part, _key){
    return function(v, build) {
        var t = this[_part](v, build);
        return typeof t === "string" && t.length ? (_key + t) : t;
    };
};

for (_part in _parts) {
    p[_part] = generateAccessor(_parts[_part][1], _parts[_part][0]);
}

p.pathname = function(v, build) {
    if (v === undefined || v === true) {
        var res = this._parts.path || (this._parts.urn ? '' : '/');
        return v ? URI.decodePath(res) : res;
    } else {
        this._parts.path = v ? URI.recodePath(v) : "/";
        this.build(!build);
        return this;
    }
};
p.path = p.pathname;
p.href = function(href, build) {
    if (href === undefined) {
        return this.toString();
    } else {
        this._string = "";
        this._parts = {
            protocol: null,
            username: null,
            password: null,
            hostname: null,
            urn: null,
            port: null,
            path: null,
            query: null,
            fragment: null
        };

        var _URI = href instanceof URI,
            _object = typeof href === "object" && (href.hostname || href.path),
            key;

        if (typeof href === "string") {
            this._parts = URI.parse(href);
        } else if (_URI || _object) {
            var src = _URI ? href._parts : href;
            for (key in src) {
                if (Object.hasOwnProperty.call(this._parts, key)) {
                    this._parts[key] = src[key];
                }
            }
        } else {
            throw new TypeError("invalid input");
        }

        this.build(!build);
        return this;
    }
};

// identification accessors
p.is = function(what) {
    var ip = false,
        ip4 = false,
        ip6 = false,
        name = false,
        sld = false,
        idn = false,
        punycode = false,
        relative = !this._parts.urn;

    if (this._parts.hostname) {
        relative = false;
        ip4 = URI.ip4_expression.test(this._parts.hostname);
        ip6 = URI.ip6_expression.test(this._parts.hostname);
        ip = ip4 || ip6;
        name = !ip;
        sld = name && SLD && SLD.has(this._parts.hostname);
        idn = name && URI.idn_expression.test(this._parts.hostname);
        punycode = name && URI.punycode_expression.test(this._parts.hostname);
    }

    switch (what.toLowerCase()) {
        case 'relative':
            return relative;

        case 'absolute':
            return !relative;

        // hostname identification
        case 'domain':
        case 'name':
            return name;

        case 'sld':
            return sld;

        case 'ip':
            return ip;

        case 'ip4':
        case 'ipv4':
        case 'inet4':
            return ip4;

        case 'ip6':
        case 'ipv6':
        case 'inet6':
            return ip6;

        case 'idn':
            return idn;

        case 'url':
            return !this._parts.urn;

        case 'urn':
            return !!this._parts.urn;

        case 'punycode':
            return punycode;
    }

    return null;
};

// component specific input validation
var _protocol = p.protocol,
    _port = p.port,
    _hostname = p.hostname;

p.protocol = function(v, build) {
    if (v !== undefined) {
        if (v) {
            // accept trailing ://
            v = v.replace(/:(\/\/)?$/, '');

            if (v.match(/[^a-zA-z0-9\.+-]/)) {
                throw new TypeError("Protocol '" + v + "' contains characters other than [A-Z0-9.+-]");
            }
        }
    }
    return _protocol.call(this, v, build);
};
p.scheme = p.protocol;
p.port = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (v !== undefined) {
        if (v === 0) {
            v = null;
        }

        if (v) {
            v += "";
            if (v[0] === ":") {
                v = v.substring(1);
            }

            if (v.match(/[^0-9]/)) {
                throw new TypeError("Port '" + v + "' contains characters other than [0-9]");
            }
        }
    }
    return _port.call(this, v, build);
};
p.hostname = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (v !== undefined) {
        var x = {};
        URI.parseHost(v, x);
        v = x.hostname;
    }
    return _hostname.call(this, v, build);
};

// combination accessors
p.host = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (v === undefined) {
        return this._parts.hostname ? URI.buildHost(this._parts) : "";
    } else {
        URI.parseHost(v, this._parts);
        this.build(!build);
        return this;
    }
};
p.authority = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (v === undefined) {
        return this._parts.hostname ? URI.buildAuthority(this._parts) : "";
    } else {
        URI.parseAuthority(v, this._parts);
        this.build(!build);
        return this;
    }
};
p.userinfo = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (v === undefined) {
        if (!this._parts.username) {
            return "";
        }

        var t = URI.buildUserinfo(this._parts);
        return t.substring(0, t.length -1);
    } else {
        if (v[v.length-1] !== '@') {
            v += '@';
        }

        URI.parseUserinfo(v, this._parts);
        this.build(!build);
        return this;
    }
};

// fraction accessors
p.subdomain = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    // convenience, return "www" from "www.example.org"
    if (v === undefined) {
        if (!this._parts.hostname || this.is('IP')) {
            return "";
        }

        // grab domain and add another segment
        var end = this._parts.hostname.length - this.domain().length - 1;
        return this._parts.hostname.substring(0, end) || "";
    } else {
        var e = this._parts.hostname.length - this.domain().length,
            sub = this._parts.hostname.substring(0, e),
            replace = new RegExp('^' + escapeRegEx(sub));

        if (v && v[v.length - 1] !== '.') {
            v += ".";
        }

        if (v) {
            URI.ensureValidHostname(v);
        }

        this._parts.hostname = this._parts.hostname.replace(replace, v);
        this.build(!build);
        return this;
    }
};
p.domain = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (typeof v == 'boolean') {
        build = v;
        v = undefined;
    }

    // convenience, return "example.org" from "www.example.org"
    if (v === undefined) {
        if (!this._parts.hostname || this.is('IP')) {
            return "";
        }

        // if hostname consists of 1 or 2 segments, it must be the domain
        var t = this._parts.hostname.match(/\./g);
        if (t && t.length < 2) {
            return this._parts.hostname;
        }

        // grab tld and add another segment
        var end = this._parts.hostname.length - this.tld(build).length - 1;
        end = this._parts.hostname.lastIndexOf('.', end -1) + 1;
        return this._parts.hostname.substring(end) || "";
    } else {
        if (!v) {
            throw new TypeError("cannot set domain empty");
        }

        URI.ensureValidHostname(v);

        if (!this._parts.hostname || this.is('IP')) {
            this._parts.hostname = v;
        } else {
            var replace = new RegExp(escapeRegEx(this.domain()) + "$");
            this._parts.hostname = this._parts.hostname.replace(replace, v);
        }

        this.build(!build);
        return this;
    }
};
p.tld = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (typeof v == 'boolean') {
        build = v;
        v = undefined;
    }

    // return "org" from "www.example.org"
    if (v === undefined) {
        if (!this._parts.hostname || this.is('IP')) {
            return "";
        }

        var pos = this._parts.hostname.lastIndexOf('.'),
            tld = this._parts.hostname.substring(pos + 1);

        if (build !== true && SLD && SLD.list[tld.toLowerCase()]) {
            return SLD.get(this._parts.hostname) || tld;
        }

        return tld;
    } else {
        var replace;
        if (!v) {
            throw new TypeError("cannot set TLD empty");
        } else if (v.match(/[^a-zA-Z0-9-]/)) {
            if (SLD && SLD.is(v)) {
                replace = new RegExp(escapeRegEx(this.tld()) + "$");
                this._parts.hostname = this._parts.hostname.replace(replace, v);
            } else {
                throw new TypeError("TLD '" + v + "' contains characters other than [A-Z0-9]");
            }
        } else if (!this._parts.hostname || this.is('IP')) {
            throw new ReferenceError("cannot set TLD on non-domain host");
        } else {
            replace = new RegExp(escapeRegEx(this.tld()) + "$");
            this._parts.hostname = this._parts.hostname.replace(replace, v);
        }

        this.build(!build);
        return this;
    }
};
p.directory = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (v === undefined || v === true) {
        if (!this._parts.path || this._parts.path === '/') {
            return '/';
        }

        var end = this._parts.path.length - this.filename().length - 1,
            res = this._parts.path.substring(0, end) || "/";

        return v ? URI.decodePath(res) : res;

    } else {
        var e = this._parts.path.length - this.filename().length,
            directory = this._parts.path.substring(0, e),
            replace = new RegExp('^' + escapeRegEx(directory));

        // fully qualifier directories begin with a slash
        if (!this.is('relative')) {
            if (!v) {
                v = '/';
            }

            if (v[0] !== '/') {
                v = "/" + v;
            }
        }

        // directories always end with a slash
        if (v && v[v.length - 1] !== '/') {
            v += '/';
        }

        v = URI.recodePath(v);
        this._parts.path = this._parts.path.replace(replace, v);
        this.build(!build);
        return this;
    }
};
p.filename = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (v === undefined || v === true) {
        if (!this._parts.path || this._parts.path === '/') {
            return "";
        }

        var pos = this._parts.path.lastIndexOf('/'),
            res = this._parts.path.substring(pos+1);

        return v ? URI.decodePathSegment(res) : res;
    } else {
        var mutatedDirectory = false;
        if (v[0] === '/') {
            v = v.substring(1);
        }

        if (v.match(/\.?\//)) {
            mutatedDirectory = true;
        }

        var replace = new RegExp(escapeRegEx(this.filename()) + "$");
        v = URI.recodePath(v);
        this._parts.path = this._parts.path.replace(replace, v);

        if (mutatedDirectory) {
            this.normalizePath(build);
        } else {
            this.build(!build);
        }

        return this;
    }
};
p.suffix = function(v, build) {
    if (this._parts.urn) {
        return v === undefined ? '' : this;
    }

    if (v === undefined || v === true) {
        if (!this._parts.path || this._parts.path === '/') {
            return "";
        }

        var filename = this.filename(),
            pos = filename.lastIndexOf('.'),
            s, res;

        if (pos === -1) {
            return "";
        }

        // suffix may only contain alnum characters (yup, I made this up.)
        s = filename.substring(pos+1);
        res = (/^[a-z0-9%]+$/i).test(s) ? s : "";
        return v ? URI.decodePathSegment(res) : res;
    } else {
        if (v[0] === '.') {
            v = v.substring(1);
        }

        var suffix = this.suffix(),
            replace;

        if (!suffix) {
            if (!v) {
                return this;
            }

            this._parts.path += '.' + URI.recodePath(v);
        } else if (!v) {
            replace = new RegExp(escapeRegEx("." + suffix) + "$");
        } else {
            replace = new RegExp(escapeRegEx(suffix) + "$");
        }

        if (replace) {
            v = URI.recodePath(v);
            this._parts.path = this._parts.path.replace(replace, v);
        }

        this.build(!build);
        return this;
    }
};

// mutating query string
var q = p.query;
p.query = function(v, build) {
    if (v === true) {
        return URI.parseQuery(this._parts.query);
    } else if (v !== undefined && typeof v !== "string") {
        this._parts.query = URI.buildQuery(v);
        this.build(!build);
        return this;
    } else {
        return q.call(this, v, build);
    }
};
p.addQuery = function(name, value, build) {
    var data = URI.parseQuery(this._parts.query);
    URI.addQuery(data, name, value);
    this._parts.query = URI.buildQuery(data);
    if (typeof name !== "string") {
        build = value;
    }

    this.build(!build);
    return this;
};
p.removeQuery = function(name, value, build) {
    var data = URI.parseQuery(this._parts.query);
    URI.removeQuery(data, name, value);
    this._parts.query = URI.buildQuery(data);
    if (typeof name !== "string") {
        build = value;
    }

    this.build(!build);
    return this;
};
p.addSearch = p.addQuery;
p.removeSearch = p.removeQuery;

// sanitizing URLs
p.normalize = function() {
    if (this._parts.urn) {
        return this
            .normalizeProtocol(false)
            .normalizeQuery(false)
            .normalizeFragment(false)
            .build();
    }

    return this
        .normalizeProtocol(false)
        .normalizeHostname(false)
        .normalizePort(false)
        .normalizePath(false)
        .normalizeQuery(false)
        .normalizeFragment(false)
        .build();
};
p.normalizeProtocol = function(build) {
    if (typeof this._parts.protocol === "string") {
        this._parts.protocol = this._parts.protocol.toLowerCase();
        this.build(!build);
    }

    return this;
};
p.normalizeHostname = function(build) {
    if (this._parts.hostname) {
        if (this.is('IDN') && punycode) {
            this._parts.hostname = punycode.toASCII(this._parts.hostname);
        } else if (this.is('IPv6') && IPv6) {
            this._parts.hostname = IPv6.best(this._parts.hostname);
        }

        this._parts.hostname = this._parts.hostname.toLowerCase();
        this.build(!build);
    }

    return this;
};
p.normalizePort = function(build) {
    // remove port of it's the protocol's default
    if (typeof this._parts.protocol === "string" && this._parts.port === URI.defaultPorts[this._parts.protocol]) {
        this._parts.port = null;
        this.build(!build);
    }

    return this;
};
p.normalizePath = function(build) {
    if (this._parts.urn) {
        return this;
    }

    if (!this._parts.path || this._parts.path === '/') {
        return this;
    }

    var _was_relative,
        _was_relative_prefix,
        _path = this._parts.path,
        _parent, _pos;

    // handle relative paths
    if (_path[0] !== '/') {
        if (_path[0] === '.') {
            _was_relative_prefix = _path.substring(0, _path.indexOf('/'));
        }
        _was_relative = true;
        _path = '/' + _path;
    }
    // resolve simples
    _path = _path.replace(/(\/(\.\/)+)|\/{2,}/g, '/');
    // resolve parents
    while (true) {
        _parent = _path.indexOf('/../');
        if (_parent === -1) {
            // no more ../ to resolve
            break;
        } else if (_parent === 0) {
            // top level cannot be relative...
            _path = _path.substring(3);
            break;
        }

        _pos = _path.substring(0, _parent).lastIndexOf('/');
        if (_pos === -1) {
            _pos = _parent;
        }
        _path = _path.substring(0, _pos) + _path.substring(_parent + 3);
    }
    // revert to relative
    if (_was_relative && this.is('relative')) {
        if (_was_relative_prefix){
            _path = _was_relative_prefix + _path;
        } else {
            _path = _path.substring(1);
        }
    }

    _path = URI.recodePath(_path);
    this._parts.path = _path;
    this.build(!build);
    return this;
};
p.normalizePathname = p.normalizePath;
p.normalizeQuery = function(build) {
    if (typeof this._parts.query === "string") {
        if (!this._parts.query.length) {
            this._parts.query = null;
        } else {
            this.query(URI.parseQuery(this._parts.query));
        }

        this.build(!build);
    }

    return this;
};
p.normalizeFragment = function(build) {
    if (!this._parts.fragment) {
        this._parts.fragment = null;
        this.build(!build);
    }

    return this;
};
p.normalizeSearch = p.normalizeQuery;
p.normalizeHash = p.normalizeFragment;

p.iso8859 = function() {
    // expect unicode input, iso8859 output
    var e = URI.encode,
        d = URI.decode;

    URI.encode = escape;
    URI.decode = decodeURIComponent;
    this.normalize();
    URI.encode = e;
    URI.decode = d;
    return this;
};

p.unicode = function() {
    // expect iso8859 input, unicode output
    var e = URI.encode,
        d = URI.decode;

    URI.encode = encodeURIComponent;
    URI.decode = unescape;
    this.normalize();
    URI.encode = e;
    URI.decode = d;
    return this;
};

p.readable = function() {
    var uri = new URI(this);
    // removing username, password, because they shouldn't be displayed according to RFC 3986
    uri.username("").password("").normalize();
    var t = '';
    if (uri._parts.protocol) {
        t += uri._parts.protocol + '://';
    }

    if (uri._parts.hostname) {
        if (uri.is('punycode') && punycode) {
            t += punycode.toUnicode(uri._parts.hostname);
            if (uri._parts.port) {
                t += ":" + uri._parts.port;
            }
        } else {
            t += uri.host();
        }
    }

    if (uri._parts.hostname && uri._parts.path && uri._parts.path[0] !== '/') {
        t += '/';
    }

    t += uri.path(true);
    if (uri._parts.query) {
        var q = '';
        for (var i = 0, qp = uri._parts.query.split('&'), l = qp.length; i < l; i++) {
            var kv = (qp[i] || "").split('=');
            q += '&' + URI.decodeQuery(kv[0])
                .replace(/&/g, '%26');

            if (kv[1] !== undefined) {
                q += "=" + URI.decodeQuery(kv[1])
                    .replace(/&/g, '%26');
            }
        }
        t += '?' + q.substring(1);
    }

    t += uri.hash();
    return t;
};

// resolving relative and absolute URLs
p.absoluteTo = function(base) {
    if (this._parts.urn) {
        throw new Error('URNs do not have any generally defined hierachical components');
    }

    if (!this.is('relative')) {
        throw new Error('Cannot resolve non-relative URL');
    }

    if (!(base instanceof URI)) {
        base = new URI(base);
    }

    var resolved = new URI(this),
        properties = ['protocol', 'username', 'password', 'hostname', 'port'];

    for (var i = 0, p; p = properties[i]; i++) {
        resolved._parts[p] = base._parts[p];
    }

    if (resolved.path()[0] !== '/') {
        resolved._parts.path = base.directory() + '/' + resolved._parts.path;
        resolved.normalizePath();
    }

    resolved.build();
    return resolved;
};
p.relativeTo = function(base) {
    if (this._parts.urn) {
        throw new Error('URNs do not have any generally defined hierachical components');
    }

    if (!(base instanceof URI)) {
        base = new URI(base);
    }

    if (this.path()[0] !== '/' || base.path()[0] !== '/') {
        throw new Error('Cannot calculate common path from non-relative URLs');
    }

    var relative = new URI(this),
        properties = ['protocol', 'username', 'password', 'hostname', 'port'],
        common = URI.commonPath(relative.path(), base.path()),
        _base = base.directory();

    for (var i = 0, p; p = properties[i]; i++) {
        relative._parts[p] = null;
    }

    if (!common || common === '/') {
        return relative;
    }

    if (_base + '/' === common) {
        relative._parts.path = './' + relative.filename();
    } else {
        var parents = '../',
            _common = new RegExp('^' + escapeRegEx(common)),
            _parents = _base.replace(_common, '/').match(/\//g).length -1;

        while (_parents--) {
            parents += '../';
        }

        relative._parts.path = relative._parts.path.replace(_common, parents);
    }

    relative.build();
    return relative;
};

// comparing URIs
p.equals = function(uri) {
    var one = new URI(this),
        two = new URI(uri),
        one_map = {},
        two_map = {},
        checked = {},
        one_query,
        two_query,
        key;

    one.normalize();
    two.normalize();

    // exact match
    if (one.toString() === two.toString()) {
        return true;
    }

    // extract query string
    one_query = one.query();
    two_query = two.query();
    one.query("");
    two.query("");

    // definitely not equal if not even non-query parts match
    if (one.toString() !== two.toString()) {
        return false;
    }

    // query parameters have the same length, even if they're permutated
    if (one_query.length !== two_query.length) {
        return false;
    }

    one_map = URI.parseQuery(one_query);
    two_map = URI.parseQuery(two_query);

    for (key in one_map) {
        if (Object.prototype.hasOwnProperty.call(one_map, key)) {
            if (!isArray(one_map[key])) {
                if (one_map[key] !== two_map[key]) {
                    return false;
                }
            } else {
                if (!isArray(two_map[key])) {
                    return false;
                }

                // arrays can't be equal if they have different amount of content
                if (one_map[key].length !== two_map[key].length) {
                    return false;
                }

                one_map[key].sort();
                two_map[key].sort();

                for (var i = 0, l = one_map[key].length; i < l; i++) {
                    if (one_map[key][i] !== two_map[key][i]) {
                        return false;
                    }
                }
            }

            checked[key] = true;
        }
    }

    for (key in two_map) {
        if (Object.prototype.hasOwnProperty.call(two_map, key)) {
            if (!checked[key]) {
                // two contains a parameter not present in one
                return false;
            }
        }
    }

    return true;
};

(typeof module !== 'undefined' && module.exports
    ? module.exports = URI
    : window.URI = URI
);

})();
});

define('core/lib/view.ui.js',['require','exports','module','./rpc/rpc.view','../../wp2/lib/device','../plugins/toast/view','../plugins/childwebviewcontrols/view','../plugins/dialog/view','../plugins/default/view','../plugins/contextmenu/view','../plugins/formcontrol/view','../plugins/titlebarwithactions/view','../../dependencies/URI.js/src/URI'],function (require, exports, module) {
/**
 * @exports itself as wp
 * @namespace wp
 *
 */

if (!window.wp) {
    window.wp = {};
}

if (!window.wp.view) {
    window.wp.view = {};
}

if (!window.wp.i18n) {
    window.wp.i18n = {
        translate : function (string) {
            return {
                fetch : function () {
                    return string;
                }
            };
        }
    };
}

window.wp.view.rpc = require('./rpc/rpc.view');
window.wp.device = require('../../wp2/lib/device');

window.wp.view.ui = {
    'toast' : require('../plugins/toast/view'),
    'childwebviewcontrols' : require('../plugins/childwebviewcontrols/view'),
    'dialog' : require('../plugins/dialog/view'),
    'default' : require('../plugins/default/view'),
    'contextmenu' : require('../plugins/contextmenu/view'),
    'formcontrol' : require('../plugins/formcontrol/view'),
    'titlebarwithactions' : require('../plugins/titlebarwithactions/view')
};

// Browser UI Dependency
window.URI = require("../../dependencies/URI.js/src/URI");
});

define('wp1/lib/uihtmlTransform.js',['require','exports','module'],function (require, exports, module) {
(function () {

    function transform() {
        var dialog,
            dialogPanel,
            toast,
            toastTop,
            toastMiddle,
            toastBottom;

        // Dialogs
        dialog = document.getElementById("dialog");
        dialogPanel = document.getElementById("dialog-panel");

        dialog.classList.remove("hidden");
        dialog.classList.add("dialog-hidden");

        dialogPanel.classList.add("light");

        // Toasts
        toast = document.getElementById("toaster");
        toast.classList.remove("toaster");
        toast.classList.add("toast");
        toast.id = "toast";

        toastTop = document.createElement("div");
        toastTop.classList.add("toast-top");
        toastMiddle = document.createElement("div");
        toastMiddle.classList.add("toast-middle");
        toastBottom = document.createElement("div");
        toastBottom.classList.add("toast-bottom");

        toast.appendChild(toastTop);
        toast.appendChild(toastMiddle);
        toast.appendChild(toastBottom);

    }

    document.addEventListener("DOMContentLoaded", transform);
})();
});

define('wwe/hook.wp-view',['require','exports','module'],function (require, exports, module) {
(function () {
    function work() {
        if (window.location.href === 'local:///chrome/ui.html' &&
            document.getElementById('targetLoaderActivity')
            ) {
            /* this code will only be called in file XX */
            /* We're running in an old webworks build */
            window.location.href = 'platform://ui/ui.html#wwe';
        } else if (window.location.href === 'platform://ui/ui.html#wwe') {
            /* this code will only be called in file YY */
            /* We're running in a new webworks build */
            /* WebWorks doesn't want to have a title in this page,
             * so let's remove it.
             */
            Array.prototype.forEach.call(
              document.getElementsByTagName('title'),
              function (o) { o.parentNode.removeChild(o); }
            );
        }
        document.removeEventListener("DOMContentLoaded", work);
    }
    document.addEventListener("DOMContentLoaded", work);
})();
});

require(["./core/lib/view.ui.js", "./wp1/lib/uihtmlTransform.js", "./wwe/hook.wp-view"]);
}());