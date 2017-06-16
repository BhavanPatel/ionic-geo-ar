angular.module('app.services', [])
  /*
    This factory is used to convert Image to base64.
  */
  .factory('imagetobase64', [function() {
    var dataURL;
    return {
      imageBase64: function(url, outputFormat) {
        return new Promise(function(resolve, reject) {
          var canvas = document.createElement('CANVAS'),
            ctx = canvas.getContext('2d'),
            img = new Image();
          img.crossOrigin = 'Anonymous';
          img.onload = function() {
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img, 0, 0);
            dataURL = canvas.toDataURL(outputFormat); // the base64 data of the image
            dataURL = dataURL.substring("data:image/png;base64,".length);
            canvas = null;
            resolve(dataURL);
          };
          img.src = url;
        });
      }
    };
  }])
  /*
    This facctory is used to show loader. Contains two functions show() and hide()
  */
  .factory('loader', ['$ionicLoading', function($ionicLoading) {
    var dataURL;
    return {
      show: function() {
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });
      },
      hide: function() {
        $ionicLoading.hide();
      },
    };

  }])
  /*
    This factory is used to show diffrent kind of messages like confirm,alert, etc.
  */
  .factory('showMessage', ['$ionicPopup', function($ionicPopup) {
    return {
      alert: function(msg) {
        $ionicPopup.alert({
          title: 'Kadirelli',
          okType: 'button-assertive',
          template: '<div class="text-center"><b>' + msg + '</b></div>',
        });
      },
      confirm: function(msg) {
        return $ionicPopup.confirm({
          title: "Would you like to delete this chat?",
          okType: 'button-assertive',
        });
      }
    };
  }])
  /*
    This factory is used to convert type_one to tyoe_two. Currently it is for Object To Array.
  */
  .factory('convert', function() {
    return {
      ObjectToArray: function(obj) {
        return Object.keys(obj).map(function(key) {
          return obj[key];
        });
      },
      OpsHoursDateToString: function(obj) {
        var d = '',
          time = '';
        if (obj.Mon) d += "Mon,";
        if (obj.Tue) d += "Tue,";
        if (obj.Wed) d += "Wed,";
        if (obj.Thu) d += "Thu,";
        if (obj.Fri) d += "Fri,";
        if (obj.Sat) d += "Sat,";
        if (obj.Sun) d += "Sun,";
        d = d.slice(0, -1);
        if (obj.from && obj.to) {
          obj.from1 = moment(obj.from).format("hh:mm a");
          obj.to1 = moment(obj.to).format("hh:mm a");
          delete obj.from;
          delete obj.to;
          var a = JSON.stringify(obj);
          time = a.slice(a.indexOf('from1'));
          time = time
            .replace(/"/g, "")
            .replace(/from1:/g, "")
            .replace(/to1:/g, "")
            .replace(/}/g, "")
            .replace(/,/, " to ");
        }
        return d + " / " + time;
      }
    };

  })
  /*
    This Service is used for communicating with backend.
  */
  .service('rest', ['$q', function($q) {
    return {
      saveDataService: saveDataService,
      editDataService: editDataService,
      removeDataService: removeDataService,
      loadDataService: loadDataService,
      authService: authService,
      uploadImage: uploadImage,
    };

    function uploadImage(url, dataObject) {

    }

    function authService(mail, password) {
      var deferred = $q.defer();
      firebase.auth().signInWithEmailAndPassword(mail, password)
        .then(function(res) {
          deferred.resolve(res);
        }).catch(function(error) {
          deferred.reject(error);
        });
      return deferred.promise;
    }

    function saveDataService(url, dataObject) {
      var deferred = $q.defer();
      firebase.database().ref(url).set(dataObject).then(function(res) {
        deferred.resolve(res);
      }).catch(function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    }

    function editDataService(url, dataObject) {
      firebase.database().ref(url).update(dataObject);
    }

    function removeDataService(url) {
      var deferred = $q.defer();
      firebase.database().ref(url).remove().then(function(res) {
          deferred.resolve(res);
        })
        .catch(function(error) {
          deferred.reject(error);
        });
      return deferred.promise;
    }

    function loadDataService(url) {
      var deferred = $q.defer();
      firebase.database().ref(url).once('value').then(function(snapshot) {
        deferred.resolve(snapshot.val());
      }, function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    }
  }])
  /*
    This Service is used admin-client messaging purpose.
  */
  .service('messaging', ['$q', '$rootScope', function($q, $rootScope) {
    return {
      onNewMessage: onNewMessage,
      onUnreadMessage: onUnreadMessage,
    };

    function onNewMessage(url) {
      var deferred = $q.defer();
      firebase.database().ref(url)
        .on('child_added', function(data) {
          deferred.resolve(data.val());
          $rootScope.$broadcast('onNewMessage', data.val());
        });
      return deferred.promise;
    }

    function onUnreadMessage(url) {
      var deferred = $q.defer();
      firebase.database().ref(url)
        .on('child_changed', function(data) {
          deferred.resolve(data.val());
          $rootScope.$broadcast('onUnreadMessage', data.val());
        });
      return deferred.promise;
    }
  }])
  /*
    This serive is used for watching on realtime clients update.
  */
  .service('onClient', ['$q', '$rootScope', function($q, $rootScope) {
    return {
      _delete: _delete,
    };

    function _delete(url) {
      var deferred = $q.defer();
      firebase.database().ref(url)
        .on('child_removed', function(data) {
          deferred.resolve(data.val());
          $rootScope.$broadcast('onClientDelete', data.val());
        });
      return deferred.promise;
    }
  }]);
