function IndexViewModel() {
  var self = this;
  self.capsURI = "/caps"
  self.caps = ko.observableArray();
  self.rows = ko.observableArray();

  self.ajax = helpers.ajax;

  self.add = function(cap) {
    //add 1 cap to the specified number
    self.ajax(self.capsURI + "/add/" + cap.number, 'PUT').done(function(data) {
      var i = self.caps.indexOf(cap);
      self.caps()[i].count(data.count);
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
    });
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
  });
}

$(function() {
  ko.applyBindings(new IndexViewModel(), $('#main')[0]);
});
