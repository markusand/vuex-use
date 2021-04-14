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

const objectPath = (object, path) => path.split('.')
	.reduce((acc, i) => vue.ref(vue.unref(acc)[i]), object);

const useGetters = namespace => {
	const store = vuex.useStore();
	const state = namespace ? store.state[namespace] : store.state;
	return {
		...reduce(state, name => vue.computed(() => state[name])),
		...reduceNamespaced(namespace, store.getters, getter => (
			vue.computed(() => store.getters[getter])
		)),
	};
};

const useActions = namespace => {
	const store = vuex.useStore();
	return reduceNamespaced(namespace, store._actions, action => (
		(payload, options) => store.dispatch(action, payload, options)
	));
};

const useMutations = namespace => {
	const store = vuex.useStore();
	return reduceNamespaced(namespace, store._mutations, mutation => (
		(payload, options) => store.commit(mutation, payload, options)
	));
};

const useModel = (getter, mutation, namespace) => {
	const getters = useGetters(namespace);
	const { [mutation]: mutate } = useMutations(namespace);
	return vue.computed({
		get: () => objectPath(getters, getter).value,
		set: value => mutate(value),
	});
};

exports.useActions = useActions;
exports.useGetters = useGetters;
exports.useModel = useModel;
exports.useMutations = useMutations;
//# sourceMappingURL=index.js.map
