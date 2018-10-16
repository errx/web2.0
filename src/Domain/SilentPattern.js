// @flow

export type SilentPattern = {|
    pattern: string,
    until: number;
    created_at: number;
    login: string;
|};

export type SilentPatternList = {|
    list: Array<SilentPattern>,
|};



export const TimeOffsets = {
    quarterHour: 15,
    oneHour: 60,
    threeHours: 180,
    sixHours: 360,
    oneDay: 1440,
    oneWeek: 10080,
};

export const TimeOffsetsCaptions = {
    quarterHour: "15 min",
    oneHour: "1 hour",
    threeHours: "3 hours",
    sixHours: "6 hours",
    oneDay: "1 day",
    oneWeek: "1 week",
};


export function getTimeOffsetCaption(offset: string): string {
    return TimeOffsetsCaptions[offset];
}

export function getTimeOffset(offset: string): number {
    return TimeOffsets[offset];
}
