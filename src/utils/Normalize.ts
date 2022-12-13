import { INote, ITag } from 'types/_';
import Tag from 'controllers/Tag.controller';

class Normalize {
	/**
	 * Replaces invalid JSON symbols with valid.
	 */
	public static JSON(string: string): string {
		return string.replace(this.JSONRE, '\n');
	}

	private static JSONRE = /\n/g;

	/**
	 * '#h%20As%20H' => 'hash'
	 */
	public static hash(hash: string): string {
		return decodeURI(hash).toLowerCase().replace(this.hashRE, '');
	}

	private static hashRE = /^#|\s/g;

	/**
	 * 'Tag%20Keyword' => 'tagkeyword'
	 */
	public static tagKeyword(tag: string): string {
		return decodeURI(tag).toLowerCase().replace(this.tagKeywordRE, '');
	}

	private static tagKeywordRE = /\s/g;

	/**
	 * Applies Normalize.tagKeyword to an ITag object.
	 */
	public static tag(tag: ITag): ITag {
		return { ...tag, keyword: this.tagKeyword(tag.keyword) };
	}

	/**
	 * Applies Normalize.tag to an array of ITag objects.
	 */
	public static tags(tags: ITag[] = []): ITag[] {
		return tags.map(this.tag, this);
	}

	/**
	 * Applies Normalize.tags to an ITag object.
	 */
	public static note(note: INote): INote {
		return {
			...note,
			tags: Tag.crateFromStringIn(this.tags(note.tags), note.message),
		};
	}

	/**
	 * Applies Normalize.note to an array of INotes objects.
	 */
	public static notes(notes: INote[] = []): INote[] {
		return notes.map(this.note, this);
	}
}

export default Normalize;
