export function f_convert_to_number(data:any):number{
    if(!data||data.replace(/ /g,'')=='')return 0;
    return Number(data.replace(/,/g,''));
}
export function f_convert_to_number_tostring(data:any):string{
    if(!data||data.replace(/ /g,'')=='')return '0';
    return Number(data.replace(/,/g,''))+'';
}
