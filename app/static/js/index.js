function IndexViewModel() {
  var self = this;
  self.capsURI = "/caps"
  self.caps = ko.observableArray();
  self.rows = ko.observableArray();
  // this function is defined in helpers.js. It generates all possible bingos (horizonal, vertical, diagonal) from the five (hardcoded) bingo fields
  self.allBingos = allBingos();
  self.bingos = ko.observableArray();

  for (var i in self.allBingos) {
    self.bingos.push({numbers: self.allBingos[i],
                      allOwned: ko.observable(false)});
  }

  self.ajax = function(uri, method, data) {
    var request = {
      url: uri,
      type: method,
      contentType: "application/json",
      accepts: "application/json",
      cache: true,
      dataType: "json",
      data: JSON.stringify(data),
      error: function(jqXHR) {
        console.log("ajax error " + jqXHR.status);
      }
    };
    return $.ajax(request);
  }

  self.removeAll = function(bingo) {
    // decimate all matched numbers by one
    var matchedCaps = self.caps().filter(function(cap) {return bingo.numbers.indexOf(cap.number) > -1});
    for (var i in matchedCaps) {
      self.remove(matchedCaps[i]);
    }
  }

  self.add = function(cap) {
    //add 1 cap to the specified number
    self.ajax(self.capsURI + "/add/" + cap.number, 'PUT').done(function(data) {
      var i = self.caps.indexOf(cap);
      self.caps()[i].count(data.count);
      self.checkBingos();
    });
  }

  self.remove = function(cap) {
    // check wether the count of the cap is at least 1; if yes remove 1 cap from the specified number
    var cc = cap.count();
    if (cc < 1) {
      alert("Negative Kronkorkenanzahl nicht zulässig. Du trinkst zuviel oder zu wenig!")
    } else {
      self.ajax(self.capsURI + "/remove/" + cap.number, 'PUT').done(function(data) {
        var i = self.caps.indexOf(cap);
        self.caps()[i].count(data.count);
        self.checkBingos();
      });
    }
  }

  self.checkBingos = function() {
    // updates the list of bingos
    var ownedNumbers = self.caps().filter(function(cap) {return cap.count() > 0})
                                  .map(function(cap) {return cap.number});
    for (var i in self.bingos()) {
      var numHits = self.bingos()[i].numbers.filter(function(number) {return ownedNumbers.indexOf(number) > -1}).length
      if (numHits < 5) {
        self.bingos()[i].allOwned(false);
      } else if (numHits === 5) {
        self.bingos()[i].allOwned(true);
      } else {
        console.log("Something is terribly wrong...");
      }
    }
  }

  self.ajax(self.capsURI, 'GET').done(function(data) {
    // initialize our caps from the database
    for (var i=0; i<data.caps.length; i++) {
      self.caps.push({
        number: data.caps[i].number,
        count: ko.observable(data.caps[i].count)
      });
    }
    for (var i=0; i<20; i++) {
      self.rows.push(ko.observableArray(self.caps().slice(i*5, (i+1)*5)));
    }
    self.checkBingos();
  });
}

$(function() {
  ko.applyBindings(new IndexViewModel(), $('#main')[0]);
});
