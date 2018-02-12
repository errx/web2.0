// @flow
import * as React from "react";
import Checkbox from "retail-ui/components/Checkbox";
import Link from "retail-ui/components/Link";
import Tooltip from "retail-ui/components/Tooltip";
import { ValidationWrapperV1, tooltip, type ValidationInfo } from "react-ui-validations";
import type { Contact } from "../../Domain/Contact";
import type { Schedule } from "../../Domain/Schedule";
import ContactSelect from "../ContactSelect/ContactSelect";
import TagDropdownSelect from "../TagDropdownSelect/TagDropdownSelect";
import ScheduleEdit from "../ScheduleEdit/ScheduleEdit";
import cn from "./SubscriptionEditor.less";
import EscalationList from "../EscalationList/EscalationList";
import type { EscalationInfo } from "../EscalationEdit/EscalationEdit";

export type SubscriptionInfo = {
    sched: Schedule,
    tags: Array<string>,
    throttling: boolean,
    contacts: Array<string>,
    enabled: boolean,
    escalations: Array<EscalationInfo>,
};

type Props = {
    subscription: SubscriptionInfo,
    onChange: ($Shape<SubscriptionInfo>) => void,
    tags: Array<string>,
    contacts: Array<Contact>,
};

export default class SubscriptionEditor extends React.Component<Props> {
    props: Props;

    renderThrottlingExplanation = () => {
        return <span>If trigger emit to many events they will be grouped into single message.</span>;
    };

    renderTagsExplanation = () => {
        return (
            <span>
                Notification will be sent if trigger contains <strong>ALL</strong> of selected tags.
            </span>
        );
    };

    validateContacts(): ?ValidationInfo {
        const { subscription } = this.props;
        if (subscription.contacts.length === 0) {
            return {
                message: "Please add one or more delivery channels",
                type: "submit",
            };
        }
        return null;
    }

    validateTags(): ?ValidationInfo {
        const { subscription } = this.props;
        if (subscription.tags.length === 0) {
            return {
                message: "Please add one or more tags",
                type: "submit",
            };
        }
        return null;
    }

    getUsedContactIds(): Array<string> {
        const { subscription } = this.props;
        let usedContactIds = subscription.contacts.slice();
        const esc = subscription.escalations || [];
        // subscription.escalations.map(e => {
        esc.map(e => {
            usedContactIds = usedContactIds.concat(e.contacts);
        });
        return usedContactIds;
    }

    render(): React.Node {
        const { subscription, contacts, onChange, tags } = this.props;
        const usedContactIds = this.getUsedContactIds();
        return (
            <div className={cn("form")}>
                <div className={cn("row")}>
                    <div className={cn("caption")}>Target delivery channels:</div>
                    <div className={cn("value", "with-input")}>
                        <ValidationWrapperV1
                            renderMessage={tooltip("right middle")}
                            validationInfo={this.validateContacts()}>
                            <ContactSelect
                                contactIds={subscription.contacts}
                                usedContactIds={usedContactIds}
                                onChange={contactIds => onChange({ contacts: contactIds })}
                                availableContacts={contacts}
                            />
                        </ValidationWrapperV1>
                    </div>
                </div>
                <div className={cn("row")}>
                    <div className={cn("caption")}>
                        Tags:{" "}
                        <Tooltip
                            trigger="click"
                            render={this.renderTagsExplanation}
                            closeButton={false}
                            pos="right middle">
                            <Link use="grayed" icon="HelpDot" />
                        </Tooltip>
                    </div>
                    <div className={cn("value", "with-input")}>
                        <ValidationWrapperV1
                            renderMessage={tooltip("right middle")}
                            validationInfo={this.validateTags()}>
                            <TagDropdownSelect
                                width="470px"
                                value={subscription.tags}
                                onChange={tags => onChange({ tags: tags })}
                                availableTags={tags}
                            />
                        </ValidationWrapperV1>
                    </div>
                </div>

                <div className={cn("row")}>
                    <div className={cn("caption")}>Delivery schedule:</div>
                    <div className={cn("value")}>
                        <ScheduleEdit schedule={subscription.sched} onChange={value => onChange({ sched: value })} />
                    </div>
                </div>
                <div className={cn("row")}>
                    <Checkbox
                        checked={subscription.throttling}
                        onChange={(e, checked) => onChange({ throttling: checked })}>
                        Throttle messages
                    </Checkbox>{" "}
                    <Tooltip
                        trigger="click"
                        render={this.renderThrottlingExplanation}
                        closeButton={false}
                        pos="right middle">
                        <Link use="grayed" icon="HelpDot" />
                    </Tooltip>
                </div>
                <div className={cn("row")}>
                    <Checkbox checked={subscription.enabled} onChange={(e, checked) => onChange({ enabled: checked })}>
                        Enabled
                    </Checkbox>{" "}
                </div>

                <div className={cn("row")}>
                    {subscription.escalations.length > 0 && <div className={cn("caption")}>Escalations</div>}
                    <div className={cn("value", "with-input")}>
                        <EscalationList
                            escalations={subscription.escalations}
                            usedContactIds={usedContactIds}
                            onChange={escalations => onChange({ escalations: escalations })}
                            availableContacts={contacts}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
