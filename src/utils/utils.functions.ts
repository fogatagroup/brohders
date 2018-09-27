
export var quartil=(array:number[],value:number)=>{
    //console.log("array",array)
    var new_array=array.sort((t1,t2)=>t1-t2);
    var drop1=new_array.splice(0,1)[0];
    var drop2=new_array.splice(new_array.length-1,1)[0];
    var val=(value*(new_array.length+1))/4;
    var ent=Math.floor(val);
    var diff=val-ent;
    new_array.push(drop1);
    new_array.push(drop2)
    if(diff==0){
        return new_array[ent-1];
    }else{
        return new_array[ent-1]+diff*(new_array[ent]-new_array[ent-1])
    }
}

export var average=(array:number[])=>{
    var total=0;
    array.forEach(t=>total=total+t);
    return total/array.length;
}


export var lir=(cuartil1:number, average:number)=>{
    if(cuartil1-(average-cuartil1)>0){
        return cuartil1-(average-cuartil1);
    }else{
        return 0;
    }
}

export var lsr=(average:number, cuartil3:number)=>{
    return cuartil3+(cuartil3-average);
}

export var final_result=(value:number, lir:number,lsr:number)=>{
    if(value>=lir&&value<=lsr){
        return value;
    }else{
        return 0;
    }
}