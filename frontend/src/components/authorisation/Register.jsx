import React, {SyntheticEvent, useState} from 'react';
import { redirect } from 'react-router-dom';

function Register(){
    const [email, setEmail] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [registered, setRegistered] = useState(false);
    const [displayText, setDisplayText] = useState('');

    const submit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8000/user/register/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email,
                first_name,
                last_name,
                password
            })
            
        });
        
        // User already exists
        if (!response.ok) {
            setRegistered(false);
            setDisplayText('User already exists');
            
        }
        else{
            setRegistered(true);
            setDisplayText('You have successfully registered, please wait to be approved')
        }    
        
    }

    return (
      <div class='mt-4 grid v-screen place-items-center'>
        <h1 className="h1 mb-4 ">Please register</h1> 
        <form class="w-full max-w-lg" onSubmit={submit}>
          <div class="flex flex-wrap -mx-4 mb-2">
            <div class="w-full md:w-2/4 px-3 mb-6 md:mb-0">
              <label class="block uppercase tracking-wide text-slate-400 text-xs font-bold mb-2" for="grid-city">
                Email
              </label>
              <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                     id="grid-city"
                     type="text"
                     required
                     onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div class="w-full md:w-1/4 px-3 mb-6 md:mb-0">
              <label class="block uppercase tracking-wide text-slate-400 text-xs font-bold mb-2" for="grid-state">
                First Name
              </label>
              <div class="relative">
              <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                     id="grid-zip1"
                     type="text"
                     required
                     onChange={e => setFirstName(e.target.value)}
              />
              </div>
            </div>
          <div class="w-full md:w-1/4 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-slate-400 text-xs font-bold mb-2" for="grid-zip">
              Last Name
            </label>
            <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                   id="grid-zip2"
                   type="text"
                   required
                   onChange={e => setLastName(e.target.value)}
            />
          </div>
        </div>


        <div class="flex flex-wrap -mx-3 mb-6">
          <div class="w-full px-2">
            <label class="block uppercase tracking-wide text-slate-400 text-xs font-bold mb-2" for="grid-password">
              Password
            </label>
            <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-password"
                    type="password"
                    required
                    onChange={e => setPassword(e.target.value)}
            />
          </div>
            
        </div>

        <div class="flex flex-col items-center">
          <button class="border border-slate-400 hover:border-slate-200 text-slate-400 hover:text-slate-400 font-bold py-2 px-4 rounded-full"
                  type="submit">Submit</button>

          { displayText }

        </div>

          
      </form>
    </div>
    );
};

export default Register;