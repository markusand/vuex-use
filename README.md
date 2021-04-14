# vuex-use
Helpers `useGetters` `useActions` `useMutations` to access the Vuex 4 store using Vue 3 Composition API. Properties can be destructured and are all reactive.

There is no `useState` available. Getters for state properties are created automatically and accessible from `useGetters`.

```javascript
import { useGetters, useActions, useMutations, useModel } from 'vuex-use';

export default {
	name: 'SomeComponent',
	setup () {
		const { users, adminUsers } = useGetters();
		const { loadUsers, upgradeToAdmin } = useActions();

		// Namespaced module 'auth'
		const { login, logout } = useActions('auth');

		// User has getter and setter and can be used directly in v-model
		// Getter accepts dot notation to access nested objects
		const username = useModel('user.username', 'SET_USERNAME');

		loadUsers();

		return { user, users, adminUsers, upgradeToAdmin, login, logout };
	},
};
```
