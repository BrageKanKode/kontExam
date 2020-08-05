import React from "react";
import {Link, withRouter} from 'react-router-dom'

export class AuctionItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: this.props.name ? this.props.name : "",
            description: this.props.description ? this.props.description : "",
            price: this.props.price ? this.props.price : "",
            userId: this.props.user.userId ? this.props.user.userId : ""
        };

        this.ok = this.props.ok ? this.props.ok : "Ok";
    }



    onFormSubmit = async (event) => {
        event.preventDefault();

        const completed = await this.props.okCallback(
            this.state.name,
            this.state.description,
            this.state.price,
            this.state.userId
        );

        if(completed) {
            this.props.history.push('/Auctions');
        } else {
            alert("Failed to create new auction")
        }
    };


    onNameChange = (event) => {
        this.setState({name: event.target.value})
    };

    onDescriptionChange = (event) => {
        this.setState({description: event.target.value})
    };

    onPriceChange = (event) => {
        this.setState({price: event.target.value})
    };


    render() {

        return (

            <div className="menuWrapper">

                your userId: {this.state.userId}

                <form onSubmit={this.onFormSubmit}>
                    <div className="inputName">Name:</div>
                    <input
                        placeholder={"What are you selling?"}
                        value={this.state.name}
                        onChange={this.onNameChange}
                        className="menuInput"
                        id="auctionName"
                    />
                    <div className="inputDescription">Description:</div>
                    <input
                        placeholder={"Some info"}
                        value={this.state.description}
                        onChange={this.onDescriptionChange}
                        className="menuInput"
                        id="auctionDescription"
                    />
                    <div className="inputDayOfWeek">Starting price:</div>
                    <input
                        placeholder={"Starting price"}
                        value={this.state.price}
                        onChange={this.onPriceChange}
                        className="menuInput"
                        id="auctionPrice"
                    />


                    <button type="submit" className={"submitBtn"}>{this.ok}</button>
                    <Link to={"/auctions"}>
                        <button className={"btn"}>Cancel</button>
                    </Link>

                </form>

            </div>

        )
    }

}

export default withRouter(AuctionItem);
