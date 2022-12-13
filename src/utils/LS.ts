/* eslint-disable prettier/prettier */
class LS {
	/**
	 * Returns object with existed selected localStorage entries.
	 */
	public static get<Type = unknown>(...keys: string[]): Record<string, Type> {
		const toGet = keys.length ? keys : this.keys;
		return toGet.reduce((res, key) => {
			const value: string | null = localStorage.getItem(key);
			if (value) return { ...res, [key]: JSON.parse(value) };
			return res;
		}, {});
	}

	private static keys = Object.keys(localStorage);

	/**
	 * Returns the stringifeid JSON with existed selected localStorage entries.
	 */
	public static getRaw(...keys: string[]): string {
		const toGet = keys.length ? keys : this.keys;
		if (toGet.length === 1)
			return this.getJSONTemplate(localStorage.getItem(keys[0]) ?? '');
		return this.getJSONTemplate(
			toGet.reduce((res, key) => {
				const value: string | null = localStorage.getItem(key);
				if (value) return { ...res, [key]: value };
				return res;
			}, {}),
		);
	}

	private static getJSONTemplate = (data: unknown): string =>
		`data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(data))}`;

	/**
	 * Sets entries from the passed object as localStorage.
	 */
	public static set(object: Record<string, unknown>): void {
		for (const key in object)
			localStorage.setItem(key, JSON.stringify(object[key]));
	}
}

export default LS;
