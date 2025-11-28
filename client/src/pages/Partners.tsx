import React from "react";
import Section from "../components/Section";
import PartnerCard from "../components/PartnerCard";
import { useGetInfo, usePostInfo } from "../api/api";
import api from "../api/axios";
import { useToastStore } from "../stores/toast.store";
import { useQueryClient } from "@tanstack/react-query";
import { compressImage } from "../utils/imageCompression";

type Partner = { _id: string; name: string; media: string };

const Partners: React.FC = () => {
	const { data: partners = [], isLoading } = useGetInfo<Partner[]>("/partners");
	const postMut = usePostInfo("/partners");
	const qc = useQueryClient();
	const toast = useToastStore((s) => s.addToast);

	const [addName, setAddName] = React.useState("");
	const [addFile, setAddFile] = React.useState<File | null>(null);
	const [addPreview, setAddPreview] = React.useState<string | null>(null);
	const [postPending, setPostPending] = React.useState(false);

	const [editing, setEditing] = React.useState<{
		open: boolean;
		id?: string;
		name: string;
		file?: File | null;
		preview?: string | null;
	}>({ open: false, name: "" });
	const [deletePendingId, setDeletePendingId] = React.useState<string | null>(null);

	React.useEffect(() => {
		if (!addFile) {
			setAddPreview(null);
			return;
		}
		const url = URL.createObjectURL(addFile);
		setAddPreview(url);
		return () => URL.revokeObjectURL(url);
	}, [addFile]);

	const onAddFileChange = (f?: File | null) => setAddFile(f ?? null);

	const handleAddSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!addName.trim() || !addFile) return;
		setPostPending(true);
		try {
			const compressed = await compressImage(addFile);
			const fd = new FormData();
			fd.append("name", addName.trim());
			fd.append("media", compressed, compressed.name);
			await postMut.mutateAsync(fd as unknown as Record<string, unknown>);
			await qc.invalidateQueries({ queryKey: ["/partners"] });
			setAddName("");
			setAddFile(null);
			setAddPreview(null);
			toast("Partner added", "success");
		} catch (err) {
			console.error(err);
			toast("Failed to add partner", "error");
		} finally {
			setPostPending(false);
		}
	};

	const openEdit = (p: Partner) => setEditing({ open: true, id: p._id, name: p.name, preview: p.media });
	const closeEdit = () => {
		if (editing.preview && editing.preview.startsWith("blob:")) URL.revokeObjectURL(editing.preview);
		setEditing({ open: false, name: "" });
	};
	const onEditFileChange = (file?: File | null) => {
		if (editing.preview && editing.preview.startsWith("blob:")) URL.revokeObjectURL(editing.preview);
		if (!file) return setEditing((old) => ({ ...old, file: null, preview: undefined }));
		const url = URL.createObjectURL(file);
		setEditing((old) => ({ ...old, file, preview: url }));
	};

	const handleEditSave = async () => {
		if (!editing.id) return;
		try {
			const fd = new FormData();
			fd.append("name", editing.name.trim());
			if (editing.file) {
				const compressed = await compressImage(editing.file);
				fd.append("media", compressed, compressed.name);
			}
			await api.patch(`/partners/${editing.id}`, fd);
			toast("Partner updated", "success");
			await qc.invalidateQueries({ queryKey: ["/partners"] });
			closeEdit();
		} catch (err) {
			console.error(err);
			toast("Failed to update partner", "error");
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Delete partner? This action cannot be undone.")) return;
		setDeletePendingId(id);
		try {
			await api.delete(`/partners/${id}`);
			toast("Partner deleted", "success");
			await qc.invalidateQueries({ queryKey: ["/partners"] });
		} catch (err) {
			console.error(err);
			toast("Failed to delete partner", "error");
		} finally {
			setDeletePendingId(null);
		}
	};

	return (
		<main>
			<Section size="lg" as="header" className="text-center mb-6">
				<h1 className="text-3xl font-bold">Our Partners</h1>
				<p className="text-secondary-var mt-2">Organizations and groups that collaborate with Tetea Jamii</p>
			</Section>

			<Section size="lg">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{isLoading ? (
						<div>Loading...</div>
					) : (
							partners.map((p) => (
								<div key={p._id} className="relative">
									<PartnerCard partner={p} />
									<div className="absolute top-2 right-2 flex gap-2">
										<button onClick={() => openEdit(p)} className="px-3 py-1 rounded-full bg-surface-2 text-primary-var text-sm">
											Edit
										</button>
										<button
										onClick={() => handleDelete(p._id)}
										disabled={deletePendingId === p._id}
										className="px-3 py-1 rounded-full bg-red-600 text-white text-sm"
									>
										{deletePendingId === p._id ? "Deleting..." : "Delete"}
									</button>
								</div>
							</div>
						))
					)}
				</div>

				<section className="mt-10 bg-surface-2 rounded-2xl p-6 max-w-2xl mx-auto shadow">
					<h2 className="text-xl font-semibold mb-3">Add partner</h2>
					<form onSubmit={handleAddSubmit} className="space-y-4">
						<div>
							<label htmlFor="partnerName" className="block font-medium mb-1 text-primary-var">
								Partner’s Name
							</label>
							<input
								id="partnerName"
								name="name"
								type="text"
								required
								value={addName}
								onChange={(e) => setAddName(e.target.value)}
								placeholder="Enter partner’s name"
								className="input-base"
								disabled={postPending}
							/>
						</div>

						<div>
							<label className="block font-medium mb-1 text-primary-var">Logo / Image</label>
							<input type="file" accept="image/*" onChange={(e) => onAddFileChange(e.target.files?.[0] ?? null)} disabled={postPending} />
							{addPreview && (
								<div className="mt-2">
									<img src={addPreview} alt="preview" className="w-32 h-32 object-cover rounded" />
								</div>
							)}
						</div>

						<div>
							<button
								type="submit"
								disabled={postPending || !addName.trim() || !addFile}
								className="btn-primary btn"
							>
								{postPending ? "Adding..." : "Add Partner"}
							</button>
						</div>
					</form>
				</section>

				{editing.open && (
					<div
						role="dialog"
						aria-modal="true"
						className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
						onClick={(e) => {
							if (e.target === e.currentTarget) closeEdit();
						}}
					>
						<div className="bg-surface p-6 rounded-lg max-w-lg w-full">
							<h3 className="text-lg font-semibold mb-3">Edit partner</h3>
							<div className="space-y-4">
								<div>
									<label className="block font-medium mb-1">Name</label>
									<input value={editing.name} onChange={(e) => setEditing((old) => ({ ...old, name: e.target.value }))} className="input-base" />
								</div>
								<div>
									<label className="block font-medium mb-1">Image</label>
									<input type="file" accept="image/*" onChange={(e) => onEditFileChange(e.target.files?.[0] ?? null)} />
									{editing.preview && <img src={editing.preview} alt="preview" className="w-32 h-32 object-cover rounded mt-2" />}
								</div>
								<div className="flex justify-end gap-2">
									<button onClick={closeEdit} className="px-4 py-2 rounded btn-ghost">
										Cancel
									</button>
									<button onClick={handleEditSave} className="px-4 py-2 rounded btn-primary">
										Save
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
			</Section>
		</main>
	);
};

export default Partners;