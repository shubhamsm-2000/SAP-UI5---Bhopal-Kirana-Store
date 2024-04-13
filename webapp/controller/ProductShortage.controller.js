sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	"bks/utility/Common",
	"sap/ui/core/Fragment",
], function (Controller, MessageBox, BusyIndicator, Common, Fragment) {
	"use strict";

	return Controller.extend("bks.controller.ProductShortage", {


		onInit: function () {

			var productType = {
				"productType": [{
					"Id": "F",
					"Type": "Fashion"
				}, {
					"Id": "E",
					"Type": "Electronic"
				}, {
					"Id": "C",
					"Type": "Clothes"
				}, {
					"Id": "B",
					"Type": "Beverage"
				}]
			};
			var oModelProductType = new sap.ui.model.json.JSONModel(productType);
			this.getView().setModel(oModelProductType, "productModel");

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


		onHomeCustomerSignIn: function () {
			debugger;
			var LoginType = "Customer";
			var oRouter = this.getOwnerComponent().getRouter();

			oRouter.navTo("loginRoute", {
				Type: window.encodeURIComponent(LoginType)
			});

			// oRouter.navTo("view1Route");

		},
	
		onProductCheck: function () {

			var that = this;
			BusyIndicator.show();
			$.ajax({
				url: Common.fnGetURL("/sap/opu/odata/sap/ZMM0688_SRV/GetProductShortage?IsShortage='X'"),
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
					var shortageProduct = oDataReturn.d.results;
					// oModel.setProperty("/customerDetail", salesDetailAll);
					oModel.setProperty("/productShortage", shortageProduct);

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
			var otable = that.byId("IdTable");
			var oModel = that.getView().getModel("mMainModel");
			otable.setModel(oModel);



		},

		onSort: function () {
			var oView = this.getView();
			if (!this.byId("IdSortProductDialog")) {
				Fragment.load({
					id: oView.getId(),
					name: "bks.fragment.sortProduct",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("IdSortProductDialog").open();
			}
		},
		
		onSalesResultSort: function (oEvent) {
			var oSortItem = oEvent.getParameter("sortItem");
			var sColumnPath = "Pid";
			var bDescending = oEvent.getParameter("sortDescending");
			var oSorters = [];

			if (oSortItem) {
				sColumnPath = oSortItem.getKey();

			}
			oSorters.push(new Sorter(sColumnPath, bDescending));

			var oTable = this.byId("IdTable");
			var oBinding = oTable.getBinding("items");
			oBinding.sort(oSorters);

		},

		onSearchListOrder: function (oEvent) {

			debugger;

			var filter0, filter1, filter2, filter3, filter4, filter5, filter6, filter7, filter8, filter9;

			var inputValue = oEvent.getParameter("query");

			var filterArr = [];

			filter0 = new sap.ui.model.Filter("Priority", sap.ui.model.FilterOperator.EQ, inputValue);
			filter1 = new sap.ui.model.Filter("Pid", sap.ui.model.FilterOperator.EQ, inputValue);
			filter2 = new sap.ui.model.Filter("Pname", sap.ui.model.FilterOperator.EQ, inputValue);
			filter3 = new sap.ui.model.Filter("CurrentPrice", sap.ui.model.FilterOperator.EQ, inputValue);
			filter4 = new sap.ui.model.Filter("AvailQuantity", sap.ui.model.FilterOperator.EQ, inputValue);
			filter5 = new sap.ui.model.Filter("Ptype", sap.ui.model.FilterOperator.EQ, inputValue);
			filter6 = new sap.ui.model.Filter("ShortageQty", sap.ui.model.FilterOperator.EQ, inputValue);
			filter7 = new sap.ui.model.Filter("Requirement", sap.ui.model.FilterOperator.EQ, inputValue);
			filter8 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, inputValue);
			

			filterArr = [filter0, filter1, filter2, filter3, filter4, filter5, filter6, filter7, filter8];

			var tableId = this.byId("IdTable");
			var obinding = tableId.getBinding("items");

			var finalFilter = new sap.ui.model.Filter({
				filters: filterArr,
				and: false
			});

			obinding.filter(finalFilter);

		},
		

	});

});