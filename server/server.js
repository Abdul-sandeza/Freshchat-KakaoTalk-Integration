function searchUser(passData, domain) {
  let user_key = passData.user_key
  let content = passData.content
  console.log("domain", domain);
  console.log("content form seaarch =====>", content);
  console.log("referance id for searchUser", passData);
  const requestUrl = `${domain}/users?reference_id=${user_key}`
  console.log("request url: for searchUser", requestUrl);
  const requestOptions = {
    headers: {
      Authorization: 'Bearer <%= iparam.freshChat_key %>'
    },
  };
  $request.get(requestUrl, requestOptions).then(function (data) {
    let result = JSON.parse(data.response);
    let userlist = (result.users.reverse());
    let userArr = (userlist[0]);
    console.log("userArr all user here =========> 1", userArr);
    let userId = userArr.id
    console.log("userId= 1", userArr.id);

    let passData = {}
    passData.userId = userId;
    passData.content = content;
    console.log('User Information =====> 1', userId);
    getUserConversationId(passData, domain)
  }, function (err) {
    console.log('error message from search user =====>', err);
  });

}

function getUserConversationId(value, domain) {
  console.log("value from getUserConversation 2", value);
  console.log("message content 2", value.content);
  let user_id = value.userId
  let message_content = value.content

  console.log("referance id for searchUser 2", user_id);
  const requestUrl = `${domain}/users/${user_id}/conversations`
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

    let passData = {}
    passData.userId = user_id
    passData.content = message_content
    passData.conversationId = result
    console.log("passData: from getUserConversation 2", passData);
    getConversationDetails(passData, domain)

  }, function (err) {
    console.log('error message from search user =====>', err);
  });
}

function getConversationDetails(value, domain) {
  console.log("conversation Id 3", value);
  var conversation_id = value.conversationId
  console.log("conversation_id 3", conversation_id);
  console.log("conversation_id 3", conversation_id);
  const requestUrl = `${domain}/conversations/${conversation_id}`
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
    sendMessageToAgent(passData, domain)
  }, function (err) {
    console.log('error message from search user =====>', err);
  });
}

function sendMessageToAgent(payload, domain) {
  console.log("payload from conversation: 4" + JSON.stringify(payload))
  let conversation_id = payload.conversation_id
  const requestUrl = `${domain}/conversations/${conversation_id}/messages`
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

  }).catch((err) => { console.log(err) })

}





function searchUserForAgent(payload, domain) {
  console.log("searchUserForAgent", payload, domain);
  let userId = payload.user_id;
  let message_type = payload.message_type;
  let message_content = payload.content;
  const requestUrl = `${domain}/users/${userId}`
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
      "message_type": "TX",
      "message": payload.message_content
    }
  };
  console.log("sendMessageToUser", requestOptions);
  $request.post(requestUrl, requestOptions).then(function (data) {

    console.log('message sent to user', (data.response));
  }, function (err) {
    console.log('Failed to send message - ', JSON.stringify(err));
  });
}



exports = {
  /**
    * Handler for onAppInstall event
    
  * @param {object} args - payload
  */
  onAppInstallCallback: async function (payload) {
    console.log("onapp install", payload);
    let thirdPartyEndpoint = payload.iparams.webhook_url
    // console.log("this is third party endpoint", thirdPartyEndpoint);
    try {
      const webhook = await generateTargetUrl();
      const options = {
        body: `{'webhook': ${webhook}}`,
        action: 'register',
        json: {
          user_key: payload.user_key,
          session_id: payload.session_id,
          sender_key: payload.sender_key,
          time: payload.time,
          serial_number: payload.serial_number,
          type: payload.type,
          content: payload.content
        }
      };
      console.log("------------", options);
      const { response } = await $request.post(thirdPartyEndpoint, options);
      renderData();

      console.info('\n Webhook creation successful \n', webhook);
      console.info('\n Webhook Registration Successful \n', response);
      console.info('\n Hander received following payload when app is installed \n\n', payload);

    } catch (error) {
      console.error('Something went wrong. Webhook Registration has failed', error);
    }
    renderData();
  },
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
    // console.log("this is third party endpoint", thirdPartyEndpoint);
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
    var domain = payload.iparams.freshchat_domain;
    // console.log("========this` is external freshchat url=======", domain);
    console.log("onExternalEventCallback payload ====>", (payload));
    const { data } = (payload);
    // let externalData = (data);
    if (typeof (data) == "string") {
      externalData = (data)
    } else {
      externalData = (data)
    }
    let passData = {}
    passData.user_key = externalData.user_key
    passData.sender_key = externalData.sender_key
    passData.serial_number = externalData.serial_number
    passData.type = externalData.type
    passData.content = externalData.content
    console.log("passdata: ", passData);
    searchUser(passData, domain);

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
                  "content": "hey dude!!"
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
    var domain = payload.iparams.freshchat_domain;
    // console.log("========this is onMessageCreateCallback freshchat url=======", domain);
    console.log("========this is onMessageCreateCallback payload=======", payload);
    console.log("========this is onMessageCreateCallback payload=======", payload.event);
    let messageData = payload.data.conversation.message_parts
    let messageArr = messageData.map((item) => (item.text.content));
    console.log("messageArr", messageArr);
    console.log("messageArr", messageData);
    let message = messageArr.toString();
    let passData = {}
    passData.user_id = payload.data.conversation.user_id
    passData.conversation_id = payload.data.conversation.conversation_id
    passData.actor_type = payload.data.conversation.actor_type
    passData.message_type = payload.data.conversation.message_type
    passData.content = message
    passData.client_id = payload.iparams.Kakao_Client_ID;
    passData.client_secret = payload.iparams.Kakao_Client_Secret;
    passData.sender_key = payload.iparams.Kakao_Sender_Key
    searchUserForAgent(passData, domain)


  }
};


