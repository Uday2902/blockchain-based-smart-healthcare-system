import React, { useEffect, useState } from 'react';
import {Link} from "react-router-dom"
import "./styles/Billing.css"
import CardLoading from "./CardLoading"
import axios from "axios";
import CardComponent from './CardComponent';


const Billing = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            await axios.get("https://jsonplaceholder.typicode.com/photos")
            .then((response) => {
                let responseData = response.data;
                responseData = responseData.slice(0, 10);
                setData(responseData);
                setLoading(false);
            })
        }
        fetchData()
    }, [])

    

  return (
    <div className="billing-main-div">
      {
        loading ? (
            <CardLoading />
        ) : (
            <>
            {
                data?.map((element) => {
                    return (
                        <Link key={element.id} to={`https://jsonplaceholder.typicode.com/photos?id=${element.id}`} >
                            <CardComponent element={element} />
                        </Link>
                    )
                })
            }
            </>
        
        )
      }
    </div>
  );
};

export default Billing;
