// var request = require('./lib/request')
// const FormData = require('./lib/form-data')
// const emoji = require('./lib/emoji')
const emoji = require('node-emoji')

function createConversation(user_id, message_content, message_type, iparams) {
  let user_key = user_id
  let content = message_content
  let messageType = message_type

  let fcURL = iparams.freshchat_domain.replace('https://', '')
  console.log('fcURL', fcURL)

  if (messageType == 'text') {
    try {
      $request
        .invokeTemplate('createConversation', {
          context: { user_key: user_key, freshChatUrl: fcURL },
          body: JSON.stringify({
            status: 'new',
            messages: [
              {
                app_id: iparams.freshchat_app_id,
                actor_type: 'user',
                actor_id: user_key,
                channel_id: iparams.channel_list,
                message_type: 'normal',
                message_parts: [
                  {
                    text: {
                      content: content,
                    },
                  },
                ],
              },
            ],
            app_id: iparams.freshchat_app_id,
            channel_id: iparams.channel_list,
            assigned_group_id: iparams.group_list,
            users: [
              {
                id: user_key,
              },
            ],
          }),
        })
        .then(function (data) {
          console.log('this is whole data from createConversation===>', data)
          let result = JSON.parse(data.response)
          console.log(
            'this is whole result from createConversation===>',
            result
          )

          passData = {}
          passData.user_key = user_key
          passData.content = content

          if (result.id == []) {
            getConversationId(passData, domain, iparams)
          }
        }),
        function (err) {
          console.info('error from createConversation===>')
          console.error('this is error', err)
        }
    } catch (error) {
      console.log(error)
    }
  } else if (messageType == 'photo') {
    try {
      $request
        .invokeTemplate('createConversation', {
          context: { user_key: user_key, freshChatUrl: fcURL },
          body: JSON.stringify({
            status: 'new',
            messages: [
              {
                app_id: iparams.freshchat_app_id,
                actor_type: 'user',
                actor_id: user_key,
                channel_id: iparams.channel_list,
                message_type: 'normal',
                message_parts: [
                  {
                    image: {
                      url: content,
                    },
                  },
                ],
              },
            ],
            app_id: iparams.freshchat_app_id,
            channel_id: iparams.channel_list,
            assigned_group_id: iparams.group_list,
            users: [
              {
                id: user_key,
              },
            ],
          }),
        })
        .then(function (data) {
          console.log('this is whole data from createConversation===>', data)
          let result = JSON.parse(data.response)
          console.log(
            'this is whole result from createConversation===>',
            result
          )

          passData = {}
          passData.user_key = user_key
          passData.content = content

          if (result.id == []) {
            getConversationId(passData, domain, iparams)
          }
        }),
        function (err) {
          console.info('error from createConversation===>')
          console.error('this is error', err)
        }
    } catch (error) {
      console.log(error)
    }
  } else if (messageType == 'file') {
    try {
      $request
        .invokeTemplate('createConversation', {
          context: { user_key: user_key, freshChatUrl: fcURL },
          body: JSON.stringify({
            status: 'new',
            messages: [
              {
                app_id: iparams.freshchat_app_id,
                actor_type: 'user',
                actor_id: user_key,
                channel_id: iparams.channel_list,
                message_type: 'normal',
                message_parts: [
                  {
                    file: {
                      url: content,
                    },
                  },
                ],
              },
            ],
            app_id: iparams.freshchat_app_id,
            channel_id: iparams.channel_list,
            assigned_group_id: iparams.group_list,
            users: [
              {
                id: user_key,
              },
            ],
          }),
        })
        .then(function (data) {
          console.log('this is whole data from createConversation===>', data)
          let result = JSON.parse(data.response)
          console.log(
            'this is whole result from createConversation===>',
            result
          )

          passData = {}
          passData.user_key = user_key
          passData.content = content

          if (result.id == []) {
            getConversationId(passData, domain, iparams)
          }
        }),
        function (err) {
          console.info('error from createConversation===>')
          console.error('this is error', err)
        }
    } catch (error) {
      console.log(error)
    }
  }
}

