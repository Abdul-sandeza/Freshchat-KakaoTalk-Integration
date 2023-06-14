/* global app, client, utils */
app.initialized().then(
  function (_client) {
    //If successful, register the app activated and deactivated event callback.

    window.client = _client
  },
  function (error) {
    //If unsuccessful
    console.log(error)
  }
)

function channalList() {
  let windows = window.client.context
  console.log('windows', windows)
  let payload = window.client.context.settings
  console.log('channelsUrl1', payload)

  let domain_name = utils.get('freshchat_domain')
  let api_key = utils.get('freshChat_key')
  try {
    console.log('a', domain_name, api_key)
  } catch (error) {
    console.log(error)
  }

  // try {
  //   const installed_parameters = await client.iparams.get()
  //   console.log(installed_parameters)
  // } catch (error) {
  //   console.error('Problem with retrieving Installation Parameters', error)
  // }

  var channelsUrl = `https://${domain_name}.freshchat.com/v2/channels`
  console.log('channelsUrl', channelsUrl)

  var requestOptions = {
    headers: {
      Authorization: `Bearer ${api_key}`,
    },
  }

  console.log('data----', channelsUrl, requestOptions)

  var p = new Promise((resolve, reject) => {
    client.request.get(channelsUrl, requestOptions).then((data) => {
      console.log('this is data', data)
      let channelList = JSON.parse(data.response)
      console.log('channel', channelList.channels)
      let allChannel = channelList.channels

      var channelNames = []
      console.log('ss', channelNames)

      for (let i = 0; i < allChannel.length; i++) {
        console.log(allChannel[i].name)
        // channelNames.push(allChannel[i].name);
        channelNames.push({ name: allChannel[i].name, id: allChannel[i].id })
      }
      console.log('this is channel names', channelNames)
      resolve(channelNames)
      utils.set('channel_list', {
        values: channelNames,
        label: 'Channel list',
        visible: true,
      })
    })
  })
}

function groupList() {
  let windows = window.client
  console.log('windows', windows)
  let payload = window.client.context.settings

  let domain_name = utils.get('freshchat_domain')
  let api_key = utils.get('freshChat_key')
  try {
    console.log('a', domain_name, api_key)
  } catch (error) {
    console.log(error)
  }

  // try {
  //   const installed_parameters = client.iparams.get()
  //   console.log(installed_parameters)
  // } catch (error) {
  //   console.error('Problem with retrieving Installation Parameters', error)
  // }

  var groupsUrl = `https://${domain_name}.freshchat.com/v2/groups`
  console.log('groupsUrl', groupsUrl)

  var requestOptions = {
    headers: {
      Authorization: `Bearer ${api_key}`,
    },
  }
  console.log('requestOptions', requestOptions)

  var p = new Promise((resolve, reject) => {
    client.request.get(groupsUrl, requestOptions).then((data) => {
      console.log('this is data', data)
      let groupList = JSON.parse(data.response)
      console.log('channel', groupList.groups)
      let allGroup = groupList.groups

      var groupNames = []
      console.log('ss', groupNames)

      for (let i = 0; i < allGroup.length; i++) {
        console.log(allGroup[i].name)
        groupNames.push({ name: allGroup[i].name, id: allGroup[i].id })
      }

      resolve(groupNames)
      utils.set('group_list', {
        values: groupNames,
        visible: groupNames,
        label: 'Group List',
      })
    })
  })
}

function validateAppId() {
  // let appId = utils.get('freshchat_app_id')
  var patt1 = new RegExp(/([A-Za-z0-9]+(-[A-Za-z0-9]+)+)/i)

  return patt1.test(freshchat_app_id) ? '' : 'Please enter a valid APP ID'
}

function validateClientId() {
  let clientId = utils.get('Kakao_Client_ID')
  var patt1 = new RegExp(/[A-Za-z0-9]+/i)
  return patt1.test(clientId) ? '' : 'Please enter a valid Client ID'
}

function validateClientSecret() {
  let clientSecret = utils.get('Kakao_Client_Secret')
  var patt1 = new RegExp(/[A-Za-z0-9]+/i)
  return patt1.test(clientSecret) ? '' : 'Please enter a valid Client Secret'
}

