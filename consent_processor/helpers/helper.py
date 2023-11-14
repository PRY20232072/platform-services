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

def make_address_register_practitioner(register_id, practitioner_id):
    return get_namespace_prefix() + CONSENT_CODE + _hash(register_id)[:22] + _hash(practitioner_id)[:40]

def make_address_practitioner_register(practitioner_id, register_id):
    return get_namespace_prefix() + CONSENT_CODE + _hash(practitioner_id)[:22] + _hash(register_id)[:40]
