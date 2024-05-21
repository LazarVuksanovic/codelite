import axios from 'axios';
import { CompilerResponse, Problem } from '../types/problem';



const testSubmittedCode = async (userCode: string, problem:Problem, lang:string = "nodejs") => {
  userCode = problem.handlerFunction(userCode, problem)
  const compileApi = {
        method: 'POST',
        url: process.env.NEXT_PUBLIC_RAPIDAPI_COMPILER_URL,
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
          'X-RapidAPI-Host': process.env.NEXT_PUBLIC_RAPIDAPI_HOST
        },
        data: {
          language: lang,
          version: 'latest',
          code: userCode,
          input: null
        }
  };
      
  try {
    const response = await axios.request(compileApi);
    const compilerResponse: CompilerResponse = {
      success: !(response.data.output.includes("false") || response.data.output.includes("/home/application.js:")),
      message: response.data.output,
      cpuTime: response.data.cpuTime
    }
    return compilerResponse
  } catch (error) {
    console.error(error);
  }

  const compilerResponse: CompilerResponse = {
    success: false,
    message: "Error",
    cpuTime: "0"
  }
  return compilerResponse
}

export default testSubmittedCode