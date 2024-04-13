sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	"bks/utility/Common",
	"sap/ui/core/Fragment",
	"sap/ui/core/mvc/XMLView",
	// "sap/ui/model/json/JSONModel",
	"bks/model/models"
], function (Controller, MessageBox, BusyIndicator, Common, Fragment, models) {
	"use strict";

	return Controller.extend("bks.controller.Login", {

		// onInit: function() {
		// 	debugger;
		// 	var oPage = new sap.m.Page();
		// 	oPage.addStyleClass("myBackgroundStyle");
		// },

		onInit: function (oEvent) {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("homeRoute").attachPatternMatched(this._onObjectMatched, this);

			    debugger;
				// var oStoreMasterModel = models.createStoreMasterModel();
				// sap.ui.getCore().setModel(oStoreMasterModel);

				
				this.onDefaultStoreMasterName();

				// var omod = new JSONModel({
				var oModel = new sap.ui.model.json.JSONModel({
					"firstName": "Harry",
					"lastName": "Hawk",
					"enabled": true,
					"panelHeaderText": "Data Binding Basics"
				});
				// Assign the model object to the SAPUI5 core
				sap.ui.getCore().setModel(oModel);	
				

		},


		_onObjectMatched: function (oEvent) {

			debugger;

			var radioCustomer = this.getView().byId("idCustomer");
			var radioStoreMaster = this.getView().byId("IdStoreMaster");
			var type = this.getView().byId("IdLoginType");

			var LoginType = window.decodeURIComponent(oEvent.getParameter("arguments").Type);
			if (LoginType === "Customer") {
				var userid = this.getView().byId("IDuserId").setValue("Shubham");
				type.setSelectedIndex(0);
			}
			else {
				type.setSelectedIndex(1);
				radioStoreMaster.disabled = true;
			}

		},

		onChange: function () {
			this.onLogin();
		},

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

		onBack: function() {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("homeRoute");
		},

		onDefaultStoreMasterName: function(){
			debugger;
			// var oStoreMasterModel = models.createStoreMasterModel();
			// sap.ui.getCore().setModel(oStoreMasterModel);
		},

		onLogin: function () {

			// var userid   = this.getView().byid("IDuserId").getValue();   
			var userid = this.getView().byId("IDuserId").getValue() + "";
			var passward = this.getView().byId("IDpassward").getValue() + "";
			var type = this.getView().byId("IdLoginType").getSelectedButton().getText() + "";

			var message1 = "Please Enter User Id!";
			var message2 = "Please Enter Passward!";

			if (userid === "")
				MessageBox.error(message1);
			else if (passward === "")
				MessageBox.error(message2);
			else {

				if (type === 'Customer')
					type = 'C';
				else
					type = 'S';

				var that = this;
				BusyIndicator.show();
				$.ajax({
					url: Common.fnGetURL("/sap/opu/odata/sap/ZMM0688_SRV/GetLoginDetail?Userid='" + userid + "'&Password='" + passward + "'&Type='" +
						type + "'&format=json" ),
					method: "GET",
					contentType: "application/json",
					dataType: "json",
					// data: JSON.stringify(oPayload),
					// headers: {
					// 	"X-REQuested-With": "XMLHttpsREQuest"
					// },
					success: function (oDataReturn) {
						BusyIndicator.hide();
						debugger;

						var oRouter = that.getOwnerComponent().getRouter();
						oRouter.navTo("view1Route");

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

			}
			var oRouter = that.getOwnerComponent().getRouter();
			// oRouter.navTo("view1Route");
			oRouter.navTo("StoreMasterHomeRoute");
		
		},



		onBackToHome: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("homeRoute");

		},
		onTesting: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("view1Route");

		}

	});

});