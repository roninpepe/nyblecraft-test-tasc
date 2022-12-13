import { FC, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AppContext } from 'components/App/Context';
import Controller from 'controllers/Home.view.controller';
import Notes from 'components/Notes';
import Normalize from 'utils/Normalize';

const PageLayout: FC = () => {
	const { context } = useContext(AppContext);
	const { hash } = useLocation();

	return (
		<Notes
			notes={Controller.filterNotesByTag(context.notes, Normalize.hash(hash))}
		/>
	);
};

export default PageLayout;
