import hashlib

TP_NAME = 'patient-processor'
TP_FAMILY_VERSION = '1.0'
PATIENT_CODE = '02'

def _hash(identifier):
    return hashlib.sha512(identifier.encode('utf-8')).hexdigest()

def get_namespace_prefix():
    return _hash(TP_NAME)[:6]

def make_address(identifier):
    return get_namespace_prefix() + PATIENT_CODE + _hash(identifier)[:62]