function createUser(passData, iparams) {
  console.log('iparams', iparams)
  console.log('iparams', iparams.freshChat_key)
  console.log('iparams', passData.user_key)
  console.log('iparams', passData.content)
  let content = passData.content
  let fcURL = iparams.freshchat_domain.replace('https://', '')
  console.log('fcURL', fcURL)

  // console.log('requestOptions', requestOptions)
  // console.log('requestUrl', requestUrl)
  $request
    .invokeTemplate('createUser', {
      context: { freshChatUrl: fcURL },
      body: JSON.stringify({
        properties: [
          {
            name: 'Identifier',
            value: passData.user_key,
          },
        ],
        reference_id: passData.user_key,
      }),
    })
    .then(
      function (data) {
        console.log('this is whole data from createUser===>', data)
        let result = JSON.parse(data.response)
        console.log('this is whole result from createUser===>', result)

        passData = {}
        passData.user_key = result.reference_id
        passData.userId = result.id
        passData.content = content

        getUserConversationId(passData, iparams)
      },
      function (err) {
        console.log('error message from createUser =====>')
        console.log('error message from createUser =====>', err)
      }
    )
}

function searchUser(passData, iparams) {
  let user_key = passData.user_key
  let content = passData.content
  let type = passData.type
  let fcURL = iparams.freshchat_domain.replace('https://', '')
  console.log('fcURL', fcURL)
  console.log('iparams', iparams)
  console.log('content from seaarch =====>', content)
  console.log('referance id for searchUser', passData)

  $request
    .invokeTemplate('searchUser', {
      context: { user_key: user_key, freshChatUrl: fcURL },
      // query: { query: user_key },
    })
    .then(
      function (data) {
        console.log('this is whole data from searchUser==1', data)
        let result = JSON.parse(data.response)
        console.log('this is whole result from searchUser==1', result)

        console.log('result.users =====> 1', result.users)

        let passData = {}
        passData.user_key = user_key
        passData.content = content
        passData.type = type

        if (result.users.length === 0) {
          createUser(passData, iparams)
        } else {
          let userlist = result.users.reverse()
          let userArr = userlist[0]
          console.log('userArr all user here =========> 1', userArr)
          let userId = userArr.id
          console.log('userId= 1', userArr.id)
          let passData = {}
          passData.userId = userId
          passData.content = content
          passData.type = type
          console.log('User Information =====> 1', userId)
          getUserConversationId(passData, iparams)
        }
      },
      function (err) {
        console.log('error message from search user =====>')
        console.log('error message from search user =====>', err)
      }
    )
}

function getUserConversationId(passData, iparams) {
  console.log('value from getUserConversation 2', passData)
  console.log('message content 2', passData.content)
  let user_id = passData.userId
  let message_content = passData.content
  let message_type = passData.type
  let fcURL = iparams.freshchat_domain.replace('https://', '')
  console.log('fcURL', fcURL)

  console.log('referance id for searchUser 2', user_id)
  $request
    .invokeTemplate('getUserConversationId', {
      context: { user_id: passData.userId, freshChatUrl: fcURL },
    })
    .then(
      function (data) {
        let value = JSON.parse(data.response)
        console.log('getUserConversation info 2', value)
        let conversationArr = value.conversations
        console.log('data from getUserConversation=====> 2', conversationArr)
        let valueMap = conversationArr.map((item) => item.id)
        let valueIn = valueMap
        console.log('Conversation ID =====> 2', valueIn)

        if (valueIn == '[]' || conversationArr.length == 0) {
          createConversation(user_id, message_content, message_type, iparams)
        } else {
          let conversationList = valueIn[0]
          console.log('conversationList', conversationList)
          let passData = {}
          passData.userId = user_id
          passData.content = message_content
          passData.conversationId = conversationList.toString()
          passData.messageType = message_type
          console.log('passData: from getUserConversation 2', passData)
          getConversationDetails(passData, iparams)
        }
      },
      function (err) {
        console.log('error message from getUserConversationIdd =====>')
        console.log('error message from getUserConversationIdd =====>', err)
      }
    )
}
function getConversationDetails(value, iparams) {
  console.log('conversation Id 3', value)
  var consversationIdList = value.conversationId.split(',').reverse()
  var conversation_id = consversationIdList[0]
  console.log('conversation_id 3', conversation_id)
  console.log('conversation_id 3', conversation_id)
  let fcURL = iparams.freshchat_domain.replace('https://', '')
  console.log('fcURL', fcURL)
  $request
    .invokeTemplate('getConversationDetails', {
      context: { conversation_id: conversation_id, freshChatUrl: fcURL },
    })
    .then(
      function (data) {
        let result = JSON.parse(data.response)
        console.log('this is from conversation details 3', result)
        let passData = {}
        passData.userId = value.userId
        passData.conversation_id = result.conversation_id
        passData.app_id = result.app_id
        passData.status = result.status
        passData.channel_id = result.channel_id
        passData.skill_id = result.skill_id
        passData.content = value.content
        passData.messageType = value.messageType

        sendMessageToAgent(passData, iparams)
      },
      function (err) {
        console.log('error message from getConversationDetails =====>')
        console.log('error message from getConversationDetails =====>', err)
      }
    )
}

