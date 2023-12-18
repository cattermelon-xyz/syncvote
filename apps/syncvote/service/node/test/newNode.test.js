const expect = require("chai").expect;
const { supabase } = require("../src/configs/supabaseClient");
const dotenv = require("dotenv");
const axios = require("axios");
const moment = require("moment");
dotenv.config();

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

describe("Test with 2 Fork and Join Node", function () {
  this.timeout(200000);

  after(async function () {
    console.log("Delete prepare data");
    // const { error } = await supabase.from("mission").delete().eq("id", 9999);
    // expect(error).to.eq(null);
  });

  //   it("Test create proposal", async function () {
  //     this.timeout(10000);
  //     try {
  //       await axios
  //         .post(`${process.env.BACKEND_API}/mission/create`, missionData)
  //         .then((response) => {
  //           expect(response.data.status).to.eq("OK");
  //         });
  //     } catch (error) {
  //       throw error;
  //     }
  //   });

  //   it("Move to ForkNode", async function () {
  //     this.timeout(100000);
  //     try {
  //       for (let i = 4; i < 7; i++) {
  //         console.log("Voting time ", i);
  //         await axios
  //           .post(`${process.env.BACKEND_API}/vote/create`, {
  //             identify: `chaukhac${i}@gmail.com`,
  //             option: [0],
  //             mission_id: 9999,
  //           })
  //           .then((response) => {
  //             console.log(response.data);
  //           });
  //       }
  //     } catch (error) {
  //       throw error;
  //     }
  //   });

  // it("Move 1.1 -> 1.2 -> EndNode 1", async function () {
  //   this.timeout(100000);
  //   try {
  //     await axios
  //       .post(`${process.env.BACKEND_API}/mission/create`, missionData)
  //       .then(async () => {
  //         for (let i = 4; i < 9; i++) {
  //           await axios.post(`${process.env.BACKEND_API}/vote/create`, {
  //             identify: `chaukhac${i}@gmail.com`,
  //             option: [0],
  //             mission_id: 9999,
  //           });
  //         }

  //         await sleep(4000);

  //         const { data } = await supabase
  //           .from("mission")
  //           .select("*")
  //           .eq("refId", "subWorkflow1");

  //         for (let i = 4; i < 10; i++) {
  //           console.log("SubWokflow 1 voting time ", i - 3);
  //           await axios.post(`${process.env.BACKEND_API}/vote/create`, {
  //             identify: `chaukhac${i}@gmail.com`,
  //             option: [0],
  //             mission_id: data[0].id,
  //           });
  //         }
  //       });
  //   } catch (error) {
  //     throw error;
  //   }
  // });

  it("Move to JoinNode", async function () {
    this.timeout(100000);
    try {
      await axios
        .post(`${process.env.BACKEND_API}/mission/create`, missionData)
        .then(async () => {
          for (let i = 4; i < 7; i++) {
            console.log("Voting at Checkpoint 1: ", i - 3);
            await axios
              .post(`${process.env.BACKEND_API}/vote/create`, {
                identify: `chaukhac${i}@gmail.com`,
                option: [0],
                mission_id: 9999,
              })
              .then((response) => {
                console.log(response.data);
              });
          }

          await sleep(4000);

          const { data } = await supabase
            .from("mission")
            .select("*")
            .eq("refId", "subWorkflow1");

          for (let i = 4; i < 10; i++) {
            console.log("Voting at subWorkflow 1: ", i - 3);
            await axios
              .post(`${process.env.BACKEND_API}/vote/create`, {
                identify: `chaukhac${i}@gmail.com`,
                option: [0],
                mission_id: data[0].id,
              })
              .then((response) => {
                console.log(response.data);
              });
          }

          const { data: data2 } = await supabase
            .from("mission")
            .select("*")
            .eq("refId", "subWorkflow2");

          for (let i = 4; i < 7; i++) {
            console.log("Voting at subWorkflow 2: ", i - 3);
            await axios
              .post(`${process.env.BACKEND_API}/vote/create`, {
                identify: `chaukhac${i}@gmail.com`,
                option: [0],
                mission_id: data2[0].id,
              })
              .then((response) => {
                console.log(response.data);
              });
          }
        });
    } catch (error) {
      throw error;
    }
  });
});

