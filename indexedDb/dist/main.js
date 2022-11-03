/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var idb_keyval__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! idb-keyval */ \"./node_modules/idb-keyval/dist/index.js\");\n\n\nconst latlng = [];\nlet count = 0;\nlet id;\n\nconst registerServiceWorker = async () => {\n  if (\"serviceWorker\" in window.navigator) {\n    try {\n      const registration = await window.navigator.serviceWorker.register(\"sw.js\");\n      if (registration.installing) {\n        console.log(\"Service worker installing!\");\n      } else if (registration.waiting) {\n        console.log(\"Service worker installed\");\n      } else if (registration.active) {\n        console.log(\"Service worker active\");\n      }\n    } catch (error) {\n      console.error(`Registration failed with ${error}`);\n    }\n  }\n};\n\nregisterServiceWorker();\n\n(0,idb_keyval__WEBPACK_IMPORTED_MODULE_0__.set)(\"latlng\", latlng)\n  .then(() => {\n    console.log(\"Wiped array\");\n    id = setInterval(findPosition, 3000);\n  })\n  .catch((err) => console.error(err));\n\nfunction findPosition() {\n  count++;\n  if (count === 15) {\n    clearInterval(id);\n  }\n  window.navigator.geolocation.getCurrentPosition((position) => {\n    const time = new Date().getTime() / 1000;\n    const newPos = {\n      lat: position.coords.latitude,\n      lng: position.coords.longitude,\n      time,\n    };\n    (0,idb_keyval__WEBPACK_IMPORTED_MODULE_0__.update)(\"latlng\", (arr) => {\n      const newArr = [...arr];\n      newArr.push(newPos);\n      console.log(newArr);\n      return newArr;\n    });\n  });\n}\n\nwindow.addEventListener(\"offline\", (event) => {\n  console.log(\"Just went offline\");\n});\n\nconsole.log(\"Online?\", window.navigator.onLine);\n\n\n//# sourceURL=webpack://indexeddb/./src/index.js?");

/***/ }),

