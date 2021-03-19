export const reduce = (object, callback) => Object.keys(object)
	.reduce((acc, name) => ({ ...acc, [name]: callback(name) }), {});

export const reduceNamespaced = (namespace, object, callback) => Object.keys(object)
	.filter(name => (namespace ? name.includes(`${namespace}/`) : true))
	.reduce((acc, path) => {
		const name = namespace ? path.substr(`${namespace}/`.length) : path;
		acc[name] = callback(path);
		return acc;
	}, {});
