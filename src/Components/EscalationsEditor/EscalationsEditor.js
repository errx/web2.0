// @flow
import * as React from "react";
import Button from "retail-ui/components/Button";
import Icon from "retail-ui/components/Icon";
import type { Contact } from "../../Domain/Contact";

import EscalationEditor, { type EscalationInfo } from "../EscalationEditForm/EscalationEditForm";

import cn from "./EscalationsEditor.less";

type Props = {
    escalations: Array<EscalationInfo>,
    onChange: ($Shape<EscalationInfo>) => void,
    usedContactIds: Array<string>,
    availableContacts: Array<Contact>,
};

export default class EscalationList extends React.Component<Props> {
    props: Props;

    static createEscalation(offset: number): EscalationInfo {
        return {
            offset: offset,
            contacts: [],
        };
    }

    handleAddEscalation() {
        const { onChange, escalations } = this.props;
        const maxOffset = escalations.reduce((a, b) => Math.max(a, b.offset), 0);

        onChange([...escalations, EscalationList.createEscalation(maxOffset + 20)]);
    }

    handleRemoveEscalation(index: number) {
        const { onChange, escalations } = this.props;
        onChange([...escalations.slice(0, index), ...escalations.slice(index + 1)]);
    }

    handleUpdateEscalation(index: number, esc: EscalationInfo) {
        const { onChange, escalations } = this.props;
        onChange([...escalations.slice(0, index), esc, ...escalations.slice(index + 1)]);
    }

    render(): React.Node {
        const { escalations, usedContactIds, availableContacts } = this.props;

        return (
            <div className={cn("form")}>
                {escalations.map((escalation, i) => (
                    <div className={cn("row")}>
                        <EscalationEditor
                            escalation={escalation}
                            onChange={esc => this.handleUpdateEscalation(i, esc)}
                            usedContactIds={usedContactIds}
                            availableContacts={availableContacts}
                            key={i}
                        />
                        <div className={cn("fgroup-control")}>
                            <Button onClick={() => this.handleRemoveEscalation(i)}>
                                <Icon name="Remove" />
                            </Button>
                        </div>
                    </div>
                ))}

                <Button use="link" icon="Add" onClick={() => this.handleAddEscalation()}>
                    Add {escalations.length > 0 ? "one more" : ""} escalation
                </Button>
            </div>
        );
    }
}

/* TODO
#) cleanup imports etc
#) escalation info in subscription list
#) rename classes
#) tests?
#) unique offset?
#) add contacts :OK
#) share used contacts :OK
#) check save/load :OK
#) css :OK
#) offset validation :OK
#) remove warnings :OK


#) ack button page
#) ack button api

 */
