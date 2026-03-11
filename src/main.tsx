import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import "./index.scss";
import { PageWelcome } from "./pages/PageWelcome.tsx";
import { PageAbout } from "./pages/PageAbout.tsx";
import { Page404 } from "./pages/Page404.tsx";
import { StoreProvider } from 'easy-peasy';
import { store } from './store/store.ts';
import { PageLinks } from "./pages/PageLinks.tsx";
import { PagePronunciation } from "./pages/PagePronunciation.tsx";
import { Suspense, lazy } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const PageFlashcards = lazy(() => import("./pages/PageFlashcards.tsx").then(module => ({ default: module.PageFlashcards })));

const router = createBrowserRouter([
	{
		path: "/",
		errorElement: <Page404 />,
		element: <App />,
		children: [
			{
				path: "/welcome",
				element: <PageWelcome />,
			},
			{
				path: "links",
				element: <PageLinks />
			},
			{
				path: "pronunciation",
				element: <PagePronunciation />
			},
			{
				path: "flashcards",
				element: (
					<Suspense fallback={
						<div className="p-12 text-slate-200 flex flex-col items-center justify-center gap-4">
							<AiOutlineLoading3Quarters className="animate-spin text-3xl text-blue-400" />
							<div className="text-center animate-pulse font-medium">Loading phrases...</div>
						</div>
					}>
						<PageFlashcards />
					</Suspense>
				)
			},
			{
				path: "about",
				element: <PageAbout />,
			},
			{
				path: "/",
				element: <Navigate to="/welcome" replace />,
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
	<StoreProvider store={store}>
		<RouterProvider router={router} />
	</StoreProvider>
);
