class FamilyHistoryHelper {
    transformRegistryList(registryList) {
        registryList.data = registryList.data.map((registry) => {
            return {
                familyHistory_id: registry.familyHistory_id,
                notes: registry.notes,
                participant_id: registry.participant_id,
                recorded_date: registry.recorded_date,
                clinical_status: registry.clinical_status
            }
        });

        return registryList;
    }
}

module.exports.FamilyHistoryHelper = FamilyHistoryHelper;