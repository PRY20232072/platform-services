from models.attention import Attention
from helpers import helper


class AttentionState:
    def __init__(self, context):
        self._context = context

    def save_attention(self, attentionPayload):
        attention = Attention()
        attention.parse_from_payload(attentionPayload)
        attentionRegistry = self._load_registry(
            patient_id=attention.patient_id, identifier=attention.attention_id)
        # print(f"attentionRegistry found: {attentionRegistry}")
        if attentionRegistry is None:
            print(f"save_attention: {attention.attention_id}")
            state_data = attention.serialize_to_json().encode()
            attention_patient_address = helper.make_address_attention_patient(
                attention_id=attention.attention_id, patient_id=attention.patient_id)
            patient_attention_address = helper.make_address_patient_attention(
                patient_id=attention.patient_id, attention_id=attention.attention_id)

            self._context.set_state(
                {attention_patient_address: state_data, patient_attention_address: state_data}, timeout=3)

    def update_attention(self, attentionPayload):
        attention = Attention()
        attention.parse_from_payload(attentionPayload)
        attentionRegistry = self._load_registry(
            patient_id=attention.patient_id, identifier=attention.attention_id)
        # print(f"attentionRegistry found: {attentionRegistry}")
        if attentionRegistry is not None:
            print(f"update_attention: {attention.attention_id}")
            attention_patient_address = helper.make_address_attention_patient(
                attention_id=attention.attention_id, patient_id=attention.patient_id)
            patient_attention_address = helper.make_address_patient_attention(
                patient_id=attention.patient_id, attention_id=attention.attention_id)
            state_data = attention.serialize_to_json().encode()
            self._context.set_state(
                {attention_patient_address: state_data, patient_attention_address: state_data}, timeout=3)

    def delete_attention(self, attentionPayload):
        attention = Attention()
        attention.parse_from_payload(attentionPayload)
        attentionRegistry = self._load_registry(
            patient_id=attention.patient_id, identifier=attention.attention_id)
        # print(f"attentionRegistry found: {attentionRegistry}")
        if attentionRegistry is not None:
            print(f"delete_attention: {attention.attention_id}")
            attention_patient_address = helper.make_address_attention_patient(
                attention_id=attention.attention_id, patient_id=attention.patient_id)
            patient_attention_address = helper.make_address_patient_attention(
                patient_id=attention.patient_id, attention_id=attention.attention_id)
            self._context.delete_state(
                [attention_patient_address, patient_attention_address], timeout=3)

    def _load_registry(self, patient_id, identifier):
        print(f"get_attention: {identifier}")
        address = helper.make_address_attention_patient(
            attention_id=identifier, patient_id=patient_id)
        state_entries = self._context.get_state([address], timeout=3)
        print(f"state_entries: {state_entries}")
        if state_entries:
            try:
                attention = Attention()
                attention.parse_from_json(state_entries[0].data.decode())
                return attention
            except ValueError:
                return None
        else:
            return None
