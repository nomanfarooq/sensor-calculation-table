import React, {useEffect, useState} from 'react';
import {Box, Grid, MenuItem, Tooltip, Typography} from "@mui/material";
import TextField from "@mui/material/TextField";
import clsx from "clsx";
import AnalogueInputTable from "./AnalogueInputTable";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import IconPlaceHolder from "../../../../../components/ui/Icons";
import _ from '@lodash';

const analogueInputs = [
    {
        value: "fllvl",
        label: "Fuel Level",
    },
    {
        value: "load",
        label: "Load",
    },
    {
        value: "temp",
        label: "Temperature",
    },
    {
        value: "stblt",
        label: "Seat Belt",
    },
    {
        value: "eng",
        label: "Engine",
    },
];

const analogueInputsTypes = [
    {
        value: "analogue-input-1",
        label: "Analogue Input 1",
    },
    {
        value: "analogue-input-2",
        label: "Analogue Input 2",
    },
    {
        value: "analogue-input-3",
        label: "Analogue Input 3",
    },
    {
        value: "analogue-input-4",
        label: "Analogue Input 4",
    },
    {
        value: "analogue-input-5",
        label: "Analogue Input 5",
    },
]

/*const inputsApiData = [];*/

/*const inputsApiData = [
    {
        type: 'analogue-input-2', input: 'fllvl', data: [
            {
                "x": 0,
                "y": 1000,
                "a": 1000,
                "b": -1000
            },
            {
                "x": 1500,
                "y": 20000,
                "a": 21500,
                "b": -18500
            },
            {
                "x": 35000,
                "y": 55000,
                "a": 90000,
                "b": -20000
            },
            {
                "x": 60000,
                "y": 75000,
                "a": "",
                "b": ""
            }
        ]
    },
    {
        type: 'analogue-input-3', input: 'load', data: [
            {
                "x": 1000,
                "y": 20000,
                "a": 21000,
                "b": -19000
            },
            {
                "x": 1500,
                "y": 30000,
                "a": 31500,
                "b": -28500
            },
            {
                "x": 2000,
                "y": 35000,
                "a": "",
                "b": ""
            },
        ]
    },
    {
        type: 'analogue-input-1', input: 'temp', data: [
            {
                "x": 0,
                "y": 100,
                "a": 100,
                "b": -100
            },
            {
                "x": 500,
                "y": 1000,
                "a": 1500,
                "b": -500
            },
            {
                "x": 1100,
                "y": 1500,
                "a": 2600,
                "b": -400
            },
            {
                "x": 1600,
                "y": 2000,
                "a": "",
                "b": ""
            }
        ]
    },
];*/

const inputsApiData = [
    {
        type: 'analogue-input-2', input: 'load', sensorValue: 17000, bounds: {lower: 1000, upper: 450000},
        data: [
            {
                "x": 2000,
                "y": 5100,
                "a": "",
                "b": "",
            },
            {
                "x": 10000,
                "y": 7500,
                "a": "",
                "b": "",
            },
            {
                "x": 18000,
                "y": 18500,
                "a": "",
                "b": "",
            },
            {
                "x": 20000,
                "y": 38750,
                "a": "",
                "b": "",
            },
        ]
    },
    {
        type: 'analogue-input-3', input: 'fllvl', sensorValue: 3000, bounds: {lower: 10, upper: 4500},
        data: [
            {
                "x": 2700,
                "y": 7500,
                "a": "",
                "b": "",
            },
            {
                "x": 200,
                "y": 500,
                "a": "",
                "b": "",
            },
            {
                "x": 2930,
                "y": 15110,
                "a": "",
                "b": "",
            },
            {
                "x": 3100,
                "y": 47120,
                "a": "",
                "b": "",
            },
        ]
    },
    {
        //type: 'analogue-input-1', input: 'temp', sensorValue: 20, bounds: {lower: 10, upper: 100},
        /*data: [
            {
                "x": 50,
                "y": 500,
                "a" : "",
                "b" : "",
            },
            {
                "x": 10000,
                "y": 8500,
                "a" : "",
                "b" : "",
            },
            {
                "x": 11900,
                "y": 15000,
                "a" : "",
                "b" : "",
            },
            {
                "x": 17000,
                "y": 2900,
                "a" : "",
                "b" : "",
            },
        ]*/
    },
    {
         type: 'analogue-input-5', input: 'eng', sensorValue: 12000, bounds: {lower: 1000, upper: 20000},
        data: [
            {
                "x": 2000,
                "y": 5000,
                "a": "",
                "b": "",
            },
            {
                "x": 10000,
                "y": 15000,
                "a": "",
                "b": "",
            },
            {
                "x": 15000,
                "y": 20000,
                "a": "",
                "b": "",
            },
            {
                "x": 20000,
                "y": 25000,
                "a": "",
                "b": "",
            },
        ]
    }, /*{
        type: 'analogue-input-4', input: 'stblt', sensorValue: 1200, bounds: {lower: 200, upper: 1000},
        data: [
            {
                "x": 200,
                "y": 500,
                "a" : "",
                "b" : "",
            },
            {
                "x": 1060,
                "y": 8600,
                "a" : "",
                "b" : "",
            },
            {
                "x": 1440,
                "y": 14460,
                "a" : "",
                "b" : "",
            },
            {
                "x": 4125,
                "y": 30200,
                "a" : "",
                "b" : "",
            },
        ]
    },*/
];

