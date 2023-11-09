const { CommonClient } = require('../common/CommonClient');
const { Constants } = require('../common/Constants');
const { TextEncoder, TextDecoder } = require('text-encoding/lib/encoding')

class PatientClient extends CommonClient {
    constructor() {
        super(
            Constants.PATIENT_REGISTRY_TP_NAME, 
            Constants.PATIENT_REGISTRY_TP_CODE,
            Constants.PATIENT_REGISTRY_TP_VERSION
        );
    }

    getAddress(identifier) {
        var pref = this.hash(this.TP_NAME).substring(0, 6);
        var addr = this.hash(identifier).substring(0, 62);
        return pref + this.TP_CODE + addr;
    }

    async wrap_and_send(identifier, payload, address) {
        var enc = new TextEncoder('utf8');

        //TODO: encrypt payload

        var response = await this.infuraIPFSClient.add(payload);

        if (response.error) {
            return response;
        }

        //send object to blockchain like a string
        var new_payload = JSON.stringify({
            patient_id: identifier,
            ipfs_hash: response.hash,
            action: payload.action
        });

        var payloadBytes = enc.encode(new_payload);

        var txnHeaderBytes = this.make_txn_header_bytes(payloadBytes, address);
        var txnBytes = this.make_txn_bytes(txnHeaderBytes, payloadBytes);

        response = await this.saveDataInBlockchain('/batches', txnBytes);
        
        //TODO: validate if response has info

        return response;
    }

    async createPatient(identifier, payload) {
        payload['patient_id'] = identifier;
        payload['action'] = Constants.ACTION_CREATE;
        var address = this.getAddress(identifier);
        return await this.wrap_and_send(identifier, payload, [address]);
    }

    async updatePatient(identifier, payload) {
        payload['patient_id'] = identifier;
        payload['action'] = Constants.ACTION_UPDATE;
        var address = this.getAddress(identifier);
        return await this.wrap_and_send(identifier, payload, [address]);
    }

    async deletePatient(identifier) {
        var payload = {};
        payload['patient_id'] = identifier;
        payload['action'] = Constants.ACTION_DELETE;

        var address = this.getAddress(identifier);
        var registry = await this.getRegistry(address);
        
        if (registry.error) {
            return registry;
        }
        
        registry = registry.data;
        var ipfsResponse = await this.infuraIPFSClient.rm(registry.ipfs_hash);
        
        if (ipfsResponse == undefined) {
            return response;
        }
        
        return await this.wrap_and_send(identifier, payload, address);
    }
}

module.exports.PatientClient = PatientClient;