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

// function validateClientId() {
//   let clientId = utils.get('Kakao_Client_ID')
//   var patt1 = new RegExp(/[A-Za-z0-9]+/i)
//   return patt1.test(clientId) ? '' : 'Please enter a valid Client ID'
// }

// function validateClientSecret() {
//   let clientSecret = utils.get('Kakao_Client_Secret')
//   var patt1 = new RegExp(/[A-Za-z0-9]+/i)
//   return patt1.test(clientSecret) ? '' : 'Please enter a valid Client Secret'
// }

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

let errorElement = document.querySelector('.error-message')
// let warningElement = document.querySelector('.warning-message')
let fc_freshchat_domain = document.querySelector('#freshchat_domain')

let fc_freshChat_key = document.querySelector('#freshChat_key')
let fc_freshchat_app_id = document.querySelector('#freshchat_app_id')
var freshchatAppIdPattern = new RegExp(/([A-Za-z0-9]+(-[A-Za-z0-9]+)+)/i)

fc_freshchat_app_id.addEventListener('blur', (e) => {
  let value = e.target.value
  let isValid = freshchatAppIdPattern.test(value)

  // if (isValid) {
  //   console.log('Input value is valid')
  //   // const warningElement = document.querySelector('.warning-message')
  //   if (errorElement) {
  //     errorElement.remove()
  //     errorElement = null
  //   }

  //   // Do something if the input value is valid
  // } else {
  //   console.log('Enter a valid Freshchat APP ID')
  //   // Do something if the input value is invalid
  //   if (!errorElement) {
  //     errorElement = document.createElement('p')
  //     errorElement.innerHTML = 'Enter a valid Freshchat APP ID'
  //     errorElement.style.color = 'red'
  //     errorElement.classList.add('error-message') // Add a class to the error element for easy identification

  //     // Prepend the error element to the top of the document body
  //     document.body.insertBefore(errorElement, document.body.firstChild)
  //   }
  // }

  if (isValid) {
    console.log('Input value is valid')
    // Do something if the input value is valid
  } else {
    // Display a pop-up notification
    const notification = document.createElement('div')
    notification.textContent = 'Warning: Enter a valid Freshchat APP ID'
    notification.style.backgroundColor = 'yellow'
    notification.style.position = 'fixed'
    notification.style.top = '10px'
    notification.style.left = '50%'
    notification.style.transform = 'translateX(-50%)'
    notification.style.padding = '10px'
    notification.style.border = '1px solid #ccc'
    notification.style.borderRadius = '5px'
    notification.style.zIndex = '9999'
    notification.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.2)'

    document.body.appendChild(notification)

    // Remove the notification after a certain time (e.g., 5 seconds)
    setTimeout(() => {
      notification.remove()
    }, 3000) // 5000 milliseconds (5 seconds)
  }
})
// let fc_Kakao_Client_ID = document.querySelector('#Kakao_Client_ID')
// var kakaoClientIdPattern = new RegExp(/[A-Za-z0-9]+/i)

// fc_Kakao_Client_ID.addEventListener('blur', (e) => {
//   let value = e.target.value
//   let isValid = kakaoClientIdPattern.test(value)

//   // if (isValid) {
//   //   console.log('Input value is valid')
//   //   // const warningElement = document.querySelector('.warning-message')
//   //   if (errorElement) {
//   //     errorElement.remove()
//   //     errorElement = null
//   //   }

//   //   // Do something if the input value is valid
//   // } else {
//   //   console.log('Enter a valid Freshchat APP ID')
//   //   // Do something if the input value is invalid
//   //   if (!errorElement) {
//   //     errorElement = document.createElement('p')
//   //     errorElement.innerHTML = 'Enter a valid ID for the Kakao Client'
//   //     errorElement.style.color = 'red'
//   //     errorElement.classList.add('error-message') // Add a class to the error element for easy identification

//   //     // Prepend the error element to the top of the document body
//   //     document.body.insertBefore(errorElement, document.body.firstChild)
//   //   }
//   // }

