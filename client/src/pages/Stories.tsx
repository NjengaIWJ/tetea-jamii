import React, {
	useCallback,
	useEffect,
	useRef,
	useState,
	type FormEvent,
} from "react";
import { useLocation } from "react-router-dom";
import { LucideLoaderPinwheel, X } from "lucide-react";
import Section from "../components/Section";
import StoryCard from "../components/StoryCard";
import EditStoryModal from "../components/EditStoryModal";
import DropZone from "../components/DropZone";

import { useGetInfo, usePostInfo } from "../api/api";
import api from "../api/axios";
import { useToastStore } from "../stores/toast.store";
import useAdminStore from "../stores/admin.stores";

interface StoryAPI {
	_id: string;
	title: string;
	content: string;
	media?: string | string[];
}

interface Story {
	id: string;
	title: string;
	content: string;
	media: string[];
}

import type { EditFormData, PreviewItem } from '../components/EditStoryModal';

const MAX_IMAGE_DIMENSION = 1920;
const IMAGE_QUALITY = 0.8;
const MAX_FILES = 8;

const Stories: React.FC = () => {
	const location = useLocation();
	const { data, isError, error, isPending, refetch } = useGetInfo<StoryAPI[]>(import.meta.env.VITE_APP_ARTS_URL);
	const {
		mutate,
		isError: isPostError,
		error: postError,
		isPending: isPostPending,
	} = usePostInfo(import.meta.env.VITE_APP_ARTS_URL);
	const admin = useAdminStore((s) => s.admin);
	const addToast = useToastStore((s) => s.addToast);

	const [stories, setStories] = useState<Story[]>([]);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [previewItems, setPreviewItems] = useState<PreviewItem[]>([]);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editForm, setEditForm] = useState<EditFormData | null>(null);
	const [editPending, setEditPending] = useState(false);
	const [deletePendingId, setDeletePendingId] = useState<string | null>(null);

	const urlSetRef = useRef<Set<string>>(new Set());
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	// Helper: unique id
	const makeId = useCallback(() => {
		if (crypto?.randomUUID) return crypto.randomUUID();
		return Math.random().toString(36).slice(2, 9);
	}, []);

	// Handle error toast
	useEffect(() => {
		if (isError && error) {
			addToast(error.message || "Failed to load stories", "error");
		}
	}, [isError, error, addToast]);

	// Normalize fetched stories
	useEffect(() => {
		if (!data) return;
		const normalized = data.map((item: StoryAPI) => {
			let mediaArr: string[] = [];
			if (Array.isArray(item.media)) {
				mediaArr = item.media.filter((m) => typeof m === "string");
			} else if (typeof item.media === "string") {
				mediaArr = [item.media];
			}
			return {
				id: item._id,
				title: item.title,
				content: item.content,
				media: mediaArr,
			};
		});
		setStories(normalized);
	}, [data]);

	// Cleanup on unmount: revoke all object URLs
	useEffect(() => {
		const urls = urlSetRef.current;
		return () => {
			urls.forEach((url) => URL.revokeObjectURL(url));
			urls.clear();
		};
	}, []);

	// Cleanup when previewItems change (remove old URLs)
	useEffect(() => {
		const toDelete: string[] = [];
		urlSetRef.current.forEach((url) => {
			const exists = previewItems.find((pi) => pi.url === url);
			if (!exists) {
				toDelete.push(url);
			}
		});
		toDelete.forEach((url) => {
			URL.revokeObjectURL(url);
			urlSetRef.current.delete(url);
		});
	}, [previewItems]);

	// Compress image
	const compressImage = useCallback(async (file: File): Promise<File> => {
		if (!file.type.startsWith("image/") || typeof createImageBitmap !== "function") {
			return file;
		}
		try {
			const imgBitmap = await createImageBitmap(file);
			const { width, height } = imgBitmap;
			let targetWidth = width;
			let targetHeight = height;

			if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
				if (width >= height) {
					targetWidth = MAX_IMAGE_DIMENSION;
					targetHeight = Math.round((height / width) * MAX_IMAGE_DIMENSION);
				} else {
					targetHeight = MAX_IMAGE_DIMENSION;
					targetWidth = Math.round((width / height) * MAX_IMAGE_DIMENSION);
				}
			}

			const canvas = document.createElement("canvas");
			canvas.width = targetWidth;
			canvas.height = targetHeight;
			const ctx = canvas.getContext("2d");
			if (!ctx) return file;

			ctx.drawImage(imgBitmap, 0, 0, targetWidth, targetHeight);

			const blob = await new Promise<Blob | null>((resolve) => {
				const mime = file.type === "image/png" ? "image/png" : "image/jpeg";
				canvas.toBlob((b) => resolve(b), mime, IMAGE_QUALITY);
			});

			if (!blob) return file;
			const newFile = new File([blob], file.name, { type: blob.type, lastModified: Date.now() });
			return newFile;
		} catch (err) {
			console.warn("Image compression failed:", err);
			useToastStore.getState().addToast("Image compression failed, using original file", "warning");
			return file;
		}
	}, []);

	// Process files: compress, generate preview, limit count
	const processFiles = useCallback(
		async (files: FileList | File[]) => {
			const arr = Array.from(files);
			if (previewItems.length + arr.length > MAX_FILES) {
				addToast(`You can only upload up to ${MAX_FILES} images.`, "error");
				return;
			}
			const newPreviews: PreviewItem[] = [];
			for (const file of arr) {
				const compressed = await compressImage(file);
				const url = URL.createObjectURL(compressed);
				urlSetRef.current.add(url);
				const id = `${makeId()}-${compressed.name}-${compressed.size}`;
				newPreviews.push({ id, file: compressed, url });
				// allow UI to remain responsive
				await new Promise((r) => setTimeout(r, 0));
			}
			setPreviewItems((prev) => [...prev, ...newPreviews]);
		},
		[previewItems.length, compressImage, makeId, addToast]
	);



	const handleRemovePreview = useCallback((id: string) => {
		setPreviewItems((prev) => {
			const found = prev.find((pi) => pi.id === id);
			if (found) {
				URL.revokeObjectURL(found.url);
				urlSetRef.current.delete(found.url);
			}
			return prev.filter((pi) => pi.id !== id);
		});
	}, []);

	const clearForm = useCallback(() => {
		previewItems.forEach((pi) => {
			URL.revokeObjectURL(pi.url);
			urlSetRef.current.delete(pi.url);
		});
		setPreviewItems([]);
		setTitle("");
		setContent(""); 
		if (fileInputRef.current) fileInputRef.current.value = "";
	}, [previewItems]);

	const handleSubmit = useCallback(
		(e: FormEvent) => {
			e.preventDefault();
			if (!title.trim() || !content.trim()) {
				addToast("Title and Content are required.", "error");
				return;
			}
			const form = new FormData();
			form.append("title", title);
			form.append("content", content);
			previewItems.forEach((pi) => {
				if (pi.file) form.append("article", pi.file);
			});




			mutate(form, {
				onSuccess: () => {
					refetch?.();
					clearForm();
					addToast("Story posted successfully!", "success");
				},
				onError: (err) => {
					console.error("Post failed:", err);
					addToast("Failed to post the story.", "error");
				},
			});
		},
		[title, content, previewItems, mutate, refetch, clearForm, addToast]
	);

	const handleDelete = async (id: string) => {
		if (!confirm('Delete story? This action cannot be undone.')) return;
		setDeletePendingId(id);
		try {
			await api.delete(`/articles/${id}`);
			addToast('Story deleted successfully!', 'success');
			refetch?.();
		} catch (err) {
			console.error('Delete failed:', err);
			addToast('Failed to delete story.', 'error');
		} finally {
			setDeletePendingId(null);
		}
	};

	const handleEditSubmit = async () => {
		if (!editingId || !editForm) return;
		setEditPending(true);
		try {
			const fd = new FormData();
			fd.append('title', editForm.title);
			fd.append('content', editForm.content);

			// Handle image updates if any new files were added
			const newFiles = editForm.previewItems.filter(pi => pi.file);
			newFiles.forEach(pi => {
				if (pi.file) fd.append('article', pi.file);
			});

			await api.put(`/articles/${editingId}`, fd);
			addToast('Story updated successfully!', 'success');
			refetch?.();
			setEditingId(null);
			setEditForm(null);
		} catch (err) {
			console.error('Update failed:', err);
			addToast('Failed to update story.', 'error');
		} finally {
			setEditPending(false);
		}
	};

	const handleEditPreviewAdd = async (files: FileList | File[]) => {
		if (!editForm) return;
		const arr = Array.from(files);
		if (editForm.previewItems.length + arr.length > MAX_FILES) {
			addToast(`You can only upload up to ${MAX_FILES} images.`, 'error');
			return;
		}
		const newPreviews: PreviewItem[] = [];
		for (const file of arr) {
			const compressed = await compressImage(file);
			const url = URL.createObjectURL(compressed);
			urlSetRef.current.add(url);
			const id = `${makeId()}-${compressed.name}-${compressed.size}`;
			newPreviews.push({ id, file: compressed, url });
		}
		setEditForm(old => old ? {
			...old,
			previewItems: [...old.previewItems, ...newPreviews]
		} : null);
	};

	const handleEditPreviewRemove = (id: string) => {
		if (!editForm) return;
		setEditForm(old => {
			if (!old) return null;
			const item = old.previewItems.find(pi => pi.id === id);
			if (item?.url.startsWith('blob:')) {
				URL.revokeObjectURL(item.url);
				urlSetRef.current.delete(item.url);
			}
			return {
				...old,
				previewItems: old.previewItems.filter(pi => pi.id !== id)
			};
		});
	};

	// Sub-components
	const PreviewGrid: React.FC = () => (
		<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
			{previewItems.map((pi) => (
				<div key={pi.id} className="relative group overflow-hidden rounded-lg shadow-lg bg-surface-2">
					<img
						src={pi.url}
						alt={pi.file?.name || 'Story preview image'}
						className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
						loading="lazy"
					/>
					<button
						type="button"
						aria-label={`Remove ${pi.file?.name || 'preview image'}`}
						onClick={() => handleRemovePreview(pi.id)}
						className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
					>
						<X size={24} className="text-white" />
					</button>
					<div className="absolute bottom-0 left-0 w-full bg-surface-2 px-2 py-1 text-xs text-primary-var truncate">
						{pi.file?.name || 'Uploaded image'}
					</div>
				</div>
			))}
		</div>
	);

	// Using shared StoryCard component for consistency and reuse

	return (
		<main className="min-h-screen bg-surface text-primary-var p-4 flex flex-col items-center">
			<Section size="xl" as="header" className="text-center mb-6">
				<h1 className="text-4xl sm:text-5xl font-extrabold text-accent">Stories from Our Community</h1>
				<p className="mt-3 text-secondary-var max-w-2xl mx-auto">Read personal accounts of change, resilience, and hope from Takaungu and surrounding areas. If you're part of our team, share a story to inspire others.</p>
			</Section>

			{isError && (
				<div
					role="alert"
					aria-live="assertive"
					className="bg-red-600 rounded-md px-4 py-2 mb-4 w-full max-w-xl"
				>
					<h2 className="font-bold">Fetch Error</h2>
					<p>{error?.message || "Something went wrong fetching stories."}</p>
				</div>
			)}

			{isPending && (
				<div
					className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-md mb-4"
					aria-live="polite"
				>
					<LucideLoaderPinwheel className="animate-spin" aria-hidden="true" />
					<span>Loading stories...</span>
				</div>
			)}

			<Section size="lg" as="section">
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6 w-full">
					{stories.length > 0 ? (
						stories.map((story) => (
							<StoryCard
								key={story.id}
								story={story}
								onEdit={admin ? () => {
									setEditingId(story.id);
									setEditForm({
										title: story.title,
										content: story.content,
										previewItems: story.media.map((url, i) => ({
											id: `existing-${story.id}-${i}`,
											file: null as File | null,
											url
										}))
									});
								} : undefined}
								onDelete={admin ? () => handleDelete(story.id) : undefined}
								isDeleting={deletePendingId === story.id}
							/>
						))
					) : (
							<p className="text-secondary-var text-center col-span-full p-6 bg-surface-2 rounded-lg border border-surface">No stories available.</p>
					)}
				</div>
			</Section>

			<EditStoryModal
				form={editForm}
				maxFiles={MAX_FILES}
				isOpen={Boolean(editingId && editForm)}
				isPending={editPending}
				onClose={() => {
					setEditingId(null);
					setEditForm(null);
				}}
				onSubmit={handleEditSubmit}
				onFormChange={setEditForm}
				onFilesAdded={handleEditPreviewAdd}
				onFileRemove={handleEditPreviewRemove}
			/>

			{/* Create Form */}
				{admin && location.pathname.startsWith('/stories') && (
				<form onSubmit={handleSubmit} encType="multipart/form-data" className="w-full max-w-2xl bg-surface-2 rounded-2xl shadow p-4 space-y-6 border border-surface" aria-busy={isPostPending}>
					<div>
						<label htmlFor="title" className="block text-md font-medium mb-2 text-primary-var">Title</label>
						<input
							id="title"
							type="text"
							placeholder="Your story title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
							disabled={isPostPending}
							className="input-base"
						/>
					</div>

					<DropZone
						onFilesAdded={processFiles}
						disabled={isPostPending}
						maxFiles={MAX_FILES}
					/>

					{previewItems.length > 0 && <PreviewGrid />}

					<div>
						<label htmlFor="content" className="block text-md font-medium mb-2 text-primary-var">Content</label>
						<textarea
							id="content"
							placeholder="Tell your story..."
							value={content}
							onChange={(e) => setContent(e.target.value)}
							required
							rows={5}
							disabled={isPostPending}
							className="input-base"
						/>
					</div>

					<button
						type="submit"
						disabled={isPostPending}
						className={"btn btn-primary w-full"}
					>
						{isPostPending ? (
							<>
								<LucideLoaderPinwheel className="animate-spin" aria-hidden="true" />
								<span>Posting...</span>
							</>
						) : (
								"Share Your Story"
						)}
					</button>

					{isPostError && (
						<div
							role="alert"
							aria-live="assertive"
							className="bg-red-600 rounded-md px-4 py-2 text-sm text-white mt-2"
						>
								{(postError as Error)?.message || "Something went wrong posting your story."}
						</div>
					)}
				</form>
			)}
		</main>
	);
};

export default Stories;

