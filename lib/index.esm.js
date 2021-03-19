import { computed } from 'vue';
import { useStore } from 'vuex';

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
	const store = useStore();
	const state = namespace ? store.state[namespace] : store.state;
	return {
		...reduce(state, name => computed(() => state[name])),
		...reduceNamespaced(namespace, store.getters, getter => {
			return computed(() => store.getters[getter]);
		}),
	};
};

const useActions = namespace => {
	const store = useStore();
	return reduceNamespaced(namespace, store._actions, action => {
		return (payload, options) => store.dispatch(action, payload, options);
	});
};

const useMutations = namespace => {
	const store = useStore();
	return reduceNamespaced(namespace, store._mutations, mutation => {
		return (payload, options) => store.commit(mutation, payload, options);
	});
};

export { useActions, useGetters, useMutations };
//# sourceMappingURL=index.esm.js.map
