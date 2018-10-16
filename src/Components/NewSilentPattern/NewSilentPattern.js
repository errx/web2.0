// @flow
import * as React from "react";
import Button from "retail-ui/components/Button/Button";
import Input from "retail-ui/components/Input/Input";
import Dropdown from "retail-ui/components/Dropdown/Dropdown";
import MenuItem from "retail-ui/components/MenuItem/MenuItem";
import moment from "moment";
import type {SilentPattern} from "../../Domain/SilentPattern";
import {getTimeOffset, getTimeOffsetCaption, TimeOffsets, TimeOffsetsCaptions} from "../../Domain/SilentPattern";


type Props = {|
    onCreate: (SilentPattern) => Promise<void>,
|};

type State = {
    pattern: string,
    offset: number,

    offsetCaption: string,
};


export default class NewSilentPattern extends React.Component<Props, State> {
    state: State = {
        pattern: "",
        offset: TimeOffsets.quarterHour,
        offsetCaption: TimeOffsetsCaptions.quarterHour,
    };

    setOffset(offset: string) {
        if (offset in TimeOffsetsCaptions) {
            this.setState({
                offset: getTimeOffset(offset),
                offsetCaption: getTimeOffsetCaption(offset),
            });
        }
    };

    submitHandler = () => {
        const {onCreate} = this.props;
        const p: SilentPattern = {
            pattern: this.state.pattern,
            until: moment().unix() + (this.state.offset * 60),
        };
        onCreate(p);
    };

    render(): React.Node {
        return (
            <div>
                <Input
                    value={this.state.pattern} onChange={(_, pattern) => this.setState({"pattern": pattern})}
                />

                <Dropdown use="link" caption={this.state.offsetCaption}>
                    {Object.keys(TimeOffsets).map(key => (
                        <MenuItem key={key} onClick={() => this.setOffset(key)}>
                            {getTimeOffsetCaption(key)}
                        </MenuItem>
                    ))}
                </Dropdown>
                <Button disabled={this.state.pattern.length < 2} onClick={this.submitHandler}>Add</Button>
            </div>
        );

    }
}
