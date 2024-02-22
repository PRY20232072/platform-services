import hashlib

TP_NAME = 'family-history-processor'
TP_FAMILY_VERSION = '1.0'
FAMILY_REGISTRY_CODE = '05'

def _hash(identifier):
    return hashlib.sha512(identifier.encode('utf-8')).hexdigest()

def get_namespace_prefix():
    return _hash(TP_NAME)[:6]

def make_addresses(familyHistory_id, patient_id):
    return [
        make_address_familyHistory_patient(familyHistory_id, patient_id),
        make_address_patient_familyHistory(patient_id, familyHistory_id)
    ]

def make_address_familyHistory_patient(familyHistory_id, patient_id):
    return get_namespace_prefix() + FAMILY_REGISTRY_CODE + _hash(familyHistory_id)[:22] + _hash(patient_id)[:40]

def make_address_patient_familyHistory(patient_id, familyHistory_id):
    return get_namespace_prefix() + FAMILY_REGISTRY_CODE + _hash(patient_id)[:22] + _hash(familyHistory_id)[:40]