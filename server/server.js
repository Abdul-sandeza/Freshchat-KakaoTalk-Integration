function createConversation(user_id, message_content, iparams) {
  let user_key = user_id
  let content = message_content
  console.log("createConversation freshChat_key iparams", iparams.freshChat_key);
  console.log("createConversation all iparams", iparams);
  const requestUrl = `${iparams.freshchat_domain}/conversations`
  const requestOptions = {
    headers: {
      Authorization: 'Bearer <%= iparam.freshChat_key %>'
    },
    isOAuth: true,
    json:
    // {
    //   "messages": [
    //     {
    //       "app_id": "4c5cdfa2-9070-4a62-abf2-7d25953b954e",
    //       "actor_type": "user",
    //       "actor_id": user_key,
    //       "channel_id": "39829688-cf36-4424-a31b-e961e56b2dc4",
    //       "message_type": "normal",
    //       "message_parts": [
    //         {
    //           "text": {
    //             "content": content
    //           }
    //         }
    //       ]
    //     }
    //   ],
    //   "status": "new",
    //   "users": [
    //     {
    //       "id": user_key
    //     }
    //   ]
    // },
    {
      app_id: "4c5cdfa2-9070-4a62-abf2-7d25953b954e",
      channel_id: iparams.channel_list.id,
      assigned_group_id: iparams.group_list.id,
      messages: [
        {
          app_id: "4c5cdfa2-9070-4a62-abf2-7d25953b954e",
          actor_type: "user",
          actor_id: user_key,
          channel_id: iparams.channel_list.id,
          message_type: "normal",
          message_parts: [
            {
              text: {
                content: content
              }
            }
          ]
        }
      ],
      status: "new",
      users: [
        {
          id: user_key
        }
      ]
    }
  };
  $request.post(requestUrl, requestOptions).then(function (data) {
    console.log("this is whole data from createConversation===>", data);
    let result = JSON.parse(data.response);
    console.log("this is whole result from createConversation===>", result);

    passData = {}
    passData.user_key = user_key
    passData.content = content

    if (result.id == []) {
      getConversationId(passData, domain, iparams)
    }

  }, function (err) {
    console.log('error message from createConversation =====>', err);
  });

}

function createUser(passData, iparams) {
  console.log("iparams", iparams);
  console.log("iparams", iparams.freshChat_key);
  console.log("iparams", passData.user_key);
  console.log("iparams", passData.content);



  // let user_key = user_key
  // let content = content
  const requestUrl = `${iparams.freshchat_domain}/users`

  const requestOptions = {
    headers: {
      Authorization: 'Bearer <%= iparam.freshChat_key %>',
      "Content-Type": "application/json"
    },
    isOAuth: true,
    json:
    {
      // "avatar": {
      //   "url": passData.avatar
      // },
      // "email": passData.email,
      // "first_name": passData.first_name,
      // "last_name": passData.last_name,
      // "phone": passData.phone,
      "properties": [
        {
          "name": "Identifier",
          "value": passData.user_key
        }
      ],
      "reference_id": passData.user_key
    }

  };
  console.log("requestOptions", requestOptions);
  console.log("requestUrl", requestUrl);
  $request.post(requestUrl, requestOptions).then(function (data) {
    console.log("this is whole data from createUser===>", data);
    let result = data.response;
    console.log("this is whole result from createUser===>", result);

    passData = {}
    passData.user_key = result.reference_id
    passData.userId = result.id
    passData.content = passData.content

    getUserConversationId(passData, iparams)

  }, function (err) {
    console.log('error message from createUser =====>', err);
  });

}

