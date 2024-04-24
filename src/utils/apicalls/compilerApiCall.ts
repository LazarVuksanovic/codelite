import axios from 'axios';
import { Problem } from '../types/problem';



const testSubmittedCode = async (userCode: String, problem:Problem, lang:string) => {
  // userCode += "\nconsole.log(twoSum([2,7,11,15], 9).toString() === [0,1].toString())"
  const options = {
        method: 'POST',
        url: 'https://online-code-compiler.p.rapidapi.com/v1/',
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'online-code-compiler.p.rapidapi.com'
        },
        data: {
          language: lang,
          version: 'latest',
          code: userCode,
          input: null
        }
      };
      
      try {
          const response = await axios.request(options);
          console.log(response.data);
      } catch (error) {
          console.error(error);
      }
}

export default testSubmittedCode