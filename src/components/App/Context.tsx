import { FC, Context, createContext, useEffect, useState } from 'react';
import { IAppContext, IElementProps, INote } from 'types/_';
import Normalize from 'utils/Normalize';
import mock from 'mock/notes.mock.json';
import LS from 'utils/LS';

class AppContextDefault implements IAppContext {
	public notes;

	public lastUid;

	constructor(notes: INote[]) {
		this.notes = notes;

		this.lastUid = notes.reduce((a, b) => Math.max(a, b.uid), 0);
	}
}

const ls: INote[] | null = LS.get<INote[]>('notes')?.notes;
const verifiedMock: INote[] | null =
	mock.length && mock[0]?.message && typeof mock[0]?.uid === 'number'
		? Normalize.notes(mock)
		: null;

const notes: INote[] = ls ?? verifiedMock ?? [];

export const AppContext: Context<{
	context: IAppContext;
	setNotes: (notes: INote[]) => void;
}> = createContext({
	context: new AppContextDefault(notes),
	setNotes: (newNotes) => {
		console.log(newNotes);
	},
});

const AppContextProvider: FC<IElementProps> = ({ children }) => {
	const [state, setState] = useState<IAppContext>(new AppContextDefault(notes));

	useEffect(() => {
		LS.set({ notes: state.notes });
	}, [state.notes]);

	return (
		<AppContext.Provider
			value={{
				context: state,
				setNotes: (newNotes: INote[]) => {
					setState({
						notes: Normalize.notes(newNotes),
						lastUid: newNotes.reduce((a, b) => Math.max(a, b.uid), 0),
					});
				},
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export default AppContextProvider;
