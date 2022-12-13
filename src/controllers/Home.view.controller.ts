import { INote } from 'types/_';

class HomeView {
	static filterNotesByTag = (notes: INote[], tag: string) => {
		if (tag)
			return notes.filter(({ tags }) =>
				tags.find(({ keyword, state }) => keyword === tag && state),
			);
		return notes;
	};
}

export default HomeView;