function sendMessageToAgent(payload, iparams) {
  console.log('payload from conversation: 4' + JSON.stringify(payload))
  let fcURL = iparams.freshchat_domain.replace('https://', '')
  console.log('fcURL', fcURL)

  if (payload.messageType == 'text') {
    $request
      .invokeTemplate('sendMessageToAgent', {
        context: {
          conversation_id: payload.conversation_id,
          freshChatUrl: fcURL,
        },
        body: JSON.stringify({
          actor_type: 'user',
          actor_id: payload.userId,
          message_type: 'normal',
          message_parts: [
            {
              text: {
                content: payload.content,
              },
            },
          ],
        }),
      })
      .then(
        function (data, err) {
          if (err) {
            console.error('sendMessageToAgent error 4', JSON.stringify(err))
          } else {
            console.log('sendMessageToAgent =====> 4', data.response)
          }
        },
        function (err) {
          console.log('error message from  sendMessageToAgent=====>')
          console.log('error message from sendMessageToAgent =====>', err)
          // retriveConversation(payload, iparams)
          updateConversationId(payload, iparams)
        }
      )
  } else if (payload.messageType == 'photo') {
    console.log('conversation_id', payload.conversation_id)
    $request
      .invokeTemplate('sendMessageToAgent', {
        context: {
          conversation_id: payload.conversation_id,
          freshChatUrl: fcURL,
        },
        body: JSON.stringify({
          actor_type: 'user',
          actor_id: payload.userId,
          message_type: 'normal',
          message_parts: [
            {
              image: {
                url: payload.content,
              },
            },
          ],
        }),
      })
      .then(
        function (data, err) {
          if (err) {
            console.error('sendMessageToAgent error 4', JSON.stringify(err))
          } else {
            console.log('sendMessageToAgent =====> 4', data.response)
          }
        },
        function (err) {
          console.log('error message from  sendMessageToAgent=====>')
          console.log('error message from sendMessageToAgent =====>', err)
        }
      )
  } else if (payload.messageType == 'file') {
    // var reqData = {
    //   headers: headers,
    //   isOAuth: true,
    //   json: {
    //     actor_type: 'user',
    //     actor_id: payload.userId,
    //     message_type: 'normal',
    //     message_parts: [
    //       {
    //         file: {
    //           url: payload.content,
    //         },
    //       },
    //     ],
    //   },
    // }
    $request
      .invokeTemplate('sendMessageToAgent', {
        context: {
          conversation_id: payload.conversation_id,
          freshChatUrl: fcURL,
        },
        body: JSON.stringify({
          actor_type: 'user',
          actor_id: payload.userId,
          message_type: 'normal',
          message_parts: [
            {
              file: {
                url: payload.content,
              },
            },
          ],
        }),
      })
      .then(
        function (data, err) {
          if (err) {
            console.error('sendMessageToAgent error 4', JSON.stringify(err))
          } else {
            console.log('sendMessageToAgent =====> 4', data.response)
          }
        },
        function (err) {
          console.log('error message from  sendMessageToAgent=====>')
          console.log('error message from sendMessageToAgent =====>', err)
        }
      )
  }
}

// function retriveConversation(passData, iparams) {
//   console.log('value from retriveConversation', passData)
//   console.log('retriveConversation Conversatio ID', passData.conversation_id)
//   // let conversation_id = passData.conversation_id
//   // let assigned_agent_id = passData.assigned_agent_id
//   // let assigned_group_id = passData.assigned_group_id

//   // console.log('referance id for searchUser 2', passData.user_id)

