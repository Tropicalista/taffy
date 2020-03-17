pluginWebpack([0],[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
    name: 'App'
});

/***/ }),
/* 7 */,
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuetable_2__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuetable_2___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vuetable_2__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vuetablecss_js__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vuetablecss_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__vuetablecss_js__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


//import VuetablePagination from "vuetable-2/src/components/VuetablePagination";

/* harmony default export */ __webpack_exports__["a"] = ({

    name: 'Home',

    data() {
        return {
            perPage: 10,
            data: [],
            mycss: __WEBPACK_IMPORTED_MODULE_1__vuetablecss_js___default.a
        };
    },
    watch: {
        data(newVal, oldVal) {
            console.log(newVal, oldVal);
            this.$refs.vuetable.refresh();
        }
    },
    mounted() {
        axios({
            method: 'get',
            url: 'taffylinks',
            baseURL: window.taffy.baseUrl + '/wp-json/wp/v2/'
        }).then(response => {
            //console.log(response)
            this.data = response.data;
            this.update();
        }).catch(error => {
            //console.log(error)
        });
    },
    methods: {
        update() {
            axios({
                method: 'post',
                url: '/redirects',
                data: this.data
            }).then(response => {
                //console.log(response)
            }).catch(error => {
                //console.log(error)
            });
        },
        delete(id) {
            let mm = this;
            axios({
                method: 'delete',
                url: '/taffylinks/' + id,
                baseURL: window.taffy.baseUrl + '/wp-json/wp/v2/'
            }).then(response => {
                mm.data.forEach((value, index) => {
                    if (value.id === id) {
                        mm.data.splice(index, 1);
                        this.$nextTick(() => {
                            // do something cool
                            mm.$refs.vuetable.refresh();
                        });
                    }
                });
                if (!mm.data.length) {
                    mm.data = [];
                }
            }).catch(error => {
                //console.log(error)
            });
        },
        onActionClicked(action, data) {
            if (action == 'delete') {
                this.delete(data.id);
            }
            if (action == 'edit') {
                this.$router.push({ name: 'Link', params: { id: data.id } });
            }
        },
        onPaginationData(paginationData) {
            this.$refs.pagination.setPaginationData(paginationData);
        },
        onChangePage(page) {
            this.$refs.vuetable.changePage(page);
        },
        dataManager(sortOrder, pagination) {
            if (this.data.length < 1) return;

            let local = this.data;

            // sortOrder can be empty, so we have to check for that as well
            if (sortOrder.length > 0) {
                //console.log("orderBy:", sortOrder[0].sortField, sortOrder[0].direction);
                const sortBy = key => {
                    return (a, b) => a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0;
                };
                local.concat().sort(sortBy("sortOrder"));

                /*local = _.orderBy(
                  local,
                  sortOrder[0].sortField,
                  sortOrder[0].direction
                );*/
            }

            pagination = this.$refs.vuetable.makePagination(local.length, this.perPage);

            //console.log('pagination:', pagination)
            let from = pagination.from - 1;
            let to = from + this.perPage;

            return {
                pagination: pagination,
                data: local.slice(from, to) // _.slice(local, from, to)
            };
        }
    },
    components: {
        Vuetable: __WEBPACK_IMPORTED_MODULE_0_vuetable_2___default.a
    }
});

