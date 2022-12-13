import { INote, INoteState } from 'types/_';
import Tag from 'controllers/Tag.controller';

class Note {
	/** Checks if the message is empty. */
	public static isMessageEmpty(value: string | INote): boolean {
		const message = typeof value === 'string' ? value : value.message;
		return !message.replace(this.emptyMessageRE, '');
	}

	private static emptyMessageRE = /\s|\n/g;

	/** Returns a new INote object from passed arguments. */
	public static create(uid: number, message: string): INote {
		return { uid, message, tags: Tag.crateFromStringIn([], message) };
	}

	/** Returns a new INote array without selected item. */
	public static removeFrom(note: INote, notes: INote[]): INote[] {
		return notes.filter((currentNote) => currentNote.uid !== note.uid);
	}

	/** Returns a new array with selected updated item depends on component state. */
	public static updateIn(
		note: INote,
		notes: INote[],
		{ message, tags }: INoteState,
	): INote[] {
		if (!message) return this.removeFrom(note, notes);
		return notes.map((currentNote) => {
			if (currentNote === note)
				return {
					...currentNote,
					message: message,
					tags: tags,
				};
			return currentNote;
		});
	}
}

export default Note;
