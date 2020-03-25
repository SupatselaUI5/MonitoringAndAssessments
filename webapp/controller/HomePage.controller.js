sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
	"use strict";
	return Controller.extend("gdsd.Monitoring.controller.HomePage", {
		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// this.oRouter.getRoute("RouteHomePage").attachPatternMatched(this._onObjectMatched, this);
			this.onBindSWBP();
			var today = new Date();
			var date = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
			this.byId("objHeaderSW").setIntro(date);
		},

		_onObjectMatched: function () {

		},

		onBindSWBP: function () {
				// sap.ui.core.BusyIndicator.show();
				this._oODataModel = this.getOwnerComponent().getModel();
				this._oODataModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
				this._oODataModel.read("/GET_BPSet('1000000022')", {
					//User details retrieved successfully
					success: (function (oData) {
						// console.log("Success " + oData);
						this.byId("objHeaderSW").setModel(this._oODataModel);
						this.byId("objHeaderSW").bindElement({
							path: "/GET_BPSet('1000000022')"
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
			/**
			 *@memberOf gdsd.Monitoring.controller.HomePage
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