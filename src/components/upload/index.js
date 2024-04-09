import React, { Component } from "react";
import firebase, { usersRef, usersCollection, storage } from "../../utils/firebase";
import ListUploads from "./list";

class Upload extends Component {
    constructor(props) {
        super(props);

        this.pauseRef = React.createRef();
        this.resumeRef = React.createRef();
        this.cancelRef = React.createRef();

        this.state = {
            image: null,
            url: "",
            progress: 0,
        };
    }

    componentDidMount() {
        const imageRef = usersRef.child("johnwick.jpg");
        imageRef.getDownloadURL()
        .then( url => {
            console.log(url);
        })
        .catch( error => {
            switch(error.code){
                case 'storage/object-not-found':
                    console.log('Sorry image not found')
                    break;
                default:
                    console.log('sorry, an error occured')
            }
        });

        imageRef
            .getMetadata()
            .then((data) => {
                console.log(data);
            })
            .catch((e) => {
                console.log(e);
            });
    }

    handleUpload = (e) => {
        e.preventDefault();
        const { image } = this.state;
        const metadata = {
            customMetadata: {
                hello: "its me",
            },
        };

        const user = firebase.auth().currentUser;
        const uploadTask = storage.ref(`users/${user.uid}/${image.name}`).put(image, metadata);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                this.setState({ progress });

                switch (snapshot.state) {
                    case "error":
                        console.log("error");
                        break;
                    case "paused":
                        console.log("paused");
                        break;
                    case "running":
                        console.log("running");
                        break;
                    case "success":
                        console.log("success");
                        break;
                    default:
                        console.log(snapshot.state);
                }
            },
            (error) => {
                console.log(error);
                this.setState({ progress: 0 });
            },
            () => {
                console.log(uploadTask.snapshot.ref);
                console.log(uploadTask.snapshot.ref.bucket);
                console.log(uploadTask.snapshot.ref.fullPath);

                let getUser = firebase.auth().currentUser;
                usersCollection.doc(getUser.uid).update({
                    image: uploadTask.snapshot.ref.name,
                });

                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    console.log("FILE AVAILABLE AT", downloadURL);
                });
            },
        );

        this.pauseRef.current.addEventListener("click", () => {
            uploadTask.pause();
        });

        this.resumeRef.current.addEventListener("click", () => {
            uploadTask.resume();
        });

        this.cancelRef.current.addEventListener("click", () => {
            uploadTask.cancel();
        });
    };

    handleChange = (event) => {
        if (event.target.files[0]) {
            const image = event.target.files[0];
            this.setState({
                image,
            });
        }
    };

    render() {
        return (
            <>
                <form onSubmit={this.handleUpload}>
                    <progress value={this.state.progress} max="100" />
                    <div className="form-group">
                        <label>File</label>
                        <input className="form-control" type="file" onChange={this.handleChange} />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Upload file
                    </button>
                </form>

                <hr />

                <div className="form-group">
                    <button className="btn btn-primary" ref={this.pauseRef}>
                        PAUSE
                    </button>
                </div>

                <div className="form-group">
                    <button className="btn btn-primary" ref={this.resumeRef}>
                        RESUME
                    </button>
                </div>

                <div className="form-group">
                    <button className="btn btn-primary" ref={this.cancelRef}>
                        CANCEL
                    </button>
                </div>

                <hr />

                <ListUploads />
            </>
        );
    }
}

export default Upload;
