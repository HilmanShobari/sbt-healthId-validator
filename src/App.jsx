// @ts-check

import React, { useState, useEffect } from 'react';
import './App.css';
import Html5QrcodePlugin from './Html5QrcodePlugin.jsx';
import axios from 'axios';

const App = (props) => {
     const [status, setStatus] = useState(null);
     const [message, setMessage] = useState('');
     const [data, setData] = useState('');
     const [loading, setLoading] = useState(false);
     const [decodedResults, setDecodedResults] = useState([]);

     const apiUrl = 'https://dev-e-wallet-api.qoincrypto.id/ids/check';
     const apiKey = 'Q97XCzBMH7xgqP7fLnK8kCYled';

     const handleResult = async (result) => {
          console.log('result', result);
          if (loading === true) return;
          try {
               setLoading(true);
               const res = await axios.post(
                    apiUrl,
                    { data: result },
                    {
                         headers: {
                              'API-KEY': apiKey,
                         },
                    }
               );
               console.log('res ', res);
               if (res.data?.status_code === 200) {
                    setStatus(true);
               } else {
                    setStatus(false);
               }
               setMessage(res.data?.message);
               setData(res.data?.data);
          } catch (error) {
               setStatus(false);
               setMessage(error?.message);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          if (!!message) {
               setTimeout(() => {
                    setMessage('');
                    setData('');
               }, 10000);
          }
     }, [message]);

     return (
          <div className="App">
               <section className="App-section">
                    <div>
                         {loading ? (
                              <div>Loading...</div>
                         ) : message ? (
                              status === true ? (
                                   <>
                                        <div className="result-container">
                                             <img src="https://i.gifer.com/7efs.gif" width={400} height={300} alt="status" />
                                             <h1>{message}</h1>
                                             <br />
                                             <ul>
                                                  <li>Nama: {data.name}</li>
                                                  <li>NIK: {data.NIK}</li>
                                                  <li>Tanggal Lahir: {data.dateOfBirth}</li>
                                                  <li>Nama Rumah Sakit: {data.hospitalName}</li>
                                                  <li>Alamat Rumah Sakit: {data.hospitalAddress}</li>
                                             </ul>
                                        </div>
                                   </>
                              ) : (
                                   <>
                                        <div className="result-container">
                                             <img src="failed.gif" width={300} height={300} alt="failed" />
                                             <h1>{message}</h1>
                                        </div>
                                   </>
                              )
                         ) : (
                              <>
                                   <div className="qr-container">
                                        <h1>Scan Qr Code Anda</h1>
                                        <div>
                                             <Html5QrcodePlugin
                                                  fps={50}
                                                  qrbox={350}
                                                  disableFlip={true}
                                                  qrCodeSuccessCallback={(result) => {
                                                       if (!!result) {
                                                            handleResult(result);
                                                       }
                                                  }}
                                             />
                                        </div>
                                   </div>
                              </>
                         )}
                    </div>
               </section>
          </div>
     );
};

export default App;
