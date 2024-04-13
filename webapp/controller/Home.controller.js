sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	"bks/utility/Common",
	"sap/ui/core/Fragment",
], function (Controller, MessageBox, BusyIndicator, Common, Fragment) {
	"use strict";

	return Controller.extend("bks.controller.Home", {


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
		onLogoClose: function () {
			this.byId("IDLogoPopup").close();
		},


		onHomeLogo: function () {

			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("StoreMasterHomeRoute");

		},

		onLogoClose: function () {
			this.byId("IDLogoPopup").close();
		},


		onHomeCustomerSignIn: function () {
			debugger;
			var LoginType = "Customer";
			var oRouter = this.getOwnerComponent().getRouter();

			oRouter.navTo("loginRoute", {
				Type: window.encodeURIComponent(LoginType)
			});

			// oRouter.navTo("view1Route");

		},

		onHomeRegister: function () {

			var oView = this.getView();
			if (!this.byId("IdRegisterUser")) {
				Fragment.load({
					id: oView.getId(),
					name: "bks.fragment.register",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("IdRegisterUser").open();
			}
		},

		onRegisterSave: function () {

			this.byId("IdRegisterUser").close();
			MessageBox.success("You Have SuccessFully Registed!");

		},


		onRegisterClose: function () {
			this.byId("IdRegisterUser").close();
		},

		onHomeCart: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("StoreMasterHomeRoute");

		},

		// onFashion: function () {
		// 	var oRouter = this.getOwnerComponent().getRouter();
		// 	oRouter.navTo("CustomerProductRoute");

		// },

		onElectronics: function (oEvent) {

			// var oRouter = this.getOwnerComponent().getRouter();
			// oRouter.navTo("CustomerProductRoute");

			var PType = "Electronics";

			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("CustomerProductRoute", {
				PType: window.encodeURIComponent(PType)
			});

			oRouter.navTo("CustomerProductRoute", {
				PType: window.encodeURIComponent(PType)
			});


			// var oItem = oEvent.getSource();
			// var oRouter = this.getOwnerComponent().getRouter();
			// oRouter.navTo("CustomerProduct", {
			// 	invoicePath: window.encodeURIComponent(oItem.getBindingContext("").getPath().substr(1))
			// });
		}

	});

});