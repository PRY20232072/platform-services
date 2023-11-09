import hashlib

TP_NAME = 'consent-processor'
TP_FAMILY_VERSION = '1.0'
CONSENT_CODE = '03'

def _hash(identifier):
    return hashlib.sha512(identifier.encode('utf-8')).hexdigest()

def get_namespace_prefix():
    return _hash(TP_NAME)[:6]

def make_address(identifier):
    return get_namespace_prefix() + CONSENT_CODE + _hash(identifier)[:22]

def make_address_patient_professional(patient_id, professional_id):
    return get_namespace_prefix() + CONSENT_CODE + _hash(patient_id)[:22] + _hash(professional_id)[:40]

def make_address_professional_patient(professional_id, patient_id):
    return get_namespace_prefix() + CONSENT_CODE + _hash(professional_id)[:22] + _hash(patient_id)[:40]