/***/ }),
/* 9 */,
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Notification_vue__ = __webpack_require__(11);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["a"] = ({

    name: 'Link',

    data() {
        return {
            id: this.$route.params.id ? this.$route.params.id : '',
            spin: false,
            showNotice: false,
            noticeType: 'success',
            noticeMsg: '',
            rebrandlinks: {},
            taffylink: {
                title: '',
                content: '',
                redirect_type: '',
                link_type: 'custom'
            },
            redirects: [{ text: '301 Permanent', value: 301 }, { text: '302 Temporary', value: 302 }, { text: '307 Temporary (alternative)', value: 307 }],
            links: [{ text: 'Custom', value: 'custom' }, { text: 'Rebrandly', value: 'rebrandly' }]
        };
    },
    mounted() {
        let id = this.$route.params.id;
        if (this.$route.params.id) {
            axios({
                method: 'get',
                url: 'taffylinks/' + this.id,
                baseURL: window.taffy.baseUrl + '/wp-json/wp/v2/'
            }).then(response => {
                this.taffylink.title = response.data.title.rendered;
                this.taffylink.content = response.data.content;
                this.taffylink.redirect_type = response.data.redirect_type;
                this.taffylink.link_type = response.data.link_type;
                this.changeLink();
            }).catch(error => {
                console.log(error);
            });
        }
    },
    methods: {
        save() {

            this.spinner();

            axios({
                method: 'post',
                url: 'taffylinks/' + this.id,
                baseURL: window.taffy.baseUrl + '/wp-json/wp/v2/',
                data: {
                    id: this.$route.params.id,
                    title: this.taffylink.title,
                    status: 'publish',
                    redirect_type: this.taffylink.redirect_type,
                    link_type: this.taffylink.link_type,
                    //content: this.taffylink.link_type == 'custom' ? this.taffylink.content : 'http://' + this.taffylink.content
                    content: this.taffylink.content
                }
            }).then(response => {
                console.log(response);
                this.spinner();
                this.showNotice = true;
                this.noticeMsg = 'Link saved';
                this.update(response.data);
                this.noticeType = 'success';
            }).catch(error => {
                console.log(error);
                this.noticeType = 'error';
            });
        },
        update(data) {
            axios({
                method: 'put',
                url: '/redirects',
                data: data
            }).then(response => {
                console.log(response);
            }).catch(error => {
                console.log(error);
            });
        },
        changeLink() {
            if (this.taffylink.link_type == 'rebrandly') {

                fetch('https://api.rebrandly.com/v1/links?orderBy=createdAt&orderDir=desc&limit=100&favourite=false&status=active', {
                    method: 'GET',
                    headers: {
                        //this what's exactly look in my postman
                        'apikey': this.$store.getters.settings.rebrandly
                    }
                }).then(response => response.json()).then(responseJson => {
                    this.rebrandlinks = responseJson;
                    console.log(responseJson);
                }).catch(error => {
                    console.log(error);
                });
            }
        },
        changeRebrandly() {
            this.taffylink.title = this.taffylink.content.slashtag;
            this.taffylink.content = (this.taffylink.content.https ? 'https://' : 'http://') + this.taffylink.content.shortUrl;
        },
        spinner() {
            this.spin = !this.spin;
        }
    },
    components: {
        Notification: __WEBPACK_IMPORTED_MODULE_0__Notification_vue__["a" /* default */]
    }
});

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Notification_vue__ = __webpack_require__(12);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_19f0eefe_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Notification_vue__ = __webpack_require__(38);
var disposed = false
var normalizeComponent = __webpack_require__(1)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Notification_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_19f0eefe_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Notification_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets\\src\\admin\\components\\Notification.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-19f0eefe", Component.options)
  } else {
    hotAPI.reload("data-v-19f0eefe", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
  props: ['msg', 'type'],
  name: 'Notification',
  data() {
    return {
      show: false
    };
  },
  methods: {
    hide() {
      this.show = !this.show;
    }
  }
});

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_admin_components_Settings_vue__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_admin_components_Robots_vue__ = __webpack_require__(15);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
    data() {
        return {
            tabs: ["General", "Robots"],
            selected: "General",
            spin: false,
            loaded: false
        };
    },
    components: {
        General: __WEBPACK_IMPORTED_MODULE_0_admin_components_Settings_vue__["a" /* default */],
        Robots: __WEBPACK_IMPORTED_MODULE_1_admin_components_Robots_vue__["a" /* default */]
    }
});

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Robots_vue__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Notification_vue__ = __webpack_require__(11);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({

    name: 'Settings',
    computed: {
        settings() {
            return this.$store.getters.settings;
        }
    },
    data() {
        return {
            noticeType: 'success',
            showNotice: false,
            noticeMsg: '',
            robots: '',
            checker: false,
            customPath: '',
            custom: false,
            path: 'recommends',
            redirect_type: 302,
            options: [{ text: '-- custom --', value: 'custom' }, { text: 'recommends', value: 'recommends' }, { text: 'go', value: 'go' }, { text: 'out', value: 'out' }, { text: 'review', value: 'review' }, { text: 'suggests', value: 'suggests' }, { text: 'follow', value: 'follow' }, { text: 'goto', value: 'goto' }, { text: 'click', value: 'click' }, { text: 'move', value: 'move' }, { text: 'offer', value: 'offer' }],
            redirects: [{ text: '301 Permanent', value: 301 }, { text: '302 Temporary', value: 302 }, { text: '307 Temporary (alternative)', value: 307 }]
        };
    },
    mounted() {
        axios.get('/settings').then(result => {
            console.log(result);
            this.checker = result.data.is_home_writeable;
            this.robots = result.data.robots;
        });
    },
    methods: {
        setFolder(event) {
            this.custom = false;
            if (event.target.value == 'custom') {
                this.custom = true;
            }
        },
        create() {
            axios.post('/settings', this.settings).then(result => {
                this.$refs.showNotice.hide();
                this.noticeMsg = 'Settings saved';
                this.robots = result.data.robots;
                this.noticeType = 'success';
            }, error => {
                console.log(error);
                this.$refs.showNotice.hide();
                this.noticeMsg = error.message;
                this.noticeType = 'error';
            }).catch(error => {
                this.$refs.showNotice.hide();
                this.noticeMsg = error.message;
                this.noticeType = 'error';
                console.log(error);
            });
        }
    },
    components: {
        Robots: __WEBPACK_IMPORTED_MODULE_0__Robots_vue__["a" /* default */],
        Notification: __WEBPACK_IMPORTED_MODULE_1__Notification_vue__["a" /* default */]
    }
});

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Robots_vue__ = __webpack_require__(16);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0914ba5f_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Robots_vue__ = __webpack_require__(43);
var disposed = false
var normalizeComponent = __webpack_require__(1)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Robots_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0914ba5f_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Robots_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets\\src\\admin\\components\\Robots.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0914ba5f", Component.options)
  } else {
    hotAPI.reload("data-v-0914ba5f", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({

    name: 'Robots',
    props: ['robots'],
    data() {
        return {
            robotsUrl: window.taffy.baseUrl + '/robots.txt'
        };
    },
    mounted() {},
    methods: {
        create() {
            axios.post('/robots', {
                path: this.path
            });
        }
    }
});

/***/ }),
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _vue = __webpack_require__(3);

