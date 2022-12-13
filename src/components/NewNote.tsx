import { FC, useContext } from 'react';
import ReactTextareaAutosize from 'react-textarea-autosize';
import { AppContext } from 'components/App/Context';
import Controller from 'controllers/Note.controller';
import Normalize from 'utils/Normalize';
import styles from 'styles/components/Note.module.scss';

const NewNote: FC = () => {
	const { context, setNotes } = useContext(AppContext);

	const uid = context.lastUid + 1;

	return (
		<div className={styles._}>
			{
				<ReactTextareaAutosize
					className={styles['message-field']}
					name={`note-${uid}`}
					id={`note-${uid}`}
					autoFocus
					onBlur={({ target }) => {
						const message = Normalize.JSON(target.value);
						if (!Controller.isMessageEmpty(message))
							setNotes([...context.notes, Controller.create(uid, message)]);
						target.value = '';
					}}
					onKeyDown={({ target, code, ctrlKey }) => {
						if (target instanceof HTMLElement && code === 'Enter' && ctrlKey)
							target.blur();
					}}
					defaultValue={''}
				/>
			}
		</div>
	);
};

export default NewNote;
