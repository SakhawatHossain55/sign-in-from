import "./App.css";
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebase.config";
import { useState } from "react";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: "",
    email: "",
    password: "",
    photo: "",
  });
  const provider = new firebase.auth.GoogleAuthProvider();

  const handleSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((res) => {
        const { displayName, email, photoURL } = res.user;
        const isSignedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
        };
        setUser(isSignedInUser);
        console.log(displayName, email, photoURL);
        //
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        console.log(errorCode, errorMessage, email, credential);
      });
  };
  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        const signedOutUser = {
          isSignedIn: false,
          name: "",
          photo: "",
          email: "",
          error: '',
          success: false,
        };
        setUser(signedOutUser);
      })
      .catch((error) => {
        // An error happened.
      });
  };

  const handelBlur = (e) => {
    let isFieldValid = true;
    if (e.target.name === "email") {
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.name === "password") {
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber;
    }
    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  };
  const handelSubmit = (e) => {
    // console.log(user.email, user.password);
    if (user.email && user.password) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        
        .then(res => {
          const newUserInfo = {...user};
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
        })
        .catch((error) => {
          const newUserInfo = {...user};
          newUserInfo.error = error.message 
          newUserInfo.success = false;
          setUser(newUserInfo)
        });
    }
    e.preventDefault();
  };

  return (
    <div className="App">
      {user.isSignedIn && (
        <div>
          <p>Welcome, {user.name}</p>
          <p>Your Email : {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      )}
      {user.isSignedIn ? (
        <button onClick={handleSignOut}>Sign Out</button>
      ) : (
        <button onClick={handleSignIn}>Sign In</button>
      )}
      <h3>Our own Authentication</h3>
      {/* <p>Name : {user.name}</p>
      <p>Email : {user.email}</p>
      <p>Password : {user.password}</p> */}
      <form onSubmit={handelSubmit}>
        <input
          name="name"
          onBlur={handelBlur}
          type="text"
          placeholder="Your Name"
        />
        <br />
        <input
          placeholder="Email"
          type="text"
          name="email"
          onBlur={handelBlur}
          required
        />
        <br />
        <input
          type="password"
          onBlur={handelBlur}
          name="password"
          placeholder="Password"
          required
        />
        <br />
        <input type="submit" value="Submit" />
      </form>
      <p style={{color: 'red'}}>{user.error}</p>
      {
        user.success && <p style={{color: 'green'}}>User created successfully</p>
      }
    </div>
  );
}

export default App;

{
  /* <div className="container">
<form className="form">
  <>
    <p>Your Email</p>
    <input className="form-control" type="email" name="" placeholder="Email"/>
  </>
  <>
    <p>Password</p>
    <input className="form-control" type="password" placeholder="Password"/>
  </>
  <br/>
  <button variant="info" onClick={handleSignIn}>Sign In</button>
</form>
</div> */
}
