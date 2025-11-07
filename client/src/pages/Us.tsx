import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Contact from "./Contacts";
import Section from "../components/Section";
import { useGetInfo } from "../api/api";
import { useToastStore } from "../stores/toast.store";
import { Link } from "react-router-dom";
import StoryCard from "../components/StoryCard";
import PartnerCard from "../components/PartnerCard";
import { Globe2, BookOpen, Users, ArrowLeft, ArrowRight } from "lucide-react";
import backgrond from "../assets/Background.jpeg";

interface StoryAPI {
	_id: string;
	title: string;
	content: string;
	media?: string | string[];
}

interface Partner {
	_id: string;
	name: string;
	media: string;
}

const Us: React.FC = () => {
	const { data: storiesData, isError: storiesErr, error: storiesError } = useGetInfo<StoryAPI[]>(import.meta.env.VITE_APP_ARTS_URL);
	const { data: partnersData, isError: partnersErr, error: partnersError } = useGetInfo<Partner[]>(import.meta.env.VITE_APP_PARTNERS_URL);
	const addToast = useToastStore((s) => s.addToast);

	useEffect(() => {
		if (storiesErr && storiesError) addToast(storiesError.message || "Failed to load stories", "error");
		if (partnersErr && partnersError) addToast((partnersError as Error)?.message || "Failed to load partners", "error");
	}, [storiesErr, storiesError, partnersErr, partnersError, addToast]);

	const stories = useMemo(() => {
		if (!Array.isArray(storiesData)) return [];
		return storiesData.map((s) => ({ id: s._id, title: s.title, content: s.content, media: Array.isArray(s.media) ? s.media : (s.media ? [s.media] : []) }));
	}, [storiesData]);

	const partners = useMemo(() => (Array.isArray(partnersData) ? partnersData : []), [partnersData]);

	// partner scroller ref
	const scrollerRef = useRef<HTMLDivElement | null>(null);
	const [currentIndex, setCurrentIndex] = useState(0);

	const scrollBy = useCallback((dir: 'left' | 'right') => {
		const el = scrollerRef.current; if (!el) return;
		const amount = el.clientWidth * 0.7;
		el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
	}, []);

	const onScroll = useCallback(() => {
		const el = scrollerRef.current; if (!el) return;
		const center = el.scrollLeft + el.clientWidth / 2;
		const children = Array.from(el.children) as HTMLElement[];
		if (children.length === 0) return;
		let nearest = 0;
		let min = Infinity;
		children.forEach((ch, i) => {
			const chCenter = ch.offsetLeft + ch.clientWidth / 2;
			const diff = Math.abs(chCenter - center);
			if (diff < min) {
				min = diff;
				nearest = i;
			}
		});
		setCurrentIndex(nearest);
	}, []);

	const scrollToIndex = useCallback((i: number) => {
		const el = scrollerRef.current; if (!el) return;
		const child = el.children[i] as HTMLElement | undefined;
		if (!child) return;
		el.scrollTo({ left: child.offsetLeft, behavior: 'smooth' });
	}, []);

	useEffect(() => {
		const el = scrollerRef.current;
		if (!el) return;
		el.addEventListener('scroll', onScroll, { passive: true });
		// initial
		onScroll();
		return () => el.removeEventListener('scroll', onScroll as EventListener);
	}, [onScroll]);

	return (
		<main className="relative min-h-screen bg-[#f8fafc] dark:bg-gray-950 text-gray-800 dark:text-gray-100">
			{/* Hero - allow background image */}
			<section
				className="w-full py-20 px-4 sm:px-8 flex items-center"
				style={{
					backgroundImage: `linear-gradient(to bottom right, rgba(6,95,70,0.06), rgba(6,95,70,0.02)), url(${backgrond})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}}
			>
				<div className="max-w-4xl mx-auto text-center">
					<h1 className="text-4xl sm:text-5xl font-extrabold text-green-900 dark:text-green-300 mb-4">About Tetea Jamii</h1>
					<p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-700 dark:text-gray-200 mb-6">
						We are a community-based organization in Takaungu, Kilifi County, Kenya, transforming lives through justice, empowerment, and sustainability.
					</p>
					<div className="flex gap-3 justify-center">
						<Link to="/contacts" className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition">
							<Globe2 className="w-5 h-5" /> Contact Us
						</Link>
						<Link to="/stories" className="inline-flex items-center gap-2 bg-white text-green-700 px-6 py-3 rounded-full font-medium border border-green-200 hover:bg-green-50 transition">
							<BookOpen className="w-5 h-5" /> Our Stories
						</Link>
					</div>
				</div>
			</section>

			{/* Mission / Vision */}
			<Section size="md">
				<h2 className="text-3xl sm:text-4xl font-bold text-green-800 dark:text-green-300 mb-4 text-center">Our Mission & Vision</h2>
				<p className="text-lg text-gray-700 dark:text-gray-200 text-center mb-6">
					Our vision is a just, sustainable, and empowered society where every individual can live with dignity, purpose, and opportunity. Our mission is to promote justice, nurture talent, and build sustainable livelihoods through mentorship, advocacy, and community-driven solutions.
				</p>
			</Section>

			{/* Stories preview (small) */}
			<Section size="lg">
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-2xl font-bold text-green-800 dark:text-green-300 flex items-center gap-2"><BookOpen className="w-5 h-5" /> Stories</h3>
					<Link to="/stories" className="text-sm text-green-600 hover:underline">See all stories →</Link>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{stories.length === 0 ? (
						<div className="col-span-full p-6 bg-white dark:bg-gray-800 rounded-xl shadow text-center">No stories yet.</div>
					) : (
						stories.slice(0, 4).map((s) => (
							<StoryCard key={s.id} story={s} />
						))
					)}
				</div>
			</Section>

			{/* Partners horizontal scroller */}
			<section className="py-8 bg-white dark:bg-gray-900">
				<Section size="lg" as="div">
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-2xl font-bold text-green-800 dark:text-green-300 flex items-center gap-2"><Users className="w-5 h-5" /> Partners</h3>
						<div className="flex items-center gap-2">
							<button aria-label="scroll left" onClick={() => scrollBy('left')} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><ArrowLeft className="w-4 h-4" /></button>
							<button aria-label="scroll right" onClick={() => scrollBy('right')} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><ArrowRight className="w-4 h-4" /></button>
						</div>
					</div>

					<div
						ref={scrollerRef}
						className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar py-4"
						role="list"
						aria-label="Partners carousel"
						tabIndex={0}
						onKeyDown={(e) => {
							if (e.key === 'ArrowLeft') { e.preventDefault(); scrollBy('left'); }
							if (e.key === 'ArrowRight') { e.preventDefault(); scrollBy('right'); }
							if (e.key === 'Home') { e.preventDefault(); scrollToIndex(0); }
							if (e.key === 'End') { e.preventDefault(); scrollToIndex(partners.length - 1); }
						}}
					>
						{partners.length === 0 ? (
							<div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow">No partners yet.</div>
						) : (
							partners.map((p) => (
								// each item gets a responsive min-width so several previews are visible
								<div
									key={p._id}
									role="listitem"
									aria-posinset={partners.indexOf(p) + 1}
									aria-setsize={partners.length}
									className="snap-center flex-shrink-0 min-w-[180px] sm:min-w-[220px] md:min-w-[260px] lg:min-w-[300px]"
									style={{ scrollSnapAlign: 'center' }}
								>
									{/* PartnerCard is keyboard-focusable; when focused we scroll it into view */}
									<div onFocus={() => scrollToIndex(partners.indexOf(p))}>
										<PartnerCard partner={p} className="h-full" />
									</div>
								</div>
							))
						)}
					</div>

					{/* pagination dots (separate from items) */}
					{partners.length > 1 && (
						<div className="flex items-center justify-center gap-2 mt-4">
							{partners.map((_, i) => (
								<button
									key={`dot-${i}`}
									aria-label={`Go to partner ${i + 1}`}
									onClick={() => scrollToIndex(i)}
									className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? 'bg-green-700' : 'bg-gray-300 dark:bg-gray-600'}`}
								/>
							))}
						</div>
					)}
				</Section>
			</section>

			{/* Contact */}
			<section className="py-8">
				<Section size="lg" as="div">
							<Contact />
				</Section>
			</section>
		</main>
	);
};

export default Us;
