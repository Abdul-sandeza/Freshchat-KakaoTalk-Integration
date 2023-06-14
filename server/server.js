var request = require('request')

function createConversation(user_id, message_content, message_type, iparams) {
  let user_key = user_id
  let content = message_content
  let messageType = message_type
  console.log('createConversation freshChat_key iparams', iparams.freshChat_key)
  console.log('createConversation all iparams', iparams)
  const requestUrl = `${iparams.freshchat_domain}/v2/conversations`
  if (messageType == 'text') {
    const requestOptions = {
      headers: {
        Authorization: 'Bearer <%= iparam.freshChat_key %>',
      },
      isOAuth: true,
      json: {
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
      },
    }
    console.log('this is requestOptions', requestOptions)
    console.log('this is requestOptions', requestUrl)

    try {
      $request.post(requestUrl, requestOptions).then(function (data) {
        console.log('this is whole data from createConversation===>', data)
        let result = JSON.parse(data.response)
        console.log('this is whole result from createConversation===>', result)

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
    const requestOptions = {
      headers: {
        Authorization: 'Bearer <%= iparam.freshChat_key %>',
      },
      isOAuth: true,
      json: {
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
      },
    }
    console.log('this is requestOptions', requestOptions)
    console.log('this is requestOptions', requestUrl)

    try {
      $request.post(requestUrl, requestOptions).then(function (data) {
        console.log('this is whole data from createConversation===>', data)
        let result = JSON.parse(data.response)
        console.log('this is whole result from createConversation===>', result)

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
    const requestOptions = {
      headers: {
        Authorization: 'Bearer <%= iparam.freshChat_key %>',
      },
      isOAuth: true,
      json: {
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
      },
    }
    console.log('this is requestOptions', requestOptions)
    console.log('this is requestOptions', requestUrl)

    try {
      $request.post(requestUrl, requestOptions).then(function (data) {
        console.log('this is whole data from createConversation===>', data)
        let result = JSON.parse(data.response)
        console.log('this is whole result from createConversation===>', result)

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

  const requestUrl = `${iparams.freshchat_domain}/v2/users`

  const requestOptions = {
    headers: {
      Authorization: 'Bearer <%= iparam.freshChat_key %>',
      'Content-Type': 'application/json',
    },
    isOAuth: true,
    json: {
      properties: [
        {
          name: 'Identifier',
          value: passData.user_key,
        },
      ],
      reference_id: passData.user_key,
    },
  }
  console.log('requestOptions', requestOptions)
  console.log('requestUrl', requestUrl)
  $request.post(requestUrl, requestOptions).then(
    function (data) {
      console.log('this is whole data from createUser===>', data)
      let result = data.response
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
  console.log('iparams', iparams)
  console.log('content from seaarch =====>', content)
  console.log('referance id for searchUser', passData)
  const requestUrl = `${iparams.freshchat_domain}/v2/users?reference_id=${user_key}`
  console.log('request url: for searchUser', requestUrl)
  const requestOptions = {
    headers: {
      Authorization: 'Bearer <%= iparam.freshChat_key %>',
    },
  }
  $request.get(requestUrl, requestOptions).then(
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

  console.log('referance id for searchUser 2', user_id)
  const requestUrl = `${iparams.freshchat_domain}/v2/users/${user_id}/conversations`
  console.log('request url: for getUserConversation 2', requestUrl)
  const requestOptions = {
    headers: {
      Authorization: 'Bearer <%= iparam.freshChat_key %>',
    },
  }
  $request.get(requestUrl, requestOptions).then(
    function (data) {
      let value = JSON.parse(data.response)
      console.log('getUserConversation info 2', value)
      let conversationArr = value.conversations
      console.log('data from getUserConversation=====> 2', conversationArr)
      let valueMap = conversationArr.map((item) => item.id)
      let result = valueMap.toString()
      console.log('Conversation ID =====> 2', result)
      if (conversationArr.length == 0) {
        createConversation(user_id, message_content, message_type, iparams)
      } else {
        let passData = {}
        passData.userId = user_id
        passData.content = message_content
        passData.conversationId = result
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
  var conversation_id = value.conversationId
  console.log('conversation_id 3', conversation_id)
  console.log('conversation_id 3', conversation_id)
  const requestUrl = `${iparams.freshchat_domain}/v2/conversations/${conversation_id}`
  console.log('request url: for getUser 3', requestUrl)
  const requestOptions = {
    headers: {
      Authorization: 'Bearer <%= iparam.freshChat_key %>',
    },
  }
  $request.get(requestUrl, requestOptions).then(
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
  let conversation_id = payload.conversation_id
  const requestUrl = `${iparams.freshchat_domain}/v2/conversations/${conversation_id}/messages`
  var headers = {
    Authorization: 'Bearer <%= iparam.freshChat_key %>',
    'Content-Type': 'application/json',
  }

  if (payload.messageType == 'text') {
    var reqData = {
      headers: headers,
      isOAuth: true,
      json: {
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
      },
    }
    $request.post(requestUrl, reqData).then(
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
  } else if (payload.messageType == 'photo') {
    var reqData = {
      headers: headers,
      isOAuth: true,
      json: {
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
      },
    }
    $request.post(requestUrl, reqData).then(
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
    var reqData = {
      headers: headers,
      isOAuth: true,
      json: {
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
      },
    }
    $request.post(requestUrl, reqData).then(
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

function searchUserForAgent(payload, iparams) {
  console.log('searchUserForAgent', payload, iparams)
  let userId = payload.user_id
  let message_type = payload.message_type
  let message_content = payload.content
  const requestUrl = `${iparams.freshchat_domain}/v2/users/${userId}`
  console.log('request url: for searchUser from agent message', requestUrl)
  const requestOptions = {
    headers: {
      Authorization: 'Bearer <%= iparam.freshChat_key %>',
    },
  }
  $request.get(requestUrl, requestOptions).then(
    function (data) {
      console.log('data from searchuserforagent', data.response)
      let result = JSON.parse(data.response)
      console.log('searchuserforagent======>', result)

      let passData = {}
      passData.user_key = result.reference_id
      passData.message_type = message_type
      passData.message_content = message_content
      passData.client_id = payload.client_id
      passData.client_secret = payload.client_secret
      passData.sender_key = payload.sender_key
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
  const d = new Date()
  let time = d.getTime().toString()

  if (payload.message_type == 'TX') {
    console.log('type TX')

    const requestUrl = `https://kakao-api.happytalk.io/v1/chat/write`
    const requestOptions = {
      headers: {
        'Content-Type': 'application/json',
        'HT-Client-Id': payload.client_id,
        'HT-Client-Secret': payload.client_secret,
      },
      json: {
        user_key: payload.user_key,
        sender_key: payload.sender_key,
        serial_number: time,
        message_type: payload.message_type,
        message: payload.message_content,
      },
    }

    console.log('sendMessageToUser', requestOptions)
    $request.post(requestUrl, requestOptions).then(
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

    const uploadUrl = `https://kakao-api.happytalk.io/v1/image/upload`

    const options = {
      headers: {
        'HT-Client-Id': payload.clientId,
        'HT-Client-secret': payload.clientSecret,
        'Content-Type':
          "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'",
        Cookie: 'SERVERID=nks-pool-1320-w-kfc',
      },
      formData: {
        sender_key: payload.sender_key,
        image: {
          value:
            'C:UserssandeDesktopKakao-freshchat FDK 8configassetsKakao-Fresh chat Architecture.png',
          options: {
            filename: 'image.png',
            contentType: null,
          },
        },
      },
    }

    console.log('image ', options)

    $request.post(uploadUrl, options).then(
      function (data) {
        console.log('message sent to user image', data.response)
      },
      function (err) {
        console.log('Failed to send message - image ')
        console.log('Failed to send message - image ', JSON.stringify(err))
      }
    )

    // const uploadURL = `https://kakao-api.happytalk.io/v1/image/upload`

    // var requestOptions = {
    //   headers: {
    //     'HT-Client-Id': 'cFUbwXGTIfLLesR2',
    //     'HT-Client-secret': 'BRUlWlZNQt',
    //     // 'Content-Type':
    //     //   "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'",
    //   },
    //   json: {
    //     sender_key: payload.sender_key,
    //     message_type: payload.message_type,
    //   },
    // }

    // $request.post(uploadURL, requestOptions).then(
    //   function (data) {
    //     console.log('message sent to user===>1', data)
    //     console.log('message sent to user===>2', data.response)
    //   },
    //   function (err) {
    //     console.log('Failed to send message - ')
    //     console.log('Failed to send message - ', JSON.stringify(err))
    //   }
    // )

    // const requestUrl = `https://kakao-api.happytalk.io/v1/chat/write`

    // const requestOptions = {
    //   headers: {
    //     'HT-Client-Id': payload.client_id,
    //     'HT-Client-Secret': payload.client_secret,
    //   },
    //   json: {
    //     user_key: payload.user_key,
    //     sender_key: payload.sender_key,
    //     serial_number: time,
    //     message_type: payload.message_type,
    //     image_url: payload.message_content,
    //   },
    // }

    // console.log('sendMessageToUser requestOptions', requestOptions)
    // $request.post(requestUrl, requestOptions).then(
    //   function (data) {
    //     console.log('message sent to user', data.response)
    //   },
    //   function (err) {
    //     console.log('Failed to send message - ')
    //     console.log('Failed to send message - ', JSON.stringify(err))
    //   }
    // )
  } else if (payload.message_type == 'file') {
    console.log('type file')
    const requestUrl = `https://kakao-api.happytalk.io/v1/file/upload`

    const requestOptions = {
      headers: {
        'HT-Client-Id': payload.client_id,
        'HT-Client-Secret': payload.client_secret,
        'Content-Type':
          "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'",
      },
      formData: {
        sender_key: payload.sender_key,
        file: payload.message_content,
      },
    }
    console.log('sendMessageToUser requestOptions', requestOptions)
    $request.post(requestUrl, requestOptions).then(
      function (data) {
        console.log('message sent to user', data.response)
      },
      function (err) {
        console.log('Failed to send message - ')
        console.log('Failed to send message - ', JSON.stringify(err))
      }
    )
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

    const requestUrl =
      'https://mqmjsymsz7.execute-api.us-east-1.amazonaws.com/default/KakaoFreshchatSender'
    const requestOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      json: {
        sender_key: payload.iparams.Kakao_Sender_Key,
        domain: webhook,
        clientId: payload.iparams.Kakao_Client_ID,
        clientSecret: payload.iparams.Kakao_Client_Secret,
      },
    }
    console.log('This is ===', requestOptions)

    $request.post(requestUrl, requestOptions).then(
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
  },
  onUserCreateCallback: async function (payload) {
    var domain = payload.iparams.freshchat_domain
    let payloadArr = payload.data.properties
    console.log('xxxxxx', payloadArr)
    let propertiesName = payloadArr.map((item) => item.name).toString()
    let propertiesValue = payloadArr.map((item) => item.value).toString()
    console.log('xxxxxxxx', propertiesName + propertiesValue)
    var requestUrl = `${domain}/v2/users`
    console.log('request url: for getUser', requestUrl)
    var headers = {
      Authorization: 'Bearer <%= iparam.freshChat_key %>',
    }
    const requestOptions = {
      headers: headers,
      isOAuth: true,
      json: {
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
      },
    }

    console.log('request url: for getUser', requestOptions)
    $request.post(requestUrl, requestOptions).then(
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
    var domain = payload.iparams.freshchat_domain
    var requestUrl = `${domain}/v2/conversations`
    console.log('this is onConversationCreateCallback =x=x=x=', payload)
    console.log('request url: for onConversationCreateCallback', requestUrl)
    var headers = {
      Authorization: 'Bearer <%= iparam.freshChat_key %>',
    }
    const requestOptions = {
      headers: headers,
      isOAuth: true,
      json: {
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
      },
    }

    console.log('request url: for createconversation', requestOptions)
    $request.post(requestUrl, requestOptions).then(
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
    passData.content =
      output.text_content || output.image_url || output.file_url
    passData.message_type =
      contentType.text || contentType.image || contentType.file
    passData.client_id = payload.iparams.Kakao_Client_ID
    passData.client_secret = payload.iparams.Kakao_Client_Secret
    passData.sender_key = payload.iparams.Kakao_Sender_Key
    if (actor_type == 'agent') {
      searchUserForAgent(passData, iparams)
    }
  },
}