const data = {
  checkpoints: [
    {
      id: "root",
      position: {
        x: -540.7606924068922,
        y: -24.195862579913936,
      },
      data: {
        options: ["Edge 1"],
        max: 1,
      },
      children: ["node-1702354836571"],
      vote_machine_type: "SingleChoiceRaceToMax",
      delays: [0],
      delayUnits: ["minute"],
      delayNotes: [""],
      quorum: 3,
      participation: {
        type: "identity",
        data: [
          "chaukhac4@gmail.com",
          "chaukhac5@gmail.com",
          "chaukhac6@gmail.com",
          "chaukhac7@gmail.com",
          "chaukhac8@gmail.com",
          "chaukhac9@gmail.com",
          "chaukhac10@gmail.com",
          "chaukhac11@gmail.com",
          "chaukhac12@gmail.com",
          "chaukhac13@gmail.com",
          "chaukhac14@gmail.com",
        ],
      },
      duration: 86400,
      title: "Checkpoint 1",
    },
    {
      title: "ForkNode",
      id: "node-1702354836571",
      position: {
        x: -267.2642865818524,
        y: 28.03333535765566,
      },
      children: [
        "node-1702355024351",
        "node-1702355656184",
        "node-1702453697020",
      ],
      vote_machine_type: "forkNode",
      data: {
        joinNode: "node-1702354958184",
        start: ["subWorkflow1", "subWorkflow2", "subWorkflow3"],
        end: ["subWorkflow1", "subWorkflow2"],
      },
    },
    {
      title: "JoinNode",
      id: "node-1702354958184",
      position: {
        x: 462.3857265355744,
        y: 24.78101144581359,
      },
      children: ["node-1702393397103"],
      vote_machine_type: "joinNode",
    },
    {
      title: "EndNode",
      id: "node-1702393397103",
      position: {
        x: 634.971246066212,
        y: 28.879341775258183,
      },
      isEnd: true,
      children: [],
    },
    {
      title: "EndNode 5",
      id: "node-1702454019474",
      position: {
        x: 170.69766584341266,
        y: 225.72480107301374,
      },
      isEnd: true,
      children: [],
    },
  ],
  cosmetic: {
    defaultLayout: {
      horizontal: "default",
      vertical: "default",
    },
    layouts: [
      {
        id: "default",
        title: "Default",
        screen: "Horizontal",
        renderer: "",
        nodes: [
          {
            id: "root",
            position: {
              x: -540.7606924068922,
              y: -24.195862579913936,
            },
          },
          {
            id: "node-1702354836571",
            position: {
              x: -267.2642865818524,
              y: 28.03333535765566,
            },
          },
          {
            id: "node-1702354958184",
            position: {
              x: 462.3857265355744,
              y: 24.78101144581359,
            },
            style: {
              title: {
                backgroundColor: "#9CEAB3",
                color: "#252422",
              },
              content: {
                backgroundColor: "#A2F4BA",
                color: "#252422",
              },
            },
          },
          {
            id: "node-1702355024351",
            position: {
              x: -84.69296731947938,
              y: -292.58653686841546,
            },
          },
          {
            id: "node-1702355127135",
            position: {
              x: 187.64994837645537,
              y: -291.9169975693774,
            },
          },
          {
            id: "node-1702355656184",
            position: {
              x: -79.40434896272662,
              y: -18.830748645249628,
            },
          },
          {
            id: "node-1702355770112",
            position: {
              x: 459.8459736156965,
              y: -239.07077396589648,
            },
          },
          {
            id: "node-1702393397103",
            position: {
              x: 634.971246066212,
              y: 28.879341775258183,
            },
          },
          {
            id: "node-1702453310526",
            position: {
              x: 162.15763787948956,
              y: -43.35200970441525,
            },
          },
          {
            id: "node-1702453342085",
            position: {
              x: 165.31255742365437,
              y: 85.55160493466343,
            },
          },
          {
            id: "node-1702453697020",
            position: {
              x: -82.75682132802145,
              y: 187.698003011914,
            },
          },
          {
            id: "node-1702454019474",
            position: {
              x: 170.69766584341266,
              y: 225.72480107301374,
            },
          },
        ],
        edges: [],
        markers: [],
      },
    ],
  },
  docs: [],
  start: "root",
  subWorkflows: [
    {
      refId: "subWorkflow1",
      start: "node-1702355024351",
      checkpoints: [
        {
          title: "1.1",
          id: "node-1702355024351",
          position: {
            x: -84.69296731947938,
            y: -292.58653686841546,
          },
          data: {
            options: ["Edge 2"],
            max: 3,
          },
          children: ["node-1702355127135"],
          quorum: 3,
          vote_machine_type: "SingleChoiceRaceToMax",
          delays: [0],
          delayUnits: ["minute"],
          delayNotes: [""],
          participation: {
            type: "identity",
            data: [
              "chaukhac4@gmail.com",
              "chaukhac5@gmail.com",
              "chaukhac6@gmail.com",
              "chaukhac7@gmail.com",
              "chaukhac8@gmail.com",
              "chaukhac9@gmail.com",
              "chaukhac10@gmail.com",
              "chaukhac11@gmail.com",
              "chaukhac12@gmail.com",
              "chaukhac13@gmail.com",
              "chaukhac14@gmail.com",
            ],
          },
          duration: 86400,
        },
        {
          title: "EndNode 1",
          id: "node-1702355770112",
          position: {
            x: 459.8459736156965,
            y: -239.07077396589648,
          },
          isEnd: true,
          children: [],
        },
        {
          title: "1.2",
          id: "node-1702355127135",
          position: {
            x: 187.64994837645537,
            y: -291.9169975693774,
          },
          children: ["node-1702355770112"],
          data: {
            options: ["Edge 3"],
            max: 1,
            token: "",
          },
          vote_machine_type: "SingleChoiceRaceToMax",
          participation: {
            type: "identity",
            data: [
              "chaukhac4@gmail.com",
              "chaukhac5@gmail.com",
              "chaukhac6@gmail.com",
              "chaukhac7@gmail.com",
              "chaukhac8@gmail.com",
              "chaukhac9@gmail.com",
              "chaukhac10@gmail.com",
              "chaukhac11@gmail.com",
              "chaukhac12@gmail.com",
              "chaukhac13@gmail.com",
              "chaukhac14@gmail.com",
            ],
          },
          duration: 86400,
          delays: [0],
          delayUnits: ["minute"],
          delayNotes: [""],
          quorum: 3,
        },
      ],
    },
    {
      refId: "subWorkflow2",
      start: "node-1702355656184",
      checkpoints: [
        {
          title: "2.1",
          id: "node-1702355656184",
          position: {
            x: -79.40434896272662,
            y: -18.830748645249628,
          },
          children: ["node-1702453310526", "node-1702453342085"],
          data: {
            options: ["OK", "ERR"],
            max: 1,
          },
          vote_machine_type: "SingleChoiceRaceToMax",
          participation: {
            type: "identity",
            data: [
              "chaukhac4@gmail.com",
              "chaukhac5@gmail.com",
              "chaukhac6@gmail.com",
              "chaukhac7@gmail.com",
              "chaukhac8@gmail.com",
              "chaukhac9@gmail.com",
              "chaukhac10@gmail.com",
              "chaukhac11@gmail.com",
              "chaukhac12@gmail.com",
              "chaukhac13@gmail.com",
              "chaukhac14@gmail.com",
            ],
          },
          duration: 86400,
          quorum: 3,
          delays: [0, 0],
          delayUnits: ["minute", "minute"],
          delayNotes: ["", ""],
        },
        {
          title: "EndNode 2",
          id: "node-1702453310526",
          position: {
            x: 162.15763787948956,
            y: -43.35200970441525,
          },
          isEnd: true,
          children: [],
        },
        {
          title: "EndNode 3",
          id: "node-1702453342085",
          position: {
            x: 165.31255742365437,
            y: 85.55160493466343,
          },
          isEnd: true,
          children: [],
        },
      ],
    },
    {
      refId: "subWorkflow3",
      start: "node-1702453697020",
      checkpoints: [
        {
          title: "3.1",
          id: "node-1702453697020",
          position: {
            x: -82.75682132802145,
            y: 187.698003011914,
          },
          children: ["node-1702454019474"],
          data: {
            options: ["OK"],
            max: 1,
          },
          vote_machine_type: "SingleChoiceRaceToMax",
          quorum: 3,
          duration: 86400,
          delays: [0],
          delayUnits: ["minute"],
          delayNotes: [""],
          participation: {
            type: "identity",
            data: [
              "chaukhac4@gmail.com",
              "chaukhac5@gmail.com",
              "chaukhac6@gmail.com",
              "chaukhac7@gmail.com",
              "chaukhac8@gmail.com",
              "chaukhac9@gmail.com",
              "chaukhac10@gmail.com",
              "chaukhac11@gmail.com",
              "chaukhac12@gmail.com",
              "chaukhac13@gmail.com",
              "chaukhac14@gmail.com",
            ],
          },
        },
      ],
    },
  ],
  variables: [],
};

const missionData = {
  id: "9999",
  title: "Test create proposal",
  status: "PUBLIC",
  start: "root",
  data: data,
  creator_id: "Chau Khac",
};
