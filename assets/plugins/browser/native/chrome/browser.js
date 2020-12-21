(function () {
	var requirejs,
	require,
	define;
	(function (e) {
		function i(e, i) {
			if (e && "." === e.charAt(0) && i) {
				i = i.split("/"),
				i = i.slice(0, i.length - 1),
				e = i.concat(e.split("/"));
				var n,
				t;
				for (n = 0; t = e[n]; n++)
					if ("." === t)
						e.splice(n, 1), n -= 1;
					else if (".." === t) {
						if (1 === n && (".." === e[2] || ".." === e[0]))
							break;
						n > 0 && (e.splice(n - 1, 2), n -= 2)
					}
				e = e.join("/")
			}
			return e
		}
		function n(i, n) {
			return function () {
				return r.apply(e, c.call(arguments, 0).concat([i, n]))
			}
		}
		function t(e) {
			return function (n) {
				return i(n, e)
			}
		}
		function a(e) {
			return function (i) {
				d[e] = i
			}
		}
		function o(i) {
			if (p.hasOwnProperty(i)) {
				var n = p[i];
				delete p[i],
				l.apply(e, n)
			}
			return d[i]
		}
		function s(e, n) {
			var a,
			s,
			l = e.indexOf("!");
			return -1 !== l ? (a = i(e.slice(0, l), n), e = e.slice(l + 1), s = o(a), e = s && s.normalize ? s.normalize(e, t(n)) : i(e, n)) : e = i(e, n), {
				f : a ? a + "!" + e : e,
				n : e,
				p : s
			}
		}
		var l,
		r,
		d = {},
		p = {},
		c = [].slice;
		"function" != typeof define && (l = function (i, t, l, r) {
			var c,
			u,
			m,
			f,
			v,
			y,
			h = [];
			if (r || (r = i), "function" == typeof l) {
				for (!t.length && l.length && (t = ["require", "exports", "module"]), f = 0; t.length > f; f++)
					if (y = s(t[f], r), m = y.f, "require" === m)
						h[f] = n(i);
					else if ("exports" === m)
						h[f] = d[i] = {},
				c = !0;
				else if ("module" === m)
					u = h[f] = {
						id : i,
						uri : "",
						exports : d[i]
					};
				else if (d.hasOwnProperty(m) || p.hasOwnProperty(m))
					h[f] = o(m);
				else {
					if (!y.p)
						throw i + " missing " + m;
					y.p.load(y.n, n(r, !0), a(m), {}),
					h[f] = d[m]
				}
				v = l.apply(d[i], h),
				i && (u && u.exports !== e ? d[i] = u.exports : c || (d[i] = v))
			} else
				i && (d[i] = l)
		}, requirejs = r = function (i, n, t, a) {
			return "string" == typeof i ? o(s(i, n).f) : (i.splice || (n.splice ? (i = n, n = arguments[2]) : i = []), a ? l(e, i, n, t) : setTimeout(function () {
					l(e, i, n, t)
				}, 15), r)
		}, r.config = function () {
			return r
		}, require || (require = r), define = function (e, i, n) {
			i.splice || (n = i, i = []),
			define.unordered ? p[e] = [e, i, n] : l(e, i, n)
		}, define.amd = {
				jQuery : !0
			})
	})(),
	define("dependencies/almond/almond", function () {}),
	define("core/lib/error", ["require", "exports", "module"], function (e, i, n) {
		n.exports = {
			wrap : function (e, i) {
				return function () {
					try {
						return e.apply(null, arguments)
					} catch (n) {
						var t = "";
						void 0 !== i && (t = ' (during "' + (i >= 0 ? arguments[i] : i) + '")'),
						console.error(n.name + ": " + n.message + t),
						console.log(n && n.stack || n)
					}
				}
			},
			wrapAll : function (e, i) {
				for (var t in e)
					"function" == typeof e[t] && (e[t] = n.exports.wrap(e[t], i ? i + t : t))
			}
		}
	}),
	define("core/lib/events", ["require", "exports", "module", "./error"], function (e, i, n) {
		function t(e, i, t, a) {
			if (a = a || [], !e)
				throw "type must be truthy";
			if (!i || null === i || "function" != typeof i)
				throw "Could not add listener for event '" + e + "' " + (i ? "this listener isn't a function" : "this listener is undefined");
			s[e] = s[e] || [];
			for (var l = 0; s[e].length > l; l++)
				if (s[e][l] && s[e][l].origFunc === i)
					return console.warn("Could not add listener for event '" + e + "' this listener is already registered on this event"), void 0;
			0 === s[e].length && n.exports.emit("event.type.added", [e], !0),
			s[e].push({
				origFunc : i,
				func : o.wrap(i, e),
				once : !!t,
				paramMatch : a
			})
		}
		function a(e, i, n) {
			n ? e.func.apply(void 0, i) : setTimeout(function () {
				e.func.apply(void 0, i)
			}, 1)
		}
		var o = e("./error"),
		s = {};
		n.exports = {
			on : function (e, i, n) {
				t(e, i, !1, n)
			},
			once : function (e, i, n) {
				t(e, i, !0, n)
			},
			emit : function (e, i, t) {
				i = i || [],
				t = t || void 0 === t,
				s[e] && s[e].forEach(function (e, o, s) {
					var l = e.paramMatch.every(function (e, t) {
							return i[t] && i[t].webviewId && e ? e.webviewId === i[t].webviewId : e === i[t] || e === n.exports.FILTER_ANY
						});
					l && (a(e, i, t), e.once && delete s[o])
				})
			},
			clear : function (e) {
				e && delete s[e]
			},
			un : function (e, i) {
				e && i && s[e] && (s[e] = s[e].filter(function (n) {
							return !((n.func === i || n.origFunc === i) && -1 !== s[e].indexOf(n))
						}), 0 === s[e].length && n.exports.emit("event.type.removed", [e], !0))
			},
			isOn : function (e) {
				return s[e] ? s[e] !== void 0 && 0 !== s[e].length : !1
			},
			FILTER_ANY : {}

		}
	}),
	define("core/lib/rpc/rpc.view", ["require", "exports", "module", "../events"], function (e, i, n) {
		function t(e, i, n) {
			n = n || {};
			var t = {
				messageType : e
			};
			return t.messageType && "string" == typeof t.messageType ? (t.message = i, qnx.callExtensionMethod("webplatform.rpc", JSON.stringify(t)), void 0) : Error("Message type is required")
		}
		function a(e, i) {
			d.on("rpc." + e, i)
		}
		function o(e, i) {
			d.once("rpc." + e, i)
		}
		function s(e, i) {
			d.un("rpc." + e, i)
		}
		function l(e, i, n) {
			d.emit("rpc." + e, i, n)
		}
		var r,
		d = e("../events");
		r = {
			postMessage : t,
			on : a,
			un : s,
			once : o,
			emit : l
		},
		n.exports = r
	}),
	define("core/lib/pps/pps", ["require", "exports", "module", "../error"], function (e, i, n) {
		function t() {
			var e = o++;
			return window.isFinite(e) || (o = 0, e = 0),
			e
		}
		var a,
		o = 0,
		s = {};
		a = {
			PPSMode : {
				FULL : 0,
				DELTA : 1,
				SERVER : 2,
				RAW : 3
			},
			FileMode : {
				RDONLY : 0,
				WRONLY : 1,
				RDWR : 2,
				CREATE : 256
			},
			create : function (e, i) {
				function n() {
					return s.hasOwnProperty(c)
				}
				function a() {
					delete s[c]
				}
				function o(e, i) {
					var n = JSON.parse(qnx.callExtensionMethod("pps.open", c, u, m, e, i));
					return n.result ? (s[c] = this, d = n.data, !0) : !1
				}
				function l(e) {
					return n() ? "true" === qnx.callExtensionMethod("pps.write", c, JSON.stringify(e)) : !1
				}
				function r() {
					n() && qnx.callExtensionMethod("pps.close", c)
				}
				var d,
				p,
				c = t(),
				u = e,
				m = i;
				return p = {
					open : o,
					write : l,
					close : r,
					onFirstReadComplete : void 0,
					onNewData : void 0,
					onOpenFailed : function (e) {
						console.log("PPS Connection - open failed: " + e)
					},
					onWriteFailed : function (e) {
						console.log("PPS Connection - write failed: " + e)
					},
					onClosed : a
				},
				p.__defineGetter__("mode", function () {
					return i
				}),
				p.__defineGetter__("data", function () {
					return d
				}),
				p.__defineGetter__("path", function () {
					return u
				}),
				p
			},
			onEvent : function (e, i, n) {
				if (i && s.hasOwnProperty(e)) {
					var t = s[e],
					a = "on" + i;
					t.hasOwnProperty(a) && t[a] && (("FirstReadComplete" === i || "NewData" === i) && (n = JSON.parse(n), t._data = n), t[a](n))
				}
			}
		},
		e("../error").wrapAll(a, "pps."),
		n.exports = a
	}),
	define("core/lib/pps/jpps", ["require", "exports", "module"], function (e, i, n) {
		var t,
		a = "libjpps",
		o = a + ".PPS";
		t = {
			create : function () {
				var e = {
					m_strObjId : null,
					ppsObj : {}

				};
				return JNEXT.require(a) ? (e.m_strObjId = JNEXT.createObject(o), "" === e.m_strObjId ? (console.error('JNext could not create the native PPS object "' + o + '". PPS is unavailable.'), !1) : (e.open = function (i, n, t) {
						var a = i + " " + n + (t ? " " + t : ""),
						o = JNEXT.invoke(e.m_strObjId, "Open", a),
						s = o.split(" ");
						return "Ok" !== s[0] ? (console.error(o), !1) : !0
					}, e.read = function () {
						var i,
						n = JNEXT.invoke(e.m_strObjId, "Read"),
						t = n.split(" ");
						return "Ok" !== t[0] ? (console.error(n), !1) : (i = n.substr(t[0].length + 1), e.ppsObj = JSON.parse(i), !0)
					}, e.write = function (i) {
						var n = JSON.stringify(i),
						t = JNEXT.invoke(e.m_strObjId, "Write", n),
						a = t.split(" ");
						return "Ok" !== a[0] ? (console.error(t), !1) : !0
					}, e.close = function () {
						var i = JNEXT.invoke(e.m_strObjId, "Close");
						i = JNEXT.invoke(e.m_strObjId, "Dispose"),
						JNEXT.unregisterEvents(e)
					}, e.getId = function () {
						return e.m_strObjId
					}, e.onEvent = function (i) {
						var n,
						t,
						a = i.split(" "),
						o = a[0];
						switch (o) {
						case "Error":
							e.onError();
							break;
						case "OnChange":
							n = i.substr(o.length + 1),
							t = JSON.parse(n),
							e.ppsObj = t.allData,
							e.ppsData = {},
							e.ppsData[t.changeData.objName] = t.allData,
							null !== e.onChange && e.onChange(t.changeData)
						}
					}, e.onError = function () {
						console.error("PPS onError() handler.")
					}, JNEXT.registerEvents(e), e)) : (console.error('Unable to load "' + a + '". PPS is unavailable.'), !1)
			}
		},
		n.exports = t
	}),
	define("core/lib/pps/ppsUtils", ["require", "exports", "module", "./pps", "./jpps"], function (e, i, n) {
		var t,
		a = e("./pps"),
		o = e("./jpps");
		t = {
			PPSMode : {
				FULL : 0,
				DELTA : 1,
				SERVER : 2,
				RAW : 4,
				WAIT : 8
			},
			FileMode : {
				RDONLY : 0,
				WRONLY : 1,
				RDWR : 2,
				CREATE : 256
			},
			create : function (e, i) {
				var n,
				s;
				return i === a.PPSMode.FULL ? (n = a.create(e, i), n.onOpenFailed = function (e) {
					n.onError(e)
				}, n.onWriteFailed = function (e) {
					n.onError(e)
				}) : (s = function () {
					function n(e, i) {
						var n = e,
						a = [];
						return i !== t.PPSMode.FULL && ((i | t.PPSMode.DELTA) === i && a.push("delta"), a.length >= 1 && (n += "?" + a.join(","))),
						n
					}
					var a,
					s,
					l,
					r = e.split("/").pop().split("?").shift(),
					d = n(e, i);
					return a = o.create(),
					l = {
						open : function (e, i) {
							var n = a.open(d, e, i);
							return n && a.read() && (s = {}, s[r] = a.ppsObj, this.onFirstReadComplete && "function" == typeof this.onFirstReadComplete && this.onFirstReadComplete(s)),
							n
						},
						write : function (e) {
							return a.write(e)
						},
						close : function () {
							a.close()
						},
						onFirstReadComplete : void 0,
						onNewData : void 0,
						onClosed : void 0
					},
					l.__defineGetter__("mode", function () {
						return i
					}),
					l.__defineGetter__("data", function () {
						return a.ppsData || s
					}),
					l.__defineGetter__("path", function () {
						return d
					}),
					a.onChange = function (e) {
						l.onNewData && "function" == typeof l.onNewData && l.onNewData(e)
					},
					l
				}, n = s()),
				n
			},
			read : function (e, i) {
				i = i || {};
				var n,
				t,
				o = i.ppsMode || a.PPSMode.FULL,
				s = i.fileMode || a.FileMode.RDONLY,
				l = this.create(e, o);
				if (l ? l.open(s) ? (l.close(), t = l.data) : n = "Failed to open PPS object with path " + e + " and with mode " + s : n = "Failed to create a PPS object with path " + e + " and with mode " + o, n)
					throw n;
				return t
			},
			write : function (e, i, n) {
				n = n || {};
				var o,
				s = n.ppsMode || a.PPSMode.FULL,
				l = n.fileMode || a.FileMode.RDWR,
				r = n.encode ? n.encode : !1,
				d = this.create(i, s);
				if (d ? d.open(l) ? (e = r ? t.encode(e) : e, d.write(e) || (o = "Failed to write data to PPS object with path " + i), d.close()) : o = "Failed to open PPS object with path " + i + " and with mode " + l : o = "Failed to create a PPS object with path " + i + " and with mode " + s, o)
					throw o
			},
			encode : function (e) {
				var i,
				n,
				t = "";
				for (i in e)
					t += i + ":", n = e[i], "string" == typeof n ? t += ":" + n : "number" == typeof n ? t += "n:" + n : "boolean" == typeof n ? t += "b:" + n : "object" == typeof n && (t += "json:" + JSON.stringify(n)), t += "\n";
				return t
			},
			onEvent : a.onEvent
		},
		n.exports = t
	}),
	define("core/lib/invocation", ["require", "exports", "module", "./error"], function (e, i, n) {
		function t() {
			var e = p++;
			return window.isFinite(e) || (p = 0, e = 0),
			e
		}
		function a(e) {
			return e && -1 !== e.indexOf("local:///") ? !0 : !1
		}
		function o(e) {
			return qnx.callExtensionMethod("application.getenv", e)
		}
		function s(e) {
			var i = o("HOME");
			return a(e) && (e = "file:///" + i.replace(/^\/*/, "") + "/../app/native/" + e.replace(/local:\/\/\//, "")),
			e
		}
		var l,
		r,
		d,
		p = 0,
		c = {},
		u = {};
		l = {
			INVOKE_NO_TARGET_ERROR : "INVOKE_NO_TARGET_ERROR",
			INVOKE_BAD_REQUEST_ERROR : "INVOKE_BAD_REQUEST_ERROR",
			INVOKE_INTERNAL_ERROR : "INVOKE_INTERNAL_ERROR",
			INVOKE_TARGET_ERROR : "INVOKE_TARGET_ERROR",
			INVOKE_TARGET_NOT_OWNED_ERROR : "INVOKE_TARGET_NOT_OWNED_ERROR",
			QUERY_TARGETS_INVALID_ARGUMENT : "invalid_argument",
			QUERY_TARGETS_RESPONSE_TOO_LARGE : "response_too_large",
			QUERY_TARGETS_SERVER_ERROR : "server_error",
			LAUNCH : 0,
			INVOKE : 1,
			VIEWER : 2,
			CARD : 3,
			STARTUP_MODES_MAP : ["launch", "invoke", "viewer", "card"],
			InvokeAction : {
				OPEN : "bb.action.OPEN",
				SHARE : "bb.action.SHARE",
				VIEW : "bb.action.VIEW"
			},
			TARGET_TYPE_MASK_APPLICATION : 1,
			TARGET_TYPE_MASK_CARD : 2,
			TARGET_TYPE_MASK_VIEWER : 0,
			TARGET_TYPE_MASK_SERVICE : 8,
			TARGET_TYPE_MASK_HEADLESS : 64,
			ACTION_TYPE_ALL : "ALL",
			ACTION_TYPE_MENU : "MENU",
			PERIMETER_TYPE_PERSONAL : "personal",
			PERIMETER_TYPE_ENTERPRISE : "enterprise",
			FILE_TRANSFER_PRESERVE : "PRESERVE",
			FILE_TRANSFER_COPY_RO : "COPY_RO",
			FILE_TRANSFER_COPY_RW : "COPY_RW",
			FILE_TRANSFER_LINK : "LINK",
			CARD_EDGE_TOP : "top_up",
			CARD_EDGE_BOTTOM : "bottom_up",
			CARD_EDGE_LEFT : "left_up",
			CARD_EDGE_RIGHT : "right_up",
			CARD_ORIENTATION_PORTRAIT : "portrait",
			CARD_ORIENTATION_LANDSCAPE : "landscape",
			CARD_PEEK_TYPE_CONTENT : "content",
			CARD_PEEK_TYPE_ROOT : "root",
			getStartupMode : function () {
				var e,
				i = o("uri");
				return "invoke://localhost" === i ? (e = o("MODE"), "card" === e ? l.CARD : "view" === e ? l.VIEWER : l.INVOKE) : l.LAUNCH
			},
			getRequest : function () {
				return qnx.callExtensionMethod("invocation.invokeRequest")
			},
			invoke : function (e, i, n) {
				var s = t(),
				l = o("HOME") + "";
				a(e.uri) && (e.uri = "file:///" + l.replace(/^\/*/, "") + "/../app/native/" + e.uri.replace(/local:\/\/\//, "")),
				i && (c[s] = i),
				"function" == typeof d && n ? d(e, function (e) {
					"object" == typeof e && qnx.callExtensionMethod("invocation.invoke", s, JSON.stringify(e))
				}) : qnx.callExtensionMethod("invocation.invoke", s, JSON.stringify(e))
			},
			invokeViewer : function (e, i) {
				var n,
				a = t();
				i && (c[a] = i),
				n = "viewer" + a,
				e.winid = n,
				qnx.callExtensionMethod("invocation.invokeViewer", a, n, JSON.stringify(e))
			},
			queryTargets : function (e, i) {
				var n = t(),
				a = "viewer" + n;
				c[n] = i,
				e.winid = a,
				e.hasOwnProperty("uri") && (e.uri = s(e.uri)),
				qnx.callExtensionMethod("invocation.queryTargets", n, JSON.stringify(e))
			},
			cardResized : function () {
				r && qnx.callExtensionMethod("invocation.cardResize", r)
			},
			cardPeek : function (e) {
				qnx.callExtensionMethod("invocation.cardPeek", e)
			},
			closeChildCard : function () {
				qnx.callExtensionMethod("invocation.cardChildClose")
			},
			sendCardDone : function (e) {
				qnx.callExtensionMethod("invocation.cardClose", JSON.stringify(e))
			},
			getInvokeTargetFilters : function (e, i) {
				var n,
				a = t();
				c[a] = i,
				n = {
					target : e
				},
				qnx.callExtensionMethod("invocation.getInvokeTargetFilters", a, JSON.stringify(n))
			},
			setInvokeTargetFilters : function (e, i) {
				var n = t();
				i && (c[n] = i),
				qnx.callExtensionMethod("invocation.setInvokeTargetFilters", n, JSON.stringify(e))
			},
			onInvoked : function (e) {
				wp.core.events.emit("invocation.invoked", [e])
			},
			onInvokeResponse : function (e, i, n) {
				var t,
				a = c[e];
				if (a) {
					delete c[e];
					try {
						t = JSON.parse(n)
					} catch (o) {
						t = null
					}
					a(i, t)
				}
			},
			onInvokeViewerResponse : function (e, i) {
				if (i) {
					var n = c[e];
					delete c[e],
					n && n(i)
				}
			},
			onQueryTargetsResponse : function (e, i, n) {
				var t,
				a = c[e];
				if (a) {
					delete c[e];
					try {
						t = JSON.parse(n)
					} catch (o) {
						t = null
					}
					a(i, t)
				}
			},
			onViewerCreate : function (e, i) {
				var n,
				a = c[e];
				delete c[e],
				n = {
					viewerId : i,
					relayCallbacks : {},
					close : function () {
						qnx.callExtensionMethod("invocation.closeViewer", this.viewerId)
					},
					receive : function (e, i) {
						var n = i.msg;
						"viewerCloseRequest" === n ? (this.close(), this.hasOwnProperty("onClose") && this.onClose()) : "viewerCancelRequest" === n ? (this.close(), this.hasOwnProperty("onCancel") && this.onCancel()) : this.hasOwnProperty("onReceive") && this.onReceive(e, i.msg, i.dat)
					},
					receiveResponse : function (e, i) {
						var n = this.relayCallbacks[e];
						delete this.relayCallbacks[e],
						n && n(i.name, i.dat)
					},
					setSize : function (e, i) {
						var n = {
							msg : "resizeReqeust",
							data : {
								width : e,
								height : i
							}
						};
						this.send(JSON.stringify(n))
					},
					setPosition : function (e, i) {
						qnx.callExtensionMethod("invocation.setViewerPosition", this.viewerId, e, i)
					},
					setVisibility : function (e) {
						qnx.callExtensionMethod("invocation.setViewerVisibility", this.viewerId, e)
					},
					setZOrder : function (e) {
						qnx.callExtensionMethod("invocation.setViewerZOrder", this.viewerId, e)
					},
					send : function (e, i) {
						var n = t();
						i && (this.relayCallbacks[n] = i),
						e.winid = this.viewerId,
						qnx.callExtensionMethod("invocation.viewerRelay", n, e)
					},
					update : function () {
						qnx.callExtensionMethod("applicationWindow.flushContext")
					}
				},
				u[n.viewerId] = n,
				a(null, n)
			},
			onViewerRelay : function (e, i) {
				try {
					var n = JSON.parse(i),
					t = u[n.winId];
					t && t.receive(e, n)
				} catch (a) {}

			},
			onViewerRelayResponse : function (e, i) {
				try {
					var n = JSON.parse(i),
					t = u[n.winId];
					t && t.receiveResponse(e, n)
				} catch (a) {}

			},
			onViewerStopped : function (e) {
				delete u[e]
			},
			onCardResize : function (e, i) {
				var n = i.split(","),
				t = {
					width : n[0],
					height : n[1],
					orientation : n[2],
					edge : n[3]
				};
				r = e,
				wp.core.events.emit("invocation.cardResize", [t])
			},
			onCardStartPeek : function (e) {
				wp.core.events.emit("invocation.cardPeekStarted", [e])
			},
			onCardEndPeek : function () {
				wp.core.events.emit("invocation.cardPeekEnded")
			},
			onCardChildOpened : function () {
				wp.core.events.emit("invocation.childCardOpened")
			},
			onCardChildClosed : function (e) {
				var i;
				try {
					i = JSON.parse(e)
				} catch (n) {
					i = {
						reason : "",
						type : "",
						data : ""
					}
				}
				wp.core.events.emit("invocation.childCardClosed", [i])
			},
			onCardClosed : function (e) {
				var i;
				try {
					i = JSON.parse(e)
				} catch (n) {
					i = {
						reason : "",
						type : "",
						data : ""
					}
				}
				wp.core.events.emit("invocation.cardClosed", [i])
			},
			onGetInvokeTargetFiltersResponse : function (e, i, n) {
				var t,
				a = c[e];
				if (a) {
					delete c[e];
					try {
						t = JSON.parse(n)
					} catch (o) {
						t = null
					}
					a(i, t)
				}
			},
			onSetInvokeTargetFiltersResponse : function (e, i, n) {
				var t,
				a = c[e];
				if (a) {
					delete c[e];
					try {
						t = JSON.parse(n)
					} catch (o) {
						t = null
					}
					a(i, t)
				}
			},
			on : function (e, i) {
				var n = "invocation." + e.charAt(0).toLowerCase() + e.slice(1);
				wp.core.events.on(n, i)
			},
			un : function (e, i) {
				var n = "invocation." + e.charAt(0).toLowerCase() + e.slice(1);
				wp.core.events.un(n, i)
			}
		},
		e("./error").wrapAll(l, "invocation."),
		l.__defineGetter__("startupMode", function () {
			return l.getStartupMode()
		}),
		l.__defineGetter__("invokeRequest", function () {
			var e = l.getRequest();
			if (e)
				try {
					return JSON.parse(e)
				} catch (i) {
					return null
				}
			return null
		}),
		l.__defineGetter__("interrupter", function () {
			return d
		}),
		l.__defineSetter__("interrupter", function (e) {
			d = e
		}),
		n.exports = l
	}),
	define("wp2/lib/mimeTypes", ["require", "exports", "module"], function (e, i, n) {
		function t() {
			s.addMimeTypes("3g2", "video/3gpp2"),
			s.addMimeTypes("3gp", "video/3gpp"),
			s.addMimeTypes("aac", "audio/aac"),
			s.addMimeTypes("abs", "audio/x-mpeg"),
			s.addMimeTypes("ai", "application/postscript"),
			s.addMimeTypes("aif", "audio/x-aiff"),
			s.addMimeTypes("aifc", "audio/x-aiff"),
			s.addMimeTypes("aiff", "audio/x-aiff"),
			s.addMimeTypes("aim", "application/x-aim"),
			s.addMimeTypes("amr", "audio/amr"),
			s.addMimeTypes("art", "image/x-jg"),
			s.addMimeTypes("asc", "text/plain"),
			s.addMimeTypes("asf", "video/x-ms-asf"),
			s.addMimeTypes("asx", "video/x-ms-asf"),
			s.addMimeTypes("atom", "application/atom+xml"),
			s.addMimeTypes("au", "audio/basic"),
			s.addMimeTypes("avi", "video/x-msvideo"),
			s.addMimeTypes("avx", "video/x-rad-screenplay"),
			s.addMimeTypes("bcpio", "application/x-bcpio"),
			s.addMimeTypes("bin", "application/octet-stream"),
			s.addMimeTypes("bmp", "image/bmp"),
			s.addMimeTypes("body", "text/html"),
			s.addMimeTypes("cdf", "application/x-cdf"),
			s.addMimeTypes("cer", "application/x-x509-ca-cert"),
			s.addMimeTypes("cgm", "image/cgm"),
			s.addMimeTypes("class", "application/java"),
			s.addMimeTypes("cpio", "application/x-cpio"),
			s.addMimeTypes("csh", "application/x-csh"),
			s.addMimeTypes("css", "text/css"),
			s.addMimeTypes("dib", "image/bmp"),
			s.addMimeTypes("djv", "image/vnd.djvu"),
			s.addMimeTypes("djvu", "image/vnd.djvu"),
			s.addMimeTypes("dll", "application/octet-stream"),
			s.addMimeTypes("doc", "application/msword"),
			s.addMimeTypes("odt", "application/vnd.oasis.opendocument.text"),
			s.addMimeTypes("ods", "application/vnd.oasis.opendocument.spreadsheet"),
			s.addMimeTypes("docm", "application/vnd.ms-word.document.macroEnabled.12"),
			s.addMimeTypes("docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
			s.addMimeTypes("dot", "application/msword"),
			s.addMimeTypes("dotm", "application/vnd.ms-word.template.macroEnabled.12"),
			s.addMimeTypes("dotx", "application/vnd.openxmlformats-officedocument.wordprocessingml.template"),
			s.addMimeTypes("dtd", "application/xml-dtd"),
			s.addMimeTypes("dv", "video/x-dv"),
			s.addMimeTypes("dvi", "application/x-dvi"),
			s.addMimeTypes("eps", "application/postscript"),
			s.addMimeTypes("etx", "text/x-setext"),
			s.addMimeTypes("exe", "application/octet-stream"),
			s.addMimeTypes("flac", "audio/flac"),
			s.addMimeTypes("gif", "image/gif"),
			s.addMimeTypes("gtar", "application/x-gtar"),
			s.addMimeTypes("gz", "application/x-gzip"),
			s.addMimeTypes("h264", "video/h264"),
			s.addMimeTypes("hdf", "application/x-hdf"),
			s.addMimeTypes("hqx", "application/mac-binhex40"),
			s.addMimeTypes("htc", "text/x-component"),
			s.addMimeTypes("htm", "text/html"),
			s.addMimeTypes("html", "text/html"),
			s.addMimeTypes("hqx", "application/mac-binhex40"),
			s.addMimeTypes("ico", "image/x-icon"),
			s.addMimeTypes("ics", "text/calendar"),
			s.addMimeTypes("ief", "image/ief"),
			s.addMimeTypes("ifb", "text/calendar"),
			s.addMimeTypes("jad", "text/vnd.sun.j2me.app-descriptor"),
			s.addMimeTypes("jar", "application/java-archive"),
			s.addMimeTypes("java", "text/plain"),
			s.addMimeTypes("jnlp", "application/x-java-jnlp-file"),
			s.addMimeTypes("jpe", "image/jpeg"),
			s.addMimeTypes("jpeg", "image/jpeg"),
			s.addMimeTypes("jpg", "image/jpeg"),
			s.addMimeTypes("js", "text/javascript"),
			s.addMimeTypes("jsf", "text/plain"),
			s.addMimeTypes("jspf", "text/plain"),
			s.addMimeTypes("kar", "audio/x-midi"),
			s.addMimeTypes("latex", "application/x-latex"),
			s.addMimeTypes("m2ts", "video/MP2T"),
			s.addMimeTypes("m3u", "audio/x-mpegurl"),
			s.addMimeTypes("m4a", "audio/mp4a-latm"),
			s.addMimeTypes("m4b", "audio/mp4a-latm"),
			s.addMimeTypes("m4p", "audio/mp4a-latm"),
			s.addMimeTypes("m4u", "video/vnd.mpegurl"),
			s.addMimeTypes("m4v", "video/x-m4v"),
			s.addMimeTypes("mac", "image/x-macpaint"),
			s.addMimeTypes("man", "application/x-troff-man"),
			s.addMimeTypes("mathml", "application/mathml+xml"),
			s.addMimeTypes("me", "application/x-troff-me"),
			s.addMimeTypes("mid", "audio/x-midi"),
			s.addMimeTypes("midi", "audio/x-midi"),
			s.addMimeTypes("mif", "application/x-mif"),
			s.addMimeTypes("mka", "audio/x-matroska"),
			s.addMimeTypes("mkv", "video/x-matroska"),
			s.addMimeTypes("mk3d", "video/x-matroska-3d"),
			s.addMimeTypes("mov", "video/quicktime"),
			s.addMimeTypes("movie", "video/x-sgi-movie"),
			s.addMimeTypes("mp1", "audio/x-mpeg"),
			s.addMimeTypes("mp2", "audio/x-mpeg"),
			s.addMimeTypes("mp3", "audio/x-mpeg"),
			s.addMimeTypes("mp4", "video/mp4"),
			s.addMimeTypes("mpa", "audio/x-mpeg"),
			s.addMimeTypes("mpe", "video/mpeg"),
			s.addMimeTypes("mpeg", "video/mpeg"),
			s.addMimeTypes("mpega", "audio/x-mpeg"),
			s.addMimeTypes("mpg", "video/mpeg"),
			s.addMimeTypes("mpv2", "video/mpeg2"),
			s.addMimeTypes("ms", "application/x-wais-source"),
			s.addMimeTypes("nc", "application/x-netcdf"),
			s.addMimeTypes("oda", "application/oda"),
			s.addMimeTypes("ogg", "audio/ogg"),
			s.addMimeTypes("pbm", "image/x-portable-bitmap"),
			s.addMimeTypes("pct", "image/pict"),
			s.addMimeTypes("pdf", "application/pdf"),
			s.addMimeTypes("pgm", "image/x-portable-graymap"),
			s.addMimeTypes("pic", "image/pict"),
			s.addMimeTypes("pict", "image/pict"),
			s.addMimeTypes("pls", "audio/x-scpls"),
			s.addMimeTypes("png", "image/png"),
			s.addMimeTypes("pnm", "image/x-portable-anymap"),
			s.addMimeTypes("pnt", "image/x-macpaint"),
			s.addMimeTypes("pot", "application/vnd.ms-powerpoint"),
			s.addMimeTypes("potm", "application/vnd.ms-powerpoint.template.macroEnabled.12"),
			s.addMimeTypes("potx", "application/vnd.openxmlformats-officedocument.presentationml.template"),
			s.addMimeTypes("ppm", "image/x-portable-pixmap"),
			s.addMimeTypes("ppt", "application/vnd.ms-powerpoint"),
			s.addMimeTypes("pps", "application/vnd.ms-powerpoint"),
			s.addMimeTypes("ppsm", "application/vnd.ms-powerpoint.slideshow.macroEnabled.12"),
			s.addMimeTypes("ppsx", "application/vnd.openxmlformats-officedocument.presentationml.slideshow"),
			s.addMimeTypes("pptm", "application/vnd.ms-powerpoint.presentation.macroEnabled.12"),
			s.addMimeTypes("pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation"),
			s.addMimeTypes("ps", "application/postscript"),
			s.addMimeTypes("psd", "image/x-photoshop"),
			s.addMimeTypes("qcp", "audio/qcelp"),
			s.addMimeTypes("qt", "video/quicktime"),
			s.addMimeTypes("qti", "image/x-quicktime"),
			s.addMimeTypes("qtif", "image/x-quicktime"),
			s.addMimeTypes("ras", "image/x-cmu-raster"),
			s.addMimeTypes("rdf", "application/rdf+xml"),
			s.addMimeTypes("rgb", "image/x-rgb"),
			s.addMimeTypes("rm", "application/vnd.rn-realmedia"),
			s.addMimeTypes("roff", "application/x-troff"),
			s.addMimeTypes("rtf", "application/rtf"),
			s.addMimeTypes("rtx", "text/richtext"),
			s.addMimeTypes("sh", "application/x-sh"),
			s.addMimeTypes("shar", "application/x-shar"),
			s.addMimeTypes("smf", "audio/x-midi"),
			s.addMimeTypes("sit", "application/x-stuffit"),
			s.addMimeTypes("snd", "audio/basic"),
			s.addMimeTypes("src", "application/x-wais-source"),
			s.addMimeTypes("sv4cpio", "application/x-sv4cpio"),
			s.addMimeTypes("sv4crc", "application/x-sv4crc"),
			s.addMimeTypes("svg", "image/svg+xml"),
			s.addMimeTypes("svgz", "image/svg+xml"),
			s.addMimeTypes("swf", "application/x-shockwave-flash"),
			s.addMimeTypes("t", "application/x-troff"),
			s.addMimeTypes("tar", "application/x-tar"),
			s.addMimeTypes("tcl", "application/x-tcl"),
			s.addMimeTypes("tex", "application/x-tex"),
			s.addMimeTypes("texi", "application/x-texinfo"),
			s.addMimeTypes("texinfo", "application/x-texinfo"),
			s.addMimeTypes("tif", "image/tiff"),
			s.addMimeTypes("tiff", "image/tiff"),
			s.addMimeTypes("tr", "application/x-troff"),
			s.addMimeTypes("tsv", "text/tab-separated-values"),
			s.addMimeTypes("txt", "text/plain"),
			s.addMimeTypes("ulw", "audio/basic"),
			s.addMimeTypes("ustar", "application/x-ustar"),
			s.addMimeTypes("vsd", "application/x-visio"),
			s.addMimeTypes("vxml", "application/voicexml+xml"),
			s.addMimeTypes("wav", "audio/x-wav"),
			s.addMimeTypes("wma", "audio/x-ms-wma"),
			s.addMimeTypes("wml", "text/vnd.wap.wml"),
			s.addMimeTypes("wmlc", "application/vnd.wap.wmlc"),
			s.addMimeTypes("wmls", "text/vnd.wap.wmlscript"),
			s.addMimeTypes("wmlscriptc", "application/vnd.wap.wmlscriptc"),
			s.addMimeTypes("wmv", "video/x-ms-wmv"),
			s.addMimeTypes("wrl", "x-world/x-vrml"),
			s.addMimeTypes("wspolicy", "application/wspolicy+xml"),
			s.addMimeTypes("xbm", "image/x-xbitmap"),
			s.addMimeTypes("xht", "application/xhtml+xml"),
			s.addMimeTypes("xhtml", "application/xhtml+xml"),
			s.addMimeTypes("xls", "application/vnd.ms-excel"),
			s.addMimeTypes("xlsm", "application/vnd.ms-excel.sheet.macroEnabled.12"),
			s.addMimeTypes("xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"),
			s.addMimeTypes("xlt", "application/vnd.ms-excel"),
			s.addMimeTypes("xltm", "application/vnd.ms-excel.template.macroEnabled.12"),
			s.addMimeTypes("xltx", "application/vnd.openxmlformats-officedocument.spreadsheetml.template"),
			s.addMimeTypes("xml", "application/xml"),
			s.addMimeTypes("xpm", "image/x-xpixmap"),
			s.addMimeTypes("xsl", "application/xml"),
			s.addMimeTypes("xslt", "application/xslt+xml"),
			s.addMimeTypes("xul", "application/vnd.mozilla.xul+xml"),
			s.addMimeTypes("xwd", "image/x-xwindowdump"),
			s.addMimeTypes("Z", "application/x-compress"),
			s.addMimeTypes("z", "application/x-compress"),
			s.addMimeTypes("zip", "application/zip")
		}
		function a() {
			s.addMimeTypes("atomcat", "application/atomcat+xml"),
			s.addMimeTypes("atomsvc", "application/atomsvc+xml"),
			s.addMimeTypes("ccxml", "application/ccxml+xml"),
			s.addMimeTypes("cu", "application/cu-seeme"),
			s.addMimeTypes("davmount", "application/davmount+xml"),
			s.addMimeTypes("ecma", "application/ecmascript"),
			s.addMimeTypes("emma", "application/emma+xml"),
			s.addMimeTypes("epub", "application/epub+zip"),
			s.addMimeTypes("pfr", "application/font-tdpfr"),
			s.addMimeTypes("stk", "application/hyperstudio"),
			s.addMimeTypes("jar", "application/java-archive"),
			s.addMimeTypes("ser", "application/java-serialized-object"),
			s.addMimeTypes("class", "application/java-vm"),
			s.addMimeTypes("json", "application/json"),
			s.addMimeTypes("lostxml", "application/lost+xml"),
			s.addMimeTypes("hqx", "application/mac-binhex40"),
			s.addMimeTypes("cpt", "application/mac-compactpro"),
			s.addMimeTypes("mrc", "application/marc"),
			s.addMimeTypes("ma,nb,mb", "application/mathematica"),
			s.addMimeTypes("mathml", "application/mathml+xml"),
			s.addMimeTypes("mbox", "application/mbox"),
			s.addMimeTypes("mscml", "application/mediaservercontrol+xml"),
			s.addMimeTypes("mp4s", "application/mp4"),
			s.addMimeTypes("doc,dot", "application/msword"),
			s.addMimeTypes("mxf", "application/mxf"),
			s.addMimeTypes("oda", "application/oda"),
			s.addMimeTypes("opf", "application/oebps-package+xml"),
			s.addMimeTypes("ogx", "application/ogg"),
			s.addMimeTypes("onetoc,onetoc2,onetmp,onepkg", "application/onenote"),
			s.addMimeTypes("xer", "application/patch-ops-error+xml"),
			s.addMimeTypes("pgp", "application/pgp-encrypted"),
			s.addMimeTypes("asc,sig", "application/pgp-signature"),
			s.addMimeTypes("prf", "application/pics-rules"),
			s.addMimeTypes("p10", "application/pkcs10"),
			s.addMimeTypes("p7m,p7c", "application/pkcs7-mime"),
			s.addMimeTypes("p7s", "application/pkcs7-signature"),
			s.addMimeTypes("cer", "application/pkix-cert"),
			s.addMimeTypes("crl", "application/pkix-crl"),
			s.addMimeTypes("pkipath", "application/pkix-pkipath"),
			s.addMimeTypes("pki", "application/pkixcmp"),
			s.addMimeTypes("pls", "application/pls+xml"),
			s.addMimeTypes("ai,eps,ps", "application/postscript"),
			s.addMimeTypes("cww", "application/prs.cww"),
			s.addMimeTypes("rdf", "application/rdf+xml"),
			s.addMimeTypes("rif", "application/reginfo+xml"),
			s.addMimeTypes("rnc", "application/relax-ng-compact-syntax"),
			s.addMimeTypes("rl", "application/resource-lists+xml"),
			s.addMimeTypes("rld", "application/resource-lists-diff+xml"),
			s.addMimeTypes("rs", "application/rls-services+xml"),
			s.addMimeTypes("rsd", "application/rsd+xml"),
			s.addMimeTypes("rss", "application/rss+xml"),
			s.addMimeTypes("rtf", "application/rtf"),
			s.addMimeTypes("sbml", "application/sbml+xml"),
			s.addMimeTypes("scq", "application/scvp-cv-request"),
			s.addMimeTypes("scs", "application/scvp-cv-response"),
			s.addMimeTypes("spq", "application/scvp-vp-request"),
			s.addMimeTypes("spp", "application/scvp-vp-response"),
			s.addMimeTypes("sdp", "application/sdp"),
			s.addMimeTypes("setpay", "application/set-payment-initiation"),
			s.addMimeTypes("setreg", "application/set-registration-initiation"),
			s.addMimeTypes("shf", "application/shf+xml"),
			s.addMimeTypes("smi,smil", "application/smil+xml"),
			s.addMimeTypes("rq", "application/sparql-query"),
			s.addMimeTypes("srx", "application/sparql-results+xml"),
			s.addMimeTypes("gram", "application/srgs"),
			s.addMimeTypes("grxml", "application/srgs+xml"),
			s.addMimeTypes("ssml", "application/ssml+xml"),
			s.addMimeTypes("plb", "application/vnd.3gpp.pic-bw-large"),
			s.addMimeTypes("psb", "application/vnd.3gpp.pic-bw-small"),
			s.addMimeTypes("pvb", "application/vnd.3gpp.pic-bw-var"),
			s.addMimeTypes("tcap", "application/vnd.3gpp2.tcap"),
			s.addMimeTypes("pwn", "application/vnd.3m.post-it-notes"),
			s.addMimeTypes("aso", "application/vnd.accpac.simply.aso"),
			s.addMimeTypes("imp", "application/vnd.accpac.simply.imp"),
			s.addMimeTypes("acu", "application/vnd.acucobol"),
			s.addMimeTypes("atc,acutc", "application/vnd.acucorp"),
			s.addMimeTypes("air", "application/vnd.adobe.air-application-installer-package+zip"),
			s.addMimeTypes("xdp", "application/vnd.adobe.xdp+xml"),
			s.addMimeTypes("xfdf", "application/vnd.adobe.xfdf"),
			s.addMimeTypes("azf", "application/vnd.airzip.filesecure.azf"),
			s.addMimeTypes("azs", "application/vnd.airzip.filesecure.azs"),
			s.addMimeTypes("azw", "application/vnd.amazon.ebook"),
			s.addMimeTypes("acc", "application/vnd.americandynamics.acc"),
			s.addMimeTypes("ami", "application/vnd.amiga.ami"),
			s.addMimeTypes("apk", "application/vnd.android.package-archive"),
			s.addMimeTypes("cii", "application/vnd.anser-web-certificate-issue-initiation"),
			s.addMimeTypes("fti", "application/vnd.anser-web-funds-transfer-initiation"),
			s.addMimeTypes("atx", "application/vnd.antix.game-component"),
			s.addMimeTypes("mpkg", "application/vnd.apple.installer+xml"),
			s.addMimeTypes("swi", "application/vnd.arastra.swi"),
			s.addMimeTypes("aep", "application/vnd.audiograph"),
			s.addMimeTypes("mpm", "application/vnd.blueice.multipass"),
			s.addMimeTypes("bmi", "application/vnd.bmi"),
			s.addMimeTypes("rep", "application/vnd.businessobjects"),
			s.addMimeTypes("cdxml", "application/vnd.chemdraw+xml"),
			s.addMimeTypes("mmd", "application/vnd.chipnuts.karaoke-mmd"),
			s.addMimeTypes("cdy", "application/vnd.cinderella"),
			s.addMimeTypes("cla", "application/vnd.claymore"),
			s.addMimeTypes("c4g,c4d,c4f,c4p,c4u", "application/vnd.clonk.c4group"),
			s.addMimeTypes("csp", "application/vnd.commonspace"),
			s.addMimeTypes("cdbcmsg", "application/vnd.contact.cmsg"),
			s.addMimeTypes("cmc", "application/vnd.cosmocaller"),
			s.addMimeTypes("clkx", "application/vnd.crick.clicker"),
			s.addMimeTypes("clkk", "application/vnd.crick.clicker.keyboard"),
			s.addMimeTypes("clkp", "application/vnd.crick.clicker.palette"),
			s.addMimeTypes("clkt", "application/vnd.crick.clicker.template"),
			s.addMimeTypes("clkw", "application/vnd.crick.clicker.wordbank"),
			s.addMimeTypes("wbs", "application/vnd.criticaltools.wbs+xml"),
			s.addMimeTypes("pml", "application/vnd.ctc-posml"),
			s.addMimeTypes("ppd", "application/vnd.cups-ppd"),
			s.addMimeTypes("car", "application/vnd.curl.car"),
			s.addMimeTypes("pcurl", "application/vnd.curl.pcurl"),
			s.addMimeTypes("rdz", "application/vnd.data-vision.rdz"),
			s.addMimeTypes("fe_launch", "application/vnd.denovo.fcselayout-link"),
			s.addMimeTypes("dna", "application/vnd.dna"),
			s.addMimeTypes("mlp", "application/vnd.dolby.mlp"),
			s.addMimeTypes("dpg", "application/vnd.dpgraph"),
			s.addMimeTypes("dfac", "application/vnd.dreamfactory"),
			s.addMimeTypes("geo", "application/vnd.dynageo"),
			s.addMimeTypes("mag", "application/vnd.ecowin.chart"),
			s.addMimeTypes("nml", "application/vnd.enliven"),
			s.addMimeTypes("esf", "application/vnd.epson.esf"),
			s.addMimeTypes("msf", "application/vnd.epson.msf"),
			s.addMimeTypes("qam", "application/vnd.epson.quickanime"),
			s.addMimeTypes("slt", "application/vnd.epson.salt"),
			s.addMimeTypes("ssf", "application/vnd.epson.ssf"),
			s.addMimeTypes("es3,et3", "application/vnd.eszigno3+xml"),
			s.addMimeTypes("ez2", "application/vnd.ezpix-album"),
			s.addMimeTypes("ez3", "application/vnd.ezpix-package"),
			s.addMimeTypes("fdf", "application/vnd.fdf"),
			s.addMimeTypes("mseed", "application/vnd.fdsn.mseed"),
			s.addMimeTypes("seed,dataless", "application/vnd.fdsn.seed"),
			s.addMimeTypes("gph", "application/vnd.flographit"),
			s.addMimeTypes("ftc", "application/vnd.fluxtime.clip"),
			s.addMimeTypes("fm,frame,maker,book", "application/vnd.framemaker"),
			s.addMimeTypes("fnc", "application/vnd.frogans.fnc"),
			s.addMimeTypes("ltf", "application/vnd.frogans.ltf"),
			s.addMimeTypes("fsc", "application/vnd.fsc.weblaunch"),
			s.addMimeTypes("oas", "application/vnd.fujitsu.oasys"),
			s.addMimeTypes("oa2", "application/vnd.fujitsu.oasys2"),
			s.addMimeTypes("oa3", "application/vnd.fujitsu.oasys3"),
			s.addMimeTypes("fg5", "application/vnd.fujitsu.oasysgp"),
			s.addMimeTypes("bh2", "application/vnd.fujitsu.oasysprs"),
			s.addMimeTypes("ddd", "application/vnd.fujixerox.ddd"),
			s.addMimeTypes("xdw", "application/vnd.fujixerox.docuworks"),
			s.addMimeTypes("xbd", "application/vnd.fujixerox.docuworks.binder"),
			s.addMimeTypes("fzs", "application/vnd.fuzzysheet"),
			s.addMimeTypes("txd", "application/vnd.genomatix.tuxedo"),
			s.addMimeTypes("ggb", "application/vnd.geogebra.file"),
			s.addMimeTypes("ggt", "application/vnd.geogebra.tool"),
			s.addMimeTypes("gex,gre", "application/vnd.geometry-explorer"),
			s.addMimeTypes("gmx", "application/vnd.gmx"),
			s.addMimeTypes("kml", "application/vnd.google-earth.kml+xml"),
			s.addMimeTypes("kmz", "application/vnd.google-earth.kmz"),
			s.addMimeTypes("gqf,gqs", "application/vnd.grafeq"),
			s.addMimeTypes("gac", "application/vnd.groove-account"),
			s.addMimeTypes("ghf", "application/vnd.groove-help"),
			s.addMimeTypes("gim", "application/vnd.groove-identity-message"),
			s.addMimeTypes("grv", "application/vnd.groove-injector"),
			s.addMimeTypes("gtm", "application/vnd.groove-tool-message"),
			s.addMimeTypes("tpl", "application/vnd.groove-tool-template"),
			s.addMimeTypes("vcg", "application/vnd.groove-vcard"),
			s.addMimeTypes("zmm", "application/vnd.handheld-entertainment+xml"),
			s.addMimeTypes("hbci", "application/vnd.hbci"),
			s.addMimeTypes("les", "application/vnd.hhe.lesson-player"),
			s.addMimeTypes("hpgl", "application/vnd.hp-hpgl"),
			s.addMimeTypes("hpid", "application/vnd.hp-hpid"),
			s.addMimeTypes("hps", "application/vnd.hp-hps"),
			s.addMimeTypes("jlt", "application/vnd.hp-jlyt"),
			s.addMimeTypes("pcl", "application/vnd.hp-pcl"),
			s.addMimeTypes("pclxl", "application/vnd.hp-pclxl"),
			s.addMimeTypes("sfd-hdstx", "application/vnd.hydrostatix.sof-data"),
			s.addMimeTypes("x3d", "application/vnd.hzn-3d-crossword"),
			s.addMimeTypes("mpy", "application/vnd.ibm.minipay"),
			s.addMimeTypes("afp,listafp,list3820", "application/vnd.ibm.modcap"),
			s.addMimeTypes("irm", "application/vnd.ibm.rights-management"),
			s.addMimeTypes("sc", "application/vnd.ibm.secure-container"),
			s.addMimeTypes("icc,icm", "application/vnd.iccprofile"),
			s.addMimeTypes("igl", "application/vnd.igloader"),
			s.addMimeTypes("ivp", "application/vnd.immervision-ivp"),
			s.addMimeTypes("ivu", "application/vnd.immervision-ivu"),
			s.addMimeTypes("xpw,xpx", "application/vnd.intercon.formnet"),
			s.addMimeTypes("qbo", "application/vnd.intu.qbo"),
			s.addMimeTypes("qfx", "application/vnd.intu.qfx"),
			s.addMimeTypes("rcprofile", "application/vnd.ipunplugged.rcprofile"),
			s.addMimeTypes("irp", "application/vnd.irepository.package+xml"),
			s.addMimeTypes("xpr", "application/vnd.is-xpr"),
			s.addMimeTypes("jam", "application/vnd.jam"),
			s.addMimeTypes("rms", "application/vnd.jcp.javame.midlet-rms"),
			s.addMimeTypes("jisp", "application/vnd.jisp"),
			s.addMimeTypes("joda", "application/vnd.joost.joda-archive"),
			s.addMimeTypes("ktz,ktr", "application/vnd.kahootz"),
			s.addMimeTypes("karbon", "application/vnd.kde.karbon"),
			s.addMimeTypes("chrt", "application/vnd.kde.kchart"),
			s.addMimeTypes("kfo", "application/vnd.kde.kformula"),
			s.addMimeTypes("flw", "application/vnd.kde.kivio"),
			s.addMimeTypes("kon", "application/vnd.kde.kontour"),
			s.addMimeTypes("kpr,kpt", "application/vnd.kde.kpresenter"),
			s.addMimeTypes("ksp", "application/vnd.kde.kspread"),
			s.addMimeTypes("kwd,kwt", "application/vnd.kde.kword"),
			s.addMimeTypes("htke", "application/vnd.kenameaapp"),
			s.addMimeTypes("kia", "application/vnd.kidspiration"),
			s.addMimeTypes("kne,knp", "application/vnd.kinar"),
			s.addMimeTypes("skp,skd,skt,skm", "application/vnd.koan"),
			s.addMimeTypes("sse", "application/vnd.kodak-descriptor"),
			s.addMimeTypes("lbd", "application/vnd.llamagraphics.life-balance.desktop"),
			s.addMimeTypes("lbe", "application/vnd.llamagraphics.life-balance.exchange+xml"),
			s.addMimeTypes("123", "application/vnd.lotus-1-2-3"),
			s.addMimeTypes("apr", "application/vnd.lotus-approach"),
			s.addMimeTypes("pre", "application/vnd.lotus-freelance"),
			s.addMimeTypes("nsf", "application/vnd.lotus-notes"),
			s.addMimeTypes("org", "application/vnd.lotus-organizer"),
			s.addMimeTypes("scm", "application/vnd.lotus-screencam"),
			s.addMimeTypes("lwp", "application/vnd.lotus-wordpro"),
			s.addMimeTypes("portpkg", "application/vnd.macports.portpkg"),
			s.addMimeTypes("mcd", "application/vnd.mcd"),
			s.addMimeTypes("mc1", "application/vnd.medcalcdata"),
			s.addMimeTypes("cdkey", "application/vnd.mediastation.cdkey"),
			s.addMimeTypes("mwf", "application/vnd.mfer"),
			s.addMimeTypes("mfm", "application/vnd.mfmp"),
			s.addMimeTypes("flo", "application/vnd.micrografx.flo"),
			s.addMimeTypes("igx", "application/vnd.micrografx.igx"),
			s.addMimeTypes("mif", "application/vnd.mif"),
			s.addMimeTypes("daf", "application/vnd.mobius.daf"),
			s.addMimeTypes("dis", "application/vnd.mobius.dis"),
			s.addMimeTypes("mbk", "application/vnd.mobius.mbk"),
			s.addMimeTypes("mqy", "application/vnd.mobius.mqy"),
			s.addMimeTypes("msl", "application/vnd.mobius.msl"),
			s.addMimeTypes("plc", "application/vnd.mobius.plc"),
			s.addMimeTypes("txf", "application/vnd.mobius.txf"),
			s.addMimeTypes("mpn", "application/vnd.mophun.application"),
			s.addMimeTypes("mpc", "application/vnd.mophun.certificate"),
			s.addMimeTypes("xul", "application/vnd.mozilla.xul+xml"),
			s.addMimeTypes("cil", "application/vnd.ms-artgalry"),
			s.addMimeTypes("cab", "application/vnd.ms-cab-compressed"),
			s.addMimeTypes("xls,xlm,xla,xlc,xlt,xlw", "application/vnd.ms-excel"),
			s.addMimeTypes("xlam", "application/vnd.ms-excel.addin.macroenabled.12"),
			s.addMimeTypes("xlsb", "application/vnd.ms-excel.sheet.binary.macroenabled.12"),
			s.addMimeTypes("xlsm", "application/vnd.ms-excel.sheet.macroenabled.12"),
			s.addMimeTypes("xltm", "application/vnd.ms-excel.template.macroenabled.12"),
			s.addMimeTypes("eot", "application/vnd.ms-fontobject"),
			s.addMimeTypes("chm", "application/vnd.ms-htmlhelp"),
			s.addMimeTypes("ims", "application/vnd.ms-ims"),
			s.addMimeTypes("lrm", "application/vnd.ms-lrm"),
			s.addMimeTypes("cat", "application/vnd.ms-pki.seccat"),
			s.addMimeTypes("stl", "application/vnd.ms-pki.stl"),
			s.addMimeTypes("ppt,pps,pot", "application/vnd.ms-powerpoint"),
			s.addMimeTypes("ppam", "application/vnd.ms-powerpoint.addin.macroenabled.12"),
			s.addMimeTypes("pptm", "application/vnd.ms-powerpoint.presentation.macroenabled.12"),
			s.addMimeTypes("sldm", "application/vnd.ms-powerpoint.slide.macroenabled.12"),
			s.addMimeTypes("ppsm", "application/vnd.ms-powerpoint.slideshow.macroenabled.12"),
			s.addMimeTypes("potm", "application/vnd.ms-powerpoint.template.macroenabled.12"),
			s.addMimeTypes("mpp,mpt", "application/vnd.ms-project"),
			s.addMimeTypes("docm", "application/vnd.ms-word.document.macroenabled.12"),
			s.addMimeTypes("dotm", "application/vnd.ms-word.template.macroenabled.12"),
			s.addMimeTypes("wps,wks,wcm,wdb", "application/vnd.ms-works"),
			s.addMimeTypes("wpl", "application/vnd.ms-wpl"),
			s.addMimeTypes("xps", "application/vnd.ms-xpsdocument"),
			s.addMimeTypes("mseq", "application/vnd.mseq"),
			s.addMimeTypes("mus", "application/vnd.musician"),
			s.addMimeTypes("msty", "application/vnd.muvee.style"),
			s.addMimeTypes("nlu", "application/vnd.neurolanguage.nlu"),
			s.addMimeTypes("nnd", "application/vnd.noblenet-directory"),
			s.addMimeTypes("nns", "application/vnd.noblenet-sealer"),
			s.addMimeTypes("nnw", "application/vnd.noblenet-web"),
			s.addMimeTypes("ngdat", "application/vnd.nokia.n-gage.data"),
			s.addMimeTypes("n-gage", "application/vnd.nokia.n-gage.symbian.install"),
			s.addMimeTypes("rpst", "application/vnd.nokia.radio-preset"),
			s.addMimeTypes("rpss", "application/vnd.nokia.radio-presets"),
			s.addMimeTypes("edm", "application/vnd.novadigm.edm"),
			s.addMimeTypes("edx", "application/vnd.novadigm.edx"),
			s.addMimeTypes("ext", "application/vnd.novadigm.ext"),
			s.addMimeTypes("odc", "application/vnd.oasis.opendocument.chart"),
			s.addMimeTypes("otc", "application/vnd.oasis.opendocument.chart-template"),
			s.addMimeTypes("odb", "application/vnd.oasis.opendocument.database"),
			s.addMimeTypes("odf", "application/vnd.oasis.opendocument.formula"),
			s.addMimeTypes("odft", "application/vnd.oasis.opendocument.formula-template"),
			s.addMimeTypes("odg", "application/vnd.oasis.opendocument.graphics"),
			s.addMimeTypes("otg", "application/vnd.oasis.opendocument.graphics-template"),
			s.addMimeTypes("odi", "application/vnd.oasis.opendocument.image"),
			s.addMimeTypes("oti", "application/vnd.oasis.opendocument.image-template"),
			s.addMimeTypes("odp", "application/vnd.oasis.opendocument.presentation"),
			s.addMimeTypes("ots", "application/vnd.oasis.opendocument.spreadsheet-template"),
			s.addMimeTypes("otm", "application/vnd.oasis.opendocument.text-master"),
			s.addMimeTypes("ott", "application/vnd.oasis.opendocument.text-template"),
			s.addMimeTypes("oth", "application/vnd.oasis.opendocument.text-web"),
			s.addMimeTypes("xo", "application/vnd.olpc-sugar"),
			s.addMimeTypes("dd2", "application/vnd.oma.dd2+xml"),
			s.addMimeTypes("oxt", "application/vnd.openofficeorg.extension"),
			s.addMimeTypes("pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation"),
			s.addMimeTypes("sldx", "application/vnd.openxmlformats-officedocument.presentationml.slide"),
			s.addMimeTypes("ppsx", "application/vnd.openxmlformats-officedocument.presentationml.slideshow"),
			s.addMimeTypes("potx", "application/vnd.openxmlformats-officedocument.presentationml.template"),
			s.addMimeTypes("dp", "application/vnd.osgi.dp"),
			s.addMimeTypes("pdb,pqa,oprc", "application/vnd.palm"),
			s.addMimeTypes("str", "application/vnd.pg.format"),
			s.addMimeTypes("ei6", "application/vnd.pg.osasli"),
			s.addMimeTypes("efif", "application/vnd.picsel"),
			s.addMimeTypes("plf", "application/vnd.pocketlearn"),
			s.addMimeTypes("pbd", "application/vnd.powerbuilder6"),
			s.addMimeTypes("box", "application/vnd.previewsystems.box"),
			s.addMimeTypes("mgz", "application/vnd.proteus.magazine"),
			s.addMimeTypes("qps", "application/vnd.publishare-delta-tree"),
			s.addMimeTypes("ptid", "application/vnd.pvi.ptid1"),
			s.addMimeTypes("qxd,qxt,qwd,qwt,qxl,qxb", "application/vnd.quark.quarkxpress"),
			s.addMimeTypes("mxl", "application/vnd.recordare.musicxml"),
			s.addMimeTypes("musicxml", "application/vnd.recordare.musicxml+xml"),
			s.addMimeTypes("cod", "application/vnd.rim.cod"),
			s.addMimeTypes("rm", "application/vnd.rn-realmedia"),
			s.addMimeTypes("link66", "application/vnd.route66.link66+xml"),
			s.addMimeTypes("see", "application/vnd.seemail"),
			s.addMimeTypes("sema", "application/vnd.sema"),
			s.addMimeTypes("semd", "application/vnd.semd"),
			s.addMimeTypes("semf", "application/vnd.semf"),
			s.addMimeTypes("ifm", "application/vnd.shana.informed.formdata"),
			s.addMimeTypes("itp", "application/vnd.shana.informed.formtemplate"),
			s.addMimeTypes("iif", "application/vnd.shana.informed.interchange"),
			s.addMimeTypes("ipk", "application/vnd.shana.informed.package"),
			s.addMimeTypes("twd,twds", "application/vnd.simtech-mindmapper"),
			s.addMimeTypes("mmf", "application/vnd.smaf"),
			s.addMimeTypes("teacher", "application/vnd.smart.teacher"),
			s.addMimeTypes("sdkm,sdkd", "application/vnd.solent.sdkm+xml"),
			s.addMimeTypes("dxp", "application/vnd.spotfire.dxp"),
			s.addMimeTypes("sfs", "application/vnd.spotfire.sfs"),
			s.addMimeTypes("sdc", "application/vnd.stardivision.calc"),
			s.addMimeTypes("sda", "application/vnd.stardivision.draw"),
			s.addMimeTypes("sdd", "application/vnd.stardivision.impress"),
			s.addMimeTypes("smf", "application/vnd.stardivision.math"),
			s.addMimeTypes("sdw", "application/vnd.stardivision.writer"),
			s.addMimeTypes("vor", "application/vnd.stardivision.writer"),
			s.addMimeTypes("sgl", "application/vnd.stardivision.writer-global"),
			s.addMimeTypes("sxc", "application/vnd.sun.xml.calc"),
			s.addMimeTypes("stc", "application/vnd.sun.xml.calc.template"),
			s.addMimeTypes("sxd", "application/vnd.sun.xml.draw"),
			s.addMimeTypes("std", "application/vnd.sun.xml.draw.template"),
			s.addMimeTypes("sxi", "application/vnd.sun.xml.impress"),
			s.addMimeTypes("sti", "application/vnd.sun.xml.impress.template"),
			s.addMimeTypes("sxm", "application/vnd.sun.xml.math"),
			s.addMimeTypes("sxw", "application/vnd.sun.xml.writer"),
			s.addMimeTypes("sxg", "application/vnd.sun.xml.writer.global"),
			s.addMimeTypes("stw", "application/vnd.sun.xml.writer.template"),
			s.addMimeTypes("sus,susp", "application/vnd.sus-calendar"),
			s.addMimeTypes("svd", "application/vnd.svd"),
			s.addMimeTypes("sis,sisx", "application/vnd.symbian.install"),
			s.addMimeTypes("xsm", "application/vnd.syncml+xml"),
			s.addMimeTypes("bdm", "application/vnd.syncml.dm+wbxml"),
			s.addMimeTypes("xdm", "application/vnd.syncml.dm+xml"),
			s.addMimeTypes("tao", "application/vnd.tao.intent-module-archive"),
			s.addMimeTypes("tmo", "application/vnd.tmobile-livetv"),
			s.addMimeTypes("tpt", "application/vnd.trid.tpt"),
			s.addMimeTypes("mxs", "application/vnd.triscape.mxs"),
			s.addMimeTypes("tra", "application/vnd.trueapp"),
			s.addMimeTypes("ufd,ufdl", "application/vnd.ufdl"),
			s.addMimeTypes("utz", "application/vnd.uiq.theme"),
			s.addMimeTypes("umj", "application/vnd.umajin"),
			s.addMimeTypes("unityweb", "application/vnd.unity"),
			s.addMimeTypes("uoml", "application/vnd.uoml+xml"),
			s.addMimeTypes("vcx", "application/vnd.vcx"),
			s.addMimeTypes("vsd,vst,vss,vsw", "application/vnd.visio"),
			s.addMimeTypes("vis", "application/vnd.visionary"),
			s.addMimeTypes("vsf", "application/vnd.vsf"),
			s.addMimeTypes("wbxml", "application/vnd.wap.wbxml"),
			s.addMimeTypes("wmlc", "application/vnd.wap.wmlc"),
			s.addMimeTypes("wmlsc", "application/vnd.wap.wmlscriptc"),
			s.addMimeTypes("wtb", "application/vnd.webturbo"),
			s.addMimeTypes("wpd", "application/vnd.wordperfect"),
			s.addMimeTypes("wqd", "application/vnd.wqd"),
			s.addMimeTypes("stf", "application/vnd.wt.stf"),
			s.addMimeTypes("xar", "application/vnd.xara"),
			s.addMimeTypes("xfdl", "application/vnd.xfdl"),
			s.addMimeTypes("hvd", "application/vnd.yamaha.hv-dic"),
			s.addMimeTypes("hvs", "application/vnd.yamaha.hv-script"),
			s.addMimeTypes("hvp", "application/vnd.yamaha.hv-voice"),
			s.addMimeTypes("osf", "application/vnd.yamaha.openscoreformat"),
			s.addMimeTypes("osfpvg", "application/vnd.yamaha.openscoreformat.osfpvg+xml"),
			s.addMimeTypes("saf", "application/vnd.yamaha.smaf-audio"),
			s.addMimeTypes("spf", "application/vnd.yamaha.smaf-phrase"),
			s.addMimeTypes("cmp", "application/vnd.yellowriver-custom-menu"),
			s.addMimeTypes("zir,zirz", "application/vnd.zul"),
			s.addMimeTypes("zaz", "application/vnd.zzazz.deck+xml"),
			s.addMimeTypes("vxml", "application/voicexml+xml"),
			s.addMimeTypes("hlp", "application/winhlp"),
			s.addMimeTypes("wsdl", "application/wsdl+xml"),
			s.addMimeTypes("wspolicy", "application/wspolicy+xml"),
			s.addMimeTypes("abw", "application/x-abiword"),
			s.addMimeTypes("ace", "application/x-ace-compressed"),
			s.addMimeTypes("aab,x32,u32,vox", "application/x-authorware-bin"),
			s.addMimeTypes("aam", "application/x-authorware-map"),
			s.addMimeTypes("aas", "application/x-authorware-seg"),
			s.addMimeTypes("torrent", "application/x-bittorrent"),
			s.addMimeTypes("bz", "application/x-bzip"),
			s.addMimeTypes("bz2,boz", "application/x-bzip2"),
			s.addMimeTypes("vcd", "application/x-cdlink"),
			s.addMimeTypes("chat", "application/x-chat"),
			s.addMimeTypes("pgn", "application/x-chess-pgn"),
			s.addMimeTypes("bdf", "application/x-font-bdf"),
			s.addMimeTypes("gsf", "application/x-font-ghostscript"),
			s.addMimeTypes("psf", "application/x-font-linux-psf"),
			s.addMimeTypes("otf", "application/x-font-otf"),
			s.addMimeTypes("pcf", "application/x-font-pcf"),
			s.addMimeTypes("snf", "application/x-font-snf"),
			s.addMimeTypes("ttf,ttc", "application/x-font-ttf"),
			s.addMimeTypes("pfa,pfb,pfm,afm", "application/x-font-type1"),
			s.addMimeTypes("spl", "application/x-futuresplash"),
			s.addMimeTypes("gnumeric", "application/x-gnumeric"),
			s.addMimeTypes("deb,udeb", "application/x-debian-package"),
			s.addMimeTypes("dir,dcr,dxr,cst,cct,cxt,w3d,fgd,swa", "application/x-director"),
			s.addMimeTypes("wad", "application/x-doom"),
			s.addMimeTypes("ncx", "application/x-dtbncx+xml"),
			s.addMimeTypes("dtb", "application/x-dtbook+xml"),
			s.addMimeTypes("res", "application/x-dtbresource+xml"),
			s.addMimeTypes("prc,mobi", "application/x-mobipocket-ebook"),
			s.addMimeTypes("application", "application/x-ms-application"),
			s.addMimeTypes("wmd", "application/x-ms-wmd"),
			s.addMimeTypes("wmz", "application/x-ms-wmz"),
			s.addMimeTypes("xbap", "application/x-ms-xbap"),
			s.addMimeTypes("mdb", "application/x-msaccess"),
			s.addMimeTypes("obd", "application/x-msbinder"),
			s.addMimeTypes("crd", "application/x-mscardfile"),
			s.addMimeTypes("clp", "application/x-msclip"),
			s.addMimeTypes("exe,dll,com,bat,msi", "application/x-msdownload"),
			s.addMimeTypes("mvb,m13,m14", "application/x-msmediaview"),
			s.addMimeTypes("wmf", "application/x-msmetafile"),
			s.addMimeTypes("mny", "application/x-msmoney"),
			s.addMimeTypes("pub", "application/x-mspublisher"),
			s.addMimeTypes("scd", "application/x-msschedule"),
			s.addMimeTypes("trm", "application/x-msterminal"),
			s.addMimeTypes("wri", "application/x-mswrite"),
			s.addMimeTypes("nc,cdf", "application/x-netcdf"),
			s.addMimeTypes("p12,pfx", "application/x-pkcs12"),
			s.addMimeTypes("p7b,spc", "application/x-pkcs7-certificates"),
			s.addMimeTypes("p7r", "application/x-pkcs7-certreqresp"),
			s.addMimeTypes("rar", "application/x-rar-compressed"),
			s.addMimeTypes("src", "application/x-wais-source"),
			s.addMimeTypes("der,crt", "application/x-x509-ca-cert"),
			s.addMimeTypes("fig", "application/x-xfig"),
			s.addMimeTypes("xpi", "application/x-xpinstall"),
			s.addMimeTypes("xenc", "application/xenc+xml"),
			s.addMimeTypes("xhtml,xht", "application/xhtml+xml"),
			s.addMimeTypes("xml,xsl", "application/xml"),
			s.addMimeTypes("dtd", "application/xml-dtd"),
			s.addMimeTypes("xop", "application/xop+xml"),
			s.addMimeTypes("xslt", "application/xslt+xml"),
			s.addMimeTypes("xspf", "application/xspf+xml"),
			s.addMimeTypes("mxml,xhvml,xvml,xvm", "application/xv+xml"),
			s.addMimeTypes("zip", "application/zip"),
			s.addMimeTypes("adp", "audio/adpcm"),
			s.addMimeTypes("au,snd", "audio/basic"),
			s.addMimeTypes("mid,midi,kar,rmi", "audio/midi"),
			s.addMimeTypes("mp4a", "audio/mp4"),
			s.addMimeTypes("m4a,m4p", "audio/mp4a-latm"),
			s.addMimeTypes("mpga,mp2,mp2a,mp3,m2a,m3a", "audio/mpeg"),
			s.addMimeTypes("oga,ogg,spx", "audio/ogg"),
			s.addMimeTypes("eol", "audio/vnd.digital-winds"),
			s.addMimeTypes("dts", "audio/vnd.dts"),
			s.addMimeTypes("dtshd", "audio/vnd.dts.hd"),
			s.addMimeTypes("lvp", "audio/vnd.lucent.voice"),
			s.addMimeTypes("pya", "audio/vnd.ms-playready.media.pya"),
			s.addMimeTypes("ecelp4800", "audio/vnd.nuera.ecelp4800"),
			s.addMimeTypes("ecelp7470", "audio/vnd.nuera.ecelp7470"),
			s.addMimeTypes("ecelp9600", "audio/vnd.nuera.ecelp9600"),
			s.addMimeTypes("aac", "audio/x-aac"),
			s.addMimeTypes("aif,aiff,aifc", "audio/x-aiff"),
			s.addMimeTypes("m3u", "audio/x-mpegurl"),
			s.addMimeTypes("wax", "audio/x-ms-wax"),
			s.addMimeTypes("wma", "audio/x-ms-wma"),
			s.addMimeTypes("ram,ra", "audio/x-pn-realaudio"),
			s.addMimeTypes("rmp", "audio/x-pn-realaudio-plugin"),
			s.addMimeTypes("vsd", "application/x-visio"),
			s.addMimeTypes("vxml", "application/voicexml+xml"),
			s.addMimeTypes("wav", "audio/x-wav"),
			s.addMimeTypes("cdx", "chemical/x-cdx"),
			s.addMimeTypes("cif", "chemical/x-cif"),
			s.addMimeTypes("cmdf", "chemical/x-cmdf"),
			s.addMimeTypes("cml", "chemical/x-cml"),
			s.addMimeTypes("csml", "chemical/x-csml"),
			s.addMimeTypes("xyz", "chemical/x-xyz"),
			s.addMimeTypes("bmp", "image/bmp"),
			s.addMimeTypes("cgm", "image/cgm"),
			s.addMimeTypes("g3", "image/g3fax"),
			s.addMimeTypes("gif", "image/gif"),
			s.addMimeTypes("ief", "image/ief"),
			s.addMimeTypes("jp2", "image/jp2"),
			s.addMimeTypes("pict,pic,pct", "image/pict"),
			s.addMimeTypes("png", "image/png"),
			s.addMimeTypes("btif", "image/prs.btif"),
			s.addMimeTypes("svg,svgz", "image/svg+xml"),
			s.addMimeTypes("tiff,tif", "image/tiff"),
			s.addMimeTypes("psd", "image/vnd.adobe.photoshop"),
			s.addMimeTypes("djvu,djv", "image/vnd.djvu"),
			s.addMimeTypes("dwg", "image/vnd.dwg"),
			s.addMimeTypes("dxf", "image/vnd.dxf"),
			s.addMimeTypes("fbs", "image/vnd.fastbidsheet"),
			s.addMimeTypes("fpx", "image/vnd.fpx"),
			s.addMimeTypes("fst", "image/vnd.fst"),
			s.addMimeTypes("mmr", "image/vnd.fujixerox.edmics-mmr"),
			s.addMimeTypes("rlc", "image/vnd.fujixerox.edmics-rlc"),
			s.addMimeTypes("mdi", "image/vnd.ms-modi"),
			s.addMimeTypes("npx", "image/vnd.net-fpx"),
			s.addMimeTypes("wbmp", "image/vnd.wap.wbmp"),
			s.addMimeTypes("xif", "image/vnd.xiff"),
			s.addMimeTypes("ras", "image/x-cmu-raster"),
			s.addMimeTypes("cmx", "image/x-cmx"),
			s.addMimeTypes("fh,fhc,fh4,fh5,fh7", "image/x-freehand"),
			s.addMimeTypes("ico", "image/x-icon"),
			s.addMimeTypes("pntg,pnt,mac", "image/x-macpaint"),
			s.addMimeTypes("pcx", "image/x-pcx"),
			s.addMimeTypes("pnm", "image/x-portable-anymap"),
			s.addMimeTypes("pbm", "image/x-portable-bitmap"),
			s.addMimeTypes("pgm", "image/x-portable-graymap"),
			s.addMimeTypes("ppm", "image/x-portable-pixmap"),
			s.addMimeTypes("qtif,qti", "image/x-quicktime"),
			s.addMimeTypes("rgb", "image/x-rgb"),
			s.addMimeTypes("xbm", "image/x-xbitmap"),
			s.addMimeTypes("xpm", "image/x-xpixmap"),
			s.addMimeTypes("xwd", "image/x-xwindowdump"),
			s.addMimeTypes("eml,mime", "message/rfc822"),
			s.addMimeTypes("igs,iges", "model/iges"),
			s.addMimeTypes("msh,mesh,silo", "model/mesh"),
			s.addMimeTypes("dwf", "model/vnd.dwf"),
			s.addMimeTypes("gdl", "model/vnd.gdl"),
			s.addMimeTypes("gtw", "model/vnd.gtw"),
			s.addMimeTypes("mts", "model/vnd.mts"),
			s.addMimeTypes("vtu", "model/vnd.vtu"),
			s.addMimeTypes("wrl,vrml", "model/vrml"),
			s.addMimeTypes("ics,ifb", "text/calendar"),
			s.addMimeTypes("css", "text/css"),
			s.addMimeTypes("csv", "text/csv"),
			s.addMimeTypes("html,htm", "text/html"),
			s.addMimeTypes("txt,text,conf,def,list,log,in", "text/plain"),
			s.addMimeTypes("dsc", "text/prs.lines.tag"),
			s.addMimeTypes("rtx", "text/richtext"),
			s.addMimeTypes("sgml,sgm", "text/sgml"),
			s.addMimeTypes("tsv", "text/tab-separated-values"),
			s.addMimeTypes("t,tr,roff,man,me,ms", "text/troff"),
			s.addMimeTypes("uri,uris,urls", "text/uri-list"),
			s.addMimeTypes("curl", "text/vnd.curl"),
			s.addMimeTypes("dcurl", "text/vnd.curl.dcurl"),
			s.addMimeTypes("scurl", "text/vnd.curl.scurl"),
			s.addMimeTypes("mcurl", "text/vnd.curl.mcurl"),
			s.addMimeTypes("fly", "text/vnd.fly"),
			s.addMimeTypes("flx", "text/vnd.fmi.flexstor"),
			s.addMimeTypes("gv", "text/vnd.graphviz"),
			s.addMimeTypes("3dml", "text/vnd.in3d.3dml"),
			s.addMimeTypes("spot", "text/vnd.in3d.spot"),
			s.addMimeTypes("jad", "text/vnd.sun.j2me.app-descriptor"),
			s.addMimeTypes("s,asm", "text/x-asm"),
			s.addMimeTypes("c,cc,cxx,cpp,h,hh,dic", "text/x-c"),
			s.addMimeTypes("f,for,f77,f90", "text/x-fortran"),
			s.addMimeTypes("p,pas", "text/x-pascal"),
			s.addMimeTypes("java", "text/x-java-source"),
			s.addMimeTypes("etx", "text/x-setext"),
			s.addMimeTypes("uu", "text/x-uuencode"),
			s.addMimeTypes("vcs", "text/x-vcalendar"),
			s.addMimeTypes("vcf", "text/x-vcard"),
			s.addMimeTypes("3gp", "video/3gpp"),
			s.addMimeTypes("3g2", "video/3gpp2"),
			s.addMimeTypes("h261", "video/h261"),
			s.addMimeTypes("h263", "video/h263"),
			s.addMimeTypes("h264", "video/h264"),
			s.addMimeTypes("jpgv", "video/jpeg"),
			s.addMimeTypes("jpm,jpgm", "video/jpm"),
			s.addMimeTypes("mj2,mjp2", "video/mj2"),
			s.addMimeTypes("mp4,mp4v,mpg4,m4v", "video/mp4"),
			s.addMimeTypes("mpeg,mpg,mpe,m1v,m2v", "video/mpeg"),
			s.addMimeTypes("ogv", "video/ogg"),
			s.addMimeTypes("qt,mov", "video/quicktime"),
			s.addMimeTypes("fvt", "video/vnd.fvt"),
			s.addMimeTypes("mxu,m4u", "video/vnd.mpegurl"),
			s.addMimeTypes("pyv", "video/vnd.ms-playready.media.pyv"),
			s.addMimeTypes("viv", "video/vnd.vivo"),
			s.addMimeTypes("dv,dif", "video/x-dv"),
			s.addMimeTypes("f4v", "video/x-f4v"),
			s.addMimeTypes("fli", "video/x-fli"),
			s.addMimeTypes("flv", "video/x-flv"),
			s.addMimeTypes("asf,asx", "video/x-ms-asf"),
			s.addMimeTypes("wm", "video/x-ms-wm"),
			s.addMimeTypes("wmx", "video/x-ms-wmx"),
			s.addMimeTypes("wvx", "video/x-ms-wvx"),
			s.addMimeTypes("avi", "video/x-msvideo"),
			s.addMimeTypes("movie", "video/x-sgi-movie"),
			s.addMimeTypes("ice", "x-conference/x-cooltalk")
		}
		function o(e, i) {
			p === d.NONE ? (t(), p = d.INITIAL_LOAD) : p === d.INITIAL_LOAD && (l[i] || r[e] || (a(), p = d.FULLY_LOADED))
		}
		var s,
		l = {},
		r = {},
		d = {
			NONE : 0,
			INITIAL_LOAD : 1,
			FULLY_LOADED : 2
		},
		p = d.NONE;
		s = {
			lookupByFileEnding : function (e) {
				return o(null, e),
				l[e]
			},
			fileEndingbyMIME : function (e) {
				return o(e, null),
				r[e]
			},
			addMimeTypes : function (e, i) {
				var n = e.split(",");
				n.forEach(function (e) {
					l[e] = i,
					r[i] || (r[i] = []),
					r[i].push(e)
				})
			}
		},
		n.exports = s
	}),
	define("wp2/lib/utils", ["require", "exports", "module", "./mimeTypes", "./mimeTypes"], function (e, i, n) {
		var t,
		a;
		t = {
			inNode : function () {
				return !!e.resolve
			},
			getQnxNamespace : function () {
				return t.inNode() ? null : qnx
			},
			base64Encode : function (e) {
				return window.btoa(window.unescape(window.encodeURIComponent(e)))
			},
			base64Decode : function (e) {
				return window.decodeURIComponent(window.escape(window.atob(e)))
			},
			copy : function (e) {
				var i,
				n = e ? e.isArray ? [] : {}

				 : !1;
				if ("number" == typeof e || "string" == typeof e || "boolean" == typeof e || null === e || void 0 === e)
					return e;
				if (e instanceof Date)
					return new Date(e);
				if (e instanceof RegExp)
					return RegExp(e);
				for (i in e)
					e.hasOwnProperty(i) && (n[i] = e[i] && "object" == typeof e[i] ? e[i]instanceof Date ? e[i] : t.copy(e[i]) : e[i]);
				return n
			},
			parseURI : function (e) {
				var i,
				n = {},
				t = ["source", "scheme", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
				a = /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/.exec(e);
				for (i = t.length - 1; i >= 0; i--)
					n[t[i]] = a[i] || "";
				return n
			},
			isLocalURI : function (e) {
				return e && e.scheme && -1 !== "local:///".indexOf(e.scheme.toLowerCase())
			},
			isFileURI : function (e) {
				return e && e.scheme && -1 !== "file://".indexOf(e.scheme.toLowerCase())
			},
			isHttpURI : function (e) {
				return e && e.scheme && -1 !== "http://".indexOf(e.scheme.toLowerCase())
			},
			isHttpsURI : function (e) {
				return e && e.scheme && -1 !== "https://".indexOf(e.scheme.toLowerCase())
			},
			isDataURI : function (e) {
				return e && e.scheme && -1 !== "data:".indexOf(e.scheme.toLowerCase())
			},
			isTelURI : function (e) {
				return e && e.scheme && -1 !== "tel:".indexOf(e.scheme.toLowerCase())
			},
			isLocalUrl : function (e) {
				return e && -1 !== e.indexOf("local:///") ? !0 : !1
			},
			isDataUrl : function (e) {
				return e && "data:" === e.substring(0, 5) ? !0 : void 0
			},
			startsWith : function (e, i) {
				return 0 === e.indexOf(i)
			},
			fileNameToMIME : function (i) {
				var n = i.split(".").pop();
				return a || (a = e("./mimeTypes")),
				a.lookupByFileEnding(n)
			},
			fileEndingByMIME : function (i) {
				return a || (a = e("./mimeTypes")),
				a.fileEndingbyMIME(i)
			},
			series : function (e, i) {
				var n = function () {
					var t,
					a = [];
					e.length ? (t = e.shift(), a = a.concat(t.args).concat(n), t.func.apply(this, a)) : i.func.apply(this, i.args)
				};
				n()
			},
			language : function () {
				return navigator.language
			},
			i18n : function () {
				var e = {
					translate : function (e) {
						return {
							fetch : function () {
								return e
							}
						}
					},
					format : function (e) {
						return {
							fetch : function () {
								return e
							}
						}
					},
					reset : function () {}

				};
				return wp.i18n ? wp.i18n : e
			},
			mixin : function (e, i) {
				return Object.getOwnPropertyNames(e).forEach(function (n) {
					Object.hasOwnProperty.call(e, n) && Object.defineProperty(i, n, Object.getOwnPropertyDescriptor(e, n))
				}),
				i
			},
			translatePath : function (e) {
				var i = wp.getApplication().getEnv("HOME");
				return t.isLocalUrl(e) && (e = "file:///" + i.replace(/^\/*/, "") + "/../app/native/" + e.replace(/local:\/\/\//, "")),
				e
			},
			downloadFile : function (e, i, n, a, o) {
				var s,
				l = e.replace(/^.*[\\\/]/, ""),
				r = t.fileNameToMIME(l);
				r ? r.length > 1 && r.isArray && (r = r[0]) : r = "text/plain",
				"object" == typeof i && (i = i[0]),
				o !== void 0 && (r = o.mimeType ? o.mimeType : r, l = o.fileName ? o.fileName : l),
				window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem,
				e = t.translatePath(e),
				s = new XMLHttpRequest,
				s.open("GET", e, !0),
				s.responseType = "blob",
				s.onload = function () {
					window.requestFileSystem(window.TEMPORARY, 1048576, function (e) {
						e.root.getFile(i, {
							create : !0
						}, function (e) {
							e.createWriter(function (e) {
								e.onerror = function () {
									console.log("Could not properly write " + l)
								};
								var t = new Blob([s.response], {
										type : r
									});
								e.write(t),
								n && n("file:///" + i.replace(/^\/*/, ""))
							}, a)
						}, a)
					}, a)
				},
				s.send()
			}
		},
		n.exports = t
	}),
	define("core/plugins/dialog/api", ["require", "exports", "module", "./../../../wp2/lib/utils"], function (e, i, n) {
		function t(e, i) {
			m ? f.push({
				description : e,
				callback : i
			}) : (m = !0, u = i, wp.ui.default.showRenderingWebView(), p.rpc.postMessage("dialog.show", e))
			}
			function a(e) {
				var i,
				n,
				a = 1,
				o = e.waitHandle;
				"function" == typeof u && ("CustomAsk" === e.dialogType ? u(e.buttonIndex, e) : u(e)),
				n = wp.getWebViewById(e.webviewId) || wp.getWebViewById(1),
				o && (e && e.ok || e.oktext ? n.dialogResponse(o, e.oktext, e.username, e.password) : e && e.cancel ? n.dialogResponse(o, "") : n.dialogResponse(o, !0)),
				m = !1,
				f.length > 0 ? (i = f.shift(), t(i.description, i.callback)) : wp.core.events.emit(a, "dialog.hide", [n.id]),
				wp.ui.default.hideRenderingWebView()
			}
			function o(e) {
				c = "function" == typeof e.getWebViewObj ? e.getWebViewObj() : e,
				e = c,
				e.on("DialogRequested", y.DialogRequested = function (e, i) {
					var n = JSON.parse(i),
					a = {};
					switch (n.webviewId = e.webviewId ? e.webviewId : null, n.dialogType) {
					case h:
					case g:
					case w:
						c.dialogResponse(n.waitHandle, !0);
						break;
					case x:
						c.dialogResponse(n.waitHandle, !0),
						wp.core.events.emit("application.mediaError", [i]);
						break;
					default:
						n.hasOwnProperty("waitHandle") && (t(n), a.setWait = !0)
					}
					a.setPreventDefault = !0,
					e.returnValue = JSON.stringify(a)
				}),
				e.on("SSLHandshakingFailed", y.SSLHandshakingFailed = function (i, n) {
					var a = JSON.parse(n),
					o = a.url,
					s = {
						dialogType : "SSLCertificateException",
						url : o,
						webviewId : i.webviewId ? i.webviewId : null
					};
					t(s, function (i) {
						i.ok ? e.continueSSLHandshaking(a.streamId, "SSLActionTrust") : e.continueSSLHandshaking(a.streamId, "SSLActionReject")
					})
				}),
				e.on("GeolocationPermissionRequest", y.GeolocationPermissionRequest = function (i, n) {
					var a = JSON.parse(n),
					o = {
						dialogType : "GeolocationPermission",
						url : a.origin,
						waitHandle : i.waitHandle,
						webviewId : i.webviewId ? i.webviewId : null
					},
					s = {
						target : "sys.settings.card",
						uri : "settings://location"
					},
					l = function () {
						e.reload(),
						wp.core.invocation.un("childCardClosed", l)
					};
					a.showGlobalPermissionRequest ? t(o, function (i) {
						i.ok ? (wp.core.invocation.on("childCardClosed", l), wp.core.invocation.invoke(s), e.allowGeolocation(a.origin)) : e.disallowGeolocation(a.origin)
					}) : e.allowGeolocation(a.origin),
					i.returnValue = '{"setPreventDefault": true}'
				}),
				e.on("UserMediaRequest", y.UserMediaRequest = function (i, n) {
					function a(e) {
						return "CAMERA_UNIT_FRONT" === e ? r.translate("Front").fetch() : r.translate("Rear").fetch()
					}
					var o,
					s,
					l = JSON.parse(n),
					d = [];
					if (l.cameras && 0 !== l.cameras.length) {
						if (1 === l.cameras.length)
							e.allowUserMedia(l.id, l.cameras[0]);
						else {
							for (s = 0; l.cameras.length > s; s++)
								d[s] = a(l.cameras[s]);
							o = {
								dialogType : "CameraSelection",
								title : r.translate("Camera Selection").fetch(),
								cameras : d,
								webviewId : i.webviewId ? i.webviewId : null
							}
						}
						t(o, function (i) {
							i.ok && e.allowUserMedia(l.id, l.cameras[i.cameraSelectedIndex])
						})
					}
				})
			}
			function s(e) {
				c = "function" == typeof e.getWebViewObj ? e.getWebViewObj() : e,
				e.un("DialogRequested", y.DialogRequested),
				e.un("SSLHandshakingFailed", y.SSLHandshakingFailed),
				e.un("GeolocationPermissionRequest", y.GeolocationPermissionRequest),
				e.un("UserMediaRequest", y.UserMediaRequest)
			}
			function l(e) {
				p = e,
				r = v.i18n(),
				m = !1,
				f = [],
				p.rpc.un("dialog.response", y.dialogResult),
				p.rpc.on("dialog.response", y.dialogResult = function (e, i) {
					a(i)
				})
			}
			var r,
			d,
			p,
			c,
			u,
			m,
			f,
			v = e("./../../../wp2/lib/utils"),
			y = {},
			h = "InsecureSubresourceLoadPolicyConfirm",
			g = "DatabaseQuotaExceeded",
			w = "WebFileSystemQuotaExceeded",
			x = "MediaError";
			d = {
				show : t,
				subscribeTo : o,
				unsubscribeTo : s,
				result : a,
				renderOn : l
			},
			n.exports = d
		}),
		define("core/lib/rpc/rpc", ["require", "exports", "module"], function (require, exports, module) {
			function postMessage(e, i, n) {
				var t,
				a;
				return i && "string" == typeof i ? (t = void 0 === n ? "" : "object" == typeof n ? JSON.stringify(n) : "'" + n + "'", a = "wp.view.rpc.emit('" + i + "', [" + t + "])", e.executeJavaScript(a), void 0) : Error("Message type is required")
			}
			function handleJSCallback(webView, webViewOptions, value) {
				var args = eval(JSON.parse(value).args),
				command = args[0],
				info,
				eventOptions = {};
				"webplatform.rpc" === command && (info = JSON.parse(args[1]), webView.rpc.emit(info.messageType, [info.message], eventOptions))
			}
			function on(e, i, n) {
				e.on("rpc." + i, n)
			}
			function once(e, i, n) {
				e.once("rpc." + i, n)
			}
			function un(e, i, n) {
				e.un("rpc." + i, n)
			}
			function emit(e, i, n, t) {
				e.emit("rpc." + i, n, t)
			}
			function enableRpcOn(e) {
				e.isWebEventAllowed("JavaScriptCallback") || (e.allowQnxObject = !0, e.on("JavaScriptCallback", handleJSCallback.bind(null, e)))
			}
			function disableRpcOn(e) {
				e.isWebEventAllowed("JavaScriptCallback") && (e.allowQnxObject = !1, e.un("JavaScriptCallback", handleJSCallback.bind(null, e)))
			}
			var rpc;
			rpc = {
				postMessage : postMessage,
				on : on,
				un : un,
				once : once,
				emit : emit,
				enableRpcOn : enableRpcOn,
				disableRpcOn : disableRpcOn
			},
			module.exports = rpc
		}),
		define("core/lib/automation/main", ["require", "exports", "module", "./../events", "../pps/pps", "./../../plugins/dialog/api", "./../rpc/rpc"], function (e, i, n) {
			var t,
			a,
			o,
			s,
			l,
			r = e("./../events"),
			d = e("../pps/pps"),
			p = e("./../../plugins/dialog/api"),
			c = e("./../rpc/rpc"),
			u = !1,
			m = !1,
			f = !1,
			v = "webDriverCoreScript",
			y = function (e) {
				if (!f) {
					var i = document.createElement("script");
					i.type = "text/javascript",
					i.id = v,
					i.onload = function () {
						o = seleniumCoreRequire("main"),
						o.init(),
						e ? e() : window.wp.hasOwnProperty("getApplication") || seleniumCoreRequire("browser").clearBrowserData()
					},
					i.src = "platform:///seleniumCore.js",
					document.getElementsByTagName("head")[0].appendChild(i),
					f = !0,
					m = !0
				}
			},
			h = function (e) {
				s = e
			},
			g = function () {
				if (t = d.create("/pps/browser/control", d.PPSMode.DELTA), a = d.create("/pps/browser/output", d.PPSMode.FULL), t.onFirstReadComplete = h, t.open(d.FileMode.RDONLY) && a.open(d.FileMode.WRONLY)) {
					var e = function () {
						u = !0,
						o.output = a.write,
						t.onNewData = o.ppsNewData,
						s ? o.ppsNewData(s) : t.onFirstReadComplete = o.ppsNewData,
						o.closePPS = l.close
					};
					y(e)
				}
			},
			w = function () {
				var e,
				i,
				n,
				t = d.create("/pps/services/automation/browser/output", d.PPSMode.FULL);
				t.open(d.FileMode.WRONLY) && (e = window.require("iris/tabs/controller"), r.on("webpage.load.progress", function (t, a) {
						a >= 90 && (n = e.get(t), qnx.callExtensionMethod("webview.automationLog", window.iris.chromeId, "progressBarDisappears"), i = "Navigation Request: old url=" + n.oldUrl + " new url=" + n.url + " webviewId= " + n.webviewId, console.log(i))
					}), t.close())
			};
			l = {
				init : y,
				dialogs : p,
				rpc : c,
				dinit : function () {
					var e = document.getElementById(v);
					e && e.parentNode.removeChild(e),
					u = !1,
					f = !1,
					m = !1,
					o = 0
				},
				close : function () {
					t.close(),
					a.close()
				}
			},
			r.once("automation.init", g),
			r.once("automation.init", w),
			n.exports = l
		}),
		define("core/lib/core", ["require", "exports", "module", "./events", "./pps/ppsUtils", "./invocation", "./error", "./automation/main"], function (e, i, n) {
			n.exports = {
				events : e("./events"),
				pps : e("./pps/ppsUtils"),
				invocation : e("./invocation"),
				error : e("./error"),
				automation : e("./automation/main")
			}
		}),
		define("core/lib/main", ["require", "exports", "module", "./rpc/rpc.view", "./core", "./automation/main"], function (e) {
			window.wp || (window.wp = {}),
			window.wp.view || (window.wp.view = {}),
			window.wp.view.rpc = e("./rpc/rpc.view"),
			window.wp.core = e("./core"),
			window.wp.core.automation = e("./automation/main")
		}),
		require(["./core/lib/main"])
	})();
	//@ sourceMappingURL=wp-core.js.map
	var PUBLIC_BUILD = 1, moduleFunctions = {}, loadedModules = {};
	window.define = function (e, t) {
		moduleFunctions[e] = t
	}, window.require = function (e) {
		if (moduleFunctions[e]) {
			var t = {
				exports : {}

			},
			n = moduleFunctions[e];
			delete moduleFunctions[e],
			n(window.require, t.exports, t),
			loadedModules[e] = {
				moduleObject : t.exports,
				moduleFunction : n
			}
		}
		return loadedModules[e] && loadedModules[e].moduleObject
	}, window.requireNewInstance = function (e) {
		if (require(e), loadedModules[e]) {
			var t = {
				exports : {}

			};
			return loadedModules[e].moduleFunction(window.require, t.exports, t),
			t.exports
		}
	};
	var Convert = {};
	(function (e) {
		function t(e, t) {
			for (var n = []; e.length > t; )
				n.push(e.substring(0, t)), e = e.substring(t);
			return e.length > 0 && n.push(e),
			n.join("\n")
		}
		function n(e, t, n) {
			for (var i = [], r = 0; e.length > r; r++)
				i.push(t(e.charAt(r), e.charCodeAt(r)));
			return i.join(n || "")
		}
		function i(e, t, n) {
			for (var i = {
					str : e,
					read : function (e, t) {
						var n = "";
						for (e = e || 1; e > n.length && this.str.length > 0; ) {
							var i = this.str.charAt(0);
							if (t && !t.test(i))
								break;
							n += i,
							this.str = this.str.substring(1)
						}
						return n
					},
					unread : function (e) {
						this.str = e + this.str
					}
				}, r = []; i.str.length > 0; )
				r.push(t(i.read(), i));
			return r.join(n || "")
		}
		function r(e) {
			for (var t = [], n = 0; e.length > n; n++) {
				var i = e.charCodeAt(n);
				i >= 256 && t.push(255 & i >> 8),
				t.push(255 & i)
			}
			return t
		}
		function a(e, t) {
			t = t || 4;
			for (var n = e.toString(16).toUpperCase(); t > n.length; )
				n = "0" + n;
			return n
		}
		function o(e) {
			return /^[\x09\x0A\x0D\x20-\x7E]*$/.test(e)
		}
		function s(e) {
			function t(e) {
				return o(e) ? e : "?"
			}
			return n(e, t)
		}
		function c(e) {
			return /^([\x09\x0A\x0D\x20-\x7E]|[\xA0-\xFF])*$/.test(e)
		}
		function l(e) {
			function t(e) {
				return c(e) ? e : "?"
			}
			return n(e, t)
		}
		function d(e) {
			return /^([\x09\x0A\x0D\x20-\x7E]|[\xC2-\xDF][\x80-\xBF]|\xE0[\xA0-\xBF][\x80-\xBF]|[\xE1-\xEC\xEE\xEF][\x80-\xBF]{2}|\xED[\x80-\x9F][\x80-\xBF])*$/.test(e)
		}
		function u(e) {
			for (var t = [], n = r(e), i = 0; e.length > i; i++) {
				var a = e.charCodeAt(i);
				if (a >= 192 && 223 >= a) {
					var o = n[++i];
					a = (31 & a) << 6 | 63 & o
				} else if (a >= 224 && 239 >= a) {
					var o = n[++i],
					s = n[++i];
					a = (15 & a) << 12 | (63 & o) << 6 | 63 & s
				} else
					a >= 128 && (a = 65533);
				t.push(String.fromCharCode(a))
			}
			return t.join("")
		}
		function m(e, t, n) {
			for (var i = [], r = t; t + n > r; r++) {
				var a = e[r];
				if (a >= 192 && 223 >= a) {
					var o = e[++r];
					a = (31 & a) << 6 | 63 & o
				} else if (a >= 224 && 239 >= a) {
					var o = e[++r],
					s = e[++r];
					a = (15 & a) << 12 | (63 & o) << 6 | 63 & s
				} else
					a >= 128 && (a = 65533);
				i.push(String.fromCharCode(a))
			}
			return i.join("")
		}
		function f(e) {
			return unescape(encodeURIComponent(e))
		}
		function p(e) {
			var t = e.replace(/[A-Za-z0-9\+\/\=]/g, "");
			return e.length > 0 && /^\s*$/.test(t) && .05 >= t.length / e.length
		}
		function g(e) {
			var t = [];
			e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
			for (var n = 0; e.length > n; ) {
				var i = V.indexOf(e.charAt(n++)),
				r = V.indexOf(e.charAt(n++)),
				a = V.indexOf(e.charAt(n++)),
				o = V.indexOf(e.charAt(n++)),
				s = i << 2 | r >> 4,
				c = (15 & r) << 4 | a >> 2,
				l = (3 & a) << 6 | o;
				t.push(String.fromCharCode(s)),
				64 != a && t.push(String.fromCharCode(c)),
				64 != o && t.push(String.fromCharCode(l))
			}
			return t.join("")
		}
		function h(e) {
			for (var n = [], i = r(e), a = 0; i.length > a; ) {
				var o = i[a++],
				s = i[a++],
				c = i[a++],
				l = o >> 2,
				d = (3 & o) << 4 | s >> 4,
				u = (15 & s) << 2 | c >> 6,
				m = 63 & c;
				isNaN(s) ? u = m = 64 : isNaN(c) && (m = 64),
				n.push(V.charAt(l)),
				n.push(V.charAt(d)),
				n.push(V.charAt(u)),
				n.push(V.charAt(m))
			}
			return t(n.join(""), 64)
		}
		function v(e) {
			var t = e.replace(/[0-9a-fA-F\s]/g, "");
			return e.length > 0 && 0 == t.length
		}
		function b(e) {
			var t = [];
			e = e.replace(/[^0-9a-fA-F]/g, "");
			for (var n = 0; e.length > n; n += 2) {
				var i = parseInt(e.substr(n, 2), 16);
				t.push(String.fromCharCode(i))
			}
			return t.join("")
		}
		function E(e) {
			for (var n = [], i = r(e), o = 0; i.length > o; o++)
				n.push(a(i[o], 2));
			return t(n.join(" "), 60)
		}
		function w(e) {
			return o(e) && /=/.test(e) && /^([^=]|=[0-9a-fA-F][0-9a-fA-F]|=\?|=\r?\n)+=?$/.test(e)
		}
		function T(e) {
			function t(e, t) {
				if ("=" == e) {
					var n = t.read(2, /[0-9a-fA-F]/);
					if (n.length > 0) {
						var i = parseInt(n, 16);
						return String.fromCharCode(i)
					}
					return ""
				}
				return e
			}
			return i(e, t)
		}
		function y(e) {
			function t(e, t) {
				return 10 == t ? "\n" : 13 == t ? "" : 61 == t ? "=3D" : t >= 32 && 127 > t ? e : "=" + a(t, 2)
			}
			for (var i = [], r = n(e, t).split(/\r\n|\n|\r/), o = 0; r.length > o; o++) {
				for (var s = r[o]; s.length > 70; ) {
					var c = s.substring(0, 64),
					l = /(=|=.)$/.exec(c);
					l && (c = c.substring(0, c.length - l[0].length)),
					i.push(c + "="),
					s = s.substring(c.length)
				}
				i.push(s)
			}
			return i.join("\n")
		}
		function I(e) {
			return /^".*"$/.test(e) || /^'.*'$/.test(e) || /\\[btnfru0-7]/.test(e)
		}
		function S(e) {
			function t(e, t) {
				if ("\\" == e) {
					if (e = t.read(), "b" == e)
						return "\b";
					if ("t" == e)
						return "	";
					if ("n" == e)
						return "\n";
					if ("f" == e)
						return "\f";
					if ("r" == e)
						return "\r";
					if ("u" == e) {
						var n = t.read(4, /[0-9a-fA-F]/),
						i = parseInt(n, 16);
						return String.fromCharCode(i)
					}
					if (/[0-7]/.test(e)) {
						t.unread(e);
						var n = t.read(3, /[0-7]/),
						i = parseInt(n, 8);
						return String.fromCharCode(i)
					}
					return e
				}
				return e
			}
			return (/^".*"$/.test(e) || /^'.*'$/.test(e)) && (e = e.substr(1, e.length - 2)),
			i(e, t)
		}
		function x(e) {
			function t(e, t) {
				return "\\" == e ? "\\\\" : '"' == e ? "\\" + e : t >= 32 && 127 > t ? e : 8 == t ? "\\b" : 9 == t ? "\\t" : 10 == t ? "\\n" : 12 == t ? "\\f" : 13 == t ? "\\r" : "\\u" + a(t, 4)
			}
			return '"' + n(e, t) + '"'
		}
		function C(e) {
			return /^E?'(.*)'$/.test(e) || e.indexOf("''") >= 0 || e.indexOf("\\") >= 0
		}
		function k(e) {
			function t(e, t) {
				if ("'" == e)
					return t.read();
				if ("\\" == e) {
					if (e = t.read(), "b" == e)
						return "\b";
					if ("t" == e)
						return "	";
					if ("n" == e)
						return "\n";
					if ("f" == e)
						return "\f";
					if ("r" == e)
						return "\r";
					if ("x" == e) {
						var n = t.read(2, /[0-9a-fA-F]/),
						i = parseInt(n, 16);
						return String.fromCharCode(i)
					}
					if ("u" == e) {
						var n = t.read(4, /[0-9a-fA-F]/),
						i = parseInt(n, 16);
						return String.fromCharCode(i)
					}
					if (/[0-7]/.test(e)) {
						t.unread(e);
						var n = t.read(3, /[0-7]/),
						i = parseInt(n, 8);
						return String.fromCharCode(i)
					}
					return e
				}
				return e
			}
			var n = /^E?'(.*)'$/.exec(e);
			return n && (e = n[1]),
			i(e, t)
		}
		function A(e) {
			function t(e) {
				return "'" == e ? "''" : e
			}
			return "'" + n(e, t) + "'"
		}
		function N(e) {
			function t(e, t) {
				return "'" == e ? "\\'" : "\\" == e ? "\\\\" : t >= 32 && 127 > t ? e : 8 == t ? "\\b" : 9 == t ? "\\t" : 10 == t ? "\\n" : 12 == t ? "\\f" : 13 == t ? "\\r" : "\\u" + a(t, 4)
			}
			return "E'" + n(e, t) + "'"
		}
		function L(e) {
			return /^[a-z]{1,10}:/.test(e) && /%[0-9A-Fa-f]{2}/.test(e)
		}
		function _(e) {
			return decodeURI(e)
		}
		function R(e) {
			return e = encodeURI(e),
			e = e.replace(/%5B/g, "["),
			e = e.replace(/%5D/g, "]")
		}
		function O(e) {
			return /%[0-9A-Fa-f]{2}/.test(e)
		}
		function D(e) {
			return e = e.replace(/\+/g, "%20"),
			e = decodeURIComponent(e)
		}
		function B(e) {
			return e = encodeURIComponent(e),
			e = e.replace(/%20/g, "+"),
			e = e.split(/%0D%0A|%0A%0D|%0D|%0A/i).join("%0D%0A")
		}
		function M(e) {
			return /&[A-Za-z]{1,8};/.test(e) || /&#[0-9]{1,6};/.test(e) || /&#x[0-9a-fA-F]{1,4};/.test(e)
		}
		function P(e) {
			function t(e, t) {
				if ("&" == e) {
					var n = t.read(10, /[^;]/);
					if (e = t.read(), ";" != e)
						return t.unread(e), t.unread(n), "&";
					if (/^#x[0-9a-fA-F]+$/.test(n)) {
						var i = parseInt(n.substr(2), 16);
						return String.fromCharCode(i)
					}
					if (/^#[0-9]+$/.test(n)) {
						var i = parseInt(n.substr(1), 10);
						return String.fromCharCode(i)
					}
					return W.hasOwnProperty(n) ? W[n] : (t.unread(";"), t.unread(n), "&")
				}
				return e
			}
			return i(e, t)
		}
		function U(e) {
			return e = e.replace(/&/g, "&amp;"),
			e = e.replace(/\"/g, "&quot;"),
			e = e.replace(/\'/g, "&apos;"),
			e = e.replace(/</g, "&lt;"),
			e = e.replace(/>/g, "&gt;")
		}
		function F(e) {
			function t(e, t) {
				return 127 > t ? e : "&#" + t + ";"
			}
			return n(U(e), t)
		}
		function H(e) {
			function t(e, t) {
				return 127 > t ? e : q[e] ? q[e] : "&#" + t + ";"
			}
			return n(U(e), t)
		}
		var V = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
		W = {
			amp : "&",
			quot : '"',
			apos : "'",
			lt : "<",
			gt : ">",
			nbsp : " ",
			iexcl : "¡",
			cent : "¢",
			pound : "£",
			curren : "¤",
			yen : "¥",
			brvbar : "¦",
			sect : "§",
			uml : "¨",
			copy : "©",
			ordf : "ª",
			laquo : "«",
			not : "¬",
			shy : "­",
			reg : "®",
			macr : "¯",
			deg : "°",
			plusmn : "±",
			sup2 : "²",
			sup3 : "³",
			acute : "´",
			micro : "µ",
			para : "¶",
			middot : "·",
			cedil : "¸",
			sup1 : "¹",
			ordm : "º",
			raquo : "»",
			frac14 : "¼",
			frac12 : "½",
			frac34 : "¾",
			iquest : "¿",
			Agrave : "À",
			Aacute : "Á",
			Acirc : "Â",
			Atilde : "Ã",
			Auml : "Ä",
			Aring : "Å",
			AElig : "Æ",
			Ccedil : "Ç",
			Egrave : "È",
			Eacute : "É",
			Ecirc : "Ê",
			Euml : "Ë",
			Igrave : "Ì",
			Iacute : "Í",
			Icirc : "Î",
			Iuml : "Ï",
			ETH : "Ð",
			Ntilde : "Ñ",
			Ograve : "Ò",
			Oacute : "Ó",
			Ocirc : "Ô",
			Otilde : "Õ",
			Ouml : "Ö",
			times : "×",
			Oslash : "Ø",
			Ugrave : "Ù",
			Uacute : "Ú",
			Ucirc : "Û",
			Uuml : "Ü",
			Yacute : "Ý",
			THORN : "Þ",
			szlig : "ß",
			agrave : "à",
			aacute : "á",
			acirc : "â",
			atilde : "ã",
			auml : "ä",
			aring : "å",
			aelig : "æ",
			ccedil : "ç",
			egrave : "è",
			eacute : "é",
			ecirc : "ê",
			euml : "ë",
			igrave : "ì",
			iacute : "í",
			icirc : "î",
			iuml : "ï",
			eth : "ð",
			ntilde : "ñ",
			ograve : "ò",
			oacute : "ó",
			ocirc : "ô",
			otilde : "õ",
			ouml : "ö",
			divide : "÷",
			oslash : "ø",
			ugrave : "ù",
			uacute : "ú",
			ucirc : "û",
			uuml : "ü",
			yacute : "ý",
			thorn : "þ",
			yuml : "ÿ",
			OElig : "Œ",
			oelig : "œ",
			Scaron : "Š",
			scaron : "š",
			Yuml : "Ÿ",
			fnof : "ƒ",
			circ : "ˆ",
			tilde : "˜",
			Alpha : "Α",
			Beta : "Β",
			Gamma : "Γ",
			Delta : "Δ",
			Epsilon : "Ε",
			Zeta : "Ζ",
			Eta : "Η",
			Theta : "Θ",
			Iota : "Ι",
			Kappa : "Κ",
			Lambda : "Λ",
			Mu : "Μ",
			Nu : "Ν",
			Xi : "Ξ",
			Omicron : "Ο",
			Pi : "Π",
			Rho : "Ρ",
			Sigma : "Σ",
			Tau : "Τ",
			Upsilon : "Υ",
			Phi : "Φ",
			Chi : "Χ",
			Psi : "Ψ",
			Omega : "Ω",
			alpha : "α",
			beta : "β",
			gamma : "γ",
			delta : "δ",
			epsilon : "ε",
			zeta : "ζ",
			eta : "η",
			theta : "θ",
			iota : "ι",
			kappa : "κ",
			lambda : "λ",
			mu : "μ",
			nu : "ν",
			xi : "ξ",
			omicron : "ο",
			pi : "π",
			rho : "ρ",
			sigmaf : "ς",
			sigma : "σ",
			tau : "τ",
			upsilon : "υ",
			phi : "φ",
			chi : "χ",
			psi : "ψ",
			omega : "ω",
			thetasym : "ϑ",
			upsih : "ϒ",
			piv : "ϖ",
			ensp : " ",
			emsp : " ",
			thinsp : " ",
			zwnj : "‌",
			zwj : "‍",
			lrm : "‎",
			rlm : "‏",
			ndash : "–",
			mdash : "—",
			lsquo : "‘",
			rsquo : "’",
			sbquo : "‚",
			ldquo : "“",
			rdquo : "”",
			bdquo : "„",
			dagger : "†",
			Dagger : "‡",
			bull : "•",
			hellip : "…",
			permil : "‰",
			prime : "′",
			Prime : "″",
			lsaquo : "‹",
			rsaquo : "›",
			oline : "‾",
			frasl : "⁄",
			euro : "€",
			image : "ℑ",
			weierp : "℘",
			real : "ℜ",
			trade : "™",
			alefsym : "ℵ",
			larr : "←",
			uarr : "↑",
			rarr : "→",
			darr : "↓",
			harr : "↔",
			crarr : "↵",
			lArr : "⇐",
			uArr : "⇑",
			rArr : "⇒",
			dArr : "⇓",
			hArr : "⇔",
			forall : "∀",
			part : "∂",
			exist : "∃",
			empty : "∅",
			nabla : "∇",
			isin : "∈",
			notin : "∉",
			ni : "∋",
			prod : "∏",
			sum : "∑",
			minus : "−",
			lowast : "∗",
			radic : "√",
			prop : "∝",
			infin : "∞",
			ang : "∠",
			and : "∧",
			or : "∨",
			cap : "∩",
			cup : "∪",
			"int" : "∫",
			there4 : "∴",
			sim : "∼",
			cong : "≅",
			asymp : "≈",
			ne : "≠",
			equiv : "≡",
			le : "≤",
			ge : "≥",
			sub : "⊂",
			sup : "⊃",
			nsub : "⊄",
			sube : "⊆",
			supe : "⊇",
			oplus : "⊕",
			otimes : "⊗",
			perp : "⊥",
			sdot : "⋅",
			lceil : "⌈",
			rceil : "⌉",
			lfloor : "⌊",
			rfloor : "⌋",
			lang : "⟨",
			rang : "⟩",
			loz : "◊",
			spades : "♠",
			clubs : "♣",
			hearts : "♥",
			diams : "♦"
		},
		q = {};
		for (var G in W) {
			var K = W[G];
			q[K] = "&" + G + ";"
		}
		e.isAscii = o,
		e.toAscii = s,
		e.isLatin1 = c,
		e.toLatin1 = l,
		e.isUtf8 = d,
		e.fromUtf8 = u,
		e.fromUtf8Bytes = m,
		e.toUtf8 = f,
		e.isBase64 = p,
		e.fromBase64 = g,
		e.toBase64 = h,
		e.isHex = v,
		e.fromHex = b,
		e.toHex = E,
		e.isQuotedPrintable = w,
		e.fromQuotedPrintable = T,
		e.toQuotedPrintable = y,
		e.isJson = I,
		e.fromJson = S,
		e.toJson = x,
		e.isSql = C,
		e.fromSql = k,
		e.toSql = A,
		e.toPostgreSql = N,
		e.isUrl = L,
		e.fromUrl = _,
		e.toUrl = R,
		e.isWwwForm = O,
		e.fromWwwForm = D,
		e.toWwwForm = B,
		e.isXml = M,
		e.fromXml = P,
		e.toXml = U,
		e.toXmlAscii = F,
		e.toHtml = H
	})(Convert), function (e) {
		function t(e) {
			return e.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1")
		}
		function n(e) {
			return "[object Array]" == Object.prototype.toString.call(e) + ""
		}
		function i(t, i) {
			var r,
			a,
			o = {};
			if (n(i))
				for (r = 0, a = i.length; a > r; r++)
					o[i[r]] = !0;
			else
				o[i] = !0;
			for (r = 0, a = t.length; a > r; r++)
				o[t[r]] !== e && (t.splice(r, 1), a--, r--);
			return t
		}
		var r = "undefined" != typeof module && module.exports,
		a = function (e) {
			return r ? require("./" + e) : window[e]
		},
		o = a("punycode"),
		s = a("IPv6"),
		c = a("SecondLevelDomains"),
		l = function (t, n) {
			return this instanceof l ? (t === e && (t = location.href + ""), this.href(t), n !== e ? this.absoluteTo(n) : this) : new l(t)
		},
		d = l.prototype;
		l.idn_expression = /[^a-z0-9\.-]/i,
		l.punycode_expression = /(xn--)/i,
		l.ip4_expression = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
		l.ip6_expression = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/,
		l.find_uri_expression = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/gi,
		l.defaultPorts = {
			http : "80",
			https : "443",
			ftp : "21"
		},
		l.invalid_hostname_characters = /[^a-zA-Z0-9\.-]/,
		l.encode = encodeURIComponent,
		l.decode = decodeURIComponent,
		l.iso8859 = function () {
			l.encode = escape,
			l.decode = unescape
		},
		l.unicode = function () {
			l.encode = encodeURIComponent,
			l.decode = decodeURIComponent
		},
		l.characters = {
			pathname : {
				encode : {
					expression : /%(24|26|2B|2C|3B|3D|3A|40)/gi,
					map : {
						"%24" : "$",
						"%26" : "&",
						"%2B" : "+",
						"%2C" : ",",
						"%3B" : ";",
						"%3D" : "=",
						"%3A" : ":",
						"%40" : "@"
					}
				},
				decode : {
					expression : /[\/\?#]/g,
					map : {
						"/" : "%2F",
						"?" : "%3F",
						"#" : "%23"
					}
				}
			}
		},
		l.encodeQuery = function (e) {
			return l.encode(e + "").replace(/%20/g, "+")
		},
		l.decodeQuery = function (e) {
			return l.decode((e + "").replace(/\+/g, "%20"))
		},
		l.recodePath = function (e) {
			for (var t = (e + "").split("/"), n = 0, i = t.length; i > n; n++)
				t[n] = l.encodePathSegment(l.decode(t[n]));
			return t.join("/")
		},
		l.decodePath = function (e) {
			for (var t = (e + "").split("/"), n = 0, i = t.length; i > n; n++)
				t[n] = l.decodePathSegment(t[n]);
			return t.join("/")
		};
		var u,
		m = {
			encode : "encode",
			decode : "decode"
		},
		f = function (e) {
			return function (t) {
				return l[e](t + "").replace(l.characters.pathname[e].expression, function (t) {
					return l.characters.pathname[e].map[t]
				})
			}
		};
		for (u in m)
			l[u + "PathSegment"] = f(m[u]);
		l.parse = function (e) {
			var t,
			n = {};
			return t = e.indexOf("#"),
			t > -1 && (n.fragment = e.substring(t + 1) || null, e = e.substring(0, t)),
			t = e.indexOf("?"),
			t > -1 && (n.query = e.substring(t + 1) || null, e = e.substring(0, t)),
			"//" === e.substring(0, 2) ? (n.protocol = "", e = e.substring(2), e = l.parseAuthority(e, n)) : (t = e.indexOf(":"), t > -1 && (n.protocol = e.substring(0, t), "//" === e.substring(t + 1, t + 3) ? (e = e.substring(t + 3), e = l.parseAuthority(e, n)) : (e = e.substring(t + 1), n.urn = !0))),
			n.path = e,
			n
		},
		l.parseHost = function (e, t) {
			var n,
			i = e.indexOf("/");
			if (-1 === i && (i = e.length), "[" === e[0]) {
				var r = e.indexOf("]");
				t.hostname = e.substring(1, r) || null,
				t.port = e.substring(r + 2, i) || null
			} else
				e.indexOf(":") !== e.lastIndexOf(":") ? (t.hostname = e.substring(0, i) || null, t.port = null) : (n = e.substring(0, i).split(":"), t.hostname = n[0] || null, t.port = n[1] || null);
			return t.hostname && "/" !== e.substring(i)[0] && (i++, e = "/" + e),
			e.substring(i) || "/"
		},
		l.parseAuthority = function (e, t) {
			return e = l.parseUserinfo(e, t),
			l.parseHost(e, t)
		},
		l.parseUserinfo = function (e, t) {
			var n,
			i = e.indexOf("@"),
			r = e.indexOf("/");
			return i > -1 && (-1 === r || r > i) ? (n = e.substring(0, i).split(":"), t.username = n[0] ? l.decode(n[0]) : null, t.password = n[1] ? l.decode(n[1]) : null, e = e.substring(i + 1)) : (t.username = null, t.password = null),
			e
		},
		l.parseQuery = function (e) {
			if (!e)
				return {};
			if (e = e.replace(/&+/g, "&").replace(/^\?*&*|&+$/g, ""), !e)
				return {};
			for (var t = {}, n = e.split("&"), i = n.length, r = 0; i > r; r++) {
				var a = n[r].split("="),
				o = l.decodeQuery(a.shift()),
				s = a.length ? l.decodeQuery(a.join("=")) : null;
				t[o] ? ("string" == typeof t[o] && (t[o] = [t[o]]), t[o].push(s)) : t[o] = s
			}
			return t
		},
		l.build = function (e) {
			var t = "";
			return e.protocol && (t += e.protocol + ":"),
			e.urn || !t && !e.hostname || (t += "//"),
			t += l.buildAuthority(e) || "",
			"string" == typeof e.path && ("/" !== e.path[0] && "string" == typeof e.hostname && (t += "/"), t += e.path),
			"string" == typeof e.query && (t += "?" + e.query),
			"string" == typeof e.fragment && (t += "#" + e.fragment),
			t
		},
		l.buildHost = function (e) {
			var t = "";
			return e.hostname ? (l.ip6_expression.test(e.hostname) ? t += e.port ? "[" + e.hostname + "]:" + e.port : e.hostname : (t += e.hostname, e.port && (t += ":" + e.port)), t) : ""
		},
		l.buildAuthority = function (e) {
			return l.buildUserinfo(e) + l.buildHost(e)
		},
		l.buildUserinfo = function (e) {
			var t = "";
			return e.username && (t += l.encode(e.username), e.password && (t += ":" + l.encode(e.password)), t += "@"),
			t
		},
		l.buildQuery = function (t, i) {
			var r = "";
			for (var a in t)
				if (Object.hasOwnProperty.call(t, a) && a)
					if (n(t[a]))
						for (var o = {}, s = 0, c = t[a].length; c > s; s++)
							t[a][s] !== e && o[t[a][s] + ""] === e && (r += "&" + l.buildQueryParameter(a, t[a][s]), i !== !0 && (o[t[a][s] + ""] = !0));
					else
						t[a] !== e && (r += "&" + l.buildQueryParameter(a, t[a]));
			return r.substring(1)
		},
		l.buildQueryParameter = function (e, t) {
			return l.encodeQuery(e) + (null !== t ? "=" + l.encodeQuery(t) : "")
		},
		l.addQuery = function (t, i, r) {
			if ("object" == typeof i)
				for (var a in i)
					Object.prototype.hasOwnProperty.call(i, a) && l.addQuery(t, a, i[a]);
			else {
				if ("string" != typeof i)
					throw new TypeError("URI.addQuery() accepts an object, string as the name parameter");
				if (t[i] === e)
					return t[i] = r, e;
				"string" == typeof t[i] && (t[i] = [t[i]]),
				n(r) || (r = [r]),
				t[i] = t[i].concat(r)
			}
		},
		l.removeQuery = function (t, r, a) {
			if (n(r))
				for (var o = 0, s = r.length; s > o; o++)
					t[r[o]] = e;
			else if ("object" == typeof r)
				for (var c in r)
					Object.prototype.hasOwnProperty.call(r, c) && l.removeQuery(t, c, r[c]);
			else {
				if ("string" != typeof r)
					throw new TypeError("URI.addQuery() accepts an object, string as the first parameter");
				a !== e ? t[r] === a ? t[r] = e : n(t[r]) && (t[r] = i(t[r], a)) : t[r] = e
			}
		},
		l.commonPath = function (e, t) {
			var n,
			i = Math.min(e.length, t.length);
			for (n = 0; i > n; n++)
				if (e[n] !== t[n]) {
					n--;
					break
				}
			return 1 > n ? e[0] === t[0] && "/" === e[0] ? "/" : "" : ("/" !== e[n] && (n = e.substring(0, n).lastIndexOf("/")), e.substring(0, n + 1))
		},
		l.withinString = function (e, t) {
			return e.replace(l.find_uri_expression, t)
		},
		l.ensureValidHostname = function (e) {
			if (e.match(l.invalid_hostname_characters)) {
				if (!o)
					throw new TypeError("Hostname '" + e + "' contains characters other than [A-Z0-9.-] and Punycode.js is not available");
				if (o.toASCII(e).match(l.invalid_hostname_characters))
					throw new TypeError("Hostname '" + e + "' contains characters other than [A-Z0-9.-]")
			}
		},
		d.build = function (t) {
			return t === !0 ? this._deferred_build = !0 : (t === e || this._deferred_build) && (this._string = l.build(this._parts), this._deferred_build = !1),
			this
		},
		d.valueOf = d.toString = function () {
			return this.build(!1)._string
		},
		m = {
			protocol : "protocol",
			username : "username",
			password : "password",
			hostname : "hostname",
			port : "port"
		},
		f = function (t) {
			return function (n, i) {
				return n === e ? this._parts[t] || "" : (this._parts[t] = n, this.build(!i), this)
			}
		};
		for (u in m)
			d[u] = f(m[u]);
		m = {
			query : "?",
			fragment : "#"
		},
		f = function (t, n) {
			return function (i, r) {
				return i === e ? this._parts[t] || "" : (null !== i && (i += "", i[0] === n && (i = i.substring(1))), this._parts[t] = i, this.build(!r), this)
			}
		};
		for (u in m)
			d[u] = f(u, m[u]);
		m = {
			search : ["?", "query"],
			hash : ["#", "fragment"]
		},
		f = function (e, t) {
			return function (n, i) {
				var r = this[e](n, i);
				return "string" == typeof r && r.length ? t + r : r
			}
		};
		for (u in m)
			d[u] = f(m[u][1], m[u][0]);
		d.pathname = function (t, n) {
			if (t === e || t === !0) {
				var i = this._parts.path || (this._parts.urn ? "" : "/");
				return t ? l.decodePath(i) : i
			}
			return this._parts.path = t ? l.recodePath(t) : "/",
			this.build(!n),
			this
		},
		d.path = d.pathname,
		d.href = function (t, n) {
			if (t === e)
				return "" + this;
			this._string = "",
			this._parts = {
				protocol : null,
				username : null,
				password : null,
				hostname : null,
				urn : null,
				port : null,
				path : null,
				query : null,
				fragment : null
			};
			var i,
			r = t instanceof l,
			a = "object" == typeof t && (t.hostname || t.path);
			if ("string" == typeof t)
				this._parts = l.parse(t);
			else {
				if (!r && !a)
					throw new TypeError("invalid input");
				var o = r ? t._parts : t;
				for (i in o)
					Object.hasOwnProperty.call(this._parts, i) && (this._parts[i] = o[i])
			}
			return this.build(!n),
			this
		},
		d.is = function (e) {
			var t = !1,
			n = !1,
			i = !1,
			r = !1,
			a = !1,
			o = !1,
			s = !1,
			d = !this._parts.urn;
			switch (this._parts.hostname && (d = !1, n = l.ip4_expression.test(this._parts.hostname), i = l.ip6_expression.test(this._parts.hostname), t = n || i, r = !t, a = r && c && c.has(this._parts.hostname), o = r && l.idn_expression.test(this._parts.hostname), s = r && l.punycode_expression.test(this._parts.hostname)), e.toLowerCase()) {
			case "relative":
				return d;
			case "absolute":
				return !d;
			case "domain":
			case "name":
				return r;
			case "sld":
				return a;
			case "ip":
				return t;
			case "ip4":
			case "ipv4":
			case "inet4":
				return n;
			case "ip6":
			case "ipv6":
			case "inet6":
				return i;
			case "idn":
				return o;
			case "url":
				return !this._parts.urn;
			case "urn":
				return !!this._parts.urn;
			case "punycode":
				return s
			}
			return null
		};
		var p = d.protocol,
		g = d.port,
		h = d.hostname;
		d.protocol = function (t, n) {
			if (t !== e && t && (t = t.replace(/:(\/\/)?$/, ""), t.match(/[^a-zA-z0-9\.+-]/)))
				throw new TypeError("Protocol '" + t + "' contains characters other than [A-Z0-9.+-]");
			return p.call(this, t, n)
		},
		d.scheme = d.protocol,
		d.port = function (t, n) {
			if (this._parts.urn)
				return t === e ? "" : this;
			if (t !== e && (0 === t && (t = null), t && (t += "", ":" === t[0] && (t = t.substring(1)), t.match(/[^0-9]/))))
				throw new TypeError("Port '" + t + "' contains characters other than [0-9]");
			return g.call(this, t, n)
		},
		d.hostname = function (t, n) {
			if (this._parts.urn)
				return t === e ? "" : this;
			if (t !== e) {
				var i = {};
				l.parseHost(t, i),
				t = i.hostname
			}
			return h.call(this, t, n)
		},
		d.host = function (t, n) {
			return this._parts.urn ? t === e ? "" : this : t === e ? this._parts.hostname ? l.buildHost(this._parts) : "" : (l.parseHost(t, this._parts), this.build(!n), this)
		},
		d.authority = function (t, n) {
			return this._parts.urn ? t === e ? "" : this : t === e ? this._parts.hostname ? l.buildAuthority(this._parts) : "" : (l.parseAuthority(t, this._parts), this.build(!n), this)
		},
		d.userinfo = function (t, n) {
			if (this._parts.urn)
				return t === e ? "" : this;
			if (t === e) {
				if (!this._parts.username)
					return "";
				var i = l.buildUserinfo(this._parts);
				return i.substring(0, i.length - 1)
			}
			return "@" !== t[t.length - 1] && (t += "@"),
			l.parseUserinfo(t, this._parts),
			this.build(!n),
			this
		},
		d.subdomain = function (n, i) {
			if (this._parts.urn)
				return n === e ? "" : this;
			if (n === e) {
				if (!this._parts.hostname || this.is("IP"))
					return "";
				var r = this._parts.hostname.length - this.domain().length - 1;
				return this._parts.hostname.substring(0, r) || ""
			}
			var a = this._parts.hostname.length - this.domain().length,
			o = this._parts.hostname.substring(0, a),
			s = RegExp("^" + t(o));
			return n && "." !== n[n.length - 1] && (n += "."),
			n && l.ensureValidHostname(n),
			this._parts.hostname = this._parts.hostname.replace(s, n),
			this.build(!i),
			this
		},
		d.domain = function (n, i) {
			if (this._parts.urn)
				return n === e ? "" : this;
			if ("boolean" == typeof n && (i = n, n = e), n === e) {
				if (!this._parts.hostname || this.is("IP"))
					return "";
				var r = this._parts.hostname.match(/\./g);
				if (r && 2 > r.length)
					return this._parts.hostname;
				var a = this._parts.hostname.length - this.tld(i).length - 1;
				return a = this._parts.hostname.lastIndexOf(".", a - 1) + 1,
				this._parts.hostname.substring(a) || ""
			}
			if (!n)
				throw new TypeError("cannot set domain empty");
			if (l.ensureValidHostname(n), !this._parts.hostname || this.is("IP"))
				this._parts.hostname = n;
			else {
				var o = RegExp(t(this.domain()) + "$");
				this._parts.hostname = this._parts.hostname.replace(o, n)
			}
			return this.build(!i),
			this
		},
		d.tld = function (n, i) {
			if (this._parts.urn)
				return n === e ? "" : this;
			if ("boolean" == typeof n && (i = n, n = e), n === e) {
				if (!this._parts.hostname || this.is("IP"))
					return "";
				var r = this._parts.hostname.lastIndexOf("."),
				a = this._parts.hostname.substring(r + 1);
				return i !== !0 && c && c.list[a.toLowerCase()] ? c.get(this._parts.hostname) || a : a
			}
			var o;
			if (!n)
				throw new TypeError("cannot set TLD empty");
			if (n.match(/[^a-zA-Z0-9-]/)) {
				if (!c || !c.is(n))
					throw new TypeError("TLD '" + n + "' contains characters other than [A-Z0-9]");
				o = RegExp(t(this.tld()) + "$"),
				this._parts.hostname = this._parts.hostname.replace(o, n)
			} else {
				if (!this._parts.hostname || this.is("IP"))
					throw new ReferenceError("cannot set TLD on non-domain host");
				o = RegExp(t(this.tld()) + "$"),
				this._parts.hostname = this._parts.hostname.replace(o, n)
			}
			return this.build(!i),
			this
		},
		d.directory = function (n, i) {
			if (this._parts.urn)
				return n === e ? "" : this;
			if (n === e || n === !0) {
				if (!this._parts.path || "/" === this._parts.path)
					return "/";
				var r = this._parts.path.length - this.filename().length - 1,
				a = this._parts.path.substring(0, r) || "/";
				return n ? l.decodePath(a) : a
			}
			var o = this._parts.path.length - this.filename().length,
			s = this._parts.path.substring(0, o),
			c = RegExp("^" + t(s));
			return this.is("relative") || (n || (n = "/"), "/" !== n[0] && (n = "/" + n)),
			n && "/" !== n[n.length - 1] && (n += "/"),
			n = l.recodePath(n),
			this._parts.path = this._parts.path.replace(c, n),
			this.build(!i),
			this
		},
		d.filename = function (n, i) {
			if (this._parts.urn)
				return n === e ? "" : this;
			if (n === e || n === !0) {
				if (!this._parts.path || "/" === this._parts.path)
					return "";
				var r = this._parts.path.lastIndexOf("/"),
				a = this._parts.path.substring(r + 1);
				return n ? l.decodePathSegment(a) : a
			}
			var o = !1;
			"/" === n[0] && (n = n.substring(1)),
			n.match(/\.?\//) && (o = !0);
			var s = RegExp(t(this.filename()) + "$");
			return n = l.recodePath(n),
			this._parts.path = this._parts.path.replace(s, n),
			o ? this.normalizePath(i) : this.build(!i),
			this
		},
		d.suffix = function (n, i) {
			if (this._parts.urn)
				return n === e ? "" : this;
			if (n === e || n === !0) {
				if (!this._parts.path || "/" === this._parts.path)
					return "";
				var r,
				a,
				o = this.filename(),
				s = o.lastIndexOf(".");
				return -1 === s ? "" : (r = o.substring(s + 1), a = /^[a-z0-9%]+$/i.test(r) ? r : "", n ? l.decodePathSegment(a) : a)
			}
			"." === n[0] && (n = n.substring(1));
			var c,
			d = this.suffix();
			if (d)
				c = n ? RegExp(t(d) + "$") : RegExp(t("." + d) + "$");
			else {
				if (!n)
					return this;
				this._parts.path += "." + l.recodePath(n)
			}
			return c && (n = l.recodePath(n), this._parts.path = this._parts.path.replace(c, n)),
			this.build(!i),
			this
		};
		var v = d.query;
		d.query = function (t, n) {
			return t === !0 ? l.parseQuery(this._parts.query) : t !== e && "string" != typeof t ? (this._parts.query = l.buildQuery(t), this.build(!n), this) : v.call(this, t, n)
		},
		d.addQuery = function (e, t, n) {
			var i = l.parseQuery(this._parts.query);
			return l.addQuery(i, e, t),
			this._parts.query = l.buildQuery(i),
			"string" != typeof e && (n = t),
			this.build(!n),
			this
		},
		d.removeQuery = function (e, t, n) {
			var i = l.parseQuery(this._parts.query);
			return l.removeQuery(i, e, t),
			this._parts.query = l.buildQuery(i),
			"string" != typeof e && (n = t),
			this.build(!n),
			this
		},
		d.addSearch = d.addQuery,
		d.removeSearch = d.removeQuery,
		d.normalize = function () {
			return this._parts.urn ? this.normalizeProtocol(!1).normalizeQuery(!1).normalizeFragment(!1).build() : this.normalizeProtocol(!1).normalizeHostname(!1).normalizePort(!1).normalizePath(!1).normalizeQuery(!1).normalizeFragment(!1).build()
		},
		d.normalizeProtocol = function (e) {
			return "string" == typeof this._parts.protocol && (this._parts.protocol = this._parts.protocol.toLowerCase(), this.build(!e)),
			this
		},
		d.normalizeHostname = function (e) {
			return this._parts.hostname && (this.is("IDN") && o ? this._parts.hostname = o.toASCII(this._parts.hostname) : this.is("IPv6") && s && (this._parts.hostname = s.best(this._parts.hostname)), this._parts.hostname = this._parts.hostname.toLowerCase(), this.build(!e)),
			this
		},
		d.normalizePort = function (e) {
			return "string" == typeof this._parts.protocol && this._parts.port === l.defaultPorts[this._parts.protocol] && (this._parts.port = null, this.build(!e)),
			this
		},
		d.normalizePath = function (e) {
			if (this._parts.urn)
				return this;
			if (!this._parts.path || "/" === this._parts.path)
				return this;
			var t,
			n,
			i,
			r,
			a = this._parts.path;
			for ("/" !== a[0] && ("." === a[0] && (n = a.substring(0, a.indexOf("/"))), t = !0, a = "/" + a), a = a.replace(/(\/(\.\/)+)|\/{2,}/g, "/"); ; ) {
				if (i = a.indexOf("/../"), -1 === i)
					break;
				if (0 === i) {
					a = a.substring(3);
					break
				}
				r = a.substring(0, i).lastIndexOf("/"),
				-1 === r && (r = i),
				a = a.substring(0, r) + a.substring(i + 3)
			}
			return t && this.is("relative") && (a = n ? n + a : a.substring(1)),
			a = l.recodePath(a),
			this._parts.path = a,
			this.build(!e),
			this
		},
		d.normalizePathname = d.normalizePath,
		d.normalizeQuery = function (e) {
			return "string" == typeof this._parts.query && (this._parts.query.length ? this.query(l.parseQuery(this._parts.query)) : this._parts.query = null, this.build(!e)),
			this
		},
		d.normalizeFragment = function (e) {
			return this._parts.fragment || (this._parts.fragment = null, this.build(!e)),
			this
		},
		d.normalizeSearch = d.normalizeQuery,
		d.normalizeHash = d.normalizeFragment,
		d.iso8859 = function () {
			var e = l.encode,
			t = l.decode;
			return l.encode = escape,
			l.decode = decodeURIComponent,
			this.normalize(),
			l.encode = e,
			l.decode = t,
			this
		},
		d.unicode = function () {
			var e = l.encode,
			t = l.decode;
			return l.encode = encodeURIComponent,
			l.decode = unescape,
			this.normalize(),
			l.encode = e,
			l.decode = t,
			this
		},
		d.readable = function () {
			var t = new l(this);
			t.username("").password("").normalize();
			var n = "";
			if (t._parts.protocol && (n += t._parts.protocol + "://"), t._parts.hostname && (t.is("punycode") && o ? (n += o.toUnicode(t._parts.hostname), t._parts.port && (n += ":" + t._parts.port)) : n += t.host()), t._parts.hostname && t._parts.path && "/" !== t._parts.path[0] && (n += "/"), n += t.path(!0), t._parts.query) {
				for (var i = "", r = 0, a = t._parts.query.split("&"), s = a.length; s > r; r++) {
					var c = (a[r] || "").split("=");
					i += "&" + l.decodeQuery(c[0]).replace(/&/g, "%26"),
					c[1] !== e && (i += "=" + l.decodeQuery(c[1]).replace(/&/g, "%26"))
				}
				n += "?" + i.substring(1)
			}
			return n += t.hash()
		},
		d.absoluteTo = function (e) {
			if (this._parts.urn)
				throw Error("URNs do not have any generally defined hierachical components");
			if (!this.is("relative"))
				throw Error("Cannot resolve non-relative URL");
			e instanceof l || (e = new l(e));
			for (var t, n = new l(this), i = ["protocol", "username", "password", "hostname", "port"], r = 0; t = i[r]; r++)
				n._parts[t] = e._parts[t];
			return "/" !== n.path()[0] && (n._parts.path = e.directory() + "/" + n._parts.path, n.normalizePath()),
			n.build(),
			n
		},
		d.relativeTo = function (e) {
			if (this._parts.urn)
				throw Error("URNs do not have any generally defined hierachical components");
			if (e instanceof l || (e = new l(e)), "/" !== this.path()[0] || "/" !== e.path()[0])
				throw Error("Cannot calculate common path from non-relative URLs");
			for (var n, i = new l(this), r = ["protocol", "username", "password", "hostname", "port"], a = l.commonPath(i.path(), e.path()), o = e.directory(), s = 0; n = r[s]; s++)
				i._parts[n] = null;
			if (!a || "/" === a)
				return i;
			if (o + "/" === a)
				i._parts.path = "./" + i.filename();
			else {
				for (var c = "../", d = RegExp("^" + t(a)), u = o.replace(d, "/").match(/\//g).length - 1; u--; )
					c += "../";
				i._parts.path = i._parts.path.replace(d, c)
			}
			return i.build(),
			i
		},
		d.equals = function (e) {
			var t,
			i,
			r,
			a = new l(this),
			o = new l(e),
			s = {},
			c = {},
			d = {};
			if (a.normalize(), o.normalize(), "" + a == "" + o)
				return !0;
			if (t = a.query(), i = o.query(), a.query(""), o.query(""), "" + a != "" + o)
				return !1;
			if (t.length !== i.length)
				return !1;
			s = l.parseQuery(t),
			c = l.parseQuery(i);
			for (r in s)
				if (Object.prototype.hasOwnProperty.call(s, r)) {
					if (n(s[r])) {
						if (!n(c[r]))
							return !1;
						if (s[r].length !== c[r].length)
							return !1;
						s[r].sort(),
						c[r].sort();
						for (var u = 0, m = s[r].length; m > u; u++)
							if (s[r][u] !== c[r][u])
								return !1
					} else if (s[r] !== c[r])
						return !1;
					d[r] = !0
				}
			for (r in c)
				if (Object.prototype.hasOwnProperty.call(c, r) && !d[r])
					return !1;
			return !0
		},
		"undefined" != typeof module && module.exports ? module.exports = l : window.URI = l
	}
	(), define("globalize", function (e, t, n) {
		(function (i, r) {
			var a,
			o,
			s,
			c,
			l,
			d,
			u,
			m,
			f,
			p,
			g,
			h,
			v,
			b,
			E,
			w,
			T,
			y,
			I,
			S,
			x,
			C,
			k,
			A;
			a = function (e) {
				return new a.prototype.init(e)
			},
			e !== r && t !== r && n !== r ? n.exports = a : i.Globalize = a,
			a.cultures = {},
			a.prototype = {
				constructor : a,
				init : function (e) {
					return this.cultures = a.cultures,
					this.cultureSelector = e,
					this
				}
			},
			a.prototype.init.prototype = a.prototype,
			a.cultures["default"] = {
				name : "en",
				englishName : "English",
				nativeName : "English",
				isRTL : !1,
				language : "en",
				numberFormat : {
					pattern : ["-n"],
					decimals : 2,
					"," : ",",
					"." : ".",
					groupSizes : [3],
					"+" : "+",
					"-" : "-",
					NaN : "NaN",
					negativeInfinity : "-Infinity",
					positiveInfinity : "Infinity",
					percent : {
						pattern : ["-n %", "n %"],
						decimals : 2,
						groupSizes : [3],
						"," : ",",
						"." : ".",
						symbol : "%"
					},
					currency : {
						pattern : ["($n)", "$n"],
						decimals : 2,
						groupSizes : [3],
						"," : ",",
						"." : ".",
						symbol : "$"
					}
				},
				calendars : {
					standard : {
						name : "Gregorian_USEnglish",
						"/" : "/",
						":" : ":",
						firstDay : 0,
						days : {
							names : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
							namesAbbr : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
							namesShort : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
						},
						months : {
							names : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""],
							namesAbbr : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""]
						},
						AM : ["AM", "am", "AM"],
						PM : ["PM", "pm", "PM"],
						eras : [{
								name : "A.D.",
								start : null,
								offset : 0
							}
						],
						twoDigitYearMax : 2029,
						patterns : {
							d : "M/d/yyyy",
							D : "dddd, MMMM dd, yyyy",
							t : "h:mm tt",
							T : "h:mm:ss tt",
							f : "dddd, MMMM dd, yyyy h:mm tt",
							F : "dddd, MMMM dd, yyyy h:mm:ss tt",
							M : "MMMM dd",
							Y : "yyyy MMMM",
							S : "yyyy'-'MM'-'dd'T'HH':'mm':'ss"
						}
					}
				},
				messages : {}

			},
			a.cultures["default"].calendar = a.cultures["default"].calendars.standard,
			a.cultures.en = a.cultures["default"],
			a.cultureSelector = "en",
			o = /^0x[a-f0-9]+$/i,
			s = /^[+\-]?infinity$/i,
			c = /^[+\-]?\d*\.?\d*(e[+\-]?\d+)?$/,
			l = /^\s+|\s+$/g,
			d = function (e, t) {
				if (e.indexOf)
					return e.indexOf(t);
				for (var n = 0, i = e.length; i > n; n++)
					if (e[n] === t)
						return n;
				return -1
			},
			u = function (e, t) {
				return e.substr(e.length - t.length) === t
			},
			m = function () {
				var e,
				t,
				n,
				i,
				a,
				o,
				s = arguments[0] || {},
				c = 1,
				l = arguments.length,
				d = !1;
				for ("boolean" == typeof s && (d = s, s = arguments[1] || {}, c = 2), "object" == typeof s || p(s) || (s = {}); l > c; c++)
					if (null != (e = arguments[c]))
						for (t in e)
							n = s[t], i = e[t], s !== i && (d && i && (g(i) || (a = f(i))) ? (a ? (a = !1, o = n && f(n) ? n : []) : o = n && g(n) ? n : {}, s[t] = m(d, o, i)) : i !== r && (s[t] = i));
				return s
			},
			f = Array.isArray || function (e) {
				return "[object Array]" === Object.prototype.toString.call(e)
			},
			p = function (e) {
				return "[object Function]" === Object.prototype.toString.call(e)
			},
			g = function (e) {
				return "[object Object]" === Object.prototype.toString.call(e)
			},
			h = function (e, t) {
				return 0 === e.indexOf(t)
			},
			v = function (e) {
				return (e + "").replace(l, "")
			},
			b = function (e) {
				return isNaN(e) ? 0 / 0 : Math[0 > e ? "ceil" : "floor"](e)
			},
			E = function (e, t, n) {
				var i;
				for (i = e.length; t > i; i += 1)
					e = n ? "0" + e : e + "0";
				return e
			},
			w = function (e, t) {
				for (var n = 0, i = !1, r = 0, a = e.length; a > r; r++) {
					var o = e.charAt(r);
					switch (o) {
					case "'":
						i ? t.push("'") : n++,
						i = !1;
						break;
					case "\\":
						i && t.push("\\"),
						i = !i;
						break;
					default:
						t.push(o),
						i = !1
					}
				}
				return n
			},
			T = function (e, t) {
				t = t || "F";
				var n,
				i = e.patterns,
				r = t.length;
				if (1 === r) {
					if (n = i[t], !n)
						throw "Invalid date format string '" + t + "'.";
					t = n
				} else
					2 === r && "%" === t.charAt(0) && (t = t.charAt(1));
				return t
			},
			y = function (e, t, n) {
				function i(e, t) {
					var n,
					i = e + "";
					return t > 1 && t > i.length ? (n = v[t - 2] + i, n.substr(n.length - t, t)) : n = i
				}
				function r() {
					return p || g ? p : (p = b.test(t), g = !0, p)
				}
				function a(e, t) {
					if (h)
						return h[t];
					switch (t) {
					case 0:
						return e.getFullYear();
					case 1:
						return e.getMonth();
					case 2:
						return e.getDate();
					default:
						throw "Invalid part value " + t
					}
				}
				var o,
				s = n.calendar,
				c = s.convert;
				if (!t || !t.length || "i" === t) {
					if (n && n.name.length)
						if (c)
							o = y(e, s.patterns.F, n);
						else {
							var l = new Date(e.getTime()),
							d = x(e, s.eras);
							l.setFullYear(C(e, s, d)),
							o = l.toLocaleString()
						}
					else
						o = "" + e;
					return o
				}
				var u = s.eras,
				m = "s" === t;
				t = T(s, t),
				o = [];
				var f,
				p,
				g,
				h,
				v = ["0", "00", "000"],
				b = /([^d]|^)(d|dd)([^d]|$)/g,
				E = 0,
				I = S();
				for (!m && c && (h = c.fromGregorian(e)); ; ) {
					var k = I.lastIndex,
					A = I.exec(t),
					N = t.slice(k, A ? A.index : t.length);
					if (E += w(N, o), !A)
						break;
					if (E % 2)
						o.push(A[0]);
					else {
						var L = A[0],
						_ = L.length;
						switch (L) {
						case "ddd":
						case "dddd":
							var R = 3 === _ ? s.days.namesAbbr : s.days.names;
							o.push(R[e.getDay()]);
							break;
						case "d":
						case "dd":
							p = !0,
							o.push(i(a(e, 2), _));
							break;
						case "MMM":
						case "MMMM":
							var O = a(e, 1);
							o.push(s.monthsGenitive && r() ? s.monthsGenitive[3 === _ ? "namesAbbr" : "names"][O] : s.months[3 === _ ? "namesAbbr" : "names"][O]);
							break;
						case "M":
						case "MM":
							o.push(i(a(e, 1) + 1, _));
							break;
						case "y":
						case "yy":
						case "yyyy":
							O = h ? h[0] : C(e, s, x(e, u), m),
							4 > _ && (O %= 100),
							o.push(i(O, _));
							break;
						case "h":
						case "hh":
							f = e.getHours() % 12,
							0 === f && (f = 12),
							o.push(i(f, _));
							break;
						case "H":
						case "HH":
							o.push(i(e.getHours(), _));
							break;
						case "m":
						case "mm":
							o.push(i(e.getMinutes(), _));
							break;
						case "s":
						case "ss":
							o.push(i(e.getSeconds(), _));
							break;
						case "t":
						case "tt":
							O = 12 > e.getHours() ? s.AM ? s.AM[0] : " " : s.PM ? s.PM[0] : " ",
							o.push(1 === _ ? O.charAt(0) : O);
							break;
						case "f":
						case "ff":
						case "fff":
							o.push(i(e.getMilliseconds(), 3).substr(0, _));
							break;
						case "z":
						case "zz":
							f = e.getTimezoneOffset() / 60,
							o.push((0 >= f ? "+" : "-") + i(Math.floor(Math.abs(f)), _));
							break;
						case "zzz":
							f = e.getTimezoneOffset() / 60,
							o.push((0 >= f ? "+" : "-") + i(Math.floor(Math.abs(f)), 2) + ":" + i(Math.abs(e.getTimezoneOffset() % 60), 2));
							break;
						case "g":
						case "gg":
							s.eras && o.push(s.eras[x(e, u)].name);
							break;
						case "/":
							o.push(s["/"]);
							break;
						default:
							throw "Invalid date format pattern '" + L + "'."
						}
					}
				}
				return o.join("")
			},
			function () {
				var e;
				e = function (e, t, n) {
					var i = n.groupSizes,
					r = i[0],
					a = 1,
					o = Math.pow(10, t),
					s = Math.round(e * o) / o;
					isFinite(s) || (s = e),
					e = s;
					var c = e + "",
					l = "",
					d = c.split(/e/i),
					u = d.length > 1 ? parseInt(d[1], 10) : 0;
					c = d[0],
					d = c.split("."),
					c = d[0],
					l = d.length > 1 ? d[1] : "",
					u > 0 ? (l = E(l, u, !1), c += l.slice(0, u), l = l.substr(u)) : 0 > u && (u = -u, c = E(c, u + 1, !0), l = c.slice(-u, c.length) + l, c = c.slice(0, -u)),
					l = t > 0 ? n["."] + (l.length > t ? l.slice(0, t) : E(l, t)) : "";
					for (var m = c.length - 1, f = n[","], p = ""; m >= 0; ) {
						if (0 === r || r > m)
							return c.slice(0, m + 1) + (p.length ? f + p + l : l);
						p = c.slice(m - r + 1, m + 1) + (p.length ? f + p : ""),
						m -= r,
						i.length > a && (r = i[a], a++)
					}
					return c.slice(0, m + 1) + f + p + l
				},
				I = function (t, n, i) {
					if (!isFinite(t))
						return 1 / 0 === t ? i.numberFormat.positiveInfinity : t === -1 / 0 ? i.numberFormat.negativeInfinity : i.numberFormat.NaN;
					if (!n || "i" === n)
						return i.name.length ? t.toLocaleString() : "" + t;
					n = n || "D";
					var r,
					a = i.numberFormat,
					o = Math.abs(t),
					s = -1;
					n.length > 1 && (s = parseInt(n.slice(1), 10));
					var c,
					l = n.charAt(0).toUpperCase();
					switch (l) {
					case "D":
						r = "n",
						o = b(o),
						-1 !== s && (o = E("" + o, s, !0)),
						0 > t && (o = "-" + o);
						break;
					case "N":
						c = a;
					case "C":
						c = c || a.currency;
					case "P":
						c = c || a.percent,
						r = 0 > t ? c.pattern[0] : c.pattern[1] || "n",
						-1 === s && (s = c.decimals),
						o = e(o * ("P" === l ? 100 : 1), s, c);
						break;
					default:
						throw "Bad number format specifier: " + l
					}
					for (var d = /n|\$|-|%/g, u = ""; ; ) {
						var m = d.lastIndex,
						f = d.exec(r);
						if (u += r.slice(m, f ? f.index : r.length), !f)
							break;
						switch (f[0]) {
						case "n":
							u += o;
							break;
						case "$":
							u += a.currency.symbol;
							break;
						case "-":
							/[1-9]/.test(o) && (u += a["-"]);
							break;
						case "%":
							u += a.percent.symbol
						}
					}
					return u
				}
			}
			(),
			S = function () {
				return /\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|gg|g/g
			},
			x = function (e, t) {
				if (!t)
					return 0;
				for (var n, i = e.getTime(), r = 0, a = t.length; a > r; r++)
					if (n = t[r].start, null === n || i >= n)
						return r;
				return 0
			},
			C = function (e, t, n, i) {
				var r = e.getFullYear();
				return !i && t.eras && (r -= t.eras[n].offset),
				r
			},
			function () {
				var e,
				t,
				n,
				i,
				r,
				a,
				o;
				e = function (e, t) {
					if (100 > t) {
						var n = new Date,
						i = x(n),
						r = C(n, e, i),
						a = e.twoDigitYearMax;
						a = "string" == typeof a ? (new Date).getFullYear() % 100 + parseInt(a, 10) : a,
						t += r - r % 100,
						t > a && (t -= 100)
					}
					return t
				},
				t = function (e, t, n) {
					var i,
					r = e.days,
					s = e._upperDays;
					return s || (e._upperDays = s = [o(r.names), o(r.namesAbbr), o(r.namesShort)]),
					t = a(t),
					n ? (i = d(s[1], t), -1 === i && (i = d(s[2], t))) : i = d(s[0], t),
					i
				},
				n = function (e, t, n) {
					var i = e.months,
					r = e.monthsGenitive || e.months,
					s = e._upperMonths,
					c = e._upperMonthsGen;
					s || (e._upperMonths = s = [o(i.names), o(i.namesAbbr)], e._upperMonthsGen = c = [o(r.names), o(r.namesAbbr)]),
					t = a(t);
					var l = d(n ? s[1] : s[0], t);
					return 0 > l && (l = d(n ? c[1] : c[0], t)),
					l
				},
				i = function (e, t) {
					var n = e._parseRegExp;
					if (n) {
						var i = n[t];
						if (i)
							return i
					} else
						e._parseRegExp = n = {};
					for (var r, a = T(e, t).replace(/([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g, "\\\\$1"), o = ["^"], s = [], c = 0, l = 0, d = S(); null !== (r = d.exec(a)); ) {
						var u = a.slice(c, r.index);
						if (c = d.lastIndex, l += w(u, o), l % 2)
							o.push(r[0]);
						else {
							var m,
							f = r[0],
							p = f.length;
							switch (f) {
							case "dddd":
							case "ddd":
							case "MMMM":
							case "MMM":
							case "gg":
							case "g":
								m = "(\\D+)";
								break;
							case "tt":
							case "t":
								m = "(\\D*)";
								break;
							case "yyyy":
							case "fff":
							case "ff":
							case "f":
								m = "(\\d{" + p + "})";
								break;
							case "dd":
							case "d":
							case "MM":
							case "M":
							case "yy":
							case "y":
							case "HH":
							case "H":
							case "hh":
							case "h":
							case "mm":
							case "m":
							case "ss":
							case "s":
								m = "(\\d\\d?)";
								break;
							case "zzz":
								m = "([+-]?\\d\\d?:\\d{2})";
								break;
							case "zz":
							case "z":
								m = "([+-]?\\d\\d?)";
								break;
							case "/":
								m = "(\\/)";
								break;
							default:
								throw "Invalid date format pattern '" + f + "'."
							}
							m && o.push(m),
							s.push(r[0])
						}
					}
					w(a.slice(c), o),
					o.push("$");
					var g = o.join("").replace(/\s+/g, "\\s+"),
					h = {
						regExp : g,
						groups : s
					};
					return n[t] = h
				},
				r = function (e, t, n) {
					return t > e || e > n
				},
				a = function (e) {
					return e.split(" ").join(" ").toUpperCase()
				},
				o = function (e) {
					for (var t = [], n = 0, i = e.length; i > n; n++)
						t[n] = a(e[n]);
					return t
				},
				k = function (a, o, s) {
					a = v(a);
					var c = s.calendar,
					l = i(c, o),
					d = RegExp(l.regExp).exec(a);
					if (null === d)
						return null;
					for (var u, m = l.groups, f = null, p = null, g = null, b = null, E = null, w = 0, T = 0, y = 0, I = 0, S = null, x = !1, C = 0, k = m.length; k > C; C++) {
						var A = d[C + 1];
						if (A) {
							var N = m[C],
							L = N.length,
							_ = parseInt(A, 10);
							switch (N) {
							case "dd":
							case "d":
								if (b = _, r(b, 1, 31))
									return null;
								break;
							case "MMM":
							case "MMMM":
								if (g = n(c, A, 3 === L), r(g, 0, 11))
									return null;
								break;
							case "M":
							case "MM":
								if (g = _ - 1, r(g, 0, 11))
									return null;
								break;
							case "y":
							case "yy":
							case "yyyy":
								if (p = 4 > L ? e(c, _) : _, r(p, 0, 9999))
									return null;
								break;
							case "h":
							case "hh":
								if (w = _, 12 === w && (w = 0), r(w, 0, 11))
									return null;
								break;
							case "H":
							case "HH":
								if (w = _, r(w, 0, 23))
									return null;
								break;
							case "m":
							case "mm":
								if (T = _, r(T, 0, 59))
									return null;
								break;
							case "s":
							case "ss":
								if (y = _, r(y, 0, 59))
									return null;
								break;
							case "tt":
							case "t":
								if (x = c.PM && (A === c.PM[0] || A === c.PM[1] || A === c.PM[2]), !x && (!c.AM || A !== c.AM[0] && A !== c.AM[1] && A !== c.AM[2]))
									return null;
								break;
							case "f":
							case "ff":
							case "fff":
								if (I = _ * Math.pow(10, 3 - L), r(I, 0, 999))
									return null;
								break;
							case "ddd":
							case "dddd":
								if (E = t(c, A, 3 === L), r(E, 0, 6))
									return null;
								break;
							case "zzz":
								var R = A.split(/:/);
								if (2 !== R.length)
									return null;
								if (u = parseInt(R[0], 10), r(u, -12, 13))
									return null;
								var O = parseInt(R[1], 10);
								if (r(O, 0, 59))
									return null;
								S = 60 * u + (h(A, "-") ? -O : O);
								break;
							case "z":
							case "zz":
								if (u = _, r(u, -12, 13))
									return null;
								S = 60 * u;
								break;
							case "g":
							case "gg":
								var D = A;
								if (!D || !c.eras)
									return null;
								D = v(D.toLowerCase());
								for (var B = 0, M = c.eras.length; M > B; B++)
									if (D === c.eras[B].name.toLowerCase()) {
										f = B;
										break
									}
								if (null === f)
									return null
							}
						}
					}
					var P,
					U = new Date,
					F = c.convert;
					if (P = F ? F.fromGregorian(U)[0] : U.getFullYear(), null === p ? p = P : c.eras && (p += c.eras[f || 0].offset), null === g && (g = 0), null === b && (b = 1), F) {
						if (U = F.toGregorian(p, g, b), null === U)
							return null
					} else {
						if (U.setFullYear(p, g, b), U.getDate() !== b)
							return null;
						if (null !== E && U.getDay() !== E)
							return null
					}
					if (x && 12 > w && (w += 12), U.setHours(w, T, y, I), null !== S) {
						var H = U.getMinutes() - (S + U.getTimezoneOffset());
						U.setHours(U.getHours() + parseInt(H / 60, 10), H % 60)
					}
					return U
				}
			}
			(),
			A = function (e, t, n) {
				var i,
				r = t["-"],
				a = t["+"];
				switch (n) {
				case "n -":
					r = " " + r,
					a = " " + a;
				case "n-":
					u(e, r) ? i = ["-", e.substr(0, e.length - r.length)] : u(e, a) && (i = ["+", e.substr(0, e.length - a.length)]);
					break;
				case "- n":
					r += " ",
					a += " ";
				case "-n":
					h(e, r) ? i = ["-", e.substr(r.length)] : h(e, a) && (i = ["+", e.substr(a.length)]);
					break;
				case "(n)":
					h(e, "(") && u(e, ")") && (i = ["-", e.substr(1, e.length - 2)])
				}
				return i || ["", e]
			},
			a.prototype.findClosestCulture = function (e) {
				return a.findClosestCulture.call(this, e)
			},
			a.prototype.format = function (e, t, n) {
				return a.format.call(this, e, t, n)
			},
			a.prototype.localize = function (e, t) {
				return a.localize.call(this, e, t)
			},
			a.prototype.parseInt = function (e, t, n) {
				return a.parseInt.call(this, e, t, n)
			},
			a.prototype.parseFloat = function (e, t, n) {
				return a.parseFloat.call(this, e, t, n)
			},
			a.prototype.culture = function (e) {
				return a.culture.call(this, e)
			},
			a.addCultureInfo = function (e, t, n) {
				var i = {},
				r = !1;
				"string" != typeof e ? (n = e, e = this.culture().name, i = this.cultures[e]) : "string" != typeof t ? (n = t, r = null == this.cultures[e], i = this.cultures[e] || this.cultures["default"]) : (r = !0, i = this.cultures[t]),
				this.cultures[e] = m(!0, {}, i, n),
				r && (this.cultures[e].calendar = this.cultures[e].calendars.standard)
			},
			a.findClosestCulture = function (e) {
				var t;
				if (!e)
					return this.findClosestCulture(this.cultureSelector) || this.cultures["default"];
				if ("string" == typeof e && (e = e.split(",")), f(e)) {
					var n,
					i,
					r = this.cultures,
					a = e,
					o = a.length,
					s = [];
					for (i = 0; o > i; i++) {
						e = v(a[i]);
						var c,
						l = e.split(";");
						n = v(l[0]),
						1 === l.length ? c = 1 : (e = v(l[1]), 0 === e.indexOf("q=") ? (e = e.substr(2), c = parseFloat(e), c = isNaN(c) ? 0 : c) : c = 1),
						s.push({
							lang : n,
							pri : c
						})
					}
					for (s.sort(function (e, t) {
							return e.pri < t.pri ? 1 : e.pri > t.pri ? -1 : 0
						}), i = 0; o > i; i++)
						if (n = s[i].lang, t = r[n])
							return t;
					for (i = 0; o > i; i++)
						for (n = s[i].lang; ; ) {
							var d = n.lastIndexOf("-");
							if (-1 === d)
								break;
							if (n = n.substr(0, d), t = r[n])
								return t
						}
					for (i = 0; o > i; i++) {
						n = s[i].lang;
						for (var u in r) {
							var m = r[u];
							if (m.language == n)
								return m
						}
					}
				} else if ("object" == typeof e)
					return e;
				return t || null
			},
			a.format = function (e, t, n) {
				var i = this.findClosestCulture(n);
				return e instanceof Date ? e = y(e, t, i) : "number" == typeof e && (e = I(e, t, i)),
				e
			},
			a.localize = function (e, t) {
				return this.findClosestCulture(t).messages[e] || this.cultures["default"].messages[e]
			},
			a.parseDate = function (e, t, n) {
				n = this.findClosestCulture(n);
				var i,
				r,
				a;
				if (t) {
					if ("string" == typeof t && (t = [t]), t.length)
						for (var o = 0, s = t.length; s > o; o++) {
							var c = t[o];
							if (c && (i = k(e, c, n)))
								break
						}
				} else {
					a = n.calendar.patterns;
					for (r in a)
						if (i = k(e, a[r], n))
							break
				}
				return i || null
			},
			a.parseInt = function (e, t, n) {
				return b(a.parseFloat(e, t, n))
			},
			a.parseFloat = function (e, t, n) {
				"number" != typeof t && (n = t, t = 10);
				var i = this.findClosestCulture(n),
				r = 0 / 0,
				a = i.numberFormat;
				if (e.indexOf(i.numberFormat.currency.symbol) > -1 && (e = e.replace(i.numberFormat.currency.symbol, ""), e = e.replace(i.numberFormat.currency["."], i.numberFormat["."])), e = v(e), s.test(e))
					r = parseFloat(e);
				else if (!t && o.test(e))
					r = parseInt(e, 16);
				else {
					var l = A(e, a, a.pattern[0]),
					d = l[0],
					u = l[1];
					"" === d && "(n)" !== a.pattern[0] && (l = A(e, a, "(n)"), d = l[0], u = l[1]),
					"" === d && "-n" !== a.pattern[0] && (l = A(e, a, "-n"), d = l[0], u = l[1]),
					d = d || "+";
					var m,
					f,
					p = u.indexOf("e");
					0 > p && (p = u.indexOf("E")),
					0 > p ? (f = u, m = null) : (f = u.substr(0, p), m = u.substr(p + 1));
					var g,
					h,
					b = a["."],
					E = f.indexOf(b);
					0 > E ? (g = f, h = null) : (g = f.substr(0, E), h = f.substr(E + b.length));
					var w = a[","];
					g = g.split(w).join("");
					var T = w.replace(/\u00A0/g, " ");
					w !== T && (g = g.split(T).join(""));
					var y = d + g;
					if (null !== h && (y += "." + h), null !== m) {
						var I = A(m, a, "-n");
						y += "e" + (I[0] || "+") + I[1]
					}
					c.test(y) && (r = parseFloat(y))
				}
				return r
			},
			a.culture = function (e) {
				return e !== r && (this.cultureSelector = e),
				this.findClosestCulture(e) || this.cultures["default"]
			}
		})(this)
	}), define.unordered = !0, define("iris/i18n/locale/list", function (e, t, n) {
		n.exports = ["af-ZA", "ar-EG", "ca-ES", "cs-CZ", "da-DK", "de-DE", "el-GR", "en-GB", "en-US", "es-ES", "eu-ES", "fi-FI", "fr-FR", "gl-ES", "he-IL", "hi-IN", "hr-HR", "hu-HU", "id-ID", "it-IT", "ja-JP", "ko-KR", "ms-MY", "nb-NO", "nl-NL", "pl-PL", "pt-BR", "pt-PT", "ro-RO", "ru-RU", "sv-SE", "th-TH", "tr-TR", "vi-VN", "zh-CN", "zh-TW"]
	}), define("index.hotspot", function (e, t, n) {
		function i() {
			var t = "http://www.blackberry.com/select/wifiloginsuccess/",
			n = r.invokeRequest;
			if (n) {
				if ("application/vnd.blackberry.hotspot_login" === n.type)
					try {
						console.log("Hotspot Login Invocation");
						var i = JSON.parse(window.atob(r.invokeRequest.data));
						"url" in i && (t = e("iris/utils").resolveURL(i.url)),
						"iface" in i ? (console.log("Hotspot Login Invocation - Network Interface: " + i.iface), e("iris/hotspot").bindToInterface(i.iface)) : console.log("Hotspot Login Invocation - Network Interface Not Present")
					} catch (o) {
						console.log("Hotspot Login Invocation - Decoding Failed: " + (r.invokeRequest.data ? "" : "Invoke Request Data is empty"))
					}
			} else
				console.error("Hotspot Login Invocation - Request Invalid. Attempting Binding To Default Interface"), e("iris/hotspot").bindToInterface();
			s.emit("browser.invoked"),
			a.removeAllTabs(),
			a.create({
				selected : !0,
				url : t
			})
		}
		var r,
		a,
		o,
		s = e("iris/event");
		o = {
			invoked : i,
			PREINIT_REQUIRES : ["iris/property.manager"],
			TIER1_REQUIRES : ["iris/i18n", "iris/tabs/controller", "iris/popups", "iris/history", "plugins/find_on_page/index", "plugins/infobar/index", "plugins/navigationbar/index", "plugins/screens/reader/index", "plugins/screens/securefailed/index", "plugins/screens/tab/index", "plugins/hotspottitle/index", "plugins/tabbar/index", "plugins/menu/index", "plugins/contextmenu/index", "plugins/formautofill/index", "plugins/searchresults/index", "screen/manager", "iris/frecency", "iris/settings", "iris/screen.capture", "iris/geo", "iris/popupUnblocker", "iris/mixedContent", "iris/protocolHandler", "iris/file.chooser", "iris/user.media", "iris/fullscreen", "iris/dialogs", "plugins/screens/crashpage_screen/index", "iris/hole.punch", "iris/peek", "ui/scroll.detector", "iris/touch", "plugins/formcontrol/index"],
			TIER2_REQUIRES : [],
			TIER3_REQUIRES : [],
			preTier2 : function () {
				r = e("iris/invocation"),
				a = e("iris/tabs/controller"),
				r.startupMode !== r.LAUNCH ? o.invoked() : a.create({
					selected : !0,
					url : "http://www.blackberry.com/select/wifiloginsuccess/"
				}),
				s.on("invocation.invoked", i);
				var t = document.getElementById("urlfield");
				t.disabled = !0,
				t.readOnly = !0
			}
		},
		n.exports = o
	}), define("index", function (e, t, n) {
		function i() {
			var t = e("iris/invocation").invokeRequest,
			n = e("iris/tabs/controller");
			if ("uri" in t) {
				var i = t.uri,
				r = URI(i);
				if (e("iris/invoke.utils").isSupportedScheme(r.scheme())) {
					if (a.emit("browser.invoked"), "websearch" === r.scheme().toLowerCase() && (i = e("iris/search").getWebSearchUrl(decodeURIComponent(r.path()))), r.hostname().match(/bbc.co.uk$/g)) {
						var set = e("iris/settings");
						set.setValue(set.ENABLE_FLASH, !0, !0)
					}
					var s = n.getAll(),
					c = s.some(function (e) {
							return i === e.url ? (n.update(e.id, {
									selected : !0
								}), !0) : void 0
						});
					if (!c) {
						var l = n.getSelected();
						l && l.url === n.newTabUrl() && n.remove(l.id),
						n.create({
							selected : !0,
							url : i
						})
					}
					return !0
				}
			} else if ("data" in t && "type" in t) {
				var d = e("iris/web.notification");
				if (d.isNotificationInvocation(t.type)) {
					var u = d.handleNotificationInvocation(t.data);
					if (u) {
						var m = n.getTabForWebviewId(u);
						if (m)
							return a.emit("browser.invoked"), n.update(m.id, {
								selected : !0
							}), !0
					}
				}
			}
			return !1
		}
		var r,
		a = e("iris/event");
		r = {
			invoked : i,
			PREINIT_REQUIRES : ["iris/property.manager"],
			TIER1_REQUIRES : ["iris/i18n", "plugins/navigationbar/index", "plugins/screens/tab/index", "iris/hole.punch", "iris/universal.search", "iris/tabs/controller"],
			TIER2_REQUIRES : ["iris/settings", "iris/touch", "plugins/screens/securefailed/index", "plugins/screens/crashpage_screen/index", "iris/shortcuts", "iris/keyboard.focus", "iris/privatebrowsing", "iris/swoop"],
			TIER3_REQUIRES : ["iris/popups", "iris/downloads", "plugins/tabbar/index", "plugins/formautofill/index", "iris/analytics", "iris/appworld", "iris/file.chooser", "iris/frecency", "iris/restore", "iris/search", "iris/screen.capture", "iris/geo", "iris/mixedContent", "iris/web.notification", "iris/preloadImages", "iris/protocolHandler", "iris/screen.reader", "iris/user.media", "iris/fullscreen", "iris/dialogs", "iris/peek", "ui/scroll.detector", "plugins/dialogs/index", "plugins/formcontrol/index"],
			preTier2 : function () {
				var t,
				n = e("iris/utils"),
				r = e("iris/invocation"),
				o = e("iris/tabs/controller"),
				s = e("iris/tabs/session"),
				c = e("iris/settings");
				if (c.getValue(c.ON_STARTUP) === c.ON_STARTUP_LAST_TABS && (t = s.get()), a.on("invocation.invoked", i), r.startupMode !== r.LAUNCH) {
					if (t && t.length > 0 && t.forEach(function (e) {
							e.webviewId = void 0,
							e.selected = !1,
							o.create(e)
						}), i())
						return
				} else if (t && t.length > 0)
					return t.forEach(function (e) {
						e.selected || (e.webviewId = void 0),
						o.create(e)
					}), void 0;
				var l = n.getHomePageUrl(),
				d = l ? o.create.bind(this, {
						selected : !0,
						url : l
					}) : o.createNewTab.bind(this, !0);
				a.on("browser.init.tier2", d),
				l || e("plugins/screens/tab/index").loadNewTabPage()
			}
		},
		n.exports = r
	}), define("iris/analytics", function (e, t, n) {
		var i,
		r,
		a = e("iris/event"),
		o = e("iris/tabs/controller"),
		s = e("iris/bookmarks"),
		c = e("iris/invocation"),
		l = e("iris/search"),
		d = e("iris/settings"),
		u = e("iris/utils"),
		m = e("iris/exec"),
		f = e("iris/pps"),
		p = "/pps/services/cclagent/consent",
		g = !1,
		h = !1,
		v = function (e) {
			var t = e ? "on" : "un";
			Object.keys(i).forEach(function (e) {
				a[t](e, i[e])
			})
		},
		b = function (e) {
			e.consent && (g = "true" === e.consent.globalconsent, v(g))
		},
		E = {
			init : function (e, t) {
				qnx.callExtensionMethod("ccl.init", e, t)
			},
			shutdown : function () {
				return qnx.callExtensionMethod("ccl.shutdown")
			},
			eventKeysCreate : function () {
				qnx.callExtensionMethod("ccl.eventKeysCreate")
			},
			eventKeysAdd : function (e, t, n, i) {
				return qnx.callExtensionMethod("ccl.eventKeysAdd", e, t, n, i)
			},
			eventKeysDelete : function () {
				qnx.callExtensionMethod("ccl.eventKeysDelete")
			},
			setCCLEnabled : function (e) {
				return qnx.callExtensionMethod("ccl.setCCLEnabled", e)
			},
			isCCLEnabled : function () {
				return qnx.callExtensionMethod("ccl.isCCLEnabled")
			},
			onCustomEvent : function (e) {
				return qnx.callExtensionMethod("ccl.onCustomEvent", e)
			},
			onApplicationStart : function () {
				return qnx.callExtensionMethod("ccl.onApplicationStart")
			},
			onApplicationEnd : function () {
				return qnx.callExtensionMethod("ccl.onApplicationEnd")
			},
			onApplicationForeground : function () {
				return qnx.callExtensionMethod("ccl.onApplicationForeground")
			},
			onApplicationBackground : function () {
				return qnx.callExtensionMethod("ccl.onApplicationBackground")
			},
			onApplicationError : function () {
				return qnx.callExtensionMethod("ccl.onApplicationError")
			},
			onButtonClick : function () {
				return qnx.callExtensionMethod("ccl.onButtonClick")
			},
			onSearchEvent : function (e) {
				return e === void 0 ? qnx.callExtensionMethod("ccl.onSearchEvent") : qnx.callExtensionMethod("ccl.onSearchEvent", e)
			},
			onContentView : function () {
				return qnx.callExtensionMethod("ccl.onContentView")
			},
			onActivityStart : function (e) {
				return e === void 0 ? qnx.callExtensionMethod("ccl.onActivityStart") : qnx.callExtensionMethod("ccl.onActivityStart", e)
			},
			onActivityEnd : function (e) {
				return e === void 0 ? qnx.callExtensionMethod("ccl.onActivityEnd") : qnx.callExtensionMethod("ccl.onActivityEnd", e)
			},
			onActivityPause : function (e) {
				return e === void 0 ? qnx.callExtensionMethod("ccl.onActivityPause") : qnx.callExtensionMethod("ccl.onActivityPause", e)
			},
			onAdClickEvent : function (e) {
				return e === void 0 ? qnx.callExtensionMethod("ccl.onAdClickEvent") : qnx.callExtensionMethod("ccl.onAdClickEvent", e)
			},
			onConversionEvent : function (e) {
				return e === void 0 ? qnx.callExtensionMethod("ccl.onConversionEvent") : qnx.callExtensionMethod("ccl.onConversionEvent", e)
			}
		};
		r = {
			APP_NAME : "com.flashbrowser",
			APP_VERSION : "10.0.0",
			init : function () {
				if (!u.isWorkBrowser()) {
					E.init(r.APP_NAME, r.APP_VERSION),
					h = !0;
					var e = f.create(p, f.PPSMode.FULL);
					e.onFirstReadComplete = function (e) {
						b(e),
						r.snapshot()
					},
					e.onNewData = b,
					e.open(f.FileMode.RDONLY) || console.error("Cannot open analytics consent PPS object at " + p)
				}
			},
			isInit : function () {
				return h
			},
			shutdown : function () {
				h && E.shutdown()
			},
			isEnabled : function () {
				return g && h && "1" === E.isCCLEnabled()
			},
			setEnabled : function (e) {
				return h ? "0" === E.setCCLEnabled(e) : !1
			},
			send : function (e, t) {
				if (!g || !h || d.getValue(d.ENABLE_PRIVATE_BROWSING))
					return !1;
				var n = function (e, t) {
					if (e instanceof Array) {
						for (var n = 0; e.length > n; n++)
							if (e[n] === t)
								return !0;
						return !1
					}
					return e === t
				};
				qnx.callExtensionMethod("ccl.eventKeysCreate");
				for (var i in t)
					if ("NON_SENSITIVE" !== i && "LARGE_DATA" !== i) {
						var r = t[i],
						a = !n(t.NON_SENSITIVE, i),
						o = !n(t.LARGE_DATA, i);
						qnx.callExtensionMethod("ccl.eventKeysAdd", i, r, a, o)
					}
				var s = qnx.callExtensionMethod("ccl.onCustomEvent", e);
				return qnx.callExtensionMethod("ccl.eventKeysDelete"),
				"0" === s
			},
			snapshot : function () {
				s.search({
					title : "%%",
					url : "%%"
				}, function (e) {
					var t = e.length,
					startupMode = c.startupMode,
					i = {
						startupMode : c.STARTUP_MODES_MAP[startupMode],
						bookmarkCount : t,
						NON_SENSITIVE : ["startupMode", "bookmarkCount"],
						LARGE_DATA : ["bookmarkCount"]
					};
					startupMode === c.INVOKE && (i.invokingApp = c.invokeRequest.source_dname, i.NON_SENSITIVE.push("invokingApp"), i.LARGE_DATA.push("invokingApp")),
					r.send("snapshot", i)
				})
			}
		};
		var w = function () {
			var e = ["viewport", "apple-mobile-web-app-capable"],
			t = [],
			n = document.getElementsByTagName("meta");
			Array.prototype.forEach.call(n, function (n) {
				var i = n.getAttribute("name");
				i && -1 !== e.indexOf(i) && -1 === t.indexOf(i) && t.push(i)
			}),
			document.getElementsByTagName("video").length && t.push("video");
			var i = function (e) {
				return Array.prototype.some.call(e, function (e) {
					return "application/x-shockwave-flash" === e.getAttribute("type")
				})
			};
			return (i(document.getElementsByTagName("object")) || i(document.getElementsByTagName("embed"))) && t.push("flash"),
			t.join(",")
		},
		T = "(" + ("" + w) + " ());",
		y = function (e, t) {
			var n = o.getTabForWebviewId(e);
			n && t && r.send("tagsSniffed", {
				url : n.url,
				tags : t,
				NON_SENSITIVE : ["url", "tags"],
				LARGE_DATA : ["url", "tags"]
			})
		},
		I = function (e) {
			var t = o.getTabForWebviewId(e);
			t && t.url && r.send("fullScreenEnter", {
				url : t.url,
				NON_SENSITIVE : ["url"],
				LARGE_DATA : ["url"]
			})
		},
		S = function (e) {
			var t = o.getTabForWebviewId(e);
			t && t.url && r.send("fullScreenExit", {
				url : t.url,
				NON_SENSITIVE : ["url"],
				LARGE_DATA : ["url"]
			})
		},
		x = function (e, t) {
			r.send("webSearch", {
				searchProvider : e,
				phraseLength : t.length,
				NON_SENSITIVE : ["searchProvider", "phraseLength"],
				LARGE_DATA : ["searchProvider"]
			})
		};
		i = {
			LocationChange : function (e, t) {
				var n = o.getTabForWebviewId(e);
				if (n) {
					var i = JSON.parse(t);
					i.url !== o.getNewTabUrl() && r.send("urlLoad", {
						url : i.url,
						navigationType : i.navigationType,
						tabId : n.id,
						tabCount : o.getAll().length,
						NON_SENSITIVE : ["url", "navigationType", "tabId", "tabCount"],
						LARGE_DATA : ["url"]
					})
				}
			},
			"webpage.loaded" : function (e) {
				if (r.isEnabled()) {
					var t = o.get(e);
					t && t.webviewId && m.executeJavaScript(t.webviewId, T, y, !0)
				}
			},
			"navigationbar.urlConfirm" : function (e) {
				r.send("urlConfirm", {
					phraseLength : e.length,
					NON_SENSITIVE : ["phraseLength"]
				});
				var t = u.resolveURL(e);
				if (t !== e && t === l.getCurrentSearchQuery(e)) {
					var n = l.getCurrentProvider(),
					i = "";
					n && n.shortName && (i = n.shortName),
					x(i, e)
				}
			},
			"navigationbar.buttonClick" : function (e) {
				r.send("navBarButtonClick", {
					button : e,
					NON_SENSITIVE : ["button"],
					LARGE_DATA : ["button"]
				})
			},
			"history.selectHistoryItem" : function (e) {
				r.send("historyItemSelect", {
					url : e,
					NON_SENSITIVE : ["url"],
					LARGE_DATA : ["url"]
				})
			},
			"tabbar.showing" : function () {
				r.send("menuOpen", {
					type : "tabbar",
					NON_SENSITIVE : ["type"]
				})
			},
			"tabbar.cancel" : function () {
				r.send("menuCancel", {
					type : "tabbar",
					NON_SENSITIVE : ["type"]
				})
			},
			"tabbar.itemClicked" : function (e) {
				r.send("menuItemClick", {
					type : "tabbar",
					menuItem : e,
					NON_SENSITIVE : ["type", "menuItem"],
					LARGE_DATA : ["menuItem"]
				})
			},
			"screen.menu.showing" : function (e) {
				r.send("menuOpen", {
					type : "overflow",
					screen : e,
					NON_SENSITIVE : ["type", "screen"],
					LARGE_DATA : ["screen"]
				})
			},
			"screen.menu.cancel" : function (e) {
				r.send("menuCancel", {
					type : "overflow",
					screen : e,
					NON_SENSITIVE : ["type", "screen"],
					LARGE_DATA : ["screen"]
				})
			},
			"screen.menu.itemClicked" : function (e, t) {
				r.send("menuItemClick", {
					type : "overflow",
					screen : e,
					menuItem : t,
					NON_SENSITIVE : ["type", "screen", "menuItem"],
					LARGE_DATA : ["screen", "menuItem"]
				})
			},
			"screen.contextMenu.becomingVisible" : function (e) {
				r.send("menuOpen", {
					type : "context",
					context : e,
					NON_SENSITIVE : ["type", "context"],
					LARGE_DATA : ["context"]
				})
			},
			"screen.contextMenu.hiding" : function (e, t) {
				t || r.send("menuCancel", {
					type : "context",
					context : e,
					NON_SENSITIVE : ["type", "context"],
					LARGE_DATA : ["context"]
				})
			},
			"screen.contextMenu.itemSelected" : function (e, t) {
				r.send("menuItemClick", {
					type : "context",
					context : e,
					menuItem : t,
					NON_SENSITIVE : ["type", "context", "menuItem"],
					LARGE_DATA : ["context", "menuItem"]
				})
			},
			"reader.failed" : function (e) {
				r.send("readerFailed", {
					url : e,
					NON_SENSITIVE : ["url"],
					LARGE_DATA : ["url"]
				})
			},
			"iris.bookmarks.created" : function (e) {
				r.send("bookmarkCreate", {
					url : e.url,
					NON_SENSITIVE : ["url"],
					LARGE_DATA : ["url"]
				})
			},
			"bookmarks.select" : function (e) {
				r.send("bookmarkSelect", {
					url : e,
					NON_SENSITIVE : ["url"],
					LARGE_DATA : ["url"]
				})
			},
			"iris.bookmarks.update" : function (e, t) {
				var n = Object.keys(t).sort().join(",");
				n && r.send("bookmarkEdit", {
					propertiesChanged : n,
					NON_SENSITIVE : ["propertiesChanged"],
					LARGE_DATA : ["propertiesChanged"]
				})
			},
			"iris.bookmarks.removed" : function (e) {
				e.forEach(function (e) {
					r.send("bookmarkDelete", {
						url : e.url,
						NON_SENSITIVE : ["url"],
						LARGE_DATA : ["url"]
					})
				})
			},
			"invocation.invoked" : function (e) {
				var t = JSON.parse(e);
				t.uri && r.send("applicationInvoke", {
					invokingApp : t.source_dname,
					NON_SENSITIVE : ["invokingApp"],
					LARGE_DATA : ["invokingApp"]
				})
			},
			"tabs.created" : function (e) {
				r.send("tabCreate", {
					tabId : e.id,
					NON_SENSITIVE : ["tabId"]
				})
			},
			"tabs.updated" : function (e, t) {
				t.selected && r.send("tabSwitch", {
					tabId : e,
					NON_SENSITIVE : ["tabId"]
				})
			},
			"tabs.removed" : function (e) {
				r.send("tabDelete", {
					tabId : e,
					NON_SENSITIVE : ["tabId"]
				})
			},
			"search.added" : function (e, t) {
				t.isBulk || r.send("searchProviderAdd", {
					name : t.shortName,
					NON_SENSITIVE : ["name"],
					LARGE_DATA : ["name"]
				})
			},
			"search.removed" : function (e, t) {
				t.isBulk || r.send("searchProviderDelete", {
					name : t.shortName,
					NON_SENSITIVE : ["name"],
					LARGE_DATA : ["name"]
				})
			},
			"searchresults.select" : function (e, t, n, i) {
				r.send("searchResultSelect", {
					url : e,
					inputLength : t.length,
					type : n,
					rowIndex : i,
					NON_SENSITIVE : ["url", "inputLength", "type", "rowIndex"],
					LARGE_DATA : ["url", "inputLength", "type"]
				})
			},
			webSearch : x,
			FullScreenVideoStarted : I,
			FullScreenEnter : I,
			FullScreenVideoEnded : S,
			FullScreenExit : S,
			"settings.updated" : function (e, t) {
				r.send("settingsChange", {
					name : e,
					value : e + "." + t,
					NON_SENSITIVE : ["name", "value"],
					LARGE_DATA : ["name", "value"]
				})
			},
			"shortcut.ran" : function (e) {
				r.send("shortcutRan", {
					shortcutName : e,
					NON_SENSITIVE : ["shortcutName"],
					LARGE_DATA : ["shortcutName"]
				})
			},
			"newtab.select" : function (e, t, n, i, a) {
				r.send("newTabSelected", {
					index : e,
					isBookmark : n,
					urlOfFailedIcon : i ? void 0 : t,
					hoursSinceLastVisit : a,
					NON_SENSITIVE : ["index", "isBookmark", "urlOfFailedIcon", "hoursSinceLastVisit"],
					LARGE_DATA : ["isBookmark", "urlOfFailedIcon", "hoursSinceLastVisit"]
				})
			}
		},
		a.once("browser.init.tier3", r.init),
		n.exports = r
	}), define("iris/application", function (e, t, n) {
		function i(e) {
			switch (e) {
			case "right_up":
				return 90;
			case "left_up":
				return 270;
			case "bottom_up":
				return 180;
			default:
				return 0
			}
		}
		function r(e) {
			return 30 > e ? 30 : e > 54 ? 54 : e
		}
		var a,
		o = e("iris/event"),
		s = e("iris/keyboard"),
		c = e("iris/device"),
		l = window.orientation,
		d = !0;
		a = {
			env : {
				get : function (e) {
					return qnx.callExtensionMethod("application.getenv", e)
				},
				set : function (e, t) {
					return qnx.callExtensionMethod("application.setenv", e, t)
				},
				remove : function (e) {
					return qnx.callExtensionMethod("application.unsetenv", e)
				}
			},
			get systemFontFamily() {
				return qnx.callExtensionMethod("application.systemFontFamily")
			},
			get systemFontSize() {
				return r(parseInt(qnx.callExtensionMethod("application.systemFontSize"), 10))
			},
			get systemRegion() {
				return qnx.callExtensionMethod("application.systemRegion")
			},
			appName : function () {
				return "browser"
			},
			requestExit : function () {
				qnx.callExtensionMethod("application.requestExit")
			},
			notifyRotateComplete : function () {
				qnx.callExtensionMethod("application.notifyRotateComplete")
			},
			bindToNetworkDevice : function (e) {
				qnx.callExtensionMethod("application.bindToNetworkDevice", e)
			},
			realpath : function (e) {
				return qnx.callExtensionMethod("application.realpath", e)
			},
			setPooled : function (e) {
				qnx.callExtensionMethod("application.setPooled", e)
			},
			onPooled : function () {
				o.emit("application.pooling")
			},
			setManagedExit : function (e) {
				qnx.callExtensionMethod("application.setManagedExit", e)
			},
			exit : function () {
				qnx.callExtensionMethod("application.exit")
			},
			onExit : function () {
				o.emit("application.exit", [], !0)
			},
			onFontInfoChange : function (e, t) {
				o.emit("application.systemFontChange", [e, r(t)])
			},
			onKeyboardOpening : function () {
				s.setState(s.OPENING)
			},
			onKeyboardOpened : function () {
				s.setState(s.OPENED)
			},
			onKeyboardClosing : function () {
				s.setState(s.CLOSING)
			},
			onKeyboardClosed : function () {
				s.setState(s.CLOSED)
			},
			onKeyboardPosition : function (e) {
				s.setPosition(e)
			},
			onLanguageChange : function (e) {
				o.emit("application.systemLanguageChange", [e])
			},
			onLowMemory : function () {
				o.emit("application.lowMemory")
			},
			onRegionChange : function (e) {
				o.emit("application.systemRegionChange", [e])
			},
			onRotate : function (e, t) {
				var n = screen.width,
				r = screen.height,
				a = i(t),
				s = a - l,
				d = n,
				u = r;
				s % 180 && (d = r, u = n),
				c.updateInformationDensity(d, u, a, e),
				o.emit("application.rotate", [d, u, a, e], !0),
				l = a
			},
			onRotateCheck : function () {
				return !0
			},
			onRotateDone : function (e) {
				var t = i(e);
				o.emit("application.rotateDone", [t])
			},
			onSwipeDown : function () {
				o.emit("application.swipeDown")
			},
			onSwipeStart : function () {
				o.emit("application.swipeStart")
			},
			onWindowActive : function () {
				d || (d = !0, o.emit("application.active"))
			},
			onWindowInactive : function () {
				d && (d = !1, o.emit("application.inactive"))
			},
			onWindowState : function (e) {
				o.emit("application.stateChange", [e])
			},
			onSystemKeyPress : function (e, t) {
				o.emit("application.systemKeyPress", [e, t])
			},
			systemKeyPressedHandled : function (e, t) {
				qnx.callExtensionMethod("application.systemKeyPress", e, t)
			}
		},
		e("iris/error").wrapAll(a, "application."),
		n.exports = a
	}), define("iris/appworld", function (e) {
		function t(e) {
			a || (a = u.fromLocal(m, {}));
			var t = d.getTabForWebviewId(e);
			return t && t.webpage ? a[t.webpage.getUrl()] || a[URI(t.webpage.getUrl()).hostname()] : !0
		}
		function n(e) {
			var t = l.create(p, l.PPSMode.FULL);
			t.open(l.FileMode.WRONLY),
			t.write({
				msg : "launchApp",
				id : 1337,
				dat : {
					dname : e,
					perimeter : u.browserType
				}
			}),
			t.close()
		}
		function i(e) {
			a[e.webpage.getUrl()] = !0;
			var t = URI(e.webpage.getUrl()).hostname();
			a[t] = t in a ? !0 : !1,
			u.toLocal(m, JSON.stringify(a))
		}
		function r(t, r) {
			var a = window.parseInt(r, 10);
			if (a) {
				var o = l.create(f, l.PPSMode.FULL);
				o.onFirstReadComplete = function (r) {
					if (r && r.applications) {
						var s,
						l,
						u = Object.keys(r.applications).some(function (e) {
								var t = r.applications[e],
								n = t.substr(t.indexOf("dat::") + 5);
								try {
									return s = JSON.parse(n),
									l = e,
									window.parseInt(s.contentID, 10) === a
								} catch (i) {}

							}),
						m = d.getTabForWebviewId(t);
						u ? e("plugins/infobartender/index").createInfoBar(m.id, function () {
							return c.translate(2, s.name)
						}, function () {
							return c.translate(3)
						}, function () {
							n(l)
						}, function () {
							i(m)
						}) : e("plugins/infobartender/index").createInfoBar(m.id, function () {
							return c.translate(0, URI(m.webpage.getUrl()).hostname())
						}, function () {
							return c.translate(1)
						}, function () {
							e("iris/invocation").invoke({
								target : "sys.appworld",
								uri : "appworld://content/" + a
							})
						}, function () {
							i(m)
						})
					}
					o.close()
				},
				o.open(l.FileMode.RDONLY)
			}
		}
		var a,
		o = e("iris/event"),
		s = e("iris/exec"),
		c = e("iris/i18n"),
		l = e("iris/pps"),
		d = e("iris/tabs/controller"),
		u = e("iris/utils"),
		m = "appworld-domain-blacklist",
		f = "/pps/system/installer/registeredapps/.all",
		p = "/pps/services/navigator/control",
		g = 1e3,
		h = function () {
			var e;
			return Array.prototype.some.call(document.getElementsByTagName("meta"), function (t) {
				return "blackberry-appworld-content-id" === t.getAttribute("name") ? (e = t.getAttribute("value"), !0) : void 0
			}),
			e
		},
		v = "(" + ("" + h) + ")();";
		o.on("DocumentLoadFinished", function (e) {
			e == iris.chromeId || t(e) || s.executeJavaScript(e, v, r, !0, g)
		})
	}), define("iris/audio.capture", function (e, t, n) {
		var i,
		r = e("iris/event"),
		a = e("iris/invocation");
		i = {
			create : function () {
				var e = {
					success : null,
					fail : null,
					showing : !1,
					open : function (t, n) {
						e.success = t,
						e.fail = n;
						var i = {
							target : "sys.apps.audiorecorder",
							action : "bb.action.CAPTURE"
						};
						r.once("invocation.childCardClosed", function (t) {
							e.showing = !1,
							!t && e.fail && e.fail(),
							t.data ? e.success && e.success(t.data) : e.fail && e.fail()
						}),
						e.showing = !0,
						a.invoke(i, function (t) {
							t && (e.showing = !1, e.fail && e.fail(t))
						})
					},
					close : function () {
						e.showing && a.closeChildCard()
					}
				};
				return e
			}
		},
		n.exports = i
	}), define("iris/blocker", function (e, t, n) {
		function i(e, t, n, i, r) {
			return i || -1 === e.indexOf(n) ? (e.push(n), 1 === e.length && t && t(), void 0) : (console.warn(r + ": cannot push " + n + ", state: " + e), void 0)
		}
		function r(e, t, n, i, r) {
			var a = e.lastIndexOf(n);
			return -1 === a ? (console.warn(i + ": cannot pop " + n + ", state: " + e), void 0) : (e.splice(a, 1), 0 === e.length && t && t(), r && r(), void 0)
		}
		function a(e, t, n) {
			0 === e.length && n ? n() : e.length && t && t()
		}
		function o(e) {
			e()
		}
		function s(e) {
			e.forEach(function (e) {
				l.un(e.eventName, e.eventCallback)
			})
		}
		var c,
		l = e("iris/event");
		c = {
			createBlocker : function (e, t, n, c, d, u, m) {
				var f = [],
				p = [];
				return t.forEach(function (t) {
					var n = t.filterFunction || o,
					r = t.allowMultipleEvents || !1,
					a = n.bind(this, i.bind(this, f, c, t.name, r, e));
					l.on(t.event, a, t.filterParams),
					p.push({
						eventName : t.event,
						eventCallback : a
					})
				}),
				n.forEach(function (t) {
					var n = t.filterFunction || o,
					i = n.bind(this, r.bind(this, f, d, t.name, e, m));
					l.on(t.event, i, t.filterParams),
					p.push({
						eventName : t.event,
						eventCallback : i
					})
				}),
				u && u.forEach(function (e) {
					var t = e.filterFunction || o,
					n = t.bind(this, a.bind(this, f, c, d));
					l.on(e.event, n, e.filterParams),
					p.push({
						eventName : e.event,
						eventCallback : n
					})
				}), {
					destroy : s.bind(this, p),
					isBlocked : function () {
						return !!f.length
					},
					blockList : function () {
						return f
					}
				}
			}
		},
		n.exports = c
	}), define("iris/bookmarks", function (e, t, n) {
		function i(e) {
			if (e.title = c.removeWhiteSpaceControlCharacters(e.title), e.url = c.removeWhiteSpaceControlCharacters(e.url), e.tags)
				for (var t = 0; e.tags.length > t; t++)
					e.tags[t] = c.removeWhiteSpaceControlCharacters(e.tags[t]);
			return e
		}
		var r,
		a = e("iris/storage"),
		o = e("iris/event"),
		s = e("iris/tags"),
		c = e("iris/utils"),
		l = e("iris/validation"),
		d = e("plugins/toaster/index"),
		u = e("iris/i18n");
		r = {
			setBookmarkViewSelected : function (e) {
				a.setBookmarkViewSelected(e)
			},
			getBookmarkViewSelected : function () {
				return a.getBookmarkViewSelected()
			},
			update : function (e, t, n) {
				return e.id && e.url ? (t = i(t), (!t.url || l.isValidUrl(t.url)) && (t.tags && s.updateBookmarkTags(e, t.tags), t.title = l.conformTitle(t.title), a.editBookmark(e, t, function () {
							o.emit("iris.bookmarks.update", [e, t]),
							n && a.getBookmark(t.url ? t.url : e.url, n)
						})), void 0) : (n && n(void 0), void 0)
			},
			add : function (e, t) {
				if (e.tags || (e.tags = []), e = i(e), e.title = l.conformTitle(e.title), l.isValidUrl(e.url)) {
					var n = function (e) {
						t && t(e),
						o.emit("iris.bookmarks.created", [e])
					};
					a.addBookmark(e, n),
					o.emit("iris.bookmarks.creating", [e])
				}
			},
			addWithToast : function (e, t, n) {
				return d.createFrenchToast(u.translate(4), u.translate(5), n, r.add.bind(this, e, t))
			},
			search : function (e, t) {
				a.getBookmarks(e, t)
			},
			get : function (e, t) {
				a.getBookmark(e, t)
			},
			removeBookmarks : function (e, t) {
				e.length && (e[0].id ? (a.deleteBookmarksWithId(e, t), o.emit("iris.bookmarks.removed", [e])) : e[0].url && (a.deleteBookmarksWithUrl(e, t), o.emit("iris.bookmarks.removed", [e])))
			},
			screenshotUpdated : function (e) {
				r.get(e, function (e) {
					e && o.emit("iris.bookmarks.update", [e, {
								iconUrl : e.iconUrl
							}
						])
				})
			}
		},
		o.on("url.screenshot.onUpdated", r.screenshotUpdated),
		n.exports = r
	}), define("iris/camera.capture", function (e, t, n) {
		var i,
		r = e("iris/event"),
		a = e("iris/invocation"),
		o = e("iris/utils");
		i = {
			MODE_PHOTO : "photo",
			MODE_VIDEO : "video",
			MODE_FULL : "full",
			REASON_SAVE : "save",
			REASON_DONE : "done",
			create : function (e) {
				var t = {
					success : null,
					fail : null,
					showing : !1,
					open : function (n, s) {
						t.success = n,
						t.fail = s;
						var c = "";
						e.mode && (c = e.mode);
						var l = {
							target : "sys.camera.card",
							action : "bb.action.CAPTURE",
							data : o.base64Encode(c)
						};
						r.once("invocation.childCardClosed", function (e) {
							t.showing = !1,
							!e && t.fail && t.fail(i.REASON_DONE),
							e.reason === i.REASON_SAVE ? e.data && t.success ? t.success(e.data) : t.fail && t.fail(i.REASON_DONE) : t.fail && t.fail(e.reason)
						}),
						t.showing = !0,
						a.invoke(l, function (e) {
							e && (t.showing = !1, t.fail && t.fail(e))
						})
					},
					close : function () {
						t.showing && a.closeChildCard()
					}
				};
				return t
			}
		},
		n.exports = i
	}), define("iris/carrier.bookmarks", function (e, t, n) {
		function i(e, t) {
			console.log(t.message)
		}
		function r(e) {
			e.executeSql("CREATE TABLE carrierbookmarks(id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT NOT NULL, bookmarkKey INTEGER NOT NULL, deleted INTEGER DEFAULT 0, UNIQUE (url));", [], null, i)
		}
		function a(e, t, n) {
			for (var i = [], r = 0; t.rows.length > r; r++)
				i.push(t.rows.item(r));
			n(i)
		}
		function o(e, t) {
			e && (!t || t.title || t.url || t.tags) && g.remove(e.url)
		}
		function s(e, t) {
			e && (!t || t.title || t.url || t.tags) && e.forEach(function (e) {
				g.remove(e.url)
			})
		}
		function c(t, n, r, a) {
			for (var o = [], s = 0; n.rows.length > s; s++) {
				var c = n.rows.item(s);
				console.log("Removing carrier bookmark: " + JSON.stringify(c)),
				o.push(c)
			}
			o.length ? e("iris/bookmarks").removeBookmarks(o, a) : a && a(),
			t.executeSql("DELETE FROM carrierbookmarks WHERE deleted = 0;", [], function () {
				r && r()
			}, i)
		}
		function l(e) {
			if (!Array.isArray(e))
				return !1;
			var t = e.every(function (e) {
					if (!(e && e.url && I.isValidUrl(e.url) && e.title && isFinite(e.position)))
						return !1;
					if (e.icons) {
						if (!Array.isArray(e.icons))
							return !1;
						e.icons.forEach(function (e) {
							return isFinite(e.iconSize) && e.iconUrl ? void 0 : !1
						})
					}
					return !0
				});
			return t
		}
		function d(t) {
			var n = e("iris/screen.capture").captureSize();
			t.sort(function (e, t) {
				return e.iconSize - t.iconSize
			});
			for (var i = 0; t.length > i; i++)
				if (t[i].size >= n.width && t[i].size >= n.height)
					return t[i].iconUrl;
			return t[t.length - 1].iconUrl
		}
		function u(e) {
			h.transaction(function (t) {
				t.executeSql("SELECT url FROM carrierbookmarks WHERE deleted = 1", [], function (t, n) {
					for (var i = [], r = 0; n.rows.length > r; r++)
						i.push(n.rows.item(r));
					e(i, t)
				}, i)
			})
		}
		function m(e, t) {
			return t.some(function (t) {
				return e.url === t.url ? !0 : void 0
			})
		}
		function f(e, t) {
			t.executeSql("INSERT INTO carrierbookmarks (url, bookmarkKey, deleted) VALUES(?, ?, ?)", [e.url, 0, 0], null, i)
		}
		function p(e) {
			h.transaction(function (t) {
				t.executeSql("INSERT INTO carrierbookmarks (url, bookmarkKey, deleted) VALUES(?, ?, ?)", [e.url, 0, 1], null, i)
			})
		}
		var g,
		h,
		v,
		b,
		E = e("iris/event"),
		w = e("iris/storage"),
		T = e("iris/on.demand"),
		y = [{
				url : "http://www.blackberry.com",
				position : 1,
				title : "BlackBerry - Official BlackBerry - Tablets -Smartphones",
				icons : [{
						size : 242,
						iconUrl : "assets/default_screenshots/blackberry.png"
					}
				]
			}
		],
		I = e("iris/validation");
		g = {
			init : function (e, t) {
				v = e ? e : "carrier_bookmarks";
				var n = "";
				b = t ? t : "Carrier Bookmarks";
				var i = 10485760;
				h = window.openDatabase(v, n, b, i),
				"" === h.version && h.changeVersion("", "1.0", r)
			},
			wipe : function () {
				h.transaction(function (e) {
					e.executeSql("DELETE FROM carrierbookmarks;", [], null, i)
				})
			},
			addAll : function (t, n, i) {
				if (!l(t))
					return n && n(), i && i(), !1;
				var r = e("iris/job.runner").createParallel(n),
				a = e("iris/job.runner").createParallel(i);
				return t.sort(function (e, t) {
					return t.position - e.position
				}),
				r.addJob(),
				w.getBookmarkUrls(function (n) {
					u(function (i, o) {
						t.forEach(function (t, r) {
							if (!m(t, i)) {
								if (m(t, n))
									return p(t), void 0;
								t.incrementalFrecency = r,
								t.icons && t.icons.length && (t.iconUrl = d(t.icons)),
								f(t, o),
								a.addJob(),
								e("iris/bookmarks").add(t, function (e) {
									console.log("Added carrier bookmark: " + JSON.stringify(e)),
									a.jobComplete()
								})
							}
						}),
						r.jobComplete()
					})
				}),
				!0
			},
			add : function (e, t) {
				g.addAll([e], t)
			},
			getDeleted : function (e) {
				h.transaction(function (t) {
					t.executeSql("SELECT url FROM carrierbookmarks WHERE deleted = 1", [], function (t, n) {
						a(t, n, e)
					}, i)
				})
			},
			remove : function (e) {
				h.transaction(function (t) {
					t.executeSql("UPDATE carrierbookmarks SET deleted = 1 WHERE url = ?", [e], null, i)
				})
			},
			swapCarriers : function (e, t) {
				h.transaction(function (n) {
					n.executeSql("SELECT url FROM carrierbookmarks WHERE deleted = 0", [], function (n, i) {
						c(n, i, e, t)
					}, i)
				})
			},
			defaultBookmarks : function () {
				return y
			}
		},
		T.wrapModule(g, g.init, ["defaultBookmarks"]),
		E.on("iris.bookmarks.update", o),
		E.on("iris.bookmarks.removed", s),
		n.exports = g
	}), define("iris/carrier.search", function (e, t, n) {
		function i(e, t) {
			return e.descriptorUrl === t.descriptorUrl && e.shortName === t.shortName && e.searchTemplate === t.searchTemplate && e.suggestTemplate === t.suggestTemplate && e.iconUrl === t.iconUrl
		}
		function r(e) {
			if (!Array.isArray(e))
				return !1;
			var t = e.every(function (e) {
					if (!e || "string" != typeof e.url || -1 === e.url.indexOf("{searchTerms}") || !e.title || !isFinite(e.position))
						return !1;
					if (e.icons) {
						if (!Array.isArray(e.icons))
							return !1;
						e.icons.forEach(function (e) {
							return isFinite(e.iconSize) && e.iconUrl ? void 0 : !1
						})
					}
					return !0
				});
			return t
		}
		var a,
		o = e("iris/search"),
		s = e("iris/utils"),
		c = "carrier://",
		l = "iris-carrier-search-providers",
		d = e("iris/validation");
		a = {
			addTracked : function () {
				var t = e("iris/utils").fromLocal(l);
				return t && t.length ? (t.forEach(o.add), !0) : !1
			},
			addAll : function (e) {
				if (!r(e))
					return !1;
				e.sort(function (e, t) {
					return e.position - t.position
				});
				var t = [];
				e.forEach(function (e) {
					if (d.isValidUrl(e.url) && (!e.suggestionsUrl || d.isValidUrl(e.suggestionsUrl))) {
						var n = {
							searchTemplate : e.url,
							shortName : e.title,
							descriptorUrl : c + encodeURI(e.url),
							isBulk : !0
						};
						e.suggestionsUrl && (n.suggestTemplate = e.suggestionsUrl),
						e.icons && e.icons.length && (e.icons.sort(function (e, t) {
								return e.iconSize - t.iconSize
							}), n.iconUrl = e.icons[e.icons.length - 1].iconUrl),
						t.push(n)
					}
				}),
				t.length && o.removeDefaults();
				var n = s.fromLocal(l, []);
				return n.forEach(function (e) {
					t.some(i.bind(null, e)) || o.remove(e)
				}),
				t.forEach(function (e) {
					n.some(i.bind(null, e)) || o.add(e)
				}),
				s.toLocal(l, JSON.stringify(t)),
				!0
			}
		},
		n.exports = a
	}), define("iris/cli", function (e, t, n) {
		function i() {
			function e(e) {
				qnx.callExtensionMethod("webview.printToStdout", iris.chromeId, e)
			}
			e("Usage: iris [options] [--] url\n"),
			e("  -h|--help  Prints this help message\n"),
			e("  --setActive [true|false]\n"),
			e("  --setBlockPopups [true|false]\n"),
			e("  --setEnableCookies [true|false]\n"),
			e("  --setEnableCrossSiteXHR [true|false]\n"),
			e("  --setEnableDialogRequestedEvents [true|false]\n"),
			e("  --setEnableGeolocation [true|false]\n"),
			e("  --setEnableJavaScript [true|false]\n"),
			e("  --setEnableNetworkResourceRequestedEvents [true|false]\n"),
			e("  --setEnablePlugins [true|false]\n"),
			e("  --setEnableWebInspector [true|false]\n"),
			e("  --setEnableWebSockets [true|false]\n"),
			e("  --setFullScreenVideoCapable [true|false]\n"),
			e("  --setLoadImages [true|false]\n"),
			e("  --setPrivateBrowsing [true|false]\n"),
			e("  --setScreenPowerState [true|false]\n"),
			e("  --setVisible [true|false]\n"),
			e("  --setZoomToFitWidthOnLoad [true|false]\n"),
			qnx.callExtensionMethod("webview.destroy", iris.chromeId)
		}
		function r(t, n) {
			"setEnableWebInspector" == t ? e("iris/inspector").enabled = "true" === n : qnx.callExtensionMethod("webview." + t, iris.chromeId, n)
		}
		n.exports = {
			parseArguments : function (e) {
				for (var t = ["setPrivateBrowsing", "setBlockPopups", "setLoadImages", "setEnableJavaScript", "setEnablePlugins", "setEnableCookies", "setEnableWebSockets", "setEnableWebInspector", "setEnableGeolocation", "setEnableCrossSiteXHR", "setEnableNetworkResourceRequestedEvents", "setEnableDialogRequestedEvents", "setVisible", "setActive", "setZoomToFitWidthOnLoad", "setScreenPowerState", "setFullScreenVideoCapable"], n = 1; e.length > n; ++n) {
					var a = e[n];
					if ("--" == a) {
						++n;
						break
					}
					if ("-h" == a || "--help" == a)
						return i(), -1;
					for (var o = 0; t.length > o; ++o) {
						var s = t[o];
						if (a == "--" + s) {
							(n + 1 >= e.length || "true" != e[n + 1] && "false" != e[n + 1]) && (qnx.callExtensionMethod("webview.printToStderr", iris.chromeId, "--" + s + ' requires an second argument of either "true" or "false".\n'), qnx.callExtensionMethod("webview.destroy", iris.chromeId)),
							r(s, e[++n]);
							break
						}
					}
					if (o == t.length)
						break
				}
				return n
			}
		}
	}), define("iris/clipboard", function (e, t, n) {
		function i(e) {
			a || (a = document.getElementById("text-copy-area")),
			a.value = e,
			a.setSelectionRange(0, a.value.length),
			qnx.callExtensionMethod("webview.handleContextMenuResponse", iris.chromeId, "Copy")
		}
		var r,
		a;
		r = {
			copyTextToClipboard : function (e) {
				i(e)
			}
		},
		n.exports = r
	}), define("iris/date.band.builder", function (e, t, n) {
		function i(e, t) {
			var n = {};
			return e && (n.startTime = new Date(e.getTime()), n.startTime.getTime() > 0 && n.startTime.setHours(0, 0, 0, 0), n.startTime = n.startTime.getTime()),
			t && (n.endTime = new Date(t.getTime()), n.endTime.setHours(23, 59, 59, 999), n.endTime = n.endTime.getTime()),
			n
		}
		var r,
		a = 864e5,
		o = 7 * a;
		r = {
			getDateBands : function (e) {
				return r.getDateBandsForDate(e ? e : new Date, 7, 1, 6)
			},
			getDateBandsForDate : function (e, t, n, i) {
				var a = r.getDateBandsForPreviousDays(t, e),
				s = r.getDateBandsForPreviousWeeks(n, new Date(e.getTime() - o)),
				c = r.getDateBandsForPreviousMonths(i, e),
				l = a.concat(s, c);
				return l.push(r.getDateBandForEverytingBeforePreviousMonths(i, e)),
				l
			},
			getDateBandsForPreviousDays : function (e, t) {
				for (var n = [], o = 0; e > o; o++) {
					var s = new Date(t.getTime() - a * o);
					n[o] = {
						date : s,
						span : i(s, s)
					},
					n[o].type = 0 === o ? r.bandType.TODAY : 1 == o ? r.bandType.YESTERDAY : r.bandType.DAY
				}
				return n
			},
			getDateBandsForPreviousWeeks : function (e, t) {
				for (var n = [], s = new Date(t.getTime()), c = 1; e >= c; c++) {
					var l = new Date(s.getTime() - (o - a));
					n[c - 1] = {
						date : l,
						span : i(l, s),
						type : r.bandType.WEEK
					},
					s = new Date(l.getTime() - a)
				}
				return n
			},
			getDateBandsForPreviousMonths : function (e, t) {
				var n = [],
				a = new Date(t.getTime());
				a.setDate(32);
				for (var o = 0; e >= o; o++) {
					a.setDate(0);
					var s = new Date(a.getTime());
					s.setDate(1),
					n[o] = {
						date : s,
						span : i(s, a),
						type : r.bandType.MONTH
					},
					a = new Date(s.getTime())
				}
				return n
			},
			getDateBandForEverytingBeforePreviousMonths : function (e, t) {
				for (var n = new Date(t.getTime()), a = 0; e >= a; a++)
					n.setDate(0);
				var o = {
					date : n,
					span : i(new Date(0), n),
					type : r.bandType.EVERYTHING_BEFORE_DATE
				};
				return o
			},
			bandType : {
				TODAY : "today",
				YESTERDAY : "yesterday",
				DAY : "day",
				WEEK : "week",
				MONTH : "month",
				EVERYTHING_BEFORE_DATE : "everything before date"
			}
		},
		n.exports = r
	}), define("iris/device", function (e, t, n) {
		function i(e, t) {
			var n = t > e ? u.LOW : u.HIGH;
			n !== o && (o = n, o.screenWidth = e, o.screenHeight = t, l.emit("device.information-density.change." + o.type, [o], !0))
		}
		function r(e) {
			m = !!(e && e.inventory && e.inventory.KeyboardType && "Classic" === e.inventory.KeyboardType)
		}
		var a,
		o,
		s,
		c,
		l = e("iris/event"),
		d = e("iris/pps"),
		u = {
			LOW : {
				type : "low"
			},
			HIGH : {
				type : "high"
			}
		},
		m = !1;
		i(screen.width, screen.height),
		c = {
			hasPhysicalKeyboard : function () {
				return void 0 === a && (a = window.matchMedia("(-blackberry-physical-keyboard)").matches),
				a
			},
			isNSeries : function () {
				return 720 === screen.height && 720 === screen.width && !c.isClassic()
			},
			isASeries : function () {
				return c.isPortrait() ? 1280 === screen.height && 720 === screen.width : 720 === screen.height && 1280 === screen.width
			},
			isOSeries : function () {
				return c.isPortrait() ? 1920 === screen.height && 1080 === screen.width : 1080 === screen.height && 1920 === screen.width
			},
			isWSeries : function () {
				return 1440 === screen.height && 1440 === screen.width
			},
			isLSeries : function () {
				return c.isPortrait() ? 1280 === screen.height && 768 === screen.width : 768 === screen.height && 1280 === screen.width
			},
			isScreenSquare : function () {
				return c.isWSeries() || c.isNSeries() || c.isClassic()
			},
			hasLargeScreen : function () {
				return c.isASeries()
			},
			isPortrait : function () {
				return screen.height >= screen.width
			},
			getCurrentInformationDensity : function () {
				return o
			},
			updateInformationDensity : function (e, t, n, r) {
				i(e, t, n, r)
			},
			onInformationDensity : function (e) {
				if (!e)
					throw console.error("Cannot add information density change callback, missing callbacks"), "Cannot add information density change callback, missing callbacks";
				Object.keys(u).forEach(function (t) {
					var n = u[t].type,
					i = e[n];
					if (!i)
						throw console.error("Cannot add information density change callback, missing callback for density type: " + n), "Cannot add information density change callback, missing callback for density type: " + n;
					l.on("device.information-density.change." + n, i),
					n === c.getCurrentInformationDensity().type && i(c.getCurrentInformationDensity())
				})
			},
			INFORMATION_DENSITIES : u,
			getDesignUnitBucket : function () {
				return s ? s : (c.isLSeries() ? s = 10 : c.isASeries() ? s = 8 : c.isNSeries() ? s = 9 : c.isWSeries() || c.isOSeries() ? s = 12 : c.isClassic() ? s = 8 : (console.error("Unable to determine design unit bucket for resolution (" + screen.width + "x" + screen.height + "), falling back to 10"), s = 10), s)
			},
			calculatePixelsFromDU : function (e) {
				return c.getDesignUnitBucket() * e
			},
			isClassic : function () {
				var e;
				e = d.create("/pps/services/hw_info/inventory", d.PPSMode.FULL);
				try {
					e.open(d.FileMode.RDONLY) && (r(e.data), e.onNewData = r)
				} catch (t) {
					console.log("Error: " + t.message + " " + t.stack)
				}
				return c.isClassic = function () {
					return m
				},
				m
			},
			spatialNavigationEnabled : function () {
				return c.isClassic()
			}
		},
		n.exports = c
	}), define("iris/dialogs", function (e, t, n) {
		function i(e) {
			return function () {
				return "" !== e.databaseName ? u.translate(35, e.databaseName, qnx.callExtensionMethod("application.getRegisteredDomain", URI(e.url).hostname()), e.requestedSize) : u.translate(36, qnx.callExtensionMethod("application.getRegisteredDomain", URI(e.url).hostname()), e.requestedSize)
			}
		}
		function r(e) {
			return function () {
				return u.translate(37, e.systemId, e.requestedSize)
			}
		}
		function a(e, t, n, i, r) {
			return function () {
				qnx.callExtensionMethod("webview.dialogResponse", e, t, !0, n ? n : "", i ? encodeURIComponent(i) : "", r ? encodeURIComponent(r) : "")
			}
		}
		function o(e) {
			return function () {
				return e
			}
		}
		function s(t, n, i) {
			var r = document.createElement("hr"),
			a = document.createElement("input"),
			o = document.createElement("div"),
			s = document.createElement("label");
			s.className = "dialog-label",
			o.className = "font-size-s end-horizontal-padding-size-m",
			s.appendChild(o),
			a.setAttribute("type", "checkbox"),
			a.id = "dialog-toggle",
			s.appendChild(a),
			t.inputs = t.inputs || [],
			t.inputs.push(r),
			t.inputs.push(s),
			e("plugins/woggle/index").createToggle(a),
			t.buttons.forEach(function (e) {
				e.addEventListener("click", function () {
					a.checked && (f[n] = p, l.emit("dialogs.suppress", [n, t], !0))
				})
			});
			var c = t.translate;
			t.translate = function () {
				c(),
				s.className = "dialog-label",
				r.className = "",
				o.innerText = u.translate(38)
			},
			l.once("dialogs.suppress", function (e, n) {
				t !== n && (i(), d.destroyDialog(t))
			}, [n])
		}
		function c(t, n, c) {
			var O = m.getTabForWebviewId(t);
			if (!O)
				return console.error("Got a DialogRequested for webviewId=" + t + " which doesn't correspond to a tab. Ignoring."), void 0;
			switch (n.dialogType) {
			case h:
			case v:
			case b:
				if (f[O.id] === p)
					return c.setPreventDefault = !0, c.setModal = !1, void 0;
				f[O.id] ? g >= f[O.id] && f[O.id]++ : (f[O.id] = 1, l.on("tabs.updated", function D(e, t) {
						t.url && (delete f[O.id], l.un("tabs.updated", D))
					}, [O.id]))
			}
			if (parseInt(qnx.callExtensionMethod("webview.zOrder", iris.chromeId), 10) < iris.chromeZOrder)
				return console.log("chrome isn't visible, letting the system handle the " + n.dialogType + " dialog."), void 0;
			if (e("iris/fullscreen").isFullScreen())
				return console.log("in fullscreen mode, letting the system handle the " + n.dialogType + " dialog."), void 0;
			var B,
			M;
			switch (n.dialogType) {
			case h:
				B = d.buildAlert(O.id, S, o(n.message), a(t, n.waitHandle)),
				f[O.id] > g && s(B, O.id, a(t, n.waitHandle));
				break;
			case v:
				B = d.buildConfirm(O.id, x, o(n.message), a(t, n.waitHandle, "true"), a(t, n.waitHandle)),
				f[O.id] > g && s(B, O.id, a(t, n.waitHandle));
				break;
			case b:
				B = d.buildPrompt(O.id, C, o(n.message), void 0, a(t, n.waitHandle), n.result),
				B.buttons[1].addEventListener("click", function () {
					a(t, n.waitHandle, B.inputs[0].value, "okay")()
				}),
				f[O.id] > g && s(B, O.id, a(t, n.waitHandle));
				break;
			case E:
				B = d.buildConfirm(O.id, void 0, void 0, a(t, n.waitHandle, "true"), a(t, n.waitHandle)),
				B.translate = function () {
					B.title.innerText = u.translate(39),
					B.message.innerText = u.translate(40),
					B.buttons[1].innerText = u.translate(41),
					B.buttons[0].innerText = u.translate(42)
				};
				break;
			case w:
				var P = k;
				8 === n.alertType && (P = A),
				B = d.buildAlert(O.id, P, R[n.alertType] || N, a(t, n.waitHandle, "true")),
				3 === n.alertType && (B.buttons.unshift(document.createElement("button")), B.buttons[0].addEventListener("click", a(t, n.waitHandle)), M = B.translate, B.translate = function () {
					M(),
					B.buttons[0].innerText = u.translate(43),
					B.buttons[1].innerText = u.translate(44)
				});
				break;
			case T:
				B = d.buildConfirm(O.id, void 0, void 0, a(t, n.waitHandle, "true"), function () {
						a(t, n.waitHandle)(),
						l.emit("navigation.cancel", [t])
					}),
				B.translate = function () {
					B.title.innerText = u.translate(45),
					B.message.innerText = n.message + "\n\n" + u.translate(46),
					B.buttons[1].innerText = u.translate(47),
					B.buttons[0].innerText = u.translate(48)
				};
				break;
			case y:
				B = d.buildConfirm(O.id, L, i(n), a(t, n.waitHandle, "true"), a(t, n.waitHandle)),
				M = B.translate,
				B.translate = function () {
					M(),
					B.buttons[0].innerText = u.translate(49),
					B.buttons[1].innerText = u.translate(50)
				};
				break;
			case I:
				B = d.buildConfirm(O.id, _, r(n), a(t, n.waitHandle, "true"), a(t, n.waitHandle)),
				M = B.translate,
				B.translate = function () {
					M(),
					B.buttons[0].innerText = u.translate(49),
					B.buttons[1].innerText = u.translate(50)
				};
				break;
			default:
			}
			B && (c.setWait = !0, c.setModal = !1, d.show(B))
		}
		var l = e("iris/event"),
		d = e("plugins/dialogs/index"),
		u = e("iris/i18n"),
		m = e("iris/tabs/controller"),
		f = {},
		p = -1,
		g = 3,
		h = "JavaScriptAlert",
		v = "JavaScriptConfirm",
		b = "JavaScriptPrompt",
		E = "InsecureSubresourceLoadPolicyConfirm",
		w = "MediaError",
		T = "BeforeUnloadConfirm",
		y = "DatabaseQuotaExceeded",
		I = "WebFileSystemQuotaExceeded",
		S = function () {
			return u.translate(6)
		},
		x = function () {
			return u.translate(7)
		},
		C = function () {
			return u.translate(8)
		},
		k = function () {
			return u.translate(9)
		},
		A = function () {
			return u.translate(10)
		},
		N = function () {
			return u.translate(11)
		},
		L = function () {
			return u.translate(12)
		},
		_ = function () {
			return u.translate(13)
		},
		R = {
			1 : function () {
				return u.translate(14)
			},
			2 : function () {
				return u.translate(15)
			},
			3 : function () {
				return u.translate(16)
			},
			4 : function () {
				return u.translate(17)
			},
			5 : function () {
				return u.translate(18)
			},
			6 : function () {
				return u.translate(19)
			},
			7 : function () {
				return u.translate(20)
			},
			8 : function () {
				return u.translate(21)
			},
			9 : function () {
				return u.translate(22)
			},
			10 : function () {
				return u.translate(23)
			},
			11 : function () {
				return u.translate(24)
			},
			12 : function () {
				return u.translate(25)
			},
			13 : function () {
				return u.translate(26)
			},
			14 : function () {
				return u.translate(27)
			},
			15 : function () {
				return u.translate(28)
			},
			16 : function () {
				return u.translate(29)
			},
			17 : function () {
				return u.translate(30)
			},
			18 : function () {
				return u.translate(31)
			},
			19 : function () {
				return u.translate(32)
			},
			20 : function () {
				return u.translate(33)
			},
			21 : function () {
				return u.translate(34)
			}
		};
		l.on("DialogRequested", c),
		n.exports.hasNoExports = !0
	}), define("iris/downloads", function (e, t, n) {
		function i() {
			return E.fromLocal(S, [])
		}
		function r(e) {
			var t = e.values().filter(function (e) {
					return T.isValidUrl(e.url) ? !0 : !1
				});
			E.toLocal(S, JSON.stringify(t)) || u.clear()
		}
		function a() {
			f = b.getValue(b.DOWNLOADS_PATH)
		}
		function o() {
			for (var e = 0, t = w.getSelected(); p.length() > e; ) {
				var n = p.getItemAt(e);
				n.private ? (n.id > 0 && t && (("" === n.status || "paused" === n.status) && qnx.callExtensionMethod("download.cancelDownload", n.id), qnx.callExtensionMethod("download.removeDownload", n.id)), p.remove(n.sequenceId), g.emit("downloads.remove", [e], !0)) : e++
			}
			r(p),
			a()
		}
		function s(e, t) {
			for (var n = !1, i = 0; p.length() > i; i++)
				if (e === p.getItemAt(i).id) {
					n = !0;
					break
				}
			if (!n)
				for (i = 0; p.length() > i; i++) {
					var a = p.getItemAt(i);
					if (t.url === a.url && (t.name === a.name || t.name === a.title && "reload" === a.status)) {
						t.name = a.name,
						n = !0;
						break
					}
				}
			if (n) {
				var o = p.getItemAt(i),
				s = t;
				s.sequenceId = o.sequenceId,
				Object.keys(t).forEach(function (e) {
					if (o[e] = t[e], "name" === e) {
						var n = t[e].lastIndexOf("/");
						o.title = t[e].substring(n + 1),
						s.title = o.title
					} else
						"type" === e && (s.title = o.title)
				}),
				g.emit("downloads.update", [i, s], !0),
				("ResultCancelled" === t.status || "ResultSuccess" === t.status) && (o.tempFile = ""),
				r(p)
			}
		}
		function c(e, t) {
			if (e = e.toLowerCase(), e === t)
				return !0;
			var n = e.lastIndexOf("."),
			i = t.lastIndexOf("."),
			r = e.substring(n),
			a = t.substring(i),
			o = e.substring(0, n),
			s = t.substring(0, i);
			if (r === a) {
				if (!s.indexOf(o))
					return !0
			} else if (!s.indexOf(e))
				return !0;
			return !1
		}
		function l() {
			y.getDirectoryEntries(m, function (e) {
				e && e.files && e.files.forEach(function (e) {
					var t = p.values().some(function (t) {
							return e === t.tempFile ? !0 : void 0
						});
					t || y.deleteFile(e, function (e) {
						e || console.warn("unable to delete temp file.")
					})
				})
			})
		}
		function d(e, t) {
			g.emit("downloads.list.modified", [e, t], !0)
		}
		var u,
		m,
		f,
		p,
		g = e("iris/event"),
		h = e("iris/i18n"),
		v = e("iris/file.picker"),
		b = e("iris/settings"),
		E = e("iris/utils"),
		w = e("iris/tabs/controller"),
		T = e("iris/validation"),
		y = e("iris/webfs.helper"),
		I = e("plugins/toaster/index"),
		S = "iris-downloads",
		x = e("screen/manager"),
		C = 0;
		u = {
			init : function () {
				p = E.createLinkedHashMap(d, !0),
				a(),
				m = E.homeDir() + "/webviews/downloads/",
				m = m.replace(/\/\//g, "/"),
				l(),
				i().forEach(function (e) {
					e.id = 0,
					"" === e.status && y.fileExists(e.tempFile, function (t) {
						t ? y.getFile(e.tempFile, function (t) {
							e.status = "Error",
							e.downloaded = t.size
						}) : e.status = "ResultCancelled"
					}),
					e.sequenceId = C++,
					p.add(e.sequenceId, e)
				}),
				r(p),
				o()
			},
			getId : function (e, t) {
				for (var n, i = 0; p.length() > i; i++)
					if (n = p.getItemAt(i), n.url === e && (t === n.name || "application/vnd.oma.drm.message" === n.type && c(t, n.name))) {
						n.index = i;
						break
					}
				return n
			},
			addDownload : function (t, n) {
				for (var i = !1, a = 0; p.length() > a; a++) {
					var o = p.getItemAt(a);
					if (n.url === o.url && n.name === o.name) {
						n.status = "",
						o = n,
						g.emit("downloads.update", [a, n], !0),
						i = !0;
						break
					}
				}
				if (!i) {
					var s = {
						sequenceId : C++
					};
					E.extend(s, n),
					s.private = b.getValue(b.ENABLE_PRIVATE_BROWSING),
					g.emit("downloads.add", [s], !0),
					p.add(s.sequenceId, s)
				}
				r(p),
				n.save ? qnx.callExtensionMethod("webview.savePage", t, n.name) : qnx.callExtensionMethod("download.updateDownload", n.id, "ActionSave", n.name),
				x.currentScreen() !== e("plugins/screens/downloads_panel/index") && x.pushScreen(x.loadScreen("downloads_panel"))
			},
			pause : function (e, t, n) {
				var i = u.getId(e, t);
				if (i && i.id > 0) {
					var a = w.getSelected();
					a && qnx.callExtensionMethod("download.pauseDownload", i.id),
					p.get(i.sequenceId).status = "paused",
					r(p)
				}
				n && n()
			},
			resume : function (e, t, n) {
				var i = u.getId(e, t),
				a = w.getSelected();
				a && (i && i.id > 0 && "paused" === i.status ? (qnx.callExtensionMethod("download.resumeDownload", i.id), i.status = "") : (qnx.callExtensionMethod("webview.downloadUrl", a.webviewId, e, t, i.downloaded), i.status = "reload"), r(p)),
				n && n()
			},
			cancel : function (e, t, n) {
				var i = u.getId(e, t);
				if (i && i.id > 0) {
					var r = w.getSelected();
					r && qnx.callExtensionMethod("download.cancelDownload", i.id)
				}
				n && n()
			},
			reload : function (e, t, n) {
				for (var i = w.getSelected(), a = 0; p.length() > a; a++) {
					var o = p.getItemAt(a);
					if (o.url === e && t === o.name) {
						i && ("ResultCancelled" === o.status ? qnx.callExtensionMethod("webview.downloadUrl", i.webviewId, e, t, 0) : qnx.callExtensionMethod("webview.downloadUrl", i.webviewId, e, t, o.downloaded)),
						o.status = "reload",
						r(p),
						g.emit("downloads.update", [a, o], !0);
						break
					}
				}
				n && n()
			},
			downloadUrl : function (e, t, n) {
				var i = w.getSelected();
				i && qnx.callExtensionMethod("webview.downloadUrl", i.webviewId, e, t, 0),
				n && n()
			},
			remove : function (e, t, n) {
				var i = u.getId(e, t),
				a = w.getSelected();
				i && i.index >= 0 && (p.remove(i.sequenceId), r(p), g.emit("downloads.remove", [i.index], !0), i.id > 0 && a && qnx.callExtensionMethod("download.removeDownload", i.id)),
				n && n()
			},
			clear : function () {
				for (var e = 0; p.length() > e; ) {
					var t = p.getItemAt(e);
					!t.id || "" !== t.status && "paused" !== t.status ? (g.emit("downloads.remove", [e], !0), p.remove(t.sequenceId)) : e++
				}
				r(p);
				var n = w.getSelected();
				n && qnx.callExtensionMethod("download.removeDownload", 0)
			},
			list : function (e) {
				e(p.values())
			},
			savePage : function () {
				var e,
				t = f,
				n = w.getSelected(),
				i = qnx.callExtensionMethod("webview.pageType", n.webviewId),
				r = qnx.callExtensionMethod("webview.suggestedFilename", n.webviewId);
				"PageImage" !== i && "PageMedia" !== i && "PagePlugin" !== i || !r ? (e = n.getTitle(), e ? e += ".html" : (e = URI(n.url), e.suffix() || e.suffix("html"), e = e.filename())) : e = r,
				e = e.replace(/,/g, "");
				var a = {
					mode : v.MODE_SAVER,
					defaultSaveFileNames : [e],
					selectMode : v.SELECT_MODE_SINGLE,
					directory : [t],
					type : [v.TYPE_ALL]
				},
				o = v.create(a);
				o.open(function (e) {
					var t = e[0].lastIndexOf("/");
					-1 !== t && (f = e[0].slice(0, t), b.getValue(b.ENABLE_PRIVATE_BROWSING) || b.setValue(b.DOWNLOADS_PATH, f, !1));
					var i = {
						url : n.url,
						name : e[0],
						title : e[0].substr(e[0].lastIndexOf("/") + 1),
						downloaded : 0,
						totalSize : 0,
						save : !0,
						status : ""
					};
					u.addDownload(n.webviewId, i)
				})
			},
			exitPrivateBrowsing : o,
			itemDetailsUpdated : function (e) {
				var t = p.getIndex(e.sequenceId);
				d(t > 0 ? p.getItemAt(t - 1) : void 0, e),
				d(e, p.length() - 1 > t ? p.getItemAt(t + 1) : void 0)
			}
		},
		g.on("DownloadStarted", function (e, t) {
			var n = JSON.parse(t),
			i = {};
			i.name = n.filename,
			i.status = "",
			i.url = n.url,
			i.id = n.downloadId,
			s(n.downloadId, i)
		}),
		g.on("DownloadContentType", function (e, t) {
			var n = JSON.parse(t),
			i = {};
			i.type = n.contentType,
			i.id = n.downloadId,
			s(n.downloadId, i)
		}),
		g.on("DownloadRequest", function (t, n) {
			var i = w.getTabForWebviewId(t);
			i && i.parentId && !i.url && (w.remove(i.id), t = w.get(i.parentId).webviewId);
			var a = JSON.parse(n);
			if ("/" === a.url.charAt(0))
				return u.launch(a.url), void 0;
			for (var o = 0; p.length() > o; o++) {
				var s = p.getItemAt(o);
				if (s.url === a.url && "ResultSuccess" !== s.status)
					return "" === s.status || "paused" === s.status ? qnx.callExtensionMethod("download.updateDownload", a.downloadId, "ActionDiscard", a.url) : (s.status = "", s.id = a.downloadId, s.tempFile = a.tempFilename, r(p), qnx.callExtensionMethod("download.updateDownload", a.downloadId, "ActionSave", s.name)), x.currentScreen() !== e("plugins/screens/downloads_panel/index") && x.pushScreen(x.loadScreen("downloads_panel")), void 0
			}
			var c = {};
			if (c.id = a.downloadId, c.title = a.filename, c.url = a.url, c.tempFile = a.tempFilename, c.type = a.mimeType, c.totalSize = 0, c.downloaded = 0, c.status = "", "ActionNone" === a.action)
				if ("application/vnd.oma.drm.message" === c.type) {
					var l = x.loadSheet("download_save_screen");
					l.setContext({
						webviewId : t,
						item : c
					}),
					x.pushScreen(l)
				} else {
					var d = e("iris/file.picker"),
					m = {
						mode : d.MODE_SAVER,
						AllowOverwrite : !1,
						defaultSaveFileNames : [c.title],
						selectMode : d.SELECT_MODE_SINGLE,
						directory : [f],
						type : [d.TYPE_ALL]
					},
					g = d.create(m);
					g.open(function (e) {
						c.name = e[0];
						var n = e[0].lastIndexOf("/");
						-1 === n ? c.title = e[0] : (c.title = e[0].slice(n + 1), f = e[0].slice(0, n), b.getValue(b.ENABLE_PRIVATE_BROWSING) || b.setValue(b.DOWNLOADS_PATH, f, !1)),
						u.addDownload(t, c)
					}, function () {
						qnx.callExtensionMethod("download.updateDownload", c.id, "ActionDiscard", c.title)
					})
				}
		}),
		g.on("DownloadProgress", function (e, t) {
			var n = JSON.parse(t);
			if (n.totalSize) {
				var i = {};
				i.downloaded = n.downloadedSize,
				i.totalSize = n.totalSize,
				s(n.downloadId, i)
			}
		}),
		g.on("DownloadFinished", function (e, t) {
			var n = JSON.parse(t);
			s(n.downloadId, {
				status : n.downloadResult
			}),
			"ResultSuccess" === n.downloadResult ? I.createBasicToast(h.translate(51)) : "ResultNoEnoughMemError" === n.downloadResult ? I.createBasicToast(h.translate(52)) : I.createBasicToast(h.translate(53))
		}),
		g.on("settings.updated", a, [b.DOWNLOADS_PATH]),
		g.on("browser.init.tier3", u.init),
		n.exports = u
	}), define("iris/error", function (e, t, n) {
		n.exports = {
			wrap : function (e, t) {
				return function () {
					try {
						return e.apply(null, arguments)
					} catch (n) {
						var i = "";
						void 0 !== t && (i = ' (during "' + (t >= 0 ? arguments[t] : t) + '")'),
						console.error(n.name + ": " + n.message + i),
						console.log(n && n.stack || n)
					}
				}
			},
			wrapAll : function (e, t) {
				for (var i in e)
					"function" == typeof e[i] && (e[i] = n.exports.wrap(e[i], t ? t + i : i))
			}
		}
	}), define("iris/event", function (e, t, n) {
		n.exports = window.wp.core.events
	}), define("iris/exec", function (e, t, n) {
		function i(e, t) {
			var n = JSON.parse(t);
			a[n.resultId] && (a[n.resultId](e, n.resultString), delete a[n.resultId])
		}
		function r(e, t, n, i, r) {
			var s = qnx.callExtensionMethod("webview.executeJavaScript", e, t, i ? "IsolatedWorld" : "NormalWorld");
			n && (o[e] || (qnx.callExtensionMethod("webview.setWebEventEnabled", e, "JavaScriptResult", !0), o[e] = !0), a[s] = n, r && setTimeout(function () {
					a[s] && (console.warn("executeJavaScript call taking longer than " + r + "ms to return."), a[s](), delete a[s])
				}, r))
		}
		var a = {},
		o = {};
		n.exports = {
			executeJavaScriptResponse : i,
			executeJavaScript : r
		}
	}), define("iris/file.chooser", function (e, t, n) {
		function i(t, n) {
			var i,
			r,
			a,
			o,
			s,
			c = e("iris/file.picker"),
			l = [],
			d = [];
			n.acceptMIMETypes && n.acceptMIMETypes.forEach(function (e) {
				"image/*" === e && -1 === l.indexOf(c.TYPE_PICTURE) ? l.push(c.TYPE_PICTURE) : "video/*" === e && -1 === l.indexOf(c.TYPE_VIDEO) ? l.push(c.TYPE_VIDEO) : "audio/*" === e && -1 === l.indexOf(c.TYPE_MUSIC) && l.push(c.TYPE_MUSIC),
				r = e.split("/"),
				2 === r.length && "*" !== r[1] && (a = r[0], o = r[1], "image" === a && -1 === l.indexOf(c.TYPE_PICTURE) ? l.push(c.TYPE_PICTURE) : "video" === a && -1 === l.indexOf(c.TYPE_VIDEO) ? l.push(c.TYPE_VIDEO) : "audio" === a && -1 === l.indexOf(c.TYPE_MUSIC) && l.push(c.TYPE_MUSIC), 1 === n.acceptMIMETypes.length && d.push("*." + o))
			}),
			i = {
				mode : c.MODE_PICKER,
				type : l,
				filter : d
			},
			s = c.create(i),
			s.open(function (e) {
				qnx.callExtensionMethod("webview.chooseFileResponse", t, n.waitHandle, encodeURIComponent(e[0]))
			}, function (i) {
				i !== c.REASON_CANCEL && e("plugins/toaster/index").createBasicToast(e("iris/i18n").translate(54)),
				qnx.callExtensionMethod("webview.chooseFileResponse", t, n.waitHandle, "")
			})
		}
		function r(t, n, r) {
			if (r.setWait = !0, o.isWorkBrowser())
				return i(t, n), void 0;
			if ("camera" === n.capture || "camcorder" === n.capture) {
				var a = e("iris/camera.capture"),
				s = "camera" === n.capture ? a.MODE_PHOTO : a.MODE_VIDEO,
				c = a.create({
						mode : s
					});
				return c.open(function (e) {
					qnx.callExtensionMethod("webview.chooseFileResponse", t, n.waitHandle, encodeURIComponent(e))
				}, function (e) {
					e !== a.REASON_DONE && console.error("Unable to open the camera: " + e),
					qnx.callExtensionMethod("webview.chooseFileResponse", t, n.waitHandle, "")
				}),
				void 0
			}
			if ("microphone" === n.capture) {
				var l = e("iris/audio.capture").create();
				return l.open(function (e) {
					qnx.callExtensionMethod("webview.chooseFileResponse", t, n.waitHandle, encodeURIComponent(e))
				}, function (e) {
					e && console.error("Unable to record audio" + e),
					qnx.callExtensionMethod("webview.chooseFileResponse", t, n.waitHandle, "")
				}),
				void 0
			}
			i(t, n)
		}
		var a = e("iris/event"),
		o = e("iris/utils");
		a.on("ChooseFile", r),
		n.exports.hasNoExports = !0
	}), define("iris/file.picker", function (e, t, n) {
		function i(e) {
			var t = "";
			for (var n in e) {
				t += n + ":";
				var i = e[n];
				"string" == typeof i ? t += ":" + i : "number" == typeof i ? t += "n:" + i : "boolean" == typeof i ? t += "b:" + i : "object" == typeof i && (t += "json:" + JSON.stringify(i)),
				t += "\n"
			}
			return t
		}
		var r,
		a = e("iris/event"),
		o = e("iris/invocation"),
		s = e("iris/utils");
		r = {
			MODE_PICKER : "Picker",
			MODE_SAVER : "Saver",
			MODE_PICKER_MULTIPLE : "PickerMultiple",
			MODE_SAVER_MULTIPLE : "SaverMultiple",
			VIEWER_MODE_LIST : "ListView",
			VIEWER_MODE_GRID : "GridView",
			SORT_BY_NAME : "Name",
			SORT_BY_DATE : "Date",
			SORT_BY_SUFFIX : "suffix",
			SORT_BY_SIZE : "Size",
			SORT_ORDER_ASCENDING : "Ascending",
			SORT_ORDER_DESCENDING : "Descending",
			TYPE_PICTURE : "picture",
			TYPE_DOCUMENT : "document",
			TYPE_MUSIC : "music",
			TYPE_VIDEO : "video",
			TYPE_OTHER : "other",
			REASON_SAVE : "save",
			REASON_CANCEL : "cancel",
			create : function (e) {
				var t = {
					success : null,
					fail : null,
					showing : !1,
					open : function (n, c) {
						t.success = n,
						t.fail = c;
						var l = {
							Mode : e.mode,
							Title : e.title,
							ViewMode : e.viewMode,
							SortBy : e.sortBy,
							SortOrder : e.sortOrder,
							ImageCrop : e.imageCropEnabled,
							AllowOverwrite : e.allowOverwrite,
							Type : e.type ? e.type.join(",") : [],
							DefaultType : e.defaultType,
							Filter : e.filter ? e.filter.join(";") : [],
							Directory : e.directory ? e.directory.join(",") : [],
							DefaultFileNames : e.defaultSaveFileNames ? e.defaultSaveFileNames.join(",") : []
						},
						d = i(l),
						u = {
							action : "bb.action.OPEN",
							target : "sys.filepicker.target",
							data : s.base64Encode(d)
						};
						a.once("invocation.childCardClosed", function (e) {
							if (t.showing = !1, !e && t.fail && t.fail(r.REASON_CANCEL), e.reason === r.REASON_SAVE) {
								var n,
								i = e.data,
								a = [];
								if (i)
									try {
										i = JSON.parse(i),
										i.forEach(function (e) {
											n = e.uri,
											n.match("^file:///") && (n = n.slice(7)),
											n.match("file:") && (n = ""),
											"" !== n && a.push(n)
										}),
										t.success && t.success(a)
									} catch (o) {
										t.fail && t.fail(r.REASON_CANCEL)
									}
								else
									t.fail && t.fail(r.REASON_CANCEL)
							} else
								t.fail && t.fail(e.reason)
						}),
						t.showing = !0,
						o.invoke(u, function (e) {
							e && (t.showing = !1, t.fail && t.fail(e))
						})
					},
					close : function () {
						t.showing && o.closeChildCard()
					}
				};
				return t
			}
		},
		n.exports = r
	}), define("iris/frecency", function (e, t, n) {
		function i(e) {
			switch (e) {
			case u.TRANSITIONS.TYPED:
				return f;
			case u.TRANSITIONS.BOOKMARK:
				return p;
			case u.TRANSITIONS.HISTORY:
				return g;
			case u.TRANSITIONS.LINK:
				return h;
			default:
				return 1
			}
		}
		function r(e, t) {
			var n = (e - t) / 1e3 / 60 / 60 / 24;
			return 4 >= n ? v : 14 >= n ? b : 31 >= n ? E : 90 >= n ? w : T
		}
		function a(e, t, n) {
			e[t] || (e[t] = []),
			e[t].push(n)
		}
		function o(e) {
			for (var t = -1, n = 0, o = 0, s = {}, c = (new Date).getTime(), u = 0; e.length > u; u++)
				t != e[u].id ? (a(s, o, t), t = e[u].id, n = 0, o = r(c, e[u].lastVisitTime) * i(e[u].transition)) : m > n && (n++, o += r(c, e[u].lastVisitTime) * i(e[u].transition));
			a(s, o, t),
			Object.keys(s).length && (d.updateFrecency(s), l.emit("frecency.updated", [s]))
		}
		function s() {
			d.getHistory(o)
		}
		var c,
		l = e("iris/event"),
		d = e("iris/storage"),
		u = e("iris/history"),
		m = 10,
		f = 2,
		p = 1.4,
		g = 1.3,
		h = 1.2,
		v = 100,
		b = 70,
		E = 50,
		w = 30,
		T = 10;
		c = {
			init : function () {
				u.removeExpiredHistoryItems(s)
			},
			incrementalFrecency : function (e) {
				return i(e) * v
			}
		},
		n.exports = c,
		l.on("browser.init.tier3", c.init)
	}), define("iris/fullscreen", function (e, t, n) {
		var i,
		r,
		a,
		o,
		s = e("iris/event"),
		c = e("iris/i18n"),
		l = e("plugins/tabbar/index"),
		d = e("iris/tabs/controller"),
		u = e("plugins/toaster/index"),
		m = e("plugins/screens/reader/index"),
		f = function () {
			o.isFullScreen() && qnx.callExtensionMethod("webview.applicationSwipeInEvent", i)
		},
		p = function () {
			o.isFullScreen() && f()
		},
		g = function (t, n) {
			return i = t,
			e("plugins/dialogs/index").isShowingDialog() ? (f(), void 0) : (e("plugins/find_on_page/index").cleanUp(), l.endDrag(), l.hide(), e("iris/webview.viewport").setViewportAndCallBackAsNeeded(t, 0, 0, screen.width, screen.height), qnx.callExtensionMethod("webview.setVisible", l.tabbarId(), !1), document.getElementById("chrome").style.opacity = "0", n && !a ? (a = !0, r = u.createBasicToast(c.translate(55)), s.once("toaster.toast.destroyed", function () {
						o.isFullScreen() && (qnx.callExtensionMethod("webview.setZOrder", iris.chromeId, 0), m.switchZOrderForFullScreenVideo(!0)),
						r = void 0
					}, [r.id])) : (qnx.callExtensionMethod("webview.setZOrder", iris.chromeId, 0), m.switchZOrderForFullScreenVideo(!0)), void 0)
		},
		h = function (e) {
			i && (i = void 0, u.dismissToast(r), r = void 0, document.getElementById("chrome").style.opacity = "", m.switchZOrderForFullScreenVideo(!1), qnx.callExtensionMethod("webview.setZOrder", iris.chromeId, iris.chromeZOrder), qnx.callExtensionMethod("webview.setVisible", l.tabbarId(), !0), d.reposition(d.getTabForWebviewId(e).id))
		},
		o = {
			isFullScreen : function () {
				return void 0 !== i
			},
			init : function () {
				a = !1,
				s.on("application.swipeDown", p),
				s.on("FullScreenVideoStarted", function (e) {
					g(e, !0)
				}),
				s.on("FullScreenEnter", function (e) {
					g(e, !1)
				}),
				s.on("FullScreenVideoEnded", h),
				s.on("FullScreenExit", h),
				s.on("ProcessCrash", h),
				s.on("Created", f),
				s.on("RequestExitFullScreen", f)
			},
			enableSwipeDownHandling : function (e) {
				s.un("application.swipeDown", p),
				e && s.on("application.swipeDown", p)
			}
		};
		s.on("browser.init.tier2", o.init),
		n.exports = o
	}), define("iris/geo", function (e, t, n) {
		function i(t, n) {
			for (var i = 0; m.length > i; i++)
				m[i][0] == n && (t != m[i][2] && e("plugins/infobartender/index").removeInfoBar(m[i][1], m[i][3]), m.splice(i, 1), i--)
		}
		function r(e, t) {
			qnx.callExtensionMethod("webview.setAllowGeolocation", e, t.origin, !0),
			u.add({
				site : t.origin,
				type : u.type.GEOLOCATION,
				allow : 1
			}),
			i(e, t.origin)
		}
		function a(e, t) {
			qnx.callExtensionMethod("webview.setAllowGeolocation", e, t.origin, !1),
			i(e, t.origin)
		}
		function o(t, n) {
			u.add({
				site : n.origin,
				type : u.type.GEOLOCATION,
				allow : 1
			}),
			e("iris/invoke.utils").openSettings("settings://location", function () {
				qnx.callExtensionMethod("webview.reload", t)
			})
		}
		function s(t, n, i) {
			if (void 0 !== i)
				return qnx.callExtensionMethod("webview.setAllowGeolocation", t.webviewId, n.origin, 1 === i), void 0;
			var o = e("plugins/infobartender/index").createInfoBar(t.id, function () {
					return d.translate(56, n.origin)
				}, function () {
					return d.translate(50)
				}, r.bind(this, t.webviewId, n), a.bind(this, t.webviewId, n));
			m.push([n.origin, t.id, t.webviewId, o])
		}
		function c(t, n) {
			var i = e("iris/tabs/controller").getTabForWebviewId(t);
			i && (n.showGlobalPermissionRequest ? e("plugins/infobartender/index").createInfoBar(i.id, function () {
					return d.translate(56, n.origin)
				}, function () {
					return d.translate(57)
				}, o.bind(this, t, n), a.bind(this, t, n)) : u.isAllowed(n.origin, u.type.GEOLOCATION, s.bind(this, i, n)))
		}
		var l = e("iris/event"),
		d = e("iris/i18n"),
		u = e("iris/permissions"),
		m = [];
		l.on("GeolocationPermissionRequest", c),
		n.exports.hasNoExports = !0
	}), define("iris/history", function (e, t, n) {
		function i(e) {
			var t = URI(e);
			return "about" == t.protocol() || "local" == t.protocol() || c.getValue(c.ENABLE_PRIVATE_BROWSING) ? !1 : !0
		}
		function r() {
			u.length && !a.isAddVisitsThrottled() && (m = !1, s.addHistoryList(u.splice(0, g), function (e) {
					o.emit("iris.history.visited", [e]),
					setTimeout(function () {
						m = !0,
						r()
					}, p)
				}))
		}
		var a,
		o = e("iris/event"),
		s = e("iris/storage"),
		c = e("iris/settings"),
		l = e("iris/i18n"),
		d = e("iris/validation"),
		u = [],
		m = !0,
		f = new Date(5e3, 1, 1).getTime(),
		p = 3e3,
		g = 50;
		a = {
			addVisit : function (t) {
				if (t.url && i(t.url) && d.isValidUrl(t.url) && t.transition !== a.TRANSITIONS.BACK_FORWARD) {
					var n = {};
					n.lastVisitTime = Math.min(f, t.lastVisitTime || (new Date).getTime()),
					n.transition = t.transition ? t.transition : a.TRANSITIONS.LINK,
					n.title = t.title,
					n.url = t.url,
					n.incrementalFrecency = e("iris/frecency").incrementalFrecency(n.transition),
					u.push(n),
					r()
				}
			},
			deleteVisits : function (e, t) {
				e.forEach(function (e) {
					"url" in e && "startTime" in e && "endTime" in e ? s.deleteHistoryRangeForURL(e, t) : (e.startTime || (e.startTime = 0), e.endTime || (e.endTime = f), s.deleteHistoryRange(e, t))
				}),
				o.emit("iris.history.visitRemoved", e)
			},
			deleteAllVisits : function (e) {
				s.deleteHistoryRange({
					startTime : 0,
					endTime : f
				}, e),
				o.emit("iris.history.visitRemoved", [])
			},
			deleteUrlsInRange : function (e, t, n) {
				var i = e.map(function (e) {
						return e.url
					});
				s.batchDeleteHistoryRangeForURLs(i, t ? t : 0, n ? n : f),
				o.emit("iris.history.visitRemoved", e)
			},
			searchHistory : function (e, t) {
				e.startTime || (e.startTime = 0),
				e.endTime || (e.endTime = f),
				e.maxResults || (e.maxResults = 100),
				s.searchHistory(e, t)
			},
			getUniqueHistoryVisits : function (e, t) {
				e.startTime || (e.startTime = 0),
				e.endTime || (e.endTime = f),
				e.title || (e.title = "%%"),
				e.url || (e.url = "%%"),
				e.noTitle || (e.noTitle = l.translate(58)),
				s.getUniqueHistoryVisits(e, t)
			},
			getHistoryDates : function (e, t, n) {
				s.getHistoryDates(e, t, n)
			},
			removeExpiredHistoryItems : function (e) {
				var t = 864e5 * c.getValue(c.HISTORY_EXPIRY),
				n = new Date((new Date).getTime() - t);
				n.setHours(0, 0, 0, -1);
				var i = {
					endTime : n.getTime()
				};
				a.deleteVisits([i], e)
			},
			navigationTypeToTransitionType : function (e) {
				switch (e) {
				case "LinkClicked":
					return a.TRANSITIONS.LINK;
				case "FormSubmitted":
				case "FormResubmitted":
					return a.TRANSITIONS.FORM_SUBMIT;
				case "Reload":
					return a.TRANSITIONS.RELOAD;
				case "BackForward":
					return a.TRANSITIONS.BACK_FORWARD;
				case "Other":
				default:
					return a.TRANSITIONS.OTHER
				}
			},
			TRANSITIONS : {
				LINK : "link",
				TYPED : "typed",
				BOOKMARK : "auto_bookmark",
				HISTORY : "history",
				SUBFRAME : "auto_subframe",
				MANUAL_SUBFRAME : "manual_subframe",
				GENERATED : "generated",
				START_PAGE : "start_page",
				FORM_SUBMIT : "form_submit",
				RELOAD : "reload",
				KEYWORD : "keyword",
				KEYWORD_GENERATED : "keyword_generated",
				BACK_FORWARD : "back_forward",
				OTHER : "other"
			},
			isAddVisitsThrottled : function () {
				return !m
			},
			getAddVisitBatchTimeout : function () {
				return p
			}
		},
		n.exports = a
	}), define("iris/hole.punch", function (e, t, n) {
		function i(t) {
			if (t && (s = void 0), l && !l.isBlocked() && (c || (c = m.getHandle(iris.chromeId)))) {
				if (!s) {
					s = {},
					s.width = screen.width,
					s.top = e("plugins/titlebar/index").height() + document.getElementById("top-dock").offsetHeight + 20;
					var n = 3.5 * f.getDesignUnitBucket();
					s.height = screen.height - (e("plugins/navigationbar/index").barHeight() + n + s.top)
				}
				qnx.callExtensionMethod("window.setDiscardRects", c, 0, s.top, s.width, s.height)
			}
		}
		function r() {
			(c || (c = m.getHandle(iris.chromeId))) && qnx.callExtensionMethod("window.setDiscardRects", c)
		}
		function a() {
			u.emit("webpage.obscured", [], !0),
			r()
		}
		function o() {
			u.emit("webpage.unobscured", [], !0),
			i()
		}
		var s,
		c,
		l,
		d,
		u = e("iris/event"),
		m = e("iris/screen"),
		f = e("iris/device"),
		p = [{
				event : "manager.screen",
				filterParams : [u.FILTER_ANY, "stateChange", e("screen/manager").screenStates.PUSHING],
				name : "screen",
				allowMultipleEvents : !0
			}, {
				event : "toaster.toast.show",
				name : "toast",
				allowMultipleEvents : !0
			}, {
				event : "screen.menu.showing",
				name : "overflowmenu"
			}, {
				event : "dialogs.showing",
				name : "dialogs"
			}, {
				event : "formautofill.show",
				name : "formautofill"
			}, {
				event : "formcontrol.becomingVisible",
				name : "formcontrol"
			}, {
				event : "manager.view",
				filterParams : [e("plugins/views/new_tab_page/index"), "added"],
				name : "new_tab_page"
			}, {
				event : "screen.contextMenu.becomingVisible",
				name : "contextmenu"
			}, {
				event : "infobar.created",
				name : "infobar",
				allowMultipleEvents : !0
			}, {
				event : "find_on_page.show",
				name : "findOnPage"
			}, {
				event : "selectmore.show",
				name : "selectmore"
			}, {
				event : "searchresults.show",
				name : "searchresults"
			}, {
				event : "backforwardlist.show",
				name : "backforwardlist"
			}, {
				event : "InputNotificationFocusEvent",
				name : "chromeInputFocus",
				filterFunction : function (e, t, n) {
					t === iris.chromeId && n.focused && e()
				}
			}, {
				event : "keyboard.visible",
				name : "keyboard"
			}, {
				event : "tooltip.bar.visible",
				name : "tooltipbar"
			}
		],
		g = [{
				event : "manager.screen",
				filterParams : [u.FILTER_ANY, "unloadTransitionEnd"],
				name : "screen"
			}, {
				event : "toaster.toast.destroyed",
				name : "toast"
			}, {
				event : "screen.menu.hidden",
				name : "overflowmenu"
			}, {
				event : "dialogs.hidden",
				name : "dialogs"
			}, {
				event : "formautofill.dismiss",
				name : "formautofill"
			}, {
				event : "formcontrol.invisible",
				name : "formcontrol"
			}, {
				event : "manager.view",
				filterParams : [e("plugins/views/new_tab_page/index"), "unloadTransitionEnd"],
				name : "new_tab_page"
			}, {
				event : "screen.contextMenu.hidden",
				name : "contextmenu"
			}, {
				event : "infobar.removed",
				name : "infobar"
			}, {
				event : "find_on_page.remove",
				name : "findOnPage"
			}, {
				event : "selectmore.remove",
				name : "selectmore"
			}, {
				event : "searchresults.hide",
				name : "searchresults"
			}, {
				event : "backforwardlist.hide",
				name : "backforwardlist"
			}, {
				event : "InputNotificationFocusEvent",
				name : "chromeInputFocus",
				filterFunction : function (e, t, n) {
					t !== iris.chromeId || n.focused || e()
				}
			}, {
				event : "keyboard.hidden",
				name : "keyboard"
			}, {
				event : "tooltip.bar.hidden",
				name : "tooltipbar"
			}
		];
		d = {
			whatIsOnTop : function () {
				return l.blockList()
			}
		},
		l = e("iris/blocker").createBlocker("hole.punch", p, g, a, o),
		u.on("application.rotate", r),
		window.addEventListener("orientationchange", i.bind(this, !0), !1),
		qnx.callExtensionMethod("webview.setEnableInputNotifications", iris.chromeId, !0),
		n.exports = d
	}), define("iris/hotspot", function (e, t, n) {
		function i(e) {
			var t = e[c];
			"hostpot" in t && (p = "no" === t.hotspot, console.log("Hotspot Login - Status: " + p), d.emit("hotspot.connected", [!0]))
		}
		function r(e) {
			e || m.requestExit()
		}
		function a(t, n, i) {
			if (f.getTabForWebviewId(t))
				if (p) {
					console.log("Hotspot Login: CPD Connected");
					var a = JSON.parse(n),
					s = e("iris/tabs/controller").getTabForWebviewId(t);
					e("iris/invoke.utils").invokeUri(s, a.url, r),
					i.setPreventDefault = !0
				} else
					console.log("Hotspot Login: CPD Kick Request"), o.write({
						msg : "cpd_request",
						id : "1",
						dat : {
							"interface" : c
						}
					})
		}
		var o,
		s,
		c,
		l,
		d = e("iris/event"),
		u = e("iris/pps"),
		m = e("iris/application"),
		f = e("iris/tabs/controller"),
		p = !1;
		l = {
			bindToInterface : function (e) {
				e || (e = m.env.get("WIFIDEVICE"));
				var t = m.env.get("NET_PPS_ROOT"),
				n = t ? t : "/pps/services/networking";
				if (!o && (o = u.create(n + "/control_restricted", u.PPSMode.FULL), !o.open(u.FileMode.WRONLY)))
					return console.log("Hotspot Login: Failed to open /networking/control_restricted"), o = null, void 0;
				if (e && "" !== e) {
					if (c = e, m.bindToNetworkDevice(c), s && s.close(), s = u.create(n + "/interfaces/" + c, u.PPSMode.FULL), s.onNewData = i, s.onFirstReadComplete = i, !s.open(u.FileMode.RDONLY))
						return console.log("Hotspot Login: Failed to open interface: " + c), s = null, void 0;
					p = !1,
					d.un("LocationChanging", a),
					d.on("LocationChanging", a),
					d.emit("hotspot.connected", [!1])
				}
			}
		},
		n.exports = l
	}), define("iris/i18n/locale", function (e, t, n) {
		function i() {
			return e("iris/i18n/locale/list")
		}
		var r = "en-US",
		a = {
			get : function (e) {
				a.list().some(function (t) {
					return e === t
				}) || (console.error("Unknown/unsupported locale code: '" + e + "'. Using default: '" + r + "'"), e = r);
				var t = new XMLHttpRequest;
				t.open("GET", "locales/" + e + ".json", !1);
				try {
					t.send()
				} catch (n) {}

				if (200 == t.status)
					try {
						return JSON.parse(t.responseText)
					} catch (n) {}

				return console.error("Language Data could not be loaded for: '" + e + "'."),
				null
			},
			list : i
		};
		n.exports = a
	}), define("iris/i18n", function (require, exports, module) {
		function baseLocale(e) {
			return e.replace(BASE_LOCALE_REGEX, "")
		}
		function closestLocale(e) {
			function t(e) {
				return locale.list().some(function (t) {
					return e === t
				})
			}
			return t(e) ? e : t(baseLocale(e)) ? baseLocale(e) : locale.list()[0]
		}
		function translate(e) {
			var t = closestLocale(utils.language());
			_currentLocale !== t && (_currentLocale = t, _currentLocaleData = locale.get(t));
			var n = Array.prototype.slice.call(arguments, 1),
			i = e;
			return _currentLocaleData && _currentLocaleData[e] && (i = _currentLocaleData[e]),
			n.forEach(function (e, t) {
				var n = "%" + (t + 1) + "\\$[s|d]";
				_regex[n] || (_regex[n] = RegExp(n, "g")),
				i = i.replace(_regex[n], e)
			}),
			i
		}
		function loadGlobalizeCulture(lang) {
			var xhr = new XMLHttpRequest;
			xhr.open("GET", "cultures/globalize.culture." + lang + ".js", !1);
			try {
				xhr.send()
			} catch (e) {}

			if (200 == xhr.status)
				try {
					return _loadedGloblaizeCultures[lang] = !0,
					eval(xhr.responseText),
					!0
				} catch (e) {}

			return !1
		}
		function format(e, t) {
			var n = utils.language();
			_loadedGloblaizeCultures[n] || loadGlobalizeCulture(n) || console.error("Culture Data could not be loaded for: '" + n + "'.");
			var i = require("globalize"),
			r = i.findClosestCulture(n);
			return i.format(e, t, null !== r ? r : i.culture())
		}
		function updateBaseDirection() {
			self.isRTLLocale() ? (document.documentElement.dir = "rtl", _isDeviceLanguageRTL = !0) : (document.documentElement.dir = "ltr", _isDeviceLanguageRTL = !1),
			document.documentElement.lang = utils.language()
		}
		var event = require("iris/event"),
		utils = require("iris/utils"),
		locale = require("iris/i18n/locale"),
		jeds = {},
		_loadedGloblaizeCultures = {},
		_currentLocale,
		_currentLocaleData,
		_isDeviceLanguageRTL,
		_regex = {},
		self,
		BASE_LOCALE_REGEX = /-.*$/;
		event.on("iris.i18n.reset", function () {
			jeds = {}

		}),
		self = {
			translate : translate,
			format : format,
			isRTLLocale : function () {
				var e = baseLocale(utils.language());
				return "ar" === e || "he" === e
			},
			isDeviceLanguageRTL : function () {
				return void 0 === _isDeviceLanguageRTL && updateBaseDirection(),
				_isDeviceLanguageRTL
			}
		},
		event.on("browser.init.tier1", updateBaseDirection),
		event.on("application.systemLanguageChange", updateBaseDirection),
		module.exports = self
	}), define("iris/inputValidator", function (e, t, n) {
		function i(e, t, n) {
			function i() {
				return o.value = e.value,
				o.checkValidity()
			}
			function s() {
				return a.test(e.value)
			}
			var c = this,
			l = !1;
			c.resetValidationError = function () {
				l && (e.removeEventListener("input", c.resetValidationError), e.classList.remove("validationErrorBorder"), t.innerText = "", l = !1)
			},
			c.setValidationError = function (n) {
				e.removeEventListener("input", c.resetValidationError),
				e.addEventListener("input", c.resetValidationError),
				e.classList.add("validationErrorBorder"),
				t.innerText = n,
				l = !0
			},
			c.checkValidity = function () {
				switch (e.value = e.value.trim(), n) {
				case r.url:
					return s() && i();
				case r.nonEmpty:
					return s();
				default:
					throw "InputValidator: unknown input type."
				}
			},
			c.inputValue = function () {
				return e.value
			},
			c.showingValidationError = function () {
				return l
			}
		}
		var r = {
			url : 1,
			nonEmpty : 2
		},
		a = /(\s*[^\s]+\s*)+/,
		o = document.createElement("input");
		o.type = "url";
		var s = {
			create : function (e, t, n) {
				return new i(e, t, n)
			},
			inputType : r
		};
		n.exports = s
	}), define("iris/inspector", function (e, t, n) {
		var i,
		r = e("iris/pps"),
		a = e("iris/application"),
		o = "/pps/services/networking",
		s = ["ncm0", "rndis0", "ecm0", "en0"];
		i = {
			get enabled() {
				return qnx.callExtensionMethod("webInspector.enabled")
			},
			set enabled(e) {
				qnx.callExtensionMethod("webInspector.setEnabled", e)
			},
			get ipAddresses() {
				var e,
				t,
				n,
				i = a.env.get("NET_PPS_ROOT"),
				c = a.env.get("WIFIDEVICE");
				t = (i ? i : o) + "/interfaces/";
				var l = s.slice(0);
				c && l.push(c);
				var d;
				return l.some(function (i) {
					if (e = r.create(t + i, r.PPSMode.FULL), e.open(r.FileMode.RDONLY) && (n = e.data[i], e.close(), n.connected)) {
						var a,
						o;
						return n.ip_addresses.forEach(function (e) {
							e.indexOf("%") > -1 ? o = e.substr(0, e.indexOf("%")) : a = e.substr(0, e.indexOf("/"))
						}),
						d = {
							ipv4Address : a,
							ipv6Address : o
						},
						!0
					}
					return !1
				}),
				d
			},
			get port() {
				return qnx.callExtensionMethod("webInspector.port")
			},
			isEnabledForWebview : function (e) {
				return qnx.callExtensionMethod("webInspector.enabledForWebView", e)
			},
			setEnabledForWebView : function (e, t) {
				qnx.callExtensionMethod("webInspector.setEnabledForWebView", e, t)
			}
		},
		n.exports = i
	}), define("iris/interactionSettings.helper", function (e, t, n) {
		var i,
		r = e("iris/webfs.helper"),
		a = "/pps/system/IX",
		o = 2;
		i = {
			writeDefaultZoomSettings : function () {
				i.writeSetting("BouncebackDuration", .25, 2),
				i.writeSetting("MinScaleFactor", .85, 2),
				i.writeSetting("DeniedAnimationDuration", 1, 2),
				i.writeSetting("DeniedAnimationZoomInDuration", .5, 2),
				i.writeSetting("DeniedScaleFactor", 1.2, 2),
				i.writeSetting("KineticZoomFrictionalAcceleration", 15, 2),
				i.writeSetting("MinPinchTime", .2, 2),
				i.writeSetting("EnableKineticZoom", 0, 0)
			},
			writeDefaultKineticScrollSettings : function () {
				i.writeSetting("FrictionalAcceleration", 3600, 0),
				i.writeSetting("TerminalScrollSpeed", 1.5, 1),
				i.writeSetting("TimeUntilTerminalSpeed", .5, 1),
				i.writeSetting("DampingFrequency", 30, 0),
				i.writeSetting("SmartScrollPaddingWidth", 80, 0),
				i.writeSetting("SmartScrollPaddingHeight", 50, 0)
			},
			writeDefaultAdvancedSettings : function () {
				i.writeSetting("MinScrollTimeInterval", .016, 3),
				i.writeSetting("MinTrackerDelta", 10, 1),
				i.writeSetting("MaxTrackerQueueSize", 6, 0),
				i.writeSetting("ScrollRailAngle", 30, 0),
				i.writeSetting("DerailingAngle", 45, 0),
				i.writeSetting("TouchHoldTimeout", .5, 2),
				i.writeSetting("FCCDisplayTimeout", 2, 2),
				i.writeSetting("CaretTouchHoldWidth", 2.5, 2),
				i.writeSetting("CaretTouchHoldMinHeightForPadding", 5, 2),
				i.writeSetting("CaretTouchHoldMaxHeightForPadding", 10, 2),
				i.writeSetting("FCCWidthInMM", 21.4, 1),
				i.writeSetting("FCCHeightInMM", 21.4, 1),
				i.writeSetting("TouchHoldAnimation", 0, 0),
				i.writeSetting("TouchHoldAnimationStart", 250, 0),
				i.writeSetting("CPKBFCCLinearScaleFactorX", .6, 1),
				i.writeSetting("CPKBFCCLinearScaleFactorY", .6, 1),
				i.writeSetting("CPKBSwipeOption", 0, 0),
				i.writeSetting("QuickPasteTimeoutMS", 12e4, 0),
				i.writeSetting("MaxJitterRadiusHandleDrag", .7, 1),
				i.writeSetting("CPKBMaxJitterRadiusHandleDrag", 5, 1),
				i.writeSetting("CPKBMaxJitterRadiusScrolling", 3, 1),
				i.writeSetting("MaxJitterDistanceHandleDrag", 1.6, 1),
				i.writeSetting("CPKBMaxJitterDistanceHandleDrag", 7, 1),
				i.writeSetting("ZoomInThreshold", 1.5, 2)
			},
			writeDefaultSelectionSettings : function () {
				i.writeSetting("SelectionExpansionWaitTime", .8, 2),
				i.writeSetting("SelectionHandleWidthInMM", 6, 1),
				i.writeSetting("SelectionHandleHeightInMM", 6, 1),
				i.writeSetting("SmallSelectionHandleWidthInMM", 2, 1),
				i.writeSetting("SmallSelectionHandleHeightInMM", 2, 1),
				i.writeSetting("SelectionHandleTouchRegionWidthInMM", 10, 1),
				i.writeSetting("SelectionHandleTouchRegionHeightInMM", 10, 1),
				i.writeSetting("MaxPixelsToScroll", 7, 0),
				i.writeSetting("TextSelectionScrollingAcceleration", .8, 3),
				i.writeSetting("HandlesOnTopOfSelection", 0, 0)
			},
			writeDefaultOverscrollSettings : function () {
				i.writeSetting("OverscrollLimitFactor", .2, 2),
				i.writeSetting("OverscrollOffsetRatio", .5, 2)
			},
			writeDefaultInputLoggingSettings : function () {
				i.writeSetting("InputLogging", 0, 0)
			},
			writeDefaultKeyboardScrollSettings : function () {
				i.writeSetting("EnableScrollAcceleration", .5, 0),
				i.writeSetting("KeyboardScrollAcceleration", 2.4, 1),
				i.writeSetting("EnableKeyboardReversedScroll", 0, 1)
			},
			writeDefaultDynamicScalingSettings : function () {
				i.writeSetting("CPKBFCCEnableDynamicScaling", 0, 1),
				i.writeSetting("CPKBFCCDynamicScalingSampleSize", 5, 1),
				i.writeSetting("CPKBFCCDynamicScaleFactorX", .25, 2),
				i.writeSetting("CPKBFCCDynamicScaleFactorY", .25, 2),
				i.writeSetting("CPKBFCCMaxDynamicScale", 5, 1),
				i.writeSetting("CPKBFCCMinDynamicScale", .25, 2)
			},
			writeDefaultSettings : function () {
				i.writeDefaultZoomSettings(),
				i.writeDefaultKeyboardScrollSettings(),
				i.writeDefaultKineticScrollSettings(),
				i.writeDefaultAdvancedSettings(),
				i.writeDefaultSelectionSettings(),
				i.writeDefaultOverscrollSettings(),
				i.writeDefaultDynamicScalingSettings(),
				i.writeDefaultInputLoggingSettings()
			},
			writeSetting : function (e, t, n) {
				t = Math.round(t * Math.pow(10, n)) / Math.pow(10, n);
				var i = e + ":n:" + t;
				r.writeFile(a, i, function (n) {
					if (n) {
						var i = document.getElementById(e);
						if (i && "checkbox" === i.type)
							i.checked = 0 !== t;
						else {
							var r = document.getElementById("value-" + e);
							r && (r.innerText = t),
							i && (i.value = t)
						}
					} else
						console.error("Writing PPS Attribute " + e + " failed.")
				})
			},
			updateInterface : function (e, t, n) {
				t = Math.round(t * Math.pow(10, n)) / Math.pow(10, n),
				document.getElementById("value-" + e).innerText = t
			},
			loadSettings : function (e) {
				r.readFile(a, function (t) {
					if (!t)
						return e && e(!1), void 0;
					var n = t.split("\n");
					return n.length === o ? (i.writeDefaultSettings(), i.loadSettings(), void 0) : (n.splice(0, 1), n.forEach(function (e) {
							var t = e.split(":"),
							n = t[0],
							i = t[2];
							if (n && i) {
								var r = document.getElementById(n);
								if (r)
									"checkbox" === r.type ? r.checked = "0" !== i : r.value = i;
								else if ("InputLogging" === n && "0" !== i)
									for (var a = document.getElementsByName("log-group"), o = 0; a.length > o; o++)
										a[o].checked = i & 1 << o;
								else if (r = document.getElementsByName(n), r.length && "radio" === r[0].type)
									for (var s = 0; r.length > s; s++)
										if (r[s].value === i) {
											r[s].checked = !0;
											break
										}
								var c = document.getElementById("value-" + n);
								c && (c.innerText = i)
							}
						}), void 0)
				})
			}
		},
		n.exports = i
	}), define("iris/internal", function (e, t, n) {
		var i = e("iris/event"),
		r = e("iris/error"),
		a = e("iris/exec"),
		o = e("iris/application"),
		s = e("iris/invocation"),
		c = e("iris/nfc"),
		l = e("iris/windowAnimations"),
		d = e("iris/webDriver"),
		u = e("iris/pps"),
		m = e("iris/settings"),
		f = e("iris/popupUnblocker"),
		p = e("iris/validation");
		n.exports = {
			application : o,
			invocation : s,
			nfc : c,
			windowAnimations : l,
			pps : u,
			webDriver : d,
			webEvent : r.wrap(function (e, t, n) {
				var r = {};
				switch (t) {
				case "FullScreenVideoStarted":
				case "FullScreenVideoEnded":
				case "PropertyVisibleEvent":
				case "FullScreenEnter":
				case "FullScreenExit":
				case "Destroyed":
					i.emit(t, [e]);
					break;
				case "ProtocolHandler":
					return n = JSON.parse(n),
					i.emit(t, [e, n, r], !0),
					JSON.stringify(r);
				case "DialogRequested":
					return n = JSON.parse(n),
					i.emit(t, [e, n, r], !0),
					JSON.stringify(r);
				case "ChooseFile":
					if (e !== iris.chromeId)
						return n = JSON.parse(n), i.emit(t, [e, n, r], !0), JSON.stringify(r);
					break;
				case "FormControlEvent":
				case "PropertyCanGoBackEvent":
				case "PropertyCanGoForwardEvent":
				case "NetworkError":
				case "PropertyFaviconEvent":
				case "PropertyScrollPositionEvent":
				case "ScrollTriggerBoxDirectionChanged":
					e !== iris.chromeId && (n = JSON.parse(n), i.emit(t, [e, n]));
					break;
				case "PropertySecurityInfoEvent":
				case "PropertyFileSystemAPISandboxedEvent":
				case "SSLHandshakingFailed":
				case "NotificationShow":
				case "NotificationCancel":
				case "InputNotificationFocusEvent":
				case "InputNotificationKeyEvent":
				case "PropertyViewportEvent":
					n = JSON.parse(n),
					i.emit(t, [e, n]);
					break;
				case "PropertyCurrentContextEvent":
					e === iris.chromeId && i.emit("touch.hold", []),
					i.emit(t, [e, n]);
					break;
				case "ContextMenuRequestEvent":
					return i.emit(t, [e, n]),
					'{"setPreventDefault": true}';
				case "UnknownProtocol":
				case "ContextMenuCancelEvent":
				case "ContextMenuCallbacksSupported":
				case "KeyboardRequestedEvent":
					return i.emit(t, [e, n, r], !0),
					JSON.stringify(r);
				case "Created":
				case "DocumentLoadCommitted":
				case "DocumentLoadFailed":
				case "DocumentLoadFinished":
				case "ProcessCrash":
				case "Focus":
				case "UnhandledKeyInput":
				case "ContextMenuCallback":
				case "InvokeRequestEvent":
					i.emit(t, [e, n]);
					break;
				case "PropertyTitleEvent":
					e !== iris.chromeId && i.emit(t, [e, p.conformTitle(n)]);
					break;
				case "FindString":
				case "LocationChange":
				case "PropertyLoadProgressEvent":
				case "PropertyLocationEvent":
				case "CloseWindow":
				case "FormAutofillRequestEvent":
				case "FormAutofillCancelEvent":
				case "CaptureContents":
				case "ContentRendered":
				case "AddSearchProviderRequest":
				case "TouchHoldReleased":
				case "JavaScriptCallback":
				case "DownloadRequest":
				case "DownloadStarted":
				case "DownloadContentType":
				case "DownloadProgress":
				case "DownloadError":
				case "DownloadFinished":
				case "HardKeyHandled":
					e !== iris.chromeId && i.emit(t, [e, n]);
					break;
				case "JavaScriptResult":
					a.executeJavaScriptResponse(e, n);
					break;
				case "OpenWindow":
					return n = JSON.parse(n),
					e === iris.chromeId || n.userGesture || !m.getValue(m.BLOCK_POPUPS) ? i.emit(t, [e, n, r], !0) : (f.checkPermissions(t, e, n, r), r.setWait = !0),
					JSON.stringify(r);
				case "LocationChanging":
					if (e !== iris.chromeId)
						return i.emit(t, [e, n, r], !0), JSON.stringify(r);
					break;
				case "UserMediaRequest":
				case "GeolocationPermissionRequest":
				case "NotificationPermissionRequest":
				case "MixedContentDetected":
					return n = JSON.parse(n),
					i.emit(t, [e, n]),
					'{"setPreventDefault": true}';
				case "NotificationPermissionCheck":
					return n = JSON.parse(n),
					i.emit(t, [e, n, r], !0),
					JSON.stringify(r);
				case "StringResponse":
					n = JSON.parse(n),
					i.emit(t, [e, n.responseId, n.responseData]);
					break;
				case "PropertyScreenReaderEnabledEvent":
					e === iris.chromeId && i.emit(t, [e, JSON.parse(n)]);
					break;
				case "PropertyChanged":
					break;
				default:
					console.log("Unknown Event: " + t)
				}
			}, 1)
		}
	}), define("iris/invocation", function (e, t, n) {
		n.exports = window.wp.core.invocation
	}), define("iris/invoke.utils", function (e, t, n) {
		function i(e, t, n, i) {
			var r;
			return n.some(function (n) {
				var a = e,
				o = n;
				return "" !== t && (a = e[t]),
				"" !== i && (o = n[i]),
				a === o ? (r = n, !0) : void 0
			}),
			r
		}
		function r(t, n, r, a, d) {
			var u = e("iris/invocation"),
			f = e("iris/i18n"),
			p = function (e) {
				console.log("Card " + s + " was closed, response.reason is " + e.reason),
				s = null
			},
			g = function (i) {
				if (i) {
					if (t.uri) {
						var a = e("iris/search").getCurrentSearchQuery(t.uri.replace(/%20/g, " "));
						if (a)
							return l.update(n.id, {
								url : a
							}), void 0
					}
					e("plugins/toaster/index").createBasicToast(f.translate(59, t.uri ? t.uri : t.type))
				} else
					s = o, o = null, c.once("invocation.childCardClosed", p);
				r && r(i)
			};
			if (a || !d || 0 === d.length)
				return g(!0), void 0;
			for (var h = [], v = [], b = 0, E = 0, w = 0; d.length > b; b++) {
				var T = d[b];
				T.action === u.InvokeAction.VIEW && i(T, "default", T.targets, "key") ? h[E++] = T : T.action === u.InvokeAction.OPEN && i(T, "default", T.targets, "key") && (v[w++] = T)
			}
			if (!h.length && !v.length)
				return g(!0), void 0;
			o = null,
			s = null;
			var y = h.concat(v);
			for (b = 0; y.length > b; b++) {
				var I = i(y[b].default, "", m, "");
						if (I)
							return t.uri ? u.invoke({
								uri : t.uri
							}, g) : u.invoke({
								type : t.type,
								target : y[b].default, action:
								y[b].action
							}, g), o = I, void 0
			}
			if (t.type)
				return g(!0), void 0;
			var S;
			h.length ? S = i(h[0], "default", h[0].targets, "key") : v.length && (S = i(v[0], "default", v[0].targets, "key"));
			var x = S.label,
			C = S.icon;
			if (S = S.key, "sys.settings.card" === S && n && e("iris/tabs/controller").hasNetworkError(n.id))
				return u.invoke({
					uri : t.uri
				}, g), void 0;
			var k,
			A = e("plugins/dialogs/index");
			if ("sys.phone" === S) {
				var N = t.uri.replace(/wtai:\/\/wp\/mc;/, "");
				N = N.slice(N.indexOf(":") + 1).trim(),
				N = 0 === N.indexOf("//") ? N.slice(2) : N;
				var L = N.indexOf("?");
				return L > 0 && (N = N.substring(0, L)),
				k = A.buildConfirm(n.id, function () {
						return f.translate(60)
					}, function () {
						return f.translate(61, decodeURI(N))
					}, u.invoke.bind(this, t, g), r ? r.bind(!0) : void 0, function () {
						return f.translate(62)
					}),
				A.show(k),
				void 0
			}
			k = A.buildConfirm(n.id, function () {
					return f.translate(63)
				}, function () {
					return ""
				}, u.invoke.bind(this, t, g), r ? r.bind(!0) : void 0);
			var _ = k.translate;
			k.translate = function () {
				_(),
				k.message.innerHTML = "";
				var e = document.createElement("div");
				if (e.textContent = f.translate(64, t.uri), k.message.appendChild(e), e = document.createElement("div"), e.textContent = x, e.style.fontWeight = "bold", e.style.verticalAlign = "middle", C) {
					var n = document.createElement("img");
					n.src = "file://" + C,
					n.style.paddingRight = "20px",
					n.style.verticalAlign = "middle",
					k.message.appendChild(n),
					e.style.display = "inline-block"
				}
				k.message.appendChild(e),
				e = document.createElement("div"),
				e.textContent = f.translate(65),
				k.message.appendChild(e)
			},
			k = A.show(k)
		}
		var a,
		o,
		s,
		c = e("iris/event"),
		l = e("iris/tabs/controller"),
		d = ["http", "https", "file", "websearch", "rtsp", "ftp"],
		u = ["about", "javascript", "local", "blob", "platform", "vs"],
		m = ["com.flashbrowser", "sys.pim.uib.email.hybridcomposer.dup", "sys.pim.uib.email.hybridcomposer", "sys.appworld", "sys.appworld.xperimeter", "com.tcs.maps", "sys.pim.text_messaging.smsuri", "sys.help", "sys.games.open", "cisco.webex.meeting.main.target", "sys.miracastviewer"],
		f = ["sys.miracastviewer"],
		p = ["uri", "mime", "data", "metadata", "perimeter", "file_transfer_mode"];
		a = {
			isSupportedScheme : function (e) {
				return e = e.toLowerCase(),
				!!i(e, "", d, "")
			},
			addMenuItems : function (t, n, r, a) {
				if (e("iris/validation").isValidUrl(n)) {
					var o = URI(n).scheme().toLowerCase();
					if (!i(o, "", u, "")) {
						o || (n = "http://" + n);
						var s = {
							uri : n.replace(/ /g, "%20")
						};
						r && (s.metadata = JSON.stringify({
									subject : r
								})),
						t.push({
							invokeQuery : s,
							disabled : a
						})
					}
				}
			},
			openSettings : function (t, n) {
				n && c.once("invocation.childCardClosed", n);
				var i = {
					target : "sys.settings.card",
					uri : t
				};
				e("iris/invocation").invoke(i)
			},
			invokeUri : function (t, n, i) {
				var o = e("iris/invocation");
				n = n.replace(/ /g, "%20");
				var s = {
					uri : n
				};
				o.queryTargets(s, r.bind(a, s, t, i))
			},
			invokeByType : function (t, n, i) {
				var o = e("iris/invocation"),
				s = {
					type : n
				};
				o.queryTargets(s, r.bind(a, s, t, i))
			},
			closeChildCard : function () {
				var t = e("iris/invocation");
				s && i(s, "", f, "") ? t.closeChildCard() : console.warn("Ignoring attempt to close child card when no child card has finished being invoked, or card already closed, or target not whitelisted for closure.")
			},
			invokePlatformMenuItem : function (t, n, i) {
				var r = {};
				r.action = t,
				r.target = n.target,
				p.forEach(function (e) {
					e in n && "empty" !== n[e] ? r[e] = n[e] : !(e in n) && e in i && (r[e] = i[e])
				}),
				r.mime && (r.type = r.mime, delete r.mime),
				e("iris/invocation").invoke(r)
			}
		},
		n.exports = a
	}), define("iris/it.policy", function (e, t, n) {
		function i() {
			a = !d.isWorkBrowser(),
			o = !1,
			s = void 0
		}
		function r(e) {
			d.isWorkBrowser() && (a || "1" !== e.policy.policy_enable_devmode_workspace ? a && "0" === e.policy.policy_enable_devmode_workspace && (a = !1, l.emit("it.policy.enableDevModeWorkspace", [!1])) : (a = !0, l.emit("it.policy.enableDevModeWorkspace", [!0])), s = e.policy.policy_work_space_browser_home_page),
			(d.isWorkBrowser() || "1" === e.policy.policy_corporate_liable) && (o || "1" !== e.policy.policy_block_browser_persistent_storage ? o && "0" === e.policy.policy_block_browser_persistent_storage && (o = !1, l.emit("it.policy.blockPersistentStorage", [!1])) : (o = !0, l.emit("it.policy.blockPersistentStorage", [!0])))
		}
		var a,
		o,
		s,
		c,
		l = e("iris/event"),
		d = e("iris/utils"),
		u = e("iris/pps"),
		m = e("iris/on.demand");
		c = {
			init : function () {
				var e;
				i(),
				e = d.isWorkBrowser() ? u.create("/pps/system/perimeter/settings/1000-enterprise/policy", u.PPSMode.FULL) : u.create("/pps/system/perimeter/settings/1000-personal/policy", u.PPSMode.FULL);
				try {
					e.open(u.FileMode.RDONLY) && (r(e.data), e.onNewData = r)
				} catch (t) {
					console.log("Error: " + t.message + " " + t.stack)
				}
			},
			isBlockPersistentStorage : function () {
				return o
			},
			isEnabledDevModeWorkspace : function () {
				return a
			},
			getSpecifiedHomePage : function () {
				return s
			},
			updatePolicyFromPPS : r,
			setITPoliciesToDefault : i
		},
		m.wrapModule(c, c.init),
		n.exports = c
	}), define("iris/job.runner", function (e, t, n) {
		var i;
		i = {
			createParallel : function (e) {
				var t = 0,
				n = [],
				i = !1,
				r = !1;
				return e && n.push(e), {
					addJob : function (e) {
						if (r && console.log("job added to an already complete job runner"), i)
							throw Error("Cannot addJob, job.runner cancelled");
						t++,
						e && e()
					},
					jobComplete : function (e) {
						if (r && console.log("job completed on an already complete job runner"), !i && (t--, e && n.push(e), 0 === t)) {
							var a;
							for (r = !0; a = n.shift(); )
								a()
						}
					},
					cancel : function () {
						i = !0,
						n = void 0
					},
					isJobCompleted : function () {
						return 0 === t
					}
				}
			}
		},
		n.exports = i
	}), define("iris/just.type", function (e, t, n) {
		function i(e) {
			return e && e.character && (-1 !== l.indexOf(e.character) || m === e.character || (u === e.character || d === e.character) && "INPUT" !== document.activeElement.tagName) ? !0 : !1
		}
		function r() {
			return e("plugins/tabbar/index").isShowing() || e("plugins/overflowmenu/index").visibleMenu() || e("plugins/contextmenu/index").isMenuVisible() || e("plugins/screens/selectmore/index").isVisible()
		}
		function a(e, t) {
			t && t.character && "KeyDown" === t.eventType && s.length && !r() && !i(t) && (s[s.length - 1].justTypeFocus && s[s.length - 1].justTypeFocus(), s[s.length - 1] !== document.activeElement && s[s.length - 1].focus())
		}
		var o,
		s = [],
		c = e("iris/event"),
		l = [61524, 61522, 61521, 61523],
		d = 61453,
		u = 61467,
		m = 61543;
		o = {
			type : function (e) {
				if (s.length) {
					if (-1 !== s.indexOf(e))
						return console.warn("Trying to just.type a duplicate elt. Suppressing"), void 0
				} else
					c.on("InputNotificationKeyEvent", a, [iris.chromeId]);
				s.push(e)
			},
			untype : function (e) {
				var t = s.lastIndexOf(e);
				-1 !== t && (s.splice(t, 1), s.length || c.un("InputNotificationKeyEvent", a))
			}
		},
		n.exports = o
	}), define("iris/keyboard.focus", function (e, t, n) {
		function i() {
			var t = o.blockList();
			"screen" === t[t.length - 1] && e("screen/manager").currentScreen() === e("plugins/screens/reader/index") && s.setReaderFocus()
		}
		function r(e) {
			g || e && qnx.callExtensionMethod("application.setKeyboardFocus", e)
		}
		function a() {
			var e = Object.keys(p);
			return 1 === e.length ? window.parseInt(e[0], 10) : void 0
		}
		var o,
		s,
		c = e("iris/event"),
		l = e("iris/screen"),
		d = e("iris/tabs/controller"),
		u = [{
				event : "manager.screen",
				filterParams : [c.FILTER_ANY, "pushed"],
				name : "screen",
				allowMultipleEvents : !0
			}, {
				event : "dialogs.showing",
				name : "dialogs"
			}, {
				event : "manager.view",
				filterParams : [e("plugins/views/new_tab_page/index"), "added"],
				name : "new_tab_page"
			}, {
				event : "application.inactive",
				name : "application"
			}, {
				event : "navbar.url.focus",
				name : "navbarFocus"
			}, {
				event : "tabbar.showing",
				name : "tabbar"
			}, {
				event : "screen.menu.showing",
				name : "overflowmenu"
			}, {
				event : "find_on_page.show",
				name : "findOnPage"
			}
		],
		m = [{
				event : "manager.screen",
				filterParams : [c.FILTER_ANY, "unloadTransitionEnd"],
				name : "screen"
			}, {
				event : "dialogs.hidden",
				name : "dialogs"
			}, {
				event : "manager.view",
				filterParams : [e("plugins/views/new_tab_page/index"), "unloadTransitionEnd"],
				name : "new_tab_page"
			}, {
				event : "application.active",
				name : "application"
			}, {
				event : "navbar.url.focus.out",
				name : "navbarFocus"
			}, {
				event : "tabbar.hidden",
				name : "tabbar"
			}, {
				event : "screen.menu.hidden",
				name : "overflowmenu"
			}, {
				event : "find_on_page.remove",
				name : "findOnPage"
			}
		],
		f = [{
				event : "navigationbar.buttonClick",
				filterParams : ["stop"]
			}, {
				event : "application.stateChange",
				filterParams : ["fullscreen"]
			}, {
				event : "navbar.touchend"
			}, {
				event : "invocation.childCardClosed"
			}, {
				event : "tabbar.hidden"
			}, {
				event : "infobar.removed"
			}, {
				event : "navigationbar.buttonClick",
				filterParams : ["back"]
			}
		],
		p = {},
		g = 0;
		s = {
			setChromeFocus : function () {
				s.setWebviewFocus(iris.chromeId)
			},
			setTabFocus : function () {
				s.setWebviewFocus(d.getSelected().webviewId)
			},
			setReaderFocus : function () {
				s.setWebviewFocus(e("plugins/screens/reader/index").getId())
			},
			setWebviewFocus : function (t) {
				if (a() !== t) {
					if (t !== iris.chromeId && e("plugins/contextmenu/index").isMenuVisible())
						return;
					t === iris.chromeId && d.getAll().length > 0 && d.getSelected().webviewId && qnx.callExtensionMethod("webview.cancelContextMenu", d.getSelected().webviewId, "HideTSM"),
					r(l.getHandle(t))
				}
			},
			isChromeFocused : function () {
				return a() === iris.chromeId
			},
			isTabbarFocused : function () {
				return a() === e("plugins/tabbar/index").tabbarId()
			},
			isReaderFocused : function () {
				return a() === e("plugins/screens/reader/index").getId()
			},
			isTabFocused : function () {
				return !(s.isChromeFocused() || s.isTabbarFocused() || s.isReaderFocused() || !d.getTabForWebviewId(a()))
			},
			getFocusedWebviewId : a
		},
		c.on("Focus", function (e, t) {
			t = JSON.parse(t);
			var n = a();
			t.isFocused ? p[e] = !0 : t.isFocused || delete p[e],
			n !== a() && c.emit("keyboard.focus.changed")
		}),
		c.on("Destroyed", function (e) {
			delete p[e]
		}),
		c.on("ProcessCrash", function () {
			p = {}

		}),
		c.on("InputNotificationFocusEvent", function (e, t) {
			e === iris.chromeId && t.focused && !s.isChromeFocused() && s.setChromeFocus()
		}),
		c.on("invocation.childCardOpened", function () {
			g++
		}),
		c.on("invocation.childCardClosed", function () {
			g--,
			0 > g && (console.error("Not good. We think there are negative child cards open. Keyboard Focus may be unreliable. Setting to 0."), g = 0)
		}),
		o = e("iris/blocker").createBlocker("keyboard.focus", u, m, s.setChromeFocus, s.setTabFocus, f, i),
		n.exports = s
	}), define("iris/keyboard", function (e, t, n) {
		function i(e) {
			a.emit(e, [o, s], !0)
		}
		var r,
		a = e("iris/event"),
		o = 0,
		s = "closed",
		c = !0;
		r = {
			currentPosition : function () {
				return o
			},
			currentState : function () {
				return s
			},
			setPosition : function (e) {
				o = e,
				i("keyboard.position")
			},
			setState : function (e) {
				i("keyboard." + e),
				s !== e && (s = e, s === r.CLOSED ? (c = !0, a.emit("keyboard.hidden", [], !0)) : c && s !== r.CLOSED && (c = !1, a.emit("keyboard.visible", [], !0)))
			},
			OPENING : "opening",
			OPENED : "opened",
			CLOSING : "closing",
			CLOSED : "closed"
		},
		n.exports = r
	}), define("iris/menu.service", function (e, t, n) {
		function i() {
			var e = d++;
			return window.isFinite(e) || (d = 0, e = 0),
			"" + e
		}
		function r() {
			for (var e in l)
				l[e](null, s.MENU_SERVICE_FAILURE_ERROR);
			l = {}

		}
		function a(e) {
			var t = e.control;
			if ("getMenuItems" === t.res) {
				var n = t.id,
				i = l[n];
				delete l[n],
				i && i(t.dat, t.err)
			} else
				r()
		}
		var o,
		s,
		c = e("iris/pps"),
		l = {},
		d = 0;
		s = {
			MENU_INVALID_REQUEST_ERROR : "MENU_INVALID_REQUEST_ERROR",
			MENU_SERVICE_FAILURE_ERROR : "MENU_SERVICE_FAILURE_ERROR",
			init : function () {
				o = c.create("/pps/services/menu/control", c.PPSMode.FULL),
				o.onNewData = a,
				o.onReadFailed = r,
				o.onClosed = r,
				o.open(c.FileMode.RDWR)
			},
			getMenuItems : function (e, t) {
				var n = i();
				t && (l[n] = t),
				e["supports-inherited"] = !0,
				o.write({
					msg : "getMenuItems",
					id : n,
					dat : e
				}) || (delete l[n], t(null, s.MENU_SERVICE_FAILURE_ERROR))
			}
		},
		e("iris/on.demand").wrapModule(s, s.init),
		n.exports = s
	}), define("iris/mixedContent", function (e, t, n) {
		function i(e, t) {
			d = d.filter(function (n) {
					return n.domain !== t || n.webviewId !== e
				})
		}
		function r(t, n) {
			qnx.callExtensionMethod("webview.setMixedContentPolicy", t, n, "MixedContentAllowAll"),
			i(t, n),
			e("iris/tabs/controller").reloadSelected()
		}
		function a(t) {
			var n,
			i = e("screen/manager");
			n = i.loadScreen("mixed_contents_risks"),
			n.setContext(t),
			i.pushScreen(n)
		}
		function o(t, n) {
			s || (c.on("LocationChange", function (e) {
					d = d.filter(function (t) {
							return t.webviewId !== e
						})
				}), s = !0);
			var o = qnx.callExtensionMethod("webview.mixedContentPolicy", t, n.host);
			if ("MixedContentAllowAll" !== o && ("MixedContentAllowPassive" !== o || "ContentPassive" !== n.contentType)) {
				for (var u = 0; d.length > u; u++)
					if (d[u].domain === n.host && d[u].webviewId === t)
						return;
				var m = e("iris/tabs/controller").getTabForWebviewId(t);
				if (m) {
					var f = e("plugins/infobartender/index").createInfoBar(m.id, function () {
							return l.translate(66)
						}, function () {
							return l.translate(67)
						}, r.bind(this, t, n.host), i.bind(this, t, n.host), function () {
							return l.translate(68)
						}, a.bind(this, n.host));
					d.push({
						domain : n.host,
						id : m.id,
						webviewId : t,
						infobar : f
					})
				}
			}
		}
		var s,
		c = e("iris/event"),
		l = e("iris/i18n"),
		d = [];
		c.on("MixedContentDetected", o),
		n.exports.hasNoExports = !0
	}), define("iris/native", function (e, t, n) {
		n.exports = {
			error : function (e) {
				console.error("Native Error: " + e)
			}
		}
	}), define("iris/nfc", function (e, t, n) {
		function i(e) {
			var t = URI(e.url);
			switch (t.scheme()) {
			case "http":
			case "https":
			case "ftp":
			case "rtsp":
			case "data":
				return s > e.url.length;
			default:
				return !1
			}
		}
		var r,
		a = e("iris/event"),
		o = e("iris/tabs/controller"),
		s = 8192;
		r = {
			init : function () {
				qnx.callExtensionMethod("nfc.start")
			},
			onNdefPushEvent : function () {
				var e = o.getSelected();
				i(e) ? qnx.callExtensionMethod("nfc.pushNdefMessage", e.url, o.hasNetworkError(e.id) ? "" : e.getTitle()) : qnx.callExtensionMethod("nfc.ignoreNdefPushEvent")
			}
		},
		e("iris/error").wrapAll(r, "nfc."),
		a.on("browser.init.tier3", r.init),
		n.exports = r
	}), define("iris/notification", function (e, t, n) {
		function i() {
			var e = d++;
			return window.isFinite(e) || (d = 0, e = 0),
			"" + e
		}
		function r(e) {
			var t = e.control,
			n = t.res,
			i = t.id,
			r = l[i];
			"notify" === n && (t.err || "ok" !== t.dat && r.errorCallback ? r.errorCallback() : r.showCallback && r.showCallback(), delete l[i])
		}
		function a() {
			o || (o = c.create("/pps/services/notify/control", c.PPSMode.FULL), o.open(c.FileMode.RDWR), o.onNewData = r)
		}
		var o,
		s,
		c = e("iris/pps"),
		l = {},
		d = 0;
		s = {
			notify : function (e, t, n) {
				a();
				var r = i();
				l[r] = {
					showCallback : t,
					errorCallback : n
				},
				o.write({
					msg : "notify",
					id : r,
					dat : e
				})
			},
			cancel : function (e) {
				a();
				var t = {
					msg : "cancel",
					id : i()
				};
				e && (t.dat = e),
				o.write(t)
			},
			"delete" : function (e) {
				a();
				var t = {
					msg : "delete",
					id : i()
				};
				e && (t.dat = e),
				o.write(t)
			}
		},
		n.exports = s
	}), define("iris/on.demand", function (e, t, n) {
		function i(e, t) {
			for (var n in t)
				e[n] = t[n]
		}
		function r(e, t, n, r) {
			return i(e, r),
			e[t] !== n && n(),
			e[t].apply(this, Array.prototype.splice.call(arguments, 4))
		}
		var a;
		a = {
			wrapModule : function (e, t, n) {
				n = n || [];
				var i = {};
				for (var a in e)
					"function" == typeof e[a] && -1 === n.indexOf(a) && (i[a] = e[a], e[a] = r.bind(this, e, a, t, i))
			}
		},
		n.exports = a
	}), define("iris/peek", function (e, t, n) {
		function i() {
			var e,
			t = [],
			n = [];
			this.setNewPosition = function (i, r) {
				0 !== t.length && (b >= Math.abs(t[t.length - 1] - i) || b >= Math.abs(n[n.length - 1] - r)) || (2 == t.length && (t.shift(), n.shift()), t.push(i), n.push(r), e = window.performance.now())
			},
			this.swipeDirection = function () {
				if (2 != t.length)
					return void 0;
				var i = t[1] - t[0],
				r = n[1] - n[0],
				a = window.performance.now() - e,
				o = i / a,
				s = r / a;
				return Math.abs(o) > h || Math.abs(s) > h ? Math.abs(o) > Math.abs(s) ? o > 0 ? this.RIGHT : this.LEFT : s > 0 ? this.UP : this.DOWN : void 0
			},
			this.resetSwipeDetection = function () {
				t = [],
				n = [],
				e = void 0
			},
			this.LEFT = "left",
			this.RIGHT = "right",
			this.UP = "up",
			this.DOWN = "down"
		}
		function r() {
			return f.isVisible() || p.enteringMultiSelect()
		}
		var a,
		o = e("iris/event"),
		s = e("iris/screen"),
		c = e("iris/windowAnimations"),
		l = e("plugins/tabbar/index"),
		d = e("screen/manager"),
		u = e("ui/animationTimings"),
		m = e("ui/utils"),
		f = e("plugins/screens/selectmore/index"),
		p = e("iris/touch"),
		g = !1,
		h = .05,
		v = 10,
		b = 4;
		a = {
			createSwipeDetector : function () {
				return new i
			},
			createPeeker : function (e, t, n, i) {
				var s,
				c,
				l,
				d,
				u,
				f,
				p = !1,
				h = a.createSwipeDetector(),
				E = function (e) {
					if (s) {
						var i = m.screenPointFromEvent(e);
						if (!i || r())
							return;
						c = Math.max(i.x - s, 0),
						!p && !l && c >= v && (t(), o.emit("peek.start", [], !0), g = !0, p = !0),
						p && ((!u || Math.abs(u - c) >= b || b >= c) && (d || (f = window.webkitRequestAnimationFrame(function () {
											d(),
											d = void 0
										})), d = n.bind(this, c), u = c), h.setNewPosition(i.x, i.y), e.preventDefault())
					}
				},
				w = function (e) {
					if (p) {
						var t = m.screenPointFromEvent(e);
						if (!t)
							return;
						e.preventDefault(),
						e.stopPropagation();
						var n,
						r = h.swipeDirection(),
						a = r === h.LEFT || r === h.RIGHT;
						n = a ? r === h.RIGHT : t.x > screen.width / 2,
						i(t.x, n),
						o.emit("peek.end", [], !0),
						g = !1
					}
					window.webkitCancelAnimationFrame(f),
					d = void 0,
					u = void 0,
					s = void 0,
					p = !1,
					document.removeEventListener("mousemove", E),
					document.removeEventListener("mouseup", w),
					document.removeEventListener("touchmove", E),
					document.removeEventListener("touchend", w),
					document.removeEventListener("touchcancel", w)
				},
				T = function (e) {
					var t = m.screenPointFromEvent(e);
					t && !r() && (s = t.x, l = !1, document.addEventListener("mousemove", E), document.addEventListener("touchmove", E), document.addEventListener("mouseup", w), document.addEventListener("touchend", w), document.addEventListener("touchcancel", w))
				};
				return e.addEventListener("mousedown", T),
				e.addEventListener("touchstart", T),
				o.on("touch.multitouch", function () {
					d = void 0,
					u = void 0,
					s = void 0,
					p = !1,
					document.removeEventListener("mousemove", E),
					document.removeEventListener("mouseup", w),
					document.removeEventListener("touchmove", E),
					document.removeEventListener("touchend", w),
					document.removeEventListener("touchcancel", w)
				}),
				function () {
					l = !0
				}
			},
			setHomePeek : function (t, n, i) {
				if (!(!n || n.preventPeek && n.preventPeek())) {
					var r,
					m = function () {
						d.startDragScreen(n),
						l.setState(l.STATES.PREVIEW);
						var t = l.visibleWidth();
						i.actionBar.animateIn(0);
						var r = s.getHandle(e("iris/tabs/controller").getSelected().webviewId);
						r && c.animateWindowLocation(r, "Linear", 0, t, 0, t, 0)
					},
					f = function (e) {
						var t = l.visibleWidth(),
						a = Math.min(e, t);
						if (a != r) {
							var o = s.getHandle(iris.chromeId);
							c.animateWindowLocation(o, "Linear", 0, a, 0, a, 0),
							r = a
						}
						d.dragScreen(n, i, Math.max(e - t, 0))
					},
					p = function (t, a) {
						if (d.endDragScreen(n, i, t, a), l.setState(l.STATES.CLOSED), a)
							l.setPosition(r), l.previewMode();
						else {
							var o = s.getHandle(iris.chromeId),
							m = [o, r, 0, 0, 0],
							f = s.getHandle(e("iris/tabs/controller").getSelected().webviewId);
							f && (m = m.concat([f, r, 0, 0, 0]));
							var p = u.getTiming(u.INCOMING_PAGE, t);
							c.animateWindowLocations("EaseOutCurve", p / 1e3, m)
						}
						r = void 0
					},
					g = a.createPeeker(t, m, f, p);
					o.on("screen.contextMenu.becomingVisible", g),
					o.on("scroll.detector.start", g),
					o.on("tooltip.bar.visible", g),
					o.on("backforwardlist.show", g)
				}
			},
			setContentPeek : function (e, t) {
				if (!t.preventPeek || !t.preventPeek()) {
					var n,
					i = function () {
						d.startDragScreen(t),
						n = d.screenBelow(t),
						n.actionBar.animateIn(0)
					},
					r = function (e) {
						d.dragScreen(t, n, e, 0)
					},
					s = function (e, i) {
						d.endDragScreen(t, n, e, i)
					},
					c = a.createPeeker(e, i, r, s);
					o.on("screen.contextMenu.becomingVisible", c),
					o.on("scroll.detector.start", c)
				}
			},
			isPeeking : function () {
				return g
			}
		},
		o.on("manager.screen", function (e, t) {
			if ("screenLoaded" === t || "sheetLoaded" === t) {
				var n = d.domElementForScreen(e);
				a.setContentPeek(n, e)
			}
		}),
		n.exports = a
	}), define("iris/permissions", function (e, t, n) {
		function i(e, t) {
			console.log(t.message)
		}
		function r(e) {
			e.executeSql("CREATE TABLE permissions(id INTEGER PRIMARY KEY AUTOINCREMENT, site TEXT, type TEXT, allow INTEGER);", [], null, i)
		}
		function a(e, t, n) {
			for (var i = Array(t.rows.length), r = 0; t.rows.length > r; r++)
				i[r] = t.rows.item(r);
			n(i)
		}
		function o(e, t, n) {
			t.rows.length > 0 ? n(t.rows.item(0).allow) : n(void 0)
		}
		function s(e, t, n, r) {
			e.executeSql("UPDATE permissions SET allow = ? WHERE id = ?;", [n.allow, t], function (e, t) {
				r && r(t.rowsAffected)
			}, i)
		}
		function c(e, t, n, r) {
			0 === t.rows.length ? e.executeSql("INSERT INTO permissions (site, type, allow) values(?, ?, ?);", [n.site, n.type, n.allow], function (e, t) {
				r && r(t.rowsAffected)
			}, i) : s(e, t.rows.item(0).id, n, r)
		}
		var l,
		d,
		u,
		m,
		f = e("iris/i18n"),
		p = e("iris/on.demand");
		m = {
			type : {
				GEOLOCATION : "Location",
				POPUPS : "Popups",
				USER_MEDIA : "UserMedia",
				NOTIFICATION : "Notification"
			},
			typeToDisplayName : function (e) {
				switch (e) {
				case m.type.GEOLOCATION:
					return f.translate(69);
				case m.type.POPUPS:
					return f.translate(70);
				case m.type.USER_MEDIA:
					return f.translate(71);
				case m.type.NOTIFICATION:
					return f.translate(72)
				}
				throw Error("Untranslated permission type")
			},
			init : function (e, t) {
				d = e ? e : "permissions";
				var n = "";
				u = t ? t : "Site Permissions";
				var i = 10485760;
				l = window.openDatabase(d, n, u, i),
				"" === l.version && l.changeVersion("", "1.0", r)
			},
			wipe : function (e) {
				l.transaction(function (t) {
					t.executeSql("DELETE FROM permissions;", [], function (t, n) {
						e && e(n.rowsAffected)
					}, i)
				})
			},
			getSites : function (e) {
				l.transaction(function (t) {
					t.executeSql("SELECT DISTINCT site FROM permissions", [], function (t, n) {
						a(t, n, e)
					}, i)
				})
			},
			getPermissions : function (e, t) {
				l.transaction(function (n) {
					n.executeSql("SELECT type, allow FROM permissions WHERE site = ?", [e], function (e, n) {
						a(e, n, t)
					}, i)
				})
			},
			isAllowed : function (e, t, n) {
				l.transaction(function (r) {
					r.executeSql("SELECT allow FROM permissions WHERE site = ? AND type = ?", [e, t], function (e, t) {
						o(e, t, n)
					}, i)
				})
			},
			add : function (e, t) {
				l.transaction(function (n) {
					n.executeSql("SELECT id FROM permissions WHERE site = ? AND type = ?", [e.site, e.type], function (n, i) {
						c(n, i, e, t)
					}, i)
				})
			},
			removePermission : function (e, t, n) {
				l.transaction(function (r) {
					r.executeSql("DELETE FROM permissions WHERE site = ? AND type = ?", [e, t], function (e, t) {
						n && n(t.rowsAffected)
					}, i)
				})
			},
			removeSite : function (e, t) {
				l.transaction(function (n) {
					n.executeSql("DELETE FROM permissions WHERE site = ?", [e], function (e, n) {
						t && t(n.rowsAffected)
					}, i)
				})
			}
		},
		p.wrapModule(m, m.init, ["typeToDisplayName"]),
		n.exports = m
	}), define("iris/popupUnblocker", function (e, t, n) {
		function i(t, n) {
			m = m.filter(function (i) {
					return i.domain == n && i.webviewId != t && e("plugins/infobartender/index").removeInfoBar(i.id, i.infobar),
					i.domain !== n
				})
		}
		function r(e, t) {
			u.add({
				site : t,
				type : u.type.POPUPS,
				allow : 1
			}),
			i(e, t)
		}
		function a(e, t) {
			i(e, t)
		}
		function o(t, n, i) {
			qnx.callExtensionMethod("webview.openWindowResponse", t, i, -1),
			s || (l.on("LocationChange", function (e) {
					m = m.filter(function (t) {
							return t.webviewId !== e
						})
				}), s = !0);
			for (var o = 0; m.length > o; o++)
				if (m[o].domain === n && m[o].webviewId === t)
					return;
			var c = e("iris/tabs/controller").getTabForWebviewId(t);
			if (c) {
				var u = e("plugins/infobartender/index").createInfoBar(c.id, function () {
						return d.translate(73, n)
					}, function () {
						return d.translate(50)
					}, r.bind(this, c.webviewId, n), a.bind(this, c.webviewId, n));
				m.push({
					domain : n,
					id : c.id,
					webviewId : t,
					infobar : u
				})
			}
		}
		var s,
		c,
		l = e("iris/event"),
		d = e("iris/i18n"),
		u = e("iris/permissions"),
		m = [];
		c = {
			checkPermissions : function (e, t, n, i) {
				var r = qnx.callExtensionMethod("application.getRegisteredDomain", URI(n.openerFrameUrl).hostname());
				r || (r = URI(n.openerFrameUrl).hostname()),
				u.isAllowed(r, u.type.POPUPS, function (a) {
					a ? l.emit(e, [t, n, i], !0) : o(t, r, n.waitHandle)
				})
			}
		},
		n.exports = c
	}), define("iris/popups", function (e, t, n) {
		function i() {
			e("plugins/tabbar/index").endDrag(),
			e("plugins/tabbar/index").hide(),
			e("plugins/contextmenu/index").hideContextMenu(),
			e("plugins/overflowmenu/index").hideMenu(),
			e("iris/fullscreen").enableSwipeDownHandling(!1)
		}
		function r(e, t, n, i, r) {
			u.setViewportAndCallBackAsNeeded(c, 0, 0, t || screen.width, n || screen.height, r)
		}
		function a(t) {
			var n = qnx.callExtensionMethod("webview.applicationWindowGroup", iris.chromeId);
			return c = parseInt(qnx.callExtensionMethod("webview.create", n, 1), 10),
			d.once("Created", function () {
				d.emit("webview.created", [c], !0),
				qnx.callExtensionMethod("webview.setBackgroundColor", c, 0),
				qnx.callExtensionMethod("webview.setDevicePixelRatio", c, 1),
				r(),
				PUBLIC_BUILD && qnx.callExtensionMethod("webview.setAllowWebInspection", iris.chromeId, c, !1),
				u.addWebview(c, function () {
					return c
				}, r),
				qnx.callExtensionMethod("webview.setPopupWebView", t, c),
				e("iris/device").spatialNavigationEnabled() && qnx.callExtensionMethod("webview.setEnableSpatialNavigation", c, !0),
				d.once("DocumentLoadFinished", function () {
					qnx.callExtensionMethod("webview.setZOrder", c, f),
					qnx.callExtensionMethod("webview.setActive", c, !0),
					qnx.callExtensionMethod("webview.setVisible", c, !0)
				}, [c])
			}, [c]),
			c
		}
		function o() {
			e("iris/fullscreen").enableSwipeDownHandling(!0),
			c && (qnx.callExtensionMethod("webview.setZOrder", c, -1), u.removeWebview(c), qnx.callExtensionMethod("webview.destroy", c), d.emit("webview.destroyed", [c], !0))
		}
		function s() {
			d.on("OpenWindow", function (e, t, n) {
				"CREATE" === t.action && t.isPopup && (a(e, t), n.setAction = "DISCARD", m.preventUserInteraction(), i(), d.once("Focus", function (e) {
						console.log("popup focus"),
						e === c && (m.allowUserInteraction(), i())
					}, [c]))
			}),
			d.on("CloseWindow", o),
			d.on("Destroyed", function (e) {
				e === c && (qnx.callExtensionMethod("webview.delete", c), c = void 0)
			}),
			d.on("ProcessCrash", function () {
				c && (u.removeWebview(c), c = void 0)
			})
		}
		var c,
		l,
		d = e("iris/event"),
		u = e("iris/rotation.helper"),
		m = e("ui/utils"),
		f = 5;
		l = {
			getId : function () {
				return c
			}
		},
		d.on("browser.init.tier3", s),
		n.exports = l
	}), define("iris/pps", function (e, t, n) {
		n.exports = window.wp.core.pps
	}), define("iris/preloadImages", function (e, t, n) {
		var i,
		r = e("iris/event");
		i = {
			preload : function () {
				var e = document.createDocumentFragment(),
				t = document.createElement("div");
				t.style.backgroundImage = "url('assets/av_default_bookmark_grid_dark.png')",
				e.appendChild(t);
				var n = document.createElement("div");
				n.style.backgroundImage = "url('assets/av_default_bookmark_list_dark.png')",
				e.appendChild(n);
				var i = document.createElement("div");
				i.style.backgroundImage = "url('assets/av_default_history_list_dark.png')",
				e.appendChild(i),
				document.getElementById("preload-image-area").appendChild(e)
			}
		},
		r.on("browser.init.tier3", i.preload),
		n.exports = i
	}), define("iris/privatebrowsing", function (e, t, n) {
		var i,
		r,
		a = e("iris/event"),
		o = e("iris/settings"),
		s = e("iris/tabs/controller"),
		c = e("iris/tabs/session"),
		l = e("iris/downloads"),
		d = e("iris/utils"),
		u = e("plugins/views/new_tab_page/index");
		r = {
			startPrivateBrowsing : function () {
				i = !0,
				c.save(),
				s.removeAllTabs(),
				s.create({
					selected : !0,
					url : s.newTabUrl()
				}),
				document.getElementById("nav-bar-private-underlay").style.opacity = "0.3",
				document.getElementById("mini-bar-private-underlay").style.opacity = "0.3",
				u.togglePrivateBrowsing(!0)
			},
			endPrivateBrowsing : function () {
				i = !1,
				l.exitPrivateBrowsing(),
				s.removeAllTabs();
				var e = c.get();
				e && e.length > 0 ? e.forEach(function (e) {
					e.selected || (e.webviewId = void 0),
					s.create(e)
				}) : s.create({
					selected : !0,
					url : d.getHomePageUrl()
				}),
				document.getElementById("nav-bar-private-underlay").style.opacity = "0",
				document.getElementById("mini-bar-private-underlay").style.opacity = "0",
				u.togglePrivateBrowsing(!1)
			},
			init : function () {
				a.on("it.policy.blockPersistentStorage", function (e) {
					o.setValue(o.ENABLE_PRIVATE_BROWSING, e),
					e && !i ? r.startPrivateBrowsing() : !e && i && r.endPrivateBrowsing()
				}),
				e("iris/it.policy").isBlockPersistentStorage() && (o.setValue(o.ENABLE_PRIVATE_BROWSING, !0), r.startPrivateBrowsing())
			}
		},
		a.on("browser.init.tier2", r.init),
		n.exports = r
	}), define("iris/property.manager", function (e, t, n) {
		var i = e("iris/event"),
		r = /^Property(.*)Event$/,
		a = {},
		o = [],
		s = {},
		c = JSON.parse(qnx.callExtensionMethod("webview.eventNames", 1)),
		l = {
			AddSearchProviderRequest : !0,
			CaptureContents : !0,
			ChooseFile : !0,
			CloseWindow : !0,
			ContentRendered : !0,
			ContextMenuCallback : !0,
			ContextMenuCallbacksSupported : !0,
			ContextMenuCancelEvent : !0,
			ContextMenuRequestEvent : !0,
			Destroyed : !0,
			DialogRequested : !0,
			DocumentLoadCommitted : !0,
			DocumentLoadFinished : !0,
			DownloadContentType : !0,
			DownloadFinished : !0,
			DownloadProgress : !0,
			DownloadRequest : !0,
			DownloadStarted : !0,
			FindString : !0,
			Focus : !0,
			FormAutofillRequestEvent : !0,
			FormControlEvent : !0,
			FullScreenEnter : !0,
			FullScreenExit : !0,
			FullScreenVideoEnded : !0,
			FullScreenVideoStarted : !0,
			GeolocationPermissionRequest : !0,
			InputNotificationFocusEvent : !0,
			InputNotificationKeyEvent : !0,
			InvokeRequestEvent : !0,
			JavaScriptCallback : !0,
			LocationChange : !0,
			MixedContentDetected : !0,
			NetworkError : !0,
			NotificationCancel : !0,
			NotificationPermissionCheck : !0,
			NotificationPermissionRequest : !0,
			NotificationShow : !0,
			OpenWindow : !0,
			PropertyChanged : !0,
			ProtocolHandler : !0,
			SSLHandshakingFailed : !0,
			ScrollTriggerBoxDirectionChanged : !0,
			UnhandledKeyInput : !0,
			UnknownProtocol : !0,
			UserMediaRequest : !0
		},
		d = {
			CanGoBack : !0,
			CanGoForward : !0,
			CurrentContext : !0,
			Favicon : !0,
			FileSystemAPISandboxed : !0,
			LoadProgress : !0,
			Location : !0,
			ScreenReaderEnabled : !0,
			SecurityInfo : !0,
			Title : !0,
			Viewport : !0,
			Visible : !0
		},
		u = function (e, t) {
			o.forEach(function (n) {
				qnx.callExtensionMethod("webview.setPropertyChangedEventEnabled", n, e, t)
			})
		},
		m = function (e) {
			var t = r.exec(e);
			if (!t)
				return "Created" != e && c[e] && (s[e] = !0, l[e] ? delete l[e] : o.forEach(function (t) {
						qnx.callExtensionMethod("webview.setWebEventEnabled", t, e, !0)
					})), void 0;
			var n = t[1];
			n && (a[n] = !0, d[n] ? delete d[n] : u(n, !0))
		},
		f = function (e) {
			var t = r.exec(e);
			if (!t)
				return c[e] && (o.forEach(function (t) {
						qnx.callExtensionMethod("webview.setWebEventEnabled", t, e, !1)
					}), delete s[e]), void 0;
			var n = t[1];
			n && (delete a[n], u(n, !1))
		},
		p = function (e) {
			o.push(e),
			qnx.callExtensionMethod("webview.setAllPropertyChangedEventsEnabled", e, !1),
			qnx.callExtensionMethod("webview.setWebEventEnabled", e, "PropertyChanged", !0);
			var t = Object.keys(d).concat(Object.keys(a));
			qnx.callExtensionMethod("webview.setPropertyChangedEventsEnabled", e, JSON.stringify(t));
			var n = Object.keys(l).concat(Object.keys(s));
			qnx.callExtensionMethod("webview.setWebEventsEnabled", e, JSON.stringify(n))
		},
		g = function (e) {
			o.splice(o.indexOf(e), 1)
		};
		p(iris.chromeId),
		i.on("event.type.added", m),
		i.on("event.type.removed", f),
		i.on("webview.created", p),
		i.on("webview.destroyed", g),
		n.exports.hasNoExports = !0
	}), define("iris/protocolHandler", function (e, t, n) {
		function i(e, t) {
			f.toLocal(d + e, JSON.stringify(t))
		}
		function r(e) {
			return f.fromLocal(d + e, null)
		}
		function a(t, n) {
			var r = e("iris/tabs/controller").getTabForWebviewId(t);
			r && e("plugins/infobartender/index").createInfoBar(r.id, function () {
				return m.translate(74, n.title, n.scheme)
			}, function () {
				return m.translate(50)
			}, i.bind(l, n.scheme, {
					baseURL : n.baseURL,
					url : n.url,
					title : n.title,
					isAllowed : !0
				}), i.bind(l, n.scheme, {
					baseURL : n.baseURL,
					url : n.url,
					title : n.title,
					isAllowed : !1
				}))
		}
		function o() {
			for (var e = localStorage.length - 1; e >= 0; e--) {
				var t = localStorage.key(e);
				"string" == typeof t && 0 === t.indexOf(d) && localStorage.removeItem(t)
			}
		}
		function s(e, t, n) {
			switch (t.protocolHandlerType) {
			case "Register":
				null === r(t.scheme) && a(e, t);
				break;
			case "Unregister":
				null !== r(t.scheme) && i(t.scheme, null);
				break;
			case "IsRegistered":
				n.setResult = "New";
				var o = r(t.scheme);
				null !== o && (n.setResult = o.isAllowed ? "Registered" : "Declined"),
				"Declined" === n.setResult && (t.title = o.title, a(e, t));
				break;
			default:
				return
			}
		}
		function c(e, t, n) {
			var i = JSON.parse(t),
			a = r(i.scheme);
			a && a.isAllowed && (n.setProtocolHandlerURL = a.url.replace("%s", i.url))
		}
		var l,
		d = "customerProtocolHandler.",
		u = e("iris/event"),
		m = e("iris/i18n"),
		f = e("iris/utils");
		l = {
			init : function () {
				u.on("ProtocolHandler", s),
				u.on("protocolHandler.clearAll", o),
				u.on("UnknownProtocol", c)
			}
		},
		u.on("browser.init.tier3", l.init),
		n.exports = l
	}), define("iris/restore", function (e, t, n) {
		function i(e) {
			for (var t = 0, n = 0; e.length > n; n++)
				0 > e[t + n] && (e[t + n] += 256);
			this.readBoolean = function () {
				return 0 !== e[t++]
			},
			this.readByte = function () {
				return e[t++]
			},
			this.readUnsignedByte = function () {
				return e[t++]
			},
			this.readShort = function () {
				t += 2
			},
			this.readCompressedInt = function () {
				for (var n = 0, i = 0; ; ) {
					var r = e[t++];
					if (n |= 127 & r, 0 === (128 & r))
						return n;
					if (++i, i > 4 || 4 == i && 0 !== (234881024 & n))
						throw Error("NumberFormatException");
					n <<= 7
				}
			},
			this.readCompressedLong = function () {
				for (var n = 0, i = 0; ; ) {
					var r = e[t++];
					if (n |= 127 & r, 0 === (128 & r))
						return n;
					if (++i, i > 9)
						throw Error("NumberFormatException");
					n <<= 7
				}
			},
			this.readUTF = function () {
				var n = e[t++],
				i = e[t++],
				r = (n << 8) + (i << 0),
				a = window.Convert.fromUtf8Bytes(e, t, r);
				return t += r,
				a
			}
		}
		function r(e) {
			return -1978145278 == e ? !0 : 745089672 == e ? !0 : !1
		}
		var a,
		o = e("iris/event"),
		s = e("iris/webfs.helper"),
		c = e("iris/utils"),
		l = "Browser_Bookmarks.json",
		d = "Browser_Folders.json";
		a = {
			init : function () {
				c.browserType() === c.browserTypes.PERSONAL && a.restoreFromDirectory("/var/javadevicemigration/databases/")
			},
			restoreFromDirectory : function (e) {
				var t = {
					bookmarks : e + l,
					folders : e + d
				};
				a.readDatabases(t, a.parseAndInject)
			},
			readDatabases : function (e, t) {
				s.readFile(e.bookmarks, function (n) {
					return void 0 === n ? !0 : (s.readFile(e.folders, function (i) {
							t(n, i, e)
						}), void 0)
				})
			},
			parseAndInject : function (t, n, i) {
				var r = a.decodeBookmarks(t),
				o = a.decodeFolders(n);
				if (r) {
					var c;
					r.forEach(function (t, n) {
						t.tags = [],
						r.forEach(function (e, i) {
							t.url === e.url && (t.tags = t.tags.concat(a.bookmarkTagsFromFolders(e, o)), n !== i && delete r[i])
						}),
						delete t.parentFolderID,
						c && e("iris/bookmarks").add(c),
						c = t
					}),
					c ? e("iris/bookmarks").add(c, function () {
						s.deleteFile(i.bookmarks),
						s.deleteFile(i.folders)
					}) : (s.deleteFile(i.bookmarks), s.deleteFile(i.folders))
				}
			},
			decodeBookmarks : function (e) {
				if (!e)
					return [];
				var t = JSON.parse(e),
				n = [];
				if (!t.Database)
					return n;
				if ("Browser Bookmarks" !== t.Database.Name)
					return n;
				if (!t.Database.Records)
					return n;
				for (var i in t.Database.Records) {
					var r = t.Database.Records[i],
					o = {};
					a.readBrowserPageModel(o, r.PageModel4),
					a.readModelResult(o, r.ModelResult5),
					n.push(o)
				}
				return n
			},
			decodeFolders : function (e) {
				if (!e)
					return {};
				var t = JSON.parse(e),
				n = {};
				if (!t.Database)
					return n;
				if ("Browser Folders" !== t.Database.Name)
					return n;
				if (!t.Database.Records)
					return n;
				for (var i in t.Database.Records) {
					var r = t.Database.Records[i],
					o = {};
					o.id = r.UID,
					a.readFolder(o, r.FolderId),
					n[o.id] = o
				}
				return n
			},
			bookmarkTagsFromFolders : function (e, t) {
				for (var n = [], i = e.parentFolderID; t[i]; i = t[i].parentFolderID)
					r(i) || n.push(t[i].name);
				return n
			},
			readBrowserPageModel : function (e, t) {
				var n = new i(t);
				n.readShort(),
				n.readByte(),
				n.readCompressedLong(),
				e.timestamp = n.readCompressedLong(),
				n.readCompressedInt(),
				e.title = n.readBoolean() ? n.readUTF() : null,
				e.parentFolderID = n.readCompressedLong()
			},
			readModelResult : function (e, t) {
				var n = new i(t);
				e.url = n.readUTF()
			},
			readFolder : function (e, t) {
				var n = new i(t);
				e.parentFolderID = n.readCompressedInt(),
				e.name = n.readUTF()
			}
		},
		o.on("browser.init.tier3", a.init),
		n.exports = a
	}), define("iris/rotation.helper", function (e, t, n) {
		var i,
		r = e("iris/event"),
		a = e("iris/application"),
		o = e("ui/utils"),
		s = {},
		c = {},
		l = function (e, t) {
			qnx.callExtensionMethod("webview.notifyApplicationOrientationDone", e),
			t.jobComplete()
		},
		d = function (t, n, i) {
			c = {};
			var r = e("iris/job.runner").createParallel(a.notifyRotateComplete);
			qnx.callExtensionMethod("applicationWindow.setSize", t, n, i),
			r.addJob(),
			Object.keys(s).forEach(function (e) {
				e = window.parseInt(e, 10),
				qnx.callExtensionMethod("webview.setApplicationOrientation", e, i),
				s[e].isVisible(e) ? (r.addJob(), s[e].callback(e, t, n, i, l.bind(this, e, r))) : c[e] = function () {
					s[e].callback(e, t, n, i),
					qnx.callExtensionMethod("webview.notifyApplicationOrientationDone", e)
				}
			}),
			r.jobComplete()
		},
		u = function () {
			Object.keys(c).forEach(function (e) {
				c[e]()
			}),
			o.scrollIntoViewIfNecessary(document.activeElement)
		};
		i = {
			addWebview : function (e, t, n) {
				s[e] = {
					callback : n,
					isVisible : t
				}
			},
			removeWebview : function (e) {
				delete s[e]
			},
			setViewportAndCallBackAsNeeded : function (t, n, i, r, a, o) {
				e("iris/webview.viewport").setViewportAndCallBackAsNeeded(t, n, i, r, a, o)
			}
		},
		r.on("application.rotate", d),
		r.on("application.rotateDone", u),
		n.exports = i
	}), define("iris/screen.capture", function (e, t, n) {
		function i(e) {
			return e && 0 === e.indexOf(y) ? e.substring(y.length) : void 0
		}
		function r(e) {
			var t = k[e];
			delete k[e],
			t && t()
		}
		function a(e, t, n) {
			E.writeBase64File(e, t, function () {
				h.updateIcon(n, y + e, function () {
					r(n)
				})
			})
		}
		function o(e, t) {
			if (e.length) {
				var n = [];
				t.addJob(),
				E.getDirectoryEntries(u, function (r) {
					return r ? (e.forEach(function (e) {
							var a = i(e.iconUrl);
							if (a) {
								if (-1 === r.files.indexOf(a))
									return n.push(e.id), console.warn("screen.capture: a screenshot went missing for id " + e.id + " located at " + e.iconUrl), void 0;
								t.addJob(),
								E.deleteFile(a, function (i) {
									i && (n.push(e.id), t.jobComplete())
								})
							}
						}), t.jobComplete(function () {
							h.resetIcons(n),
							p.emit("screen.capture.url.icons.removed", [n])
						}), void 0) : (console.error("unable to ls " + u + ". Cannot delete old screenshots."), !0)
				})
			}
		}
		function s(e, t, n) {
			var o = u + (new Date).getTime() + ".png";
			if (n) {
				if (n = i(n), !n)
					return a(o, t, e), void 0;
				E.deleteFile(n, function (i) {
					i ? a(o, t, e) : E.fileExists(n, function (i) {
						i ? (console.error("Could not delete screenshot: " + n), r(e)) : (console.error("Screenshot went missing!!!: " + n), a(o, t, e))
					})
				})
			} else
				null === n ? a(o, t, e) : r(e)
		}
		function c(e, t) {
			t.forEach(function (e) {
				var t = i(e);
				t && E.deleteFile(t)
			})
		}
		function l(e) {
			var t = URI(e);
			return x && "local" !== t.protocol() && "about" !== t.protocol() ? !0 : !1
		}
		function d(e) {
			e.addJob(),
			h.getScreenshots(function (t) {
				if (!t || !t.length)
					return e.jobComplete(), void 0;
				var n = {};
				t.forEach(function (e) {
					n[e.iconUrl.substr(7)] = !0
				}),
				e.addJob(),
				E.getDirectoryEntries(u, function (t) {
					if (!t)
						return console.error("unable to ls " + u + ". Cannot clear spurious screenshots."), !0;
					var i = 0;
					t.files.forEach(function (t) {
						n[t] || (e.addJob(), E.deleteFile(t, function (n) {
								n ? i++ : console.warn("screen.capture: tried to delete a file and couldn't: " + t),
								e.jobComplete()
							}))
					}),
					e.jobComplete(function () {
						console.log("screen.capture: deleted " + i + " spurious screenshots.")
					})
				}),
				e.jobComplete()
			})
		}
		var u,
		m,
		f,
		p = e("iris/event"),
		g = e("iris/tabs/controller"),
		h = e("iris/storage"),
		v = e("iris/settings"),
		b = e("iris/utils"),
		E = e("iris/webfs.helper"),
		w = 0,
		T = JSON.stringify({
				width : 240,
				height : 240
			}),
		y = "file://",
		I = [],
		S = {},
		x = !1,
		C = 250,
		k = {};
		f = {
			init : function () {
				p.on("CaptureContents", f.captureSuccess),
				p.on("urls.removed", c),
				u = b.homeDir().replace("/data", "") + "/sharewith/search/screenshots/",
				u = u.replace(/\/\//g, "/"),
				E.createDirectory(u),
				p.on("application.stateChange", function () {
					f.removeOldScreenshots()
				}, ["thumbnail"])
			},
			captureSize : function () {
				return T
			},
			captureTabContent : function (e, t, n) {
				var i = g.get(e);
				if (i && i.webviewId && i.webpage && l(i.webpage.getUrl()) && i.selected && (v.getValue(v.ENABLE_PRIVATE_BROWSING) && (n = !1), !I[i.webviewId] || t)) {
					if (I[i.webviewId]) {
						for (var r = 0; I[i.webviewId].length > r; r++)
							if (I[i.webviewId][r] === t)
								return console.warn("Could not add capture tab content callback for webview Id : " + i.webviewId + ", as it has already been added"), void 0;
						return I[i.webviewId].push(t),
						void 0
					}
					var a = JSON.parse(qnx.callExtensionMethod("webview.contentRectangle", i.webviewId)),
					o = Math.min(a.width, a.height);
					o = Math.floor(o / qnx.callExtensionMethod("webview.scale", i.webviewId));
					var s = JSON.stringify({
							x : 0,
							y : 0,
							width : o,
							height : o
						}),
					c = w++;
					I[i.webviewId] ? console.error("Screen capture callback array should be null but was not") : I[i.webviewId] = [],
					S[c] = {
						persist : n,
						url : i.webpage.getUrl()
					},
					t && I[i.webviewId].push(t),
					qnx.callExtensionMethod("webview.captureContents", i.webviewId, c, s, T)
				}
			},
			getStoredTabContent : function (e, t) {
				var n = g.get(e);
				n && n.webpage && h.getIconUrl(n.webpage.getUrl(), function (e) {
					t(n, e)
				})
			},
			captureSuccess : function (e, t) {
				var n = g.getTabForWebviewId(e);
				if (n) {
					t = JSON.parse(t);
					var i = parseInt(t.id, 10),
					r = S[i];
					if (delete S[i], r && (!n.webpage || n.webpage.getUrl() !== r.url || !n.selected))
						return delete I[e], console.warn("url changed since capture requested"), void 0;
					for (var a = 0; I[e].length > a; a++)
						I[e][a](n, t.base64PNGImage);
					delete I[e],
					n.webpage && !g.hasNetworkError(n.Id) && r.persist && f.replaceImage(n.webpage.getUrl(), t.base64PNGImage)
				}
			},
			replaceImage : function (e, t) {
				if (l(e) && !v.getValue(v.ENABLE_PRIVATE_BROWSING)) {
					if (e in k)
						return k[e] = f.replaceImage.bind(this, e, t), void 0;
					k[e] = void 0,
					h.getIconUrl(e, function (n) {
						s(e, t, n)
					})
				}
			},
			removeOldScreenshots : function (t) {
				if (!m) {
					var n = window.performance.now();
					m = e("iris/job.runner").createParallel(function () {
							m = void 0,
							console.log("screen.capture: Took " + Math.round(window.performance.now() - n) + "ms to remove old screenshots.")
						}),
					m.addJob(),
					t && (m.addJob(), d(m), m.jobComplete()),
					h.getLeastUsedScreenshots(C, function (e) {
						o(e, m),
						m.jobComplete()
					})
				}
			}
		},
		p.on("browser.init.tier3", f.init),
		p.once("browser.startup.complete", function () {		    
		    x = !0            
		}),
		n.exports = f
	}), define("iris/screen", function (e, t, n) {
		var i,
		r = e("iris/event"),
		a = {};
		i = {
			getHandle : function (e) {
				if (e) {
					if (!a[e]) {
						if (a[e] = qnx.callExtensionMethod("webview.jsScreenWindowHandle", e), !a[e])
							return console.warn("Could not get screen handle for webview " + e), void 0;
						r.once("Destroyed", function () {
							delete a[e]
						}, [e])
					}
					return a[e]
				}
			}
		},
		n.exports = i
	}), define("iris/screen.reader", function (e, t, n) {
		var i,
		r = e("iris/event"),
		a = !1;
		i = {
			init : function () {
				r.emit("PropertyScreenReaderEnabledEvent", [iris.chromeId, "1" === qnx.callExtensionMethod("webview.isScreenReaderEnabled", iris.chromeId)], !0)
			},
			isEnabled : function () {
				return a
			}
		},
		r.on("PropertyScreenReaderEnabledEvent", function (e, t) {
			a = t,
			document.body.setAttribute("aria-hidden", !a)
		}),
		r.on("browser.init.tier3", i.init),
		n.exports = i
	}), define("iris/search", function (e, t, n) {
		function i() {
			return [{
					shortName : "Bing",
					descriptorUrl : "fake://bing.com/opensearch.xml",
					searchTemplate : "http://www.bing.com/search?q={searchTerms}&PC=RIMBINGD&A=results",
					suggestTemplate : "http://api.bing.com/osjson.aspx?query={searchTerms}&language={language}",
					iconUrl : "file://" + b.realpath(w.homeDir() + "/../app/public/bing.png")
				}, {
					shortName : "Google",
					descriptorUrl : "fake://google.com/opensearch.xml",
					searchTemplate : "http://www.google.com/search?q={searchTerms}&hl={language}",
					suggestTemplate : "http://suggestqueries.google.com/complete/search?output=firefox&q={searchTerms}&hl={language}",
					iconUrl : "file://" + b.realpath(w.homeDir() + "/../app/public/google.png")
				}, {
					shortName : "Yahoo",
					descriptorUrl : "fake://yahoo.com/opensearch.xml",
					searchTemplate : "http://m.yahoo.com/w/search?.tsrc=rimsp&.lang={language}&.first=1&p={searchTerms}",
					suggestTemplate : "http://ff.search.yahoo.com/gossip?output=fxjson&command={searchTerms}",
					iconUrl : "file://" + b.realpath(w.homeDir() + "/../app/public/yahoo.png")
				}
			]
		}
		function r(e) {
			for (var t = 0; u.length > t; t++)
				if (u[t].descriptorUrl === e)
					return t;
			return -1
		}
		function a() {
			w.toLocal(I, JSON.stringify(u, function (e, t) {
					return "isBulk" === e ? void 0 : t
				}))
		}
		function o(e, t) {
			var n = {};
			n.shortName = t.getElementsByTagName("ShortName")[0].textContent,
			n.description = t.getElementsByTagName("Description")[0].textContent;
			for (var i, r, a = t.getElementsByTagName("Url"), o = 0; a.length > o; o++)
				i && "text/html" !== a[o].getAttribute("type") || a[o].hasAttribute("rel") && "results" !== a[o].getAttribute("rel") ? "application/x-suggestions+json" !== a[o].getAttribute("type") || a[o].hasAttribute("rel") && "suggestions" !== a[o].getAttribute("rel") || (r = a[o].getAttribute("template")) : i = a[o].getAttribute("template");
			var s = t.getElementsByTagName("Image");
			for (o = 0; s.length > o; o++)
				(!n.iconUrl || !n.imageHeight && s[o].hasAttribute("height") || n.imageHeight && parseInt(s[o].getAttribute("height"), 10) > n.imageHeight) && (n.iconUrl = s[o].textContent.trim(), n.imageHeight = s[o].getAttribute("height"));
			return n.searchTemplate = i,
			r && (n.suggestTemplate = r),
			n.descriptorUrl = e,
			n.shortName && n.description && n.searchTemplate && n.descriptorUrl && h.isValidUrl(n.descriptorUrl) && h.isValidUrl(n.searchTemplate) && (!n.suggestTemplate || h.isValidUrl(n.suggestTemplate)) ? n : void 0
		}
		function s(e, t) {
			if (g.get(e) && t) {
				var n = t.filter(h.isValidUrl),
				i = g.get(e).url;
				i && (T[i] = n)
			}
		}
		function c(e, t) {
			if (!e)
				return t && t(), void 0;
			if (e in y)
				return t && t(y[e]), void 0;
			var n = new XMLHttpRequest;
			n.open("GET", e, !0),
			n.onreadystatechange = function () {
				if (4 === n.readyState) {
					var i;
					if (200 === n.status)
						try {
							var r = n.responseXML || (new window.DOMParser).parseFromString(n.response, "text/xml");
							i = o(e, r)
						} catch (a) {}

					y[e] = i,
					t && t(i)
				}
			},
			n.send()
		}
		function l(e, t) {
			v.executeJavaScript(e.webviewId, x, function (n, i) {
				if (i) {
					var r = JSON.parse(i);
					if (s(e.id, r), t) {
						var a = T[e.url].filter(function (e) {
								return !f.hasInstalled(e)
							});
						t(a)
					}
				} else
					t && t([])
			}, !0, C)
		}
		function d() {
			if (!u) {
				if (u = e("iris/utils").fromLocal(I)) {
					var t = e("iris/utils").fromLocal("_DEFAULT_SEARCH_PROVIDERS_VERSION");
					if (k != t) {
						var n = i();
						u.forEach(function (e) {
							0 === e.descriptorUrl.indexOf("fake://") && n.some(function (t) {
								return t.descriptorUrl === e.descriptorUrl ? (e.shortName = t.shortName, e.iconUrl = t.iconUrl, e.searchTemplate = t.searchTemplate, e.suggestTemplate = t.suggestTemplate, !0) : void 0
							})
						}),
						a(),
						w.toLocal("_DEFAULT_SEARCH_PROVIDERS_VERSION", k)
					}
					u.forEach(function (e) {
						y[e.descriptorUrl] = e
					})
				} else
					u = [], f.addDefaults();
				m = e("iris/utils").fromLocal(S),
				f.getCurrentProvider() || f.setCurrentProvider(u[0])
			}
		}
		var u,
		m,
		f,
		p = e("iris/event"),
		g = e("iris/tabs/controller"),
		h = e("iris/validation"),
		v = e("iris/exec"),
		b = e("iris/application"),
		E = e("iris/settings"),
		w = e("iris/utils"),
		T = {},
		y = {},
		I = "search-providers",
		S = "default-web-search-provider",
		x = '(function () {var search = []; Array.prototype.forEach.call(document.head.getElementsByTagName("link"), function (elt) { if (elt.hasAttribute("rel") && elt.getAttribute("rel").toLowerCase() === "search" && elt.hasAttribute("href")) { search.push(elt.href); }}); return JSON.stringify(search);}());',
		C = 100,
		k = "1";
		f = {
			hasInstalled : function (e) {
				return d(),
				r(e) > -1
			},
			getProvider : function (e, t) {
				d(),
				f.hasInstalled(e) ? t && t(u[r(e)]) : c(e, t)
			},
			add : function (e) {
				d(),
				e && -1 === r(e.descriptorUrl) && h.isValidUrl(e.descriptorUrl) && h.isValidUrl(e.searchTemplate) && (!e.suggestTemplate || h.isValidUrl(e.suggestTemplate)) && (m || u.length || (m = e, w.toLocal(S, JSON.stringify(m))), u.push(e), y[e.descriptorUrl] = e, a(), p.emit("search.added", [e.descriptorUrl, e]), f.getCurrentProvider() || f.setCurrentProvider(e))
			},
			remove : function (e) {
				d();
				var t = u.filter(function (t) {
						return t.descriptorUrl !== e.descriptorUrl
					});
				if (t.length < u.length) {
					var n = f.getCurrentProvider();
					u = t,
					a(),
					delete y[e.descriptorUrl],
					p.emit("search.removed", [e.descriptorUrl, e]),
					n === e && f.setCurrentProvider(u[0])
				}
			},
			removeAll : function () {
				d(),
				u.forEach(function (e) {
					e.isBulk = !0,
					p.emit("search.removed", [e.descriptorUrl, e])
				}),
				u = [],
				T = {},
				a(),
				f.setCurrentProvider(void 0)
			},
			addDefaults : function () {
				d(),
				i().forEach(function (e) {
					e.isBulk = !0,
					f.add(e),
					delete e.isBulk
				})
			},
			removeDefaults : function () {
				d(),
				i().forEach(function (e) {
					e.isBulk = !0,
					f.remove(e),
					delete e.isBulk
				})
			},
			getAll : function () {
				return d(),
				u
			},
			getSearchUrl : function (e, t) {
				return d(),
				e ? (t = t.replace(/\n/g, " "), e.replace(/\{searchTerms\}/g, encodeURIComponent(t)).replace(/\{language\}/g, window.navigator.language).replace(/\{.*\}/g, "")) : ""
			},
			getCurrentSearchQuery : function (e) {
				d();
				var t = f.getCurrentProvider();
				return t ? f.getSearchUrl(t.searchTemplate, e) : ""
			},
			getCurrentProvider : function () {
				d();
				var e = E.getValue(E.SEARCH_PROVIDER);
				return y[e]
			},
			getWebSearchUrl : function (e) {
				return d(),
				f.getCurrentSearchQuery(e) || f.getSearchUrl(m.searchTemplate, e)
			},
			setCurrentProvider : function (e) {
				d();
				var t = f.getCurrentProvider();
				return e && -1 === r(e.descriptorUrl) ? (console.error("Cannot set provider. Does not exist."), void 0) : (E.setValue(E.SEARCH_PROVIDER, e ? e.descriptorUrl : ""), p.emit("search.currentProviderChanged", [e, t]), void 0)
			},
			getDescriptorUrls : function (e, t) {
				return T[e.url] ? (T[e.url] = T[e.url].filter(function (e) {
							return !(f.hasInstalled(e) || e in y && !y[e])
						}), t(T[e.url]), void 0) : (l(e, t), void 0)
			},
			addSearch : function (t) {
				var n = g.getSelected(),
				i = [],
				r = e("iris/job.runner").createParallel();
				r.addJob(),
				t.forEach(function (e) {
					e && r.addJob(function () {
						f.getProvider(e, function (e) {
							e && i.push(e),
							r.jobComplete()
						})
					})
				}),
				r.jobComplete(function () {
					return i.length ? (e("plugins/screens/add_search_sheet/index").handleSearchProviders(i, n), void 0) : (e("plugins/toaster/index").createBasicToast(e("iris/i18n").translate(75)), void 0)
				})
			},
			init : function () {
				d(),
				p.on("AddSearchProviderRequest", function (e, t) {
					t = JSON.parse(t),
					f.hasInstalled(t.url) || f.addSearch([t.url])
				})
			}
		},
		p.on("browser.init.tier3", f.init),
		n.exports = f
	}), define("iris/sensitivity", function (e, t, n) {
		var i,
		r,
		a,
		o = e("iris/event"),
		s = e("screen/manager");
		a = {
			setSensitivityNoFocus : function () {
				"SensitivityNoFocus" !== i && (r = qnx.callExtensionMethod("webview.sensitivity", iris.chromeId), i = "SensitivityNoFocus", qnx.callExtensionMethod("webview.setSensitivity", iris.chromeId, "SensitivityNoFocus"))
			},
			resetSensitivity : function () {
				i !== r && (qnx.callExtensionMethod("webview.setSensitivity", iris.chromeId, r), i = r)
			}
		},
		o.on("dialogs.showing", a.resetSensitivity),
		o.on("manager.screen", a.resetSensitivity, [o.FILTER_ANY, s.screenStates.PUSHED]),
		n.exports = a
	}), define("iris/settings", function (e, t, n) {
		function i(e) {
			return m.fromLocal(f + e, null)
		}
		function r(e, t) {
			m.toLocal(f + e, JSON.stringify(t))
		}
		function a(e) {
			localStorage.removeItem(f + e)
		}
		function o(e, t) {
			null === i(e) && r(e, t)
		}
		function s(t) {
			e("iris/inspector").enabled = t
		}
		function c(t) {
			e("iris/webDriver").enabled = t
		}
		var l,
		d,
		u = e("iris/event"),
		m = e("iris/utils"),
		f = "settings.",
		p = {};
		d = {
			ON_STARTUP : "onStartup",
			HOME_PAGE_URL : "homePageUrl",
			DOWNLOADS_PATH : "downloadsPath",
			ENABLE_SEARCH_SUGGESTIONS : "enableSearchSuggestions",
			ENABLE_FLASH : "enableFlash",
			ENABLE_AUDIO_FEEDBACK : "enableAudioFeedback",
			HISTORY_EXPIRY : "historyExpiry",
			ENABLE_PRIVATE_BROWSING : "enablePrivateBrowsing",
			BLOCK_POPUPS : "blockPopups",
			ACCEPT_COOKIES : "acceptCookies",
			ENABLE_INSPECTOR : "enableInspector",
			ENABLE_WEBDRIVER : "enableWebDriver",
			SEARCH_PROVIDER : "searchProvider",
			OPEN_NEW_TAB_LINKS_BACKGROUND : "openNewTabLinksBackground",
			ENABLE_DESKTOP_MODE : "desktopMode",
			ENABLE_DISK_CACHE : "enableDiskCache",
			ENABLE_CREDENTIAL_AUTOFILL : "credentialAutofill",
			ENABLE_FORM_AUTOFILL : "formAutofill",
			ENABLE_SHOW_DEBUG_BORDERS : "showDebugBorders",
			DEFAULT_USER_AGENT : "",
			DEFAULT_DOWNLOADS_PATH : "",
			DESKTOP_USER_AGENT : "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.35 (KHTML, like Gecko) Chrome/26.0.1410.64 Safari/537.35",
			ON_STARTUP_NEW_TAB : "newTab",
			ON_STARTUP_LAST_TABS : "lastTabs",
			ON_STARTUP_HOME : "home",
			DEPRECATED : {
				STARTUP_ACTION : "startupAction",
				STARTUP_ACTION_HOME_PAGE : "homePage",
				STARTUP_ACTION_REMEMBER_TABS : "rememberTabs",
				HOME_PAGE : "homePage",
				HOME_PAGE_USE_NEW_TAB_PAGE : "newTabPage",
				HOME_PAGE_USE_URL : "url"
			},
			getValue : function (e) {
				return l || d.init(),
				p[e] ? p[e] : i(e)
			},
			setValue : function (e, t, n) {
				(p[e] || i(e) !== t) && (n ? p[e] = t : (r(e, t), p[e] && delete p[e]), u.emit("settings.updated", [e, t]))
			},
			init : function () {
				d.DEFAULT_USER_AGENT = qnx.callExtensionMethod("webview.userAgent", iris.chromeId),
				d.DEFAULT_DOWNLOADS_PATH = m.isWorkBrowser() ? "/accounts/1000-enterprise/shared/downloads/" : "/accounts/1000/shared/downloads/",
				l = !0;
				var t = i(d.DEPRECATED.STARTUP_ACTION);
				if (t === d.DEPRECATED.STARTUP_ACTION_REMEMBER_TABS ? o(d.ON_STARTUP, d.ON_STARTUP_LAST_TABS) : t === d.DEPRECATED.STARTUP_ACTION_HOME_PAGE && i(d.DEPRECATED.HOME_PAGE) === d.DEPRECATED.HOME_PAGE_USE_URL && o(d.ON_STARTUP, d.ON_STARTUP_HOME), m.isWorkBrowser()) {
					var n = e("iris/it.policy").getSpecifiedHomePage();
					n && (o(d.ON_STARTUP, d.ON_STARTUP_HOME), r(d.HOME_PAGE_URL, n))
				}
				o(d.ON_STARTUP, d.ON_STARTUP_NEW_TAB),
				o(d.DOWNLOADS_PATH, d.DEFAULT_DOWNLOADS_PATH),
				a(d.DEPRECATED.STARTUP_ACTION),
				a(d.DEPRECATED.HOME_PAGE),
				o(d.ENABLE_SEARCH_SUGGESTIONS, !e("iris/utils").isWorkBrowser()),
				o(d.ENABLE_FLASH, !0),
				o(d.ENABLE_AUDIO_FEEDBACK, !0),
				o(d.HISTORY_EXPIRY, 31),
				o(d.BLOCK_POPUPS, !0),
				o(d.ACCEPT_COOKIES, !0),
				o(d.SEARCH_PROVIDER, "Bing"),
				o(d.OPEN_NEW_TAB_LINKS_BACKGROUND, !0),
				o(d.ENABLE_DESKTOP_MODE, !0),
				o(d.ENABLE_DISK_CACHE, !0),
				o(d.ENABLE_CREDENTIAL_AUTOFILL, !0),
				o(d.ENABLE_FORM_AUTOFILL, !0),
				o(d.ENABLE_INSPECTOR, !1),
				o(d.ENABLE_WEBDRIVER, !1),
				o(d.ENABLE_SPATIAL_NAVIGATION, !1),
				e("iris/utils").isWorkBrowser() && (r(d.ENABLE_INSPECTOR, !1), r(d.ENABLE_WEBDRIVER, !1)),
				r(d.ENABLE_SHOW_DEBUG_BORDERS, !1),
				r(d.ENABLE_PRIVATE_BROWSING, !1),
				s(i(d.ENABLE_INSPECTOR)),
				c(i(d.ENABLE_WEBDRIVER))
			},
			clearCache : function () {
				var t = e("iris/tabs/controller").getAll();
				t.forEach(function (e) {
					qnx.callExtensionMethod("webview.clearCache", e.webviewId)
				})
			},
			clearHistory : function () {
				var t = e("iris/tabs/controller").getAll();
				t.forEach(function (e) {
					qnx.callExtensionMethod("webview.clearHistory", e.webviewId)
				}),
				e("iris/history").deleteAllVisits()
			},
			clearSiteData : function () {
				u.emit("protocolHandler.clearAll"),
				d.setValue(d.DOWNLOADS_PATH, d.DEFAULT_DOWNLOADS_PATH, !1);
				var t = e("iris/tabs/controller").getAll();
				t.forEach(function (e) {
					qnx.callExtensionMethod("webview.clearCookies", e.webviewId),
					qnx.callExtensionMethod("webview.clearLocalStorage", e.webviewId),
					qnx.callExtensionMethod("webview.clearDatabases", e.webviewId),
					qnx.callExtensionMethod("webview.clearCredentials", e.webviewId),
					qnx.callExtensionMethod("webview.clearAutofillData", e.webviewId),
					qnx.callExtensionMethod("webview.clearWebFileSystem", e.webviewId)
				})
			}
		},
		u.on("browser.init.tier2", d.init),
		u.on("settings.updated", function (e, t) {
			e === d.ENABLE_INSPECTOR && s(t),
			e === d.ENABLE_WEBDRIVER && c(t)
		}),
		n.exports = d
	}), define("iris/shortcuts", function (e, t, n) {
		function i() {
			return Q.currentScreen() === rt && !at.urlExpanded()
		}
		function r() {
			K.hide(),
			z.hideContextMenu(),
			Y.hideMenu()
		}
		function a() {
			var e = Q.currentScreen();
			return i() ? j.getSelected().webviewId : e === ot ? ot.getId() : void 0
		}
		function o(e, t) {
			var n = a();
			if (n) {
				var i = qnx.callExtensionMethod("webview.scale", n),
				r = JSON.parse(qnx.callExtensionMethod("webview.scrollPosition", n)),
				o = JSON.parse(qnx.callExtensionMethod("webview.contentRectangle", n)),
				s = JSON.parse(qnx.callExtensionMethod("webview.viewport", n));
				switch (t) {
				case -mt:
					t = -s.height + 90;
					break;
				case mt:
					t = s.height - 90;
					break;
				case -ft:
					t = -o.height;
					break;
				case ft:
					t = o.height
				}
				var c = Math.round(Math.max(0, Math.min(r.x + e, o.width - s.width)) / i),
				l = Math.round(Math.max(0, Math.min(r.y + t, o.height - s.height)) / i);
				qnx.callExtensionMethod("webview.animateToDocumentScrollPosition", n, JSON.stringify({
						x : c,
						y : l
					}))
			}
		}
		function s(e) {
			var t = i() && a();
			if (t) {
				var n = JSON.parse(qnx.callExtensionMethod("webview.viewport", t));
				qnx.callExtensionMethod("webview.animateZoomBy", t, e, JSON.stringify({
						x : Math.round(n.width / 2),
						y : Math.round(n.height / 2)
					}))
			}
		}
		function c() {
			i() && (r(), rt.showReader())
		}
		function l() {
			i() && (r(), Q.loadScreen("history_date").show())
		}
		function d() {
			i() && (r(), Q.loadScreen("bookmarks_main").show())
		}
		function u() {
			o(0, -mt)
		}
		function m() {
			o(0, mt)
		}
		function f() {
			o(0, -ft)
		}
		function p() {
			o(0, ft)
		}
		function g() {
			if (J.isChromeFocused()) {
				var e = !rt.isShowingNewTabPage() && Q.currentScreen() === rt,
				t = ot.isOpen(),
				n = document.getElementById("navigationbar").contains(document.activeElement),
				i = document.getElementById("action-bar-area").contains(document.activeElement);
				if (!(n && e || et.isVisible() && e || i && t))
					return
			}
			if (U === g) {
				if (F)
					return;
				var r = a();
				return F = qnx.callExtensionMethod.bind(qnx, "webview.stopAnimatedScroll", r),
				qnx.callExtensionMethod("webview.startAnimatedScroll", r, '{"x": 0, "y": 2000}'),
				void 0
			}
			o(0, pt),
			U = g
		}
		function h() {
			if (!J.isChromeFocused() || J.isChromeFocused() && et.isVisible()) {
				if (U === h) {
					if (F)
						return;
					var e = a();
					return F = qnx.callExtensionMethod.bind(qnx, "webview.stopAnimatedScroll", e),
					qnx.callExtensionMethod("webview.startAnimatedScroll", e, '{"x": 0, "y": -2000}'),
					void 0
				}
				o(0, -pt),
				U = h
			} else
				J.isChromeFocused() && Q.currentScreen() === rt && !rt.isShowingNewTabPage() && document.getElementById("navigationbar").contains(document.activeElement) ? (J.setTabFocus(), document.activeElement.blur()) : J.isChromeFocused() && ot.isOpen() && document.getElementById("action-bar-area").contains(document.activeElement) && (J.setReaderFocus(), document.activeElement.blur())
		}
		function v() {
			if (U === v) {
				if (F)
					return;
				var e = a();
				return F = qnx.callExtensionMethod.bind(qnx, "webview.stopAnimatedScroll", e),
				qnx.callExtensionMethod("webview.startAnimatedScroll", e, '{"x": -2000, "y": 0}'),
				void 0
			}
			o(-pt, 0),
			U = v
		}
		function b() {
			if (U === b) {
				if (F)
					return;
				var e = a();
				return F = qnx.callExtensionMethod.bind(qnx, "webview.stopAnimatedScroll", e),
				qnx.callExtensionMethod("webview.startAnimatedScroll", e, '{"x": 2000, "y": 0}'),
				void 0
			}
			o(pt, 0),
			U = b
		}
		function E() {
			i() && (r(), j.forwardSelected())
		}
		function w() {
			i() && (r(), j.backSelected())
		}
		function T() {
			s(1.5)
		}
		function y() {
			s(.66)
		}
		function I() {
			i() && (r(), j.reloadSelected())
		}
		function S() {
			i() ? (r(), rt.findOnPage()) : Q.currentScreen() === ot && (r(), ot.showFind())
		}
		function x() {
			if (K.isShowing()) {
				var e = K.getTabbarWindow().tabbar.getFocusedTabId(),
				t = e ? j.get(e) : j.getSelected();
				1 === j.getAll().length ? (j.reset(t.id), K.hide()) : t.webviewId ? qnx.callExtensionMethod("webview.destroyIfNotRejectedByUser", t.webviewId) : j.remove(t.id)
			}
		}
		function C() {
			i() && (r(), at.urlFocus())
		}
		function k() {
			i() && K.show()
		}
		function A() {
			J.isChromeFocused() ? document.activeElement.click() : J.isTabbarFocused() && K.getTabbarWindow().document.activeElement.click()
		}
		function N(e, t) {
			t = JSON.parse(t);
			var n = t.handled;
			n || "Back" !== t.hardKey || (100 > j.getSelected().getLoadProgressPercent() ? (j.stopSelected(), n = !0) : at.urlExpanded() ? (at.urlFocusOut(), n = !0) : Q.homeScreen() === Q.currentScreen() && (j.getSelected().historyCanNavigateBack() || j.getSelected().parentId) && (j.backSelected(), n = !0)),
			-1 !== t.eventId && lt.systemKeyPressedHandled(t.eventId, n)
		}
		function L(e) {
			var t = !0;
			if (J.isChromeFocused())
				K.isShowing() ? K.hide() : Y.visibleMenu() ? Y.hideMenu() : X.isVisible() ? X.cleanUp() : z.isMenuVisible() ? z.hideContextMenu() : Z.getCurrentVisibleSearchBar() ? Z.getCurrentVisibleSearchBar().cleanUp() : et.isVisible() ? et.cleanUp() : $.isShowing() && $.isSearchProviderListOpen() ? $.closeSearchProviderList() : $.isShowing() ? $.setShowing(!1) : ut.isShowing() ? ut.hide() : tt.areToastsVisible() ? W.emit("toaster.toast.dismiss.all", []) : nt.isShowingDialog() ? nt.getCurrentDialog().buttons[0].click() : it.getActiveDropdown() ? it.getActiveDropdown().setExpand(!1) : Q.homeScreen() !== Q.currentScreen() && "crashpage_screen" !== Q.currentScreen().id ? Q.popScreen(Q.currentScreen()) : ct.isFullScreen() ? W.emit("RequestExitFullScreen", []) : 100 > j.getSelected().getLoadProgressPercent() ? j.stopSelected() : at.urlExpanded() ? at.urlFocusOut() : Q.homeScreen() === Q.currentScreen() && (j.getSelected().historyCanNavigateBack() || j.getSelected().parentId) ? j.backSelected() : t = !1;
			else if (J.isTabbarFocused())
				K.hide();
			else if (J.isTabFocused())
				if (et.isVisible())
					et.cleanUp();
				else if (tt.areToastsVisible())
					W.emit("toaster.toast.dismiss.all", []);
				else {
					if (!ct.isFullScreen())
						return qnx.callExtensionMethod("webview.handleHardkey", j.getSelected().webviewId, "Back", e ? e : -1), void 0;
					W.emit("RequestExitFullScreen", [])
				}
			else
				J.isReaderFocused() ? et.isVisible() ? et.cleanUp() : Q.popScreen(Q.currentScreen()) : st.getId() ? dt.executeJavaScript(st.getId(), "window.hide();", void 0, !1, gt) : t = !1;
			e && lt.systemKeyPressedHandled(e, t)
		}
		function _() {
			return Y.visibleMenu() || z.isMenuVisible() ? ((document.getElementById("OverflowMenu").contains(document.activeElement) || document.getElementById("contextMenu").contains(document.activeElement)) && document.activeElement.click(), void 0) : (document.activeElement.contextItem && !J.isTabbarFocused() ? W.emit("menuKeyPress", [], !0) : Q.currentScreen().showOverflowMenu && (Q.currentScreen().showOverflowMenu(), K.hide()), void 0)
		}
		function R() {
			V = void 0
		}
		function O() {
			V = {},
			V[q.translate(76)] = vt.BOOKMARKS,
			V[q.translate(77)] = vt.HISTORY,
			V[q.translate(78)] = vt.READER,
			V[q.translate(79)] = vt.SCROLL_TO_BOTTOM,
			V[q.translate(80)] = vt.SCROLL_TO_TOP,
			V[q.translate(81)] = vt.BACK,
			V[q.translate(82)] = vt.FORWARD,
			V[q.translate(83)] = vt.ZOOM_IN,
			V[q.translate(84)] = vt.ZOOM_OUT,
			V[q.translate(85)] = vt.RELOAD,
			V[q.translate(86)] = vt.SEARCH,
			V[q.translate(87)] = vt.FOCUS_URL_FIELD,
			V[q.translate(88)] = vt.OPEN_TABBAR
		}
		function D(e) {
			switch (e) {
			case "k":
				return q.translate(76);
			case "h":
				return q.translate(77);
			case "r":
				return q.translate(78);
			case "b":
				return q.translate(79);
			case "t":
				return q.translate(80);
			case "p":
				return q.translate(81);
			case "n":
				return q.translate(82);
			case "i":
				return q.translate(83);
			case "o":
				return q.translate(84);
			case "l":
				return q.translate(85);
			case "s":
				return q.translate(86);
			case "u":
				return q.translate(87);
			case "w":
				return q.translate(88)
			}
		}
		function B(e) {
			var t;
			return Et[e.keycode] && (t = bt[(e.shiftActive ? "shift" : "") + Et[e.keycode]]) ? t : (V || O(), e.shiftActive && (t = V["shift+" + D(String.fromCharCode(e.keycode))]), t || V[D(String.fromCharCode(e.keycode))])
		}
		function M(e) {
			switch (e) {
			case ot:
				return "Reader";
			case l:
				return "History";
			case d:
				return "Bookmarks";
			case u:
				return "Page Up";
			case m:
				return "Page Down";
			case f:
				return "Scroll To Top";
			case p:
				return "Scroll To Bottom";
			case g:
				return "Arrow Down";
			case h:
				return "Arrow Up";
			case v:
				return "Scroll Left";
			case b:
				return "Scroll Right";
			case E:
				return "Forward";
			case w:
				return "Back";
			case T:
				return "Zoom In";
			case y:
				return "Zoom Out";
			case I:
				return "Reload";
			case S:
				return "Search";
			case x:
				return "Close Selected Tab";
			case C:
				return "Focus Urlfield";
			case k:
				return "Open Tabbar";
			default:
				return "Unknown"
			}
		}
		function P(e, t) {
			t = JSON.parse(t);
			var n = Et[t.keycode],
			i = "ESC" === n,
			r = "ENTER" === n,
			a = "ARROW_UP" === n || "ARROW_DOWN" === n || "ARROW_LEFT" === n || "ARROW_RIGHT" === n;
			if (!G.userInteractionPrevented() && (!(st.getId() || nt.isShowingDialog() || et.isVisible() || X.isVisible() || ct.isFullScreen()) || i || r || a)) {
				var o;
				if (!t.keyDown)
					return o = B(t), o && o.action === U && (U = void 0, F && (F(), F = void 0)), void 0;
				if (o = B(t), o && o.action !== U && (U = void 0, F && (F(), F = void 0)), o) {
					var s = o.webviewType.some(function (e) {
							switch (e) {
							case ht.ANY:
								return !0;
							case ht.TAB:
								return J.isTabFocused();
							case ht.TABBAR:
								return J.isTabbarFocused();
							case ht.CHROME:
								return J.isChromeFocused();
							case ht.READER:
								return J.isReaderFocused()
							}
							return !1
						});
					s && (o.action(), W.emit("shortcut.ran", [M(o)], !0))
				}
			}
		}
		var U,
		F,
		H,
		V,
		W = e("iris/event"),
		q = e("iris/i18n"),
		G = e("ui/utils"),
		K = e("plugins/tabbar/index"),
		z = e("plugins/contextmenu/index"),
		Y = e("plugins/overflowmenu/index"),
		j = e("iris/tabs/controller"),
		J = e("iris/keyboard.focus"),
		X = e("plugins/screens/selectmore/index"),
		Z = e("plugins/searchbar/index"),
		Q = e("screen/manager"),
		$ = e("plugins/searchresults/index"),
		et = e("plugins/find_on_page/index"),
		tt = e("plugins/toaster/index"),
		nt = e("plugins/dialogs/index"),
		it = e("plugins/dropper/index"),
		rt = e("plugins/screens/tab/index"),
		at = e("plugins/navigationbar/index"),
		j = e("iris/tabs/controller"),
		ot = e("plugins/screens/reader/index"),
		st = e("iris/popups"),
		ct = e("iris/fullscreen"),
		lt = e("iris/application"),
		dt = e("iris/exec"),
		ut = e("plugins/backforwardlist/index"),
		mt = 1,
		ft = 2,
		pt = 90,
		gt = 150,
		ht = {
			ANY : "ANY",
			TAB : "TAB",
			TABBAR : "TABBAR",
			CHROME : "CHROME",
			READER : "READER"
		},
		vt = {
			PAGE_UP : {
				action : u,
				webviewType : [ht.TAB, ht.READER]
			},
			PAGE_DOWN : {
				action : m,
				webviewType : [ht.TAB, ht.READER]
			},
			ARROW_DOWN : {
				action : g,
				webviewType : [ht.TAB, ht.READER, ht.CHROME]
			},
			ARROW_UP : {
				action : h,
				webviewType : [ht.TAB, ht.READER, ht.CHROME]
			},
			ARROW_LEFT : {
				action : v,
				webviewType : [ht.TAB, ht.READER]
			},
			ARROW_RIGHT : {
				action : b,
				webviewType : [ht.TAB, ht.READER]
			},
			SCROLL_TO_TOP : {
				action : f,
				webviewType : [ht.TAB, ht.READER]
			},
			SCROLL_TO_BOTTOM : {
				action : p,
				webviewType : [ht.TAB, ht.READER]
			},
			HISTORY : {
				action : l,
				webviewType : [ht.TAB, ht.TABBAR, ht.CHROME]
			},
			BOOKMARKS : {
				action : d,
				webviewType : [ht.TAB, ht.TABBAR, ht.CHROME]
			},
			FORWARD : {
				action : E,
				webviewType : [ht.TAB, ht.CHROME]
			},
			BACK : {
				action : w,
				webviewType : [ht.TAB, ht.CHROME]
			},
			ZOOM_IN : {
				action : T,
				webviewType : [ht.TAB, ht.CHROME]
			},
			ZOOM_OUT : {
				action : y,
				webviewType : [ht.TAB, ht.CHROME]
			},
			RELOAD : {
				action : I,
				webviewType : [ht.TAB, ht.CHROME]
			},
			SEARCH : {
				action : S,
				webviewType : [ht.TAB, ht.CHROME, ht.READER]
			},
			DELETE : {
				action : x,
				webviewType : [ht.TABBAR]
			},
			READER : {
				action : c,
				webviewType : [ht.TAB, ht.CHROME]
			},
			FOCUS_URL_FIELD : {
				action : C,
				webviewType : [ht.TAB, ht.CHROME]
			},
			OPEN_TABBAR : {
				action : k,
				webviewType : [ht.TAB, ht.TABBAR, ht.CHROME]
			},
			ENTER : {
				action : A,
				webviewType : [ht.ANY]
			},
			ESCAPE : {
				action : L,
				webviewType : [ht.ANY]
			},
			MENU : {
				action : _,
				webviewType : [ht.ANY]
			}
		},
		bt = {
			shiftSPACE : vt.PAGE_UP,
			PG_UP : vt.PAGE_UP,
			SPACE : vt.PAGE_DOWN,
			PG_DOWN : vt.PAGE_DOWN,
			ARROW_DOWN : vt.ARROW_DOWN,
			ARROW_UP : vt.ARROW_UP,
			ARROW_LEFT : vt.ARROW_LEFT,
			ARROW_RIGHT : vt.ARROW_RIGHT,
			HOME : vt.SCROLL_TO_TOP,
			END : vt.SCROLL_TO_BOTTOM,
			AC_HISTORY : vt.HISTORY,
			AC_BOOKMARKS : vt.BOOKMARKS,
			AC_FORWARD : vt.FORWARD,
			AC_BACK : vt.BACK,
			AC_ZOOM_IN : vt.ZOOM_IN,
			AC_ZOOM_OUT : vt.ZOOM_OUT,
			AC_REFRESH : vt.RELOAD,
			AC_FIND : vt.SEARCH,
			DEL : vt.DELETE,
			ENTER : vt.ENTER,
			ESC : vt.ESCAPE,
			MENU : vt.MENU
		},
		Et = {
			32 : "SPACE",
			61448 : "DEL",
			61453 : "ENTER",
			61467 : "ESC",
			61520 : "HOME",
			61521 : "ARROW_LEFT",
			61522 : "ARROW_UP",
			61523 : "ARROW_RIGHT",
			61524 : "ARROW_DOWN",
			61525 : "PG_UP",
			61527 : "END",
			61526 : "PG_DOWN",
			61543 : "MENU",
			61998 : "AC_FIND",
			62002 : "AC_BACK",
			62003 : "AC_FORWARD",
			62004 : "AC_STOP",
			62005 : "AC_REFRESH",
			62008 : "AC_BOOKMARKS",
			62009 : "AC_HISTORY",
			62010 : "AC_ZOOM_IN",
			62011 : "AC_ZOOM_OUT",
			62012 : "AC_ZOOM",
			62013 : "AC_FULLSCREEN",
			62014 : "AC_NORMAL_VIEW",
			62015 : "AC_VIEW_TOGGLE",
			62016 : "AC_SCROLL_UP",
			62017 : "AC_SCROLL_DOWN",
			62018 : "AC_SCROLL"
		};
		H = {
			page : {
				pageUp : u,
				pageDown : m,
				scrollToTop : f,
				scrollToBottom : p,
				forward : E,
				back : w,
				zoomIn : T,
				zoomOut : y,
				reload : I,
				search : S
			},
			ui : {
				history : l,
				bookmarks : d
			},
			scroll : {
				scrollDown : g,
				scrollUp : h,
				scrollLeft : v,
				scrollRight : b
			}
		},
		W.on("application.systemLanguageChange", R),
		W.on("UnhandledKeyInput", P),
		W.on("application.systemKeyPress", L, [W.FILTER_ANY, "Back"]),
		W.on("HardKeyHandled", N),
		n.exports = H
	}), define("iris/startup", function (e, t, n) {
		function i(e, t) {
			document.body.style.fontSize = t + "px",
			document.body.style.fontFamily = e + ", sans-serif"
		}
		function r() {
			return !e("iris/fullscreen").isFullScreen()
		}
		function a(t, n, i, r, a) {
			e("iris/rotation.helper").setViewportAndCallBackAsNeeded(t, e("plugins/screens/tab/index").xPosition(n), e("plugins/screens/tab/index").yPosition(), n, i, a),
			e("plugins/screens/tab/index").resizeFadeColorWindow(n, i)
		}
		function o() {
			qnx.callExtensionMethod("webview.setActive", iris.chromeId, "false"),
			qnx.callExtensionMethod("webview.setAutoDeferNetworkingAndJavaScript", iris.chromeId, "false"),
			qnx.callExtensionMethod("webview.setBackgroundColor", iris.chromeId, 16777215),
			qnx.callExtensionMethod("webview.setBlockPopups", iris.chromeId, !1),
			e("iris/webview.viewport").setViewportAndCallBackAsNeeded(iris.chromeId, 0, 0, screen.width, screen.height),
			qnx.callExtensionMethod("webview.setZOrder", iris.chromeId, iris.chromeZOrder),
			qnx.callExtensionMethod("webview.setEnableDiskCache", iris.chromeId, "true"),
			qnx.callExtensionMethod("webview.setEnableDialogRequestedEvents", iris.chromeId, "true"),
			qnx.callExtensionMethod("webview.setEnableLocalAccessToAllCookies", iris.chromeId, "false"),
			qnx.callExtensionMethod("webview.setSensitivity", iris.chromeId, "SensitivityTest"),
			qnx.callExtensionMethod("webview.setVisible", iris.chromeId, "true"),
			qnx.callExtensionMethod("webview.setEnableCrossSiteXHR", iris.chromeId, "true"),
			qnx.callExtensionMethod("application.setKeyboardTracking", "false"),
			qnx.callExtensionMethod("webview.createTouchInputSession", iris.chromeId),
			PUBLIC_BUILD ? qnx.callExtensionMethod("webview.setAllowWebInspection", iris.chromeId, iris.chromeId, !1) : qnx.callExtensionMethod("webview.setInputLogFromPPSEnabled", iris.chromeId, !0);
			var t = 2 * Math.max(screen.width, screen.height);
			qnx.callExtensionMethod("webview.setLayerTilerPrefillRect", iris.chromeId, 0, 0, t, t),
			e("iris/rotation.helper").addWebview(iris.chromeId, r, a)
		}
		function timerAndCompleteListener() {
			window.startupTimer.log("initialization window load");
			var t = e("iris/application");
			u.on("application.systemFontChange", i),
			i(t.systemFontFamily, t.systemFontSize);
			var n = e("iris/job.runner").createParallel();
			n.addJob(),
			c.TIER1_REQUIRES.forEach(e),
			window.chrome = {
				internal : e("iris/internal"),
				"native" : e("iris/native")
			},
			window.startupTimer.log("emit tier1 event start"),
			u.emit("browser.init.tier1", [n], !0),
			window.startupTimer.log("emit tier1 event end"),
			o(),
			n.addJob(),
			window.webkitRequestAnimationFrame(function () {
				window.webkitRequestAnimationFrame(function () {
					window.startupTimer.log("showing application window"),
					qnx.callExtensionMethod("applicationWindow.setVisible", "true");
					var e = window.performance.now();
					u.once("tabs.created", function () {
						var t = (window.performance.now() - e) / 1e3;
						console.log("com.flashbrowser.testRel_sys_browsera7a5dd07 ready for user input, took " + t + " seconds")
					}),
					n.jobComplete()
				})
			}),
			u.on("InvokeRequestEvent", function (t, n) {
				var i = JSON.parse(n),
				r = e("iris/tabs/controller").getTabForWebviewId(t),
				a = e("iris/invoke.utils");
				i.uri ? a.invokeUri(r, i.uri) : i.mimeType ? a.invokeByType(r, i.mimeType) : a.closeChildCard()
			}),
			u.on("application.active", function () {
				e("iris/utils").setApplicationActive(iris.chromeId, !0)
			}),
			u.on("application.inactive", function () {
				e("iris/utils").setApplicationActive(iris.chromeId, !1)
			}),
			u.on("application.pooling", function () {
				t.setPooled(!1)
			}),
			window.startupTimer.log("browser initialisation complete - waiting for tier1 blocking jobs to complete"),
			n.jobComplete(function () {
				window.startupTimer.log("all tier1 blocking jobs complete"),
				c.preTier2(),
				c.TIER2_REQUIRES.forEach(e),
				window.startupTimer.log("tier2 start"),
				u.emit("browser.init.tier2")
			})
		}
		var c,
		l,
		d,
		u = e("iris/event");
		d = {
			begin : function (t) {
				window.localStorage && window.startupTimer.log("initialisation start"),
				document.write('<link rel="stylesheet" type="text/css" href="styles/design-unit-' + e("iris/device").getDesignUnitBucket() + '.css">'),
				window.addEventListener("unload", function () {
					e("iris/tabs/controller").removeAllTabs(),
					e("iris/analytics").shutdown()
				}),
				window.iris = {
					chromeId : 1,
					chromeZOrder : 3,
					chromeMode : function () {
						return l
					}
				},
				"Normal" === t || "Restricted" === t ? l = t : (console.log("Invalid chrome mode set. Setting chrome mode to Normal."), l = "Normal"),
				c = "Restricted" === l ? e("index.hotspot") : e("index"),
				c.PREINIT_REQUIRES.forEach(e),
				window.addEventListener("load", timerAndCompleteListener),
				u.once("webpage.load.progress", function () {
					window.startupTimer.log("first tab ready"),
					document.getElementById("screen-area").classList.remove("background"),
					c.TIER3_REQUIRES.forEach(e),
					u.emit("browser.startup.complete", [], !1),
					u.emit("browser.init.tier3", [], !1),
					u.emit("automation.init", [], !1),
					e("iris/device").spatialNavigationEnabled() && qnx.callExtensionMethod("webview.setEnableSpatialNavigation", iris.chromeId, !0)
				})
			}
		},
		n.exports = d
	}), define("iris/storage", function (e, t, n) {
		function i(e, t) {
			console.log(t.message)
		}
		function r(e, t) {
			for (var n = 0; t.rows.length > n; n++)
				e.executeSql("DELETE FROM tags WHERE tags.id = ?", [t.rows.item(n).id], null, i)
		}
		function a(e, t) {
			for (var n = [], r = [], a = 0; t.rows.length > a; a++)
				e.executeSql("DELETE FROM urls WHERE id = ?", [t.rows.item(a).id], null, i), n.push(t.rows.item(a).id), r.push(t.rows.item(a).iconUrl);
			n.length && M.emit("urls.removed", [n, r])
		}
		function o(e) {
			e.executeSql("SELECT tags.id FROM tags LEFT OUTER JOIN bookmarktags ON tags.id = bookmarktags.tagKey WHERE bookmarktags.id IS NULL;", [], function (e, t) {
				r(e, t)
			}, i)
		}
		function s(e) {
			e.executeSql("SELECT urls.id, urls.iconUrl FROM urls LEFT OUTER JOIN bookmarks ON bookmarks.urlKey = urls.id LEFT OUTER JOIN history ON history.urlKey = urls.id WHERE history.urlKey IS NULL AND bookmarks.urlKey IS NULL;", [], function (e, t) {
				a(e, t)
			}, i)
		}
		function c(e, t, n) {
			e.executeSql("UPDATE bookmarks SET title = ? WHERE id = ?;", [n, t], null, i)
		}
		function l(e, t, n) {
			e.executeSql("UPDATE bookmarks SET urlKey = ? WHERE id = ?", [t, n], null, i)
		}
		function d(e, t, n) {
			t.lastVisitTime || (t.lastVisitTime = (new Date).getTime()),
			e.executeSql("INSERT INTO urls (url, title, lastVisited, frecency, iconUrl) values(?, ?, ?, ?, ?);", [t.url, t.title, t.lastVisitTime, t.incrementalFrecency || 0, t.iconUrl || null], function (e, i) {
				t.urlId = i.insertId,
				t.incrementalFrecency = t.incrementalFrecency || 0,
				t.iconUrl = t.iconUrl || "",
				M.emit("url.added", [[t]]),
				n && n(e, i)
			}, i)
		}
		function u(e, t, n) {
			e.executeSql("UPDATE urls SET title = ? WHERE id = ?", [n, t], function () {
				M.emit("url.titleUpdated", [t, n])
			}, i)
		}
		function m(e, t, n, r) {
			e.executeSql("SELECT id FROM urls WHERE url = ?", [n], function (e, a) {
				0 === a.rows.length ? d(e, {
					url : n,
					title : t.title
				}, function (e, n) {
					l(e, n.insertId, t.id),
					r && r(),
					s(e)
				}, i) : (l(e, a.rows.item(0).id, t.id), s(e), r && r())
			}, i)
		}
		function f(e, t, n) {
			e.executeSql("INSERT INTO bookmarktags (bookmarkKey, tagKey) values(?, ?);", [n, t], null, i)
		}
		function p(e, t, n, r, a) {
			var o = U.createParallel(a && a.bind(this, e));
			n.forEach(function (n) {
				o.addJob(),
				e.executeSql("SELECT id FROM tags WHERE tag = ?;", [n], function (e, a) {
					if (0 === a.rows.length)
						o.addJob(), e.executeSql("INSERT INTO tags (tag) values(?);", [n], function (e, i) {
							r && r(n),
							f(e, i.insertId, t),
							o.jobComplete()
						}, i);
					else {
						var s = a.rows.item(0).id;
						f(e, s, t)
					}
					o.jobComplete()
				}, i)
			})
		}
		function g(e, t, n, r) {
			e.executeSql("INSERT INTO bookmarks (urlKey, title) values(?, ?);", [t, n.title], function (e, t) {
				n.tags && p(e, t.insertId, n.tags),
				r && (n.id = t.insertId, r(n))
			}, i)
		}
		function h(e, t, n, r) {
			if (0 === t.rows.length)
				d(e, n, function (e, t) {
					g(e, t.insertId, n, r)
				}, i);
			else {
				var a = t.rows.item(0).id;
				e.executeSql("SELECT id, title FROM bookmarks WHERE urlKey = ?", [a], function (e, t) {
					0 === t.rows.length ? g(e, a, n, r) : (c(e, a, n.title), r && r(n))
				}, i)
			}
		}
		function v(e, t, n) {
			for (var i = [], r = 0; t.rows.length > r; r++) {
				var a = {};
				P.extend(a, t.rows.item(r)),
				a.tags = a.tags ? a.tags.split(",") : [],
				i.push(a)
			}
			n(i)
		}
		function b(e, t) {
			var n;
			e.rows.length && (n = {}, P.extend(n, e.rows.item(0)), n.tags = n.tags ? n.tags.split(",") : []),
			t(n)
		}
		function E(e, t, n) {
			for (var i = [], r = 0; t.rows.length > r; r++)
				i.push(t.rows.item(r));
			n(i)
		}
		function w(e, t, n, i) {
			for (var r = [], a = 0; t.rows.length > a; a++)
				r.push(t.rows.item(a));
			for (a = 0; n.rows.length > a; a++)
				r.push(n.rows.item(a));
			i(r)
		}
		function T(e, t, n, r) {
			e.executeSql("SELECT url, urls.title as title, bookmarks.title as bookmarkTitle, frecency, lastvisited, (SELECT GROUP_CONCAT(tags.tag) FROM TAGS tags, BOOKMARKTAGS btags WHERE btags.BOOKMARKKEY = bookmarks.ID AND btags.TAGKEY = tags.id) as bookmarktags FROM urls LEFT JOIN bookmarks ON urls.id = bookmarks.urlKey WHERE url LIKE ? OR urls.title LIKE ? OR bookmarks.title LIKE ? OR bookmarktags LIKE ? EXCEPT SELECT url, urls.title as title, bookmarks.title as bookmarkTitle, frecency, lastvisited, (SELECT GROUP_CONCAT(tags.tag) FROM TAGS tags, BOOKMARKTAGS btags WHERE btags.BOOKMARKKEY = bookmarks.ID AND btags.TAGKEY = tags.id) as bookmarktags FROM urls LEFT JOIN bookmarks ON urls.id = bookmarks.urlKey WHERE url LIKE ? OR url LIKE ? OR url LIKE ? OR urls.title LIKE ? OR bookmarks.title LIKE ? OR bookmarktags LIKE ? ORDER BY frecency DESC, lastVisited DESC LIMIT 20", ["%" + n.searchText + "%", "%" + n.searchText + "%", "%" + n.searchText + "%", "%" + n.searchText + "%", n.searchText + "%", "%www." + n.searchText + "%", "%://" + n.searchText + "%", n.searchText + "%", n.searchText + "%", n.searchText + "%"], function (e, n) {
				w(e, t, n, r)
			}, i)
		}
		function y(e, t) {
			var n;
			if (e.rows.length) {
				var i = e.rows.item(0),
				r = Object.keys(i);
				n = i[r[0]]
			}
			t(n)
		}
		function I(e, t, n) {
			if (t.length) {
				var r = "INSERT INTO urls (url, title, lastVisited, frecency, iconUrl) VALUES";
				r += Array(t.length + 1).join(" (?, ?, ?, ?, ?),").slice(0, -1);
				var a = [];
				t.forEach(function (e) {
					a.push(e.url),
					a.push(e.title),
					a.push(e.lastVisitTime),
					a.push(e.incrementalFrecency),
					a.push(e.iconUrl)
				}),
				e.executeSql(r, a, function (e, i) {
					for (var r = 0; t.length > r; r++)
						t[t.length - 1 - r].urlId = i.insertId - r, t[r].incrementalFrecency = t[r].incrementalFrecency || 0, t[r].iconUrl = t[r].iconUrl || "";
					M.emit("url.added", [t]),
					n && n(e, t)
				}, i)
			}
		}
		function S(e, t, n) {
			if (t) {
				var r = "INSERT INTO history (urlKey, timestamp, transition) VALUES";
				r += Array(t.length + 1).join(" (?, ?, ?),").slice(0, -1);
				var a = [];
				t.forEach(function (e) {
					a.push(e.urlId),
					a.push(e.lastVisitTime),
					a.push(e.transition)
				}),
				e.executeSql(r, a, function () {
					n && n(t)
				}, i)
			}
		}
		function x(e, t, n, r) {
			var a = [],
			o = [];
			if (n.forEach(function (e, n) {
					e.isUrlFirstVisit = t.rows.item(n).id ? !1 : !0,
					e.isUrlFirstVisit ? (e.lastVisitTime || (e.lastVisitTime = (new Date).getTime()), e.incrementalFrecency || (e.incrementalFrecency = 0), e.iconUrl || (e.iconUrl = null), a.push(e)) : (e.urlId = t.rows.item(n).id, o.push(e))
				}), o.length) {
				var s = Array(o.length + 1).join(" UPDATE urls SET title = ?, lastVisited = ?, frecency = frecency + ? WHERE id = ?"),
				c = [];
				o.forEach(function (e) {
					c.push(e.title),
					c.push(e.lastVisitTime),
					c.push(e.incrementalFrecency),
					c.push(e.urlId)
				}),
				e.executeSql(s, c, null, i)
			}
			a.length ? I(e, a, function (e, t) {
				var n = o.concat(t);
				S(e, n, r)
			}) : S(e, o, r)
		}
		function C(e, t, n, i) {
			0 === t.rows.length ? d(e, {
				url : n,
				title : i
			}) : t.rows.item(0).title != i && u(e, t.rows.item(0).id, i)
		}
		function k(e, t, n) {
			for (var i = Array(t.rows.length), r = 0; t.rows.length > r; r++) {
				var a = {};
				if (P.extend(a, t.rows.item(r)), a.bookmarkid) {
					var o = {};
					o.id = a.bookmarkid,
					o.url = a.url,
					o.title = a.bookmarktitle ? a.bookmarktitle : "",
					o.tags = a.bookmarktags ? a.bookmarktags.split(",") : [],
					a.bookmark = o
				}
				delete a.bookmarkid,
				delete a.bookmarktitle,
				delete a.bookmarktags,
				i[r] = a
			}
			n(i)
		}
		function A(e, t, n) {
			for (var r = "SELECT u1.url, u2.id FROM (SELECT ? AS URL, ? AS INDEX_POS", a = [], o = 0; t.length > o; o++)
				a.push(t[o].url), a.push(o);
			r += Array(t.length).join(" UNION SELECT ? AS URL, ? AS INDEX_POS"),
			r += ") u1 LEFT JOIN URLS u2 ON u1.url = u2.url ORDER BY u1.INDEX_POS",
			e.executeSql(r, a, function (e, i) {
				x(e, i, t, n)
			}, i)
		}
		function N(e, t, n, r) {
			for (var a; (a = t.splice(0, 500)).length; ) {
				var o = Array(a.length + 1).join("?,").slice(0, -1),
				s = "UPDATE urls SET " + n + " = ? WHERE id IN (" + o + ")";
				e.executeSql(s, [r].concat(a), null, i)
			}
		}
		function L(e) {
			e.executeSql("CREATE TABLE urls(id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT NOT NULL UNIQUE, title TEXT, iconUrl TEXT, lastVisited timestamp INTEGER DEFAULT 0, frecency INTEGER DEFAULT 0);", [], null, i),
			e.executeSql("CREATE TABLE bookmarks(id INTEGER PRIMARY KEY AUTOINCREMENT, urlKey INTEGER UNIQUE, title TEXT, FOREIGN KEY (urlKey) REFERENCES urls (id));", [], null, i),
			e.executeSql("CREATE TABLE history(id INTEGER PRIMARY KEY AUTOINCREMENT, urlKey INTEGER, timestamp INTEGER, transition TEXT, FOREIGN KEY (urlKey) REFERENCES urls (id));", [], null, i),
			e.executeSql("CREATE TABLE tags(id INTEGER PRIMARY KEY AUTOINCREMENT, tag TEXT UNIQUE NOT NULL);", [], null, i),
			e.executeSql("CREATE TABLE bookmarktags(id INTEGER PRIMARY KEY AUTOINCREMENT, bookmarkKey INTEGER, tagKey INTEGER, FOREIGN KEY (tagKey) REFERENCES tags (id), FOREIGN KEY (bookmarkKey) REFERENCES bookmarks (id));", [], null, i),
			e.executeSql("CREATE INDEX history_idx ON HISTORY(urlKey, timestamp DESC);", [], null, i),
			e.executeSql("CREATE INDEX url_idx ON URLS(url);", [], null, i),
			M.emit("storage.created")
		}
		function _(e, t, n) {
			t.rows.length > 0 ? n(t.rows.item(0).iconUrl) : n()
		}
		var R,
		O,
		D,
		B,
		M = e("iris/event"),
		P = e("iris/utils"),
		U = e("iris/job.runner"),
		F = e("iris/on.demand"),
		H = {
			"" : L
		};
		R = {
			init : function (e, t) {
				D = e ? e : "bookmarks_history";
				var n = "";
				B = t ? t : "Bookmarks and History";
				var i = 10485760;
				O = window.openDatabase(D, n, B, i);
				var r = H[O.version];
				r && O.changeVersion(O.version, "1.0", r),
				M.emit("storage.init")
			},
			wipe : function () {
				O.transaction(function (e) {
					e.executeSql("DELETE FROM urls;", [], null, i),
					e.executeSql("DELETE FROM bookmarks;", [], null, i),
					e.executeSql("DELETE FROM history;", [], null, i),
					e.executeSql("DELETE FROM bookmarktags;", [], null, i),
					e.executeSql("DELETE FROM tags;", [], null, i)
				})
			},
			topUrls : function (e) {
				R.getURLs({
					searchText : "",
					noTitle : ""
				}, e)
			},
			addBookmark : function (e, t) {
				O.transaction(function (n) {
					n.executeSql("SELECT id FROM urls WHERE url = ?", [e.url], function (n, i) {
						h(n, i, e, t)
					}, i)
				})
			},
			editBookmark : function (e, t, n) {
				O.transaction(function (i) {
					t.url ? m(i, e, t.url, n) : n && n(),
					t.title && c(i, e.id, t.title)
				})
			},
			deleteBookmarksWithId : function (e, t) {
				O.transaction(function (n) {
					function r(e) {
						t && t(),
						s(e),
						o(e)
					}
					for (var a, c, l = e.map(function (e) {
								return e.id
							}); (a = l.splice(0, 500)).length; )
						c = Array(a.length + 1).join("?,").slice(0, -1), n.executeSql("DELETE FROM bookmarktags WHERE bookmarkKey IN (" + c + ")", a, null, i), n.executeSql("DELETE FROM bookmarks WHERE id IN (" + c + ")", a, r.bind(this, n), i)
				})
			},
			deleteBookmarksWithUrl : function (e, t) {
				O.transaction(function (n) {
					function r(e, n) {
						if (n.rows.length) {
							for (var i = [], r = 0; n.rows.length > r; r++)
								i.push(n.rows.item(r));
							R.deleteBookmarksWithId(i, t)
						} else
							t && t()
					}
					for (var a, o, s = e.map(function (e) {
								return e.url
							}); (a = s.splice(0, 500)).length; )
						o = Array(a.length + 1).join("?,").slice(0, -1), n.executeSql("SELECT bm.id as id FROM BOOKMARKS bm, URLS u WHERE bm.URLKEY = u.ID and u.url IN (" + o + ")", a, r, i)
				})
			},
			getBookmark : function (e, t) {
				O.transaction(function (n) {
					n.executeSql("SELECT bm.id as id, u.url as url, u.iconUrl as iconUrl, u.frecency as frecency, bm.title as title, (SELECT GROUP_CONCAT(t2.tag) FROM TAGS t2, BOOKMARKTAGS bmt2 WHERE bmt2.BOOKMARKKEY = bm.ID AND bmt2.TAGKEY = t2.id) as tags FROM BOOKMARKS bm, URLS u WHERE bm.URLKEY = u.ID AND u.URL = ?", [e], function (e, n) {
						b(n, t)
					}, i)
				})
			},
			getBookmarks : function (e, t) {
				O.transaction(function (n) {
					n.executeSql("SELECT bm.id as id, u.url as url, u.iconUrl as iconUrl, bm.title as title, (SELECT GROUP_CONCAT(t2.tag) FROM TAGS t2, BOOKMARKTAGS bmt2 WHERE bmt2.BOOKMARKKEY = bm.ID AND bmt2.TAGKEY = t2.id) as tags, u.lastVisited FROM BOOKMARKS bm, URLS u WHERE bm.URLKEY = u.ID AND (bm.title like ? OR u.url like ? OR tags LIKE ?) ORDER BY u.FRECENCY DESC, u.LASTVISITED DESC", [e.title, e.url, e.tag], function (e, n) {
						v(e, n, t)
					}, i)
				})
			},
			getBookmarkUrls : function (e) {
				O.transaction(function (t) {
					t.executeSql("SELECT bm.id as id, u.url as url FROM BOOKMARKS bm, URLS u WHERE bm.URLKEY = u.ID", [], function (t, n) {
						E(t, n, e)
					}, i)
				})
			},
			getTitle : function (e, t) {
				O.transaction(function (n) {
					n.executeSql("SELECT urls.title FROM urls WHERE url = ?", [e], function (e, n) {
						y(n, t)
					}, i)
				})
			},
			getURLs : function (e, t) {
				O.transaction(function (n) {
					n.executeSql("SELECT url, urls.title, bookmarks.title as bookmarkTitle, iconUrl, frecency, lastVisited, (SELECT GROUP_CONCAT(tags.tag) FROM TAGS tags, BOOKMARKTAGS btags WHERE btags.BOOKMARKKEY = bookmarks.ID AND btags.TAGKEY = tags.id) as bookmarktags FROM urls LEFT JOIN bookmarks ON urls.id = bookmarks.urlKey WHERE url LIKE ? OR urls.title LIKE ? OR (LENGTH(urls.title) = 0 AND ? LIKE ?) OR bookmarks.title LIKE ? OR bookmarktags LIKE ? ORDER BY frecency DESC, lastVisited DESC LIMIT 20", ["%" + e.searchText + "%", "%" + e.searchText + "%", e.noTitle, "%" + e.searchText + "%", "%" + e.searchText + "%", "%" + e.searchText + "%"], function (e, n) {
						E(e, n, t)
					}, i)
				})
			},
			getWeightedURLs : function (e, t) {
				O.transaction(function (n) {
					n.executeSql("SELECT url, urls.title, bookmarks.title as bookmarkTitle, frecency, (SELECT GROUP_CONCAT(tags.tag) FROM TAGS tags, BOOKMARKTAGS btags WHERE btags.BOOKMARKKEY = bookmarks.ID AND btags.TAGKEY = tags.id) as bookmarktags FROM urls LEFT JOIN bookmarks ON urls.id = bookmarks.urlKey WHERE url LIKE ? OR url LIKE ? OR url LIKE ? OR urls.title LIKE ? OR (LENGTH(urls.title) = 0 AND ? LIKE ?) OR bookmarks.title LIKE ? OR bookmarktags LIKE ? ORDER BY frecency DESC, lastVisited DESC LIMIT 20", [e.searchText + "%", "%www." + e.searchText + "%", "%://" + e.searchText + "%", e.searchText + "%", e.noTitle, e.searchText + "%", e.searchText + "%", e.searchText + "%"], function (n, i) {
						T(n, i, e, t)
					}, i)
				})
			},
			getAllURLs : function (e) {
				O.transaction(function (t) {
					t.executeSql("SELECT url FROM urls", [], function (t, n) {
						E(t, n, e)
					}, i)
				})
			},
			getLeastUsedScreenshots : function (e, t) {
				O.transaction(function (n) {
					n.executeSql("SELECT urls.id, iconUrl FROM urls LEFT JOIN bookmarks ON urls.id = urlKey WHERE urlKey IS NULL AND iconUrl IS NOT NULL ORDER BY frecency DESC, lastvisited DESC LIMIT 1000 OFFSET ?", [e], function (e, n) {
						E(e, n, t)
					}, i)
				})
			},
			getScreenshots : function (e) {
				O.transaction(function (t) {
					t.executeSql("SELECT iconUrl FROM urls WHERE iconUrl IS NOT NULL", [], function (t, n) {
						E(t, n, e)
					}, i)
				})
			},
			updateIcon : function (e, t, n) {
				O.transaction(function (r) {
					r.executeSql("UPDATE urls SET iconUrl = ? WHERE url = ?", [t, e], function (i, r) {
						1 === r.rowsAffected ? M.emit("url.screenshot.onUpdated", [e, t]) : 0 === r.rowsAffected && console.warn("Attempting to update icon for a url not in the db. Possible leak on fs."),
						n && n()
					}, i)
				})
			},
			resetIcons : function (e) {
				O.transaction(function (t) {
					N(t, e.slice(0), "iconUrl", null)
				})
			},
			getIconUrl : function (e, t) {
				O.transaction(function (n) {
					n.executeSql("SELECT iconUrl FROM urls WHERE url = ?", [e], function (e, n) {
						_(e, n, t)
					}, i)
				})
			},
			getIconUrls : function (e, t) {
				O.transaction(function (n) {
					var r = e.map(function (e) {
							return e.url || ""
						}),
					a = "SELECT count(1) count, url, title, iconUrl FROM urls WHERE url = ?";
					a += Array(r.length).join(" UNION ALL SELECT count(1) count, url, title, iconUrl FROM urls WHERE url = ?"),
					n.executeSql(a, r, function (e, n) {
						E(e, n, t)
					}, i)
				})
			},
			getHistory : function (e) {
				O.transaction(function (t) {
					t.executeSql("SELECT urlKey as id, timestamp as lastVisitTime, transition FROM history ORDER BY urlKey, timestamp DESC", [], function (t, n) {
						k(t, n, e)
					}, i)
				})
			},
			addHistoryList : function (e, t) {
				O.transaction(function (n) {
					A(n, e, t)
				})
			},
			getHistoryDates : function (e, t, n) {
				O.transaction(function (r) {
					for (var a = "", o = e.length / (t ? 4 : 2), s = 0; o > s; s++)
						0 !== s && (a += "UNION ALL "), a += "SELECT COUNT(1) AS HAS_RESULTS FROM HISTORY h WHERE h.TIMESTAMP BETWEEN ? AND ? ", t && (a += "AND h.TIMESTAMP NOT BETWEEN ? AND ?");
					r.executeSql(a, e, function (e, t) {
						k(e, t, n)
					}, i)
				})
			},
			searchHistory : function (e, t) {
				O.transaction(function (n) {
					n.executeSql("SELECT u.url, u.title, u.iconUrl, h.timestamp as lastVisitTime, h.transition, h.id FROM HISTORY h, URLS u WHERE h.urlKey = u.id AND h.timestamp between ? AND ? ORDER BY h.timestamp DESC", [e.startTime, e.endTime], function (e, n) {
						k(e, n, t)
					}, i)
				})
			},
			getUniqueHistoryVisits : function (e, t) {
				O.transaction(function (n) {
					n.executeSql("SELECT u.url, u.title, u.iconUrl, u.id, MAX(h.timestamp) as 'timestamp', b.id as bookmarkid, b.title as bookmarktitle, (SELECT GROUP_CONCAT(t2.tag) FROM TAGS t2, BOOKMARKTAGS b2 WHERE b2.BOOKMARKKEY = b.ID AND b2.TAGKEY = t2.id) as bookmarktags FROM HISTORY h, URLS u LEFT JOIN BOOKMARKS b ON u.id = b.urlKey WHERE h.urlKey = u.id AND h.timestamp between ? AND ? AND (u.title like ? OR (LENGTH(u.title) = 0 AND ? like ?) OR u.url like ?) GROUP BY u.url ORDER BY h.timestamp DESC", [e.startTime, e.endTime, e.title, e.noTitle, e.title, e.url], function (e, n) {
						k(e, n, t)
					}, i)
				})
			},
			getLastVisitedTime : function (e, t) {
				O.transaction(function (n) {
					n.executeSql("SELECT lastVisited FROM urls WHERE url = ?", [e], function (e, n) {
						y(n, t)
					}, i)
				})
			},
			deleteHistoryRange : function (e, t) {
				O.transaction(function (n) {
					n.executeSql("DELETE from history WHERE timestamp < ? AND timestamp > ?", [e.endTime, e.startTime], function () {
						t && t()
					}, i),
					s(n)
				})
			},
			deleteHistoryForURL : function (e, t) {
				O.transaction(function (n) {
					n.executeSql("DELETE FROM history WHERE id IN ( SELECT history.id FROM history, urls WHERE urls.id = history.urlKey AND url = ? )", [e], function () {
						t && t()
					}, i),
					s(n)
				})
			},
			deleteHistoryRangeForURL : function (e, t) {
				O.transaction(function (n) {
					n.executeSql("DELETE FROM history WHERE id IN ( SELECT history.id FROM history, urls WHERE urls.id = history.urlKey AND url = ? and history.timestamp BETWEEN ? AND ? )", [e.url, e.startTime, e.endTime], function () {
						t && t()
					}, i),
					s(n)
				})
			},
			batchDeleteHistoryRangeForURLs : function (e, t, n) {
				O.transaction(function (r) {
					for (var a, o; (a = e.splice(0, 500)).length; )
						o = Array(a.length + 1).join("?,").slice(0, -1), r.executeSql("DELETE FROM history WHERE id IN ( SELECT history.id FROM history, urls WHERE urls.id = history.urlKey AND url IN (" + o + ") and history.timestamp BETWEEN ? AND ? )", a.concat([t, n]), null, i);
					s(r)
				})
			},
			getBookmarksWithTag : function (e, t) {
				O.transaction(function (n) {
					n.executeSql("SELECT bm.id as id, u.url as url, u.iconUrl as iconUrl, bm.title as title, (SELECT GROUP_CONCAT(t2.tag) FROM TAGS t2, BOOKMARKTAGS bmt2 WHERE bmt2.BOOKMARKKEY = bm.ID AND bmt2.TAGKEY = t2.id) as tags FROM BOOKMARKS bm, URLS u, BOOKMARKTAGS bmt, TAGS t WHERE bm.URLKEY = u.ID AND bm.ID = bmt.BOOKMARKKEY AND bmt.TAGKEY = t.ID AND t.tag = ? ORDER BY u.FRECENCY DESC, u.LASTVISITED DESC", [e], function (e, n) {
						v(e, n, t)
					}, i)
				})
			},
			getTagHistogram : function (e, t) {
				O.transaction(function (n) {
					n.executeSql("SELECT tags.id AS id, tag AS name, COUNT(tags.id) AS count FROM bookmarktags INNER JOIN tags ON tags.id = bookmarktags.tagKey WHERE tag LIKE ? GROUP BY tagKey ORDER BY count DESC, name ASC", [e], function (e, n) {
						E(e, n, t)
					}, i)
				})
			},
			editTag : function (e, t) {
				O.transaction(function (n) {
					n.executeSql("UPDATE tags SET tag = ? WHERE tags.id = ?", [e.name, e.id], function () {
						t && t(e)
					}, i)
				})
			},
			deleteTags : function (e, t) {
				O.transaction(function (n) {
					for (var r, a, o = e.map(function (e) {
								return e.id
							}); (r = o.splice(0, 500)).length; )
						a = Array(r.length + 1).join("?,").slice(0, -1), n.executeSql("DELETE FROM bookmarktags WHERE tagKey IN (" + a + ")", r, null, i), n.executeSql("DELETE FROM tags WHERE id IN (" + a + ")", r, t.bind(this, e), i)
				})
			},
			updateBookmarkTags : function (e, t, n) {
				O.transaction(function (r) {
					r.executeSql("DELETE FROM bookmarktags WHERE bookmarkKey = ?", [e.id], null, i),
					p(r, e.id, t, n, o)
				})
			},
			updateFrecency : function (e) {
				O.transaction(function (t) {
					for (var n in e)
						N(t, e[n].slice(0), "frecency", n)
				})
			},
			incrementFrecency : function (e, t, n) {
				O.transaction(function (r) {
					r.executeSql("UPDATE urls SET frecency = frecency + ? WHERE url = ?", [t, e], function () {
						n && n()
					}, i)
				})
			},
			setBookmarkViewSelected : function (e) {
				P.toLocal("bookmark.view.selected", e)
			},
			getBookmarkViewSelected : function () {
				return localStorage.getItem("bookmark.view.selected")
			},
			updateUrlTitle : function (e, t) {
				O.transaction(function (n) {
					n.executeSql("SELECT id, title FROM urls WHERE url = ?", [e], function (n, i) {
						C(n, i, e, t)
					}, i)
				})
			},
			getTags : function (e) {
				O.transaction(function (t) {
					t.executeSql("SELECT id, tag as name FROM tags", [], function (t, n) {
						E(t, n, e)
					}, i)
				})
			}
		},
		F.wrapModule(R, R.init, ["setBookmarkViewSelected", "getBookmarkViewSelected"]),
		n.exports = R
	}), define("iris/swoop", function (e, t, n) {
		var i,
		r = e("iris/event"),
		a = e("iris/carrier.bookmarks"),
		o = e("iris/carrier.search"),
		s = e("iris/pps"),
		c = e("iris/utils"),
		l = "/pps/services/carrier_config/browser/carrier";
		i = {
			init : function (t) {
				t = t || e("iris/job.runner").createParallel();
				var n = s.create(l, s.PPSMode.FULL);
				return t.addJob(function () {
					n.onFirstReadComplete = function (e) {
						i.onPPSChange(e, t)
					}
				}),
				n.onNewData = i.onPPSChange,
				n.open(s.FileMode.RDONLY) ? void 0 : (t.jobComplete(), console.error("Cannot open swoop PPS object at " + l), void 0)
			},
			onPPSChange : function (t, n) {
				if (t) {
					var i = e("iris/job.runner").createParallel(function () {
							r.emit("iris.swoop.completed", []),
							n && n.jobComplete()
						});
					i.addJob();
					var s;
					t.carrier && t.carrier.bookmarks ? Array.isArray(t.carrier.bookmarks) ? s = t.carrier.bookmarks : console.error("SWOOP: invalid bookmark input") : s = a.defaultBookmarks();
					var l = JSON.stringify(s);
					if (l && l != localStorage.getItem("iris.swoop.bookmarks.key") && i.addJob(function () {
							var t = e("iris/job.runner").createParallel(function () {
									i.addJob(function () {
										var e = function () {
											console.log("Swoop carrier bookmarks complete"),
											c.toLocal("iris.swoop.bookmarks.key", l)
										},
										t = a.addAll(s, function () {
												i.jobComplete()
											}, e);
										t || console.error("SWOOP: invalid bookmark input")
									}),
									i.jobComplete()
								});
							t.addJob(),
							t.addJob(),
							a.swapCarriers(function () {
								t.jobComplete()
							}, function () {
								t.jobComplete()
							})
						}), t.carrier && t.carrier.search_providers) {
						var d = o.addAll(t.carrier.search_providers);
						d || console.error("SWOOP: invalid search provider input")
					}
					i.jobComplete()
				}
			}
		},
		r.on("browser.init.tier2", i.init),
		n.exports = i
	}), define("iris/tabs/controller", function (e, t, n) {
		var i,
		r = e("iris/event"),
		a = e("iris/tabs/tabs");
		i = {
			update : function (e, t, n) {
				a.update(e, t, n)
			},
			create : function (e) {
				return a.create(e)
			},
			createNewTab : function (e) {
				return a.createNewTab(e)
			},
			newTabUrl : function () {
				return a.newTabUrl()
			},
			remove : function (e) {
				return a.remove(e)
			},
			removeAllTabs : function () {
				a.removeAllTabs()
			},
			reset : function (e) {
				a.reset(e)
			},
			get : function (e) {
				return a.get(e)
			},
			getTabForWebviewId : function (e) {
				return a.getTabForWebviewId(e)
			},
			getAll : function () {
				return a.getAll()
			},
			getTabsByUrl : function () {
				if (!a)
					return {};
				var e = a.getAll(),
				t = {};
				return e.forEach(function (e) {
					t[e.url] = e
				}),
				t
			},
			getCurrentTabId : function () {
				return a.getCurrentTabId()
			},
			getSelected : function () {
				return a.getSelected()
			},
			getNewTabUrl : function () {
				return a.getNewTabUrl()
			},
			reposition : function (e) {
				a.reposition(e)
			},
			init : function () {
				a.init(e("plugins/tabbar/index"))
			},
			hasNetworkError : function (e) {
				return a.hasNetworkError(e)
			},
			getLatestScreenCapture : function (e, t, n) {
				a.getLatestScreenCapture(e, t, n)
			},
			requestScreenCapture : function (e, t, n, i) {
				a.requestScreenCapture(e, t, n, i)
			},
			getCurrentScreenCapture : function (e) {
				return a.getCurrentScreenCapture(e)
			},
			backSelected : function () {
				var e = a.getSelected(),
				t = a.getCurrentTabId();
				if (e.historyCanNavigateBack())
					qnx.callExtensionMethod("webview.goBack", e.webviewId);
				else if (e.parentId) {
					if (1 === a.getAll().length)
						return a.reset(t), delete e.parentId, void 0;
					e.webviewId ? qnx.callExtensionMethod("webview.destroyIfNotRejectedByUser", e.webviewId) : a.remove(t)
				}
			},
			forwardSelected : function () {
				var e = a.getSelected();
				qnx.callExtensionMethod("webview.goForward", e.webviewId)
			},
			stopSelected : function () {
				var e = a.getSelected();
				qnx.callExtensionMethod("webview.stop", e.webviewId),
				r.emit("tabs.stopped", [e.Id, {}, e])
			},
			reloadSelected : function () {
				var e = a.getSelected();
				qnx.callExtensionMethod("webview.reload", e.webviewId),
				r.emit("tabs.reloaded", [e.Id, {}, e])
			}
		},
		r.once("browser.init.tier1", i.init),
		n.exports = i
	}), define("iris/tabs/session", function (e, t, n) {
		function i() {
			var e = localStorage[d];
			return e ? JSON.parse(e) : null
		}
		function r(e) {
			return e.selected
		}
		function a() {
			if (!l.getValue(l.ENABLE_PRIVATE_BROWSING)) {
				var e = ["selected", "title", "url"],
				t = s.getAll().reduce(function (t, n) {
						return n.url && u.isValidUrl(n.url) && t.push(e.reduce(function (e, t) {
								return e[t] = n[t],
								e
							}, {})),
						t
					}, []);
				t.length > 0 && !t.some(r) && (t[0].selected = !0),
				localStorage[d] = JSON.stringify(t)
			}
		}
		var o,
		s = e("iris/tabs/controller"),
		c = e("iris/event"),
		l = e("iris/settings"),
		d = "iris-tab-session",
		u = e("iris/validation");
		o = {
			get : i,
			save : a
		},
		c.on("application.stateChange", function (e) {
			"fullscreen" !== e && a()
		}),
		n.exports = o
	}), define("iris/tabs/tabs", function (e, t, n) {
		function i(e) {
			if (b.currentState() !== b.CLOSED && b.currentState() !== b.CLOSING) {
				var t = I[d];
				t && t.webview.setTemporaryViewport(t.position.width, e - t.position.y)
			}
		}
		function r(e) {
			var t = I[e];
			return Boolean(t && t.webview && t.webview.historyCanNavigateBack())
		}
		function a(e) {
			var t = I[e];
			return Boolean(t && t.webview && t.webview.historyCanNavigateForward())
		}
		function o(e) {
			var t = I[e],
			n = t && t.webpage;
			return n ? t.webpage.getTitle() : ""
		}
		function s(e) {
			var t = I[e],
			n = t && t.webpage;
			return n ? t.webpage.getLoadProgressPercent() : 0
		}
		function c(e) {
			var t = I[e],
			n = t && t.webpage;
			return n ? t.webpage.getFavicon() : ""
		}
		function l(t, n) {
			t.webview.loadUrl(n),
			t.id !== d || e("screen/manager").currentScreen() !== e("plugins/screens/tab/index") || e("plugins/screens/tab/index").isShowingNewTabPage() || e("iris/keyboard.focus").setTabFocus()
		}
		var d,
		u,
		m,
		f,
		p,
		g,
		h,
		v = e("iris/event"),
		b = e("iris/keyboard"),
		E = e("iris/rotation.helper"),
		w = e("iris/utils"),
		T = e("iris/tabs/webpage"),
		y = e("iris/tabs/webview"),
		I = {},
		S = 500,
		x = {},
		C = "about:newtab",
		k = function (e, t) {
			I[e] && !I[e].resourceNetworkErrors && (I[e].resourceNetworkErrors = {}),
			I[e] && (I[e].resourceNetworkErrors[t.url] = t)
		},
		A = function (e) {
			if (I[e] && I[e].resourceNetworkErrors) {
				var t = I[e].resourceNetworkErrors[I[e].url];
				I[e].resourceNetworkErrors = {},
				t && (I[e].resourceNetworkErrors[I[e].url] = t)
			}
		},
		N = function (t, n, i, r, a) {
			n = n || screen.width,
			i = i || screen.height;
			var o = 0,
			s = e("plugins/screens/tab/index").xPosition(n),
			c = e("plugins/find_on_page/index"),
			l = I[t];
			o = c.isVisible() && c.getCurrentWebviewId() === l.webviewId ? e("plugins/find_on_page/index").height(r) : document.getElementById("top-dock").offsetHeight,
			l.position = e("iris/fullscreen").isFullScreen() ? {
				x : 0,
				y : 0,
				width : n,
				height : i
			}
			 : {
				x : s,
				y : o,
				width : n,
				height : i - o - e("plugins/navigationbar/index").minBarHeight()
			},
			E.setViewportAndCallBackAsNeeded(l.webviewId, l.position.x, l.position.y + e("plugins/screens/tab/index").yPosition(), l.position.width, l.position.height, a)
		},
		L = function (e, t) {
			var n = I[e];
			n && (t && (f(), N(e)), n.shouldBeVisible = t, u.setTabVisible(e, t))
		},
		_ = function (e, t) {
			PUBLIC_BUILD || console.log("WEBVIEW - onCreated tabId=" + e + " webviewId=" + t),
			x[t] = e,
			I[e].webviewId = t,
			delete I[e].pendingWebviewId,
			E.addWebview(t, function (e) {
				return x[e] === d
			}, function (e, t, n, i, r) {
				return N(x[e], t, n, i, r)
			});
			var n = I[e];
			n.securityInfo = n.webview.getSecurityInfo(),
			m.update(n.id, n, !0),
			d && I[d] || m.update(n.id, {
				selected : !0
			})
		},
		R = function (e) {
			v.un("PropertyLocationEvent", p),
			v.un("PropertyLocationEvent", g);
			var t = I[x[e]];
			t && (h(t.id, {
					url : t.oldUrl
				}), t.webpage && (delete t.webpage, T.destroy(t.id)), t.webpage = T.create(t.id, {
						url : t.oldUrl
					}))
		},
		g = function (e) {
			v.un("navigation.cancel", R, [e])
		},
		p = function (e) {
			var t = I[x[e]];
			t && (v.un("navigation.cancel", R), t.webview.clearBackForwardList())
		},
		h = function (e, t) {
			var n = I[e];
			n && (t.url && (t.url === C ? (t.truncatedUrl = void 0, t.truncatedHostUrl = void 0) : (t.truncatedUrl = w.truncateUrl(t.url), t.truncatedHostUrl = w.shortenUrl(t.url))), w.extend(n, t), v.emit("tabs.updated", [e, t, n]))
		},
		O = function () {
			m.getAll().forEach(function (e) {
				var t = {};
				e.webviewId ? (t.url = w.convertIDNtoReadableStringByLanguage(e.webview.getLocation()), e.webview.setDefaultTextEncoding(w.getDefaultTextEncodingForLocale())) : e.webpage && e.webpage.getUrl() && (t.url = w.convertIDNtoReadableStringByLanguage(e.webpage.getUrl())),
				h(e.id, t)
			})
		},
		D = function (e) {
			for (var t in I)
				I[t].webviewId && w.setApplicationActive(I[t].webviewId, e)
		},
		B = function (e, t) {
			I[d] && d != t && (h(d, {
					selected : !1
				}), L(d, !1)),
			d = t
		},
		M = function (e) {
			e.webview || (e.webview = y.create(), e.pendingWebviewId = e.webview.getId(), v.once("webview.created", _.bind(m, e.id), [e.webview.getId()]))
		},
		P = function (e) {
			T.destroy(e.id),
			e.webview && y.destroy(e.webview.getId()),
			E.removeWebview(e.webviewId),
			delete x[e.webviewId],
			delete e.webviewId,
			delete e.webview
		},
		U = function (e) {
			console.log("TAB - remove tabId=" + e.id + " webviewId=" + e.webviewId + " pendingWebviewId=" + e.pendingWebviewId),
			P(e);
			var t = Object.keys(I).indexOf("" + e.id);
			if (delete I[e.id], m.getAll().forEach(function (t) {
					t.parentId === e.id && m.update(t.id, {
						parentId : void 0
					})
				}), e.id === d) {
				var n = Object.keys(I);
				if (n.length) {
					var i;
					i = e.parentId ? Object.keys(I).indexOf("" + e.parentId) : t !== n.length ? t : n.length - 1,
					0 > i && (i = 0);
					var r = parseInt(n[i], 10);
					m.update(r, {
						selected : !0
					})
				} else
					console.error("Asked to remove final tab with id " + e.id + "."), d = void 0
			}
			return v.emit("tabs.removed", [e.id]),
			e
		};
		f = function () {
			var e = I[d];
			e && e.webview && e.webview.removeTemporaryViewport()
		},
		m = {
			update : function (e, t, n) {
				var i = I[e];
				if (i) {
					if (!i.webviewId)
						return t.selected && !I[d] && (d = e), h(e, t), t.selected && M(i), void 0;
					if (!n) {
						var r = [];
						if (Object.keys(t).forEach(function (e) {
								(t[e] !== i[e] || "url" === e) && r.push(e)
							}), !r.length)
							return;
						t = w.extend({}, t, r)
					}
					if (t.url && (n || (i.oldUrl = i.url, v.once("navigation.cancel", R, [i.webviewId]), v.once("PropertyLocationEvent", g, [i.webviewId])), t.url = w.resolveURL(t.url), "OpenWindow" !== t.type && (T.destroy(i.id), i.webpage = T.create(e, {
										url : t.url,
										transitionType : t.transitionType
									})), l(i, t.url)), t.selected) {
						if (n)
							return v.once("PropertyVisibleEvent", function () {
								I[e] && (B(e, i.id), t.transitionType && delete t.transitionType, h(e, t))
							}, [i.webviewId]), L(e, !0), void 0;
						B(e, i.id),
						L(e, !0)
					}
					t.transitionType && delete t.transitionType,
					h(e, t)
				}
			},
			create : function (e) {
				var t = {
					id : S++,
					selected : !1,
					securityInfo : {}

				};
				return t.historyCanNavigateBack = r.bind(this, t.id),
				t.historyCanNavigateForward = a.bind(this, t.id),
				t.getTitle = o.bind(this, t.id),
				t.getLoadProgressPercent = s.bind(this, t.id),
				t.getFavicon = c.bind(this, t.id),
				e.url && (t.webpage = T.create(t.id, {
							url : w.resolveURL(e.url),
							transitionType : e.transitionType
						})),
				I[t.id] = t,
				"webviewId" in e || M(t),
				d || (d = t.id),
				v.emit("tabs.created", [t]),
				PUBLIC_BUILD || console.log("TAB - created " + JSON.stringify(t)),
				h(t.id, e),
				e.selected && d !== t.id && h(d, {
					selected : !1
				}),
				t
			},
			createNewTab : function (t) {
				var n = e("plugins/screens/tab/index");
				if (t || n.currentViewType() === n.viewTypes.NEW_TAB_PAGE)
					return m.create({
						selected : !0,
						url : C
					});
				var i = {
					selected : !0,
					url : C,
					webviewId : null
				},
				r = m.create(i);
				return v.on("manager.view", function a(t, n) {
					t === e("plugins/views/new_tab_page/index") && "loadTransitionEnd" === n && (m.update(r.id, i, !0), v.un("manager.view", a))
				}),
				r
			},
			newTabUrl : function () {
				return C
			},
			remove : function (e) {
				var t = I[e];
				return t ? (U(t), e) : (console.warn("Asked to remove tab with id " + e + " but it was already gone. Odd."), void 0)
			},
			removeAllTabs : function () {
				for (var e in I) {
					var t = I[e];
					t.webviewId && P(t),
					delete I[e],
					v.emit("tabs.removed", [e])
				}
			},
			reset : function (e) {
				var t = I[e];
				if (t && t.webview) {
					if (t.url === C)
						return t.webview.clearBackForwardList(), void 0;
					t.oldUrl = t.url,
					l(t, C),
					t.webview.cancelVibration(),
					v.once("navigation.cancel", R, [t.webviewId]),
					v.once("PropertyLocationEvent", p, [t.webviewId])
				}
			},
			get : function (e) {
				return I[e]
			},
			getTabForWebviewId : function (e) {
				return I[x[e]]
			},
			getAll : function () {
				var e = [];
				for (var t in I)
					e.push(I[t]);
				return e
			},
			getCurrentTabId : function () {
				return I[d] || console.error("_currentTabId invalid: " + d + "\n", "All tab Info: " + I),
				d
			},
			getSelected : function () {
				return I[d] || console.error("_currentTabId invalid: " + d + "\n", "All tab info: " + I),
				I[d]
			},
			getNewTabUrl : function () {
				return C
			},
			reposition : function (e) {
				N(e)
			},
			init : function (t) {
				if (u || !t)
					throw Error("Cannot init tabs");
				u = t,
				y.init(),
				v.on("Destroyed", function (e) {
					console.log("WEBVIEW - Destroyed tabId=" + x[e] + " webviewId=" + e);
					var t = x[e],
					n = I[t];
					return t && n ? (U(n), Object.keys(I).length || (console.warn("Native destroyed the final tab, creating a new one"), m.createNewTab()), void 0) : (console.log("No need to remove tab, no longer tracked by its webview or has already been removed"), void 0)
				}),
				v.on("NetworkError", function (e, t) {
					k(x[e], t)
				}),
				v.on("PropertyLocationEvent", function (e, t) {
					h(x[e], {
						url : "" === t ? "about:blank" : w.convertIDNtoReadableStringByLanguage(t)
					}),
					A(x[e])
				}),
				v.on("PropertySecurityInfoEvent", function (e, t) {
					h(x[e], {
						securityInfo : t
					})
				}),
				v.on("application.lowMemory", function () {
					for (var e in I) {
						var t = I[e];
						!t.selected && t.webviewId && P(t)
					}
					I[d].webview && I[d].webview.notifySystemLowMemory(),
					qnx.callExtensionMethod("webview.notifySystemLowMemory", iris.chromeId)
				}),
				v.on("OpenWindow", function (e, t, n) {
					if (e !== iris.chromeId && "CREATE" === t.action && !t.isPopup && t.waitHandle) {
						t.parentId = x[e],
						t.selected = !0,
						delete t.url;
						var i;
						for (var r in I) {
							var a = I[r];
							if (a.windowName && a.windowName === t.windowName && a.parentId && a.parentId === t.parentId) {
								if (a.webviewId)
									return n.setView = "" + a.webviewId, m.update(a.id, {
										selected : !0
									}), void 0;
								i = a.pendingWebviewId;
								break
							}
						}
						i || (i = m.create(t).pendingWebviewId),
						v.once("Created", function () {
							qnx.callExtensionMethod("webview.openWindowResponse", e, t.waitHandle, i)
						}, [i]),
						n.setWait = !0
					}
				}),
				v.on("application.systemLanguageChange", O),
				v.on("LocationChange", function (e, t) {
					var n = x[e];
					I[n] && (t = JSON.parse(t), I[n].showFlashInfo = !1, I[n].webpage && I[n].webpage.handleLocationChange(t) || (T.destroy(n), I[n].webpage = T.create(n, {
									url : t.url,
									navigationType : t.navigationType
								})))
				}),
				v.on("application.active", function () {
					D(!0)
				}),
				v.on("application.inactive", function () {
					D(!1)
				}),
				v.on("keyboard.closed", f),
				v.on("actionbar.down", f),
				v.on("formcontrol.invisible", f),
				v.on("formcontrol.visible", function () {
					if (b.currentState() === b.CLOSED || b.currentState() === b.CLOSING) {
						var t = I[d];
						t && t.webview.setTemporaryViewport(t.position.width, screen.height - e("plugins/actionbar/index").barHeight() - t.position.y)
					}
				}),
				v.on("keyboard.position", function () {
					i(b.currentPosition())
				}),
				v.on("actionbar.up", function () {
					i(b.currentPosition() - e("plugins/actionbar/index").barHeight())
				})
			},
			hasNetworkError : function (e) {
				var t = I[e];
				return t && t.resourceNetworkErrors && t.resourceNetworkErrors[t.url] && 0 > t.resourceNetworkErrors[t.url].status ? !0 : !1
			},
			getLatestScreenCapture : function (e, t, n) {
				var i = I[e];
				i && i.webpage && i.webpage.getLatestScreenCapture(i, t, n)
			},
			requestScreenCapture : function (e, t, n, i) {
				var r = I[e];
				r && r.webpage && r.webpage.requestScreenCapture(t, n, i)
			},
			getCurrentScreenCapture : function (e) {
				var t = I[e];
				return t && t.webpage ? t.webpage.getCurrentScreenCapture() : void 0
			}
		},
		n.exports = m
	}), define("iris/tabs/webpage", function (e, t, n) {
		function i(t, n) {
			function i() {
				return "about" === D.protocol() || "local" === D.protocol() ? !0 : !1
			}
			function r() {
				if (!M && R === a.READY && !e("iris/tabs/controller").hasNetworkError(t) && !i() && F) {
					if (!m.getValue(m.ENABLE_PRIVATE_BROWSING)) {
						var n = {};
						n.transition = B,
						n.title = _.getTitle(),
						n.url = O,
						p.addVisit(n)
					}
					c.emit("webpage.loaded", [t, O], !0),
					M = !0
				}
			}
			function v(e) {
				if (R !== e) {
					var t = !0;
					switch (R) {
					case a.INITIALIZED:
						(e === a.REDIRECT || e === a.READY || e === a.LOAD_COMMITTED) && (t = !1);
						break;
					case a.REDIRECT:
						(e === a.READY || e === a.LOAD_COMMITTED) && (t = !1);
						break;
					case a.LOAD_COMMITTED:
						(e === a.REDIRECT || e === a.READY) && (t = !1);
						break;
					case a.READY:
						(e === a.LOAD_COMMITTED || e === a.REDIRECT) && (t = !1)
					}
					if (t)
						return console.error("Page cannot move from current state: " + R + ", to new state: " + e), void 0;
					R = e,
					r()
				}
			}
			function b() {
				N && (clearTimeout(N), N = void 0, L(!0), L = void 0)
			}
			function E(e, t, n) {
				return !N && !p.isAddVisitsThrottled() && !S || !N && !p.isAddVisitsThrottled() && L || n ? (N = void 0, L = void 0, d.updateUrlTitle(e, t), void 0) : (N || (N = setTimeout(function () {
								N = void 0,
								L && L()
							}, s)), L = E.bind(this, e, t), void 0)
			}
			function w() {
				if (x && !U && "https" !== D.protocol() && !i() && !m.getValue(m.ENABLE_PRIVATE_BROWSING) && !e("iris/tabs/controller").hasNetworkError(t) && F) {
					var n = e("iris/screen.capture");
					if (n.replaceImage(O, x), P)
						for (var r = 0; P.length > r; r++)
							!P[r] || P[r].transitionType !== p.TRANSITIONS.BOOKMARK && P[r].transitionType !== p.TRANSITIONS.HISTORY || n.replaceImage(P[r].url, P[r].screenCapture || x);
					U = !0
				}
			}
			function T(e) {
				A = void 0;
				var t = o[e.timerFiredCount];
				t && (_.requestScreenCapture(1 === e.timerFiredCount), e.timerFiredCount++, A = setTimeout(T.bind(this, e), t)),
				k && (k = void 0)
			}
			function y() {
				k && k.cancel(),
				H = !1,
				i() || (clearTimeout(A), k = u.createParallel(function () {
							T({
								timerFiredCount : 0
							})
						}), k.addJob())
			}
			function I() {
				w(),
				k && k.cancel(),
				(k || R !== a.READY || A) && (H = !0),
				k = void 0,
				clearTimeout(A)
			}
			var S,
			x,
			C,
			k,
			A,
			N,
			L,
			_ = this,
			R = a.INITIALIZED,
			O = n.url,
			D = URI(O),
			B = n.transitionType || n.navigationType && p.navigationTypeToTransitionType(n.navigationType),
			M = !1,
			P = [],
			U = !1,
			F = f.isValidUrl(O),
			H = !1,
			V = 100,
			W = "";
			_.updateTitle = function (n) {
				R !== a.INITIALIZED && ((R === a.LOAD_COMMITTED || R === a.READY) && (!M || e("iris/tabs/controller").hasNetworkError(t) || i() || m.getValue(m.ENABLE_PRIVATE_BROWSING) || E(O, n)), S = n, c.emit("webpage.title.updated", [t, _.getTitle()], !0), R === a.LOAD_COMMITTED && v(a.READY))
			},
			_.getTitle = function () {
				return O === h ? e("iris/i18n").translate(89) : S ? S : ""
			},
			_.updateUrl = function (e) {
				O !== e && (M = !1, b(), "" + URI(e) == "" + D && P.push({
						url : O,
						transitionType : B,
						screenCapture : x
					}), O = e, D = URI(O), F = f.isValidUrl(O), x = void 0, C = void 0, y())
			},
			_.getUrl = function () {
				return O
			},
			_.updateNewLocationUrl = function (e) {
				l.removeHashParameterFromUrl(O) !== l.removeHashParameterFromUrl(e) && (P.push({
						url : O,
						transitionType : B,
						screenCapture : x
					}), v(a.REDIRECT), I())
			},
			_.updateTransitionType = function (e) {
				var t = -1 === g.indexOf(B);
				(!B || t && e === p.TRANSITIONS.OTHER) && (B = e),
				e === p.TRANSITIONS.RELOAD && (M = !1)
			},
			_.handleLocationChange = function (e) {
				var t = p.navigationTypeToTransitionType(e.navigationType);
				return t === p.TRANSITIONS.RELOAD || t === p.TRANSITIONS.OTHER ? (_.updateUrl(e.url), _.updateTransitionType(t), v(a.LOAD_COMMITTED), !0) : l.removeHashParameterFromUrl(O) === l.removeHashParameterFromUrl(e.url) && O !== e.url ? (_.updateUrl(e.url), r(), !0) : O === e.url
			},
			_.contentRendered = function () {
				R === a.LOAD_COMMITTED && v(a.READY),
				k && R === a.READY && k.jobComplete()
			},
			_.documentLoadCommitted = function () {
				R !== a.LOAD_COMMITTED && v(a.LOAD_COMMITTED),
				k || y()
			},
			_.documentLoadFinished = function () {
				R === a.LOAD_COMMITTED && v(a.READY)
			},
			_.requestScreenCapture = function (n, r, o) {
				if (i() || R !== a.READY)
					return o && o(e("iris/tabs/controller").get(t)), void 0;
				U = !1;
				var s = function (e, i) {
					if (e.id !== t)
						throw Error("Tab id mismatch requesting screenshot");
					x = i,
					C = "data:image/png;base64," + i,
					n && w(),
					r && r(e, C),
					c.emit("webpage.screen.capture.updated", [e.id])
				};
				e("iris/screen.capture").captureTabContent(t, s, !1, !1)
			},
			_.getLatestScreenCapture = function (e, t, n) {
				if (i())
					return n && n(e), void 0;
				var r = function (e, n) {
					t(e, n)
				};
				C ? r(e, C) : _.requestScreenCapture(!1, r, n)
			},
			_.getCurrentScreenCapture = function () {
				return C
			},
			y(),
			_.tabUpdated = function (e) {
				(e.unencodedUrl && e.unencodedUrl !== O || "selected" in e && !e.selected) && I(),
				e.selected && H && T({
					timerFiredCount : 0
				})
			},
			_.setLoadProgressPercent = function (e) {
				V = parseInt(e, 10),
				c.emit("webpage.load.progress", [t, e], !0)
			},
			_.getLoadProgressPercent = function () {
				return V
			},
			_.setFavicon = function (e) {
				W = e && e.dataInBase64 ? "data:image/png;base64," + e.dataInBase64 : "",
				c.emit("webpage.favicon.updated", [t, W], !0)
			},
			_.getFavicon = function () {
				return W
			},
			_.destroy = function () {
				I(),
				b(),
				x = void 0,
				C = void 0
			},
			c.emit("webpage.new.navigation", [t, O])
		}
		var r = {},
		a = {
			INITIALIZED : "initialized",
			REDIRECT : "redirect",
			LOAD_COMMITTED : "loadCommited",
			READY : "ready"
		},
		o = [2500, 15e3, 6e4],
		s = 5e3,
		c = e("iris/event"),
		l = e("iris/utils"),
		d = e("iris/storage"),
		u = e("iris/job.runner"),
		m = e("iris/settings"),
		f = e("iris/validation"),
		p = e("iris/history"),
		g = [p.TRANSITIONS.BOOKMARK, p.TRANSITIONS.HISTORY, p.TRANSITIONS.TYPED],
		h = "about:newtab",
		v = {
			create : function (e, t) {
				return v.destroy(e),
				r[e] = new i(e, t),
				r[e]
			},
			destroy : function (e) {
				r[e] && (r[e].destroy(), delete r[e])
			}
		};
		c.on("PropertyTitleEvent", function (t, n) {
			var i = e("iris/tabs/controller").getTabForWebviewId(t);
			i && r[i.id] && r[i.id].updateTitle(n)
		}),
		c.on("PropertyLocationEvent", function (t, n) {
			var i = e("iris/tabs/controller").getTabForWebviewId(t);
			i && r[i.id] && r[i.id].updateNewLocationUrl(n)
		}),
		c.on("ContentRendered", function (t) {
			var n = e("iris/tabs/controller").getTabForWebviewId(t);
			n && r[n.id] && r[n.id].contentRendered()
		}),
		c.on("tabs.updated", function (e, t) {
			r[e] && r[e].tabUpdated(t)
		}),
		c.on("DocumentLoadCommitted", function (t) {
			var n = e("iris/tabs/controller").getTabForWebviewId(t);
			n && r[n.id] && r[n.id].documentLoadCommitted()
		}),
		c.on("DocumentLoadFinished", function (t) {
			var n = e("iris/tabs/controller").getTabForWebviewId(t);
			n && r[n.id] && r[n.id].documentLoadFinished()
		}),
		c.on("application.systemLanguageChange", function () {
			if (r) {
				var e = Object.keys(r);
				e.forEach(function (e) {
					e = parseInt(e, 10),
					r[e].getUrl() === h && c.emit("webpage.title.updated", [e, r[e].getTitle()], !0)
				})
			}
		}),
		c.on("PropertyLoadProgressEvent", function (t, n) {
			var i = e("iris/tabs/controller").getTabForWebviewId(t);
			i && r[i.id] && r[i.id].setLoadProgressPercent(n)
		}),
		c.on("PropertyFaviconEvent", function (t, n) {
			var i = e("iris/tabs/controller").getTabForWebviewId(t);
			i && r[i.id] && r[i.id].setFavicon(n)
		}),
		n.exports = v
	}), define("iris/tabs/webview", function (e, t, n) {
		function i() {
			return {
				type : "SecureNone",
				connectionInfo : {
					certificateAuthority : "",
					certificateDomains : [],
					certificateInfo : {
						certificateType : "TypeNormal",
						certificates : [],
						errors : 0,
						rejected : 0,
						trusted : 0
					},
					cipher : {
						authenticationAlgorithm : "",
						bits : 0,
						encryptionAlgorithm : "",
						keyExhangeAlgorithm : "",
						messageAuthenticationAlgorithm : "",
						name : "",
						version : ""
					},
					domain : "",
					notAfter : {
						day : 0,
						hour : 0,
						minute : 0,
						month : 0,
						second : 0,
						year : 0
					},
					notBefore : {
						day : 0,
						hour : 0,
						minute : 0,
						month : 0,
						second : 0,
						year : 0
					},
					siteDomainName : "",
					siteOwnership : ""
				}
			}
		}
		function r() {
			var t,
			n,
			r = this,
			a = parseInt(qnx.callExtensionMethod("webview.create", o, 1), 10),
			s = !1,
			c = !1;
			r.updateStatus = function (e) {
				if (e !== n) {
					var t = !0;
					switch (e) {
					case state.PENDING:
						n || (t = !1);
						break;
					case state.CREATED:
						n === state.PENDING && (t = !1);
						break;
					case state.DESTROYED:
						(n === state.PENDING || n === state.CREATED) && (t = !1)
					}
					if (t)
						return console.error("Webview id[" + a + "] could not update status from " + n + " to " + e), void 0;
					switch (n = e, e) {
					case state.PENDING:
						u.emit("webview.pending", [a], !0);
						break;
					case state.CREATED:
						u.emit("webview.created", [a], !0);
						break;
					case state.DESTROYED:
						u.emit("webview.destroyed", [a], !0)
					}
				}
			},
			r.updateStatus(state.PENDING),
			r.created = function () {
				PUBLIC_BUILD || console.log("Webview created with id: " + a),
				l || (qnx.callExtensionMethod("webview.updateDisabledPluginFiles", a, flashPlugin.DISABLED_PLUGIN_FILES, !d.getValue(d.ENABLE_FLASH)), qnx.callExtensionMethod("webview.setExtraPluginDirectory", a, flashPlugin.EXTRA_PLUGIN_DIRECTORY), l = !0),
				qnx.callExtensionMethod("webview.setBackgroundColor", a, flashPlugin.BACKGROUND_COLOUR),
				qnx.callExtensionMethod("webview.setEnableDialogRequestedEvents", a, "true"),
				qnx.callExtensionMethod("webview.setEnableLocalAccessToAllCookies", a, "false"),
				d.getValue(d.ENABLE_PRIVATE_BROWSING) && qnx.callExtensionMethod("webview.setPrivateBrowsing", a, d.getValue(d.ENABLE_PRIVATE_BROWSING)),
				qnx.callExtensionMethod("webview.setEnableCookies", a, d.getValue(d.ACCEPT_COOKIES)),
				qnx.callExtensionMethod("webview.setEnableDefaultOverScrollBackground", a, "true"),
				qnx.callExtensionMethod("webview.setEnableCredentialAutofill", a, d.getValue(d.ENABLE_CREDENTIAL_AUTOFILL)),
				qnx.callExtensionMethod("webview.setEnableFormAutofill", a, d.getValue(d.ENABLE_FORM_AUTOFILL)),
				qnx.callExtensionMethod("webview.setEnableDiskCache", a, d.getValue(d.ENABLE_DISK_CACHE)),
				qnx.callExtensionMethod("webview.setEnablePlugins", a, !0),
				qnx.callExtensionMethod("webview.setZOrder", a, flashPlugin.Z_ORDER),
				qnx.callExtensionMethod("webview.setBlockPopups", a, !1),
				qnx.callExtensionMethod("webview.setEnableTextAutosizing", a, !0),
				qnx.callExtensionMethod("webview.setShowDebugBorders", a, d.getValue(d.ENABLE_SHOW_DEBUG_BORDERS)),
				qnx.callExtensionMethod("webview.setAdjustViewportForKeyboard", a, "false"),
				qnx.callExtensionMethod("webview.setLocalStorageQuota", a, 5),
				e("iris/device").spatialNavigationEnabled() && qnx.callExtensionMethod("webview.setEnablePointerInteractionMode", a, !0),
				PUBLIC_BUILD || qnx.callExtensionMethod("webview.setInputLogFromPPSEnabled", a, !0),
				d.getValue(d.ENABLE_AUDIO_FEEDBACK) && qnx.callExtensionMethod("webview.setEnableSoundOnAnchorElementTouchEvents", a, d.getValue(d.ENABLE_AUDIO_FEEDBACK)),
				d.getValue(d.ENABLE_DESKTOP_MODE) && qnx.callExtensionMethod("webview.setUserAgent", a, d.DESKTOP_USER_AGENT),
				r.setSecurityInfo(i()),
				r.updateStatus(state.CREATED),
				r.setDefaultTextEncoding(m.getDefaultTextEncodingForLocale())
			},
			r.destroy = function () {
				n !== state.DESTROYED && (qnx.callExtensionMethod("webview.destroy", a), r.updateStatus(state.DESTROYED))
			},
			r.setSecurityInfo = function (e) {
				t = e
			},
			r.processCrashed = function () {
				r.updateStatus(state.DESTROYED)
			},
			r.setHistoryCanNavigateBack = function (e) {
				s = e,
				u.emit("webview.canNavigateBack", [a, e], !0)
			},
			r.setHistoryCanNavigateForward = function (e) {
				c = e
			},
			r.getId = function () {
				return a
			},
			r.getSecurityInfo = function () {
				return t
			},
			r.setVisible = function (e) {
				qnx.callExtensionMethod("webview.setVisible", a, e)
			},
			r.setActive = function (e) {
				qnx.callExtensionMethod("webview.setActive", a, e)
			},
			r.clearBackForwardList = function () {
				qnx.callExtensionMethod("webview.clearBackForwardList", a, !0)
			},
			r.getLocation = function () {
				return qnx.callExtensionMethod("webview.location", a)
			},
			r.setTemporaryViewport = function (e, t) {
				qnx.callExtensionMethod("webview.setTemporaryViewportSize", a, JSON.stringify({
						width : e,
						height : t
					}))
			},
			r.removeTemporaryViewport = function () {
				r.setTemporaryViewport(0, 0)
			},
			r.loadUrl = function (e) {
				qnx.callExtensionMethod("webview.loadURL", a, e)
			},
			r.cancelVibration = function () {
				qnx.callExtensionMethod("webview.cancelVibration", a)
			},
			r.notifySystemLowMemory = function () {
				qnx.callExtensionMethod("webview.notifySystemLowMemory", a)
			},
			r.setDefaultTextEncoding = function (e) {
				qnx.callExtensionMethod("webview.setDefaultTextEncoding", a, e)
			},
			r.historyCanNavigateBack = function () {
				return s
			},
			r.historyCanNavigateForward = function () {
				return c
			},
			r.publicFunctions = function () {
				var e = {
					getId : r.getId,
					getSecurityInfo : r.getSecurityInfo,
					setVisible : r.setVisible,
					setActive : r.setActive,
					clearBackForwardList : r.clearBackForwardList,
					getLocation : r.getLocation,
					setTemporaryViewport : r.setTemporaryViewport,
					removeTemporaryViewport : r.removeTemporaryViewport,
					loadUrl : r.loadUrl,
					cancelVibration : r.cancelVibration,
					notifySystemLowMemory : r.notifySystemLowMemory,
					setDefaultTextEncoding : r.setDefaultTextEncoding,
					historyCanNavigateBack : r.historyCanNavigateBack,
					historyCanNavigateForward : r.historyCanNavigateForward
				};
				return Object.freeze(e),
				e
			}
		}
		function prepareSettings() {
			o = qnx.callExtensionMethod("webview.applicationWindowGroup", iris.chromeId),
			u.on("Created", function (e) {
				c[e] ? c[e].created() : console.warn("Webview created event id[" + e + "] but no matching webview exists")
			}),
			u.on("PropertySecurityInfoEvent", function (e, t) {
				c[e] && c[e].setSecurityInfo(t)
			}),
			u.on("ProcessCrash", function (e) {
				PUBLIC_BUILD || console.log("WEBVIEW - ProcessCrash id[" + e + "]"),
				c[e] && c[e].processCrashed(),
				l = !1
			}),
			u.on("Destroyed", function (e) {
				c[e] && c[e].updateStatus(state.DESTROYED),
				s.destroy(e),
				qnx.callExtensionMethod("webview.delete", e)
			}),
			u.on("settings.updated", s.updateSetting),
			u.on("PropertyCanGoBackEvent", function (e, t) {
				c[e] && c[e].setHistoryCanNavigateBack(t)
			}),
			u.on("PropertyCanGoForwardEvent", function (e, t) {
				c[e] && c[e].setHistoryCanNavigateForward(t)
			})
		}
		var o,
		s,
		c = {},
		l = !1,
		d = e("iris/settings"),
		u = e("iris/event"),
		m = e("iris/utils"),
		flashPlugin = {
			Z_ORDER : 1,
			BACKGROUND_COLOUR : 4294967295,
			DISABLED_PLUGIN_FILES: "yeah.so",
			EXTRA_PLUGIN_DIRECTORY: "/accounts/1000/shared/misc/plugins"
		};
		Object.freeze(flashPlugin);
		var state = {
			PENDING : "pending",
			CREATED : "created",
			DESTROYED : "destroyed"
		};
		Object.freeze(state);
		var s = {
			init : function () {
				prepareSettings()
			},
			create : function (e) {
				var t = new r(e || {});
				return c[t.getId()] = t,
				t.publicFunctions()
			},
			destroy : function (e) {
				c[e] && (c[e].destroy(), delete c[e])
			},
			updateSetting : function (e, t) {				
				var n;
				switch (e) {
				case d.ENABLE_PRIVATE_BROWSING:
					n = "setPrivateBrowsing";
					break;
				case d.ACCEPT_COOKIES:
					n = "setEnableCookies";
					break;
				case d.ENABLE_CREDENTIAL_AUTOFILL:
					n = "setEnableCredentialAutofill";
					break;
				case d.ENABLE_FORM_AUTOFILL:
					n = "setEnableFormAutofill";
					break;
				case d.ENABLE_FLASH:
					qnx.callExtensionMethod("webview.updateDisabledPluginFiles", Object.keys(c)[0], "libflashplayer.so", !t);
					break;
				case d.ENABLE_DESKTOP_MODE:
					n = "setUserAgent",
					t = t ? d.DESKTOP_USER_AGENT : d.DEFAULT_USER_AGENT;
					break;
				case d.ENABLE_DISK_CACHE:
					n = "setEnableDiskCache";
					break;
				case d.ENABLE_AUDIO_FEEDBACK:
					n = "setEnableSoundOnAnchorElementTouchEvents";
					break;
				case d.ENABLE_SHOW_DEBUG_BORDERS:
					n = "setShowDebugBorders";
					break;
				case d.ENABLE_SPATIAL_NAVIGATION:
					n = "setEnableSpatialNavigation"
				}
				if (n) {
					var i = Object.keys(c);
					i.forEach(function (e) {
						qnx.callExtensionMethod("webview." + n, parseInt(e, 10), t)
					})
				}
			}
		};
		n.exports = s
	}), define("iris/tags", function (e, t, n) {
		function i(e, t) {
			return function (n) {
				a.emit("iris.tags." + e, [n], !0),
				t && t(n)
			}
		}
		var r,
		a = e("iris/event"),
		o = e("iris/storage");
		r = {
			getTagHistogram : function (e, t) {
				o.getTagHistogram(e, t)
			},
			update : function (e, t) {
				o.editTag(e, i("onChanged", t))
			},
			updateBookmarkTags : function (e, t) {
				o.updateBookmarkTags(e, t, i("onCreated"))
			},
			remove : function (e, t) {
				o.deleteTags(e, i("onRemoved", t))
			}
		},
		["onCreated", "onRemoved", "onChanged"].forEach(function (e) {
			r[e] = {
				addEventListener : function (t) {
					a.on("iris.tags." + e, t)
				},
				removeEventListener : function (t) {
					a.un("iris.tags." + e, t)
				}
			}
		}),
		n.exports = r
	}), define("iris/touch", function (e, t, n) {
		function i(e) {
			switch (d) {
			case l.DEFAULT:
				if ("touchstart" === e.type)
					return d = l.FIRST_TOUCH_DOWN, void 0;
				break;
			case l.FIRST_TOUCH_DOWN:
				if ("touchend" === e.type)
					return d = l.DEFAULT, a = void 0, void 0;
				if ("touchmove" === e.type)
					return;
				if ("touchstart" === e.type)
					return d = l.SECOND_TOUCH_DOWN, s.emit("touch.multitouch"), void 0;
				break;
			case l.SECOND_TOUCH_DOWN:
				if ("touchend" === e.type)
					return d = l.FIRST_TOUCH_UP, a = e, e.preventDefault(), e.stopPropagation(), void 0;
				if ("touchmove" === e.type)
					return;
				break;
			case l.FIRST_TOUCH_UP:
				if ("touchend" === e.type)
					return d = l.DEFAULT, a && (c.multiTouch(a, e.changedTouches[0]), e.preventDefault(), e.stopPropagation()), a = void 0, void 0;
				if ("touchmove" === e.type)
					return
			}
			d = l.DEFAULT,
			a = void 0
		}
		function r(e) {
			var t,
			n = e.changedTouches;
			if (n && n.length)
				for (var r = 0; n.length > r; r++) {
					if (n[r].identifier > 1)
						return e.preventDefault(), e.stopPropagation(), void 0;
					0 === n[r].identifier && (t = !0)
				}
			e.srcElement.multiSelectable && !c.isVisible() && i(e, !!t),
			t || (e.preventDefault(), e.stopPropagation())
		}
		var a,
		o,
		s = e("iris/event"),
		c = e("plugins/screens/selectmore/index"),
		l = {
			FIRST_TOUCH_DOWN : "first_touch_down",
			SECOND_TOUCH_DOWN : "second_touch_down",
			FIRST_TOUCH_UP : "first_touch_up",
			DEFAULT : "default"
		},
		d = l.DEFAULT;
		o = {
			enteringMultiSelect : function () {
				return d === l.SECOND_TOUCH_DOWN || d === l.FIRST_TOUCH_UP
			}
		},
		s.once("browser.init.tier2", function () {
			document.addEventListener("touchstart", r, !0),
			document.addEventListener("touchmove", r, !0),
			document.addEventListener("touchend", r, !0)
		}),
		s.on("peek.start", function () {
			d = l.DEFAULT,
			a = void 0
		}),
		n.exports = o
	}), define("iris/universal.search", function (e, t, n) {
		function i(e) {
			var t = "INSERT INTO urls (id, url, lastVisit, screenshotUrl) VALUES";
			t += Array(e.length + 1).join(" (?, ?, ?, ?),").slice(0, -1);
			var n = "INSERT INTO urls_fts (rowid, url, title) VALUES";
			n += Array(e.length + 1).join(" (?, ?, ?),").slice(0, -1);
			var i = [],
			r = [];
			e.forEach(function (e) {
				i.push(e.urlId),
				i.push(e.url),
				i.push(Math.floor(e.lastVisitTime / 1e3)),
				i.push(e.iconUrl || ""),
				r.push(e.urlId),
				r.push(e.url),
				r.push(e.title)
			}),
			E(t, i),
			E(n, r)
		}
		function r(e, t) {
			E("INSERT INTO search (id, shortName, searchTemplate, image) VALUES(?, ?, ?, ?)", [e, t.shortName, t.searchTemplate, t.iconUrl])
		}
		function a(e) {
			E("DELETE FROM search WHERE id = ?", [e])
		}
		function o(e) {
			var t = "UPDATE urls SET lastVisit = ? WHERE url = ?",
			n = "UPDATE urls_fts SET title = ? WHERE url = ?";
			e.forEach(function (e) {
				if (!e.isUrlFirstVisit) {
					var i = [],
					r = [];
					i.push(Math.floor(e.lastVisitTime / 1e3)),
					i.push(e.url),
					r.push(e.title),
					r.push(e.url),
					E(t, i),
					E(n, r)
				}
			})
		}
		function s(e) {
			var t = Array(e.length + 1).join("?,").slice(0, -1),
			n = "DELETE FROM urls WHERE id IN (" + t + ")",
			i = "DELETE FROM urls_fts WHERE rowid IN (" + t + ")";
			E(n, e),
			E(i, e)
		}
		function c(e, t, n) {
			var i = "",
			r = "",
			a = [];
			for (var o in n)
				i += r + o + " = ?", a.push(n[o]), r = ", ";
			a.length && (a.push(e), E("UPDATE urls SET " + i + " WHERE " + t + " = ?", a))
		}
		function l(e, t, n) {
			E("UPDATE urls_fts SET title = ? WHERE " + t + " = ?", [n, e])
		}
		function d(e, t, n, i) {
			for (var r; (r = e.splice(0, 500)).length; ) {
				var a = Array(r.length + 1).join("?,").slice(0, -1);
				E("UPDATE urls SET " + n + " = ? WHERE " + t + " IN (" + a + ")", [i].concat(r))
			}
		}
		function u() {
			T.on("url.added", w.urlAdded),
			T.on("urls.removed", w.urlsRemoved),
			T.on("url.screenshot.onUpdated", w.screenshotUpdated),
			T.on("iris.history.visited", w.urlVisited),
			T.on("iris.bookmarks.created", w.bookmarkAdded),
			T.on("iris.bookmarks.update", w.bookmarkChanged),
			T.on("iris.bookmarks.removed", w.bookmarkRemoved),
			T.on("url.titleUpdated", w.updateUrlTitle),
			T.on("search.added", w.searchProviderAdded),
			T.on("search.removed", w.searchProviderRemoved),
			T.on("screen.capture.url.icons.removed", w.screenshotsRemoved),
			T.on("storage.created", w.setNeedsClear)
		}
		function m() {
			T.un("url.added", w.urlAdded),
			T.un("urls.removed", w.urlsRemoved),
			T.un("url.screenshot.onUpdated", w.screenshotUpdated),
			T.un("iris.history.visited", w.urlVisited),
			T.un("iris.bookmarks.created", w.bookmarkAdded),
			T.un("iris.bookmarks.update", w.bookmarkChanged),
			T.un("iris.bookmarks.removed", w.bookmarkRemoved),
			T.un("url.titleUpdated", w.updateUrlTitle),
			T.un("search.added", w.searchProviderAdded),
			T.un("search.removed", w.searchProviderRemoved),
			T.un("screen.capture.url.icons.removed", w.screenshotsRemoved),
			T.un("storage.created", w.setNeedsClear)
		}
		function f() {
			w.init();
			var t = function (t, n) {
				var i = n.rows.length ? n.rows.item(0) : void 0;
				if (!i) {
					var a = e("iris/search").getAll();
					E("DELETE FROM search"),
					a.forEach(function (e) {
						r(e.descriptorUrl, e)
					}),
					E("INSERT INTO META (key, value) VALUES(?, ?)", ["wasSync", "true"])
				}
			};
			E("SELECT VALUE FROM meta WHERE key = 'wasSync'", [], t)
		}
		function p(e, t) {
			console.error("universal.search: " + t)
		}
		function g(e, t, n) {
			b.transaction(function (i) {
				i.executeSql(e, t, n, p)
			})
		}
		function h() {
			E("DELETE FROM urls"),
			E("DELETE FROM urls_fts")
		}
		function v(e) {
			e.executeSql("CREATE TABLE IF NOT EXISTS urls (id INTEGER PRIMARY KEY, url TEXT, screenshotUrl TEXT, lastVisit INTEGER, frecency INTEGER DEFAULT 0, isBookmark INTEGER DEFAULT 0)", [], null, p),
			e.executeSql("CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT)", [], null, p),
			e.executeSql("CREATE VIRTUAL TABLE IF NOT EXISTS urls_fts USING fts4(url, title, TOKENIZE=icu)", [], null, p),
			e.executeSql("CREATE TABLE IF NOT EXISTS search(id TEXT PRIMARY KEY, shortName TEXT, searchTemplate TEXT, image TEXT)", [], null, p),
			localStorage.removeItem("universalSearchDBVersion")
		}
		var b,
		E,
		w,
		T = e("iris/event"),
		y = e("iris/storage"),
		I = e("iris/utils"),
		S = "id",
		x = "url",
		C = "rowid",
		k = "/sharewith/search/visited_urls.db",
		A = !1,
		N = !1,
		L = {
			"" : v
		};
		w = {
			init : function () {
				if (!A) {
					if (b = w.createDatabase(), !b)
						return m(), console.warn("universal.search db couldn't be created. No updates for now."), void 0;
					w.setQueryFunction(g),
					N && h(),
					A = !0
				}
			},
			registerListeners : u,
			unregisterListeners : m,
			createDatabase : function () {
				var e = window.openDatabase("file://" + I.homeDir().replace("/data", "") + k, "", "Universal Search Browser", 10485760),
				t = L[e.version];
				return t && e.changeVersion(e.version, "2.0", t),
				e
			},
			resetInit : function () {
				A = !1
			},
			setQueryFunction : function (e) {
				E = e
			},
			urlAdded : function (e) {
				w.init(),
				i(e)
			},
			urlsRemoved : function (e) {
				w.init(),
				s(e)
			},
			bookmarkChanged : function (e, t) {
				w.init(),
				t.url ? (t.title ? (c(t.url, x, {
							isBookmark : !0
						}), l(t.url, x, t.title)) : (c(t.url, x, {
							isBookmark : !0
						}), l(t.url, x, e.title)), y.getTitle(e.url, function (t) {
						c(e.url, x, {
							isBookmark : !1
						}),
						l(e.url, x, t)
					})) : t.title && l(e.url, x, t.title)
			},
			screenshotUpdated : function (e, t) {
				w.init(),
				c(e, x, {
					screenshotUrl : t
				})
			},
			urlVisited : function (e) {
				w.init(),
				o(e)
			},
			bookmarkAdded : function (e) {
				w.init(),
				c(e.url, x, {
					isBookmark : !0
				})
			},
			bookmarkRemoved : function (e) {
				w.init(),
				e.forEach(function (e) {
					y.getTitle(e.url, function (t) {
						c(e.url, x, {
							isBookmark : !1
						}),
						l(e.url, x, t)
					})
				})
			},
			updateUrlTitle : function (e, t) {
				w.init(),
				l(e, C, t)
			},
			searchProviderAdded : function (e, t) {
				w.init(),
				r(e, t)
			},
			searchProviderRemoved : function (e) {
				w.init(),
				a(e)
			},
			screenshotsRemoved : function (e) {
				w.init(),
				d(e.slice(0), S, "screenshotUrl", void 0)
			},
			setNeedsClear : function () {
				A ? h() : N = !0
			}
		},
		T.on("browser.init.tier1", u),
		T.on("application.inactive", f),
		n.exports = w
	}), define("iris/user.media", function (e, t, n) {
		function i(e, t) {
			for (var n = document.getElementsByName("cameras"), i = 0, r = 0; n.length > r; r++)
				if (n[r].checked) {
					i = n[r].value;
					break
				}
			qnx.callExtensionMethod("webview.setAllowUserMedia", e, t.id, t.cameras[i])
		}
		function r(t, n) {
			if (1 === n.cameras.length)
				return qnx.callExtensionMethod("webview.setAllowUserMedia", t, n.id, n.cameras[0]), void 0;
			var r = document.createElement("div"),
			a = document.createElement("div"),
			o = document.createElement("button"),
			s = {
				tabId : e("iris/tabs/controller").getTabForWebviewId(t).id,
				title : r,
				message : a,
				buttons : [o],
				translate : function () {
					r.innerText = u.translate(90),
					a.innerHTML = "",
					n.cameras.forEach(function (e, t) {
						var n = document.createElement("input"),
						i = document.createElement("label");
						n.setAttribute("type", "radio"),
						n.setAttribute("name", "cameras"),
						n.classList.add("dialog-camera-radio-button"),
						n.value = t,
						0 === t && (n.checked = !0),
						i.appendChild(n),
						i.style.display = "block",
						i.appendChild(document.createTextNode(e === p ? u.translate(91) : u.translate(92))),
						a.appendChild(i)
					}),
					o.innerText = u.translate(93)
				}
			};
			o.addEventListener("click", i.bind(this, t, n)),
			d.show(s)
		}
		function a(e, t) {
			m.add({
				site : t.origin,
				type : m.type.USER_MEDIA,
				allow : 1
			}),
			r(e, t)
		}
		function o(e, t) {
			qnx.callExtensionMethod("webview.setAllowUserMedia", e, t.id, "")
		}
		function s(t, n) {
			var i = e("iris/tabs/controller").getTabForWebviewId(t);
			i && f.createInfoBar(i.id, function () {
				return u.translate(94, n.origin)
			}, function () {
				return u.translate(50)
			}, a.bind(this, t, n), o.bind(this, t, n))
		}
		function c(e, t) {
			0 !== t.cameras.length && m.isAllowed(t.origin, m.type.USER_MEDIA, function (n) {
				n ? r(e, t) : s(e, t)
			})
		}
		var l = e("iris/event"),
		d = e("plugins/dialogs/index"),
		u = e("iris/i18n"),
		m = e("iris/permissions"),
		f = e("plugins/infobartender/index"),
		p = "CAMERA_UNIT_FRONT";
		l.on("UserMediaRequest", c),
		n.exports.hasNoExports = !0
	}), define("iris/utils", function (e, t, n) {
		var i,
		r = /^\d{1,5}(\/|$)/,
		a = /^[a-zA-Z][a-zA-Z\d\+\-\.]*$/,
		o = /[<>\" {}|\\^`]/,
		s = /[\0\n\f\r\t\v]*/g,
		c = /%25/g,
		l = 0,
		d = {
			BIG_5 : "Big5",
			EUC_KR : "EUC-KR",
			GB18030 : "GB18030",
			ISO_8859_2 : "ISO-8859-2",
			SHIFT_JIS : "SHIFT_JIS",
			WINDOWS_874 : "windows-874",
			WINDOWS_1250 : "windows-1250",
			WINDOWS_1251 : "windows-1251",
			WINDOWS_1252 : "windows-1252",
			WINDOWS_1254 : "windows-1254",
			WINDOWS_1255 : "windows-1255",
			WINDOWS_1256 : "windows-1256",
			WINDOWS_1257 : "windows-1257",
			WINDOWS_1258 : "windows-1258"
		};
		i = {
			resolveURL : function (t, n) {
				if (t = t.trim(), "" === t)
					return "about:newtab";
				var s = URI(t),
				c = s.protocol();
				if ("" !== c && "" !== s.path())
					if (r.test(s.path()) || !a.test(c))
						c = "";
					else {
						if (!s.is("name") || !o.test(s.hostname()))
							return t;
						c = void 0
					}
				if ("" === c && 0 > t.indexOf(" ") && (!n && t.indexOf(".") > 0 || t.indexOf("/") > 0 || t.indexOf(":") > 0 || t.search("localhost") >= 0)) {
					if ("/" === t.charAt(0))
						return "file://" + t;
					var l = "http://" + t;
					if (!o.test(URI(l).hostname()))
						return l
				}
				var d = i.resolveTopSite(t);
				if (d)
					return d;
				if (n)
					return i.resolveTLDURL(t.replace(/ /g, "."), !0);
				var u = e("iris/search").getCurrentSearchQuery(t);
				return u ? u : t
			},
			convertIDNtoReadableStringByLanguage : function (e) {
				if (!e)
					return e;
				var t = URI(e).host();
				if (t) {
					var n = qnx.callExtensionMethod("webview.convertIDNtoReadableStringByLanguage", iris.chromeId, t);
					e = e.replace(t, n)
				}
				try {
					return decodeURI(e.replace(c, "%2525"))
				} catch (i) {
					return e
				}
			},
			shortenUrl : function (t) {
				var n = URI(t),
				i = n.hostname(),
				r = n.pathname();
				if ("about" !== n.protocol() && (i || r)) {
					if (i && e("iris/device").isPortrait()) {
						var a = qnx.callExtensionMethod("application.getRegisteredDomain", i);
						a && (i = a),
						-1 !== i.search(/^\..+/) && (i = i.replace(/^\./, ""))
					}
					r = !i && r ? r.replace(/^\/+/, "") : r;
					var o = i + r + n.search() + n.hash();
					-1 !== o.search(/^www\..+/) && (o = o.replace(/^www\./, "")),
					t = o ? o : t
				}
				return t
			},
			truncateUrl : function (e) {
				var t = URI(e),
				n = t.hostname(),
				i = t.pathname();
				if ("about" !== t.protocol() && (n || i)) {
					i = !n && i ? i.replace(/^\/+/, "") : i;
					var r = n + i + t.search() + t.hash();
					-1 !== r.search(/^www\..+/) && (r = r.replace(/^www\./, "")),
					r = r.replace(/\/$/, ""),
					e = r ? r : e
				}
				return e
			},
			resolveTLDURL : function (e, t) {
				if (e = e.trim(), "" === e || 0 > e.indexOf(".") || e.indexOf(" ") >= 0)
					return void 0;
				var n = URI(e),
				i = n.protocol();
				switch ("" === i || "" === n.path() || !r.test(n.path()) && a.test(i) || (i = ""), "" === i && (e = "http://" + e), URI(e).tld().toUpperCase()) {
				case "AERO":
				case "ASIA":
				case "CAT":
				case "COOP":
				case "INFO":
				case "INT":
				case "JOBS":
				case "MUSEUM":
				case "NAME":
				case "POST":
				case "PRO":
				case "TO":
				case "TRAVEL":
				case "TV":
				case "XXX":
					return t ? void 0 : e;
				case "AC":
				case "AD":
				case "AE":
				case "AF":
				case "AG":
				case "AI":
				case "AL":
				case "AM":
				case "AN":
				case "AO":
				case "AQ":
				case "AR":
				case "ARPA":
				case "AS":
				case "AT":
				case "AU":
				case "AW":
				case "AX":
				case "AZ":
				case "BA":
				case "BB":
				case "BD":
				case "BE":
				case "BF":
				case "BG":
				case "BH":
				case "BI":
				case "BIZ":
				case "BJ":
				case "BM":
				case "BN":
				case "BO":
				case "BR":
				case "BS":
				case "BT":
				case "BV":
				case "BW":
				case "BY":
				case "BZ":
				case "CA":
				case "CC":
				case "CD":
				case "CF":
				case "CG":
				case "CH":
				case "CI":
				case "CK":
				case "CL":
				case "CM":
				case "CN":
				case "CO":
				case "COM":
				case "CR":
				case "CU":
				case "CV":
				case "CW":
				case "CX":
				case "CY":
				case "CZ":
				case "DE":
				case "DJ":
				case "DK":
				case "DM":
				case "DO":
				case "DZ":
				case "EC":
				case "EDU":
				case "EE":
				case "EG":
				case "ER":
				case "ES":
				case "ET":
				case "EU":
				case "FI":
				case "FJ":
				case "FK":
				case "FM":
				case "FO":
				case "FR":
				case "GA":
				case "GB":
				case "GD":
				case "GE":
				case "GF":
				case "GG":
				case "GH":
				case "GI":
				case "GL":
				case "GM":
				case "GN":
				case "GOV":
				case "GP":
				case "GQ":
				case "GR":
				case "GS":
				case "GT":
				case "GU":
				case "GW":
				case "GY":
				case "HK":
				case "HM":
				case "HN":
				case "HR":
				case "HT":
				case "HU":
				case "ID":
				case "IE":
				case "IL":
				case "IM":
				case "IN":
				case "IO":
				case "IQ":
				case "IR":
				case "IS":
				case "IT":
				case "JE":
				case "JM":
				case "JO":
				case "JP":
				case "KE":
				case "KG":
				case "KH":
				case "KI":
				case "KM":
				case "KN":
				case "KP":
				case "KR":
				case "KW":
				case "KY":
				case "KZ":
				case "LA":
				case "LB":
				case "LC":
				case "LI":
				case "LK":
				case "LR":
				case "LS":
				case "LT":
				case "LU":
				case "LV":
				case "LY":
				case "MA":
				case "MC":
				case "MD":
				case "ME":
				case "MG":
				case "MH":
				case "MIL":
				case "MK":
				case "ML":
				case "MM":
				case "MN":
				case "MO":
				case "MOBI":
				case "MP":
				case "MQ":
				case "MR":
				case "MS":
				case "MT":
				case "MU":
				case "MV":
				case "MW":
				case "MX":
				case "MY":
				case "MZ":
				case "NA":
				case "NC":
				case "NE":
				case "NET":
				case "NF":
				case "NG":
				case "NI":
				case "NL":
				case "NO":
				case "NP":
				case "NR":
				case "NU":
				case "NZ":
				case "OM":
				case "ORG":
				case "PA":
				case "PE":
				case "PF":
				case "PG":
				case "PH":
				case "PK":
				case "PL":
				case "PM":
				case "PN":
				case "PR":
				case "PS":
				case "PT":
				case "PW":
				case "PY":
				case "QA":
				case "RE":
				case "RO":
				case "RS":
				case "RU":
				case "RW":
				case "SA":
				case "SB":
				case "SC":
				case "SD":
				case "SE":
				case "SG":
				case "SH":
				case "SI":
				case "SJ":
				case "SK":
				case "SL":
				case "SM":
				case "SN":
				case "SO":
				case "SR":
				case "ST":
				case "SU":
				case "SV":
				case "SX":
				case "SY":
				case "SZ":
				case "TC":
				case "TD":
				case "TEL":
				case "TF":
				case "TG":
				case "TH":
				case "TJ":
				case "TK":
				case "TL":
				case "TM":
				case "TN":
				case "TP":
				case "TR":
				case "TT":
				case "TW":
				case "TZ":
				case "UA":
				case "UG":
				case "UK":
				case "US":
				case "UY":
				case "UZ":
				case "VA":
				case "VC":
				case "VE":
				case "VG":
				case "VI":
				case "VN":
				case "VU":
				case "WF":
				case "WS":
				case "XN--0ZWM56D":
				case "XN--11B5BS3A9AJ6G":
				case "XN--3E0B707E":
				case "XN--45BRJ9C":
				case "XN--80AKHBYKNJ4F":
				case "XN--80AO21A":
				case "XN--90A3AC":
				case "XN--9T4B11YI5A":
				case "XN--CLCHC0EA0B2G2A9GCD":
				case "XN--DEBA0AD":
				case "XN--FIQS8S":
				case "XN--FIQZ9S":
				case "XN--FPCRJ9C3D":
				case "XN--FZC2C9E2C":
				case "XN--G6W251D":
				case "XN--GECRJ9C":
				case "XN--H2BRJ9C":
				case "XN--HGBK6AJ7F53BBA":
				case "XN--HLCJ6AYA9ESC7A":
				case "XN--J6W193G":
				case "XN--JXALPDLP":
				case "XN--KGBECHTV":
				case "XN--KPRW13D":
				case "XN--KPRY57D":
				case "XN--LGBBAT1AD8J":
				case "XN--MGB9AWBF":
				case "XN--MGBAAM7A8H":
				case "XN--MGBAYH7GPA":
				case "XN--MGBBH1A71E":
				case "XN--MGBC0A9AZCG":
				case "XN--MGBERP4A5D4AR":
				case "XN--O3CW4H":
				case "XN--OGBPF8FL":
				case "XN--P1AI":
				case "XN--PGBS0DH":
				case "XN--S9BRJ9C":
				case "XN--WGBH1C":
				case "XN--WGBL6A":
				case "XN--XKC2AL3HYE2A":
				case "XN--XKC2DL3A5EE0H":
				case "XN--YFRO4I67O":
				case "XN--YGBI2AMMX":
				case "XN--ZCKZAH":
				case "YE":
				case "YT":
				case "ZA":
				case "ZM":
				case "ZW":
					return e;
				default:
					return void 0
				}
			},
			resolveTopSite : function (e) {
				switch (e.toLowerCase()) {
				case "facebook":
					return "http://www.facebook.com";
				case "google":
					return "http://www.google.com";
				case "youtube":
					return "http://www.youtube.com";
				case "yahoo":
					return "http://www.yahoo.com";
				case "baidu":
					return "http://www.baidu.com";
				case "wikipedia":
					return "http://www.wikipedia.org";
				case "live":
				case "windows live":
					return "http://www.live.com";
				case "twitter":
					return "http://www.twitter.com";
				case "qq":
					return "http://www.qq.com";
				case "amazon":
					return "http://www.amazon.com";
				case "blogspot":
					return "http://www.blogspot.com";
				case "linkedin":
					return "http://www.linkedin.com";
				case "taobao":
					return "http://www.taobao.com";
				case "sina":
					return "http://www.sina.com.cn";
				case "msn":
					return "http://www.msn.com";
				case "wordpress":
					return "http://www.wordpress.com";
				case "yandex":
					return "http://www.yandex.ru";
				case "babylon":
					return "http://www.babylon.com";
				case "ebay":
					return "http://www.ebay.com";
				case "bing":
					return "http://www.bing.com";
				case "163":
					return "http://www.163.com";
				case "weibo":
					return "http://www.weibo.com";
				case "microsoft":
					return "http://www.microsoft.com";
				case "soso":
					return "http://www.soso.com";
				case "vk":
					return "http://www.vk.com";
				case "tumblr":
					return "http://www.tumblr.com";
				case "sohu":
					return "http://www.sohu.com";
				case "craigslist":
				case "craigs list":
					return "http://www.craigslist.org";
				case "apple":
					return "http://www.apple.com";
				case "pinterest":
					return "http://www.pinterest.com";
				case "paypal":
					return "http://www.paypal.com";
				case "ask":
					return "http://www.ask.com";
				case "bbc":
					return "http://www.bbc.co.uk";
				case "blogger":
					return "http://www.blogger.com";
				case "avg":
					return "http://www.avg.com";
				case "imdb":
					return "http://www.imdb.com";
				case "fc2":
					return "http://www.fc2.com";
				case "tudou":
					return "http://www.tudou.com";
				case "youku":
					return "http://www.youku.com";
				case "flickr":
					return "http://www.flickr.com";
				case "go":
					return "http://www.go.com";
				case "ifeng":
					return "http://www.ifeng.com";
				case "conduit":
					return "http://www.conduit.com";
				case "tmall":
					return "http://www.tmall.com";
				case "zedo":
					return "http://www.zedo.com";
				case "aol":
					return "http://www.aol.com";
				case "hao123":
					return "http://www.hao123.com";
				case "cnn":
					return "http://www.cnn.com";
				default:
					return void 0
				}
			},
			extend : function (e, t, n) {
				return n = n || Object.keys(t),
				n.forEach(function (n) {
					Object.hasOwnProperty.call(t, n) && (e[n] = t[n])
				}),
				e
			},
			language : function () {
				return navigator.language
			},
			getDefaultTextEncodingForLocale : function () {
				var e = i.language().toLowerCase();
				switch (0 !== e.indexOf("zh") && e.length > 2 && (e = e.substr(0, 2)), e) {
				case "hu":
				case "sl":
				case "pl":
					return d.ISO_8859_2;
				case "ja":
					return d.SHIFT_JIS;
				case "th":
					return d.WINDOWS_874;
				case "ko":
					return d.EUC_KR;
				case "cs":
				case "hr":
				case "sk":
					return d.WINDOWS_1250;
				case "bg":
				case "ru":
				case "sr":
				case "uk":
					return d.WINDOWS_1251;
				case "ku":
				case "tr":
					return d.WINDOWS_1254;
				case "he":
					return d.WINDOWS_1255;
				case "ar":
				case "fa":
					return d.WINDOWS_1256;
				case "et":
				case "lt":
				case "lv":
					return d.WINDOWS_1257;
				case "vi":
					return d.WINDOWS_1258;
				case "zh-cn":
					return d.GB18030;
				case "zh-tw":
					return d.BIG_5;
				default:
					return d.WINDOWS_1252
				}
			},
			tagHistorgramFromBookmarks : function (e) {
				var t = {};
				for (var n in e)
					for (var i = e[n].tags, r = 0; i && i.length > r; r++)
						t[i[r]] ? t[i[r]]++ : t[i[r]] = 1;
				return t
			},
			loadUrlInCurrentTab : function (t, n) {
				var r = e("iris/tabs/controller"),
				a = r.getSelected();
				a.selected && r.update(a.id, {
					url : i.resolveURL(t),
					transitionType : n
				})
			},
			loadUrlsInNewTabs : function (t) {
				var n = e("screen/manager");
				n.rollBackToScreen(n.homeScreen());
				var i,
				r = e("iris/settings");
				t.forEach(function (t) {
					i = e("iris/tabs/controller").create({
							selected : !1,
							url : t.url
						})
				}),
				r.getValue(r.OPEN_NEW_TAB_LINKS_BACKGROUND) || e("iris/tabs/controller").update(i.id, {
					selected : !0
				})
			},
			homeDir : function () {
				var t = e("iris/application").env.get("HOME");
				return i.homeDir = function () {
					return t
				},
				t
			},
			browserType : function () {
				var t = e("iris/application").env.get("PERIMETER");
				return i.browserType = function () {
					return t
				},
				t
			},
			browserTypes : {
				WORK : "enterprise",
				PERSONAL : "personal"
			},
			isWorkBrowser : function () {
				var e = i.browserType();
				return e && e === i.browserTypes.WORK
			},
			getHomePageUrl : function () {
				var t,
				n = e("iris/settings");
				if (n.getValue(n.ON_STARTUP) === n.ON_STARTUP_HOME) {
					var i = n.getValue(n.HOME_PAGE_URL);
					i && (t = i)
				}
				return t
			},
			setApplicationActive : function (e, t) {
				var n = t ? "ApplicationActivationStateActive" : "ApplicationActivationStateStandby";
				qnx.callExtensionMethod("webview.setApplicationActivationState", e, n)
			},
			removeWhiteSpaceControlCharacters : function (e) {
				return e && e.replace && (e = e.replace(s, "")),
				e
			},
			base64Encode : function (e) {
				return window.btoa(window.unescape(window.encodeURIComponent(e)))
			},
			base64Decode : function (e) {
				return window.decodeURIComponent(window.escape(window.atob(e)))
			},
			removeHashParameterFromUrl : function (e) {
				return "" + URI(e).hash("").normalizeHash()
			},
			generateAsyncId : function () {
				return l++,
				window.isFinite(l) || (l = 0),
				l
			},
			fromLocal : function (e, t) {
				var n = localStorage.getItem(e);
				if (n)
					try {
						return JSON.parse(n)
					} catch (i) {
						return console.warn('failed to parse JSON retrieved from local storage using key "' + e + '"'),
						t
					}
				return t
			},
			toLocal : function (e, t) {
				try {
					localStorage.setItem(e, t)
				} catch (n) {
					return console.warn("failed to set localStorage[" + e + "]: " + n),
					!1
				}
				return !0
			},
			ENCODINGS : d,
			clamp : function (e, t, n) {
				return Math.max(e, Math.min(t, n))
			},
			createLinkedHashMap : function (e, t) {
				var n = {},
				i = [],
				r = [];
				return n.add = function (a, o) {
					var s = t ? 0 : i.length;
					if (t ? (i.splice(0, 0, o), n.keys().forEach(function (e) {
								r[e]++
							})) : i.push(o), r[a] = s, i.length > 1) {
						var c = t ? i[s] : i[s - 1],
						l = t ? i[s + 1] : i[s];
						e(c, l)
					}
				},
				n.remove = function (t) {
					var a = r[t],
					o = a - 1,
					s = a + 1;
					e(o > -1 ? i[o] : void 0, i.length > s ? i[s] : void 0),
					i.splice(a, 1),
					delete r[t],
					n.keys().forEach(function (e) {
						r[e] > a && r[e]--
					})
				},
				n.get = function (e) {
					return i[r[e]]
				},
				n.getIndex = function (e) {
					return r[e]
				},
				n.getItemAt = function (e) {
					return i[e]
				},
				n.first = function () {
					return i[0]
				},
				n.contains = function (e) {
					return !!r[e]
				},
				n.length = function () {
					return i.length
				},
				n.keys = function () {
					return Object.keys(r)
				},
				n.values = function () {
					return i
				},
				n
			}
		},
		n.exports = i
	}), define("iris/validation", function (e, t, n) {
		var i = 256,
		r = 32e3,
		a = {
			conformTitle : function (e) {
				return e ? e.substr(0, i) : e
			},
			isValidUrl : function (e) {
				return e && r >= e.length
			}
		};
		n.exports = a
	}), define("iris/web.notification", function (e, t, n) {
		function i(e, t, n) {
			n.setWait = !0,
			p.isAllowed(t.origin, p.type.NOTIFICATION, function (n) {
				1 === n ? qnx.callExtensionMethod("webview.notificationPermissionCheckResponse", e, t.waitHandle, "true") : 0 === n ? qnx.callExtensionMethod("webview.notificationPermissionCheckResponse", e, t.waitHandle, "false") : qnx.callExtensionMethod("webview.notificationPermissionCheckResponse", e, t.waitHandle, "")
			})
		}
		function r(e, t) {
			qnx.callExtensionMethod("webview.updateNotificationPermission", e, t.id, !0),
			p.add({
				site : t.origin,
				type : p.type.NOTIFICATION,
				allow : 1
			})
		}
		function a(e, t) {
			qnx.callExtensionMethod("webview.updateNotificationPermission", e, t.id, !1)
		}
		function o(t, n) {
			p.isAllowed(n.origin, p.type.NOTIFICATION, function (i) {
				if (void 0 !== i)
					return qnx.callExtensionMethod("webview.setAllowNotification", t, n.id, 1 === i), void 0;
				var o = e("iris/tabs/controller").getTabForWebviewId(t);
				o && e("plugins/infobartender/index").createInfoBar(o.id, function () {
					return f.translate(95, n.origin)
				}, function () {
					return f.translate(50)
				}, r.bind(this, t, n), a.bind(this, t, n))
			})
		}
		function s(e, t) {
			g.cancel({
				itemId : t
			}),
			g.delete ({
				itemId : t
			}),
			delete v[t],
			qnx.callExtensionMethod("webview.notificationClosed", e, t)
		}
		function c(e, t) {
			var n = t.id,
			i = JSON.stringify({
					webviewId : e,
					id : n
				}),
			r = {
				itemId : n,
				title : t.title,
				subtitle : t.body,
				target : "com.flashbrowser",
				payloadType : b,
				payload : h.base64Encode(i)
			};
			Object.keys(v).forEach(function (n) {
				var i = v[n];
				i.tag === t.tag && s(e, n)
			}),
			g.notify(r, function () {
				qnx.callExtensionMethod("webview.notificationShown", e, n)
			}, function () {
				qnx.callExtensionMethod("webview.notificationError", e, n),
				delete v[n]
			}),
			v[n] = {
				webviewId : e,
				tag : t.tag
			}
		}
		function l(e, t) {
			var n = t.id;
			v[n] && s(e, n)
		}
		function d() {
			Object.keys(v).length && (g.cancel(), g.delete ())
		}
		var u,
		m = e("iris/event"),
		f = e("iris/i18n"),
		p = e("iris/permissions"),
		g = e("iris/notification"),
		h = e("iris/utils"),
		v = {},
		b = "application/vnd.blackberry.web_notification";
		u = {
			init : function () {
				m.on("NotificationPermissionRequest", o),
				m.on("NotificationPermissionCheck", i),
				m.on("NotificationShow", c),
				m.on("NotificationCancel", l),
				m.on("application.active", g.cancel),
				m.on("application.exit", d)
			},
			isNotificationInvocation : function (e) {
				return e === b
			},
			handleNotificationInvocation : function (e) {
				try {
					var t = JSON.parse(h.base64Decode(e)),
					n = t.webviewId,
					i = t.id;
					if (v[i])
						return qnx.callExtensionMethod("webview.notificationClicked", n, i), delete v[i], n
				} catch (r) {
					return null
				}
				return null
			}
		},
		m.on("browser.init.tier3", u.init),
		n.exports = u
	}), define("iris/webDriver", function (e, t, n) {
		var i,
		r = e("iris/event"),
		a = !0,
		o = 200,
		s = function () {
			setTimeout(window.wp.core.automation.init, 1)
		};
		i = {
			get enabled() {
				return qnx.callExtensionMethod("webDriver.enabled")
			},
			set enabled(e) {
				qnx.callExtensionMethod("webDriver.setEnabled", e),
				e && a ? r.once("automation.init", s) : e && !a ? s() : window.wp.core.automation.dinit()
			},
			get port() {
				return qnx.callExtensionMethod("webDriver.port")
			},
			exec : function (e, t, n, r) {
				window.seleniumCoreRequire("main").executeRestCommand(e, t, n, r, i.reply)
			},
			reply : function (e, t, n, i, r) {
				var a = {},
				s = r || o;
				a.sessionId = e ? "" + e : "",
				a.status = t,
				a.value = n,
				qnx.callExtensionMethod("webDriver.reply", i, JSON.stringify(a), s)
			},
			error : function (e, t, n, r, a) {
				i.reply(e, t, n, r, a)
			}
		},
		r.once("automation.init", function () {
			a = !1
		}),
		n.exports = i
	}), define("iris/webfs.helper", function (e, t, n) {
		function i(e) {
			switch (e) {
			case m.sandboxType.SANDBOXED:
				return m.sandboxType.UNSANDBOXED;
			case m.sandboxType.UNSANDBOXED:
				return m.sandboxType.SANDBOXED;
			default:
				throw Error("Invalid sandboxType: " + e)
			}
		}
		function r(e, t, n) {
			if (!e || !e()) {
				var i;
				for (var r in window.FileError)
					window.FileError[r] === n.code && (i = r);
				i = i ? i : n.code,
				console.error("error in webfs.helper: " + t + ", code " + i)
			}
		}
		function a(e) {
			window.webkitRequestFileSystem(e.type, e.size, e.successCallback, e.failureCallback)
		}
		function o(e) {
			b = g,
			qnx.callExtensionMethod("webview.setFileSystemAPISandboxed", iris.chromeId, e)
		}
		function s(e, t) {
			if (e === iris.chromeId) {
				b = t,
				f[b].forEach(function (e) {
					a(e)
				}),
				f[b] = [];
				var n = i(b);
				f[n].length > 0 && o(n)
			}
		}
		function c(e) {
			e && e(!0)
		}
		function l(e) {
			switch (b) {
			case e.sandboxType:
				a(e);
				break;
			case v:
			case i(e.sandboxType):
				o(e.sandboxType);
			case g:
				f[e.sandboxType].push(e);
				break;
			default:
				throw Error("Bad fsState " + b + " or fsRequest.sandboxType " + e.sandboxType)
			}
		}
		function d(e) {
			if (u)
				return e(u), void 0;
			var t = window.PERSISTENT,
			n = 1048576;
			m.requestFileSystem(m.sandboxType.UNSANDBOXED, t, n, function (t) {
				u = t,
				e(t)
			}, r.bind(this, "init default FileSystem"))
		}
		var u,
		m,
		f = {},
		p = !0,
		g = "changing",
		h = !1,
		v = "unknown",
		b = v,
		E = e("iris/event");
		m = {
			init : function () {
				E.on("PropertyFileSystemAPISandboxedEvent", s)
			},
			base64ToArrayBuffer : function (e) {
				e = window.atob(e);
				for (var t = new window.Uint8Array(e.length), n = 0; e.length > n; n++)
					t[n] = 255 & e.charCodeAt(n);
				return t
			},
			readFile : function (e, t, n) {
				return n ? (n.root.getFile(e, {}, function (n) {
						n.file(function (n) {
							var i = new window.FileReader;
							i.onloadend = function () {
								this.error ? r(t, e, this.error) : t(this.result)
							},
							i.readAsText(n)
						}, r.bind(this, t, e))
					}, r.bind(this, t, e)), void 0) : (d(m.readFile.bind(this, e, t)), void 0)
			},
			writeFile : function (e, t, n, i) {
				return i ? (i.root.getFile(e, {
						create : !0
					}, function (i) {
						i.createWriter(function (i) {
							i.onwriteend = function () {
								this.error ? r(n, e, this.error) : n(!0)
							},
							i.write(new window.Blob([t]), {
								type : "application/octet-stream"
							})
						}, r.bind(this, n, e))
					}, r.bind(this, n, e)), void 0) : (d(m.writeFile.bind(this, e, t, n)), void 0)
			},
			writeBase64File : function (e, t, n, i) {
				m.writeBlob(e, new window.Blob([m.base64ToArrayBuffer(t)]), n, i)
			},
			writeBlob : function (e, t, n, i) {
				return i ? (i.root.getFile(e, {
						create : !0
					}, function (i) {
						i.createWriter(function (i) {
							i.onwriteend = function () {
								this.error ? r(n, e, this.error) : n(!0)
							},
							i.write(t, {
								type : "application/octet-stream"
							})
						}, r.bind(this, n, e))
					}, r.bind(this, n, e)), void 0) : (d(m.writeBlob.bind(this, e, t, n)), void 0)
			},
			deleteFile : function (e, t, n) {
				return n ? (n.root.getFile(e, {}, function (n) {
						n.remove(c.bind(this, t), r.bind(this, t, e))
					}, r.bind(this, t, e)), void 0) : (d(m.deleteFile.bind(this, e, t)), void 0)
			},
			createDirectory : function (e, t, n) {
				return n ? (n.root.getDirectory(e, {
						create : !0
					}, function () {
						t && t(!0)
					}, r.bind(this, t, e)), void 0) : (d(m.createDirectory.bind(this, e, t)), void 0)
			},
			fileExists : function (e, t, n) {
				return n ? (n.root.getFile(e, {}, function () {
						t && t(!0)
					}, r.bind(this, t, e)), void 0) : (d(m.fileExists.bind(this, e, t)), void 0)
			},
			getDirectoryEntries : function (e, t, n) {
				if (!n)
					return d(m.getDirectoryEntries.bind(this, e, t)), void 0;
				var i,
				a = r.bind(this, t, e);
				n.root.getDirectory(e, {}, function (e) {
					i(e.createReader())
				}, a);
				var o = {
					files : [],
					dirs : []
				};
				i = function (e) {
					e.readEntries(function (n) {
						n.length ? (Array.prototype.forEach.call(n, function (e) {
								e.isFile ? o.files.push(e.fullPath) : e.isDirectory && o.dirs.push(e.fullPath)
							}), i(e)) : t(o)
					}, a)
				}
			},
			getFile : function (e, t, n) {
				return n ? (n.root.getFile(e, {}, function (n) {
						n.file(function (e) {
							t && t(e)
						}, r.bind(this, t, e))
					}, r.bind(this, t, e)), void 0) : (d(m.getFile.bind(this, e, t)), void 0)
			},
			requestFileSystem : function (e, t, n, i, r) {
				var a = {
					sandboxType : e,
					fsType : t,
					size : n,
					successCallback : i,
					failureCallback : r
				};
				l(a)
			},
			sandboxType : {
				SANDBOXED : p,
				UNSANDBOXED : h
			}
		},
		f[m.sandboxType.SANDBOXED] = [],
		f[m.sandboxType.UNSANDBOXED] = [],
		E.on("browser.init.tier2", m.init),
		n.exports = m
	}), define("iris/webview.viewport", function (e, t, n) {
		var i,
		r = e("iris/event"),
		a = {},
		o = function (e, t) {
			var n = a[e];
			n && (n.x != t.x || n.y != t.y || n.width != t.width || n.height != t.height) && qnx.callExtensionMethod("webview.setGeometry", e, n.x, n.y, n.width, n.height)
		};
		i = {
			setViewportAndCallBackAsNeeded : function (e, t, n, i, o, s) {
				a[e] = {
					x : t,
					y : n,
					width : i,
					height : o
				};
				var c = JSON.parse(qnx.callExtensionMethod("webview.viewport", e));
				c.width === i && c.height === o && c.x === t && c.y === n ? s && s() : (s && r.once("PropertyViewportEvent", s, [e]), qnx.callExtensionMethod("webview.setGeometry", e, t, n, i, o))
			}
		},
		r.on("PropertyViewportEvent", o),
		n.exports = i
	}), define("iris/windowAnimations", function (e, t, n) {
		var i,
		r = {},
		a = e("iris/event");
		i = {
			onWindowAnimationFinished : function (e) {
				r[e] && (r[e](), delete r[e])
			},
			animateWindowLocation : function (e, t, n, i, a, o, s, c) {
				var l = qnx.callExtensionMethod("windowAnimations.animateWindowLocation", e, t, n, i, a, o, s);
				c && (r[l] = c),
				qnx.callExtensionMethod("windowAnimations.startAnimation")
			},
			animateWindowLocations : function (e, t, n, i) {
				var a = ["windowAnimations.animateWindowLocationMultiple", e, t];
				a = a.concat(n);
				var o = qnx.callExtensionMethod.apply(qnx, a);
				i && (r[o] = i),
				qnx.callExtensionMethod("windowAnimations.startAnimation")
			},
			animateGlobalAlpha : function (e, t, n, i, a, o) {
				var s = qnx.callExtensionMethod("windowAnimations.animateGlobalAlpha", e, t, n, i, a);
				o && (r[s] = o),
				qnx.callExtensionMethod("windowAnimations.startAnimation")
			},
			animateGlobalAlphas : function (e, t, n, i) {
				var a = ["windowAnimations.animateGlobalAlphaMultiple", e, t];
				a = a.concat(n);
				var o = qnx.callExtensionMethod.apply(qnx, a);
				i && (r[o] = i),
				qnx.callExtensionMethod("windowAnimations.startAnimation")
			},
			onDragTouchRelease : function () {
				a.emit("windowAnimations.dragTouchRelease")
			}
		},
		e("iris/error").wrapAll(i, "windowAnimations."),
		n.exports = i
	}), define("plugins/actionbar/index", function (e, t, n) {
		function i(e) {
			return "opacity " + e + "ms ease-out, -webkit-transform " + e + "ms " + D.getCurve()
		}
		function r(e, t, n, i) {
			var r = n ? D.getTiming(D.ACTIONBAR_ACTION_GROUP_SWITCH) : 0,
			a = function () {
				e.actionGroup.style.webkitTransitionDuration = r + "ms",
				e.actionGroup.style.zIndex = 0,
				e.actionGroup.style.opacity = "0"
			},
			o = function () {
				t.actionGroup.style.webkitTransitionDuration = r + "ms",
				t.actionGroup.style.zIndex = 1,
				t.actionGroup.style.opacity = "1"
			};
			e && n ? (i.actionBarItems && i.actionBarItems.cancel(), i.actionBarItems = _.transitionWithTimeout(t.actionGroup, a, r + 100, o)) : (e && a(), o())
		}
		function a(e, t, n) {
			0 === t ? (e.style.webkitTransition = "", e.classList.remove("action-bar-offset-right"), e.classList.remove(e.animationClass), n && n()) : (e.style.webkitTransition = i(t), _.transitionWithTimeout(e, function () {
					e.classList.remove("action-bar-offset-right"),
					e.classList.remove(e.animationClass)
				}, t + 100, n))
		}
		function o(e, t, n) {
			0 === t ? (e.style.webkitTransition = "", e.classList.add(e.animationClass ? e.animationClass : "action-bar-offset-right"), n && n()) : (e.style.webkitTransition = i(t), _.transitionWithTimeout(e, function () {
					e.classList.add(e.animationClass ? e.animationClass : "action-bar-offset-right")
				}, t + 100, n))
		}
		function s(e, t) {
			e !== t.parentNode && e.appendChild(t)
		}
		function c(e, t) {
			e.removeChild(t)
		}
		function l(e, t) {
			e.disabled ? (t[e.action].classList.add("action-bar-disabled"), t[e.action].setAttribute("aria-disabled", "true"), t[e.action].tabIndex = -1) : e.disabled === !1 && (t[e.action].classList.remove("action-bar-disabled"), t[e.action].setAttribute("aria-disabled", "false"), t[e.action].tabIndex = 1),
			e.hidden ? t[e.action].classList.add("action-bar-action-item-hidden") : e.hidden === !1 && t[e.action].classList.remove("action-bar-action-item-hidden"),
			e.focus && t[e.action].focus()
		}
		function d(e, t, n) {
			var i = D.getTiming(D.ACTIONBAR_DISABLE);
			t ? (e.setOverlayOpacity(!0, .5, i), n.setAttribute("aria-disabled", "true")) : (e.setOverlayOpacity(!0, 0, i), n.setAttribute("aria-disabled", "false"))
		}
		function u(e, t, n, r) {
			var a = "translateX(" + t + "px) translateZ(0)";
			return 0 !== n ? (e.style.webkitTransition = i(n), _.transitionWithTimeout(e, function () {
					e.style.webkitTransform = a
				}, n + 100, r)) : (e.style.webkitTransition = "", e.style.webkitTransform = a, r && r(), void 0)
		}
		function m(e) {
			e.style.webkitTransition = "",
			e.style.webkitTransform = ""
		}
		function f(e, t) {
			t && (e ? t.classList.remove("action-bar-overflow-hidden") : t.classList.add("action-bar-overflow-hidden"))
		}
		function p(e, t, n) {
			for (var i = 0; e.length > i; i++)
				n.removeChild(t[e[i].action])
		}
		function g(e, t, n) {
			for (var i = 0; e.length > i; i++)
				if (e[i].custom)
					n.insertBefore(e[i].custom, n.lastChild);
				else {
					var r = v(e[i]);
					t[e[i].action] = r,
					n.insertBefore(r, n.lastChild)
				}
		}
		function h(e, t, n) {
			var i = n[e.action];
			if (i) {
				var r = i.getElementsByClassName("action-bar-action-item-image-container")[0],
				a = i.getElementsByClassName("action-bar-action-item-overlay")[0],
				o = r.getElementsByClassName("action-bar-action-item-image")[0];
				r.removeChild(o);
				var s = L.getAction(t.action),
				c = document.createElement("div");
				if (c.className = "action-bar-action-item-image large-icon-background", c.style.backgroundImage = "url(" + s.iconUrl + ")", c.style.opacity = "0", c.style.webkitTransform = "scale(1.1)", c.style.webkitTransitionDuration = D.getTiming(D.ACTIONBAR_REPLACE_ACTION) + "ms", r.appendChild(c), O.forceLayout(), c.style.opacity = "1", c.style.webkitTransform = "", !t.tooltip) {
					var l = H.createToolTipObj(i, s.label);
					t.tooltip = l
				}
				var d = function () {
					i.classList.contains("action-bar-disabled") || t.actionHandler()
				},
				u = I({
						hoverTargetElement : i,
						hoverStyleElement : a,
						onHoverTargetClick : d,
						onHoverTargetTouchEnd : d,
						onHoverTouchIn : H.showToolTipBar.bind(this, t.tooltip)
					});
				P.unregister(u),
				P.register(u),
				n[t.action] = i,
				delete n[e.action]
			}
		}
		function v(e) {
			var t = L.getAction(e.action),
			n = document.createElement("div");
			n.classList.add("action-bar-action-item"),
			n.setAttribute("role", "button");
			var i = function () {
				n.title = L.getAction(e.action).label()
			};
			A.on("application.systemLanguageChange", i),
			i();
			var r = document.createElement("div");
			r.classList.add("action-bar-action-item-image-container");
			var a = document.createElement("div");
			a.className = "action-bar-action-item-image large-icon-background",
			a.style.backgroundImage = "url(" + t.iconUrl + ")",
			r.appendChild(a);
			var o = document.createElement("div");
			o.className = "action-bar-action-item-overlay background",
			n.appendChild(r),
			n.appendChild(o);
			var s = H.createToolTipObj(n, t.label);
			e.tooltip = s;
			var c = function () {
				n.classList.contains("action-bar-disabled") || e.actionHandler()
			},
			l = I({
					hoverTargetElement : n,
					hoverStyleElement : o,
					onHoverTargetClick : c,
					onHoverTargetTouchEnd : c,
					onHoverTouchIn : H.showToolTipBar.bind(this, s)
				});
			return P.register(l),
			e.disabled && (n.classList.add("action-bar-disabled"), n.setAttribute("aria-disabled", "true"), n.tabIndex = -1),
			e.hidden && n.classList.add("action-bar-action-item-hidden"),
			n
		}
		function b(t) {
			k.down(),
			e("screen/manager").popScreen(t)
		}
		function E() {
			return B[B.length - 1]
		}
		function w(e, t) {
			e.style.zIndex = t
		}
		function T(e, t, n) {
			var i = document.createElement("div");
			i.classList.add("action-bar-action-group");
			var r = document.createElement("div");
			if (r.classList.add("action-bar-action-group-buttons"), i.appendChild(r), !e || 1 > e.length) {
				var a = document.createElement("div");
				a.classList.add("action-bar-action-item"),
				r.appendChild(a)
			}
			for (var o = {}, s = 0; e.length > s; s++)
				if (e[s].custom)
					r.appendChild(e[s].custom);
				else {
					var c = v(e[s]);
					o[e[s].action] = c,
					r.appendChild(c)
				}
			var l;
			if (n || t) {
				if (l = document.createElement("div"), l.classList.add("action-bar-actions-overflow"), n) {
					l.setAttribute("role", "button");
					var d = function () {
						l.title = V.translate(96)
					};
					A.on("application.systemLanguageChange", d),
					d();
					var u = document.createElement("div");
					u.className = "action-bar-actions-overflow-image";
					var m = document.createElement("div");
					m.className = "action-bar-action-item-overlay background",
					l.appendChild(u),
					l.appendChild(m);
					var f = H.createToolTipObj(l, function () {
							return V.translate(96)
						}),
					p = I({
							hoverTargetElement : l,
							hoverStyleElement : m,
							onHoverTargetClick : n,
							onHoverTargetTouchEnd : n,
							onHoverTouchIn : H.showToolTipBar.bind(this, f)
						});
					P.register(p)
				}
				i.appendChild(l)
			}
			return {
				actionGroup : i,
				actionCollection : o,
				actionList : e,
				overflow : l
			}
		}
		var y,
		I,
		S,
		x,
		C,
		k,
		v,
		A = e("iris/event"),
		N = e("iris/keyboard"),
		L = e("ui/actions"),
		_ = e("ui/utils"),
		R = e("iris/device"),
		O = e("screen/animationCoordinator"),
		D = e("ui/animationTimings"),
		B = [],
		M = 1,
		P = e("ui/hover/hoverController"),
		U = e("ui/hover/hoverHandlerFactory"),
		F = e("iris/utils"),
		H = e("plugins/tooltipbar/index"),
		V = e("iris/i18n"),
		W = e("iris/on.demand"),
		q = !1;
		I = function (e) {
			var t = {
				hoverInClass : "action-bar-action-item-pressed",
				hoverOutClass : "",
				hoverInAnimationType : D.ACTION_ITEM_HIGHLIGHT_HOVER_IN,
				hoverOutAnimationType : D.ACTION_ITEM_HIGHLIGHT_HOVER_OUT
			};
			return t = F.extend(t, e),
			U.create(t)
		},
		k = {
			barHeight : function () {
				var e = 10 * R.getDesignUnitBucket();
				return k.barHeight = function () {
					return e
				},
				e
			},
			init : function () {
				y = document.getElementById("action-bar-area"),
				A.on("keyboard.closed", k.down),
				A.on("keyboard.position", k.up)
			},
			makeActionBar : function (t, n, i, v, E, y, S) {
				var x,
				C = {},
				k = {},
				N = document.createElement("div");
				N.classList.add("action-bar"),
				N.classList.add(y ? y : "action-bar-offset-right"),
				N.animationClass = y;
				var R = document.createElement("div");
				N.appendChild(R);
				var O;
				if (i) {
					var D = L.getAction(i);
					O = document.createElement("div"),
					O.classList.add("action-bar-back"),
					S && O.classList.add(S),
					O.setAttribute("role", "button"),
					O.tabIndex = 1;
					var B = function () {
						O.title = D.label()
					};
					A.on("application.systemLanguageChange", B),
					B(),
					E = E || b;
					var M = document.createElement("div");
					M.classList.add("action-bar-back-image"),
					D.className && M.classList.add(D.className),
					M.style.backgroundImage = 'url("' + D.iconUrl + '")',
					O.appendChild(M);
					var U = document.createElement("div");
					U.className = "action-bar-back-button-overlay";
					var F = document.createElement("div");
					F.className = "action-bar-back-button-overlay-background background";
					var V = document.createElement("div");
					V.className = "action-bar-back-button-slash accent-colour-highlight-background",
					U.appendChild(F),
					U.appendChild(V),
					O.appendChild(U),
					N.appendChild(O);
					var W = H.createToolTipObj(O, D.label);
					e("iris/peek").setHomePeek(O, t, e("screen/manager").homeScreen());
					var q = function () {
						e("iris/peek").isPeeking() || E(t)
					},
					G = I({
							hoverTargetElement : O,
							hoverStyleElement : F,
							onHoverTargetClick : E.bind(this, t),
							onHoverTargetTouchEnd : q,
							onHoverTouchIn : H.showToolTipBar.bind(this, W)
						});
					P.register(G)
				}
				var K = [];
				if (R.classList.add("action-bar-actions"), i || R.classList.add("action-bar-actions-full-width"), n.actionGroup)
					for (var z = 0; n.actionGroup.length > z; z++) {
						var Y = n.actionGroup[z].items;
						K.push(T(Y, i, v)),
						K[z].actionGroup.id = n.actionGroup[z].id,
						R.appendChild(K[z].actionGroup),
						n.actionGroup[z].show ? (x = K[z], K[z].actionGroup.style.zIndex = 1) : K[z].actionGroup.style.opacity = "0"
					}
				else
					K.push(T(n, i, v)), x = K[0], R.appendChild(K[0].actionGroup);
				var j = document.createElement("div");
				return j.className = "background button-overlay",
				N.appendChild(j),
				C.overflowEnabled = v,
				C.animateIn = function (e, t) {
					a(N, e, t)
				},
				C.animateOut = function (e, t) {
					o(N, e, t)
				},
				C.insertInto = function (e) {
					s(e, N)
				},
				C.removeFrom = function (e) {
					c(e, N)
				},
				C.replaceAction = function (e, t, n) {
					K.forEach(function (i) {
						i.actionGroup.id && i.actionGroup.id !== n || h(e, t, i.actionCollection)
					})
				},
				C.removeActions = function (e, t) {
					K.forEach(function (e) {
						e.actionGroup.id && e.actionGroup.id !== t || p(e.actionList, e.actionCollection, e.actionGroup)
					})
				},
				C.addActions = function (e, t) {
					K.forEach(function (e) {
						e.actionGroup.id && e.actionGroup.id !== t || g(e.actionList, e.actionCollection, e.actionGroup)
					})
				},
				C.updateAction = function (e, t) {
					K.forEach(function (n) {
						n.actionGroup.id && n.actionGroup.id !== t || l(e, n.actionCollection)
					})
				},
				C.updateActionBar = function (e) {
					d(C, e, N)
				},
				C.setPosition = function (e, t, n) {
					return u(N, e, t, n)
				},
				C.resetPosition = function () {
					m(N)
				},
				C.enableOverflow = function (e, t) {
					C.overflowEnabled != e && K.forEach(function (n) {
						n.actionGroup.id && n.actionGroup.id !== t || (f(e, n.overflow), C.overflowEnabled = e)
					})
				},
				C.setZIndex = function (e) {
					w(N, e)
				},
				C.redirect = function (e, t) {
					_.redirect(N, e, t)
				},
				C.clearRedirect = function (e, t) {
					_.clearRedirect(N, e, t)
				},
				C.showActionBarItems = function (e, t) {
					K.forEach(function (n) {
						n.actionGroup.id === e && (r(x, n, t, k), x = n)
					})
				},
				C.setOverlayOpacity = function (e, t, n) {
					j.style.webkitTransition = e ? "opacity " + (n || 0) + "ms ease-out" : "none",
					j.style.opacity = t
				},
				C.enableFocus = function (e) {
					K.forEach(function (t) {
						for (var n in t.actionCollection)
							t.actionCollection[n].tabIndex = e && !t.actionCollection[n].classList.contains("action-bar-disabled") ? 1 : -1;
						t.overflow && t.overflow.hasChildNodes() && (t.overflow.tabIndex = e ? 1 : -1)
					}),
					O && (O.tabIndex = e ? 1 : -1)
				},
				C.addEventListener = function (e, t) {
					N.addEventListener(e, t.bind(this, N))
				},
				C
			},
			loadActionBar : function (e) {
				e.insertInto(y)
			},
			pushActionBar : function (e, t) {
				void 0 === t && (t = D.getTiming(D.INCOMING_PAGE, screen.width)),
				E() && E().enableFocus(!1),
				e.insertInto(y),
				e.enableFocus(!0),
				O.forceLayout(y),
				O.appendAnimation(function () {
					e.setZIndex(M++),
					e.animateIn(t),
					B.push(e)
				})
			},
			popActionBar : function (e) {
				void 0 === e && (e = D.getTiming(D.OUTGOING_PAGE, screen.width));
				var t = B.pop();
				E() && E().enableFocus(!0),
				t.resetPosition(),
				O.appendAnimation(function () {
					t.animateOut(e, function () {
						M--,
						t.setZIndex("")
					})
				}),
				O.appendAnimation(E().animateIn.bind(this, e))
			},
			contract : function () {
				if (!q) {
					q = !0,
					S && S.cancel();
					var e = D.getTiming(D.ACTIONBAR_CLOSE);
					y.style.webkitTransition = i(e),
					y.style.webkitTransform = "translateY(100%)"
				}
			},
			expand : function (e, t) {
				if (q) {
					q = !1,
					S && S.cancel();
					var n = function () {
						y.style.webkitTransition = "",
						y.style.webkitTransform = "",
						t && t()
					};
					if (e)
						return n(), void 0;
					var r = D.getTiming(D.ACTIONBAR_OPEN);
					S = _.transitionWithTimeout(y, function () {
							y.style.webkitTransition = i(r),
							y.style.webkitTransform = ""
						}, r + 100, n)
				}
			},
			isContracted : function () {
				return q
			},
			up : function (t) {
				N.currentState() === N.CLOSING || N.currentState() === N.CLOSED || e("screen/manager").currentScreen().isSheet || (C && C.cancel(), document.getElementById("action-bar-area-back").style.opacity = .99999, x = _.transitionWithTimeout(y, function () {
							y.style.webkitTransition = "-webkit-transform 150ms ease-out",
							y.style.webkitTransform = "translateY(" + (t - screen.height) + "px) translateZ(0)"
						}, 225, function () {
							A.emit("actionbar.up", [], !0),
							document.getElementById("action-bar-area-back").style.opacity = 1
						}))
			},
			down : function () {
				x && x.cancel(),
				document.getElementById("action-bar-area-back").style.opacity = 1,
				A.emit("actionbar.down", [], !0),
				C = _.transitionWithTimeout(y, function () {
						y.style.webkitTransition = "-webkit-transform 100ms ease-out",
						y.style.webkitTransform = "translateY(0) translateZ(0)"
					}, 75)
			}
		},
		W.wrapModule(k, k.init, ["barHeight", "makeActionBar", "isContracted"]),
		n.exports = k
	}), define("plugins/backforwardlist/index", function (e, t, n) {
		function i(t, n) {
			(t === b.interactionType.click || t === b.interactionType.holdRelease) && (v.hide(), n.url ? qnx.callExtensionMethod("webview.setHistoryPosition", T.getSelected().webviewId, n.index) : e("plugins/screens/history_date/index").show())
		}
		function r(e, t) {
			return e.index === t.index
		}
		function a(e) {
			var t = e.url,
			n = e.title;
			return "" === n && (n = E.translate(58)), {
				id : e.id,
				title : n,
				description : t,
				imageUrl : e.imageUrl,
				defaultImageUrl : e.imageUrl ? void 0 : "assets/av_default_web_grid_dark.png",
				listItemIconClass : "back-forward-list-icon"
			}
		}
		function o(e, t) {
			e.forEach(function (e, n) {
				var i = t[n];
				if (i && i.iconUrl && e.url === i.url && "https" !== URI(e.url).protocol()) {
					var r = g.getIconClassList(e);
					r && r.remove("back-forward-list-icon"),
					g.update({
						index : e.index,
						title : e === (h || e.url === I.getNewTabUrl()) ? e.title : i.title,
						url : e.url,
						imageUrl : i.iconUrl
					}),
					h.index === e.index && (h.imageUrl = i.iconUrl)
				}
			})
		}
		function s(e) {
			e.target.id && (e.stopPropagation(), e.preventDefault(), v.hide())
		}
		function c() {
			if (N.screen || N.actionbar)
				return !1;
			var t = e("screen/manager").currentScreen();
			return N.screen = t,
			N.actionbar = N.screen.actionBar,
			N.actionbar && N.actionbar.updateActionBar(!0),
			!0
		}
		function l() {
			delete N.screen,
			delete N.actionbar
		}
		function d() {
			N.actionbar && N.actionbar.redirect(A, s),
			N.screen.redirect(A, s)
		}
		function u() {
			N.actionbar && N.actionbar.clearRedirect(A, s),
			N.screen.clearRedirect(A, s)
		}
		function m(e) {
			e.style.webkitTransitionDuration = k.getTiming(k.BACK_FORWARD_LIST_CLOSE) + "ms",
			e.style.webkitTransform = "",
			p.style.backgroundColor = "transparent"
		}
		function f() {
			w.emit("backforwardlist.hide", [], !0),
			p.classList.add("hidden"),
			p.style.backgroundColor = "",
			g && g.clear()
		}
		var p,
		g,
		h,
		v,
		b = e("ui/interactionController"),
		E = e("iris/i18n"),
		w = e("iris/event"),
		T = e("iris/tabs/tabs"),
		y = e("iris/storage"),
		I = e("iris/tabs/controller"),
		S = e("iris/settings"),
		x = e("iris/utils"),
		C = e("ui/utils"),
		k = e("ui/animationTimings"),
		A = ["touchstart", "mousedown"],
		N = {};
		v = {
			init : function () {
				p = document.getElementById("back-forward-list"),
				p.addEventListener("click", v.hide),
				w.on("application.systemLanguageChange", v.hide),
				w.on("browser.invoked", v.hide),
				w.on("webpage.title.updated", function (e, t) {
					var n = I.get(e);
					if (v.isShowing() && n && n.webviewId) {
						var i = {};
						x.extend(i, h),
						i.title = t,
						g.update(i)
					}
				})
			},
			isShowing : function () {
				return p && !p.classList.contains("hidden")
			},
			show : function () {
				if (p || v.init(), p.classList.contains("hidden")) {
					var t = I.getSelected(),
					n = qnx.callExtensionMethod("webview.getHistoryList", t.webviewId);
					if (n && (n = JSON.parse(n)), n && 0 !== n.length) {
						if (w.emit("backforwardlist.show", [], !0), p.classList.remove("hidden"), document.getElementById("history-back").classList.add("history-back-rotate"), c() && d(), h = n[qnx.callExtensionMethod("webview.historyPosition", t.webviewId)], !g) {
							var s = {
								container : document.getElementById("back-forward-list-container"),
								interactionHandler : i,
								listToRowAdapter : a,
								itemComparator : r,
								noDefaultFocus : !0
							};
							g = e("ui/container/list/list").create(s)
						}
						n.forEach(function (e, t) {
							e.index = t,
							e === h ? e.title = E.translate(97) : e.url === I.getNewTabUrl() && (e.title = E.translate(89))
						}),
						(n[0].url === I.getNewTabUrl() || "about:blank" === n[0].url) && n.shift(),
						n = n.reverse(),
						S.getValue(S.ENABLE_PRIVATE_BROWSING) || n.push({
							id : "back-forward-full-history",
							title : E.translate(98),
							imageUrl : "assets/ic_history.png"
						}),
						g.replaceItems(n);
						var l = g.getRowClassList(h);
						l && (g.keepListItemSelected(h), l.add("currentPage"));
						var u = p.getElementsByClassName("currentPage")[0];
						u && u.offsetTop >= 3 * u.clientHeight && (document.getElementById("back-forward-list-container").scrollTop = u.offsetTop - 1.5 * u.clientHeight),
						y.getIconUrls(n, o.bind(this, n));
						var m = document.getElementById("back-forward-list-container");
						m.style.webkitTransitionTimingFunction = k.getCurve(),
						C.transitionWithTimeout(m, function () {
							m.style.webkitTransform = "translateY(0)"
						}, k.getTiming(k.BACK_FORWARD_LIST_OPEN) + 100, function () {
							u && !p.classList.contains("hidden") && u.focus()
						})
					}
				}
			},
			hide : function () {
				if (p && !p.classList.contains("hidden")) {
					var e = document.getElementById("back-forward-list-container");
					C.transitionWithTimeout(e, m.bind(v, e), k.getTiming(k.BACK_FORWARD_LIST_CLOSE) + 100, f),
					document.getElementById("history-back").classList.remove("history-back-rotate"),
					N.actionbar && N.actionbar.updateActionBar(!1),
					u(),
					l()
				}
			}
		},
		n.exports = v
	}), define("plugins/checkboxer/index", function (e, t, n) {
		function i(e) {
			var t = this,
			n = document.createElement("div");
			n.className = "checkbox-container horizontal-margin-size-m";
			var i = document.createElement("input");
			i.type = "checkbox",
			i.id = e.id ? e.id : "checkbox_" + s++,
			e.checked && (i.checked = !0),
			e.disabled && (i.disabled = !0),
			n.appendChild(i);
			var c = r.getTiming(r.CHECKBOX),
			l = "opacity " + c + "ms " + r.getCurve(),
			d = document.createElement("div");
			d.className = "checkbox-background soft-accent-colour-background",
			d.style.webkitTransition = l,
			n.appendChild(d);
			var u = document.createElement("div");
			u.className = "checkbox-checkmark",
			u.style.webkitTransition = l + ", -webkit-transform " + c + "ms " + r.getCurve(),
			n.appendChild(u);
			var m = document.createElement("div");
			m.className = "checkbox-overlay",
			m.style.webkitTransition = l,
			n.appendChild(m),
			e.container && e.container.appendChild(n);
			var f = o.create({
					hoverInClass : "checkbox-pressed",
					hoverTargetElement : d,
					hoverStyleElement : n
				});
			a.register(f),
			t.getCheckbox = function () {
				return i
			},
			t.getCheckboxContainer = function () {
				return n
			},
			t.setFocusParent = function (e) {
				e.setAttribute("role", "checkbox"),
				e.setAttribute("aria-checked", i.checked),
				e.addEventListener("click", function () {
					i.checked = !i.checked;
					var e = document.createEvent("HTMLEvents");
					e.initEvent("click", !1, !0),
					i.dispatchEvent(e)
				}),
				i.addEventListener("click", function () {
					e.setAttribute("aria-checked", i.checked)
				})
			}
		}
		var r = e("ui/animationTimings"),
		a = e("ui/hover/hoverController"),
		o = e("ui/hover/hoverHandlerFactory"),
		s = 0,
		c = {
			create : function (e) {
				return new i(e)
			}
		};
		n.exports = c
	}), define("plugins/contextmenu/index", function (e, t, n) {
		function i() {
			var e = ++pt;
			return window.isFinite(e) || (pt = 0, e = 0),
			e
		}
		function r(e) {
			e != F.style.opacity && (H.querySelector("bdi").textContent || V.querySelector("bdi").textContent) && (U.style.opacity = e ? 1 : 0, F.style.opacity = e ? 1 : 0)
		}
		function a(e) {
			H.querySelector("bdi").textContent = e,
			H.style.height = e ? "" : "0px"
		}
		function o(e) {
			V.querySelector("bdi").textContent = e,
			V.style.height = e ? "" : "0px"
		}
		function s(e) {
			e.stopPropagation(),
			ct !== st.HIDDEN && ct !== st.HIDING && (ut = !0)
		}
		function c(e, t) {
			e && (e.stopPropagation(), e.preventDefault()),
			ut !== !1 && (ut = !1, ct !== st.HIDDEN && ct !== st.HIDING && (ct === st.VISIBLE && t && t.clientX < screen.width + N ? z.hideContextMenu() : ct === st.PEEK && z.showContextMenu()))
		}
		function l(e) {
			e.stopPropagation(),
			e.preventDefault(),
			ct === st.HIDDEN || ct === st.HIDING
		}
		function d(e) {
			e && (e.stopPropagation(), e.preventDefault()),
			ct !== st.HIDDEN && ct !== st.HIDING && (ct === st.VISIBLE ? z.hideContextMenu() : ct === st.PEEK && z.showContextMenu())
		}
		function u() {
			$.isClassic() && M.lastElementChild && M.lastElementChild.focus()
		}
		function m() {
			K.clearSelection(),
			B.innerHTML = "",
			M.innerHTML = "",
			R.scrollTop = 0
		}
		function f() {
			A =  - (at * $.getDesignUnitBucket()),
			N =  - (rt * $.getDesignUnitBucket()),
			C = k = ot * $.getDesignUnitBucket(),
			x = et,
			H.classList.remove("font-size-s"),
			O = R
		}
		function p() {
			x = tt,
			A =  - (at * $.getDesignUnitBucket()),
			N =  - (rt * $.getDesignUnitBucket()),
			C = k = ot * $.getDesignUnitBucket(),
			($.isNSeries() || $.isLSeries() || $.isClassic()) && (x = nt),
			H.classList.add("font-size-s"),
			O = _
		}
		function g(e) {
			switch ("touchend" === e.type && !ut || "mouseup" === e.type && !mt || e.stopPropagation(), e.type) {
			case "touchstart":
				s(e);
				break;
			case "touchmove":
				ut && e.preventDefault();
				break;
			case "touchend":
				c(void 0, e.changedTouches[0]);
				break;
			case "mousedown":
				mt = !0,
				l(e);
				break;
			case "mousemove":
				break;
			case "mouseup":
				mt && d(),
				mt = !1;
				break;
			case "click":
				z.hideContextMenu()
			}
		}
		function h() {
			if (ft.screen || ft.actionbar)
				return !1;
			var t = e("screen/manager").currentScreen();
			return ft.screen = t,
			ft.actionbar = ft.screen.actionBar,
			ft.actionbar && ft.actionbar.updateActionBar(!0),
			!0
		}
		function v() {
			delete ft.screen,
			delete ft.actionbar,
			mt = !1
		}
		function b() {
			ft.actionbar && ft.actionbar.redirect(it, g),
			ft.screen.redirect(it, g)
		}
		function E() {
			ft.actionbar && ft.actionbar.clearRedirect(it, g),
			ft.screen.clearRedirect(it, g)
		}
		function w(e, t, n) {
			var i;
			e.forEach(function (e) {
				var r = document.createElement("div"),
				a = document.createElement("div"),
				o = document.createElement("div"),
				s = document.createElement("div"),
				c = document.createElement("div"),
				l = document.createElement("img"),
				d = document.createElement("div");
				if (r.className = "row-border-top contextMenuItemContainer menu-item" + (n ? " menu-hidden" : ""), r.setAttribute("role", "menuitem"), r.setAttribute("aria-label", e.name), r.tabIndex = 1, r.id = "context-item" + gt++, r.style.navLeft = "#" + r.id, a.className = "menu-item-background accent-colour-shade-background", a.setAttribute("aria-hidden", "true"), o.className = "menu-item-background inverted-background", o.setAttribute("aria-hidden", "true"), s.className = "menu-item-background", s.setAttribute("aria-hidden", "true"), c.className = "contextMenuItem", d.className = "contextMenuItemText right-horizontal-padding-size-m font-size-m", d.setAttribute("aria-hidden", "true"), l.src = e.imageUrl ? e.imageUrl : "assets/generic_81_81_placeholder.png", l.setAttribute("aria-hidden", "true"), l.className = "large-icon horizontal-padding-size-m", d.textContent = e.name, c.appendChild(l), c.appendChild(d), r.appendChild(c), r.appendChild(a), r.appendChild(o), r.appendChild(s), e.isDisabled ? (r.classList.add("contextMenuItemDisabled"), r.disabled = !0, r.setAttribute("aria-disabled", "true")) : r.callback = e.callback, $.hasPhysicalKeyboard() && e.shortcut) {
					var u = document.createElement("div");
					u.className = "menuShortcut end-horizontal-padding-size-m font-size-xxs",
					u.textContent = e.shortcut,
					c.appendChild(u)
				}
				e.isDelete ? (r.isDelete = !0, i = r) : t.lastElementChild && t.lastElementChild.isDelete ? t.insertBefore(r, t.lastElementChild) : t.appendChild(r),
				r.item = e,
				e.element = r,
				K.addFocusListeners(r)
			}),
			i && t.appendChild(i)
		}
		function T() {
			for (var e = B.childNodes, t = e.length, n = t - 1; n >= 0; n--)
				x >= t - n ? e[n].classList.remove("menu-hidden") : e[n].classList.add("menu-hidden")
		}
		function y() {
			for (var e = M.childNodes, t = 0; e.length > t; t++)
				e[t].style.navUp = "", e[t].style.navDown = "", 0 === t && (e[t].style.navUp = "#" + e[t].id), t === e.length - 1 && (e[t].style.navDown = "#" + e[t].id)
		}
		function I(e) {
			var t = !B.hasChildNodes() && !G;
			if (w(e, B, !0), w(e, M, !1), y(), D.style.height = M.childElementCount * (k + 2) + 2 + "px", R.scrollTop = M.childElementCount * (k + 2) + 2, T(), t) {
				var n = J.getTiming(J.FADE_CONTEXT_MENU);
				B.style.webkitTransitionDuration = n + "ms",
				M.style.webkitTransitionDuration = n + "ms",
				B.style.opacity = 0,
				M.style.opacity = 0,
				G = setTimeout(function () {
						B.style.opacity = 1,
						M.style.opacity = ct === st.VISIBLE ? 1 : 0,
						G = void 0
					}, n)
			}
		}
		function S(t, n) {
			(t == e("ui/interactionController").interactionType.click || t == e("ui/interactionController").interactionType.holdRelease) && (n.isDisabled || n.callback(), lt = !0, z.hideContextMenu(), Y.emit("screen.contextMenu.itemSelected", [dt, n.name]))
		}
		var x,
		C,
		k,
		A,
		N,
		L,
		_,
		R,
		O,
		D,
		B,
		M,
		P,
		U,
		F,
		H,
		V,
		W,
		q,
		G,
		K,
		z,
		Y = e("iris/event"),
		j = e("ui/utils"),
		J = e("ui/animationTimings"),
		X = e("plugins/screens/selectmore/index"),
		Z = e("iris/keyboard.focus"),
		Q = e("iris/touch"),
		$ = e("iris/device"),
		et = 7,
		tt = 5,
		nt = 4,
		it = ["touchstart", "touchmove", "touchend", "click", "mousedown", "mousemove", "mouseup"],
		rt = 59,
		at = 15,
		ot = 11,
		st = {
			HIDDEN : 0,
			HIDING : 1,
			PEEK : 2,
			VISIBLE : 3,
			DRAGEND : 4
		},
		ct = st.HIDE,
		lt = !1,
		dt = "",
		ut = !1,
		mt = !1,
		ft = {},
		pt = 0,
		gt = 0;
		z = {
			init : function () {
				_ = document.getElementById("contextMenu"),
				R = document.getElementById("contextMenuScrollContainer"),
				D = document.getElementById("contextMenuInnerScrollContainer"),
				B = document.getElementById("contextMenuPeek"),
				M = document.getElementById("contextMenuFull"),
				P = document.getElementById("contextMenuHeader"),
				U = document.getElementById("contextMenuHeaderTitles"),
				F = document.getElementById("contextMenuHeaderBackground"),
				H = document.getElementById("contextMenuHeadText"),
				V = document.getElementById("contextMenuSubheadText"),
				_.classList.add("base-background"),
				ct = st.HIDDEN,
				U.style.opacity = 0,
				F.style.opacity = 0,
				a(""),
				o(""),
				$.onInformationDensity({
					low : f,
					high : p
				}),
				_.addEventListener("click", z.hideContextMenu),
				window.addEventListener("orientationchange", T, !1),
				window.addEventListener("contextmenu", function (e) {
					var t = document.activeElement;
					"INPUT" !== e.srcElement.tagName ? ("INPUT" !== t.tagName || "text" !== t.type && "search" !== t.type && "url" !== t.type || t.blur(), e.preventDefault()) : "text" !== e.srcElement.type && "search" !== e.srcElement.type && "url" !== e.srcElement.type && e.preventDefault()
				}),
				Y.on("tabs.updated", function (e, t) {
					t.selected && z.hideContextMenu()
				}),
				Y.on("TouchHoldReleased", function (e) {
					e === L && ct === st.PEEK && z.showContextMenu()
				}),
				K = e("ui/interactionController").create({
						container : R,
						ancestorClassName : "contextMenuItemContainer",
						getContextItem : function (e) {
							return e ? e.item : void 0
						},
						actionCallBack : S,
						getBackgroundElement : function (e) {
							return e.childNodes[1]
						},
						getBackgroundOverlayElement : function (e) {
							return e.childNodes[2]
						},
						focusRingForItem : function (e) {
							return e.element.childNodes[3]
						},
						backgroundPartiallySelectedOpacity : .15,
						backgroundSelectedOpacity : .5,
						backgroundKeepSelectedOpacity : .2
					})
			},
			setMenuOptions : function (e) {
				return m(),
				(e.headText || e.subheadText) && (P.classList.add("contextMenuHeader"), e.headText && a(e.headText), e.subheadText && o(e.subheadText)),
				dt = e.contextType,
				e.items ? (I(e.items), i()) : i()
			},
			add : function (e, t) {
				ct !== st.HIDDEN && ct !== st.HIDING && t === pt && I(e)
			},
			setCurrentWebViewId : function (e) {
				L = e
			},
			getCurrentWebViewId : function () {
				return L
			},
			showContextMenu : function (e) {
				if (ct !== st.VISIBLE) {
					q = Z.getFocusedWebviewId(),
					Z.setChromeFocus(),
					_.tabIndex = 1,
					_.focus(),
					r(!0);
					var t = J.getTiming(J.OPEN_CONTEXT_MENU);
					W ? W.cancel() : ct === st.HIDDEN && Y.emit("screen.contextMenu.becomingVisible", [dt]),
					W = j.transitionWithTimeout(_, function () {
							_.style.webkitTransitionDuration = t + "ms",
							_.classList.add("showFullContextMenu"),
							_.classList.remove("showPeekContextMenu")
						}, t + 100, function () {
							W = void 0,
							_.style.webkitTransitionDuration = "0s",
							G || (M.style.opacity = 1, B.style.opacity = 0)
						}),
					e && (e.preventDefault(), e.stopPropagation()),
					ct = st.VISIBLE,
					u()
				}
			},
			isMenuVisible : function () {
				return ct === st.PEEK || ct === st.VISIBLE
			},
			hideContextMenu : function (e, t) {
				if (ct !== st.HIDDEN && ct !== st.HIDING) {
					Z.setWebviewFocus(q),
					_.tabIndex = -1,
					ct = st.HIDING,
					Y.emit("screen.contextMenu.hiding", [dt, lt], !0),
					r(!1);
					var n = J.getTiming(J.CLOSE_CONTEXT_MENU);
					_.style.webkitTransitionDuration = n + "ms",
					W && W.cancel(),
					W = j.transitionWithTimeout(_, function () {
							_.classList.remove("showFullContextMenu"),
							_.classList.remove("showPeekContextMenu"),
							_.classList.add("hideMenu")
						}, n + 100, function () {
							W = void 0,
							Y.emit("screen.contextMenu.hidden", [], !0),
							_.style.webkitTransitionDuration = "0s",
							P.classList.remove("contextMenuHeader"),
							a(""),
							o(""),
							_.blur(),
							ct = st.HIDDEN
						}),
					"ContextMenuCancelEvent" !== t && qnx.callExtensionMethod("webview.notifyContextMenuCancelled", L),
					e && (e.preventDefault(), e.stopPropagation()),
					L === iris.chromeId && window.removeEventListener("mouseclick", z.hideContextMenu),
					window.removeEventListener("touchend", z.showContextMenu),
					window.removeEventListener("mouseup", z.showContextMenu),
					lt = !1,
					ft.actionbar && ft.actionbar.updateActionBar(!1),
					E(),
					v(),
					clearTimeout(G),
					G = void 0,
					B.style.opacity = 0,
					M.style.opacity = 0,
					K.clearSelection()
				}
			},
			peekContextMenu : function (t) {
				if (ct !== st.PEEK && !X.isVisible() && !Q.enteringMultiSelect()) {
					L !== iris.chromeId && e("iris/sensitivity").setSensitivityNoFocus(),
					r(!1),
					W ? W.cancel() : ct === st.HIDDEN && Y.emit("screen.contextMenu.becomingVisible", [dt]);
					var n = J.getTiming(J.OPEN_CONTEXT_MENU);
					W = j.transitionWithTimeout(_, function () {
							_.style.webkitTransitionDuration = n + "ms",
							_.classList.remove("hideMenu"),
							_.classList.add("showPeekContextMenu"),
							_.classList.remove("showFullContextMenu")
						}, n + 100, function () {
							W = void 0,
							_.style.webkitTransitionDuration = "0s"
						}),
					ct = st.PEEK,
					t || (window.addEventListener("touchend", z.showContextMenu), window.addEventListener("mouseup", z.showContextMenu)),
					h() && b()
				}
			}
		},
		e("iris/on.demand").wrapModule(z, z.init, ["add", "setCurrentWebViewId", "getCurrentWebViewId", "isMenuVisible"]),
		n.exports = z
	}), define("plugins/dialogs/index", function (e, t, n) {
		function i(t) {
			if (t === o) {
				var n = document.getElementById("dialog"),
				i = document.getElementById("dialog-panel");
				m.transitionWithTimeout(n, function () {
					f.length || n.classList.add("dialog-hidden"),
					i.classList.add("dialog-panel-hidden")
				}, p + 100, function () {
					o = void 0,
					f.length ? r(f.shift()) : (qnx.callExtensionMethod("webview.setZOrder", iris.chromeId, iris.chromeZOrder), e("iris/fullscreen").enableSwipeDownHandling(!0), l.emit("dialogs.hidden", [], !0))
				})
			}
		}
		function r(t) {
			var n = document.createElement("div"),
			r = document.createElement("div"),
			a = document.createElement("div"),
			s = document.getElementById("dialog"),
			c = document.getElementById("dialog-panel");
			if (c.innerHTML = "", c.setAttribute("aria-label", d.translate(99)), c.appendChild(n), t.title.className = "dialog-titlebar font-size-xl font-weight-medium", n.appendChild(t.title), n.classList.add("dialog-content-container"), r.classList.add("dialog-content"), n.appendChild(r), r.appendChild(t.message), t.inputs && t.inputs.length) {
				var f = document.createElement("div");
				f.classList.add("dialog-input-container"),
				t.inputs.forEach(function (e) {
					e.addEventListener("focus", function () {
						m.scrollIntoViewIfNecessary(e)
					}),
					e.classList.add("dialog-input"),
					f.appendChild(e)
				}),
				r.appendChild(f)
			}
			a.classList.add("dialog-buttons"),
			c.appendChild(a),
			t.buttons.forEach(function (e) {
				e.addEventListener("click", function () {
					i(t)
				}),
				e.classList.add("dialog-button"),
				a.appendChild(e)
			}),
			t.translate(),
			e("iris/fullscreen").enableSwipeDownHandling(!1),
			o = t,
			u.update(t.tabId, {
				selected : !0
			}),
			e("plugins/tabbar/index").hide(),
			qnx.callExtensionMethod("webview.setZOrder", iris.chromeId, g),
			m.transitionWithTimeout(c, function () {
				s.classList.remove("dialog-hidden"),
				c.classList.remove("dialog-panel-hidden")
			}, p + 100, function () {
				t.inputs && t.inputs[0].focus()
			}),
			l.emit("dialogs.dialog", [o], !0)
		}
		function a() {
			!o && f.length && (l.emit("dialogs.showing", [], !0), r(f.shift()))
		}
		var o,
		s,
		c,
		r,
		l = e("iris/event"),
		d = e("iris/i18n"),
		u = e("iris/tabs/controller"),
		m = e("ui/utils"),
		f = [],
		p = 100,
		g = 6;
		c = {
			show : function (e) {
				return e && e.tabId && u.get(e.tabId) && e.title && e.message ? c.isDialogBlocked() ? (f.push(e), e) : (l.emit("dialogs.showing", [], !0), r(e), e) : (console.warn("Someone's trying to show an invalidly-formatted dialog."), void 0)
			},
			isShowingDialog : function () {
				return !!o
			},
			isDialogBlocked : function () {
				return o || s.isBlocked()
			},
			destroyDialog : function (e) {
				o === e ? i(e) : f.indexOf(e) > -1 && f.splice(f.indexOf(e), 1)
			},
			getCurrentDialog : function () {
				return o
			},
			buildAlert : function (e, t, n, i, r) {
				var a = {
					tabId : e,
					title : document.createElement("div"),
					message : document.createElement("div"),
					buttons : []
				},
				o = document.createElement("bdi");
				a.title.appendChild(o),
				a.message.dir = "auto";
				var s = document.createElement("button");
				return s.addEventListener("click", i),
				a.buttons.unshift(s),
				a.translate = function () {
					o.innerText = t(),
					a.message.innerText = n(),
					s.innerText = r ? r() : d.translate(93)
				},
				a
			},
			buildConfirm : function (e, t, n, i, r, a) {
				var o = c.buildAlert(e, t, n, i, a),
				s = o.translate,
				l = document.createElement("button");
				return l.addEventListener("click", r),
				o.buttons.unshift(l),
				o.translate = function () {
					s(),
					l.innerText = d.translate(43)
				},
				o
			},
			buildPrompt : function (e, t, n, i, r, a) {
				var o = c.buildConfirm(e, t, n, i, r),
				s = document.createElement("input");
				return s.setAttribute("type", "search"),
				s.addEventListener("keyup", function (e) {
					13 === parseInt(e.keyCode, 10) && (i && i(e), o.buttons[1].click())
				}),
				a && (s.value = a),
				o.inputs = [s],
				o
			},
			PUSH_EVENTS : [{
					event : "manager.screen",
					filterParams : [l.FILTER_ANY, "stateChange", e("screen/manager").screenStates.PUSHING],
					name : "screen",
					allowMultipleEvents : !0
				}, {
					event : "toaster.toast.show",
					name : "toast",
					allowMultipleEvents : !0
				}, {
					event : "screen.menu.showing",
					name : "overflowmenu"
				}, {
					event : "screen.contextMenu.becomingVisible",
					name : "contextmenu"
				}, {
					event : "searchresults.show",
					name : "searchresults"
				}, {
					event : "backforwardlist.show",
					name : "backforwardlist"
				}, {
					event : "InputNotificationFocusEvent",
					name : "chromeInputFocus",
					filterFunction : function (e, t, n) {
						t === iris.chromeId && n.focused && e()
					}
				}
			],
			POP_EVENTS : [{
					event : "manager.screen",
					filterParams : [l.FILTER_ANY, "unloadTransitionEnd"],
					name : "screen"
				}, {
					event : "toaster.toast.destroyed",
					name : "toast"
				}, {
					event : "screen.menu.hidden",
					name : "overflowmenu"
				}, {
					event : "screen.contextMenu.hidden",
					name : "contextmenu"
				}, {
					event : "searchresults.hide",
					name : "searchresults"
				}, {
					event : "backforwardlist.hide",
					name : "backforwardlist"
				}, {
					event : "InputNotificationFocusEvent",
					name : "chromeInputFocus",
					filterFunction : function (e, t, n) {
						t !== iris.chromeId || n.focused || e()
					}
				}
			]
		},
		l.on("keyboard.position", function (t, n) {
			if (n !== e("iris/keyboard").CLOSED && n !== e("iris/keyboard").CLOSING) {
				var i = document.getElementById("dialog-panel"),
				r = document.getElementById("dialog");
				(i.getBoundingClientRect().bottom > t || t > r.clientHeight) && (r.style.height = t + "px", o && m.scrollIntoViewIfNecessary(document.activeElement === document.body ? document.getElementById("dialog-panel") : document.activeElement))
			}
		}),
		l.on("keyboard.closed", function () {
			document.getElementById("dialog").style.height = "",
			o && m.scrollIntoViewIfNecessary(document.activeElement === document.body ? document.getElementById("dialog-panel") : document.activeElement)
		}),
		l.on("application.systemLanguageChange", function () {
			o && (o.translate(), document.getElementById("dialog-panel").setAttribute("aria-label", d.translate(99)))
		}),
		s = e("iris/blocker").createBlocker("dialog.blocker", c.PUSH_EVENTS, c.POP_EVENTS, void 0, a),
		n.exports = c
	}), define("plugins/dropper/index", function (e, t, n) {
		function i(e, t, n, i) {
			function a() {
				t.forEach(function (e, t) {
					g.children[t].children[0].textContent = e.translate(),
					e.selected && (m.textContent = e.translate())
				}),
				u.textContent = n.translate()
			}
			function s(e) {
				e.preventDefault(),
				v.setValue(e.srcElement.value),
				v.setExpand(!1)
			}
			function c(t) {
				t.preventDefault(),
				v.setExpand(!e.classList.contains("dropdown-expand"))
			}
			var l,
			d,
			u,
			m,
			f,
			p,
			g,
			h,
			v = this;
			v.setExpand = function (t) {
				t ? (e.classList.add("dropdown-expand"), l.classList.add("soft-accent-colour-background"), l.style.navUp = "#" + l.id, p.scrollTop = h.offsetTop - .4 * p.clientHeight, r = v) : (e.classList.remove("dropdown-expand"), l.classList.remove("soft-accent-colour-background"), l.style.navUp = "", r = void 0),
				l.setAttribute("aria-expanded", "" + t)
			},
			v.setValue = function (e) {
				var n;
				t.some(function (t, i) {
					return t.selected = !1,
					t.value === e ? (n = g.children[i], t.selected = !0, !0) : void 0
				}),
				h && h.classList.remove("dropdown-selected-list"),
				h = n,
				h.classList.add("dropdown-selected-list"),
				m.textContent = h.textContent,
				i(h.value)
			},
			e.className += "dropdown rounded-corners",
			l = document.createElement("div"),
			l.className = "dropdown-drop-button rounded-corners vertical-padding-size-s",
			l.setAttribute("role", "button"),
			l.addEventListener("click", c),
			l.tabIndex = 1,
			l.id = e.id + "-button",
			d = document.createElement("div"),
			d.className = "dropdown-drop-button-text",
			u = document.createElement("bdi"),
			u.className = "horizontal-padding-size-m",
			m = document.createElement("bdi"),
			m.className = "horizontal-padding-size-m",
			f = document.createElement("div"),
			f.className = "dropdown-arrow horizontal-padding-size-m",
			p = document.createElement("div"),
			p.className = "dropdown-items",
			p.setAttribute("role", "listbox"),
			g = document.createElement("div"),
			g.className = "dropdown-scroll",
			t.forEach(function (n, i) {
				var r = document.createElement("div");
				r.className = "dropdown-list" + (n.selected ? " dropdown-selected-list" : ""),
				r.value = n.value,
				r.setAttribute("role", "option"),
				r.setAttribute("aria-setsize", t.length),
				r.setAttribute("aria-posinset", i + 1),
				r.tabIndex = "1",
				i === t.length - 1 && (r.id = e.id + "-opt" + i, r.style.navDown = "#" + r.id);
				var a = document.createElement("div");
				a.className = "dropdown-label start-horizontal-padding-size-m";
				var o = document.createElement("bdi"),
				c = document.createElement("div");
				c.className = "dropdown-checkmark end-horizontal-padding-size-l",
				n.selected && (h = r),
				r.addEventListener("click", s),
				g.appendChild(r),
				r.appendChild(a),
				a.appendChild(o),
				r.appendChild(c)
			});
			var b = document.createDocumentFragment();
			b.appendChild(l),
			l.appendChild(d),
			d.appendChild(u),
			d.appendChild(m),
			l.appendChild(f),
			b.appendChild(p),
			p.appendChild(g),
			e.appendChild(b),
			o.on("application.systemLanguageChange", a),
			a()
		}
		var r,
		a,
		o = e("iris/event");
		a = {
			createDropdown : function (e, t, n, r) {
				return new i(e, t, n, r)
			},
			getActiveDropdown : function () {
				return r
			}
		},
		n.exports = a
	}), define("plugins/find_on_page/index", function (e, t, n) {
		function i() {
			p = S.calculatePixelsFromDU(S.isScreenSquare() ? A : N),
			f = S.calculatePixelsFromDU(A)
		}
		function r(e, t) {
			t.selected && e !== c && o.cleanUp()
		}
		function a() {
			x.hideContextMenu()
		}
		var o,
		s,
		c,
		l,
		d,
		u,
		m,
		f,
		p,
		g,
		h,
		v,
		b = e("iris/event"),
		E = e("plugins/actionbar/index"),
		w = e("screen/animationCoordinator"),
		T = e("iris/i18n"),
		y = e("iris/just.type"),
		I = e("iris/tabs/controller"),
		S = e("iris/device"),
		x = e("plugins/contextmenu/index"),
		C = !1,
		k = !0,
		A = 10,
		N = 11,
		L = function () {
			k && (s.classList.add("removed"), s.removeEventListener("webkitTransitionEnd", L), b.emit("find_on_page.remove"))
		},
		_ = function () {
			u.placeholder = T.translate(100),
			u.setAttribute("aria-label", T.translate(101)),
			s.getElementsByClassName("button-text-content")[0].innerText = T.translate(43),
			g = T.translate(102),
			m && v && v.isMatched ? m.innerText = T.translate(103, v.currentIndex, v.numMatches) : m && (m.innerText = g)
		},
		R = function (e) {
			e === I.getCurrentTabId() && o.cleanUp()
		};
		o = {
			init : function () {
				s = document.getElementById("find_on_page"),
				u = s.getElementsByClassName("find-input")[0],
				u.addEventListener("focus", o.inputFocused.bind(o, u)),
				u.addEventListener("click", a),
				u.oninput = o.oninput,
				u.onkeyup = o.onkeyup;
				var t = s.getElementsByClassName("button")[0],
				n = s.getElementsByClassName("button-overlay")[0],
				r = e("ui/hover/hoverHandlerFactory").create({
						hoverInClass : "button-pressed-overlay",
						hoverTargetElement : t,
						hoverStyleElement : n,
						onHoverTargetClick : o.cleanUp,
						onHoverTargetTouchEnd : o.cleanUp
					});
				e("ui/hover/hoverController").register(r),
				_(),
				b.on("FindString", o.findStringEventHandler),
				b.on("application.systemLanguageChange", _),
				b.on("Focus", function (e, t) {
					document.activeElement !== u || JSON.parse(t).isFocused ? C && JSON.parse(t).isFocused && (u.focus(), C = !1) : u.blur()
				}, [iris.chromeId]),
				b.on("application.inactive", function () {
					C = !0
				}),
				i()
			},
			show : function (t, n, i) {
				k && (y.type(u), k = !1, s.addEventListener("webkitTransitionEnd", o.transitionEnd), c = t, l = i, E.pushActionBar(o.getActionBar()), s.classList.remove("removed"), s.style.zIndex = e("screen/manager").currentScreen().domElement.style.zIndex, w.forceLayout(s), w.appendAnimation(function () {
						s.classList.remove("offscreenTop")
					}), w.animate(), b.emit("find_on_page.show"), b.on("tabs.updated", r), h = n)
			},
			getCurrentWebviewId : function () {
				return h
			},
			getActionBar : function () {
				if (!d) {
					var e = function () {
						o.searchNavigation(u.value, !0)
					},
					t = function () {
						o.searchNavigation(u.value, !1)
					};
					m = document.createElement("div"),
					m.className = "find-result font-size-l",
					m.dir = "auto",
					m.innerText = g,
					m.setAttribute("role", "heading"),
					d = E.makeActionBar(null, [{
									custom : m
								}, {
									action : "Previous",
									actionHandler : t,
									disabled : !0
								}, {
									action : "Next",
									actionHandler : e,
									disabled : !0
								}
							], null, !1)
				}
				return d
			},
			transitionEnd : function () {
				(!S.hasPhysicalKeyboard() || S.isWSeries()) && u.focus(),
				l(),
				s.removeEventListener("webkitTransitionEnd", o.transitionEnd),
				b.on("webpage.new.navigation", R)
			},
			searchNavigation : function (e, t) {
				qnx.callExtensionMethod("webview.findString", h, e, t)
			},
			inputFocused : function (e) {
				e.select()
			},
			oninput : function () {
				h && qnx.callExtensionMethod("webview.findString", h, this.value, !0)
			},
			onkeyup : function (e) {
				h && 13 == e.keyCode && (qnx.callExtensionMethod("webview.findString", h, this.value, !0), u.blur(), qnx.callExtensionMethod("webview.setKeyboardVisible", iris.chromeId, !1))
			},
			reset : function () {
				qnx.callExtensionMethod("webview.findString", h, "", !0),
				u.value = "",
				m.innerText = g,
				d.updateAction({
					action : "Previous",
					disabled : !0
				}),
				d.updateAction({
					action : "Next",
					disabled : !0
				}),
				l(),
				h = void 0
			},
			cleanUp : function () {
				k || (b.un("webpage.new.navigation", R), y.untype(u), u.blur(), s.addEventListener("webkitTransitionEnd", L), E.popActionBar(300), w.appendAnimation(function () {
						s.classList.add("offscreenTop")
					}), w.animate(), k = !0, b.un("tabs.updated", r), o.reset())
			},
			findStringEventHandler : function (e, t) {
				e === h && t && (v = JSON.parse(t), v.isMatched ? (d.updateAction({
							action : "Previous",
							disabled : !1
						}), d.updateAction({
							action : "Next",
							disabled : !1
						}), m.innerText = T.translate(103, v.currentIndex, v.numMatches)) : (d.updateAction({
							action : "Previous",
							disabled : !0
						}), d.updateAction({
							action : "Next",
							disabled : !0
						}), m.innerText = g))
			},
			isVisible : function () {
				return !k
			},
			height : function (e) {
				return k ? 0 : e === void 0 ? s.clientHeight : e ? f : p
			}
		},
		e("iris/on.demand").wrapModule(o, o.init, ["isVisible", "height"]),
		n.exports = o
	}), define("plugins/formautofill/index", function (e, t, n) {
		function i() {
			u = !0,
			d.emit("formautofill.show"),
			c.classList.remove("formautofill_hidden")
		}
		function r() {
			u && (u = !1, d.emit("formautofill.dismiss"), c.classList.add("formautofill_hidden"))
		}
		function a() {
			c.innerHTML = ""
		}
		function o() {
			qnx.callExtensionMethod("webview.autofillTextField", this.dataset.webviewId, this.innerText)
		}
		function s(t, n) {
			if (c || l.init(), n = JSON.parse(n), !n.items.length)
				return r(), void 0;
			a();
			var s,
			d;
			for (s in n.items)
				d = document.createElement("p"), d.innerText = n.items[s], d.dataset.webviewId = t, d.setAttribute("class", "formautofill_message"), d.addEventListener("click", o), c.appendChild(d);
			e("iris/sensitivity").setSensitivityNoFocus(),
			i()
		}
		var c,
		l,
		d = e("iris/event"),
		u = !1;
		l = {
			init : function () {
				c = document.createElement("div"),
				c.setAttribute("class", "base-background formautofill_base formautofill_hidden"),
				c.addEventListener("click", r),
				document.getElementById("formautofill").appendChild(c),
				d.on("FormAutofillCancelEvent", r)
			}
		},
		d.on("FormAutofillRequestEvent", s),
		n.exports = l
	}), define("plugins/formcontrol/index", function (e, t, n) {
		function i() {
			h.isVisible() && h.cleanUp(),
			e("iris/sensitivity").setSensitivityNoFocus(),
			f.emit("formcontrol.becomingVisible", [], !0),
			d.classList.remove("hidden"),
			b = !0,
			f.emit("formcontrol.visible", [], !0)
		}
		function r() {
			d.classList.add("hidden"),
			f.emit("formcontrol.invisible", [], !0),
			b = !1
		}
		function a() {
			return v && g.isPortrait() && !E && !w && (T || g.hasPhysicalKeyboard())
		}
		function o(e, t) {
			v = t.isVisible,
			c.disabled = !t.isPreviousActive,
			c.setAttribute("aria-disabled", c.disabled),
			l.disabled = !t.isNextActive,
			l.setAttribute("aria-disabled", l.disabled),
			a() && !b ? i() : !a() && b && r(),
			u = p.getSelected().id
		}
		function s(e, t) {
			t.selected && e !== u && (v = !1)
		}
		var c,
		l,
		d,
		u,
		m,
		f = e("iris/event"),
		p = e("iris/tabs/controller"),
		g = e("iris/device"),
		h = e("plugins/find_on_page/index"),
		v = !1,
		b = !1,
		E = !1,
		w = !1,
		T = !1;
		m = {
			init : function () {
				d = document.getElementById("formcontrol"),
				c = document.getElementById("formcontrol_previous"),
				l = document.getElementById("formcontrol_next"),
				f.on("FormControlEvent", o),
				f.on("ProcessCrash", function () {
					v = !1,
					r()
				}),
				f.on("tabs.updated", s),
				c.addEventListener("click", function () {
					qnx.callExtensionMethod("webview.focusPreviousField", p.getSelected().webviewId)
				}),
				l.addEventListener("click", function () {
					qnx.callExtensionMethod("webview.focusNextField", p.getSelected().webviewId)
				}),
				window.addEventListener("orientationchange", function () {
					a() && !b ? i() : !a() && b && r()
				}, !1),
				f.on("screen.contextMenu.hiding", function () {
					E = !1,
					a() && i()
				}),
				f.on("screen.contextMenu.becomingVisible", function () {
					E = !0,
					b && r()
				}),
				g.hasPhysicalKeyboard() || (f.on("keyboard.opened", function () {
						T = !0,
						a() && i()
					}), f.on("keyboard.closed", function () {
						T = !1,
						b && r()
					})),
				f.on("dialogs.showing", function () {
					w = !0,
					b && r()
				}),
				f.on("dialogs.hidden", function () {
					w = !1,
					a() && i()
				})
			},
			visible : function () {
				return b
			}
		},
		f.once("FormControlEvent", function (e, t) {
			m.init(),
			o(e, t)
		}),
		n.exports = m
	}), define("plugins/hotspottitle/index", function (e, t, n) {
		function i() {
			u ? o.setLeftButtonText(l.translate(104)) : o.setLeftButtonText(l.translate(105))
		}
		function r() {
			o.setTitle(l.translate(106)),
			i()
		}
		function a(e) {
			u != e && (u = e, i())
		}
		var o,
		s,
		c = e("iris/event"),
		l = e("iris/i18n"),
		d = e("iris/application"),
		u = !1;
		s = {
			init : function () {
				o = e("plugins/titlebarwithactions/index").createTitleBar({
						parentId : "hotspot-header",
						titleText : l.translate(106),
						leftText : l.translate(105),
						leftCallback : function () {
							d.requestExit()
						}
					}),
				c.on("application.systemLanguageChange", r),
				c.on("hotspot.connected", a)
			}
		},
		c.on("browser.init.tier1", s.init),
		n.exports = s
	}), define("plugins/infobartender/index", function (e, t, n) {
		function i(e) {
			s.innerHTML = "",
			e && (u[e] && u[e].forEach(function (e) {
					s.appendChild(e)
				}), o = e)
		}
		function r(e) {
			u[e] && u[e].forEach(function (e) {
				l.emit("infobar.removed", [e], !1)
			}),
			e === o && (s.innerHTML = ""),
			delete u[e]
		}
		function a() {
			Object.keys(u).forEach(function (e) {
				u[e].forEach(function (t, n) {
					!t.messageTranslateFunc || !t.linkTranslateFunc || t.hasExtraLink && !t.extraLinkTranslateFunc ? delete u[e][n] : (t.children[0].children[0].innerText = t.messageTranslateFunc(), t.extraLinkTranslateFunc && (t.children[0].children[1].innerText = t.extraLinkTranslateFunc()), t.children[1].innerText = t.linkTranslateFunc(), t.children[2].setAttribute("aria-label", d.translate(105)))
				})
			})
		}
		var o,
		s,
		c,
		l = e("iris/event"),
		d = e("iris/i18n"),
		u = {};
		c = {
			createInfoBar : function (e, t, n, i, r, a, m) {
				var f = document.createElement("div");
				f.className = "base-background infobar";
				var p = document.createElement("div");
				p.className = "infobar-message";
				var g = document.createElement("div");
				if ("string" == typeof t ? g.innerText = t : (g.innerText = t(), f.messageTranslateFunc = t), p.appendChild(g), a && m) {
					f.hasExtraLink = !0;
					var h = document.createElement("div");
					h.className = "accent-colour-highlight",
					"string" == typeof a ? h.innerText = a : (h.innerText = a(), f.extraLinkTranslateFunc = a),
					h.setAttribute("role", "link"),
					h.addEventListener("click", m),
					p.appendChild(h)
				}
				var v = document.createElement("div");
				v.className = "infobar-link accent-colour-highlight",
				"string" == typeof n ? v.innerText = n : (v.innerText = n(), f.linkTranslateFunc = n),
				v.setAttribute("role", "button"),
				v.addEventListener("click", i),
				v.addEventListener("click", c.removeInfoBar.bind(c, e, f));
				var b = document.createElement("div");
				return b.className = "infobar-cancel",
				b.setAttribute("role", "button"),
				b.setAttribute("aria-label", d.translate(105)),
				b.addEventListener("click", r),
				b.addEventListener("click", c.removeInfoBar.bind(c, e, f)),
				f.appendChild(p),
				f.appendChild(v),
				f.appendChild(b),
				e === o && s.appendChild(f),
				u[e] = u[e] || [],
				u[e].push(f),
				l.emit("infobar.created", [f]),
				f
			},
			removeInfoBar : function (e, t) {
				e === o && s.removeChild(t);
				var n = u[e].indexOf(t);
				-1 !== n && (l.emit("infobar.removed", u[e].splice(n, 1), !1), u[e].length || delete u[e])
			},
			numberOfInfoBarsShowing : function () {
				return s.childNodes.length
			},
			init : function () {
				return o = e("iris/tabs/controller").getCurrentTabId(),
				(s = document.getElementById("infobartender")) ? (l.on("tabs.updated", function (e, t) {
						t.selected && e !== o && i(e)
					}), l.on("LocationChange", function (t) {
						var n = e("iris/tabs/controller").getTabForWebviewId(t);
						n && r(n.id)
					}), l.on("tabs.removed", r), l.on("application.systemLanguageChange", a), l.on("find_on_page.remove", function () {
						i(o)
					}), l.on("searchresults.hide", function () {
						i(o)
					}), l.on("find_on_page.show", i.bind(c, void 0)), l.on("searchresults.show", i.bind(c, void 0)), void 0) : (console.error("Cannot find infobartender. Either we're running tests or something's gone horribly wrong."), void 0)
			}
		},
		e("iris/on.demand").wrapModule(c, c.init),
		n.exports = c
	}), define("plugins/minibar/index", function (e, t, n) {
		var i,
		r = e("iris/device"),
		a = function (e) {
			document.getElementById("mini-bar-url").innerText = e
		},
		o = function (e) {
			var t = document.getElementById("mini-bar-cert");
			e ? t.classList.remove("hidden") : t.classList.add("hidden"),
			t.style.backgroundImage = e
		};
		i = {
			init : function (e) {
				var t = document.getElementById("mini-bar"),
				n = document.getElementById("mini-bar-shutter");
				t.addEventListener("mouseover", function () {
					n.style.opacity = 1
				});
				var i = function () {
					n.style.opacity = 0
				};
				t.addEventListener("mouseout", i),
				t.addEventListener("click", function () {
					e(),
					i()
				})
			},
			height : function () {
				return r.isOSeries() || r.isWSeries() ? 36 : 30
			},
			setUrl : a,
			setCertIcon : o
		},
		n.exports = i
	}), define("plugins/navigationbar/index", function (e, t, n) {
		function i() {
			if ("about" === URI(It).protocol())
				return It;
			var e = document.getElementById("urlfield"),
			t = document.getElementById("urlhost_width_container");
			return t && t.clientWidth > e.clientWidth && dt.isPortrait() ? xt : St
		}
		function r(e) {
			var t = e && e.url ? URI(e.url).protocol() : "";
			return "" === t || "about" === t || "local" === t
		}
		function a(e) {
			return !e || r(e) || e.getLoadProgressPercent() >= 90
		}
		function o() {
			var e = document.getElementById("urlfield");
			e.style.direction = e.value ? "" : lt.isDeviceLanguageRTL() ? "rtl" : "ltr"
		}
		function s(e) {
			if (e !== et.getNewTabUrl()) {
				var t = document.getElementById("urlfield");
				t.value = e,
				ht.setUrl(e)
			}
			o()
		}
		function c(e) {
			var t = document.getElementById("urlfield");
			t.setAttribute("data-blackberry-learn-field-text", !e)
		}
		function l(e) {
			var t = document.getElementById("certIcon");
			t.style.backgroundImage = e,
			ht.setCertIcon(e)
		}
		function d(e) {
			if (_t === Nt) {
				var t = document.getElementById("certIcon"),
				n = document.getElementById("urlfield"),
				r = "";
				switch (et.getNewTabUrl() !== It && (r = i() || ""), e.type) {
				case "SecureFailed":
				case "SecureUnknown":
					l("url('./assets/cs_unknown_certificate1.png')");
					break;
				case "SecurePartial":
					l("url('./assets/dark/cs_mixed_content1.png')");
					break;
				case "SecureFull":
					l("url('./assets/cs_dv_pad_lock1.png')");
					break;
				case "SecureEV":
					r = e.connectionInfo.certificateInfo.certificates[0] && e.connectionInfo.certificateInfo.certificates[0].subject.country ? e.connectionInfo.siteOwnership + " (" + e.connectionInfo.certificateInfo.certificates[0].subject.country + ")" : e.connectionInfo.siteOwnership,
					l("url('./assets/cs_ev_pad_lock1.png')");
					break;
				case "SecureNone":
				default:
					l("")
				}
				s(r),
				t.style.backgroundImage ? (n.classList.add("urlLeftPadding"), t.classList.remove("hidden")) : (n.classList.remove("urlLeftPadding"), t.classList.add("hidden"))
			}
		}
		function u(e) {
			e.preventDefault(),
			e.stopPropagation(),
			v()
		}
		function m() {
			var e = document.getElementById("urlfield");
			e.style.textOverflow = "clip",
			pt.forceLayout(),
			e.style.textOverflow = ""
		}
		function f() {
			document.getElementById("stop").classList.add("hidden"),
			document.getElementById("urlfield").classList.remove("urlRightPadding"),
			m()
		}
		function p() {
			document.getElementById("stop").classList.remove("hidden"),
			document.getElementById("urlfield").classList.add("urlRightPadding"),
			m()
		}
		function g() {
			j = void 0;
			var e = "";
			et.getNewTabUrl() !== It && (e = i() || ""),
			document.getElementById("stop").classList.remove("clear-url-hidden");
			var t = document.getElementById("urlfield");
			s(e),
			t.type = "text";
			var n = ot.homeScreen(),
			r = n.domElement.getElementsByClassName("page")[0];
			n.releaseEventsToTabs(),
			st.clearRedirect(r, Ct, u),
			_t = Nt,
			et.getSelected() && d(et.getSelected().securityInfo),
			yt && yt.isVisible() && p(),
			t.blur()
		}
		function h() {
			var e = window.getSelection();
			e && e.rangeCount > 0 && e.removeAllRanges();
			var t = document.getElementById("showtabscontainer");
			document.getElementById("contracturl").classList.add("hidden"),
			document.getElementById("overflowmenu").classList.remove("hidden"),
			j = st.transitionWithTimeout(t, t.classList.remove.bind(t.classList, "contracted"), Ot, g),
			document.getElementById("back").classList.remove("contracted"),
			document.getElementById("urlfield").classList.remove("expanded")
		}
		function v() {
			var t = document.getElementById("urlfield");
			if (t.blur(), t.style.webkitUserSelect = "none", o(), "Normal" === iris.chromeMode()) {
				if (rt.setShowing(!1), _t === Nt || _t === Lt)
					return;
				if (_t === At)
					return Rt = !0, void 0;
				tt.emit("navbar.url.focus.out"),
				e("ui/scroll.detector").isPossiblyScrolling() && tt.once("scrollDetector.scrollEnded", function () {
					tt.emit("navbar.touchend")
				}),
				_t = Lt,
				h(),
				vt.down()
			}
		}
		function b() {
			var e = et.getSelected(),
			t = document.getElementById("urlfield");
			e && document.activeElement === t && Bt && (s(It), qnx.callExtensionMethod("webview.handleContextMenuResponse", iris.chromeId, "SelectAll"), Bt = !1)
		}
		function E(e, t, n) {
			e === iris.chromeId && (n.setPreventDefault = !0)
		}
		function w(e) {
			It !== et.getNewTabUrl() && "Restricted" !== iris.chromeMode() && it.show(e ? Pt : void 0)
		}
		function T() {
			document.getElementById("certIcon").classList.add("hidden");
			var e = document.getElementById("urlfield");
			e.classList.remove("urlLeftPadding"),
			e.classList.remove("urlRightPadding"),
			e.type = "search",
			e.style.direction = "",
			!dt.hasPhysicalKeyboard() || dt.isWSeries() && 0 === window.orientation % 180 || tt.un("ContextMenuCallbacksSupported", E);
			var t = ot.homeScreen(),
			n = t.domElement.getElementsByClassName("page")[0];
			t.suppressEventsToTabs(),
			st.clearRedirect(n, Ct, u),
			st.redirect(n, Ct, u),
			_t = kt,
			w(!1),
			Rt && (Rt = !1, v())
		}
		function y() {
			if ("Normal" === iris.chromeMode()) {
				zt();
				var e = document.getElementById("urlfield");
				if (e.style.webkitUserSelect = "", _t === kt || _t === At)
					return;
				e.value = e.value,
				j && j.cancel(),
				Bt = "" !== e.value,
				tt.on("ContextMenuCallbacksSupported", E),
				e.focus(),
				b(),
				_t = At,
				tt.emit("navbar.url.focus");
				var t = document.querySelectorAll(".animatable-action-item, #back");
				Array.prototype.forEach.call(t, function (e) {
					e.style.webkitTransition = "none"
				}),
				document.getElementById("showtabscontainer").classList.add("contracted"),
				document.getElementById("stop").classList.add("clear-url-hidden"),
				document.getElementById("contracturl").classList.remove("hidden"),
				document.getElementById("back").classList.add("contracted"),
				document.getElementById("overflowmenu").classList.add("hidden"),
				e.classList.add("expanded"),
				pt.forceLayout(),
				Array.prototype.forEach.call(t, function (e) {
					e.style.webkitTransition = ""
				}),
				T()
			}
		}
		function I(t) {
			It = t;
			var n = et.getCurrentTabId();
			tt.emit("navigationbar.urlConfirm", [t], !0),
			et.update(n, {
				url : t,
				transitionType : e("iris/history").TRANSITIONS.TYPED
			}),
			v()
		}
		function S() {
			Y = void 0,
			(_t === kt || _t === At) && rt.update(document.getElementById("urlfield").value.trim())
		}
		function x() {
			Y && clearTimeout(Y),
			Y = setTimeout(S, Mt),
			Bt = !1
		}
		function C(e, t, n) {
			It = e.replace(/ /g, "%20");
			var r = URI(It).hostname();
			St = t,
			xt = n;
			var a = document.getElementById("urlfield"),
			o = document.getElementById("urlhost_width_container");
			o && r && (o.innerText = r),
			document.activeElement != a && (_t === kt ? s(It) : s(i()))
		}
		function k() {
			var e = et.getSelected(),
			t = document.getElementById("back");
			e && (e.parentId || e.historyCanNavigateBack()) ? (t.classList.remove("cant-go-back"), t.tabIndex = 1) : (t.classList.add("cant-go-back"), t.tabIndex = -1),
			tt.emit("navbar.touchend")
		}
		function A(e, t) {
			if (It === et.getNewTabUrl() || "Restricted" === iris.chromeMode())
				return it.hide(), void 0;
			var n = et.get(e);
			n && n.selected && it.setTitle(t || n.url)
		}
		function N(e, t) {
			var n = et.get(e);
			if (n.selected) {
				var i = URI(n.url).protocol();
				10 > t && "about" !== i && "local" !== i && "file" !== i && p(),
				a(n) ? (f(), r(n) || (yt.setProgress(100), yt.hide()), it.hide(Ut)) : 3 > t ? yt.setProgress(2.7) : yt.setProgress(100 * (t / 90))
			}
		}
		function L(e, t, n) {
			(t.selected && n.webviewId || n.selected && t.webviewId) && qt(n.webviewId),
			(t.selected || n.selected && "url" in t) && (C(n.url || "", n.truncatedUrl || "", n.truncatedHostUrl || ""), n.securityInfo && d(n.securityInfo), r(n) && (yt.hide(), f())),
			t.selected && (N(n.id, n.getLoadProgressPercent()), w(!0)),
			t.selected && A(n.id, n.getTitle()),
			(t.selected || n.selected && "securityInfo" in t) && d(n.securityInfo),
			(t.selected || n.selected && "parentId" in t) && k()
		}
		function _() {
			var e = et.getAll().length;
			2 > e ? document.getElementById("tabCounter").classList.add("hidden") : (document.getElementById("tabCounter").classList.remove("hidden"), document.getElementById("tabCounter").innerText = e, e >= 100 ? document.getElementById("tabCounter").classList.add("small-tab-counter") : document.getElementById("tabCounter").classList.remove("small-tab-counter"))
		}
		function R() {
			document.getElementById("urlfield").placeholder = lt.translate(107),
			document.getElementById("showtabscontainer").title = lt.translate(108),
			document.getElementById("back").title = lt.translate(109),
			document.getElementById("overflowmenu").title = lt.translate(96),
			document.getElementById("contracturl").title = lt.translate(43),
			document.getElementById("stop").title = lt.translate(110),
			document.getElementById("urlfield").setAttribute("aria-label", lt.translate(111))
		}
		function O(e) {
			var t = 13 === e.keyCode;
			if (t && _t === Nt)
				y();
			else if (t) {
				var n = this.value.trim();
				if (!n)
					return;
				I(n),
				document.activeElement.blur()
			}
		}
		function D(e) {
			var t = e.keyCode >= 37 && 40 >= e.keyCode,
			n = 13 === e.keyCode,
			i = 18 === e.keyCode;
			n || i || t || _t !== Nt || (this.value = "", y())
		}
		function B(t) {
			e("iris/fullscreen").isFullScreen() || G.startDrag(t)
		}
		function M(e) {
			e >= document.getElementById("showtabscontainer").offsetTop ? G.endDrag() : G.endDrag(!0),
			document.getElementById("tabSplatImage").classList.add("hidden")
		}
		function P(e) {
			G.updateDrag(e)
		}
		function U(e) {
			Q = !(dt.getCurrentInformationDensity() !== dt.INFORMATION_DENSITIES.HIGH || (void 0 !== e ? e : Et.isEnabled()) || dt.isWSeries() && 0 === window.orientation % 180)
		}
		function F() {
			U(),
			et.reposition(et.getCurrentTabId()),
			Q ? Kt() : zt(),
			_t === kt && document.execCommand("RevealSelection"),
			It !== et.getNewTabUrl() && _t === Nt && s(i())
		}
		function H(e) {
			var t = {
				hoverInClass : "action-bar-action-item-pressed",
				hoverInAnimationType : ft.ACTION_ITEM_HIGHLIGHT_HOVER_IN,
				hoverOutAnimationType : ft.ACTION_ITEM_HIGHLIGHT_HOVER_OUT
			};
			t = ct.extend(t, e);
			var n = mt.create(t);
			ut.register(n)
		}
		function V(e) {
			return "opacity " + e + "ms ease-out, -webkit-transform " + e + "ms " + ft.getCurve()
		}
		function W() {
			tt.un("ContextMenuCallbacksSupported", E)
		}
		function q() {
			it.hide()
		}
		var G,
		K,
		z,
		Y,
		j,
		J,
		X,
		Z,
		Q,
		$,
		et = e("iris/tabs/controller"),
		tt = e("iris/event"),
		nt = e("plugins/contextmenu/index"),
		it = e("plugins/titlebar/index"),
		rt = e("plugins/searchresults/index"),
		at = e("plugins/backforwardlist/index"),
		ot = e("screen/manager"),
		st = e("ui/utils"),
		ct = e("iris/utils"),
		lt = e("iris/i18n"),
		dt = e("iris/device"),
		ut = e("ui/hover/hoverController"),
		mt = e("ui/hover/hoverHandlerFactory"),
		ft = e("ui/animationTimings"),
		pt = e("screen/animationCoordinator"),
		gt = e("plugins/tooltipbar/index"),
		ht = e("plugins/minibar/index"),
		vt = e("plugins/actionbar/index"),
		bt = e("iris/settings"),
		Et = e("iris/screen.reader"),
		wt = e("iris/keyboard.focus"),
		Tt = e("plugins/screens/reader/index"),
		yt = e("plugins/pageloadprogressbar/index"),
		It = "",
		St = "",
		xt = "",
		Ct = ["touchstart", "mousedown"],
		kt = 0,
		At = 1,
		Nt = 2,
		Lt = 3,
		_t = Nt,
		Rt = !1,
		Ot = 350,
		Dt = 500,
		Bt = !1,
		Mt = 250,
		Pt = 2e3,
		Ut = 1e3,
		Ft = 80,
		Ht = 3e3,
		Vt = [{
				event : "webpage.obscured",
				name : "webpage",
				allowMultipleEvents : !0
			}, {
				event : "progress.show",
				name : "progressbar"
			}, {
				event : "tabbar.showing",
				name : "tabbar"
			}, {
				event : "formcontrol.becomingVisible",
				name : "formcontrol"
			}
		],
		Wt = [{
				event : "webpage.unobscured",
				name : "webpage"
			}, {
				event : "progress.hide",
				name : "progressbar"
			}, {
				event : "tabbar.hidden",
				name : "tabbar"
			}, {
				event : "formcontrol.invisible",
				name : "formcontrol"
			}
		],
		qt = function (e) {
			J && J != e && qnx.callExtensionMethod("webview.setScrollTriggerBox", J, JSON.stringify({
					x : 0,
					y : 0,
					width : -1,
					height : -1
				})),
			J = e;
			var t = qnx.callExtensionMethod("webview.scrollPosition", J);
			t && (t = JSON.parse(t), qnx.callExtensionMethod("webview.setScrollTriggerBox", J, JSON.stringify({
						x : 0,
						y : t.y - Ft,
						width : -1,
						height : 2 * Ft
					})))
		},
		Gt = function (e) {
			X.isBlocked() || vt.isContracted() || et.hasNetworkError(et.getCurrentTabId()) || document.getElementById("navigationbar").contains(document.activeElement) || !Q || (e && qt(J, !0), yt.minibarVisible(!0), vt.contract())
		},
		Kt = function () {
			clearTimeout(Z),
			Z = setTimeout(Gt, Ht, !0)
		},
		zt = function (e) {
			vt.isContracted() && yt.hide();
			var t = function () {
				yt.minibarVisible(!1),
				a(et.getSelected()) || yt.show()
			};
			vt.expand(!!e, t),
			Kt()
		};
		K = dt.isASeries() ? 80 : dt.isOSeries() || dt.isWSeries() ? 120 : dt.isLSeries() ? 100 : 90;
		var v,
		Yt = function (e, t) {
			"S" === t.boxMovement.charAt(0) ? Gt() : "N" === t.boxMovement.charAt(0) && (document.getElementById("navigationbar").contains(document.activeElement) && document.activeElement.blur(), zt())
		};
		tt.on("webview.canNavigateBack", k),
		tt.on("webpage.title.updated", A),
		tt.on("webpage.load.progress", N),
		$ = {
			barHeight : function () {
				return K
			},
			minBarHeight : function () {
				return U(),
				Q ? ht.height() : $.barHeight()
			},
			init : function () {
				yt.create(),
				tt.on("ProcessCrash", function () {
					v(),
					nt.hideContextMenu()
				}),
				tt.on("searchresults.select", v),
				tt.on("searchresults.hide", function () {
					document.getElementById("showtabscontainer").tabIndex = 1,
					document.getElementById("back").tabIndex = document.getElementById("back").classList.contains("cant-go-back") ? -1 : 1,
					document.getElementById("urlfield") !== document.activeElement && v()
				}),
				tt.on("searchresults.show", function () {
					document.getElementById("showtabscontainer").tabIndex = -1,
					document.getElementById("back").tabIndex = -1
				}),
				tt.on("tabs.created", _),
				tt.on("tabs.removed", _),
				tt.on("DocumentLoadCommitted", function (e) {
					var t = et.getSelected();
					t && t.webviewId === e && it.setTitle(t.getTitle() || t.url)
				}),
				G = e("plugins/tabbar/index"),
				tt.on("application.swipeDown", function () {
					G.isShowing() || e("plugins/overflowmenu/index").visibleMenu() || w(!0)
				});
				var t,
				n = gt.createToolTipObj(document.getElementById("overflowmenu"), function () {
						return lt.translate(96)
					}),
				i = document.getElementById("rightPipeContainer"),
				r = function (e) {
					document.getElementById("right-button-overlay").classList.contains("action-bar-action-item-pressed") && !e ? i.classList.add("hidden") : i.classList.remove("hidden")
				},
				a = function () {
					r(!1),
					t(),
					gt.showToolTipBar(n)
				};
				H({
					hoverTargetElement : document.getElementById("overflowmenu"),
					hoverStyleElement : document.getElementById("right-button-overlay"),
					onHoverTargetClick : e("plugins/screens/tab/index").showOverflowMenu,
					onHoverTargetTouchEnd : e("plugins/screens/tab/index").showOverflowMenu,
					onHoverTouchIn : a,
					onHoverTouchEnd : r.bind(this, !0)
				}),
				tt.on("application.systemLanguageChange", R),
				R(),
				t = function () {
					z && (window.clearTimeout(z), z = void 0),
					at.hide()
				};
				var s = function () {
					at.isShowing() || (Kt(), t(), et.backSelected(), tt.emit("navigationbar.buttonClick", ["back"]))
				},
				l = document.getElementById("leftPipeContainer"),
				d = function (e) {
					!document.getElementById("tab-button-overlay").classList.contains("action-bar-action-item-pressed") && !document.getElementById("back-button-overlay").classList.contains("action-bar-action-item-pressed") || e ? l.classList.remove("hidden") : l.classList.add("hidden")
				},
				u = function () {
					d(!1),
					z = setTimeout(function () {
							G.isShowing() || (gt.hideToolTipBar(), at.show())
						}, Dt)
				};
				H({
					hoverTargetElement : document.getElementById("back"),
					hoverStyleElement : document.getElementById("back-button-overlay"),
					onHoverTargetClick : s,
					onHoverTargetTouchEnd : s,
					onHoverTouchIn : u,
					onHoverTouchEnd : d.bind(this, !0)
				});
				var m = document.getElementById("navigationbar");
				m.addEventListener("mousedown", function (t) {
					t.preventDefault(),
					t.stopPropagation(),
					e("iris/sensitivity").resetSensitivity()
				}),
				m.addEventListener("touchstart", function () {
					e("iris/sensitivity").resetSensitivity()
				}),
				m.addEventListener("mouseout", function (e) {
					m === e.target || m.contains(e.relatedTarget) || m.contains(document.activeElement) && (document.activeElement.blur(), yt.minibarVisible(!0), vt.contract(), wt.setTabFocus())
				});
				var f = document.getElementById("showtabscontainer"),
				p = gt.createToolTipObj(f, function () {
						return lt.translate(108)
					}),
				g = function () {
					d(!1),
					t(),
					G.isShowing() || gt.showToolTipBar(p)
				},
				h = function () {
					G.isShowing() || G.show()
				};
				H({
					hoverTargetElement : f,
					hoverStyleElement : document.getElementById("tab-button-overlay"),
					onHoverTargetTouchEnd : h,
					onHoverTargetClick : h,
					onHoverTouchIn : g,
					onHoverTouchEnd : d.bind(this, !0)
				}),
				f.addEventListener("mousedown", function (e) {
					G.startDrag(e.screenX)
				}),
				f.addEventListener("mouseup", function (e) {
					M(e.screenY)
				}),
				f.addEventListener("touchstart", function (e) {
					B(e.targetTouches[0].screenX)
				}),
				f.addEventListener("touchend", function (e) {
					e.stopPropagation(),
					e.preventDefault(),
					M(e.changedTouches[0].clientY)
				}),
				f.addEventListener("touchmove", function (e) {
					P(e.targetTouches[0].screenX)
				}),
				document.getElementById("stop").addEventListener("click", function () {
					et.stopSelected(),
					tt.emit("navigationbar.buttonClick", ["stop"])
				});
				var b = document.getElementById("urlfield");
				o(),
				b.addEventListener("mousedown", function (e) {
					e.stopPropagation(),
					_t === Nt && e.preventDefault()
				}),
				b.addEventListener("click", function (e) {
					e.preventDefault(),
					e.stopPropagation(),
					nt.isMenuVisible() ? nt.hideContextMenu() : y(),
					tt.emit("navigationbar.buttonClick", ["urlfield"])
				}),
				b.addEventListener("contextmenu", function (e) {
					e.stopPropagation()
				});
				var E = function () {
					rt.isShowing() || _t === Nt || _t === Lt || (v(), nt.hideContextMenu())
				};
				b.addEventListener("blur", E),
				tt.on("Focus", function (e, t) {
					JSON.parse(t).isFocused || E()
				}, [iris.chromeId]),
				tt.on("application.stateChange", E, ["thumbnail"]),
				b.justTypeFocus = function () {
					y(),
					b.focus()
				},
				b.addEventListener("keyup", O),
				b.addEventListener("keydown", D),
				b.addEventListener("input", x),
				b.style.webkitUserSelect = "none";
				var T = document.getElementById("contracturl"),
				I = function () {
					v(),
					tt.emit("navigationbar.buttonClick", ["contracturl"])
				},
				S = gt.createToolTipObj(T, function () {
						return lt.translate(43)
					}),
				C = function () {
					r(!1),
					gt.showToolTipBar(S)
				};
				H({
					hoverTargetElement : T,
					hoverStyleElement : document.getElementById("right-button-overlay"),
					onHoverTargetClick : I,
					onHoverTargetTouchEnd : I,
					onHoverTouchIn : C,
					onHoverTouchEnd : r.bind(this, !0)
				}),
				tt.on("tabs.updated", L),
				tt.on("tabs.stopped", L),
				tt.on("tabs.reloaded", L),
				X = e("iris/blocker").createBlocker("minibar", Vt, Wt, zt.bind(this, !0), Kt),
				ht.init(function () {
					wt.setChromeFocus(),
					Tt.isOpen() ? vt.expand(!0) : zt(!0)
				}),
				tt.on("application.swipeDown", zt),
				tt.on("ScrollTriggerBoxDirectionChanged", Yt),
				window.addEventListener("orientationchange", F, !1),
				tt.on("settings.updated", function (e, t) {
					e === bt.ENABLE_PRIVATE_BROWSING && c(t)
				}),
				c(bt.getValue(bt.ENABLE_PRIVATE_BROWSING))
			},
			updateUrl : C,
			urlFocus : y,
			urlFocusOut : v,
			urlExpanded : function () {
				return _t === kt || _t === At
			},
			setHasUnseenTabs : function (e) {
				var t = document.getElementById("tabSplatImage");
				e ? (t.style.webkitAnimationName = ot.currentScreen() !== ot.homeScreen() ? "none" : "", t.classList.remove("hidden")) : t.classList.add("hidden")
			},
			blendInButtons : function (e) {
				var t = document.getElementById("navigationbar");
				0 === e ? (t.style.webkitTransition = "", t.classList.remove("navbar-blend-out"), document.getElementById("nav-bar-private-underlay").classList.remove("hidden")) : (t.style.webkitTransition = V(e), st.transitionWithTimeout(t, function () {
						t.classList.remove("navbar-blend-out"),
						document.getElementById("nav-bar-private-underlay").classList.remove("hidden")
					}, e + 100))
			}
		},
		tt.on("browser.init.tier1", $.init),
		tt.on("PropertyScreenReaderEnabledEvent", function (e, t) {
			dt.getCurrentInformationDensity().type === dt.INFORMATION_DENSITIES.HIGH.type && U(t),
			et.reposition(et.getCurrentTabId()),
			Q ? Kt() : zt()
		}),
		tt.on("actionbar.up", W),
		tt.on("actionbar.down", q),
		n.exports = $
	}), define("plugins/overflowmenu/index", function (e, t, n) {
		function i(e, t) {
			var n = document.createElement("div"),
			i = document.createElement("div"),
			r = document.createElement("img"),
			a = document.createElement("div"),
			o = document.createElement("div"),
			s = document.createElement("div"),
			c = document.createElement("div");
			if (a.innerText = e.text(), a.className = "menu-text end-horizontal-padding-size-m font-size-m", a.setAttribute("aria-hidden", "true"), r.src = e.icon ? e.icon : S, e.translateIcon && (r.src = e.translateIcon()), r.className = "menu-image large-icon horizontal-padding-size-m", r.setAttribute("aria-hidden", "true"), i.setAttribute("aria-hidden", "true"), i.className = "menu-item-contents", i.appendChild(r), i.appendChild(a), o.className = "menu-item-background accent-colour-shade-background", o.setAttribute("aria-hidden", "true"), s.className = "menu-item-background inverted-background", s.setAttribute("aria-hidden", "true"), c.className = "menu-item-background", c.setAttribute("aria-hidden", "true"), n.appendChild(i), n.appendChild(o), n.appendChild(s), n.appendChild(c), n.className = "menu-item row-border-bottom", n.setAttribute("role", "menuitem"), n.setAttribute("aria-label", e.text()), n.tabIndex = 1, n.id = "overflow-item" + f++, n.style.navLeft = "#" + n.id, l.hasPhysicalKeyboard() && e.shortcut) {
				var d = document.createElement("div");
				d.className = "menu-shortcut end-horizontal-padding-size-m font-size-xxs",
				d.innerText = e.shortcut(),
				i.appendChild(d)
			}
			return t.addFocusListeners(n),
			n.item = e,
			n
		}
		function r(t, n) {
			function r() {
				Object.keys(F).forEach(function (e) {
					var t = F[e],
					n = t.querySelector(".menu-shortcut");
					if (t.setAttribute("aria-label", t.item.text()), t.querySelector(".menu-text").innerText = t.item.text(), n && (n.innerText = t.item.shortcut()), t.item.translateIcon) {
						var i = t.querySelector(".menu-image");
						i.src = t.item.translateIcon()
					}
				}),
				B && B.setAttribute("aria-label", d.translate(105))
			}
			function a(e) {
				B && (m.isEnabled() && e ? (B.style.display = "block", B.style.zIndex = n.domElement.style.zIndex) : B.style.display = "none")
			}
			function o() {
				m.isEnabled() && !B && (B = document.createElement("div"), B.classList.add("close-area"), B.setAttribute("role", "button"), B.setAttribute("aria-label", d.translate(105)), B.addEventListener("click", V.hide), document.getElementById("OverflowMenu").appendChild(B)),
				a(P === A || P === k)
			}
			function c(e) {
				e.stopImmediatePropagation(),
				e.preventDefault(),
				V.hide()
			}
			function f() {
				var t = n.getActionBar();
				n.redirect(x, c),
				n === e("plugins/screens/tab/index") && n.suppressEventsToTabs(),
				t.redirect(x, c),
				t.updateActionBar(!0)
			}
			function g() {
				var t = n.getActionBar();
				n.clearRedirect(x, c),
				n === e("plugins/screens/tab/index") && n.releaseEventsToTabs(),
				t.clearRedirect(x, c),
				t.updateActionBar(!1)
			}
			function h() {
				P = N,
				U.classList.remove("show-menu"),
				U.style.webkitTransitionDuration = y,
				a(!1),
				s.emit("screen.menu.hiding", [V], !0),
				g(),
				M.clearSelection()
			}
			function v() {
				P = C,
				Array.prototype.forEach.call(U.querySelectorAll(".menu-item-background"), function (e) {
					e.style.webkitTransitionDuration = I + "ms",
					e.style.opacity = 0
				}),
				s.emit("screen.menu.hidden", [V], !0)
			}
			function w() {
				U.style.zIndex = n.domElement.style.zIndex,
				P = k,
				U.classList.add("show-menu"),
				U.style.webkitTransitionDuration = E,
				a(!0),
				s.emit("screen.menu.showing", [V], !0),
				f()
			}
			function S() {
				P = A,
				s.emit("screen.menu.shown", [V], !0)
			}
			function L() {
				var e = U.querySelectorAll(".menu-item:not(.disabled)");
				if (e.length > 0) {
					for (var t = 0; e.length > t; t++)
						e[t].style.navUp = "", e[t].style.navDown = "";
					p.focus(),
					e[e.length - 1].scrollIntoView(!1),
					e[0].style.navUp = "#" + e[0].id,
					e[e.length - 1].style.navDown = "#" + e[e.length - 1].id,
					p.style.navUp = "#" + e[e.length - 1].id,
					p.style.navDown = "#" + e[0].id
				}
			}
			function _() {
				if (l.isClassic()) {
					var e = U.querySelectorAll(".menu-item:not(.disabled)");
					e.length > 0 && e[e.length - 1].focus()
				}
			}
			function R(t, i) {
				t != e("ui/interactionController").interactionType.click && t != e("ui/interactionController").interactionType.holdRelease || F[i.name].classList.contains("disabled") || (s.emit("screen.menu.itemClicked", [n.id, i.name]), V.hide(), i.action())
			}
			function O(e) {
				var t = u.screenPointFromEvent(e);
				t && (H.setNewPosition(t.x, t.y), H.swipeDirection() === H.RIGHT && V.hide())
			}
			function D() {
				H.swipeDirection() === H.RIGHT && V.hide(),
				H.resetSwipeDetection()
			}
			var B,
			M,
			P = C,
			U = document.createElement("div"),
			F = {},
			H = e("iris/peek").createSwipeDetector(),
			V = this;
			V.hide = function () {
				return P !== A ? (P === k && s.once("screen.menu.shown", V.hide, [V]), void 0) : (p.tabIndex = -1, u.transitionWithTimeout(U, h, T, v), void 0)
			},
			V.show = function () {
				if (P === C) {
					if (e("plugins/overflowmenu/index").visibleMenu())
						return console.error("Trying to show an overflow menu while one is visible. Not good, preventing."), void 0;
					p.tabIndex = 1,
					L(),
					u.transitionWithTimeout(U, w, b, S),
					_()
				}
			},
			V.enableItem = function (e) {
				F[e.name] && (F[e.name].tabIndex = 1, F[e.name].style.navUp = "", F[e.name].style.navDown = "", F[e.name].classList.remove("disabled"), F[e.name].setAttribute("aria-disabled", "false"))
			},
			V.disableItem = function (e) {
				F[e.name] && (F[e.name].tabIndex = -1, F[e.name].classList.add("disabled"), F[e.name].setAttribute("aria-disabled", "true"))
			},
			V.removeItem = function (e) {
				F[e.name] && (F[e.name] === U.firstElementChild && F[e.name].nextSibling.classList.add("row-border-top"), U.removeChild(F[e.name]), delete F[e.name])
			},
			M = e("ui/interactionController").create({
					container : U,
					ancestorClassName : "menu-item",
					getContextItem : function (e) {
						return e ? e.item : void 0
					},
					actionCallBack : R,
					getBackgroundElement : function (e) {
						return e.childNodes[1]
					},
					getBackgroundOverlayElement : function (e) {
						return e.childNodes[2]
					},
					focusRingForItem : function (e) {
						return F[e.name].childNodes[3]
					},
					backgroundPartiallySelectedOpacity : .15,
					backgroundSelectedOpacity : .5,
					backgroundKeepSelectedOpacity : .2
				}),
			V.insertBefore = function (e, t) {
				var n = t ? F[t.name] : null,
				r = i(e, M);
				n && n === U.firstElementChild && (n.classList.remove("row-border-top"), r.classList.add("row-border-top")),
				F[e.name] = r,
				U.insertBefore(r, n),
				L(),
				_()
			},
			V.contains = function (e) {
				return -1 !== Object.keys(F).indexOf(e.name)
			};
			var W = document.createDocumentFragment();
			t.forEach(function (e, t) {
				var n = i(e, M);
				0 === t && n.classList.add("row-border-top"),
				F[e.name] = n,
				W.appendChild(n)
			}),
			U.appendChild(W),
			U.classList.add("overflow-menu"),
			U.setAttribute("role", "menu"),
			p.appendChild(U),
			s.on("PropertyScreenReaderEnabledEvent", o),
			U.addEventListener("click", V.hide),
			e("screen/animationCoordinator").forceLayout(U),
			s.on("application.systemLanguageChange", r),
			U.addEventListener("touchmove", O),
			U.addEventListener("touchend", D)
		}
		var a,
		o,
		s = e("iris/event"),
		c = e("ui/animationTimings"),
		l = e("iris/device"),
		d = e("iris/i18n"),
		u = e("ui/utils"),
		m = e("iris/screen.reader"),
		f = 0,
		p = document.getElementById("OverflowMenu"),
		g = 59,
		h = g * l.getDesignUnitBucket(),
		v = c.getTiming(c.OPEN_OVERFLOW, h),
		b = v + 100,
		E = v + "ms",
		w = c.getTiming(c.CLOSE_OVERFLOW, h),
		T = w + 100,
		y = w + "ms",
		I = 350,
		S = "assets/generic_81_81_placeholder.png",
		x = ["touchstart", "mousedown"],
		C = "hidden",
		k = "showing",
		A = "shown",
		N = "hiding",
		L = {
			READER_FIND_ON_PAGE : {
				name : "Find on Page-reader",
				text : function () {
					return d.translate(112)
				},
				icon : "assets/ic_search.png",
				action : function () {
					e("plugins/screens/reader/index").showFind()
				},
				shortcut : function () {
					return d.translate(86)
				}
			},
			READER_INVERT_COLOURS_TO_DARK : {
				name : "Invert Colours Dark-reader",
				text : function () {
					return d.translate(113)
				},
				icon : "assets/ic_w_on_b.png",
				action : function () {
					e("plugins/screens/reader/index").invertColours()
				}
			},
			READER_INVERT_COLOURS_TO_BRIGHT : {
				name : "Invert Colours Bright-reader",
				text : function () {
					return d.translate(113)
				},
				icon : "assets/ic_b_on_w.png",
				action : function () {
					e("plugins/screens/reader/index").invertColours()
				}
			},
			SHOW_SETTINGS : {
				name : "Settings",
				text : function () {
					return d.translate(114)
				},
				icon : "assets/ic_settings.png",
				action : function () {
					e("plugins/screens/tab/index").showSettings()
				}
			},
			SHOW_DOWNLOADS : {
				name : "Downloads",
				text : function () {
					return d.translate(115)
				},
				icon : "assets/ic_downloads.png",
				action : function () {
					e("plugins/screens/tab/index").showDownloads()
				}
			},
			SAVE_PAGE : {
				name : "Save Page",
				text : function () {
					return d.translate(116)
				},
				icon : "assets/ic_save_webpage.png",
				action : function () {
					e("iris/downloads").savePage()
				}
			},
			ADD_SEARCH : {
				name : "Add Search",
				text : function () {
					return d.translate(117)
				},
				icon : "assets/ic_add.png",
				action : function () {
					e("iris/search").getDescriptorUrls(e("iris/tabs/controller").getSelected(), e("iris/search").addSearch)
				}
			},
			SITE_INFO : {
				name : "Site Info",
				text : function () {
					return d.translate(118)
				},
				icon : "assets/ic_info.png",
				action : function () {
					e("plugins/screens/tab/index").showSecurityInfo()
				}
			},
			ADD_TO_HOME_SCREEN : {
				name : "Add to Home Screen",
				text : function () {
					return d.translate(119)
				},
				icon : "assets/ic_add_home.png",
				action : function () {
					e("plugins/screens/tab/index").addHomescreenBookmark()
				}
			},
			ADD_BOOKMARK : {
				name : "Add Bookmark",
				text : function () {
					return d.translate(120)
				},
				icon : "assets/ic_add_bookmark.png",
				action : function () {
					var t = e("iris/tabs/controller").getSelected(),
					n = t.webpage ? t.webpage.getTitle() : "";
					e("plugins/screens/tab/index").addBookmark(L.ADD_BOOKMARK.text, n, t.url)
				}
			},
			EDIT_BOOKMARK : {
				name : "Edit Bookmark",
				text : function () {
					return d.translate(121)
				},
				icon : "assets/ic_edit_bookmarks.png",
				action : function () {
					e("plugins/screens/tab/index").editBookmark()
				}
			},
			READER : {
				name : "Reader",
				text : function () {
					return d.translate(122)
				},
				icon : "assets/ic_reader_mode.png",
				action : function () {
					e("plugins/screens/tab/index").showReader()
				},
				shortcut : function () {
					return d.translate(78)
				}
			},
			FIND_ON_PAGE : {
				name : "Find on Page",
				text : function () {
					return d.translate(112)
				},
				icon : "assets/ic_search.png",
				action : function () {
					e("plugins/screens/tab/index").findOnPage()
				},
				shortcut : function () {
					return d.translate(86)
				}
			},
			FORWARD : {
				name : "Forward",
				text : function () {
					return d.translate(123)
				},
				icon : "assets/ic_next.png",
				action : function () {
					e("iris/tabs/controller").forwardSelected()
				},
				shortcut : function () {
					return d.translate(82)
				},
				translateIcon : function () {
					return d.isRTLLocale() ? "assets/ic_previous.png" : "assets/ic_next.png"
				}
			},
			RELOAD : {
				name : "Reload",
				text : function () {
					return d.translate(124)
				},
				icon : "assets/ic_reload.png",
				action : function () {
					e("iris/tabs/controller").reloadSelected()
				},
				shortcut : function () {
					return d.translate(85)
				}
			},
			SELECT_ITEMS : {
				name : "Select Items",
				text : function () {
					return d.translate(125)
				},
				icon : "assets/ic_select_more.png",
				action : function () {
					e("plugins/screens/selectmore/index").show()
				}
			},
			SELECTMORE_SELECT_ALL_GRID : {
				name : "Select All-grid",
				text : function () {
					return d.translate(126)
				},
				icon : "assets/ic_select_all_grid.png",
				action : function () {
					e("plugins/screens/selectmore/index").selectAll()
				}
			},
			SELECTMORE_CANCEL_SELECTION_GRID : {
				name : "Cancel Selection-grid",
				text : function () {
					return d.translate(127)
				},
				icon : "assets/ic_cancel_selection_grid.png",
				action : function () {
					e("plugins/screens/selectmore/index").clearSelection()
				}
			},
			SELECTMORE_SELECT_ALL_LIST : {
				name : "Select All-list",
				text : function () {
					return d.translate(126)
				},
				icon : "assets/ic_select_all_list.png",
				action : function () {
					e("plugins/screens/selectmore/index").selectAll()
				}
			},
			SELECTMORE_CANCEL_SELECTION_LIST : {
				name : "Cancel Selection-list",
				text : function () {
					return d.translate(127)
				},
				icon : "assets/ic_cancel_selection_list.png",
				action : function () {
					e("plugins/screens/selectmore/index").clearSelection()
				}
			}
		};
		o = {
			items : L,
			create : function (e, t) {
				return new r(e, t)
			},
			visibleMenu : function () {
				return a
			},
			hideMenu : function () {
				a && a.hide()
			}
		},
		s.on("screen.menu.showing", function (e) {
			a = e
		}),
		s.on("screen.menu.hidden", function () {
			a = void 0
		}),
		n.exports = o
	}), define("plugins/pageloadprogressbar/index", function (e, t, n) {
		function i() {
			if (o && (o.destroy(), o = void 0), a || (a = e("plugins/pageloadprogressbar/experimental/index"), s.on("experimental.set.pageLoadProgressBarType", i)), a && !a.useDefault())
				o = a.createProgressBar();
			else {
				var t = document.getElementById("action-bar-area"),
				n = document.createElement("div"),
				r = document.createElement("div");
				n.id = "load-progress-bar",
				t.parentNode.insertBefore(n, t),
				o = e("plugins/progressindicator/index").createProgressBar(n, !0),
				o.minibarVisible = function (e) {
					e ? (r.classList.add("mini-bar-pulse"), n.classList.add("mini-bar-visible")) : (r.classList.remove("mini-bar-pulse"), n.classList.remove("mini-bar-visible"))
				},
				r.className = "progress-bar-pulse",
				t.insertBefore(r, t.firstElementChild);
				var c = o.show;
				o.show = function () {
					return l >= o.getProgress() && r.classList.add("pulse-now"),
					c()
				};
				var d = o.hide;
				o.hide = function () {
					return r.classList.remove("pulse-now"),
					d()
				};
				var u = o.setProgress;
				o.setProgress = function (e) {
					u(e),
					!r.classList.contains("pulse-now") && l >= e ? r.classList.add("pulse-now") : r.classList.contains("pulse-now") && e > l && r.classList.remove("pulse-now"),
					r.style.left = o.pDiv.style.width
				},
				o.destroy = function () {
					n.parentNode && n.parentNode.removeChild(n),
					r.parentNode && r.parentNode.removeChild(r)
				}
			}
		}
		var r,
		a,
		o,
		s = e("iris/event"),
		c = e("screen/manager"),
		l = 15;
		r = {
			create : function () {
				i()
			},
			setProgress : function (e) {
				o.setProgress(e)
			},
			hide : function () {
				o.hide()
			},
			show : function () {
				o.show()
			},
			isVisible : function () {
				return o.isVisible()
			},
			minibarVisible : function (e) {
				o.minibarVisible(e)
			}
		},
		s.on("manager.screen", r.hide, [s.FILTER_ANY, c.screenStates.PUSHED]),
		s.on("manager.screen", function () {
			c.currentScreen() === c.homeScreen() && 100 > o.getProgress() && !e("plugins/screens/tab/index").isShowingNewTabPage() && r.show()
		}, [s.FILTER_ANY, c.screenStates.POPPED]),
		n.exports = r
	}), define("plugins/progressindicator/index", function (e, t, n) {
		var i,
		r,
		a = e("ui/utils"),
		o = e("ui/animationTimings"),
		s = !0;
		r = {
			createProgressBar : function (e, t) {
				t && (e.style.webkitTransitionProperty = "-webkit-transform", e.style.webkitTransitionTimingFunction = o.getCurve()),
				e.classList.add("ProgressBar");
				var n = document.createElement("div");
				n.classList.add("ProgressBackground"),
				e.appendChild(n);
				var r = document.createElement("div");
				r.className = "ProgressFill accent-colour-highlight-background",
				e.appendChild(r);
				var c = {
					pDiv : r,
					pbDiv : e,
					setProgress : function (e) {
						e && (c.pDiv.style.width = e + "%", s && c.show())
					},
					getProgress : function () {
						return parseInt(c.pDiv.style.width, 10)
					},
					hide : function () {
						if (t) {
							i && i.cancel();
							var e = o.getTiming(o.PROGRESS_BAR_HIDE);
							c.pbDiv.style.webkitTransitionDuration = e + "ms",
							c.pbDiv.style.webkitTransitionDelay = e + "ms",
							i = a.transitionWithTimeout(c.pbDiv, function () {
									c.pbDiv.style.webkitTransform = ""
								}, e + 100)
						} else
							c.pbDiv.classList.add("hidden");
						s = !0
					},
					show : function () {
						if (t) {
							i && i.cancel();
							var e = o.getTiming(o.PROGRESS_BAR_SHOW);
							c.pbDiv.style.webkitTransitionDuration = e + "ms",
							c.pbDiv.style.webkitTransitionDelay = "0ms",
							i = a.transitionWithTimeout(c.pbDiv, function () {
									c.pbDiv.style.webkitTransform = "translateY(0)"
								}, e + 100)
						} else
							c.pbDiv.classList.remove("hidden");
						s = !1
					},
					setPaused : function (e) {
						e ? c.pDiv.classList.add("Pause") : c.pDiv.classList.remove("Pause")
					},
					isVisible : function () {
						return !s
					}
				};
				return c
			}
		},
		n.exports = r
	}), define("plugins/screens/add_bookmark_homescreen/index", function (e, t, n) {
		function i() {
			var e = document.getElementById("abhInput").value.trim();
			m.getElementsByClassName("abhShortcutTitle")[0].innerText = e,
			h.enableRightButton("" !== e)
		}
		function r() {
			var e = document.getElementById("abhInput");
			e.setSelectionRange(0, e.value.length)
		}
		function a(e) {
			w.requestFileSystem(w.sandboxType.SANDBOXED, window.TEMPORARY, 1048576, function (t) {
				t.root.getFile(I, {
					create : !0
				}, function (n) {
					n.createWriter(function (i) {
						i.onwriteend = function () {
							p = t.name + n.fullPath
						},
						i.onerror = function (e) {
							console.log("Write failed: " + ("" + e))
						},
						i.write(e)
					}, function (e) {
						console.log("filesystem createWriter Error", e.code)
					})
				}, function (e) {
					console.log("filesystem getFile Error", e.code)
				})
			}, function (e) {
				console.log("filesystem webkitRequestFileSystem Error", e.code)
			})
		}
		function o(e, t) {
			e.appleIconSaved || b.getCurrentTabId() == e.id && (m.getElementsByClassName("abhShortcutIcon")[0].setAttribute("src", t), a(new window.Blob([w.base64ToArrayBuffer(t.substring(t.indexOf(",") + 1))], {
						type : "image/png"
					})))
		}
		function s() {
			if (void 0 !== p) {
				var e = encodeURI(f.url).replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/%25/g, "%"),
				t = document.getElementById("abhInput").value.replace(/,/g, "");
				qnx.callExtensionMethod("application.adduri", p, t, "default", e),
				p = void 0,
				document.getElementById("abhInput").blur(),
				T.popScreen(u),
				y.createBasicToast(E.translate(128))
			}
			g && g.abort()
		}
		function c() {
			p = void 0,
			document.getElementById("abhInput").blur(),
			T.popScreen(u),
			g && g.abort()
		}
		function l(e) {
			if (13 === parseInt(e.keyCode, 10)) {
				var t = this.value.trim();
				if (!t)
					return;
				s()
			}
		}
		function d() {
			u.setContext(f),
			h.setTitle(E.translate(119)),
			h.setLeftButtonText(E.translate(43)),
			h.setRightButtonText(E.translate(129))
		}
		var u,
		m,
		f,
		p,
		g,
		h,
		v = e("iris/event"),
		b = e("iris/tabs/controller"),
		E = e("iris/i18n"),
		w = e("iris/webfs.helper"),
		T = e("screen/manager"),
		y = e("plugins/toaster/index"),
		I = "apple-touch-icon.png";
		u = {
			init : function () {
				h = e("plugins/titlebarwithactions/index").createTitleBar({
						parentId : "abhSheetHeader",
						titleText : E.translate(119),
						leftText : E.translate(43),
						leftCallback : c,
						rightText : E.translate(129),
						rightCallback : s
					}),
				m = document.getElementsByClassName("abhSheetContent")[0],
				v.on("manager.screen", function (e, t) {
					e === u && "loadTransitionEnd" == t && u.isNowVisible()
				});
				var t = document.getElementById("abhInput");
				t.addEventListener("input", i),
				t.addEventListener("keyup", l),
				v.on("application.systemLanguageChange", d)
			},
			becomingVisible : function () {},
			isNowVisible : function () {
				var e = document.getElementById("abhInput");
				e.focus(),
				r()
			},
			setContext : function (e) {
				f = e;
				var t = m.getElementsByClassName("abhShortcutTitle")[0],
				n = E.translate(130),
				i = m.getElementsByClassName("abhShortcutUrl")[0],
				r = E.translate(131),
				a = document.getElementById("abhInput"),
				o = E.translate(132);
				if (a.placeholder = o, a.setAttribute("aria-label", o), f && f.title) {
					var s = f.title.replace(/,/g, "");
					s = s.substr(0, a.maxLength),
					t.innerText = s,
					a.value = s
				} else
					t.innerText = n, t.addEventListener("focus", u.inputFocused.bind(u, t)), a.value = "";
				t.setAttribute("aria-label", n),
				h.enableRightButton("" !== a.value.trim()),
				i.innerText = f && f.url ? f.url : r,
				i.setAttribute("aria-label", r);
				var c = m.getElementsByClassName("abhShortcutIcon")[0];
				c.setAttribute("src", ""),
				c.setAttribute("aria-label", E.translate(133))
			},
			displayIcon : function (e, t) {
				if (t) {
					t = JSON.parse("[" + t + "]");
					var n;
					if (1 === t.length)
						n = t[0].defaultPath;
					else {
						n = t[1].iconUrl;
						for (var i = 0, r = 1; t.length > r; r++)
							if (t[r].sizes && t[r].sizes.length) {
								var s = parseInt(t[r].sizes.value, 10);
								s > i && (n = t[r].iconUrl, i = s)
							}
					}
					g && g.abort(),
					b.getTabForWebviewId(e).appleIconSaved = void 0,
					g = new XMLHttpRequest,
					g.open("GET", n, !0),
					g.responseType = "blob",
					g.onreadystatechange = function () {
						if (g && 4 === g.readyState) {
							if (200 == g.status && g.response.type && 0 === g.response.type.indexOf("image"))
								return m.getElementsByClassName("abhShortcutIcon")[0].setAttribute("src", n), a(g.response), b.getTabForWebviewId(e).appleIconSaved = !0, void 0;
							g = void 0
						}
					},
					g.send()
				}
				b.getLatestScreenCapture(b.getTabForWebviewId(e).id, o)
			},
			inputFocused : function (e) {
				e.classList.remove("abhDefaultText"),
				e.value = ""
			},
			inputKey : function (e, t) {
				var n = t.keyCode || t.which;
				32 == n && (u.addTag(e.value), e.value = "")
			}
		},
		n.exports = u
	}), define("plugins/screens/add_search_sheet/index", function (e, t, n) {
		function i() {
			h = [],
			v = [],
			document.getElementById("add-search-rows").innerHTML = "",
			c.popScreen(d)
		}
		function r() {
			for (var e = 0; v.length > e; e++)
				v[e].getCheckbox().checked && f.add(h[e]);
			i()
		}
		function a(e, t, n) {
			var i = document.createElement("div");
			i.tabIndex = 1,
			i.className = "add-search-row row-border-top",
			t.setFocusParent(i);
			var r = document.createElement("div");
			r.className = "inner-horizontal-row default-horizontal-padding",
			e.iconUrl || (e.iconUrl = n.faviconUrl);
			var a = document.createElement("div");
			a.className = "search-icon",
			a.style.backgroundImage = e.iconUrl ? "url(" + e.iconUrl + ")" : "";
			var o = document.createElement("div");
			o.className = "search-text";
			var s = document.createElement("bdi");
			s.appendChild(document.createTextNode(e.shortName)),
			o.appendChild(s);
			var c = document.createElement("div");
			c.className = "add-search-details font-size-xs default-horizontal-padding";
			var l = document.createElement("div");
			if (l.innerText = m.translate(134, URI(e.searchTemplate).authority()), c.appendChild(l), e.suggestTemplate) {
				var d = document.createElement("div");
				d.innerText = m.translate(135, URI(e.suggestTemplate).authority()),
				c.appendChild(d)
			}
			var u = document.createElement("div");
			return u.appendChild(t.getCheckboxContainer()),
			r.appendChild(a),
			r.appendChild(o),
			r.appendChild(u),
			i.appendChild(r),
			i.appendChild(c),
			i
		}
		function o(e, t, n) {
			var i = document.getElementById("add-search-rows");
			i.appendChild(a(e, t, n))
		}
		function s() {
			l.setLeftButtonText(m.translate(43)),
			l.setRightButtonText(m.translate(136)),
			l.setTitle(m.translate(117)),
			document.getElementById("add-search-header-text").innerText = m.translate(137),
			document.getElementById("add-search-rows").innerHTML = "";
			for (var e = 0; h.length > e; e++)
				o(h[e], v[e])
		}
		var c,
		l,
		d,
		u = e("iris/event"),
		m = e("iris/i18n"),
		f = e("iris/search"),
		p = e("plugins/titlebarwithactions/index"),
		g = e("plugins/checkboxer/index"),
		h = [],
		v = [];
		d = {
			init : function () {
				c = e("screen/manager"),
				l = p.createTitleBar({
						parentId : "searchSheetHeader",
						titleText : m.translate(117),
						leftText : m.translate(43),
						leftCallback : i,
						rightText : m.translate(136),
						rightCallback : r
					}),
				document.getElementById("add-search-header-text").innerText = m.translate(138),
				u.on("application.systemLanguageChange", s)
			},
			handleSearchProviders : function (t, n) {
				var i = e("screen/manager"),
				r = !1;
				if (t.length) {
					if (!i.isScreenPushed(d)) {
						r = !0;
						var a = i.loadSheet("add_search_sheet");
						i.pushScreen(a)
					}
					t.forEach(function (e) {
						var t = g.create({
								checked : r
							});
						v.push(t),
						h.push(e),
						o(e, t, n)
					})
				}
			},
			becomingVisible : function () {}

		},
		n.exports = d
	}), define("plugins/screens/bookmarks_main/index", function (e, t, n) {
		function i() {
			T && (_.dismissToast(T), T = void 0),
			m && m.completePendingDelete && m.completePendingDelete()
		}
		function r() {
			g.show(),
			w.disabled = !0,
			v.updateAction(w, B)
		}
		function a(e) {
			m.searchInputChanged(e)
		}
		function o() {
			if (!v) {
				b = {
					action : "Switch to List",
					actionHandler : x.showBookmarksList
				},
				E = {
					action : "Switch to Grid",
					actionHandler : x.showBookmarksGrid
				},
				w = {
					action : "Search",
					actionHandler : r
				};
				var t = {
					actionGroup : [{
							id : B,
							items : [w, E]
						}, {
							id : D,
							items : [w]
						}
					]
				};
				v = e("plugins/actionbar/index").makeActionBar(x, t, "Back", !1)
			}
		}
		function s(e) {
			if (v || o(), (!f || (f === x.bookmarkListView || f === x.bookmarkGridView) && e === x.tagsView || f === x.tagsView && e !== x.tagsView) && v.showActionBarItems(e === x.tagsView ? D : B, N.isScreenPushed(x)), e !== x.tagsView) {
				var t = e === x.bookmarkListView ? b : E,
				n = e === x.bookmarkListView ? E : b;
				v.replaceAction(t, n, B)
			}
		}
		function c(e, t) {
			S && e === I && "unloadTransitionEnd" === t ? (I = void 0, S.jobComplete()) : S && e === y && "loadTransitionEnd" === t && (y = void 0, S.jobComplete())
		}
		function l(e, t, n) {
			if (!S) {
				i(),
				s(e);
				var r,
				a = N.isScreenPushed(x);
				if (p && a && (p.enableButtonClick(!1), S = O.createParallel(function () {
								p.enableButtonClick(!0),
								S = void 0
							}), S.addJob(), S.addJob()), a || (r = N.loadScreen("bookmarks_main")), f == e)
					return a || N.pushScreen(r), void 0;
				var o = N.loadView(e, h, x, t ? t : "onScreen");
				A[e] && o.setDataSource(A[e]),
				o.setSearchBar && o.setSearchBar(g),
				m && m.getPlainSearchText && o.setSearchText && o.setSearchText(m.getPlainSearchText()),
				a && (y = o, N.pushView(o, !t)),
				m && (I = m, N.popView(m, n ? n : "", !n), n || N.unloadView(m)),
				m = o,
				f = e,
				f !== x.tagsView && L.setBookmarkViewSelected(f),
				a || (f === x.tagsView ? p.setContext(R.LAST) : p.setContext(R.FIRST), N.pushScreen(r))
			}
		}
		function d(e, t) {
			e === x && ("popped" === t || "hidden" === t) && (i(), I = void 0, y = void 0, S && (S.jobComplete(), S.jobComplete()))
		}
		function u() {
			p.setButtonText(R.FIRST, k.translate(139)),
			p.setButtonText(R.LAST, k.translate(140)),
			g.getSearchBarInputElement().setAttribute("aria-label", k.translate(141))
		}
		var m,
		f,
		p,
		g,
		h,
		v,
		b,
		E,
		w,
		T,
		y,
		I,
		S,
		x,
		C = e("iris/event"),
		k = e("iris/i18n"),
		A = {},
		N = e("screen/manager"),
		L = e("iris/bookmarks"),
		_ = e("plugins/toaster/index"),
		R = e("plugins/segmentedtitlebar/index"),
		O = e("iris/job.runner"),
		D = "tagsActionBarItems",
		B = "bookmarksActionBarItems";
		x = {
			init : function (t) {
				p = R.createSegmentedTitleBar("bookmarksMainTitleBar", k.translate(139), x.show, k.translate(140), x.showTags),
				g = e("plugins/searchbar/index").create("bookmarksMainSearchBar", a, x, function () {
						w.disabled && (w.disabled = !1, v.updateAction(w, B))
					}),
				g.getSearchBarInputElement().setAttribute("aria-label", k.translate(141)),
				h = t.getElementsByClassName("viewArea")[0];
				var n = e("iris/bookmarks").search;
				A[x.bookmarkListView] = n,
				A[x.bookmarkGridView] = n,
				C.on("manager.screen", d),
				C.on("application.systemLanguageChange", u),
				C.on("manager.view", c)
			},
			becomingVisible : function () {
				m.becomingVisible()
			},
			getActionBar : function () {
				return v || o(),
				v
			},
			getCurrentView : function () {
				return m
			},
			showTags : function () {
				l(x.tagsView)
			},
			showBookmarksGrid : function () {
				l(x.bookmarkGridView, "view-unloaded", "view-unloaded")
			},
			showBookmarksList : function () {
				l(x.bookmarkListView, "view-unloaded", "view-unloaded")
			},
			show : function () {
				var e = L.getBookmarkViewSelected();
				l(e ? e : x.bookmarkGridView)
			},
			editBookmark : function () {
				var e = N.loadSheet("edit_bookmark");
				N.pushScreen(e)
			},
			bookmarkListView : "bookmark_list",
			bookmarkGridView : "bookmark_grid",
			tagsView : "labeled_bookmarks_list",
			justTypeField : function () {
				return g.getSearchBarInputElement()
			}
		},
		n.exports = x
	}), define("plugins/screens/crashpage_screen/index", function (e, t, n) {
		var i,
		r,
		a,
		o = e("iris/event"),
		s = e("iris/error"),
		c = e("iris/tabs/controller"),
		l = e("iris/i18n"),
		d = e("plugins/titlebarwithactions/index"),
		u = e("screen/manager"),
		m = e("plugins/checkboxer/index"),
		f = [],
		p = function () {
			o.on("Created", function e() {
				u.rollBackToScreen(u.homeScreen()),
				o.un("Created", e)
			}),
			s.wrap(c.removeAllTabs, 1)(),
			s.wrap(c.createNewTab, 1)()
		},
		g = function () {
			var e = !0;
			o.on("Created", function t() {
				u.rollBackToScreen(u.homeScreen()),
				o.un("Created", t)
			}),
			s.wrap(c.removeAllTabs, 1)(),
			s.wrap(function () {
				f.forEach(function (t) {
					if (t.checked === !0) {
						var n = {
							url : t.url,
							title : t.title,
							selected : e
						};
						e || (n.webviewId = void 0),
						c.create(n),
						e = !1
					}
				})
			}, "tabController.create")()
		},
		h = function () {
			r.setTitle(l.translate(142)),
			r.setLeftButtonText(l.translate(143)),
			r.setRightButtonText(l.translate(144)),
			document.getElementById("restore-info").innerText = l.translate(145)
		},
		v = function (e) {
			var t = document.createElement("div"),
			n = document.createElement("label"),
			a = m.create({}),
			o = document.createElement("div"),
			s = document.createElement("div"),
			c = document.createElement("div"),
			d = {};
			t.classList.add("restore-select-row"),
			t.tabIndex = 1,
			a.setFocusParent(t),
			n.htmlFor = a.getCheckbox().id,
			a.getCheckbox().addEventListener("click", function () {
				d.checked = a.getCheckbox().checked;
				var e = f.some(function (e) {
						return e.checked
					});
				r.enableRightButton(e)
			}),
			o.classList.add("restore-text"),
			s.classList.add("restore-title"),
			s.classList.add("font-size-l"),
			d.title = "" === e.getTitle() ? l.translate(58) : e.getTitle(),
			s.appendChild(document.createTextNode(d.title)),
			c.classList.add("restore-url"),
			d.url = e.url,
			c.appendChild(document.createTextNode(d.url)),
			o.appendChild(s),
			o.appendChild(c),
			n.appendChild(a.getCheckboxContainer()),
			n.appendChild(o),
			t.appendChild(n),
			i.appendChild(t),
			f.push(d)
		},
		b = function (e) {
			var t = c.getTabForWebviewId(e);
			t && (u.isScreenPushed(a) || (u.pushScreen(u.loadScreen("crashpage_screen")), c.getAll().forEach(function (e) {
						e.webviewId || v(e)
					})), v(t))
		};
		a = {
			preventPeek : function () {
				return !0
			},
			init : function () {
				r = d.createTitleBar({
						parentId : "crashpageHeader",
						titleText : l.translate(142),
						leftText : l.translate(143),
						leftCallback : p,
						rightText : l.translate(144),
						rightCallback : g
					}),
				document.getElementById("restore-info").innerText = l.translate(145),
				o.on("applications.systemLanguageChange", h)
			},
			becomingVisible : function () {
				i = document.getElementById("restore-select-panel"),
				i.innerHTML = "",
				f = [],
				r.enableRightButton(!1),
				r.enableLeftButton(!0)
			}
		},
		o.on("ProcessCrash", b),
		n.exports = a
	}), define("plugins/screens/download_save_screen/index", function (e, t, n) {
		function i() {
			var e = a.value.trim();
			s.enableRightButton("" !== e)
		}
		function r() {
			a.placeholder = d.translate(146),
			s.setTitle(d.translate(147)),
			s.setLeftButtonText(d.translate(43)),
			s.setRightButtonText(d.translate(129))
		}
		var a,
		o,
		s,
		c,
		l = e("iris/event"),
		d = e("iris/i18n");
		c = {
			init : function () {
				a = document.getElementById("downloadSaveInput"),
				a.placeholder = d.translate(146),
				s = e("plugins/titlebarwithactions/index").createTitleBar({
						parentId : "downloadSaveHeader",
						titleText : d.translate(147),
						leftText : d.translate(43),
						leftCallback : function () {
							c.doCancel()
						},
						rightText : d.translate(129),
						rightCallback : function () {
							c.doSave()
						}
					}),
				a.addEventListener("keyup", i),
				a.addEventListener("input", i),
				l.on("application.systemLanguageChange", r)
			},
			becomingVisible : function () {},
			setContext : function (e) {
				o = e,
				o && o.item && (a.value = o.item.title)
			},
			dismiss : function () {
				a.blur(),
				e("screen/manager").popScreen(c)
			},
			doCancel : function () {
				qnx.callExtensionMethod("download.updateDownload", o.item.id, "ActionDiscard", o.item.title),
				c.dismiss()
			},
			doSave : function () {
				c.dismiss(),
				o.item.title = a.value.length ? a.value : "undefined",
				o.item.name = o.item.title,
				e("iris/downloads").addDownload(o.webviewId, o.item)
			}
		},
		n.exports = c
	}), define("plugins/screens/downloads_panel/index", function (e, t, n) {
		function i(e) {
			var t,
			n = 0;
			e /= 1;
			do
				t = e, e = t / 1e3, n++;
			while (5 > n && e >= 1);
			var i = 1 === n ? "B" : 2 === n ? "KB" : 3 === n ? "MB" : "GB";
			return t.toFixed(2) + i
		}
		function r(e, t) {
			switch (e) {
			case "ResultSuccess":
				return W.translate(148);
			case "ResultCancelled":
				return W.translate(149);
			default:
				return t && t.classList.add("errormsg"),
				W.translate(150)
			}
		}
		function a(e, t) {
			return e >= 0 && ("" === t || "paused" === t || "reload" === t) ? !1 : !0
		}
		function o(e, t, n) {
			for (var i = 0; t && t.length > i; i++)
				if (e === t[i])
					return n;
			return 0
		}
		function s(e) {
			if (!e)
				return it;
			var t = e.toLowerCase();
			if (0 === t.indexOf("image/"))
				return at;
			if (0 === t.indexOf("video/"))
				return lt;
			var n = o(t, Nt, lt);
			if (n)
				return n;
			if (0 === t.indexOf("audio/"))
				return et;
			for (var i = 0; Rt.length > i; i++)
				if (n = o(t, Rt[i][0], Rt[i][2]))
					return n;
			return it
		}
		function c(e) {
			var t = e.lastIndexOf(".");
			if (-1 === t)
				return void 0;
			for (var n, i = e.substr(t + 1).toLowerCase(), r = 0; Rt.length > r; r++)
				if (n = o(i, Rt[r][1], Rt[r][2]))
					return n;
			return void 0
		}
		function l(e) {
			switch (e) {
			case et:
				return W.translate(151);
			case nt:
				return W.translate(152);
			case rt:
				return W.translate(153);
			case at:
				return W.translate(154);
			case ot:
				return W.translate(155);
			case st:
				return W.translate(156);
			case ct:
				return W.translate(157);
			case lt:
				return W.translate(158);
			case dt:
				return W.translate(159);
			case ut:
				return W.translate(160);
			case it:
			default:
				return W.translate(161)
			}
		}
		function d(e) {
			switch (e) {
			case X:
				return W.translate(162);
			case Z:
				return W.translate(163);
			case Q:
				return W.translate(43);
			case $:
				return W.translate(124)
			}
		}
		function u(e) {
			return "application/vnd.oma.drm.message" === e.type
		}
		function m(e) {
			var t = c(e.title);
			return t ? t : s(e.type)
		}
		function f(e) {
			e ? (D.classList.remove("hidden"), D.parentElement.style.overflowY = "hidden") : (D.classList.add("hidden"), D.parentElement.style.overflowY = "")
		}
		function p(e) {
			e ? (O.classList.add("hidden"), document.getElementById("download-loader").classList.remove("hidden")) : (O.classList.remove("hidden"), document.getElementById("download-loader").classList.add("hidden"))
		}
		function g(e) {
			J.disabled = !e,
			P.updateAction(J)
		}
		function h() {
			var e = !1;
			return H.list(function (t) {
				e = t.some(function (e) {
						return a(e.id, e.status) ? !0 : void 0
					})
			}),
			e
		}
		function v() {
			B && (G.dismissToast(B), B = void 0)
		}
		function b(e) {
			return encodeURI("file://" + e).replace(/#/g, "%23")
		}
		function E(t) {
			p(!0);
			var n = {
				uri : b(t.name),
				file_transfer_mode : q.FILE_TRANSFER_PRESERVE
			};
			q.invoke(n, function (n, i) {
				p(!1),
				n ? (v(), B = G.createBasicToast(W.translate(164)), V.emit("interaction.controller.clear.selection", [t])) : "com.flashbrowser" === i[0] && e("screen/manager").popScreen(F)
			})
		}
		function w(t, n) {
			e("iris/webfs.helper").fileExists(t.name, function (e) {
				!e || u(t) ? (v(), B = G.createBasicToast(e ? W.translate(164) : W.translate(165))) : n()
			})
		}
		function T(t, n) {
			var a = document.createElement("div"),
			o = document.createElement("div"),
			s = document.createElement("div"),
			c = document.createElement("div"),
			u = document.createElement("div"),
			f = document.createElement("div"),
			p = document.createElement("div"),
			g = document.createElement("img"),
			h = document.createElement("img"),
			v = document.createElement("img"),
			b = document.createElement("div"),
			E = document.createElement("div"),
			w = e("plugins/progressindicator/index").createProgressBar(E);
			a.classList.add("download-row"),
			a.classList.add("row-border-bottom"),
			a.setAttribute("role", "listitem"),
			a.tabIndex = "1",
			a.contextItem = !0,
			a.id = "download-list-row-" + t.sequenceId,
			o.className = "rowDetails horizontal-padding-size-m",
			s.className = "rowBackground accent-colour-shade-background",
			c.className = "rowBackground inverted-background",
			u.classList.add("focus-ring");
			var T = document.createElement("div");
			T.className = "titleRow",
			T.id = "downloads-list-title-" + t.sequenceId,
			T.setAttribute("aria-hidden", "true");
			var y = document.createElement("bdi");
			y.innerText = t.title,
			T.appendChild(y),
			p.classList.add("secondary-text"),
			p.classList.add("font-size-xs"),
			p.id = "downloads-list-status-" + t.sequenceId,
			p.setAttribute("aria-hidden", "true"),
			b.classList.add("barRow"),
			b.classList.add("hidden");
			var I = m(t);
			g.setAttribute("src", I),
			g.setAttribute("aria-label", l(I)),
			g.className = "large-icon end-horizontal-padding-size-m",
			h.className = "pause-action small-icon",
			h.setAttribute("src", X),
			h.setAttribute("role", "button"),
			h.setAttribute("aria-label", d(X)),
			h.tabIndex = "1",
			h.id = "download-list-pause-" + t.sequenceId,
			v.className = "cancel-action small-icon",
			v.setAttribute("role", "button"),
			v.tabIndex = "1",
			v.id = "download-list-cancel-" + t.sequenceId;
			var S = function (e) {
				e.stopPropagation()
			},
			x = function (e) {
				if (e.stopPropagation(), "touchend" === e.type) {
					e.preventDefault(),
					U.clearSelection();
					var n = z.getFirstTouchPoint(e.changedTouches),
					i = z.getElementFromTouchPoint(n);
					if (i !== h)
						return
				}
				h.getAttribute("src").indexOf(X) > -1 ? (h.setAttribute("src", Z), h.setAttribute("aria-label", d(Z)), H.pause(t.url, t.name), w.setPaused(!0)) : (h.setAttribute("src", X), h.setAttribute("aria-label", d(X)), H.resume(t.url, t.name), w.setPaused(!1))
			};
			h.addEventListener("click", x, !0),
			h.addEventListener("touchend", x, !0),
			h.addEventListener("mouseup", x, !0);
			var C = function (e) {
				if (e.stopPropagation(), "touchend" === e.type) {
					e.preventDefault(),
					U.clearSelection();
					var n = z.getFirstTouchPoint(e.changedTouches),
					i = z.getElementFromTouchPoint(n);
					if (i !== v)
						return
				}
				v.getAttribute("src").indexOf(Q) > -1 ? (v.setAttribute("src", $), v.setAttribute("aria-label", d($)), H.cancel(t.url, t.name), w.setPaused(!0)) : (H.reload(t.url, t.name), h.classList.remove("hidden"), h.setAttribute("src", X), h.setAttribute("aria-label", d(X)), b.classList.remove("hidden"), v.setAttribute("src", Q), v.setAttribute("aria-label", d(Q)), w.setPaused(!1)),
				H.itemDetailsUpdated(t)
			};
			v.addEventListener("click", C, !0),
			v.addEventListener("touchend", C, !0),
			v.addEventListener("mouseup", C, !0),
			["mousedown", "touchmove", "touchstart"].forEach(function (e) {
				h.addEventListener(e, S, !0),
				v.addEventListener(e, S, !0)
			});
			var k;
			k = !t.totalSize && t.downloaded ? "" : "/" + i(t.totalSize);
			var A = i(t.downloaded);
			if ("ResultSuccess" !== t.status) {
				var N = 0 === t.totalSize ? 0 : 100 * t.downloaded / t.totalSize;
				w.setProgress(N),
				b.classList.remove("hidden")
			}
			if ("" === t.status || "paused" === t.status ? (v.setAttribute("src", Q), v.setAttribute("aria-label", d(Q)), h.setAttribute("src", "paused" === t.status ? Z : X), h.setAttribute("aria-label", d("paused" === t.status ? Z : X)), p.innerText = A + k) : (p.innerText = r(t.status, p), h.classList.add("hidden"), "ResultSuccess" === t.status ? v.classList.add("hidden") : (v.setAttribute("src", $), v.setAttribute("aria-label", d($)))), w.setPaused(!0), f.classList.add("mainrow"), f.setAttribute("aria-labelledby", T.id + " " + p.id), f.appendChild(T), b.appendChild(E), f.appendChild(b), f.appendChild(p), o.appendChild(g), o.appendChild(f), o.appendChild(h), o.appendChild(v), a.appendChild(o), a.appendChild(s), a.appendChild(c), a.appendChild(u), n)
				O.appendChild(a), Y.push(a);
			else {
				var L = O.children[0];
				O.insertBefore(a, L),
				Y.splice(0, 0, a)
			}
			U.addFocusListeners(a)
		}
		function y(t, n) {
			var a = O.getElementsByClassName("download-row")[t],
			o = a.getElementsByClassName("ProgressFill")[0],
			s = a.getElementsByClassName("secondary-text")[0],
			c = a.getElementsByTagName("img")[0];
			c.setAttribute("aria-label", l(c.getAttribute("src")));
			var u = !1;
			Object.keys(n).forEach(function (t) {
				switch (t) {
				case "title":
					a.querySelector(".titleRow bdi").innerText = n.title;
					break;
				case "type":
					a.getElementsByClassName("large-icon")[0].setAttribute("src", m(n));
					break;
				case "downloaded":
					var c;
					c = !n.totalSize && n.downloaded ? "" : "/" + i(n.totalSize);
					var l = i(n.downloaded),
					f = e("iris/utils").clamp(0, 100, 0 === n.totalSize ? 0 : 100 * n.downloaded / n.totalSize);
					s.innerText = l + c,
					o.style.width = f.toFixed(0) + "%";
					break;
				case "status":
					s.classList.remove("errormsg");
					var p = a.getElementsByClassName("pause-action")[0],
					v = a.getElementsByClassName("cancel-action")[0];
					if (g(h()), "reload" === n.status)
						break;
					if (u = !0, "" === n.status || "paused" === n.status) {
						p.setAttribute("src", "" === n.status ? X : Z),
						p.setAttribute("aria-label", d("" === n.status ? X : Z)),
						v.setAttribute("src", Q),
						v.setAttribute("aria-label", d(Q)),
						p.classList.remove("hidden"),
						"" === n.status ? o.classList.remove("Pause") : o.classList.add("Pause");
						break
					}
					if (s.innerText = r(n.status, s), p.classList.add("hidden"), "ResultSuccess" === n.status) {
						a.getElementsByClassName("barRow")[0].classList.add("hidden"),
						v.classList.add("hidden");
						break
					}
					o.classList.add("Pause"),
					v.setAttribute("src", $),
					v.setAttribute("aria-label", d($))
				}
			}),
			u && H.itemDetailsUpdated(n)
		}
		function I(e, t) {
			var n = e ? document.getElementById("download-list-row-" + e.sequenceId) : void 0,
			i = e ? document.getElementById("download-list-pause-" + e.sequenceId) : void 0,
			r = e ? document.getElementById("download-list-cancel-" + e.sequenceId) : void 0,
			a = t ? document.getElementById("download-list-row-" + t.sequenceId) : void 0,
			o = t ? document.getElementById("download-list-pause-" + t.sequenceId) : void 0,
			s = t ? document.getElementById("download-list-cancel-" + t.sequenceId) : void 0,
			c = function (e, t, n) {
				t.classList.contains("hidden") ? (e.style.navRight = "#" + n.id, n.style.navLeft = "#" + e.id, t.style.navLeft = "") : (e.style.navRight = "#" + t.id, t.style.navLeft = "#" + e.id, n.style.navLeft = "")
			};
			n && c(n, i, r),
			a && c(a, o, s),
			n && a && (n.style.navDown = "#" + a.id, a.style.navUp = "#" + n.id, o.style.navUp = i.classList.contains("hidden") ? "#" + n.id : "#" + i.id, s.style.navUp = r.classList.contains("hidden") ? "#" + n.id : "#" + r.id, i.style.navDown = o.classList.contains("hidden") ? "#" + a.id : "#" + o.id, r.style.navDown = s.classList.contains("hidden") ? "#" + a.id : "#" + s.id),
			!n && a && (a.style.navUp = ""),
			n && !a && (n.style.navDown = "")
		}
		function S() {
			H.list(function (e) {
				e.length ? e.forEach(function (t, n) {
					T(t, !0),
					I(e[n - 1], t)
				}) : (f(!0), J.disabled = !0)
			})
		}
		function x() {
			M.setTitle(W.translate(115)),
			H.list(function (e) {
				for (var t = 0; e.length > t; t++)
					y(t, e[t])
			}),
			D.getElementsByClassName("empty-contents-message")[0].innerText = W.translate(166)
		}
		function C() {
			var e = function () {
				B = void 0,
				g(!0),
				H.list(function (e) {
					for (var t = 0; e.length > t; t++)
						a(e[t].id, e[t].status) && n[t].classList.remove("hidden")
				})
			},
			t = function () {
				B = void 0,
				H.clear(),
				O.classList.remove("hidden")
			};
			g(!1);
			var n = O.getElementsByClassName("download-row");
			H.list(function (e) {
				for (var t = 0; e.length > t; t++)
					a(e[t].id, e[t].status) && n[t].classList.add("hidden")
			}),
			v(),
			B = G.createFrenchToast(W.translate(167), W.translate(5), e, t)
		}
		function k(e) {
			var t;
			H.list(function (n) {
				t = n.indexOf(e)
			});
			var n = O.getElementsByClassName("download-row")[t];
			n.classList.add("hidden");
			var i = function () {
				n.classList.remove("hidden")
			},
			r = function () {
				H.remove(e.url, e.name),
				g(h())
			};
			v(),
			B = G.createFrenchToast(W.translate(168), W.translate(5), i, r)
		}
		function A(e) {
			var t = Y.indexOf(e);
			if (!e || -1 === t)
				return void 0;
			var n;
			return H.list(function (e) {
				n = e[t]
			}),
			n
		}
		function N(t, n) {
			if (t == K.interactionType.click)
				"ResultSuccess" === n.status ? w(n, E.bind(this, n)) : (v(), B = G.createBasicToast(W.translate(169))), U.clearSelection();
			else if (t == K.interactionType.hold)
				if (a(n.id, n.status)) {
					var i = {
						contextType : "downloadItem",
						items : [{
								imageUrl : "assets/ic_delete.png",
								name : W.translate(170),
								callback : k.bind(this, n),
								isDelete : !0
							}
						],
						headText : n.title
					};
					"ResultSuccess" !== n.status || u(n) || i.items.push({
						invokeQuery : {
							uri : b(n.name),
							callback : w.bind(this, n)
						}
					}),
					e("screen/manager").activateContextMenu(i)
				} else
					U.clearSelection()
		}
		function L(e) {
			var t;
			return H.list(function (n) {
				t = n.indexOf(e)
			}),
			Y[t].children[3]
		}
		function _(e) {
			return e.childNodes[1]
		}
		function R(e) {
			return e.childNodes[2]
		}
		var O,
		D,
		B,
		M,
		P,
		U,
		F,
		H = e("iris/downloads"),
		V = e("iris/event"),
		W = e("iris/i18n"),
		q = e("iris/invocation"),
		G = e("plugins/toaster/index"),
		K = e("ui/interactionController"),
		z = e("ui/utils"),
		Y = [],
		j = !0,
		J = {
			action : "Clear All"
		},
		X = "./assets/cc_pause.png",
		Z = "./assets/ic_download.png",
		Q = "./assets/cc_cancel.png",
		$ = "./assets/ic_reload.png",
		et = "./assets/ca_doctype_music.png",
		tt = "./assets/ca_doctype_apk.png",
		nt = "./assets/ca_doctype_zip.png",
		it = "./assets/ca_doctype_generic.png",
		rt = "./assets/ca_doctype_doc.png",
		at = "./assets/ca_doctype_picture.png",
		ot = "./assets/ca_doctype_pdf.png",
		st = "./assets/ca_doctype_ppt.png",
		ct = "./assets/ca_doctype_txt.png",
		lt = "./assets/ca_doctype_video.png",
		dt = "./assets/ca_doctype_web.png",
		ut = "./assets/ca_doctype_xls.png",
		mt = ["apk"],
		ft = ["z", "zip", "tgz", "gz", "gtar", "tar", "arc", "arj", "as", "b64", "btoa", "bz", "cab", "cpt", "hqx", "iso", "lha", "lzh", "mim", "mme", "pak", "pf", "rar", "sea", "sit", "sitx", "tbz", "tbz2", "uu", "uue", "zoo"],
		pt = ["aac", "amr", "mp3", "midi", "mid", "wma", "wav", "wave", "3ga"],
		gt = ["doc", "docx", "dot", "docm", "dotm"],
		ht = ["bmp", "gif", "ico", "jpg", "jpeg", "png", "tiff", "tif", "xbm", "xpm"],
		vt = ["pdf"],
		bt = ["ppt", "pptx", "pptm", "pot", "potx", "potm", "pps", "ppsx", "ppsm", "ppa", "ppam"],
		Et = ["txt", "log"],
		wt = ["mp4", "flv", "swf", "rm", "rmvb", "wmv", "3gp", "avi"],
		Tt = ["html", "htm", "xml", "css", "xhtml", "js", "json"],
		yt = ["xlsx", "xlsm", "xlsb", "xltx", "xltm", "xls", "xlt", "xlm", "xlw", "xla", "xlam"],
		It = ["application/vnd.android.package-archive", "application/apk"],
		St = ["application/x-compress", "application/x-compressed", "application/x-gtar", "application/x-gzip", "application/x-tar", "application/zip"],
		xt = ["application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-word.document.macroEnabled.12", "application/vnd.ms-word.template.macroEnabled.12"],
		Ct = ["application/pdf", "application/x-pdf", "application/acrobat", "applications/vnd.pdf", "text/pdf", "text/x-pdf"],
		kt = ["application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.presentationml.template", "application/vnd.openxmlformats-officedocument.presentationml.slideshow", "application/vnd.ms-powerpoint.addin.macroEnabled.12", "application/vnd.ms-powerpoint.presentation.macroEnabled.12", "application/vnd.ms-powerpoint.template.macroEnabled.12", "application/vnd.ms-powerpoint.slideshow.macroEnabled.12"],
		At = ["text/plain"],
		Nt = ["application/x-mpeg", "audio/x-m4a", "audio/x-m4b", "audio/x-m4p", "audio/mp4", "audio/3gpp", "audio/3gpp2", "application/x-mpeg", "audio/ogg", "application/ogg", "application/x-shockwave-flash"],
		Lt = ["text/html", "application/javascript", "application/ecmascript", "application/x-javascript", "application/xhtml", "application/xhtml+xml", "application/json", "application/rss+xml", "application/atom+xml", "application/vnd.wap.xhtml+xml"],
		_t = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel.sheet.macroEnabled.12", "application/vnd.ms-excel.template.macroEnabled.12", "application/vnd.ms-excel.addin.macroEnabled.12", "application/vnd.ms-excel.sheet.binary.macroEnabled.12"],
		Rt = [[At, Et, ct], [_t, yt, ut], [kt, bt, st], [Ct, vt, ot], [It, mt, tt], [St, ft, nt], [xt, gt, rt], [null, pt, et], [null, wt, lt], [null, ht, at], [Lt, Tt, dt]];
		F = {
			init : function (t) {
				M = e("plugins/titlebarwithactions/index").createTitleBar({
						parentId : "downloads-title-bar",
						titleText : W.translate(115)
					}),
				O = t.getElementsByClassName("list-container")[0],
				O.setAttribute("role", "list"),
				D = t.getElementsByClassName("empty-contents-container")[0],
				t.getElementsByClassName("empty-contents-message")[0].innerText = W.translate(166),
				U = e("ui/interactionController").create({
						screen : F,
						view : null,
						container : t.getElementsByClassName("scroll-container")[0],
						ancestorClassName : "download-row",
						getContextItem : A,
						actionCallBack : N,
						focusRingForItem : L,
						getBackgroundElement : _,
						getBackgroundOverlayElement : R,
						selectedTextColorClass : "downloadRowSelectedTextColor",
						backgroundPartiallySelectedOpacity : .15,
						backgroundSelectedOpacity : .5,
						backgroundKeepSelectedOpacity : .2
					}),
				S(),
				V.on("application.systemLanguageChange", x)
			},
			becomingVisible : function () {
				p(!1)
			},
			getActionBar : function () {
				return J = {
					action : "Clear Downloads",
					actionHandler : C,
					disabled : !h()
				},
				P ? P.updateAction(J) : P = e("plugins/actionbar/index").makeActionBar(this, [J], "Back", !1),
				P
			}
		},
		V.on("downloads.add", function (e) {
			J.disabled && (g(!0), f(!1)),
			T(e, !1)
		}),
		V.on("downloads.update", function (e, t) {
			j && y(e, t)
		}),
		V.on("downloads.remove", function (e) {
			var t = O.getElementsByClassName("download-row");
			t[e].parentNode.removeChild(t[e]),
			Y.splice(e, 1),
			0 === Y.length && (f(!0), g(!1))
		}),
		V.on("application.active", function () {
			j = !0,
			H.list(function (e) {
				for (var t = 0; e.length > t; t++)
					y(t, e[t])
			})
		}),
		V.on("application.inactive", function () {
			j = !1
		}),
		V.on("downloads.list.modified", I),
		n.exports = F
	}), define("plugins/screens/edit_bookmark/index", function (e, t, n) {
		function i(e, t) {
			for (var n = 0; e.length > n; n++) {
				var i = e[n];
				t.removeChild(i)
			}
		}
		function r() {
			S.setValidationError(k.translate(171))
		}
		function a() {
			I.checkValidity() ? I.setValidationError(k.translate(172)) : I.setValidationError(k.translate(173))
		}
		function o() {
			b.setLeftButtonText(k.translate(43)),
			b.setRightButtonText(k.translate(129)),
			b.setTitle(k.translate(121)),
			w.placeholder = k.translate(174),
			T.placeholder = k.translate(175),
			y.placeholder = k.translate(176),
			h.innerText = k.translate(177),
			I.showingValidationError() && a(),
			S.showingValidationError() && r();
			for (var e = p.getElementsByClassName("deleteTag"), t = 0; e.length > t; t++)
				e[t].setAttribute("aria-label", k.translate(178))
		}
		function s() {
			S.checkValidity() || r(),
			I.checkValidity() || a()
		}
		function c() {
			var e = y.value.split(",");
			e.forEach(function (e) {
				e = e.trim(),
				e.length > 0 && u.addTag(e, !0)
			})
		}
		function l() {
			var t = S.inputValue(),
			n = I.inputValue(),
			i = {};
			if (n !== f.url && (i.url = n), t !== f.title && (i.title = t), c(), v) {
				var r = [];
				for (var a in L)
					r.push(a);
				i.tags = r
			}
			e("iris/bookmarks").update(f, i, E.popScreen.bind(this, u))
		}
		function d(e) {
			e && e.id !== f.id ? a() : l()
		}
		var u,
		m,
		f,
		p,
		g,
		h,
		v,
		b,
		E,
		w,
		T,
		y,
		I,
		S,
		x = e("iris/event"),
		C = e("plugins/titlebarwithactions/index"),
		k = e("iris/i18n"),
		A = e("iris/storage"),
		N = e("iris/inputValidator"),
		L = {},
		_ = [],
		R = 256;
		u = {
			init : function (t) {
				E = e("screen/manager"),
				b = C.createTitleBar({
						parentId : "EditBookmarkTitleBar",
						titleText : k.translate(121),
						leftText : k.translate(43),
						leftCallback : function () {
							E.popScreen(u)
						},
						rightText : k.translate(129),
						rightCallback : function () {
							u.save()
						}
					}),
				m = t.getElementsByClassName("sheetContent")[0],
				p = m.getElementsByClassName("sheetTagList")[0],
				w = m.getElementsByClassName("bookmarkTitle")[0],
				T = m.getElementsByClassName("bookmarkUrl")[0],
				y = m.getElementsByClassName("bookmarkTags")[0],
				h = m.getElementsByClassName("emptyTagMessage")[0],
				I = N.create(T, document.getElementById("bookmarkUrlValidationError"), N.inputType.nonEmpty),
				S = N.create(w, document.getElementById("bookmarkTitleValidationError"), N.inputType.nonEmpty),
				x.on("application.systemLanguageChange", o),
				h.innerText = k.translate(177)
			},
			becomingVisible : function () {
				if (!f)
					throw Error("edit_bookmark screen is becoming visible without any context!");
				I.resetValidationError(),
				S.resetValidationError(),
				u.clearSelection()
			},
			setContext : function (e) {
				f = e,
				p.innerHTML = "",
				L = {},
				_ = [],
				w.placeholder = k.translate(174),
				T.placeholder = k.translate(175),
				y.placeholder = k.translate(176),
				y.addEventListener("keyup", u.inputKey.bind(u, y)),
				h.classList.remove("hidden"),
				p.classList.add("hidden"),
				y.value = "",
				w.value = f && f.title ? f.title : "",
				T.value = f && f.url ? f.url : "";
				for (var t = 0; f.tags.length > t; t++)
					u.addTag(f.tags[t], !1);
				v = !1
			},
			inputKey : function (e, t) {
				var n = t.keyCode || t.which;
				13 == n && (c(), e.value = "")
			},
			addTag : function (e) {
				e = e.substring(0, R),
				0 === Object.keys(L).length && (h.classList.add("hidden"), p.classList.remove("hidden")),
				v = !0,
				L[e] && u.removeTag(L[e]),
				i(_, p),
				_ = [];
				var t = document.createElement("div");
				t.className = "bookmarkTag end-horizontal-padding-size-s bottom-padding-size-s";
				var n = document.createElement("div");
				n.className = "mainTag rounded-corners",
				n.tabIndex = "1";
				var r = document.createElement("div");
				r.className = "tagText horizontal-margin-size-m",
				r.appendChild(document.createTextNode(e)),
				r.dir = "auto",
				n.appendChild(r),
				t.appendChild(n);
				var a = document.createElement("div");
				a.className = "deleteTag",
				a.setAttribute("role", "button"),
				a.setAttribute("aria-label", k.translate(178)),
				a.addEventListener("click", u.removeTag.bind(u, t, e), !1),
				n.appendChild(a),
				p.insertBefore(t, p.firstChild),
				L[e] = t,
				t.addEventListener("click", u.selectTag.bind(u, t), !1)
			},
			selectTag : function (e, t) {
				e.classList.contains("selected") ? (e.classList.remove("selected"), e.firstChild.classList.remove("soft-accent-colour-background"), g = void 0) : (g && (g.setAttribute("aria-hidden", !0), g.classList.remove("selected"), g.firstChild.classList.remove("soft-accent-colour-background"), g.setAttribute("aria-hidden", !1)), e.classList.add("selected"), e.firstChild.classList.add("soft-accent-colour-background"), g = e, t.preventDefault(), t.stopPropagation(), document.getElementById("edit_bookmark").addEventListener("click", u.clearSelection))
			},
			clearSelection : function () {
				g && (g.classList.remove("selected"), g.firstChild.classList.remove("soft-accent-colour-background"), g = void 0),
				document.getElementById("edit_bookmark").removeEventListener("click", u.clearSelection)
			},
			removeTag : function (e, t) {
				v = !0,
				e.classList.add("hidden"),
				delete L[t],
				_.push(e),
				0 === Object.keys(L).length && (h.classList.remove("hidden"), p.classList.add("hidden"))
			},
			save : function () {
				if (!I.checkValidity() || !S.checkValidity())
					return s(), void 0;
				var e = I.inputValue();
				return e !== f.url ? (A.getBookmark(e, d), void 0) : (l(), void 0)
			},
			populateTagList : function (e, t) {
				t.innerText = " ";
				for (var n in e)
					u.addTag(n)
			}
		},
		n.exports = u
	}), define("plugins/screens/edit_label/index", function (e, t, n) {
		function i() {
			l.checkValidity() ? l.setValidationError(h.translate(179)) : l.setValidationError(h.translate(180))
		}
		function r() {
			u.setLeftButtonText(h.translate(43)),
			u.setRightButtonText(h.translate(129)),
			u.setTitle(h.translate(181)),
			c.placeholder = h.translate(182),
			l.showingValidationError() && i()
		}
		function a(e) {
			m = {};
			for (var t = 0; e.length > t; t++)
				m[e[t].name] = e[t]
		}
		var o,
		s,
		c,
		l,
		d,
		u,
		m,
		f = e("iris/tags"),
		p = e("iris/utils"),
		g = e("plugins/titlebarwithactions/index"),
		h = e("iris/i18n"),
		v = e("iris/event"),
		b = e("iris/storage"),
		E = e("iris/inputValidator");
		o = {
			init : function (t) {
				d = e("screen/manager"),
				u = g.createTitleBar({
						parentId : "EditTagTitleBar",
						titleText : h.translate(181),
						leftText : h.translate(43),
						leftCallback : function () {
							d.popScreen(o)
						},
						rightText : h.translate(129),
						rightCallback : function () {
							o.save()
						}
					}),
				c = t.getElementsByClassName("sheetContent")[0].getElementsByClassName("bookmarkTitle")[0],
				c.placeholder = h.translate(182),
				l = E.create(c, t.getElementsByClassName("sheetContent")[0].getElementsByClassName("validationError")[0], E.inputType.nonEmpty),
				v.on("application.systemLanguageChange", r)
			},
			becomingVisible : function () {
				if (!s)
					throw Error("edit_bookmark screen is becoming visible without any context!");
				l.resetValidationError(),
				b.getTags(a)
			},
			setContext : function (e) {
				s = e,
				s && (c.value = s.name)
			},
			save : function () {
				if (!l.checkValidity())
					return i(), void 0;
				if (m[l.inputValue()] && m[l.inputValue()].id !== s.id)
					return i(), void 0;
				var e = {};
				p.extend(e, s),
				e.name = l.inputValue(),
				f.update(e, d.popScreen.bind(this, o))
			}
		},
		n.exports = o
	}), define("plugins/screens/history_date/index", function (e, t, n) {
		function i() {
			v && (T.dismissToast(v), v = void 0)
		}
		function r(e) {
			var t = p && "disable" in e && g.disabled !== e.disable,
			n = p && "disable" in e && g.hidden !== e.hide;
			t && (g.disabled = e.disable),
			n && (g.hidden = e.hide),
			(t || n) && p.updateAction(g)
		}
		function a() {
			d.getListItemBuilder().hide(),
			E.emit("screen.blockAnimations", [], !0),
			r({
				disable : !0
			});
			var e = function () {
				v = void 0,
				r({
					disable : !1
				}),
				d.getListItemBuilder().show(),
				E.emit("screen.unblockAnimations", [], !0)
			},
			t = S.deleteAllVisits.bind(this, function () {
					v = void 0,
					d.getListItemBuilder().clear(),
					d.getListItemBuilder().setEmptyMessageVisible(!0),
					d.getListItemBuilder().show(),
					E.emit("screen.unblockAnimations", [], !0)
				});
			i(),
			v = T.createFrenchToast(I.translate(183), I.translate(5), e, t)
		}
		function o() {
			f.show(),
			h.disabled = !0,
			p.updateAction(h)
		}
		function s(e) {
			d.searchInputChanged(e)
		}
		function c() {
			m.setTitle(I.translate(184)),
			f.getSearchBarInputElement().setAttribute("aria-label", I.translate(185))
		}
		function l(e, t) {
			e == b && "becomingPopped" == t && i()
		}
		var d,
		u,
		m,
		f,
		p,
		g,
		h,
		v,
		b,
		E = e("iris/event"),
		w = e("plugins/titlebarwithactions/index"),
		T = e("plugins/toaster/index"),
		y = e("screen/manager"),
		I = e("iris/i18n"),
		S = e("iris/history");
		b = {
			init : function (t) {
				m = w.createTitleBar({
						parentId : "history_date_titleBar"
					}),
				f = e("plugins/searchbar/index").create("historyDateSearchBar", s, b, function () {
						h.disabled && (h.disabled = !1, p.updateAction(h))
					}),
				c(),
				u = t.getElementsByClassName("viewArea")[0],
				E.on("manager.screen", l),
				E.on("application.systemLanguageChange", c)
			},
			show : function () {
				i(),
				y.isScreenPushed(b) || y.pushScreen(y.loadScreen("history_date")),
				g && g.disabled && (g.disabled = !1, p.updateAction(g))
			},
			becomingVisible : function () {
				d || (d = y.loadView("history_date_list", u, b, "onScreen"), d.setClearStateFunction && d.setClearStateFunction(r)),
				d.becomingVisible(),
				d.setSearchBar(f)
			},
			getActionBar : function () {
				return p || (g = {
						action : "Clear History",
						actionHandler : a
					}, h = {
						action : "Search",
						actionHandler : o
					}, p = e("plugins/actionbar/index").makeActionBar(b, [h, g], "Back", !1)),
				p
			},
			getCurrentView : function () {
				return d
			},
			justTypeField : function () {
				return f.getSearchBarInputElement()
			}
		},
		n.exports = b
	}), define("plugins/screens/history_items/index", function (e, t, n) {
		function i() {
			y && (A.dismissToast(y), y = void 0)
		}
		function r(e) {
			var t = b && "disable" in e && E.disabled !== e.disable,
			n = b && "disable" in e && E.hidden !== e.hide;
			t && (E.disabled = e.disable),
			n && (E.hidden = e.hide),
			(t || n) && b.updateAction(E)
		}
		function a() {
			m.getListItemBuilder().hide(),
			I.emit("screen.blockAnimations", [], !0),
			r({
				disable : !0
			});
			var e = function () {
				y = void 0,
				r({
					disable : !1
				}),
				m.getListItemBuilder().show(),
				I.emit("screen.unblockAnimations", [], !0)
			},
			t = {
				startTime : h.span.startTime,
				endTime : h.span.endTime
			},
			n = k.deleteVisits.bind(this, [t], function () {
					y = void 0,
					m.getListItemBuilder().clear(),
					m.getListItemBuilder().setEmptyMessageVisible(!0),
					m.getListItemBuilder().show(),
					I.emit("screen.unblockAnimations", [], !0)
				});
			i(),
			y = A.createFrenchToast(C.translate(183), C.translate(5), e, n)
		}
		function o() {
			g.show(),
			w.disabled = !0,
			b.updateAction(w)
		}
		function s(e) {
			m.searchInputChanged(e)
		}
		function c(e) {
			T = e;
			var t = "";
			switch (e.type) {
			case x.bandType.TODAY:
				t = C.format(e.date, "M");
				break;
			case x.bandType.YESTERDAY:
				t = C.format(e.date, "M");
				break;
			case x.bandType.DAY:
				t = C.format(e.date, "M");
				break;
			case x.bandType.WEEK:
				t = C.translate(186);
				break;
			case x.bandType.MONTH:
				t = C.format(e.date, "MMMM");
				break;
			case x.bandType.EVERYTHING_BEFORE_DATE:
				t = C.translate(187)
			}
			p.setTitle(t)
		}
		function l() {
			T && c(T),
			g.getSearchBarInputElement().setAttribute("aria-label", C.translate(185))
		}
		function d(e, t) {
			e == u && "becomingPopped" == t && i()
		}
		var u,
		m,
		f,
		p,
		g,
		h,
		v,
		b,
		E,
		w,
		T,
		y,
		I = e("iris/event"),
		S = e("plugins/titlebarwithactions/index"),
		x = e("iris/date.band.builder"),
		C = e("iris/i18n"),
		k = e("iris/history"),
		A = e("plugins/toaster/index");
		u = {
			init : function (t) {
				v || (v = e("screen/manager"), p = S.createTitleBar({
							parentId : "history_items_titleBar"
						}), g = e("plugins/searchbar/index").create("historyItemsSearchBar", s, u, function () {
							w.disabled && (w.disabled = !1, b.updateAction(w))
						}), g.getSearchBarInputElement().setAttribute("aria-label", C.translate(185)), f = t.getElementsByClassName("viewArea")[0], I.on("manager.screen", d), I.on("application.systemLanguageChange", l))
			},
			becomingVisible : function () {
				if (!h)
					throw Error("history_items screen is becoming visible without any context!");
				m.becomingVisible()
			},
			getActionBar : function () {
				return b || (E = {
						action : "Clear History",
						actionHandler : a
					}, w = {
						action : "Search",
						actionHandler : o
					}, b = e("plugins/actionbar/index").makeActionBar(u, [w, E], "Back", !1)),
				b
			},
			setContext : function (e) {
				h != e && (h = e, c(h)),
				E && E.disabled && (E.disabled = !1, b.updateAction(E)),
				m || (m = v.loadView("history_item_list", f, u, "onScreen"), m.setClearStateFunction && m.setClearStateFunction(r)),
				m.setContext(e),
				m.setSearchBar(g)
			},
			getCurrentView : function () {
				return m
			},
			justTypeField : function () {
				return g.getSearchBarInputElement()
			}
		},
		n.exports = u
	}), define("plugins/screens/mixed_contents_risks/index", function (e, t, n) {
		function i() {
			r.setTitle(c.translate(188));
			var e = document.querySelectorAll("#mixed_contents_risks .securityDetailsText");
			e[0].innerHTML = c.translate(189, o),
			e[1].innerHTML = c.translate(190),
			document.querySelector("#mixed_contents_risks .securityDetailsBlue").innerHTML = c.translate(191)
		}
		var r,
		a,
		o,
		s,
		c = e("iris/i18n"),
		l = e("iris/event"),
		d = e("plugins/screens/security/index");
		s = {
			init : function () {
				r = e("plugins/titlebarwithactions/index").createTitleBar({
						parentId : "mixed-contents-risks-title-bar"
					}),
				document.querySelector("#mixed_contents_risks .securityDetailsBlue").onclick = d.loadHelp,
				l.on("application.systemLanguageChange", i)
			},
			setContext : function (e) {
				o = e,
				i()
			},
			getActionBar : function () {
				return a || (a = e("plugins/actionbar/index").makeActionBar(this, [], "Back", !1)),
				a
			},
			becomingVisible : function () {}

		},
		n.exports = s
	}), define("plugins/screens/reader/index", function (e, t, n) {
		function i() {
			l || (l = g.create([g.items.READER_FIND_ON_PAGE, g.items.READER_INVERT_COLOURS_TO_DARK], f)),
			m && l.contains(g.items.READER_INVERT_COLOURS_TO_DARK) ? (l.insertBefore(g.items.READER_INVERT_COLOURS_TO_BRIGHT, g.items.READER_INVERT_COLOURS_TO_DARK), l.removeItem(g.items.READER_INVERT_COLOURS_TO_DARK)) : !m && l.contains(g.items.READER_INVERT_COLOURS_TO_BRIGHT) && (l.insertBefore(g.items.READER_INVERT_COLOURS_TO_DARK, g.items.READER_INVERT_COLOURS_TO_BRIGHT), l.removeItem(g.items.READER_INVERT_COLOURS_TO_BRIGHT)),
			l.show()
		}
		var r,
		a,
		o,
		s,
		c,
		l,
		d,
		u,
		m,
		f,
		p = e("iris/event"),
		g = e("plugins/overflowmenu/index"),
		h = e("iris/tabs/controller"),
		v = e("screen/manager"),
		b = e("iris/exec"),
		E = e("plugins/actionbar/index"),
		w = e("plugins/find_on_page/index"),
		T = e("iris/rotation.helper"),
		y = e("iris/i18n"),
		I = e("iris/utils"),
		S = e("ui/utils"),
		x = e("iris/settings"),
		w = e("plugins/find_on_page/index"),
		C = !1,
		k = !1,
		A = !1,
		N = 1e4,
		L = "Increase Font",
		_ = "Decrease Font",
		R = 300,
		O = 40,
		D = 100,
		B = !1,
		M = "reader-stored-params",
		P = 2,
		U = function (t, n) {
			return v.currentScreen() === e("plugins/screens/reader/index") ? w.isVisible() ? (d = Math.max(0, Math.min(n.y, u)), void 0) : (n.y - d > O ? (w.isVisible() || document.getElementById("action-bar-area").contains(document.activeElement) || (document.getElementById("load-progress-bar").classList.add("mini-bar-visible"), E.contract()), d = Math.max(0, Math.min(n.y, u))) : -O > n.y - d && (E.expand(!1, function () {
						document.getElementById("load-progress-bar").classList.remove("mini-bar-visible")
					}), d = Math.max(0, Math.min(n.y, u))), void 0) : void 0
		},
		F = function () {
			return s ? (window.clearTimeout(s), s = void 0, !0) : !1
		},
		H = function () {
			b.executeJavaScript(r, 'document.getElementById("readInner").style.fontSize = "' + o + '%";', null, !0)
		},
		V = function () {
			u = JSON.parse(qnx.callExtensionMethod("webview.contentRectangle", r)).height - screen.height
		},
		W = function () {
			var t = document.getElementById("reader-loader");
			p.on("ContentRendered", V, [r]),
			p.once("ContentRendered", function () {
				d = 0,
				p.on("PropertyScrollPositionEvent", U, [r]),
				S.transitionWithTimeout(t, function () {
					t.classList.remove("showing")
				}, R, function () {
					document.getElementById("reader-activity").classList.add("hidden")
				}),
				e("iris/keyboard.focus").setWebviewFocus(r),
				e("iris/sensitivity").setSensitivityNoFocus()
			}, [r]),
			e("iris/webview.viewport").setViewportAndCallBackAsNeeded(r, 0, 0, screen.width, screen.height - e("plugins/minibar/index").height()),
			qnx.callExtensionMethod("webview.setActive", r, !0),
			qnx.callExtensionMethod("webview.setVisible", r, !0),
			qnx.callExtensionMethod("webview.setEnableDefaultOverScrollBackground", r, !0),
			qnx.callExtensionMethod("webview.setEnableLocalAccessToAllCookies", r, "false"),
			PUBLIC_BUILD || qnx.callExtensionMethod("webview.setInputLogFromPPSEnabled", r, !0),
			x.getValue(x.ENABLE_AUDIO_FEEDBACK) && qnx.callExtensionMethod("webview.setEnableSoundOnAnchorElementTouchEvents", r, x.getValue(x.ENABLE_AUDIO_FEEDBACK)),
			p.on("settings.updated", function (e, t) {
				qnx.callExtensionMethod("webview.setEnableSoundOnAnchorElementTouchEvents", r, t)
			}, [x.ENABLE_AUDIO_FEEDBACK]),
			A = !0,
			c.updateAction({
				action : L,
				disabled : !1
			}),
			c.updateAction({
				action : _,
				disabled : !1
			}),
			c.enableOverflow(!0)
		},
		q = function () {
			C ? (C = !1, W()) : C = !0
		},
		G = function (e) {
			F(),
			k && (document.getElementById("reader-activity").classList.add("hidden"), document.getElementById("reader-error").classList.remove("hidden"), e && p.emit("reader.failed", [e], !0))
		},
		K = function (e, t, n) {
			var i = JSON.parse(t);
			"Other" !== i.navigationType && (w.isVisible() && w.cleanUp(), n.setPreventDefault = !0, v.popScreen(f), I.loadUrlInCurrentTab(i.url))
		},
		z = function (e, t, n) {
			if (k) {
				if (!n || !F())
					return G(e), void 0;
				qnx.callExtensionMethod("webview.loadStringWithBase", r, n, e),
				p.on("LocationChanging", K, [r]),
				p.once("DocumentLoadFinished", function () {
					k && q()
				}, [r])
			}
		},
		Y = function (e) {
			var t = new XMLHttpRequest;
			t.open("GET", "assets/reader.js", !0),
			t.onreadystatechange = function () {
				4 === t.readyState && (200 === t.status ? (a = t.responseText, e && e()) : console.error("Got non-OK status " + t.status + " when fetching reader script. ?"))
			},
			t.send()
		},
		j = function (e) {
			if (!k || !e.url)
				return G(), void 0;
			if (!a)
				return Y(j.bind(this, e)), void 0;
			var t = a.replace("FONT_DEFINED_BY_BROWSER", "" + o + "%").replace("INVERT_COLOURS_DEFINED_BY_BROWSER", m || ""),
			n = e.url.indexOf("#") > 0 ? e.url.substring(0, e.url.indexOf("#")) : e.url;
			b.executeJavaScript(e.webviewId, t, z.bind(this, n), !0),
			s = setTimeout(G, N)
		},
		J = function (t, n, i, r, a) {
			var o = w.height(r);
			T.setViewportAndCallBackAsNeeded(t, 0, o, n, i - o - e("plugins/minibar/index").height(), function () {
				a && a.apply(this, arguments),
				V()
			})
		},
		X = function () {
			return k
		},
		Z = function () {
			document.getElementById("reader-error").innerText = y.translate(192)
		},
		Q = function () {
			I.toLocal(M, JSON.stringify({
					readerFontMod : o,
					coloursInverted : m
				}))
		},
		$ = function (t) {
			e("iris/keyboard.focus").setWebviewFocus(r),
			0 >= o + t || (o += t, Q(), H())
		},
		et = function () {
			e("iris/sensitivity").resetSensitivity(),
			C = !1,
			k = !1,
			A = !1,
			E.expand(!0),
			c.updateAction({
				action : L,
				disabled : !0
			}),
			c.updateAction({
				action : _,
				disabled : !0
			}),
			c.enableOverflow(!1);
			var t = document.getElementById("reader-loader");
			t.classList.contains("showing") ? (document.getElementById("reader-activity").classList.add("hidden"), document.getElementById("reader-error").classList.add("hidden"), r && qnx.callExtensionMethod("webview.destroy", r)) : (p.emit("screen.blockAnimations", null, !0), S.transitionWithTimeout(t, t.classList.add.bind(t.classList, "showing"), R, function () {
					r && (qnx.callExtensionMethod("webview.setZOrder", r, -1), qnx.callExtensionMethod("webview.destroy", r)),
					p.emit("screen.unblockAnimations", null)
				})),
			p.un("LocationChanging", K),
			p.un("PropertyScrollPositionEvent", U),
			p.un("ContentRendered", V),
			r && (p.once("Destroyed", function () {
					qnx.callExtensionMethod("webview.delete", r),
					T.removeWebview(r),
					r = void 0
				}, [r]), p.emit("webview.destroyed", [r], !0))
		},
		tt = function (e, t) {
			if (e === f)
				switch (t) {
				case "loadTransitionEnd":
					k && q();
					break;
				case "becomingPopped":
					et();
					break;
				case "hidden":
					document.getElementById("reader-activity").classList.remove("hidden")
				}
		};
		f = {
			getId : function () {
				return r
			},
			isOpen : function () {
				return k
			},
			preventPeek : function () {
				return !0
			},
			switchZOrderForFullScreenVideo : function (e) {
				r && k && qnx.callExtensionMethod("webview.setZOrder", r, e ? 0 : P)
			},
			becomingVisible : function () {
				if (k = !0, !r) {
					var t = qnx.callExtensionMethod("webview.applicationWindowGroup", iris.chromeId);
					r = parseInt(qnx.callExtensionMethod("webview.create", t, 1), 10)
				}
				p.on("Created", function () {
					p.emit("webview.created", [r], !0),
					qnx.callExtensionMethod("webview.setEnableJavaScript", r, !1),
					qnx.callExtensionMethod("webview.setEnablePlugins", r, !1),
					qnx.callExtensionMethod("webview.setZOrder", r, P),
					PUBLIC_BUILD && qnx.callExtensionMethod("webview.setAllowWebInspection", iris.chromeId, r, !1),
					e("iris/device").spatialNavigationEnabled() && qnx.callExtensionMethod("webview.setEnablePointerInteractionMode", r, !0),
					T.addWebview(r, X, J)
				}, [r, p.FILTER_ANY]),
				j(h.getSelected()),
				p.on("OpenWindow", function n(e, t) {
					e === r && "CREATE" === t.action && (v.popScreen(f), p.un("OpenWindow", n))
				})
			},
			getActionBar : function () {
				return c || (c = e("plugins/actionbar/index").makeActionBar(this, [{
									action : _,
									actionHandler : $.bind(this, -10),
									disabled : !0
								}, {
									action : L,
									actionHandler : $.bind(this, 10),
									disabled : !0
								}
							], "Back", i), c.enableOverflow(!1), c.addEventListener("mouseout", function (t, n) {
						t === n.target || t.contains(n.relatedTarget) || (t.contains(document.activeElement) && document.activeElement.blur(), g.visibleMenu() || (e("iris/keyboard.focus").setReaderFocus(), document.getElementById("load-progress-bar").classList.add("mini-bar-visible"), E.contract()))
					})),
				c
			},
			showFind : function () {
				A && !w.isVisible() && (E.expand(), w.show(void 0, r, function () {
						J(r, screen.width, screen.height)
					}), e("iris/keyboard.focus").setChromeFocus(), p.once("find_on_page.remove", function () {
						e("iris/keyboard.focus").setWebviewFocus(r)
					}))
			},
			invertColours : function () {
				if (A) {
					e("iris/keyboard.focus").setWebviewFocus(r),
					m = !m,
					Q();
					var t = document.getElementById("reader-loader");
					t.querySelector(".activity-indicator").classList.toggle("light"),
					t.classList.toggle("background"),
					b.executeJavaScript(r, 'document.body.classList.toggle("readColor");', null, !0)
				}
			},
			init : function () {
				var e = I.fromLocal(M);
				if (e) {
					if (o = e.readerFontMod, m = e.coloursInverted) {
						var t = document.getElementById("reader-loader");
						t.querySelector(".activity-indicator").classList.remove("light"),
						t.classList.add("background")
					}
				} else
					o = D, m = B;
				p.on("manager.screen", tt),
				p.on("application.systemLanguageChange", Z),
				p.on("application.active", function () {
					r && I.setApplicationActive(r, !0)
				}),
				p.on("application.inactive", function () {
					r && I.setApplicationActive(r, !1)
				}),
				p.on("ProcessCrash", function () {
					r && (T.removeWebview(r), r = void 0)
				}),
				Z(),
				Y()
			},
			showOverflowMenu : function () {
				i()
			},
			assignActionBarDefaultFocus : function () {
				c && c.updateAction({
					action : L,
					focus : !0
				})
			}
		},
		n.exports = f
	}), define("plugins/screens/securefailed/index", function (e, t, n) {
		function i() {
			document.getElementById("secureFailedArrow").setAttribute("src", document.getElementById("secureFailedExtraInfo").classList.contains("hidden") ? "./assets/cs_down_pressed.png" : "./assets/cs_more_pressed.png");
			var e = document.getElementById("secureFailedExtraInfo");
			e.classList.contains("hidden") ? e.classList.remove("hidden") : e.classList.add("hidden")
		}
		function r(e, t) {
			e === m && "unloadTransitionEnd" === t && (qnx.callExtensionMethod("webview.continueSSLHandshaking", s, c.streamId, "SSLActionReject"), h.stopSelected(), f.un("manager.screen", r))
		}
		function a() {
			m.setContext(c, s)
		}
		var o,
		s,
		c,
		l,
		d,
		u,
		m,
		f = e("iris/event"),
		p = e("screen/manager"),
		g = e("iris/i18n"),
		h = e("iris/tabs/controller"),
		v = e("plugins/actionbar/index"),
		b = e("plugins/screens/security/index"),
		E = e("plugins/checkboxer/index");
		m = {
			init : function () {
				f.on("application.systemLanguageChange", a),
				document.querySelector("#securefailed .secureFailedHorizontal .securityDetailsBlue").addEventListener("click", i)
			},
			setContext : function (t, n) {
				c = t,
				s = n;
				var i = t.connectionInfo,
				a = document.getElementsByClassName("secureFailedHorizontal")[0];
				a.getElementsByClassName("securityScreenIcon")[0].setAttribute("src", l ? "./assets/cs_unknown_certificate3.png" : "./assets/cs_blocked.png");
				var d = a.getElementsByClassName("securityDetailsSection");
				d[0].getElementsByClassName("securityDetailsHeading")[0].innerText = l ? g.translate(194) : g.translate(193),
				d[0].getElementsByClassName("securityDetailsText")[0].innerText = l ? g.translate(195) : g.translate(196);
				var u = d[1].getElementsByClassName("securityDetailsBlue")[0];
				u.replaceChild(document.createTextNode(l ? g.translate(198) : g.translate(197)), u.lastChild);
				var h = document.getElementById("secureFailedExtraInfo");
				if (h.classList.add("hidden"), document.getElementById("secureFailedArrow").setAttribute("src", "./assets/cs_more_pressed.png"), h.innerHTML = "", l) {
					var v = document.createElement("div");
					v.classList.add("securityDetailsGrey"),
					v.appendChild(document.createTextNode(g.translate(199))),
					h.appendChild(v)
				}
				if (h.appendChild(e("plugins/screens/security/index").getError(i.certificateInfo, i.domain)), u = document.createElement("div"), u.tabIndex = 1, u.classList.add("securityDetailsBlue"), u.innerText = g.translate(191), u.addEventListener("click", b.loadHelp), u.setAttribute("role", "button"), h.appendChild(u), i.certificateInfo.certificates.length > 0 && (u = document.createElement("div"), u.tabIndex = 1, u.classList.add("securityDetailsBlue"), u.innerText = g.translate(200), u.addEventListener("click", function () {
							b.loadCertificateDetails(s, i.certificateInfo)
						}), u.setAttribute("role", "button"), h.appendChild(u)), l && i.certificateInfo.certificates.length > 0) {
					var w = document.createElement("button");
					w.disabled = !0,
					w.className = "secureFailedButton",
					w.innerText = g.translate(201),
					w.addEventListener("click", function () {
						qnx.callExtensionMethod("webview.continueSSLHandshaking", s, t.streamId, "SSLActionTrust"),
						f.un("manager.screen", r),
						p.popScreen(m)
					});
					var T = document.createElement("div");
					T.className = "default-vertical-padding",
					T.appendChild(w);
					var y = document.createElement("div");
					y.classList.add("securityDetailsText"),
					y.innerText = g.translate(202, i.domain),
					o = E.create({
							id : "secureFailedCheckbox"
						}),
					o.getCheckbox().addEventListener("click", function () {
						w.disabled = !this.checked,
						w.tabIndex = this.checked ? 1 : -1
					});
					var I = document.createElement("label");
					I.id = "secureFailedLabel",
					I.htmlFor = o.getCheckbox().id,
					I.innerText = g.translate(203);
					var S = document.createElement("div");
					S.className = "confirmRow",
					S.tabIndex = 1,
					S.appendChild(o.getCheckboxContainer()),
					S.appendChild(I),
					o.setFocusParent(S),
					h.appendChild(y),
					h.appendChild(T),
					h.appendChild(S)
				}
			},
			becomingVisible : function () {
				f.on("manager.screen", r)
			},
			getActionBar : function () {
				return u && d === l || (u = v.makeActionBar(this, [], l ? "Cancel" : "Close", !1)),
				u
			}
		},
		f.on("SSLHandshakingFailed", function (e, t) {
			if (e !== h.getSelected().webviewId)
				return f.on("tabs.updated", function n(i, r) {
					i === h.getTabForWebviewId(e).id && r.selected && (f.un("tabs.updated", n), f.emit("SSLHandshakingFailed", [e, t]))
				}), void 0;
			d = l,
			l = "TypeWarning" === t.connectionInfo.certificateInfo.certificateType;
			var i = p.loadScreen("securefailed");
			i.setContext(t, e),
			p.pushScreen(i)
		}),
		n.exports = m
	}), define("plugins/screens/security/index", function (e, t, n) {
		function i() {
			o.setTitle(d.translate(204)),
			r && s.setContext(r)
		}
		var r,
		a,
		o,
		s,
		c = e("iris/event"),
		l = e("screen/manager"),
		d = e("iris/i18n"),
		u = !1,
		m = {
			ERROR_NOT_TRUSTED : 1,
			ERROR_NOT_YET_VALID : 2,
			ERROR_EXPIRED : 4,
			ERROR_REVOKED : 8,
			ERROR_HOST_MISMATCH : 16
		};
		s = {
			init : function () {
				o = e("plugins/titlebarwithactions/index").createTitleBar({
						parentId : "securityScreenTitleBar"
					}),
				i(),
				c.on("application.systemLanguageChange", i)
			},
			loadHelp : function () {
				l.pushScreen(l.loadScreen("security_learnmore"))
			},
			loadCertificateDetails : function (t, n) {
				if (!u) {
					for (var i = qnx.callExtensionMethod("webview.getSSLCertificateDetails", t, JSON.stringify(n)), r = JSON.parse(i), a = [], o = 0; r.length > o; o++)
						a.push("file://" + r[o]);
					if (a.length > 0) {
						var s = e("iris/pps"),
						c = s.create("/pps/services/dialog/control", s.PPSMode.FULL);
						c.onNewData = function () {
							qnx.callExtensionMethod("webview.cleanupSSLCertificateDetails", t, i),
							u = !1
						},
						c.open(s.FileMode.RDWR);
						var l = {
							className : "qnx.dialog::CertificateDialog",
							desc_obj : {
								buttons : [{
										label : d.translate(93)
									}
								],
								titleText : d.translate(205),
								certificatesList : a
							}
						};
						c.write({
							msg : "show",
							id : "123",
							dat : l
						}),
						u = !0
					}
				}
			},
			getError : function (e, t) {
				var n,
				i = document.createElement("ul");
				return (e.errors & m.ERROR_REVOKED) > 0 ? (n = document.createElement("li"), n.appendChild(document.createTextNode(d.translate(206))), n.appendChild(document.createElement("br")), n.appendChild(document.createTextNode(d.translate(207, t))), i.appendChild(n), i) : ((e.errors & m.ERROR_NOT_TRUSTED) > 0 && (n = document.createElement("li"), n.innerText = d.translate(208, t), i.appendChild(n)), (e.errors & m.ERROR_HOST_MISMATCH) > 0 && (n = document.createElement("li"), n.appendChild(document.createTextNode(d.translate(209))), n.appendChild(document.createElement("br")), n.appendChild(document.createTextNode(d.translate(210) + t)), n.appendChild(document.createElement("br")), n.appendChild(document.createTextNode(d.translate(211) + e.certificates[0].subject.commonNames[0])), i.appendChild(n)), (e.errors & m.ERROR_NOT_YET_VALID) > 0 && (n = document.createElement("li"), n.innerText = d.translate(212, "" + new Date(e.certificates[0].notBefore.year, e.certificates[0].notBefore.month - 1, e.certificates[0].notBefore.day, e.certificates[0].notBefore.hour, e.certificates[0].notBefore.minute, e.certificates[0].notBefore.second)), i.appendChild(n)), (e.errors & m.ERROR_EXPIRED) > 0 && (n = document.createElement("li"), n.innerText = d.translate(213, "" + new Date(e.certificates[0].notAfter.year, e.certificates[0].notAfter.month - 1, e.certificates[0].notAfter.day, e.certificates[0].notAfter.hour, e.certificates[0].notAfter.minute, e.certificates[0].notAfter.second)), i.appendChild(n)), i.firstChild || (n = document.createElement("li"), n.innerText = d.translate(214), i.appendChild(n)), i)
			},
			setContext : function (e) {
				r = e;
				var t;
				switch (e.securityInfo.type) {
				case "SecureFailed":
					t = "./assets/cs_unknown_certificate2.png";
					break;
				case "SecureFull":
					t = "./assets/cs_dv_pad_lock2.png";
					break;
				case "SecureEV":
					t = "./assets/cs_ev_pad_lock2.png"
				}
				o.setTitleImg(t);
				var n = document.getElementById("securityDetails");
				n.innerHTML = "";
				var i = document.createElement("div");
				i.setAttribute("class", "securityDetailsSection row-border-bottom default-horizontal-padding"),
				n.appendChild(i);
				var a = document.createElement("div");
				if (a.setAttribute("class", "securityDetailsHeading font-size-l"), a.innerText = d.translate(215), i.appendChild(a), "SecureFailed" != e.securityInfo.type) {
					var c = document.createElement("div");
					c.setAttribute("class", "secondary-text font-size-xs"),
					c.innerText = d.translate(216),
					i.appendChild(c);
					var u = document.createElement("div");
					u.setAttribute("class", "securityDetailsText"),
					u.innerText = e.securityInfo.connectionInfo.domain,
					i.appendChild(u);
					var m = document.createElement("div");
					m.setAttribute("class", "secondary-text font-size-xs"),
					m.innerText = d.translate(217),
					i.appendChild(m);
					var f = document.createElement("div");
					f.setAttribute("class", "securityDetailsText"),
					"SecureEV" === e.securityInfo.type ? (f.innerText = e.securityInfo.connectionInfo.siteOwnership, e.securityInfo.connectionInfo.certificateInfo.certificates[0] && (e.securityInfo.connectionInfo.certificateInfo.certificates[0].subject.city && (f.innerText += ", " + e.securityInfo.connectionInfo.certificateInfo.certificates[0].subject.city), e.securityInfo.connectionInfo.certificateInfo.certificates[0].subject.state && (f.innerText += ", " + e.securityInfo.connectionInfo.certificateInfo.certificates[0].subject.state), e.securityInfo.connectionInfo.certificateInfo.certificates[0].subject.country && (f.innerText += ", " + e.securityInfo.connectionInfo.certificateInfo.certificates[0].subject.country))) : f.innerText = d.translate(218),
					i.appendChild(f);
					var p = document.createElement("div");
					p.setAttribute("class", "secondary-text font-size-xs"),
					p.innerText = d.translate(219),
					i.appendChild(p);
					var g = document.createElement("div");
					g.setAttribute("class", "securityDetailsText");
					var h = e.securityInfo.connectionInfo.certificateAuthority;
					g.innerText = "SecureEV" == e.securityInfo.type ? d.translate(220, h) : h,
					i.appendChild(g)
				} else {
					var v = document.createElement("div");
					v.setAttribute("class", "secondary-text font-size-xs"),
					v.innerText = d.translate(199),
					i.appendChild(v),
					i.appendChild(s.getError(e.securityInfo.connectionInfo.certificateInfo, e.securityInfo.connectionInfo.domain))
				}
				var b = document.createElement("div");
				b.setAttribute("class", "securityDetailsSection row-border-bottom default-horizontal-padding"),
				n.appendChild(b);
				var E = document.createElement("div");
				E.setAttribute("class", "securityDetailsHeading"),
				E.innerText = d.translate(221),
				b.appendChild(E);
				var w = document.createElement("div");
				w.setAttribute("class", "securityDetailsText"),
				w.innerText = e.securityInfo.connectionInfo.cipher.version + ":" + e.securityInfo.connectionInfo.cipher.name,
				":" === w.innerText && (w.innerText = d.translate(222)),
				b.appendChild(w);
				var T = document.createElement("div");
				T.setAttribute("class", "securityDetailsSection row-border-bottom default-horizontal-padding"),
				n.appendChild(T);
				var y = document.createElement("div");
				y.setAttribute("class", "securityDetailsBlue font-size-l"),
				y.innerText = d.translate(191),
				y.onclick = s.loadHelp;
				var I = document.createElement("div");
				if (I.setAttribute("class", "securityDetailsBlue font-size-l"), I.innerText = d.translate(200), I.onclick = function () {
					s.loadCertificateDetails(e.webviewId, e.securityInfo.connectionInfo.certificateInfo)
				}, "SecureFailed" === e.securityInfo.type && e.securityInfo.connectionInfo.certificateInfo.certificates.length > 0) {
					var S = JSON.parse(qnx.callExtensionMethod("webview.knownSSLCertificate", e.webviewId, e.securityInfo.connectionInfo.domain));
					if (S.certificates.length) {
						var x = document.createElement("div");
						x.setAttribute("class", "secondary-text font-size-xs"),
						x.innerText = d.translate(223, e.securityInfo.connectionInfo.domain),
						T.appendChild(x);
						var C = document.createElement("button");
						C.innerText = d.translate(224),
						C.onclick = function () {
							qnx.callExtensionMethod("webview.removeKnownSSLCertificate", e.webviewId, e.securityInfo.connectionInfo.domain, e.securityInfo.connectionInfo.certificateInfo.certificates[0].signature),
							l.popScreen(s)
						};
						var k = document.createElement("div");
						k.className = "default-vertical-padding",
						k.appendChild(C),
						T.appendChild(k)
					}
				}
				T.appendChild(y),
				e.securityInfo.connectionInfo.certificateInfo.certificates.length > 0 && T.appendChild(I)
			},
			getActionBar : function () {
				return a || (a = e("plugins/actionbar/index").makeActionBar(this, [], "Back", !1)),
				a
			},
			becomingVisible : function () {}

		},
		n.exports = s
	}), define("plugins/screens/security_learnmore/index", function (e, t, n) {
		function i() {
			r.setTitle(s.translate(225));
			var e = document.querySelectorAll("#security_learnmore .securityDetailsText");
			e[0].innerHTML = s.translate(226) + "<ul><li>" + s.translate(228) + "</li><li>" + s.translate(229) + "</li></ul>" + s.translate(227),
			e[1].innerHTML = s.translate(231) + "<ul><li>" + s.translate(235) + "</li><li>" + s.translate(234) + "</li><li>" + s.translate(233) + "</li><li>" + s.translate(232) + "</li></ul>" + s.translate(230),
			e[2].innerHTML = s.translate(237) + "<ul><li>" + s.translate(238) + "</li></ul>" + s.translate(236),
			e[3].innerHTML = s.translate(239) + "<ul><li>" + s.translate(241) + "</li><li>" + s.translate(240) + "</li></ul>",
			e[4].innerHTML = s.translate(242) + "<ul><li>" + s.translate(241) + "</li><li>" + s.translate(240) + "</li></ul>",
			e[5].innerHTML = s.translate(243)
		}
		var r,
		a,
		o,
		s = e("iris/i18n"),
		c = e("iris/event");
		o = {
			init : function () {
				r = e("plugins/titlebarwithactions/index").createTitleBar({
						parentId : "security-learnmore-title-bar"
					}),
				i(),
				c.on("application.systemLanguageChange", i)
			},
			getActionBar : function () {
				return a || (a = e("plugins/actionbar/index").makeActionBar(this, [], "Back", !1)),
				a
			},
			becomingVisible : function () {}

		},
		n.exports = o
	}), define("plugins/screens/selectmore/index", function (e, t, n) {
		function i() {
			u.updateAction({
				action : "Open in New Tab",
				disabled : void 0 === w || !N.length
			}),
			u.updateAction({
				action : "Delete",
				disabled : void 0 === T || !N.length
			})
		}
		function r(e) {
			var t = N.indexOf(e);
			t >= 0 ? N.splice(t, 1) : N.push(e),
			i()
		}
		function a() {
			p || (m = C.create([C.items.SELECTMORE_SELECT_ALL_GRID, C.items.SELECTMORE_CANCEL_SELECTION_GRID], y), f = C.create([C.items.SELECTMORE_SELECT_ALL_LIST, C.items.SELECTMORE_CANCEL_SELECTION_LIST], y)),
			p = v ? m : f,
			N.length ? p.enableItem(v ? C.items.SELECTMORE_CANCEL_SELECTION_GRID : C.items.SELECTMORE_CANCEL_SELECTION_LIST) : p.disableItem(v ? C.items.SELECTMORE_CANCEL_SELECTION_GRID : C.items.SELECTMORE_CANCEL_SELECTION_LIST),
			N.length !== L.length ? p.enableItem(v ? C.items.SELECTMORE_SELECT_ALL_GRID : C.items.SELECTMORE_SELECT_ALL_LIST) : p.disableItem(v ? C.items.SELECTMORE_SELECT_ALL_GRID : C.items.SELECTMORE_SELECT_ALL_LIST),
			p.show()
		}
		function o() {
			var t = e("screen/manager").currentScreen();
			b = t.currentView ? t.currentView() : t.getCurrentView(),
			L = b.getItems(),
			_ = b.getNodes(),
			w = b.selectMoreOpen ? b.selectMoreOpen() : void 0,
			T = b.selectMoreDelete(),
			v = !(!b.selectMoreIsGrid || !b.selectMoreIsGrid())
		}
		function s() {
			E = b.domElement.parentElement.parentElement,
			S.pushActionBar(y.getActionBar()),
			i(),
			E.classList.add("selectmore-content-area"),
			x.forceLayout(u),
			x.animate()
		}
		function c(e) {
			for (var t = e.target; !t.parentNode.classList.contains("grid-container") && !t.parentNode.classList.contains("list-container"); )
				t = t.parentNode;
			return t
		}
		function l(e, t) {
			k.redirect(E, e, t)
		}
		function d(e, t) {
			k.clearRedirect(E, e, t)
		}
		var u,
		m,
		f,
		p,
		g,
		h,
		v,
		b,
		E,
		w,
		T,
		y,
		I = e("iris/event"),
		S = e("plugins/actionbar/index"),
		x = e("screen/animationCoordinator"),
		C = e("plugins/overflowmenu/index"),
		k = e("ui/utils"),
		A = !0,
		N = [],
		L = [],
		_ = [];
		y = {
			init : function () {
				g || (g = !0, e("screen/manager").loadScreen("selectmore"), y.redirect = l, y.clearRedirect = d, I.on("selectmore.selectionChanged", r), I.on("application.systemLanguageChange", y.cleanUp))
			},
			getActionBar : function () {
				if (!u) {
					var e = function () {
						w(N),
						y.cleanUp()
					},
					t = function () {
						T(N),
						y.cleanUp()
					};
					u = S.makeActionBar(null, [{
									action : "Open in New Tab",
									actionHandler : e
								}, {
									action : "Delete",
									actionHandler : t
								}
							], "Cancel Select More", a, y.cleanUp, "selectmoreOffscreenBottom", "selectmoreBack")
				}
				return u
			},
			show : function (e) {
				A && (A = !1, e ? (b = e.view, N = [e.contextItem], L = e.allItems, _ = e.nodes, w = e.openFunction, T = e.deleteFunction, v = !!e.isGrid) : o(), s(), I.emit("selectmore.show", [b]))
			},
			multiTouch : function (e, t) {
				if (A) {
					A = !1,
					o();
					var n = c(e),
					i = _.indexOf(n),
					r = c(t),
					a = _.indexOf(r),
					l = Math.min(i, a),
					d = Math.max(i, a) + 1;
					N = L.slice(l, d),
					s(),
					I.emit("selectmore.show", [b]),
					I.emit("selectmore.selectAll", [b, _.slice(l, d)])
				}
			},
			cleanUp : function () {
				A || (E.classList.remove("selectmore-content-area"), S.popActionBar(300), x.animate(), I.emit("selectmore.remove", [b]), A = !0, h = !1, N = [], T = null)
			},
			isVisible : function () {
				return !A
			},
			isSelectingAll : function () {
				return h
			},
			getView : function () {
				return b
			},
			selectAll : function () {
				h = !0,
				I.emit("selectmore.selectAll", [b, _]),
				N = L.concat([]),
				i()
			},
			clearSelection : function () {
				I.emit("selectmore.clearSelection", [b]),
				N = [],
				h = !1,
				i()
			}
		},
		e("iris/on.demand").wrapModule(y, y.init, ["isVisible"]),
		n.exports = y
	}), define("plugins/screens/settings/index", function (e, t, n) {
		function i(e, t) {
			(e == b.interactionType.click || e == b.interactionType.holdRelease) && t.callback(t)
		}
		function r(e, t) {
			return e.id === t.id
		}
		function a(e) {
			var t = h.loadScreen("settings_" + e.screen);
			h.pushScreen(t)
		}
		function o(t) {
			e("iris/invocation").invoke({
				target : "sys.help",
				uri : "help://com.flashbrowser"
			}),
			g.emit("interaction.controller.clear.selection", [t])
		}
		function s(e) {
			switch (e.screen) {
			case "general":
				return {
					title : v.translate(244),
					imageUrl : "assets/ca_browser.png"
				};
			case "privacy":
				return {
					title : v.translate(245),
					imageUrl : "assets/ca_lock.png"
				};
			case "permissions":
				return {
					title : v.translate(246),
					imageUrl : "assets/ca_permission.png"
				};
			case "developer":
				return {
					title : v.translate(247),
					imageUrl : "assets/ca_developer_mode.png"
				};
			case "help":
				return {
					title : v.translate(248),
					imageUrl : "assets/ic_help.png"
				};
			case "about":
				return {
					title : v.translate(249),
					imageUrl : "assets/ca_about.png"
				};
			case "interaction":
				return {
					title : v.translate(250),
					imageUrl : "assets/settings_interaction.png"
				};
			case "experimental":
				return {
					title : "Experimental",
					imageUrl : "assets/settings_experimental.png"
				};
			default:
				return console.error("Error updating row adapter. Invalid row requested"), {
					title : "",
					imageUrl : ""
				}
			}
		}
		function c() {
			u.refreshRowAdapter(),
			f.setTitle(v.translate(114))
		}
		function l(e, t) {
			e == d && "pushed" == t && (g.un("manager.screen", l), u.clear(), u.addItems(m))
		}
		var d,
		u,
		m,
		f,
		p,
		g = e("iris/event"),
		h = e("screen/manager"),
		v = e("iris/i18n"),
		b = e("ui/interactionController");
		d = {
			init : function (t) {
				g.on("manager.screen", l),
				f = e("plugins/titlebarwithactions/index").createTitleBar({
						parentId : "settings-title-bar",
						titleText : v.translate(114)
					});
				var n = t.getElementsByClassName("settingsList")[0];
				m = [{
						screen : "general",
						callback : a
					}, {
						screen : "privacy",
						callback : a
					}, {
						screen : "permissions",
						callback : a
					}, {
						screen : "developer",
						callback : a
					}, {
						screen : "help",
						callback : o
					}, {
						screen : "about",
						callback : a
					}
				],
				PUBLIC_BUILD || (m.push({
						screen : "interaction",
						callback : a
					}), m.push({
						screen : "experimental",
						callback : a
					}));
				var p = function () {
					return v.translate(114)
				},
				h = {
					container : n,
					scrollContainerId : "settings-list",
					interactionHandler : i,
					screen : d,
					listToRowAdapter : s,
					itemComparator : r,
					useTitleAsA11yLabel : !0,
					title : p
				};
				u = e("ui/container/list/list").create(h);
				for (var b = 0; m.length > b; b++)
					m[b].id = b;
				g.on("application.systemLanguageChange", c)
			},
			getActionBar : function () {
				return p || (p = e("plugins/actionbar/index").makeActionBar(this, [], "Back", !1)),
				p
			},
			becomingVisible : function () {}

		},
		n.exports = d
	}), define("plugins/screens/settings_about/index", function (e, t, n) {
		function i() {
			a.setTitle(c.translate(249))
		}
		var r,
		a,
		o,
		s = e("iris/event"),
		c = e("iris/i18n");
		o = {
			init : function () {
				a = e("plugins/titlebarwithactions/index").createTitleBar({
						parentId : "settings-about-title-bar",
						titleText : c.translate(249)
					});
				var t = new XMLHttpRequest;
				t.open("GET", "assets/credits.html", !0),
				t.onreadystatechange = function () {
					4 === t.readyState && (200 === t.status && t.responseText ? document.getElementById("settings-about-content").innerHTML = t.responseText : console.error("Credits couldn't be found. Nothing will be displayed"))
				},
				t.send(),
				s.on("manager.screen", function () {
					document.getElementById("settings-about-content").scrollTop = 0
				}, [o, "offscreen"]),
				s.on("application.systemLanguageChange", i)
			},
			becomingVisible : function () {},
			getActionBar : function () {
				return r || (r = e("plugins/actionbar/index").makeActionBar(o, [], "Back", !1)),
				r
			}
		},
		n.exports = o
	}), define("plugins/screens/settings_developer/index", function (e, t, n) {
		function i(e) {
			if (e) {
				var t = g.ipAddresses;
				if (t) {
					var n = g.port;
					document.getElementById("settings-inspector-ip").innerText = t.ipv4Address + ":" + n,
					document.getElementById("settings-inspector-ipv6").innerText = t.ipv6Address + ":" + n
				} else
					document.getElementById("settings-inspector-ip").innerText = p.translate(251), document.getElementById("settings-inspector-ipv6").innerText = p.translate(251);
				document.getElementById("settings-inspector-message-section").classList.remove("hidden")
			} else
				document.getElementById("settings-inspector-message-section").classList.add("hidden")
		}
		function r(e) {
			if (e) {
				var t = g.ipAddresses;
				if (t) {
					var n = h.port;
					document.getElementById("settings-webDriver-ip").innerText = t.ipv4Address + ":" + n,
					document.getElementById("settings-webDriver-ipv6").innerText = t.ipv6Address + ":" + n
				} else
					document.getElementById("settings-webDriver-ip").innerText = p.translate(251), document.getElementById("settings-webDriver-ipv6").innerText = p.translate(251);
				document.getElementById("settings-webDriver-message-section").classList.remove("hidden")
			} else
				document.getElementById("settings-webDriver-message-section").classList.add("hidden")
		}
		function a() {
			document.getElementById("settings-enable-desktop-mode-label").innerText = p.translate(252),
			document.getElementById("settings-enable-disk-cache-label").innerText = p.translate(253),
			document.getElementById("settings-show-debug-borders-label").innerText = p.translate(254),
			document.getElementById("settings-enable-inspector-label").innerText = p.translate(255),
			document.getElementById("settings-inspector-warning").getElementsByClassName("warning-text")[0].innerText = p.translate(256),
			document.getElementById("settings-inspector-status").innerText = p.translate(257),
			document.getElementById("settings-inspector-ip-label").innerText = p.translate(258),
			document.getElementById("settings-inspector-ipv6-label").innerText = p.translate(259),
			document.getElementById("settings-enable-webDriver-label").innerText = p.translate(260),
			document.getElementById("settings-webDriver-warning").getElementsByClassName("warning-text")[0].innerText = p.translate(261),
			document.getElementById("settings-webDriver-status").innerText = p.translate(257),
			document.getElementById("settings-webDriver-ip-label").innerText = p.translate(258),
			document.getElementById("settings-webDriver-ipv6-label").innerText = p.translate(259),
			c.setTitle(p.translate(247))
		}
		function o() {
			v.setValue(v.ENABLE_INSPECTOR, !1),
			i(!1),
			v.setValue(v.ENABLE_WEBDRIVER, !1),
			r(!1)
		}
		function s(e) {
			o(),
			d && u && (e ? (d.classList.remove("hidden"), document.getElementById("settings-inspector-warning").parentNode.classList.remove("hidden"), u.classList.remove("hidden"), document.getElementById("settings-webDriver-warning").parentNode.classList.remove("hidden")) : (d.classList.add("hidden"), document.getElementById("settings-inspector-warning").parentNode.classList.add("hidden"), u.classList.add("hidden"), document.getElementById("settings-webDriver-warning").parentNode.classList.add("hidden")))
		}
		var c,
		l,
		d,
		u,
		m,
		f = e("iris/event"),
		p = e("iris/i18n"),
		g = e("iris/inspector"),
		h = e("iris/webDriver"),
		v = e("iris/settings"),
		b = e("plugins/woggle/index");
		m = {
			init : function () {
				c = e("plugins/titlebarwithactions/index").createTitleBar({
						parentId : "settings-developer-title-bar",
						titleText : p.translate(247)
					}),
				a();
				var t = document.getElementById("settings-enable-inspector"),
				n = document.getElementById("settings-enable-webDriver"),
				o = document.getElementById("settings-enable-desktop-mode"),
				l = document.getElementById("settings-enable-disk-cache"),
				m = document.getElementById("settings-show-debug-borders");
				t.addEventListener("change", function () {
					var e = this.checked;
					v.setValue(v.ENABLE_INSPECTOR, e),
					i(e)
				}),
				n.addEventListener("change", function () {
					var e = this.checked;
					v.setValue(v.ENABLE_WEBDRIVER, e),
					r(e)
				}),
				b.createToggle(t, t.parentNode.parentNode),
				b.createToggle(n, n.parentNode.parentNode),
				o.addEventListener("change", function () {
					v.setValue(v.ENABLE_DESKTOP_MODE, this.checked)
				}),
				l.addEventListener("change", function () {
					v.setValue(v.ENABLE_DISK_CACHE, this.checked)
				}),
				m.addEventListener("change", function () {
					v.setValue(v.ENABLE_SHOW_DEBUG_BORDERS, this.checked)
				}),
				b.createToggle(o, o.parentNode.parentNode),
				b.createToggle(l, l.parentNode.parentNode),
				b.createToggle(m, m.parentNode.parentNode),
				d = t.parentNode,
				u = n.parentNode,
				e("iris/it.policy").isEnabledDevModeWorkspace() || s(!1),
				f.on("it.policy.enableDevModeWorkspace", s),
				f.on("application.systemLanguageChange", a)
			},
			becomingVisible : function () {
				var e = v.getValue(v.ENABLE_INSPECTOR);
				b.setToggle(document.getElementById("settings-enable-inspector"), e),
				i(e);
				var t = v.getValue(v.ENABLE_WEBDRIVER);
				b.setToggle(document.getElementById("settings-enable-webDriver"), t),
				r(t),
				b.setToggle(document.getElementById("settings-enable-desktop-mode"), v.getValue(v.ENABLE_DESKTOP_MODE)),
				b.setToggle(document.getElementById("settings-enable-disk-cache"), v.getValue(v.ENABLE_DISK_CACHE)),
				b.setToggle(document.getElementById("settings-show-debug-borders"), v.getValue(v.ENABLE_SHOW_DEBUG_BORDERS))
			},
			getActionBar : function () {
				return l || (l = e("plugins/actionbar/index").makeActionBar(this, [], "Back", !1)),
				l
			}
		},
		n.exports = m
	}), define("plugins/screens/settings_general/index", function (e, t, n) {
		function i() {
			d || (d = T.createFrenchToast(b.translate(264), b.translate(5), function () {
						d = void 0
					}, function () {
						E.removeAll(),
						w.addTracked() || E.addDefaults(),
						d = void 0
					}))
		}
		function r() {
			u.setExpand(!1)
		}
		function setOptions() {
			c.setTitle(b.translate(244)),
			document.getElementById("settings-home-page-url").placeholder = b.translate(265),
			document.getElementById("settings-home-page-current").value = b.translate(97),
			document.getElementById("settings-open-new-tab-links-background-label").innerText = b.translate(266),
			document.getElementById("settings-enable-search-suggestions-label").innerText = b.translate(267),
			document.getElementById("settings-enable-flash-label").innerText = b.translate(268),
			document.getElementById("setting-audio-feedback-toggle-label").innerText = b.translate(269),
			document.getElementById("settings-reset-search").value = b.translate(270),
			document.getElementById("settings-startup-explain-new-tab").innerText = b.translate(271),
			document.getElementById("settings-startup-explain-last-tabs").innerText = b.translate(272),
			document.getElementById("settings-startup-explain-home").innerText = b.translate(273)
		}
		function o(e) {
			switch (settingValue.setValue(settingValue.ON_STARTUP, e), Array.prototype.forEach.call(document.querySelectorAll("#settings-startup-explain-new-tab, #settings-startup-explain-last-tabs, #settings-startup-explain-home"), function (e) {
					e.classList.add("hidden")
				}), document.getElementById("settings-home-page-url").blur(), document.getElementById("settings-home-page-url-section").classList.add("hidden"), e) {
			case settingValue.ON_STARTUP_HOME:
				document.getElementById("settings-home-page-url-section").classList.remove("hidden"),
				document.getElementById("settings-startup-explain-home").classList.remove("hidden");
				var t = settingValue.getValue(settingValue.HOME_PAGE_URL);
				t && "" !== t && (document.getElementById("settings-home-page-url").value = t),
				m || document.getElementById("settings-home-page-url").focus();
				break;
			case settingValue.ON_STARTUP_LAST_TABS:
				document.getElementById("settings-startup-explain-last-tabs").classList.remove("hidden");
				break;
			case settingValue.ON_STARTUP_NEW_TAB:
				document.getElementById("settings-startup-explain-new-tab").classList.remove("hidden")
			}
		}
		function s() {
			m = e("iris/it.policy").getSpecifiedHomePage(),
			m && (document.getElementById("settings-home-page-current").classList.add("hidden"), document.getElementById("settings-home-page-url").disabled = !0)
		}
		var c,
		l,
		d,
		u,
		m,
		f,
		p = e("iris/event"),
		settingValue = e("iris/settings"),
		h = e("plugins/dropper/index"),
		v = e("plugins/woggle/index"),
		b = e("iris/i18n"),
		E = e("iris/search"),
		w = e("iris/carrier.search"),
		T = e("plugins/toaster/index"),
		y = e("iris/validation"),
		I = [{
				translate : function () {
					return b.translate(89)
				},
				value : settingValue.ON_STARTUP_NEW_TAB
			}, {
				translate : function () {
					return b.translate(262)
				},
				value : settingValue.ON_STARTUP_LAST_TABS
			}, {
				translate : function () {
					return b.translate(263)
				},
				value : settingValue.ON_STARTUP_HOME
			}
		];
		f = {
			init : function () {
				c = e("plugins/titlebarwithactions/index").createTitleBar({
						parentId : "settings-general-title-bar",
						titleText : b.translate(244)
					}),
				s(),
				u = h.createDropdown(document.getElementById("settings-startup"), I, {
						translate : function () {
							return b.translate(274)
						}
					}, o);
				var t = document.getElementById("settings-home-page-url");
				t.addEventListener("change", function () {
					settingValue.setValue(settingValue.HOME_PAGE_URL, this.value)
				}),
				t.addEventListener("keyup", function (e) {
					var t = e.keyCode;
					13 === t && this.blur()
				});
				var n = document.getElementById("settings-home-page-current");
				n.addEventListener("click", function () {
					var t = e("iris/tabs/controller").getSelected().url;
					t && (document.getElementById("settings-home-page-url").value = t, settingValue.setValue(settingValue.HOME_PAGE_URL, t))
				});
				var l = document.getElementById("settings-open-new-tab-links-background"),
				d = document.getElementById("settings-enable-search-suggestions"),
				settingsEnableFlash = document.getElementById("settings-enable-flash"),
				E = document.getElementById("setting-audio-feedback-toggle");
				l.addEventListener("change", function () {
					settingValue.setValue(settingValue.OPEN_NEW_TAB_LINKS_BACKGROUND, this.checked)
				}),
				d.addEventListener("change", function () {
					settingValue.setValue(settingValue.ENABLE_SEARCH_SUGGESTIONS, this.checked)
				}),
				settingsEnableFlash.addEventListener("change", function () {
					settingValue.setValue(settingValue.ENABLE_FLASH, this.checked)
				}),
				E.addEventListener("change", function () {
					settingValue.setValue(settingValue.ENABLE_AUDIO_FEEDBACK, this.checked)
				});
				var w = document.getElementById("settings-reset-search");
				w.addEventListener("click", i),
				v.createToggle(l, l.parentNode.parentNode),
				v.createToggle(d, d.parentNode.parentNode),
				v.createToggle(settingsEnableFlash, settingsEnableFlash.parentNode.parentNode),
				v.createToggle(E, E.parentNode.parentNode),
				setOptions(),
				p.on("application.systemLanguageChange", setOptions),
				p.on("manager.screen", r, [f, "popped"])
			},
			becomingVisible : function () {
				u.setValue(settingValue.getValue(settingValue.ON_STARTUP));
				var t = e("iris/tabs/controller").getSelected().url,
				n = document.getElementById("settings-home-page-current");
				n.disabled = !y.isValidUrl(t),
				v.setToggle(document.getElementById("settings-open-new-tab-links-background"), settingValue.getValue(settingValue.OPEN_NEW_TAB_LINKS_BACKGROUND)),
				v.setToggle(document.getElementById("settings-enable-flash"), settingValue.getValue(settingValue.ENABLE_FLASH)),
				v.setToggle(document.getElementById("settings-enable-search-suggestions"), settingValue.getValue(settingValue.ENABLE_SEARCH_SUGGESTIONS)),
				v.setToggle(document.getElementById("setting-audio-feedback-toggle"), settingValue.getValue(settingValue.ENABLE_AUDIO_FEEDBACK))
			},
			getActionBar : function () {
				return l || (l = e("plugins/actionbar/index").makeActionBar(this, [], "Back", !1)),
				l
			}
		},
		n.exports = f
	}), define("plugins/screens/settings_permissions/index", function (e, t, n) {
		function i(e) {
			var t = b.loadScreen("site_permissions");
			t.setContext(e),
			b.pushScreen(t)
		}
		function r(e, t) {
			return e.site === t.site
		}
		function a(e) {
			return {
				title : e.site
			}
		}
		function o(e) {
			w && (T.disabled = !e, w.updateAction(T))
		}
		function s(e) {
			h.setEmptyMessageVisible(0 === e.length),
			h.replaceItems(e),
			o(e.length > 0)
		}
		function c(e) {
			C.removeSite(e[0].site)
		}
		function l() {
			o(!h.isEmpty())
		}
		function d(e) {
			1 === h.getItems().length && o(!1),
			h.animateDelete([e], x.translate(275), c, l)
		}
		function u() {
			y && (A.dismissToast(y), y = void 0)
		}
		function m() {
			h.hide(),
			o(!1),
			S.emit("screen.blockAnimations", [], !0);
			var e = function () {
				y = void 0,
				h.show(),
				o(!h.isEmpty()),
				S.emit("screen.unblockAnimations", [], !0)
			},
			t = function () {
				y = void 0,
				h.clear(),
				h.setEmptyMessageVisible(!0),
				h.show(),
				C.wipe(),
				S.emit("screen.unblockAnimations", [], !0)
			};
			u(),
			y = A.createFrenchToast(x.translate(276), x.translate(5), e, t)
		}
		function f() {
			E.setTitle(x.translate(246)),
			document.getElementById("permissionsSiteExceptionsText").innerText = x.translate(277),
			v.getElementsByClassName("settings-group-header")[0].innerText = x.translate(278),
			h.refreshRowAdapter()
		}
		function p() {
			return {
				message : x.translate(279),
				imageUrl : "default"
			}
		}
		function g(e, t) {
			e == k.interactionType.click ? i(t.site) : e == k.interactionType.hold && b.activateContextMenu({
				contextType : "sitePermission",
				items : [{
						imageUrl : "assets/ic_delete.png",
						name : x.translate(170),
						callback : d.bind(this, t),
						isDelete : !0
					}
				]
			})
		}
		var h,
		v,
		b,
		E,
		w,
		T,
		y,
		I,
		S = e("iris/event"),
		x = e("iris/i18n"),
		C = e("iris/permissions"),
		k = e("ui/interactionController"),
		A = e("plugins/toaster/index");
		I = {
			init : function () {
				v = document.getElementById("settings_permissions"),
				b = e("screen/manager");
				var t = function () {
					return x.translate(246)
				},
				n = {
					container : document.getElementById("permissions-content-area"),
					interactionHandler : g,
					screen : I,
					scrollContainerId : "settings-permissions-list",
					listToRowAdapter : a,
					itemComparator : r,
					getEmptyContents : p,
					title : t
				};
				h = e("ui/container/list/list").create(n),
				E = e("plugins/titlebarwithactions/index").createTitleBar({
						parentId : "settings-permissions-title-bar",
						titleText : x.translate(246)
					}),
				f(),
				S.on("application.systemLanguageChange", f)
			},
			getActionBar : function () {
				return w || (T = {
						action : "Remove All",
						actionHandler : m
					}, w = e("plugins/actionbar/index").makeActionBar(this, [T], "Back", !1)),
				w
			},
			becomingVisible : function () {
				h.setEmptyMessageVisible(!1),
				C.getSites(s)
			}
		},
		n.exports = I
	}), define("plugins/screens/settings_privacy/index", function (e, t, n) {
		function i() {
			var e = w.loadScreen("site_exceptions");
			w.pushScreen(e)
		}
		function r() {
			document.getElementById("settings-clear-history").disabled = !1
		}
		function a() {
			document.getElementById("settings-clear-history").disabled = !0,
			T.createFrenchToast(I.translate(183), I.translate(5), r, E.clearHistory)
		}
		function o() {
			E.clearSiteData(),
			E.clearCache(),
			e("iris/screen.capture").removeOldScreenshots(!0)
		}
		function s() {
			document.getElementById("settings-clear-browsing-data").disabled = !1
		}
		function c() {
			document.getElementById("settings-clear-browsing-data").disabled = !0,
			T.createFrenchToast(I.translate(287), I.translate(5), s, o)
		}
		function l() {
			p.setExpand(!1)
		}
		function d() {
			m.setTitle(I.translate(245)),
			document.getElementById("settings-private-browsing-label").innerText = I.translate(288),
			document.getElementById("settings-private-browsing-warning").getElementsByClassName("warning-text")[0].innerText = I.translate(289),
			document.getElementById("settings-block-popups-label").innerText = I.translate(290),
			document.getElementById("settings-accept-cookies-label").innerText = I.translate(291),
			document.getElementById("settings-site-exceptions").value = I.translate(292),
			document.getElementById("settings-clear-history").value = I.translate(293),
			document.getElementById("settings-clear-browsing-data").value = I.translate(294)
		}
		function u(e) {
			g && (e ? g.classList.add("hidden") : (g.classList.remove("hidden"), y.setToggle(document.getElementById("settings-private-browsing"), E.getValue(E.ENABLE_PRIVATE_BROWSING))))
		}
		var m,
		f,
		p,
		g,
		h,
		v = e("iris/event"),
		b = e("plugins/dropper/index"),
		E = e("iris/settings"),
		w = e("screen/manager"),
		T = e("plugins/toaster/index"),
		y = e("plugins/woggle/index"),
		I = e("iris/i18n"),
		S = [{
				translate : function () {
					return I.translate(280)
				},
				value : 1
			}, {
				translate : function () {
					return I.translate(281)
				},
				value : 7
			}, {
				translate : function () {
					return I.translate(282)
				},
				value : 14
			}, {
				translate : function () {
					return I.translate(283)
				},
				value : 31
			}, {
				translate : function () {
					return I.translate(284)
				},
				value : 62
			}, {
				translate : function () {
					return I.translate(285)
				},
				value : 186
			}, {
				translate : function () {
					return I.translate(286)
				},
				value : 365
			}
		];
		h = {
			init : function () {
				m = e("plugins/titlebarwithactions/index").createTitleBar({
						parentId : "settings-privacy-title-bar",
						titleText : I.translate(245)
					});
				var t = document.getElementById("settings-history-expiry");
				p = b.createDropdown(t, S, {
						translate : function () {
							return I.translate(295)
						}
					}, function (e) {
						E.setValue(E.HISTORY_EXPIRY, parseInt(e, 10))
					}),
				d();
				var n = document.getElementById("settings-private-browsing"),
				r = document.getElementById("settings-block-popups"),
				o = document.getElementById("settings-accept-cookies");
				n.addEventListener("change", function () {
					this.checked !== E.getValue(E.ENABLE_PRIVATE_BROWSING) && (this.checked ? e("iris/privatebrowsing").startPrivateBrowsing() : e("iris/privatebrowsing").endPrivateBrowsing(), E.setValue(E.ENABLE_PRIVATE_BROWSING, this.checked))
				}),
				r.addEventListener("change", function () {
					E.setValue(E.BLOCK_POPUPS, this.checked)
				}),
				o.addEventListener("change", function () {
					E.setValue(E.ACCEPT_COOKIES, this.checked)
				});
				var s = document.getElementById("settings-site-exceptions");
				s.addEventListener("click", i),
				s = document.getElementById("settings-clear-history"),
				s.addEventListener("click", a),
				s = document.getElementById("settings-clear-browsing-data"),
				s.addEventListener("click", c),
				y.createToggle(n, n.parentNode.parentNode),
				y.createToggle(r, r.parentNode.parentNode),
				y.createToggle(o, o.parentNode.parentNode),
				g = n.parentNode.parentNode,
				e("iris/it.policy").isBlockPersistentStorage() && g.classList.add("hidden"),
				v.on("it.policy.blockPersistentStorage", u),
				v.on("application.systemLanguageChange", d),
				v.on("manager.screen", l, [h, "popped"])
			},
			becomingVisible : function () {
				p.setValue(E.getValue(E.HISTORY_EXPIRY)),
				document.getElementById("settings-clear-history").disabled = !1,
				document.getElementById("settings-clear-browsing-data").disabled = !1,
				y.setToggle(document.getElementById("settings-private-browsing"), E.getValue(E.ENABLE_PRIVATE_BROWSING)),
				y.setToggle(document.getElementById("settings-block-popups"), E.getValue(E.BLOCK_POPUPS)),
				y.setToggle(document.getElementById("settings-accept-cookies"), E.getValue(E.ACCEPT_COOKIES))
			},
			getActionBar : function () {
				return f || (f = e("plugins/actionbar/index").makeActionBar(this, [], "Back", !1)),
				f
			}
		},
		n.exports = h
	}), define("plugins/screens/site_exception/index", function (e, t, n) {
		var i,
		r,
		a,
		o,
		s,
		c,
		l,
		d,
		u = e("iris/event"),
		m = e("iris/i18n"),
		f = e("plugins/toaster/index");
		d = {
			init : function () {
				i = e("screen/manager"),
				r = e("plugins/titlebarwithactions/index").createTitleBar({
						parentId : "site-exception-title-bar",
						titleText : m.translate(296)
					})
			},
			setContext : function (t, n, i) {
				c = t,
				l = n,
				r.setTitle(t);
				var a = document.getElementById("siteExceptionText");
				a.innerHTML = "",
				a.appendChild(document.createTextNode(m.translate(199))),
				a.appendChild(e("plugins/screens/security/index").getError(i, t))
			},
			abortRemove : function () {
				s = void 0,
				o.disabled = !1,
				a.updateAction(o)
			},
			remove : function () {
				s = void 0,
				qnx.callExtensionMethod("webview.removeKnownSSLCertificate", e("iris/tabs/controller").getSelected().webviewId, c, l),
				u.emit("siteException.remove", [c, l]),
				i.popScreen(d)
			},
			hide : function () {
				s && e("plugins/toaster/index").dismissToast(s),
				o.disabled = !1,
				a.updateAction(o),
				s = f.createFrenchToast(m.translate(297), m.translate(5), d.abortRemove, d.remove)
			},
			getActionBar : function () {
				return a || (o = {
						action : "Remove",
						actionHandler : d.hide,
						disabled : !1
					}, a = e("plugins/actionbar/index").makeActionBar(this, [o], "Back", !1)),
				a
			},
			becomingVisible : function () {}

		},
		n.exports = d
	}), define("plugins/screens/site_exceptions/index", function (e, t, n) {
		function i(e, t) {
			return e.id === t.id
		}
		function r(e) {
			return {
				title : e.domain
			}
		}
		function a(e, t, n) {
			var i = b.loadScreen("site_exception");
			i.setContext(e, t, n),
			b.pushScreen(i)
		}
		function o() {
			var t = [],
			n = JSON.parse(qnx.callExtensionMethod("webview.knownSSLCertificates", e("iris/tabs/controller").getSelected().webviewId));
			for (var i in n) {
				var r = i.substring(0, i.lastIndexOf(":")),
				o = i.substring(i.lastIndexOf(":") + 1),
				s = {
					domain : r,
					id : o,
					callback : a.bind(x, r, o, n[i])
				};
				t.push(s)
			}
			return t
		}
		function s(e) {
			I && (S.disabled = !e, I.updateAction(S))
		}
		function c() {
			var e = o();
			T.replaceItems(e),
			s(e.length > 0)
		}
		function l(t) {
			var n = t[0];
			qnx.callExtensionMethod("webview.removeKnownSSLCertificate", e("iris/tabs/controller").getSelected().webviewId, n.domain, n.id)
		}
		function d() {
			s(!T.isEmpty())
		}
		function u(e) {
			1 === T.getItems().length && s(!1),
			T.animateDelete([e], k.translate(275), l, d)
		}
		function m() {
			E && (N.dismissToast(E), E = void 0)
		}
		function f() {
			T.hide(),
			s(!1),
			C.emit("screen.blockAnimations", [], !0);
			var t = function () {
				E = void 0,
				T.show(),
				s(!T.isEmpty()),
				C.emit("screen.unblockAnimations", [], !0)
			},
			n = function () {
				E = void 0,
				T.clear(),
				T.setEmptyMessageVisible(!0),
				T.show(),
				qnx.callExtensionMethod("webview.removeAllKnownSSLCertificates", e("iris/tabs/controller").getSelected().webviewId),
				C.emit("screen.unblockAnimations", [], !0)
			};
			m(),
			E = N.createFrenchToast(k.translate(276), k.translate(5), t, n)
		}
		function p() {
			y.setTitle(k.translate(292)),
			document.getElementById("siteExceptionsText").innerText = k.translate(298),
			w.getElementsByClassName("settings-group-header")[0].innerText = k.translate(278),
			T.refreshRowAdapter()
		}
		function g() {
			return {
				message : k.translate(299),
				imageUrl : "default"
			}
		}
		function h() {
			C.un("manager.screen", h),
			c()
		}
		function v(e, t) {
			e == A.interactionType.click ? t.callback(t) : e == A.interactionType.hold && b.activateContextMenu({
				contextType : "siteException",
				items : [{
						imageUrl : "assets/ic_delete.png",
						name : k.translate(170),
						callback : u.bind(this, t),
						isDelete : !0
					}
				]
			})
		}
		var b,
		E,
		w,
		T,
		y,
		I,
		S,
		x,
		C = e("iris/event"),
		k = e("iris/i18n"),
		A = e("ui/interactionController"),
		N = e("plugins/toaster/index");
		x = {
			init : function (t) {
				b = e("screen/manager"),
				w = t;
				var n = function () {
					return k.translate(292)
				},
				a = {
					container : document.getElementById("exceptions-content-area"),
					interactionHandler : v,
					screen : x,
					scrollContainerId : "settings-exceptions-list",
					listToRowAdapter : r,
					itemComparator : i,
					getEmptyContents : g,
					title : n
				};
				T = e("ui/container/list/list").create(a),
				y = e("plugins/titlebarwithactions/index").createTitleBar({
						parentId : "site-exceptions-title-bar",
						titleText : k.translate(292)
					}),
				p(),
				C.on("application.systemLanguageChange", p),
				C.on("siteException.remove", c)
			},
			becomingVisible : function () {
				C.on("manager.screen", h, [x, "pushed"])
			},
			getActionBar : function () {
				if (!I) {
					var t = T ? T.isEmpty() : 0 === o().length;
					S = {
						action : "Remove All",
						actionHandler : f,
						disabled : t
					},
					I = e("plugins/actionbar/index").makeActionBar(this, [S], "Back", !1)
				}
				return I
			}
		},
		n.exports = x
	}), define("plugins/screens/site_permissions/index", function (e, t, n) {
		function i(t, n) {
			t != f || "popped" != n && "hidden" != n || (d && l.forEach(function (e) {
					void 0 !== e.changed && f.modifyPermission(e.type, e.changed)
				}), s && (e("plugins/toaster/index").dismissToast(s), s = void 0))
		}
		function r(e) {
			l[e].changed = this.checked,
			d = !0
		}
		function a() {
			for (var e = document.querySelectorAll("#site_permissions .settings-content label"), t = 0; e.length > t; ++t)
				e[t].innerText = h.typeToDisplayName(e[t].type)
		}
		var o,
		s,
		c,
		l,
		d,
		u,
		m,
		f,
		p = e("iris/event"),
		g = e("iris/i18n"),
		h = e("iris/permissions"),
		v = e("plugins/woggle/index"),
		b = e("plugins/toaster/index");
		f = {
			init : function () {
				o = e("plugins/titlebarwithactions/index").createTitleBar({
						parentId : "site-permissions-title-bar",
						titleText : "Permissions"
					}),
				p.on("manager.screen", i),
				p.on("application.systemLanguageChange", a)
			},
			setContext : function (e) {
				c = e,
				d = !1,
				o.setTitle(e),
				h.getPermissions(e, f.populate)
			},
			populate : function (e) {
				l = e;
				var t = document.querySelector("#site_permissions .settings-content");
				t.innerHTML = "",
				t.classList.remove("hidden");
				for (var n = 0; e.length > n; n++) {
					var i = "site-permissions-" + e[n].type,
					o = document.createElement("input"),
					s = document.createElement("div"),
					c = document.createElement("div"),
					d = document.createElement("label");
					o.setAttribute("type", "checkbox"),
					o.id = i,
					d.type = e[n].type,
					s.classList.add("settings-row"),
					s.classList.add("row-border-bottom"),
					s.classList.add("padding-size-m"),
					s.tabIndex = 1,
					c.classList.add("settings-toggle"),
					c.appendChild(d),
					c.appendChild(o),
					s.appendChild(c),
					t.appendChild(s),
					v.createToggle(o, o.parentNode.parentNode),
					v.setToggle(o, 1 === e[n].allow),
					o.addEventListener("change", r.bind(o, n))
				}
				a()
			},
			modifyPermission : function (t, n) {
				h.add({
					site : c,
					type : t,
					allow : n ? 1 : 0
				}),
				e("plugins/screens/settings_permissions/index").becomingVisible()
			},
			abortRemoveSite : function () {
				s = void 0,
				document.querySelector("#site_permissions .settings-content").classList.remove("hidden"),
				m.disabled = !1,
				u.updateAction(m)
			},
			removeSite : function () {
				s = void 0,
				h.removeSite(c),
				e("plugins/screens/settings_permissions/index").becomingVisible(),
				e("screen/manager").popScreen(f)
			},
			hideSite : function () {
				s && e("plugins/toaster/index").dismissToast(s),
				document.querySelector("#site_permissions .settings-content").classList.add("hidden"),
				s = b.createFrenchToast(g.translate(275), g.translate(5), f.abortRemoveSite, f.removeSite)
			},
			getActionBar : function () {
				return u || (m = {
						action : "Remove",
						actionHandler : f.hideSite,
						disabled : !1
					}, u = e("plugins/actionbar/index").makeActionBar(this, [m], "Back", !1)),
				u
			},
			becomingVisible : function () {}

		},
		n.exports = f
	}), define("plugins/screens/tab/index", function (e, t, n) {
		function i(e, t) {
			var n = h.get(e);
			if (n && 100 == t && n.url === h.getNewTabUrl()) {
				var i = window.matchMedia("(-blackberry-display-technology: -blackberry-display-oled)").matches ? "121212" : "252525";
				qnx.callExtensionMethod("webview.executeJavaScript", n.webviewId, "document.body.style.backgroundColor = #" + i, "NormalWorld")
			}
		}
		var r,
		a,
		o,
		s,
		c,
		l,
		d,
		u,
		m,
		f,
		p = e("iris/event"),
		g = e("screen/manager"),
		h = e("iris/tabs/controller"),
		v = e("plugins/navigationbar/index"),
		b = e("iris/bookmarks"),
		E = e("plugins/screens/reader/index"),
		w = e("iris/settings"),
		T = e("iris/search"),
		y = e("plugins/securitydialog/index"),
		I = e("iris/i18n"),
		S = e("iris/exec"),
		x = e("plugins/contextmenu/index"),
		C = e("iris/invocation"),
		k = e("ui/utils"),
		A = e("iris/invoke.utils"),
		N = e("iris/utils"),
		L = e("plugins/toaster/index"),
		_ = e("iris/just.type"),
		R = e("plugins/overflowmenu/index"),
		O = e("iris/menu.service"),
		D = e("iris/validation"),
		B = 100,
		M = 15,
		P = [R.items.SHOW_SETTINGS, R.items.SHOW_DOWNLOADS, R.items.SELECT_ITEMS, R.items.SAVE_PAGE, R.items.SITE_INFO, R.items.ADD_TO_HOME_SCREEN, R.items.ADD_BOOKMARK, R.items.READER, R.items.FIND_ON_PAGE, R.items.FORWARD, R.items.RELOAD],
		U = [R.items.SITE_INFO, R.items.FORWARD, R.items.RELOAD],
		F = function (e) {
			var t = g.loadSheet("edit_bookmark");
			t.setContext(e),
			g.pushScreen(t)
		},
		H = function (e, t) {
			if (o !== e) {
				var n = t ? "opacity-zero" : "hidden",
				i = t ? "view-unloaded" : "hidden";
				if (s && g.popView(s, i, !t), e) {
					var r = g.loadView(e, document.querySelector("#tab .page"), f, n);
					g.pushView(r),
					s = r
				} else
					s = void 0;
				o = e,
				o === f.viewTypes.NEW_TAB_PAGE ? _.type(document.getElementById("urlfield")) : _.untype(document.getElementById("urlfield"))
			}
		},
		V = function (e, t, n) {
			(t.selected || t.url) && (n.url === h.getNewTabUrl() ? H(f.viewTypes.NEW_TAB_PAGE, !0) : n.selected && n.url && H(f.viewTypes.TAB, t.url))
		},
		W = function (e) {
			D.isValidUrl(e) && "about:blank" !== e ? c.enableItem(R.items.ADD_BOOKMARK) : c.disableItem(R.items.ADD_BOOKMARK)
		};
		f = {
			viewTypes : {
				NEW_TAB_PAGE : "new_tab_page",
				TAB : ""
			},
			init : function () {
				p.on("PropertyCurrentContextEvent", f.contextEventHandler),
				p.on("ContextMenuRequestEvent", f.contextMenuRequestEventHandler),
				p.on("ContextMenuCancelEvent", f.contextMenuCancelEventHandler),
				p.on("ContextMenuCallback", f.contextMenuCallbackHandler),
				p.on("ContextMenuCallbacksSupported", f.contextMenuCallbacksSupportedHandler),
				p.on("Focus", f.focusEventHandler),
				p.on("tabs.updated", V),
				p.on("webpage.load.progress", i),
				p.on("manager.screen", function () {
					o === f.viewTypes.NEW_TAB_PAGE && _.type(document.getElementById("urlfield"))
				}, [f, "uncovered"]),
				p.on("manager.screen", function () {
					o === f.viewTypes.NEW_TAB_PAGE && _.untype(document.getElementById("urlfield"))
				}, [f, "becomingHidden"]),
				o = f.viewTypes.TAB
			},
			loadNewTabPage : function () {
				H(f.viewTypes.NEW_TAB_PAGE, !1)
			},
			setup : function () {
				g.setHomeScreen(g.loadScreen("tab", g.offscreenLocation.ONSCREEN))
			},
			preventPeek : function () {
				return !0
			},
			showOverflowMenu : function () {
				var t = h.getSelected();
				if (L.dismissToast(u), u = void 0, o !== f.viewTypes.TAB)
					return l || (l = R.create(P, f), P.forEach(function (e) {
							e !== R.items.SHOW_SETTINGS && e !== R.items.SHOW_DOWNLOADS && e !== R.items.SELECT_ITEMS && l.disableItem(e)
						})), t.historyCanNavigateForward() ? l.enableItem(R.items.FORWARD) : l.disableItem(R.items.FORWARD), w.getValue(w.ENABLE_PRIVATE_BROWSING) ? l.disableItem(R.items.SELECT_ITEMS) : l.enableItem(R.items.SELECT_ITEMS), l.show(), void 0;
				if (c || (c = R.create("Restricted" === iris.chromeMode() ? U : P, f), c.removeItem(R.items.SELECT_ITEMS)), t.historyCanNavigateForward() ? c.enableItem(R.items.FORWARD) : c.disableItem(R.items.FORWARD), !D.isValidUrl(t.url) || 0 !== t.url.indexOf("http") && 0 !== t.url.indexOf("ftp") && 0 !== t.url.indexOf("rtsp") && 0 !== t.url.indexOf("websearch") ? c.disableItem(R.items.ADD_TO_HOME_SCREEN) : c.enableItem(R.items.ADD_TO_HOME_SCREEN), W(t.url), "Restricted" === iris.chromeMode())
					return c.show(), void 0;
				var n = !1;
				p.once("screen.menu.hiding", function () {
					n = !0
				}, [c]),
				b.get(t.url, function (e) {
					n || (e && c.contains(R.items.ADD_BOOKMARK) ? (c.insertBefore(R.items.EDIT_BOOKMARK, R.items.ADD_BOOKMARK), c.removeItem(R.items.ADD_BOOKMARK)) : !e && c.contains(R.items.EDIT_BOOKMARK) && (c.insertBefore(R.items.ADD_BOOKMARK, R.items.EDIT_BOOKMARK), c.removeItem(R.items.EDIT_BOOKMARK), W(t.url)))
				}),
				e("iris/search").getDescriptorUrls(t, function (e) {
					n || (e.length && !c.contains(R.items.ADD_SEARCH) ? c.insertBefore(R.items.ADD_SEARCH, R.items.SITE_INFO) : !e.length && c.contains(R.items.ADD_SEARCH) && c.removeItem(R.items.ADD_SEARCH))
				});
				var i = [];
				e("iris/invoke.utils").addMenuItems(i, t.url, t.getTitle(), !1),
				i.forEach(function (t) {
					e("iris/menu.service").getMenuItems(t.invokeQuery, function (t, i) {
						if (i || !Array.isArray(t.items) || n)
							i && console.error("Menu Service error: " + JSON.stringify(i));
						else {
							var r = t.items;
							r.forEach(function (n) {
								var i = {
									name : n.action,
									text : function () {
										return n.label
									},
									icon : "file://" + n.icon,
									action : function () {
										e("iris/invoke.utils").invokePlatformMenuItem(n.action, n.invoke, t["inherited-target"])
									}
								};
								c.insertBefore(i, void 0),
								p.once("screen.menu.hidden", c.removeItem.bind(c, i), [c])
							})
						}
					})
				}),
				c.show()
			},
			getActionBar : function () {
				var e = {};
				return e.insertInto = function () {},
				e.removeFrom = function () {},
				e.incrementZindex = function () {},
				e.decrementZindex = function () {},
				e.setZIndex = function () {},
				e.animateBelow = v.blendOutButtons,
				e.setPosition = function () {},
				e.resetPosition = function () {},
				e.animateOut = function () {
					throw Error("browser screen's action bar should not animate out")
				},
				e.animateIn = v.blendInButtons,
				e.updateActionBar = function (e) {
					document.getElementById("navigationbar").style.opacity = e ? "0.5" : ""
				},
				e.redirect = function (e, t) {
					k.redirect(document.getElementById("navigationbar"), e, t)
				},
				e.clearRedirect = function (e, t) {
					k.clearRedirect(document.getElementById("navigationbar"), e, t)
				},
				e.setOverlayOpacity = function (e, t, n) {
					var i = document.getElementById("navbarOverlay");
					i.style.webkitTransition = e ? "opacity " + (n || 0) + "ms ease-out" : "none",
					i.style.opacity = t
				},
				e.enableFocus = function (e) {
					document.getElementById("showtabscontainer").tabIndex = e ? 1 : -1;
					var t = document.getElementById("back");
					t.tabIndex = e && !t.classList.contains("cant-go-back") ? 1 : -1,
					document.getElementById("urlfield").tabIndex = e ? 1 : -1,
					document.getElementById("contracturl").tabIndex = e ? 1 : -1,
					document.getElementById("overflowmenu").tabIndex = e ? 1 : -1
				},
				e
			},
			showReader : function () {
				if (o === f.viewTypes.TAB) {
					var e = g.loadScreen("reader");
					g.pushScreen(e)
				}
			},
			showSecurityInfo : function () {
				y.showSecurityDialog(h.getSelected())
			},
			addBookmark : function (t, n, i) {
				w.getValue(w.ENABLE_PRIVATE_BROWSING) ? e("plugins/dialogs/index").show(e("plugins/dialogs/index").buildConfirm(h.getSelected().id, t, function () {
						return I.translate(300)
					}, f.addBookmarkInternal.bind(f, n, i), void 0)) : f.addBookmarkInternal(n, i)
			},
			addBookmarkInternal : function (e, t) {
				u = b.addWithToast({
						title : e,
						url : t
					})
			},
			addHomescreenBookmark : function () {
				var e = g.loadSheet("add_bookmark_homescreen"),
				t = "(function(){var icons = [JSON.stringify({defaultPath: location.protocol + '//' + location.hostname + '/apple-touch-icon.png'})];var linktags = document.getElementsByTagName('link');if (!linktags) return icons;for (var i = 0; i < linktags.length; i++) {if (linktags[i].rel.toLowerCase() == 'apple-touch-icon')icons.push(JSON.stringify({iconUrl: linktags[i].href, sizes: linktags[i].sizes}));else if (linktags[i].rel.toLowerCase() == 'apple-touch-icon-precomposed')icons.push(JSON.stringify({iconUrl: linktags[i].href, sizes: linktags[i].sizes}));}return icons;}());",
				n = h.getSelected();
				S.executeJavaScript(n.webviewId, t, e.displayIcon, !0),
				e.setContext({
					parentId : 0,
					title : n.getTitle(),
					url : n.url
				}),
				g.pushScreen(e)
			},
			findOnPage : function () {
				if (o === f.viewTypes.TAB) {
					var t = h.getSelected();
					e("plugins/find_on_page/index").show(t.id, t.webviewId, function () {
						h.reposition(h.getSelected().id)
					})
				}
			},
			showSettings : function () {
				g.pushScreen(g.loadScreen("settings"))
			},
			showDownloads : function () {
				g.pushScreen(g.loadScreen("downloads_panel"))
			},
			contextEventHandler : function (e, t) {
				x.isMenuVisible() || (r = JSON.parse(t))
			},
			contextMenuRequestEventHandler : function (e, t) {
				if (e === iris.chromeId) {
					var n = document.activeElement;
					if ("INPUT" !== n.tagName || "text" !== n.type && "search" !== n.type && "url" !== n.type)
						return qnx.callExtensionMethod("webview.notifyContextMenuCancelled", iris.chromeId), void 0
				}
				m = !1,
				a = e,
				x.setCurrentWebViewId(e);
				var i = JSON.parse(t),
				o = "MenuKey" === i.contextMenuSource;
				L.dismissToast(u),
				u = void 0,
				r && r.url ? b.get(r.url, function (e) {
					f.generateContextMenuItems(i.menuItems, o, e)
				}) : f.generateContextMenuItems(i.menuItems, o)
			},
			contextMenuCancelEventHandler : function (e, t, n) {
				if (t = JSON.parse(t), x.getCurrentWebViewId() === e) {
					if (x.getCurrentWebViewId() === iris.chromeId && "TouchEnd" === t.reason || document.activeElement === document.getElementById("urlfield") && "SelectionHandleMove" === t.reason)
						return n.setPreventDefault = !0, void 0;
					m = !0,
					g.deactivateContextMenu(t.type)
				}
			},
			contextMenuCallbackHandler : function (e, t) {
				switch (t = JSON.parse(t), t.menuItem) {
				case "ShareText":
					f.contextMenuShare(e, t.selectedText);
					break;
				case "Search":
					f.contextMenuSearch(t.selectedText);
					break;
				case "PasteWithLock":
					f.contextMenuPasteProhibited();
					break;
				default:
					return
				}
			},
			contextMenuCallbacksSupportedHandler : function (t, n, i) {
				if (n = JSON.parse(n), e("plugins/tabbar/index").isShowing() || e("iris/peek").isPeeking())
					return i.setPreventDefault = !0, void 0;
				if (t === iris.chromeId) {
					var r = n.availableMenuItems.indexOf("Search");
					r >= 0 && n.availableMenuItems.splice(r, 1)
				}
				i.setSupportedItems = n.availableMenuItems
			},
			focusEventHandler : function (e, t) {
				t = JSON.parse(t),
				qnx.callExtensionMethod(t.isFocused ? "webview.createTouchInputSession" : "webview.destroyTouchInputSession", e),
				e !== iris.chromeId && t.isFocused && (x.isMenuVisible() ? e !== x.getCurrentWebViewId() && t.isFocused && g.deactivateContextMenu() : R.hideMenu())
			},
			contextMenuResponseHandler : function (e) {
				e && qnx.callExtensionMethod("webview.handleContextMenuResponse", a, e)
			},
			contextMenuOpenLink : function () {
				r && r.url && (E.isOpen() && g.popScreen(E), h.update(h.getCurrentTabId(), {
						url : r.url
					}))
			},
			contextMenuOpenLinkNewTab : function () {
				if (r && r.url) {
					var e = !w.getValue(w.OPEN_NEW_TAB_LINKS_BACKGROUND);
					h.create({
						selected : e,
						url : r.url
					}),
					f.contextMenuResponseHandler("Cancel")
				}
			},
			contextMenuSearch : function (e) {
				if (e) {
					var t = T.getCurrentSearchQuery(e);
					t && (h.create({
							selected : !0,
							url : t
						}), f.contextMenuResponseHandler("Cancel"), E.isOpen() && g.popScreen(E), v.urlFocusOut())
				}
			},
			contextMenuShare : function (e, t) {
				if (t && 0 !== t.length) {
					var n = {
						action : C.InvokeAction.SHARE,
						mime : "text/plain",
						data : N.base64Encode(t)
					};
					O.getMenuItems(n, function (e, t) {
						if (!t && Array.isArray(e.items)) {
							if (e.items.length > 1)
								return;
							var n = e.items[0];
							A.invokePlatformMenuItem(n.action, n.invoke, e["inherited-target"])
						}
					})
				}
			},
			editBookmark : function () {
				b.get(h.getSelected().url, function (e) {
					e && F(e)
				})
			},
			editBookmarkFromLink : function (e) {
				f.contextMenuResponseHandler("Cancel"),
				x.hideContextMenu(),
				F(e)
			},
			addBookmarkFromLink : function () {
				if (r && r.url) {
					var e = r.text ? r.text : r.url;
					f.addBookmark(function () {
						return I.translate(301)
					}, e, r.url),
					f.contextMenuResponseHandler("Cancel")
				}
			},
			contextMenuPasteProhibited : function () {
				L.createBasicToast(I.translate(302))
			},
			generateContextMenuItems : function (e, t, n) {
				if (m)
					return m = !1, void 0;
				var i = {},
				a = [],
				o = 0;
				if ("Normal" === iris.chromeMode())
					for (o = 0; e.length > o; o++)
						switch (e[o]) {
						case "ClearField":
						case "SendLink":
						case "SendImageLink":
						case "FullMenu":
						case "Delete":
							break;
						case "Select":
							a.push({
								name : I.translate(303),
								callback : f.contextMenuResponseHandler.bind(this, "Select"),
								imageUrl : "assets/ic_select_text.png"
							});
							break;
						case "Cancel":
							a.push({
								name : I.translate(304),
								callback : f.contextMenuResponseHandler.bind(this, "Cancel"),
								imageUrl : "assets/ic_cancel_selection.png",
								isDelete : !0
							});
							break;
						case "Cut":
							a.push({
								name : I.translate(305),
								callback : f.contextMenuResponseHandler.bind(this, "Cut"),
								imageUrl : "assets/ic_cut.png"
							});
							break;
						case "Copy":
							a.push({
								name : I.translate(306),
								callback : f.contextMenuResponseHandler.bind(this, "Copy"),
								imageUrl : "assets/ic_copy.png"
							});
							break;
						case "Paste":
							a.push({
								name : I.translate(307),
								callback : f.contextMenuResponseHandler.bind(this, "Paste"),
								imageUrl : "assets/ic_paste.png"
							});
							break;
						case "PasteWithLock":
							a.push({
								name : I.translate(307),
								callback : f.contextMenuPasteProhibited,
								imageUrl : "assets/ic_paste_blocked.png"
							});
							break;
						case "PasteGreyedOut":
							a.push({
								name : I.translate(307),
								isDisabled : !0,
								imageUrl : "assets/ic_paste.png"
							});
							break;
						case "SelectAll":
							a.push({
								name : I.translate(126),
								callback : f.contextMenuResponseHandler.bind(this, "SelectAll"),
								imageUrl : "assets/ic_select_all_text.png"
							});
							break;
						case "OpenLinkInNewTab":
							a.push({
								name : I.translate(308),
								callback : f.contextMenuOpenLinkNewTab,
								imageUrl : "assets/ic_open_link_new_tab.png"
							});
							break;
						case "AddLinkToBookmarks":
							n ? a.push({
								name : I.translate(121),
								callback : f.editBookmarkFromLink.bind(this, n),
								imageUrl : "assets/ic_edit_bookmarks.png"
							}) : a.push({
								name : I.translate(301),
								callback : f.addBookmarkFromLink,
								imageUrl : "assets/ic_bookmark_link.png"
							});
							break;
						case "CopyLink":
							a.push({
								name : I.translate(309),
								callback : f.contextMenuResponseHandler.bind(this, "CopyLink"),
								imageUrl : "assets/ic_copy_link.png"
							});
							break;
						case "OpenLink":
							a.push({
								name : I.translate(3),
								callback : f.contextMenuOpenLink,
								imageUrl : "assets/ic_open_link.png"
							});
							break;
						case "SaveLinkAs":
							a.push({
								name : I.translate(310),
								callback : f.contextMenuResponseHandler.bind(this, "SaveLinkAs"),
								imageUrl : "assets/ic_save_link.png"
							});
							break;
						case "SaveImage":
							a.push({
								name : I.translate(311),
								callback : f.contextMenuResponseHandler.bind(this, "SaveImage"),
								imageUrl : "assets/ic_save_image.png"
							});
							break;
						case "CopyImageLink":
							a.push({
								name : I.translate(312),
								callback : f.contextMenuResponseHandler.bind(this, "CopyImageLink"),
								imageUrl : "assets/ic_copy_link_image.png"
							});
							break;
						case "ViewImage":
							a.push({
								name : I.translate(313),
								callback : f.contextMenuResponseHandler.bind(this, "ViewImage"),
								imageUrl : "assets/ic_view_image.png"
							});
							break;
						case "InspectElement":
							a.push({
								name : I.translate(314),
								callback : f.contextMenuResponseHandler.bind(this, "InspectElement"),
								imageUrl : "assets/ic_code_inspector.png"
							})
						}
				else if ("Restricted" === iris.chromeMode())
					for (o = 0; e.length > o; o++)
						switch (e[o]) {
						case "Select":
							a.push({
								name : I.translate(303),
								callback : f.contextMenuResponseHandler.bind(this, "Select"),
								imageUrl : "assets/ic_select_text.png"
							});
							break;
						case "Cancel":
							a.push({
								name : I.translate(304),
								callback : f.contextMenuResponseHandler.bind(this, "Cancel"),
								imageUrl : "assets/ic_cancel_selection.png",
								isDelete : !0
							});
							break;
						case "Cut":
							a.push({
								name : I.translate(305),
								callback : f.contextMenuResponseHandler.bind(this, "Cut"),
								imageUrl : "assets/ic_cut.png"
							});
							break;
						case "Copy":
							a.push({
								name : I.translate(306),
								callback : f.contextMenuResponseHandler.bind(this, "Copy"),
								imageUrl : "assets/ic_copy.png"
							});
							break;
						case "Paste":
							a.push({
								name : I.translate(307),
								callback : f.contextMenuResponseHandler.bind(this, "Paste"),
								imageUrl : "assets/ic_paste.png"
							});
							break;
						case "PasteWithLock":
							a.push({
								name : I.translate(307),
								callback : f.contextMenuPasteProhibited,
								imageUrl : "assets/ic_paste_blocked.png"
							});
							break;
						case "SelectAll":
							a.push({
								name : I.translate(126),
								callback : f.contextMenuResponseHandler.bind(this, "SelectAll"),
								imageUrl : "assets/ic_select_all_text.png"
							});
							break;
						default:
						}
				if (r) {
					x.getCurrentWebViewId() === iris.chromeId && (r.text = "" + window.getSelection());
					var s = I.translate(315),
					c = "";
					if (r.url ? (r.text && (s = r.text), c = r.url) : r.text ? c = r.text : r.isImage && (c = r.alt ? r.alt : r.src ? r.src : I.translate(316)), r.url)
						A.addMenuItems(a, r.url, r.text);
					else if (r.isImage && r.src)
						A.addMenuItems(a, r.src);
					else if (r.text) {
						var l = {
							action : C.InvokeAction.SHARE,
							mime : "text/plain",
							data : N.base64Encode(r.text)
						};
						a.push({
							invokeQuery : l
						})
					}
					var d = function (e) {
						var t = [];
						return e.isImage ? t.push("image") : e.isInput ? t.push("input") : e.isVideo ? t.push("video") : e.isAudio && t.push("audio"),
						e.url ? t.push("url") : e.text && t.push("text"),
						t.join(" ")
					};
					i.headText = s,
					i.subheadText = c,
					i.contextType = d(r)
				}
				i.items = a,
				i && g.activateContextMenu(i, t)
			},
			xPosition : function (t) {
				return e("plugins/tabbar/index").visibleWidth(t)
			},
			yPosition : function () {
				return 0
			},
			currentView : function () {
				return s
			},
			currentViewType : function () {
				return o
			},
			resizeFadeColorWindow : function (e, t) {
				qnx.callExtensionMethod("webview.setFadeColorWindowRect", iris.chromeId, f.xPosition(e), f.yPosition(), e, t)
			},
			fadeColorWindowHandle : function () {
				return d || (d = parseInt(qnx.callExtensionMethod("webview.createFadeColorWindow", iris.chromeId, 0, 0, screen.width, screen.height, M), 10)),
				d
			},
			fadeColorWindowMaxAlpha : function () {
				return B
			},
			suppressEventsToTabs : function () {
				qnx.callExtensionMethod("webview.setSensitivity", iris.chromeId, "SensitivityAlways")
			},
			releaseEventsToTabs : function () {
				qnx.callExtensionMethod("webview.setSensitivity", iris.chromeId, "SensitivityTest")
			},
			isShowingNewTabPage : function () {
				return g.currentScreen() === f && h.getSelected() && h.getSelected().webpage && h.getSelected().webpage.getUrl() === h.newTabUrl()
			}
		},
		p.on("browser.init.tier1", f.setup),
		n.exports = f
	}), define("plugins/screens/tagged_bookmarks/index", function (e, t, n) {
		function i() {
			l(p.loadUrlsInNewTabs)
		}
		var r,
		a,
		o,
		s,
		c,
		l,
		d,
		u,
		m = e("plugins/titlebarwithactions/index"),
		f = e("iris/event"),
		p = e("iris/utils");
		u = {
			init : function (t) {
				d = e("screen/manager"),
				o = m.createTitleBar({
						parentId : "tagged_bookmarks_titleBar"
					}),
				a = t.getElementsByClassName("viewArea")[0],
				f.on("iris.bookmarks.update", function (e, t) {
					r && c && t.tags && -1 === t.tags.indexOf(c) && r.getListBuilder().remove([e])
				})
			},
			becomingVisible : function () {
				if (!c)
					throw Error("tagged_bookmarks_screen screen is becoming visible without any context!");
				r.becomingVisible()
			},
			getActionBar : function () {
				return s || (s = e("plugins/actionbar/index").makeActionBar(this, [{
									action : "Open All",
									actionHandler : i
								}
							], "Back", !1)),
				s
			},
			setContext : function (t) {
				if (!r) {
					var n = e("screen/manager");
					r = n.loadView("bookmark_list", a, u, "onScreen")
				}
				c != t && (c = t, o.setTitle(c), l = e("iris/storage").getBookmarksWithTag.bind(this, c), r.setDataSource(l))
			},
			getCurrentView : function () {
				return r
			}
		},
		n.exports = u
	}), define("plugins/searchbar/index", function (e, t, n) {
		function i(e, t, n, i) {
			function p() {
				y.placeholder = a.translate(317),
				I.innerText = a.translate(43)
			}
			function g(e, t) {
				e === n && ("popped" === t || "hidden" === t && !l.currentScreen().isSheet) && x.cleanUp()
			}
			function h() {
				var e = y.value.replace(/%+/g, " ");
				e = "%" + e + "%",
				e = e.replace(/\s+/g, "%"),
				C !== e && (C = e, t(e))
			}
			function v() {
				T.classList.contains("offscreenTop") && x.show(),
				S = setInterval(h, 250)
			}
			function b() {
				clearInterval(S)
			}
			function E(e) {
				13 === parseInt(e.keyCode, 10) && document.activeElement.blur()
			}
			function w() {
				T = document.getElementById(e),
				T.className = "searchBar offscreenTop base-background";
				var t = document.createElement("div");
				t.className = "titlebar",
				T.appendChild(t);
				var n = document.createElement("div");
				n.className = "searchInputContainer horizontal-padding-size-m",
				t.appendChild(n),
				y = document.createElement("input"),
				y.className = "searchInput",
				y.type = "search",
				y.addEventListener("focus", v),
				y.addEventListener("blur", b),
				y.addEventListener("keyup", E),
				n.appendChild(y);
				var i = document.createElement("div");
				i.className = "button cancel-button horizontal-padding-size-m",
				i.tabIndex = 1,
				i.setAttribute("role", "button"),
				I = document.createElement("div"),
				I.className = "button-text-content accent-colour-highlight font-size-s",
				I.innerText = a.translate(43),
				i.appendChild(I);
				var r = document.createElement("div");
				r.className = "inverted-background button-overlay",
				i.appendChild(r);
				var o = function () {
					d.isPeeking() || x.cleanUp()
				},
				s = m.create({
						hoverInClass : "titlebar-button-pressed-overlay",
						hoverTargetElement : i,
						hoverStyleElement : r,
						onHoverTargetClick : o,
						onHoverTargetTouchEnd : o
					});
				u.register(s),
				t.appendChild(i),
				p(),
				c.on("application.systemLanguageChange", p),
				c.on("manager.screen", g)
			}
			var T,
			y,
			I,
			S,
			x = this,
			C = "%%";
			x.cleanUp = function () {
				T.classList.contains("offscreenTop") || (x.hide(), y.value = "", h())
			},
			w(),
			x.show = function () {
				r = x,
				s.transitionWithTimeout(T, function () {
					o.forceLayout(T),
					o.appendAnimation(function () {
						T.classList.remove("offscreenTop")
					}),
					o.animate()
				}, f, function () {
					y.focus()
				})
			},
			x.hide = function () {
				r = void 0,
				i(),
				y.blur(),
				s.transitionWithTimeout(T, function () {
					o.appendAnimation(function () {
						T.classList.add("offscreenTop")
					}),
					o.animate()
				}, f, function () {})
			},
			x.clearInput = function () {
				y.value = "",
				C = "%%"
			},
			x.getSearchBarElement = function () {
				return T
			},
			x.getSearchBarInputElement = function () {
				return y
			},
			x.getPlainSearchText = function () {
				return y.value
			},
			x.getSearchText = function () {
				return C
			},
			x.setSearchText = function (e) {
				y.value = e,
				h()
			},
			x.isSearchEmpty = function () {
				return 0 === y.value.length
			}
		}
		var r,
		a = e("iris/i18n"),
		o = e("screen/animationCoordinator"),
		s = e("ui/utils"),
		c = e("iris/event"),
		l = e("screen/manager"),
		d = e("iris/peek"),
		u = e("ui/hover/hoverController"),
		m = e("ui/hover/hoverHandlerFactory"),
		f = 300,
		p = {
			create : function (e, t, n, r) {
				return new i(e, t, n, r)
			},
			getCurrentVisibleSearchBar : function () {
				return r
			}
		};
		n.exports = p
	}), define("plugins/searchresults/index", function (e, t, n) {
		function i(e) {
			var t,
			n = document.getElementById("search-provider-list"),
			i = document.getElementById("search-result-list"),
			r = document.getElementById("search-dropdown-arrow"),
			a = R.getAll();
			if (n && i)
				if (e) {
					if (!a.length)
						return;
					if (V) {
						S.replaceItems(a);
						var o = R.getCurrentProvider();
						if (o) {
							var s = S.getRowClassList(o);
							s && s.add("search-provider-selected")
						}
						V = !1;
						var c = S.getElements();
						c[c.length - 1].id = "provider-" + W++,
						c[c.length - 1].style.navDown = "#" + c[c.length - 1].id
					}
					n.classList.add("show-search-providers"),
					t = n.clientHeight,
					i.style.webkitTransform = "translateY(-" + t + "px)",
					t = n.clientHeight;
					var l = F.getTiming(F.SEARCH_PROVIDER_LIST_OPEN);
					i.style.webkitTransitionDuration = l + "ms",
					i.style.webkitTransitionTimingFunction = F.getCurve(),
					i.classList.add("animate-search-results"),
					U.transitionWithTimeout(i, function () {
						i.style.webkitTransform = ""
					}, l + 150, function () {
						i.style.webkitTransitionDuration = "",
						i.classList.remove("animate-search-results")
					}),
					r.classList.add("dropdown-rotate")
				} else {
					t = n.clientHeight,
					i.classList.add("animate-search-results");
					var d = F.getTiming(F.SEARCH_PROVIDER_LIST_CLOSE);
					if (i.style.webkitTransitionDuration = d + "ms", i.style.webkitTransitionTimingFunction = F.getCurve(), U.transitionWithTimeout(i, function () {
							i.style.webkitTransform = "translateY(-" + t + "px)"
						}, d + 150, function () {
							i.style.webkitTransitionDuration = "",
							i.classList.remove("animate-search-results"),
							i.style.webkitTransform = "",
							n.scrollTop = 0,
							n.classList.remove("show-search-providers")
						}), r.classList.remove("dropdown-rotate"), k.isShowing()) {
						var u = document.getElementById("urlfield");
						u.setSelectionRange(u.value.length, u.value.length)
					}
				}
		}
		function r() {
			var e = document.getElementById("search-provider-list");
			i(!e.classList.contains("show-search-providers"))
		}
		function a() {
			var e = R.getCurrentProvider(),
			t = document.getElementById("search-for-row");
			e ? (t.getElementsByClassName("search-icon")[1].style.backgroundImage = e.iconUrl ? "url(" + e.iconUrl + ")" : "", t.classList.remove("hidden")) : (t.classList.add("hidden"), i(!0))
		}
		function o(e) {
			if (e[1].length) {
				var t = [],
				n = e[1].indexOf(e[0]);
				-1 === n || B.resolveTLDURL(e[1][n]) || e[1].splice(n, 1);
				for (var i = 0; q > i && e[1].length > i; ++i)
					(!x || 0 > x.indexOf(e[1][i])) && t.push({
						title : e[1][i],
						url : B.resolveTLDURL(e[1][i]),
						suggested : !0
					});
				I.appendItems(t)
			}
		}
		function s() {
			C ? 4 === C.readyState ? (200 === C.status && C.responseText && o(JSON.parse(C.responseText)), I.enableEmptyContents(!0), C = void 0) : C.onreadystatechange || (C.onreadystatechange = s) : I.enableEmptyContents(!0)
		}
		function c(e) {
			var t;
			M.hasPhysicalKeyboard() && (t = B.resolveURL(H, !0)),
			!t && H.length > 3 && B.browserType() !== B.browserTypes.PERSONAL && !z.test(H) && (t = "http://" + H + "/"),
			t && t !== H ? (x = t, e.splice(0, 0, {
					title : t,
					url : t,
					suggested : !0,
					resultType : K.typed
				})) : x = void 0,
			I.replaceItems(e),
			s()
		}
		function l() {
			if (H) {
				I.isEmpty() || I.enableEmptyContents(!1);
				var e = {
					searchText : H,
					noTitle : A
				};
				4 > H.length ? D.getWeightedURLs(e, c) : D.getURLs(e, c);
				var t = R.getCurrentProvider();
				t && t.suggestTemplate && O.getValue(O.ENABLE_SEARCH_SUGGESTIONS) && G >= H.length && !O.getValue(O.ENABLE_PRIVATE_BROWSING) && (C && C.abort(), C = new XMLHttpRequest, C.open("GET", R.getSearchUrl(t.suggestTemplate, H)), C.send())
			}
		}
		function d(e, t) {
			if (e === N.interactionType.click || e === N.interactionType.holdRelease) {
				var n = t.url || R.getCurrentSearchQuery(t.title) || t.title,
				i = I.getItems().indexOf(t) + 1;
				_.emit("searchresults.select", [n, H, t.resultType, i]),
				k.setShowing(!1);
				var r;
				t.resultType === K.bookmark ? r = P.TRANSITIONS.BOOKMARK : t.resultType === K.history ? r = P.TRANSITIONS.HISTORY : t.resultType === P.TRANSITIONS.TYPED && (r = P.TRANSITIONS.TYPED),
				B.loadUrlInCurrentTab(n, r);
				var a = R.getCurrentProvider();
				t.resultType === K.autoSuggest && _.emit("webSearch", [a.shortName, t.title]),
				_.emit("interaction.controller.clear.selection", [t])
			}
		}
		function u(e) {
			return e.bookmarkTitle && (e.bookmarkTitle.search(H) >= 0 || e.url.search(H) >= 0 || e.bookmarktags && e.bookmarktags.search(H) >= 0) ? K.bookmark : e.suggested ? e.url ? K.url : K.autoSuggest : K.history
		}
		function m(e) {
			var t,
			n,
			i = e.title || L.translate(58),
			r = H.replace(/([\.\\\+\*\?\[\^\]\$\(\)\|\{\}])/g, "\\$1"),
			a = "list-horizontal-padding";
			switch (e.suggested || (n = e.url, e.bookmarktags && e.bookmarktags.indexOf(r) >= 0 && 0 > i.indexOf(r) && 0 > e.url.indexOf(r) && (n = e.bookmarktags)), e.resultType || (e.resultType = u(e)), e.resultType) {
			case K.bookmark:
				t = "assets/ic_bookmarks.png",
				i = e.bookmarkTitle;
				break;
			case K.typed:
			case K.url:
				a += " reversible",
				t = "assets/ic_go_to.png";
				break;
			case K.autoSuggest:
				t = "assets/ic_search.png";
				break;
			default:
				t = "assets/ic_history.png"
			}
			return {
				title : i,
				description : n,
				imageUrl : t,
				matchText : r,
				listItemIconClass : a
			}
		}
		function f(e, t) {
			return e.url === t.url && e.title === t.title && e.resultType === t.resultType && e.suggested === t.suggested && e.suggestedUrl === t.suggestedUrl
		}
		function p(e, t) {
			var n = document.getElementById("search-provider-list");
			if (n && n.classList.contains("showing")) {
				var i = S.getRowClassList(t);
				i && i.remove("search-provider-selected"),
				i = S.getRowClassList(e),
				i && i.add("search-provider-selected")
			} else
				V = !0
		}
		function g(e) {
			var t,
			n = R.getCurrentProvider();
			if (e === n) {
				var i = R.getAll(),
				r = i.some(function (t) {
						return t === e ? !1 : (R.setCurrentProvider(t), !0)
					});
				r || R.setCurrentProvider(),
				a(),
				l(),
				t = function () {
					R.setCurrentProvider(n),
					a(),
					l()
				}
			}
			S.animateDelete([e], L.translate(318), function (e) {
				e.forEach(R.remove)
			}, t)
		}
		function h(t, n, i) {
			switch (t) {
			case N.interactionType.click:
				i.stopPropagation(),
				R.setCurrentProvider(n),
				a(),
				r(),
				l(),
				_.emit("interaction.controller.clear.selection", [n]);
				break;
			case N.interactionType.hold:
				var o = {
					contextType : "searchProvider",
					items : [{
							imageUrl : "assets/ic_delete.png",
							name : L.translate(170),
							callback : g.bind(k, n),
							isDelete : !0
						}
					]
				};
				e("screen/manager").activateContextMenu(o)
			}
		}
		function v(e) {
			var t = R.getCurrentProvider();
			return {
				title : e.shortName,
				imageUrl : e.iconUrl ? e.iconUrl : "assets/ic_search.png",
				listItemIconClass : "list-horizontal-padding",
				a11yItemRole : "option",
				itemAttributes : [{
						name : "aria-selected",
						value : t === e
					}
				]
			}
		}
		function b(e, t) {
			return e.descriptorUrl === t.descriptorUrl
		}
		function E() {
			var e = R.getCurrentProvider();
			if (e) {
				var t = R.getCurrentSearchQuery(H);
				_.emit("searchresults.select", [t, H, K.search, 0]),
				B.loadUrlInCurrentTab(t),
				_.emit("webSearch", [e.shortName, H], !0),
				k.setShowing(!1)
			}
		}
		function w() {
			A = L.translate(58),
			l(),
			document.getElementById("drop-down-container").setAttribute("aria-label", L.translate(319)),
			document.getElementById("search-icon").setAttribute("aria-label", L.translate(317))
		}
		function T() {
			return {
				message : L.translate(102)
			}
		}
		var y,
		I,
		S,
		x,
		C,
		k,
		A,
		N = e("ui/interactionController"),
		L = e("iris/i18n"),
		_ = e("iris/event"),
		R = e("iris/search"),
		O = e("iris/settings"),
		D = e("iris/storage"),
		B = e("iris/utils"),
		M = e("iris/device"),
		P = e("iris/history"),
		U = e("ui/utils"),
		F = e("ui/animationTimings"),
		H = "",
		V = !0,
		W = 0,
		q = 3,
		G = 50,
		K = {
			history : "history",
			bookmark : "bookmark",
			url : "url",
			autoSuggest : "autoSuggest",
			search : "search",
			suggestedUrl : "suggestedUrl",
			typed : "typed"
		},
		z = /[\s.:\/%&?=+]/;
		k = {
			update : function (e) {
				e !== H && (H = e, e ? (k.setShowing(!0), document.getElementById("search-for-row").getElementsByTagName("q")[0].innerText = e, l()) : (I.enableEmptyContents(!1), k.setShowing(!1)))
			},
			setShowing : function (t) {
				if (y && y.classList.contains("hidden") === t)
					if (t) {
						if (_.emit("searchresults.show", [], !0), y.classList.remove("hidden"), !I && !S) {
							var n = function () {
								return L.translate(319)
							},
							r = {
								container : document.getElementById("search-lists-area"),
								scrollContainerId : "search-provider-list",
								scrollContainerClassName : "background",
								interactionHandler : h,
								listToRowAdapter : v,
								itemComparator : b,
								title : n,
								useTitleAsA11yLabel : !0,
								noDefaultFocus : !0,
								a11yRole : "listbox"
							};
							S = e("ui/container/list/list").create(r);
							var o = function () {
								return L.translate(320)
							},
							s = {
								container : document.getElementById("search-lists-area"),
								scrollContainerId : "search-result-list",
								scrollContainerClassName : "background",
								interactionHandler : d,
								listToRowAdapter : m,
								itemComparator : f,
								getEmptyContents : T,
								useTitleAsA11yLabel : !0,
								noDefaultFocus : !0,
								title : o
							};
							I = e("ui/container/list/list").create(s)
						}
						a()
					} else
						H = "", y.classList.add("hidden"), i(!1), _.emit("searchresults.hide", [], !0)
			},
			isShowing : function () {
				return y && !y.classList.contains("hidden")
			},
			init : function () {
				y = document.getElementById("search-results"),
				_.on("search.removed", function () {
					V = !0,
					y.classList.contains("hidden") && a()
				}),
				_.on("search.currentProviderChanged", p),
				_.on("search.added", function () {
					V = !0
				}),
				document.getElementById("search-lists-area").addEventListener("click", function () {
					k.setShowing(!1)
				});
				var e = document.getElementById("search-for-row"),
				t = function (t) {
					if (t.stopPropagation(), "touchend" === t.type) {
						t.preventDefault();
						var n = U.getFirstTouchPoint(t.changedTouches),
						i = U.getElementFromTouchPoint(n);
						if (i !== e)
							return
					}
					E()
				};
				e.addEventListener("click", t),
				e.addEventListener("touchend", t);
				var n = document.getElementById("drop-down-container"),
				i = function (e) {
					if (e.stopPropagation(), "touchend" === e.type) {
						e.preventDefault();
						var t = U.getFirstTouchPoint(e.changedTouches),
						i = U.getElementFromTouchPoint(t);
						if (i !== n)
							return
					}
					r()
				};
				n.addEventListener("click", i),
				n.addEventListener("touchend", i),
				_.on("application.systemLanguageChange", w),
				_.on("browser.invoked", function () {
					k.setShowing(!1)
				}),
				w()
			},
			isSearchProviderListOpen : function () {
				return document.getElementById("search-provider-list").classList.contains("show-search-providers")
			},
			closeSearchProviderList : function () {
				i(!1)
			}
		},
		e("iris/on.demand").wrapModule(k, k.init, ["isShowing"]),
		n.exports = k
	}), define("plugins/securitydialog/index", function (e, t, n) {
		function i(e) {
			var t = o.loadScreen("security");
			t.setContext(e),
			o.pushScreen(t)
		}
		function r(e, t, n, r) {
			var o = s.buildConfirm(e.id, l, l, i.bind(a, e), void 0),
			d = document.createElement("div"),
			u = document.createElement("img"),
			m = document.createElement("div"),
			f = document.createElement("div"),
			p = document.createElement("div"),
			g = document.createElement("bdi");
			return d.classList.add("securityDialogHeading"),
			u.setAttribute("src", t),
			m.classList.add("oneLine"),
			f.classList.add("font-size-m"),
			p.classList.add("securityDialogUrl"),
			p.classList.add("font-size-m"),
			g.innerText = e.url,
			p.appendChild(g),
			d.appendChild(u),
			d.appendChild(m),
			o.message.appendChild(d),
			o.message.appendChild(f),
			o.message.appendChild(p),
			o.translate = function () {
				o.title.innerText = c.translate(321),
				o.buttons[1] && (o.buttons[1].innerText = c.translate(322)),
				o.buttons[0].innerText = c.translate(105),
				n && (m.innerText = n(), m.dir = "auto"),
				f.innerText = r(),
				f.dir = "auto"
			},
			o
		}
		var a,
		o = e("screen/manager"),
		s = e("plugins/dialogs/index"),
		c = e("iris/i18n"),
		l = function () {
			return ""
		};
		a = {
			showSecurityDialog : function (e) {
				var t;
				switch (e.securityInfo.type) {
				case "SecureFailed":
				case "SecureUnknown":
					t = r(e, "./assets/cs_unknown_certificate2.png", function () {
							return c.translate(323)
						}, function () {
							return c.translate(190)
						});
					break;
				case "SecurePartial":
					t = r(e, "./assets/cs_mixed_content2.png", function () {
							return e.securityInfo.connectionInfo.domain
						}, function () {
							return c.translate(324) + "\n" + c.translate(190)
						}),
					delete t.buttons[1];
					break;
				case "SecureFull":
					t = r(e, "./assets/cs_dv_pad_lock2.png", function () {
							return e.securityInfo.connectionInfo.domain
						}, function () {
							return c.translate(325, e.securityInfo.connectionInfo.certificateAuthority)
						});
					break;
				case "SecureEV":
					t = r(e, "./assets/cs_ev_pad_lock2.png", void 0, function () {
							return c.translate(326, e.securityInfo.connectionInfo.certificateAuthority) + "\n" + c.translate(327)
						});
					var n = document.createElement("div"),
					i = document.createElement("div"),
					a = document.createElement("bdi"),
					o = document.createElement("bdi");
					if (i.className = "font-size-m secondary-text", n.appendChild(a), i.appendChild(o), a.innerText = e.securityInfo.connectionInfo.siteOwnership, e.securityInfo.connectionInfo.certificateInfo.certificates[0]) {
						var l = e.securityInfo.connectionInfo.certificateInfo.certificates[0].subject,
						d = "";
						l.city && (o.innerText = l.city, d = ", "),
						l.state && (o.innerText += d + l.state, d = ", "),
						l.country && (o.innerText += d + l.country)
					} else {
						var u = t.translate;
						t.translate = function () {
							u(),
							o.innerText = c.translate(218)
						}
					}
					t.message.firstChild.lastElementChild.className = "twoLines",
					t.message.firstChild.lastElementChild.appendChild(n),
					t.message.firstChild.lastElementChild.appendChild(i);
					break;
				case "SecureNone":
				default:
					t = {
						tabId : e.id,
						title : document.createElement("div"),
						message : document.createElement("div"),
						buttons : [document.createElement("button")],
						translate : function () {
							t.title.innerText = c.translate(321),
							t.buttons[0].innerText = c.translate(105),
							t.message.innerHTML = "",
							t.message.classList.add("font-size-m"),
							t.message.appendChild(document.createTextNode(c.translate(328))),
							t.message.appendChild(document.createElement("br")),
							t.message.appendChild(document.createTextNode(c.translate(329))),
							t.message.appendChild(document.createElement("br"));
							var n = document.createElement("div");
							n.classList.add("securityDialogUrl");
							var i = document.createElement("bdi");
							i.innerText = e.url,
							n.appendChild(i),
							t.message.appendChild(n)
						}
					}
				}
				s.show(t)
			}
		},
		n.exports = a
	}), define("plugins/segmentedtitlebar/index", function (e, t, n) {
		function i(e, t) {
			t === d.FIRST ? e.button.classList.remove("segmented-last") : e.button.classList.add("segmented-last"),
			e.pressedOverlay.classList.add("segmented-overlay-pressed")
		}
		function r(e, t) {
			e.enableButtonClick && (i(e, t), t !== e.selectedButton && (e.selectedButton = t, t === d.FIRST ? e.firstButtonCallback() : e.lastButtonCallback()))
		}
		function a(e, t) {
			if (e.enableButtonClick) {
				t.preventDefault(),
				t.stopPropagation();
				var n = -1 * t.offsetX;
				u.isDeviceLanguageRTL() && (n = window.screen.width - n),
				n >= window.screen.width / 2 ? r(e, d.LAST) : r(e, d.FIRST)
			}
		}
		function o(e, t) {
			if (e.enableButtonClick) {
				t.preventDefault(),
				t.stopPropagation(),
				l = t.touches[0].pageX;
				var n = l;
				m = 0,
				u.isDeviceLanguageRTL() && (n = window.screen.width - n),
				n > window.screen.width / 2 ? i(e, d.LAST) : i(e, d.FIRST)
			}
		}
		function s(e, t) {
			if (e.enableButtonClick && l && (t.preventDefault(), t.stopPropagation(), m = t.touches[0].pageX - l, !(p > m && m > -p))) {
				var n = 0;
				(!u.isDeviceLanguageRTL() && e.selectedButton === d.LAST || u.isDeviceLanguageRTL() && e.selectedButton === d.FIRST) && (n = e.button.offsetWidth),
				e.button.style.webkitTransform = f >= n + m ? "translateZ(0) translateX(0px)" : n + e.button.offsetWidth + m >= e.button.parentNode.offsetWidth - f ? "translateZ(0) translateX(100%)" : "translateZ(0) translateX(" + (n + m) + "px)"
			}
		}
		function c(e, t) {
			if (e.enableButtonClick) {
				t.preventDefault(),
				t.stopPropagation();
				var n = e.button.classList.contains("segmented-last") ? e.button.offsetWidth : 0,
				i = m ? m : 0;
				u.isDeviceLanguageRTL() && (i = -i),
				n + e.button.offsetWidth / 2 + i > window.screen.width / 2 ? (e.lastButtonText.classList.add("accent-colour-highlight"), e.firstButtonText.classList.remove("accent-colour-highlight"), r(e, d.LAST)) : (e.firstButtonText.classList.add("accent-colour-highlight"), e.lastButtonText.classList.remove("accent-colour-highlight"), r(e, d.FIRST)),
				l = void 0,
				m = 0,
				e.button.style.webkitTransform = "",
				e.pressedOverlay.classList.remove("segmented-overlay-pressed")
			}
		}
		var l,
		d,
		u = e("iris/i18n"),
		m = 0,
		f = 15,
		p = 8;
		d = {
			createSegmentedTitleBar : function (e, t, n, i, r) {
				var l = document.getElementById(e);
				l.className = "titlebar segmented-control border-bottom-size-xs strong-accent-colour-border-image",
				l.enableButtonClick = !0,
				l.firstButtonCallback = n,
				l.lastButtonCallback = r;
				var u = document.createElement("div");
				return u.className = "segmented-moat margin-size-m base-background",
				l.appendChild(u),
				l.button = document.createElement("div"),
				l.button.className = "segmented-button background",
				l.button.setAttribute("aria-hidden", "true"),
				l.button.addEventListener("touchstart", o.bind(this, l)),
				l.button.addEventListener("touchmove", s.bind(this, l)),
				l.button.addEventListener("touchend", c.bind(this, l)),
				l.addEventListener("touchstart", o.bind(this, l)),
				l.addEventListener("touchmove", s.bind(this, l)),
				l.addEventListener("touchend", c.bind(this, l)),
				l.addEventListener("click", a.bind(this, l)),
				u.appendChild(l.button),
				l.pressedOverlay = document.createElement("div"),
				l.pressedOverlay.className = "segmented-overlay inverted-background",
				l.pressedOverlay.setAttribute("aria-hidden", "true"),
				l.button.appendChild(l.pressedOverlay),
				l.firstButtonText = document.createElement("div"),
				l.firstButtonText.className = "segmented-text",
				l.firstButtonText.innerText = t,
				l.firstButtonText.setAttribute("role", "button"),
				l.firstButtonText.tabIndex = 1,
				u.appendChild(l.firstButtonText),
				l.lastButtonText = document.createElement("div"),
				l.lastButtonText.className = "segmented-text",
				l.lastButtonText.innerText = i,
				l.lastButtonText.setAttribute("role", "button"),
				l.lastButtonText.tabIndex = 1,
				u.appendChild(l.lastButtonText), {
					setContext : function (e) {
						e === d.FIRST ? (l.firstButtonText.classList.add("accent-colour-highlight"), l.lastButtonText.classList.remove("accent-colour-highlight"), l.button.classList.remove("segmented-last")) : (l.lastButtonText.classList.add("accent-colour-highlight"), l.firstButtonText.classList.remove("accent-colour-highlight"), l.button.classList.add("segmented-last")),
						l.selectedButton = e
					},
					setButtonText : function (e, t) {
						e === d.FIRST ? l.firstButtonText.innerText = t : l.lastButtonText.innerText = t
					},
					enableButtonClick : function (e) {
						l.enableButtonClick = e
					}
				}
			},
			FIRST : "first",
			LAST : "last"
		},
		n.exports = d
	}), define("plugins/tabbar/index", function (e, t, n) {
		function i(t) {
			switch (q = t, t) {
			case F:
				e("iris/keyboard.focus").setWebviewFocus(d);
			case V:
			case U:
				if (v) {
					v = !1;
					var n = S.getAll();
					n.forEach(function (e) {
						e.shouldBeVisible && X(e.id, !0)
					}),
					n.forEach(function (e) {
						e.shouldBeVisible || X(e.id, !1)
					})
				}
			}
		}
		function r(e) {
			var t = S.getTabForWebviewId(e);
			t && u.tabbar.cancelPendingTabRemoval(t.id)
		}
		function a(e) {
			h = .1 * f,
			m = Math.min(e.screenWidth, e.screenHeight) - f
		}
		function o(e) {
			f = R.isASeries() ? 128 : R.isOSeries() || R.isWSeries() ? 360 : 158,
			a(e)
		}
		function s(e) {
			f = R.isASeries() ? 128 : R.isOSeries() || R.isWSeries() ? 360 : R.isClassic() ? 128 : 158,
			a(e)
		}
		function c() {
			var e = {
				Untitled : y.translate(58),
				"Home Page" : y.translate(330),
				Bookmarks : y.translate(139),
				History : y.translate(184),
				"New Tab" : y.translate(331),
				"Close Tab" : y.translate(332),
				k : y.translate(76),
				h : y.translate(77)
			};
			u._translations = e,
			u.tabbar && u.tabbar.applyTranslations()
		}
		function l() {
			S.getSelected().webviewId === b && qnx.callExtensionMethod("webview.setKeyboardVisible", b, !0)
		}
		var d,
		u,
		m,
		f,
		p,
		g,
		h,
		v,
		b,
		E,
		w = e("iris/event"),
		T = e("ui/animationTimings"),
		y = e("iris/i18n"),
		I = e("iris/screen"),
		S = e("iris/tabs/controller"),
		x = e("iris/settings"),
		C = e("iris/windowAnimations"),
		k = e("plugins/navigationbar/index"),
		A = e("iris/rotation.helper"),
		N = e("plugins/screens/tab/index"),
		L = e("ui/utils"),
		_ = e("iris/utils"),
		R = e("iris/device"),
		O = e("plugins/tooltipbar/index"),
		D = "/extensions/tabbar/index.html",
		B = {
			size : 0
		},
		M = !1,
		P = 0,
		U = 0,
		F = 1,
		H = 2,
		V = 3,
		W = 4,
		q = U,
		G = !1,
		K = .05,
		z = {
			startXPosition : 0,
			initialWindowXPosition : 0,
			initialState : U,
			allowClick : !0,
			swipe : !1,
			previousXPosition : 0,
			previousUpdateTime : 0,
			firstUpdate : !1
		},
		Y = 0,
		j = !1,
		J = !1,
		X = function (e, t) {
			var n = S.get(e);
			if (n)
				return q === W || q === H ? (v = !0, void 0) : (n.webview && (n.webview.setVisible(t), n.webview.setActive(t)), void 0)
		};
		R.onInformationDensity({
			low : o,
			high : s
		});
		var Z = function (e) {
			if (q !== e)
				switch (i(e), e) {
				case F:
				case V:
					u.tabbar.allowUserInteraction(),
					qnx.callExtensionMethod("webview.setSensitivity", d, "SensitivityAlways");
					break;
				case U:
					u.tabbar.allowUserInteraction(),
					qnx.callExtensionMethod("webview.setSensitivity", d, "SensitivityNever");
					break;
				case H:
				case W:
					qnx.callExtensionMethod("webview.setSensitivity", d, "SensitivityNever")
				}
		},
		Q = function (e) {
			switch (e) {
			case F:
				return m;
			case V:
				return Y;
			case U:
			default:
				return 0
			}
		},
		$ = function () {
			u.tabbar.ensureCurrentTabVisible()
		},
		et = function (e, t) {
			t.selected && B[e] && (B[e] = void 0, 0 === --B.size && k.setHasUnseenTabs(!1))
		},
		tt = function (e, t) {
			var n = {};
			_.extend(n, t, ["selected", "url"]),
			Object.keys(n).length && u && u.tabbar && u.tabbar.onUpdated && u.tabbar.onUpdated(e, n)
		},
		nt = function (e, t) {
			u && u.tabbar && u.tabbar.updateTitle && u.tabbar.updateTitle(e, t)
		},
		it = function (e) {
			B[e.id] = e.id,
			B.size += 1,
			B && k.setHasUnseenTabs(!0),
			q === U && $();
			var t = {};
			_.extend(t, e, ["id", "url"]),
			t.title = e.getTitle(),
			u.tabbar.onCreated(t)
		},
		rt = function (e) {
			u.tabbar.setHomePageButtonVisible(e)
		},
		at = function () {
			var e = [];
			S.getAll().forEach(function (t) {
				var n = {};
				_.extend(n, t, ["id", "selected", "url"]),
				n.title = t.getTitle(),
				e.push(n)
			}),
			u.tabbar.tabInfoUpdated(e),
			rt(x.getValue(x.ON_STARTUP) === x.ON_STARTUP_HOME)
		},
		ot = function (e) {
			e = e || S.getCurrentTabId();
			var t = S.getCurrentScreenCapture(e);
			t || (t = "assets/av_default_tab_list_dk.png"),
			u.tabbar.thumbnailUpdated(e, t)
		},
		st = function () {
			S.update(S.getCurrentTabId(), {
				url : _.getHomePageUrl()
			})
		},
		ct = function (e) {
			"showtabscontainer" !== e.target.id && (e.preventDefault(), e.stopPropagation())
		},
		lt = function (e) {
			ct(e),
			E.startDrag(e.screenX)
		},
		dt = function (e) {
			ct(e),
			E.startDrag(e.targetTouches[0].screenX)
		},
		ut = function (e) {
			ct(e),
			E.endDrag()
		},
		mt = function (e) {
			ct(e),
			E.updateDrag(e.targetTouches[0].screenX)
		},
		ft = function (e) {
			ct(e),
			ut(e)
		},
		pt = function () {
			N.suppressEventsToTabs(),
			document.documentElement.addEventListener("touchstart", dt, !0),
			document.documentElement.addEventListener("mousedown", lt, !0),
			document.documentElement.addEventListener("touchend", ut, !0),
			document.documentElement.addEventListener("click", ft, !0),
			document.documentElement.addEventListener("touchmove", mt, !0)
		},
		gt = function () {
			N.releaseEventsToTabs(),
			document.documentElement.removeEventListener("touchstart", dt, !0),
			document.documentElement.removeEventListener("mousedown", lt, !0),
			document.documentElement.removeEventListener("touchend", ut, !0),
			document.documentElement.removeEventListener("click", ft, !0),
			document.documentElement.removeEventListener("touchmove", mt, !0)
		},
		ht = function () {
			G && (qnx.callExtensionMethod("windowTouchTracking.destroyWindowTouchTrackingGroup", p), qnx.callExtensionMethod("windowTouchTracking.destroyWindowTouchTrackingGroup", g), G = !1)
		},
		vt = function () {
			document.removeEventListener("touchstart", ct, !0),
			ht()
		},
		bt = function (e) {
			return e / m * N.fadeColorWindowMaxAlpha()
		},
		Et = function (t, n) {
			var i = I.getHandle(iris.chromeId),
			r = N.fadeColorWindowHandle();
			if (parseInt(i, 10) && r) {
				var a = [i, P, 0, t, 0, r, P, 0, t, 0],
				o = S.getAll();
				if (o.forEach(function (e) {
						if (e.webviewId && e.position) {
							var n = I.getHandle(e.webviewId);
							parseInt(n, 10) && a.push(n, P, e.position.y, t, e.position.y)
						}
					}), q !== W) {
					q === H && vt(),
					Z(W),
					L.preventUserInteraction();
					var s = T.getTiming(T.ANIMATE_TABBAR, Math.abs(P - t)) / 1e3;
					C.animateWindowLocations("EaseOutCurve", s, a, function () {
						e("iris/webview.viewport").setViewportAndCallBackAsNeeded(iris.chromeId, t, 0, screen.width, screen.height),
						S.getAll().forEach(function (n) {
							n.position && n.webviewId && e("iris/webview.viewport").setViewportAndCallBackAsNeeded(n.webviewId, t, n.position.y, n.position.width, n.position.height)
						}),
						0 === t && e("iris/webview.viewport").setViewportAndCallBackAsNeeded(d, -screen.width, 0, m, screen.height),
						P = t,
						L.allowUserInteraction(),
						n && n(),
						J && (E.hide(), J = !1)
					});
					var c = bt(P),
					l = bt(t);
					C.animateGlobalAlpha(r, "EaseOutCurve", s, c, l, null)
				}
			}
		},
		wt = function () {
			e("iris/webview.viewport").setViewportAndCallBackAsNeeded(d, 0, 0, m, screen.height),
			u.tabbar.requestNewScreenshots(),
			B = {
				size : 0
			},
			k.setHasUnseenTabs(!1),
			$(),
			u.tabbar.setFocusOnSelectedTab()
		},
		Tt = function (e, t, n, i, r) {
			var a = q !== U ? 0 : -screen.width;
			A.setViewportAndCallBackAsNeeded(e, a, 0, m, n, r)
		},
		yt = function (e) {
			Y = e,
			d && q === V && Et(Q(V), function () {
				Z(V)
			})
		};
		E = {
			tabbarId : function () {
				return d
			},
			setTabVisible : X,
			toggleState : function () {
				switch (q) {
				case U:
					E.show();
					break;
				case F:
				case V:
					E.hide()
				}
			},
			show : function () {
				d && q !== F && q !== W && !e("iris/fullscreen").isFullScreen() && (wt(), Et(Q(F), function () {
						Z(F)
					}), pt(), w.emit("tabbar.showing", []))
			},
			hide : function () {
				if (d && q !== U) {
					if (q === W)
						return J = !0, void 0;
					Et(Q(U), function () {
						Z(U),
						$(),
						w.emit("tabbar.hidden", [], !0)
					}),
					gt(),
					j ? j = !1 : w.emit("tabbar.cancel", [])
				}
			},
			previewMode : function () {
				d && q !== V && q !== W && (wt(), Et(Q(V), function () {
						Z(V)
					}), pt(), w.emit("tabbar.showing", []))
			},
			isShowing : function () {
				return q !== U
			},
			setVisible : function () {
				d && !M && (qnx.callExtensionMethod("webview.setVisible", d, !0), M = !0)
			},
			setState : function (t) {
				if (d)
					switch (i(t), q) {
					case U:
						e("iris/webview.viewport").setViewportAndCallBackAsNeeded(d, -screen.width, 0, m, screen.height),
						gt();
						break;
					case F:
					case W:
					case V:
					case H:
						e("iris/webview.viewport").setViewportAndCallBackAsNeeded(d, 0, 0, m, screen.height)
					}
			},
			setPosition : function (e) {
				P = e
			},
			visibleWidth : function (e) {
				switch (e = e || screen.width, q) {
				case U:
					return 0;
				case F:
				case W:
					return m;
				case V:
					return Y;
				case H:
					return e / screen.width * P
				}
			},
			init : function () {
				var t = qnx.callExtensionMethod("webview.applicationWindowGroup", iris.chromeId),
				n = parseInt(qnx.callExtensionMethod("webview.create", t, 0), 10);
				w.on("Created", function () {
					d = n,
					u = window.open("about:blank");
					var t = window.location.href;
					qnx.callExtensionMethod("webview.setEnableConsoleLogging", d, "true"),
					qnx.callExtensionMethod("webview.setAutoDeferNetworkingAndJavaScript", d, "false"),
					qnx.callExtensionMethod("webview.setDevicePixelRatio", d, 1),
					PUBLIC_BUILD ? qnx.callExtensionMethod("webview.setAllowWebInspection", iris.chromeId, d, !1) : qnx.callExtensionMethod("webview.setInputLogFromPPSEnabled", d, !0),
					e("iris/device").spatialNavigationEnabled() && qnx.callExtensionMethod("webview.setEnableSpatialNavigation", d, !0),
					u.location = t.substring(0, t.lastIndexOf("/")) + D,
					qnx.callExtensionMethod("webview.setZOrder", d, 0),
					e("iris/webview.viewport").setViewportAndCallBackAsNeeded(d, -screen.width, 0, m, screen.height),
					qnx.callExtensionMethod("webview.setEnableLocalAccessToAllCookies", d, "false"),
					A.addWebview(d, E.isShowing, Tt),
					w.emit("webview.created", [d], !0),
					w.on("tabs.created", it),
					w.on("tabs.updated", et),
					w.on("tabs.updated", tt),
					w.on("webpage.title.updated", nt),
					w.on("webpage.screen.capture.updated", ot),
					w.on("webpage.new.navigation", ot),
					w.on("navigation.cancel", r),
					w.on("ProcessCrash", function () {
						if (0 !== P) {
							var t = I.getHandle(iris.chromeId),
							n = N.fadeColorWindowHandle();
							if (parseInt(t, 10) && n) {
								Z(W),
								C.animateWindowLocations("EaseOutCurve", .25, [t, P, 0, 0, 0, n, P, 0, 0, 0], function () {
									e("iris/webview.viewport").setViewportAndCallBackAsNeeded(iris.chromeId, 0, 0, screen.width, screen.height),
									e("iris/webview.viewport").setViewportAndCallBackAsNeeded(d, -screen.width, 0, m, screen.height),
									P = 0,
									Z(U),
									$(),
									gt()
								});
								var i = bt(0);
								C.animateGlobalAlpha(n, "EaseOutCurve", .25, i, i, null)
							}
						}
					}),
					w.on("settings.updated", function (e, t) {
						e === x.ON_STARTUP && rt(t === x.ON_STARTUP_HOME)
					}),
					w.on("application.active", function () {
						_.setApplicationActive(d, !0)
					}),
					w.on("application.inactive", function () {
						_.setApplicationActive(d, !1)
					}),
					w.on("application.systemLanguageChange", c),
					w.on("KeyboardRequestedEvent", function (e, t, n) {
						w.un("tabbar.hidden", l),
						t = JSON.parse(t),
						n.setPreventDefault = e !== iris.chromeId && t.show && E.isShowing(),
						n.setPreventDefault && (b = e, w.once("tabbar.hidden", l))
					})
				}, [n])
			},
			extensionPrivate : {
				applyTranslations : c,
				updateTabInfo : at,
				updateCurrentTabThumbnail : ot,
				loadHomePage : st,
				setThumbnailWidth : yt
			},
			startDrag : function (e) {
				if (d && q !== H && q !== W) {
					var t = S.getSelected();
					if (t) {
						q === U && (wt(), pt()),
						z.initialWindowXPosition = Q(q),
						z.initialState = q,
						Z(H);
						var n = I.getHandle(iris.chromeId),
						i = N.fadeColorWindowHandle(),
						r = ["windowTouchTracking.createWindowTouchTrackingGroup", n, i],
						a = S.getAll();
						a.forEach(function (e) {
							if (e.webviewId) {
								var t = I.getHandle(e.webviewId);
								parseInt(t, 10) && r.push(t)
							}
						}),
						parseInt(n, 10) && i && (ht(), p = qnx.callExtensionMethod.apply(qnx, r), g = qnx.callExtensionMethod("windowTouchTracking.createWindowTouchTrackingGroup", i), qnx.callExtensionMethod("windowTouchTracking.setWindowGroupTrackX", p, !0, -z.initialWindowXPosition, m - z.initialWindowXPosition, e), qnx.callExtensionMethod("windowTouchTracking.setWindowGroupTrackXToAlpha", g, !0, -z.initialWindowXPosition, m - z.initialWindowXPosition, 0, N.fadeColorWindowMaxAlpha(), e), G = !0),
						z.allowClick = !0,
						z.swipe = !0,
						z.firstUpdate = !0,
						z.startXPosition = e,
						document.addEventListener("touchstart", ct, !0)
					}
				}
			},
			endDrag : function (e) {
				if (d && q === H) {
					var t = parseInt(qnx.callExtensionMethod("windowTouchTracking.jsGetWindowTouchTrackingGroupCurrentDeltaX", p), 10);
					if (P = t + z.initialWindowXPosition, vt(), !e && z.allowClick)
						switch (z.initialState) {
						case U:
							return E.show(),
							void 0;
						case F:
						case V:
							return E.hide(),
							void 0
						}
					if (z.swipe)
						switch (z.initialState) {
						case F:
							return E.hide(),
							void 0;
						case V:
							return Q(V) > P ? E.hide() : E.show(),
							void 0;
						case U:
							return E.show(),
							void 0
						}
					Q(V) / 2 > P ? E.hide() : Q(V) + (Q(F) - Q(V)) / 2 > P ? E.previewMode() : E.show()
				}
			},
			updateDrag : function (e) {
				if (d && q === H) {
					if (!z.firstUpdate) {
						var t;
						t = z.initialState === U || z.initialState === V ? e - z.previousXPosition : z.previousXPosition - e;
						var n = (window.performance.webkitNow ? window.performance.webkitNow() : window.performance.now()) - z.previousUpdateTime,
						i = t / n;
						K > i && (z.swipe = !1)
					}
					Math.abs(e - z.startXPosition) > h && (O.hideToolTipBar(), z.allowClick = !1),
					z.previousXPosition = e,
					z.previousUpdateTime = window.performance.webkitNow ? window.performance.webkitNow() : window.performance.now(),
					z.firstUpdate = !1
				}
			},
			getTabbarWindow : function () {
				return u
			},
			STATES : {
				CLOSED : U,
				OPEN : F,
				DRAGGING : H,
				PREVIEW : V,
				ANIMATING : W
			}
		},
		w.on("tabbar.itemClicked", function () {
			j = !0
		}),
		w.on("browser.invoked", E.hide),
		w.on("browser.init.tier3", E.init),
		w.on("tooltip.bar.visible", E.hide),
		w.on("OpenWindow", function (e, t, n) {
			return d ? (n.setView = "" + d, void 0) : (console.error("window.open for chrome webview isn't for tabbar? That's unpossible!"), void 0)
		}, [iris.chromeId]),
		w.on("keyboard.focus.changed", function () {
			q !== F || e("iris/keyboard.focus").isTabbarFocused() ? q !== F && e("plugins/views/new_tab_page/index").isVisible() && e("iris/keyboard.focus").isTabFocused() && e("iris/keyboard.focus").setWebviewFocus(iris.chromeId) : e("iris/keyboard.focus").setWebviewFocus(d)
		}),
		n.exports = E
	}), define("plugins/titlebar/index", function (e, t, n) {
		function i(e, t, n) {
			var i = document.getElementById("top-overlay");
			d = p.transitionWithTimeout(i, function () {
					i.style.webkitTransition = "-webkit-transform " + t + "ms ease-out",
					i.style.webkitTransform = "translateY(" + e + "px) translateZ(0)"
				}, t + 100, n)
		}
		function r() {
			var e = y === w || h.numberOfInfoBarsShowing() ? 1 : 0,
			t = document.getElementById("top-overlay");
			t.style.opacity = e
		}
		function a(e, t) {
			if (y !== e)
				switch (e) {
				case w:
					y = e,
					r(),
					i(0, v.getTiming(v.TITLEBAR_OPEN), t);
					break;
				case T:
					y = e,
					i(-c, v.getTiming(v.TITLEBAR_CLOSE), function () {
						r()
					})
				}
		}
		function o(e, t) {
			var n = b.get(e);
			if (n.selected) {
				var i = t;
				"" === i && (i = "./assets/cs_default_web.png"),
				document.getElementById("TitleBar_Favicon").style.backgroundImage = "url('" + i + "')"
			}
		}
		function s() {
			clearTimeout(l),
			l = void 0
		}
		var c,
		l,
		d,
		u,
		m = e("iris/event"),
		f = e("iris/settings"),
		p = e("ui/utils"),
		g = e("plugins/find_on_page/index"),
		h = e("plugins/infobartender/index"),
		v = e("ui/animationTimings"),
		b = e("iris/tabs/controller"),
		E = e("iris/device"),
		w = 0,
		T = 1,
		y = T;
		c = E.isASeries() ? 44 : E.isOSeries() || E.isWSeries() ? 46 : 45,
		"Restricted" === iris.chromeMode() && (c = e("iris/device").getDesignUnitBucket() / 2),
		u = {
			setTitle : function (e) {
				e && (e = e.replace(/\n/g, " ")),
				document.querySelector("#TitleBar_Title bdi").innerText = e || ""
			},
			setPrivateBrowsing : function (e) {
				if (e) {
					var t = document.createElement("div");
					t.id = "TitleBar_PrivateBrowsingIcon",
					t.classList.add("icon"),
					t.classList.add("privatebrowsing"),
					document.getElementById("TitleBar_StatusContainer").appendChild(t)
				} else {
					var n = document.getElementById("TitleBar_PrivateBrowsingIcon");
					n && n.parentNode.removeChild(n)
				}
			},
			setWorkMode : function (e) {
				if (e) {
					var t = document.createElement("div");
					t.id = "TitleBar_CorporateModeIcon",
					t.classList.add("icon"),
					t.classList.add("corporatemode");
					var n = document.getElementById("TitleBar_StatusContainer");
					n.insertBefore(t, n.firstChild)
				} else {
					var i = document.getElementById("TitleBar_CorporateModeIcon");
					i && i.parentNode.removeChild(i)
				}
			},
			show : function (e) {
				if (!g.isVisible()) {
					if (u.isVisible() && (l && !e || !l))
						return s(), void 0;
					s(),
					d && d.cancel();
					var t = function () {
						e && (l = setTimeout(u.hide, e))
					};
					y === w ? t() : a(w, t)
				}
			},
			hide : function (e) {
				y !== T && (s(), d && d.cancel(), e ? l = setTimeout(function () {
							a(T)
						}, e) : a(T))
			},
			init : function () {
				m.on("settings.updated", function (e, t) {
					e === f.ENABLE_PRIVATE_BROWSING && u.setPrivateBrowsing(t)
				}),
				u.setPrivateBrowsing(f.getValue(f.ENABLE_PRIVATE_BROWSING)),
				u.setWorkMode(e("iris/utils").isWorkBrowser()),
				m.on("infobar.created", r),
				m.on("infobar.removed", r),
				document.getElementById("TitleBar_MainBar").addEventListener("click", e("iris/shortcuts").page.scrollToTop)
			},
			height : function () {
				var e = document.getElementsByClassName("top")[0];
				return e ? e.offsetHeight : c
			},
			isVisible : function () {
				return y === w
			}
		},
		m.on("browser.init.tier2", u.init),
		m.on("webpage.favicon.updated", o),
		m.on("tabs.updated", function (e, t, n) {
			t.selected && o(e, n.getFavicon())
		}),
		n.exports = u
	}), define("plugins/titlebarwithactions/index", function (e, t, n) {
		function i(e) {
			var t = {
				hoverInClass : "titlebar-button-pressed-overlay",
				hoverOutClass : ""
			};
			return t = s.extend(t, e),
			o.create(t)
		}
		var r,
		a = e("ui/hover/hoverController"),
		o = e("ui/hover/hoverHandlerFactory"),
		s = e("iris/utils"),
		c = e("iris/peek");
		r = {
			createTitleBar : function (e) {
				var t = !e.leftText && !e.rightText,
				n = document.createElement("div");
				n.setAttribute("class", "titlebar titlebar-actions border-bottom-size-xs strong-accent-colour-border-image " + (t ? "horizontal-padding-size-m" : "titlebar-actions-center"));
				var r,
				o,
				s,
				l;
				if (e.leftText) {
					r = document.createElement("div"),
					r.className = "button left-button horizontal-padding-size-m",
					r.tabIndex = "1",
					r.setAttribute("role", "button"),
					o = document.createElement("div"),
					o.className = "button-text-content font-size-s accent-colour-highlight",
					o.innerText = e.leftText,
					r.appendChild(o);
					var d = document.createElement("div");
					d.className = "pipe-container",
					r.appendChild(d);
					var u = document.createElement("div");
					u.className = "pipe",
					d.appendChild(u);
					var m = document.createElement("div");
					m.className = "inverted-background button-overlay",
					r.appendChild(m),
					n.appendChild(r);
					var f = function (e) {
						m.classList.contains("titlebar-button-pressed-overlay") && !e ? u.classList.add("hidden") : u.classList.remove("hidden")
					},
					p = function () {
						c.isPeeking() || e.leftCallback()
					},
					g = i({
							hoverTargetElement : r,
							hoverStyleElement : m,
							onHoverTargetClick : p,
							onHoverTargetTouchEnd : p,
							onHoverTouchIn : f.bind(this, !1),
							onHoverTouchEnd : f.bind(this, !0)
						});
					a.register(g)
				}
				var h = document.createElement("img");
				h.className = "titlebar-img",
				e.titleImageSrc && (h.classList.add("horizontal-padding-size-m"), h.src = e.titleImageSrc),
				n.appendChild(h);
				var v = document.createElement("div");
				if (v.className = t ? "titlebar-actions-title-left" : e.rightText ? "titlebar-actions-title-centered horizontal-margin-size-m" : "titlebar-actions-title-left horizontal-padding-size-m", v.classList.add("font-size-l"), v.innerText = e.titleText, v.setAttribute("title", e.titleText), v.setAttribute("role", "heading"), n.appendChild(v), e.rightText) {
					s = document.createElement("div"),
					s.className = "button right-button horizontal-padding-size-m",
					s.tabIndex = "1",
					s.setAttribute("role", "button");
					var b = document.createElement("div");
					b.className = "pipe-container",
					s.appendChild(b);
					var E = document.createElement("div");
					E.className = "pipe",
					b.appendChild(E),
					l = document.createElement("div"),
					l.className = "button-text-content font-size-s accent-colour-highlight",
					l.innerText = e.rightText,
					s.appendChild(l);
					var w = document.createElement("div");
					w.className = "inverted-background button-overlay",
					s.appendChild(w),
					n.appendChild(s);
					var T = function (e) {
						w.classList.contains("titlebar-button-pressed-overlay") && !e ? E.classList.add("hidden") : E.classList.remove("hidden")
					},
					y = function () {
						c.isPeeking() || e.rightCallback()
					},
					I = i({
							hoverTargetElement : s,
							hoverStyleElement : w,
							onHoverTargetClick : y,
							onHoverTargetTouchEnd : y,
							onHoverTouchIn : T.bind(this, !1),
							onHoverTouchEnd : T.bind(this, !0)
						});
					a.register(I)
				}
				var S = document.getElementById(e.parentId);
				return S.classList.add("overlay"),
				S.appendChild(n), {
					setTitle : function (e) {
						v.innerText = e,
						v.setAttribute("title", e)
					},
					setTitleImg : function (e) {
						h.src = e
					},
					setLeftButtonText : function (e) {
						o ? o.innerText = e : console.warn("Tried to set left button text for a title bar without a left button")
					},
					setRightButtonText : function (e) {
						l ? l.innerText = e : console.warn("Tried to set right button text for a title bar without a right button")
					},
					enableLeftButton : function (e) {
						r && r.setAttribute("aria-disabled", !e),
						r && e ? r.classList.remove("button-disabled") : r && !e ? r.classList.add("button-disabled") : console.warn("Tried to set enable/disable non-existant left button")
					},
					enableRightButton : function (e) {
						s && s.setAttribute("aria-disabled", !e),
						s && e ? s.classList.remove("button-disabled") : s && !e ? s.classList.add("button-disabled") : console.warn("Tried to set enable/disable non-existant right button")
					}
				}
			}
		},
		n.exports = r
	}), define("plugins/toaster/index", function (e, t, n) {
		function i(e) {
			u.emit("toaster.toast.show", [e.id]),
			e.classList.remove("toast_hidden"),
			g++
		}
		function r(e) {
			e.removeEventListener("webkitTransitionEnd", function () {
				r(e)
			}, !1),
			null !== e.parentNode && e.parentNode.removeChild(e),
			e.buttonHoverHandler && m.unregister(e.buttonHoverHandler),
			u.un("toaster.toast.cancelTimeout." + e.id),
			u.un("toaster.toast.resetTimeout." + e.id),
			u.emit("toaster.toast.destroyed", [e.id])
		}
		function a(e) {
			e.dismissed || (e.dismissed = !0, u.emit("toaster.toast.dismissed." + e.id, [], !0), e.addEventListener("webkitTransitionEnd", function () {
					r(e)
				}, !1), e.classList.add("toast_dismiss"), g--)
		}
		function o(t) {
			var n = e("screen/manager").currentScreen(),
			i = function (e, n) {
				("popped" === n || "becomingHidden" === n) && l.dismissToast(t)
			},
			r = function () {
				l.dismissToast(t)
			};
			u.on("manager.screen", i, [n]),
			u.on("screen.contextMenu.becomingVisible", r),
			u.once("toaster.toast.dismissed." + t.id, function () {
				u.un("manager.screen", i),
				u.un("screen.contextMenu.becomingVisible", r)
			})
		}
		function s(e) {
			var t = document.createElement("div");
			t.id = "toast" + d++,
			o(t),
			t.setAttribute("class", "base-background toast_base toast_hidden"),
			t.setAttribute("role", "dialog");
			var n = document.createElement("p");
			return n.innerText = e,
			n.className = "toast_message horizontal-padding-size-m",
			t.appendChild(n),
			t.addEventListener("click", function (e) {
				e.stopPropagation(),
				a(t)
			}),
			document.getElementsByClassName("toaster-middle")[0].appendChild(t),
			setTimeout(function () {
				i(t)
			}, 0),
			setTimeout(function () {
				a(t)
			}, 1500),
			t
		}
		function c(e, t, n, r) {
			var s = document.createElement("div");
			s.id = "toast" + d++,
			o(s),
			s.className = "base-background toast_base toast_hidden",
			s.setAttribute("role", "dialog");
			var c = document.createElement("div");
			c.className = "button horizontal-padding-size-m",
			c.tabIndex = "1";
			var l = document.createElement("div");
			l.className = "button-text-content accent-colour-highlight",
			l.textContent = t,
			c.appendChild(l);
			var g = document.createElement("div");
			g.className = "pipe-container",
			c.appendChild(g);
			var h = document.createElement("div");
			h.className = "pipe",
			g.appendChild(h);
			var v = document.createElement("div");
			v.className = "background button-overlay",
			c.appendChild(v);
			var b = function () {
				clearTimeout(T),
				n && n(),
				r = void 0,
				a(s)
			},
			E = function () {
				h.classList.toggle("hidden")
			},
			w = f.create({
					hoverInClass : "button-pressed-overlay",
					hoverTargetElement : c,
					hoverStyleElement : v,
					onHoverTargetClick : b,
					onHoverTargetTouchEnd : b,
					onHoverTouchIn : E,
					onHoverTouchEnd : E
				});
			s.buttonHoverHandler = w,
			m.register(w);
			var T = 0,
			y = document.createElement("p");
			y.innerText = e,
			y.className = "toast_message horizontal-padding-size-m",
			s.appendChild(y);
			var I = function (e) {
				e.stopPropagation(),
				a(s)
			};
			s.addEventListener("click", I, !1),
			s.appendChild(c),
			T = setTimeout(a.bind(this, s), p),
			document.getElementsByClassName("toaster-bottom")[0].appendChild(s);
			var S = function () {
				clearTimeout(T),
				s.removeEventListener("click", I, !1),
				c.removeEventListener("click", b, !1),
				r && r()
			};
			return u.once("toaster.toast.dismissed." + s.id, S),
			u.on("toaster.toast.cancelTimeout." + s.id, function () {
				clearTimeout(T)
			}),
			u.on("toaster.toast.resetTimeout." + s.id, function () {
				clearTimeout(T),
				T = setTimeout(a.bind(this, s), p)
			}),
			setTimeout(function () {
				i(s)
			}, 0),
			s
		}
		var l,
		d = 0,
		u = e("iris/event"),
		m = e("ui/hover/hoverController"),
		f = e("ui/hover/hoverHandlerFactory"),
		p = 2500,
		g = 0;
		l = {
			createBasicToast : function (e) {
				return s(e)
			},
			createFrenchToast : function (e, t, n, i) {
				return c(e, t, n, i)
			},
			dismissToast : function (e) {
				e && a(e)
			},
			cancelToastTimeout : function (e) {
				e && u.emit("toaster.toast.cancelTimeout." + e.id, [], !0)
			},
			resetToastTimeout : function (e) {
				e && u.emit("toaster.toast.resetTimeout." + e.id, [], !0)
			},
			areToastsVisible : function () {
				return g > 0
			}
		},
		u.on("toaster.toast.dismiss.all", function () {
			Array.prototype.forEach.call(document.getElementsByClassName("toast_base"), a)
		}),
		n.exports = l
	}), define("plugins/tooltipbar/index", function (e, t, n) {
		function i(e, t) {
			if (e) {
				var n = u.screenPointFromEvent(t);
				u.rectContainsPoint(s.targetElementBoundingRect, n) || (r(!1, e), e.hide())
			}
		}
		function r(e, t) {
			d.emit(e ? "tooltip.bar.visible" : "tooltip.bar.hidden", [], !0);
			var n = m.getTiming(m.TOOLTIP_BAR_MOVE);
			t.labelContainer.style.webkitTransitionDuration = n + "ms",
			t.labelContainer.style.webkitTransitionTimingFunction = m.getCurve(),
			u.transitionWithTimeout(t.labelContainer, function () {
				t.labelContainer.style.webkitTransform = e ? "translateY(-100%)" : ""
			}, n + 100)
		}
		function a(e) {
			if (e.rePosition) {
				var t = e.targetElement.getBoundingClientRect(),
				n = t.right - t.width / 2,
				i = t.right - t.left,
				r = parseInt(document.defaultView.getComputedStyle(e.label, null).getPropertyValue("padding-left"), 10),
				a = Math.max(e.label.scrollWidth, i),
				o = a - 2 * r,
				s = parseInt(document.defaultView.getComputedStyle(e.innerContainer, null).getPropertyValue("margin-left"), 10),
				c = Math.min(n - a / 2 - s, screen.width - a - 2 * s);
				e.targetElementBoundingRect = t,
				e.label.style.width = o + "px",
				e.labelContainer.style.paddingLeft = Math.max(c, 0) + "px",
				e.rePosition = !1,
				f.forceLayout()
			}
		}
		function o() {
			c && (clearTimeout(c), c = void 0, document.removeEventListener("touchend", l.hideToolTipBar, !0), document.removeEventListener("mouseup", l.hideToolTipBar, !0))
		}
		var s,
		c,
		r,
		l,
		d = e("iris/event"),
		u = e("ui/utils"),
		m = e("ui/animationTimings"),
		f = e("screen/animationCoordinator"),
		p = !1,
		g = 500,
		h = [];
		l = {
			createToolTipObj : function (e, t) {
				var n = {};
				n.rePosition = !0,
				window.addEventListener("orientationchange", function () {
					n.rePosition = !0
				}),
				n.targetElement = e;
				var r = document.createElement("div");
				r.className = "action-bar-tooltip-container";
				var o = document.createElement("div");
				o.className = "action-bar-tooltip-inner-container",
				n.innerContainer = o,
				r.appendChild(o);
				var s = document.createElement("div");
				s.dir = "ltr",
				s.className = "action-bar-tooltip-label-container bottom-padding-size-s",
				o.appendChild(s),
				n.labelContainer = s;
				var c = document.createElement("span");
				c.className = "action-bar-tooltip-label font-size-xxs background horizontal-padding-size-s",
				c.innerText = t(),
				n.label = c,
				d.on("application.systemLanguageChange", function () {
					c.innerText = t()
				}),
				s.appendChild(c);
				var l = m.getTiming(m.TOOLTIP_FADE);
				r.style.webkitTransitionDuration = l + "ms",
				r.style.webkitTransitionTimingFunction = m.getCurve();
				var f = function (e) {
					e && -1 === h.indexOf(n) ? (document.removeEventListener("touchmove", n.moveListener, !0), document.addEventListener("touchmove", n.moveListener, !0), document.removeEventListener("mousemove", n.moveListener, !0), document.addEventListener("mousemove", n.moveListener, !0), h.push(n)) : e || -1 === h.indexOf(n) || (document.removeEventListener("touchmove", n.moveListener, !0), document.removeEventListener("mousemove", n.moveListener, !0), h.splice(h.indexOf(n), 1)),
					e && a(n),
					u.transitionWithTimeout(r, function () {
						r.style.opacity = e ? 1 : 0
					}, l + 100)
				};
				return n.show = f.bind(this, !0),
				n.hide = f.bind(this, !1),
				n.moveListener = i.bind(this, n),
				document.getElementById("action-bar-tooltip-bar").appendChild(r),
				n
			},
			showToolTipBar : function (e) {
				var t = function () {
					s && s.hide(),
					s = e,
					s.show(),
					r(!0, e),
					p = !0
				};
				p ? t() : (o(), c = setTimeout(t, g), document.addEventListener("touchend", l.hideToolTipBar, !0), document.addEventListener("mouseup", l.hideToolTipBar, !0))
			},
			hideToolTipBar : function () {
				o(),
				h.forEach(function (e) {
					r(!1, e),
					e.hide()
				}),
				h = [],
				s = void 0,
				p = !1
			},
			isVisible : function () {
				return h && h.length > 0
			}
		},
		window.addEventListener("orientationchange", function () {
			s && (s.rePosition = !0, a(s))
		}),
		d.on("peek.start", l.hideToolTipBar),
		d.on("screen.menu.showing", l.hideToolTipBar),
		n.exports = l
	}), define("plugins/views/bookmark_grid/index", function (e, t, n) {
		function i(e, t) {
			return e.id === t.id
		}
		function r(e) {
			(!h || h.isSearchEmpty() || 0 === e.length) && p.onEmptyContentsChanged(),
			p.replaceItems(e)
		}
		function a(e) {
			p.getItems().length === e.length && p.onEmptyContentsChanged(),
			p.animateDelete(e, e.length > 1 ? b.translate(334) : b.translate(333), d.deleteBookmarks)
		}
		function o(e) {
			S.show({
				view : d,
				contextItem : e,
				allItems : d.getItems(),
				nodes : d.getNodes(),
				deleteFunction : d.selectMoreDelete(),
				openFunction : d.selectMoreOpen(),
				isGrid : !0
			})
		}
		function s(e) {
			var t,
			n;
			return e.url && "https" === URI(e.url).protocol() ? n = "assets/av_default_bookmark_grid_dark_https.png" : (t = e.iconUrl, n = "assets/av_default_bookmark_grid_dark.png"), {
				title : e.title && e.title.length ? e.title : "",
				subTitle : w.truncateUrl(e.url),
				imageUrl : t,
				defaultImageUrl : n,
				multiSelectable : !0,
				a11yRole : "link",
				a11yTitle : e.title && e.title.length ? e.title : e.url
			}
		}
		function c() {
			return !h || h.isSearchEmpty() ? {
				message : b.translate(335),
				imageUrl : "default"
			}
			 : {
				message : b.translate(102)
			}
		}
		function l(t, n) {
			if (t == I.interactionType.click)
				w.loadUrlInCurrentTab(n.url, y.TRANSITIONS.BOOKMARK), e("screen/manager").rollBackToScreen(e("screen/manager").homeScreen()), v.emit("bookmarks.select", [n.url], !0);
			else if (t == I.interactionType.hold) {
				var i = {
					contextType : "bookmark",
					headText : n.title && n.title.length ? n.title : b.translate(58),
					subheadText : n.url,
					items : [{
							imageUrl : "assets/ic_open_link_new_tab.png",
							name : b.translate(308),
							callback : w.loadUrlsInNewTabs.bind(this, [n])
						}, {
							imageUrl : "assets/ic_copy_link.png",
							name : b.translate(309),
							callback : E.copyTextToClipboard.bind(this, n.url)
						}, {
							imageUrl : "assets/ic_edit_bookmarks.png",
							name : b.translate(121),
							callback : d.editBookmark.bind(this, n)
						}, {
							imageUrl : "assets/ic_select_more.png",
							name : b.translate(336),
							callback : o.bind(this, n)
						}, {
							imageUrl : "assets/ic_delete.png",
							name : b.translate(178),
							callback : function () {
								a([n])
							},
							isDelete : !0
						}
					]
				};
				T.addMenuItems(i.items, n.url, n.title),
				m.activateContextMenu(i)
			}
		}
		var d,
		u,
		m,
		f,
		p,
		g,
		h,
		v = e("iris/event"),
		b = e("iris/i18n"),
		E = e("iris/clipboard"),
		w = e("iris/utils"),
		T = e("iris/invoke.utils"),
		y = e("iris/history"),
		I = e("ui/interactionController"),
		S = e("plugins/screens/selectmore/index"),
		x = e("iris/bookmarks");
		d = {
			init : function (t) {
				u = t,
				m = e("screen/manager"),
				f = !0,
				u.style.overflowY = "hidden";
				var n = function () {
					return b.translate(139)
				},
				r = {
					container : u,
					interactionHandler : l,
					screen : e("plugins/screens/bookmarks_main/index"),
					view : d,
					itemToCellAdapter : s,
					itemComparator : i,
					getEmptyContents : c,
					title : n
				};
				p = e("ui/container/grid/grid").create(r),
				v.on("iris.bookmarks.creating", d.setDirty),
				v.on("iris.bookmarks.update", function (e, t) {
					x.get(t.url || e.url, p.updateItem)
				}),
				v.on("iris.bookmarks.removed", p.removeItems),
				v.on("iris.history.visited", d.setDirty)
			},
			setDirty : function () {
				f = !0,
				p.setEmptyMessageVisible(!1)
			},
			becomingVisible : function () {
				if (f) {
					v.emit("screen.blockAnimations", [], !0);
					var e = h ? h.getSearchText() : "";
					g({
						title : e,
						url : e,
						tag : e
					}, d.populateBookmarks.bind(d, u)),
					f = !1
				}
			},
			setSearchBar : function (e) {
				h = e,
				d.searchInputChanged(h.getSearchText())
			},
			searchInputChanged : function (e) {
				g && g({
					title : e,
					url : e,
					tag : e
				}, r.bind(d))
			},
			setDataSource : function (e) {
				g != e && (g = e, d.setDirty())
			},
			editBookmark : function (e) {
				x.get(e.url, function (e) {
					var t = m.loadSheet("edit_bookmark");
					t.setContext(e),
					m.pushScreen(t)
				})
			},
			deleteBookmarks : function (e) {
				x.removeBookmarks(e)
			},
			populateBookmarks : function (e, t) {
				p.clear(),
				p.addItems(t),
				v.emit("screen.unblockAnimations", [], !0)
			},
			completePendingDelete : function () {
				p && p.completePendingDelete()
			},
			getItems : function () {
				return p.getItems()
			},
			getNodes : function () {
				return p.getElements()
			},
			selectMoreDelete : function () {
				return a
			},
			selectMoreOpen : function () {
				return w.loadUrlsInNewTabs
			},
			selectMoreIsGrid : function () {
				return !0
			}
		},
		n.exports = d
	}), define("plugins/views/bookmark_list/index", function (e, t, n) {
		function i(t, n) {
			function i(e, t) {
				return e.id === t.id
			}
			function f(e) {
				I.getItems().length === e.length && I.onEmptyContentsChanged(),
				I.animateDelete(e, e.length > 1 ? a.translate(334) : a.translate(333), k.deleteBookmarks)
			}
			function p(e) {
				u.show({
					view : k,
					contextItem : e,
					allItems : k.getItems(),
					nodes : k.getNodes(),
					deleteFunction : k.selectMoreDelete(),
					openFunction : k.selectMoreOpen()
				})
			}
			function g(t, n) {
				if (t == d.interactionType.click)
					s.loadUrlInCurrentTab(n.url, l.TRANSITIONS.BOOKMARK), e("screen/manager").rollBackToScreen(e("screen/manager").homeScreen()), r.emit("bookmarks.select", [n.url], !0);
				else if (t == d.interactionType.hold) {
					var i = {};
					i.contextType = "bookmark",
					i.headText = n.title && n.title.length ? n.title : a.translate(58),
					i.subheadText = n.url,
					i.items = [],
					i.items.push({
						imageUrl : "assets/ic_open_link_new_tab.png",
						name : a.translate(308),
						callback : s.loadUrlsInNewTabs.bind(this, [n])
					}),
					i.items.push({
						imageUrl : "assets/ic_copy_link.png",
						name : a.translate(309),
						callback : o.copyTextToClipboard.bind(this, n.url)
					}),
					i.items.push({
						imageUrl : "assets/ic_edit_bookmarks.png",
						name : a.translate(121),
						callback : k.editBookmark.bind(this, n)
					}),
					i.items.push({
						imageUrl : "assets/ic_select_more.png",
						name : a.translate(336),
						callback : p.bind(this, n)
					}),
					i.items.push({
						imageUrl : "assets/ic_delete.png",
						name : a.translate(178),
						callback : f.bind(this, [n]),
						isDelete : !0
					}),
					c.addMenuItems(i.items, n.url, n.title),
					T.activateContextMenu(i)
				}
			}
			function h(t, n, i) {
				var r = e("plugins/screens/bookmarks_main/index");
				if ("onChanged" == t)
					m.get(i.url || n.url, I.update);
				else if ("onRemoved" == t)
					I.remove([n]);
				else if ("all" == t && T.isScreenPushed(r))
					if (x) {
						var a = x.getSearchText();
						S({
							title : a,
							url : a
						}, b.bind(k))
					} else
						S(b.bind(k));
				else
					k.setDirty()
			}
			function v(e) {
				var t,
				n,
				i = e.tags ? e.tags.join(", ") : "";
				return e.url && "https" === URI(e.url).protocol() ? n = "assets/av_default_bookmark_list_dark_https.png" : (t = e.iconUrl, n = "assets/av_default_bookmark_list_dark.png"), {
					title : e.title && e.title.length ? e.title : e.url,
					matchText : C,
					description : i,
					imageUrl : t,
					defaultImageUrl : n,
					multiSelectable : !0,
					a11yItemTitle : e.url,
					a11yDescriptionLabel : i ? a.translate(337, i) : ""
				}
			}
			function b(e) {
				(!x || x.isSearchEmpty() || 0 === e.length) && I.onEmptyContentsChanged(),
				I.replaceItems(e)
			}
			function E() {
				return !x || x.isSearchEmpty() ? {
					message : a.translate(335),
					imageUrl : "default"
				}
				 : {
					message : a.translate(102)
				}
			}
			var w,
			T,
			y,
			I,
			S,
			x,
			C,
			k;
			return k = {
				init : function (t, n) {
					w = t,
					T = e("screen/manager"),
					y = !0,
					n === e("plugins/screens/bookmarks_main/index") && (w.style.overflowY = "hidden");
					var o = function () {
						return a.translate(139)
					},
					s = {
						container : w,
						interactionHandler : g,
						screen : n,
						view : k,
						listToRowAdapter : v,
						itemComparator : i,
						getEmptyContents : E,
						title : o
					};
					I = e("ui/container/list/list").create(s),
					r.on("iris.bookmarks.creating", h.bind(this, "onCreating")),
					r.on("iris.bookmarks.update", h.bind(this, "onChanged")),
					r.on("iris.bookmarks.removed", h.bind(this, "onRemoved")),
					r.on("iris.history.visited", k.setDirty);
					var c = e("iris/tags");
					c.onChanged.addEventListener(h.bind(this, "all")),
					c.onRemoved.addEventListener(h.bind(this, "all")),
					r.on("application.systemLanguageChange", I.refreshRowAdapter.bind(this))
				},
				setDirty : function () {
					y = !0,
					I.setEmptyMessageVisible(!1)
				},
				becomingVisible : function () {
					if (y) {
						if (x) {
							var e = x.getSearchText();
							S({
								title : e,
								url : e,
								tag : e
							}, k.populateBookmarks.bind(k))
						} else
							S(k.populateBookmarks.bind(k));
						y = !1,
						r.emit("screen.blockAnimations", [], !0)
					}
				},
				setSearchBar : function (e) {
					x = e,
					k.searchInputChanged(x.getSearchText())
				},
				searchInputChanged : function (e) {
					S && (C = x.getPlainSearchText(), S({
							title : e,
							url : e,
							tag : e
						}, b.bind(k)))
				},
				setDataSource : function (e) {
					S != e && (S = e, k.setDirty())
				},
				editBookmark : function (e) {
					m.get(e.url, function (e) {
						var t = T.loadSheet("edit_bookmark");
						t.setContext(e),
						T.pushScreen(t)
					})
				},
				deleteBookmarks : function (e) {
					m.removeBookmarks(e)
				},
				populateBookmarks : function (e) {
					I.clear(),
					I.addItems(e),
					r.emit("screen.unblockAnimations", [], !0)
				},
				getListBuilder : function () {
					return I
				},
				completePendingDelete : function () {
					I && I.completePendingDelete()
				},
				getItems : function () {
					return I.getItems()
				},
				getNodes : function () {
					return I.getElements()
				},
				selectMoreDelete : function () {
					return f
				},
				selectMoreOpen : function () {
					return s.loadUrlsInNewTabs
				}
			},
			k.init(t, n),
			k
		}
		var r = e("iris/event"),
		a = e("iris/i18n"),
		o = e("iris/clipboard"),
		s = e("iris/utils"),
		c = e("iris/invoke.utils"),
		l = e("iris/history"),
		d = e("ui/interactionController"),
		u = e("plugins/screens/selectmore/index"),
		m = e("iris/bookmarks"),
		f = {
			create : function (e, t) {
				return new i(e, t)
			}
		};
		n.exports = f
	}), define("plugins/views/history_date_list/index", function (e, t, n) {
		function i(e) {
			I && I(e)
		}
		function r(e, t) {
			return e.id === t.id
		}
		function a(e) {
			var t,
			n,
			i,
			r;
			if (e.type)
				switch (e.type) {
				case L.bandType.TODAY:
					t = k.translate(338),
					n = k.format(e.date, "M");
					break;
				case L.bandType.YESTERDAY:
					t = k.translate(339),
					n = k.format(e.date, "M");
					break;
				case L.bandType.DAY:
					t = k.format(e.date, "dddd"),
					n = k.format(e.date, "M");
					break;
				case L.bandType.WEEK:
					t = k.translate(186);
					break;
				case L.bandType.MONTH:
					t = k.format(e.date, "MMMM");
					break;
				case L.bandType.EVERYTHING_BEFORE_DATE:
					t = k.translate(187)
				}
			else
				e.url && "https" === URI(e.url).protocol() ? r = "assets/av_default_history_list_dark_https.png" : (i = e.iconUrl, r = "assets/av_default_history_list_dark.png"), t = e.title.length ? e.title : k.translate(58), n = e.url;
			return {
				title : t,
				description : n,
				imageUrl : i,
				defaultImageUrl : r,
				multiSelectable : !0
			}
		}
		function o() {
			for (var t = L.getDateBands(), n = [], r = 0; t.length > r; r++)
				n.push(t[r].span.startTime), n.push(t[r].span.endTime);
			e("iris/history").getHistoryDates(n, !1, function (e) {
				for (var n = [], r = 0; e.length > r; r++)
					t[r].id = r, 0 !== e[r].HAS_RESULTS && n.push(t[r]);
				0 === n.length && T.onEmptyContentsChanged(),
				N = new Date,
				T.clear(),
				i({
					disable : 0 === n.length
				}),
				T.addItems(n),
				x.emit("screen.unblockAnimations", [], !1)
			}),
			w = !1
		}
		function s(e) {
			var t = [];
			e.forEach(function (e) {
				t.push({
					startTime : e.span.startTime,
					endTime : e.span.endTime
				})
			}),
			C.deleteVisits(t),
			i({
				disable : T.isEmpty()
			})
		}
		function c() {
			i({
				disable : !1
			})
		}
		function l(t) {
			var n = L.getDateBands(N),
			r = [];
			t.forEach(function (e) {
				n.forEach(function (t) {
					r.push(t.span.startTime),
					r.push(t.span.endTime),
					r.push(e.span.startTime),
					r.push(e.span.endTime)
				})
			}),
			e("iris/history").getHistoryDates(r, !0, function (e) {
				for (var t = [], n = T.getItems(), r = 0; n.length > r; r++)
					0 === e[n[r].id].HAS_RESULTS && t.push(n[r]);
				i({
					disable : !0
				}),
				T.animateDelete(t, k.translate(340), s, c)
			})
		}
		function d(t) {
			T.getItems().length === t.length && T.onEmptyContentsChanged(),
			!y || y.isSearchEmpty() ? l(t) : T.animateDelete(t, k.translate(340), e("iris/history").deleteVisits)
		}
		function u(e) {
			0 === e.length && T.onEmptyContentsChanged(),
			i({
				disable : 0 === e.length
			}),
			T.replaceItems(e),
			x.emit("screen.unblockAnimations", [], !1)
		}
		function m() {
			x.emit("screen.blockAnimations", [], !0),
			i({
				hide : y && !y.isSearchEmpty()
			}),
			!y || y.isSearchEmpty() ? o() : e("iris/history").getUniqueHistoryVisits({
				title : y.getSearchText(),
				url : y.getSearchText()
			}, u.bind(S))
		}
		function f() {
			return !y || y.isSearchEmpty() ? {
				message : k.translate(341),
				imageUrl : "default"
			}
			 : {
				message : k.translate(102)
			}
		}
		function p(e) {
			var t = E.loadSheet("edit_bookmark");
			t.setContext(e.bookmark),
			E.pushScreen(t);
			var n = function (t) {
				e.bookmark = t
			};
			x.on("iris.bookmarks.update", n),
			x.once("manager.screen", function () {
				x.un("iris.bookmarks.update", n)
			}, [t, "becomingPopped"])
		}
		function g(t) {
			e("iris/bookmarks").addWithToast({
				title : t.title,
				url : t.url
			}, function (e) {
				t.bookmark = e
			})
		}
		function h(e) {
			D.show({
				view : S,
				contextItem : e,
				allItems : S.getItems(),
				nodes : S.getNodes(),
				deleteFunction : S.selectMoreDelete(),
				openFunction : S.selectMoreOpen()
			})
		}
		function v(e, t) {
			if (e !== A.interactionType.click || y && !y.isSearchEmpty()) {
				if (e === A.interactionType.click && y && !y.isSearchEmpty())
					E.rollBackToScreen(E.homeScreen()), _.loadUrlInCurrentTab(t.url, C.TRANSITIONS.HISTORY);
				else if (e === A.interactionType.hold) {
					var n = {
						items : []
					};
					if (!y || y.isSearchEmpty()) {
						var i = a(t);
						n.contextType = "historyDateBand",
						n.headText = i.title,
						i.description && (n.subheadText = i.description)
					} else
						n.headText = t.title.length ? t.title : k.translate(58), n.subheadText = t.url, t.bookmark ? n.items.push({
							imageUrl : "assets/ic_edit_bookmarks.png",
							name : k.translate(121),
							callback : p.bind(this, t)
						}) : n.items.push({
							imageUrl : "assets/ic_add_bookmark.png",
							name : k.translate(120),
							callback : g.bind(this, t)
						}), n.items.push({
							imageUrl : "assets/ic_open_link_new_tab.png",
							name : k.translate(308),
							callback : _.loadUrlsInNewTabs.bind(this, [t])
						}), n.items.push({
							imageUrl : "assets/ic_copy_link.png",
							name : k.translate(309),
							callback : O.copyTextToClipboard.bind(this, t.url)
						}), R.addMenuItems(n.items, t.url, t.title);
					n.items.push({
						imageUrl : "assets/ic_select_more.png",
						name : k.translate(336),
						callback : h.bind(this, t)
					}),
					n.items.push({
						imageUrl : "assets/ic_delete.png",
						name : k.translate(178),
						callback : d.bind(this, [t]),
						isDelete : !0
					}),
					E.activateContextMenu(n)
				}
			} else {
				var r = E.loadScreen("history_items");
				r.setContext(t),
				E.pushScreen(r)
			}
		}
		var b,
		E,
		w,
		T,
		y,
		I,
		S,
		x = e("iris/event"),
		C = e("iris/history"),
		k = e("iris/i18n"),
		A = e("ui/interactionController"),
		N = new Date,
		L = e("iris/date.band.builder"),
		_ = e("iris/utils"),
		R = e("iris/invoke.utils"),
		O = e("iris/clipboard"),
		D = e("plugins/screens/selectmore/index");
		S = {
			init : function (t) {
				b = t,
				E = e("screen/manager"),
				w = !0,
				x.on("iris.history.visitRemoved", S.setDirty),
				x.on("iris.history.visited", S.setDirty),
				b.style.overflowY = "hidden";
				var n = function () {
					return k.translate(184)
				},
				i = {
					container : b,
					interactionHandler : v,
					screen : e("plugins/screens/history_date/index"),
					view : S,
					listToRowAdapter : a,
					itemComparator : r,
					getEmptyContents : f,
					title : n
				};
				T = e("ui/container/list/list").create(i),
				x.on("application.systemLanguageChange", m)
			},
			becomingVisible : function () {
				i({
					hide : y && !y.isSearchEmpty(),
					disable : T.isEmpty()
				});
				var e = new Date,
				t = e.getDate() != N.getDate() || e.getMonth() != N.getMonth() || e.getFullYear() != N.getFullYear();
				(w || t) && m()
			},
			setSearchBar : function (e) {
				y = e
			},
			searchInputChanged : function () {
				m()
			},
			setDirty : function () {
				w = !0;
				var t = E.isScreenPushed(e("plugins/screens/history_date/index"));
				t ? m() : (T.setEmptyMessageVisible(!1), T.clear(), i({
						disable : !0
					}))
			},
			getListItemBuilder : function () {
				return T
			},
			setClearStateFunction : function (e) {
				I = e
			},
			getItems : function () {
				return T.getItems()
			},
			getNodes : function () {
				return T.getElements()
			},
			selectMoreDelete : function () {
				return d
			},
			selectMoreOpen : function () {
				return !y || y.isSearchEmpty() ? void 0 : _.loadUrlsInNewTabs
			}
		},
		n.exports = S
	}), define("plugins/views/history_item_list/index", function (e, t, n) {
		function i(e) {
			S && S(e)
		}
		function r(e, t) {
			return e.id === t.id
		}
		function a(e) {
			var t,
			n;
			return e.url && "https" === URI(e.url).protocol() ? n = "assets/av_default_history_list_dark_https.png" : (t = e.iconUrl, n = "assets/av_default_history_list_dark.png"), {
				title : e.title && e.title.length ? e.title : A.translate(58),
				description : e.url,
				imageUrl : t,
				defaultImageUrl : n,
				multiSelectable : !0
			}
		}
		function o() {
			if (!T) {
				T = !0;
				var t = E.isScreenPushed(e("plugins/screens/history_items/index"));
				t || (y.clear(), y.setEmptyMessageVisible(!1), i({
						disable : !0
					}))
			}
		}
		function s(e) {
			k.deleteUrlsInRange(e, w.span.startTime, w.span.endTime),
			i({
				disable : y.isEmpty()
			})
		}
		function c() {
			i({
				disable : !1
			})
		}
		function l(e) {
			y.getItems().length === e.length && y.onEmptyContentsChanged(),
			i({
				disable : !0
			}),
			y.animateDelete(e, A.translate(340), s, c)
		}
		function d(e) {
			O.show({
				view : x,
				contextItem : e,
				allItems : x.getItems(),
				nodes : x.getNodes(),
				deleteFunction : x.selectMoreDelete(),
				openFunction : x.selectMoreOpen()
			})
		}
		function u(e) {
			(!I || I.isSearchEmpty() || 0 === e.length) && y.onEmptyContentsChanged(),
			i({
				disable : 0 === e.length
			}),
			y.replaceItems(e),
			C.emit("screen.unblockAnimations", [], !0)
		}
		function m(t, n) {
			C.emit("screen.blockAnimations", [], !0);
			var r = {};
			w.span.endTime && (r.endTime = w.span.endTime),
			w.span.startTime && (r.startTime = w.span.startTime),
			t && (r.title = t, r.url = t),
			i({
				hide : I && !I.isSearchEmpty()
			}),
			e("iris/history").getUniqueHistoryVisits(r, n)
		}
		function f() {
			w && m(I ? I.getSearchText() : "", function (e) {
				i({
					disable : 0 === e.length
				}),
				y.replaceItems(e),
				C.emit("screen.unblockAnimations", [], !0)
			})
		}
		function p() {
			return !I || I.isSearchEmpty() ? {
				message : A.translate(341),
				imageUrl : "default"
			}
			 : {
				message : A.translate(102)
			}
		}
		function g(e) {
			var t = E.loadSheet("edit_bookmark");
			t.setContext(e.bookmark),
			E.pushScreen(t);
			var n = function (t) {
				e.bookmark = t
			};
			C.on("iris.bookmarks.update", n),
			C.once("manager.screen", function () {
				C.un("iris.bookmarks.update", n)
			}, [t, "becomingPopped"])
		}
		function h(t) {
			t.pendingBookmarkAdd = !0,
			e("iris/bookmarks").addWithToast({
				title : t.title,
				url : t.url
			}, function (e) {
				t.bookmark = e,
				t.pendingBookmarkAdd = !1
			}, function () {
				t.pendingBookmarkAdd = !1
			})
		}
		function v(e, t) {
			if (e === N.interactionType.click)
				E.rollBackToScreen(E.homeScreen()), _.loadUrlInCurrentTab(t.url, k.TRANSITIONS.HISTORY), C.emit("history.selectHistoryItem", [t.url], !0);
			else if (e === N.interactionType.hold) {
				var n = {
					contextType : "historyItem",
					headText : t.title.length ? t.title : A.translate(58),
					subheadText : t.url,
					items : []
				};
				t.bookmark && n.items.push({
					imageUrl : "assets/ic_edit_bookmarks.png",
					name : A.translate(121),
					callback : g.bind(this, t)
				}),
				t.bookmark || t.pendingBookmarkAdd || n.items.push({
					imageUrl : "assets/ic_add_bookmark.png",
					name : A.translate(120),
					callback : h.bind(this, t)
				}),
				n.items.push({
					imageUrl : "assets/ic_open_link_new_tab.png",
					name : A.translate(308),
					callback : _.loadUrlsInNewTabs.bind(this, [t])
				}),
				n.items.push({
					imageUrl : "assets/ic_copy_link.png",
					name : A.translate(309),
					callback : L.copyTextToClipboard.bind(this, t.url)
				}),
				n.items.push({
					imageUrl : "assets/ic_select_more.png",
					name : A.translate(336),
					callback : d.bind(this, t)
				}),
				n.items.push({
					imageUrl : "assets/ic_delete.png",
					name : A.translate(178),
					callback : l.bind(this, [t]),
					isDelete : !0
				}),
				R.addMenuItems(n.items, t.url, t.title),
				E.activateContextMenu(n)
			}
		}
		var b,
		E,
		w,
		T,
		y,
		I,
		S,
		x,
		C = e("iris/event"),
		k = e("iris/history"),
		A = e("iris/i18n"),
		N = e("ui/interactionController"),
		L = e("iris/clipboard"),
		_ = e("iris/utils"),
		R = e("iris/invoke.utils"),
		O = e("plugins/screens/selectmore/index");
		x = {
			init : function (t) {
				b = t,
				E = e("screen/manager"),
				T = !0,
				C.on("iris.history.visitRemoved", o),
				C.on("iris.history.visited", o),
				C.on("url.screenshot.onUpdated", o),
				C.on("iris.bookmarks.creating", o),
				C.on("iris.bookmarks.update", o),
				C.on("iris.bookmarks.removed", o),
				b.style.overflowY = "hidden";
				var n = function () {
					return A.translate(184)
				},
				i = {
					container : b,
					interactionHandler : v,
					screen : e("plugins/screens/history_items/index"),
					view : x,
					listToRowAdapter : a,
					itemComparator : r,
					getEmptyContents : p,
					title : n
				};
				y = e("ui/container/list/list").create(i),
				C.on("application.systemLanguageChange", f)
			},
			setContext : function (e) {
				w != e && (w = e, o())
			},
			setSearchBar : function (e) {
				I = e
			},
			searchInputChanged : function (e) {
				m(e, u)
			},
			becomingVisible : function () {
				if (!w)
					throw Error("history_item_list view is becoming visible  without any context!");
				T && (T = !1, m(I ? I.getSearchText() : "", x.populate.bind(x)))
			},
			populate : function (e) {
				i({
					disable : 0 === e.length
				}),
				y.clear(),
				y.addItems(e),
				C.emit("screen.unblockAnimations", [], !0)
			},
			getListItemBuilder : function () {
				return y
			},
			setClearStateFunction : function (e) {
				S = e
			},
			getItems : function () {
				return y.getItems()
			},
			getNodes : function () {
				return y.getElements()
			},
			selectMoreDelete : function () {
				return l
			},
			selectMoreOpen : function () {
				return _.loadUrlsInNewTabs
			}
		},
		n.exports = x
	}), define("plugins/views/labeled_bookmarks_list/index", function (e, t, n) {
		function i(e) {
			g.animateDelete(e, e.length > 1 ? E.translate(343) : E.translate(342), m.deleteLabels)
		}
		function r(e) {
			T.show({
				view : m,
				contextItem : e,
				allItems : m.getItems(),
				nodes : m.getNodes(),
				deleteFunction : m.selectMoreDelete()
			})
		}
		function a(e, t) {
			if (e == y.interactionType.click) {
				var n = p.loadScreen("tagged_bookmarks");
				n.setContext(t.name),
				p.pushScreen(n)
			} else
				e == y.interactionType.hold && p.activateContextMenu({
					contextType : "bookmarkTag",
					headText : t.name,
					subheadText : t.count,
					items : [{
							imageUrl : "assets/ic_edit_tag.png",
							name : E.translate(181),
							callback : m.editLabel.bind(this, t)
						}, {
							imageUrl : "assets/ic_select_more.png",
							name : E.translate(336),
							callback : r.bind(this, t)
						}, {
							imageUrl : "assets/ic_delete.png",
							name : E.translate(178),
							callback : i.bind(this, [t]),
							isDelete : !0
						}
					]
				})
		}
		function o(t, n) {
			var i = e("plugins/screens/bookmarks_main/index");
			"onChanged" == t ? g.update(n) : "onRemoved" == t ? g.remove([n]) : "all" == t && p.isScreenPushed(i) ? (b.emit("screen.blockAnimations", [], !0), w.getTagHistogram(v ? v.getSearchText() : "%%", m.populate)) : m.setDirty()
		}
		function s(e, t) {
			return e.id === t.id
		}
		function c(e) {
			return {
				title : e.name,
				description : e.count,
				listItemClass : "bookmark_listItem tag-list-item",
				multiSelectable : !0,
				a11yDescriptionLabel : 1 === e.count ? E.translate(345) : E.translate(344, e.count)
			}
		}
		function l() {
			g.refreshRowAdapter()
		}
		function d() {
			return !v || v.isSearchEmpty() ? {
				message : E.translate(346),
				imageUrl : "default"
			}
			 : {
				message : E.translate(102)
			}
		}
		function u(e) {
			(!v || v.isSearchEmpty() || 0 === e.length) && g.onEmptyContentsChanged(),
			g.replaceItems(e)
		}
		var m,
		f,
		p,
		g,
		h,
		v,
		b = e("iris/event"),
		E = e("iris/i18n"),
		w = e("iris/tags"),
		T = e("plugins/screens/selectmore/index"),
		y = e("ui/interactionController");
		m = {
			init : function (t) {
				f = t,
				p = e("screen/manager");
				var n = function () {
					return E.translate(347)
				},
				i = {
					container : f,
					interactionHandler : a,
					screen : e("plugins/screens/bookmarks_main/index"),
					view : m,
					listToRowAdapter : c,
					itemComparator : s,
					getEmptyContents : d,
					title : n
				};
				g = e("ui/container/list/list").create(i),
				h = !0,
				w.onCreated.addEventListener(o.bind(this, "onCreated")),
				w.onChanged.addEventListener(o.bind(this, "onChanged")),
				w.onRemoved.addEventListener(o.bind(this, "onRemoved")),
				b.on("iris.bookmarks.update", o.bind(this, "all")),
				b.on("iris.bookmarks.removed", o.bind(this, "all")),
				b.on("application.systemLanguageChange", l)
			},
			becomingVisible : function () {
				h && (w.getTagHistogram(v ? v.getSearchText() : "%%", m.populate), h = !1, b.emit("screen.blockAnimations", [], !0))
			},
			setSearchBar : function (e) {
				v = e,
				m.searchInputChanged(v.getSearchText())
			},
			searchInputChanged : function (e) {
				w.getTagHistogram(e, u)
			},
			setDirty : function () {
				h = !0,
				g.setEmptyMessageVisible(!1)
			},
			editLabel : function (e) {
				var t = p.loadSheet("edit_label");
				t.setContext(e),
				p.pushScreen(t)
			},
			deleteLabels : function (e) {
				w.remove(e)
			},
			populate : function (e) {
				g.clear(),
				g.addItems(e),
				b.emit("screen.unblockAnimations", [], !0)
			},
			getItems : function () {
				return g.getItems()
			},
			getNodes : function () {
				return g.getElements()
			},
			selectMoreDelete : function () {
				return i
			}
		},
		n.exports = m
	}), define("plugins/views/new_tab_page/index", function (e, t, n) {
		function i() {
			return S.front.gridItemBuilder.getContextItem() || B.isPossiblyScrolling() || S.isSwapping || S.isDeleting || U.isVisible()
		}
		function r(e) {
			return i() ? (B.isPossiblyScrolling() && x.once("scrollDetector.scrollEnded", a), S.pendingData = e, void 0) : (delete S.pendingData, S.back.gridItemBuilder.clear(), S.back.gridItemBuilder.addItems(e), O.transitionWithTimeout(S.front.viewDiv, function () {
					S.back.viewDiv.classList.remove("back-buffer"),
					S.back.viewDiv.classList.remove("not-visible"),
					S.front.viewDiv.classList.add("back-buffer");
					var e = S.front;
					S.front = S.back,
					S.back = e
				}, I + 100, function () {
					S.back.viewDiv.classList.add("not-visible"),
					S.isSwapping = !1,
					a()
				}), F = e, void 0)
		}
		function a() {
			S.pendingData && r(S.pendingData)
		}
		function o(e) {
			var t = [];
			e.forEach(function (e) {
				e.bookmarkTitle && t.push(e)
			}),
			k.removeBookmarks(t),
			C.deleteUrlsInRange(e),
			S.isDeleting = !1
		}
		function s(e) {
			S.front.gridItemBuilder.getItems().length === e.length && S.front.gridItemBuilder.onEmptyContentsChanged(),
			S.isDeleting = !0,
			1 === e.length ? e[0].bookmarkTitle ? S.front.gridItemBuilder.animateDelete(e, A.translate(333), o) : S.front.gridItemBuilder.animateDelete(e, A.translate(340), o) : S.front.gridItemBuilder.animateDelete(e, A.translate(348), o)
		}
		function c(e) {
			U.show({
				view : E,
				contextItem : e,
				allItems : E.getItems(),
				nodes : E.getNodes(),
				deleteFunction : E.selectMoreDelete(),
				openFunction : E.selectMoreOpen(),
				isGrid : !0
			})
		}
		function l(t, n) {
			if (t == M.interactionType.click)
				x.emit("newtab.select", [F.indexOf(n), n.url, !!n.bookmarkTitle, !!n.iconUrl, Math.round((Date.now() - n.lastVisited) / 36e5)]), L.loadUrlInCurrentTab(n.url, n.bookmarkTitle ? C.TRANSITIONS.BOOKMARK : C.TRANSITIONS.HISTORY), e("screen/manager").rollBackToScreen(e("screen/manager").homeScreen());
			else if (t == M.interactionType.hold) {
				var i = {};
				i.contextType = "frecentItem",
				i.headText = n.title && n.title.length ? n.title : A.translate(58),
				i.subheadText = n.url,
				i.items = [],
				i.items.push({
					imageUrl : "assets/ic_open_link_new_tab.png",
					name : A.translate(308),
					callback : L.loadUrlsInNewTabs.bind(this, [n])
				}),
				i.items.push({
					imageUrl : "assets/ic_copy_link.png",
					name : A.translate(309),
					callback : N.copyTextToClipboard.bind(this, n.url)
				}),
				i.items.push({
					imageUrl : "assets/ic_select_more.png",
					name : A.translate(336),
					callback : c.bind(this, n)
				}),
				i.items.push({
					imageUrl : "assets/ic_delete.png",
					name : n.bookmarkTitle ? A.translate(349) : A.translate(350),
					callback : s.bind(this, [n]),
					isDelete : !0
				}),
				R.addMenuItems(i.items, n.url, n.title),
				T.activateContextMenu(i)
			} else
				t == M.interactionType.clearSelection && a()
		}
		function d(e, t) {
			return e.url === t.url
		}
		function u(e) {
			var t,
			n = "";
			e.bookmarkTitle && e.bookmarkTitle.length ? n = e.bookmarkTitle : e.title && e.title.length && (n = e.title),
			t = L.truncateUrl(e.url);
			var i;
			return i = e.url && "https" === URI(e.url).protocol() ? "assets/start_page_default_https.png" : e.iconUrl, {
				title : n,
				subTitle : t,
				imageUrl : i,
				defaultImageUrl : "assets/start_page_default.png",
				gridItemClass : "new-tab-page",
				multiSelectable : !0,
				a11yRole : "link",
				a11yTitle : n
			}
		}
		function m(e) {
			if (!F)
				return !0;
			if (F.length != e.length)
				return !0;
			for (var t = !1, n = 0; F.length > n; n++)
				if (!e[n] || e[n].url !== F[n].url || e[n].iconUrl != F[n].iconUrl) {
					t = !0;
					break
				}
			return t
		}
		function f() {
			return _.isNSeries() ? {
				count : 9,
				width : 178,
				height : 178
			}
			 : _.isLSeries() && _.isPortrait() ? {
				count : 8,
				width : 381,
				height : 381
			}
			 : _.isLSeries() ? {
				count : 8,
				width : 319,
				height : 319
			}
			 : _.isASeries() && _.isPortrait() ? {
				count : 8,
				width : 357,
				height : 357
			}
			 : _.isASeries() ? {
				count : 8,
				width : 319,
				height : 319
			}
			 : _.isWSeries() ? {
				count : 9,
				width : 345,
				height : 345
			}
			 : _.isClassic() ? {
				count : 9,
				width : 178,
				height : 178
			}
			 : void 0
		}
		function p() {
			return T && T.currentScreen() === w && (T.getViewState(E) === T.viewStates.PUSHED || T.getViewState(E) === T.viewStates.PUSHING)
		}
		function g() {
			var t = document.createElement("div"),
			n = function () {
				return A.translate(89)
			},
			i = {
				container : t,
				interactionHandler : l,
				view : E,
				itemToCellAdapter : u,
				itemComparator : d,
				title : n,
				delayImageLoading : !1
			},
			r = e("ui/container/grid/grid").create(i);
			return {
				gridItemBuilder : r,
				viewDiv : t
			}
		}
		function h(e) {
			var t = {
				front : g(),
				back : g()
			};
			return t.front.viewDiv.className = "new-tab-buffer",
			t.back.viewDiv.className = "new-tab-buffer back-buffer",
			I = D.getTiming(D.VIEW_CONTENT_CROSS_FADE),
			t.front.viewDiv.style.webkitTransition = "opacity " + I + "ms linear",
			t.back.viewDiv.style.webkitTransition = "opacity " + I + "ms linear",
			e.appendChild(t.front.viewDiv),
			e.appendChild(t.back.viewDiv),
			t
		}
		function v() {
			document.getElementById("private-mode-container").children[1].innerText = A.translate(288),
			document.getElementById("private-mode-container").lastChild.innerText = A.translate(351)
		}
		function b(e) {
			var t = document.createElement("div");
			t.id = "private-mode-container",
			t.className = "private-mode-container hidden";
			var n = document.createElement("img");
			n.src = "assets/private_browsing_default_image.png",
			t.appendChild(n);
			var i = document.createElement("div");
			i.className = "private-mode-message font-size-l",
			t.appendChild(i);
			var r = document.createElement("div");
			return r.classList.add("private-mode-message"),
			t.appendChild(r),
			e.appendChild(t),
			v(),
			x.on("application.systemLanguageChange", v),
			t
		}
		var E,
		w,
		T,
		y,
		I,
		a,
		S,
		x = e("iris/event"),
		C = e("iris/history"),
		k = e("iris/bookmarks"),
		A = e("iris/i18n"),
		N = e("iris/clipboard"),
		L = e("iris/utils"),
		_ = e("iris/device"),
		R = e("iris/invoke.utils"),
		O = e("ui/utils"),
		D = e("ui/animationTimings"),
		B = e("ui/scroll.detector"),
		M = e("ui/interactionController"),
		P = e("iris/application"),
		U = e("plugins/screens/selectmore/index"),
		F = [],
		H = e("iris/tabs/controller"),
		V = "new-tab-frecencies";
		E = {
			init : function (t, n) {
				try {
					w = n,
					t.classList.add("background"),
					T = e("screen/manager"),
					y = !0;
					var i = {
						itemWidth : function () {
							return f().width
						},
						itemHeight : function () {
							return f().height
						},
						canSetGridContainerHeight : function () {
							return !1
						}
					};
					S = h(t),
					S.back.gridItemBuilder.overrideDomController(i),
					S.front.gridItemBuilder.overrideDomController(i)
				} catch (r) {
					console.log("Error: " + r.message + " " + r.stack)
				}
				x.on("iris.history.visited", E.setDirty),
				x.on("urls.removed", E.setDirty),
				x.on("webpage.screen.capture.updated", E.setDirty),
				x.on("url.screenshot.onUpdated", E.setDirty),
				x.on("iris.swoop.completed", E.setDirty),
				x.on("manager.screen", function () {
					T.getViewState(E) === T.viewStates.PUSHED && E.becomingVisible()
				}, [n, "uncovered"]),
				P.setManagedExit(!0),
				x.on("application.exit", function () {
					e("iris/storage").topUrls(function (e) {
						L.toLocal(V, JSON.stringify(e)),
						console.log("New Tab done persisting frecencies. Now you have my permission to exit."),
						P.exit()
					})
				}),
				x.on("KeyboardRequestedEvent", function (e, t, n) {
					t = JSON.parse(t),
					n.setPreventDefault = e !== iris.chromeId && t.show && p()
				})
			},
			togglePrivateBrowsing : function (e) {
				if (e) {
					var t = document.getElementById("private-mode-container");
					t || (t = b(E.domElement)),
					t.classList.remove("hidden"),
					S.front.viewDiv.classList.add("hidden"),
					S.back.viewDiv.classList.add("hidden")
				} else
					document.getElementById("private-mode-container").classList.add("hidden"), S.front.viewDiv.classList.remove("hidden"), S.back.viewDiv.classList.remove("hidden")
			},
			setDirty : function () {
				y = !0,
				p() && E.becomingVisible(!0)
			},
			becomingVisible : function (t) {
				if (y) {
					var n = !t && F.length;
					n && x.emit("screen.blockAnimations", [], !0);
					var i = L.fromLocal(V);
					if (i) {
						console.log("Populating New Tab view from local storage."),
						localStorage.removeItem(V);
						try {
							E.populateFrecency(n, i)
						} catch (r) {
							console.error("Unable to populate New Tab view from local storage, falling back to DB. Error: " + r),
							e("iris/storage").topUrls(E.populateFrecency.bind(this, n))
						}
					} else
						e("iris/storage").topUrls(E.populateFrecency.bind(this, n))
				}
			},
			populateFrecency : function (e, t) {
				y = !1,
				t = t.slice(0, f().count);
				for (var n = H.getTabsByUrl(), i = 0; t.length > i; i++) {
					var a = n[t[i].url];
					if (a && a.webpage && a.webpage.getCurrentScreenCapture()) {
						var o = {};
						L.extend(o, t[i]),
						o.iconUrl = a.webpage.getCurrentScreenCapture(),
						t[i] = o
					}
				}
				m(t) && r(t),
				e && x.emit("screen.unblockAnimations", [], !0)
			},
			getItems : function () {
				return F
			},
			getNodes : function () {
				return S.front.gridItemBuilder.getElements()
			},
			selectMoreDelete : function () {
				return s
			},
			selectMoreOpen : function () {
				return L.loadUrlsInNewTabs
			},
			selectMoreIsGrid : function () {
				return !0
			},
			isVisible : function () {
				return p()
			}
		},
		n.exports = E
	}), define("plugins/woggle/index", function (e, t, n) {
		function i(e, t) {
			function n(e) {
				a.stopEvent(e);
				var t;
				Array.prototype.some.call(e.touches, function (e) {
					return e.identifier === l ? (t = e.screenX, !0) : void 0
				}),
				void 0 !== t && (m &= t - c > .1 * u, d = Math.max(0, Math.min(s + (t - c), u)), p.style.webkitTransform = "translateX(" + d + "px) translateZ(0)")
			}
			function i(e) {
				u = f.getBoundingClientRect().width / 2,
				s = f.classList.contains("toggle-selected") ? u : 0,
				c = e.touches[0].screenX,
				l = e.touches[0].identifier,
				h.classList.add("toggle-touch"),
				f.addEventListener("touchmove", n),
				p.style.webkitTransition = "none",
				m = !0
			}
			function o(t) {
				h.classList.remove("toggle-touch"),
				f.removeEventListener("touchmove", n),
				p.style.webkitTransform = "",
				p.style.webkitTransition = "",
				r.setToggle(e, m ? !e.checked : d > u / 2),
				t.preventDefault()
			}
			var s,
			c,
			l,
			d,
			u,
			m,
			f = document.createElement("div"),
			p = document.createElement("div"),
			g = document.createElement("div"),
			h = document.createElement("div");
			e.classList.add("hidden"),
			e.parentElement.setAttribute("role", "checkbox"),
			f.className = "toggle-track" + (e.checked ? " toggle-selected soft-accent-colour-background" : ""),
			f.setAttribute("aria-hidden", "true"),
			f.dir = "ltr",
			e.parentElement.appendChild(f),
			p.className = "toggle-handle",
			f.appendChild(p),
			g.className = "toggle-symbol",
			p.appendChild(g),
			h.className = "toggle-aura",
			p.appendChild(h),
			e.addEventListener("change", function () {
				e.checked ? (f.classList.add("toggle-selected"), f.classList.add("soft-accent-colour-background")) : (f.classList.remove("toggle-selected"), f.classList.remove("soft-accent-colour-background")),
				e.parentElement.setAttribute("aria-checked", e.checked)
			}),
			t && t.addEventListener("click", function () {
				r.setToggle(e, !e.checked)
			}),
			f.addEventListener("touchstart", i),
			f.addEventListener("touchend", o)
		}
		var r,
		a = e("ui/utils");
		r = {
			createToggle : function (e, t) {
				return new i(e, t)
			},
			setToggle : function (e, t) {
				var n = document.createEvent("HTMLEvents");
				n.initEvent("change", !0, !0),
				e.checked = t,
				e.dispatchEvent(n)
			}
		},
		n.exports = r
	}), define("screen/animationCoordinator", function (e, t, n) {
		function i() {
			if (0 === l)
				for (var e; e = c.shift(); )
					e()
		}
		function r() {
			if (l--, 0 > l)
				throw Error("Attempt to unblock animations when there are none");
			i()
		}
		function a() {
			l++
		}
		var o,
		s = e("iris/event"),
		c = [],
		l = 0;
		o = {
			forceLayout : function () {
				return document.body.clientHeight
			},
			appendAnimation : function (e) {
				c.push(e)
			},
			animate : function () {
				i()
			}
		},
		s.on("screen.blockAnimations", a),
		s.on("screen.unblockAnimations", r),
		n.exports = o
	}), define("screen/manager", function (e, t, n) {
		function i(e, t, n, i) {
			return t !== F.OPENED ? (console.error(i), void 0) : (n.domElement.style.height = e + "px", n.domElement.style.paddingBottom = window.screen.height - e + "px", H.scrollIntoViewIfNecessary(document.activeElement), void 0)
		}
		function r() {
			i(F.currentPosition() - U.barHeight(), F.currentState(), O.currentScreen())
		}
		function a() {
			D.once("keyboard.position", function (e, t) {
				i(e, t, O.currentScreen(), "Didn't unregister event when keyboard was closed.")
			})
		}
		function o(e) {
			e = e || O.currentScreen(),
			e.domElement.style.height = "",
			e.domElement.style.paddingBottom = "",
			D.un("application.rotate", a)
		}
		function s() {
			o(O.currentScreen())
		}
		function c(e) {
			R && (D.un("keyboard.position", R), R = void 0),
			R = function (t, n) {
				R = void 0,
				i(t, n, e || O.currentScreen(), "Didn't get keyboard position when the keyboard was opened. Did VKB change the order of events?")
			},
			D.once("keyboard.position", R),
			D.un("application.rotate", a),
			D.on("application.rotate", a)
		}
		function l(e, t) {
			return Math.abs(e.x - t.x || e.y - t.y)
		}
		function d(e) {
			return X + " " + e + "ms " + W.getCurve()
		}
		function u(e) {
			var t = 0,
			n = 0;
			switch (e) {
			case O.offscreenLocation.LEFT:
				t = -screen.width;
				break;
			case O.offscreenLocation.RIGHT:
				t = screen.width;
				break;
			case O.offscreenLocation.TOP:
				n = -screen.height;
				break;
			case O.offscreenLocation.BOTTOM:
				n = screen.height;
				break;
			case O.offscreenLocation.ONSCREEN:
			}
			return {
				x : t,
				y : n
			}
		}
		function m(e, t) {
			D.emit("manager.screen", [e, "stateChange", t, e.screenState], !0),
			e.screenState = t
		}
		function f(e) {
			m(e, O.screenStates.PUSHED),
			H.allowUserInteraction(),
			e.pushingScreen = !1,
			D.emit("manager.screen", [e, "loadTransitionEnd"], !1),
			e.domElement.style.webkitTransition = "",
			K.length > 1 && K[K.length - 2].domElement && K[K.length - 2].domElement.classList.add("not-visible"),
			setTimeout(function () {
				e.domElement.style.webkitTransition = Z
			}, 1)
		}
		function p(e) {
			H.allowUserInteraction(),
			e.domElement.style.webkitTransition = "",
			setTimeout(function () {
				m(e, O.screenStates.POPPED),
				D.emit("manager.screen", [e, "offscreen"], !0),
				e.domElement.classList.add("removed"),
				e.domElement.style.webkitTransition = Z,
				e.domElement.removeEventListener("webkitTransitionEnd", e.transitionEndListener),
				O.currentScreen() && D.emit("manager.screen", [O.currentScreen(), "visible"], !0),
				D.emit("manager.screen", [e, "unloadTransitionEnd"], !1),
				D.emit("manager.screen", [e, "hidden"], !0)
			}, 1)
		}
		function g(e, t) {
			e.viewState = O.viewStates.PUSHED,
			delete e.cancelPushed,
			t || H.allowUserInteraction(),
			D.emit("manager.view", [e, "loadTransitionEnd"], !1),
			e.domElement.style.webkitTransition = "",
			P.forceLayout(e.domElement),
			e.domElement.style.webkitTransition = et
		}
		function h(e, t) {
			e.viewState = O.viewStates.POPPED,
			delete e.cancelPopped,
			t || H.allowUserInteraction(),
			e.domElement.style.webkitTransition = "",
			P.forceLayout(e.domElement),
			e.domElement.classList.add("removed"),
			D.emit("manager.view", [e, "unloadTransitionEnd"], !1),
			e.domElement.style.webkitTransition = et
		}
		function v(e) {
			if (e.getActionBar) {
				var t = e.getActionBar();
				e.actionBar !== t && (e.actionBar = t, U.loadActionBar(e.actionBar))
			}
		}
		function b(e) {
			var t,
			n = u(e.offscreenLocation),
			i = u(O.offscreenLocation.ONSCREEN),
			r = W.getTiming(W.OUTGOING_PAGE, l(n, i)),
			a = d(r);
			K.length > 1 && (t = K[K.length - 2]),
			H.transitionWithTimeout(e.domElement, function () {
				t.setOverlayOpacity(!0, tt, r),
				e.domElement.style.webkitTransition = a,
				e.domElement.style[X] = O.offscreenLocation.ONSCREEN,
				F.currentState() !== F.CLOSED && F.currentState() !== F.CLOSING && c(e)
			}, r + 100, function () {
				t.setOverlayOpacity(!1, 0),
				f(e)
			}),
			D.emit("manager.screen", [e, "pushed"], !0),
			D.emit("manager.screen", [e, "visible"], !0),
			t && D.emit("manager.screen", [t, "hidden"], !0)
		}
		function E(e) {
			Y = e,
			document.getElementById("action-bar-area").style.zIndex = Y,
			document.getElementById("action-bar-tooltip-bar").style.zIndex = Y
		}
		function w(e) {
			var t = u(e.offscreenLocation),
			n = e.position || u(O.offscreenLocation.ONSCREEN),
			i = W.getTiming(W.OUTGOING_PAGE, l(t, n)),
			r = d(i);
			H.transitionWithTimeout(e.domElement, function () {
				e.domElement.style.webkitTransition = r,
				e.domElement.style[X] = e.offscreenLocation,
				delete e.position
			}, i + 100, function () {
				e.setOverlayOpacity(!1, 0),
				p(e),
				E(Y - 10)
			}),
			e.actionBar && U.popActionBar(i);
			var a = K.pop();
			O.currentScreen().domElement && O.currentScreen().domElement.classList.remove("hidden"),
			a != e && console.error("bad popping order when popping " + e.domElement.id),
			D.emit("manager.screen", [e, "popped"], !0),
			O.currentScreen() || document.getElementById("action-bar-area").classList.add("action-bar-hidden")
		}
		function T(e, t) {
			var n = function () {
				e.domElement.classList.remove(e.viewClass),
				D.emit("manager.view", [e, "added"], !0)
			};
			e.cancelPopped && e.cancelPopped(),
			t ? (n(), g(e, t)) : e.cancelPushed = H.transitionWithTimeout(e.domElement, n, $, g.bind(this, e, t)).cancel
		}
		function y(e, t) {
			var n = function () {
				e.domElement.classList.add(e.viewClass)
			};
			e.cancelPushed && e.cancelPushed(),
			t ? (n(), h(e, t)) : e.cancelPopped = H.transitionWithTimeout(e.domElement, n, $, h.bind(this, e, t)).cancel
		}
		function I(e, t) {
			var n = M.setMenuOptions(e);
			return t ? M.showContextMenu() : M.peekContextMenu(),
			n
		}
		function S(t, n) {
			q.invokePlatformMenuItem(t.action, t.invoke, n),
			e("plugins/screens/tab/index").contextMenuResponseHandler("Cancel")
		}
		function x(e, t) {
			V.getMenuItems(e.invokeQuery, function (n, i) {
				if (!i && Array.isArray(n.items)) {
					var r = n.items,
					a = [];
					r.forEach(function (t) {
						var i = {
							name : t.label ? t.label : e.name,
							callback : e.invokeQuery.callback ? e.invokeQuery.callback.bind(O, S.bind(O, t, n["inherited-target"])) : S.bind(O, t, n["inherited-target"]),
							imageUrl : t.icon ? "file://" + t.icon : e.imageUrl,
							disabled : e.disabled
						};
						a.push(i)
					}),
					M.add(a, t)
				}
			})
		}
		function C(t, n) {
			var i = t.invokeQuery,
			r = e("iris/utils");
			if ("bb.action.SHARE" === i.action && "text/plain" === i.mime)
				if (M.getCurrentWebViewId() === iris.chromeId) {
					if (0 === window.getSelection().rangeCount)
						return;
					i.data = r.base64Encode("" + window.getSelection()),
					x(t, n)
				} else {
					var a = r.generateAsyncId();
					D.on("StringResponse", function (e, a, o) {
						o && (i.data = r.base64Encode(o), x(t, n))
					}, [M.getCurrentWebViewId(), a]),
					qnx.callExtensionMethod("webview.requestSelectedText", M.getCurrentWebViewId(), a)
				}
			else
				x(t, n)
		}
		function k(e, t) {
			var n = [];
			e.items && (e.items = e.items.filter(function (e) {
						return e.invokeQuery ? (n.push(e), void 0) : !0
					}));
			var i = I(e, t);
			n.forEach(function (e) {
				C(e, i)
			})
		}
		function A(e, t) {
			if (z[e] && (O.isScreenPushed(z[e]) || z[e].pushingScreen))
				return console.warn("Cannot load screen : " + z[e].id + ", already in pushed stack"), z[screen];
			if (z[e]) {
				var n = z[e];
				return n.offscreenLocation != t && (n.domElement.style[X] = t, n.offscreenLocation = t, P.forceLayout(n.domElement)),
				n
			}
		}
		function N(t, n) {
			var i = document.getElementById(t);
			i || console.error("Screen Div Can't Be Found. This will not end well.");
			var r = e("plugins/screens/" + t + "/index");
			r.init(i),
			r.domElement = i,
			r.id = i.id,
			r.offscreenLocation = n,
			r.redirect = function (e, t) {
				H.redirect(i, e, t)
			},
			r.clearRedirect = function (e, t) {
				H.clearRedirect(i, e, t)
			};
			var a = document.createElement("div");
			return a.className = "background screen-overlay",
			r.domElement.appendChild(a),
			r.overlay = a,
			r.setOverlayOpacity = function (e, t, n) {
				r.overlay.style.webkitTransition = e ? "opacity " + (n || 0) + "ms ease-out" : "none",
				r.overlay.style.opacity = t,
				r.actionBar && r.actionBar.setOverlayOpacity(e, t, n)
			},
			z[t] = r,
			r.domElement.style[X] = n,
			P.forceLayout(r.domElement),
			r
		}
		function L(e) {
			e.cancelEndDragScreenTransitions && (e.cancelEndDragScreenTransitions(), delete e.cancelEndDragScreenTransitions)
		}
		var _,
		L,
		R,
		O,
		D = e("iris/event"),
		B = e("plugins/overflowmenu/index"),
		M = e("plugins/contextmenu/index"),
		P = e("screen/animationCoordinator"),
		U = e("plugins/actionbar/index"),
		F = e("iris/keyboard"),
		H = e("ui/utils"),
		V = e("iris/menu.service"),
		W = e("ui/animationTimings"),
		q = e("iris/invoke.utils"),
		G = e("iris/just.type"),
		K = [],
		z = {},
		Y = 10,
		j = 0,
		J = 300,
		X = "-webkit-transform",
		Z = X + " " + J + "ms ease-out",
		Q = 500,
		$ = Q + 200,
		et = X + " " + Q + "ms, opacity " + Q + "ms",
		tt = .7;
		O = {
			setHomeScreen : function (e) {
				K[0] = e,
				E(Y),
				e.domElement.style.zIndex = Y,
				v(e),
				U.pushActionBar(e.actionBar, 0)
			},
			homeScreen : function () {
				return K[0]
			},
			currentScreen : function () {
				return K[K.length - 1]
			},
			screenBelow : function (e) {
				return K[K.indexOf(e) - 1]
			},
			pushScreen : function (t) {
				if (O.isScreenPushed(t) || O.currentScreen().pushingScreen)
					return console.warn("Cannot push screen : " + t.id + ", already in pushed stack, screen state " + t.screenState), void 0;
				if (t.screenState === O.screenStates.POPPING)
					return console.warn("Cannot push screen : " + t.id + ", it is currently popping"), void 0;
				if (B.hideMenu(), e("plugins/tabbar/index").hide(), L(t), H.preventUserInteraction(), m(t, O.screenStates.PUSHING), document.activeElement.blur(), o(O.currentScreen()), D.emit("manager.screen", [O.currentScreen(), "becomingHidden"], !0), K.push(t), t.pushingScreen = !0, P.appendAnimation(b.bind(O, t)), t.becomingVisible(), E(Y + 10), t.domElement.style.zIndex = Y, v(t), t.domElement.classList.remove("removed"), t.actionBar) {
					var n = u(t.offscreenLocation),
					i = u(O.offscreenLocation.ONSCREEN),
					r = W.getTiming(W.OUTGOING_PAGE, l(n, i));
					U.pushActionBar(t.actionBar, r),
					U.expand(!0)
				} else
					P.forceLayout(t.domElement);
				e("plugins/contextmenu/index").setCurrentWebViewId(iris.chromeId),
				t.justTypeField && G.type(t.justTypeField()),
				P.animate()
			},
			pushView : function (t, n) {
				n || H.preventUserInteraction(),
				t.viewState = O.viewStates.PUSHING,
				document.activeElement.blur(),
				P.appendAnimation(T.bind(O, t, n)),
				t.becomingVisible(),
				P.forceLayout(screen.domElement),
				e("plugins/contextmenu/index").setCurrentWebViewId(iris.chromeId),
				P.animate()
			},
			popScreen : function (e) {
				if (!e)
					throw Error("Invalid arg, screen, passed to screenManager.popScreen");
				if (1 === K.length)
					return console.warn("Cannot pop screen : " + e.id + ", this is the only screen remaining in the pushed stack"), void 0;
				if (!O.isScreenPushed(e))
					return console.warn("Cannot pop screen : " + e.id + ", it is not on the screen stack"), void 0;
				if (e.screenState !== O.screenStates.PUSHED)
					return console.warn("Cannot pop screen : " + e.id + ", it is currently " + e.screenState), void 0;
				L(e),
				H.preventUserInteraction(),
				m(e, O.screenStates.POPPING),
				document.activeElement.blur(),
				F.currentState() === F.OPENED && (o(e), P.forceLayout(e.domElement)),
				P.appendAnimation(w.bind(O, e)),
				D.emit("manager.screen", [e, "becomingPopped"], !0);
				var t = K[K.length - 2];
				D.emit("manager.screen", [t, "uncovered"], !0),
				t.domElement.classList.remove("not-visible"),
				e.justTypeField && G.untype(e.justTypeField()),
				P.animate()
			},
			popView : function (e, t, n) {
				n || H.preventUserInteraction(),
				console.log("popView " + e.id),
				e.viewState = O.viewStates.POPPING,
				document.activeElement.blur(),
				P.appendAnimation(y.bind(O, e, n)),
				t && (e.viewClass = t),
				D.emit("manager.view", [e, "removed"], !0),
				P.animate()
			},
			rollBackToScreen : function (e) {
				e !== O.currentScreen() && (D.once("manager.screen", O.rollBackToScreen.bind(O, e), [O.currentScreen(), "popped"]), O.popScreen(O.currentScreen()))
			},
			loadScreen : function (e, t) {
				t = t || O.offscreenLocation.RIGHT;
				var n = A(e, t);
				if (n)
					return n;
				var i = N(e, t);
				return D.emit("manager.screen", [i, "screenLoaded"], !0),
				i
			},
			loadSheet : function (e) {
				var t = A(e, O.offscreenLocation.RIGHT);
				if (t)
					return t;
				var n = N(e, O.offscreenLocation.RIGHT);
				return n.isSheet = !0,
				D.emit("manager.screen", [n, "sheetLoaded"], !0),
				n
			},
			loadView : function (t, n, i, r) {
				var a = t + i.id;
				if (z[a]) {
					var o = z[a];
					return o.viewClass && o.domElement.classList.remove(o.viewClass),
					o.domElement.classList.add(r),
					o.domElement.classList.remove("removed"),
					o.viewClass = r,
					P.forceLayout(o.domElement),
					o
				}
				var s = document.getElementById(t);
				s || (s = document.createElement("div"), s.classList.add("contentArea"), s.classList.add(r), n.appendChild(s)),
				s.style.webkitTransition = et;
				var c = e("plugins/views/" + t + "/index");
				return c.create ? c = c.create(s, i) : c.init(s, i),
				c.domElement = s,
				c.id = t + j++,
				s.id = c.id,
				c.viewClass = r,
				z[a] = c,
				P.forceLayout(c.domElement),
				c
			},
			unloadView : function (e) {
				e.domElement.classList.add("removed"),
				P.forceLayout(e.domElement)
			},
			domElementForScreen : function (e) {
				return e.domElement
			},
			dragScreen : function (e, t, n) {
				m(screen, O.screenStates.DRAGGING),
				t.domElement.classList.remove("not-visible"),
				e.setOverlayOpacity(!1, Math.max((tt - (screen.width - n) / (screen.width / (1 + tt))).toFixed(2), 0)),
				t.setOverlayOpacity(!1, ((screen.width - n) / (screen.width / tt)).toFixed(2));
				for (var i = K.indexOf(t), r = K.indexOf(e); r > i; r--)
					K[r].isSheet || K[r].actionBar.setPosition(n, 0), K[r].domElement.style.webkitTransition = "none", K[r].domElement.style.webkitTransform = "translateX(" + n + "px) translateZ(0)", K[r].position = {
						x : n,
						y : 0
					}
			},
			startDragScreen : function (e) {
				L(e)
			},
			endDragScreen : function (e, t, n, i) {
				var r = W.getTiming(i ? W.OUTGOING_PAGE : W.INCOMING_PAGE, n);
				if (e.overlay.style.webkitTransition = "opacity " + r + "ms ease-out", t.overlay.style.webkitTransition = "opacity " + r + "ms ease-out", i && !e.isSheet)
					e.setOverlayOpacity(!0, tt, r), t.setOverlayOpacity(!0, 0, r), m(e, O.screenStates.PUSHED), O.rollBackToScreen(t);
				else {
					for (var a = K.indexOf(t), o = K.indexOf(e) - 1; o > a; o--)
						K[o].isSheet || K[o].actionBar.resetPosition(), K[o].domElement.style.webkitTransition = "none", K[o].domElement.style.webkitTransform = O.offscreenLocation.ONSCREEN, delete K[o].position;
					var s = H.transitionWithTimeout(e.domElement, function () {
							e.setOverlayOpacity(!0, 0, r),
							t.setOverlayOpacity(!0, tt, r),
							e.domElement.style.webkitTransform = "",
							e.domElement.style.webkitTransition = X + " " + r + "ms ease-out"
						}, r + 100, function () {
							t.setOverlayOpacity(!1, 0),
							t.domElement.classList.add("not-visible"),
							D.emit("manager.endDragScreen.transitionEnded")
						});
					if (!e.isSheet)
						var c = e.actionBar.setPosition(0, r);
					e.cancelEndDragScreenTransitions = function () {
						s && s.cancel(),
						c && c.cancel()
					}
				}
			},
			activateContextMenu : function (e, t) {
				B.hideMenu(),
				k(e, t)
			},
			deactivateContextMenu : function (e) {
				_ && !_.isJobCompleted() && _.cancel(),
				M.hideContextMenu(void 0, e)
			},
			isScreenPushed : function (e) {
				return -1 !== K.indexOf(e)
			},
			getViewState : function (e) {
				return e.viewState
			},
			viewStates : {
				PUSHED : "pushed",
				POPPED : "popped",
				PUSHING : "pushing",
				POPPING : "popping"
			},
			screenStates : {
				PUSHED : "pushed",
				POPPED : "popped",
				PUSHING : "pushing",
				POPPING : "popping",
				DRAGGING : "dragging"
			},
			offscreenLocation : {
				LEFT : "translateZ(0) translate(-100%, 0)",
				RIGHT : "translateZ(0) translate(100%, 0)",
				TOP : "translateZ(0) translate(0, -100%)",
				BOTTOM : "translateZ(0) translate(0, 100%)",
				ONSCREEN : "translateZ(0) translate(0, 0)"
			}
		},
		D.on("keyboard.closed", function () {
			o()
		}),
		D.on("keyboard.opened", function () {
			c()
		}),
		D.on("browser.invoked", function () {
			O.rollBackToScreen(O.homeScreen())
		}),
		D.on("actionbar.up", r),
		D.on("actionbar.down", s),
		n.exports = O
	}), define("ui/actions", function (e, t, n) {
		var i,
		r = e("iris/i18n"),
		a = e("iris/utils"),
		o = e("iris/device"),
		s = {
			"Clear List" : {
				iconUrl : "./assets/ic_delete.png",
				label : function () {
					return r.translate(352)
				}
			},
			"Clear Downloads" : {
				iconUrl : "./assets/ic_delete.png",
				label : function () {
					return r.translate(353)
				}
			},
			"Clear History" : {
				iconUrl : "./assets/ic_delete.png",
				label : function () {
					return r.translate(293)
				}
			},
			"Remove All" : {
				iconUrl : "./assets/ic_delete.png",
				label : function () {
					return r.translate(354)
				}
			},
			Remove : {
				iconUrl : "./assets/ic_delete.png",
				label : function () {
					return r.translate(170)
				}
			},
			Previous : {
				iconUrl : "./assets/ic_previous.png",
				label : function () {
					return r.translate(355)
				}
			},
			Next : {
				iconUrl : "./assets/ic_next.png",
				label : function () {
					return r.translate(356)
				}
			},
			Back : {
				iconUrl : "./assets/design-units-" + o.getDesignUnitBucket() + "/core_actionbar_icon_back.png",
				label : function () {
					return r.translate(109)
				}
			},
			Cancel : {
				iconUrl : "./assets/design-units-" + o.getDesignUnitBucket() + "/core_actionbar_icon_back.png",
				label : function () {
					return r.translate(43)
				}
			},
			Close : {
				iconUrl : "./assets/design-units-" + o.getDesignUnitBucket() + "/core_actionbar_icon_back.png",
				label : function () {
					return r.translate(105)
				}
			},
			"Switch to List" : {
				iconUrl : "./assets/ic_view_list.png",
				label : function () {
					return r.translate(357)
				}
			},
			"Switch to Grid" : {
				iconUrl : "./assets/ic_view_grid.png",
				label : function () {
					return r.translate(358)
				}
			},
			Tags : {
				iconUrl : "./assets/ic_tag.png",
				label : function () {
					return r.translate(359)
				}
			},
			Search : {
				iconUrl : "./assets/ic_search.png",
				label : function () {
					return r.translate(317)
				}
			},
			"Increase Font" : {
				iconUrl : "./assets/ic_increase.png",
				label : function () {
					return r.translate(360)
				}
			},
			"Decrease Font" : {
				iconUrl : "./assets/ic_decrease.png",
				label : function () {
					return r.translate(361)
				}
			},
			"Invert Colors" : {
				iconUrl : "./assets/ic_decrease.png",
				label : function () {
					return r.translate(362)
				}
			},
			"Open All" : {
				iconUrl : "./assets/ic_open_all_tabs.png",
				label : function () {
					return r.translate(363)
				}
			},
			"Open in New Tab" : {
				iconUrl : "./assets/ic_open_link_new_tab.png",
				label : function () {
					return r.translate(308)
				}
			},
			Delete : {
				iconUrl : "./assets/ic_delete.png",
				label : function () {
					return r.translate(178)
				}
			},
			"Cancel Select More" : {
				iconUrl : "./assets/ic_close.png",
				className : "large-icon-background",
				label : function () {
					return r.translate(43)
				}
			}
		};
		i = {
			getActionLabel : function (e) {
				return s[e].label
			},
			getAction : function (e) {
				var t = {},
				n = s[e];
				if (!n)
					throw Error("Cannot find action for " + e);
				return a.extend(t, n),
				t
			}
		},
		n.exports = i
	}), define("ui/animationTimings", function (e, t, n) {
		var i;
		i = {
			getTiming : function (t, n) {
				switch (t) {
				case i.INCOMING_PAGE:
				case i.OUTGOING_PAGE:
				case i.INCOMING_CARD:
				case i.OUTGOING_CARD:
				case i.OPEN_OVERFLOW:
				case i.CLOSE_OVERFLOW:
				case i.SEGMENTED_TITLEBAR_SLIDE:
				case i.ANIMATE_TABBAR:
					var r = 30 * Math.sqrt(n / e("iris/device").getDesignUnitBucket());
					return Math.min(Math.max(50, r), 300);
				case i.ACTIONBAR_OPEN:
				case i.ACTIONBAR_CLOSE:
				case i.APPMENU_OPEN:
				case i.APPMENU_CLOSE:
				case i.ACTIONBAR_DISABLE:
				case i.ACTIONBAR_REPLACE_ACTION:
				case i.TABBAR_ITEM_HIGHLIGHT_HOVER_OUT:
				case i.TABBAR_TAB_SELECTION_OUT:
				case i.VIEW_CONTENT_CROSS_FADE:
				case i.TABBAR_IMAGE_FADE_IN:
				case i.OPEN_CONTEXT_MENU:
				case i.CLOSE_CONTEXT_MENU:
				case i.FULL_SELECTION:
				case i.PROGRESS_BAR_SHOW:
				case i.PROGRESS_BAR_HIDE:
				case i.FADE_CONTEXT_MENU:
					return 300;
				case i.ACTION_ITEM_HIGHLIGHT_HOVER_IN:
				case i.ACTION_ITEM_HIGHLIGHT_HOVER_OUT:
				case i.TABBAR_ITEM_HIGHLIGHT_HOVER_IN:
				case i.TABBAR_TAB_SELECTION_IN:
					return 0;
				case i.ACTIONBAR_ACTION_GROUP_SWITCH:
				case i.TOOLTIP_BAR_MOVE:
				case i.TOOLTIP_FADE:
				case i.DISABLE_TAB:
				case i.DELETE_TAB:
				case i.CHECKBOX:
					return 150;
				case i.OPEN_SHEET_INCOMING_PAGE:
				case i.OPEN_SHEET_OUTGOING_PAGE:
					return 450;
				case i.TITLEBAR_OPEN:
				case i.TITLEBAR_CLOSE:
					return 100;
				case i.SEARCH_PROVIDER_LIST_OPEN:
				case i.SEARCH_PROVIDER_LIST_CLOSE:
				case i.BACK_FORWARD_LIST_OPEN:
				case i.BACK_FORWARD_LIST_CLOSE:
					return 200;
				default:
					return 0
				}
			},
			getCurve : function () {
				return "cubic-bezier(0.1, 0.5, 0.25, 1)"
			},
			INCOMING_PAGE : "page-in",
			OUTGOING_PAGE : "page-out",
			INCOMING_CARD : "card-in",
			OUTGOING_CARD : "card-out",
			OPEN_OVERFLOW : "open-overflow",
			CLOSE_OVERFLOW : "close-overflow",
			OPEN_CONTEXT_MENU : "open-context",
			CLOSE_CONTEXT_MENU : "close-context",
			ACTIONBAR_DISABLE : "actionbar-disable",
			ACTIONBAR_OPEN : "actionbar-open",
			ACTIONBAR_CLOSE : "actionbar-close",
			APPMENU_OPEN : "appmenu-open",
			APPMENU_CLOSE : "appmenu-close",
			ACTION_ITEM_HIGHLIGHT_HOVER_IN : "action-item-highligh-hover-in",
			ACTION_ITEM_HIGHLIGHT_HOVER_OUT : "action-item-highligh-hover-out",
			ACTIONBAR_REPLACE_ACTION : "actionbar-replace-action",
			ACTIONBAR_ACTION_GROUP_SWITCH : "actionbar-action-group-switch",
			SEGMENTED_TITLEBAR_SLIDE : "segmented-titlebar-slide",
			OPEN_SHEET_INCOMING_PAGE : "open-sheet-incoming-page",
			OPEN_SHEET_OUTGOING_PAGE : "open-sheet-outgoing-page",
			TABBAR_ITEM_HIGHLIGHT_HOVER_IN : "tabbar-item-highligh-hover-in",
			TABBAR_ITEM_HIGHLIGHT_HOVER_OUT : "tabbar-item-highligh-hover-out",
			TABBAR_TAB_SELECTION_IN : "tabbar-tab-selection-in",
			TABBAR_TAB_SELECTION_OUT : "tabbar-tab-selection-out",
			TITLEBAR_OPEN : "titlebar-open",
			TITLEBAR_CLOSE : "titlebar-close",
			VIEW_CONTENT_CROSS_FADE : "view-content-cross-fade",
			TABBAR_IMAGE_FADE_IN : "tabbar_image_fade_in",
			TOOLTIP_FADE : "tooltip-fade",
			TOOLTIP_BAR_MOVE : "tooltip-bar-move",
			SEARCH_PROVIDER_LIST_OPEN : "search-provider-open",
			SEARCH_PROVIDER_LIST_CLOSE : "search-provider-close",
			FULL_SELECTION : "full-selection",
			BACK_FORWARD_LIST_OPEN : "back-forward-list-open",
			BACK_FORWARD_LIST_CLOSE : "back-forward-list-close",
			PROGRESS_BAR_SHOW : "progres-bar-show",
			PROGRESS_BAR_HIDE : "progress-bar-hide",
			DISABLE_TAB : "disable_tab",
			DELETE_TAB : "delete_tab",
			CHECKBOX : "checkbox",
			ANIMATE_TABBAR : "tabbar"
		},
		n.exports = i
	}), define("ui/backgroundSelectionController", function (e, t, n) {
		function i(t) {
			function n(e) {
				e && e.backgroundAnimation && e.backgroundAnimation.cancel()
			}
			function i(e, n, i) {
				e && e.backgroundAnimation && e.backgroundAnimation.cancel();
				var a = function () {
					f(h.PARTIALLY_SELECTED, e)
				},
				o = function () {
					n.style.webkitTransitionDuration = v + "ms",
					n.style.setProperty("opacity", e.keepListItemSelected ? t.backgroundKeepSelectedOpacity : t.backgroundPartiallySelectedOpacity, "important")
				};
				e.backgroundAnimation = r.transitionWithTimeout(n, o, b, i ? a : void 0)
			}
			function a() {
				t.onPartiallySelected && t.onPartiallySelected()
			}
			function o(e, n, i) {
				e && e.backgroundAnimation && e.backgroundAnimation.cancel();
				var a = function () {
					f(h.SELECTED, e)
				},
				o = function () {
					t.selectedTextColorClass && e.classList.add(t.selectedTextColorClass),
					e.classList.add("listItemSelected"),
					n.style.webkitTransitionDuration = E + "ms",
					n.style.removeProperty("opacity"),
					n.style.opacity = t.backgroundSelectedOpacity,
					i && (i.style.webkitTransitionDuration = E + "ms", i.style.removeProperty("opacity"), i.style.opacity = 0)
				};
				e.backgroundAnimation = r.transitionWithTimeout(n, o, w, a)
			}
			function s(e, n) {
				e && e.backgroundAnimation && e.backgroundAnimation.cancel();
				var i = function () {
					f(h.SELECTED_PRESSED, e)
				},
				a = function () {
					n.style.webkitTransitionDuration = v + "ms",
					n.style.removeProperty("opacity"),
					n.style.opacity = t.backgroundOverlaySelectedOpacity
				};
				e.backgroundAnimation = r.transitionWithTimeout(n, a, b, i)
			}
			function c(n, i, a) {
				n && n.backgroundAnimation && n.backgroundAnimation.cancel();
				var o = function () {
					f(h.UNSELECTED, n)
				},
				s = function () {
					t.selectedTextColorClass && n.classList.remove(t.selectedTextColorClass),
					n.keepListItemSelected || n.classList.remove("listItemSelected"),
					i.style.webkitTransitionDuration = v + "ms",
					i.style.removeProperty("opacity"),
					i.style.opacity = 0,
					i.childNodes.length && (i.childNodes[0].style.opacity = ""),
					a && (a.style.webkitTransitionDuration = v + "ms", a.style.removeProperty("opacity"), a.style.opacity = 0);
					var e = n.getElementsByClassName("gridItemCheckmark");
					e.length && (e[0].style.opacity = "")
				};
				document.getElementById("contextMenu").contains(n) || e("screen/manager").deactivateContextMenu(),
				n.backgroundAnimation = r.transitionWithTimeout(i, s, b, o)
			}
			function l(e, t) {
				switch (e) {
				case h.UNSELECTED:
					if (t === h.PARTIALLY_SELECTED_TRANSITION_STARTED || t === h.SELECTED_TRANSITION_STARTED)
						return !0;
					break;
				case h.PARTIALLY_SELECTED_TRANSITION_STARTED:
					if (t === h.PARTIALLY_SELECTED || t === h.SELECTED_TRANSITION_STARTED || t === h.UNSELECTED_TRANSITION_STARTED || t === h.SELECTED_PRESSED_TRANSITION_STARTED)
						return !0;
					break;
				case h.PARTIALLY_SELECTED:
					if (t === h.SELECTED_TRANSITION_STARTED || t === h.UNSELECTED_TRANSITION_STARTED)
						return !0;
					break;
				case h.SELECTED_TRANSITION_STARTED:
					if (t === h.SELECTED || t === h.UNSELECTED_TRANSITION_STARTED || t === h.SELECTED_PRESSED_TRANSITION_STARTED)
						return !0;
					break;
				case h.SELECTED:
					if (t === h.UNSELECTED_TRANSITION_STARTED || t === h.PARTIALLY_SELECTED_TRANSITION_STARTED || t === h.SELECTED_PRESSED_TRANSITION_STARTED)
						return !0;
					break;
				case h.SELECTED_PRESSED_TRANSITION_STARTED:
					if (t === h.SELECTED_PRESSED || t === h.UNSELECTED_TRANSITION_STARTED || t === h.SELECTED_TRANSITION_STARTED)
						return !0;
					break;
				case h.SELECTED_PRESSED:
					if (t === h.UNSELECTED_TRANSITION_STARTED || t === h.SELECTED_TRANSITION_STARTED)
						return !0;
					break;
				case h.UNSELECTED_TRANSITION_STARTED:
					if (t === h.UNSELECTED)
						return !0
				}
				return !1
			}
			function d(e) {
				return e.backgroundState || (e.backgroundState = h.UNSELECTED),
				e.backgroundState
			}
			function u(e) {
				-1 === T.indexOf(e) && T.push(e)
			}
			function m(e) {
				var t = T.indexOf(e);
				-1 !== t && T.splice(t, 1)
			}
			function f(e, r) {
				var f = d(r);
				if (f !== e) {
					if (!l(f, e))
						throw Error("Cannot move background selection state from current state : " + f + ", to new state : " + e);
					var p,
					g;
					r && (p = t.getBackgroundElement(r), g = t.getBackgroundOverlayElement ? t.getBackgroundOverlayElement(r) : void 0);
					var v = r.backgroundState;
					switch (r.backgroundState = e, e) {
					case h.UNSELECTED:
						m(r),
						n(r);
						break;
					case h.PARTIALLY_SELECTED_TRANSITION_STARTED:
						u(r),
						i(r, g, v !== h.SELECTED && v !== h.SELECTED_TRANSITION_STARTED);
						break;
					case h.PARTIALLY_SELECTED:
						u(r),
						a();
						break;
					case h.SELECTED_TRANSITION_STARTED:
						u(r),
						o(r, p, g);
						break;
					case h.SELECTED:
						u(r);
						break;
					case h.SELECTED_PRESSED_TRANSITION_STARTED:
						u(r),
						s(r, g);
						break;
					case h.SELECTED_PRESSED:
						u(r);
						break;
					case h.UNSELECTED_TRANSITION_STARTED:
						m(r),
						c(r, p, g);
						break;
					default:
						throw Error("Cannot move background selection state to new state : " + e)
					}
				}
			}
			function p(e) {
				e && !e.backgroundState && (e.backgroundState = h.UNSELECTED)
			}
			var g = this,
			h = {
				UNSELECTED : "unselected",
				PARTIALLY_SELECTED_TRANSITION_STARTED : "partially_selected_transition_started",
				PARTIALLY_SELECTED : "partially_selected",
				SELECTED_TRANSITION_STARTED : "selected_transition_started",
				SELECTED : "selected",
				SELECTED_PRESSED_TRANSITION_STARTED : "selected_pressed_transition_started",
				SELECTED_PRESSED : "selected_pressed",
				UNSELECTED_TRANSITION_STARTED : "unselected_transition_started"
			},
			v = 350,
			b = 380,
			E = 50,
			w = 80,
			T = [];
			g.setUnselected = function (e) {
				p(e);
				var t = d(e);
				t !== h.UNSELECTED && f(t === h.UNSELECTED_TRANSITION_STARTED ? h.UNSELECTED : h.UNSELECTED_TRANSITION_STARTED, e)
			},
			g.setPartiallySelected = function (e) {
				p(e),
				e && d(e) !== h.SELECTED_TRANSITION_STARTED && d(e) !== h.PARTIALLY_SELECTED_TRANSITION_STARTED && (d(e) === h.UNSELECTED_TRANSITION_STARTED && f(h.UNSELECTED, e), f(h.PARTIALLY_SELECTED_TRANSITION_STARTED, e))
			},
			g.setSelected = function (e) {
				p(e),
				d(e) !== h.SELECTED_TRANSITION_STARTED && d(e) !== h.SELECTED && (d(e) === h.UNSELECTED_TRANSITION_STARTED && f(h.UNSELECTED, e), f(h.SELECTED_TRANSITION_STARTED, e))
			},
			g.clearAll = function () {
				for (; T.length > 0; )
					g.setUnselected(T.pop())
			},
			g.setSelectedPressed = function (e) {
				p(e),
				d(e) !== h.SELECTED_PRESSED_TRANSITION_STARTED && d(e) !== h.SELECTED_PRESSED && t.getBackgroundOverlayElement && (d(e) === h.UNSELECTED_TRANSITION_STARTED && f(h.UNSELECTED, e), f(h.SELECTED_PRESSED_TRANSITION_STARTED, e))
			},
			g.isUnselected = function (e) {
				return d(e) === h.UNSELECTED_TRANSITION_STARTED || d(e) === h.UNSELECTED
			}
		}
		var r = e("ui/utils"),
		a = {
			create : function (e) {
				return new i(e)
			}
		};
		n.exports = a
	}), define("ui/container/grid/domController", function (e, t, n) {
		function i() {
			c.isNSeries() ? (a = 234, o = 234) : c.isASeries() && c.isPortrait() ? (a = 234, o = 234) : c.isASeries() && !c.isPortrait() ? (a = 248, o = 248) : c.isOSeries() && c.isPortrait() ? (a = 352, o = 352) : c.isOSeries() && !c.isPortrait() ? (a = 374, o = 374) : c.isWSeries() ? (a = 351, o = 351) : c.isLSeries() && c.isPortrait() ? (a = 249, o = 249) : c.isClassic() ? (a = 234, o = 234) : (a = 248, o = 248)
		}
		function r(e, t, n, r, c) {
			function l(e, t, n) {
				e.firstChild.firstChild.childNodes[0].style.backgroundImage = t ? "url('" + t + "')" : "",
				e.firstChild.firstChild.childNodes[0].firstChild.style.backgroundImage = n ? "url('" + n + "')" : ""
			}
			function d(e, t) {
				e.firstChild.firstChild.getElementsByClassName("gridItemTextDiv")[0].firstChild.childNodes.length > 0 && (e.firstChild.firstChild.getElementsByClassName("gridItemTextDiv")[0].firstChild.innerHTML = ""),
				e.firstChild.firstChild.getElementsByClassName("gridItemTextDiv")[0].firstChild.appendChild(document.createTextNode(t))
			}
			function u(e, t) {
				e.firstChild.firstChild.getElementsByClassName("gridItemTextDiv")[0].lastChild.childNodes.length > 0 && (e.firstChild.firstChild.getElementsByClassName("gridItemTextDiv")[0].lastChild.innerHTML = ""),
				e.firstChild.firstChild.getElementsByClassName("gridItemTextDiv")[0].lastChild.appendChild(document.createTextNode(t))
			}
			function m(e) {
				var t = document.createElement("div");
				t.className = (void 0 !== e.gridItemClass ? e.gridItemClass : "") + " gridItemGeneric start-horizontal-margin-size-s bottom-horizontal-margin-size-s",
				t.setAttribute("role", "listitem"),
				t.tabIndex = 1,
				t.contextItem = !0;
				var n = document.createElement("div");
				n.className = "gridItemOuter",
				e.a11yRole && n.setAttribute("role", e.a11yRole),
				e.a11yTitle && (n.title = e.a11yTitle),
				t.appendChild(n);
				var i = document.createElement("div");
				i.className = "focus-ring",
				t.appendChild(i);
				var a = document.createElement("div");
				if (a.className = "gridItemContents", a.setAttribute("aria-hidden", "true"), n.appendChild(a), e.imageUrl || e.defaultImageUrl) {
					var o = document.createElement("div");
					o.className = "gridItemIconDiv",
					o.multiSelectable = e.multiSelectable,
					a.appendChild(o);
					var s = document.createElement("div");
					s.className = "gridItemIconDiv",
					s.multiSelectable = e.multiSelectable,
					o.appendChild(s),
					l(t, e.defaultImageUrl, r ? void 0 : e.imageUrl)
				}
				var m = document.createElement("div");
				m.className = "gridItemBackground accent-colour-highlight-background",
				m.multiSelectable = e.multiSelectable,
				a.appendChild(m);
				var f = document.createElement("div");
				f.className = "gridItemBackground background gridItemBackgroundOverlay",
				f.multiSelectable = e.multiSelectable,
				a.appendChild(f);
				var p = document.createElement("div");
				p.className = "gridItemBackground gridItemCheckmark",
				p.multiSelectable = e.multiSelectable,
				a.appendChild(p);
				var g = document.createElement("div");
				g.className = "gridItemOverlay",
				g.multiSelectable = e.multiSelectable,
				a.appendChild(g);
				var h = document.createElement("div");
				h.className = "gridItemTextDiv bottom-margin-size-m",
				h.multiSelectable = e.multiSelectable;
				var v = document.createElement("div");
				v.dir = "auto",
				v.className = "horizontal-margin-size-m font-size-xs font-weight-medium",
				v.multiSelectable = e.multiSelectable,
				h.appendChild(v);
				var b = document.createElement("div");
				return b.dir = "auto",
				b.className = "horizontal-margin-size-m font-size-xxs",
				b.multiSelectable = e.multiSelectable,
				h.appendChild(b),
				a.appendChild(h),
				e.title && d(t, e.title),
				u(t, e.subTitle),
				c.addFocusListeners(t),
				t
			}
			var f = this,
			p = -1,
			g = [];
			f.resetGridItemDimensions = function () {
				i()
			},
			f.setShouldDelayLoadingImages = function (e) {
				r = e
			},
			f.resetCachedNumColumns = function () {
				f.cachedNumColumnsInRow = Math.floor(window.screen.width / f.itemWidth())
			},
			f.itemHeight = function () {
				return a
			},
			f.itemWidth = function () {
				return o
			},
			f.getNumColumns = function () {
				return f.cachedNumColumnsInRow || (f.cachedNumColumnsInRow = Math.floor(window.screen.width / f.itemWidth())),
				f.cachedNumColumnsInRow
			},
			f.getNumRows = function () {
				return Math.ceil(n.length / f.getNumColumns())
			},
			f.appendItems = function (e) {
				n = n.concat(e),
				f.setGridContainerHeight(f.getNumRows() * f.itemHeight())
			},
			f.setGridContainerHeight = function (n) {
				t.style.height = n + e.offsetTop + "px"
			},
			f.getBackgroundElement = function (e) {
				return e.firstChild.firstChild.childNodes[1]
			},
			f.getBackgroundOverlayElement = function (e) {
				return e.firstChild.firstChild.childNodes[2]
			},
			f.clear = function () {
				t && t.childElementCount > 0 && (t.innerHTML = ""),
				g = [],
				n = [],
				p = -1,
				r = !0
			},
			f.addRows = function (i, r) {
				if (!(p > i)) {
					i = Math.min(f.getNumRows(), i);
					for (var a = document.createDocumentFragment(), o = f.getNumColumns(), c = [], l = p + 1; i >= l; l++)
						for (var d = 0; o > d; d++) {
							var u = l * o + d;
							if (u >= n.length)
								break;
							if (!g[u]) {
								var h = r(n[u]),
								v = m(h);
								g.push(v),
								c.push(v),
								a.appendChild(v)
							}
						}
					p = Math.min(i, f.getNumRows()),
					t.appendChild(a),
					s.emit("container.rowsAdded", [e, c])
				}
			},
			f.getGridItem = function (e) {
				return e && e.parentNode === t && -1 !== g.indexOf(e) ? n[g.indexOf(e)] : void 0
			},
			f.focusRingForItem = function (e, t) {
				var n = f.findItemPosition(e, t);
				return g[n].children[1]
			},
			f.canSetGridContainerHeight = function () {
				return !0
			},
			f.setGridContainerHeight = function (n) {
				f.canSetGridContainerHeight() && (t.style.height = n + e.offsetTop + "px")
			},
			f.getRowNumber = function (e) {
				var t = n.indexOf(e),
				i = f.getNumColumns();
				return -1 !== t ? Math.floor(t / i) : void 0
			},
			f.getColumnNumber = function (e) {
				var t = n.indexOf(e),
				i = f.getNumColumns();
				return -1 !== t ? t % i : void 0
			},
			f.getItems = function () {
				return n
			},
			f.getElements = function () {
				return g
			},
			f.getElement = function (e) {
				var t = f.getItemIndex(e);
				return -1 === t ? void 0 : g[t]
			},
			f.getItemIndex = function (e) {
				var t = n.indexOf(e);
				return -1 === t ? void 0 : t
			},
			f.removeItem = function (e, t) {
				var i = f.findItemPosition(e, t);
				return -1 !== i && (g[i].parentNode.removeChild(g[i]), g.splice(i, 1), n.splice(i, 1)),
				-1 !== i
			},
			f.refreshEndRow = function (e) {
				var i = f.getNumColumns();
				if (0 !== g.length % i) {
					for (var r = document.createDocumentFragment(), a = i - g.length % i, o = Math.min(g.length + a, n.length), s = g.length; o > s; s++) {
						var c = e(n[s]),
						l = m(c);
						g.push(l),
						r.appendChild(l)
					}
					t.appendChild(r),
					p = Math.max(Math.ceil(g.length / i) - 1, 0)
				}
			},
			f.updateItem = function (e, t, i) {
				for (var r = -1, a = 0; n.length > a; a++)
					if (i(e, n[a])) {
						r = a;
						break
					}
				if (-1 !== r) {
					var o = t(e),
					s = g[r],
					c = t(n[r]);
					(c.imageUrl !== o.imageUrl && o.imageUrl || c.defaultImageUrl !== o.defaultImageUrl && !o.imageUrl && !c.imageUrl || o.defaultImageUrl && c.imageUrl && !o.imageUrl) && l(s, c.defaultImageUrl, o.imageUrl),
					c.title !== o.title && d(s, o.title),
					c.subTitle !== o.subTitle && u(s, o.subTitle),
					n[r] = e
				}
			},
			f.loadDelayedImages = function (e) {
				if (r) {
					for (var t = 0; g.length > t; t++) {
						var i = e(n[t]);
						i.imageUrl && l(g[t], i.defaultImageUrl, i.imageUrl)
					}
					r = !1
				}
			},
			f.findItemPosition = function (e, t) {
				var i = n.indexOf(e);
				if (-1 !== i)
					return i;
				for (var r = 0; n.length > r; r++)
					if (t(e, n[r])) {
						i = r;
						break
					}
				return i
			}
		}
		var a,
		o,
		s = e("iris/event"),
		c = e("iris/device");
		i();
		var l = {
			create : function (e, t, n, i, a) {
				return new r(e, t, n, i, a)
			}
		};
		n.exports = l
	}), define("ui/container/grid/grid", function (e, t, n) {
		function i(t) {
			function n() {
				o.preventUserInteraction(),
				I && e("plugins/toaster/index").cancelToastTimeout(I)
			}
			function i() {
				T.resetGridItemDimensions(),
				T.resetCachedNumColumns();
				var n = T.getNumColumns(),
				i = Math.ceil((T.getItems().length - (C || I ? 1 : 0)) / n),
				r = i * T.itemHeight();
				if (T.setGridContainerHeight(r), _._scrollContainerHeight = void 0, T.refreshEndRow(g), t.screen && t.screen.popped || t.view && t.view.popped)
					return R = !0, void 0;
				if (y) {
					var a = Math.ceil(window.screen.height / T.itemHeight()),
					s = 0 === a % 2 ? a : a + 1,
					c = s / 2;
					y.rotationFinished(x.scrollTop, s, c)
				}
				I && e("plugins/toaster/index").resetToastTimeout(I),
				C ? C() : o.allowUserInteraction()
			}
			function c(n, r) {
				n == t.screen && ("popped" == r ? I && (e("plugins/toaster/index").dismissToast(I), I = void 0) : "hidden" == r ? I && (e("plugins/toaster/index").dismissToast(I), I = void 0) : "loadTransitionEnd" == r && (f(), R && (R = !1, i())))
			}
			function l(n, r) {
				n == t.view && ("removed" == r ? I && (e("plugins/toaster/index").dismissToast(I), I = void 0) : "loadTransitionEnd" == r && (f(), R && (R = !1, i())))
			}
			function d(e) {
				return T.getGridItem(e)
			}
			function u(e) {
				return T.getBackgroundElement(e)
			}
			function m(e) {
				return T.getBackgroundOverlayElement(e)
			}
			function f() {
				O && (T.loadDelayedImages(g), O = !1)
			}
			function p() {
				if (!_._scrollContainerHeight || 0 > _._scrollContainerHeight) {
					var e = parseInt(document.defaultView.getComputedStyle(S, "").getPropertyValue("margin-top"), 10),
					t = parseInt(document.defaultView.getComputedStyle(S, "").getPropertyValue("margin-bottom"), 10);
					_._scrollContainerHeight = x.clientHeight - x.offsetTop - e - t
				}
				return _._scrollContainerHeight
			}
			function g(e) {
				var n = t.itemToCellAdapter(e);
				return n
			}
			function h() {
				y && y.scrollPositionChanged(x.scrollTop)
			}
			function v(e) {
				T.addRows(e, g)
			}
			function b(e, n) {
				var i = !0;
				e.forEach(function (e) {
					i = i && T.removeItem(e, t.itemComparator)
				}),
				i && (I = void 0, T.refreshEndRow(g), _.setEmptyMessageVisible(_.isEmpty()), n && n(e))
			}
			function E(e) {
				I = void 0,
				L.clearSelection(),
				e.forEach(function (e) {
					T.getElement(e).classList.remove("hidden")
				}),
				w(T.getItems().length)
			}
			function w(e) {
				var t = Math.ceil(e / T.getNumColumns()) * T.itemHeight();
				T.setGridContainerHeight(t)
			}
			var T,
			y,
			I,
			S,
			x,
			C,
			k,
			A,
			N,
			L,
			_ = this,
			R = !1,
			O = "delayImageLoading" in t ? t.delayImageLoading : !0,
			D = !1;
			if (x = document.createElement("div"), x.className = "scroll-container", t.container.appendChild(x), _.onEmptyContentsChanged = function () {
				if (k) {
					var e = t.getEmptyContents();
					e.imageUrl ? (A.src = "default" === e.imageUrl ? s : e.imageUrl, A.classList.remove("hidden")) : A.classList.add("hidden"),
					N.textContent = e.message
				}
			}, t.getEmptyContents && (k = document.createElement("div"), k.className = "empty-contents-container hidden", A = document.createElement("img"), A.className = "empty-contents-image", k.appendChild(A), N = document.createElement("div"), N.className = "empty-contents-message", k.appendChild(N), x.appendChild(k), _.onEmptyContentsChanged(), r.on("application.systemLanguageChange", _.onEmptyContentsChanged)), S = document.createElement("div"), S.className = "grid-container", S.setAttribute("role", "list"), t.title) {
				var B = function () {
					S.title = t.title()
				};
				r.on("application.systemLanguageChange", B),
				B()
			}
			x.appendChild(S),
			r.on("application.rotate", n),
			window.addEventListener("orientationchange", i),
			t.screen && r.on("manager.screen", c),
			t.view && r.on("manager.view", l),
			t.interactionHandler && (L = e("ui/interactionController").create({
						screen : t.screen,
						view : t.view,
						container : x,
						ancestorClassName : "gridItemGeneric",
						getContextItem : d,
						actionCallBack : t.interactionHandler,
						focusRingForItem : function (e) {
							return T.focusRingForItem(e, t.itemComparator)
						},
						getBackgroundElement : u,
						getBackgroundOverlayElement : m,
						backgroundPartiallySelectedOpacity : .4,
						backgroundSelectedOpacity : .6,
						backgroundOverlaySelectedOpacity : .4
					})),
			T = e("ui/container/grid/domController").create(x, S, [], O, L),
			x.addEventListener("scroll", h, !1),
			_.addItems = function (t) {
				T.appendItems(t),
				T.setShouldDelayLoadingImages(O);
				var n = Math.ceil(window.screen.height / T.itemHeight()),
				i = 0 === n % 2 ? n : n + 1,
				r = i / 2;
				y = e("ui/container/grid/scrollController").create(p(), T.itemHeight, T.getNumRows, i, r, v),
				_.setEmptyMessageVisible(_.isEmpty())
			},
			_.clear = function () {
				T && T.clear(),
				x.scrollTop = 0,
				O = "delayImageLoading" in t ? t.delayImageLoading : !0
			},
			_.animateDelete = function (t, n, i) {
				var r = T.getRowNumber(t[0]);
				void 0 !== r && (I && e("plugins/toaster/index").dismissToast(I), y.refreshVisibleRows(), L.clearSelection(), t.forEach(function (e) {
						T.getElement(e).classList.add("hidden")
					}), w(T.getItems().length - t.length), I = e("plugins/toaster/index").createFrenchToast(n, a.translate(5), E.bind(this, t), b.bind(this, t, i)))
			},
			_.updateItem = function (e) {
				T.updateItem(e, g, t.itemComparator)
			},
			_.removeItems = function (e) {
				var n = [];
				e.forEach(function (e) {
					T && -1 !== T.findItemPosition(e, t.itemComparator) && n.push(e)
				}),
				n.length && (w(T.getItems().length - 1), b(n))
			},
			_.replaceItems = function (e) {
				_.clear(),
				O = !1,
				_.addItems(e)
			},
			_.isEmpty = function () {
				return void 0 === T || 0 === T.getNumRows()
			},
			_.getItems = function () {
				return T.getItems()
			},
			_.getElements = function () {
				return T.getElements()
			},
			_.overrideDomController = function (t) {
				e("iris/utils").extend(T, t)
			},
			_.setEmptyMessageVisible = function (e) {
				k && e !== D && (D = e, e ? (x.style["overflow-y"] = "hidden", k.classList.remove("hidden"), T.setGridContainerHeight(0)) : (k.classList.add("hidden"), x.style["overflow-y"] = "scroll"))
			},
			_.getContextItem = L.getContextItem,
			_.completePendingDelete = function () {
				I && (e("plugins/toaster/index").dismissToast(I), I = void 0)
			}
		}
		var r = e("iris/event"),
		a = e("iris/i18n"),
		o = e("ui/utils"),
		s = "assets/cs_nc_browser.png",
		c = {
			create : function (e) {
				return new i(e)
			}
		};
		n.exports = c
	}), define("ui/container/grid/scrollController", function (e, t, n) {
		function i(e, t, n, i, r, a) {
			function o() {
				if (n() > 0) {
					var e = Math.ceil(window.screen.height / t());
					e = Math.min(e, n()),
					a(e),
					s = 0,
					c = e
				}
			}
			var s,
			c,
			l = this,
			d = 0;
			o(),
			l.showRowsBelowRow = function (e) {
				if (r > c - e) {
					var t = c,
					o = Math.min(t + i, n() - 1);
					o > t && (a(o), c = o)
				}
			},
			l.refreshVisibleRows = function () {
				var e = Math.floor(d / t()),
				r = Math.min(e + i, n() - 1);
				a(r),
				c = r
			},
			l.scrollPositionChanged = function (n) {
				n = 0 > n ? 0 : n,
				d = n;
				var i = Math.ceil((n + e) / t());
				l.showRowsBelowRow(i)
			},
			l.rotationFinished = function (n, o, l) {
				i = o,
				r = l,
				s = Math.max(Math.floor(n / t()) - r, 0),
				c = Math.ceil((n + e) / t()) + r,
				a(c)
			}
		}
		var r = {
			create : function (e, t, n, r, a, o) {
				return new i(e, t, n, r, a, o)
			}
		};
		n.exports = r
	}), define("ui/container/list/domController", function (e, t, n) {
		function i(t, n, i, r, a, o) {
			function s(e, t, n) {
				e.firstChild.firstChild.style.backgroundImage = t ? "url('" + t + "')" : "",
				e.firstChild.firstChild.firstChild.style.backgroundImage = n ? "url('" + n + "')" : ""
			}
			function c(e, t) {
				if (!e || !t)
					return document.createTextNode(e || "");
				var n = e.split(RegExp("(" + t + ")", "gi")),
				i = document.createDocumentFragment();
				return n.forEach(function (e, t) {
					var n = document.createTextNode(e);
					if (t % 2) {
						var r = document.createElement("span");
						r.className = "accent-colour-highlight",
						r.appendChild(n),
						n = r
					}
					i.appendChild(n)
				}),
				i
			}
			function l(e, t, n) {
				e.firstChild.lastChild.childNodes[0].firstChild.childNodes.length > 0 && (e.firstChild.lastChild.childNodes[0].firstChild.innerHTML = ""),
				e.firstChild.lastChild.childNodes[0].firstChild.appendChild(c(t, n))
			}
			function d(e, t, n) {
				e.firstChild.lastChild.childNodes[1].childNodes.length > 0 && (e.firstChild.lastChild.childNodes[1].innerHTML = ""),
				e.firstChild.lastChild.childNodes[1].appendChild(c(t, n))
			}
			function u(e, n) {
				var i = document.createElement("div");
				e.id && (i.id = e.id),
				i.className = (void 0 === e.listItemClass ? "" : e.listItemClass) + " listItemGeneric",
				i.setAttribute("role", e.a11yItemRole ? e.a11yItemRole : "listitem"),
				i.tabIndex = 1,
				i.contextItem = !0;
				var c = document.createElement("div");
				c.className = "listItemContents row-border-bottom",
				c.setAttribute("role", "link"),
				e.a11yItemTitle && (c.title = e.a11yItemTitle),
				e.itemAttributes && e.itemAttributes.forEach(function (e) {
					i.setAttribute(e.name, e.value)
				}),
				i.appendChild(c);
				var u = document.createElement("div");
				u.className = "listItemBackground accent-colour-shade-background listItemBaseBackground",
				u.setAttribute("aria-hidden", "true"),
				i.appendChild(u);
				var m = document.createElement("div");
				m.className = "listItemBackground inverted-background",
				m.setAttribute("aria-hidden", "true"),
				i.appendChild(m);
				var f = document.createElement("div");
				f.className = "focus-ring",
				f.setAttribute("aria-hidden", "true"),
				i.appendChild(f);
				var p = e.imageUrl || e.defaultImageUrl;
				if (p) {
					var g = document.createElement("div");
					g.className = (void 0 === e.listItemIconClass ? "" : e.listItemIconClass) + " listItemIconDiv",
					g.multiSelectable = e.multiSelectable,
					c.appendChild(g);
					var h = document.createElement("div");
					h.className = "listItemIconDiv",
					h.multiSelectable = e.multiSelectable,
					g.appendChild(h),
					s(i, e.defaultImageUrl, r ? void 0 : e.imageUrl)
				}
				var v = document.createElement("div");
				v.className = "listItemTextDiv end-horizontal-padding-size-m start-horizontal-padding-size-m",
				v.multiSelectable = e.multiSelectable;
				var b = document.createElement("div");
				b.className = "list-item-title font-size-primary",
				b.multiSelectable = e.multiSelectable,
				b.dir = "auto",
				e.a11yTitleLabel && b.setAttribute("aria-label", e.a11yTitleLabel),
				v.appendChild(b);
				var E = document.createElement("span");
				E.className = "listItemTitleSpan",
				E.multiSelectable = e.multiSelectable,
				a && t.id && (E.id = t.id + "_title_" + n, i.setAttribute("aria-labelledby", E.id), c.setAttribute("aria-hidden", "true")),
				e.description || E.setAttribute("role", "link"),
				b.appendChild(E);
				var w = document.createElement("div");
				return w.dir = "auto",
				w.className = "font-size-s secondary-text",
				e.description && w.classList.add("list-item-description"),
				e.a11yDescriptionLabel && w.setAttribute("aria-label", e.a11yDescriptionLabel),
				w.multiSelectable = e.multiSelectable,
				v.appendChild(w),
				c.appendChild(v),
				l(i, e.title, e.matchText),
				e.description && d(i, e.description, e.matchText),
				e.webkitTransform && (i.style.webkitTransform = e.webkitTransform),
				o.addFocusListeners(i),
				i
			}
			var m = -1,
			f = [],
			p = e("iris/event"),
			g = this;
			g.getBackgroundElement = function (e) {
				return e.childNodes[1]
			},
			g.getBackgroundOverlayElement = function (e) {
				return e.childNodes[2]
			},
			g.setShouldDelayLoadingImages = function (e) {
				r = e
			},
			g.clear = function () {
				n && n.childElementCount > 0 && (n.innerHTML = ""),
				g.setListContainerHeight(0),
				f = [],
				i = [],
				m = -1
			},
			g.addRows = function (e, r) {
				if (1 > e)
					throw "Cannot add rows to DOM. End row: " + e + ", must be greater than 1";
				if (!(m > e)) {
					e = Math.min(i.length - 1, e);
					for (var a = document.createDocumentFragment(), o = [], s = m + 1; e >= s; s++) {
						var c = r(i[s]),
						l = u(c, s);
						f.push(l),
						o.push(l),
						a.appendChild(l)
					}
					m = Math.min(e, i.length - 1),
					n.appendChild(a),
					p.emit("container.rowsAdded", [t, o])
				}
			},
			g.appendItems = function (e, t) {
				i = i.concat(e),
				g.setListContainerHeight(t * i.length)
			},
			g.loadDelayedImages = function (e) {
				if (r) {
					for (var t = 0; n.childNodes.length > t; t++) {
						var a = e(i[t]);
						a.imageUrl && s(n.childNodes[t], a.defaultImageUrl, a.imageUrl)
					}
					r = !1
				}
			},
			g.getRowElements = function () {
				return n.childNodes
			},
			g.getRowElement = function (e) {
				var t = i.indexOf(e);
				return -1 !== t && m >= t ? n.childNodes[t] : void 0
			},
			g.getRowElementByIndex = function (e) {
				return -1 !== e && m >= e ? n.childNodes[e] : void 0
			},
			g.getListItem = function (e) {
				return e && e.parentNode === n && -1 !== f.indexOf(e) ? i[f.indexOf(e)] : void 0
			},
			g.setListContainerHeight = function (e) {
				n.style.height = e + "px"
			},
			g.getRowNumbers = function (e) {
				for (var t = [], n = 0; e.length > n; n++)
					 - 1 !== i.indexOf(e[n]) && t.push(i.indexOf(e[n]));
				return t
			},
			g.getNumRows = function () {
				return i.length
			},
			g.removeItems = function (e, t) {
				for (var n = [], r = 0; e.length > r; r++) {
					var a = g.findItemPosition(e[r], t);
					-1 !== a && (f[a].parentNode.removeChild(f[a]), f.splice(a, 1), i.splice(a, 1), m--, n.push(e[r]))
				}
				return n
			},
			g.refreshRowAdapter = function (e) {
				for (var t = function (e, t) {
					e.setAttribute(t.name, t.value)
				}, n = 0; f.length > n; n++) {
					var r = f[n],
					a = e(i[n]);
					(a.imageUrl || a.defaultImageUrl) && s(r, a.defaultImageUrl, a.imageUrl),
					l(r, a.title, a.matchText),
					a.description && d(r, a.description, a.matchText),
					a.a11yTitle && (r.firstChild.title = a.a11yTitle),
					a.itemAttributes && a.itemAttributes.forEach(t.bind(this, r)),
					a.a11yTitleLabel && r.firstChild.lastChild.childNodes[0].setAttribute("aria-label", a.a11yTitleLabel),
					a.a11yDescriptionLabel && r.firstChild.lastChild.childNodes[1].setAttribute("aria-label", a.a11yDescriptionLabel)
				}
			},
			g.updateItem = function (e, t, n) {
				for (var r = function (e, t) {
					e.setAttribute(t.name, t.value)
				}, a = g.findItemPosition(e, n); -1 !== a; ) {
					var o = f[a];
					if (o) {
						var c = t(e),
						u = t(i[a]);
						(u.imageUrl !== c.imageUrl && c.imageUrl || u.defaultImageUrl !== c.defaultImageUrl && !c.imageUrl && !u.imageUrl || c.defaultImageUrl && u.imageUrl && !c.imageUrl) && s(o, c.defaultImageUrl, c.imageUrl),
						u.title !== c.title && l(o, c.title, c.matchText),
						u.description !== c.description && (c.description ? o.firstChild.lastChild.childNodes[1].classList.add("list-item-description") : o.firstChild.lastChild.childNodes[1].classList.remove("list-item-description"), d(o, c.description, c.matchText)),
						c.a11yTitle && (o.firstChild.title = c.a11yTitle),
						c.itemAttributes && c.itemAttributes.forEach(r.bind(this, o)),
						c.a11yTitleLabel && o.firstChild.lastChild.childNodes[0].setAttribute("aria-label", c.a11yTitleLabel),
						c.a11yDescriptionLabel && o.firstChild.lastChild.childNodes[1].setAttribute("aria-label", c.a11yDescriptionLabel),
						i[a] = e,
						a = g.findItemPosition(e, n, a + 1)
					} else
						i[a] = e, a = g.findItemPosition(e, n, a + 1)
				}
			},
			g.getItems = function () {
				return i
			},
			g.getElements = function () {
				return f
			},
			g.focusRingForItem = function (e, t) {
				var n = g.findItemPosition(e, t);
				return f[n].children[3]
			},
			g.findItemPosition = function (e, t, n) {
				n || (n = 0);
				var r = i.indexOf(e, n);
				if (-1 === r)
					for (var a = n; i.length > a; a++)
						if (t(e, i[a])) {
							r = a;
							break
						}
				return r
			}
		}
		var r = {
			create : function (e, t, n, r, a, o) {
				return new i(e, t, n, r, a, o)
			}
		};
		n.exports = r
	}), define("ui/container/list/list", function (e, t, n) {
		function i() {
			d.isASeries() ? (o = 88, s = 2.67) : d.isOSeries() || d.isWSeries() ? (o = 132, s = 2.588) : (o = 110, s = 2.75)
		}
		function r() {
			d.isASeries() ? (o = 88, s = 2.67) : d.isOSeries() || d.isWSeries() ? (o = 132, s = 2.588) : d.isLSeries() ? (o = 110, s = 2.75) : d.isClassic() ? (o = 88, s = 2.67) : (o = 99, s = 2.676)
		}
		function a(t) {
			function n(e) {
				e || (e = m.systemFontSize),
				D = Math.floor(Math.max(B * e, M))
			}
			function i() {
				return D || n(),
				D
			}
			function r(e, t) {
				n(t),
				x && x.setListContainerHeight(i() * x.getNumRows()),
				C && C.refreshScrollPosition(),
				H._scrollContainerHeight = void 0
			}
			function a() {
				B = t.lowInformationDensityListItemHeightToFontScaleRatio || s,
				M = t.lowInformationDensityMinimumListItemHeight || o,
				r()
			}
			function f() {
				B = s,
				M = o,
				r()
			}
			function p(n, i) {
				n == t.screen && ("popped" == i ? k && (e("plugins/toaster/index").dismissToast(k), k = void 0) : "hidden" == i ? k && (e("plugins/toaster/index").dismissToast(k), k = void 0) : "loadTransitionEnd" == i && E())
			}
			function g(n, i) {
				n == t.view && ("removed" == i ? k && (e("plugins/toaster/index").dismissToast(k), k = void 0) : "loadTransitionEnd" == i && E())
			}
			function h(e) {
				return x.getListItem(e)
			}
			function v(e) {
				return x.getBackgroundElement(e)
			}
			function b(e) {
				return x.getBackgroundOverlayElement(e)
			}
			function E() {
				P && (x.loadDelayedImages(T), P = !1)
			}
			function w() {
				return H._scrollContainerHeight || (H._scrollContainerHeight = N.clientHeight - N.offsetTop),
				H._scrollContainerHeight
			}
			function T(e) {
				return t.listToRowAdapter(e)
			}
			function y(e) {
				x.addRows(e, T)
			}
			function I() {
				C && C.scrollPositionChanged(N.scrollTop)
			}
			function S(e, n) {
				var i = x.removeItems(e, t.itemComparator);
				i.length > 0 && (k = void 0, H.setEmptyMessageVisible(H.isEmpty()), n && n(i))
			}
			var x,
			C,
			k,
			A,
			N,
			L,
			_,
			R,
			O,
			D,
			B,
			M,
			P = !0,
			U = !1,
			F = !0,
			H = this;
			if (N = document.createElement("div"), N.className = "scroll-container", t.scrollContainerClassName && N.classList.add(t.scrollContainerClassName), t.scrollContainerId && (N.id = t.scrollContainerId), t.container.appendChild(N), n(), c.on("application.systemFontChange", function (e, t) {
					r(e, t)
				}), d.onInformationDensity({
					low : a,
					high : f
				}), H.onEmptyContentsChanged = function () {
				if (L) {
					var e = t.getEmptyContents();
					e.imageUrl ? (_.src = "default" === e.imageUrl ? u : e.imageUrl, _.classList.remove("hidden")) : _.classList.add("hidden"),
					R.textContent = e.message
				}
			}, t.getEmptyContents && (L = document.createElement("div"), L.className = "empty-contents-container hidden", _ = document.createElement("img"), _.className = "empty-contents-image", _.setAttribute("aria-hidden", "true"), L.appendChild(_), R = document.createElement("div"), R.className = "empty-contents-message", L.appendChild(R), N.id && (R.id = N.id + "-empty-contents-message", R.setAttribute("aria-hidden", "true"), L.setAttribute("aria-labelledby", R.id)), N.appendChild(L), H.onEmptyContentsChanged(), c.on("application.systemLanguageChange", H.onEmptyContentsChanged)), A = document.createElement("div"), A.className = "list-container", A.setAttribute("role", t.a11yRole ? t.a11yRole : "list"), t.title) {
				var V = function () {
					A.title = t.title()
				};
				c.on("application.systemLanguageChange", V),
				V()
			}
			N.appendChild(A),
			t.screen && c.on("manager.screen", p),
			t.view && c.on("manager.view", g),
			t.interactionHandler && (O = e("ui/interactionController").create({
						screen : t.screen,
						view : t.view,
						container : N,
						ancestorClassName : "listItemGeneric",
						getContextItem : h,
						actionCallBack : t.interactionHandler,
						focusRingForItem : function (e) {
							return x.focusRingForItem(e, t.itemComparator)
						},
						getBackgroundElement : v,
						getBackgroundOverlayElement : b,
						selectedTextColorClass : "listItemSelectedTextColor",
						noDefaultFocus : t.noDefaultFocus,
						backgroundPartiallySelectedOpacity : .15,
						backgroundSelectedOpacity : .5,
						backgroundKeepSelectedOpacity : .2
					})),
			x = e("ui/container/list/domController").create(N, A, [], P, t.useTitleAsA11yLabel, O),
			N.addEventListener("scroll", I, !1),
			H.addItems = function (t) {
				var n = i();
				x.appendItems(t, n),
				x.setShouldDelayLoadingImages(P);
				var r = Math.ceil(window.screen.height / n),
				a = 0 === r % 2 ? r : r + 1,
				o = a / 2;
				C = e("ui/container/list/scrollController").create(w(), i, x.getNumRows, a, o, y),
				H.setEmptyMessageVisible(H.isEmpty())
			},
			H.appendItems = function (e) {
				x.appendItems(e, i()),
				C.refreshScrollPosition(),
				H.setEmptyMessageVisible(H.isEmpty())
			},
			H.clear = function () {
				x && x.clear(),
				N.scrollTop = 0,
				P = !0
			},
			H.animateDelete = function (t, n, a, o) {
				k && e("plugins/toaster/index").dismissToast(k);
				var s = x.getRowNumbers(t).sort(function (e, t) {
						return e - t
					});
				C.showRowsBelowRow(s[s.length - 1]),
				O.clearSelection();
				for (var c = 0; s.length > c; c++)
					x.getRowElementByIndex(s[c]).classList.add("hidden");
				x.setListContainerHeight(i() * (x.getNumRows() - s.length)),
				k = e("plugins/toaster/index").createFrenchToast(n, l.translate(5), function () {
						k = void 0,
						O.clearSelection();
						for (var e = 0; s.length > e; e++)
							x.getRowElementByIndex(s[e]).classList.remove("hidden");
						r(),
						o && o()
					}, S.bind(this, t, a))
			},
			H.update = function (e) {
				if (!t.itemComparator)
					throw Error("Cannot update list item, the item comparator is undefined");
				x.updateItem(e, T, t.itemComparator)
			},
			H.refreshRowAdapter = function () {
				x && x.refreshRowAdapter(T)
			},
			H.remove = function (e) {
				if (!t.itemComparator)
					throw Error("Cannot remove items from list, the item comparator is undefined");
				S(e)
			},
			H.hide = function () {
				A.classList.add("hidden")
			},
			H.show = function () {
				A.classList.remove("hidden")
			},
			H.isEmpty = function () {
				return void 0 === x || 0 === x.getNumRows()
			},
			H.getItems = function () {
				return x.getItems()
			},
			H.getElements = function () {
				return x.getElements()
			},
			H.keepListItemSelected = function (e) {
				var t = x.getRowElement(e);
				t && (t.keepListItemSelected = !0)
			},
			H.itemInList = function (e) {
				if (!t.itemComparator)
					throw Error("Cannot check if item is in list, the item comparator is undefined");
				return -1 !== x.findItemPosition(e, t.itemComparator)
			},
			H.replaceItems = function (e) {
				H.clear(),
				P = !1,
				H.addItems(e)
			},
			H.getRowClassList = function (e) {
				var t = x.getRowElement(e);
				return t ? t.classList : void 0
			},
			H.getIconClassList = function (e) {
				var t,
				n = x.getRowElement(e);
				return n && n.firstChild.firstChild && (t = n.firstChild.firstChild.classList),
				t
			},
			H.setEmptyMessageVisible = function (e) {
				!L || e === U || e && !F || (U = e, e ? (N.style["overflow-y"] = "hidden", L.classList.remove("hidden"), x.setListContainerHeight(0)) : (L.classList.add("hidden"), N.style["overflow-y"] = "scroll"))
			},
			H.enableEmptyContents = function (e) {
				F = e,
				H.setEmptyMessageVisible(e ? H.isEmpty() : !1)
			},
			H.completePendingDelete = function () {
				k && (e("plugins/toaster/index").dismissToast(k), k = void 0)
			}
		}
		var o,
		s,
		c = e("iris/event"),
		l = e("iris/i18n"),
		d = e("iris/device"),
		u = "assets/cs_nc_browser.png",
		m = e("iris/application");
		d.onInformationDensity({
			low : i,
			high : r
		});
		var f = {
			create : function (e) {
				return new a(e)
			}
		};
		n.exports = f
	}), define("ui/container/list/scrollController", function (e, t, n) {
		function i(e, t, n, i, r, a) {
			function o() {
				if (n() > 0) {
					var e = Math.ceil(window.screen.height / t());
					e = Math.min(e, n()),
					a(e),
					s = 1,
					c = e
				}
			}
			var s = 0,
			c = 0,
			l = 0,
			d = this;
			o(),
			d.showRowsBelowRow = function (e) {
				if (r > c - e) {
					var t = c,
					o = Math.min(t + i, n() - 1);
					o > t && (a(o), c = o)
				}
			},
			d.scrollPositionChanged = function (n) {
				n = 0 > n ? 0 : n;
				var i = Math.ceil((n + e) / t());
				d.showRowsBelowRow(i),
				l = n
			},
			d.refreshScrollPosition = function () {
				s || c ? d.scrollPositionChanged(l) : o()
			}
		}
		var r = {
			create : function (e, t, n, r, a, o) {
				return new i(e, t, n, r, a, o)
			}
		};
		n.exports = r
	}), define("ui/focusRingController", function (e, t, n) {
		function i(e) {
			function t(e, t) {
				switch (e) {
				case f.UNFOCUSED:
					if (t === f.FOCUS_TRANSITION_STARTED)
						return !0;
					break;
				case f.FOCUS_TRANSITION_STARTED:
					if (t === f.FOCUSED || t === f.UNFOCUS_TRANSITION_STARTED)
						return !0;
					break;
				case f.FOCUSED:
					if (t === f.UNFOCUS_TRANSITION_STARTED)
						return !0;
					break;
				case f.UNFOCUS_TRANSITION_STARTED:
					if (t === f.UNFOCUSED)
						return !0
				}
				return !1
			}
			function n(e) {
				e && e.focusAnimation ? e.focusAnimation.cancel() : u && u.cancel()
			}
			function i(t, n) {
				var i = e.focusRingForItem(t);
				i.style.webkitTransitionDuration = g + "ms",
				n && n.focusAnimation ? n.focusAnimation.cancel() : u && u.cancel();
				var a = function () {
					l(f.FOCUSED, t, n)
				},
				o = function () {
					i.style.opacity = "1"
				};
				n.focusAnimation = r.transitionWithTimeout(i, o, h, a),
				u = n.focusAnimation
			}
			function o(t) {
				t && t.focusAnimation ? t.focusAnimation.cancel() : u && u.cancel(),
				e.onFocusRingFocus && e.onFocusRingFocus()
			}
			function s(t, n) {
				var i = e.focusRingForItem(t);
				n && n.focusAnimation ? n.focusAnimation.cancel() : u && u.cancel();
				var a = function () {
					l(f.UNFOCUSED, t, n)
				},
				o = function () {
					i.style.opacity = "0"
				};
				n.focusAnimation = r.transitionWithTimeout(i, o, h, a),
				u = n.focusAnimation
			}
			function c(e) {
				return a.isVisible() && e ? e.focusRingState : p
			}
			function l(e, r, a) {
				var l = c(a);
				if (l !== e) {
					if (!t(l, e))
						throw Error("Cannot move focus ring state from current state : " + l + ", to new state : " + e);
					switch (d = r || d, p = e, a && (a.focusRingState = e), e) {
					case f.UNFOCUSED:
						n(a);
						break;
					case f.FOCUS_TRANSITION_STARTED:
						i(d, a);
						break;
					case f.FOCUSED:
						o(a);
						break;
					case f.UNFOCUS_TRANSITION_STARTED:
						s(d, a);
						break;
					default:
						throw Error("Cannot move focus ring state to new state : " + e)
					}
				}
			}
			var d,
			u,
			m = this,
			f = {
				UNFOCUSED : "unfocused",
				FOCUS_TRANSITION_STARTED : "focus_transition_started",
				FOCUSED : "focused",
				UNFOCUS_TRANSITION_STARTED : "unfocus_transition_started"
			},
			p = f.UNFOCUSED,
			g = 50,
			h = 80;
			m.setFocus = function (e, t, n) {
				!n || n.focusRingState && n.focusRingState !== f.UNFOCUS_TRANSITION_STARTED || (n.focusRingState = f.UNFOCUSED);
				var i,
				r = c(n);
				e && (n.focusRingState && n.focusRingState === f.UNFOCUSED || r === f.UNFOCUSED) ? (l(f.UNFOCUSED, t, n), i = f.FOCUS_TRANSITION_STARTED) : e || r === f.UNFOCUSED || (i = r === f.UNFOCUS_TRANSITION_STARTED ? f.UNFOCUSED : f.UNFOCUS_TRANSITION_STARTED),
				i && l(i, t, n)
			}
		}
		var r = e("ui/utils"),
		a = e("plugins/screens/selectmore/index"),
		o = {
			create : function (e) {
				return new i(e)
			}
		};
		n.exports = o
	}), define("ui/hover/hoverController", function (e, t, n) {
		function i(e, t) {
			if ("touchmove" !== e.type || d !== t) {
				var n = u.indexOf(d),
				i = u.indexOf(t);
				if (-1 !== n || -1 !== i) {
					"click" === e.type && e.stopPropagation();
					var r = {
						hoverInElement : "touchend" === e.type || "mouseup" === e.type || "click" === e.type ? void 0 : t,
						hoverOutElement : d,
						targetElement : l,
						event : e
					};
					-1 !== i && m[i].hoverEvent(r),
					-1 !== n && t !== d && m[n].hoverEvent(r)
				}
			}
		}
		function r(e) {
			"touchstart" === e.type ? (g = p.TOUCH, l = e.target) : "mousedown" === e.type ? (g = p.MOUSE, document.addEventListener("mouseup", r), l = e.target) : g === p.NONE && "click" === e.type && (g = p.KEYBOARD, l = e.target);
			var t;
			g === p.TOUCH ? t = v.getFirstTouchPoint(e.changedTouches) : g === p.MOUSE && (t = e);
			var n = g === p.TOUCH && !t;
			if (!(n || g === p.NONE || "touchmove" === e.type && f)) {
				var a;
				a = "touchmove" === e.type ? v.getElementFromTouchPoint(t) : e.target,
				i(e, a),
				d = "touchend" === e.type || "mouseup" === e.type || "mouseout" === e.type || "click" === e.type ? void 0 : a,
				("touchend" === e.type || "mouseup" === e.type || "click" === e.type) && (g = p.NONE, document.removeEventListener("mouseup", r), l = void 0)
			}
		}
		function a(e) {
			if (!e || !e.hoverTargetElement || !e.hoverEvent)
				throw Error("Cannot register invalid handler with hoverController");
			var t = e.hoverTargetElement();
			if (-1 !== u.indexOf(t))
				throw Error("Hover target element already registered with hoverController");
			u.push(t),
			m.push(e),
			t.addEventListener("touchstart", r),
			t.addEventListener("touchmove", r),
			t.addEventListener("touchend", r),
			t.addEventListener("click", r),
			t.addEventListener("mousedown", r),
			t.addEventListener("mouseup", r),
			t.addEventListener("mouseover", r),
			t.addEventListener("mouseout", r)
		}
		function o(e) {
			if (!e || !e.hoverTargetElement)
				throw Error("Cannot unregister invalid handler from hoverController");
			var t = e.hoverTargetElement(),
			n = u.indexOf(t);
			if (-1 === n)
				throw Error("Hover target element not registered with hoverController");
			t.removeEventListener("touchstart", r),
			t.removeEventListener("touchmove", r),
			t.removeEventListener("touchend", r),
			t.removeEventListener("click", r),
			t.removeEventListener("mousedown", r),
			t.removeEventListener("mouseup", r),
			t.removeEventListener("mouseover", r),
			t.removeEventListener("mouseout", r),
			u.splice(n, 1),
			m.splice(n, 1)
		}
		function s(e) {
			f = e
		}
		var c,
		l,
		d,
		u = [],
		m = [],
		f = !1,
		p = {
			TOUCH : "touch",
			MOUSE : "mouse",
			KEYBOARD : "keyboard",
			NONE : "none"
		},
		g = p.NONE,
		h = e("iris/event"),
		v = e("ui/utils");
		c = {
			register : function (e) {
				a(e)
			},
			unregister : function (e) {
				o(e)
			}
		},
		h.on("peek.start", s.bind(this, !0)),
		h.on("peek.end", s.bind(this, !1)),
		n.exports = c
	}), define("ui/hover/hoverHandlerFactory", function (e, t, n) {
		function i(e, t) {
			(e.hoverOutElement === t.hoverTargetElement || "click" === e.event.type) && window.webkitRequestAnimationFrame(function () {
				t.hoverStyleElement.style.webkitTransitionDuration = s.getTiming(t.hoverOutAnimationType) + "ms",
				t.hoverInClass && t.hoverStyleElement.classList.remove(t.hoverInClass),
				t.hoverOutClass && t.hoverStyleElement.classList.add(t.hoverOutClass)
			})
		}
		function r(e, t) {
			e.hoverInElement === t.hoverTargetElement && (t.hoverStyleElement.style.webkitTransitionDuration = s.getTiming(t.hoverInAnimationType) + "ms", t.hoverOutClass && t.hoverStyleElement.classList.remove(t.hoverOutClass), t.hoverInClass && t.hoverStyleElement.classList.add(t.hoverInClass)),
			i(e, t)
		}
		function a(e, t) {
			e.hoverInElement === t.hoverTargetElement && t.onHoverTouchIn && t.onHoverTouchIn(),
			e.hoverOutElement === t.hoverTargetElement && t.onHoverTouchEnd && t.onHoverTouchEnd(),
			"click" === e.event.type && t.onHoverTargetClick && t.onHoverTargetClick(),
			"touchend" == e.event.type && t.onHoverTargetTouchEnd && e.hoverOutElement === t.hoverTargetElement && (e.event.preventDefault(), t.onHoverTargetTouchEnd())
		}
		function o(e) {
			var t = this;
			t.hoverEvent = function (t) {
				return t.targetElement !== e.hoverTargetElement ? (t.hoverInElement === e.hoverTargetElement && e.onHoverTouchIn && e.onHoverTouchIn(), i(t, e), void 0) : (r(t, e), a(t, e), void 0)
			},
			t.hoverTargetElement = function () {
				return e.hoverTargetElement
			}
		}
		var s = e("ui/animationTimings"),
		c = {
			create : function (e) {
				return new o(e)
			}
		};
		n.exports = c
	}), define("ui/interactionController", function (e, t, n) {
		function i(t) {
			function n() {
				c.isVisible() || M.setUnselected(k),
				k && M.isUnselected(k) && M.setPartiallySelected(k)
			}
			function i() {
				O = !!_;
				var e = t.getContextItem(k);
				e && !c.isVisible() && (t.actionCallBack(s.hold, e), P = !0)
			}
			function d(e) {
				t.container && !t.noDefaultFocus && l.isClassic() && (e && t.container.contains(e) ? e.focus() : t.container.getElementsByClassName(t.ancestorClassName) && t.container.getElementsByClassName(t.ancestorClassName)[0] && t.container.getElementsByClassName(t.ancestorClassName)[0].focus())
			}
			function u(e, n) {
				if (e === t.screen && ("visible" === n && (!t.view || t.screen.getCurrentView() == t.view) || "loadTransitionEnd" === n)) {
					var i = k;
					F.clearSelection(),
					d(i)
				}
			}
			function m(e, n) {
				if (e === t.view && "loadTransitionEnd" === n) {
					var i = k;
					F.clearSelection(),
					d(i)
				}
			}
			function f(e) {
				k && t.getContextItem(k) === e && F.clearSelection()
			}
			function p(e) {
				for (var n = e; n && n !== t.container; ) {
					if (n.className && (n.className === t.ancestorClassName || -1 !== n.className.search(R)))
						return n;
					n = n.parentNode
				}
				return void 0
			}
			function g(e) {
				k = e,
				k || (N = void 0)
			}
			function h() {
				L = t.container.scrollTop
			}
			function v() {
				var e = t.container.scrollTop,
				n = Math.abs(L - e);
				n >= r.SCROLL_JITTER_THRESHOLD && !c.isVisible() && F.clearSelection()
			}
			function b(e, t) {
				for (var n = 0; e.changedTouches.length > n; n++)
					if (e.changedTouches[n].identifier === t)
						return !0;
				return !1
			}
			function E(e) {
				N && b(e, N) && (O = !0, F.clearSelection())
			}
			function w(e) {
				if (!O || c.isVisible())
					return e.stopPropagation(), void 0;
				var n = p(e.target),
				i = t.getContextItem(n);
				i && (N = void 0, F.clearSelection(), g(n), M.setSelected(n), t.actionCallBack(s.click, i, e))
			}
			function T(e) {
				if (void 0 === N || c.isVisible()) {
					h(),
					c.isVisible() || F.clearSelection(),
					N = e.touches[0].identifier,
					O = !0;
					var n = p(e.touches[0].target);
					_ && _ !== n && -1 === U.indexOf(_) && (M.setUnselected(_), _ = void 0);
					var i = t.getContextItem(n);
					if (!n || !i)
						return g(void 0), void 0;
					!c.isVisible() || 0 > U.indexOf(n) ? A = setTimeout(function () {
							A = void 0,
							B.setFocus(!0, i, n)
						}, D) : M.setSelectedPressed(n),
					g(n)
				}
			}
			function y(e) {
				if (e) {
					M.setSelected(e);
					var t = e.getElementsByClassName("gridItemCheckmark");
					t.length && (t[0].style.opacity = 1)
				}
			}
			function I(n) {
				var i = p(n.srcElement),
				r = t.getContextItem(i);
				if (c.isVisible()) {
					if (!i)
						return;
					n.preventDefault();
					var a = U.indexOf(i);
					return 0 > a ? (U.push(i), A = setTimeout(function () {
								A = void 0,
								B.setFocus(!0, r, i),
								M.setSelected(i)
							}, D)) : (U.splice(a, 1), B.setFocus(!1, r, i), M.setUnselected(i), r && t.actionCallBack(s.clearSelection, r)),
					e("iris/event").emit("selectmore.selectionChanged", [r]),
					g(i),
					void 0
				}
				2 === n.button && (h(), F.clearSelection(), O = !0, r && (g(i), M.setSelected(k), t.actionCallBack(s.hold, r)))
			}
			function S() {
				v()
			}
			function x(n) {
				v();
				var i = o.getFirstTouchPoint(n.changedTouches);
				if (i && k) {
					var r = t.getContextItem(k),
					a = o.getElementFromTouchPoint(i),
					l = p(a) === k;
					if (c.isVisible() && t && t.view && c.getView() === t.view) {
						var d = U.indexOf(k);
						return l ? (0 > d ? (U.push(k), y(k)) : (U.splice(d, 1), B.setFocus(!1, r, k), M.setUnselected(k), r && t.actionCallBack(s.clearSelection, r)), A && clearTimeout(A), e("iris/event").emit("selectmore.selectionChanged", [r])) : 0 > d ? (B.setFocus(!1, r, k), M.setUnselected(k)) : M.setSelected(k),
						n.preventDefault(),
						void 0
					}
					if (P && r)
						y(k), t.actionCallBack(s.holdRelease, r);
					else if (!P && l && r) {
						var u = k;
						N = void 0,
						F.clearSelection(),
						g(u),
						M.setSelected(u),
						t.actionCallBack(s.click, r, n)
					} else
						F.clearSelection();
					n.preventDefault()
				}
			}
			function C() {
				if (_ && t.container.contains(_)) {
					var n = t.getContextItem(_);
					n && (g(_), y(_), t.actionCallBack(s.hold, n), k && e("plugins/contextmenu/index").showContextMenu())
				}
			}
			var k,
			A,
			N,
			L,
			_,
			R = RegExp("(\\s|^)" + t.ancestorClassName + "((?=\\s)|$)", "g"),
			O = !0,
			D = 50,
			B = e("ui/focusRingController").create(t),
			M = e("ui/backgroundSelectionController").create(t),
			P = !1,
			U = [],
			F = this;
			t.onFocusRingFocus = n,
			t.onPartiallySelected = i,
			t.screen && a.on("manager.screen", u),
			t.view && a.on("manager.view", m),
			a.on("interaction.controller.clear.selection", f),
			F.clearSelection = function () {
				var e;
				if (P = !1, clearTimeout(A), (k || c.isVisible()) && M.clearAll(), c.isVisible())
					for (var n; U.length; )
						n = U.pop(), e = t.getContextItem(n), B.setFocus(!1, e, n);
				else if (k) {
					var i = t.getContextItem(k);
					B.setFocus(!1, i, k),
					e = t.getContextItem(k)
				}
				g(void 0),
				e && t.actionCallBack(s.clearSelection, e)
			},
			a.on("peek.start", F.clearSelection),
			h(),
			t.container.addEventListener("scroll", v, !1),
			a.on("screen.contextMenu.hiding", function () {
				c.isVisible() || F.clearSelection()
			}),
			t.container.addEventListener("touchcancel", E, !1),
			t.container.addEventListener("click", w, !1),
			t.container.addEventListener("touchstart", T, !1),
			a.on("selectmore.show", function (e) {
				e && e === t.view && (U = [], k && U.push(k))
			}),
			a.on("selectmore.remove", function (e) {
				e && e === t.view && F.clearSelection()
			}),
			a.on("selectmore.clearSelection", function (e) {
				e && e === t.view && F.clearSelection()
			}),
			F.selectNodes = function (e) {
				e.forEach(function (e) {
					U.push(e),
					B.setFocus(!0, t.getContextItem(e), e),
					y(e)
				})
			},
			a.on("selectmore.selectAll", function (e, n) {
				e && e === t.view && !t.container.parentElement.classList.contains("not-visible") && (F.clearSelection(), F.selectNodes(n))
			}),
			a.on("container.rowsAdded", function (e, n) {
				e && e === t.container && (c.isSelectingAll() && F.selectNodes(n), d(k))
			}),
			t.container.addEventListener("mousedown", I, !1),
			t.container.addEventListener("touchmove", S, !1),
			t.container.addEventListener("touchend", x, !1),
			F.getContextItem = function () {
				return t.getContextItem(k)
			},
			F.addFocusListeners = function (t) {
				t.addEventListener("focus", function () {
					!_ || c.isVisible() && -1 !== U.indexOf(t) || M.setUnselected(_),
					_ = t,
					M.setSelected(_)
				}, !1),
				t.addEventListener("blur", function () {
					!_ || e("plugins/contextmenu/index").isMenuVisible() && !document.getElementById("contextMenu").contains(t) || (c.isVisible() && -1 !== U.indexOf(t) ? M.setSelected(_) : M.setUnselected(_), _ = void 0)
				}, !1)
			},
			a.on("menuKeyPress", C)
		}
		var r,
		a = e("iris/event"),
		o = e("ui/utils"),
		s = {
			click : "click",
			hold : "hold",
			holdRelease : "holdRelease",
			clearSelection : "clearSelection"
		},
		c = e("plugins/screens/selectmore/index"),
		l = e("iris/device");
		r = {
			create : function (e) {
				return new i(e)
			},
			interactionType : s,
			SCROLL_JITTER_THRESHOLD : 15
		},
		n.exports = r
	}), define("ui/scroll.detector", function (e, t, n) {
		function i(e) {
			var t = d.getFirstTouchPoint(e.touches);
			t && (u = !1, s = t.screenY, m = !0)
		}
		function r(e) {
			var t = d.getFirstTouchPoint(e.touches);
			if (t) {
				var n = t.screenY;
				!u && Math.abs(s - n) > f && (u = !0, l.emit("scroll.detector.start", [], !0))
			}
		}
		function a(e) {
			var t = d.getFirstTouchPoint(e.changedTouches);
			t && (m = !1, l.emit("scrollDetector.scrollEnded", [u], !1))
		}
		function o() {
			document.addEventListener("touchstart", i, !0),
			document.addEventListener("touchmove", r, !0),
			document.addEventListener("touchend", a, !0)
		}
		var s,
		c,
		l = e("iris/event"),
		d = e("ui/utils"),
		u = !1,
		m = !1,
		f = 10;
		c = {
			isPossiblyScrolling : function () {
				return m
			}
		},
		l.once("browser.init.tier2", o),
		n.exports = c
	}), define("ui/utils", function (e, t, n) {
		function i(e, t, n) {
			return Math.max(e, Math.min(t, n))
		}
		function r(e) {
			return i(0, screen.height - 1, e)
		}
		function a(e) {
			return i(0, screen.width - 1, e)
		}
		function o(e) {
			("mousedown" === e.type || s.getFirstTouchPoint(e.changedTouches)) && (s.stopEvent(e), l.forEach(function (e) {
					document.removeEventListener(e, o, !0)
				}), c.forEach(function (e) {
					document.addEventListener(e, s.stopEvent, !0)
				}))
		}
		var s,
		c = ["mousedown", "mouseup", "click", "touchstart", "touchmove", "touchend"],
		l = ["mousedown", "touchstart"],
		d = 2e3,
		u = 0,
		m = e("iris/event"),
		f = 50;
		s = {
			stopEvent : function (e) {
				e.preventDefault(),
				e.stopPropagation()
			},
			preventUserInteraction : function () {
				0 === u && (l.forEach(function (e) {
						document.addEventListener(e, o, !0)
					}), u = setTimeout(function () {
							s.allowUserInteraction()
						}, d), m.emit("prevent.userInteraction", [], !0))
			},
			allowUserInteraction : function () {
				0 !== u && (clearTimeout(u), u = 0, l.forEach(function (e) {
						document.removeEventListener(e, o, !0)
					}), c.forEach(function (e) {
						document.removeEventListener(e, s.stopEvent, !0)
					}))
			},
			userInteractionPrevented : function () {
				return 0 !== u
			},
			transitionWithTimeout : function (e, t, n, i) {
				var r,
				a,
				o = window.performance.now(),
				s = function (t, n) {
					n.target == e && (clearTimeout(t), e.removeEventListener("webkitTransitionEnd", r, !1), i && i())
				};
				t(),
				i && (a = setTimeout(function () {
							var t,
							a = "transition timed out for <" + e.tagName + ' id="' + e.id + '" class="' + e.className + '"/> after ' + Math.floor(window.performance.now() - o) + "ms (original timeout of " + n + "ms)",
							s = function (i) {
								if (i.target == e) {
									clearTimeout(t),
									e.removeEventListener("webkitTransitionEnd", s);
									var r = Math.floor(window.performance.now() - o);
									if (.25 * n > r - n)
										return;
									console.log(a),
									console.log("webkitTransitionEnd finally came in for <" + e.tagName + ' id="' + e.id + '" class="' + e.className + '"/> after ' + r + "ms")
								}
							};
							e.removeEventListener("webkitTransitionEnd", r, !1),
							e.addEventListener("webkitTransitionEnd", s),
							t = setTimeout(function () {
									e.removeEventListener("webkitTransitionEnd", s),
									console.log(a),
									console.log("given up waiting for webkitTransitionEnd")
								}, n),
							i()
						}, n), r = s.bind(this, a), e.addEventListener("webkitTransitionEnd", r, !1));
				var c = function () {
					clearTimeout(a),
					e.removeEventListener("webkitTransitionEnd", r, !1)
				};
				return {
					cancel : c
				}
			},
			redirect : function (e, t, n) {
				e.style.pointerEvents = "all",
				t.forEach(function (t) {
					e.addEventListener(t, n, !0)
				})
			},
			clearRedirect : function (e, t, n) {
				e.style.pointerEvents = "",
				t.forEach(function (t) {
					e.removeEventListener(t, n, !0)
				})
			},
			scrollIntoViewIfNecessary : function (e, t) {
				var n = t || e;
				for (n = n.parentElement; n && n.scrollHeight <= n.clientHeight; )
					n = n.parentElement;
				if (n) {
					var i = e.getBoundingClientRect(),
					r = n.getBoundingClientRect(),
					a = n.scrollTop;
					i.top < r.top ? n.scrollTop += i.top - r.top - f : i.bottom > r.bottom ? n.scrollTop += i.bottom - r.bottom + f : a = void 0,
					n.scrollTop === a ? s.scrollIntoViewIfNecessary(e, n) : s.scrollIntoViewIfNecessary(n)
				}
			},
			getElementFromTouchPoint : function (e) {
				return e && void 0 !== e.clientX && void 0 !== e.clientY ? document.elementFromPoint(a(e.clientX), r(e.clientY)) : void 0
			},
			getFirstTouchPoint : function (e) {
				if (e && e.length)
					for (var t = 0; e.length > t; t++)
						if (0 === e[t].identifier)
							return e[t];
				return void 0
			},
			screenPointFromEvent : function (e) {
				var t = "changedTouches" in e ? s.getFirstTouchPoint(e.changedTouches) : e;
				return t && "screenX" in t && "screenY" in t ? {
					x : a(t.screenX),
					y : r(t.screenY)
				}
				 : void 0
			},
			rectContainsPoint : function (e, t) {
				return t.y < e.top || t.y > e.bottom || t.x < e.left || t.x > e.right ? !1 : !0
			}
		},
		n.exports = s
	});