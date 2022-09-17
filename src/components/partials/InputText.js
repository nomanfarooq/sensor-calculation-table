import React from 'react';
import { Form } from 'react-bootstrap';

export const InputText = ( {id, label, inputFormat, value, placeholder, isValid, isEnable, helperText, isImportant, onChange} ) => {
	return (
		<Form>
			<Form.Group className="mb-3" controlId={id}>
				<Form.Label className={isValid && 'text-success'}>{label} {isImportant && <span className="text-danger">*</span>}</Form.Label>
				<Form.Control type={inputFormat ?? 'text'} value={value} placeholder={placeholder} disabled={isEnable} onChange={onChange}/>
				{helperText && (
					<Form.Text className="text-muted">
						{`${helperText}`}
					</Form.Text>
				)}
			
			</Form.Group>
		</Form>
	);
};