//   if (isValid) {
//     console.log('Input value is valid')
//     // Do something if the input value is valid
//   } else {
//     // Display a pop-up notification
//     const notification = document.createElement('div')
//     notification.textContent = 'Warning: Enter a valid ID for the Kakao Client'
//     notification.style.backgroundColor = 'yellow'
//     notification.style.position = 'fixed'
//     notification.style.top = '10px'
//     notification.style.left = '50%'
//     notification.style.transform = 'translateX(-50%)'
//     notification.style.padding = '10px'
//     notification.style.border = '1px solid #ccc'
//     notification.style.borderRadius = '5px'
//     notification.style.zIndex = '9999'
//     notification.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.2)'

//     document.body.appendChild(notification)

//     // Remove the notification after a certain time (e.g., 5 seconds)
//     setTimeout(() => {
//       notification.remove()
//     }, 3000) // 5000 milliseconds (5 seconds)
//   }
// })

// let fc_Kakao_Client_Secret = document.querySelector('#Kakao_Client_Secret')
// var kakaoClientSecretPattern = new RegExp(/[A-Za-z0-9]+/i)

// fc_Kakao_Client_Secret.addEventListener('blur', (e) => {
//   let value = e.target.value
//   let isValid = kakaoClientSecretPattern.test(value)

//   // if (isValid) {
//   //   console.log('Input value is valid')
//   //   // const warningElement = document.querySelector('.warning-message')
//   //   if (errorElement) {
//   //     errorElement.remove()
//   //     errorElement = null
//   //   }

//   //   // Do something if the input value is valid
//   // } else {
//   //   const notification = document.createElement('div')
//   //   notification.textContent =
//   //     'Warning: Enter a valid Secret for the Kakao Client'
//   //   notification.style.backgroundColor = 'yellow'
//   //   notification.style.position = 'fixed'
//   //   notification.style.top = '10px'
//   //   notification.style.left = '50%'
//   //   notification.style.transform = 'translateX(-50%)'
//   //   notification.style.padding = '10px'
//   //   notification.style.border = '1px solid #ccc'
//   //   notification.style.borderRadius = '5px'
//   //   notification.style.zIndex = '9999'
//   //   notification.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.2)'

//   //   document.body.appendChild(notification)

//   //   // Remove the notification after a certain time (e.g., 5 seconds)
//   //   setTimeout(() => {
//   //     notification.remove()
//   //   }, 3000) // 5000 milliseconds (5 seconds)
//   //   // console.log('Enter a valid Freshchat APP ID')
//   //   // // Do something if the input value is invalid
//   //   // if (!errorElement) {
//   //   //   errorElement = document.createElement('p')
//   //   //   errorElement.innerHTML = 'Enter a valid Secret for the Kakao Client'
//   //   //   errorElement.style.color = 'red'
//   //   //   errorElement.classList.add('error-message') // Add a class to the error element for easy identification

//   //   //   // Prepend the error element to the top of the document body
//   //   //   document.body.insertBefore(errorElement, document.body.firstChild)
//   //   // }
//   // }

//   if (isValid) {
//     console.log('Input value is valid')
//     // Do something if the input value is valid
//   } else {
//     // Display a pop-up notification
//     const notification = document.createElement('div')
//     notification.textContent =
//       'Warning: Enter a valid Secret for the Kakao Client'
//     notification.style.backgroundColor = 'yellow'
//     notification.style.position = 'fixed'
//     notification.style.top = '10px'
//     notification.style.left = '50%'
//     notification.style.transform = 'translateX(-50%)'
//     notification.style.padding = '10px'
//     notification.style.border = '1px solid #ccc'
//     notification.style.borderRadius = '5px'
//     notification.style.zIndex = '9999'
//     notification.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.2)'

//     document.body.appendChild(notification)

//     // Remove the notification after a certain time (e.g., 5 seconds)
//     setTimeout(() => {
//       notification.remove()
//     }, 3000) // 5000 milliseconds (5 seconds)
//   }
// })
let fc_Kakao_Account_Id = document.querySelector('#Kakao_Account_Id')
var kakaoAccountIdPattern = new RegExp(/@[A-Za-z]+[0-9]+/i)

