import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import axios from 'axios';
import config from "../config";
import MyModal from "../components/MyModal";
import dayjs from 'dayjs';
function Index(){
    const [products, setProducts]= useState([]);
    const [carts,setCarts]=useState([]); //items in Carts
    const [recordInCarts, setRecordInCarts] = useState(0);
    const [sumQty,setSumQty] = useState(0);
    const [sumPrice, setSumPrice] = useState(0);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [payDate,setPayDate] = useState(dayjs(new Date()).format('YYYY-MM-DD'));
    const [payTime,setPayTime] = useState('');
    useEffect(()=> {
        fetchData();
        fetchDataFromLocal();
    },[]);

    const fetchData = async () => {
        try{
            const res = await axios.get(config.apiPath + '/product/list');
            if (res.data.results !== undefined){
                setProducts(res.data.results)
            }
        }catch(e){
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const fetchDataFromLocal = () => {
        const itemInCarts = JSON.parse(localStorage.getItem('carts'));

        if(itemInCarts !== null){
            setCarts(itemInCarts);
            setRecordInCarts(itemInCarts !== null ? itemInCarts.length : 0);

            computePriceAndQty(itemInCarts);
        }
    }

    
    function showImage(item) {
        if (item.img !== undefined) {
            let imgPath = config.apiPath + '/uploads/' + item.img;

            if (item.img === "") imgPath = "default image.jpg";
            return (
                <img 
                className="cart-img-top" 
                src={imgPath} 
                alt="" 
                style={{ width: '100%', height: '250px', objectFit: 'cover' }} // กำหนดขนาดและอัตราส่วนภาพให้เหมือนกันทุกการ์ด
            />
            );
        }
    }

    const addToCart = (item) =>{
        let arr = carts;
        if (arr === null) {
            arr = [];
        }

        arr.push(item);

        setCarts(arr);
        setRecordInCarts(arr.length);

        localStorage.setItem('carts', JSON.stringify(carts));

        fetchDataFromLocal();
    }
 
    const computePriceAndQty = (itemInCarts) => {
        let sumQty  = 0;
        let sumPrice = 0;
        for (let i=0; i < itemInCarts.length; i++){
            const item = itemInCarts[i];

            sumQty++;
            sumPrice += parseInt(item.price);
      }
      setSumPrice(sumPrice);
      setSumQty(sumQty);
    }
    const handleRemove = async (item) =>{
        try{
             const button = await Swal.fire({
                 title: 'Delete item',
                 text: 'Are you sure to delete this item?',
                 icon: 'question',
                 showCancelButton: true,
                 showCloseButton: true
             })
 
             if (button.isConfirmed){
                 let arr = carts;
 
                 for (let i=0; i < arr.length; i++){
                     const itemInCart = arr[i];
 
                     if (item.id === itemInCart.id) {
                         arr.splice(i, 1);
                     }
             }
             setCarts(arr);
             setRecordInCarts(arr.length); 
 
             localStorage.setItem('carts', JSON.stringify(arr));

             computePriceAndQty(arr);
        } 
     }catch (e){
        Swal.fire({

            title: 'error',
            text: e.message,
            icon: 'error'
         })

       }
    }
   
    const handleSave = async() => {
        try{
            const payload = {
                customerName: customerName,
                customerPhone: customerPhone,
                customerAddress: customerAddress,
                payDate: payDate,
                payTime: payTime,
                carts: carts
            }

            const res = await axios.post(config.apiPath + '/api/sale/save', payload);

            if(res.data.message === 'success'){
                localStorage.removeItem('carts');
                setRecordInCarts(0);
                setCarts([]);

                Swal.fire({
                    title: 'Save data',
                    text: 'Saving is success',
                    icon: 'success'
                })

                document.getElementById('modalCart_btnClose').click();
                setCustomerName('');
                setCustomerPhone('');
                setCustomerAddress('');
                setPayDate(new Date());
                setPayTime('');
            }
        }catch(e){
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    return <>

        <div className="container mt-3" >
            <div className="float-start">
               <div className="h3">Product in Exz.com </div>
            </div>
            <div className="float-end">
                My cart 
                <button 
                    data-bs-toggle='modal'
                    data-bs-target= '#modalCart'

                    className="btn btn-outline-success ms-2 me-2">
                        <i className="fa fa-shopping-cart me-2 "></i>
                        {recordInCarts}
                    </button>
                   {/* แสดง "No items" เมื่อจำนวนสินค้าเป็น 0 */}
                  { recordInCarts > 1   ? 'items' : 'item'}
            </div>
            <div className="clearfix"></div>
           
            <div className="row">

                {products.length > 0 ? products.map(item =>
                    <div className="col-3 mt-3" key={item.id}>
                        <div className="card" style={{ border: '1px solid #ccc', padding: '15px' }}> 
                     

                        
                            {showImage(item)}
                            <div className="card-body" >
                                <div>{item.name}</div>
                                <div>{item.price.toLocaleString('th-Th')}</div>
                                <div className="text-center">
                                    <button className="btn btn-primary" onClick={e=> addToCart(item)}>
                                        <i className="fa fa-shopping-cart mr-2 me-2"></i>
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                ) : <> </>}

            </div>

      </div>
     
     <MyModal id="modalCart" title="My cart">
        <table className="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>name</th>
                    <th className="text-end">price</th>
                    <th className="text-end">quantity</th>
                    <th width="60px"></th>
                </tr>
            </thead>
            <tbody>
                {carts.length > 0 ? carts.map(item =>
                    <tr key={item.id}>
                        <td>{item.name}</td>
                        <td className="text-end">{item.price.toLocaleString('th-Th')}</td>
                        <td className="text-end">1</td>
                        <td className="text-center">
                            <button className="btn btn-danger" onClick={e => handleRemove(item)}>
                                <i className="fa fa-times"></i>

                            </button>
                        </td>
                    </tr>
                ) : null}
            </tbody>
        </table>
        <div className="text-center">
            ຈຳນວນ {sumQty} ລວມເປັນເງິນ {sumPrice} KIP
        </div>

        <div className="mt-3">
               <div className="alert alert-info">
                    <div className="text-center">Please tranfer money to BCEL bank account</div>
                    <div className="text-center">MR THANONGPHONE ANOTHAY</div>
                    <div className="text-center">2783712983701</div>
                </div>
                <div>
                    <div>Name</div>
                    <input className="form-control "  type="text" onChange={e => setCustomerName(e.target.value)}/>
                </div>
                <div className="mt-3">
                    <div>Tel</div>
                    <input className="form-control " type="text" onChange={e => setCustomerPhone(e.target.value)}/>
                </div>
                <div className="mt-3">
                    <div>Village,City,Province</div>
                    <input className="form-control " type="text" onChange={e => setCustomerAddress(e.target.value)}/>
                </div>
                <div className="mt-3">
                    <div>Money transfer date</div>
                    <input className="form-control " type="date" value={payDate} onChange={e => setPayDate(e.target.value)}/>
                </div>
                <div className="mt-3">
                    <div>Money transfer time</div>
                    <input className="form-control " type="time"  onChange={e=> setPayTime(e.target.value)}/>
                </div>

                <button className="btn btn-primary mt-3" onClick={handleSave}> 
                    <i className="fa fa-check mr-2"> </i> Confirm Checkout
                </button>
        </div>
     </MyModal>
    </>


}
export default Index;

