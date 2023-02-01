/* global app, client, utils */
app.initialized().then(
 function (_client) {
  //If successful, register the app activated and deactivated event callback.
  window.client = _client;
 },
 function (error) {
  //If unsuccessful
  console.log(error);
 }
);

let channelsUrl = 'https://manufacturingverticalsandbox.freshchat.com/v2/channels'
let groupsUrl = 'https://manufacturingverticalsandbox.freshchat.com/v2/groups'

const requestOptions = {
 headers: {
  Authorization: 'Bearer eyJraWQiOiJjdXN0b20tb2F1dGgta2V5aWQiLCJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmcmVzaGNoYXQiLCJzdWIiOiI5MTNlYmExYS02MDU2LTRiOTAtOTA0Mi04N2YwODg2OTM1OWMiLCJjbGllbnRJZCI6ImZjLTFiOWYxM2IzLTNkMmItNDRlNy04MWRmLTA1OTdiMDFjYzY0ZSIsInNjb3BlIjoiYWdlbnQ6cmVhZCBhZ2VudDpjcmVhdGUgYWdlbnQ6dXBkYXRlIGFnZW50OmRlbGV0ZSBjb252ZXJzYXRpb246Y3JlYXRlIGNvbnZlcnNhdGlvbjpyZWFkIGNvbnZlcnNhdGlvbjp1cGRhdGUgbWVzc2FnZTpjcmVhdGUgbWVzc2FnZTpnZXQgYmlsbGluZzp1cGRhdGUgcmVwb3J0czpmZXRjaCByZXBvcnRzOmV4dHJhY3QgcmVwb3J0czpyZWFkIHJlcG9ydHM6ZXh0cmFjdDpyZWFkIGFjY291bnQ6cmVhZCBkYXNoYm9hcmQ6cmVhZCB1c2VyOnJlYWQgdXNlcjpjcmVhdGUgdXNlcjp1cGRhdGUgdXNlcjpkZWxldGUgb3V0Ym91bmRtZXNzYWdlOnNlbmQgb3V0Ym91bmRtZXNzYWdlOmdldCBtZXNzYWdpbmctY2hhbm5lbHM6bWVzc2FnZTpzZW5kIG1lc3NhZ2luZy1jaGFubmVsczptZXNzYWdlOmdldCBtZXNzYWdpbmctY2hhbm5lbHM6dGVtcGxhdGU6Y3JlYXRlIG1lc3NhZ2luZy1jaGFubmVsczp0ZW1wbGF0ZTpnZXQgZmlsdGVyaW5ib3g6cmVhZCBmaWx0ZXJpbmJveDpjb3VudDpyZWFkIHJvbGU6cmVhZCBpbWFnZTp1cGxvYWQiLCJpc3MiOiJmcmVzaGNoYXQiLCJ0eXAiOiJCZWFyZXIiLCJleHAiOjE5ODM0Mzg4NTQsImlhdCI6MTY2NzgxOTY1NCwianRpIjoiZDg2NWY2M2MtY2NlNi00OTdhLWIwYTctNGUzZmNiNjRmMjgxIn0.sQ2RnTMvAwmE79f7lUirUq43kB-QShM3gXhNUMbGDcU'
 },
};
function chennalList() {
 var p = new Promise((resolve, reject) => {
  client.request.get(channelsUrl, requestOptions).then(
   (data) => {
    console.log("this is data", data);
    let channelList = JSON.parse(data.response);
    console.log("channel", channelList.channels);
    let allChannel = channelList.channels

    var channelNames = [];
    console.log("ss", channelNames);

    for (let i = 0; i < allChannel.length; i++) {
     console.log(allChannel[i].name);
     // channelNames.push(allChannel[i].name);
     channelNames.push({ name: allChannel[i].name, id: allChannel[i].id });
    }

    resolve(channelNames);
    utils.set('channel_list', { values: channelNames, label: 'channel list' });
   }

  )
 });

}


function groupList() {
 var p = new Promise((resolve, reject) => {
  client.request.get(groupsUrl, requestOptions).then(
   (data) => {
    console.log("this is data", data);
    let groupList = JSON.parse(data.response);
    console.log("channel", groupList.groups);
    let allGroup = groupList.groups

    var groupNames = [];
    console.log("ss", groupNames);

    for (let i = 0; i < allGroup.length; i++) {
     console.log(allGroup[i].name);
     groupNames.push({ name: allGroup[i].name, id: allGroup[i].id });
    }

    resolve(groupNames);
    utils.set('group_list', { values: groupNames, label: 'Group List' });
   }

  )
 });

}















