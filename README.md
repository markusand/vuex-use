# vuex-use
Helpers `useGetters` `useActions` `useMutations` to access the Vuex 4 store using Vue 3 Composition API. Properties can be destructured and are all reactive.

There is no `useState` available. Getters for state properties are created automatically and accessible from `useGetters`.

```javascript
import { useGetters, useActions, useMutations } from 'vuex-use';

export default {
	name: 'SomeComponent',
	setup () {
		const { users, adminUsers } = useGetters();
		const { loadUsers, upgradeToAdmin } = useActions();

		// Namespaced module 'auth'
		const { login, logout } = useActions('auth');

		loadUsers();

		return { users, adminUsers, upgradeToAdmin, login, logout };
	},
};
```
