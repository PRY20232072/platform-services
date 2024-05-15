import hashlib

TP_NAME = 'attention-processor'
TP_FAMILY_VERSION = '1.0'
ATTENTION_REGISTRY_CODE = '06'

def _hash(identifier):
    return hashlib.sha512(identifier.encode('utf-8')).hexdigest()

def get_namespace_prefix():
    return _hash(TP_NAME)[:6]

def make_address_attention_patient(attention_id, patient_id):
    return get_namespace_prefix() + ATTENTION_REGISTRY_CODE + _hash(attention_id)[:22] + _hash(patient_id)[:40]

def make_address_patient_attention(patient_id, attention_id):
    return get_namespace_prefix() + ATTENTION_REGISTRY_CODE + _hash(patient_id)[:22] + _hash(attention_id)[:40]