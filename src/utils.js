import { ref, unref } from 'vue';

export const reduce = (object, callback) => Object.keys(object)
	.reduce((acc, name) => ({ ...acc, [name]: callback(name) }), {});

export const reduceNamespaced = (namespace, object, callback) => Object.keys(object)
	.filter(name => (namespace ? name.includes(`${namespace}/`) : true))
	.reduce((acc, path) => {
		const name = namespace ? path.substr(`${namespace}/`.length) : path;
		acc[name] = callback(path);
		return acc;
	}, {});

export const objectPath = (object, path) => path.split('.')
	.reduce((acc, i) => ref(unref(acc)[i]), object);
