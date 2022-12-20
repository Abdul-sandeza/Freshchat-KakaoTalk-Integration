// const util = require('./lib/util');

// function activateKakaoChat

// const thirdPartyEndpoint = 'https://eomt4pwuo6e17sl.m.pipedream.net/kakao'

// const freshdeskUrl = 'https://manufacturingverticalsandbox.freshchat.com/v2'
// const freshdeskUrl = 'https://manufacturingverticalsandbox.freshchat.com/v2'


function searchUser(value, domain) {
  let user_key = value.user_key
  let content = value.content
  // let domain = domain
  console.log("domain", domain);
  console.log("content form seaarch =====>", content);
  console.log("referance id for searchUser", value);
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
    console.log("userArr all user here =========>", userArr);
    let userId = userArr.id
    console.log("userId=", userArr.id);
    // let userMap = userArr.map((item) => (item.id));
    // let userId = userMap.toString();

    let passData = {}
    passData.userId = userId;
    passData.content = content;
    console.log('User Information =====>', userId);
    getUserConversationId(passData, domain)
  }, function (err) {
    console.log('error message from search user =====>', err);
  });

}

function getUserConversationId(value, domain) {
  console.log("value from getUserConversation", value);
  console.log("message content", value.content);
  let user_id = value.userId
  let message_content = value.content

  console.log("referance id for searchUser", user_id);
  const requestUrl = `${domain}/users/${user_id}/conversations`
  console.log("request url: for getUserConversation", requestUrl);
  const requestOptions = {
    headers: {
      Authorization: 'Bearer <%= iparam.freshChat_key %>'
    },
  };
  $request.get(requestUrl, requestOptions).then(function (data) {
    let value = JSON.parse(data.response);
    console.log("getUserConversation info", value);
    let conversationArr = (value.conversations);
    console.log("data from getUserConversation=====>", (conversationArr));
    let valueMap = conversationArr.map((item) => (item.id));
    let result = valueMap.toString();
    console.log('Conversation ID =====>', result);

    let passData = {}
    passData.userId = user_id
    passData.content = message_content
    passData.conversationId = result
    console.log("passData: from getUserConversation", passData);
    getConversationDetails(passData, domain)

  }, function (err) {
    console.log('error message from search user =====>', err);
  });
}

function getConversationDetails(value, domain) {
  console.log("conversation Id", value);
  var conversation_id = value.conversationId
  console.log("conversation_id", conversation_id);
  console.log("conversation_id", conversation_id);
  const requestUrl = `${domain}/conversations/${conversation_id}`
  console.log("request url: for getUser", requestUrl);
  const requestOptions = {
    headers: {
      Authorization: 'Bearer <%= iparam.freshChat_key %>'
    },
  };
  $request.get(requestUrl, requestOptions).then(function (data) {
    let result = JSON.parse(data.response);
    console.log("this is from conversation details ", result);
    let passData = {}
    passData.userId = value.userId;
    passData.conversation_id = result.conversation_id
    passData.app_id = result.app_id
    passData.status = result.status
    passData.channel_id = result.channel_id
    passData.skill_id = result.skill_id
    passData.content = value.content
    // sendMessageToAgent(result, domain)

    createConversation(passData, domain)

  }, function (err) {
    console.log('error message from search user =====>', err);
  });
}

function createConversation(payload, domain) {

  console.log("value from conversation =====>", payload);
  const requestUrl = `${domain}/conversations`
  var headers = {
    "Authorization": 'Bearer <%= iparam.freshChat_key %>',
    "Content-Type": "application/json"
  };
  var reqData = {
    headers: headers,
    isOAuth: true,
    json: {
      "app_id": payload.app_id,
      "channel_id": payload.channel_id,
      "messages": [
        {
          "app_id": payload.app_id,
          "actor_type": "user",
          "actor_id": payload.userId,
          "channel_id": payload.channel_id,
          "message_type": "normal",
          "message_parts": [
            {
              "text": {
                "content": payload.content
              }
            }
          ]
        }
      ],
      "status": payload.status,
      "users": [
        {
          "id": payload.userId
        }
      ]
    }
  };
  $request.post(requestUrl, reqData).then(function (data, err) {
    if (err) {
      console.error('external event error', JSON.stringify(err));
    } else {
      console.log("Create Conversation response =====>", data.response);
      let result = data.response
      sendMessageToAgent(result, domain)

    }
  })

}

