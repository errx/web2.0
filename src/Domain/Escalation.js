import type {Contact} from "./Contact";

export interface Escalation {
    offset: number;
    contacts: Array<Contact>;
}

export function createEscalation(offset: number): Escalation {
    return {
        offset: offset,
        contacts: [],
    };
}
