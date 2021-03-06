import React, { useState, useEffect } from 'react'
import './login.css';
import axios from 'axios';
import GoogleLogin from 'react-google-login';
import Cookies from 'js-cookie';

function Login() {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [isStu, setIsStu] = useState(true);


    useEffect(() => {
        //check cookie seasion
        if (Cookies.get('token')) {
            WhoAmI(JSON.parse(Cookies.get('token')));// in this func i will go to another side(lecturer/student),if i come back here ,it means something wrong with refreshtoken
        }
        //check cookie of remeber me
        let rememberMe = (!Cookies.get('rememberMe')) ? { message: "" } : JSON.parse(Cookies.get('rememberMe'));
        if (rememberMe.message === "auth succesfull") {
            WhoAmI(rememberMe);// in this func i will go to another side(lecturer/student),if i come back here ,it means something wrong with refreshtoken
        } else {//we will remove this cookies because it contains wrong data
            Cookies.remove('rememberMe');
        }
    }, []);
    function WhoAmI(whichCookie) {

        axios.post('http://localhost:5000/student/areYouStudent', { RT: whichCookie.refreshToken })
            .then(res => {
                if (res.data.status === `yes`) {
                    window.location = '/student'
                } else {
                    axios.post('http://localhost:5000/lecturer/areYouLecturer', { RT: whichCookie.refreshToken })
                        .then(res => {
                            if (res.data.status === `yes`) {
                                window.location = '/lecturer'
                            }
                        })
                        .catch(err => { console.log(`error : ${err}`) })
                }
            })
            .catch(err => { console.log(`error : ${err}`) })
    }
    function checkPass() {
        document.querySelector('.warnings').style.display = "none";
        if ((document.querySelector('#pass').value.length < 7)) {
            setPass("validate your Password or must be at least 7 characters");
        }
        else
            setPass("");
    }
    function emailIsValid(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }
    function checkEmail() {
        document.querySelector('.warnings').style.display = "none";
        if (!(emailIsValid(document.querySelector('#email').value))) {
            setEmail("Invalid Email Address");
        }
        else
            setEmail("");
    }
    function checkLogin() {
        if (email === "" && pass === "" && dqs("email").value !== "" && dqs("pass").value !== "") {
            let user = { email: dqs("email").value, password: dqs("pass").value };
            if (isStu === true) {
                axios.post('http://localhost:5000/student/login', user)
                    .then(res => {
                        if (res.data.message === "auth succesfull") {
                            Cookies.set('token', JSON.stringify(res.data))
                            ifRememberMeChecked(res.data);
                            window.location = "/student";
                        } else {
                            displayErrorAfterSubmit();
                        }
                    })
                    .catch(err => console.log(err))
            } else {
                axios.post('http://localhost:5000/lecturer/login', user)
                    .then(res => {
                        if (res.data.message === "auth succesfull") {
                            Cookies.set('token', JSON.stringify(res.data))
                            ifRememberMeChecked(res.data);
                            window.location = "/lecturer";
                        } else {
                            displayErrorAfterSubmit();
                        }
                    })
                    .catch(err => console.log(err))
            }
        } else {
            displayErrorAfterSubmit();
        }
    }
    function dqs(ele) {
        return document.querySelector(`#${ele}`);
    }
    function displayErrorAfterSubmit() {
        let msg = "-invalid Email/Password";
        document.querySelector('.warnings').innerHTML = "<label style='color:red;'><strong>Error:</strong></label><br>"
            + msg + "<br>-Or Uncorrect Select ";
        document.querySelector('.warnings').style.display = "block";
    }
    function successLogin(response) {
        let user = { email: response.profileObj.email };
        if (isStu === true) {
            axios.post('http://localhost:5000/student/loginByGmail', user)
                .then(res => {
                    if (res.data.message === "auth succesfull") {
                        Cookies.set('token', JSON.stringify(res.data))
                        ifRememberMeChecked(res.data);
                        window.location = "/student";
                    } else {
                        displayErrorAfterSubmit();
                    }
                })
                .catch(err => console.log(err))
        } else {
            axios.post('http://localhost:5000/lecturer/loginByGmail', user)
                .then(res => {
                    if (res.data.message === "auth succesfull") {
                        Cookies.set('token', JSON.stringify(res.data))
                        ifRememberMeChecked(res.data);
                        window.location = "/lecturer";
                    } else {
                        displayErrorAfterSubmit();
                    }
                })
                .catch(err => console.log(err))
        }
    }
    function faildLogin() {
        displayErrorAfterSubmit()
    }
    function ifRememberMeChecked(resData){
        if (document.querySelector("#remeberinput").checked) {//for remeber me input
            document.cookie = `rememberMe=${JSON.stringify(resData)}; expires=${12 * 30 * 24 * 60 * 60 + 10 + new Date()}`;
        }
    }

    return (
        <div className="login-box">
            <h1>Login</h1>
            <div className="textbox">
                <i className="fa fa-envelope"></i>
                <input id="email" type="email" placeholder="Email" onChange={() => checkEmail()} required />
            </div>

            <div className="textbox">
                <i className="fas fa-lock"></i>
                <input id="pass" type="password" placeholder="Password" onChange={() => checkPass()} required />
            </div>
            <div className="remeberMe">
                <input type="checkbox" id="remeberinput" name="remeber" value="remeberMe" />
                <label for="remeberinput">Remeber Me</label><br />
            </div>
            <div>
                <label>Login As:</label>
            </div>
            <div className="labels">
                <label className="container" onClick={() => setIsStu(false)}>Lecturer
			<input type="radio" name="radio" />
                    <span className="checkmark"></span>
                </label>
                <label className="container" onClick={() => setIsStu(true)}>Student
			<input type="radio" defaultChecked={true} name="radio" />
                    <span className="checkmark"></span>
                </label>
            </div>
            <input type="button" className="btn" value="Sign in" onClick={() => checkLogin()} />
            <GoogleLogin
                clientId="344802893537-obhdbe9s407si0pvob5baov5trmreeqd.apps.googleusercontent.com"
                buttonText="Login With Gmail"
                onSuccess={(res) => successLogin(res)}
                onFailure={(res) => faildLogin(res)}
                cookiePolicy={"single_host_origin"}
                className="googlebtn" />
            <div className="warnings"></div>
            <div>{email}</div>
            <div>{pass}</div>
        </div>
    );
}