function searchUser(passData, iparams) {
  let user_key = passData.user_key
  let content = passData.content
  console.log("iparams", iparams);
  console.log("content form seaarch =====>", content);
  console.log("referance id for searchUser", passData);
  const requestUrl = `${iparams.freshchat_domain}/users?reference_id=${user_key}`
  console.log("request url: for searchUser", requestUrl);
  const requestOptions = {
    headers: {
      Authorization: 'Bearer <%= iparam.freshChat_key %>'
    },
  };
  $request.get(requestUrl, requestOptions).then(function (data) {
    console.log("this is whole data from searchUser==1", data);
    let result = JSON.parse(data.response);
    console.log("this is whole result from searchUser==1", result);

    console.log('result.users =====> 1', result.users);
    // let userData = result.users
    // console.log("userData", userData);
    // let mapData = userData.map((item) => (item)
    // )
    // console.log(mapData)

    // let propData = mapData.map((item) => (item.properties)
    // )
    // let prop = propData[0].map((item) => (item))
    // console.log(prop)

    // let name1 = prop.map((item) => (item.name))
    // console.log(name1.toString())
    // let propertiesName = name1.toString()

    // let value1 = prop.map((item) => (item.value))
    // console.log(value1.toString())
    // let propertiesValue = value1.toString()

    // let reference_id = mapData.map((item) => (item.reference_id)
    // )
    // console.log(reference_id[0])
    // let user_key = reference_id[0]

    // let avatarData = mapData.map((item) => (item.avatar.url)
    // )
    // console.log(avatarData[0]);
    // let avatar = avatarData[0]

    // let firstName = mapData.map((item) => (item.first_name)
    // )
    // console.log(firstName[0]);

    // let first_name = firstName[0]

    // let lastName = mapData.map((item) => (item.last_name)
    // )
    // console.log(lastName[0]);

    // let last_name = lastName[0]

    // let email = mapData.map((item) => (item.email)
    // )

    // console.log(email[0]);

    // let emailId = email[0]

    // let phone = mapData.map((item) => (item.phone)
    // )

    // console.log(phone[0]);

    // let PhoneNumber = phone[0]

    let passData = {}
    passData.user_key = user_key
    passData.content = content
    // passData.first_name = first_name
    // passData.last_name = last_name
    // passData.email = emailId
    // passData.phone = PhoneNumber
    // passData.avatar = avatar
    // passData.propertiesName = "referance_Id"
    // passData.propertiesValue = user_key

    if (result.users.length === 0) {
      createUser(passData, iparams)
    } else {
      let userlist = (result.users.reverse());
      let userArr = (userlist[0]);
      console.log("userArr all user here =========> 1", userArr);
      let userId = userArr.id
      console.log("userId= 1", userArr.id);
      let passData = {}
      passData.userId = userId;
      passData.content = content;

      console.log('User Information =====> 1', userId);
      getUserConversationId(passData, iparams)
    }

  }
    , function (err) {
      console.log('error message from search user =====>', err);
    });

}

function getUserConversationId(value, iparams) {
  console.log("value from getUserConversation 2", value);
  console.log("message content 2", value.content);
  let user_id = value.userId
  let message_content = value.content

  console.log("referance id for searchUser 2", user_id);
  const requestUrl = `${iparams.freshchat_domain}/users/${user_id}/conversations`
  console.log("request url: for getUserConversation 2", requestUrl);
  const requestOptions = {
    headers: {
      Authorization: 'Bearer <%= iparam.freshChat_key %>'
    },
  };
  $request.get(requestUrl, requestOptions).then(function (data) {
    let value = JSON.parse(data.response);
    console.log("getUserConversation info 2", value);
    let conversationArr = (value.conversations);
    console.log("data from getUserConversation=====> 2", (conversationArr));
    let valueMap = conversationArr.map((item) => (item.id));
    let result = valueMap.toString();
    console.log('Conversation ID =====> 2', result);
    if (conversationArr.length == 0) {
      createConversation(user_id, message_content, iparams)
    } else {
      let passData = {}
      passData.userId = user_id
      passData.content = message_content
      passData.conversationId = result
      console.log("passData: from getUserConversation 2", passData);
      getConversationDetails(passData, iparams)
    }
  }, function (err) {
    console.log('error message from getUserConversationId =====>', err);
  });
}

