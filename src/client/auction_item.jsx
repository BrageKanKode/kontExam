import React from "react";
import {Link, withRouter} from 'react-router-dom'

export class AuctionItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: this.props.name ? this.props.name : "",
            description: this.props.description ? this.props.description : "",
            price: this.props.price ? this.props.price : ""
        };

        this.ok = this.props.ok ? this.props.ok : "Ok";
    }



    onFormSubmit = async (event) => {
        event.preventDefault();

        const completed = await this.props.okCallback(
            this.state.name,
            this.state.description,
            this.state.price,
            //this.props.menuItemId
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


                <form onSubmit={this.onFormSubmit}>
                    <div className="inputName">Name:</div>
                    <input
                        placeholder={"Type the name od this menu item"}
                        value={this.state.name}
                        onChange={this.onNameChange}
                        className="menuInput"
                        id="menuItemName"
                    />
                    <div className="inputDescription">Description:</div>
                    <input
                        placeholder={"Type the description of this menu item"}
                        value={this.state.description}
                        onChange={this.onDescriptionChange}
                        className="menuInput"
                        id="menuItemDescription"
                    />
                    <div className="inputDayOfWeek">Price:</div>
                    <input
                        placeholder={"Type the description of this menu item"}
                        value={this.state.price}
                        onChange={this.onPriceChange}
                        className="menuInput"
                        id="menuItemDescription"
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
