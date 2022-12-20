'use strict';
/* Disclaimer: The use of mock servers in production environment is disallowed. pipedream.net can be used to debug or test your app's behavior locally.
    However, this will not work when the app is deployed in a live account. 
    We recommend switching to a custom mock server controlled by you in such scenarios. */

const thirdPartyEndpoint = 'https://eomt4pwuo6e17sl.m.pipedream.net/kakao';

exports = {
  // events: [
  //   { event: 'onAppInstall', callback: 'onInstallHandler' },
  //   { event: 'onAppUninstall', callback: 'onUninstallHandler' },
  //   { event: 'onExternalEvent', callback: 'onExternalEventHandler' }
  // ],
  onAppInstallCallback: async function (payload) {
    try {
      const webhook = await generateTargetUrl();
      const options = {
        body: `{'webhook': ${webhook}}`,
        action: 'register'
      };
      const { response } = await $request.post(thirdPartyEndpoint, options);

      console.info('\n Webhook creation successful \n', webhook);
      console.info('\n Webhook Registration Successful \n', response);
      console.info('\n Hander received following payload when app is installed \n\n', payload);

      renderData();
    } catch (error) {
      console.error('Something went wrong. Webhook Registration has failed');
    }
  },
  onAppUninstallCallback: async function (payload) {
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
    const { data } = payload;
    const { response } = $request.post(thirdPartyEndpoint + "/message", data.conversation);
    console.log("this is response", response);
    console.info('\n Desired action occured within 3rd party');
    console.info(' onExternalEventHandler invoked with following data: \n', data);
  }
};