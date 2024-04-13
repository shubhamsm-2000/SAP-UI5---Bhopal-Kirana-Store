sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/BusyIndicator",
	"bks/utility/Common",
	"sap/ui/core/Fragment",
	"sap/ui/model/Sorter",
	"sap/ui/core/Configuration"

], function (Controller, MessageBox, JSONModel, BusyIndicator, Common, Fragment, Sorter, Configuration) {
	"use strict";

	return Controller.extend("bks.controller.View1", {
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


		},

		onClear: function () {

			this.byId("IdProductType").setSelectedKey("F");
			this.byId("orderId").setValue("");
			this.byId("customerId").setValue("");
			this.byId("datePick").setValue("");

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


		onAll: function () {

			// var oModel = this.getView().getModel("oMainModel");

			var that = this;
			BusyIndicator.show();
			$.ajax({
				url: Common.fnGetURL("/sap/opu/odata/sap/ZMM0688_SRV/SalesOrderSet?$format=json"),
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
					var salesDetailAll = oDataReturn.d.results;
					// oModel.setProperty("/customerDetail", salesDetailAll);
					oModel.setProperty("/oData", salesDetailAll);

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

		onSingle: function () {

			// var oModel  = this.getView().getModel("oMainModel");
			var customerId = this.byId("customerId").getValue();
			var productId = this.byId("IdProductType").getSelectedKey();

			var message1 = "Please Enter Customer Id ";
			if (customerId === "") {
				MessageBox.error(
					message1
				);
			} else {

				var product = "";
				if (productId == "E")
					product = "ELECTRONIC";
				else if (productId == "F")
					product = "FASHION";
				else if (productId == "C")
					product = "CLOTHES";
				else if (productId == "B")
					product = "BEVERAGES";

				var that = this;
				BusyIndicator.show();
				$.ajax({
					url: Common.fnGetURL("/sap/opu/odata/sap/ZMM0688_SRV/GetAllRecord?Cid='" + customerId + "'&Ptype='" + product +
						"'&$format=json"),
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
						var salesDetailSingle = oDataReturn.d.results;
						// oModel.setProperty("/customerDetail", salesDetailAll);
						oModel.setProperty("/oData", salesDetailSingle);
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

			var otable = that.byId("IdTable");
			var oModel = that.getView().getModel("mMainModel");
			otable.setModel(oModel);

		},

		// ****** Start Of Sort Frangment *************************************

		onSort: function () {
			var oView = this.getView();
			if (!this.byId("IdSortDialog")) {
				Fragment.load({
					id: oView.getId(),
					name: "bks.fragment.sort",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("IdSortDialog").open();
			}
		},

		onSalesResultSort: function (oEvent) {
			var oSortItem = oEvent.getParameter("sortItem");
			var sColumnPath = "Orderid";
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
		onClose: function () {
			this.byId("IdUpdateDialog").close();
		},

		// ****** End Of Sort Frangment ****************************************

		// ****** Start Of Row Selected Frangment ****************************************
		onRowSelected: function (oEvent) {

			debugger;
			// var orderId = this.getView().byId("IDorderIdFragRow").setValue("13213");
			// var orderId = this.byId("IDcustomerIdFragRow").setValue();
			// var orderId = this.byId("IDproductIdFragRow").setValue();
			// var orderId = this.byId("IDproductNameFragRow").setValue();
			// var orderId = this.byId("IDProductTypeFragRow").setSelectedKey();
			// var orderId = this.byId("IDPriceFragRow").setValue();
			// var orderId = this.byId("IDquantityFragRow").setValue();
			// var orderId = this.byId("IDTotalAmount").setValue();
			// var orderId = this.byId("IDstatusFragRow").setValue();
			// var productId = this.byId("IDdatePickFragRow").setValue();

			var oView = this.getView();

			if (!this.byId("IdOrderDetail")) {
				Fragment.load({
					id: oView.getId(),
					name: "Sales_Report.fragment.orderDetail",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("IdOrderDetail").open();
			}

			var k = oEvent.getSource().getBindingContextPath();
			var selectedRow = "mMainModel>" + k;

			// var f = this.getView().byId("IdSeller");
			// f.bindElement(selectedRow);

			// var oModel = this.getView().getModel("mMainModel");

			var oModel = this.getView().getModel("mMainModel");
			var selectedRowData = selectedRow;
			// oModel.setProperty("/customerDetail", salesDetailAll);
			oModel.setProperty("/RowData", selectedRowData);

			// oModel.setProperty("/RowFragment/Pid", selectedRow.Pid);
			// oModel.setProperty("/RowFragment/Pname", selectedRow.Pname);
			// oModel.setProperty("/RowFragment/Price", selectedRow.Price);
			// oModel.setProperty("/RowFragment/Quantity", selectedRow.Quantity);
			// oModel.setProperty("/RowFragment/Ptype", selectedRow.Ptype);
			// oModel.setProperty("/RowFragment/Amount", selectedRow.Amount);
			// oModel.setProperty("/RowFragment/Cid", selectedRow.Cid);
			// oModel.setProperty("/RowFragment/Status", selectedRow.Status);
			// oModel.setProperty("/RowFragment/Ordate", selectedRow.Ordate);

			// var custId = this.getView().byId("IDcustomerIdFragRow");
			// custId.bindElement(selectedRow);

			// var f2 = this.getView().byId("idForm2");

			// f2.bindElement(p);

			// var oModel = this.getView().getModel("mMainModel");
			// var values = oModel.getProperty(k);

			//var site=oModel.getProperty("/Store");

		},

		onSearchListOrder: function (oEvent) {

			debugger;

			var filter0, filter1, filter2, filter3, filter4, filter5, filter6, filter7, filter8, filter9;

			var inputValue = oEvent.getParameter("query");

			var filterArr = [];

			filter0 = new sap.ui.model.Filter("Orderid", sap.ui.model.FilterOperator.EQ, inputValue);
			filter1 = new sap.ui.model.Filter("Pid", sap.ui.model.FilterOperator.EQ, inputValue);
			filter2 = new sap.ui.model.Filter("Pname", sap.ui.model.FilterOperator.EQ, inputValue);
			filter3 = new sap.ui.model.Filter("Price", sap.ui.model.FilterOperator.EQ, inputValue);
			filter4 = new sap.ui.model.Filter("Quantity", sap.ui.model.FilterOperator.EQ, inputValue);
			filter5 = new sap.ui.model.Filter("Ptype", sap.ui.model.FilterOperator.EQ, inputValue);
			filter6 = new sap.ui.model.Filter("Amount", sap.ui.model.FilterOperator.EQ, inputValue);
			filter7 = new sap.ui.model.Filter("Cid", sap.ui.model.FilterOperator.EQ, inputValue);
			filter8 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, inputValue);
			filter9 = new sap.ui.model.Filter("Ordate", sap.ui.model.FilterOperator.EQ, inputValue);

			filterArr = [filter0, filter1, filter2, filter3, filter4, filter5, filter6, filter7, filter8, filter9];

			var tableId = this.byId("IdTable");
			var obinding = tableId.getBinding("items");

			var finalFilter = new sap.ui.model.Filter({
				filters: filterArr,
				and: false
			});

			obinding.filter(finalFilter);

		},

		onUpdate: function () {

			debugger;

			var aItems = this.getView().byId("IdTable").getItems();
			var aSelectedItems = [];

			for (var i = 0; i < aItems.length; i++) {
				if (aItems[i].getSelected()) {
					aSelectedItems.push(aItems[i]);
				}
			}
			// if (aSelectedItems.length === 1) {
			// var orderIdd = this.getView().byId("IDorderIdFragRow").setValue("" + aSelectedItems[0].OrderId + "");
			// var orderId = this.byId("IDorderIdFragRow").setValue("" + aSelectedItems[0].OrderId + "");
			// var customerId = this.byId("IDcustomerIdFragRow").setValue("" + aSelectedItems[0].Pid + "");
			// var productId = this.byId("IDproductIdFragRow").setValue("" + aSelectedItems[0].Pname + "");
			// var productName = this.byId("IDproductNameFragRow").setValue("" + aSelectedItems[0].Price + "");
			// var ProductType = this.byId("IDProductTypeFragRow").setSelectedKey("" + aSelectedItems[0].Quantity + "");
			// var Price = this.byId("IDPriceFragRow").setValue("" + aSelectedItems[0].Ptype + "");
			// var quantity = this.byId("IDquantityFragRow").setValue("" + aSelectedItems[0].Amount + "");
			// var TotalAmoun = this.byId("IDTotalAmount").setValue("" + aSelectedItems[0].Cid + "");
			// var status = this.byId("IDstatusFragRow").setValue("" + aSelectedItems[0].Status + "");
			// var datePic = this.byId("IDdatePickFragRow").setValue("" + aSelectedItems[0].Ordate + "");

			var oView = this.getView();
			if (!this.byId("IdOrderDetail")) {
				Fragment.load({
					id: oView.getId(),
					name: "Sales_Report.fragment.orderDetail",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("IdOrderDetail").open();
			}

			// }

		}
	});
});