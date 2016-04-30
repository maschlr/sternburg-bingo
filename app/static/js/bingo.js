function IndexViewModel() {
  var self = this;
  self.capsURI = "/caps"
  self.caps = ko.observableArray();
  self.fields = ko.observableArray();

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

  self.isOwned = function(number) {
    var atLeastOne = self.caps().filter(function(cap) {return cap.count() > 0})
                                .map(function(cap) {return cap.number});
    if (atLeastOne.indexOf(number) > -1) {
      return true;
    } else {
      return false;
    }
  }

  self.ajax(self.capsURI, 'GET').done(function(data) {
    for (var i=0; i<data.caps.length; i++) {
      self.caps.push({
        number: data.caps[i].number,
        count: ko.observable(data.caps[i].count)
      });
    }
    for (var i=0; i<rawFields.length; i++) {
      self.fields.push(ko.observableArray());
      for (var row=0; row<5; row++) {
        self.fields()[i].push(ko.observableArray());
        for (var col=0; col<5; col++) {
          self.fields()[i]()[row].push({number: rawFields[i][row][col],
                                        isOwned: ko.observable(self.isOwned(rawFields[i][row][col]))});
        }
      }
    }
  });
}

$(function() {
  ko.applyBindings(new IndexViewModel(), $('#main')[0]);
});
