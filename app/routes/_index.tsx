import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { getFormProps, useForm, useInputControl } from '@conform-to/react';
import { useSearchParams } from '@remix-run/react';
import { z } from 'zod';

const Schema = z.object({
	field: z.string(),
});

export default function Index() {
	const [params] = useSearchParams();
	const [form, fields] = useForm({
		constraint: getZodConstraint(Schema),
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: Schema });
		},
		defaultValue: Object.fromEntries(params),
	});

	const control = useInputControl(fields.field);

	// ✅ This works as expected, the value is set to the default value after refresh.
	console.log(control.value);

	return (
		<div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
			<h1>Value: {control.value}</h1>
			<form method="POST" {...getFormProps(form)}>
				<select
					value={control.value}
					onChange={(evt) => {
						// This does not trigger during the initial refresh.
						console.log('Changing value:', evt.target.value);
						control.change(evt.target.value);
					}}
					onFocus={control.focus}
					onBlur={control.blur}
				>
					<option value="a">A</option>
					<option value="b">B</option>
					<option value="c">C</option>
				</select>
			</form>
		</div>
	);
}
