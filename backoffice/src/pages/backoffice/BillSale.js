import { useEffect, useState } from "react";
import BackOffice from "../../components/BackOffice";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../../config";
import dayjs from "dayjs";
import MyModal from "../../components/MyModal";

function BillSale(){
    const [billSales, setBillSales]= useState([]);
    const [billSaleDetails, setBillSaleDetails]= useState([]); //from billSaleDetails table
    const [sumPrice,setSumPrice]=useState(0);

    useEffect(() =>{
        fetchData();
    },[]);
    const fetchData = async () => {
        try{
            const res = await axios.get(config.apiPath + '/api/sale/list',config.headers());
            if (res.data.results !== undefined) {
                setBillSales(res.data.results);
            }
        }catch(e){
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const openModalInfo = async (item)=>{
        try{
            const res = await axios.get(config.apiPath + '/api/sale/billInfo/'+ item.id, config.headers());
            if (res.data.results!== undefined){
                setBillSaleDetails(res.data.results);


                let mySumPrice =0;
                for (let i=0; i<res.data.results.length; i++){
                    mySumPrice += parseInt(res.data.results[i].price);
                }

                setSumPrice(mySumPrice);
                  
            }
        }catch(e){
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const handlePay = async(item) => {
        try{
            const button = await Swal.fire({
                title: 'Comfirm payment',
                text: 'You received payment and verified your information',
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true
            });
            if( button.isConfirmed){
                const res = await axios.get(config.apiPath + '/api/sale/updateStatusToPay/' + item.id, config.headers());
                if(res.data.message === 'success'){
                    Swal.fire({
                        title: 'save',
                        text: 'Data saved successfully',
                        icon: 'success',
                        timer: 4000
                    })
                    
                }
            }

        }catch(e){
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const handleSend = async(item) => {
        try{
            const button = await Swal.fire({
                title: 'Comfirm Shipping',
                text: 'You want to save shipping successfully',
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true
            });
            if( button.isConfirmed){
                const res = await axios.get(config.apiPath + '/api/sale/updateStatusToSend/' + item.id, config.headers());
                if(res.data.message === 'success'){
                    Swal.fire({
                        title: 'save',
                        text: 'Data saved successfully',
                        icon: 'success',
                        timer: 4000
                    })
                    
                }
            }

        }catch(e){
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const handleCancel = async(item) => {
        try{
            const button = await Swal.fire({
                title: 'Comfirm Cancel',
                text: 'You want to cancel this order',
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true
            });
            if( button.isConfirmed){
                const res = await axios.get(config.apiPath + '/api/sale/updateStatusToCancel/' + item.id, config.headers());
                if(res.data.message === 'success'){
                    Swal.fire({
                        title: 'save',
                        text: 'cancel data successfully',
                        icon: 'success',
                        timer: 4000
                    })
                    
                }
            }

        }catch(e){
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const displayStatusText = (item) => {
        if(item.status === 'wait'){
            return <div className="badge bg-dark"> Waiting for verification </div>
        }else if(item.status === 'pay'){
            return <div className="badge bg-success"> Paid successfully </div>
        }else if (item.status === 'send'){
            return <div className="badge bg-primary"> Shipped successfully </div>
        }else if (item.status === 'cancel'){
            return <div className="badge bg-danger"> Cancelled </div>
        }
    }


       return <BackOffice>
        <div className="card">
            <div className="card-header">
                <div className="card-title">Sales list</div>
            </div>
            <div className="card-body">
                <table className="table table-bordered table-striped">
                    <thead>
                        <th>Custommer</th>
                        <th>Tel</th>
                        <th>address</th>
                        <th>paid date</th>
                        <th>Time</th>
                        <th>status</th>
                        <th width='480px'></th>
                      
                    </thead>
                    <tbody>
                        {billSales.length > 0 ? billSales.map(item =>
                            <tr key={item.id}>
                                <td>{item.customerName}</td>
                                <td>{item.customerPhone}</td>
                                <td>{item.customerAddress}</td>
                                <td>{dayjs(item.payDate).format('DD/MM/YYYY')}</td>
                                <td>{item.payTime}</td>
                                <td>{displayStatusText(item)}</td>
                            
                                <td className="text-center">
                                    <button className="btn btn-secondary mr-1"
                                        data-toggle='modal'
                                        data-target='#modalInfo'
                                        onClick={e => openModalInfo(item)}>
                                        <i className="fa fa-file-alt mr-2"></i>list
                                    </button>
                                    <button className="btn btn-info mr-1"
                                     onClick={e => handlePay(item)} >
                                 
                                        <i className="fa fa-check mr-2"></i>Paid success
                                    </button>
                                    <button className="btn btn-success mr-1"
                                    onClick={e => handleSend(item)} >    
                                    
                                        <i className="fa fa-file mr-2"></i>Shipped
                                    </button>
                                    <button className="btn btn-danger"
                                     onClick={e => handleCancel(item)}
                                    >
                                        <i className="fa fa-times mr-2"></i>Cancel
                                    </button>
                                </td>
                            </tr>
                        ) : <></>}
                    </tbody>
                </table>
            </div>
        </div>

        <MyModal id='modalInfo' title='Bill Detail'>
            <table className="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>List</th>
                        <th className="text-right">price</th>
                        <th className="text-right">quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {billSaleDetails.length > 0 ? billSaleDetails.map(item => 
                        <tr key={item.id}>
                            <td> {item.Product.name}</td>
                            <td className="text-right">{item.price.toLocaleString('th-TH')}</td>
                            <td className="text-right">1</td>
                        </tr>

                    ) : <></>}
                </tbody>
            </table>
            <div className="text-center mt-3">
                Total:   {sumPrice.toLocaleString('th-TH')} KIP
            </div>
          
        </MyModal>
    </BackOffice>
}



export default BillSale;