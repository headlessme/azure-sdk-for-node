// 
// Copyright (c) Microsoft and contributors.  All rights reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// 
// See the License for the specific language governing permissions and
// limitations under the License.
// 

var fs = require('fs');
var azure = require('../../lib/azure');
var testCommon = require('./testcommon');

if (!fs.existsSync) {
  fs.existsSync = require('path').existsSync;
}

if (fs.existsSync('./testhost.json')) {
  inp = JSON.parse(fs.readFileSync('./testhost.json'));
} else {
  console.log('The file testhost.json was not found.\n' +
              'This is required and must specify the host, the subscription id, and the certificate file locations');
}

var svcmgmt = azure.createServiceManagementService(inp.subscriptionId, inp.auth, inp.hostopt);

var inputNames = {
  storageServicename: 'auxpreview181imagestore',
  badServicename: 'auxpreviewunknown'
};


svcmgmt.getStorageAccountKeys(inputNames.storageServicename, function(error, response) {
  if (error) {
    testCommon.showErrorResponse(error);
  } else {
    if (response && response.isSuccessful && response.body) {
      var rsp = response.body;
      console.log('URL = ' + rsp.Url);
      console.log('Primary = ' + rsp.StorageServiceKeys.Primary);
      console.log('Secondary = ' + rsp.StorageServiceKeys.Secondary);
    } else {
      console.log('Unexpected');
    }
  }
});

svcmgmt.getStorageAccountKeys(inputNames.badServicename, function(error, response) {
  if (error) {
    if (error.Code == 'ResourceNotFound') {
      console.log('Calling with bad storage service name: Received expected failure code');
    }
  } else {
    if (response && response.isSuccessful) {
      console.log('Calling with bad storage service name: Unexpected success');
    }
  }
});


