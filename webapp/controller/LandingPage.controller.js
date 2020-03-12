sap.ui.define(["sap/ui/core/mvc/Controller",
		"sap/ui/core/routing/History"
	],
	function (Controller, History) {
		"use strict";
		return Controller.extend("gdsd.Monitoring.controller.LandingPage", {
			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 * @memberOf gdsd.Monitoring.view.LandingPage
			 */
			onInit: function () {
				//Today's date for date of visit
				this.byId("DP_Visit").setDateValue(new Date());
				this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				this.oRouter.getRoute("LandingPage").attachPatternMatched(this._onObjectMatched, this);
			},

			_onObjectMatched: function () {
				
				sap.ui.core.BusyIndicator.show();
				this._oODataModel = this.getOwnerComponent().getModel();
				this._oODataModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
				this._oODataModel.read("/GET_BPSet('245')", {
					//User details retrieved successfully
					success: (function (oData) {
						// console.log("Success " + oData);
						this.byId("form0").setModel(this._oODataModel);
						this.byId("form0").bindElement({
							path: "/GET_BPSet('245')"
							// use OData parameters here if needed
						});
						sap.ui.core.BusyIndicator.hide();
						// this.getView().setModel(this._oODataModel);
						// this.byId("tblOfficial").setModel(this._oODataModel);
						// this.byId("inpOffName").bindElement({path : "/GET_BPSet('245')"});
					}).bind(this),
					error: (function (e, x, r) {
						// console.log("Error " + e);
					})
				});
			},

			onNavBack: function () {
					var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					oRouter.navTo("RouteHomePage", true);
				},
			/**
			 *@memberOf gdsd.Monitoring.controller.LandingPage
			 */
			action: function (oEvent) {
				var that = this;
				var actionParameters = JSON.parse(oEvent.getSource().data("wiring").replace(/'/g, "\""));
				var eventType = oEvent.getId();
				var aTargets = actionParameters[eventType].targets || [];
				aTargets.forEach(function (oTarget) {
					var oControl = that.byId(oTarget.id);
					if (oControl) {
						var oParams = {};
						for (var prop in oTarget.parameters) {
							oParams[prop] = oEvent.getParameter(oTarget.parameters[prop]);
						}
						oControl[oTarget.action](oParams);
					}
				});
				var oNavigation = actionParameters[eventType].navigation;
				if (oNavigation) {
					var oParams = {};
					(oNavigation.keys || []).forEach(function (prop) {
						oParams[prop.name] = encodeURIComponent(JSON.stringify({
							value: oEvent.getSource().getBindingContext(oNavigation.model).getProperty(prop.name),
							type: prop.type
						}));
					});
					if (Object.getOwnPropertyNames(oParams).length !== 0) {
						this.getOwnerComponent().getRouter().navTo(oNavigation.routeName, oParams);
					} else {
						this.getOwnerComponent().getRouter().navTo(oNavigation.routeName);
					}
				}
			}
		});
	});