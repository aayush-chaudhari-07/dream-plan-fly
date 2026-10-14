import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { l as setStoreAuthUser, s as migrateGuestDataFn } from "./smarttrip-store-B4h7bmlO.mjs";
import { n as isSupabaseConfigured, t as getSupabaseBrowserClient } from "./client-Hc8aN5M7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-context-BwjyU4uq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AuthContext = (0, import_react.createContext)(void 0);
var GUEST_STORAGE_KEY = "smarttrip.state.v1";
function AuthProvider({ children }) {
	const [user, setUser] = (0, import_react.useState)(null);
	const [session, setSession] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const isConfigured = isSupabaseConfigured();
	(0, import_react.useEffect)(() => {
		if (!isConfigured) {
			setIsLoading(false);
			return;
		}
		const supabase = getSupabaseBrowserClient();
		supabase.auth.getSession().then((result) => {
			const currentSession = result.data.session;
			setSession(currentSession);
			const initialUser = currentSession?.user ?? null;
			setUser(initialUser);
			setStoreAuthUser(initialUser);
			setIsLoading(false);
		});
		const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
			setSession(newSession);
			const currentUser = newSession?.user ?? null;
			setUser(currentUser);
			setStoreAuthUser(currentUser);
			setIsLoading(false);
			if (event === "SIGNED_IN" && currentUser) {
				const migrationKey = `smarttrip.migrated.${currentUser.id}`;
				if (typeof window !== "undefined" && !localStorage.getItem(migrationKey)) try {
					const raw = localStorage.getItem(GUEST_STORAGE_KEY);
					if (raw) {
						const parsed = JSON.parse(raw);
						await migrateGuestDataFn({ data: parsed });
						localStorage.setItem(migrationKey, "true");
					}
				} catch (e) {
					console.error("Failed to migrate guest data:", e);
				}
			}
		});
		return () => {
			subscription.unsubscribe();
		};
	}, [isConfigured]);
	const signInWithPassword = async ({ email, password }) => {
		if (!isConfigured) return { error: "Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY." };
		const { error } = await getSupabaseBrowserClient().auth.signInWithPassword({
			email,
			password
		});
		if (error) return { error: error.message };
		return {};
	};
	const signUpWithPassword = async ({ email, password, fullName }) => {
		if (!isConfigured) return { error: "Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY." };
		const { data, error } = await getSupabaseBrowserClient().auth.signUp({
			email,
			password,
			options: { data: { full_name: fullName || "" } }
		});
		if (error) return { error: error.message };
		return { user: data.user };
	};
	const signInWithGoogle = async () => {
		if (!isConfigured) return { error: "Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY." };
		const supabase = getSupabaseBrowserClient();
		const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : void 0;
		const { error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			...redirectTo ? { options: { redirectTo } } : {}
		});
		if (error) return { error: error.message };
		return {};
	};
	const signOut = async () => {
		if (!isConfigured) {
			setUser(null);
			setSession(null);
			setStoreAuthUser(null);
			return;
		}
		await getSupabaseBrowserClient().auth.signOut();
		setUser(null);
		setSession(null);
		setStoreAuthUser(null);
	};
	const updateProfile = async (data) => {
		if (!user) return { error: "Please sign in to update your profile." };
		const updatedMeta = { ...user.user_metadata || {} };
		if (data.fullName !== void 0) updatedMeta["full_name"] = data.fullName;
		if (data.avatarUrl !== void 0) updatedMeta["avatar_url"] = data.avatarUrl;
		if (data.homeCity !== void 0) updatedMeta["home_city"] = data.homeCity;
		if (data.currency !== void 0) updatedMeta["currency"] = data.currency;
		if (!isConfigured) {
			const updatedUser = {
				...user,
				user_metadata: updatedMeta
			};
			setUser(updatedUser);
			return {};
		}
		const { data: res, error } = await getSupabaseBrowserClient().auth.updateUser({ data: updatedMeta });
		if (error) return { error: error.message };
		if (res.user) setUser(res.user);
		return {};
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value: {
			user,
			session,
			isLoading,
			isConfigured,
			signInWithPassword,
			signUpWithPassword,
			signInWithGoogle,
			signOut,
			updateProfile
		},
		children
	});
}
function useAuth() {
	const context = (0, import_react.useContext)(AuthContext);
	if (!context) throw new Error("useAuth must be used within an AuthProvider");
	return context;
}
//#endregion
export { useAuth as n, AuthProvider as t };