/***/ "./node_modules/idb-keyval/dist/index.js":
/*!***********************************************!*\
  !*** ./node_modules/idb-keyval/dist/index.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"clear\": () => (/* binding */ clear),\n/* harmony export */   \"createStore\": () => (/* binding */ createStore),\n/* harmony export */   \"del\": () => (/* binding */ del),\n/* harmony export */   \"delMany\": () => (/* binding */ delMany),\n/* harmony export */   \"entries\": () => (/* binding */ entries),\n/* harmony export */   \"get\": () => (/* binding */ get),\n/* harmony export */   \"getMany\": () => (/* binding */ getMany),\n/* harmony export */   \"keys\": () => (/* binding */ keys),\n/* harmony export */   \"promisifyRequest\": () => (/* binding */ promisifyRequest),\n/* harmony export */   \"set\": () => (/* binding */ set),\n/* harmony export */   \"setMany\": () => (/* binding */ setMany),\n/* harmony export */   \"update\": () => (/* binding */ update),\n/* harmony export */   \"values\": () => (/* binding */ values)\n/* harmony export */ });\nfunction promisifyRequest(request) {\n    return new Promise((resolve, reject) => {\n        // @ts-ignore - file size hacks\n        request.oncomplete = request.onsuccess = () => resolve(request.result);\n        // @ts-ignore - file size hacks\n        request.onabort = request.onerror = () => reject(request.error);\n    });\n}\nfunction createStore(dbName, storeName) {\n    const request = indexedDB.open(dbName);\n    request.onupgradeneeded = () => request.result.createObjectStore(storeName);\n    const dbp = promisifyRequest(request);\n    return (txMode, callback) => dbp.then((db) => callback(db.transaction(storeName, txMode).objectStore(storeName)));\n}\nlet defaultGetStoreFunc;\nfunction defaultGetStore() {\n    if (!defaultGetStoreFunc) {\n        defaultGetStoreFunc = createStore('keyval-store', 'keyval');\n    }\n    return defaultGetStoreFunc;\n}\n/**\n * Get a value by its key.\n *\n * @param key\n * @param customStore Method to get a custom store. Use with caution (see the docs).\n */\nfunction get(key, customStore = defaultGetStore()) {\n    return customStore('readonly', (store) => promisifyRequest(store.get(key)));\n}\n/**\n * Set a value with a key.\n *\n * @param key\n * @param value\n * @param customStore Method to get a custom store. Use with caution (see the docs).\n */\nfunction set(key, value, customStore = defaultGetStore()) {\n    return customStore('readwrite', (store) => {\n        store.put(value, key);\n        return promisifyRequest(store.transaction);\n    });\n}\n/**\n * Set multiple values at once. This is faster than calling set() multiple times.\n * It's also atomic – if one of the pairs can't be added, none will be added.\n *\n * @param entries Array of entries, where each entry is an array of `[key, value]`.\n * @param customStore Method to get a custom store. Use with caution (see the docs).\n */\nfunction setMany(entries, customStore = defaultGetStore()) {\n    return customStore('readwrite', (store) => {\n        entries.forEach((entry) => store.put(entry[1], entry[0]));\n        return promisifyRequest(store.transaction);\n    });\n}\n/**\n * Get multiple values by their keys\n *\n * @param keys\n * @param customStore Method to get a custom store. Use with caution (see the docs).\n */\nfunction getMany(keys, customStore = defaultGetStore()) {\n    return customStore('readonly', (store) => Promise.all(keys.map((key) => promisifyRequest(store.get(key)))));\n}\n/**\n * Update a value. This lets you see the old value and update it as an atomic operation.\n *\n * @param key\n * @param updater A callback that takes the old value and returns a new value.\n * @param customStore Method to get a custom store. Use with caution (see the docs).\n */\nfunction update(key, updater, customStore = defaultGetStore()) {\n    return customStore('readwrite', (store) => \n    // Need to create the promise manually.\n    // If I try to chain promises, the transaction closes in browsers\n    // that use a promise polyfill (IE10/11).\n    new Promise((resolve, reject) => {\n        store.get(key).onsuccess = function () {\n            try {\n                store.put(updater(this.result), key);\n                resolve(promisifyRequest(store.transaction));\n            }\n            catch (err) {\n                reject(err);\n            }\n        };\n    }));\n}\n/**\n * Delete a particular key from the store.\n *\n * @param key\n * @param customStore Method to get a custom store. Use with caution (see the docs).\n */\nfunction del(key, customStore = defaultGetStore()) {\n    return customStore('readwrite', (store) => {\n        store.delete(key);\n        return promisifyRequest(store.transaction);\n    });\n}\n/**\n * Delete multiple keys at once.\n *\n * @param keys List of keys to delete.\n * @param customStore Method to get a custom store. Use with caution (see the docs).\n */\nfunction delMany(keys, customStore = defaultGetStore()) {\n    return customStore('readwrite', (store) => {\n        keys.forEach((key) => store.delete(key));\n        return promisifyRequest(store.transaction);\n    });\n}\n/**\n * Clear all values in the store.\n *\n * @param customStore Method to get a custom store. Use with caution (see the docs).\n */\nfunction clear(customStore = defaultGetStore()) {\n    return customStore('readwrite', (store) => {\n        store.clear();\n        return promisifyRequest(store.transaction);\n    });\n}\nfunction eachCursor(store, callback) {\n    store.openCursor().onsuccess = function () {\n        if (!this.result)\n            return;\n        callback(this.result);\n        this.result.continue();\n    };\n    return promisifyRequest(store.transaction);\n}\n/**\n * Get all keys in the store.\n *\n * @param customStore Method to get a custom store. Use with caution (see the docs).\n */\nfunction keys(customStore = defaultGetStore()) {\n    return customStore('readonly', (store) => {\n        // Fast path for modern browsers\n        if (store.getAllKeys) {\n            return promisifyRequest(store.getAllKeys());\n        }\n        const items = [];\n        return eachCursor(store, (cursor) => items.push(cursor.key)).then(() => items);\n    });\n}\n/**\n * Get all values in the store.\n *\n * @param customStore Method to get a custom store. Use with caution (see the docs).\n */\nfunction values(customStore = defaultGetStore()) {\n    return customStore('readonly', (store) => {\n        // Fast path for modern browsers\n        if (store.getAll) {\n            return promisifyRequest(store.getAll());\n        }\n        const items = [];\n        return eachCursor(store, (cursor) => items.push(cursor.value)).then(() => items);\n    });\n}\n/**\n * Get all entries in the store. Each entry is an array of `[key, value]`.\n *\n * @param customStore Method to get a custom store. Use with caution (see the docs).\n */\nfunction entries(customStore = defaultGetStore()) {\n    return customStore('readonly', (store) => {\n        // Fast path for modern browsers\n        // (although, hopefully we'll get a simpler path some day)\n        if (store.getAll && store.getAllKeys) {\n            return Promise.all([\n                promisifyRequest(store.getAllKeys()),\n                promisifyRequest(store.getAll()),\n            ]).then(([keys, values]) => keys.map((key, i) => [key, values[i]]));\n        }\n        const items = [];\n        return customStore('readonly', (store) => eachCursor(store, (cursor) => items.push([cursor.key, cursor.value])).then(() => items));\n    });\n}\n\n\n\n\n//# sourceURL=webpack://indexeddb/./node_modules/idb-keyval/dist/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;