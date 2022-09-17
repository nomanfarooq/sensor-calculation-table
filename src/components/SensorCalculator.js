import React, { useState, useEffect } from 'react';
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

const inputsApiData = [
	/*{
		type: 'analogue-input-1', input: 'load', sensorValue: 17000, bounds: {lower: 1000, upper: 450000},
		data: [
			{
				'x': 2000,
				'y': 5100,
				'a': '',
				'b': '',
			},
			{
				'x': 10000,
				'y': 7500,
				'a': '',
				'b': '',
			},
			{
				'x': 18000,
				'y': 18500,
				'a': '',
				'b': '',
			},
			{
				'x': 20000,
				'y': 38750,
				'a': '',
				'b': '',
			},
		],
	},*/
	{
		type: 'analogue-input-3', input: 'fllvl', sensorValue: 3000, bounds: {lower: 10, upper: 4500},
		data: [
			{
				'x': 2700,
				'y': 7500,
				'a': '',
				'b': '',
			},
			{
				'x': 200,
				'y': 500,
				'a': '',
				'b': '',
			},
			{
				'x': 2930,
				'y': 15110,
				'a': '',
				'b': '',
			},
			{
				'x': 3100,
				'y': 47120,
				'a': '',
				'b': '',
			},
		],
	},
	{
		type: 'analogue-input-2', input: 'temp', sensorValue: 20, bounds: {lower: 10, upper: 100},
		data: [
			{
				'x': 50,
				'y': 500,
				'a': '',
				'b': '',
			},
			{
				'x': 10000,
				'y': 8500,
				'a': '',
				'b': '',
			},
			{
				'x': 11900,
				'y': 15000,
				'a': '',
				'b': '',
			},
			{
				'x': 17000,
				'y': 2900,
				'a': '',
				'b': '',
			},
		],
	},
	{
		type: 'analogue-input-5', input: 'eng', sensorValue: 12000, bounds: {lower: 1000, upper: 20000},
		data: [
			{
				'x': 2000,
				'y': 5000,
				'a': '',
				'b': '',
			},
			{
				'x': 10000,
				'y': 15000,
				'a': '',
				'b': '',
			},
			{
				'x': 15000,
				'y': 20000,
				'a': '',
				'b': '',
			},
			{
				'x': 20000,
				'y': 25000,
				'a': '',
				'b': '',
			},
		],
	}, {
		type: 'analogue-input-4', input: 'stblt', sensorValue: 1200, bounds: {lower: 200, upper: 1000},
		data: [
			{
				'x': 200,
				'y': 500,
				'a': '',
				'b': '',
			},
			{
				'x': 1060,
				'y': 8600,
				'a': '',
				'b': '',
			},
			{
				'x': 1440,
				'y': 14460,
				'a': '',
				'b': '',
			},
			{
				'x': 4125,
				'y': 30200,
				'a': '',
				'b': '',
			},
		],
	},
];

const ActionButtons = ( {input, data, onCreate, onClear, editable} ) => {
	return (
		<>
			<ul className="list-inline">
				<li className="list-inline-item">
					<Button
						variant="link"
						disabled={input}
						className="p-0 text-primary"
						onClick={() => onCreate()}>
						Create
					</Button>
				</li>
				<li className="list-inline-item">
					{data?.length > 0 && (
						<Button
							variant="link"
							disabled={data?.length && editable}
							className="p-0 text-primary"
							onClick={() => onClear()}>
							Clear
						</Button>
					)}
				</li>
			</ul>
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
		const [analogueInputType, setAnalogueInputType] = useState('');
		const [analogueInput, setAnalogueInput] = useState({input1: ''});
		const [inputData, setInputData] = useState([]);
		const [sensorValue, setSensorValue] = useState(null);
		const [sensorInputValue, setSensorInputValue] = useState(null);
		const [bounds, setBounds] = useState({});
		const [dataRow, setDataRow] = useState([]);
		const [isValidSensVal, setIsValidSensVal] = useState(null);
		
		useEffect(() => {
			if ( inputsApiData.length > 0 ) {
				const anaInp = inputsApiData?.find(item => item?.type === 'analogue-input-1');
				setAnalogueInputType(anaInp?.type);
			}
		}, []);
		
		useEffect(() => {
			if ( inputsApiData.length > 0 ) {
				const analogue = inputsApiData.find(ele => ele?.type === analogueInputType);
				setAnalogueInput(( analogueInput ) => ({...analogueInput, input1: analogue?.input}) ?? '');
				setInputData(analogue?.data ?? []);
				setSensorValue(analogue?.sensorValue ?? '');
				setBounds(analogue?.bounds ?? null);
			}
		}, [analogueInputType]);
		
		useEffect(() => {
			const inputsList = Object.values(analogueInput);
			const filterInputs = analogueInputs.filter(( item ) =>
				inputsList.filter(( ele ) => ele !== item.value),
			);
			setFilteredAnalogueInputsList(filterInputs);
		}, [analogueInput]);
		
		useEffect(() => {
			if ( filteredAnalogueInputsList.length > 0 ) {
				filteredAnalogueInputsList?.map(( item, indx ) => inputsApiData?.map(( ele, idx ) => {
					ele?.input === item?.value && (filteredAnalogueInputsList[indx] = {
						...filteredAnalogueInputsList[indx],
						isSelected: true,
					});
				}));
			}
			
			if ( filteredAnalogueTypesList.length > 0 ) {
				filteredAnalogueTypesList?.map(( item, indx ) => inputsApiData?.map(( ele, idx ) => {
					ele?.type === item?.value && (filteredAnalogueTypesList[indx] = {
						...filteredAnalogueTypesList[indx],
						isSelected: true,
					});
				}));
			}
			
		}, [filteredAnalogueInputsList, filteredAnalogueTypesList]);
		
		useEffect(() => {
			if ( sensorValue ) {
				((sensorValue >= bounds?.lower) && (sensorValue <= bounds?.upper)) ? setIsValidSensVal(true) : setIsValidSensVal(false);
				setSensorInputValue(false);
			}
		}, [sensorValue, bounds]);
		
		useEffect(() => {
			!inputData?.length > 0 && setEditable(false);
		}, []);
		
		const onCreateRecord = () => {
			setRecord(true);
		};
		
		const onClearRecord = () => {
			setInputData([]);
		};
		
		const onResetRecord = () => {
			setRecord(false);
		};
		
		const onToggleEdit = () => {
			editable ? setEditable(false) : setEditable(true);
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
										value={analogueInputsTypes.find(item => item.value === analogueInputType)}
										onChange={( {value = null} ) => {
											setInputType(value);
											setAnalogueInputType(value);
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
											value={analogueInputs.find(item => item.value === analogueInput.input1)}
											onChange={( {value = null} ) => {
												setInput(value);
												setAnalogueInput(state => ({...state, input1: value}));
											}}
										/>
									</Form.Group>
								</Form>
							</div>
						</div>
					</Col>
					<Col md={4} className="text-start">
						{!inputData?.length && (
							<InputText
								id="sensorVal"
								inputFormat="number"
								isEnable={false}
								label={'Sensor Value'}
								placeholder={14870}
								value={sensorValue ?? ''}
								isImportant={true}
								onChange={( e ) => {
									console.log(e.target.value);
									setSensorValue(e.target.value);
								}}/>
						)}
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
								value={bounds?.lower ?? ''}
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
								value={bounds?.upper ?? ''}
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
								value={sensorValue ?? ''}
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
	}
;

export default SensorCalculator;
