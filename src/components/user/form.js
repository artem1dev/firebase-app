import React, { Component } from "react";
import firebase, { usersCollection, functions } from "../../utils/firebase";

class LoginForm extends Component {
    state = {
        register: false,
        user: {
            email: "",
            password: "",
        },
    };

    handleForm = (e) => {
        e.preventDefault();
        const { email } = this.state.user;
        const { password } = this.state.user;

        if (this.state.register) {
            firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then((user) => {
                    this.handleStoreRegisterUser(user);
                    user.user.sendEmailVerification().then(() => {
                        console.log("mail sent");
                    });
                })
                .catch((e) => {
                    console.log(e);
                });
        } else {
            firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then((response) => {
                    console.log(response);
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    };

    changeHandler = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        this.setState((prevState) => ({
            user: {
                ...prevState.user,
                [name]: value,
            },
        }));
    };

    handleLogout = () => {
        firebase
            .auth()
            .signOut()
            .then(() => {
                console.log("Used logged out");
            });
    };

    handleGetUserInfo = () => {
        let getUser = firebase.auth().currentUser;
        if (getUser) {
            getUser.getIdTokenResult().then((res) => {
                console.log(res);
            });
        } else {
            console.log("NO USER");
        }
    };

    handleUpdateEmail = () => {
        let getUser = firebase.auth().currentUser;
        let credential = firebase.auth.EmailAuthProvider.credential("newemail@gmail.com", "testing123");

        if (getUser) {
            getUser.reauthenticateWithCredential(credential).then((res) => {
                getUser.updateEmail("steve@gmail.com");
            });
        }
    };

    handleUpdateProfile = () => {
        let getUser = firebase.auth().currentUser;
        if (getUser) {
            getUser
                .updateProfile({
                    displayName: "Steve",
                    photoURL: "https://jsjs.com/photo.jpeg",
                })
                .then(() => {
                    console.log(getUser);
                });
        }
    };

    handleStoreRegisterUser = (data) => {
        usersCollection
            .doc(data.user.uid)
            .set({
                email: data.user.email,
            })
            .then((data) => {
                console.log(data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    handleGoogleSignin = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase
            .auth()
            .signInWithPopup(provider)
            .then((result) => {
                this.handleStoreRegisterUser(result);
                console.log(result);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    handleCallabeFunction = () => {
        console.log("trigger");
        const addLog = functions.httpsCallable("addLog");

        addLog({
            message: "Hello this is a new message",
        }).then((response) => {
            console.log(response);
        });
    };

    render() {
        return (
            <>
                <form onSubmit={(e) => this.handleForm(e)}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            onChange={(e) => this.changeHandler(e)}
                        ></input>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            onChange={(e) => this.changeHandler(e)}
                        ></input>
                    </div>

                    <button type="submit" className="btn btn-primary">
                        {this.state.register ? "Register" : "Sign in"}
                    </button>
                </form>
                <hr />
                <button onClick={() => this.handleLogout()}>Logout</button>
                <hr />
                <button onClick={() => this.handleGetUserInfo()}>Ask about the user</button>
                <hr />
                <button onClick={() => this.handleUpdateEmail()}>Update user email</button>
                <hr />
                <button onClick={() => this.handleUpdateProfile()}>Update user profile</button>
                <hr />
                <button onClick={() => this.handleGoogleSignin()}>google sign in</button>
                <hr />
                <button onClick={() => this.handleCallabeFunction()}>TRIGGER CLOUD FUNCTIONssssssss</button>
            </>
        );
    }
}

export default LoginForm;
