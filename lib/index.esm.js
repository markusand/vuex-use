import { ref, unref, computed } from 'vue';
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

const objectPath = (object, path) => path.split('.')
	.reduce((acc, i) => ref(unref(acc)[i]), object);

const useGetters = namespace => {
	const store = useStore();
	const state = namespace ? store.state[namespace] : store.state;
	return {
		...reduce(state, name => computed(() => state[name])),
		...reduceNamespaced(namespace, store.getters, getter => (
			computed(() => store.getters[getter])
		)),
	};
};

const useActions = namespace => {
	const store = useStore();
	return reduceNamespaced(namespace, store._actions, action => (
		(payload, options) => store.dispatch(action, payload, options)
	));
};

const useMutations = namespace => {
	const store = useStore();
	return reduceNamespaced(namespace, store._mutations, mutation => (
		(payload, options) => store.commit(mutation, payload, options)
	));
};

const useModel = (getter, mutation, namespace) => {
	const getters = useGetters(namespace);
	const { [mutation]: mutate } = useMutations(namespace);
	return computed({
		get: () => objectPath(getters, getter).value,
		set: value => mutate(value),
	});
};

export { useActions, useGetters, useModel, useMutations };
//# sourceMappingURL=index.esm.js.map
