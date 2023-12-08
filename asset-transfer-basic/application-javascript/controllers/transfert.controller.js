'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../../test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../../test-application/javascript/AppUtil.js');

const channelName = process.env.CHANNEL_NAME || 'mychannel';
const chaincodeName = process.env.CHAINCODE_NAME || 'basic';

const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'javascriptAppUser';
const asyncHandler = require("express-async-handler");
const { success } = require('fabric-shim');

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

const sendTransaction = asyncHandler(
    async function(req,res){
        try {
            const transfert = req.body;
            const ccp = buildCCPOrg1();
            const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
            const wallet = await buildWallet(Wallets, walletPath);
            const gateway = new Gateway();
            try {
                await gateway.connect(ccp, {
                    wallet,
                    identity: org1UserId,
                    discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
                });
                const network = await gateway.getNetwork(channelName);
                const contract = network.getContract(chaincodeName);
                console.log('\n--> Submit Transfert on the ledger');
                let result = await contract.submitTransaction('BmcTransfer:createTransfert',JSON.stringify(transfert));
                console.log('*** Result: committed ');
                console.log(`*** Result: ${prettyJSONString(result.toString())}`);
                res.status(200).json(result.success);
            } finally {
                gateway.disconnect();
            }
        } catch (error) {
            console.error(`******** FAILED to run the application: ${error}`);
            res.status(200).json(false);
            process.exit(1);
        }
    }
);
 

const updateSoldes = asyncHandler(
    async function(req,res){
        try {
            const soldes = req.body; //qrray of soldes
            const ccp = buildCCPOrg1();
            const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
            const wallet = await buildWallet(Wallets, walletPath);
            const gateway = new Gateway();
            try {
                await gateway.connect(ccp, {
                    wallet,
                    identity: org1UserId,
                    discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
                }); 
                const network = await gateway.getNetwork(channelName);
                const contract = network.getContract(chaincodeName);
                console.log('\n--> Submit Transfert on the ledger');
                let result = await contract.submitTransaction('BmcTransfer:createOrUpdateBalance',JSON.stringify(soldes));
                console.log('*** Result: committed ');
                console.log(`*** Result: ${prettyJSONString(result.toString())}`);
                res.status(200).json(result.success);
            } finally {
                gateway.disconnect();
            }
        } catch (error) {
            console.error(`******** FAILED to run the application: ${error}`);
            res.status(200).json(false);
            process.exit(1);
        }
    }
);




module.exports = {sendTransaction,updateSoldes}