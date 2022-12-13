export enum ETagState {
	disabled = 0,
	default = 1,
	added = 2,
}

export interface ITag {
	keyword: string;
	state: ETagState;
}

export interface INote {
	uid: number;
	message: string;
	tags: ITag[];
}
