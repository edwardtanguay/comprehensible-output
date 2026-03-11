import { Outlet } from "react-router-dom";
import { Header } from "./components/Header";
import { useTypedStoreActions } from "./store/hooks";
import { useEffect } from "react";

function App() {
	const { initialize } = useTypedStoreActions((actions) => actions.mainModel);

	useEffect(() => {
		initialize();
	}, [initialize]);

	return (
		<main className="bg-slate-800 p-4 w-full md:w-[60rem] mt-0 md:mt-6 shadow-2xl rounded-lg border border-slate-700">
			<Header />
			<main className="py-4">
				<Outlet />
			</main>
		</main>
	);
}

export default App;
