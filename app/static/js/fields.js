function FieldsViewModel() {
  var self = this;
  self.capsURI = "/caps"
  self.caps = ko.observableArray();
  self.fields = ko.observableArray();

  self.ajax = helpers.ajax;

  self.isOwned = function(number) {
    // filter all cap numbers where at least one is owned
    var atLeastOne = self.caps().filter(function(cap) {return cap.count() > 0})
                                .map(function(cap) {return cap.number});
    // return true if the number is in the array, false if not
    return (atLeastOne.indexOf(number) > -1);
  }

  self.ajax(self.capsURI, 'GET').done(function(data) {
    for (var i=0; i<data.caps.length; i++) {
      self.caps.push({
        number: data.caps[i].number,
        count: ko.observable(data.caps[i].count)
      });
    }
    for (var p=0; p<helpers.rawFields.length; p++) {
      self.fields.push(ko.observableArray());
      for (var row=0; row<5; row++) {
        self.fields()[p].push(ko.observableArray());
        for (var col=0; col<5; col++) {
          self.fields()[p]()[row].push({number: helpers.rawFields[p][row][col],
                                        isOwned: ko.observable(self.isOwned(helpers.rawFields[p][row][col]))});
        }
      }
    }
  });
}

$(function() {
  ko.applyBindings(new FieldsViewModel(), $('#main')[0]);
});
