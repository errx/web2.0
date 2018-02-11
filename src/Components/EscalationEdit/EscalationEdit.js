// @flow
import * as React from "react";
import { tooltip, type ValidationInfo, ValidationWrapperV1 } from "react-ui-validations";
import type { Contact } from "../../Domain/Contact";
import ContactSelect from "../ContactSelect/ContactSelect";
import cn from "./EscalationEdit.less";
import Input from "retail-ui/components/Input";

export type EscalationInfo = {
    contacts: Array<string>,
    offset: number,
};

type Props = {
    escalation: EscalationInfo,
    onChange: ($Shape<EscalationInfo>) => void,
    usedContactIds: Array<string>,
    availableContacts: Array<Contact>,
};

export default class EscalationEditor extends React.Component<Props> {
    props: Props;

    validateContacts(): ?ValidationInfo {
        const { escalation } = this.props;
        if (escalation.contacts.length === 0) {
            return {
                message: "Please add one or more delivery channels",
                type: "submit",
            };
        }
        return null;
    }

    render(): React.Node {
        const { escalation, usedContactIds, availableContacts, onChange } = this.props;

        return (
            <div className={cn("form")}>
                <div className={cn("row")}>
                    <Input
                        value={escalation.offset}
                        width="60px"
                        mask="999"
                        maskChar=" "
                        onChange={(e, value) => onChange({ ...escalation, offset: value })}
                    />
                </div>
                <div className={cn("row")}>
                    <div className={cn("value", "with-input")}>
                        <ValidationWrapperV1
                            renderMessage={tooltip("right middle")}
                            validationInfo={this.validateContacts()}>
                            <ContactSelect
                                contactIds={escalation.contacts}
                                onChange={contacts => onChange({ ...escalation, contacts: contacts })}
                                usedContactIds={usedContactIds}
                                availableContacts={availableContacts}
                            />
                        </ValidationWrapperV1>
                    </div>
                </div>
            </div>
        );
    }
}