function sendMessageToAgent(payload, domain) {
  //
  let messagebodyArr = (payload.messages);
  console.log("data from sendMessageToAgent details=====>", (messagebodyArr));
  let conversationIdMap = messagebodyArr.map((item) => (item.conversation_id));
  let conversation_id = conversationIdMap.toString();
  console.log('Conversation ID =====>', conversation_id);

  let actorIdMap = messagebodyArr.map((item) => (item.actor_id));
  let actor_id = actorIdMap.toString();
  console.log('actor_id =====>', actor_id);

  let message_typeArr = messagebodyArr.map((item) => (item.message_type));
  message_type = message_typeArr.toString()
  console.log('message_type =====>', message_type);


  let messagePartsArr = messagebodyArr.map((item) => (item.message_parts));
  // message_parts = messagePartsArr.toString()
  // console.log('message_parts =====>', message_parts);

  let messageTextArr = messagePartsArr.map((item) => (item));
  console.log('message_text =====>', messageTextArr[0][0].text.content);
  message_text = messageTextArr[0][0].text.content

  //


  // console.log("value from conversation =====>", payload);
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
      "actor_id": actor_id,
      "message_type": message_type,
      "message_parts": [
        {
          "text": {
            "content": message_text
          }
        }
      ]
    }
  };
  $request.post(requestUrl, reqData).then(function (data, err) {
    if (err) {
      console.error('sendMessageToAgent error', JSON.stringify(err));
    } else {
      console.log("sendMessageToAgent =====>", data.response);
    }
  })
}

function receiveMessageFromAgent(payload, webhook_url) {

  let domain = webhook_url


  const requestUrl = `${domain}/messages`
  const requestOptions = {
    headers: {
      // Authorization: 'Bearer <%= iparam.freshChat_key %>'
    },
    json: {
      "user_key": "c0eUY5TATGz1",
      "sender_key": "3fd538ef7218a14a63e51ba47e83c76e1ff5ab62",
      "time": "1668429686816",
      "serial_number": "2914978254845711401",
      "type": "text",
      "content": "sandeza",
      "attachment": "sandeza.io",
      "extra": "product consultant"

    }
  };

  $request.post(requestUrl, requestOptions).then(function (data) {

    console.log('message sent', JSON.stringify(data));
    sendMessageToUser(payload)
  }, function (err) {
    console.log('Failed to send message - ', JSON.stringify(err));
  });
}

