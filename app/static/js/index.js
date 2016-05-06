function IndexViewModel() {
  var self = this;
  self.capsURI = "/caps"
  self.caps = ko.observableArray();
  self.rows = ko.observableArray();
  // this function is defined in helpers.js. It generates all possible bingos (horizonal, vertical, diagonal) from the five (hardcoded) bingo fields
  self.allBingos = getAllBingos();
  self.bingos = ko.observableArray();

  for (var i in self.allBingos) {
    self.bingos.push({numbers: self.allBingos[i].numbers,
                      page: self.allBingos[i].page,
                      position: self.allBingos[i].position,
                      allOwned: ko.observable(false),
                      index: i,
                      score: ko.observable()
                      });
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

  self.sortBingos = function() {
    var ownedBingos = self.bingos().filter(function(bingo) {return bingo.allOwned});
    var scoreBoard = [];
    // initialize scoreboard for each possible number with the actual score
    // which is calculated by how many times a certain cap is in other bingos which are owned 
    // and multiplied this number with the inverse of the number of owned caps + 1
    // that way we account for numbers, that the user owns often
    for (var i=1; i<100; i++) {
      scoreBoard.push(Math.floor(ownedBingos.filter(function(bingo) {return bingo.numbers.indexOf(i) > -1}).length * 1000/(self.caps()[i-1].count()+1)));
    }
    // go through all owned bingos and score them
    for (var i in ownedBingos) {
      var score = 0;
      var numbers = ownedBingos[i].numbers;
      // access the previously calculated scoreboard 
      for (var j in numbers) {
        score += scoreBoard[numbers[j]-1];
      }
      ownedBingos[i].score(score);
    }
    // finally, sort them inplace
    self.bingos.sort(function(a, b) {return a.score() - b.score()});
  }


  self.removeAll = function(bingo) {
    // find all caps which are in the row which is about to be removed
    var matchedCaps = self.caps().filter(function(cap) {return bingo.numbers.indexOf(cap.number) > -1});
    // decimate all matched caps by one
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
    self.sortBingos();
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
