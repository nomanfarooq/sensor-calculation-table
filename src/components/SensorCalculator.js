import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Select from 'react-select';
import CalculationTable from './CalculationTable';

//Need this data via api
const statusList = [
	{label: 'ONLINE', value: 'ONLINE'},
	{label: 'OFFLINE', value: 'OFFLINE'},
	{label: 'AWAY', value: 'AWAY'},
	{label: 'BACKLOG', value: 'BACKLOG'},
];

const analogueInputs = [
	{
		value: 'fllvl',
		label: 'Fuel Level',
	},
	{
		value: 'load',
		label: 'Load',
	},
	{
		value: 'temp',
		label: 'Temperature',
	},
	{
		value: 'stblt',
		label: 'Seat Belt',
	},
	{
		value: 'eng',
		label: 'Engine',
	},
];

const analogueInputsTypes = [
	{
		value: 'analogue-input-1',
		label: 'Analogue Input 1',
	},
	{
		value: 'analogue-input-2',
		label: 'Analogue Input 2',
	},
	{
		value: 'analogue-input-3',
		label: 'Analogue Input 3',
	},
	{
		value: 'analogue-input-4',
		label: 'Analogue Input 4',
	},
	{
		value: 'analogue-input-5',
		label: 'Analogue Input 5',
	},
];

const select2Styles = {
	menu: ( provided, state ) => ({
		...provided,
		width: state.selectProps.width,
		boxShadow: '0px 0px 14px rgba(0, 0, 0, 0.1)',
		borderRadius: 12,
		color: '#272D4E',
		fontWeight: '500',
		padding: 16,
		'::after': {
			content: '"\\25B2"',
			position: 'absolute',
			top: -17,
			color: '#fff',
			right: 20,
			zIndex: 1,
		},
	}),
	
	control: ( provided, state ) => ({
		...provided,
		width: 200,
		boxShadow: 'none',
		//border: 0,
		//borderColor: 'transparent',
		':hover': {
			//borderColor: 'transparent',
			//border: 0,
			boxShadow: 'none',
		},
	}),
	
	option: ( styles, {data, isDisabled, isFocused, isSelected, selectProps} ) => {
		return {
			...styles,
			backgroundColor: isFocused ? selectProps.layout : null,
			color: isFocused ? '#272D4E' : null,
			fontWeight: isFocused && '600',
			borderRadius: 12,
		};
	},
	
	singleValue: ( provided, state ) => {
		const opacity = state.isDisabled ? 0.5 : 1;
		const transition = 'opacity 300ms';
		return {...provided, opacity, transition};
	},
};

const SensorCalculator = () => {
	const [loading, setLoading] = useState(false);
	const [inputType, setInputType] = useState('');
	const [input, setInput] = useState('');
	
	return (
		<Container className="mt-5">
			<h4>Sensor Calculator</h4>
			<Row>
				<Col md={4} className="text-start">
					<Form>
						<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label>Select Type</Form.Label>
							<Select
								styles={select2Styles}
								width="300px"
								layout={'#F5F5F5'}
								components={{IndicatorSeparator: () => null}}
								isSearchable={true}
								className="pr-4"
								options={analogueInputsTypes}
								value={analogueInputsTypes.find(item => item.value === inputType)}
								onChange={( {value = null} ) => {
									setInputType(value);
									//onUpdateOnlineStatus(value);
								}}
							/>
						</Form.Group>
					</Form>
				</Col>
				<Col md={4} className="text-start">
					<Form>
						<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label>Select Input</Form.Label>
							<Select
								styles={select2Styles}
								width="300px"
								layout={'#F5F5F5'}
								components={{IndicatorSeparator: () => null}}
								isSearchable={true}
								className="pr-4"
								options={analogueInputs}
								value={analogueInputs.find(item => item.value === input)}
								onChange={( {value = null} ) => {
									setInput(value);
									//onUpdateOnlineStatus(value);
								}}
							/>
						</Form.Group>
					</Form>
				</Col>
				<Col md={4} className="text-start">
					<Form>
						<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label>Sensor Value</Form.Label>
							<Form.Control type="text" placeholder="Sensor value"/>
							<Form.Text className="text-muted">
								We'll never share your email with anyone else.
							</Form.Text>
						</Form.Group>
					</Form>
				</Col>
			</Row>
			<Row>
				<Col md={4} className="text-start">
					<Form>
						<Form.Group className="mb-3" controlId="lowerBoundPre">
							<Form.Label>Lower Bound</Form.Label>
							<Form.Control type="text" placeholder="1000" disabled={true}/>
							<Form.Text className="text-muted">
								We'll never share your email with anyone else.
							</Form.Text>
						</Form.Group>
					</Form>
				</Col>
				<Col md={4} className="text-start">
					<Form>
						<Form.Group className="mb-3" controlId="upperBoundPre">
							<Form.Label>Upper Bound</Form.Label>
							<Form.Control type="text" placeholder="45000" disabled={true}/>
							<Form.Text className="text-muted">
								We'll never share your email with anyone else.
							</Form.Text>
						</Form.Group>
					</Form>
				</Col>
				<Col md={4} className="text-start">
					<Form>
						<Form.Group className="mb-3" controlId="preSensorValue">
							<Form.Label>Previous Sensor Value</Form.Label>
							<Form.Control type="text" placeholder="17000" disabled={true}/>
							<Form.Text className="text-muted">
								We'll never share your email with anyone else.
							</Form.Text>
						</Form.Group>
					</Form>
				</Col>
			</Row>
			<Row>
				<Col md={2}>
					<h4>Calculation Table</h4>
				</Col>
				<Col md={6}>
					<div className="d-flex flex-nowrap justify-content-center align-content-center">
						<Form className="text-start">
							<Form.Group className="mb-3" controlId="lowerBoundPre">
								<Form.Label>Lower Bound</Form.Label>
								<Form.Control type="text" placeholder="1000"/>
								<Form.Text className="text-muted">
									Anyone else.
								</Form.Text>
							</Form.Group>
						</Form>
						<div className="ml-auto">
							<Form className="text-start">
								<Form.Group className="mb-3" controlId="upperBoundPre">
									<Form.Label>Upper Bound</Form.Label>
									<Form.Control type="text" placeholder="45000"/>
									<Form.Text className="text-muted">
										We'll never.
									</Form.Text>
								</Form.Group>
							</Form>
						</div>
					</div>
				</Col>
				<Col md={2}>
					<Form className="text-start">
						<Form.Group className="mb-3" controlId="upperBoundPre">
							<Form.Label>Correct Calculated</Form.Label>
							<Form.Control type="text" placeholder="45000"/>
							<Form.Text className="text-muted">
								We'll never.
							</Form.Text>
						</Form.Group>
					</Form>
				</Col>
				<Col md={2}>
					<div className="d-flex flex-nowrap">
						<Button variant="outline-dark">Calculate</Button>
						<div className="ml-auto">
							<Button variant="success">Save</Button>
						</div>
					</div>
				</Col>
			</Row>
			<Row>
				<CalculationTable/>
			</Row>
		</Container>
	);
};

export default SensorCalculator;