function getConversationDetails(value, iparams) {
  console.log("conversation Id 3", value);
  var conversation_id = value.conversationId
  console.log("conversation_id 3", conversation_id);
  console.log("conversation_id 3", conversation_id);
  const requestUrl = `${iparams.freshchat_domain}/conversations/${conversation_id}`
  console.log("request url: for getUser 3", requestUrl);
  const requestOptions = {
    headers: {
      Authorization: 'Bearer <%= iparam.freshChat_key %>'
    },
  };
  $request.get(requestUrl, requestOptions).then(function (data) {
    let result = JSON.parse(data.response);
    console.log("this is from conversation details 3", result);
    let passData = {}
    passData.userId = value.userId;
    passData.conversation_id = result.conversation_id
    passData.app_id = result.app_id
    passData.status = result.status
    passData.channel_id = result.channel_id
    passData.skill_id = result.skill_id
    passData.content = value.content
    sendMessageToAgent(passData, iparams)
  }, function (err) {
    console.log('error message from search user =====>', err);
  });
}

function sendMessageToAgent(payload, iparams) {
  console.log("payload from conversation: 4" + JSON.stringify(payload))
  let conversation_id = payload.conversation_id
  const requestUrl = `${iparams.freshchat_domain}/conversations/${conversation_id}/messages`
  var headers = {
    "Authorization": 'Bearer <%= iparam.freshChat_key %>',
    "Content-Type": "application/json"
  };
  var reqData = {
    headers: headers,
    isOAuth: true,
    json: {
      "actor_type": "user",
      "actor_id": payload.userId,
      "message_type": "normal",
      "message_parts": [
        {
          "text": {
            "content": payload.content
          }
        }
      ]
    }
  };
  $request.post(requestUrl, reqData).then(function (data, err) {
    if (err) {
      console.error('sendMessageToAgent error 4', JSON.stringify(err));
    } else {
      console.log("sendMessageToAgent =====> 4", data.response);
    }

  }, function (err) {
    console.log('error message from search user =====>', err);
  })

}

function searchUserForAgent(payload, iparams) {
  console.log("searchUserForAgent", payload, iparams);
  let userId = payload.user_id;
  let message_type = payload.message_type;
  let message_content = payload.content;
  const requestUrl = `${iparams.freshchat_domain}/users/${userId}`
  console.log("request url: for searchUser from agent message", requestUrl);
  const requestOptions = {
    headers: {
      Authorization: 'Bearer <%= iparam.freshChat_key %>'
    },
  };
  $request.get(requestUrl, requestOptions).then(function (data) {
    console.log("data from searchuserforagent", data.response);
    let result = JSON.parse(data.response);
    console.log("searchuserforagent======>", result);


    let passData = {}
    passData.user_key = result.reference_id;
    passData.message_type = message_type;
    passData.message_content = message_content;
    passData.client_id = payload.client_id;
    passData.client_secret = payload.client_secret;
    passData.sender_key = payload.sender_key
    console.log("pass data =searchUserForAgent", passData);
    sendMessageToUser(passData)
  }, function (err) {
    console.log('error message from search user =====>', err);
  });
}

function sendMessageToUser(payload) {
  const d = new Date();
  let time = d.getTime().toString();
  const requestUrl = `https://kakao-api.happytalk.io/v1/chat/write`
  const requestOptions = {
    headers: {
      "Content-Type": "application/json",
      "HT-Client-Id": payload.client_id,
      "HT-Client-Secret": payload.client_secret
    },
    json: {
      "user_key": payload.user_key,
      "sender_key": payload.sender_key,
      // "serial_number": "2912789790723111230",
      "serial_number": time,
      "message_type": payload.message_type,
    }

  };

  if (payload.message_type === "tx") {
    json.message = payload.message_content
  } else if (payload.message_type === "Im") {
    json.image_url = payload.message_content
  }


  console.log("sendMessageToUser", requestOptions);
  $request.post(requestUrl, requestOptions).then(function (data) {

    console.log('message sent to user', (data.response));
  }, function (err) {
    console.log('Failed to send message - ', JSON.stringify(err));
  });
}

