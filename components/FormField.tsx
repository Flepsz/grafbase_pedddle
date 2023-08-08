interface IFormFieldProps {
	type?: string;
	title: string;
	state: string;
	placeholder: string;
	isTextArea?: boolean;
	setState: (value: string) => void;
}

export default function FormField ({
	type,
	title,
	state,
	placeholder,
	isTextArea,
	setState,
}: IFormFieldProps) {
	return (
		<div className="flexStart flex-col w-full gap-4">
			<label htmlFor="" className="w-full text-gray-1001">
				{title}
			</label>

			{isTextArea ? (
				<textarea
					placeholder={placeholder}
					value={state}
					required
					className="form_field-input"
					onChange={(e) => setState(e.target.value)}
				/>
			) : (
				<input
					type={type || "text"}
					placeholder={placeholder}
					value={state}
					required
					className="form_field-input"
					onChange={(e) => setState(e.target.value)}
				/>
			)}
		</div>
	);
}
