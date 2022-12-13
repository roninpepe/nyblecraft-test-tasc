import { FC } from 'react';
import { INotesProps } from 'types/_';
import Controller from 'controllers/Notes.controller';
import styles from 'styles/components/Notes.module.scss';
import NewNote from './NewNote';

const Notes: FC<INotesProps> = ({ notes }) => (
	<div className={styles._}>
		<NewNote />
		{[...notes].reverse().map(Controller.mapNotes)}
	</div>
);
export default Notes;
