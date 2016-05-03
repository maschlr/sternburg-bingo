function IndexViewModel() {
  var self = this;
  self.capsURI = "/caps"
  self.caps = ko.observableArray();
  self.rows = ko.observableArray();
  self.matches = ko.observableArray();
  // this function is defined in helpers.js. It generates all possible bingos (horizonal, vertical, diagonal) from the five (hardcoded) bingo fields
  self.allBingos = allBingos();

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

  self.removeAll = function(match) {
    self.checkBingos()
    var matchedCaps = self.caps().filter(function(cap) {return match.numbers.indexOf(cap.number) > -1});
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
    var currentMatches = [];
    var ownedNumbers = self.caps().filter(function(cap) {return cap.count() > 0})
                                  .map(function(cap) {return cap.number});
    for (var i=0; i<self.allBingos.length; i++) {
      if (self.allBingos[i].map(function(number) {return ownedNumbers.indexOf(number) > -1})
                           .filter(function(bool) {return bool}).length === 5) {
        var match = {index: i, numbers: self.allBingos[i]};
        currentMatches.push(match);
      }
    }

    // since our list of all the possible bingos is static, we only need to compare the index
    var newIndexes = currentMatches.map(function(match) {return match.index});
    // if an element is not in the current list, remove it from the ko.observableArray
    for (var i in self.matches()) {
      if (newIndexes.indexOf(self.matches()[i].index) < 0) {
        self.matches.splice(i,1);
      }
    }

    var oldIndexes = self.matches().map(function(match) {return match.index});
    // if the index of one of the current matches is not in the ko.observableArray, add it 
    for (var i in currentMatches) {
      if (oldIndexes.indexOf(currentMatches[i].index) < 0) {
        self.matches.push(currentMatches[i]);
      }
    }

    if (self.matches().length > 0) {
      console.log(self.matches());
    }
  }

  self.ajax(self.capsURI, 'GET').done(function(data) {
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