var _vue2 = _interopRequireDefault(_vue);

var _App = __webpack_require__(29);

var _App2 = _interopRequireDefault(_App);

var _router = __webpack_require__(33);

var _router2 = _interopRequireDefault(_router);

var _adminMenuFix = __webpack_require__(46);

var _adminMenuFix2 = _interopRequireDefault(_adminMenuFix);

var _store = __webpack_require__(47);

var _store2 = _interopRequireDefault(_store);

var _axios = __webpack_require__(18);

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.axios = _axios2.default;

_axios2.default.defaults.headers.common = {
	/* eslint-disable no-undef */
	'X-WP-Nonce': _nonce

	// apply interceptor on response
	/*axios.interceptors.response.use(
 	response => response,
 	errorResponseHandler
 );*/

};_axios2.default.defaults.baseURL = window.taffy.baseUrl + '/wp-json/taffy/api';

_vue2.default.config.productionTip = false;

_axios2.default.get('/config').then(function (r) {
	return r.data;
}).then(function (config) {
	_store2.default.commit('setConfig', config);

	/* eslint-disable no-new */
	new _vue2.default({
		el: '#vue-admin-app',
		router: _router2.default,
		store: _store2.default,
		render: function render(h) {
			return h(_App2.default);
		}
	});
});

// fix the admin menu for the slug "vue-app"
(0, _adminMenuFix2.default)('taffy');

/***/ }),
/* 28 */,
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_App_vue__ = __webpack_require__(6);
/* empty harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_200a6b1e_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_App_vue__ = __webpack_require__(32);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(30)
}
var normalizeComponent = __webpack_require__(1)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_App_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_200a6b1e_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_App_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets\\src\\admin\\App.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-200a6b1e", Component.options)
  } else {
    hotAPI.reload("data-v-200a6b1e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 30 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 31 */,
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { attrs: { id: "vue-backend-app" } }, [_c("router-view")], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-200a6b1e", esExports)
  }
}

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _vue = __webpack_require__(3);

var _vue2 = _interopRequireDefault(_vue);

var _vueRouter = __webpack_require__(7);

var _vueRouter2 = _interopRequireDefault(_vueRouter);

var _Home = __webpack_require__(34);

var _Home2 = _interopRequireDefault(_Home);

var _Link = __webpack_require__(37);

var _Link2 = _interopRequireDefault(_Link);

var _Settings = __webpack_require__(40);