//   let fcURL = iparams.freshchat_domain.replace('https://', '')
//   console.log('fcURL', fcURL)

//   $request
//     .invokeTemplate('retriveConversation', {
//       context: {
//         conversation_id: passData.conversation_id,
//         freshChatUrl: fcURL,
//       },
//       // body:
//       //   passData.assigned_agent_id !== undefined
//       //     ? JSON.stringify({
//       //         status: 'new',
//       //         assigned_agent_id: passData.assigned_agent_id,
//       //       })
//       //     : JSON.stringify({
//       //         status: 'new',
//       //         assigned_group_id: passData.assigned_group_id,
//       //       }),
//     })
//     .then(
//       function (data) {
//         console.log('retriveConversation data', data)
//         if (data.status == 'resolved') {
//           updateConversationId(passData)
//         }

//         // let result = JSON.parse(data.response)
//         // let passData = {}
//         // passData.userId = value.userId
//         // passData.conversation_id = result.conversation_id
//         // passData.app_id = result.app_id
//         // passData.status = result.status
//         // passData.channel_id = result.channel_id
//         // passData.skill_id = result.skill_id
//         // passData.content = value.content
//         // passData.messageType = value.messageType
//         // // passData.assigned_agent_id = result.assigned_agent_id
//         // // passData.assigned_group_id = result.assigned_group_id
//         // sendMessageToAgent(passData, iparams)
//       },
//       function (err) {
//         console.log('error message from updateCoversation =====>', err)
//         console.log(
//           'error message from getConversationDetails =====>',
//           err.response.message
//         )
//       }
//     )
// }

//update conversation here
function updateConversationId(passData, iparams) {
  console.log('value from updateConversation 2', passData)
  console.log('message content 2', passData.content)
  // let conversation_id = passData.conversation_id
  // let assigned_agent_id = passData.assigned_agent_id
  // let assigned_group_id = passData.assigned_group_id

  console.log('referance id for searchUser 2', passData.user_id)

  let fcURL = iparams.freshchat_domain.replace('https://', '')
  console.log('fcURL', fcURL)

  $request
    .invokeTemplate('updateConversationId', {
      context: {
        conversation_id: passData.conversation_id,
        freshChatUrl: fcURL,
      },
      body:
        passData.assigned_agent_id !== undefined
          ? JSON.stringify({
              status: 'new',
              assigned_agent_id: passData.assigned_agent_id,
            })
          : JSON.stringify({
              status: 'new',
              assigned_group_id: passData.assigned_group_id,
            }),
    })
    .then(
      function (data) {
        console.log('updateCoversation data', data)

        let result = JSON.parse(data.response)
        let passData = {}
        passData.userId = value.userId
        passData.conversation_id = result.conversation_id
        passData.app_id = result.app_id
        passData.status = result.status
        passData.channel_id = result.channel_id
        passData.skill_id = result.skill_id
        passData.content = value.content
        passData.messageType = value.messageType
        // passData.assigned_agent_id = result.assigned_agent_id
        // passData.assigned_group_id = result.assigned_group_id
        sendMessageToAgent(passData, iparams)
      },
      function (err) {
        console.log('error message from updateCoversation =====>', err)
        console.log(
          'error message from getConversationDetails =====>',
          err.response.message
        )
      }
    )
}

function searchUserForAgent(payload, iparams) {
  console.log('searchUserForAgent', payload, iparams)
  // let userId = payload.user_id
  let message_type = payload.message_type
  let message_content = payload.content
  let freshchat_message_type = payload.freshchat_message_type
  let fcURL = iparams.freshchat_domain.replace('https://', '')
  console.log('fcURL', fcURL)

  $request
    .invokeTemplate('searchUserForAgent', {
      context: { userId: payload.user_id, freshChatUrl: fcURL },
    })
    .then(
      function (data) {
        console.log('data from searchuserforagent', data.response)
        let result = JSON.parse(data.response)
        console.log('searchuserforagent======>', result)

        let passData = {}
        passData.user_key = result.reference_id
        passData.message_type = message_type
        passData.message_content = message_content
        passData.client_id = payload.client_id
        passData.freshchat_message_type = freshchat_message_type
        passData.client_secret = payload.client_secret
        passData.sender_key = payload.sender_key
        if (payload.fileContent) {
          passData.fileContent = payload.fileContent
        }
        console.log('pass data =searchUserForAgent', passData)
        sendMessageToUser(passData)
      },
      function (err) {
        console.log('error message from searchUserForAgent =====>')
        console.log('error message from searchUserForAgent =====>', err)
      }
    )
}

