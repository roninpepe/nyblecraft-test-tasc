import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ETagState, INoteState, ITag } from 'types/_';
import reactStringReplace from 'react-string-replace';
import styles from 'styles/components/Note.module.scss';
import Normalize from 'utils/Normalize';

class Tag {
	/**
	 * Find the item in ITag array by keyword. */
	public static findIn(tags: ITag[], value: ITag | string): ITag | void {
		let keyword: string;
		if (typeof value === 'string') {
			keyword = value;
		} else keyword = value.keyword;
		return tags.find((tag) => tag.keyword === keyword);
	}

	/**
	 * Returns a new ITag array without the selected item. */
	public static removeFrom(tags: ITag[], value: ITag | string): ITag[] {
		const toRemove = typeof value === 'string' ? value : value.keyword;
		return tags.filter(({ keyword }) => keyword !== toRemove);
	}

	/** Returns a new ITag array that contains selected item with decreased state property. */
	public static disableIn(tags: ITag[], value: ITag | string): ITag[] {
		const keyword = typeof value === 'string' ? value : value.keyword;
		const tag = this.findIn(tags, keyword) ?? { keyword, state: 0 };
		if (!tag.state) return this.removeFrom(tags, keyword);
		return tags.map((currentTag): ITag => {
			if (currentTag === tag)
				return { ...currentTag, state: currentTag.state - 1 };
			return currentTag;
		});
	}

	/** Returns a new ITag object from passed arguments. */
	public static crate(keyword: string, state: ETagState = 1): ITag {
		return { keyword, state };
	}

	/** Returns a new ITag array with new item from passed arguments. */
	public static createIn(
		tags: ITag[],
		keyword: string,
		state: ETagState = 1,
	): ITag[] {
		if (!keyword) return tags;

		const tag = this.findIn(tags, keyword);
		if (tag) {
			if (state > 1 && tag.state < state) {
				return tags.map(
					(currentTag) =>
						currentTag === tag ? this.crate(keyword, state) : currentTag,
					this,
				);
			}
			return tags;
		}
		return [...tags, this.crate(keyword, state)];
	}

	/** Returns a new ITag array with new items from passed string. */
	public static crateFromStringIn(tags: ITag[], string: string): ITag[] {
		const keywords = this.getFromString(string);
		return keywords
			.reduce((acc, keyword) => this.createIn(acc, keyword), tags)
			.filter(
				({ keyword, state }) => keywords.includes(keyword) || state !== 1,
			);
	}

	/**
	 * Returns an array of keywords from string.
	 */
	public static getFromString(string: string): string[] {
		return Normalize.JSON(string)
			.split(this.hashRE)
			.filter(
				(v, i, a) =>
					a.indexOf(v) === i && v.length > 1 && v[0] === '#' && v[1] !== ' ',
			)
			.map((keyword) => Normalize.tagKeyword(keyword.slice(1)));
	}

	private static hashRE = /(?:(?:^|(?<=\s)))(#\S+)/gmu;

	/**
	 * Map INote.message string with highlighted tags.
	 */
	public static mapEditableTags(noteState: INoteState): ReactNode[] {
		const { message, tags } = noteState;
		return reactStringReplace(
			message,
			this.hashtagRE,
			(match: string, i: number) => {
				const keyword = match.toLowerCase();
				const { state } = this.findIn(tags, keyword) ?? { state: 0 };
				if (state)
					return (
						<Link
							className={[
								styles.tag,
								state === 2 ? styles.tag_contrast : undefined,
							].join(' ')}
							to={`#${keyword}`}
							key={i}
							title="Ctrl+LMB to edit."
							onClick={(event) => {
								if (event.ctrlKey) {
									event.preventDefault();
								} else event.stopPropagation();
							}}
						>
							{match}
						</Link>
					);
				return `#${match}`;
			},
		) as ReactNode[];
	}

	private static hashtagRE = /(?:(?:^|(?<=\s))#)(\S+)/gmu;

	/**
	 * Map ITag[] with tag links.
	 */
	public static mapTags(
		tags: ITag[],
		updateNoteState: (newState: Partial<INoteState>) => void,
	): ReactNode[] {
		const mapTagsToLinks = ({ keyword, state }: ITag): ReactNode => {
			return state ? (
				<span
					className={[
						styles.tag,
						styles.tag_container,
						state === 2 ? styles.tag_contrast : undefined,
					].join(' ')}
					key={keyword}
				>
					<span
						className={styles['tag-delete']}
						title="Delete tag"
						onClick={() => {
							updateNoteState({ tags: this.disableIn(tags, keyword) });
						}}
					/>
					<Link className={styles['tag-link']} to={`#${keyword}`}>
						{keyword}
					</Link>
				</span>
			) : undefined;
		};
		return tags.map(mapTagsToLinks, this);
	}
}

export default Tag;