fc_Kakao_Account_Id.addEventListener('blur', (e) => {
  let value = e.target.value
  let isValid = kakaoAccountIdPattern.test(value)

  // if (isValid) {
  //   console.log('Input value is valid')
  //   // const warningElement = document.querySelector('.warning-message')
  //   if (errorElement) {
  //     errorElement.remove()
  //     errorElement = null
  //   }

  //   // Do something if the input value is valid
  // } else {
  //   console.log('Enter a valid Freshchat APP ID')
  //   // Do something if the input value is invalid
  //   if (!errorElement) {
  //     errorElement = document.createElement('p')
  //     errorElement.innerHTML =
  //       'Enter a valid Id for the business’s Channel on Kakao'
  //     errorElement.style.color = 'red'
  //     errorElement.classList.add('error-message') // Add a class to the error element for easy identification

  //     // Prepend the error element to the top of the document body
  //     document.body.insertBefore(errorElement, document.body.firstChild)
  //   }
  // }

  if (isValid) {
    console.log('Input value is valid')
    // Do something if the input value is valid
  } else {
    // Display a pop-up notification
    const notification = document.createElement('div')
    notification.textContent =
      'Warning: Enter a valid Id for the business’s Channel on Kakao'
    notification.style.backgroundColor = 'yellow'
    notification.style.position = 'fixed'
    notification.style.top = '10px'
    notification.style.left = '50%'
    notification.style.transform = 'translateX(-50%)'
    notification.style.padding = '10px'
    notification.style.border = '1px solid #ccc'
    notification.style.borderRadius = '5px'
    notification.style.zIndex = '9999'
    notification.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.2)'

    document.body.appendChild(notification)

    // Remove the notification after a certain time (e.g., 5 seconds)
    setTimeout(() => {
      notification.remove()
    }, 3000) // 5000 milliseconds (5 seconds)
  }
})
let fc_Kakao_Sender_Key = document.querySelector('#Kakao_Sender_Key')
var kakaoSenderKeyPattern = new RegExp(/([0-9]+([A-Za-z]+[0-9]+)+)/i)

fc_Kakao_Sender_Key.addEventListener('blur', (e) => {
  let value = e.target.value
  let isValid = kakaoSenderKeyPattern.test(value)

  // if (isValid) {
  //   console.log('Input value is valid')
  //   // const warningElement = document.querySelector('.warning-message')
  //   if (errorElement) {
  //     errorElement.remove()
  //     errorElement = null
  //   }

  //   // Do something if the input value is valid
  // } else {
  //   console.log('Enter a valid Freshchat APP ID')
  //   // Do something if the input value is invalid
  //   if (!errorElement) {
  //     errorElement = document.createElement('p')
  //     errorElement.innerHTML = 'Enter a valid Kakao Channel chat entity/user'
  //     errorElement.style.color = 'red'
  //     errorElement.classList.add('error-message') // Add a class to the error element for easy identification

  //     // Prepend the error element to the top of the document body
  //     document.body.insertBefore(errorElement, document.body.firstChild)
  //   }
  // }

  if (isValid) {
    console.log('Input value is valid')
    // Do something if the input value is valid
  } else {
    // Display a pop-up notification
    const notification = document.createElement('div')
    notification.textContent =
      'Warning: Enter a valid Kakao Channel chat entity/user'
    notification.style.backgroundColor = 'yellow'
    notification.style.position = 'fixed'
    notification.style.top = '10px'
    notification.style.left = '50%'
    notification.style.transform = 'translateX(-50%)'
    notification.style.padding = '10px'
    notification.style.border = '1px solid #ccc'
    notification.style.borderRadius = '5px'
    notification.style.zIndex = '9999'
    notification.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.2)'

    document.body.appendChild(notification)

    // Remove the notification after a certain time (e.g., 5 seconds)
    setTimeout(() => {
      notification.remove()
    }, 3000) // 5000 milliseconds (5 seconds)
  }
})
const btnVerify = document.querySelector('#btnVerify')
// let channel_list = document.querySelector('.channel_list')

var fc_channel_list = document.getElementById('channel_list')

