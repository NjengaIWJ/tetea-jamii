import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import "./App.css";
import "./styles/pages.css";
import Contact from "./pages/Contacts";
import { Toast } from "./components/Toast";
import Navbar from "./components/Navbar";
import Partners from "./pages/Partners";
import Stories from "./pages/Stories";
import Us from "./pages/Us";
import Login, { Logout, Register } from "./pages/createAdmin";
import Story from "./pages/Story";
import Footer from './components/footer';
import useAdminStore from "./stores/admin.stores";
import Docs from "./pages/docx";
import { PageTransition } from "./components/PageTransition";
import Home from "./pages/Home";
import DocView from "./pages/doc";

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
		<div className="min-h-screen  bg-gray-100 dark:bg-gray-800 text-gray-900 h-[100vh] dark:text-gray-100 transition-colors duration-300">
			<Navbar />
			<Toast />
			<main className="flex-1 w-full bg-white dark:bg-gray-900 transition-colors duration-300 py-6 overflow-x-scroll min-h-[80vh] ">
				<AnimatePresence mode="wait">
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
						<Route path="/us" element={
							<PageTransition>
								<Us />
							</PageTransition>
						} />
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
						<Route path="/docs" element={
							<PageTransition>
								<div className="container-fluid mx-auto">
									<Docs />
								</div>
							</PageTransition>
						} />
						<Route path="/docs/:id" element={
							<PageTransition>
								<div className="container-fluid mx-auto">
									<DocView />
								</div>
							</PageTransition>
						} />
						<Route path="/contact" element={
							<PageTransition>
								<div className="contact-layout container-fluid mx-auto">
									<Contact />
								</div>
							</PageTransition>
						} />
						<Route path="/stories" element={
							<PageTransition>
								<div className="stories-grid container-fluid mx-auto">
									<Stories />
								</div>
							</PageTransition>
						} />
						<Route path="/stories/:id" element={
							<PageTransition>
								<div className="story-detail container-fluid mx-auto">
									<Story />
								</div>
							</PageTransition>
						} />
						<Route path="/partners" element={
							<PageTransition>
								<div className="partners-showcase container-fluid mx-auto">
									<Partners />
								</div>
							</PageTransition>
						} />
						<Route path="/admin" element={
							<PageTransition>
								<div className="dashboard-grid container-fluid mx-auto">
									<Login />
								</div>
							</PageTransition>
						} />
					</Routes>
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
