"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Actions", [
      {
        id: "1",
        name: "Add"
      },
      {
        id: "2",
        name: "Edit"
      },
      {
        id: "3",
        name: "View"
      },
      {
        id: "4",
        name: "Delete"
      },
      {
        id: "5",
        name: "Search"
      },
      {
        id: "6",
        name: "Login"
      },
      {
        id: "7",
        name: "Approve/Reject"
      },
      {
        id: "8",
        name: "Upload"
      },
      {
        id: "9",
        name: "Download"
      },

      {
        id: "10",
        name: "Branch"
      },
      {
        id: "11",
        name: "Communicate"
      },
      {
        id: "12",
        name: "Self Pull"
      },
      {
        id: "13",
        name: "Primary"
      },
      {
        id: "14",
        name: "Generate Link"
      },
      {
        id: "15",
        name: "Share Link"
      },
      {
        id: "16",
        name: "Send Email"
      },
      {
        id: "17",
        name: "Send Sms"
      },
      {
        id: "18",
        name: "Request Doc"
      },
      {
        id: "19",
        name: "Logs"
      },
      {
        id: "20",
        name: "Filter"
      },
      {
        id: "21",
        name: "Resend Link"
      },
      {
        id: "22",
        name: "Reports"
      },
      {
        id: "23",
        name: "All"
      }
    ].map(action => {
      return { ...action, createdAt: new Date(), updatedAt: new Date() };
    }));
  },

  down: (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      "Actions",
      {
        id: {
          [Op.in]: [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            21,
            22,
            23
          ]
        }
      },
      {}
    );
  }
};
