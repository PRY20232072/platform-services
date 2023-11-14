const { CommonClient } = require('../common/CommonClient');
const { Constants } = require('../common/Constants');
const { TextEncoder, TextDecoder } = require('text-encoding/lib/encoding')

class AllergyClient extends CommonClient {
    constructor() {
        super(
            Constants.ALLERGY_REGISTRY_TP_NAME, 
            Constants.ALLERGY_REGISTRY_TP_CODE,
            Constants.ALLERGY_REGISTRY_TP_VERSION
        );
    }

    getAddress(patient_id, identifier) {
        var pref = this.hash(this.TP_NAME).substring(0, 6);
        var patientAddr = this.hash(patient_id).substring(0, 31);
        var addr = this.hash(identifier).substring(0, 31);
        return pref + this.TP_CODE + patientAddr + addr;
    }

    getAddressByPatient(patient_id) {
        var pref = this.hash(this.TP_NAME).substring(0, 6);
        var patientAddr = this.hash(patient_id).substring(0, 31);
        return pref + this.TP_CODE + patientAddr;
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
            allergy_id: identifier,
            patient_id: payload.patient_id,
            ipfs_hash: response.hash,
            action: payload.action
        });

        var payloadBytes = enc.encode(new_payload);

        // var txnHeaderBytes = this.make_txn_header_bytes(identifier, payloadBytes);
        var txnHeaderBytes = this.make_txn_header_bytes(payloadBytes, address);
        var txnBytes = this.make_txn_bytes(txnHeaderBytes, payloadBytes);

        response = await this.saveDataInBlockchain('/batches', txnBytes);
        
        //TODO: validate if response has info

        return response;
    }

    async getAlleryByIdAndPatientId(allergy_id, patient_id) {
        var address = this.AllergyAddressHelper.getAllergyPatientAddress(allergy_id, patient_id);
        var data = await this.AllergyBlockchainHelper.getRegistry(address);
        if (data.error) {
            data.data = "There is no allergy with this identifier";
            return data;
        }
        data = await this.AllergyIPFSHelper.getIPFSDataOfRegistry(data);
        return data;
    }

    async createAllergy(identifier, payload) {
        payload['allergy_id'] = identifier;
        payload['action'] = Constants.ACTION_CREATE;
        var address = this.getAddress(payload['patient_id'], identifier);
        return await this.wrap_and_send(identifier, payload, address);
    }

    async updateAllergy(identifier, payload) {
        payload['allergy_id'] = identifier;
        payload['action'] = Constants.ACTION_UPDATE;
        var address = this.getAddress(payload['patient_id'], identifier);
        return await this.wrap_and_send(identifier, payload, address);
    }

    async deleteAllergy(identifier, patient_id) {
        var payload = {};
        payload['allergy_id'] = identifier;
        payload['patient_id'] = patient_id;
        payload['action'] = Constants.ACTION_DELETE;

        var address = this.getAddress(patient_id, identifier);
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

module.exports.AllergyClient = AllergyClient;