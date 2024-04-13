sap.ui.define([], function () {
    "use strict";
    
    var Common = function () {
        // Do not use the constructor
        throw new Error();
    };
    
    Common.fnGetURL = function (sPath) {
    	
        var sDestination = "";
        var sRetVal = "";
        
        if (sPath) {
            if (sPath.charAt(0) !== "/") {
                sPath = "/" + sPath;
            }
        }
          if (window.location.href.indexOf("localhost") > -1) {
            sDestination = "/cr7";
        }

        sRetVal = sDestination + sPath;
        return sRetVal;
    };
    return Common;
}, true);