var _Settings2 = _interopRequireDefault(_Settings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.use(_vueRouter2.default);

exports.default = new _vueRouter2.default({
    routes: [{
        path: '/',
        name: 'Home',
        component: _Home2.default
    }, {
        path: '/detail/:id?',
        name: 'Link',
        component: _Link2.default
    }, {
        path: '/settings',
        name: 'Settings',
        component: _Settings2.default
    }]
});

/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Home_vue__ = __webpack_require__(8);
/* empty harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_45e83875_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Home_vue__ = __webpack_require__(36);
var disposed = false
var normalizeComponent = __webpack_require__(1)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Home_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_45e83875_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Home_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets\\src\\admin\\components\\Home.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-45e83875", Component.options)
  } else {
    hotAPI.reload("data-v-45e83875", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  table: {
    tableWrapper: 'table-responsive',
    tableHeaderClass: 'fixed',
    tableBodyClass: 'fixed',
    tableClass: 'pure-table pure-table-horizontal',
    loadingClass: 'loading',
    ascendingIcon: 'icon-up-open',
    descendingIcon: 'icon-down-open',
    ascendingClass: 'sorted-asc',
    descendingClass: 'sorted-desc',
    sortableIcon: 'grey sort icon',
    handleIcon: 'grey sidebar icon'
  },

  pagination: {
    wrapperClass: 'pagination',
    activeClass: 'active large',
    disabledClass: 'disabled',
    pageClass: 'item',
    linkClass: 'icon item',
    paginationClass: 'ui bottom attached segment grid',
    paginationInfoClass: 'left floated left aligned six wide column',
    dropdownClass: 'ui search dropdown',
    icons: {
      first: 'icon-angle-double-left',
      prev: 'icon-left-chevron ',
      next: 'icon-right-open ',
      last: 'icon-angle-double-right'
    }
  },

  paginationInfo: {
    infoClass: 'left floated left aligned six wide column'
  }
};

/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "home" },
    [
      _c("h1", [
        _vm._v("Taffy Links\n        "),
        _c(
          "a",
          { staticClass: "page-title-action", attrs: { href: "#/detail/" } },
          [_vm._v("New Affiliate Link")]
        )
      ]),
      _vm._v(" "),
      _c("vuetable", {
        ref: "vuetable",
        attrs: {
          "api-mode": false,
          "per-page": _vm.perPage,
          "data-manager": _vm.dataManager,
          fields: [
            "title",
            "cloaked url",
            "link destination",
            "redirect_type",
            "link type",
            "edit"
          ],
          css: _vm.mycss.table
        },
        scopedSlots: _vm._u([
          {
            key: "title",
            fn: function(props) {
              return _c("div", {}, [
                _c("a", { attrs: { href: "#/detail/" + props.rowData.id } }, [
                  _vm._v(_vm._s(props.rowData.title.rendered))
                ])
              ])
            }
          },
          {
            key: "link type",
            fn: function(props) {
              return _c("div", {}, [
                _c("a", { attrs: { href: "#/detail/" + props.rowData.id } }, [
                  _vm._v(_vm._s(props.rowData.link_type))
                ])
              ])
            }
          },
          {
            key: "cloaked url",
            fn: function(props) {
              return _c("div", {}, [
                _c("input", {
                  attrs: { type: "text", readonly: "" },
                  domProps: { value: props.rowData.link }
                })
              ])
            }
          },
          {
            key: "redirect_type",
            fn: function(props) {
              return _c("div", {}, [
                _vm._v(
                  "\n        " +
                    _vm._s(
                      props.rowData.link_type == "rebrandly"
                        ? "301"
                        : props.rowData.redirect_type
                    ) +
                    "\n    "
                )
              ])
            }
          },
          {
            key: "link destination",
            fn: function(props) {
              return _c("div", {}, [
                _c("input", {
                  attrs: { type: "text", readonly: "" },
                  domProps: { value: props.rowData.content }
                })
              ])
            }
          },
          {
            key: "edit",
            fn: function(props) {
              return _c("div", {}, [
                _c(
                  "button",
                  {
                    staticClass: "pure-button pure-button-primary",
                    on: {
                      click: function($event) {
                        _vm.onActionClicked("edit", props.rowData)
                      }
                    }
                  },
                  [
                    _c("i", {
                      staticClass: "dashicons dashicons-welcome-write-blog"
                    })
                  ]
                ),
                _vm._v(" "),
                _c(
                  "button",
                  {
                    staticClass: "pure-button button-error",
                    on: {
                      click: function($event) {
                        _vm.onActionClicked("delete", props.rowData)
                      }
                    }
                  },
                  [_c("i", { staticClass: "dashicons dashicons-no" })]
                )
              ])
            }
          }
        ])
      })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-45e83875", esExports)
  }
}

/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Link_vue__ = __webpack_require__(10);
/* empty harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_abde23e0_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Link_vue__ = __webpack_require__(39);
var disposed = false
var normalizeComponent = __webpack_require__(1)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Link_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_abde23e0_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Link_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets\\src\\admin\\components\\Link.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-abde23e0", Component.options)
  } else {
    hotAPI.reload("data-v-abde23e0", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      directives: [
        { name: "show", rawName: "v-show", value: _vm.show, expression: "show" }
      ],
      staticClass: "alert",
      class: [_vm.type]
    },
    [
      _c("span", { staticClass: "closebtn" }, [
        _c("i", {
          staticClass: "dashicons dashicons-no",
          on: { click: _vm.hide }
        })
      ]),
      _vm._v(" "),
      _c("strong", [_vm._v(_vm._s(_vm.msg))])
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-19f0eefe", esExports)
  }
}

/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "home" },
    [
      _c(
        "h1",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: !_vm.$route.params.id,
              expression: "!$route.params.id"
            }
          ]
        },
        [_vm._v("New Affiliate Link")]
      ),
      _vm._v(" "),
      _c(
        "h1",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: _vm.$route.params.id,
              expression: "$route.params.id"
            }
          ]
        },
        [_vm._v("Edit Affiliate Link")]
      ),
      _vm._v(" "),
      _c("Notification", {
        directives: [
          {
            name: "show",
            rawName: "v-show",
            value: _vm.showNotice,
            expression: "showNotice"
          }
        ],
        attrs: { msg: _vm.noticeMsg, type: _vm.noticeType }
      }),
      _vm._v(" "),
      _c("div", { staticClass: "pure-g" }, [
        _c("div", { staticClass: "pure-u-1" }, [
          _c(
            "form",
            { staticClass: "form-settings pure-form pure-form-stacked" },
            [
              _c("fieldset", [
                _c("label", { attrs: { for: "name" } }, [_vm._v("Link type")]),
                _vm._v(" "),
                _c(
                  "select",
                  {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.taffylink.link_type,
                        expression: "taffylink.link_type"
                      }
                    ],
                    staticClass: "pure-input-1-4",
                    on: {
                      change: [
                        function($event) {
                          var $$selectedVal = Array.prototype.filter
                            .call($event.target.options, function(o) {
                              return o.selected
                            })
                            .map(function(o) {
                              var val = "_value" in o ? o._value : o.value
                              return val
                            })
                          _vm.$set(
                            _vm.taffylink,
                            "link_type",
                            $event.target.multiple
                              ? $$selectedVal
                              : $$selectedVal[0]
                          )
                        },
                        _vm.changeLink
                      ]
                    }
                  },
                  _vm._l(_vm.links, function(l) {
                    return _c("option", { domProps: { value: l.value } }, [
                      _vm._v(
                        "\n                        " +
                          _vm._s(l.text) +
                          "\n                        "
                      )
                    ])
                  })
                ),
                _vm._v(" "),
                _c("span", { staticClass: "pure-form-message" }, [
                  _vm._v("This is the link type you want to add.")
                ]),
                _vm._v(" "),
                _c("label", { attrs: { for: "name" } }, [_vm._v("Name")]),
                _vm._v(" "),
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.taffylink.title,
                      expression: "taffylink.title"
                    }
                  ],
                  staticClass: "pure-input-2-3",
                  attrs: { id: "name", type: "text", placeholder: "Name" },
                  domProps: { value: _vm.taffylink.title },
                  on: {
                    input: function($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.$set(_vm.taffylink, "title", $event.target.value)
                    }
                  }
                }),
                _vm._v(" "),
                _c("span", { staticClass: "pure-form-message" }, [
                  _vm._v("Add a name for your affiliate link.")
                ]),
                _vm._v(" "),
                _vm.taffylink.link_type != "custom"
                  ? _c("div", [
                      _c("label", { attrs: { for: "name" } }, [
                        _vm._v("Rebrandly links")
                      ]),
                      _vm._v(" "),
                      _c(
                        "select",
                        {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model",
                              value: _vm.taffylink.content,
                              expression: "taffylink.content"
                            }
                          ],
                          staticClass: "pure-input-1-4",
                          on: {
                            change: [
                              function($event) {
                                var $$selectedVal = Array.prototype.filter
                                  .call($event.target.options, function(o) {
                                    return o.selected
                                  })
                                  .map(function(o) {
                                    var val = "_value" in o ? o._value : o.value
                                    return val
                                  })
                                _vm.$set(
                                  _vm.taffylink,
                                  "content",
                                  $event.target.multiple
                                    ? $$selectedVal
                                    : $$selectedVal[0]
                                )
                              },
                              function($event) {
                                _vm.changeRebrandly()
                              }
                            ]
                          }
                        },
                        _vm._l(_vm.rebrandlinks, function(l) {
                          return _c("option", { domProps: { value: l } }, [
                            _vm._v(
                              "\n                        " +
                                _vm._s(l.title) +
                                "\n                        "
                            )
                          ])
                        })
                      ),
                      _vm._v(" "),
                      _c("span", { staticClass: "pure-form-message" }, [
                        _vm._v(
                          "This is the type of redirect Taffy will use to redirect the user to your affiliate link."
                        )
                      ])
                    ])
                  : _vm._e(),
                _vm._v(" "),
                _vm.taffylink.link_type == "custom"
                  ? _c("div", [
                      _c("label", { attrs: { for: "url" } }, [
                        _vm._v("Destination URL")
                      ]),
                      _vm._v(" "),
                      _c("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.taffylink.content,
                            expression: "taffylink.content"
                          }
                        ],
                        staticClass: "pure-input-2-3",
                        attrs: {
                          id: "url",
                          type: "url",
                          placeholder: "Destination url to be cloaked"
                        },
                        domProps: { value: _vm.taffylink.content },
                        on: {
                          input: function($event) {
                            if ($event.target.composing) {
                              return
                            }
                            _vm.$set(
                              _vm.taffylink,
                              "content",
                              $event.target.value
                            )
                          }
                        }
                      }),
                      _vm._v(" "),
                      _c("span", { staticClass: "pure-form-message" }, [
                        _vm._v(
                          "This is the link that will be cloaked. Paste here your affiliate link"
                        )
                      ])
                    ])
                  : _vm._e(),
                _vm._v(" "),
                _vm.taffylink.link_type == "custom"
                  ? _c("div", [
                      _c("label", { attrs: { for: "name" } }, [
                        _vm._v("Link redirect type")
                      ]),
                      _vm._v(" "),
                      _c(
                        "select",
                        {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model",
                              value: _vm.taffylink.redirect_type,
                              expression: "taffylink.redirect_type"
                            }
                          ],
                          staticClass: "pure-input-1-4",
                          on: {
                            change: function($event) {
                              var $$selectedVal = Array.prototype.filter
                                .call($event.target.options, function(o) {
                                  return o.selected
                                })
                                .map(function(o) {
                                  var val = "_value" in o ? o._value : o.value
                                  return val
                                })
                              _vm.$set(
                                _vm.taffylink,
                                "redirect_type",
                                $event.target.multiple
                                  ? $$selectedVal
                                  : $$selectedVal[0]
                              )
                            }
                          }
                        },
                        [
                          _c("option", { attrs: { value: "" } }, [
                            _vm._v("Default globally defined")
                          ]),
                          _vm._v(" "),
                          _vm._l(_vm.redirects, function(r) {
                            return _c(
                              "option",
                              { domProps: { value: r.value } },
                              [
                                _vm._v(
                                  "\n                        " +
                                    _vm._s(r.text) +
                                    "\n                        "
                                )
                              ]
                            )
                          })
                        ],
                        2
                      ),
                      _vm._v(" "),
                      _c("span", { staticClass: "pure-form-message" }, [
                        _vm._v(
                          "This is the type of redirect Taffy will use to redirect the user to your affiliate link."
                        )
                      ])
                    ])
                  : _vm._e(),
                _vm._v(" "),
                _c(
                  "button",
                  {
                    staticClass: "pure-button",
                    on: {
                      click: function($event) {
                        $event.preventDefault()
                        _vm.$router.push("/")
                      }
                    }
                  },
                  [_vm._v("Go back")]
                ),
                _vm._v(" "),
                _c(
                  "button",
                  {
                    staticClass: "pure-button pure-button-primary",
                    attrs: { type: "submit" },
                    on: {
                      click: function($event) {
                        $event.preventDefault()
                        _vm.save()
                      }
                    }
                  },
                  [
                    _vm._v("Save link "),
                    _vm.spin
                      ? _c("i", {
                          staticClass: "dashicons dashicons-update spin"
                        })
                      : _vm._e()
                  ]
                )
              ])
            ]
          )
        ])
      ])
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-abde23e0", esExports)
  }
}

/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Settings_vue__ = __webpack_require__(13);
/* empty harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5da132b1_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Settings_vue__ = __webpack_require__(45);
var disposed = false
var normalizeComponent = __webpack_require__(1)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Settings_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5da132b1_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Settings_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets\\src\\admin\\views\\Settings.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5da132b1", Component.options)
  } else {
    hotAPI.reload("data-v-5da132b1", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Settings_vue__ = __webpack_require__(14);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_41e04eb9_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Settings_vue__ = __webpack_require__(44);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(42)
}
var normalizeComponent = __webpack_require__(1)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-41e04eb9"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Settings_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_41e04eb9_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Settings_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets\\src\\admin\\components\\Settings.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-41e04eb9", Component.options)
  } else {
    hotAPI.reload("data-v-41e04eb9", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 42 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 43 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "app-settings" }, [
    _c("h1", [_vm._v("Settings")]),
    _vm._v(" "),
    _c("form", { staticClass: "pure-form pure-form-aligned" }, [
      _c("fieldset", [
        _c("div", { staticClass: "pure-control-group" }, [
          _c("label", { attrs: { for: "foo" } }, [_vm._v("robots.txt")]),
          _vm._v(" "),
          _c("textarea", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.robots,
                expression: "robots"
              }
            ],
            staticClass: "pure-input-1-2",
            attrs: { placeholder: "Your robots.txt content", rows: "15" },
            domProps: { value: _vm.robots },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.robots = $event.target.value
              }
            }
          }),
          _vm._v(" "),
          _c("span", { staticClass: "pure-form-message-inline" }, [
            _vm._v("This is the content of your "),
            _c("a", { attrs: { href: _vm.robotsUrl, target: "_blank" } }, [
              _vm._v("robots.txt")
            ]),
            _vm._v(".")
          ])
        ]),
        _vm._v(" "),
        _c(
          "div",
          {
            directives: [
              {
                name: "show",
                rawName: "v-show",
                value: false,
                expression: "false"
              }
            ]
          },
          [
            _c(
              "button",
              {
                staticClass: "pure-button pure-button-primary",
                attrs: { type: "submit" },
                on: {
                  click: function($event) {
                    $event.preventDefault()
                    _vm.create($event)
                  }
                }
              },
              [_vm._v("Save robots.txt")]
            )
          ]
        )
      ])
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-0914ba5f", esExports)
  }
}

/***/ }),
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "app-settings" },
    [
      _c("Notification", {
        ref: "showNotice",
        attrs: { msg: _vm.noticeMsg, type: _vm.noticeType }
      }),
      _vm._v(" "),
      _c("p", [_vm._v("Settings: " + _vm._s(_vm.settings))]),
      _vm._v(" "),
      _c("form", { staticClass: "pure-form pure-form-aligned" }, [
        _c("fieldset", [
          _c("div", { staticClass: "pure-control-group" }, [
            _c("label", { attrs: { for: "name" } }, [
              _vm._v("Is home writeable?")
            ]),
            _vm._v(" "),
            _c("span", [_vm._v(_vm._s(_vm.checker ? "Yes" : "No"))]),
            _vm._v(" "),
            _c("span", { staticClass: "pure-form-message-inline" }, [
              _vm._v("Taffy needs to make changes to your robots.txt file.")
            ])
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "pure-control-group" }, [
            _c("label", { attrs: { for: "name" } }, [_vm._v("Link prefix")]),
            _vm._v(" "),
            _c(
              "select",
              {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.settings.path,
                    expression: "settings.path"
                  }
                ],
                staticClass: "pure-input-1-4",
                on: {
                  change: [
                    function($event) {
                      var $$selectedVal = Array.prototype.filter
                        .call($event.target.options, function(o) {
                          return o.selected
                        })
                        .map(function(o) {
                          var val = "_value" in o ? o._value : o.value
                          return val
                        })
                      _vm.$set(
                        _vm.settings,
                        "path",
                        $event.target.multiple
                          ? $$selectedVal
                          : $$selectedVal[0]
                      )
                    },
                    function($event) {
                      _vm.setFolder($event)
                    }
                  ]
                }
              },
              _vm._l(_vm.options, function(option) {
                return _c("option", { domProps: { value: option.value } }, [
                  _vm._v(
                    "\n                    " +
                      _vm._s(option.text) +
                      "\n                    "
                  )
                ])
              })
            ),
            _vm._v(" "),
            _c("span", { staticClass: "pure-form-message-inline" }, [
              _vm._v(
                "The prefix that comes before your cloaked link's slug. eg. http://myplugintest.com/" +
                  _vm._s(_vm.path) +
                  "/your-affiliate-link-name."
              )
            ])
          ]),
          _vm._v(" "),
          _c(
            "div",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: _vm.custom,
                  expression: "custom"
                }
              ],
              staticClass: "pure-control-group"
            },
            [
              _c("label", { attrs: { for: "foo" } }, [
                _vm._v("Custom Link prefix")
              ]),
              _vm._v(" "),
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.settings.customPath,
                    expression: "settings.customPath"
                  }
                ],
                staticClass: "pure-input-1-4",
                attrs: { type: "text" },
                domProps: { value: _vm.settings.customPath },
                on: {
                  input: function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.$set(_vm.settings, "customPath", $event.target.value)
                  }
                }
              }),
              _vm._v(" "),
              _c("span", { staticClass: "pure-form-message-inline" }, [
                _vm._v("Enter your preferred link prefix.")
              ])
            ]
          ),
          _vm._v(" "),
          _c("div", { staticClass: "pure-control-group" }, [
            _c("label", { attrs: { for: "name" } }, [
              _vm._v("Link redirect type")
            ]),
            _vm._v(" "),
            _c(
              "select",
              {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.settings.redirect_type,
                    expression: "settings.redirect_type"
                  }
                ],
                staticClass: "pure-input-1-4",
                on: {
                  change: function($event) {
                    var $$selectedVal = Array.prototype.filter
                      .call($event.target.options, function(o) {
                        return o.selected
                      })
                      .map(function(o) {
                        var val = "_value" in o ? o._value : o.value
                        return val
                      })
                    _vm.$set(
                      _vm.settings,
                      "redirect_type",
                      $event.target.multiple ? $$selectedVal : $$selectedVal[0]
                    )
                  }
                }
              },
              _vm._l(_vm.redirects, function(r) {
                return _c("option", { domProps: { value: r.value } }, [
                  _vm._v(
                    "\n                    " +
                      _vm._s(r.text) +
                      "\n                    "
                  )
                ])
              })
            ),
            _vm._v(" "),
            _c("span", { staticClass: "pure-form-message-inline" }, [
              _vm._v(
                "This is the type of redirect Taffy will use to redirect the user to your affiliate link."
              )
            ])
          ]),
          _vm._v(" "),
          _c("hr"),
          _vm._v(" "),
          _c("div", { staticClass: "pure-control-group" }, [
            _c("label", { attrs: { for: "key" } }, [_vm._v("Rebrandly")]),
            _vm._v(" "),
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.settings.rebrandly,
                  expression: "settings.rebrandly"
                }
              ],
              staticClass: "pure-input-1-4",
              attrs: { type: "text" },
              domProps: { value: _vm.settings.rebrandly },
              on: {
                input: function($event) {
                  if ($event.target.composing) {
                    return
                  }
                  _vm.$set(_vm.settings, "rebrandly", $event.target.value)
                }
              }
            }),
            _vm._v(" "),
            _c("span", { staticClass: "pure-form-message-inline" }, [
              _vm._v("Enter your Rebrandly API key.")
            ])
          ]),
          _vm._v(" "),
          _c("div", [
            _c(
              "button",
              {
                staticClass: "pure-button pure-button-primary",
                attrs: { type: "submit", disabled: !_vm.checker },
                on: {
                  click: function($event) {
                    $event.preventDefault()
                    _vm.create($event)
                  }
                }
              },
              [_vm._v("Save settings "), _c("i", {})]
            )
          ])
        ])
      ]),
      _vm._v(" "),
      _c("robots", { attrs: { robots: _vm.robots } })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-41e04eb9", esExports)
  }
}

