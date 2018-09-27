export class Shelve {
    shelveid: number; 
    shopid: number;
    productid:number; 
    size:number;  
    porcentage:number;
  /*   createdon: any; 
    cratedby:number; 
    modifiedon:any; 
    modifiedby:number; 
    deletedon: any; 
    deletedby: number; */
    isdeleted: boolean; 
    isactive: boolean; 
}

export class Stock{
  stockid:number;
  shopid:number;
  productid:number;
  cantity:number;
  isactive:boolean;
  isdeleted:boolean;
}