const endpoint = 'https://kakao-api.happytalk.io/v1/center/domain/update'

exports = {
  /**
    * Handler for onAppInstall event
    
  * @param {object} args - payload
  */

  onAppInstallCallback: async function (payload) {
    console.log("onapp install", payload);
    let thirdPartyEndpoint = payload.iparams.webhook_url
    console.log("this is third party endpoint", thirdPartyEndpoint);
    // try {
    const webhook = await generateTargetUrl();
    // const options = {
    //   // body: `{'webhook': ${webhook}}`,
    //   // action: 'register',
    //   // json: {
    //   //   //   user_key: payload.data.user_key,
    //   //   //   session_id: payload.data.session_id,
    //   //   //   sender_key: payload.data.sender_key,
    //   //   //   time: payload.data.time,
    //   //   //   serial_number: payload.data.serial_number,
    //   //   //   type: payload.data.type,
    //   //   //   content: payload.data.content
    //   // }
    // };
    // const { response } = await $request.post(options);

    console.info('\n Webhook creation successful \n', webhook);
    // console.info('\n Webhook Registration Successful \n', response);
    console.info('\n Hander received following payload when app is installed \n\n', payload);
    renderData();

    // } catch (error) {
    //   console.error('Something went wrong. Webhook Registration has failed', error);
    // }
    // renderData();
  },
  // onAppInstallCallback: async function (payload) {
  //   console.log("onapp install", payload);
  //   let thirdPartyEndpoint = payload.iparams.webhook_url
  //   console.log("this is third party endpoint", thirdPartyEndpoint);
  //   // try {
  //   const webhook = await generateTargetUrl();
  //   // const options = {
  //   //   // body: `{'webhook': ${webhook}}`,
  //   //   // action: 'register',
  //   //   // json: {
  //   //   //   //   user_key: payload.data.user_key,
  //   //   //   //   session_id: payload.data.session_id,
  //   //   //   //   sender_key: payload.data.sender_key,
  //   //   //   //   time: payload.data.time,
  //   //   //   //   serial_number: payload.data.serial_number,
  //   //   //   //   type: payload.data.type,
  //   //   //   //   content: payload.data.content
  //   //   // }
  //   // };
  //   // const { response } = await $request.post(options);

  //   console.info('\n Webhook creation successful \n', webhook);
  //   // console.info('\n Webhook Registration Successful \n', response);
  //   console.info('\n Hander received following payload when app is installed \n\n', payload);
  //   renderData();

  //   // } catch (error) {
  //   //   console.error('Something went wrong. Webhook Registration has failed', error);
  //   // }
  //   // renderData();
  // },

  // onAppInstallCallback: async function (payload) {
  //     try {
  //       const webhook = await generateTargetUrl();
  //       const options = {
  //         headers: {
  //           "HT-Client-Id": payload.iparams.Kakao_Client_ID,
  //           "HT-Client-Secret": payload.iparams.Kakao_Client_Secret
  //         },
  //         json: {
  //           domain: "https://bfzyifbc8l.execute-api.us-east-1.amazonaws.com",
  //           sender_key: payload.iparams.Kakao_Sender_Key
  //         }
  //       }
  //       const { response } = await $request.post(endpoint, options);

  //       console.info('\n Webhook creation successful \n', webhook);
  //       console.info('\n Webhook Registration Successful \n', response);
  //       console.info('\n options \n', options);
  //       // console.info('\n Hander received following payload when app is installed \n\n', payload);

  //       renderData();
  //     } catch (error) {
  //       console.error('Something went wrong. Webhook Registration has failed');
  //     }
  //     renderData();
  //   },
  // generateTargetUrl().done(function (targetUrl) {
  //   console.log("targetUrl: " + targetUrl);
  //   $request.post(
  //     "https://kakao-api.happytalk.io/v1/center/domain/update",
  //     {
  //       headers: {
  //         "HT-Client-Id": payload.iparams.Kakao_Client_ID,
  //         "HT-Client-Secret": payload.iparams.Kakao_Client_Secret
  //       },
  //       json: {
  //         // domain: "https://bfzyifbc8l.execute-api.us-east-1.amazonaws.com/default/kakaoTalk",
  //         domain: targetUrl,
  //         sender_key: payload.iparams.Kakao_Sender_Key,
  //       }
  //     }
  //   )
  //   renderData();
  // })
  // },
  /**
  * Handler for onAppUninstall event
  *
  * Get the webhook URL from data storage through $db that was stored during installation
  * Deregister the webhook from JIRA with the URL over REST API
  *
  * @param {object} args - payload
  */
  onAppUninstallCallback: async function (payload) {
    console.log("uninstall", payload);
    let thirdPartyEndpoint = payload.iparams.webhook_url
    console.log("this is third party endpoint", thirdPartyEndpoint);
    try {
      const options = {
        action: 'de-register'
      };
      const { response } = await $request.post(thirdPartyEndpoint, options);
      console.info('\n Webhook De-Registration Successful \n', response);
      console.info('\n Hander received following payload when app is uninstalled \n\n', payload);
    } catch (error) {
      console.error('Something went wrong. Webhook De-Registration has failed', error);
    }
    renderData();
  },

  onExternalEventCallback: function (payload) {
    // var domain = payload.iparams.freshchat_domain;
    var iparams = payload.iparams
    console.log("iparams: from on external event ", iparams);
    // console.log("========this` is external freshchat url=======", domain);
    console.log("onExternalEventCallback payload ====>", (payload));
    const { data } = (payload);
    // let externalData = (data);
    if (typeof (data) == "string") {
      externalData = JSON.parse(data)
    } else {
      externalData = (data)
    }
    let passData = {}
    passData.user_key = externalData.user_key
    passData.session_id = externalData.session_id
    passData.sender_key = externalData.sender_key
    passData.serial_number = externalData.serial_number
    passData.type = externalData.type
    passData.content = externalData.content
    console.log("passdata: external event ", passData);
    searchUser(passData, iparams);

  },
  onUserCreateCallback: async function (payload) {
    var domain = payload.iparams.freshchat_domain
    let payloadArr = payload.data.properties
    console.log("xxxxxx", payloadArr);
    let propertiesName = payloadArr.map((item) => item.name).toString()
    let propertiesValue = payloadArr.map((item) => item.value).toString()
    console.log("xxxxxxxx", propertiesName + propertiesValue);
    var requestUrl = `${domain}/users`
    console.log("request url: for getUser", requestUrl);
    var headers = {
      Authorization: 'Bearer <%= iparam.freshChat_key %>',
    };
    const requestOptions = {
      headers: headers,
      isOAuth: true,
      json: {
        "email": payload.data.email,
        "avatar": {
          "url": payload.data.avatar.url
        },
        "first_name": payload.data.first_name,
        "last_name": payload.data.last_name,
        "phone": payload.data.phone,
        "properties": [
          {
            "name": propertiesName,
            "value": propertiesValue
          }
        ],

      }
    };

    console.log("request url: for getUser", requestOptions);
    $request.post(requestUrl, requestOptions).then(function (data) {
      console.log("user created with id ", data.response);

    }, function (err) {
      console.log('error message from search user =====>', err);
    });
  },
  onConversationCreateCallback: async function (payload) {
    var domain = payload.iparams.freshchat_domain
    var requestUrl = `${domain}/conversations`
    console.log("request url: for onConversationCreateCallback", requestUrl);
    var headers = {
      Authorization: 'Bearer <%= iparam.freshChat_key %>',
    };
    const requestOptions = {
      headers: headers,
      isOAuth: true,
      json: {
        "app_id": payload.data.conversation.app_id,
        "channel_id": payload.data.conversation.channel_id,
        "messages": [
          {
            "actor_type": "agent",
            "actor_id": "c93ef932-06cd-4e7b-9cfa-729acc8ad376",
            "message_type": "normal",
            "message_parts": [
              {
                "text": {
                  "content": "welcome to Freshwork support!!"
                }
              }
            ]
          }
        ],
        "status": "new",
        "users": [
          {
            "id": payload.data.conversation.user_id
          }
        ]
      }
    };

    console.log("request url: for createconversation", requestOptions);
    $request.post(requestUrl, requestOptions).then(function (data) {
      console.log("user conversation created with id ", data.response);

    }, function (err) {
      console.log('error message from createconversation =====>', err);
    });
  },
  onMessageCreateCallback: async function (payload) {


    console.log("onMessageCreateCallback payload", payload);
    console.log("onMessageCreateCallback iparams", payload.iparams);
    let iparams = payload.iparams

    console.log("========this is onMessageCreateCallback payload=======", payload.data.message);
    console.log("========this is onMessageCreateCallback messages=======", payload.data.message.messages);

    let messageData = payload.data.message.messages


    let messageArr = messageData.map((item) => (item));
    console.log("messageArr", messageArr);

    let messageArrparts = messageData.map((item) => (item.message_parts));
    console.log("messageArrparts", messageArrparts);

    let messagePartData = messageArrparts.map((item) => (item[0]));
    console.log("messagePartData", messagePartData);
    let messageDataString = messagePartData.toString()
    console.log("messageDataString", messageDataString);


    let output = {};
    messagePartData.forEach(data => {
      if (data.text && data.text.content) {
        output.text_content = data.text.content;
      }
      if (data.file && data.file.url) {
        output.file_url = data.file.url;
      }
      if (data.image && data.image.url) {
        output.image_url = data.image.url;
      }
    });

    console.log(output)


    let contentType = {};
    messagePartData.forEach(data => {
      if (data.text !== null) {
        contentType.text = 'TX';

      } else if (data.file !== null) {
        contentType.file = 'file';

      } else if (data.image !== null) {
        contentType.image = 'IM';

      } else {
        contentType.others = 'other';
      }
    })

    // 1
    let messageArrUserId = messageData.map((item) => (item.user_id));
    console.log("messageArrUserId", messageArrUserId.toString());
    let user_id = messageArrUserId.toString()
    // 2
    let messageArrConversationId = messageData.map((item) => (item.conversation_id));
    console.log("messageArrConversationId", messageArrConversationId.toString());
    let conversation_id = messageArrConversationId.toString()
    // 3
    let messageArrActorType = messageData.map((item) => (item.actor_type));
    console.log("messageArrActorType", messageArrActorType.toString());
    let actor_type = messageArrActorType.toString()
    // 4
    // let messageArrMessageType = messageData.map((item) => (item.message_type));
    // console.log("messageArrMessageType", messageArrMessageType.toString());
    // let message_type = messageArrMessageType.toString()
    // 5
    // let messageArrContent = messageData.map((item) => (item.full_message_text));
    // console.log("messageArrContent", messageArrContent.toString());
    // let messageContent = messageArrContent.toString()



    // let messageParts = messageData.map((item) => (item.message_parts));
    // console.log("messageParts", messageParts);

    // let message = messageArr.toString();



    console.log("this is " + contentType);
    let passData = {}
    // 1
    passData.user_id = user_id
    passData.conversation_id = conversation_id
    passData.actor_type = actor_type
    passData.content = output.text_content || output.image_url || output.file_url
    passData.message_type = contentType.text || contentType.image || contentType.file
    passData.client_id = payload.iparams.Kakao_Client_ID;
    passData.client_secret = payload.iparams.Kakao_Client_Secret;
    passData.sender_key = payload.iparams.Kakao_Sender_Key
    if (actor_type == "agent") {
      searchUserForAgent(passData, iparams)
    }


  }
};


