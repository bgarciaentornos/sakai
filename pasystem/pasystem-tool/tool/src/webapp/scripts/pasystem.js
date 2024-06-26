function PASystemBannerAlerts(json, csrf_token) {
  this.json = json;
  this.csrf_token = csrf_token;

  var templateString = $("#pasystemBannerAlertsTemplate").html().trim().toString();
  this.bannerTemplate = TrimPath.parseTemplate(templateString, "pasystemBannerAlertsTemplate");

  this.setupAlertBannerToggle();
  this.renderBannerAlerts();
  this.setupEvents();
}


PASystemBannerAlerts.prototype.getBannerAlerts = function() {
  return $(".pasystem-banner-alert");
};


PASystemBannerAlerts.prototype.showAllAlerts = function() {
  this.clearAcknowledgements();
  this.renderBannerAlerts(true);
};


PASystemBannerAlerts.prototype.handleBannerAlertClose = function($alert) {
  var self = this;

  var alertId = $alert.attr("id");

  $alert.slideUp(function() {
    if (alertId == "tz") {
      // dismiss for the duration of the user's session
      document.cookie = "pasystem_timezone_warning_dismissed=true; path=/;";
    } else {
      self.acknowledge(alertId);
      self.$toggle.show();
    }
  });
};


PASystemBannerAlerts.prototype.hasAlertBeenDismissed = function(alert) {
  return alert.dismissed;
};


PASystemBannerAlerts.prototype.renderBannerAlerts = function(forceShowAllBanners) {
  var self = this;

  if (typeof self.$container == "undefined") {
    self.$container = $("<div>").addClass("pasystem-banner-alerts");
    self.$container.attr('role', 'status');
    $(".portal-pasystem").prepend(self.$container);
  } else {
    self.$container.empty();
  }

  $.each(self.json, function(i, alert) {
    var $alert = $(self.bannerTemplate.process(alert));
    $alert.hide();
    self.$container.append($alert);

    if (forceShowAllBanners || !self.hasAlertBeenDismissed(alert)) {
      $alert.show();
    } else {
      self.$toggle.show();
    }
  });
};

PASystemBannerAlerts.prototype.addBannerAlert = function(id, message, dismissible, type) {
  this.json.push({
    id: id,
    message: message,
    dismissible: dismissible,
    type: type
  });

  this.renderBannerAlerts();
};


PASystemBannerAlerts.prototype.setupEvents = function() {
  var self = this;

  $(document).on("click", ".pasystem-banner-alert-close", function() {
    self.handleBannerAlertClose($(this).closest(".pasystem-banner-alert"));
    return false;
  });
};


PASystemBannerAlerts.prototype.clearAcknowledgements = function() {
  var self = this;

  $.ajax({
    method: 'POST',
    url: '/direct/pasystem/clearBannerAcknowledgements',
    data: {
      sakai_csrf_token: this.csrf_token
    }
  });
};


PASystemBannerAlerts.prototype.acknowledge = function(uuid) {
  var self = this;

  $.ajax({
    method: 'POST',
    url: '/direct/pasystem/bannerAcknowledge',
    data: {
      uuid: uuid,
      sakai_csrf_token: this.csrf_token
    }
  });
};


PASystemBannerAlerts.prototype.setupAlertBannerToggle = function() {
  var self = this;

  self.$toggle = $($("#pasystemBannerAlertsToggleTemplate").html().trim());

  if ($('.Mrphs-siteHierarchy:visible').length > 0) {
    // Place the notification in the breadcrumbs bar where it's out of the way
    self.$toggle.css('top', ($('.Mrphs-siteHierarchy').offset().top) + 'px');
  }

  self.$toggle.hide();
  $("#loginLinks").prepend(self.$toggle);

  self.$toggle.on("click", function(event) {
    event.preventDefault();

    self.showAllAlerts();
    self.$toggle.slideUp();

    return false;
  });
};


function PASystemPopup(uuid, csrf_token) {
  this.permanentlyAcknowledged = false;
  this.uuid = uuid;
  this.csrf_token = csrf_token;

  this.$popupContent = $('#popup-container-content');

  if (this.uuid) {
    this.showPopup();
  }
};


