"use client";

import Image from 'next/image';
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation';

import FormField from './FormField';
import Button from './Button';
import CustomMenu from './CustomMenu';
import { categoryFilters } from '@/constants';
import { createNewProject, fetchToken } from '@/lib/actions';
import { SessionInterface } from '@/common.types';

interface FormProps {
	type: string;
	session: SessionInterface;
}


export default function ProjectForm({ type, session }: FormProps) {
	const router = useRouter();

	const [isSubmitting, setIsSubmitting] = useState(false);

	const [form, setForm] = useState({
		title: "",
		description: "",
		image: "",
		liveSiteUrl: "",
		githubUrl: "",
		category: "",
	});

	const handleFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		

		console.log(process.env.NEXTAUTH_SECRET, process.env.CLOUDINARY_KEY!, process.env.CLOUDINARY_SECRET!, process.env.NODE_ENV!);

		setIsSubmitting(true);

		const { token } = await fetchToken();

		try {
			if (type === "create") {
				await createNewProject(form, session?.user?.id, token);
				
				router.push("/")
			}
		} catch (error) {
			alert(`Failed to ${type === "create" ? "create" : "edit"} a project. Try again!`);
		} finally {
			setIsSubmitting(false)
		}
	};

	const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();

		const file = e.target.files?.[0];

		if (!file) return;
		if (!file.type.includes("image")) {
			return alert("Please upload an image file");
		}

		const reader = new FileReader();

		reader.readAsDataURL(file);

		reader.onload = () => {
			const result = reader.result as string;

			handleStateChange("image", result);
		};
	};

	const handleStateChange = (fieldname: string, value: string) => {
		setForm((prevState) => ({ ...prevState, [fieldname]: value }));
	};

	return (
		<form onSubmit={handleFormSubmit} className="flexStart form">
			<div className="flexStart form_image-container">
				<label htmlFor="poster" className="flexCenter form_image-label">
					{!form.image && "Choose a poster for your project"}
				</label>
				<input
					id="image"
					type="file"
					accept="image/*"
					required={type === "create"}
					className="form_image-input"
					onChange={handleChangeImage}
				/>
				{form.image && (
					<Image
						src={form?.image}
						className="sm:p-10 object-contain z-20"
						alt="Project Poster"
						fill
					/>
				)}
			</div>

			<FormField
				title="Title"
				state={form.title}
				placeholder="Pedddle"
				setState={(value) => handleStateChange("title", value)}
			/>
			<FormField
				title="Description"
				state={form.description}
				placeholder="Showcase and discover remakable developer projects"
				setState={(value) => handleStateChange("description", value)}
			/>
			<FormField
				type="url"
				title="Website URL"
				state={form.liveSiteUrl}
				placeholder="https://pedddle.com"
				setState={(value) => handleStateChange("liveSiteUrl", value)}
			/>
			<FormField
				type="url"
				title="GitHub URL"
				state={form.githubUrl}
				placeholder="https:/github.com/pedddle"
				setState={(value) => handleStateChange("githubUrl", value)}
			/>

			<CustomMenu
				title="Category"
				state={form.category}
				filters={categoryFilters}
				setState={(value) => handleStateChange("category", value)}
			/>

			<div className="flexStart w-full">
				<Button
					title={
						isSubmitting
							? `${type === "create" ? "Creating" : "Eding"}`
							: `${type === "create" ? "Create" : "Edit"}`
					}
					type="submit"
					leftIcon={isSubmitting ? "" : "/plus.svg"}
					isSubmitting={isSubmitting}
				/>
			</div>
		</form>
	);
}
