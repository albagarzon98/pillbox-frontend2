import { IdNameStructure } from "../const/genericTypes";

export function formatBranchMedications(branchMedications) {
    let result: IdNameStructure[] = [];

    branchMedications.map(branchMedication => {
        const name = branchMedication.medicationName + " - " +  branchMedication.description;
        result.push(new IdNameStructure(name, branchMedication.id));
    });

    return result;
}