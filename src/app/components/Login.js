import React, { useState } from "react";
import axios from "axios";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });
            const token = response.data.token;
            setToken(token);
            localStorage.setItem("token", token);


        } catch (error) {
            setError("Credenciales incorrectas.");
        }
    };



    //TODO: crear el componente de registro -> retun y al html
    return (
        <div>
            <h2>Iniciar sesion admin</h2>
            <form onAbort={handleLogin}>
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></input>

                </div>
                
                {/* input for password */}

                <div>

                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></input>
                </div>
                {error && <p>{error}</p>} 

                {/* button to submit the form */}

                <button type="submit">login</button>
            </form>
        </div>
    );
};
export default Login;