// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

// window.fbAsyncInit = function() {
// 	FB.init({
// 	  appId            : '1012313435802179',
// 	  autoLogAppEvents : true,
// 	  xfbml            : true,
// 	  version          : 'v5.0'
// 	});
// };

// async defer src="https://connect.facebook.net/en_US/sdk.js"

// FB.login(function(response) {
//   if (response.authResponse) {
//     console.log('Welcome!  Fetching your information.... ');
//     FB.api('/me', function(response) {
//       console.log('Good to see you, ' + response.name + '.');
//     });
//   } else {
//     console.log('User cancelled login or did not fully authorize.');
//   }
// });



$( "#changeColor" ).click(function() {
	$(document).ready(function () {
	$.get('https://www.facebook.com/v5.0/dialog/oauth?\
		client_id=592631274613367\
		&redirect_uri={"https://www.facebook.com/connect/login_success.html"}\
		&state={"st=state123abc,ds=123456789"}')
	});
});

let changeColor = document.getElementById('changeColor');
chrome.storage.sync.get('color', function(data) {
	changeColor.style.backgroundColor = data.color;
	changeColor.setAttribute('value', data.color);
});
