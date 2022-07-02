"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Submodules",
      [
        {
          id: "1",
          name: "Admin Dashboard",
          moduleId: "1",
          actionId: "3,22,23",
          systemUserTypeId: "1"
        },
        {
          id: "2",
          name: "Clients Listing",
          moduleId: "1",
          actionId: "3,4,6,10,20,23",
          systemUserTypeId: "1"
        },
        {
          id: "3",
          name: "Client Profile",
          moduleId: "1",
          actionId: "1,2,4,7,9,18,23",
          systemUserTypeId: "1"
        },
        {
          id: "4",
          name: "Partners Listing",
          moduleId: "1",
          actionId: "1,2,3,6,23",
          systemUserTypeId: "1"
        },
        {
          id: "5",
          name: "Pricing",
          moduleId: "1",
          actionId: "2,3,23",
          systemUserTypeId: "1"
        },
        {
          id: "6",
          name: "Promotions",
          moduleId: "1",
          actionId: "1,2,3,4,23",
          systemUserTypeId: "1"
        },
        {
          id: "7",
          name: "Reports",
          moduleId: "1",
          actionId: "3",
          systemUserTypeId: "1"
        },
        {
          id: "8",
          name: "Help",
          moduleId: "1",
          actionId: "1,2,3,4,9,23",
          systemUserTypeId: "1"
        },
        {
          id: "9",
          name: "Template",
          moduleId: "1",
          actionId: "1,2,3,4,23",
          systemUserTypeId: "1"
        },
        {
          id: "10",
          name: "User Management",
          moduleId: "1",
          actionId: "1,2,3,4,21,23",
          systemUserTypeId: "1"
        },
        {
          id: "11",
          name: "Change Password",
          moduleId: "1",
          actionId: "2",
          systemUserTypeId: "1"
        },
        {
          id: "12",
          name: "Access Log",
          moduleId: "1",
          actionId: "3",
          systemUserTypeId: "1"
        },

        //client submodules
        {
          id: "13",
          name: "Client Dashboard",
          moduleId: "1",
          actionId: "3",
          systemUserTypeId: "3"
        },
        {
          id: "14",
          name: "Clients Listing",
          moduleId: "1",
          actionId: "1,2,3,4,5,8,9,11,19,23",
          systemUserTypeId: "3"
        },
        {
          id: "15",
          name: "Client Profile",
          moduleId: "1",
          actionId: "2,3,4,12,23",
          systemUserTypeId: "3"
        },
        {
          id: "16",
          name: "Broker Profile",
          moduleId: "1",
          actionId: "2,3,8,9,23",
          systemUserTypeId: "3"
        },
        {
          id: "17",
          name: "Payment Info",
          moduleId: "1",
          actionId: "1,13,4,23",
          systemUserTypeId: "3"
        },
        {
          id: "18",
          name: "Reports",
          moduleId: "1",
          actionId: "3",
          systemUserTypeId: "3"
        },
        {
          id: "19",
          name: "Help",
          moduleId: "1",
          actionId: "3,9,23",
          systemUserTypeId: "3"
        },
        {
          id: "20",
          name: "Settings",
          moduleId: "1",
          actionId: "2,3,23",
          systemUserTypeId: "3"
        },
        {
          id: "21",
          name: "Templates",
          moduleId: "1",
          actionId: "1,2,3,4,23",
          systemUserTypeId: "3"
        },
        {
          id: "22",
          name: "User Management",
          moduleId: "1",
          actionId: "1,2,3,4,21,23",
          systemUserTypeId: "3"
        },
        {
          id: "23",
          name: "Change Password",
          moduleId: "1",
          actionId: "2",
          systemUserTypeId: "3"
        },

        //for partner
        {
          id: "24",
          name: "Partner Dashboard",
          moduleId: "1",
          actionId: "3",
          systemUserTypeId: "5"
        },
        {
          id: "25",
          name: "Referral Clients Listing",
          moduleId: "1",
          actionId: "3,20,23",
          systemUserTypeId: "5"
        },
        {
          id: "26",
          name: "Partner Profile",
          moduleId: "1",
          actionId: "3,9,23",
          systemUserTypeId: "5"
        },
        {
          id: "27",
          name: "Generate Links",
          moduleId: "1",
          actionId: "14,15,23",
          systemUserTypeId: "5"
        },
        {
          id: "28",
          name: "Help",
          moduleId: "1",
          actionId: "3,9,23",
          systemUserTypeId: "5"
        },
        {
          id: "29",
          name: "User Management",
          moduleId: "1",
          actionId: "1,2,3,4,21,23",
          systemUserTypeId: "5"
        },
        {
          id: "30",
          name: "Reports",
          moduleId: "1",
          actionId: "3",
          systemUserTypeId: "5"
        },
        {
          id: "31",
          name: "Change Password",
          moduleId: "1",
          actionId: "2",
          systemUserTypeId: "5"
        },

        //engage
        {
          id: "32",
          name: "Communication",
          moduleId: "2",
          actionId: "3,4,5,16,17,20,23",
          systemUserTypeId: "3"
        },
      ].map(submod => {
        return { ...submod, createdAt: new Date(), updatedAt: new Date() };
      })
    );
  },

  down: (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      "Submodules",
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
            23,
            24,
            25,
            26,
            27,
            28,
            29,
            30,
            31
          ]
        }
      },
      {}
    );
  }
};
