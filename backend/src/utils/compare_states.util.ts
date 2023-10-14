import stringSimilarity from "string-similarity-js";
import { EStateFields, IState, IStateInsert } from '../models/state.model';

const differenceThreshold: number = Number(process.env.DIFFERENCE_THRESHOLD) || 0.1;

export function changedFields(previousState: IState, currentState: IState | IStateInsert): EStateFields[] {
    let changedFields: EStateFields[] = [];

    // Compare loadTime
    const loadTimeDiff = Math.abs( (currentState.loadTime - previousState.loadTime) / previousState.loadTime );
    if (loadTimeDiff > differenceThreshold) {
        changedFields.push(EStateFields.loadTime);
    }

    // Compare Status
    if (previousState.status != currentState.status) {
        changedFields.push(EStateFields.status);
    }

    // Compare Content
    const contentDifference = 1 - stringSimilarity(currentState.content, previousState.content);
    if (contentDifference > differenceThreshold) {
        changedFields.push(EStateFields.content);
    }


    // log.info({
    //     changedFields,
    //     loadTimeDiff,
    //     contentDifference
    // });

    return changedFields;
}