function validateAccountId() {
  let accountId = utils.get('Kakao_Account_Id')
  var patt1 = new RegExp(/@[A-Za-z]+[0-9]+/i)
  return patt1.test(accountId) ? '' : 'Please enter a valid Account Id'
}

function validateSecretKey() {
  let secretKey = utils.get('Kakao_Sender_Key')
  var patt1 = new RegExp(/([0-9]+([A-Za-z]+[0-9]+)+)/i)
  return patt1.test(secretKey) ? '' : 'Please enter a valid Secret Key'
}

// const channel = document.querySelector('.channel_list')
// const group = document.querySelector('.group_list')

// channel.addEventListener('fwOptionClick', function updLablOfDrpdwn() {
//   return dropdown.setAttribute('label', dropdown.value)
// })

// let channel_list = document.querySelector('.channel_list')

// // Clear existing options
// channel_list.innerHTML = ''

// // Fetch channels
// let channelURL = `https://manufacturingverticalsandbox.freshchat.com/v2/channels`
// const requestOptions = {
//   headers: {
//     Authorization: `Bearer eyJraWQiOiJjdXN0b20tb2F1dGgta2V5aWQiLCJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmcmVzaGNoYXQiLCJzdWIiOiI5MTNlYmExYS02MDU2LTRiOTAtOTA0Mi04N2YwODg2OTM1OWMiLCJjbGllbnRJZCI6ImZjLTFiOWYxM2IzLTNkMmItNDRlNy04MWRmLTA1OTdiMDFjYzY0ZSIsInNjb3BlIjoiYWdlbnQ6cmVhZCBhZ2VudDpjcmVhdGUgYWdlbnQ6dXBkYXRlIGFnZW50OmRlbGV0ZSBjb252ZXJzYXRpb246Y3JlYXRlIGNvbnZlcnNhdGlvbjpyZWFkIGNvbnZlcnNhdGlvbjp1cGRhdGUgbWVzc2FnZTpjcmVhdGUgbWVzc2FnZTpnZXQgYmlsbGluZzp1cGRhdGUgcmVwb3J0czpmZXRjaCByZXBvcnRzOmV4dHJhY3QgcmVwb3J0czpyZWFkIHJlcG9ydHM6ZXh0cmFjdDpyZWFkIGFjY291bnQ6cmVhZCBkYXNoYm9hcmQ6cmVhZCB1c2VyOnJlYWQgdXNlcjpjcmVhdGUgdXNlcjp1cGRhdGUgdXNlcjpkZWxldGUgb3V0Ym91bmRtZXNzYWdlOnNlbmQgb3V0Ym91bmRtZXNzYWdlOmdldCBtZXNzYWdpbmctY2hhbm5lbHM6bWVzc2FnZTpzZW5kIG1lc3NhZ2luZy1jaGFubmVsczptZXNzYWdlOmdldCBtZXNzYWdpbmctY2hhbm5lbHM6dGVtcGxhdGU6Y3JlYXRlIG1lc3NhZ2luZy1jaGFubmVsczp0ZW1wbGF0ZTpnZXQgZmlsdGVyaW5ib3g6cmVhZCBmaWx0ZXJpbmJveDpjb3VudDpyZWFkIHJvbGU6cmVhZCBpbWFnZTp1cGxvYWQiLCJpc3MiOiJmcmVzaGNoYXQiLCJ0eXAiOiJCZWFyZXIiLCJleHAiOjE5ODM0Mzg4NTQsImlhdCI6MTY2NzgxOTY1NCwianRpIjoiZDg2NWY2M2MtY2NlNi00OTdhLWIwYTctNGUzZmNiNjRmMjgxIn0.sQ2RnTMvAwmE79f7lUirUq43kB-QShM3gXhNUMbGDcU`,
//   },
// }

// fetch(channelURL, requestOptions)
//   .then((resp) => resp.json())
//   .then((data) => {
//     // Create new options based on data
//     data.forEach((channel) => {
//       let option = document.createElement('option')
//       option.value = channel.value
//       option.text = channel.text
//       channel_list.appendChild(option)
//     })
//   })
//   .catch((error) => console.log(error))
