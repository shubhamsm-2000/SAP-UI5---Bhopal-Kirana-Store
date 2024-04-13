sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	"bks/utility/Common",
	"sap/ui/core/Fragment",
], function (Controller, MessageBox, BusyIndicator, Common, Fragment) {
	"use strict";

	return Controller.extend("bks.controller.StoreMaster", {


		onInit: function () {

			var city = {
				"city": [{
					"Id": "MP04",
					"Type": "Bhopal"
				}, {
					"Id": "JH05",
					"Type": "Jamshedpur"
				}, {
					"Id": "MP09",
					"Type": "Indore"
				}, {
					"Id": "JH01",
					"Type": "Ranchi"
				},
				{
					"Id": "KL01",
					"Type": "Kolkata"
				},
				{
					"Id": "KA04",
					"Type": "Bangalore"
				},
				{
					"Id": "BR02",
					"Type": "Gaya"
				}]
			};
			var oModelcityLoc = new sap.ui.model.json.JSONModel(city);
			this.getView().setModel(oModelcityLoc, "cityModel");
		},


		// onChange: function() {
		// 	this.onLogin();
		// },

	
		onLogoClick: function () {

			var oView = this.getView();
			if (!this.byId("IDLogoPopup")) {
				Fragment.load({
					id: oView.getId(),
					name: "bks.fragment.logo",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("IDLogoPopup").open();
			}
		},

		onHome: function() {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("homeRoute");
		},

		onLogoClose: function () {
			this.byId("IDLogoPopup").close();
		},

		onNotification: function() {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("notificationRoute");
		},

		onBack: function() {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("homeRoute");
		},
		
		onSignOut: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("loginRoute");
		},

		onProductAvail: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("AvailableProductRoute");
		},
		onProductShort: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("ProductShortageRoute");
		},
		onNewOrder: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("addStockRoute");
		},

		onOrderHis: function (oEvent) {
			var ord = oEvent.mParameters.scope;
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("view1Route");
		},

		

	});

});