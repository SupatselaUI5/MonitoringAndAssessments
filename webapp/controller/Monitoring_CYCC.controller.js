sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
	"use strict";
	return Controller.extend("gdsd.Monitoring.controller.Monitoring_CYCC", {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf gdsd.Monitoring.view.Monitoring_CYCC
		 */
		onInit: function () {},
		onIdentifyNextPress: function () {
			this.byId("IconBar").setSelectedKey("Icon2");
		},
		onManagementNextPress: function () {
			this.byId("IconBar").setSelectedKey("Icon3");
		},
		onManagementPrevPress: function () {
			this.byId("IconBar").setSelectedKey("Icon1");
		},
		onRecordNextPress: function () {
			this.byId("IconBar").setSelectedKey("Icon4");
		},
		onProgramNextPress: function () {
			this.byId("IconBar").setSelectedKey("Icon5");
		},
		onNormsNextPress: function () {
			this.byId("IconBar").setSelectedKey("Icon6");
		},
		onAddItems: function (oEvent) {
			var oTable = this.byId("tblFiles");
			var columnListItemNewLine = new sap.m.ColumnListItem({
				cells: [new sap.m.Input({
					width: "100%"
				})]
			});
			oTable.addItem(columnListItemNewLine);
		},
		onDeleteItem: function (oEvent) {
				var oTable = oEvent.getSource(),
					oItem = oEvent.getParameter("listItem");
				oTable.removeItem(oItem);
			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf gdsd.Monitoring.view.Monitoring_CYCC
			 */
			//	onBeforeRendering: function() {
			//
			//	},
			/**
			 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
			 * This hook is the same one that SAPUI5 controls get after being rendered.
			 * @memberOf gdsd.Monitoring.view.Monitoring_CYCC
			 */
			//	onAfterRendering: function() {
			//
			//	},
			/**
			 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
			 * @memberOf gdsd.Monitoring.view.Monitoring_CYCC
			 */
			//	onExit: function() {
			//
			//	}
			,
		/**
		 *@memberOf gdsd.Monitoring.controller.Monitoring_CYCC
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