PASystemPopup.prototype.showPopup = function() {
  var self = this;

  var popupHTML = (self.$popupContent.html() + $('#popup-container-footer').html()).trim();

  $.featherlight(popupHTML,
                 {
                   afterClose : function (event) {
                     var acknowledgement = self.permanentlyAcknowledged ? 'permanent' : 'temporary';
                     self.acknowledge(acknowledgement);
                     $("#pasystem-popup-wrapper").remove();
                   },
                   afterContent : function (event) {
                     $('#popup-acknowledged-button').on('click', function () {
                       self.permanentlyAcknowledged = true;
                       $.featherlight.current().close();
                     });

                     $('#popup-later-button').on('click', function () {
                       self.permanentlyAcknowledged = false;
                       $.featherlight.current().close();
                     });
                   },
                   beforeOpen: function() {
                     this.$instance.find(".featherlight-content").attr("tabindex", 0);
                   },
                   afterOpen: function() {
                     this.$instance.find(".featherlight-content").focus();
                   }
                 });

  $(".featherlight").after($('<div/>', {id:"pasystem-popup-wrapper"}));
  $("#pasystem-popup-wrapper").append($(".featherlight"));

};


PASystemPopup.prototype.acknowledge = function(acknowledgement) {
  if (this.uuid !== 'preview') {
    $.ajax({
      method: 'POST',
      url: '/direct/pasystem/popupAcknowledge',
      data: {
        uuid: this.uuid,
        acknowledgement: acknowledgement,
        sakai_csrf_token: this.csrf_token
      },
    });
  }
};


