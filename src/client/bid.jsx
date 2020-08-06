// https://github.com/arcuri82/web_development_and_api_design/blob/master/les07/server_client_together/src/client/edit.jsx
//This code is from the repository, but is refitted to fit the assignment
import React from "react";
import AuctionBid from "./auction_bid";

export class Bid extends React.Component {

    constructor(props) {
        super(props);


        this.state = {
            auctionItem: null,
            error: null
        };

        this.auctionId = new URLSearchParams(window.location.search).get("auctionId");

        if (this.auctionId === null){
            this.state.error = "Unspecified menuitem id";
        }
    }


    componentDidMount() {
        if (this.state.error === null){
            this.fetchAuction();
        }

        if(this.props.user) {
            this.props.fetchAndUpdateUserInfo();
        }
    }

    async fetchAuction(){

        const url = "/api/auctions/" + this.auctionId;

        let response;
        let payload;

        try {
            response = await fetch(url);
            payload = await response.json();
        } catch (err) {
            this.setState({
                error: "Error when retrieving auction item: " + err,
                auctionItem: null
            });
            return;
        }

        if (response.status === 200){
            this.setState({
                error: null,
                auctionItem: payload
            });
        } else {
            this.setState({
                error: "Issue with the HTTP connection: status code: " + response.status,
                auctionItem: null
            })
        }

    }


    onOk = async (name, description, price, available, currentBid, userId, id) => {
        const url = "/api/auctions/" + id;

        const payload = {name, description, price, available, currentBid, userId, id};

        let response;

        try {
            response = await fetch(url, {
                method: "put",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
        } catch (err) {
            return false;
        }

        return response.status === 204;
    };


    render() {
        const user = this.props.user;
        const loggedIn = user !== null && user !== undefined;

        if (this.state.error !== null){
            return (
                <div>
                    <p>Cannot edit Auction Item. {this.state.error}</p>
                </div>
            );
        }

        if (this.state.auctionItem === null){
            return (
                <p>Loading...</p>
            );
        }



        return (
            <div>
                {loggedIn ? (
                    <div>
                        <h3>Bid on the auction</h3>
                        <AuctionBid
                            name={this.state.auctionItem.name}
                            description={this.state.auctionItem.description}
                            price={this.state.auctionItem.price}
                            currentBid={this.state.auctionItem.currentBid}
                            available={this.state.auctionItem.available}
                            userId={this.state.auctionItem.userId}
                            auctionId={this.auctionId}
                            user={this.props.user}
                            ok={"Update"}
                            okCallback={this.onOk}
                        />
                    </div>
                ) : (
                    <div className="menuWrapper">
                        <h2>Failed to execute </h2>
                        <p>You need to log in or register</p>
                    </div>
                )}


            </div>
        );
    }

}