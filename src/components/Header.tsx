import {
	FC,
	ChangeEventHandler,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from 'components/App/Context';
import LS from 'utils/LS';
import styles from 'styles/components/Header.module.scss';
import Normalize from 'utils/Normalize';
import { INote } from 'types/_';

const Upload: FC = () => {
	const [fileContent, setFileContent] = useState('');
	const { setNotes } = useContext(AppContext);

	const fileRef = useRef<HTMLInputElement>(null);
	const readFile: ChangeEventHandler<HTMLInputElement> = (event): void => {
		const fileReader = new FileReader();
		const { files } = event.target;
		const file = files?.item(0);
		if (file) {
			fileReader.readAsText(file, 'UTF-8');
			fileReader.onload = (e) => {
				const content = e.target?.result;
				setFileContent(
					JSON.parse(typeof content === 'string' ? content : '[]'),
				);
			};
		}
	};

	useEffect(() => {
		if (fileContent) {
			const parsed: INote[] = JSON.parse(fileContent);
			const notes: INote[] | null =
				parsed.length &&
				parsed[0]?.message &&
				typeof parsed[0]?.uid === 'number'
					? Normalize.notes(parsed)
					: null;
			if (notes) setNotes(notes);
		}
	}, [fileContent]);

	return (
		<>
			<input ref={fileRef} type="file" onChange={readFile} hidden />

			<button
				className={styles['header-icon']}
				onClick={() => {
					fileRef?.current?.click();
				}}
				title="Import notes from JSON file"
			>
				⭱
			</button>
		</>
	);
};

const Header: FC = () => {
	const { hash } = useLocation();
	const navigate = useNavigate();

	const exportNotesFromLS = (): void => {
		const content: string = LS.getRaw('notes');
		const link = document.createElement('a');
		link.href = content;
		link.download = `notes-${Date.now()}.json`;
		link.click();
	};

	return (
		<header className={styles._}>
			<span className={styles.searchbar}>
				#
				<input
					className={styles['searchbar-input']}
					type="search"
					value={decodeURI(hash).toLowerCase().replace(/^#|\s/g, '')}
					onChange={({ target }) => {
						navigate(
							`#${decodeURI(target.value).toLowerCase().replace(/\s/g, '')}`,
						);
					}}
				/>
			</span>
			<span className={styles.icons}>
				<button
					className={styles['header-icon']}
					onClick={exportNotesFromLS}
					title="Export notes as JSON file"
				>
					⭳
				</button>
				<Upload />
			</span>
		</header>
	);
};

export default Header;
