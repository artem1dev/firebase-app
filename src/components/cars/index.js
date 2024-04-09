import React, { Component } from "react";
import { firebaseLooper } from "../../utils/tools";
import { carsCollection } from "../../utils/firebase";
import Form from "./forms";

class Cars extends Component {
    state = {
        cars: null,
        start: 0,
        end: 100,
    };

    getAllTheCars() {
        carsCollection
            .where("available", "==", true)
            .orderBy("price")
            .startAt(this.state.start)
            .endBefore(this.state.end)
            .get()
            .then((snapshot) => {
                const cars = firebaseLooper(snapshot);
                this.setState({
                    cars,
                });
            });
    }

    componentDidMount() {
        this.getAllTheCars();
    }

    handleCarData = (cars) =>
        cars
            ? cars.map((data, i) => (
                  <tr key={i}>
                      <th>{data.id}</th>
                      <th>{data.brand}</th>
                      <th>{data.color}</th>
                      <th>{data.price}</th>
                  </tr>
              ))
            : null;

    sortResults(values) {
        this.setState(
            {
                start: values[0],
                end: values[1],
            },
            () => {
                this.getAllTheCars();
            },
        );
    }

    render() {
        return (
            <>
                <button onClick={() => this.sortResults([0, 100])}>0 - 100</button>
                <button onClick={() => this.sortResults([100, 200])}>100 - 200</button>
                <button onClick={() => this.sortResults([200, 1000])}>200 - 1000</button>

                <Form />
                <table className="table table-dark">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Brand</th>
                            <th>Color</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>{this.handleCarData(this.state.cars)}</tbody>
                </table>
            </>
        );
    }
}

export default Cars;
