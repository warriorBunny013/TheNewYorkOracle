import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../utils/apiConfig';

function AboutLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/api/admin/login`, { email, password }, { withCredentials: true });
            if (response.status === 200) {
                navigate('/adminpanel'); // Redirect to admin dashboard
                console.log("actually no error in handlesubmit")
            }
        } catch (err) {
            setError('Invalid email or password');
            console.log("actually error in handlesubmit")
        }
    };

    return (
        <div className='bg-black-variation'>
            <div className="min-h-screen flex flex-col items-center justify-center bg-black-variation">
                <div className="flex flex-col bg-black-variation border shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md">
                    <div className="self-center text-xl sm:text-2xl uppercase text-white font-bold">Login To Your Admin</div>
                    {error && <div className="text-red-500 text-center mt-2">{error}</div>}
                    <div className="mt-10">
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col mb-6">
                                <label htmlFor="email" className="mb-1 text-xs sm:text-sm tracking-wide text-white">E-Mail Address:</label>
                                <div className="relative">
                                    <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                        <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                            <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                    <input id="email" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400" placeholder="E-Mail Address" />
                                </div>
                            </div>
                            <div className="flex flex-col mb-6">
                                <label htmlFor="password" className="mb-1 text-xs sm:text-sm tracking-wide text-white">Password:</label>
                                <div className="relative">
                                    <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                        <span>
                                            <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </span>
                                    </div>
                                    <input id="password" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400" placeholder="Password" />
                                </div>
                            </div>
                            <div className="flex w-full">
                                <button type="submit" className="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-blue-600 hover:bg-blue-700 rounded py-2 w-full transition duration-150 ease-in">
                                    <span className="mr-2 uppercase">Access Admin panel</span>
                                    <span>
                                        <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                            <path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutLogin;
