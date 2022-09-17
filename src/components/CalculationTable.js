import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { Button, Row, Col } from 'react-bootstrap';
import { InputText } from './partials/InputText';
import React from 'react';

function createData ( x, y, a, b ) {
	return {x, y, a, b};
}

function CalculationTable ( {type, input, create, onResetRec, inputsData, sensorVal, editable, boundValues, ...props} ) {
	
	const [dataRow, setDataRow] = useState([]);
	const [bounds, setBounds] = useState({
		lower: boundValues?.lower, upper: boundValues?.upper,
	});
	const [isValidSensVal, setIsValidSensVal] = useState(null);
	
	const [sensorValue, setSensorValue] = useState(null);
	
	const [upperBoundInput, setUpperBoundInput] = useState(null);
	const [lowerBoundInput, setLowerBoundInput] = useState(null);
	
	const [xyVal, setXyVal] = useState({x: null, y: null});
	const [isCalculate, setIsCalculate] = useState(true);
	
	let data = [];
	let sensorValueApi = sensorVal;
	
	let a_val;
	let b_val;
	
	function calculateInputs ( x_vals, y_vals ) {
		//point to point varry
		var x_2coeff = x_vals; //x values
		var y_2coeff = [1, 1]; //always 1 1
		var eq_2coeff = y_vals; //y values
		var eliminator = [];
		eliminator[0] = [];
		eliminator[1] = [];
		
		eliminator[0][0] = y_2coeff[1] * x_2coeff[0];
		eliminator[0][1] = y_2coeff[1] * eq_2coeff[0];
		
		eliminator[1][0] = y_2coeff[0] * x_2coeff[1];
		eliminator[1][1] = y_2coeff[0] * eq_2coeff[1];
		
		try {
			a_val = (eliminator[0][1] - eliminator[1][1]) / (eliminator[0][0] - eliminator[1][0]);
			b_val = (eq_2coeff[0] - x_2coeff[0] * a_val) / y_2coeff[0];
		} catch ( ex ) {
			console.log(ex, 'calculation exception');
			throw ex;
		}
	}
	
	const onCreateData = () => {
		data.push(createData('', '', '', ''));
		setDataRow(( arr ) => ([...arr, ...data]));
	};
	
	useEffect(() => {
		if ( inputsData ) {
			inputsData.sort(( a, b ) => a?.x - b?.x);
			setDataRow(inputsData);
			setSensorValue(null);
		}
	}, [inputsData]);
	
	useEffect(() => {
		input === '' && setDataRow([]);
		/*todo:need to remove below*/
		//onCreateData();
	}, [input]);
	
	useEffect(() => {
		console.log(dataRow, 'dataRow record updated');
		props?.onData(dataRow);
		
		if ( dataRow?.length <= 1 ) {
			setIsCalculate(true);
		}
		
		if ( dataRow?.length > 1 ) {
			for ( let i = 0; i < dataRow.length; i++ ) {
				if ( i >= 1 ) {
					(dataRow[i]?.x && dataRow[i]?.y) ? setIsCalculate(false) : setIsCalculate(true);
				}
			}
		}
		
		if ( !dataRow.length ) {
			setBounds(value => ({...value, lower: null}));
			setBounds(value => ({...value, upper: null}));
			setSensorValue(null);
			setIsValidSensVal(null);
		}
	}, [dataRow, xyVal]);
	
	useEffect(() => {
		if ( create ) {
			onCreateData();
			onResetRec();
		}
	}, [create]);
	
	useEffect(() => {
		if ( boundValues ) {
			setBounds(value => ({...value, lower: boundValues?.lower}));
			setBounds(value => ({...value, upper: boundValues?.upper}));
		}
	}, [boundValues]);
	
	useEffect(() => {
		if ( sensorValue || sensorValue !== 0 || isNaN(sensorValue) ) {
			((sensorValue >= bounds?.lower) && (sensorValue <= bounds?.upper))
				? setIsValidSensVal(true)
				: setIsValidSensVal(false);
		}
		if ( bounds?.lower ) {
			setLowerBoundInput(false);
		}
		if ( bounds?.upper ) {
			setUpperBoundInput(false);
		}
	}, [sensorValue, bounds]);
	
	const onEnable = ( idx, dataRes ) => {
		dataRes[idx]?.isEdit !== undefined
			? dataRes[idx]?.isEdit
				? dataRes[idx] = {...dataRes[idx], isEdit: false}
				: dataRes[idx] = {...dataRes[idx], isEdit: true}
			: dataRes[idx] = {...dataRes[idx], isEdit: true};
		setDataRow([...dataRes]);
	};
	
	const onCalculation = ( dataRes ) => {
		if ( !sensorValueApi ) {
			props?.onSensorValueInput(true);
			return;
		}
		if ( !bounds?.lower ) {
			setLowerBoundInput(true);
			return;
		}
		if ( !bounds?.upper ) {
			setUpperBoundInput(true);
			return;
		}
		if ( dataRes.length > 1 ) {
			const lastIndex = dataRes.findLastIndex(item => item);
			if ( (dataRes[lastIndex]?.x === '') && (dataRes[lastIndex]?.y === '') ) {
				dataRes.splice(lastIndex, 1);
			}
			
			let xVals = [];
			let yVals = [];
			
			for ( let i = 0; i < dataRes.length; i++ ) {
				xVals.push(dataRes[i]?.x);
				yVals.push(dataRes[i]?.y);
			}
			
			for ( let i = 0; i < dataRes.length; i++ ) {
				if ( (xVals[1] && yVals[1]) ) {
					calculateInputs([xVals[0], xVals[1]], [yVals[0], yVals[1]]);
					dataRes[i] = {...dataRes[i], a: a_val, b: b_val};
					xVals.splice(0, 1);
					yVals.splice(0, 1);
				}
			}
			
			setDataRow([...dataRes]);
			
			let x = sensorValueApi;
			const filterDataRes = dataRes?.filter(item => item?.x <= x);
			let closestVal = filterDataRes?.reduce(( prev, curr ) => {
				return (Math.abs(curr?.x - x) < Math.abs(prev?.x - x) ? curr : prev);
			});
			
			const updatedSensorVal = onSensorValue(closestVal?.a, closestVal?.b, x);
			setSensorValue(updatedSensorVal);
		}
	};
	
	const onSensorValue = ( a, b, x ) => {
		let y = (a) * (x) + (b);
		return y;
	};
	
	const onSaveCalculation = () => {
		const apiData = {
			type,
			input,
			bounds,
			sensorValue,
			'data': dataRow,
		};
		console.log(apiData, 'saved api data here');
	};
	
	const onRemoveValues = ( idx, dataRes ) => {
		dataRes.splice(idx, 1);
		setDataRow([...dataRes]);
	};
	
	return (
		<>
			{dataRow.length > 0 && (
				<>
					<Row className="align-items-center">
						<Col md={2}>
							<h5 className="text-left">Calculation Table</h5>
						</Col>
						<Col md={6}>
							<div className="d-flex flex-nowrap justify-content-center align-content-center">
								<InputText
									id="lowerBoundPre"
									inputFormat="number"
									isEnable={editable}
									label={'Lower Bound'}
									placeholder={5000}
									value={bounds?.lower ?? ''}
									isImportant={true}
									onChange={( e ) => {
										setBounds(state => ({...state, lower: e.target.value}));
									}}/>
								<div className="ml-auto">
									<InputText
										id="upperBoundPre"
										inputFormat="number"
										isEnable={editable}
										label={'Upper Bound'}
										placeholder={45000}
										value={bounds?.upper ?? ''}
										isImportant={true}
										onChange={( e ) => {
											setBounds(state => ({...state, upper: e.target.value}));
										}}/>
								</div>
							</div>
						</Col>
						<Col md={2}>
							{sensorValue && (
								<InputText
									id="CalculatedSensorValue"
									inputFormat="number"
									isEnable={true}
									isValid={isValidSensVal}
									label={(isValidSensVal ? 'Correct' : 'Incorrect')}
									helperText={'Calculated sensor value'}
									placeholder={17000}
									value={sensorValue ?? ''}
									isImportant={true}
									onChange={( e ) => {
										console.log(e.target.value);
									}}/>
							)}
						</Col>
						<Col md={2}>
							<div className="d-flex flex-nowrap">
								<Button variant="outline-dark" onClick={() => onCalculation(inputsData)}>Calculate</Button>
								<div className="ml-auto">
									<Button variant="success">Save</Button>
								</div>
							</div>
						</Col>
					</Row>
					<Table bordered hover>
						<thead>
						<tr>
							<th>x<sup>*</sup></th>
							<th>y<sup>*</sup></th>
							<th>a<sup>*</sup></th>
							<th>b<sup>*</sup></th>
							<th>actions</th>
						</tr>
						</thead>
						<tbody>
						{dataRow?.map(( item, idx ) => (
							<tr key={idx}>
								<td style={{width: '15%'}}>
									{((item?.isEdit ?? false) || item?.isEdit)
										? <InputText helperText="" id="x-req" value={item.x ?? ''} disabled={true}/>
										: <InputText
											inputFormat="number"
											helperText=""
											id="x-required"
											value={item.x ?? ""}
											disabled={item?.isEdit}
											onChange={( event ) => {
												dataRow[idx] = {
													...dataRow[idx],
													x: event?.target?.value,
												};
												setXyVal(value => ({
													...value,
													x: event?.target?.value,
												}));
											}}/>
									}
								</td>
								<td style={{width: '15%'}}>
									{((item?.isEdit ?? false) || item?.isEdit)
										? <InputText helperText="" id="y-req" value={item.y ?? ''} disabled={true}/>
										: <InputText
											inputFormat="number"
											helperText=""
											id="y-required"
											value={item.y ?? ""}
											disabled={item?.isEdit}
											onChange={( event ) => {
												dataRow[idx] = {
													...dataRow[idx],
													y: event?.target?.value,
												};
												setXyVal(value => ({
													...value,
													y: event?.target?.value,
												}));
											}}/>
									}</td>
								<td style={{width: '15%'}}>
									<InputText helperText="" id="a-req" value={item.a ?? ''} disabled={true}/>
								</td>
								<td style={{width: '15%'}}>
									<InputText helperText="" id="b-req" value={item.b ?? ''} disabled={true}/>
								</td>
								<td style={{width: '15%'}}>
									<Button variant="link" onClick={( e ) => {
										e.preventDefault();
										onEnable(idx, dataRow);
									}}>{(item?.isEdit ? `Enable` : `Disable`)}
									</Button> | <Button variant="link" onClick={( e ) => {
									e.preventDefault();
									onRemoveValues(idx, dataRow);
								}}>Remove</Button></td>
							</tr>
						))}
						</tbody>
					</Table>
				</>
			)}
		</>
	);
}

export default CalculationTable;