const requestOptions = {
  headers: {
    Authorization: `Bearer btoa(freshChat_key.value)`,
  },
}

fc_channel_list.addEventListener('click', (event) => {
  var channelsUrl = `${freshchat_domain.value}/v2/channels`
  const requestOptions = {
    headers: {
      Authorization: `Bearer ${freshChat_key.value}`,
    },
  }
  var p = new Promise((resolve, reject) => {
    client.request.get(channelsUrl, requestOptions).then((data) => {
      let channelList = JSON.parse(data.response)
      let allChannels = channelList.channels
      let channelOptions = allChannels.map((channel) => ({
        text: channel.name,
        value: channel.id,
      }))
      resolve(channelOptions)
    })
  })

  p.then((options) => {
    channel_list.options = options
  })
})

let fc_group_list = document.getElementById('group_list')

fc_group_list.addEventListener('click', (event) => {
  var groupUrl = `${freshchat_domain.value}/v2/groups`
  const requestOptions = {
    headers: {
      Authorization: `Bearer ${freshChat_key.value}`,
    },
  }
  var p = new Promise((resolve, reject) => {
    client.request.get(groupUrl, requestOptions).then((data) => {
      console.log(data)
      let groupList = JSON.parse(data.response)
      console.log('groupList', groupList)

      let allGroups = groupList.groups
      let groupOptions = allGroups.map((group) => ({
        text: group.name,
        value: group.id,
      }))
      resolve(groupOptions)
    })
  })

  p.then((options) => {
    group_list.options = options
  })
})

function postConfigs() {
  return {
    __meta: {
      secure: ['freshChat_key', 'Kakao_Client_Secret', 'Kakao_Sender_Key'],
    },
    freshchat_domain: fc_freshchat_domain.value,
    freshChat_key: fc_freshChat_key.value,
    freshchat_app_id: fc_freshchat_app_id.value,
    // Kakao_Client_ID: fc_Kakao_Client_ID.value,
    // Kakao_Client_Secret: fc_Kakao_Client_Secret.value,
    Kakao_Account_Id: fc_Kakao_Account_Id.value,
    Kakao_Sender_Key: fc_Kakao_Sender_Key.value,
    channel_list: fc_channel_list.value,
    group_list: fc_group_list.value,
  }
}

function getConfigs(configs) {
  let {
    freshchat_domain,
    freshChat_key,
    freshchat_app_id,
    Kakao_Client_ID,
    Kakao_Client_Secret,
    Kakao_Account_Id,
    Kakao_Sender_Key,
    channel_list,
    group_list,
  } = configs
  fc_freshchat_domain.value = freshchat_domain
  fc_freshChat_key.value = freshChat_key
  fc_freshchat_app_id.value = freshchat_app_id
  // fc_Kakao_Client_ID.value = Kakao_Client_ID
  // fc_Kakao_Client_Secret.value = Kakao_Client_Secret
  fc_Kakao_Account_Id.value = Kakao_Account_Id
  fc_Kakao_Sender_Key.value = Kakao_Sender_Key
  fc_channel_list.value = channel_list
  fc_group_list.value = group_list
  return
}

let verified = false
async function verify() {
  try {
    var response = await client.request.get(
      `${freshchat_domain.value}/v2/accounts/configuration`,
      {
        headers: {
          Authorization: `Bearer ${freshChat_key.value}`,
          'Content-Type': 'application/json',
        },
      }
    )

    console.log('response', response.status)
    var { status } = response
    console.log('response', status)

    if (status == 200) {
      alert('Verified Successfully')
      verified = true
    }
  } catch (error) {
    console.error('Error: Failed to validate the API key')
    console.error(error)
    if (status == 401) {
      console.error('Error: Domain or API key is invalid')
    }
  }
}

async function validate() {
  return verified
}

document.onreadystatechange = function () {
  if (document.readyState === 'interactive') renderApp()
  async function renderApp() {
    try {
      let client = await app.initialized()
      window.client = client

      btnVerify.addEventListener('fwClick', verify)
    } catch (error) {
      return console.error(error)
    }
  }
}
