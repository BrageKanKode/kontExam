import React from "react";
import {Link, withRouter} from 'react-router-dom'

export class AuctionBid extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: this.props.name ? this.props.name : "Can't get",
            description: this.props.description ? this.props.description : "Can't get",
            price: this.props.price ? this.props.price : "Can't get",
            available: this.props.available ? this.props.available : "Can't get",
            currentBid: this.props.currentBid ? this.props.currentBid : "Can't get",
            userId: this.props.userId ? this.props.userId : this.props.userId,
            auctionId: this.props.auctionId ? this.props.auctionId : "Can't get"
        };

        this.ok = this.props.ok ? this.props.ok : "Ok";
    }



    onFormSubmit = async (event) => {
        event.preventDefault();

        if(this.props.currentBid < this.state.currentBid){
            const completed = await this.props.okCallback(
                this.state.name,
                this.state.description,
                this.state.price,
                this.state.available,
                this.state.currentBid,
                this.state.userId,
                this.state.auctionId
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
        this.setState({currentBid: event.target.value})
    };


    render() {


        return (

            <div className="menuWrapper">

                Starting price: {this.props.price}
                <br/>
                Current bid: {this.props.currentBid}
                <br/>
                Your userId: {this.props.user.userId}
                <br/>
                AuctionId: {this.props.auctionId}


                <form onSubmit={this.onFormSubmit}>
                    <div className="inputDayOfWeek">Bid:</div>
                    <input
                        placeholder={"Must be higher"}

                        onChange={this.onPriceChange}
                        className="menuInput"
                        id="AuctionPrice"
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
