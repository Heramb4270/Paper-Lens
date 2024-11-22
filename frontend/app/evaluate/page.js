""
"use client";
import React from 'react'
import SideBar from '@/components/SideBar'
import { IoSettingsSharp } from "react-icons/io5";
import { useState } from 'react';
import Marksheet from '@/components/Marksheet';
 
export default function Main() {

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
  const [response, setResponse] = useState(null);
  const handleStudentFileChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected Student File:", file);  // Debugging
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
      console.log("Submitting form...");
      console.log("Student File:", studentFile);
      console.log("Answer Sheet File:", answersheetFile);
      console.log("Teacher:", teacher);
      console.log("Student:", student);
      console.log("PRN:", prn);
      console.log("Subject:", subject);
   // Check if required fields are filled
      // Check if required fields are filled
      if (!student || !prn || !subject) {
          setError("Please fill all the fields.");
          setLoading(false);
          return;
      }
      

      const formData = new FormData();
      formData.append("answer_key", studentFile);
      formData.append("teacher", "random");
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
          console.log("Response Data:", data);
                  console.log("Response received:", data);
                  setResponse(data);
                  // You can handle the response further if needed
              
          setLoading(false);
      } catch (error) {
          setError("Something went wrong. Please try again later.");
          setLoading(false);
      }
  };
  
  return (
    <div >
    <SideBar>
      <div className='bg-white dark:bg-gray-800 dark:text-gray-200 p-5 rounded-md'>
        <h1 className='text-2xl font-semibold mb-3 text-gray-500 dark:text-gray-300'>Evaluate Student Answer Sheet</h1>
        <p className='text-base text-gray-500 dark:text-gray-400'>Upload the student's answer sheet and the correct answer sheet to evaluate the student's performance</p>

        <form className="mx-auto mt-5" method='POST'>
          <div className="mb-5">
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Student Name</label>
            <input type="text" onChange={(e)=>setStudent(e.target.value)} id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="eg. Sarthak Jadhav" required />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="mb-5">
              <label htmlFor="pnr" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Student PNR</label>
              <input type="number" onChange={(e)=>setPrn(e.target.value)} id="pnr" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required placeholder="eg. 1234567890" />
            </div>
            <div className="mb-5">
              <label htmlFor="code" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Subject Code</label>
              <input type="text" onChange={(e)=>setSubject(e.target.value)} id="code" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required placeholder="eg. AI2003" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="mb-5">
              <p htmlFor="code" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Model Answer Sheet</p>
              <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file2" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                  </div>
                  <input  onChange={(e)=>setAnswersheetFile(e.target.files[0])}   id="dropzone-file2" type="file" class="hidden" accept=".pdf" />
                </label>
              </div>
            </div>
            <div className="mb-5">
              <p htmlFor="code" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Student Answer Sheet</p>
              <div className="flex items-center justify-center w-full">
                
                 
 (<label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
 <div className="flex flex-col items-center justify-center pt-5 pb-6">
   <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
   </svg>
   <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
   <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
 </div>
 <input id="dropzone-file" type="file" className="hidden" accept=".pdf" onChange={(e)=>setStudentFile(e.target.files[0])} />
 {/* <input id="dropzone-file" onChange={(e)=>setStudentFile(e.target.files[0])}  type="file" className="hidden" /> */}
</label>)
                
               
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <button type='button' onClick={handleSubmit} className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 min-w-[10rem]">Evaluate</button>
          </div>
        </form>
      </div>
    </SideBar>
    <div className=' flex items-center justify-center '>
      {
        loading && <div className='flex items-center justify-center'>
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      }
      {!loading && response && <Marksheet reportData={response} />}
      {error && <div className='text-red-500 text-center'>{error}</div>}
    {/* <Marksheet /> */}

    </div>
    </div>
  )
}
