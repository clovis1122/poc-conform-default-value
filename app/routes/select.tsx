import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { getFormProps, useForm, useInputControl } from '@conform-to/react';
import { useSearchParams } from '@remix-run/react';
import { z } from 'zod';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '~/components/ui/select';

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

	// ❌ The value is set to the default value, then to an empty string after refresh.
	console.log('Value during rendering', control.value);

	return (
		<div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
			<h1>Value: {control.value}</h1>
			<form method="POST" {...getFormProps(form)}>
				<Select
					value={control.value}
					name={fields.field.name}
					onValueChange={(value) => {
						// ❌ This is called upon refresh, setting the value to ''.
						console.log('Changing value:', value);
						control.change(value);
					}}
					required={fields.field.required}
				>
					<SelectTrigger
						id={fields.field.id}
						onFocus={control.focus}
						onBlur={control.blur}
					>
						<SelectValue placeholder="any...">{control.value}</SelectValue>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="a">a</SelectItem>
						<SelectItem value="b">b</SelectItem>
						<SelectItem value="c">c</SelectItem>
					</SelectContent>
				</Select>
			</form>
		</div>
	);
}
