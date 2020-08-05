import React from "react";
import {Link, withRouter} from 'react-router-dom'

export class AuctionBid extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: this.props.name ? this.props.name : "hei",
            description: this.props.description ? this.props.description : "på deg",
            price: this.props.price ? this.props.price : "Can't get"
        };

        this.ok = this.props.ok ? this.props.ok : "Ok";
    }



    onFormSubmit = async (event) => {
        event.preventDefault();

        if(this.props.price < this.state.price){
            const completed = await this.props.okCallback(
                this.state.name,
                this.state.description,
                this.state.price,
                this.props.auctionId
            );

            if(completed) {
                this.props.history.push('/Auctions');
            } else {
                alert("Failed to bid")
            }
        } else {
            alert("Not high enough")
        }
    };


    onPriceChange = (event) => {
        this.setState({price: event.target.value})
    };


    render() {


        return (

            <div className="menuWrapper">

                Highest bid: {this.props.price}


                <form onSubmit={this.onFormSubmit}>
                    <div className="inputDayOfWeek">Bid:</div>
                    <input
                        placeholder={"Must be higher"}

                        onChange={this.onPriceChange}
                        className="menuInput"
                        id="AuctionDescription"
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

export default withRouter(AuctionBid);
