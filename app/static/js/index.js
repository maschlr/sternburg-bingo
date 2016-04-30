function IndexViewModel() {
  var self = this;
  self.capsURI = "/caps"
  self.caps = ko.observableArray();
  self.rows = ko.observableArray();
  self.matches = ko.observableArray();
  self.allBingos = allBingos;

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

  self.add = function(cap) {
    self.ajax(self.capsURI + "/add/" + cap.number, 'PUT').done(function(data) {
      var i = self.caps.indexOf(cap);
      self.caps()[i].count(data.count);
      self.checkBingos();
    });
  }

  self.remove = function(cap) {
    var cc = cap.count();
    if (cc < 1) {jj
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
    var allBingos = self.allBingos();
    debugger;
    var ownedNumbers = self.caps().filter(function(cap) {return cap.count() > 0})
                                  .map(function(cap) {return cap.number});
    for (var i=0; i<allBingos.length; i++) {
      if (allBingos[i].map(function(field) {return ownedNumbers.indexOf(field) > -1}).every()) {
        self.matches.push({index: i, numbers: allBingos[i]});
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
