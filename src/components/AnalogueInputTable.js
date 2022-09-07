import * as React from 'react';
import {useEffect, useState} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import {Box, TextField, Tooltip, Typography} from "@mui/material";

function createData(x, y, a, b) {
    return {x, y, a, b};
}

const TableInputField = ({id, value, label, onChange, disabled}) => {
    return (
        <Box component="form" sx={{'& .MuiTextField-root': {m: 0},}}
             noValidate
             autoComplete="off"
        >
            <div>
                <TextField
                    required
                    id={`${id}-inp`}
                    label={label}
                    value={value}
                    //defaultValue={value}
                    disabled={disabled}
                    onChange={onChange}
                />
            </div>
        </Box>
    )
}

/*const TextFieldInput = ({value, label, onChange, disabled}) => {
    return (
        <Box component="form" sx={{'& .MuiTextField-root': {m: 1},}}
             noValidate
             autoComplete="off"
        >
            <div>
                <TextField
                    required
                    id={`${label}`}
                    label={label}
                    value={value}
                    defaultValue={value}
                    disabled={disabled}
                    onChange={onChange}
                />
            </div>
        </Box>
    );
}*/

export default function AnalogueInputTable({
                                               type,
                                               input,
                                               create,
                                               onResetRec,
                                               inputsData,
                                               sensorVal,
                                               editable,
                                               boundValues,
                                               ...props
                                           }) {
    const [dataRow, setDataRow] = useState([]);
    const [bounds, setBounds] = useState({
        lower: boundValues?.lower, upper: boundValues?.upper
    })
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

    function calculateInputs(x_vals, y_vals) {
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
        } catch (ex) {
            console.log(ex, 'calculation exception');
            throw ex;
        }
    }

    const onCreateData = () => {
        data.push(createData('', '', '', ''));
        setDataRow((arr) => ([...arr, ...data]));
    }

    useEffect(() => {
        if (inputsData) {
            inputsData.sort((a, b) => a?.x - b?.x);
            setDataRow(inputsData);
            setSensorValue(null);
        }
    }, [inputsData])

    useEffect(() => {
        input === "" && setDataRow([]);
        /*todo:need to remove below*/
        //onCreateData();
    }, [input])


    useEffect(() => {
        console.log(dataRow, 'dataRow record updated');
        props?.onData(dataRow);

        if (dataRow?.length <= 1) {
            setIsCalculate(true);
        }

        if (dataRow?.length > 1) {
            for (let i = 0; i < dataRow.length; i++) {
                if (i >= 1) {
                    (dataRow[i]?.x && dataRow[i]?.y) ? setIsCalculate(false) : setIsCalculate(true);
                }
            }
        }

        if (!dataRow.length) {
            setBounds(value => ({...value, lower: null}));
            setBounds(value => ({...value, upper: null}));
            setSensorValue(null);
            setIsValidSensVal(null)
        }
    }, [dataRow, xyVal]);

    useEffect(() => {
        if (create) {
            onCreateData();
            onResetRec();
        }
    }, [create])

    useEffect(() => {
        if (boundValues) {
            setBounds(value => ({...value, lower: boundValues?.lower}));
            setBounds(value => ({...value, upper: boundValues?.upper}));
        }
    }, [boundValues])

    useEffect(() => {
        if (sensorValue || sensorValue !== 0 || isNaN(sensorValue)) {
            ((sensorValue >= bounds?.lower) && (sensorValue <= bounds?.upper))
                ? setIsValidSensVal(true)
                : setIsValidSensVal(false);
        }
        if (bounds?.lower) {
            setLowerBoundInput(false);
        }
        if (bounds?.upper) {
            setUpperBoundInput(false);
        }
    }, [sensorValue, bounds])

    const onEnable = (idx, dataRes) => {
        dataRes[idx]?.isEdit !== undefined
            ? dataRes[idx]?.isEdit
                ? dataRes[idx] = {...dataRes[idx], isEdit: false}
                : dataRes[idx] = {...dataRes[idx], isEdit: true}
            : dataRes[idx] = {...dataRes[idx], isEdit: true};
        setDataRow([...dataRes]);
    }

    const onCalculation = (dataRes) => {
        if (!sensorValueApi) {
            props?.onSensorValueInput(true);
            return;
        }
        if (!bounds?.lower) {
            setLowerBoundInput(true);
            return;
        }
        if (!bounds?.upper) {
            setUpperBoundInput(true);
            return;
        }
        if (dataRes.length > 1) {
            const lastIndex = dataRes.findLastIndex(item => item);
            if ((dataRes[lastIndex]?.x === '') && (dataRes[lastIndex]?.y === '')) {
                dataRes.splice(lastIndex, 1);
            }

            let xVals = [];
            let yVals = [];

            for (let i = 0; i < dataRes.length; i++) {
                xVals.push(dataRes[i]?.x);
                yVals.push(dataRes[i]?.y);
            }

            for (let i = 0; i < dataRes.length; i++) {
                if ((xVals[1] && yVals[1])) {
                    calculateInputs([xVals[0], xVals[1]], [yVals[0], yVals[1]]);
                    dataRes[i] = {...dataRes[i], a: a_val, b: b_val};
                    xVals.splice(0, 1);
                    yVals.splice(0, 1);
                }
            }

            setDataRow([...dataRes]);

            let x = sensorValueApi;
            const filterDataRes = dataRes?.filter(item => item?.x <= x);
            let closestVal = filterDataRes?.reduce((prev, curr) => {
                return (Math.abs(curr?.x - x) < Math.abs(prev?.x - x) ? curr : prev);
            });

            const updatedSensorVal = onSensorValue(closestVal?.a, closestVal?.b, x);
            setSensorValue(updatedSensorVal);
        }
    }

    const onSensorValue = (a, b, x) => {
        let y = (a) * (x) + (b);
        return y;
    }

    const onSaveCalculation = () => {
        const apiData = {
            type,
            input,
            bounds,
            sensorValue,
            "data": dataRow
        }
        console.log(apiData, 'saved api data here');
    }

    const onRemoveValues = (idx, dataRes) => {
        dataRes.splice(idx, 1);
        setDataRow([...dataRes]);
    }

    return (
        <>
            {dataRow?.length > 0 && (
                <>
                    <div className="flex items-center mt-10 mb-10">
                        <Typography className="font-bold">{`Calculation Table`}</Typography>
                        <div className="ml-auto">
                            <div className="flex items-center">
                                <TextField
                                    required
                                    id="lower-req"
                                    focused={lowerBoundInput ?? false}
                                    color={lowerBoundInput ? 'warning' : 'primary'}
                                    helperText={lowerBoundInput && ""}
                                    label="Lower bound"
                                    //value={bounds?.lower}
                                    defaultValue={bounds?.lower}
                                    disabled={editable}
                                    onChange={(event) => {
                                        setBounds(value => ({...value, lower: event?.target?.value}));
                                    }}/>

                                {/*<TextFieldInput
                                    focused={upperBoundInput ?? false}
                                    color={upperBoundInput ? 'warning' : 'primary'}
                                    label="Lower bound"
                                    value={bounds?.lower}
                                    disabled={editable}
                                    onChange={(event) => {
                                        setBounds(value => ({...value, lower: event?.target?.value}));
                                    }}/>*/}

                                <div className="ml-auto">
                                    <TextField
                                        required
                                        id="upper-req"
                                        focused={upperBoundInput ?? false}
                                        color={upperBoundInput ? 'warning' : 'primary'}
                                        helperText={upperBoundInput && ""}
                                        label="Upper bound"
                                        //value={bounds?.upper}
                                        defaultValue={bounds?.upper}
                                        disabled={editable}
                                        onChange={(event) => {
                                            setBounds(value => ({...value, upper: event?.target?.value}));
                                        }}/>

                                    {/*<TextFieldInput
                                        label="Upper bound"
                                        value={bounds?.upper}
                                        disabled={editable}
                                        onChange={(event) => setBounds(value => ({
                                            ...value,
                                            upper: event?.target?.value
                                        }))}/>*/}

                                </div>
                                <div className="ml-auto">
                                    <Tooltip
                                        title="Calculated sensor value should lie between lower bound and upper bound.">
                                        <Icon className="hidden sm:flex text-grey">help_center</Icon>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                        {sensorValue && (
                            <div className="ml-auto">
                                <Box component="form" sx={{'& .MuiTextField-root': {m: 1},}}
                                     noValidate
                                     autoComplete="off"
                                >
                                    <div>
                                        <TextField
                                            required
                                            focused
                                            color={isValidSensVal ? "success" : "warning"}
                                            id="calculated-sensor-value"
                                            label={`${isValidSensVal ? "Correct" : "Incorrect"} Calculated`}
                                            value={sensorValue}
                                            //disabled={true}
                                        />
                                    </div>
                                </Box>
                            </div>
                        )}
                        <div className="ml-auto">
                            <Button
                                className="whitespace-nowrap mx-4 "
                                variant="text"
                                disabled={isCalculate}
                                color="primary"
                                onClick={() => {
                                    dataRow.sort((a, b) => a?.x - b?.x);
                                    onCalculation(dataRow)
                                }}
                                startIcon={<Icon className="hidden sm:flex">calculate</Icon>}>
                                {'Calculate'}
                            </Button>
                            <Button
                                className="whitespace-nowrap mx-4 "
                                variant="outlined"
                                disabled={sensorValue && isValidSensVal ? !isValidSensVal : true}
                                color="success"
                                onClick={() => onSaveCalculation()}
                                startIcon={<Icon className="hidden sm:flex">save</Icon>}>
                                {'Save'}
                            </Button>
                        </div>
                    </div>

                    <TableContainer component={Paper} className="shadow-0 border-1 mb-12">
                        <Table sx={{minWidth: 650}} aria-label="analogue input table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">{`x`}</TableCell>
                                    <TableCell align="center">{`y`}</TableCell>
                                    <TableCell align="center">{`a`}</TableCell>
                                    <TableCell align="center">{`b`}</TableCell>
                                    <TableCell align="center">{`actions`}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dataRow?.map((item, idx) => (
                                    <TableRow
                                        key={idx}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                        <TableCell component="th" scope="row">
                                            {((item?.isEdit ?? false) || item?.isEdit)
                                                ? <TableInputField id="x-req" label="X" value={item.x} disabled={true}/>
                                                : <TextField required id="x-required" label="X" defaultValue={item.x}
                                                             disabled={item?.isEdit}
                                                             onChange={(event) => {
                                                                 dataRow[idx] = {
                                                                     ...dataRow[idx],
                                                                     x: event?.target?.value
                                                                 }
                                                                 setXyVal(value => ({
                                                                     ...value,
                                                                     x: event?.target?.value
                                                                 }));
                                                             }}/>
                                            }

                                        </TableCell>
                                        <TableCell align="right">
                                            {((item?.isEdit ?? false) || item?.isEdit)
                                                ? <TableInputField id="y-req" label="Y" value={item.y} disabled={true}/>
                                                : <TextField required id="y-required" label="Y" defaultValue={item.y}
                                                             disabled={item?.isEdit}
                                                             onChange={(event) => {
                                                                 dataRow[idx] = {
                                                                     ...dataRow[idx],
                                                                     y: event?.target?.value
                                                                 }
                                                                 setXyVal(value => ({
                                                                     ...value,
                                                                     y: event?.target?.value
                                                                 }));
                                                             }}/>
                                            }
                                        </TableCell>
                                        <TableCell align="right">
                                            <TableInputField id="a-req" label="A" value={item.a} disabled={true}/>
                                        </TableCell>
                                        <TableCell align="right">
                                            <TableInputField id="b-req" label="B" value={item.b} disabled={true}/>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button href="#" onClick={(e) => {
                                                e.preventDefault();
                                                onEnable(idx, dataRow);
                                            }}>
                                                {/*{(item?.isEdit ?? `Enable`) || item?.isEdit ? `Enable` : `Disable`}*/}
                                                {(item?.isEdit ? `Enable` : `Disable`)}
                                            </Button>
                                            {`/`}
                                            <Button href="#" onClick={(e) => {
                                                e.preventDefault();
                                                onRemoveValues(idx, dataRow);
                                            }}>{`Remove`}</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}
        </>
    );
}
