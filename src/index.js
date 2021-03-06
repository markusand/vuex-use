import { computed } from 'vue';
import { useStore } from 'vuex';
import { reduce, reduceNamespaced, objectPath } from './utils';

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

export { useGetters, useActions, useMutations, useModel };