/***/ }),
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "app-settings" },
    [
      _c("h1", [_vm._v("Settings")]),
      _vm._v(" "),
      _c(
        "h1",
        { staticClass: "nav-tab-wrapper" },
        _vm._l(_vm.tabs, function(tab) {
          return _c(
            "a",
            {
              key: tab,
              staticClass: "nav-tab",
              class: { "nav-tab-active": _vm.selected == tab },
              on: {
                click: function($event) {
                  _vm.selected = tab
                }
              }
            },
            [_vm._v("\n\t\t\t\t" + _vm._s(tab) + "\n\t\t\t")]
          )
        })
      ),
      _vm._v(" "),
      _c("br"),
      _vm._v(" "),
      _c(_vm.selected, { tag: "component" })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-5da132b1", esExports)
  }
}

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * As we are using hash based navigation, hack fix
 * to highlight the current selected menu
 *
 * Requires jQuery
 */
function menuFix(slug) {
    var $ = jQuery;

    // Remove stupid css for admin
    //jQuery('body').removeClass('wp-core-ui wp-admin');

    var menuRoot = $('#toplevel_page_' + slug);
    var currentUrl = window.location.href;
    var currentPath = currentUrl.substr(currentUrl.indexOf('admin.php'));

    menuRoot.on('click', 'a', function () {
        var self = $(this);

        $('ul.wp-submenu li', menuRoot).removeClass('current');

        if (self.hasClass('wp-has-submenu')) {
            $('li.wp-first-item', menuRoot).addClass('current');
        } else {
            self.parents('li').addClass('current');
        }
    });

    $('ul.wp-submenu a', menuRoot).each(function (index, el) {
        if ($(el).attr('href') === currentPath) {
            $(el).parent().addClass('current');
            return;
        }
    });
}

exports.default = menuFix;

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _vue = __webpack_require__(3);

var _vue2 = _interopRequireDefault(_vue);

var _vuex = __webpack_require__(17);

var _vuex2 = _interopRequireDefault(_vuex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.use(_vuex2.default);

var store = new _vuex2.default.Store({
	state: {
		settings: {
			redirect_type: 302,
			path: 'go',
			rebrandly: '',
			bitly: ''
		}
	},
	mutations: {
		setConfig: function setConfig(state, settings) {
			state.settings = Object.assign(state.settings, settings);
		}
	},
	getters: {
		settings: function settings(state) {
			return state.settings;
		}
	},
	actions: {
		storeSettings: function storeSettings() {
			axios.post('/settings', {
				settings: state.settings
			});
		}
	}
});

exports.default = store;

/***/ })
],[27]);