let freshChatKey = 'eyJraWQiOiJjdXN0b20tb2F1dGgta2V5aWQiLCJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmcmVzaGNoYXQiLCJzdWIiOiI5MTNlYmExYS02MDU2LTRiOTAtOTA0Mi04N2YwODg2OTM1OWMiLCJjbGllbnRJZCI6ImZjLTFiOWYxM2IzLTNkMmItNDRlNy04MWRmLTA1OTdiMDFjYzY0ZSIsInNjb3BlIjoiYWdlbnQ6cmVhZCBhZ2VudDpjcmVhdGUgYWdlbnQ6dXBkYXRlIGFnZW50OmRlbGV0ZSBjb252ZXJzYXRpb246Y3JlYXRlIGNvbnZlcnNhdGlvbjpyZWFkIGNvbnZlcnNhdGlvbjp1cGRhdGUgbWVzc2FnZTpjcmVhdGUgbWVzc2FnZTpnZXQgYmlsbGluZzp1cGRhdGUgcmVwb3J0czpmZXRjaCByZXBvcnRzOmV4dHJhY3QgcmVwb3J0czpyZWFkIHJlcG9ydHM6ZXh0cmFjdDpyZWFkIGFjY291bnQ6cmVhZCBkYXNoYm9hcmQ6cmVhZCB1c2VyOnJlYWQgdXNlcjpjcmVhdGUgdXNlcjp1cGRhdGUgdXNlcjpkZWxldGUgb3V0Ym91bmRtZXNzYWdlOnNlbmQgb3V0Ym91bmRtZXNzYWdlOmdldCBtZXNzYWdpbmctY2hhbm5lbHM6bWVzc2FnZTpzZW5kIG1lc3NhZ2luZy1jaGFubmVsczptZXNzYWdlOmdldCBtZXNzYWdpbmctY2hhbm5lbHM6dGVtcGxhdGU6Y3JlYXRlIG1lc3NhZ2luZy1jaGFubmVsczp0ZW1wbGF0ZTpnZXQgZmlsdGVyaW5ib3g6cmVhZCBmaWx0ZXJpbmJveDpjb3VudDpyZWFkIHJvbGU6cmVhZCBpbWFnZTp1cGxvYWQiLCJpc3MiOiJmcmVzaGNoYXQiLCJ0eXAiOiJCZWFyZXIiLCJleHAiOjE5ODM0Mzg4NTQsImlhdCI6MTY2NzgxOTY1NCwianRpIjoiZDg2NWY2M2MtY2NlNi00OTdhLWIwYTctNGUzZmNiNjRmMjgxIn0.sQ2RnTMvAwmE79f7lUirUq43kB-QShM3gXhNUMbGDcU'

/* Using the iparam callback function, we are validating the iparam value after a third-party API call. */
/* Payload and other options can be specified using ‘options’. */
// function chennalList() {
//  const requestOptions = {
//   headers: {
//    Authorization: 'Bearer <%= iparam.freshChat_key %>'
//   },
//  };
//  $request.get(requestUrl, requestOptions).then(function (data) {
//   console.log("this is whole data from searchUser==1", data);
//   let result = JSON.parse(data.response);
//   console.log("this is whole result from searchUser==1", result);

//   console.log('result.users =====> 1', result.users);

//   fetch(channelsUrl, {
//    headers: {
//     Authorization: `Bearer ${freshChatKey}`
//    }
//   })
//    .then(response => {
//     if (response.ok) {
//      return response.json();
//     } else if (response.status === 404) {
//      throw new Error("Not Found");
//     } else {
//      throw new Error(response.statusText);
//     }
//    })
//    .then(data => {
//     const channels = data.channels;
//     let groupNames = [];
//     for (let i = 0; i < channels.length; i++) {
//      channelNames.push(channels[i].name);
//     }
//     return channelNames
//    })
//    .catch(error => {
//     console.log(error.message);
//    });

//   utils.set('channel_list', { values: [channelNames], label: 'Channel List changes' });
//  }}
// chennalList()



// function chennalList(arg) {
//  utils.set('channel_list', { values: ["Travelling", "Swimming", "Readingbooks", "baseball"], label: 'Channel List changes' });
// }