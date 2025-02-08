import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../Context/AppContext';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get('success') === 'true';
  const transactionId = searchParams.get('transactionId');
  const { backendurl, loadCreditBalance, token } = useContext(AppContext);
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    let isMounted = true; // ✅ Prevent multiple API calls

    const verifyPayment = async () => {
       

      try {
        const { data } = await axios.post(
          `${backendurl}/api/user/verify-payment`,
          { transactionId, success },
          { headers: { token } }
        );

        if (isMounted) {
          if (data.success) {
            
            setIsVerified(true);
            loadCreditBalance();
          } else {
             
            toast.error(data.message);
            setIsVerified(false);
          }
        }
      } catch (error) {
        if (isMounted) {
          
          toast.error('Verification failed.');
        }
      }
    };

    verifyPayment();

    return () => {
      isMounted = false; // ✅ Cleanup function
    };
  }, [backendurl, transactionId, success, loadCreditBalance, token]);

  // ✅ Navigate only when isVerified becomes true
  useEffect(() => {
    if (isVerified) {
      
      navigate('/');
    }
  }, [isVerified, navigate]);

  if (!isVerified) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="w-[100px] h-[100px] border-4 border-gray-400 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] grid place-items-center">
      <h1 className="text-3xl font-bold">Payment Successful!</h1>
      <button
        className="mt-5 px-5 py-2 bg-blue-500 text-white rounded-lg"
        onClick={() => navigate('/')}
      >
        Home
      </button>
    </div>
  );
};

export default Verify;
