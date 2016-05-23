function BingoViewModel() {
    var self = this;
    self.capsURI = "/caps"
    self.caps = ko.observableArray();
    self.bingos = ko.observableArray(helpers.allBingos.map(function(bingo) {
        return {
            numbers: bingo.numbers,
            page: bingo.page,
            position: bingo.position,
            index: bingo.index,
            allOwned: ko.observable(false)
        }
    }));
    self.ajax = helpers.ajax;

    self.ownedBingos = function(caps) {
        // returns an array of owned Bingos
        // caps is an array which consists of objects e.g. {number: 1, count: 3}

        // build an array with just the cap numbers that are owned
        var ownedCaps = caps().filter(function(cap) {
                return cap.count() > 0
            })
            .map(function(cap) {
                return cap.number
            });
        // filter all bingos; check if all numbers are owned
        // this operation may seem a litte unclear first, but its pretty straightforward
        return helpers.allBingos.filter(function(bingo) {
            return bingo.map(function(number) {
                return ownedCaps.indexOf(number) > -1
            }).every(function(i) {
                return i
            })
        });
    };


    self.removeAll = function(bingo) {
        // find all caps which are in the row which is about to be removed
        var matchedCaps = self.caps().filter(function(cap) {
            return bingo.numbers.indexOf(cap.number) > -1
        });
        // decimate all matched caps by one
        for (var i in matchedCaps) {
            self.remove(matchedCaps[i]);
        }
    };

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
    };

    self.checkBingos = function() {
        for (let bingo of self.bingos()) {
            let atLeastOneCap = self.caps().filter(function(cap) {
                return cap.count() > 0
            }).map(function(cap) {
                return cap.number
            });
            bingo.allOwned(bingo.numbers.map(function(number) {
                return atLeastOneCap.indexOf(number) > -1
            }).every(function(i) {
                return i
            }));
        }
    };

    self.ajax(self.capsURI, 'GET').done(function(data) {
        // push all our caps and their count in the caps array
        for (var i = 0; i < data.caps.length; i++) {
            self.caps.push({
                number: data.caps[i].number,
                count: ko.observable(data.caps[i].count)
            });
        }
        self.checkBingos();
    });
}

$(function() {
    ko.applyBindings(new BingoViewModel(), $('#main')[0]);
});
