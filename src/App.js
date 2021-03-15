import "./App.css";
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebase.config";
import { useState } from "react";
import logo from "./image/logo2.png";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

function App() {
  const [newUser, setNewUser] = useState(false);
  console.log(newUser);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    rePassword: "",
    error: "",
    isSignIn: true,
    success: false,
    isLoggedIn: false,
    isNewUser: false,
    isSignOut: false,
  });

  var provider = new firebase.auth.GoogleAuthProvider();
  var fbProvider = new firebase.auth.FacebookAuthProvider();
  var ghProvider = new firebase.auth.GithubAuthProvider();
  const handleSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        var credential = result.credential;
        var token = credential.accessToken;
        var user = result.user;
        setUser(user);
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
      });
  };
  const handleFbSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(fbProvider)
      .then((result) => {
        var credential = result.credential;
        var user = result.user;
        var accessToken = credential.accessToken;
        setUser(user);
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        console.log("github error ", errorMessage, credential, email);
      });
  };
  const handleGitSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(ghProvider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        var token = credential.accessToken;

        // The signed-in user info.
        var user = result.user;
        // ...
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        console.log("github error ", errorMessage, credential, email);
        // ...
      });
  };

  const handleBlur = (e) => {
    let isValid = true;
    if (e.target.name === "email") {
      isValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.name === "password") {
      isValid = /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{7,}$/.test(e.target.value);
    }
    if (e.target.name === "rePassword") {
      isValid = /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{7,}$/.test(e.target.value);
    }
    if (isValid) {
      const userInfo = { ...user };
      userInfo[e.target.name] = [e.target.value];
      //setUser(userInfo);
      if (userInfo.password[0] === userInfo.rePassword[0]) {
        isValid = true;
      } else {
        const newErrors = { ...user };
        newErrors.error = "your password did not match";
        setUser(newErrors);
      }
      setUser(userInfo);
    }
  };
  const handleCreateUser = (e) => {
    e.preventDefault();
    if (user.email && user.password) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(user.email[0], user.password[0])
        .then((userCredential) => {
          const user = userCredential.user;
          const userInfo = { ...user };
          userInfo.isSignIn = false;
          userInfo.error = "";
          userInfo.success = true;
          // userInfo.newUser = true;
          setUser(userInfo);
          setNewUser(false);
        })
        .catch((error) => {
          // const errorCode = error.code;
          const signInError = { ...user };
          signInError.error = error.message;
          signInError.success = false;
          setUser(signInError);
          // const errorMessage =
          // console.log(errorCode, errorMessage);
        });
    }
  };
  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        // const userInfo = { ...user };
        const userInfo = {
          name: "",
          email: "",
          password: "",
          rePassword: "",
          error: "",
          success: false,
          isLoggedIn: false,
          isNewUser: false,
          isSignOut: true,
        };
        setUser(userInfo);
        // console.log(user);
      })
      .catch((error) => {
        const signOutError = { ...user };
        signOutError.error = error.message;
        setUser(signOutError);
      });
  };
  const handleLogin = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(user.email[0], user.password[0])
      .then((userCredential) => {
        var user = userCredential.user;
        const userInfo = { ...user };
        userInfo.error = "";
        userInfo.success = true;
        setUser(userInfo);
      })
      .catch((error) => {
        // const errorMessage = error.message;
        const loginError = { ...user };
        loginError.error = error.message;
        loginError.success = false;
        setUser(loginError);
      });
  };

  return (
    <div className="App">
      <button onClick={handleSignIn}>Sign In With Google</button>
      <br />
      <button onClick={handleFbSignIn}>Sign In With Facebook</button>
      <br />
      <button onClick={handleGitSignIn}>Sign In With GitHub</button>
      <br /> <br />
      {/* <h1>{user.displayName}</h1>
      <h2>{user.email}</h2>
      <img src={user.photoURL} alt="" /> */}
      <div className="login-area">
        <div className="logo">
          <img src={logo} alt="image" />
        </div>
        <form onSubmit={handleCreateUser}>
          {newUser && (
            <input className="input-field" type="text" placeholder="Name" />
          )}
          <br />
          <input
            onBlur={handleBlur}
            className="input-field"
            type="email"
            name="email"
            id=""
            placeholder="Email"
            required
          />
          <br />
          <input
            onBlur={handleBlur}
            className="input-field"
            type="password"
            name="password"
            id=""
            placeholder="Password"
            required
          />
          <br />
          {user.success && (
            <button onClick={handleLogin} className="submit-btn" type="submit">
              Login
            </button>
          )}

          {newUser && (
            <input
              onBlur={handleBlur}
              className="input-field"
              type="password"
              name="rePassword"
              id=""
              placeholder="Confirm Password"
              required
            />
          )}
          <br />
          {user.isSignIn ? (
            newUser ? (
              <input className="submit-btn" type="submit" value="Sign Up" />
            ) : (
              <button
                onClick={handleLogin}
                className="submit-btn"
                type="submit"
              >
                Login
              </button>
            )
          ) : (
            <button onClick={handleSignOut} className="submit-btn">
              Sign Out
            </button>
          )}

          <br />

          <br />

          {newUser ? (
            <label
              onClick={() => setNewUser(false)}
              className="label"
              htmlFor=""
            >
              you already have an account?
            </label>
          ) : user.success ? (
            <p style={{ color: "green" }}>
              User {newUser ? "Created " : "Logged In"} Successfully{" "}
            </p>
          ) : (
            <label
              onClick={() => setNewUser(true)}
              className="label"
              htmlFor=""
            >
              are you new?
            </label>
          )}
        </form>
        <p style={{ color: "red" }}>{user.error}</p>
        {user.isSignOut && (
          <p style={{ color: "red" }}>
            Sign Out Successful! you may leave now!!!!!!
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