function sendMessageToUser(payload) {
  console.log('payload from sendMessageToUser', payload)
  console.log(
    'payload from sendMessageToUser message type',
    payload.message_type
  )
  console.log(
    'payload from sendMessageToUser freshchat_message_type',
    payload.freshchat_message_type
  )

  let fc_message_type = payload.freshchat_message_type.toString()
  console.log('fc_message_type', fc_message_type)
  const d = new Date()
  let time = d.getTime().toString()
  if (fc_message_type == 'normal' || fc_message_type == 'system') {
    if (payload.message_type == 'TX') {
      console.log('type TX')

      $request
        .invokeTemplate('sendMessageToUser', {
          context: {
            'HT-Client-Id': payload.client_id,
            'HT-Client-Secret': payload.client_secret,
          },
          body: JSON.stringify({
            user_key: payload.user_key,
            sender_key: payload.sender_key,
            serial_number: time,
            message_type: payload.message_type,
            message: emoji.emojify(payload.message_content),
          }),
        })
        .then(
          function (data) {
            console.log('message sent to user', data.response)
          },
          function (err) {
            console.log('Failed to send message - ')
            console.log('Failed to send message - ', JSON.stringify(err))
          }
        )
    } else if (payload.message_type == 'IM') {
      console.log('type IM')
      console.log('payload for image type', payload)

      $request
        .invokeTemplate('multimediaGateway', {
          body: JSON.stringify({
            url: payload.message_content,
            type: 'image',
          }),
        })
        .then(
          function (data) {
            console.log('data from multimedia gateway image', data)
            console.log(
              'data from multimedia gateway image',
              JSON.parse(data.response)
            )

            let imageDataFromLambda = JSON.parse(data.response)
            console.log('imageDataFromLambda', imageDataFromLambda)

            let innerResponsedata = JSON.parse(imageDataFromLambda.response)

            console.log('innerResponsedata', innerResponsedata)
            $request
              .invokeTemplate('sendMessageToUser', {
                context: {
                  'HT-Client-Id': payload.client_id,
                  'HT-Client-Secret': payload.client_secret,
                },
                body: JSON.stringify({
                  user_key: payload.user_key,
                  sender_key: payload.sender_key,
                  serial_number: time,
                  message_type: 'IM',
                  image_url: innerResponsedata.image,
                }),
              })
              .then(
                function (data) {
                  console.log('message sent to user', data.response)
                },
                function (err) {
                  console.log('Failed to send message - ')
                  console.log('Failed to send message - ', JSON.stringify(err))
                }
              )
          },
          function (err) {
            console.log('Failed to send message - ')
            console.log('Failed to send message - ', JSON.stringify(err))
          }
        )
    } else if (payload.message_type == 'file') {
      console.log('type file')
      console.log('payload for file type', payload)
      console.log('fileContent', payload.fileContent)
      // $request.get(
      //   payload.message_content,
      //   { encoding: null },
      //   (error, response, body) => {
      //     // Create a new form data object
      //     const formData = new FormData()
      //     // Append the document buffer to the form data with a field name and a file name
      //     formData.append('file', body, 'dummy.pdf')
      //     formData.append(
      //       'sender_key',
      //       '3fd538ef7218a14a63e51ba47e83c76e1ff5ab62'
      //     )

      $request
        .invokeTemplate('multimediaGateway', {
          body: JSON.stringify({
            name: payload.fileContent[0].name,
            url: payload.message_content,
            file_size_in_bytes: payload.fileContent[0].file_size_in_bytes,
            content_type: payload.fileContent[0].content_type,
            type: 'file',
          }),
        })

        .then(
          function (data) {
            console.log('data from multimedia gateway file', data)
            let fileDataContent = JSON.parse(data.response)
            // let fileDataResponse = JSON.parse(fileDataContent.response)
            // console.log('fileDataResponse', fileDataResponse)
            console.log('fileDataResponse', fileDataContent)
            const jsonResponse = JSON.parse(fileDataContent.response)

            // Step 2: Parse the inner JSON string
            const innerResponse = JSON.parse(jsonResponse)
            console.log('innerResponse', innerResponse)
            // Step 3: Access name and size properties

            $request
              .invokeTemplate('sendMessageToUser', {
                body: JSON.stringify({
                  user_key: payload.user_key,
                  sender_key: payload.sender_key,
                  serial_number: time,
                  message_type: 'FI',
                  file_url: innerResponse.file,
                  file_name: innerResponse.name,
                  file_size: innerResponse.size,
                }),
              })
              .then(
                function (data) {
                  console.log('message sent to user', data.response)
                },
                function (err) {
                  console.log('Failed to send message - ')
                  console.log('Failed to send message - ', JSON.stringify(err))
                }
              )
          },
          function (err) {
            console.log('Failed to send message - ')
            console.log('Failed to send message - ', JSON.stringify(err))
          }
        )
    }
  }
}

