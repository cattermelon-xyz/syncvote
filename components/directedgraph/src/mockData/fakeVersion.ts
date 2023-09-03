export const fakeVersion = {
  id: 88,
  created_at: '2023-06-18T04:00:27.570565+00:00',
  workflow_id: 63,
  status: 'PUBLIC_COMMUNITY',
  data: {
    checkpoints: [
      {
        id: 'root',
        isEnd: false,
        title: 'Có người rủ',
        children: ['node-1687060920716', 'node-1687061002800'],
        data: {
          options: ['Bận lắm', 'Có'],
          includedAbstain: true,
        },
        vote_machine_type: 'SingleChoiceRaceToMax',
        participation: {
          type: 'identity',
          data: ['trunghieubui88@gmail.com', '0x12345', '@123'],
        },
        duration: 86400,
        description:
          '<p>just a test</p>\n<p><img title="Screenshot 2023-03-18 at 15.40.21.png" src="data:image/png;base64,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" alt="" width="155" height="160"></p>',
        position: {
          x: -193.72450908257815,
          y: -171.34336796541515,
        },
      },
      {
        id: 'node-1687060920716',
        isEnd: true,
        title: 'Từ chối',
        children: [],
        triggers: [
          {
            provider: 'twitter',
            name: 'Trigger#1',
            triggerAt: 'this',
            org_id: 6,
            id_string: '1505466247445565442',
            access_token_expires_at: 1685320191491,
            username: '0xk2_',
            tweet: 'Xin lỗi không đi đâu',
            integrationId: 4,
          },
        ],
        position: {
          x: 129.31537247760357,
          y: -51.7648607134354,
        },
      },
      {
        id: 'node-1687061002800',
        isEnd: false,
        title: 'Chốt địa điểm!',
        children: ['node-1687060920716', 'node-1687061085343'],
        data: {
          options: ['Không tìm được chỗ', 'Địa điểm OK'],
          max: 1,
        },
        vote_machine_type: 'SingleChoiceRaceToMax',
        participation: {
          type: 'identity',
          data: ['son@'],
        },
        duration: 60000,
        position: {
          x: -182.1043892622446,
          y: 124.73681690366081,
        },
      },
      {
        id: 'node-1687061085343',
        isEnd: true,
        title: 'OK',
        children: [],
        triggers: [
          {
            provider: 'twitter',
            name: 'Trigger#1',
            triggerAt: 'this',
            org_id: 6,
            id_string: '1505466247445565442',
            access_token_expires_at: 1685320191491,
            username: '0xk2_',
            tweet: 'Có đi nhé',
            integrationId: 4,
          },
        ],
        position: {
          x: -139.35185225413943,
          y: 303.1074709672719,
        },
      },
    ],
    start: 'root',
    cosmetic: {
      layouts: [
        {
          title: 'Mobile',
          description: '',
          screen: 'vertical',
          id: '5Zob',
          renderer: 'default',
          nodes: [
            {
              id: 'node-1687060920716',
              position: {
                x: 129.31537247760357,
                y: -51.7648607134354,
              },
            },
            {
              id: 'root',
              position: {
                x: -193.72450908257815,
                y: -171.34336796541515,
              },
              style: {
                title: {
                  backgroundColor: '#FAC78B',
                  color: '#252422',
                },
                content: {
                  backgroundColor: '#FAC78B',
                },
              },
            },
            {
              id: 'node-1687061002800',
              position: {
                x: -182.1043892622446,
                y: 124.73681690366081,
              },
              style: {
                title: {
                  backgroundColor: '#750EF2',
                  color: '#fff',
                },
                content: {
                  backgroundColor: '#9F5AF2',
                },
              },
            },
            {
              id: 'node-1687061085343',
              position: {
                x: -139.35185225413943,
                y: 303.1074709672719,
              },
            },
            {
              id: 'node-1688351196449',
              position: {
                x: 210.9747714864858,
                y: -139.6620958320158,
              },
            },
          ],
          edges: [],
          markers: [
            {
              color: '#B0DCFF',
              title: 'Blue',
            },
            {
              color: '#FCE493',
              title: 'Yellow',
            },
            {
              color: '#FAC78B',
              title: 'Cam 1',
            },
          ],
        },
        {
          title: 'Desktop',
          description: '',
          screen: 'horizontal',
          id: 'ULJO',
          renderer: 'default',
          nodes: [
            {
              id: 'root',
              position: {
                x: -570.3064175549996,
                y: 30.810843943278797,
              },
              style: {
                title: {
                  backgroundColor: '#D4B6F5',
                  color: '#252422',
                },
                content: {
                  backgroundColor: '#DDBDFF',
                  color: '#252422',
                },
              },
            },
            {
              id: 'node-1687060920716',
              position: {
                x: -154.77127400630985,
                y: 249.3310058148434,
              },
              style: {
                title: {
                  backgroundColor: '#F0BF86',
                  color: '#252422',
                },
                content: {
                  backgroundColor: '#FAC78B',
                  color: '#252422',
                },
              },
            },
            {
              id: 'node-1687061002800',
              position: {
                x: -149.86395926166728,
                y: -6.218852891374048,
              },
              style: {
                title: {
                  backgroundColor: '#9CEAB3',
                  color: '#252422',
                },
                content: {
                  backgroundColor: '#A2F4BA',
                  color: '#252422',
                },
              },
            },
            {
              id: 'node-1687061085343',
              position: {
                x: 157.85713162986244,
                y: -13.858896826322265,
              },
              style: {
                title: {
                  backgroundColor: '#A9D3F5',
                  color: '#252422',
                },
                content: {
                  backgroundColor: '#B0DCFF',
                  color: '#252422',
                },
              },
            },
          ],
          edges: [],
          markers: [
            {
              color: '#F0BF86',
              title: 'Cam',
            },
            {
              color: '#A9D3F5',
              title: 'Xnah',
            },
            {
              color: '#F0BF86',
              title: 'Orange',
            },
            {
              color: '#A9D3F5',
              title: 'Blue',
            },
            {
              color: '#D4B6F5',
              title: 'Purple',
            },
            {
              color: '#F2DB8D',
              title: 'Yellow',
            },
            {
              color: '#9CEAB3',
              title: 'Green',
            },
          ],
        },
      ],
      defaultLayout: {
        horizontal: '5Zob',
        vertical: '5Zob',
      },
    },
  },
  parent_id: null,
  version: '0.0.1',
  recommended: false,
  last_updated: '2023-08-25T08:55:03.835634+00:00',
  preview_image_url: null,
};
