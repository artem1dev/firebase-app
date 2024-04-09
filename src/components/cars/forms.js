import React, { Component } from "react";
import { carsCollection, firebaseTimestamp } from "../../utils/firebase";

class Form extends Component {
    state = {
        brand: "",
        color: "",
        price: "",
        available: "",
    };

    componentDidMount() {
        carsCollection
            .doc("ACgZ0fJy8ntMqf1UHKzv")
            .get()
            .then((snapshot) => {
                if (!snapshot.exists) {
                    return console.log("sorry no record found");
                }
                console.log(snapshot.data());
            })
            .catch((e) => {
                console.log(e);
            });
    }

    handleForm = (e) => {
        e.preventDefault();
        carsCollection
            .doc()
            .set({
                ...this.state,
                available: this.state.available === "true" ? true : false,
                price: parseInt(this.state.price),
                createdAt: firebaseTimestamp(),
                dealers: {
                    virginia: true,
                    washington: false,
                    california: true,
                },
                tags: ["Good", "Confortable", "Expensive"],
            })
            .then((data) => {
                console.log(data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    changeHandler = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        this.setState({ [name]: value });
    };

    render() {
        return (
            <>
                <form onSubmit={(e) => this.handleForm(e)}>
                    <div className="form-group">
                        <label>Brand</label>
                        <input
                            type="text"
                            className="form-control"
                            name="brand"
                            onChange={(e) => this.changeHandler(e)}
                        ></input>
                    </div>

                    <div className="form-group">
                        <label>Color</label>
                        <input
                            type="text"
                            className="form-control"
                            name="color"
                            onChange={(e) => this.changeHandler(e)}
                        ></input>
                    </div>

                    <div className="form-group">
                        <label>Price</label>
                        <input
                            type="text"
                            className="form-control"
                            name="price"
                            onChange={(e) => this.changeHandler(e)}
                        ></input>
                    </div>

                    <div className="form-group">
                        <label>Available ?:</label>
                        <select className="form-control" name="available" onChange={(e) => this.changeHandler(e)}>
                            <option value="true">YES</option>
                            <option value="false">NO</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>
                </form>
                <hr />
            </>
        );
    }
}

export default Form;
