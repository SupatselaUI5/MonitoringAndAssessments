sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
	"use strict";
	return Controller.extend("gdsd.Monitoring.controller.HomePage", {
		onInit: function () {
			// this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// this.oRouter.getRoute("RouteHomePage").attachPatternMatched(this._onObjectMatched, this);
			this.onBindSWBP();
			var today = new Date();
			var date = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
			this.byId("objHeaderSW").setIntro(date);
		},

		_onObjectMatched: function () {
			// alert( "")
		},

		onBindSWBP: function () {
			sap.ui.core.BusyIndicator.show();

			this._oODataModel = this.getOwnerComponent().getModel();
			this._oODataModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
			this._oODataModel.read("/GET_BPSet", {
				//User details retrieved successfully
				success: (function (oData) {
					var BPJsonModel = new sap.ui.model.json.JSONModel({
						data: oData.results[0]
					});
					this.byId("objHeaderSW").setModel(BPJsonModel);
					this.byId("objHeaderSW").bindElement({
						path: "/data"
							// use OData parameters here if needed
					});
					var BPNo = oData.results[0].But000.Partner;
					var filterVal = "BpNo eq '" + BPNo + "'";
					this.getTaskData(filterVal);
					sap.ui.core.BusyIndicator.hide();
				}).bind(this),
				error: (function (e, x, r) {
					// console.log("Error " + e);
				})
			});
		},

		getTaskData: function (filter) {
				this._oODataModel.read("/Get_Funding_TaskSet", { // sPath - path of your Entityset
					urlParameters: {
						"$filter": filter
					},
					success: function (data, response) {
						var TaskJsonModel = new sap.ui.model.json.JSONModel({
							data: data.results[0]
						}, "Task");
						this.byId("taskList").setModel(TaskJsonModel);
						//your code for manipulation of the data received 
					}.bind(this), // if you want to use the current controller instance within this function
					error: function (response) {
							// for handling the error received
						}.bind(this) // if you want to use the current controller instance within this function
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