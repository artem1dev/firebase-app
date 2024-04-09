import React, { Component } from "react";
import { usersRef } from "../../utils/firebase";
import { Link } from "react-router-dom";

class ListUploads extends Component {
    state = {
        images: null,
    };

    componentDidMount() {
        this.handleGetAll();
    }

    handleGetAll() {
        usersRef.listAll().then((data) => {
            let imagesArray = [];
            data.items.forEach((itemRef) => {
                itemRef.getDownloadURL().then((url) => {
                    imagesArray.push({
                        name: itemRef.name,
                        link: url,
                    });

                    this.setState({ images: imagesArray });
                });
            });
        });
    }

    handleDelete(name) {
        usersRef
            .child(name)
            .delete()
            .then(() => {
                console.log("deleted");
                this.handleGetAll();
            });
    }

    render() {
        return (
            <>
                {this.state.images
                    ? this.state.images.map((item, i) => (
                          <div key={i}>
                              <strong>{item.name}</strong> -
                              <Link to={{ pathname: item.link }} target="_blank">
                                  OPEN IT
                              </Link>{" "}
                              -<div onClick={() => this.handleDelete(item.name)}>DELETE</div>
                          </div>
                      ))
                    : null}
            </>
        );
    }
}

export default ListUploads;