// const endpoint = 'https://kakao-api.happytalk.io/v1/center/domain/update'

exports = {
  /**
    * Handler for onAppInstall event
    
  * @param {object} args - payload
  */

  onAppInstallCallback: async function (payload) {
    console.log('onapp install', payload)

    const webhook = await generateTargetUrl()

    console.info('\n Webhook creation successful \n', webhook)

    // const requestUrl =
    //   'https://mqmjsymsz7.execute-api.us-east-1.amazonaws.com/default/KakaoFreshchatSender'
    // const requestOptions = {
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   json: {
    //     sender_key: payload.iparams.Kakao_Sender_Key,
    //     domain: webhook,
    //     clientId: payload.iparams.Kakao_Client_ID,
    //     clientSecret: payload.iparams.Kakao_Client_Secret,
    //   },
    // }
    // console.log('This is ===', requestOptions)

    $request
      .invokeTemplate('registerWebhook', {
        body: JSON.stringify({
          sender_key: payload.iparams.Kakao_Sender_Key,
          domain: webhook,
          clientId: 'cFUbwXGTIfLLesR2',
          clientSecret: 'BRUlWlZNQt',
        }),
      })
      .then(
        function (data) {
          console.log('app installed', data.response)
        },
        function (err) {
          console.log('Failed to onAppInstallCallback - ')
          console.log('Failed to onAppInstallCallback - ', JSON.stringify(err))
        }
      )
    renderData()

    console.info(
      '\n Hander received following payload when app is installed \n\n',
      payload
    )
  },

  /**
   * Handler for onAppUninstall event
   *
   * Get the webhook URL from data storage through $db that was stored during installation
   * Deregister the webhook from JIRA with the URL over REST API
   *
   * @param {object} args - payload
   */
  // onAppUninstallCallback: async function (payload) {
  //   console.log("uninstall", payload);
  //   let thirdPartyEndpoint = payload.iparams.webhook_url
  //   console.log("this is third party endpoint", thirdPartyEndpoint);
  //   try {
  //     const options = {
  //       action: 'de-register'
  //     };
  //     const { response } = await $request.post(thirdPartyEndpoint, options);
  //     console.info('\n Webhook De-Registration Successful \n', response);
  //     console.info('\n Hander received following payload when app is uninstalled \n\n', payload);
  //   } catch (error) {
  //     console.error('Something went wrong. Webhook De-Registration has failed', error);
  //   }
  //   renderData();
  // },

  onExternalEventCallback: function (payload) {
    var iparams = payload.iparams
    console.log('iparams: from on external event ', iparams)
    console.log('onExternalEventCallback payload ====>', payload)
    const { data } = payload
    payload.eventType = 'dashboard' / 'inboundmessagingevent'
    if (typeof data == 'string') {
      externalData = JSON.parse(data)
    } else {
      externalData = data
    }
    let passData = {}
    passData.user_key = externalData.user_key
    passData.session_id = externalData.session_id
    passData.sender_key = externalData.sender_key
    passData.serial_number = externalData.serial_number
    passData.type = externalData.type
    passData.content =
      externalData.content && externalData.content.url
        ? externalData.content.url
        : externalData.content
    console.log('passdata: external event ', passData)
    searchUser(passData, iparams)
    $request
      .invokeTemplate('dashboardGateway', {
        body: JSON.stringify({
          kakaoTalkUserkey: externalData.data.user_key,
          kakaoTalkSessionId: externalData.session_id,
          kakaoTalkSenderKey: externalData.sender_key,
          sessionStartTime: externalData.data.time,
          kakaTalkSerialNumber: externalData.data.serial_number,
          eventType: externalData.event,
          kakaoTalkBusinessId: externalData.iparams.Kakao_Account_Id,
          freshChatAccountId: externalData.account_id,
          freshChatDomainName: externalData.domain,
        }),
      })
      .then(
        function (data) {
          console.log('dashbaoard data', data.response)
        },
        function (err) {
          console.log('Failed to onExternalEventCallback dashbaord  - ')
          console.log(
            'Failed to onExternalEventCallback dashboard - ',
            JSON.stringify(err)
          )
        }
      )
  },
  onUserCreateCallback: async function (payload) {
    // var domain = payload.iparams.freshchat_domain
    let payloadArr = payload.data.properties
    console.log('xxxxxx', payloadArr)
    let propertiesName = payloadArr.map((item) => item.name).toString()
    let propertiesValue = payloadArr.map((item) => item.value).toString()
    console.log('xxxxxxxx', propertiesName + propertiesValue)
    // var requestUrl = `${domain}/v2/users`
    // console.log('request url: for getUser', requestUrl)
    // var headers = {
    //   Authorization: 'Bearer <%= iparam.freshChat_key %>',
    // }
    // const requestOptions = {
    //   headers: headers,
    //   isOAuth: true,
    //   json: {
    //     email: payload.data.email,
    //     avatar: {
    //       url: payload.data.avatar.url,
    //     },
    //     first_name: payload.data.first_name,
    //     last_name: payload.data.last_name,
    //     phone: payload.data.phone,
    //     properties: [
    //       {
    //         name: propertiesName,
    //         value: propertiesValue,
    //       },
    //     ],
    //   },
    // }

    // console.log('request url: for getUser', requestOptions)
    $request
      .invokeTemplate('createUserDetails', {
        context: { domain: payload.iparams.freshchat_domain },
        body: JSON.stringify({
          email: payload.data.email,
          avatar: {
            url: payload.data.avatar.url,
          },
          first_name: payload.data.first_name,
          last_name: payload.data.last_name,
          phone: payload.data.phone,
          properties: [
            {
              name: propertiesName,
              value: propertiesValue,
            },
          ],
        }),
      })
      .then(
        function (data) {
          console.log('user created with id ', data.response)
        },
        function (err) {
          console.log('error message from user call back =====>')
          console.log('error message from user call back =====>', err)
        }
      )
  },
  onConversationCreateCallback: async function (payload) {
    // var domain = payload.iparams.freshchat_domain
    // var requestUrl = `${domain}/v2/conversations`
    // console.log('this is onConversationCreateCallback =x=x=x=', payload)
    // console.log('request url: for onConversationCreateCallback', requestUrl)
    // var headers = {
    //   Authorization: 'Bearer <%= iparam.freshChat_key %>',
    // }
    // const requestOptions = {
    //   headers: headers,
    //   isOAuth: true,
    //   json: {
    //     app_id: payload.data.conversation.app_id,
    //     channel_id: payload.data.conversation.channel_id,
    //     messages: [
    //       {
    //         actor_type: 'agent',
    //         actor_id: payload.data.actor.id,
    //         message_type: 'normal',
    //         message_parts: [
    //           {
    //             text: {
    //               content: 'welcome to Freshwork support!!',
    //             },
    //           },
    //         ],
    //       },
    //     ],
    //     status: 'new',
    //     users: [
    //       {
    //         id: payload.data.conversation.user_id,
    //       },
    //     ],
    //   },
    // }

    // console.log('request url: for createconversation', requestOptions)
    $request
      .invokeTemplate('conversationCreateFromAgent', {
        context: { domain: payload.iparams.freshchat_domain },
        body: JSON.stringify({
          app_id: payload.data.conversation.app_id,
          channel_id: payload.data.conversation.channel_id,
          messages: [
            {
              actor_type: 'agent',
              actor_id: payload.data.actor.id,
              message_type: 'normal',
              message_parts: [
                {
                  text: {
                    content: 'welcome to Freshwork support!!',
                  },
                },
              ],
            },
          ],
          status: 'new',
          users: [
            {
              id: payload.data.conversation.user_id,
            },
          ],
        }),
      })
      .then(
        function (data) {
          console.log('user conversation created with id ', data.response)
        },
        function (err) {
          console.log('error message from createconversation =====>')
          console.log('error message from createconversation =====>', err)
        }
      )
  },
  onMessageCreateCallback: async function (payload) {
    let iparams = payload.iparams

    console.log('onMessageCreateCallback payload', payload.data.message)

    let messageData = payload.data.message.messages

    console.log('onMessageCreateCallback messageData', messageData)

    let messageArr = messageData.map((item) => item)
    console.log('messageArr', messageArr)

    let freshchat_message_type = messageArr.map((item) => item.message_type)
    console.log('freshchat_message_type', freshchat_message_type.toString())

    let messageArrparts = messageData.map((item) => item.message_parts)
    console.log('messageArrparts', messageArrparts)

    let messagePartData = messageArrparts.map((item) => item[0])
    console.log('messagePartData', messagePartData)
    let messageDataString = messagePartData.toString()
    console.log('messageDataString', messageDataString)

    let output = {}
    messagePartData.forEach((data) => {
      if (data.text && data.text.content) {
        output.text_content = data.text.content
      }
      if (data.file && data.file.url) {
        output.file_url = data.file.url
      }
      if (data.image && data.image.url) {
        output.image_url = data.image.url
      }
    })

    // Initialize an empty array to store collected file information
    let fileData = []

    // Iterate through messagePartData array
    messagePartData.forEach((data) => {
      // Check if the message part contains a file
      if (data.file) {
        // Extract relevant information
        let fileInfo = {
          name: data.file.name,
          file_size_in_bytes: data.file.file_size_in_bytes,
          content_type: data.file.content_type,
          type: 'file',
        }
        // Push the file information to the fileData array
        fileData.push(fileInfo)
      }
    })

    // Log the collected file information
    console.log('File Information:', fileData)

    console.log('This is content output', output)

    let contentType = {}
    messagePartData.forEach((data) => {
      if (data.text !== null) {
        contentType.text = 'TX'
      } else if (data.file !== null) {
        contentType.file = 'file'
      } else if (data.image !== null) {
        contentType.image = 'IM'
      } else {
        contentType.others = 'other'
      }
    })
    console.log('This is contentType output', contentType)

    // 1
    let messageArrUserId = messageData.map((item) => item.user_id)
    console.log('messageArrUserId', messageArrUserId.toString())
    let user_id = messageArrUserId.toString()
    // 2
    let messageArrConversationId = messageData.map(
      (item) => item.conversation_id
    )
    console.log('messageArrConversationId', messageArrConversationId.toString())
    let conversation_id = messageArrConversationId.toString()
    // 3
    let messageArrActorType = messageData.map((item) => item.actor_type)
    console.log('messageArrActorType', messageArrActorType.toString())
    let actor_type = messageArrActorType.toString()

    console.log('this is ' + contentType)
    let passData = {}
    // 1
    passData.user_id = user_id
    passData.conversation_id = conversation_id
    passData.actor_type = actor_type
    // passData.content =
    //   output.text_content || output.image_url || output.file_url
    // passData.message_type =
    //   contentType.text || contentType.image || contentType.file

    // Check if fileData is not empty
    if (fileData.length > 0) {
      // If fileData is not empty, pass file information to passData
      passData.fileContent = fileData
    }
    // If fileData is empty, use text_content if available
    passData.content =
      output.text_content || output.image_url || output.file_url
    // Determine message_type based on available content
    passData.message_type =
      contentType.text || contentType.image || contentType.file

    // passData.client_id = payload.iparams.Kakao_Client_ID
    // passData.client_secret = payload.iparams.Kakao_Client_Secret

    passData.client_id = 'cFUbwXGTIfLLesR2'
    passData.client_secret = 'BRUlWlZNQt'
    passData.freshchat_message_type = freshchat_message_type
    passData.sender_key = payload.iparams.Kakao_Sender_Key

    // Log the updated passData
    console.log('Updated passData:', passData)
    if (
      actor_type == 'agent' ||
      actor_type == 'bot' ||
      actor_type == 'system'
    ) {
      searchUserForAgent(passData, iparams)
    }
  },
}
