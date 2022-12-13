import { ReactNode } from 'react';
import { INote, ITag } from 'types/_';

/* main */

export interface IElementProps {
	children?: ReactNode;
	className?: string;
	key?: string | number;
}

export type StateUpdater<State> = (newState: Partial<State>) => void;

/* context */

export interface IAppContext {
	notes: INote[];
	lastUid: number;
}

/* props */

export interface INotesProps extends IElementProps {
	notes: INote[];
}
export interface INoteProps extends IElementProps {
	note: INote;
}
export interface INoteMessageProps extends IElementProps {
	noteState: INoteState;
	updateNoteState: StateUpdater<INoteState>;
}
export interface INoteMessageInputProps extends INoteMessageProps {
	uid: number;
}
export interface IAddTagProps extends IElementProps {
	noteState: INoteState;
	updateNoteState: StateUpdater<INoteState>;
}

/* state */

export interface INoteState {
	message: string;
	tags: ITag[];
	edit: boolean;
}
