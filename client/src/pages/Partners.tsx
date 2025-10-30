import React, {
	useEffect,
	useRef,
	useState,
	useCallback,
	type FormEvent,
	type ChangeEvent,
} from "react";
import { useGetInfo, usePostInfo } from "../api/api";
import { useToastStore } from "../stores/toast.store";
import { LoaderCircleIcon, LoaderPinwheel } from "lucide-react";
import useAdminStore from "../stores/admin.stores";
import { useLocation } from "react-router-dom";

interface Preview {
	file: File;
	url: string;
	id: string;
}

interface Partner {
	_id: string;
	name: string;
	media: string;
	createdAt: string;
	updatedAt: string;
}

// Constants
const MAX_IMAGE_DIMENSION = 1920;
const IMAGE_QUALITY = 0.8;

const Partners: React.FC = () => {
	// --- Data / API Hooks ---
	const { data, isError, error, isPending, refetch } = useGetInfo<Partner[]>(
		import.meta.env.VITE_APP_PARTNERS_URL
	);
	const {
		mutate,
		isError: postIsError,
		error: postError,
		isPending: postPending,
	} = usePostInfo(import.meta.env.VITE_APP_PARTNERS_URL);

	const admin = useAdminStore((s) => s.admin);
	const location = useLocation();

	// --- State ---
	const [partners, setPartners] = useState<Partner[]>([]);
	const [previewList, setPreviewList] = useState<Preview[]>([]);
	const [formState, setFormState] = useState<{
		partnerName: string;
		media: File | null;
	}>({
		partnerName: "",
		media: null,
	});

	const urlSetRef = useRef<Set<string>>(new Set());

	// --- Effects ---
	useEffect(() => {
		if (Array.isArray(data)) {
			setPartners(data);
		}
	}, [data]);

	useEffect(() => {
		return () => {
			urlSetRef.current.forEach((url) => URL.revokeObjectURL(url));
			urlSetRef.current.clear();
		};
	}, []);

	// --- Helpers ---
	const compressImage = useCallback(async (file: File): Promise<File> => {
		if (!file.type.startsWith("image/") || typeof createImageBitmap !== "function") {
			return file;
		}

		try {
			const imgBitmap = await createImageBitmap(file);
			const { width, height } = imgBitmap;

			let targetW = width;
			let targetH = height;

			if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
				if (width >= height) {
					targetW = MAX_IMAGE_DIMENSION;
					targetH = Math.round((height / width) * MAX_IMAGE_DIMENSION);
				} else {
					targetH = MAX_IMAGE_DIMENSION;
					targetW = Math.round((width / height) * MAX_IMAGE_DIMENSION);
				}
			}

			const canvas = document.createElement("canvas");
			canvas.width = targetW;
			canvas.height = targetH;
			const ctx = canvas.getContext("2d");
			if (!ctx) return file;

			ctx.drawImage(imgBitmap, 0, 0, targetW, targetH);

			const blob = await new Promise<Blob | null>((resolve) => {
				canvas.toBlob(
					(b) => resolve(b),
					file.type === "image/png" ? "image/png" : "image/jpeg",
					IMAGE_QUALITY
				);
			});

			if (!blob) return file;

			return new File([blob], file.name, {
				type: blob.type,
				lastModified: Date.now(),
			});
		} catch (err) {
			console.warn("Compression failed, using original file:", err);
			useToastStore.getState().addToast("Image compression failed, using original file", "warning");
			return file;
		}
	}, []);

	const makePreview = useCallback((file: File): Preview => {
		const url = URL.createObjectURL(file);
		urlSetRef.current.add(url);
		const id = `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
		return { file, url, id };
	}, []);

	// --- Handlers ---
	const handleFileChange = useCallback(
		async (e: ChangeEvent<HTMLInputElement>) => {
			const files = e.target.files;
			if (!files || files.length === 0) return;

			const compressed = await compressImage(files[0]);
			const preview = makePreview(compressed);

			// Clean up previous previews
			previewList.forEach((p) => {
				URL.revokeObjectURL(p.url);
				urlSetRef.current.delete(p.url);
			});

			setPreviewList([preview]);
			setFormState((old) => ({ ...old, media: compressed }));
		},
		[compressImage, makePreview, previewList]
	);

	const handleRemovePreview = useCallback((id: string) => {
		setPreviewList((oldList) => {
			const toRemove = oldList.find((p) => p.id === id);
			if (toRemove) {
				URL.revokeObjectURL(toRemove.url);
				urlSetRef.current.delete(toRemove.url);
			}
			setFormState((old) =>
				toRemove && old.media === toRemove.file ? { ...old, media: null } : old
			);
			return oldList.filter((p) => p.id !== id);
		});
	}, []);

	const handleSubmit = useCallback(
		(e: FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			const nameTrim = formState.partnerName.trim();
			if (!nameTrim || !formState.media) {
				useToastStore.getState().addToast("Please provide both partner name and image", "error");
				return;
			}

			const formData = new FormData();
			formData.append("name", nameTrim);
			formData.append("media", formState.media);

			mutate(formData, {
				onSuccess: () => {
					urlSetRef.current.forEach((u) => URL.revokeObjectURL(u));
					urlSetRef.current.clear();
					setPreviewList([]);
					setFormState({ partnerName: "", media: null });
					refetch?.();
					useToastStore.getState().addToast("Partner added successfully!", "success");
				},
				onError: (err) => {
					console.error("Error posting partner:", err);
					const msg = err instanceof Error ? err.message : "Failed to add partner";
					useToastStore.getState().addToast(msg, "error");
				},
			});
		},
		[formState, mutate, refetch]
	);

	// --- Render ---
	return (
		<main className="page-wrapper">
			<h1 className="text-3xl font-bold text-center mb-8">Our Partners</h1>
			<div className="content-container flex flex-col gap-6">

				{isError && (
					<div className="card bg-[var(--color-error-light)] text-[var(--color-error)] p-4 mb-6 max-w-2xl mx-auto">
						<h3 className="font-semibold">Oops! Something went wrong.</h3>
						<p>{(error as Error)?.message ?? "Please try again later."}</p>
					</div>
				)}

				{isPending ? (
					<div className="flex items-center justify-center gap-2 text-[var(--text-secondary)]">
						Loading… <LoaderCircleIcon className="animate-spin" />
					</div>
				) : (
					<>
							<section className="grid-container partners-grid mb-10 border-t border-b border-[var(--border-secondary)] py-8 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
							{partners.map((p) => (
								<div
									key={p._id}
									className="card flex flex-col items-center text-center p-6 hover:shadow-lg transition-shadow"
								>
									<img
										src={p.media}
										alt={p.name}
										className="w-32 h-32 object-cover rounded-full mb-4 shadow-md"
									/>
									<h3 className="font-medium text-[var(--text-primary)] text-lg">
										{p.name}
									</h3>
								</div>
							))}
						</section>

						{admin && location.pathname.startsWith("/partners") && (
								<section className="mt-10 card p-6 max-w-2xl form-container mx-auto bg-[var(--bg-secondary)] border border-[var(--border-secondary)] flex flex-col space-y-6">
									<h2 className="text-xl font-semibold">Add Partner</h2>

								{postIsError && (
										<p className="text-[var(--color-error)] mb-3">
											{postError?.toString()}
										</p>
								)}

								{postPending ? (
									<div className="flex items-center gap-2">
										Posting… <LoaderPinwheel className="animate-spin" />
									</div>
								) : (
											<form
												onSubmit={handleSubmit}
												encType="multipart/form-data"
												className="flex flex-col space-y-5"
											>
												<div>
													<label htmlFor="partnersImage" className="block font-medium mb-1">
														Partner’s Logo
													</label>
													<input
														id="partnersImage"
														name="media"
														type="file"
														accept="image/*"
														required
														className="input-base"
														disabled={postPending}
														onChange={handleFileChange}
													/>
													<div className="mt-3 grid grid-cols-2 gap-2">
														{previewList.map((pr) => (
															<div key={pr.id} className="relative rounded overflow-hidden shadow-sm">
																<img
																	src={pr.url}
																	alt="Preview"
																	className="w-full h-auto object-cover rounded-md"
																/>
																<button
																	type="button"
																	onClick={() => handleRemovePreview(pr.id)}
																	className="btn btn--icon btn-danger absolute top-1 right-1"
																	disabled={postPending}
																>
																	×
																</button>
															</div>
														))}
													</div>
												</div>

												<div>
													<label htmlFor="partnerName" className="block font-medium mb-1">
														Partner’s Name
													</label>
													<input
														id="partnerName"
														name="name"
														type="text"
														required
														value={formState.partnerName}
														onChange={(e) =>
															setFormState((old) => ({
																...old,
																partnerName: e.target.value,
															}))
														}
														placeholder="Enter partner’s name"
														className="input-base"
														disabled={postPending}
													/>
												</div>

												<div>
													<input
														type="submit"
														value="Submit"
														className="btn btn-primary"
														disabled={
															postPending ||
															!formState.partnerName.trim() ||
															!formState.media
														}
													/>
												</div>
											</form>
								)}
							</section>
						)}
					</>
				)}
			</div>
		</main>
	);
};

export default Partners;
