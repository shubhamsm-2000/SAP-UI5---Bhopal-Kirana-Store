sap.ui.define([
	'sap/m/MessageToast',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
    "sap/m/MessageBox",
	"sap/ui/core/Fragment"
], function(MessageToast, Controller, JSONModel, MessageBox, Fragment) {
	"use strict";

	var ListController = Controller.extend("bks.controller.Notification", {

		onInit: function() {
			// set mock model
			var sPath = sap.ui.require.toUrl("bks/json/feed.json");
			var oModel = new JSONModel(sPath);
			this.getView().setModel(oModel);
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

		onPress: function(oEvent) {
			MessageToast.show("Pressed on " + oEvent.getSource().getSender());
		},

		onActionPressed: function(oEvent) {
			var sAction = oEvent.getSource().getKey();

			if (sAction === "delete") {
				this.removeItem(oEvent.getParameter("item"));
				MessageToast.show("Item deleted");
			} else {
				MessageToast.show("Action \"" + sAction + "\" pressed.");
			}
		},

		removeItem: function(oFeedListItem) {
			var sFeedListItemBindingPath = oFeedListItem.getBindingContext().getPath();
			var sFeedListItemIndex = sFeedListItemBindingPath.split("/").pop();
			var aFeedCollection = this.getView().getModel().getProperty("/EntryCollection");

			aFeedCollection.splice(sFeedListItemIndex, 1);
			this.getView().getModel().setProperty("/EntryCollection", aFeedCollection);
		}
	});

	return ListController;
});