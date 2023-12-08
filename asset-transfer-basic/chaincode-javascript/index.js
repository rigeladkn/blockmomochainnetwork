/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const assetTransfer = require('./lib/assetTransfer');
const BmcTransfer = require('./lib/BmcTransfer');


module.exports.AssetTransfer = assetTransfer;
module.exports.BmcTransfer = BmcTransfer;
module.exports.contracts = [assetTransfer,BmcTransfer];
