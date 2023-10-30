import React from "react";
import { Button } from "react-bootstrap";
import { client } from "../../App";


function Logout(props){

    function submitLogout(e) {
        e.preventDefault();
        client.post(
          "/api/logout/",
          {withCredentials: true}
        ).then(function(res) {
            props.onLogin(false);
        }).catch(function(error) {
            
            console.log(error)
        });
      }

    return (
        <div>
            <form onSubmit={e => submitLogout(e)}>
                <Button type="submit" variant="light">Log out</Button>
            </form>
        </div>
    )
}

export default Logout;