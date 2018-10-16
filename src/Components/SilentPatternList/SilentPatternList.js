// @flow
import * as React from "react";
import moment from "moment";
import type {SilentPattern} from "../../Domain/SilentPattern";
import {getTimeOffset, getTimeOffsetCaption, TimeOffsets} from "../../Domain/SilentPattern";
import cn from "./SilentPatternList.less";
import MenuItem from "retail-ui/components/MenuItem/MenuItem";
import Dropdown from "retail-ui/components/Dropdown/Dropdown";
import Button from "retail-ui/components/Button/Button";

type Props = ReactExactProps<{
    items: Array<SilentPattern>,
    onRemove: (pattern: string) => void,
    onChange: (SilentPattern, number) => Promise<void>,
}>;

export default function SilentPatternList(props: Props): React.Node {
    const {items, onChange, onRemove} = props;
    return (
        <div>
            <div>
            </div>
            <div className={cn("row", "header")}>
                <div className={cn("name")}>Pattern</div>
                <div className={cn("control")}/>
            </div>
            {items.map((item, i) => <SilentPatternListItem key={i} data={item}
                                                           onChange={until => onChange(item, until)}
                                                           onRemove={() => onRemove(item.pattern)}/>)}
        </div>
    );
}

type ItemProps = {
    data: SilentPattern,
    onRemove: () => void,
    onChange: (number) => Promise<void>,
};
type ItemState = {
    showInfo: boolean,
};


function humanizeUntil(until: number): string {
    const delta = until - moment.utc().unix();
    return delta <= 0 ? "Until" : moment.duration(delta * 1000).humanize();
}

class SilentPatternListItem extends React.Component<ItemProps, ItemState> {
    props: ItemProps;

    onClickHandler = (offset: string) => {
        if (offset in TimeOffsets) {
            const {onChange} = this.props;
            const until = moment().unix() + (getTimeOffset(offset) * 60);
            onChange(until);
        }
    };

    render(): React.Node {
        const {onRemove, data} = this.props;
        const {pattern, until} = data;
        return (
            <div className={cn("row")}>
                <div
                    className={cn("name")}>
                    {pattern}
                </div>
                <div className={cn("controls")}>
                    <Dropdown caption={humanizeUntil(until)} use="link">
                        {Object.keys(TimeOffsets).map(key => (
                            <MenuItem key={key} onClick={() => this.onClickHandler(key)}>
                                {getTimeOffsetCaption(key)}
                            </MenuItem>
                        ))}
                    </Dropdown>
                    <Button use="link" icon="Trash" onClick={onRemove}>
                        Del
                    </Button>
                </div>
            </div>
        );
    }
}
