import BackOffice from "../../components/BackOffice";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import config from "../../config";
import axios from "axios";


ChartJS.register(CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend);

function DashBoard(){
    const [data, setData] = useState(null);
    const[options] = useState({
        responsive : true,
        plugins : {
            legend: {
                positiopn : 'top'
            },
            title: {
                display: true,
                text: 'Monthly Sales Data'
            },
          
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }


    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const res = await axios.get ( config.apiPath + '/api/sale/dashboard', config.headers());
        let data = [];

        if ( res.data.results !== undefined) {

            for (let i = 0 ; i< res.data.results.length; i++) {
                data.push(res.data.results[i].sumPrice);
                
            }
        }

        setData({
            labels : ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
            datasets: [
                {
                    label: 'Monthly Sales',
                    data : data,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ]
        });

       
        
    }

  
    

    return <BackOffice>
        {data ? (
              <Bar data={data} options={options} style={{width: '50%'}}/>
       
        ) : (
        
           <p>Loading...</p>
        
        )}
      

    
    </BackOffice>
}

export default DashBoard;