/* jstz.min.js Version: 1.0.7 Build date: 2019-09-09 */
!function(e){var a=function(){"use strict";var e="s",s={DAY:864e5,HOUR:36e5,MINUTE:6e4,SECOND:1e3,BASELINE_YEAR:2014,MAX_SCORE:864e6,AMBIGUITIES:{"America/Denver":["America/Mazatlan"],"America/Chicago":["America/Mexico_City"],"America/Asuncion":["America/Campo_Grande","America/Santiago"],"America/Montevideo":["America/Sao_Paulo","America/Santiago"],"Asia/Beirut":["Asia/Amman","Asia/Jerusalem","Europe/Helsinki","Asia/Damascus","Africa/Cairo","Asia/Gaza","Europe/Minsk","Africa/Windhoek"],"Pacific/Auckland":["Pacific/Fiji"],"America/Los_Angeles":["America/Santa_Isabel"],"America/New_York":["America/Havana"],"America/Halifax":["America/Goose_Bay"],"America/Godthab":["America/Miquelon"],"Asia/Dubai":["Asia/Yerevan"],"Asia/Jakarta":["Asia/Krasnoyarsk"],"Asia/Shanghai":["Asia/Irkutsk","Australia/Perth"],"Australia/Sydney":["Australia/Lord_Howe"],"Asia/Tokyo":["Asia/Yakutsk"],"Asia/Dhaka":["Asia/Omsk"],"Asia/Baku":["Asia/Yerevan"],"Australia/Brisbane":["Asia/Vladivostok"],"Pacific/Noumea":["Asia/Vladivostok"],"Pacific/Majuro":["Asia/Kamchatka","Pacific/Fiji"],"Pacific/Tongatapu":["Pacific/Apia"],"Asia/Baghdad":["Europe/Minsk","Europe/Moscow"],"Asia/Karachi":["Asia/Yekaterinburg"],"Africa/Johannesburg":["Asia/Gaza","Africa/Cairo"]}},i=function(e){var a=-e.getTimezoneOffset();return null!==a?a:0},r=function(){for(var e=[],a=0;a<=11;a++)for(var r=1;r<=28;r++){var n=i(new Date(s.BASELINE_YEAR,a,r));e?e&&e[e.length-1]!==n&&e.push(n):e.push()}return e},n=function(){var a=0,s=r();return s.length>1&&(a=s[0]-s[1]),s.length>3?s[0]+",1,weird":a<0?s[0]+",1":a>0?s[1]+",1,"+e:s[0]+",0"},o=function(){var e,a;if(Intl&&"undefined"!=typeof Intl&&"undefined"!=typeof Intl.DateTimeFormat&&(e=Intl.DateTimeFormat(),"undefined"!=typeof e&&"undefined"!=typeof e.resolvedOptions))return a=e.resolvedOptions().timeZone,a&&(a.indexOf("/")>-1||"UTC"===a)?a:void 0},t=function(e){for(var a=new Date(e,0,1,0,0,1,0).getTime(),s=new Date(e,12,31,23,59,59).getTime(),i=a,r=new Date(i).getTimezoneOffset(),n=null,o=null;i<s-864e5;){var t=new Date(i),A=t.getTimezoneOffset();A!==r&&(A<r&&(n=t),A>r&&(o=t),r=A),i+=864e5}return!(!n||!o)&&{s:u(n).getTime(),e:u(o).getTime()}},u=function f(e,a,i){"undefined"==typeof a&&(a=s.DAY,i=s.HOUR);for(var r=new Date(e.getTime()-a).getTime(),n=e.getTime()+a,o=new Date(r).getTimezoneOffset(),t=r,u=null;t<n-i;){var A=new Date(t),c=A.getTimezoneOffset();if(c!==o){u=A;break}t+=i}return a===s.DAY?f(u,s.HOUR,s.MINUTE):a===s.HOUR?f(u,s.MINUTE,s.SECOND):u},A=function(e,a,s,i){if("N/A"!==s)return s;if("Asia/Beirut"===a){if("Africa/Cairo"===i.name&&13983768e5===e[6].s&&14116788e5===e[6].e)return 0;if("Asia/Jerusalem"===i.name&&13959648e5===e[6].s&&14118588e5===e[6].e)return 0}else if("America/Santiago"===a){if("America/Asuncion"===i.name&&14124816e5===e[6].s&&1397358e6===e[6].e)return 0;if("America/Campo_Grande"===i.name&&14136912e5===e[6].s&&13925196e5===e[6].e)return 0}else if("America/Montevideo"===a){if("America/Sao_Paulo"===i.name&&14136876e5===e[6].s&&1392516e6===e[6].e)return 0}else if("Pacific/Auckland"===a&&"Pacific/Fiji"===i.name&&14142456e5===e[6].s&&13961016e5===e[6].e)return 0;return s},c=function(e,i){for(var r=function(a){for(var r=0,n=0;n<e.length;n++)if(a.rules[n]&&e[n]){if(!(e[n].s>=a.rules[n].s&&e[n].e<=a.rules[n].e)){r="N/A";break}if(r=0,r+=Math.abs(e[n].s-a.rules[n].s),r+=Math.abs(a.rules[n].e-e[n].e),r>s.MAX_SCORE){r="N/A";break}}return r=A(e,i,r,a)},n={},o=a.olson.dst_rules.zones,t=o.length,u=s.AMBIGUITIES[i],c=0;c<t;c++){var m=o[c],l=r(o[c]);"N/A"!==l&&(n[m.name]=l)}for(var f in n)if(n.hasOwnProperty(f))for(var d=0;d<u.length;d++)if(u[d]===f)return f;return i},m=function(e){var s=function(){for(var e=[],s=0;s<a.olson.dst_rules.years.length;s++){var i=t(a.olson.dst_rules.years[s]);e.push(i)}return e},i=function(e){for(var a=0;a<e.length;a++)if(e[a]!==!1)return!0;return!1},r=s(),n=i(r);return n?c(r,e):e},l=function(e){var i=!1,t=n();return(e||"undefined"==typeof e)&&(i=o()),i||(i=a.olson.timezones[t],"undefined"!=typeof s.AMBIGUITIES[i]&&(i=m(i))),{name:function(){return i},using_intl:e||"undefined"==typeof e,needle:t,offsets:r()}};return{determine:l}}();a.olson=a.olson||{},a.olson.timezones={"-720,0":"Etc/GMT+12","-660,0":"Pacific/Pago_Pago","-660,1,s":"Pacific/Apia","-600,1":"America/Adak","-600,0":"Pacific/Honolulu","-570,0":"Pacific/Marquesas","-540,0":"Pacific/Gambier","-540,1":"America/Anchorage","-480,1":"America/Los_Angeles","-480,0":"Pacific/Pitcairn","-420,0":"America/Phoenix","-420,1":"America/Denver","-360,0":"America/Guatemala","-360,1":"America/Chicago","-360,1,s":"Pacific/Easter","-300,0":"America/Bogota","-300,1":"America/New_York","-270,0":"America/Caracas","-240,1":"America/Halifax","-240,0":"America/Santo_Domingo","-240,1,s":"America/Asuncion","-210,1":"America/St_Johns","-180,1":"America/Godthab","-180,0":"America/Buenos_Aires","-180,1,s":"America/Montevideo","-120,0":"America/Noronha","-120,1":"America/Noronha","-60,1":"Atlantic/Azores","-60,0":"Atlantic/Cape_Verde","0,0":"UTC","0,1":"Europe/London","0,1,weird":"Africa/Casablanca","60,1":"Europe/Berlin","60,0":"Africa/Lagos","60,1,weird":"Africa/Casablanca","120,1":"Asia/Beirut","120,1,weird":"Africa/Cairo","120,0":"Africa/Johannesburg","180,0":"Asia/Baghdad","180,1":"Europe/Moscow","210,1":"Asia/Tehran","240,0":"Asia/Dubai","240,1":"Asia/Baku","270,0":"Asia/Kabul","300,1":"Asia/Yekaterinburg","300,0":"Asia/Karachi","330,0":"Asia/Calcutta","345,0":"Asia/Katmandu","360,0":"Asia/Dhaka","360,1":"Asia/Omsk","390,0":"Asia/Rangoon","420,1":"Asia/Krasnoyarsk","420,0":"Asia/Jakarta","480,0":"Asia/Shanghai","480,1":"Asia/Irkutsk","525,0":"Australia/Eucla","525,1,s":"Australia/Eucla","540,1":"Asia/Yakutsk","540,0":"Asia/Tokyo","570,0":"Australia/Darwin","570,1,s":"Australia/Adelaide","600,0":"Australia/Brisbane","600,1":"Asia/Vladivostok","600,1,s":"Australia/Sydney","630,1,s":"Australia/Lord_Howe","660,1":"Asia/Kamchatka","660,0":"Pacific/Noumea","690,0":"Pacific/Norfolk","720,1,s":"Pacific/Auckland","720,0":"Pacific/Majuro","765,1,s":"Pacific/Chatham","780,0":"Pacific/Tongatapu","780,1,s":"Pacific/Apia","840,0":"Pacific/Kiritimati"},a.olson.dst_rules={years:[2008,2009,2010,2011,2012,2013,2014],zones:[{name:"Africa/Cairo",rules:[{e:12199572e5,s:12090744e5},{e:1250802e6,s:1240524e6},{e:12858804e5,s:12840696e5},!1,!1,!1,{e:14116788e5,s:1406844e6}]},{name:"America/Asuncion",rules:[{e:12050316e5,s:12243888e5},{e:12364812e5,s:12558384e5},{e:12709548e5,s:12860784e5},{e:13024044e5,s:1317528e6},{e:1333854e6,s:13495824e5},{e:1364094e6,s:1381032e6},{e:13955436e5,s:14124816e5}]},{name:"America/Campo_Grande",rules:[{e:12032172e5,s:12243888e5},{e:12346668e5,s:12558384e5},{e:12667212e5,s:1287288e6},{e:12981708e5,s:13187376e5},{e:13302252e5,s:1350792e6},{e:136107e7,s:13822416e5},{e:13925196e5,s:14136912e5}]},{name:"America/Goose_Bay",rules:[{e:122559486e4,s:120503526e4},{e:125704446e4,s:123648486e4},{e:128909886e4,s:126853926e4},{e:13205556e5,s:129998886e4},{e:13520052e5,s:13314456e5},{e:13834548e5,s:13628952e5},{e:14149044e5,s:13943448e5}]},{name:"America/Havana",rules:[{e:12249972e5,s:12056436e5},{e:12564468e5,s:12364884e5},{e:12885012e5,s:12685428e5},{e:13211604e5,s:13005972e5},{e:13520052e5,s:13332564e5},{e:13834548e5,s:13628916e5},{e:14149044e5,s:13943412e5}]},{name:"America/Mazatlan",rules:[{e:1225008e6,s:12074724e5},{e:12564576e5,s:1238922e6},{e:1288512e6,s:12703716e5},{e:13199616e5,s:13018212e5},{e:13514112e5,s:13332708e5},{e:13828608e5,s:13653252e5},{e:14143104e5,s:13967748e5}]},{name:"America/Mexico_City",rules:[{e:12250044e5,s:12074688e5},{e:1256454e6,s:12389184e5},{e:12885084e5,s:1270368e6},{e:1319958e6,s:13018176e5},{e:13514076e5,s:13332672e5},{e:13828572e5,s:13653216e5},{e:14143068e5,s:13967712e5}]},{name:"America/Miquelon",rules:[{e:12255984e5,s:12050388e5},{e:1257048e6,s:12364884e5},{e:12891024e5,s:12685428e5},{e:1320552e6,s:12999924e5},{e:13520016e5,s:1331442e6},{e:13834512e5,s:13628916e5},{e:14149008e5,s:13943412e5}]},{name:"America/Santa_Isabel",rules:[{e:12250116e5,s:1207476e6},{e:12564612e5,s:12389256e5},{e:12891204e5,s:12685608e5},{e:132057e7,s:13000104e5},{e:13520196e5,s:133146e7},{e:13834692e5,s:13629096e5},{e:14149188e5,s:13943592e5}]},{name:"America/Santiago",rules:[{e:1206846e6,s:1223784e6},{e:1237086e6,s:12552336e5},{e:127035e7,s:12866832e5},{e:13048236e5,s:13138992e5},{e:13356684e5,s:13465584e5},{e:1367118e6,s:13786128e5},{e:13985676e5,s:14100624e5}]},{name:"America/Sao_Paulo",rules:[{e:12032136e5,s:12243852e5},{e:12346632e5,s:12558348e5},{e:12667176e5,s:12872844e5},{e:12981672e5,s:1318734e6},{e:13302216e5,s:13507884e5},{e:13610664e5,s:1382238e6},{e:1392516e6,s:14136876e5}]},{name:"Asia/Amman",rules:[{e:1225404e6,s:12066552e5},{e:12568536e5,s:12381048e5},{e:12883032e5,s:12695544e5},{e:13197528e5,s:13016088e5},!1,!1,{e:14147064e5,s:13959576e5}]},{name:"Asia/Damascus",rules:[{e:12254868e5,s:120726e7},{e:125685e7,s:12381048e5},{e:12882996e5,s:12701592e5},{e:13197492e5,s:13016088e5},{e:13511988e5,s:13330584e5},{e:13826484e5,s:1364508e6},{e:14147028e5,s:13959576e5}]},{name:"Asia/Dubai",rules:[!1,!1,!1,!1,!1,!1,!1]},{name:"Asia/Gaza",rules:[{e:12199572e5,s:12066552e5},{e:12520152e5,s:12381048e5},{e:1281474e6,s:126964086e4},{e:1312146e6,s:130160886e4},{e:13481784e5,s:13330584e5},{e:13802292e5,s:1364508e6},{e:1414098e6,s:13959576e5}]},{name:"Asia/Irkutsk",rules:[{e:12249576e5,s:12068136e5},{e:12564072e5,s:12382632e5},{e:12884616e5,s:12697128e5},!1,!1,!1,!1]},{name:"Asia/Jerusalem",rules:[{e:12231612e5,s:12066624e5},{e:1254006e6,s:1238112e6},{e:1284246e6,s:12695616e5},{e:131751e7,s:1301616e6},{e:13483548e5,s:13330656e5},{e:13828284e5,s:13645152e5},{e:1414278e6,s:13959648e5}]},{name:"Asia/Kamchatka",rules:[{e:12249432e5,s:12067992e5},{e:12563928e5,s:12382488e5},{e:12884508e5,s:12696984e5},!1,!1,!1,!1]},{name:"Asia/Krasnoyarsk",rules:[{e:12249612e5,s:12068172e5},{e:12564108e5,s:12382668e5},{e:12884652e5,s:12697164e5},!1,!1,!1,!1]},{name:"Asia/Omsk",rules:[{e:12249648e5,s:12068208e5},{e:12564144e5,s:12382704e5},{e:12884688e5,s:126972e7},!1,!1,!1,!1]},{name:"Asia/Vladivostok",rules:[{e:12249504e5,s:12068064e5},{e:12564e8,s:1238256e6},{e:12884544e5,s:12697056e5},!1,!1,!1,!1]},{name:"Asia/Yakutsk",rules:[{e:1224954e6,s:120681e7},{e:12564036e5,s:12382596e5},{e:1288458e6,s:12697092e5},!1,!1,!1,!1]},{name:"Asia/Yekaterinburg",rules:[{e:12249684e5,s:12068244e5},{e:1256418e6,s:1238274e6},{e:12884724e5,s:12697236e5},!1,!1,!1,!1]},{name:"Asia/Yerevan",rules:[{e:1224972e6,s:1206828e6},{e:12564216e5,s:12382776e5},{e:1288476e6,s:12697272e5},{e:13199256e5,s:13011768e5},!1,!1,!1]},{name:"Australia/Lord_Howe",rules:[{e:12074076e5,s:12231342e5},{e:12388572e5,s:12545838e5},{e:12703068e5,s:12860334e5},{e:13017564e5,s:1317483e6},{e:1333206e6,s:13495374e5},{e:13652604e5,s:1380987e6},{e:139671e7,s:14124366e5}]},{name:"Australia/Perth",rules:[{e:12068136e5,s:12249576e5},!1,!1,!1,!1,!1,!1]},{name:"Europe/Helsinki",rules:[{e:12249828e5,s:12068388e5},{e:12564324e5,s:12382884e5},{e:12884868e5,s:1269738e6},{e:13199364e5,s:13011876e5},{e:1351386e6,s:13326372e5},{e:13828356e5,s:13646916e5},{e:14142852e5,s:13961412e5}]},{name:"Europe/Minsk",rules:[{e:12249792e5,s:12068352e5},{e:12564288e5,s:12382848e5},{e:12884832e5,s:12697344e5},!1,!1,!1,!1]},{name:"Europe/Moscow",rules:[{e:12249756e5,s:12068316e5},{e:12564252e5,s:12382812e5},{e:12884796e5,s:12697308e5},!1,!1,!1,!1]},{name:"Pacific/Apia",rules:[!1,!1,!1,{e:13017528e5,s:13168728e5},{e:13332024e5,s:13489272e5},{e:13652568e5,s:13803768e5},{e:13967064e5,s:14118264e5}]},{name:"Pacific/Fiji",rules:[!1,!1,{e:12696984e5,s:12878424e5},{e:13271544e5,s:1319292e6},{e:1358604e6,s:13507416e5},{e:139005e7,s:1382796e6},{e:14215032e5,s:14148504e5}]},{name:"Europe/London",rules:[{e:12249828e5,s:12068388e5},{e:12564324e5,s:12382884e5},{e:12884868e5,s:1269738e6},{e:13199364e5,s:13011876e5},{e:1351386e6,s:13326372e5},{e:13828356e5,s:13646916e5},{e:14142852e5,s:13961412e5}]},{name:"Africa/Windhoek",rules:[{e:12207492e5,s:120744e7},{e:12521988e5,s:12388896e5},{e:12836484e5,s:12703392e5},{e:1315098e6,s:13017888e5},{e:13465476e5,s:13332384e5},{e:13779972e5,s:13652928e5},{e:14100516e5,s:13967424e5}]}]},"undefined"!=typeof module&&"undefined"!=typeof module.exports?module.exports=a:"undefined"!=typeof define&&null!==define&&null!=define.amd?define([],function(){return a}):"undefined"==typeof e?window.jstz=a:e.jstz=a}();

