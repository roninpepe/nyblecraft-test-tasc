import { ReactElement } from 'react';
import { INote } from 'types/_';
import Note from 'components/Note';

class Notes {
	static mapNotes(note: INote): ReactElement {
		return <Note note={note} key={note.uid} />;
	}
}

export default Notes;
