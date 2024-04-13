sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	"bks/utility/Common",
	"sap/ui/core/Fragment"
], function (Controller, MessageBox, BusyIndicator, Common, Fragment) {
	"use strict";

	return Controller.extend("bks.controller.AvailableProduct", {


		onInit: function () {

			var productType = {
				"productType": [
					{
						"Id": "B",
						"Type": "Beverage"
					},
					{
						"Id": "E",
						"Type": "Electronic"
					}, {
						"Id": "C",
						"Type": "Clothes"
					},
					{
						"Id": "F",
						"Type": "Fashion"
					},]
			};
			var oModelProductType = new sap.ui.model.json.JSONModel(productType);
			// this.getView().setModel(oModelProductType, "productModel");
			this.getView().setModel(oModelProductType);

			// Country Code JSON Model
			var CoutryData = {
				"Country": [{
					"Id": "India",
					"Code": "IND"
				}, {
					"Id": "Australia",
					"Code": "AU"
				}, {
					"Id": "England",
					"Code": "ENG"
				}, {
					"Id": "Newzeland",
					"Code": "NZ"
				},
				{
					"Id": "West Indies",
					"Code": "WI"
				},
				{
					"Id": "Pakistan",
					"Code": "PAK"
				}]
			};

			// //Create OModel that will only accessible to this View only                              
			// var oCountryModel = sap.ui.model.json.JSONModel();

			// oCountryModel.setData(CoutryData);

			// // sap.ui.getCore().setModel(oCountryModel);
			// this.getView().setModel(oCountryModel);

			var oCountryModel = new sap.ui.model.json.JSONModel(CoutryData);
			this.getView().setModel(oCountryModel, "oCountryModel");


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

		onBack: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("StoreMasterHomeRoute");
		},

		onSignOut: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("loginRoute");
		},

		onHome: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("homeRoute");
		},

		onProductCheck: function () {

			var that = this;
			BusyIndicator.show();
			$.ajax({
				url: Common.fnGetURL("/sap/opu/odata/sap/ZMM0688_SRV/GetProductShortage?IsShortage=''"),
				method: "GET",
				contentType: "application/json",
				dataType: "json",
				// data: JSON.stringify(oPayload),
				// headers: {
				// 	"X-REQuested-With": "XMLHttpsREQuest"
				// },
				success: function (oDataReturn) {
					BusyIndicator.hide();
					var oModel = that.getView().getModel("mMainModel");
					var availableProduct = oDataReturn.d.results;
					// oModel.setProperty("/customerDetail", salesDetailAll);
					oModel.setProperty("/productAvailble", availableProduct);


				},
				error: function (oDataError) {
					BusyIndicator.hide();
					var sMsg = "";
					if (oDataError.responseJSON) {
						sMsg = oDataError.responseJSON.error.message.value;
					} else {
						sMsg = oDataError.statusText;
					}
					MessageBox.error(
						sMsg
					);

				}

			});
			// var otable = that.byId("IdTable");
			// var oModel = that.getView().getModel("mMainModel");
			// otable.setModel(oModel);



		}



	});

});