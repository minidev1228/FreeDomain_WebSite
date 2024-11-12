import react, { useEffect, useState } from "react"
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

const FilterInput = ({type, label, refFilterValues, update, isDisabled}) =>{
    const [value, setValue] = useState("") ;
    const [isToggle, setIsToggle] = useState(false); 

    useEffect(()=>{
        if(type === 'Boolean'){
            update(isToggle);
        } else{
            update(value);
        }
    },[value, isToggle])
    
    if(type === "Text" ){
        return  <TextField id="outlined-basic" style={{width:"100%"}} label={label} variant="outlined" value={value} onChange={(e)=>{setValue(e.target.value)}} disabled={isDisabled}/>
    } else if(type === "Dropdown") {
        return <FormControl style={{width:"100%"}}>
            <InputLabel id="demo-simple-select-label">{label}</InputLabel>
            <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label={label}
            value={value} 
            onChange={(e)=>{setValue(e.target.value)}}
            disabled={isDisabled}
            >
                {
                    refFilterValues.map(val=><MenuItem value={val.value}>{val.value}</MenuItem>)
                }
            </Select>
        </FormControl>
    } else if(type==="Number"){
        return <TextField style={{width:"100%"}} id="outlined-basic" label={label} variant="outlined" value={value} 
        onChange={(e)=>{
            let val = e.target.value;
            let num =  Number(val[val.length - 1]);
            // console.log(num);
            if(!isNaN(num)){
                setValue(val)}
            }
        }
        disabled={isDisabled} 
        />
    } else if(type==="Boolean"){
        return <FormControlLabel style={{width:"100%", fontSize:"0.8rem"}} control={<Switch value={isToggle} onChange={()=>{setIsToggle(!isToggle)}} disabled={isDisabled}/>} label={label} />
    }else{
        return <div></div>
    }
}

export default FilterInput