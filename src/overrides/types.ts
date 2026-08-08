type OverrideDate = {
    month: number;
    day: number;
};

export type Override = {
    id: number;
    value: {
        regular: string;
        inside: string;
    };
} & (
    | {type: 'User'; userId: number; userName?: string}
    | {
          type: 'Date';
          date: OverrideDate;
      }
    | {
          type: 'User_Date';
          userId: number;
          userName?: string;
          date: OverrideDate;
      }
    | {type: 'Default'}
);

export type OverrideFilter = {date?: OverrideDate; userId?: number};
export type OverrideType = Override['type'];
type DistributiveOmit<T, K extends string | number | symbol> = T extends unknown
    ? Omit<T, K>
    : never;

export type CreateOverridePayload = DistributiveOmit<Override, 'id'>;

export interface IOverridesManager {
    getOverrides(): Override[];
    getOverride(filter: OverrideFilter): Override;
    createOverride(override: CreateOverridePayload): void;
    deleteOverride(id: number): void;
}
