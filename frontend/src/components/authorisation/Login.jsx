import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

function Login(props){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loggedIn, setloggedIn] = useState(false);
    const [displayText, setDisplayText] = useState('');

    const navigate = useNavigate();

    const submit = async (e) => {
      e.preventDefault();

        const response = await fetch('http://localhost:8000/user/login/', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          credentials: 'include',
          body: JSON.stringify({
              email,
              password
          })
        });
        
        if (response.status == 200){
          
          setloggedIn(true);
          props.setDisplayName(email);
        }
        // Non approved users
        else{
          const content = await response.json();
          console.log(content)
          setDisplayText(content.detail);
        }
    }

    if(loggedIn){
      navigate("/");
    }

    return (
      <div class='mt-4 grid v-screen place-items-center'>
        <h1 className="h1 mb-4 ">Log in</h1> 
        <form class="w-full max-w-lg" onSubmit={submit}>
          <div class="flex flex-wrap -mx-4 mb-2">
            <div class="w-half ml-40">
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
            
          </div>


        <div class="flex flex-wrap -mx-4 mb-2">
          <div class="w-half ml-40 ">
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

export default Login;