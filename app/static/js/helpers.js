var rawFields = [[[85, 61, 19, 27, 78],
                 [52, 90, 45, 3, 39],
                 [54, 88, 89, 76, 21],
                 [69, 15, 94, 22, 10],
                 [24, 18, 62, 79, 53]],
                [[80, 32, 18, 17, 98],
                 [28, 42, 59, 52, 81],
                 [22, 9, 11, 70, 63],
                 [43, 78, 86, 24, 91],
                 [8, 37, 75, 58, 89]],
                [[92, 31, 29, 52, 44],
                 [82, 73, 65, 36, 18],
                 [9, 20, 22, 41, 55],
                 [72, 89, 14, 60, 38],
                 [78, 56, 43, 4, 97]],
                [[50, 89, 84, 26, 11],
                 [34, 95, 48, 63, 78],
                 [7, 99, 18, 30, 23],
                 [22, 5, 46, 74, 51],
                 [67, 70, 12, 52, 83]],
                [[22, 71, 93, 16, 64],
                 [33, 6, 57, 18, 49],
                 [87, 52, 40, 2, 77],
                 [25, 96, 78, 13, 68],
                 [47, 35, 1, 66, 89]]]


function getAllBingos() {
  // returns all possible bingo combinations
  var winnerCombinations = [];
  for (var p=0; p<5; p++) {
    var columns = [[],[],[],[],[]];
    var vertical = [[], []]
    for (var row=0; row<5; row++) {
      // all horizontal bingos
      winnerCombinations.push({numbers: rawFields[p][row],
                               page: p+1,
                               position: 'Zeile ' + (row+1)});
      // all vertical bingos
      for (var col=0; col<5; col++) {
        columns[col].push(rawFields[p][row][col]);
      }
      // don't forget the vertical ones
      vertical[0].push(rawFields[p][row][row]);
      vertical[1].push(rawFields[p][row][4-row]);
    }
    for (var col=0; col<5; col++) {
      winnerCombinations.push({numbers: columns[col],
                               page: p+1,
                               position: 'Spalte ' + (col+1)});
    }
    var verticalPositions = ['Links oben nach rechts unten',
                             'Rechts oben nach links unten']
    for (var k=0; k<2; k++) {
      winnerCombinations.push({numbers: vertical[k],
                               page: p+1,
                               position: verticalPositions[k]});
    }
  }
  return winnerCombinations;
}

var numberScores = {};
for (var i = 1; i<100; i++) {
  numberScores[i] = 0;
}
allBingos = getAllBingos().map(function(bingo) {return bingo.numbers});
for (var i in allBingos) {
  // calculates a score for each number based on the occurence in bingo rows
  for (var j in allBingos[i]) {
    numberScores[allBingos[i][j]] += 1;
  }
}

function rateBingo(bingo) {
  // calculates a simple score based on how often a certain number is in other bingos
  // that way, we can choose a somehow optimal order of winnings
  var score = 0;
  for (var i in bingo.numbers) {
    var number = bingo.numbers[i];
    score += numberScores[number];
  }
  return score;
}

function starCoordinates(radius, anchor) {
  // This function calculates the perfect svg five-point star using a rotational matrice
  var angle = [0, 4/5*Math.PI, 8/5*Math.PI, 2/5*Math.PI, 6/5*Math.PI];
  var coordinates = [];

  for (var i in angle) {
    var x = Math.cos(angle[i])*0 - Math.sin(angle[i])*radius;
    var y = Math.sin(angle[i])*0 + Math.cos(angle[i])*radius;
    // y coordinates of anchor are downwards
    coordinates.push("" + (anchor[0]+x) + ", " + (anchor[1]-y));
  }
  return coordinates;
}
