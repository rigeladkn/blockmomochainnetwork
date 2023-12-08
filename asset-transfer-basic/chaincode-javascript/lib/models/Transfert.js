class Transfert {
    constructor(json){
        this.sender = json.sender;
        this.receiver = json.receiver;
        this.amount = json.amount;
        this.transactionId = json.transactionId;
        this.status = json.status;
        this.type = json.type;
        this.relaunchedTime = json.relaunchedTime;
        this.resolvedStatus = json.resolvedStatus;
    }
}

module.exports = Transfert;