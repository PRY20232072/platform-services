class FamilyHistoryHelper {
    transformRegistryList(registryList) {
        registryList.data = registryList.data.map((registry) => {
            return {
                familyHistory_id: registry.familyHistory_id,
                name: registry.name,
                recorded_date: registry.recorded_date,
                notes: registry.notes,
                relationship: registry.relationship,
            }
        });

        return registryList;
    }
}

module.exports.FamilyHistoryHelper = FamilyHistoryHelper;