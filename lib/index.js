'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vue = require('vue');
var vuex = require('vuex');

const reduce = (object, callback) => Object.keys(object)
	.reduce((acc, name) => ({ ...acc, [name]: callback(name) }), {});

const reduceNamespaced = (namespace, object, callback) => Object.keys(object)
	.filter(name => (namespace ? name.includes(`${namespace}/`) : true))
	.reduce((acc, path) => {
		const name = namespace ? path.substr(`${namespace}/`.length) : path;
		acc[name] = callback(path);
		return acc;
	}, {});

const useGetters = namespace => {
	const store = vuex.useStore();
	const state = namespace ? store.state[namespace] : store.state;
	return {
		...reduce(state, name => vue.computed(() => state[name])),
		...reduceNamespaced(namespace, store.getters, getter => {
			return vue.computed(() => store.getters[getter]);
		}),
	};
};

const useActions = namespace => {
	const store = vuex.useStore();
	return reduceNamespaced(namespace, store._actions, action => {
		return (payload, options) => store.dispatch(action, payload, options);
	});
};

const useMutations = namespace => {
	const store = vuex.useStore();
	return reduceNamespaced(namespace, store._mutations, mutation => {
		return (payload, options) => store.commit(mutation, payload, options);
	});
};

exports.useActions = useActions;
exports.useGetters = useGetters;
exports.useMutations = useMutations;
//# sourceMappingURL=index.js.map
