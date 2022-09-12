import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Select from 'react-select';
import CalculationTable from './CalculationTable';
import { InputText } from './partials/InputText';

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

const ActionButtons = ( {input, data, onCreate, onClear, editable} ) => {
	return (
		<>
			<div className="flex flex-nowrap justify-end">
				<Button
					variant="link"
					disabled={input}
					className="p-0 text-primary"
					onClick={() => onCreate()}>
					Create
				</Button>
				
				{!data?.length > 0 && (
					<div className="ml-auto">
						<Button
							variant="link"
							disabled={data?.length && editable}
							className="p-0 text-primary"
							onClick={() => onClear()}>
							Clear
						</Button>
					</div>
				)}
			</div>
		</>
	);
};

const SensorCalculator = () => {
	const [loading, setLoading] = useState(false);
	const [inputType, setInputType] = useState('');
	const [input, setInput] = useState('');
	
	const [filteredAnalogueTypesList, setFilteredAnalogueTypesList] = useState(analogueInputsTypes);
	const [filteredAnalogueInputsList, setFilteredAnalogueInputsList] = useState([]);
	const [record, setRecord] = useState(null);
	const [editable, setEditable] = useState(true);
	const [dataRow, setDataRow] = useState([]);
	const [analogueInputType, setAnalogueInputType] = useState('');
	const [analogueInput, setAnalogueInput] = useState({input1: ''});
	const [inputData, setInputData] = useState([]);
	const [sensorValue, setSensorValue] = useState();
	const [sensorInputValue, setSensorInputValue] = useState(null);
	const [bounds, setBounds] = useState({});
	const [isValidSensVal, setIsValidSensVal] = useState(null);
	
	const onCreateRecord = () => {
		setRecord(true);
	};
	
	const onClearRecord = () => {
		setInputData([]);
	};
	
	const onResetRecord = () => {
		setRecord(false);
	};
	
	return (
		<Container className="mt-5">
			<h4>Sensor Calculator</h4>
			<Row>
				<Col md={5} className="text-start">
					<div className="d-flex flex-nowrap">
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
						<div className="ml-4">
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
						</div>
					</div>
				</Col>
				<Col md={4} className="text-start">
					<InputText
						id="sensorVal"
						inputFormat="number"
						isEnable={false}
						label={'Sensor Value'}
						placeholder={10000}
						value={sensorValue}
						isImportant={true}
						onChange={( e ) => {
							console.log(e.target.value);
						}}/>
				</Col>
				<Col md={3} className="text-start">
					<ActionButtons
						input={analogueInput?.input1}
						data={inputData}
						onCreate={() => onCreateRecord()}
						onClear={onClearRecord}
						editable={editable}/>
				</Col>
			</Row>
			
			{inputData?.length > 0 && (
				<Row>
					<Col md={4} className="text-start">
						<InputText
							id="lowerBoundPre"
							inputFormat="number"
							isEnable={true}
							label={'Lower Bound'}
							placeholder={5000}
							value={bounds?.lower}
							isImportant={true}
							onChange={( e ) => {
								console.log(e.target.value);
							}}/>
					</Col>
					<Col md={4} className="text-start">
						<InputText
							id="upperBoundPre"
							inputFormat="number"
							isEnable={true}
							label={'Upper Bound'}
							placeholder={45000}
							value={bounds?.upper}
							isImportant={true}
							onChange={( e ) => {
								console.log(e.target.value);
							}}/>
					</Col>
					<Col md={4} className="text-start">
						<InputText
							id="preSensorValue"
							inputFormat="number"
							isEnable={true}
							label={'Previous Sensor Value'}
							placeholder={17000}
							value={sensorValue}
							isImportant={true}
							onChange={( e ) => {
								console.log(e.target.value);
							}}/>
					</Col>
				</Row>
			)}
			
			<Row>
				<CalculationTable
					type={analogueInputType}
					input={analogueInput?.input1}
					create={record}
					onResetRec={onResetRecord}
					inputsData={inputData}
					sensorVal={sensorValue}
					editable={editable}
					boundValues={bounds}
					onData={( data ) => setDataRow(data)}
					onSensorValueInput={( data ) => setSensorInputValue(data)}/>
			</Row>
		</Container>
	);
};

export default SensorCalculator;
