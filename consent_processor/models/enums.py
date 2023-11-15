from enum import Enum

class ConsentTransactionAction (Enum):
    CREATE = 1
    APPROVE = 2
    REVOKE = 3

class ConsentRegisterType (Enum):
    ALLERGY = 1
    FAMILY_HISTORY = 2

class ConsentStatus (Enum):
    ACTIVE = 1
    PENDING = 2