import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import React, { Suspense } from 'react';
import "./App.css";
import "./styles/pages.css";
import { Toast } from "./components/Toast";
import Navbar from "./components/Navbar";
import Login, { Logout, Register } from "./pages/createAdmin";
import Footer from './components/footer';
import useAdminStore from "./stores/admin.stores";
import { PageTransition } from "./components/PageTransition";

// Lazy-loaded pages for code-splitting
const Home = React.lazy(() => import('./pages/Home'));
const Us = React.lazy(() => import('./pages/Us'));
const Docs = React.lazy(() => import('./pages/docx'));
const DocView = React.lazy(() => import('./pages/doc'));
const Stories = React.lazy(() => import('./pages/Stories'));
const Story = React.lazy(() => import('./pages/Story'));
const Partners = React.lazy(() => import('./pages/Partners'));
const Contact = React.lazy(() => import('./pages/Contacts'));

function AppContent() {
	const { _hasHydrated } = useAdminStore();
	const location = useLocation();

	// Wait for auth state to be hydrated before rendering
	if (!_hasHydrated) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-surface text-primary-var h-[100vh] transition-colors duration-300">
			<Navbar />
			<Toast />
			<main className="flex-1 w-full bg-surface-2 transition-colors duration-300 py-6 overflow-x-scroll min-h-[80vh] ">
				<AnimatePresence mode="wait">
					<Suspense fallback={<div className="min-h-[40vh] flex items-center justify-center">Loading...</div>}>
						<Routes location={location} key={location.pathname}>
						<Route path="/" element={
							<PageTransition>
									<Home />
							</PageTransition>
						} />
						<Route path="/home" element={
							<PageTransition>
								<Home />
							</PageTransition>
						} />
							<Route path="/us" element={<PageTransition><Us /></PageTransition>} />
						<Route path="/login" element={
							<PageTransition>
								<div className="form-layout">
									<Login />
								</div>
							</PageTransition>
						} />
						<Route path="/logout" element={
							<PageTransition>
								<div className="form-layout">
									<Logout />
								</div>
							</PageTransition>
						} />
						<Route path="/register" element={
							<PageTransition>
								<div className="form-layout">
									<Register />
								</div>
							</PageTransition>
						} />
							<Route path="/docs" element={<PageTransition><div className="container-fluid mx-auto"><Docs /></div></PageTransition>} />
							<Route path="/docs/:id" element={<PageTransition><div className="container-fluid mx-auto"><DocView /></div></PageTransition>} />
							<Route path="/contact" element={<PageTransition><div className="contact-layout container-fluid mx-auto"><Contact /></div></PageTransition>} />
							<Route path="/stories" element={<PageTransition><div className="stories-grid container-fluid mx-auto"><Stories /></div></PageTransition>} />
							<Route path="/stories/:id" element={<PageTransition><div className="story-detail container-fluid mx-auto"><Story /></div></PageTransition>} />
							<Route path="/partners" element={<PageTransition><div className="partners-showcase container-fluid mx-auto"><Partners /></div></PageTransition>} />
						<Route path="/admin" element={
							<PageTransition>
								<div className="dashboard-grid container-fluid mx-auto">
									<Login />
								</div>
							</PageTransition>
						} />
						</Routes>
					</Suspense>
				</AnimatePresence>
			</main>
			<Footer />
		</div>
	);
}

function App() {
	return (
		<BrowserRouter>
			<AppContent />
		</BrowserRouter>
	);
}

export default App;
