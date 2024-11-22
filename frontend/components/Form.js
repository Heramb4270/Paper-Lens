"use client";
import React, { useState } from 'react';

export default function Form() {
    const [answersheetFile, setAnswersheetFile] = useState(null);
    const [studentFile, setStudentFile] = useState(null);
    const [studentFileName, setStudentFileName] = useState('');
    const [answersheetFileName, setAnswersheetFileName] = useState('');
    const [loading, setLoading] = useState(false);
    const [teacher, setTeacher] = useState('');
    const [student, setStudent] = useState('');
    const [prn, setPrn] = useState('');
    const [subject, setSubject] = useState('');
    const [error, setError] = useState(null);

    const handleStudentFileChange = (e) => {
        const file = e.target.files[0];
        setStudentFile(file);
        setStudentFileName(file ? file.name : '');
    };

    const handleAnswersheetFileChange = (e) => {
        const file = e.target.files[0];
        setAnswersheetFile(file);
        setAnswersheetFileName(file ? file.name : '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!studentFile || !answersheetFile) {
            setError("Please upload both the answer sheet and student file.");
            setLoading(false);
            return;
        }

        // Check if required fields are filled
        if (!teacher || !student || !prn || !subject) {
            setError("Please fill all the fields.");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("answer_key", studentFile);
        formData.append("teacher", teacher);
        formData.append("student", student);
        formData.append("prn", prn);
        formData.append("subject", subject);
        formData.append("answer_sheet", answersheetFile);

        try {
            const response = await fetch("http://localhost:5000/submit-form", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data.error) {
                setError(data.error);
            } else {
                // Check if summary is present in the response
                if (data.response) {
                    console.log("Response received:", data.response);
                    // You can handle the response further if needed
                } else {
                    setError("Something went wrong. Please try again later.");
                }
            }

            setLoading(false);
        } catch (error) {
            setError("Something went wrong. Please try again later.");
            setLoading(false);
        }
    };

    return (
        <div>
            <form className="max-w-screen-md mx-auto" onSubmit={handleSubmit}>
                {/* Teacher Name */}
                <div className="mb-5">
                    <label htmlFor="teacher" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Teacher Name</label>
                    <input
                        type="text"
                        onChange={(e) => setTeacher(e.target.value)}
                        id="teacher"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        required
                    />
                </div>

                {/* Student Name */}
                <div className="mb-5">
                    <label htmlFor="student" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Student Name</label>
                    <input
                        type="text"
                        id="student"
                        onChange={(e) => setStudent(e.target.value)}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        required
                    />
                </div>

                {/* Student PRN and Subject Code */}
                <div className="mb-5 flex justify-between">
                    <div>
                        <label htmlFor="prn" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Student PRN</label>
                        <input
                            type="number"
                            id="prn"
                            onChange={(e) => setPrn(e.target.value)}
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                            placeholder="12320083"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Subject Code</label>
                        <input
                            type="text"
                            id="subject"
                            onChange={(e) => setSubject(e.target.value)}
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                            placeholder="AI3004"
                            required
                        />
                    </div>
                </div>

                {/* File Uploads */}
                <div className="mb-5">
                    {/* Student File Upload */}
                    <div>
                        <label htmlFor="student-file" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Upload Answer Key</label>
                        {studentFileName ? (

            <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600" onClick={() => setFile(null)}>
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 font-semibold">File uploaded successfully</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{studentFileName}</p>
            </div>
            </div>
                            
                        ) : (
                            <div className="flex items-center justify-center mt-3">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">PDF files only (Max 5MB)</p>
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" accept=".pdf" onChange={handleStudentFileChange} />
                            </label>
                        </div>
                        )}
                    </div>

                    {/* Answer Sheet File Upload */}
                    <div className="mt-3">
                        <label htmlFor="answersheet-file" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Upload Student Answer Sheet</label>
                        {answersheetFileName ? (
                           <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600" onClick={() => setFile(null)}>
                           <div className="flex flex-col items-center justify-center pt-5 pb-6">
                               <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 font-semibold">File uploaded successfully</p>
                               <p className="text-xs text-gray-500 dark:text-gray-400">{answersheetFileName}</p>
                           </div>
                           </div>
                        ) : (
                            <div className="flex items-center justify-center mt-3">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">PDF files only (Max 5MB)</p>
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" accept=".pdf" onChange={handleAnswersheetFileChange} />
                            </label>
                        </div>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                >
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
                {error && (
                    <p className="text-red-500 mt-3">{error}</p>
                )}
            </form>
        </div>
    );
}