function PASystemTimezoneChecker() {
  this.tz = jstz.determine();
};

PASystemTimezoneChecker.prototype.isCheckRequired = function() {
  return (document.cookie.indexOf("pasystem_timezone_warning_dismissed=true") < 0) &&
           (document.cookie.indexOf("pasystem_timezone_ok=true") < 0)
};


PASystemTimezoneChecker.prototype.checkTimezone = function() {
  var self = this;

  if (self.isCheckRequired()) {
    $.ajax({
      url: '/direct/pasystem/checkTimeZone',
      data: {timezone: self.tz.name()},
      cache: false,
      type: "GET",
      dataType: 'json',
      success: function(data) {
        if (data.status == 'MISMATCH' && data.setTimezoneUrl) {
          // Add banner for Timezone check message
          pasystem.banners.addBannerAlert("tz", self.getTimezoneBannerContent(data), true, "timezone");
        } else if (data.status == 'OK' && data.setTimezoneUrl) {
          self.doNotCheckAgainForAWhile();
        }
      }
    });
  }
};


PASystemTimezoneChecker.prototype.getTimezoneBannerContent = function(msg) {
  var template = $("#timezoneBannerTemplate").html().trim();
  var trimPathTemplate = TrimPath.parseTemplate(template, "timezoneBannerTemplate");

  return $(trimPathTemplate.process({
    setTimezoneUrl: msg.setTimezoneUrl,
    reportedTimezone: msg.reportedTimezone,
    prefsTimezone: msg.prefsTimezone
  })).html();
};


PASystemTimezoneChecker.prototype.doNotCheckAgainForAWhile = function() {
  var expire_time = new Date();
  expire_time.setTime(expire_time.getTime() + (1 * 60 * 60 * 1000));
  document.cookie = "pasystem_timezone_ok=true; path=/; expires=" + expire_time.toGMTString() + ";";
};
