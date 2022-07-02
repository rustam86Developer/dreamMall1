"use strict";

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      "Statuses",
      [
        {
          name: "Pending",
          code: 50
        },
        {
          name: "Site Inspected",
          code: 60
        },
        {
          name: "Active",
          code: 100
        },
        {
          name: "In Progress",
          code: 110
        },
        {
          name: "Stable",
          code: 120
        },
        {
          name: "Closed Won",
          code: 130
        },
        {
          name: "Closed Lost",
          code: 140
        },
        {
          name: "Approved",
          code: 160
        },
        {
          name: "Db Uploaded",
          code: 170
        },
        {
          name: "Monitored",
          code: 180
        },
        {
          name: "Production Live",
          code: 190
        },
        {
          name: "Inactive",
          code: 200
        },
        {
          name: "Rejected",
          code: 220
        },
        {
          name: "Sent",
          code: 300
        },
        {
          name: "Received",
          code: 310
        },
        {
          name: "Success",
          code: 400
        },
        {
          name: "Failed",
          code: 450
        },
        {
          name: "Requested",
          code: 500
        },
        {
          name: "To Delete",
          code: 510
        },
        {
          name: "Deleted",
          code: 520
        },
        {
          name: "Closed",
          code: 530
        },
        {
          name: "Approved-Site Inspection Pending",
          code: 51
        }
      ].map(status => {
        return { ...status, createdAt: new Date(), updatedAt: new Date() };
      }),
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete("Statuses", {});
  }
};