export default Login;

























    // function checkAccessToken(whoAmI) {
    //     let token = (JSON.parse(Cookies.get('token')));
    //     axios.post('http://localhost:5000/lecturer/checkAccessToken', { accessToken: token.accessToken })
    //         .then(res => {
    //             if (res.data.message === "auth succesfull") {//check if the access token that we had is not expire
    //                 return;
    //             } else {
    //                 if (res.data.message === "jwt expired") {//-notice : the acceess token expired,but doesn't attacked
    //                     axios.post('http://localhost:5000/lecturer/token', { refreshToken: token.refreshToken })
    //                         .then(res => {
    //                             if (res.data.accessToken !== "") {//if success generate a new access token
    //                                 token.accessToken = res.data.accessToken//update the old access token to new one
    //                                 Cookies.set('token', JSON.stringify(token))
    //                             } else {
    //                                 deleteCookieAndGoLogin();
    //                             }
    //                         })
    //                         .catch(err => { console.log("error with fetch") })
    //                 } else {//res.data.message will be malformed , been attacked
    //                     deleteCookieAndGoLogin();
    //                 }
    //             }
    //         })
    //         .catch(err => { console.log("error with fetch") });
    // }
    // function deleteCookieAndGoLogin() {
    //     Cookies.remove('token');
    //     window.location = '/';
    // }


        // function forRememberMe() {
    //     let checked = document.querySelector("#remeberinput").checked;
    //     // console.log(checked)
    //     if (checked)//checked must be true/false
    //     {
    //         let cookieObj = { message: "hello " };
    //         document.cookie = `rememberMe=${JSON.stringify(cookieObj)}; expires=${12 * 30 * 24 * 60 * 60 + 10 + new Date()}`;
    //         console.log(JSON.parse(Cookies.get('rememberMe')))
    //     } else {
    //         Cookies.remove('rememberMe');

    //         console.log(Cookies.get('rememberMe'));
    //     }
    // }