sap.ui.define([
	'sap/m/MessageToast',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
    "sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"sap/ui/core/BusyIndicator",
	"bks/utility/Common"
], function(MessageToast, Controller, JSONModel, MessageBox, Fragment, BusyIndicator, Common) {
	"use strict";

	var ListController = Controller.extend("bks.controller.CustomerProduct", {

		onInit: function (oEvent) {
			
			// var PType;
			// PType = window.decodeURIComponent(oEvent.getParameter("arguments").PType);

			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("CustomerProductRoute").attachPatternMatched(this._onObjectMatched, this);

		},

				// var oModel  = this.getView().getModel("oMainModel");
				// var customerId = this.byId("customerId").getValue();
				// var productId = this.byId("IdProductType").getSelectedKey();
	
				// var message1 = "Please Enter Customer Id ";
				// if (customerId === "") {
				// 	MessageBox.error(
				// 		message1
				// 	);
				// } else {
	
				// 	var product = "";
				// 	if (productId == "E")
				// 		product = "ELECTRONIC";
				// 	else if (productId == "F")
				// 		product = "FASHION";
				// 	else if (productId == "C")
				// 		product = "CLOTHES";
				// 	else if (productId == "B")
				// 		product = "BEVERAGES";

				_onObjectMatched: function(oEvent) {

					var PType = "";
                    
					PType = window.decodeURIComponent(oEvent.getParameter("arguments").PType);

					var prodType = this.getView().byId("IDPTypeCustomer").setText(PType);
	
					var that = this;
					BusyIndicator.show();
					$.ajax({
						url: Common.fnGetURL("/sap/opu/odata/sap/ZMM0688_SRV/GetProductCustomer?PType='" + PType + "'"),
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
							var ProductList = oDataReturn.d.results;
							// oModel.setProperty("/customerDetail", salesDetailAll);
							oModel.setProperty("/oProductList", ProductList);
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
				
	
			},



			// var oModel = new JSONModel(sap.ui.require.toUrl("bks/json/items.json"));
			// this.getView().setModel(oModel);

			// var oRouter = this.getOwnerComponent().getRouter();
			// oRouter.getRoute("CustomerHome").attachPatternMatched("FASHION", this);


	// },

		// _onObjectMatched: function (oEvent) {
		// 	this.getView().bindElement({
		// 		path: "/" + window.decodeURIComponent(oEvent.getParameter("arguments").invoicePath),
		// 		model: "invoice"_onObjectMatched: function (oEvent) {
		// 	this.getView().bindElement({
		// 		path: "/" + window.decodeURIComponent(oEvent.getParameter("arguments").invoicePath),
		// 		model: "invoice"
		// 	});
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

		onBack: function() {
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

		onSliderMoved: function (oEvent) {
			var fValue = oEvent.getParameter("value");
			this.byId("panelForGridList").setWidth(fValue + "%");
		},

		
	});

	return ListController;
});