function sendMessageToUser(payload) {

  const requestUrl = `https://kakao-api.happytalk.io/v1/chat/write`
  const requestOptions = {
    headers: {
      "Content-Type": "application/json",
      "HT-Client-Id": payload.iparams.Kakao_Client_ID,
      "HT-Client-Secret": payload.iparams.Kakao_Client_Secret
    },
    json: {
      "user_key": "c0eUY5TATGz1",
      "sender_key": "3fd538ef7218a14a63e51ba47e83c76e1ff5ab62",
      "serial_number": "2912789790723111222",
      "message_type": "TX",
      "message": "from serverless application"
    }
  };

  $request.post(requestUrl, requestOptions).then(function (data) {

    console.log('message sent to user', JSON.stringify(data));
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
    try {
      const webhook = await generateTargetUrl();
      const options = {
        body: `{'webhook': ${webhook}}`,
        action: 'register'
      };
      const { response } = await $request.post(thirdPartyEndpoint + "/kakao", options);

      console.info('\n Webhook creation successful \n', webhook);
      console.info('\n Webhook Registration Successful \n', response);
      console.info('\n Hander received following payload when app is installed \n\n', payload);

      renderData();
    } catch (error) {
      console.error('Something went wrong. Webhook Registration has failed');
    }
  },
  /**
   * Handler for onAppUninstall event
   *
   * Get the webhook URL from data storage through $db that was stored during installation
   * Deregister the webhook from JIRA with the URL over REST API
   *
   * @param {object} args - payload
   */
  onAppUninstallCallback: function (args) {
    $db.get('jiraWebhookId').done(function (data) {
      $request.delete(
        data.url,
        {
          headers: {
            Authorization: "Basic " + util.getJiraKey(args)
          }
        }
      ).then(() => {
        renderData();
      }, error => {
        console.error('Failed to deregister the webhook');
        console.error(error);
        renderData({ message: 'Webhook deregistration failed' });
      });
    }).fail(function () {
      renderData({ message: 'Webhook deregistration failed' });
    });
  },
  // onExternalEventCallback: function (payload) {
  //   // let requestUrl = "thirdPartyEndpoint"
  //   // const payloadData = typeof payload.data === 'string' ? JSON.parse(payload.data) : payload.data;
  //   // if (payloadData.action === 'opened') {
  //   const response = $request.post(thirdPartyEndpoint,
  //     {
  //       // headers: {
  //       //   Authorization: '<%= encode(iparam.freshdesk_api_key) %>'
  //       // },

  //       json: {
  //         "user_key": payload.data.conversation.user_key,
  //         "sender_key": payload.data.conversation.sender_key,
  //         "time": payload.data.conversation.time,
  //         "serial_number": payload.data.conversation.serial_number,
  //         "type": payload.data.conversation.type,
  //         "content": payload.data.conversation.content,
  //         "attachment": payload.data.conversation.attachment,
  //         "extra": payload.data.conversation.extra
  //       },
  //       method: "POST"
  //     }).then(() => {
  //       console.log('Successfully created ticket in Freshdesk', response);
  //     }, error => {
  //       console.log('Error: Failed to create ticket in Freshdesk');
  //       console.log(error)
  //     })

  // },
  onExternalEventCallback: function (payload) {
    var domain = payload.iparams.freshchat_domain
    console.log("========this is external freshchat url=======", domain);

    var url = `${payload.iparams.webhook_url}/message`
    var headers = {
      // "Authorization": "Bearer <%= access_token %>",
      "Content-Type": "application/json"
    };
    var reqData = {
      headers: headers,
      isOAuth: true,
      json: {
        "user_key": payload.data.conversation.user_key,
        "sender_key": payload.data.conversation.sender_key,
        "time": payload.data.conversation.time,
        "serial_number": payload.data.conversation.serial_number,
        "type": payload.data.conversation.type,
        "content": payload.data.conversation.content,
        "attachment": payload.data.conversation.attachment,
        "extra": payload.data.conversation.extra
      }
    };
    $request.post(url, reqData).then(function (data, err) {
      if (err) {
        console.error('external event error', JSON.stringify(err));
      } else {
        console.log("External event data =====>", data.response);
        var contact = data.response;
        console.log("contact:", contact);
        let passData = {}
        passData.user_key = payload.data.conversation.user_key
        passData.sender_key = payload.data.conversation.sender_key
        passData.serial_number = payload.data.conversation.serial_number
        passData.type = payload.data.conversation.type
        passData.content = payload.data.conversation.content
        passData.attachment = payload.data.conversation.attachment
        passData.extra = payload.data.conversation.extra
        searchUser(passData, domain);
      }
    })
    // .then(function (data) {
    //   // console.log("searchUser data =====", data);
    //   // var contact = JSON.parse(data.response);
    //   // searchUser(contact.user_key);
    // }, function (err) {
    //   console.error('Contact fetching failed from Hubspot.', JSON.stringify(err));
    // });
    // .then(function (data) {
    //   var contact = JSON.parse(data.response);
    //   createFreshdeskContact(args.iparams.freshdesk_domain,
    //     contact.properties.firstname.value,
    //     contact.properties.email.value,
    //     contact.properties.jobtitle.value);
    // }, function (err) {
    //   console.error('Contact fetching failed from Hubspot.', JSON.stringify(err));
    // });
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
      // let result = JSON.parse(data.response);
      console.log("user created with id ", data.response);

    }, function (err) {
      console.log('error message from search user =====>', err);
    });
  },
  onMessageCreateCallback: async function (payload) {
    let webhook_url = payload.iparams.webhook_url
    console.log("this is webhook url", webhook_url);
    var domain = payload.iparams.freshchat_domain
    let conversation_id = payload.conversation_id
    const requestUrl = `${domain}/conversations/${conversation_id}/messages`
    console.log("onmessage create callback", requestUrl);

    var headers = {
      "Authorization": 'Bearer <%= iparam.freshChat_key %>',
    };
    const requestOptions = {
      headers: headers,
      isOAuth: true,
      json: {
        "actor_type": payload.actor_type,
        "actor_id": payload.actor_id,
        "message_type": payload.message_type,
        "message_parts": [
          {
            "text": {
              "content": "payload.message_parts.text.content"
            }

          }
        ]
      }
    };
    // console.log("onmessage create callback", headers);
    // console.log("onmessage create callback", requestOptions);
    $request.post(requestUrl, requestOptions).then(function (data, err) {
      if (err) {
        console.error('external event error', JSON.stringify(err));
      } else {
        console.log("on message create response =====>", data.response);
        receiveMessageFromAgent(payload, webhook_url)
      }
    })
    // .then(function (data) {
    // }, function (err) {
    //   console.error('Contact fetching failed from Hubspot.', JSON.stringify(err));
    // })
  }
};



// onMessageCreateCallback: async function (payload) {
//   var kakaoUrl = `https://kakao-api.happytalk.io/v1/chat/write`
//   var headers = {
//     "Content-Type": "application/json",
//     "HT-Client-Id": payload.iparams.Kakao_Client_ID,
//     "HT-Client-Secret": payload.iparams.Kakao_Client_Secret
//   };
//   var reqData = {
//     headers: headers,
//     // isOAuth: true,
//     json: {
//       "user_key": "c0eUY5TATGz1",
//       // "user_key": payload.data.conversation.user_key,
//       // "sender_key": payload.data.conversation.sender_key,
//       // "serial_number": payload.data.conversation.serial_number,
//       // "time": payload.data.conversation.time,
//       // "message_type": payload.data.conversation.type,
//       // "message": payload.data.conversation.content,
//       "sender_key": "3fd538ef7218a14a63e51ba47e83c76e1ff5ab62",
//       "serial_number": "2912789790723111023",
//       "message_type": "TX",
//       "message": "HI from serverless app",
//       // "attachment": payload.data.conversation.attachment,
//       // "extra": payload.data.conversation.extra
//     }
//   };
//   await $request.post(kakaoUrl, reqData).then(function (data, err) {
//     if (err) {
//       console.error('Contact creation in HubSpot failed.', JSON.stringify(err), reqData);
//     } else {
//       console.log("this is the data from external event", data, JSON.stringify(reqData), headers);
//     }
//   })
//   // .then(function (data) {
//   // }, function (err) {
//   //   console.error('Contact fetching failed from Hubspot.', JSON.stringify(err));
//   // })
// }

