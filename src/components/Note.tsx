import { FC, useContext, useEffect, useState } from 'react';
import ReactTextareaAutosize from 'react-textarea-autosize';
import {
	IAddTagProps,
	INoteMessageInputProps,
	INoteMessageProps,
	INoteProps,
	INoteState,
	StateUpdater,
} from 'types/_';
import { AppContext } from 'components/App/Context';
import Controller from 'controllers/Note.controller';
import TagController from 'controllers/Tag.controller';
import Normalize from 'utils/Normalize';
import styles from 'styles/components/Note.module.scss';

const Message: FC<INoteMessageProps> = ({ noteState, updateNoteState }) => (
	<div
		className={styles.message}
		onClick={() => {
			updateNoteState({ edit: true });
		}}
	>
		{TagController.mapEditableTags(noteState)}
	</div>
);

const MessageInput: FC<INoteMessageInputProps> = ({
	noteState,
	updateNoteState,
	uid,
}) => (
	<ReactTextareaAutosize
		className={styles['message-field']}
		name={`note-${uid}`}
		id={`note-${uid}`}
		autoFocus
		onBlur={({ target }) => {
			const message = Normalize.JSON(target.value);
			updateNoteState({
				message,
				tags: TagController.crateFromStringIn(noteState.tags, message),
				edit: false,
			});
		}}
		onKeyDown={({ target, code, ctrlKey }) => {
			if (
				target instanceof HTMLElement &&
				(('Enter' === code && ctrlKey) || 'Escape' === code)
			)
				target.blur();
		}}
		defaultValue={noteState.message}
	/>
);

const AddTag: FC<IAddTagProps> = ({ noteState, updateNoteState }) => {
	return (
		<span
			className={[styles.tag, styles.tag_contrast, styles['tag-add']].join(' ')}
			contentEditable
			suppressContentEditableWarning
			title="Add tag"
			onFocus={(e) => {
				e.target.textContent = '';
			}}
			onBlur={({ target }) => {
				const value = Normalize.tagKeyword(target.textContent ?? '');
				if (value) {
					updateNoteState({
						tags: TagController.createIn(noteState.tags, value, 2),
					});
				}
				target.textContent = '+';
			}}
			onKeyDown={({ target, code }) => {
				if (
					target instanceof HTMLElement &&
					['Space', 'Enter', 'Escape'].includes(code)
				)
					target.blur();
			}}
		>
			+
		</span>
	);
};

const Note: FC<INoteProps> = ({ note }) => {
	const { uid, message, tags } = note;

	const { context, setNotes } = useContext(AppContext);
	const [noteState, setNoteState] = useState<INoteState>({
		message,
		tags,
		edit: false,
	});
	const updateNoteState: StateUpdater<INoteState> = (newState) => {
		setNoteState({ ...noteState, ...newState });
	};

	const messageToRender = noteState.edit ? (
		<MessageInput
			noteState={noteState}
			updateNoteState={updateNoteState}
			uid={uid}
		/>
	) : (
		<Message noteState={noteState} updateNoteState={updateNoteState} />
	);

	useEffect(() => {
		setNotes(Controller.updateIn(note, context.notes, noteState));
	}, [noteState]);

	return (
		<div className={styles._}>
			{messageToRender}
			<div className={styles.actions}>
				<div className={styles.tags}>
					{TagController.mapTags(tags, updateNoteState)}
					<AddTag noteState={noteState} updateNoteState={updateNoteState} />
				</div>
				<button
					className={styles.remove}
					title="Remove note"
					onClick={() => {
						setNotes(Controller.removeFrom(note, context.notes));
					}}
				></button>
			</div>
		</div>
	);
};

export default Note;