const TextFieldInput = ({value, label, onChange, disabled}) => {
    return (
        <Box component="form" sx={{'& .MuiTextField-root': {m: 1, width: "40ch"},}}
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
    )
}

const InputsDropDown = ({inputsList, label, input, changeInput, edit}) => {
    return (
        <Box
            component="form"
            sx={{"& .MuiTextField-root": {m: 1, width: "50ch"}}}
            noValidate
            autoComplete="off"
        >
            <TextField
                id="inputs-list"
                select
                label={label ?? `Select`}
                value={input}
                disabled={edit}
                onChange={changeInput}
            >
                {inputsList.map((option, index) => (
                    <MenuItem className={clsx(option?.isSelected && "text-grey")} key={index} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
        </Box>
    );
};

const ActionButtons = ({input, data, onCreate, onClear, editable}) => {
    return (
        <>
            <Box className="flex flex-nowrap justify-end">
                {/*<Tooltip title="Create Record">*/}
                <IconButton
                    disabled={!input}
                    className="p-0"
                    onClick={() => onCreate()}>
                    <IconPlaceHolder
                        icon={'add'}
                        color={clsx(input ? 'text-red' : 'text-grey')}
                        bgColor={clsx(input && 'bg-red-50')}
                    />
                </IconButton>

                {/*</Tooltip>*/}
                {data?.length > 0 && (
                    <Box className="ml-10">
                        {/*<Tooltip title="Clear Record">*/}
                        <IconButton
                            disabled={data?.length && editable}
                            className="p-0"
                            onClick={() => onClear()}>
                            <IconPlaceHolder
                                icon={'cached'}
                                color={clsx(!editable ? 'text-red' : 'text-grey')}
                                bgColor={clsx(!editable && 'bg-red-50')}
                            />
                        </IconButton>
                        {/*</Tooltip>*/}
                    </Box>
                )}
            </Box>
        </>
    )
}

const DigitalInputs = ({editing}) => {
    const [filteredAnalogueTypesList, setFilteredAnalogueTypesList] = useState(analogueInputsTypes);
    const [filteredAnalogueInputsList, setFilteredAnalogueInputsList] = useState([]);
    const [record, setRecord] = useState(null);
    const [editable, setEditable] = useState(true);
    const [dataRow, setDataRow] = useState([]);
    const [analogueInputType, setAnalogueInputType] = useState("");
    const [analogueInput, setAnalogueInput] = useState({input1: ""});
    const [inputData, setInputData] = useState([]);
    const [sensorValue, setSensorValue] = useState(null);
    const [sensorInputValue, setSensorInputValue] = useState(null);
    const [bounds, setBounds] = useState({});
    const [isValidSensVal, setIsValidSensVal] = useState(null);

    useEffect(() => {
        if (inputsApiData.length > 0) {
            const anaInp = inputsApiData?.find(item => item?.type === "analogue-input-1");
            setAnalogueInputType(anaInp?.type);
        }
    }, [])

    useEffect(() => {
        if (inputsApiData.length > 0) {
            const analogue = inputsApiData.find(ele => ele?.type === analogueInputType);
            setAnalogueInput((analogueInput) => ({...analogueInput, input1: analogue?.input}) ?? "");
            setInputData(analogue?.data ?? []);
            setSensorValue(analogue?.sensorValue ?? "");
            setBounds(analogue?.bounds ?? null);
        }
    }, [analogueInputType]);

    useEffect(() => {
        const inputsList = Object.values(analogueInput);
        const filterInputs = analogueInputs.filter((item) =>
            inputsList.filter((ele) => ele !== item.value)
        );
        setFilteredAnalogueInputsList(filterInputs);
    }, [analogueInput])

    useEffect(() => {
        if (filteredAnalogueInputsList.length > 0) {
            filteredAnalogueInputsList?.map((item, indx) => inputsApiData?.map((ele, idx) => {
                ele?.input === item?.value && (filteredAnalogueInputsList[indx] = {
                    ...filteredAnalogueInputsList[indx],
                    isSelected: true
                });
            }));
        }

        if (filteredAnalogueTypesList.length > 0) {
            filteredAnalogueTypesList?.map((item, indx) => inputsApiData?.map((ele, idx) => {
                ele?.type === item?.value && (filteredAnalogueTypesList[indx] = {
                    ...filteredAnalogueTypesList[indx],
                    isSelected: true
                });
            }));
        }

    }, [filteredAnalogueInputsList, filteredAnalogueTypesList])

    useEffect(() => {
        if (sensorValue) {
            ((sensorValue >= bounds?.lower) && (sensorValue <= bounds?.upper)) ? setIsValidSensVal(true) : setIsValidSensVal(false);
            setSensorInputValue(false);
        }
    }, [sensorValue, bounds])

    useEffect(() => {
        !inputData?.length > 0 && setEditable(false);
    }, [])

    const onUpdateAnalogueInput = (input) => {
        input === "input1" && setAnalogueInput((analogueInput) => ({...analogueInput, input1: ""}));
    };

    const onAnalogueInputVerify = (value) => {
        const inputStateList = Object.entries(analogueInput);
        const filterStateCheck = inputStateList.filter((item) =>
            item.find((ele) => ele === value)
        );
        const dynamicInputCheck = filterStateCheck.map((item) => item[0])[0];
        return (
            filterStateCheck.length > 0 && onUpdateAnalogueInput(dynamicInputCheck)
        );
    };

    const onCreateRecord = () => {
        setRecord(true);
    }

    const onClearRecord = () => {
        setInputData([])
    }

    const onResetRecord = () => {
        setRecord(false);
    }

    const onToggleEdit = () => {
        editable ? setEditable(false) : setEditable(true);
    }

    return (
        <>
            <Grid container direction="row" alignItems="center">
                <Grid item md={4}>
                    <InputsDropDown
                        label={`Type`}
                        edit={editing}
                        inputsList={filteredAnalogueTypesList}
                        input={analogueInputType}
                        changeInput={(event) => {
                            onAnalogueInputVerify(event.target.value);
                            setAnalogueInputType(event.target.value);
                        }}
                    />
                </Grid>
                <Grid item md={4}>
                    <Box className="flex flex-nowrap items-center">
                        <InputsDropDown
                            label={`Input`}
                            edit={editing || (inputsApiData.length > 0 && editable)}
                            inputsList={filteredAnalogueInputsList}
                            input={analogueInput?.input1}
                            changeInput={(event) => {
                                onAnalogueInputVerify(event.target.value);
                                setAnalogueInput((analogueInput) => ({
                                    ...analogueInput,
                                    input1: event.target.value,
                                }));
                            }}
                        />
                        {inputData?.length > 0 && (
                            <Box className="ml-10">
                                <IconButton className="m-4" disabled={editing} onClick={onToggleEdit} size="small">
                                    <Icon className={clsx(editable && "text-grey")}>edit</Icon>
                                </IconButton>
                            </Box>
                        )}
                    </Box>

                </Grid>
                {!inputData?.length && (
                    <Grid item md={2}>
                        <TextField
                            required
                            focused={sensorInputValue ?? false}
                            color={sensorInputValue ? 'warning' : 'primary'}
                            id="sensor-value"
                            label="Sensor value"
                            defaultValue={sensorValue}
                            onChange={(eve) => {
                                setSensorValue(eve?.target?.value);
                            }}
                            helperText={sensorInputValue && 'Please put sensor value'}
                        />
                    </Grid>
                )}
                <Grid item md={2} className="text-right">
                    <ActionButtons
                        input={analogueInput?.input1}
                        data={inputData}
                        onCreate={() => onCreateRecord()}
                        onClear={onClearRecord}
                        editable={editable}/>
                </Grid>
            </Grid>
            {inputData?.length > 0 && (
                <Grid container direction="row" alignItems="center">
                    <Grid item md={4}>
                        <TextFieldInput
                            label="Lower bound"
                            value={bounds?.lower}
                            disabled
                            onChange={(event) => {
                                setBounds(value => ({...value, lower: event?.target?.value}));
                            }}/>
                    </Grid>

                    <Grid item md={4}>
                        <TextFieldInput
                            label="Upper bound"
                            value={bounds?.upper}
                            disabled
                            onChange={(event) => setBounds(value => ({
                                ...value,
                                upper: event?.target?.value
                            }))}/>
                    </Grid>

                    <Grid item md={4}>
                        <TextField
                            required
                            focused
                            color={isValidSensVal ? "success" : "warning"}
                            id="sensor-value"
                            label={`Previous sensor value`}
                            value={sensorValue}
                        />
                    </Grid>
                </Grid>
            )}

            <Grid container direction="row" alignItems="center">
                <Grid item md={12}>
                    <AnalogueInputTable
                        type={analogueInputType}
                        input={analogueInput?.input1}
                        create={record}
                        onResetRec={onResetRecord}
                        inputsData={inputData}
                        sensorVal={sensorValue}
                        editable={editable}
                        boundValues={bounds}
                        onData={(data) => setDataRow(data)}
                        onSensorValueInput={(data) => setSensorInputValue(data)}
                    />
                </Grid>
            </Grid>
        </>
    );
};

export default DigitalInputs;
