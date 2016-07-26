GameClient.data = {
  /*
    Make sure that grandpa's computer and tower don't share cable colors!
  */
  "grandpasHardware": {"monitor": 2,"tower": 1}, // randomized 0 - 2

  "monitors":[ // array of possible monitors
    {
      "name": "SCL-50EX", // (semi)randomly generated
      "type": "XVD", // XVD or SGA (replace with something funny later)
      "logo": 2, // just in case
      "monitorButtons": [0,0,1,0,0,0,2,0,0,0,4,3],
      /*
      12 possible button slots, fill up 4:
      0 - empty
      1 - power
      2 - input
      3 - degauss
      4 - nothing
      */
      "monitorCables": {"power": "blue", "data": "red"},
      /*
      Possible colors:
      blue, green, yellow, red, purple
      */
      "monitorInput": 2 // number of active input. randomized in range 0 - 3
    },

    {
      "name": "SCL-50EX",
      "logo": 2,
      "type": "SGA",
      "monitorButtons": [0,0,1,0,0,0,2,0,0,0,4,3],
      "monitorCables": {"power": "blue", "data": "red"},
      "monitorInput": 2
    },

    {
      "name": "SCL-50EX",
      "logo": 2,
      "type": "SGA",
      "monitorButtons": [0,0,1,0,0,0,2,0,0,0,4,3],
      "monitorCables": {"power": "blue", "data": "red"},
      "monitorInput": 2
    }
  ],

  "towers": [ // array of possible towers
    {
      "name": "Grinder XT",
      "logo": 3,
      "towerPort": 2, // correct port to connect monitor - randomize 0 - 3
      "towerCable": "green",
      "roundButtons": [1,0], // randomize 0 - 2
      "squareButtons": [2,2], // randomize 0 - 2
      "towerSwitches": {"powerOn": "left", "monitorXVD": "right"} // randomize left or right
    },

    {
      "name": "Grinder XT",
      "logo": 3,
      "towerPort": 2,
      "towerCable": "green",
      "roundButtons": [1,2],
      "squareButtons": [1,2],
      "towerSwitches": {"powerOn": "left", "monitorXVD": "right"}
    },

    {
      "name": "Grinder XT",
      "logo": 3,
      "towerPort": 2,
      "towerCable": "green",
      "roundButtons": [1,2],
      "squareButtons": [1,2],
      "towerSwitches": {"powerOn": "left", "monitorXVD": "right"}
    }

  ]
};
