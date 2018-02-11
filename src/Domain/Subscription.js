// @flow

import type { Schedule } from "./Schedule";
import type { EscalationInfo } from "../Components/EscalationEdit/EscalationEdit";

export type Subscription = {
    sched: Schedule,
    tags: Array<string>,
    throttling: boolean,
    contacts: Array<string>,
    enabled: boolean,
    user: string,
    id: string,
    escalations: Array<EscalationInfo>,
};
