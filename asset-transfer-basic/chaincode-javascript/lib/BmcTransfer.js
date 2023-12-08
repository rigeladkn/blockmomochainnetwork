'use strict';

// Deterministic JSON.stringify()
const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');
const Transfert = require('./models/Transfert');

class BmcTransfer extends Contract {
    //create transfert
    async createTransfert(ctx,transfert){
        transfert = JSON.parse(transfert);
        const asset = new Transfert(transfert);
        console.log(asset.toString());
        let result = await ctx.stub.putState(asset.transactionId, Buffer.from(JSON.stringify(asset)));
        return JSON.stringify({
            success : true,
            transfert : result
        });
    }  

    //create or update soldes
    async createOrUpdateBalance(ctx,soldes){
        try {
            soldes = JSON.parse(soldes);
            console.log(soldes.toString());
            var i = 0;
            var result = null;
        
            soldes.forEach(async (element) => { 
                // let result = await ctx.stub.getState('BALANCE' + element(transactionId), Buffer.from(JSON.stringify(asset)));
                const asset = this.queryBalanceByUserId(element['userId']);
                console.log('FOUNDED BALANCE = ' + asset.toString());
                if(asset.length == 0){
                    //create balance
                    element['docType'] = 'balance';
                    result = await ctx.stub.putState('BALANCE' + element['userId'], Buffer.from(JSON.stringify(element)));
                }
                else{
                    // update balance
                    // overwriting original asset with new asset
                    const updatedAsset = {
                        docType: 'balance',
                        userId: element['userId'],
                        amount: element['amount'],
                    };
                    result = ctx.stub.putState('BALANCE' + updatedAsset.userId, Buffer.from(JSON.stringify(updatedAsset)));
                }
            });
            return JSON.stringify({
                success : true,
            });
        } catch (error) {
            return JSON.stringify({
                success : false,
            });
        }
    }  


    async queryBalanceByUserId(ctx, userId) {
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'balance';
        queryString.selector.userId = userId;
        const buffer = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        let asset = JSON.parse(buffer.toString());
        return this.fetchLimitedFields(asset);
    }

    // async assetExists(ctx, userId) {
    //     const buffer = await ctx.stub.getState(doctorId);
    //     return (!!buffer && buffer.length > 0);
    // }

    fetchLimitedFields = (asset, includeTimeStamp = false) => {
        const asset1 = [];
        for (let i = 0; i < asset.length; i++) {
            const obj = asset[i];
            if (obj.Record.docType == 'balance'){
                asset[i] = {
                    userId : obj.Record.userId,
                    amount: obj.Record.amount, 
                };
                asset1.push(asset[i]);
            }
        }

        return asset1;
    };

}

module.exports = BmcTransfer;