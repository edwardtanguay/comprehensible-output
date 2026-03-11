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
					<Suspense fallback={<div className="p-6 text-slate-500 animate-pulse">Loading phrases...</div>}>
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
