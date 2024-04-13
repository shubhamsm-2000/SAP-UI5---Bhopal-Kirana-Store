sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/BusyIndicator",
	"bks/utility/Common",
	"sap/ui/core/Fragment"
], function (Controller, MessageBox, JSONModel, BusyIndicator, Common, Fragment) {
	"use strict";

	
	return Controller.extend("bks.controller.AddStock", {

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

			var SupplierName = {
				"SupplierName": [{
					"Id": "z",
					"Name": "Aashima Anupama Mall, BPK324"
				}, {
					"Id": "a",
					"Name": "P & M Mall Jamshedpur, JHB133"
				}, {
					"Id": "b",
					"Name": "Maharashtra Jeevan Pradhikaran, MHD735"
				}, {
					"Id": "c",
					"Name": "DB City mall, BPK327"
				}, {
					"Id": "d",
					"Name": "Nucleaus Mall Ranchi, JHR735"
				},
				{
					"Id": "e",
					"Name": "Adani Enterprises Limited., GJD734"
				},
				{
					"Id": "f",
					"Name": "Seyad Home Industries Private Limited, BL7387"
				}]
			};
			var oModelSupplierName = new sap.ui.model.json.JSONModel(SupplierName);
			this.getView().setModel(oModelSupplierName, "supplierModel");
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


		onAddRow: function () {
			var oModel = this.getView().getModel("mMainModel");
			// var item = {
			// 	"item": [{
			// 		"SNo": itemLength + 1,
			// 		"ProductName": "",
			// 		"ProductType": "",
			// 		"Quantity": "",
			// 		"Unit": "",
			// 		"ReqDate": ""
			// 	}]
			// };       

			// var oItems = new sap.ui.model.json.JSONModel(item);
			// this.getView().setModel(oItems, "Items");

			var oItems = oModel.getProperty("/Items");
			var itemLength = 0;
			var sNo = oItems.length + 1.

			var item = {
				// "SNo": "" + oItems.length + 1 + "",
				"SNo": sNo + "",
				"ProductName": "",
				"ProductType": "",
				"Quantity": "",
				"Unit": "",
				"ReqDate": ""
			};
			debugger

			oItems.push(item);
			oModel.setProperty("/oItemsData", oItems);

		},

		onDelete: function (oEvent) {
			var oModel = this.getView().getModel("mMainModel");
			var items = oModel.getProperty("/Items");
			var oTable = this.getView().byId("IDAddProdTable");
			var aSelectedItems = oTable.getSelectedItems();
			for (var i = aSelectedItems.length - 1; i >= 0; i--) {
				var oItemContextPath = aSelectedItems[i].oBindingContexts.mMainModel.sPath;
				var aPathParts = oItemContextPath.split("/");
				var iIndex = aPathParts[aPathParts.length - 1];
				items.splice(iIndex, 1);
			}
			oTable.removeSelections();

			// if (items !== [] || items !== "") {
			// 	var SNo = 0;
			// 	items.forEach(function (SNoValue) {
			// 		SNo = SNo + 1;
			// 		SNoValue.SNo = SNo;

			// 	});
			// }
			oModel.setProperty("/Items", items);
		},


		onGetSuppDetail: function () {

			var message1 = "Please Enter Supplier Name/Code!";

			var supplier = this.getView().byId("IDSupplier").getValue() + "";
			if (supplier === "")
				MessageBox.error(message1);

			else {

				var len = supplier.length;
				var SupplierCode = supplier.substring(len - 6, len);

				var that = this;
				// BusyIndicator.show();
				$.ajax({
					url: Common.fnGetURL("/sap/opu/odata/sap/ZMM0688_SRV/GetSupplierDetail?SupplierCode='" + SupplierCode + "'"),
					method: "GET",
					contentType: "application/json",
					dataType: "json",

					success: function (oDataReturn) {
						BusyIndicator.hide();
						var oModel = that.getView().getModel("mMainModel");
						var supplierDetail = oDataReturn.d;
						oModel.setProperty("/supplietInfo", supplierDetail);
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
		},


		// ********************// F4 Product Input *******************

		onProductF4: function (oEvent) {
			// var ItemPath = oEvent.oSource.oParent.oBindingContexts.mMainModel.sPath;

			// this.getView().getModel("mMainModel").setProperty("/ItemPath", ItemPath);

			var that = this;
			BusyIndicator.show();
			$.ajax({
				url: Common.fnGetURL("/sap/opu/odata/sap/ZMM0688_SRV/GetAllProduct"),
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
					var allProduct = oDataReturn.d.results;
					// oModel.setProperty("/customerDetail", salesDetailAll);
					oModel.setProperty("/oAllProduct", allProduct);

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


			var oView = this.getView();
			this.inputId = oEvent.getSource().getId();
			if (!this.byId("IdAddProductDialog")) {
				Fragment.load({
					id: oView.getId(),
					name: "bks.fragment.ProductAddF4",
					controller: this
					
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("IdAddProductDialog").open();
			}

			
		},
          
		MaterialUnit: function(oEvent) {
			var ItemPath = oEvent.oSource.oPropagatedProperties.oBindingContexts.mMainModel.sPath;
			ItemPath = ItemPath.split("/");
			ItemPath = ItemPath[ItemPath.length - 1];

			var MatIndex = oEvent.oSource.mAssociations.selectedItem;
			MatIndex = MatIndex.split("-");
			MatIndex = MatIndex[MatIndex.length - 1];

			var oModel = this.getView().getModel("mMainModel");
			var MatIndex = oModel.getProperty("/Material/" + MatIndex);

			oModel.setProperty("/Items/" + ItemPath + "/QuantityUom", MatIndex.Unit);
			oModel.setProperty("/Items/" + ItemPath + "/Material", MatIndex.MatValue);
			oModel.setProperty("/Items/" + ItemPath + "/MatKey", MatIndex.MatKey);
		},

		// *****************************************************************************************



		onSendOrder: function () {

			var message1 = "Please Provide Supplier Detail";

			var supplier = this.getView().byId("IDSupplier").getValue() + "";
			if (supplier === "")
				MessageBox.error(message1);

			else {

				//Supplier Code
				var len = supplier.length;
				var SupplierCode = supplier.substring(len - 6, len);

				//Table Data
				var oModel = this.getView().getModel("mMainModel");
				var oItemsMat = oModel.getProperty("/Items");

				var oPayload = {

					"SupplierCode": SupplierCode,
					"ProductList": oItemsMat,
				}

				BusyIndicator.show();
				$.ajax({
					url: Common.fnGetURL("/sap/opu/odata/sap/ZMM0688_SRV/SupplierOrderedSet"),
					method: "POST",
					contentType: "application/json",
					dataType: "json",
					data: JSON.stringify(oPayload),
					headers: {
						"X-REQuested-With": "XMLHttpsREQuest"
					},
					success: function (oDataReturn) {
						BusyIndicator.hide();
						MessageBox.error(
							sMsg
						);

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
		}


	});



});