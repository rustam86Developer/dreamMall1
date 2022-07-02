"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .bulkInsert("States", [
        {
          id: 1,
          stateCode: "AL",
          stateName: "Alabama",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          stateCode: "AK",
          stateName: "Alaska",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 3,
          stateCode: "AZ",
          stateName: "Arizona",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 4,
          stateCode: "AR",
          stateName: "Arkansas",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 5,
          stateCode: "CA",
          stateName: "California",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 6,
          stateCode: "CO",
          stateName: "Colorado",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 7,
          stateCode: "CT",
          stateName: "Connecticut",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 8,
          stateCode: "DE",
          stateName: "Delaware",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 9,
          stateCode: "DC",
          stateName: "District of Columbia",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 10,
          stateCode: "FL",
          stateName: "Florida",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 11,
          stateCode: "GA",
          stateName: "Georgia",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 12,
          stateCode: "HI",
          stateName: "Hawaii",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 13,
          stateCode: "ID",
          stateName: "Idaho",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 14,
          stateCode: "IL",
          stateName: "Illinois",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 15,
          stateCode: "IN",
          stateName: "Indiana",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 16,
          stateCode: "IA",
          stateName: "Iowa",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 17,
          stateCode: "KS",
          stateName: "Kansas",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 18,
          stateCode: "KY",
          stateName: "Kentucky",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 19,
          stateCode: "LA",
          stateName: "Louisiana",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 20,
          stateCode: "ME",
          stateName: "Maine",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 21,
          stateCode: "MD",
          stateName: "Maryland",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 22,
          stateCode: "MA",
          stateName: "Massachusetts",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 23,
          stateCode: "MI",
          stateName: "Michigan",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 24,
          stateCode: "MN",
          stateName: "Minnesota",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 25,
          stateCode: "MS",
          stateName: "Mississippi",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 26,
          stateCode: "MO",
          stateName: "Missouri",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 27,
          stateCode: "MT",
          stateName: "Montana",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 28,
          stateCode: "NE",
          stateName: "Nebraska",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 29,
          stateCode: "NV",
          stateName: "Nevada",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 30,
          stateCode: "NH",
          stateName: "New Hampshire",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 31,
          stateCode: "NJ",
          stateName: "New Jersey",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 32,
          stateCode: "NM",
          stateName: "New Mexico",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 33,
          stateCode: "NY",
          stateName: "New York",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 34,
          stateCode: "NC",
          stateName: "North Carolina",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 35,
          stateCode: "ND",
          stateName: "North Dakota",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 36,
          stateCode: "OH",
          stateName: "Ohio",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 37,
          stateCode: "OK",
          stateName: "Oklahoma",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 38,
          stateCode: "OR",
          stateName: "Oregon",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 39,
          stateCode: "PA",
          stateName: "Pennsylvania",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 40,
          stateCode: "PR",
          stateName: "Puerto Rico",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 41,
          stateCode: "RI",
          stateName: "Rhode Island",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 42,
          stateCode: "SC",
          stateName: "South Carolina",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 43,
          stateCode: "SD",
          stateName: "South Dakota",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 44,
          stateCode: "TN",
          stateName: "Tennessee",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 45,
          stateCode: "TX",
          stateName: "Texas",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 46,
          stateCode: "UT",
          stateName: "Utah",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 47,
          stateCode: "VT",
          stateName: "Vermont",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 48,
          stateCode: "VA",
          stateName: "Virginia",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 49,
          stateCode: "WA",
          stateName: "Washington",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 50,
          stateCode: "WV",
          stateName: "West Virginia",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 51,
          stateCode: "WI",
          stateName: "Wisconsin",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 52,
          stateCode: "WY",
          stateName: "Wyoming",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])
      .catch(console.log);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("States");
  }
};
